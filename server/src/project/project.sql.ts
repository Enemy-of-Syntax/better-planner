import { Injectable } from '@nestjs/common';
import { PROJECT_STATUS, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { v4 as uuidV4 } from 'uuid';
import { UpdateProjectDto } from './dto/update-project.dto';
@Injectable()
export class projectQuery {
    constructor(private readonly prisma: PrismaService) {}

    async findAllProjects() {
        return await this.prisma.$queryRaw(Prisma.sql`
        SELECT 
        public.projects.id,
        public.projects.name AS project_name,
        public.projects."imageId" AS project_image_id,
        public.files.name AS project_image_name,
        public.files.path AS project_image_path,
        public.projects.status AS project_status,
        array_agg(public.project_on_organizations.organization_id) AS organization_ids,
        public.users.id AS created_user_id,
        public.users.name AS created_user_name,
        public.projects.created_at,
        public.projects.updated_at

    FROM public.projects

    LEFT JOIN public.files ON public.projects."imageId" = public.files.id
    LEFT JOIN public.users ON public.projects."createdUserId" = public.users.id
    LEFT JOIN public.project_on_organizations ON public.projects.id = public.project_on_organizations.project_id
    
    GROUP BY
        public.projects.id,  
        public.projects.name,  
        public.projects."imageId",
        public.files.name,
        public.files.path,
        public.projects.status,
        public.users.id,
        public.users.name,
        public.projects.created_at,
        public.projects.updated_at;
        `);
    }

    async findSingleProject(id: string) {
        return await this.prisma.$queryRaw(Prisma.sql`
        SELECT 
        public.projects.id,
        public.projects.name AS project_name,
        public.projects."imageId" AS project_image_id,
        public.files.name AS project_image_name,
        public.files.path AS project_image_path,
        public.projects.status AS project_status,
        array_agg(public.project_on_organizations.organization_id) AS organization_ids,
        public.users.id AS created_user_id,
        public.users.name AS created_user_name,
        public.projects.created_at,
        public.projects.updated_at

    FROM public.projects

    LEFT JOIN public.files ON public.projects."imageId" = public.files.id
    LEFT JOIN public.users ON public.projects."createdUserId" = public.users.id
    LEFT JOIN public.project_on_organizations ON public.projects.id = public.project_on_organizations.project_id
    WHERE public.projects.id=${id}
    
    GROUP BY
        public.projects.id,  
        public.projects.name,  
        public.projects."imageId",
        public.files.name,
        public.files.path,
        public.projects.status,
        public.users.id,
        public.users.name,
        public.projects.created_at,
        public.projects.updated_at
    
        `);
    }

    async createNewProject(
        projectId: string,
        dto: CreateProjectDto,
        status: PROJECT_STATUS,
        imageId: string | null | undefined,
        createdUserId: string,
    ) {
        await this.prisma.$executeRaw`INSERT INTO public.projects
                            (id,name,"imageId",status,"createdUserId",created_at,updated_at)
                            VALUES(${projectId},${dto.name},${
            imageId && imageId
        },${status},${createdUserId},${new Date()},${new Date()})`;
        console.log(dto);
        for (let i = 0; i < dto.organizationId.length; i++) {
            const pivotId = await uuidV4();
            await this.prisma.$executeRaw`INSERT INTO public.project_on_organizations
            (id,organization_id,project_id,created_at,updated_at)
            VALUES(${pivotId},${
                dto.organizationId ? dto.organizationId[i] : ''
            },${projectId},${new Date()},${new Date()})`;
        }

        return await this.findSingleProject(projectId);
    }

    async findAllProjectsOnOrganization() {
        let result = await this.prisma.$queryRaw(
            Prisma.sql`SELECT * FROM public.projects_on_organizations`,
        );
    }

    async updateProject(
        id: string,
        dto: UpdateProjectDto,
        status: PROJECT_STATUS,
        imageId: string | null | undefined,
    ) {
        const existingProject: any = await this.findSingleProject(id);

        let updatedOrgidArr = [...existingProject[0].organization_ids];
        if (dto.organizationId) {
            for (let i = 0; i < dto.organizationId?.length; i++) {
                updatedOrgidArr.push(dto.organizationId[i]);
            }
        }
        let resultArr = [...new Set(updatedOrgidArr)];

        await this.prisma
            .$executeRaw`DELETE FROM public.project_on_organizations WHERE project_id=${id}`;

        for (let i = 0; i < resultArr.length; i++) {
            const pivotId = await uuidV4();
            await this.prisma.$executeRaw`INSERT INTO public.project_on_organizations
            (id,organization_id,project_id,created_at,updated_at)
            VALUES(${pivotId},${resultArr ? resultArr[i] : ''},${id},${new Date()},${new Date()})`;
        }

        await this.prisma.$executeRaw`UPDATE public.projects    
                                      SET name=${
                                          !dto.name || dto.name === ''
                                              ? existingProject[0].project_name
                                              : dto.name
                                      },
                                           status=${status},
                                           "imageId"=${imageId && imageId},
                                           updated_at=${new Date()}
                                      WHERE id=${id}`;

        return await this.findSingleProject(id);
    }

    async deleteProject(id: string) {
        return await this.prisma.$executeRaw`DELETE FROM public.projects WHERE id=${id}`;
    }
}

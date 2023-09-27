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
        public.projects.image_id AS project_image_id,
        public.files.name AS project_image_name,
        public.files.path AS project_image_path,
        public.projects.status AS project_status,
        public.organizations.id AS org_id,
        public.organizations.name AS org_name,
        public.users.id AS created_user_id,
        public.users.name AS created_user_name,
        public.projects.created_at,
        public.projects.updated_at

    FROM public.projects

    LEFT JOIN public.files ON public.projects.image_id = public.files.id
    LEFT JOIN public.users ON public.projects.created_user_id = public.users.id
    LEFT JOIN public.organizations ON public.projects.organization_id=public.organizations.id
        `);
    }

    async findSingleProject(id: string) {
        return await this.prisma.$queryRaw(Prisma.sql`
        SELECT 
        public.projects.id,
        public.projects.name AS project_name,
        public.projects.image_id AS project_image_id,
        public.files.name AS project_image_name,
        public.files.path AS project_image_path,
        public.projects.status AS project_status,
        public.organizations.id AS org_id,
        public.organizations.name AS org_name,
        public.users.id AS created_user_id,
        public.users.name AS created_user_name,
        public.projects.created_at,
        public.projects.updated_at

    FROM public.projects

    LEFT JOIN public.files ON public.projects.image_id = public.files.id
    LEFT JOIN public.users ON public.projects.created_user_id = public.users.id
    LEFT JOIN public.organizations ON public.projects.organization_id=public.organizations.id
    WHERE public.projects.id=${id}
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
                            (id,name,image_id,status,organization_id,created_user_id,created_at,updated_at)
                            VALUES(${projectId},${dto.name},${imageId && imageId},${status},${
            dto.organizationId
        },${createdUserId},${new Date()},${new Date()})`;

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

        await this.prisma.$executeRaw`UPDATE public.projects    
                                      SET name=${
                                          !dto.name || dto.name === ''
                                              ? existingProject[0].project_name
                                              : dto.name
                                      },
                                           organization_id=${
                                               !dto.organizationId || dto.organizationId === ''
                                                   ? existingProject[0].organization_id
                                                   : dto.organizationId
                                           },
                                           status=${status},
                                           image_id=${imageId && imageId},
                                           updated_at=${new Date()}
                                      WHERE id=${id}`;

        return await this.findSingleProject(id);
    }

    async deleteProject(id: string) {
        return await this.prisma.$executeRaw`DELETE FROM public.projects WHERE id=${id}`;
    }
}

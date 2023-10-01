import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
@Injectable()
export class projectQuery {
    constructor(private readonly prisma: PrismaService) {}

    async findAllProjects() {
        return await this.prisma.$queryRaw(Prisma.sql`
        SELECT 
        public.projects.id,
        public.projects.name AS project_name,
        public.projects.description AS project_description,
        public.projects.image_id AS project_image_id,
        public.files.name AS project_image_name,k
        public.files.path AS project_image_path,
        public.projects.status AS project_status,
        array_agg(public.boards.id) AS board_ids,
        public.users.id AS created_user_id,
        public.users.name AS created_user_name,
        public.projects.created_at,
        public.projects.updated_at

    FROM public.projects

    LEFT JOIN public.files ON public.projects.image_id = public.files.id
    LEFT JOIN public.users ON public.projects.created_user_id = public.users.id
    LEFT JOIN public.boards ON public.projects.id=public.boards.project_id

    GROUP BY 
    public.projects.id,
    public.projects.name,
    public.projects.description,
    public.projects.image_id,
    public.files.name,
    public.files.path,
    public.projects.status,
    public.users.id,
    public.users.name,
    public.projects.created_at,
    public.projects.updated_at
        `);
    }

    async findSingleProject(id: string) {
        return await this.prisma.$queryRaw(Prisma.sql`
        SELECT 
        public.projects.id,
        public.projects.name AS project_name,
        public.projects.description AS project_description,
        public.projects.image_id AS project_image_id,
        public.files.name AS project_image_name,
        public.files.path AS project_image_path,
        public.projects.status AS project_status,
        array_agg(public.boards.id) AS board_ids,
        public.users.id AS created_user_id,
        public.users.name AS created_user_name,
        public.projects.created_at,
        public.projects.updated_at

    FROM public.projects

    LEFT JOIN public.files ON public.projects.image_id = public.files.id
    LEFT JOIN public.users ON public.projects.created_user_id = public.users.id
    LEFT JOIN public.boards ON public.projects.id=public.boards.project_id

    WHERE public.projects.id=${id}

    GROUP BY 
    public.projects.id,
    public.projects.name,
    public.projects.description,
    public.projects.image_id,
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
        imageId: string | null | undefined,
        createdUserId: string,
    ) {
        await this.prisma.$executeRaw`INSERT INTO public.projects
                            (id,name,image_id,status,description,created_user_id,created_at,updated_at)
                            VALUES(${projectId},${dto.name},${imageId && imageId},${dto.status},${
            dto.description
        },${createdUserId},${new Date()},${new Date()})`;

        return await this.findSingleProject(projectId);
    }

    // async findAllProjectsOnOrganization() {
    //     let result = await this.prisma.$queryRaw(
    //         Prisma.sql`SELECT * FROM public.projects_on_organizations`,
    //     );
    // }

    async updateProject(id: string, dto: UpdateProjectDto, imageId: string | null | undefined) {
        const existingProject: any = await this.findSingleProject(id);

        await this.prisma.$executeRaw`UPDATE public.projects    
                                     SET   description=${
                                         dto.description === ''
                                             ? existingProject[0].project_description
                                             : dto.description
                                     }
                                           status=${dto.status},
                                           image_id=${imageId && imageId},
                                           updated_at=${new Date()}
                                      WHERE id=${id}`;

        return await this.findSingleProject(id);
    }

    async deleteProject(id: string) {
        return await this.prisma.$executeRaw`DELETE FROM public.projects WHERE id=${id}`;
    }
}

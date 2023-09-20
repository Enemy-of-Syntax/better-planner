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
        return await this.prisma.$queryRaw(Prisma.sql`SELECT * FROM public.projects`);
    }

    async findSingleProject(id: string) {
        return await this.prisma.$queryRaw(Prisma.sql`SELECT * FROM public.projects`);
    }

    async createNewProject(projectId: string, dto: CreateProjectDto, status: PROJECT_STATUS) {
        await this.prisma.$executeRaw`INSERT INTO public.projects
                            (id,name,status,created_at,updated_at)
                            VALUES(${projectId},${dto.name},${status},${new Date()},${new Date()})`;

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

    async updateProject(id: string, dto: UpdateProjectDto, status: PROJECT_STATUS) {
        await this.prisma.$executeRaw`UPDATE public.projects    
                                      SET name=${dto.name},
                                           status=${status},
                                           updated_at=${new Date()}
                                      WHERE id=${id}`;

        return await this.findSingleProject(id);
    }

    async deleteProject(id: string) {
        return await this.prisma.$executeRaw`DELETE FROM public.projects WHERE id=${id}`;
    }
}

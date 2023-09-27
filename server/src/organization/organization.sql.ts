import { Injectable } from '@nestjs/common';
import { ORGANIZATION_STATUS, Prisma, organization } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOrganizationDto, organizationDto } from './dto/organization.dto';

@Injectable()
export class organizationQuery {
    constructor(private readonly prisma: PrismaService) {}

    async findOrganizationById(id: string): Promise<organization[] | []> {
        return await this.prisma.$queryRaw(
            Prisma.sql`
            SELECT 
            public.organizations.id,
            public.organizations.name AS Org_name,
            public.organizations.image_id AS Org_image_id,
            public.files.name AS Org_image_name,
            public.files.path AS Org_img_path,
            public.organizations.status AS Org_status,
            array_agg(public.projects.id) AS Project_ids,
            array_agg(public.teams.id) AS Team_ids,
            public.users.id AS created_user_id,
            public.users.name AS created_user_name,
            public.organizations.created_at,
            public.organizations.updated_at

            FROM public.organizations

            LEFT JOIN public.files
            ON public.organizations.image_id=public.files.id
            LEFT JOIN public.users
            ON public.organizations.created_user_id=public.users.id
            LEFT JOIN public.projects
            ON public.organizations.id=public.projects.organization_id
            LEFT JOIN public.teams
            ON public.organizations.id=public.teams.organization_id
           
            WHERE public.organizations.id=${id}

            GROUP BY 
            public.organizations.id,
            public.organizations.name,
            public.organizations.image_id,
            public.files.name,
            public.files.path,
            public.organizations.status,
            public.users.id,
            public.users.name,
            public.organizations.created_at,
            public.organizations.updated_at
                  `,
        );
    }

    async findAllOrganizations(): Promise<any> {
        try {
            return await this.prisma.$queryRaw(
                Prisma.sql`
                SELECT 
                public.organizations.id,
                public.organizations.name AS Org_name,
                public.organizations.image_id AS Org_image_id,
                public.files.name AS Org_image_name,
                public.files.path AS Org_img_path,
                public.organizations.status AS Org_status,
                array_agg(public.projects.id) AS Project_ids,
                array_agg(public.teams.id) AS Team_ids,
                public.users.id AS created_user_id,
                public.users.name AS created_user_name,
                public.organizations.created_at,
                public.organizations.updated_at
    
                FROM public.organizations
    
                LEFT JOIN public.files
                ON public.organizations.image_id=public.files.id
                LEFT JOIN public.users
                ON public.organizations.created_user_id=public.users.id
                LEFT JOIN public.projects
                ON public.organizations.id=public.projects.organization_id
                LEFT JOIN public.teams
                ON public.organizations.id=public.teams.organization_id
    
                GROUP BY 
                public.organizations.id,
                public.organizations.name,
                public.organizations.image_id,
                public.files.name,
                public.files.path,
                public.organizations.status,
                public.users.id,
                public.users.name,
                public.organizations.created_at,
                public.organizations.updated_at
          `,
            );
        } catch (err) {
            console.log(err);
        }
    }

    async insertNewOrganization(
        id: string,
        dto: organizationDto,
        imageId: string | undefined | null,
        userId: string,
        status: ORGANIZATION_STATUS,
    ): Promise<any> {
        const newDate = new Date();
        await this.prisma.$executeRaw`INSERT INTO public.organizations
                    (id,name,status,image_id,created_user_id,created_at,updated_at) 
                     VALUES(${id},${dto.name},${status},${
            imageId && imageId
        },${userId},${newDate},${newDate}) `;

        return await this.findOrganizationById(id);
    }

    async updateOrganization(
        id: string,
        dto: UpdateOrganizationDto,
        status: ORGANIZATION_STATUS,
        imageId: string | undefined | '',
    ) {
        try {
            const existOrganization: any = await this.findOrganizationById(id);
            if (dto.name !== undefined || null || false) {
                const newDate = new Date();
                await this.prisma.$executeRaw`UPDATE public.organizations 
                                                            SET name=${
                                                                dto.name === ''
                                                                    ? existOrganization[0].org_name
                                                                    : dto.name
                                                            },
                                                                image_id=${
                                                                    imageId === ''
                                                                        ? existOrganization[0]
                                                                              .org_image_id
                                                                        : imageId
                                                                },
                                                                status=${status},
                                                                updated_at=${newDate}
                                                            WHERE id=${id}`;
                return await this.findOrganizationById(id);
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async deleteOrganization(id: string) {
        return await this.prisma.$executeRaw`DELETE FROM public.organizations WHERE id=${id}`;
    }
}

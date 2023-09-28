import { HttpException, Injectable } from '@nestjs/common';
import { Prisma, team } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTeam } from './dto/team.dto';
import { QueryService } from 'src/auth/auth.sql';
import { organizationQuery } from 'src/organization/organization.sql';

@Injectable()
export class TeamQuery {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authQuery: QueryService,
        private readonly orgQuery: organizationQuery,
    ) {}

    async findAllTeams() {
        return this.prisma.$queryRaw(Prisma.sql`
        SELECT 
        public.teams.id,
        public.teams.name AS team_name,
        public.teams.image_id AS team_image_id,
        public.files.name AS team_image_name,
        public.files.path AS team_image_path,
        public.teams.organization_id AS team_org_id,
        array_agg(public.members.id) AS member_ids,
        public.organizations.name AS team_org_name,
        public.organizations.status AS team_org_status,
        public.teams.created_user_id AS created_user_id,
        public.users.name AS created_user_name,
        public.teams.created_at,
        public.teams.updated_at

        FROM public.teams

        LEFT JOIN public.files ON public.teams.image_id = public.files.id
        LEFT JOIN public.users ON public.teams.created_user_id=public.users.id
        LEFT JOIN public.organizations ON public.teams.organization_id=public.organizations.id
        LEFT JOIN public.members ON public.teams.id=public.members.team_id

        GROUP BY
        public.teams.id,
        public.teams.name ,
        public.teams.image_id ,
        public.files.name,
        public.files.path,
        public.teams.organization_id ,
        public.organizations.name ,
        public.organizations.status,
        public.teams.created_user_id,
        public.users.name,
        public.teams.created_at,
        public.teams.updated_at
            `);
    }

    async findSingleTeam(id: string): Promise<team> {
        return this.prisma.$queryRaw(Prisma.sql`
        SELECT 
        public.teams.id,
        public.teams.name AS team_name,
        public.teams.image_id AS team_image_id,
        public.files.name AS team_image_name,
        public.files.path AS team_image_path,
        public.teams.organization_id AS team_org_id,
        array_agg(public.members.id) AS member_ids,
        public.organizations.name AS team_org_name,
        public.organizations.status AS team_org_status,
        public.teams.created_user_id AS created_user_id,
        public.users.name AS created_user_name,
        public.teams.created_at,
        public.teams.updated_at

        FROM public.teams

        LEFT JOIN public.files ON public.teams.image_id = public.files.id
        LEFT JOIN public.users ON public.teams.created_user_id=public.users.id
        LEFT JOIN public.organizations ON public.teams.organization_id=public.organizations.id
        LEFT JOIN public.members ON public.teams.id=public.members.team_id
        WHERE public.teams.id=${id}

        GROUP BY
        public.teams.id,
        public.teams.name ,
        public.teams.image_id ,
        public.files.name,
        public.files.path,
        public.teams.organization_id ,
        public.organizations.name ,
        public.organizations.status,
        public.teams.created_user_id,
        public.users.name,
        public.teams.created_at,
        public.teams.updated_at
        `);
    }

    async insertNewTeam({ id, name, organizationId, createdUserId, imageId }) {
        try {
            const newDate = new Date();

            await this.prisma.$executeRaw`INSERT INTO public.teams
            (id,name,image_id,organization_id,created_user_id,created_at,updated_at)
            VALUES (${id},${name},${
                imageId && imageId
            },${organizationId},${createdUserId},${newDate},${newDate})`;

            return await this.findSingleTeam(id);
        } catch (error) {
            throw error;
        }
    }

    // Update section
    async updateTeam(id: string, dto: UpdateTeam, imageId: string) {
        const existingTeam = await this.findSingleTeam(id);
        await this.prisma.$executeRaw`UPDATE public.teams   
                                      SET  name=${
                                          dto.name === '' ? existingTeam[0].team_name : dto.name
                                      },
                                           organization_id=${
                                               dto.organizationId === ''
                                                   ? existingTeam[0].team_org_id
                                                   : dto.organizationId
                                           },
                                           image_id=${imageId},
                                           updated_at=${new Date()}
                                     WHERE id=${id}
                                           `;
        return await this.findSingleTeam(id);
    }

    async deleteTeam(id: string) {
        return await this.prisma.$executeRaw`DELETE FROM public.teams WHERE id=${id}`.catch(
            (err) => err,
        );
    }
}

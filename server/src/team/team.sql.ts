import { HttpException, Injectable } from '@nestjs/common';
import { Prisma, team } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTeam, allTeamMemberDto } from './dto/team.dto';
import { QueryService } from 'src/auth/auth.sql';
import { organizationQuery } from 'src/organization/organization.sql';
import { Team } from 'src/@types/SqlReturnType';
import { ChangeMMTime } from 'libs/UTCtime';

@Injectable()
export class TeamQuery {
    constructor(private readonly prisma: PrismaService) {}

    async findAllTeams(): Promise<Team[]> {
        return await this.prisma.$queryRaw(Prisma.sql`
        SELECT 
        public.teams.id,
        public.teams.name AS team_name,
        public.teams.image_id AS team_image_id,
        public.files.name AS team_image_name,
        public.files.path AS team_image_path,
        array_agg(public.members.id) AS member_ids,
        public.teams.created_user_id AS created_user_id,
        public.users.email AS created_user_email,
        public.teams.created_at,
        public.teams.updated_at

        FROM public.teams

        LEFT JOIN public.files ON public.teams.image_id = public.files.id
        LEFT JOIN public.users ON public.teams.created_user_id=public.users.id
        LEFT JOIN public.members ON public.teams.id=public.members.team_id

        GROUP BY
        public.teams.id,
        public.teams.name ,
        public.teams.image_id ,
        public.files.name,
        public.files.path,
        public.teams.created_user_id,
        public.users.email,
        public.teams.created_at,
        public.teams.updated_at
            `);
    }

    async findSingleTeam(id: string): Promise<Team[]> {
        return this.prisma.$queryRaw(Prisma.sql`
        SELECT
        public.teams.id,
        public.teams.name AS team_name,
        public.teams.image_id AS team_image_id,
        public.files.name AS team_image_name,
        public.files.path AS team_image_path,
        public.teams.created_user_id AS created_user_id,
        public.users.email AS created_user_email,
        public.teams.created_at,
        public.teams.updated_at,
        (
            SELECT JSON_AGG(json_build_object(
                'id', m.id,
                'user_id', u2.id,
                'member_email', u2.email,
                'member_status', m.status,
                'member_team_id', m.team_id,
                'member_team_name', public.teams.name,
                'created_user_name', u1.name,
                'created_at', m.created_at,
                'updated_at', m.updated_at
            ))
            FROM public.members m
            LEFT JOIN public.users u1 ON m.created_user_id = u1.id
            LEFT JOIN public.users u2 ON m.user_id = u2.id
            WHERE m.team_id = public.teams.id
            GROUP BY m.team_id
        ) AS members

         FROM public.teams

         LEFT JOIN public.files ON public.teams.image_id = public.files.id
         LEFT JOIN public.users ON public.teams.created_user_id = public.users.id
         
         WHERE public.teams.id = ${id};
    
        `);
    }

    async findTeamMember(dto: allTeamMemberDto) {
        return await this.prisma.$queryRaw(Prisma.sql`
        SELECT
        m.id,
        u2.id AS user_id,
        u2.email AS member_email,
        m.status AS member_status,
        m.team_id AS member_team_id,
        public.teams.name AS member_team_name,
        u1.name AS created_user_name,
        m.created_at,
        m.updated_at
    FROM
        public.members m
    LEFT JOIN
        public.users u1 ON m.created_user_id = u1.id
    LEFT JOIN
        public.users u2 ON m.user_id = u2.id
    LEFT JOIN
        public.teams ON m.team_id=public.teams.id
    
    WHERE m.team_id =${dto.teamId}

            `);
    }

    async insertNewTeam({ id, name, createdUserId, imageId }): Promise<Team[]> {
        try {
            await this.prisma.$executeRaw`INSERT INTO public.teams
            (id,name,image_id,created_user_id,created_at,updated_at)
            VALUES (${id},${name},${
                imageId && imageId
            },${createdUserId},${await ChangeMMTime()},${await ChangeMMTime()})`;

            return await this.findSingleTeam(id);
        } catch (error) {
            throw error;
        }
    }

    // Update section
    async updateTeam(
        id: string,
        dto: UpdateTeam,
        imageId: string | null | undefined,
    ): Promise<Team[]> {
        try {
            const existingTeam = await this.findSingleTeam(id);
            await this.prisma.$executeRaw`UPDATE public.teams   
                                          SET  name=${
                                              dto.name === ''
                                                  ? existingTeam[0]?.team_name
                                                  : dto.name
                                          },
                                               image_id=${imageId},
                                               updated_at=${await ChangeMMTime()}
                                         WHERE id=${id}
                                               `;
            return await this.findSingleTeam(id);
        } catch (err) {
            throw err;
        }
    }

    async deleteTeam(id: string): Promise<number> {
        return await this.prisma.$executeRaw`DELETE FROM public.teams WHERE id=${id}`.catch(
            (err) => err,
        );
    }
}

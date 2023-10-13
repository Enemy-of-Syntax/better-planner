import { Injectable } from '@nestjs/common';
import { MEMBER_STATUS, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { TeamQuery } from 'src/team/team.sql';

@Injectable()
export class memberQuery {
    constructor(private readonly prisma: PrismaService, private readonly teamsql: TeamQuery) {}

    async getAllMembers() {
        return await this.prisma.$queryRaw(Prisma.sql`
        SELECT
        m.id,
        u2.id AS user_id,
        u2.name AS member_name,
        m.email AS member_email,
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
            `);
    }

    async getSingleMember(id: string) {
        return await this.prisma.$queryRaw(Prisma.sql`
        SELECT
        m.id,
        u2.name AS member_name,
        u1.id AS user_id,
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
    WHERE m.id=${id}
        `);
    }

    async findMemberByUserId(userId: string) {
        return await this.prisma.$queryRaw(
            Prisma.sql`SELECT * FROM public.members WHERE user_id=${userId}`,
        );
    }

    async createMember(id: string, dto: CreateMemberDto, status: MEMBER_STATUS, teamId: string) {
        const team = await this.teamsql.findSingleTeam(teamId);
        const userId = team[0]?.created_user_id;
        await this.prisma.$executeRaw`INSERT INTO public.members 
                                      (id,team_id,user_id,status,created_user_id,created_at,updated_at)
                                      VALUES (${id},${dto.teamId},${
            dto.userId
        },${status},${userId},${new Date()},${new Date()})`;

        return await this.getSingleMember(id);
    }

    async updateMember(id: string, dto: UpdateMemberDto, status: MEMBER_STATUS) {
        const existingMember: any = await this.getSingleMember(id);
        await this.prisma.$executeRaw`UPDATE public.members 
                                             SET team_id=${
                                                 dto.teamId === ''
                                                     ? existingMember[0].member_team_id
                                                     : dto.teamId
                                             },
                                                  user_id=${
                                                      dto.userId === ''
                                                          ? existingMember[0].user_id
                                                          : dto.userId
                                                  },
                                                 
                                                  status=${status}
                                    WHERE id = ${id}
                                    `;

        return await this.getSingleMember(id);
    }

    async deleteMember(id: string) {
        await this.prisma.$executeRaw`DELETE FROM public.members WHERE id=${id}`;
    }
}

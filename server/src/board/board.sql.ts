import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { boardDto } from './dto/board.dto';
import { ChangeMMTime } from 'libs/UTCtime';

@Injectable()
export class BoardSql {
    constructor(private readonly prisma: PrismaService) {}
    async getAllBoards() {
        return await this.prisma.$queryRaw(Prisma.sql`
        SELECT 
        public.boards.id,
        public.boards.name AS board_name,
        public.boards.team_id AS team_id,
        public.teams.name AS team_name,
        public.boards.project_id AS project_id,
        public.projects.name AS project_name,
        public.users.name AS created_user_name,
        public.boards.created_user_id,
        public.boards.created_at,
        public.boards.updated_at,

        (
            SELECT JSON_AGG(public.tasks.*)
            FROM public.tasks 
            WHERE public.tasks.board_id = public.boards.id 
        ) AS tasks

    FROM public.boards

    LEFT JOIN public.teams ON public.boards.team_id = public.teams.id
    LEFT JOIN public.users ON public.boards.created_user_id = public.users.id
    LEFT JOIN public.projects ON public.boards.project_id = public.projects.id

    GROUP BY
        public.boards.id,
        public.boards.name,
        public.boards.team_id,
        public.teams.name,
        public.boards.project_id,
        public.projects.name,
        public.users.name,
        public.boards.created_user_id,
        public.boards.created_at,
        public.boards.updated_at;
            `);
    }

    async getSingleBoard(id: string) {
        return await this.prisma.$queryRaw(
            Prisma.sql`
            SELECT 
            public.boards.id,
            public.boards.name AS board_name,
            public.boards.team_id AS team_id,
            public.teams.name AS team_name,
            public.boards.project_id AS project_id,
            public.projects.name AS project_name,
            public.users.name AS created_user_name,
            public.boards.created_user_id,
            public.boards.created_at,
            public.boards.updated_at,
    
            (
                SELECT JSON_AGG(public.tasks.*)
                FROM public.tasks 
                WHERE public.tasks.board_id = public.boards.id 
            ) AS tasks
    
        FROM public.boards
    
        LEFT JOIN public.teams ON public.boards.team_id = public.teams.id
        LEFT JOIN public.users ON public.boards.created_user_id = public.users.id
        LEFT JOIN public.projects ON public.boards.project_id = public.projects.id
        WHERE public.boards.id=${id}
    
        GROUP BY
            public.boards.id,
            public.boards.name,
            public.boards.team_id,
            public.teams.name,
            public.boards.project_id,
            public.projects.name,
            public.users.name,
            public.boards.created_user_id,
            public.boards.created_at,
            public.boards.updated_at;
            `,
        );
    }

    async createBoard(id: string, dto: boardDto, userId: string) {
        await this.prisma.$executeRaw`INSERT INTO public.boards 
                               (id,name,team_id,project_id,created_user_id,created_at,updated_at)
                               VALUES(${id},${dto.name},${dto.teamId},${
            dto.project_id
        },${userId},${await ChangeMMTime()},${await ChangeMMTime()})`;

        return this.getSingleBoard(id);
    }

    async updateBoard(id: string, dto: boardDto) {
        const existingBoard: any = await this.getSingleBoard(id);
        await this.prisma.$executeRaw`UPDATE public.boards
                                    SET name=${
                                        !dto.name || dto.name === ''
                                            ? existingBoard[0].board_name
                                            : dto.name
                                    },
                                     updated_at=${await ChangeMMTime()}  
                                    WHERE id=${id}`;

        return this.getSingleBoard(id);
    }

    async deleteBoard(id: string) {
        return await this.prisma.$executeRaw`DELETE FROM public.boards WHERE id=${id}`;
    }
}

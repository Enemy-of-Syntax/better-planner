import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { boardDto } from './dto/board.dto';

@Injectable()
export class BoardSql {
    constructor(private readonly prisma: PrismaService) {}
    async getAllBoards() {
        return await this.prisma.$queryRaw(Prisma.sql`
            SELECT 
            public.boards.id,
            public.boards.name AS board_name,
            public.users.name AS created_user_name
            FROM public.boards

            LEFT JOIN public.users ON public.boards.created_user_id=public.users.id
            `);
    }

    async getSingleBoard(id: string) {
        return await this.prisma.$queryRaw(
            Prisma.sql`
            SELECT 
            public.boards.id,
            public.boards.name AS board_name,
            public.users.name AS created_user_name
            FROM public.boards

            LEFT JOIN public.users ON public.boards.created_user_id=public.users.id
            WHERE public.boards.id=${id}`,
        );
    }

    async createBoard(id: string, dto: boardDto, userId: string) {
        await this.prisma.$executeRaw`INSERT INTO public.boards 
                               (id,name,team_id,project_id,created_user_id,created_at,updated_at)
                               VALUES(${id},${dto.name},${dto.teamId},${
            dto.project_id
        },${userId},${new Date()},${new Date()})`;

        return this.getSingleBoard(id);
    }

    async updateBoard(id: string, dto: boardDto) {
        const existingBoard: any = await this.getSingleBoard(id);
        console.log(id, dto);
        await this.prisma.$executeRaw`UPDATE public.boards
                                    SET name=${
                                        !dto.name || dto.name === ''
                                            ? existingBoard[0].board_name
                                            : dto.name
                                    }
                                       
                                    WHERE id=${id}`;

        return this.getSingleBoard(id);
    }

    async deleteBoard(id: string) {
        return await this.prisma.$executeRaw`DELETE FROM public.boards WHERE id=${id}`;
    }
}

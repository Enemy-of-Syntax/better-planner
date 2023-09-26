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
            public.boards.organization_id AS board_organization_id,
            public.organizations.name AS board_organization_name,
            public.organizations."createdUserId" AS created_user_id,
            public.users.name AS created_user_name,
            public.organizations.created_at,
            public.organizations.updated_at
            
            FROM public.boards

            LEFT JOIN public.organizations ON public.boards.organization_id=public.organizations.id
            LEFT JOIN public.users ON public.boards."createdUserId"=public.users.id
            `);
    }

    async getSingleBoard(id: string) {
        return await this.prisma.$queryRaw(
            Prisma.sql`SELECT 
            public.boards.id,
            public.boards.name AS board_name,
            public.boards.organization_id AS board_organization_id,
            public.organizations.name AS board_organization_name,
            public.organizations."createdUserId" AS created_user_id,
            public.users.name AS created_user_name,
            public.organizations.created_at,
            public.organizations.updated_at
            
            FROM public.boards

            LEFT JOIN public.organizations ON public.boards.organization_id=public.organizations.id
            LEFT JOIN public.users ON public.boards."createdUserId"=public.users.id
            WHERE public.boards.id=${id}`,
        );
    }

    async createBoard(id: string, dto: boardDto, userId: string) {
        await this.prisma.$executeRaw`INSERT INTO public.boards 
                               (id,name,organization_id,"createdUserId",created_at,updated_at)
                               VALUES(${id},${dto.name},${
            dto.organizationId
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
                                    },
                                        organization_id=${
                                            !dto.organizationId || dto.organizationId === ''
                                                ? existingBoard[0].board_organization_id
                                                : dto.organizationId
                                        }
                                    WHERE id=${id}`;

        return this.getSingleBoard(id);
    }

    async deleteBoard(id: string) {
        return await this.prisma.$executeRaw`DELETE FROM public.boards WHERE id=${id}`;
    }
}

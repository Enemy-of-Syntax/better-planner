import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { boardDto } from './dto/board.dto';

@Injectable()
export class BoardSql {
    constructor(private readonly prisma: PrismaService) {}
    async getAllBoards() {
        return await this.prisma.$queryRaw(Prisma.sql`SELECT * FROM public.boards`);
    }

    async getSingleBoard(id: string) {
        return await this.prisma.$queryRaw(
            Prisma.sql`SELECT * FROM public.boards
                        WHERE public.boards.id=${id}`,
        );
    }

    async createBoard(id: string, dto: boardDto) {
        await this.prisma.$executeRaw`INSERT INTO public.boards 
                               (id,name,organization_id,created_at,updated_at)
                               VALUES(${id},${dto.name},${
            dto.organizationId
        },${new Date()},${new Date()})`;

        return this.getSingleBoard(id);
    }

    async updateBoard(id: string, dto: boardDto) {
        await this.prisma.$executeRaw`UPDATE public.boards
                                    SET name=${dto.name},
                                        organization_id=${dto.organizationId}
                                    WHERE id=${id}`;

        return this.getSingleBoard(id);
    }

    async deleteBoard(id: string) {
        return await this.prisma.$executeRaw`DELETE FROM public.boards WHERE id=${id}`;
    }
}

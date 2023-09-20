import { Injectable } from '@nestjs/common';
import { MEMBER_STATUS, MEMBER_ROLE, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class memberQuery {
    constructor(private readonly prisma: PrismaService) {}

    async getAllMembers() {
        return await this.prisma.$queryRaw(Prisma.sql`SELECT * FROM public.members`);
    }

    async getSingleMember(id: string) {
        return await this.prisma.$queryRaw(Prisma.sql`SELECT * FROM public.members WHERE id=${id}`);
    }

    async findMemberByUserId(userId: string) {
        return await this.prisma.$queryRaw(
            Prisma.sql`SELECT * FROM public.members WHERE user_id=${userId}`,
        );
    }

    async createMember(id: string, dto: CreateMemberDto, status: MEMBER_STATUS, role: MEMBER_ROLE) {
        await this.prisma.$executeRaw`INSERT INTO public.members 
                                      (id,team_id,user_id,role,status)
                                      VALUES (${id},${dto.teamId},${dto.userId},${role},${status})`;

        return await this.getSingleMember(id);
    }

    async updateMember(id: string, dto: UpdateMemberDto, status: MEMBER_STATUS, role: MEMBER_ROLE) {
        await this.prisma.$executeRaw`UPDATE public.members 
                                             SET team_id=${dto.teamId},
                                                  user_id=${dto.userId},
                                                  role=${role},
                                                  status=${status}
                                    WHERE id = ${id}
                                    `;

        return await this.getSingleMember(id);
    }

    async deleteMember(id: string) {
        await this.prisma.$executeRaw`DELETE FROM public.members WHERE id=${id}`;
    }
}

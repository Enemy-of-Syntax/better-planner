import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { memberQuery } from './member.sql';

@Module({
    controllers: [MemberController],
    providers: [MemberService, PrismaService, memberQuery],
})
export class MemberModule {}

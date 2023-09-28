import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { memberQuery } from './member.sql';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { TeamQuery } from 'src/team/team.sql';
import { QueryService } from 'src/auth/auth.sql';
import { organizationQuery } from 'src/organization/organization.sql';

@Module({
    controllers: [MemberController],
    providers: [
        MemberService,
        PrismaService,
        memberQuery,
        JwtService,
        TeamQuery,
        QueryService,
        organizationQuery,
    ],
})
export class MemberModule {}

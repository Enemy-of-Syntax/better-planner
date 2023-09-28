import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { QueryService } from './auth.sql';
import { MemberService } from 'src/member/member.service';
import { memberQuery } from 'src/member/member.sql';
import { TeamQuery } from 'src/team/team.sql';
import { organizationQuery } from 'src/organization/organization.sql';
import EmailService from 'libs/mailservice';

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        PrismaService,
        JwtService,
        QueryService,
        memberQuery,
        MemberService,
        TeamQuery,
        organizationQuery,
        EmailService,
    ],
})
export class AuthModule {}

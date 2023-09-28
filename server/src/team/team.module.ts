import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeamQuery } from './team.sql';
import { QueryService } from 'src/auth/auth.sql';
import { organizationQuery } from 'src/organization/organization.sql';
import { JwtService } from '@nestjs/jwt';
import EmailService from 'libs/mailservice';
import { AuthService } from 'src/auth/auth.service';

@Module({
    controllers: [TeamController],
    providers: [
        TeamService,
        PrismaService,
        TeamQuery,
        QueryService,
        organizationQuery,
        JwtService,
        EmailService,
    ],
})
export class TeamModule {}

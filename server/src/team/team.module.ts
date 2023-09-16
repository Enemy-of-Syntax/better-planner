import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeamQuery } from './team.sql';
import { QueryServie } from 'src/auth/auth.sql';
import { organizationQuery } from 'src/organization/organization.sql';

@Module({
  controllers: [TeamController],
  providers: [
    TeamService,
    PrismaService,
    TeamQuery,
    QueryServie,
    organizationQuery,
  ],
})
export class TeamModule {}

import { Module } from '@nestjs/common';
import { organizationQuery } from './organization.sql';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  providers: [organizationQuery, PrismaService, OrganizationService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}

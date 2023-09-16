import { Module } from '@nestjs/common';
import { organizationQuery } from './organization.sql';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [organizationQuery, PrismaService],
})
export class OrganizationModule {}

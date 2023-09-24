import { Module } from '@nestjs/common';
import { organizationQuery } from './organization.sql';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { QueryService } from 'src/auth/auth.sql';
import { JwtService } from '@nestjs/jwt';

@Module({
    providers: [organizationQuery, PrismaService, OrganizationService, QueryService, JwtService],
    controllers: [OrganizationController],
})
export class OrganizationModule {}

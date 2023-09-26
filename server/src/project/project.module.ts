import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { projectQuery } from './project.sql';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { QueryService } from 'src/auth/auth.sql';

@Module({
    controllers: [ProjectController],
    providers: [ProjectService, projectQuery, PrismaService, JwtService, QueryService],
})
export class ProjectModule {}

import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { projectQuery } from './project.sql';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [ProjectController],
    providers: [ProjectService, projectQuery, PrismaService],
})
export class ProjectModule {}

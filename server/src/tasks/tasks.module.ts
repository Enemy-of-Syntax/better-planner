import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskSqlService } from './tasks.sql';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryService } from 'src/auth/auth.sql';

@Module({
    controllers: [TasksController],
    providers: [TasksService, TaskSqlService, PrismaService, QueryService],
})
export class TasksModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';
import { OrganizationModule } from './organization/organization.module';
import { MemberModule } from './member/member.module';
import { ProjectModule } from './project/project.module';
import { BoardModule } from './board/board.module';
import { MulterModule } from '@nestjs/platform-express';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
    imports: [
        AuthModule,
        PrismaModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MulterModule.register({
            dest: './uploads',
        }),
        ScheduleModule.forRoot(),
        TeamModule,
        OrganizationModule,
        MemberModule,
        ProjectModule,
        BoardModule,
        TasksModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

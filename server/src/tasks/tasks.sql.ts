import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ChangeMMTime } from 'libs/UTCtime';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskSqlService {
    constructor(private prisma: PrismaService) {}

    async findAllTasksByBoardId(id: string) {
        return await this.prisma.$queryRaw(
            Prisma.sql`
            SELECT 
            public.tasks.id,
            public.tasks.title,
            public.tasks.description,
            public.tasks.status,
            public.tasks.board_id,
            public.boards.name AS board_name,
            public.boards.team_id,
            public.boards.project_id,
            public.labels.color AS label_color,
            public.labels.title AS label_title,
            public.tasks.start_date,
            public.tasks.due_date,
            public.tasks.created_user_id,
            public.tasks.created_at,
            public.tasks.updated_at

            FROM 

            public.tasks

            LEFT JOIN public.labels ON public.tasks.id=public.labels.task_id
            LEFT JOIN public.files  ON public.tasks.id=public.files.task_id
            LEFT JOIN public.boards ON public.tasks.board_id=public.boards.id

            WHERE public.boards.id = ${id}
      `,
        );
    }

    async findSingleTask(id: string) {
        return await this.prisma.$queryRaw(
            Prisma.sql`
            SELECT 
            public.tasks.id,
            public.tasks.title,
            public.tasks.description,
            public.tasks.status,
            public.tasks.board_id,
            public.boards.name,
            public.boards.team_id,
            public.boards.project_id,
            array_agg(public.labels.id) AS label_ids,
            array_agg(public.labels.color) As label_colors,
            public.tasks.start_date,
            public.tasks.due_date,
            public.tasks.created_user_id,
            public.tasks.created_at,
            public.tasks.updated_at

            FROM 

            public.tasks

            LEFT JOIN public.labels ON public.tasks.id=public.labels.task_id
            LEFT JOIN public.files  ON public.tasks.id=public.files.task_id
            LEFT JOIN public.boards ON public.tasks.board_id=public.boards.id

            WHERE public.tasks.id = ${id}

            GROUP BY 
            public.tasks.id,
            public.tasks.title,
            public.tasks.description,
            public.tasks.board_id,
            public.boards.name,
            public.boards.team_id,
            public.boards.project_id,
            public.tasks.start_date,
            public.tasks.due_date,
            public.tasks.created_user_id,
            public.tasks.created_at,
            public.tasks.updated_at
      `,
        );
    }

    async InsertNewTask({
        id,
        title,
        description,
        status,
        boardId,
        startDate,
        dueDate,
        createdUserId,
    }) {
        const localTime = await ChangeMMTime();
        console.log(localTime);
        await this.prisma.$executeRaw`INSERT INTO public.tasks 
                                      (id,title,description,status,board_id,start_date,due_date,created_user_id,created_at,updated_at)
                                      VALUES (${id},${title},${description},${status},${boardId},${startDate},${dueDate},${createdUserId},${localTime},${localTime})
                                      `;
        return await this.findSingleTask(id);
    }
}

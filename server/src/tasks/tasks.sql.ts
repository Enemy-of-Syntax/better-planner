import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export class TaskSqlService {
    constructor(private prisma: PrismaService) {}

    async findAllTasksByBoardId(id: string) {
        return await this.prisma.$queryRaw(
            Prisma.sql`
            SELECT 

            FROM 
            public.tasks
            LEFT JOIN public.labels ON public.tasks.id=public.labels.task_id
            LEFT JOIN public.files  ON public.tasks.id=public.files.task_id
      `,
        );
    }
}

import { HttpException, Injectable } from '@nestjs/common';
import { CreateTaskDto, allTasksSingleBoardDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskSqlService } from './tasks.sql';
import { v4 as uuidV4 } from 'uuid';
import { Responser } from 'libs/Responser';
import { QueryService } from 'src/auth/auth.sql';
import { ChangeMMTime } from 'libs/UTCtime';
import { Cron, CronExpression } from '@nestjs/schedule';

interface Image {
    id: string;
    name: string;
    path: string;
}
@Injectable()
export class TasksService {
    constructor(private readonly taskSql: TaskSqlService, readonly authsql: QueryService) {}
    async create(dto: CreateTaskDto, Images?: Express.Multer.File[]) {
        try {
            const newTask: any = await this.taskSql.InsertNewTask({
                id: await uuidV4(),
                title: dto.title,
                description: dto.description,
                boardId: dto.boardId,
                startDate: await ChangeMMTime(dto.startDate),
                dueDate: await ChangeMMTime(dto.endDate),
                status: dto.status,
                createdUserId: dto.createdUserId,
            });
            if (!newTask || newTask.length === 0) throw new Error();

            if (Images?.length) {
                for (let i = 0; i < Images?.length; i++)
                    await this.authsql.insertPhoto({
                        name: Images[i]?.filename,
                        path: Images[i]?.path,
                    });
            }

            await this.taskSql.addMembersOnTask(dto.membersId, newTask.id);

            return Responser({
                statusCode: 200,
                message: 'new task created successfully!',
                devMessage: 'new task created successfully',
                body: newTask,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'failed to create new task',
                    devMessage: err.message || '',
                },
                400,
            );
        }
    }

    async findAll(dto: allTasksSingleBoardDto) {
        try {
            const allTasksSingleBoard = await this.taskSql.findAllTasksByBoardId(dto.boardId);
            return Responser({
                statusCode: 200,
                message: 'successfully fetched tasks list',
                devMessage: 'successfully fetched tasks list',
                body: allTasksSingleBoard,
            });
        } catch (error: any) {
            throw new HttpException(
                {
                    message: 'Failed to fetched tasks list',
                    devMessage: error.message || '',
                },
                404,
            );
        }
    }

    findOne(id: number) {
        return `This action returns a #${id} task`;
    }

    @Cron(CronExpression.EVERY_12_HOURS)
    update(id: string, updateTaskDto: UpdateTaskDto) {
        const {} = updateTaskDto;

        try {
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Failed to update date',
                    devMessage: err.message || '',
                },
                400,
            );
        }
    }

    remove(id: number) {
        return `This action removes a #${id} task`;
    }
}

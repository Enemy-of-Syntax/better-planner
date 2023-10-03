import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { fileStorage } from 'libs/file-storage';

@Controller('tasks')
@ApiTags('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @ApiOperation({ summary: 'create new task' })
    @ApiBody({
        description: 'create new task',
        type: CreateTaskDto,
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FilesInterceptor('images', 10, fileStorage))
    @Post('create')
    create(@Body() createTaskDto: CreateTaskDto, @UploadedFiles() images?: Express.Multer.File[]) {
        return this.tasksService.create(createTaskDto, images);
    }

    @Get()
    findAllTasksByBoardId() {
        return this.tasksService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tasksService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
        return this.tasksService.update(+id, updateTaskDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tasksService.remove(+id);
    }
}

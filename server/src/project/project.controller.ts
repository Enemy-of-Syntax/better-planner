import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PROJECT_STATUS } from '@prisma/client';

@Controller('project')
@ApiTags('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @ApiResponse({ status: 201, description: 'new project created' })
    @ApiResponse({ status: 400, description: 'bad request' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @ApiBody({ type: CreateProjectDto, description: 'project create' })
    @Post('create')
    @ApiQuery({ name: 'status', enum: PROJECT_STATUS })
    create(
        @Body() createProjectDto: CreateProjectDto,
        @Query('status') status: PROJECT_STATUS = PROJECT_STATUS.ONGOING,
    ) {
        return this.projectService.create(createProjectDto, status);
    }

    @ApiResponse({ status: 200, description: 'fetched all projects success' })
    @ApiResponse({ status: 404, description: 'not found' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @Get('getAll')
    findAll() {
        return this.projectService.findAll();
    }

    @ApiResponse({ status: 200, description: 'fetch project detail success' })
    @ApiResponse({ status: 404, description: 'not found' })
    @ApiResponse({ status: 400, description: 'bad request' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @Get('detail/:id')
    findOne(@Param('id') id: string) {
        return this.projectService.findOne(id);
    }

    @ApiResponse({ status: 201, description: 'new project created' })
    @ApiResponse({ status: 400, description: 'bad request' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @ApiQuery({ name: 'status', enum: PROJECT_STATUS })
    @Put('update/:id')
    update(
        @Param('id') id: string,
        @Body() updateProjectDto: UpdateProjectDto,
        @Query('status') status: PROJECT_STATUS = PROJECT_STATUS.ONGOING,
    ) {
        return this.projectService.update(id, updateProjectDto, status);
    }

    @ApiResponse({ status: 204, description: 'project deleted success' })
    @ApiResponse({ status: 400, description: 'bad request' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @Delete('delete/:id')
    remove(@Param('id') id: string) {
        return this.projectService.remove(id);
    }
}

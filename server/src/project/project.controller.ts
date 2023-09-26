import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Put,
    UseGuards,
    Request,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { PROJECT_STATUS } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { IauthRequest } from 'src/@types/authRequest';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from 'libs/file-storage';

@Controller('project')
@ApiTags('project')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @ApiResponse({ status: 201, description: 'new project created' })
    @ApiResponse({ status: 400, description: 'bad request' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreateProjectDto, description: 'project create' })
    @Post('create')
    @ApiQuery({ name: 'status', enum: PROJECT_STATUS })
    @UseInterceptors(FileInterceptor('image', fileStorage))
    create(
        @Body() createProjectDto: CreateProjectDto,
        @Query('status') status: PROJECT_STATUS = PROJECT_STATUS.ONGOING,
        @Request() req: IauthRequest,
        @UploadedFile() image?: Express.Multer.File,
    ) {
        return this.projectService.create(createProjectDto, status, req.user.id, image);
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

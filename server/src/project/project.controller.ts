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
    @UseInterceptors(FileInterceptor('image', fileStorage))
    create(
        @Request() req: IauthRequest,
        @Body() createProjectDto: CreateProjectDto,
        @UploadedFile() image?: Express.Multer.File,
    ) {
        return this.projectService.create(req.user.id, createProjectDto, image);
    }

    @ApiResponse({ status: 200, description: 'fetched all projects success' })
    @ApiResponse({ status: 404, description: 'not found' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @Get('get-all')
    findAll() {
        return this.projectService.findAll();
    }

    @ApiResponse({ status: 200, description: 'fetch project detail success' })
    @ApiResponse({ status: 404, description: 'not found' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @Get('detail/:id')
    findOne(@Param('id') id: string) {
        return this.projectService.findOne(id);
    }

    @ApiResponse({ status: 201, description: 'new project created' })
    @ApiResponse({ status: 400, description: 'bad request' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UpdateProjectDto, description: 'update project' })
    @UseInterceptors(FileInterceptor('image', fileStorage))
    @Put('update/:id')
    update(
        @Param('id') id: string,
        @Body() updateProjectDto: UpdateProjectDto,
        @UploadedFile() image?: Express.Multer.File,
    ) {
        return this.projectService.update(id, updateProjectDto, image);
    }

    @ApiResponse({ status: 204, description: 'project deleted success' })
    @ApiResponse({ status: 400, description: 'bad request' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @Delete('delete/:id')
    remove(@Param('id') id: string) {
        return this.projectService.remove(id);
    }
}

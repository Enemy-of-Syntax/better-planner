import { HttpException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { projectQuery } from './project.sql';
import { v4 as uuidV4 } from 'uuid';
import { PROJECT_STATUS } from '@prisma/client';
import { Responser } from 'libs/Responser';
import { error } from 'console';
import { imageType } from 'src/@types/imageType';
import { QueryService } from 'src/auth/auth.sql';
@Injectable()
export class ProjectService {
    constructor(
        private readonly projectQuery: projectQuery,
        private readonly authsql: QueryService,
    ) {}
    async create(
        createProjectDto: CreateProjectDto,
        status: PROJECT_STATUS,
        userId: string,
        Image?: Express.Multer.File,
    ) {
        try {
            const projectId = await uuidV4();
            let image: imageType = { id: '', name: '', path: '' };
            if (Image) {
                image = await this.authsql.insertPhoto({
                    name: Image.filename,
                    path: Image.path,
                });
            }

            const newProject = await this.projectQuery.createNewProject(
                projectId,
                createProjectDto,
                status,
                image.id === '' ? null : image.id,
                userId,
            );
            if (!newProject) throw error;

            return Responser({
                statusCode: 201,
                message: 'successfully created new project',
                devMessage: 'successfully created new project',
                body: newProject,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Failed to create project',
                    devMessage: err.message || '',
                },
                400,
            );
        }
    }

    async findAll() {
        try {
            const allProjects = await this.projectQuery.findAllProjects();
            if (!allProjects) throw new Error();

            return Responser({
                statusCode: 200,
                message: 'successfully fetched all projects',
                devMessage: 'successfully fetched all projects',
                body: allProjects,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Failed to fetch all projects',
                    devMessage: err.message || '',
                },
                400,
            );
        }
    }

    async findOne(id: string) {
        try {
            const project: any = await this.projectQuery.findSingleProject(id);
            if (project.length === 0) throw error;

            return Responser({
                statusCode: 200,
                message: 'successfully fetched all projects',
                devMessage: 'successfully fetched all projects',
                body: project,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Failed to fetch all projects',
                    devMessage: err.message || '',
                },
                400,
            );
        }
    }

    async update(id: string, updateProjectDto: UpdateProjectDto, status: PROJECT_STATUS) {
        try {
            const projectExist: any = await this.projectQuery.findSingleProject(id);
            if (projectExist.length === 0) throw new Error('project does not exist');

            const updatedProject = await this.projectQuery.updateProject(
                id,
                updateProjectDto,
                status,
            );
            if (!updatedProject) throw error;

            return Responser({
                statusCode: 200,
                message: 'successfully fetched all projects',
                devMessage: 'successfully fetched all projects',
                body: updatedProject,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Failed to fetch all projects',
                    devMessage: err.message || '',
                },
                400,
            );
        }
    }

    async remove(id: string) {
        try {
            const projectExist: any = await this.projectQuery.findSingleProject(id);
            if (projectExist.length === 0) throw new Error('project not found');

            const deletedProject = await this.projectQuery.deleteProject(id);
            if (!deletedProject) throw new Error('failed to delete project');

            return Responser({
                statusCode: 204,
                message: 'successfully deleted project',
                devMessage: 'successfully deleted project',
                body: deletedProject,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Failed to delete  projects',
                    devMessage: err.message || '',
                },
                400,
            );
        }
    }
}

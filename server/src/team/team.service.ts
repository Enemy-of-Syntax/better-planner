import { HttpException, Injectable } from '@nestjs/common';
import { TeamQuery } from './team.sql';
import { Responser } from 'libs/Responser';
import { TeamDto, UpdateTeam } from './dto/team.dto';
import { v4 as uuidV4 } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';
import { error } from 'console';
import { imageType } from 'src/@types/imageType';
import { QueryService } from 'src/auth/auth.sql';

@Injectable()
export class TeamService {
    constructor(private readonly teamQuery: TeamQuery, private readonly authSql: QueryService) {}

    async getAllTeams() {
        try {
            const allTeams = await this.teamQuery.findAllTeams();
            return Responser({
                statusCode: 200,
                message: 'success to get all teams',
                devMessage: 'success',
                body: allTeams,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'failed to get teams',
                    devMessage: err.message || '',
                },
                404,
            );
        }
    }

    async createNewTeam(dto: TeamDto, userId: string, Image?: Express.Multer.File) {
        try {
            const uuid = await uuidV4();
            let image: imageType = { id: '', name: '', path: '' };
            if (Image) {
                image = await this.authSql.insertPhoto({
                    name: Image.filename,
                    path: Image.path,
                });
            }
            const newTeam = await this.teamQuery.insertNewTeam({
                id: uuid,
                name: dto.name,
                organizationId: dto.organizationId,
                createdUserId: userId,
                imageId: image.id === '' ? null : image.id,
            });

            return Responser({
                statusCode: 201,
                message: 'successfully created new team',
                devMessage: 'successfully created new team',
                body: newTeam,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'failed to create new team',
                    devMessage: err.message || '',
                },
                400,
            );
        }
    }

    async getSingleTeam(id: string) {
        try {
            const foundTeam = await this.teamQuery.findSingleTeam(id);

            return Responser({
                statusCode: 200,
                message: 'success',
                devMessage: 'success',
                body: foundTeam[0],
            });
        } catch (err) {
            console.log(err);
            throw new HttpException(
                {
                    message: 'failed to fetch team',
                    devMessage: 'failed to get team from db',
                },
                404,
            );
        }
    }

    async editTeam(id: string, dto: UpdateTeam, Image?: Express.Multer.File) {
        try {
            const updateTeamExist = await this.teamQuery.findSingleTeam(id);
            if (!updateTeamExist) throw error;

            let image: imageType = { id: '', name: '', path: '' };

            if (Image) {
                image = await this.authSql.insertPhoto({
                    name: Image.filename,
                    path: Image.path,
                });
            }

            const updateTeam = await this.teamQuery.updateTeam(
                id,
                dto,
                image.id === '' ? updateTeamExist[0].team_image_id : image.id,
            );
            if (!updateTeam) throw error;

            return Responser({
                statusCode: 200,
                message: 'Successfully updated team',
                devMessage: 'success',
                body: updateTeam,
            });
        } catch (err: any) {
            console.log(err);
            throw new HttpException(
                {
                    message: 'Failed to edit team',
                    devMessage: err.message || '',
                },
                400,
            );
        }
    }

    async removeTeam(id: string) {
        try {
            const deletedTeam = await this.teamQuery.deleteTeam(id);
            if (!deletedTeam) throw error;

            return Responser({
                statusCode: 200,
                message: 'deleted team successfully',
                devMessage: 'successfully deleted',
                body: deletedTeam,
            });
        } catch (err) {
            console.log(err);
            throw new HttpException(
                {
                    message: 'Failed to delete team',
                    devMessage: 'failed to delete team',
                },
                400,
            );
        }
    }
}

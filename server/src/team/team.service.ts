import { HttpException, Injectable } from '@nestjs/common';
import { TeamQuery } from './team.sql';
import { Responser, responseType } from 'libs/Responser';
import { EmailDto, TeamDto, UpdateTeam } from './dto/team.dto';
import { v4 as uuidV4 } from 'uuid';
import { error } from 'console';
import { imageType } from 'src/@types/imageType';
import { QueryService } from 'src/auth/auth.sql';
import EmailService from 'libs/mailservice';
import { INVITATION_STATUS } from '@prisma/client';
import { invitationTemplate } from 'template/invitation';
import { JwtService } from '@nestjs/jwt';
import { Team } from 'src/@types/SqlReturnType';

@Injectable()
export class TeamService {
    constructor(
        private readonly teamQuery: TeamQuery,
        private readonly authSql: QueryService,
        private readonly Email: EmailService,
        private readonly Jwt: JwtService,
    ) {}

    async getAllTeams() {
        try {
            const allTeams: Team[] = await this.teamQuery.findAllTeams();
            return Responser({
                statusCode: 200,
                message: 'success to get all teams',
                devMessage: 'success',
                body: {
                    count: allTeams.length,
                    data: allTeams,
                },
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

    async emailInvite(email: EmailDto, userId: string) {
        try {
            const userEmail: any = await this.authSql.findUserById(userId);
            const payload = {
                id: userEmail[0].id,
                email: userEmail[0].email,
                teamId: email.teamId,
            };

            const invitationToken = await this.Jwt.signAsync(payload, {
                secret: process.env.JWT_INVITE_TOKEN,
                expiresIn: '1d',
            });

            await this.Email.sendMail({
                from: userEmail[0].email,
                to: email.email,
                subject: 'Invitation To Our Work Space',
                html: invitationTemplate(invitationToken),
            });
            const updatedUser = await this.authSql.updateUserStatus(
                INVITATION_STATUS.INVITED,
                email.email,
            );
            console.log(updatedUser);

            return Responser({
                statusCode: 200,
                message: 'Invitation email sent successfully!',
                devMessage: 'Invitation Success!',
                body: updatedUser,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Failed to invite member',
                    devMessage: err.message || '',
                },
                400,
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
            const newTeam: Team[] = await this.teamQuery.insertNewTeam({
                id: uuid,
                name: dto.name,
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
            const foundTeam: Team[] = await this.teamQuery.findSingleTeam(id);

            return Responser({
                statusCode: 200,
                message: 'successfully fetched team detail',
                devMessage: 'success',
                body: foundTeam[0],
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'failed to fetch team',
                    devMessage: err.message || '',
                },
                404,
            );
        }
    }

    async editTeam(id: string, dto: UpdateTeam, Image?: Express.Multer.File) {
        try {
            const updateTeamExist: Team[] = await this.teamQuery.findSingleTeam(id);
            if (!updateTeamExist) throw error;

            let image: imageType = { id: '', name: '', path: '' };

            if (Image) {
                image = await this.authSql.insertPhoto({
                    name: Image.filename,
                    path: Image.path,
                });
            }

            const updatedTeam: Team[] = await this.teamQuery.updateTeam(
                id,
                dto,
                image.id === '' ? updateTeamExist[0]?.team_image_id : image.id,
            );
            if (!updatedTeam) throw new Error('Failed to update team');

            return Responser({
                statusCode: 200,
                message: 'Successfully updated team',
                devMessage: 'success',
                body: updatedTeam,
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
            const deletedTeam: number = await this.teamQuery.deleteTeam(id);
            if (!deletedTeam) throw error;

            return Responser({
                statusCode: 200,
                message: 'deleted team successfully',
                devMessage: 'successfully deleted',
                body: deletedTeam,
            });
        } catch (err: any) {
            console.log(err);
            throw new HttpException(
                {
                    message: 'Failed to delete team',
                    devMessage: err.message || '',
                },
                400,
            );
        }
    }
}

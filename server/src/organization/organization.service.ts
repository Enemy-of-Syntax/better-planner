import { HttpException, Injectable } from '@nestjs/common';
import { ORGANIZATION_STATUS, organization } from '@prisma/client';
import { organizationQuery } from './organization.sql';
import { Responser } from 'libs/Responser';
import { UpdateOrganizationDto, organizationDto } from './dto/organization.dto';
import { error } from 'console';
import { v4 as uuidV4 } from 'uuid';
import { QueryService } from 'src/auth/auth.sql';
import { imageType } from 'src/@types/imageType';

@Injectable()
export class OrganizationService {
    constructor(
        private readonly orgQuery: organizationQuery,
        private readonly authQuery: QueryService,
    ) {}
    async getAllOrganizations(): Promise<any> {
        try {
            const allOrganizations: organization[] | [] =
                await this.orgQuery.findAllOrganizations();
            if (!allOrganizations) throw new Error();

            return Responser({
                statusCode: 200,
                devMessage: 'successfully  get all organizations',
                message: 'successfully get all organizations',
                body: allOrganizations,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'failed to get all organizations',
                    devMessage: err.message || '',
                },
                404,
            );
        }
    }

    async getDetail(id: string): Promise<any> {
        try {
            const organizationDetail: organization[] | [] =
                await this.orgQuery.findOrganizationById(id);

            if (organizationDetail.length > 0) {
                return Responser({
                    statusCode: 200,
                    devMessage: 'successfully get organization detail',
                    message: 'successfully get organization detail',
                    body: organizationDetail,
                });
            } else {
                throw new Error();
            }
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'failed to get organization detail',
                    devMessage: err.message || '',
                },
                404,
            );
        }
    }

    async createNewOrganization(
        dto: organizationDto,
        status: ORGANIZATION_STATUS,
        userId: string,
        Image?: Express.Multer.File,
    ): Promise<any> {
        try {
            const id: string = await uuidV4();

            const updateUserRole: any = await this.authQuery.updateUserRole(userId);
            if (!updateUserRole) throw new Error('failed to update user role');

            let image: imageType = { id: '', name: '', path: '' };
            if (Image) {
                image = await this.authQuery.insertPhoto({
                    name: Image.filename,
                    path: Image.path,
                });
            }

            const newOrganization = await this.orgQuery.insertNewOrganization(
                id,
                dto,
                image.id !== '' ? image.id : null,
                userId,
                status,
            );
            if (!newOrganization) throw error;

            return Responser({
                statusCode: 201,
                message: 'new organization created',
                devMessage: 'new organization created!',
                body: newOrganization,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Failed to create new organization',
                    devMessage: err.message || '',
                },
                400,
            );
        }
    }

    async updateOrganization(
        id: string,
        dto: UpdateOrganizationDto,
        status: ORGANIZATION_STATUS,
        Image?: Express.Multer.File,
    ) {
        try {
            let image: imageType = { id: '', name: '', path: '' };
            if (Image) {
                image = await this.authQuery.insertPhoto({
                    name: Image.filename,
                    path: Image.path,
                });
            }

            const updatedOrganization = await this.orgQuery.updateOrganization(
                id,
                dto,
                status,
                image.id && image.id,
            );
            if (!updatedOrganization) throw error;

            return Responser({
                statusCode: 201,
                message: 'organization updated successfully',
                devMessage: 'organization updated successfully',
                body: updatedOrganization,
            });
        } catch (err) {
            throw new HttpException(
                {
                    message: 'organization failed to update',
                    devMessage: 'organization failed to update',
                },
                401,
            );
        }
    }

    async removeOrganization(id: string): Promise<any> {
        try {
            const removeOrg = await this.orgQuery.deleteOrganization(id);
            if (!removeOrg) throw error;

            return Responser({
                statusCode: 200,
                message: 'Successfully removed organization',
                devMessage: 'Successfully removed organization',
                body: removeOrg,
            });
        } catch (err) {
            throw new HttpException(
                {
                    message: 'Failed to delete organization',
                    devMessage: 'Failed to delete organization',
                },
                400,
            );
        }
    }
}

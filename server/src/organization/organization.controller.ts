import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ORGANIZATION_STATUS, organization } from '@prisma/client';
import { OrganizationService } from './organization.service';
import { UpdateOrganizationDto, organizationDto } from './dto/organization.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { IauthRequest } from 'src/@types/authRequest';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from 'libs/file-storage';

@Controller('organization')
@ApiTags('organizations')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}
    @ApiResponse({ status: 200, description: 'successfully get organizations' })
    @ApiResponse({ status: 404, description: 'not found' })
    @ApiResponse({ status: 401, description: 'bad request' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @Get('getAll')
    GetAll(): Promise<string | organization[]> {
        return this.organizationService.getAllOrganizations();
    }

    @ApiResponse({
        status: 200,
        description: 'successfully get organization detail',
    })
    @ApiResponse({
        status: 404,
        description: 'not found',
    })
    @ApiResponse({
        status: 401,
        description: 'bad request',
    })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @Get('detail/:id')
    getDetail(@Param('id') id: string): Promise<organization> {
        return this.organizationService.getDetail(id);
    }

    @ApiResponse({ status: 200, description: 'successfully get organizations' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 404, description: 'not found' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @ApiQuery({ name: 'status', enum: ORGANIZATION_STATUS })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image', fileStorage))
    @Post('create')
    CreateOrganization(
        @Body() dto: organizationDto,
        @Request() req: IauthRequest,
        @Query('status') status: ORGANIZATION_STATUS = ORGANIZATION_STATUS.ACTIVE,
        @UploadedFile() image?: Express.Multer.File,
    ): Promise<organization> {
        return this.organizationService.createNewOrganization(dto, status, req.user.id, image);
    }

    @ApiResponse({ status: 201, description: 'successfully updated organizations' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 404, description: 'not found' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @ApiQuery({ name: 'status', enum: ORGANIZATION_STATUS })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image', fileStorage))
    @Put('update/:id')
    UpdateOrg(
        @Param('id') id: string,
        @Body() dto: UpdateOrganizationDto,
        @Query('status') status: ORGANIZATION_STATUS = ORGANIZATION_STATUS.ACTIVE,
        @UploadedFile() image?: Express.Multer.File,
    ): Promise<any> {
        return this.organizationService.updateOrganization(id, dto, status, image);
    }

    @ApiResponse({ status: 200, description: 'successfully deleted organizations' })
    @ApiResponse({ status: 404, description: 'not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @Delete('delete/:id')
    RemoveOrganization(@Param('id') id: string): Promise<any> {
        return this.organizationService.removeOrganization(id);
    }
}

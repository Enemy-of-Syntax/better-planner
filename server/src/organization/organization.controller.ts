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
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ORGANIZATION_STATUS, organization } from '@prisma/client';
import { OrganizationService } from './organization.service';
import { UpdateOrganizationDto, organizationDto } from './dto/organization.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { IauthRequest } from 'src/@types/authRequest';

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
    @Post('create')
    CreateOrganization(
        @Body() dto: organizationDto,
        @Request() req: IauthRequest,
        @Query('status') status: ORGANIZATION_STATUS = ORGANIZATION_STATUS.ACTIVE,
    ): Promise<organization> {
        return this.organizationService.createNewOrganization(dto, status, req.user.id);
    }

    @ApiResponse({ status: 201, description: 'successfully updated organizations' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 404, description: 'not found' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @ApiQuery({ name: 'status', enum: ORGANIZATION_STATUS })
    @Put('update/:id')
    UpdatedOrganization(
        @Param('id') id: string,
        @Body() dto: UpdateOrganizationDto,
        @Query('status') status: ORGANIZATION_STATUS = ORGANIZATION_STATUS.ACTIVE,
    ): Promise<any> {
        return this.organizationService.updateOrganization(id, dto, status);
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

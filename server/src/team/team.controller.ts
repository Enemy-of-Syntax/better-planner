import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TeamDto, UpdateTeam } from './dto/team.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { IauthRequest } from 'src/@types/authRequest';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from 'libs/file-storage';

@Controller('team')
@ApiTags('team')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class TeamController {
    constructor(private readonly teamService: TeamService) {}

    @Get('getAll')
    GetAllTeams() {
        return this.teamService.getAllTeams();
    }

    @Get('detail/:id')
    GetTeam(@Param('id') id: string) {
        return this.teamService.getSingleTeam(id);
    }

    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: TeamDto, description: 'create new Team' })
    @UseInterceptors(FileInterceptor('image', fileStorage))
    @Post('create')
    CreateTeam(
        @Body() dto: TeamDto,
        @Request() req: IauthRequest,
        @UploadedFile() Image?: Express.Multer.File,
    ) {
        return this.teamService.createNewTeam(dto, req.user.id, Image);
    }

    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UpdateTeam, description: 'update team' })
    @UseInterceptors(FileInterceptor('image', fileStorage))
    @Put('update/:id')
    UpdateTeam(
        @Body() dto: UpdateTeam,
        @Param('id') id: string,
        @UploadedFile() image?: Express.Multer.File,
    ) {
        return this.teamService.editTeam(id, dto, image);
    }

    @Delete('delete/:id')
    DeleteTeam(@Param('id') id: string) {
        return this.teamService.removeTeam(id);
    }
}

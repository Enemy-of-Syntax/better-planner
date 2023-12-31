import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { TeamService } from './team.service';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiHeader,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { EmailDto, TeamDto, UpdateTeam, allTeamMemberDto } from './dto/team.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { IauthRequest } from 'src/@types/authRequest';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from 'libs/file-storage';
import { CreateMemberDto } from 'src/member/dto/create-member.dto';
import { QueryService } from 'src/auth/auth.sql';
import { removeMembersDto } from './dto/remove-member.dto';

@Controller('team')
@ApiTags('team')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class TeamController {
    constructor(private readonly teamService: TeamService) {}

    @Get('all')
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

    @Post('member-all')
    GetTeamMembers(@Body() dto: allTeamMemberDto) {
        return this.teamService.getAllTeamMembers(dto);
    }

    @Post('member-invite')
    InviteEmail(@Body() email: EmailDto, @Request() req: IauthRequest) {
        return this.teamService.emailInvite(email, req.user.id);
    }

    @ApiOperation({ summary: 'accept invite' })
    @Post('member-accept-invite')
    @ApiHeader({
        name: 'Authorization',
        description: 'Access token(take from email-invite route)',
    })
    acceptInvitation(@Request() req, @Body() memberDto: CreateMemberDto) {
        return this.teamService.acceptInvite(req.headers?.authorization, memberDto);
    }

    @Patch('members-remove/:teamId')
    @ApiBody({ type: removeMembersDto, description: 'remove member' })
    RemoveMembers(@Param() teamId: string, @Body() dto: removeMembersDto) {
        return this.teamService.removeMembers(teamId, dto);
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

    @ApiConsumes('multipart/form-data')
    @ApiBody({})
    @Delete('delete/:id')
    DeleteTeam(@Param('id') id: string) {
        return this.teamService.removeTeam(id);
    }
}

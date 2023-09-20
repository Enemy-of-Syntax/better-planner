import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TeamService } from './team.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TeamDto, UpdateTeam } from './dto/team.dto';

@Controller('team')
@ApiTags('team')
export class TeamController {
    constructor(private readonly teamService: TeamService) {}

    @ApiResponse({ status: 200, description: 'successful' })
    @ApiResponse({ status: 404, description: 'failed to get all teams' })
    @Get('getAll')
    GetAllTeams() {
        return this.teamService.getAllTeams();
    }

    @ApiResponse({ status: 200, description: 'successful' })
    @ApiResponse({ status: 404, description: 'failed to get team detail' })
    @Get('detail/:id')
    GetTeam(@Param('id') id: string) {
        return this.teamService.getSingleTeam(id);
    }

    @ApiResponse({ status: 201, description: 'successfully created new team' })
    @ApiResponse({ status: 401, description: 'bad request ' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @Post('create')
    CreateTeam(@Body() dto: TeamDto) {
        return this.teamService.createNewTeam(dto);
    }

    @ApiResponse({ status: 200, description: 'successfully edited new team' })
    @ApiResponse({ status: 401, description: 'Bad request' })
    @Put('update/:id')
    UpdateTeam(@Body() dto: UpdateTeam, @Param('id') id: string) {
        return this.teamService.editTeam(id, dto);
    }

    @ApiResponse({ status: 200, description: 'successfully deleted!' })
    @ApiResponse({
        status: 404,
        description: 'item not found for delete request!',
    })
    @Delete('delete/:id')
    DeleteTeam(@Param('id') id: string) {
        return this.teamService.removeTeam(id);
    }
}

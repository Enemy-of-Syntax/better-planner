import { HttpException, Injectable } from '@nestjs/common';
import { TeamQuery } from './team.sql';
import { Responser } from 'libs/Responser';
import { TeamDto, UpdateTeam } from './dto/team.dto';
import { v4 as uuidV4 } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';
import { error } from 'console';

@Injectable()
export class TeamService {
  constructor(
    private readonly teamQuery: TeamQuery,
    private readonly prisma: PrismaService,
  ) {}

  async getAllTeams() {
    try {
      const allTeams = await this.teamQuery.findAllTeams();
      return Responser({
        statusCode: 200,
        message: 'success to get all teams',
        devMessage: 'success',
        body: allTeams,
      });
    } catch {
      throw new HttpException(
        {
          message: 'failed to get teams',
          devMessage: 'failed',
        },
        404,
      );
    }
  }

  async createNewTeam(dto: TeamDto) {
    try {
      const uuid = await uuidV4();
      const newTeam = await this.teamQuery.insertNewTeam({
        id: uuid,
        name: dto.name,
        organizationId: dto.organizationId,
        createdUserId: dto.createdUserId,
      });

      return Responser({
        statusCode: 201,
        message: 'successfully created new team',
        devMessage: 'successfully created new team',
        body: newTeam,
      });
    } catch {
      throw new HttpException(
        {
          message: 'failed to create new team',
          devMessage: 'failed to create new team',
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

  async editTeam(id: string, dto: UpdateTeam) {
    try {
      const updateTeamExist = await this.teamQuery.findSingleTeam(id);
      if (!updateTeamExist) throw error;

      const updateTeam = await this.teamQuery.updateTeam(id, dto);
      updateTeam;
      if (!updateTeam) throw error;

      return Responser({
        statusCode: 200,
        message: 'Succesfully updated team',
        devMessage: 'success',
        body: updateTeam,
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          message: 'Failed to edit team',
          devMessage: 'Failed to edit team',
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

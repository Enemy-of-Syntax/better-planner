import { HttpException, Injectable } from '@nestjs/common';
import { Prisma, team } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTeam } from './dto/team.dto';
import { QueryServie } from 'src/auth/auth.sql';
import { organizationQuery } from 'src/organization/organization.sql';

@Injectable()
export class TeamQuery {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authQuery: QueryServie,
    private readonly orgQuery: organizationQuery,
  ) {}

  async findAllTeams() {
    return this.prisma.$queryRaw(Prisma.sql`SELECT * FROM public.teams`);
  }

  async findSingleTeam(id: string): Promise<team> {
    return this.prisma.$queryRaw(
      Prisma.sql`SELECT * FROM public.teams 
       WHERE id=${id}`,
    );
  }

  async insertNewTeam({ id, name, organizationId, createdUserId }) {
    try {
      const newDate = new Date();

      await this.prisma.$executeRaw`INSERT INTO public.teams
            (id,name,organization_id,created_user_id,created_at,updated_at)
            VALUES (${id},${name},${organizationId},${createdUserId},${newDate},${newDate})`;

      return this.findSingleTeam(id);
    } catch (error) {
      throw error;
    }
  }

  // Update section
  async updateTeam(id: string, dto: UpdateTeam) {
    const condition = false || undefined || null || '' || 'string';

    //relation id are valid or not
    const orgidValid = await this.orgQuery.findOrganizationById(
      dto.organizationId ? dto.organizationId : '',
    );
    const userIdValid = await this.authQuery.findUserById(
      dto.createdUserId ? dto.createdUserId : '',
    );

    if (dto.organizationId !== condition) {
      if (orgidValid[0]) {
        this.updateTeamByOrganizationId(id, orgidValid[0].id);
      }
    }

    if (dto.createdUserId !== condition) {
      if (userIdValid[0]) {
        this.updateTeamByuserId(id, userIdValid[0].id);
      }
    }

    if (dto.name === condition && dto.name.length > 0) {
      this.updateTeamByName(id, dto);
      return await this.findSingleTeam(id);
    } else {
      return false;
    }
  }

  async updateTeamByName(id: string, dto: UpdateTeam) {
    await this.prisma.$executeRaw`UPDATE public.teams
                       SET name=${dto.name},
                       updated_at=${new Date()}
                       WHERE id=${id}`;
  }

  async updateTeamByOrganizationId(id: string, orgId: string) {
    await this.prisma.$executeRaw`UPDATE public.teams
      SET organization_id=${orgId},
      updated_at=${new Date()}
      WHERE id=${id}`;
  }

  async updateTeamByuserId(id: string, userId: string) {
    await this.prisma.$executeRaw`UPDATE public.teams
                    SET created_user_id=${userId}
                    updated_at=${new Date()}
                    WHERE id=${id}`;
  }

  async deleteTeam(id: string) {
    return this.prisma
      .$executeRaw`DELETE FROM public.teams WHERE id=${id}`.catch((err) => err);
  }
}

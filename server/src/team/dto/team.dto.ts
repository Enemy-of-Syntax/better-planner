import { Query } from '@nestjs/common';
import { ApiProperty, ApiQuery, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TeamDto {
  constructor() {
    this.name = '';
    this.organizationId = '';
    this.createdUserId = '';
  }

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty()
  @IsNotEmpty()
  createdUserId: string;
}

export class UpdateTeam extends PartialType(TeamDto) {}

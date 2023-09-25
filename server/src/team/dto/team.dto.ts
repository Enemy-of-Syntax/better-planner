import { Query } from '@nestjs/common';
import { ApiProperty, ApiQuery, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TeamDto {
    constructor() {
        this.name = '';
        this.organizationId = '';
    }

    @ApiProperty()
    name: string;

    @ApiProperty()
    organizationId: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    public image?: string[];
}

export class UpdateTeam extends PartialType(TeamDto) {}

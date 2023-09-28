import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class TeamDto {
    constructor() {
        this.name = '';
        this.memberEmail = '';
        this.organizationId = '';
    }

    @ApiProperty()
    name: string;

    @ApiProperty()
    @IsEmail()
    memberEmail: string;

    @ApiProperty()
    organizationId: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    public image?: string[];
}

export class UpdateTeam extends PartialType(TeamDto) {}

export class EmailDto {
    constructor() {
        this.email = '';
        this.teamId = '';
    }
    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    teamId: string;
}

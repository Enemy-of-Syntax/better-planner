import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class TeamDto {
    constructor() {
        this.name = '';
    }

    @ApiProperty()
    name: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    public image?: string[];
}

export class allTeamMemberDto {
    constructor() {
        this.teamId = '';
    }

    @ApiProperty({ type: 'string' })
    teamId: string;
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

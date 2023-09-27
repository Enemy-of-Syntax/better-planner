import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class TeamDto {
    constructor() {
        this.name = '';
        this.memberId = [];
        this.organizationId = '';
    }

    @ApiProperty()
    name: string;

    @ApiProperty({
        type: 'array',
        items: {
            type: 'string',
        },
    })
    @Transform(({ value }) => value.split(','))
    memberId: string[];

    @ApiProperty()
    organizationId: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    public image?: string[];
}

export class UpdateTeam extends PartialType(TeamDto) {}

import { ApiProperty } from '@nestjs/swagger';

export class removeMembersDto {
    constructor() {
        this.memberIds = [];
    }

    @ApiProperty({
        type: 'string',
        format: 'binary',
        example: ['memberId'],
    })
    memberIds: string[];
}


import { ApiProperty } from '@nestjs/swagger';

export class UpdateMemberDto {
    constructor() {
        (this.userId = ''), (this.teamId = '');
    }

    @ApiProperty({ required: false })
    userId: string;

    @ApiProperty({ required: false })
    teamId: string;
}

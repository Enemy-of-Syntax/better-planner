import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMemberDto {
    constructor() {
        (this.userId = ''), (this.teamId = '');
    }

    @ApiProperty()
    @IsNotEmpty()
    userId: string;

    @ApiProperty()
    @IsNotEmpty()
    teamId: string;
}

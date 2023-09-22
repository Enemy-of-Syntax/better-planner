import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class boardDto {
    constructor() {
        (this.name = ''), (this.organizationId = '');
    }

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    organizationId: string;
}

export class updateBoardDto {
    constructor() {
        (this.name = ''), (this.organizationId = '');
    }

    @ApiProperty({ type: 'string', required: false })
    name: string;

    @ApiProperty({ type: 'string', required: false })
    organizationId: string;
}

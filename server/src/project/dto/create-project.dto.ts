import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { AnyRecord } from 'dns';

export class CreateProjectDto {
    constructor() {
        (this.name = ''), (this.organizationId = []);
    }
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        type: 'array',
        items: {
            type: 'string',
        },
    })
    @IsNotEmpty()
    @IsArray()
    organizationId: any[];
}

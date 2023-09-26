import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProjectDto {
    constructor() {
        (this.name = ''), (this.organizationId = []);
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
    organizationId: string[];

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    public image?: string[];
}

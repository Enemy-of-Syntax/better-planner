import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateProjectDto {
    constructor() {
        (this.name = ''), (this.organizationId = '');
    }
    @ApiProperty({ required: false })
    name?: string;

    @ApiProperty({ required: false })
    organizationId?: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    public image?: string[];
}

import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
    constructor() {
        (this.name = ''), (this.organizationId = '');
    }
    @ApiProperty()
    name: string;

    @ApiProperty()
    organizationId: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    public image?: string[];
}

import { ApiProperty } from '@nestjs/swagger';
import { PROJECT_STATUS } from '@prisma/client';

export class CreateProjectDto {
    constructor() {
        (this.name = ''), (this.description = '');
        this.status = PROJECT_STATUS.ACTIVE;
    }
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ enum: PROJECT_STATUS, default: PROJECT_STATUS.ACTIVE })
    status: PROJECT_STATUS;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    public image?: string[];
}

import { ApiProperty } from '@nestjs/swagger';
import { PROJECT_STATUS } from '@prisma/client';

export class UpdateProjectDto {
    constructor() {
        (this.name = ''), (this.description = ''), (this.status = PROJECT_STATUS.ACTIVE);
    }
    @ApiProperty({ required: false })
    name?: string;

    @ApiProperty({ required: false })
    description?: string;

    @ApiProperty({ enum: PROJECT_STATUS, default: PROJECT_STATUS.ACTIVE })
    status?: PROJECT_STATUS;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    public image?: string[];
}

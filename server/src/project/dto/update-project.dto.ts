import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {
    constructor() {
        (this.name = ''), (this.organizationId = '');
    }

    @ApiProperty({ required: false })
    name: string;

    @ApiProperty({ required: false })
    organizationId: string;
}

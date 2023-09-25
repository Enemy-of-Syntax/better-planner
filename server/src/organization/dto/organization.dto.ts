import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';

export class organizationDto {
    constructor() {
        this.name = '';
    }
    @ApiProperty()
    name: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    public image?: string;
}

export class UpdateOrganizationDto extends PartialType(organizationDto) {}

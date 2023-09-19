import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class organizationDto {
    constructor() {
        this.name = '';
    }
    @ApiProperty()
    @IsNotEmpty()
    name: string;
}

export class UpdateOrganizationDto extends PartialType(organizationDto) {}

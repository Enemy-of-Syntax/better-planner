import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
    constructor() {
    this.name="",
    this.description=""
    this.status="ACTIVE"
    }
    @ApiProperty()
    name: string;

    @ApiProperty()
    description : string

    @ApiProperty()
    status : "ACTIVE" | "ONHOLD" | "CLOSED"
 

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    public image?: string[];
}

import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {
    constructor() {
        (this.name = ''), (this.description = ''), this.status="ACTIVE"
    }
    @ApiProperty({ required: false })
    name?: string;

    @ApiProperty({ required: false })
    description?: string;

    @ApiProperty({example:"ACTIVE"})
    status : "ACTIVE" | "ONHOLD" | "ONCLOSE"
    

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    public image?: string[];
}

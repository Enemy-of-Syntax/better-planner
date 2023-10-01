import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
    constructor() {
        (this.title = ''),
            (this.description = ''),
            (this.startDate = new Date()),
            (this.endDate = new Date()),
            (this.boardId = ''),
            (this.createdUserId = '');
    }

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    boardId: string;

    @ApiProperty()
    startDate: Date;

    @ApiProperty()
    endDate: Date;

    @ApiProperty()
    createdUserId: string;
}

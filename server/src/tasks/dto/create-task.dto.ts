import { ApiProperty } from '@nestjs/swagger';
import { TASK_STATUS } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate } from 'class-validator';

export class CreateTaskDto {
    constructor() {
        (this.title = ''),
            (this.description = ''),
            (this.startDate = new Date()),
            (this.status = TASK_STATUS.ACTIVE),
            (this.endDate = new Date()),
            (this.boardId = ''),
            (this.createdUserId = '');
        this.images = [];
        this.membersId = [];
    }

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ enum: TASK_STATUS })
    status: TASK_STATUS;

    @ApiProperty()
    boardId: string;

    @ApiProperty({ example: '2022-10-3 14:06' })
    @IsDate()
    @Transform(({ value }) => value && new Date(value))
    startDate: Date;

    @ApiProperty({ example: '2022-10-7 14:06' })
    @IsDate()
    @Transform(({ value }) => value && new Date(value))
    endDate: Date;

    @ApiProperty({
        type: 'array',
        items: {
            type: 'string',
            format: 'binary',
        },
    })
    images: string[];

    @ApiProperty({
        type: 'array',
        items: {
            type: 'string',
            format: 'binary',
        },
    })
    membersId: string[];

    @ApiProperty()
    createdUserId: string;
}

export class allTasksSingleBoardDto {
    constructor() {
        this.boardId = '';
    }

    @ApiProperty()
    boardId: string;
}

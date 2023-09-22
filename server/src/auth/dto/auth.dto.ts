import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class registerUserDto {
    constructor() {
        (this.email = ''), (this.name = ''), (this.password = '');
    }

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    password: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    public image?: string;
}

export class loginUserDto {
    constructor() {
        (this.email = ''), (this.password = '');
    }

    @ApiProperty({ example: 'naing123@gmail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'naing123' })
    password: string;
}

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, MIN_LENGTH, Min, MinLength } from 'class-validator';

export class registerUserDto {
    constructor() {
        (this.email = ''), (this.name = ''), (this.password = '');
    }

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    @Min(6)
    password: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    public image?: string;
}

export class updateUserDto extends PartialType(registerUserDto) {}
export class loginUserDto {
    constructor() {
        (this.email = ''), (this.password = '');
    }

    @ApiProperty({ example: 'naing123@gmail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'naing123' })
    @MinLength(6)
    password: string;
}

export class forgotPwDto {
    constructor() {
        this.email = '';
    }
    @ApiProperty()
    email: string;
}

export class resetPwDto {
    constructor() {
        (this.email = ''), (this.code = ''), (this.newPassword = '');
    }

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    code: string;

    @ApiProperty()
    @MinLength(6)
    newPassword: string;
}

import { ApiHeader, ApiProperty, PartialType } from '@nestjs/swagger';
import { USER_ROLE } from '@prisma/client';
import { IsEmail, MinLength } from 'class-validator';
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
        (this.email = ''), (this.newPassword = '');
    }

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @MinLength(6)
    newPassword: string;
}
export class updateRefreshTokenDto {
    constructor() {
        this.token = '';
    }

    token: string;
}

export class verifyOTPcode {
    constructor() {
        (this.email = ''), (this.code = '');
    }

    @ApiProperty()
    email: string;

    @ApiProperty()
    code: string;
}

export class updateRoleDto {
    constructor() {
        this.role = USER_ROLE.ADMIN;
        this.updatedUserId = '';
    }

    @ApiProperty({ enum: USER_ROLE, default: USER_ROLE.MEMBER })
    role: USER_ROLE;

    @ApiProperty({ type: 'string' })
    updatedUserId: string;
}

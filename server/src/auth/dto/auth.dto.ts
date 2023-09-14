import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class registerUserDto {
  constructor() {
    (this.email = ''),
      (this.name = ''),
      (this.password = ''),
      (this.organizationId = '');
  }

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  organizationId: string;
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

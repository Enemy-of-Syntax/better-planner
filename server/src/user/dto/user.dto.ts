import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class registerUserDto {
  constructor() {
    (this.email = ''),
      (this.name = ''),
      (this.password = ''),
      (this.organizationId = '');
  }

  @ApiProperty()
  @IsEmail()
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

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  password: string;
}

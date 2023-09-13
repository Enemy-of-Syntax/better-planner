import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { loginUserDto, registerUserDto } from './dto';

@Controller('user')
@ApiTags('auth-users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ status: 200, description: 'user register success' })
  @ApiResponse({ status: 400, description: 'bad request ! register failed' })
  @ApiResponse({ status: 409, description: 'user already exist' })
  @ApiResponse({ status: 500, description: 'internal server error' })
  @ApiBody({
    description: 'user register',
    type: registerUserDto,
  })
  @ApiOperation({ summary: 'user register' })
  @Post('register')
  RegisterUser(@Body() dto: registerUserDto) {
    return this.userService.registerUser(dto);
  }

  //
  @ApiResponse({ status: 200, description: 'user login success' })
  @ApiResponse({ status: 401, description: 'unauthorized' })
  @ApiResponse({ status: 400, description: 'bad request' })
  @ApiBody({
    description: 'user login',
    type: loginUserDto,
  })
  @ApiOperation({ summary: 'user login' })
  @Post('login')
  LoginUser(@Body() dto: loginUserDto) {
    return this.userService.loginUser(dto);
  }
}

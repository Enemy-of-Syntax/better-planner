import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { loginUserDto, registerUserDto } from './dto';
import { AuthService } from './auth.service';
import { IauthRequest } from 'src/@types/authRequest';
import { AuthGuard } from './auth.guard';
import { request } from 'express';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    return this.authService.registerUser(dto);
  }

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
    return this.authService.loginUser(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'profile me' })
  @Get('profile/me')
  getProfile(@Req() request: IauthRequest) {
    return this.authService.profile(request.user.id);
  }
}

import {
    Body,
    Controller,
    Get,
    Header,
    Param,
    Post,
    Put,
    Req,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { forgotPwDto, loginUserDto, registerUserDto, resetPwDto, updateUserDto } from './dto';
import { AuthService } from './auth.service';
import { IauthRequest } from 'src/@types/authRequest';
import { AuthGuard } from './auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from 'libs/file-storage';
import { CreateMemberDto } from 'src/member/dto/create-member.dto';
@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // @ApiResponse({ status: 200, description: 'user register success' })
    // @ApiResponse({ status: 400, description: 'bad request ! register failed' })
    // @ApiResponse({ status: 409, description: 'user already exist' })
    // @ApiResponse({ status: 500, description: 'internal server error' })
    // @ApiBody({
    //     description: 'user register',
    //     type: registerUserDto,
    // })
    // @ApiConsumes('multipart/form-data')
    // @ApiOperation({ summary: 'user register' })
    // @UseInterceptors(FileInterceptor('image', fileStorage))
    // @Post('register')
    // RegisterUser(@Body() dto: registerUserDto, @UploadedFile() image: Express.Multer.File) {
    //     return this.authService.registerUser(dto, image);
    // }

    @ApiResponse({ status: 200, description: 'user login success' })
    @ApiResponse({ status: 401, description: 'wrong credentials' })
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

    @ApiOperation({ summary: 'forgot password' })
    @Post('forgot-password')
    forgotPassword(@Body() dto: forgotPwDto) {
        return this.authService.passwordForgot(dto);
    }

    @ApiOperation({ summary: 'reset password' })
    @Post('reset-password')
    ResetPassword(@Body() dto: resetPwDto) {
        return this.authService.passwordReset(dto);
    }

    @ApiResponse({ status: 200, description: 'token valid' })
    @ApiResponse({ status: 401, description: 'invalid token' })
    @ApiOperation({ summary: 'accept invite' })
    @Post('accept-invite')
    acceptInvitation(@Request() req, @Body() memberDto: CreateMemberDto) {
        return this.authService.acceptInvite(req.headers.authorization, memberDto);
    }

    @ApiResponse({ status: 200, description: 'token valid' })
    @ApiResponse({ status: 401, description: 'invalid token' })
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'profile me' })
    @ApiBearerAuth()
    @Get('profile/me')
    getProfile(@Request() request: IauthRequest) {
        return this.authService.profile(request.user.id);
    }

    @ApiResponse({ status: 200, description: 'fetched user list successfully' })
    @ApiResponse({ status: 400, description: 'bad request' })
    @ApiResponse({ status: 401, description: 'unauthorized' })
    @ApiResponse({ status: 404, description: 'not found' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @ApiOperation({ summary: 'all users' })
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('profile/all')
    getAllProfile() {
        return this.authService.allProfile();
    }

    @ApiResponse({ status: 201, description: 'updated user  successfully' })
    @ApiResponse({ status: 400, description: 'bad request' })
    @ApiResponse({ status: 401, description: 'unauthorized' })
    @ApiResponse({ status: 404, description: 'not found' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @ApiOperation({ summary: 'update user' })
    @ApiBody({ type: updateUserDto, description: 'update user' })
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Put('profile/update')
    @UseInterceptors(FileInterceptor('image', fileStorage))
    updateProfile(
        @Body() dto: updateUserDto,
        @Req() req: IauthRequest,
        @UploadedFile() image: Express.Multer.File,
    ) {
        return this.authService.updateProfile(dto, req.user.id, image);
    }
}

import {
    BadRequestException,
    HttpException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { forgotPwDto, loginUserDto, registerUserDto, resetPwDto, updateUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { Responser } from 'libs/Responser';
import { QueryService } from './auth.sql';
import { v4 as uuidV4 } from 'uuid';
import { INVITATION_STATUS, MEMBER_ROLE, MEMBER_STATUS, user } from '@prisma/client';
import { imageType } from 'src/@types/imageType';
import * as argon from 'argon2';
import { MemberService } from 'src/member/member.service';
import { CreateMemberDto } from 'src/member/dto/create-member.dto';
import { error } from 'console';
import EmailService from 'libs/mailservice';
import { recoverPw } from 'template/recoverPw';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwt: JwtService,
        private queryService: QueryService,
        private readonly memberService: MemberService,
        private readonly Email: EmailService,
    ) {}

    async registerUser(dto: registerUserDto, Image?: Express.Multer.File) {
        const { email, password, name } = dto;
        try {
            const isUserAlrExist: user[] = await this.queryService.findUserByEmail(dto.email);
            if (isUserAlrExist.length > 0) throw new Error('credentials already taken');

            const hashPw = await argon.hash(password);
            const uuid: string = await uuidV4();

            let image: imageType = { id: '', name: '', path: '' };
            if (Image) {
                image = await this.queryService.insertPhoto({
                    name: Image.filename,
                    path: Image.path,
                });
            }

            const createUser = await this.queryService.insertNewUser({
                id: uuid,
                email,
                name,
                password: hashPw,
                ...(image && {
                    imageId: image.id === '' ? null : image.id,
                }),
            });

            return Responser({
                statusCode: 201,
                message: 'registration success!',
                devMessage: 'new user created!',
                body: createUser,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Failed to register new user',
                    devMessage: err.message || '',
                },
                400,
            );
        }
    }

    async passwordForgot(dto: forgotPwDto) {
        try {
            const randomCode = Math.round(Math.random() * 1000000);

            const isFoundUser: any = await this.queryService.findUserByEmail(dto.email);
            if (!isFoundUser) throw new error('user not found');

            await this.queryService.updateUserRecoveryCode(randomCode, isFoundUser[0]?.email);
            await this.Email.sendMail({
                from: 'naingaung9863@gmail.com',
                to: isFoundUser[0]?.email,
                subject: 'Recover Password',
                html: recoverPw(randomCode),
            });

            return Responser({
                statusCode: 200,
                message: 'code sent success',
                devMessage: 'code sent success',
                body: randomCode,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Something went wrong!',
                    devMessage: err.message || '',
                },
                400,
            );
        }
    }

    async passwordReset(dto: resetPwDto) {
        const { email, code, newPassword } = dto;
        try {
            const user: any = await this.queryService.findUserByEmail(email);
            const userCode = user[0]?.recovery_code;
            if (userCode.toString() === code) {
                const hashPw = await argon.hash(newPassword);
                await this.queryService.updateUserRecoveryCode(null, email);
                const updatedUser = await this.queryService.updateUserPassword(email, hashPw);
                if (!updatedUser) throw new Error();

                return Responser({
                    statusCode: 201,
                    message: 'user password updated successfully',
                    devMessage: 'user password updated successfully',
                    body: updatedUser,
                });
            }
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Failed to reset your password',
                    devMessage: err.message || '',
                },
                400,
            );
        }
    }

    async loginUser(dto: loginUserDto) {
        const { email, password } = dto;
        try {
            const foundUser: any = await this.queryService.findUserByEmail(email);
            if (!foundUser) throw new UnauthorizedException('Wrong credentials');

            const passwordMatch = await argon.verify(foundUser[0].password, password);
            if (!passwordMatch) throw new UnauthorizedException("Password doesn't match");

            const tokens = await this.generateToken({
                email: foundUser[0].email,
                id: foundUser[0].id,
            });

            return Responser({
                statusCode: 200,
                message: 'login success',
                devMessage: 'login success',
                body: { ...tokens },
            });
        } catch (err) {
            throw new HttpException(
                {
                    message: 'failed to login!',
                    devMessage: 'Wrong credentials',
                },
                401,
            );
        }
    }

    async acceptInvite(token, memberDto: CreateMemberDto) {
        const extractBearer = token.split(' ');
        try {
            const extractToken = await this.jwt.verifyAsync(extractBearer[1], {
                secret: process.env.JWT_ACCESS_TOKEN,
            });
            const { id, email } = extractToken;
            const invitedUser: user[] = await this.queryService.findUserById(id);

            if (email === invitedUser[0]?.email) {
                const createdMember = await this.memberService.create(
                    memberDto,
                    MEMBER_STATUS.ACTIVE,
                    MEMBER_ROLE.MEMBER,
                    memberDto.teamId,
                );
                return Responser({
                    statusCode: 201,
                    message: 'new member added to team',
                    devMessage: 'new member added to team',
                    body: createdMember,
                });
            }
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Failed to invite new member',
                    devMessage: err.message || '',
                },
                400,
            );
        }
    }

    async profile(id: string) {
        try {
            const profileUser = await this.queryService.findUserById(id);
            if (!profileUser) throw new NotFoundException('user not found');

            return Responser({
                statusCode: 200,
                message: 'profile success!',
                devMessage: 'success',
                body: profileUser,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'InValid',
                    devMessage: err.message || '',
                },
                401,
            );
        }
    }

    async allProfile() {
        try {
            const allUsers: user[] = await this.queryService.findAllUsers();
            if (!allUsers) throw new Error();

            return Responser({
                statusCode: 200,
                message: 'fetched user list successfully',
                devMessage: 'successfully fetched user list',
                body: {
                    count: allUsers.length,
                    data: allUsers,
                },
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'failed to fetched user list ',
                    devMessage: err.message || '',
                },
                404,
            );
        }
    }

    async updateProfile(dto: updateUserDto, id: string, Image?: Express.Multer.File) {
        try {
            const { email, name, password } = dto;
            const isUserExist: any = await this.queryService.findUserById(id);
            if (isUserExist.length === 0 || !isUserExist) throw new Error('user does not exist');
            let image: imageType = { id: '', name: '', path: '' };
            if (image) {
                image = await this.queryService.insertPhoto({
                    name: Image?.filename,
                    path: Image?.path,
                });
            }

            const updatedUser: any = await this.queryService.updateUser({
                id,
                email: email === '' ? isUserExist[0]?.email : email,
                name: name === '' ? isUserExist[0]?.user_name : name,
                password: password === '' ? isUserExist[0]?.password : password,
                imageId: image.id === '' ? isUserExist[0]?.imageId : image.id,
            });

            return Responser({
                statusCode: 201,
                message: 'profile updated successfully',
                devMessage: 'profile updated successfully',
                body: updatedUser,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Failed to update profile',
                    devMessage: err.message || '',
                },
                400,
            );
        }
    }

    private async generateToken({ id, email }) {
        const payload = {
            id,
            email,
        };

        if (!payload.email || !payload.id)
            throw new BadRequestException('Failed to generate token');

        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync(payload, {
                secret: process.env.JWT_ACCESS_TOKEN,
                expiresIn: '1d',
            }),

            this.jwt.signAsync(
                { id: id },
                { secret: process.env.JWT_REFRESH_TOKEN, expiresIn: '7d' },
            ),
        ]);

        return { accessToken, refreshToken };
    }
}

import {
    BadRequestException,
    HttpException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { loginUserDto, registerUserDto, updateUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Responser } from 'libs/Responser';
import { QueryService } from './auth.sql';
import { v4 as uuidV4 } from 'uuid';
import { user } from '@prisma/client';

interface imageType {
    id: string | undefined;
    path: string | undefined;
    name: string | undefined;
}
@Injectable()
export class AuthService {
    constructor(private readonly jwt: JwtService, private queryService: QueryService) {}

    async registerUser(dto: registerUserDto, Image?: Express.Multer.File) {
        const { email, password, name } = dto;
        console.log(dto);
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
            console.log('after created');

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
                    devMessage: 'Failed to register new user',
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

    async profile(id: string) {
        console.log('service');
        console.log(id);
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
            console.log('name', name);
            const isUserExist: any = await this.queryService.findUserById(id);
            if (isUserExist.length === 0 || !isUserExist) throw new Error('user does not exist');
            console.log(isUserExist);
            let image: imageType = { id: '', name: '', path: '' };
            if (image) {
                image = await this.queryService.insertPhoto({
                    name: Image?.filename,
                    path: Image?.path,
                });
            }

            console.log({
                imageId: image.id,
            });
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

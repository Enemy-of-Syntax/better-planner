import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { loginUserDto, registerUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Prisma, user } from '@prisma/client';
import { Responser } from 'libs/Responser';
import { QueryServie } from './user.sql';
import { v4 as uuidV4 } from 'uuid';
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly Jwt: JwtService,
    private queryService: QueryServie,
  ) {}

  async registerUser(dto: registerUserDto) {
    console.log(dto);
    const { email, password, name, organizationId } = dto;
    if (!email || !password || !name || !organizationId)
      throw new BadRequestException('please fills all input fields');

    try {
      //hash password
      const hashPw = await argon.hash(password);
      console.log(hashPw);

      const uuid: string = await uuidV4();
      console.log(uuid);

      const createUser = await this.queryService.insertNewUser({
        id: uuid,
        email,
        name,
        password: hashPw,
        organizationId,
      });

      // const createUser = await this.prisma.user.create({
      //   data: {
      //     id: uuid,
      //     email,
      //     password: hashPw,
      //     name,
      //     organizationId,
      //   },
      // });

      console.log(createUser);

      return Responser({
        statusCode: 201,
        message: 'registration success!',
        devMessage: 'new user created!',
        body: createUser,
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          message: 'error',
          devMessage: 'user register failed',
        },
        401,
      );
    }
  }

  async loginUser(dto: loginUserDto) {
    const { email, password } = dto;
    if (!email || !password)
      throw new BadRequestException('please fill all input fields');

    try {
      // const foundUser = this.queryService.findUserByEmail(email);
      // if (!foundUser) throw new UnauthorizedException('Wrong credentials');

      // const passwordMatch = await argon.verify(foundUser?.password, password);
      // if (!passwordMatch) throw new UnauthorizedException('Unauthorized');

      // const tokens = this.generateToken(foundUser.id, foundUser.email);

      return Responser({
        statusCode: 200,
        message: 'login success',
        devMessage: 'login success',
        body: 'fd',
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

  async generateToken(id: string, email: string) {
    const payload = {
      id,
      email,
    };
    if (!payload) throw new BadRequestException('Failed to generate token');

    const [accessToken, refreshToken] = await Promise.all([
      this.Jwt.signAsync(
        { payload },
        {
          secret: process.env.SECRET_KEY,
          expiresIn: '1d',
        },
      ),

      this.Jwt.signAsync(
        { id: id },
        { secret: process.env.REFRESH_KEY, expiresIn: '7d' },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}

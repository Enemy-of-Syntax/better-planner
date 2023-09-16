import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { loginUserDto, registerUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Responser } from 'libs/Responser';
import { QueryServie } from './auth.sql';
import { v4 as uuidV4 } from 'uuid';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private queryService: QueryServie,
  ) {}

  async registerUser(dto: registerUserDto) {
    const { email, password, name, organizationId } = dto;
    try {
      const hashPw = await argon.hash(password);
      const uuid: string = await uuidV4();

      const createUser = await this.queryService.insertNewUser({
        id: uuid,
        email,
        name,
        password: hashPw,
        organizationId,
      });

      return Responser({
        statusCode: 201,
        message: 'registration success!',
        devMessage: 'new user created!',
        body: createUser,
      });
    } catch (err) {
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
    try {
      const foundUser = await this.queryService.findUserByEmail(email);
      if (!foundUser) throw new UnauthorizedException('Wrong credentials');

      const passwordMatch = await argon.verify(foundUser[0].password, password);
      if (!passwordMatch)
        throw new UnauthorizedException("Password doesn't match");

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
    try {
      const profileUser = await this.queryService.findUserById(id);
      if (!profileUser) throw new NotFoundException('user not found');

      return Responser({
        statusCode: 200,
        message: 'profile success!',
        devMessage: 'success',
        body: profileUser,
      });
    } catch (err) {
      throw new HttpException(
        {
          message: 'Unvalid',
          devMessage: 'Unvalid',
        },
        401,
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
        secret: process.env.SECRET_KEY,
        expiresIn: '1d',
      }),

      this.jwt.signAsync(
        { id: id },
        { secret: process.env.REFRESH_KEY, expiresIn: '7d' },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}

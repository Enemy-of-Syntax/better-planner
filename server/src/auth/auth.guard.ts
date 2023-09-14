import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token)
      throw new HttpException(
        {
          message: 'token not found',
          devMessage: 'token not found',
        },
        401,
      );

    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: process.env.SECRET_KEY,
      });
      console.log(payload);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token not found');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : 'null';
  }
}

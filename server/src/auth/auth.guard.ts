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
        console.log(token);
        if (!token)
            throw new HttpException(
                {
                    message: 'token not found',
                    devMessage: 'token not found',
                },
                401,
            );

        console.log('reach');

        try {
            const payload = await this.jwt.verifyAsync(token, {
                secret: process.env.JWT_ACCESS_TOKEN,
            });
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException('Token not found');
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { QueryServie } from './user.sql';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtService, QueryServie],
})
export class UserModule {}

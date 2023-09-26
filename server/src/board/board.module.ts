import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { BoardSql } from './board.sql';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    controllers: [BoardController],
    providers: [BoardService, BoardSql, PrismaService, JwtService],
})
export class BoardModule {}

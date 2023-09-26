import { HttpException, Injectable } from '@nestjs/common';
import { boardDto } from './dto/board.dto';
import { Responser } from 'libs/Responser';
import { v4 as uuidV4 } from 'uuid';
import { BoardSql } from './board.sql';

@Injectable()
export class BoardService {
    constructor(private readonly boardQuery: BoardSql) {}

    async getAllBoards() {
        try {
            const boardList = await this.boardQuery.getAllBoards();

            return Responser({
                statusCode: 200,
                message: 'Successfully fetched board lists',
                devMessage: 'Successfully fetched board lists',
                body: boardList,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Failed to fetch board lists',
                    devMessage: err.message || '',
                },
                404,
            );
        }
    }

    async getDetail(id: string) {
        try {
            const boardDetail: any = await this.boardQuery.getSingleBoard(id);
            if (boardDetail.length === 0) throw new Error('board detail not found');
            return Responser({
                statusCode: 200,
                message: 'Successfully fetched board lists',
                devMessage: 'Successfully fetched board lists',
                body: boardDetail,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Failed to fetch board lists',
                    devMessage: err.message || '',
                },
                404,
            );
        }
    }

    async createBoard(dto: boardDto, userId: string) {
        try {
            const id: string = await uuidV4();
            const newBoard = await this.boardQuery.createBoard(id, dto, userId);
            if (!newBoard) throw new Error();
            return Responser({
                statusCode: 200,
                message: 'Successfully fetched board lists',
                devMessage: 'Successfully fetched board lists',
                body: newBoard,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Failed to fetch board lists',
                    devMessage: err.message || '',
                },
                404,
            );
        }
    }

    async updateBoard(id: string, dto: boardDto) {
        const isBoardExist: any = await this.boardQuery.getSingleBoard(id);
        if (isBoardExist.length === 0) throw new Error('board does not exist');

        try {
            const updateBoard: any = await this.boardQuery.updateBoard(id, dto);
            if (updateBoard.length === 0) throw new Error();

            return Responser({
                statusCode: 200,
                message: 'Successfully fetched board lists',
                devMessage: 'Successfully fetched board lists',
                body: updateBoard,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Failed to fetch board lists',
                    devMessage: err.message || '',
                },
                404,
            );
        }
    }

    async deleteBoard(id: string) {
        const isBoardExist: any = await this.boardQuery.getSingleBoard(id);
        if (isBoardExist.length === 0) throw new Error('board does not exist');
        try {
            const deletedBoard = await this.boardQuery.deleteBoard(id);
            if (!deletedBoard) throw new Error();
            return Responser({
                statusCode: 200,
                message: 'Successfully fetched board lists',
                devMessage: 'Successfully fetched board lists',
                body: deletedBoard,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Failed to fetch board lists',
                    devMessage: err.message || '',
                },
                404,
            );
        }
    }
}

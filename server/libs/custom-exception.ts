import { HttpException } from '@nestjs/common';

export class ErrorException extends HttpException {
    constructor(status: number, message: string, devMessage: string) {
        super({ status, message, devMessage }, status);
    }
}

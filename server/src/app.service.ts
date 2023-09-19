import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Swagger Route => localhost:3000/api';
    }
}

import { PipeTransform, Injectable, HttpException } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
    transform(value: any) {
        if (value) {
            if (value.size > 10 * 1024 * 1024) {
                throw new HttpException(
                    {
                        devMessage: 'file-size-exceed',
                        message: 'File cannot be uploaded',
                    },
                    404,
                );
            } else {
                return value;
            }
        }
    }
}

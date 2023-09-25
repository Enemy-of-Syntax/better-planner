import { NestFactory } from '@nestjs/core';
// import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

const PORT: string | undefined = process.env.PORT;
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('Project Management System ')
        .setTermsOfService('Terms of service')
        .setDescription('PMS API')
        .setVersion('1.0')
        .build();
    console.log(new Date());
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(Number(PORT));
}
bootstrap();

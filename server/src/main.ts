import { NestFactory, Reflector } from '@nestjs/core';
// import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

const PORT: string | undefined = process.env.PORT;
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // Use ClassSerializerInterceptor to transform responses
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    // Use ValidationPipe with the class-validator package
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Use the container for class-validator
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.enableCors();

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

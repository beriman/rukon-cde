import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    // CORS
    app.enableCors();

    // Swagger/OpenAPI Documentation
    const config = new DocumentBuilder()
        .setTitle('Rukon CDE API')
        .setDescription('ISO 19650 Compliant Common Data Environment Platform API')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth',
        )
        .addTag('Auth', 'Authentication and authorization endpoints')
        .addTag('Users', 'User management endpoints')
        .addTag('Organizations', 'Organization management endpoints')
        .addTag('Projects', 'Project management endpoints')
        .addTag('Folders', 'Folder management endpoints')
        .addTag('Files', 'File upload, download, and versioning endpoints')
        .addTag('Notifications', 'Notification center endpoints')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });

    await app.listen(3001);
    console.log(`🚀 Application is running on: http://localhost:3001`);
    console.log(`📚 API Documentation: http://localhost:3001/api/docs`);
}
bootstrap();

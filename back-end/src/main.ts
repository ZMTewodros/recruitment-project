import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // 2. Enable Validation Globally
  // This makes the class-validator decorators in your DTOs actually work
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away properties that are not in the DTO
      forbidNonWhitelisted: true, // Throws error if unauthorized fields are sent
      transform: true, // Automatically transforms types (e.g., string to number)
    }),
  );

  // 3. Enable CORS
  // This allows your friend's frontend to access your backend
  app.enableCors({
    origin: 'http://localhost:3000', // Replace with your friend's frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 4. Start the server
  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(
    `🚀 Recruitment Backend is running on: http://localhost:${port}/api`,
  );
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});

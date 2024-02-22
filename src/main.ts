import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Se habilita el metodo para poder manejar un solo dominio entre angular y nest (backend)
  app.enableCors();

  //Esta funcion hace referencia a que la informacion debe venir como se
  //la espera de lo contrario la rechaza
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
   );



  await app.listen(3000);
}
bootstrap();

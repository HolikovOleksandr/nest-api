import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { configDotenv } from 'dotenv'
import { ValidationPipe } from '@nestjs/common'
configDotenv()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  await app.listen(3000)
}

bootstrap()

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RequestsModule } from './requests/requests.module';
import { User } from './users/entities/user.entity';
import { Request } from './requests/entities/request.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
  }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Request],
      synchronize: true,
    }),
    AuthModule,
    RequestsModule,
    UsersModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}

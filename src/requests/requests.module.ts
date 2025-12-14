import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { Request } from './entities/request.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { RequestOwnerGuard } from './guards/request-owner.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request]),
    UsersModule,
    AuthModule,
  ],
  controllers: [RequestsController],
  providers: [RequestsService, RequestOwnerGuard],
  exports: [RequestsService],
})
export class RequestsModule {}

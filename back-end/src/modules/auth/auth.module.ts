import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '@/modules/users/users.module';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  imports: [UsersModule],
  providers: [AuthService]
})
export class AuthModule { }

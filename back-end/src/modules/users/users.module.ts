import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MailUtility } from '@/utils/mail.utility';

@Module({
  providers: [UsersService, MailUtility],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule { }

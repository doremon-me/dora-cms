import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

import { DBModule } from '@db/db.module';
import { UsersController } from './users.controller';

@Module({
  imports: [DBModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule { }

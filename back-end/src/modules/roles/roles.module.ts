import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { DBModule } from '@/db/db.module';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [DBModule]
})
export class RolesModule { }

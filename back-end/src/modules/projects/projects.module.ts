import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { DBModule } from '@/db/db.module';
import { ProjectsController } from './projects.controller';

@Module({
  imports: [DBModule],
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule { }

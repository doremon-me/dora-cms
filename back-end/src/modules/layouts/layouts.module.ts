import { Module } from '@nestjs/common';
import { LayoutsController } from './layouts.controller';
import { LayoutsService } from './layouts.service';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  controllers: [LayoutsController],
  providers: [LayoutsService],
  imports: [ProjectsModule]
})
export class LayoutsModule { }

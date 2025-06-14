import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config"
import { JwtModule } from '@nestjs/jwt';

import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: '2h',
      algorithm: 'HS256',
      header: {
        typ: 'JWT',
        alg: 'HS256',
      },
    },
  }), ThrottlerModule.forRoot({
    throttlers: [
      {
        ttl: 60000,
        limit: 10
      }
    ]
  }), AuthModule, ProjectsModule],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard }
  ]
})
export class AppModule { }

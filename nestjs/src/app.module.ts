import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { MetricsModule } from './metrics/metrics.module';

import { AppController } from './app.controller';

import { AppService } from './app.service';

import { join } from 'path';

@Module({

  imports: [

    ConfigModule.forRoot({

      isGlobal: true,

      // This path.join forces the app to look in the base 'nestjs' folder

      envFilePath: join(__dirname, '..', '.env'), 

    }),

    MetricsModule,

  ],

  controllers: [AppController],

  providers: [AppService],

})

export class AppModule {}
 
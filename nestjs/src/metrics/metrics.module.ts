import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SupabaseModule } from '../supabase/supabase.module';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
@Module({
  imports: [HttpModule, SupabaseModule],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule {}

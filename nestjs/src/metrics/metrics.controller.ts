import { Controller, Get } from '@nestjs/common';

import { MetricsService } from './metrics.service';

@Controller('api/metrics')

export class MetricsController {

  constructor(private readonly metricsService: MetricsService) {}

  @Get('total-incidents')

  getTotalIncidents() {

    return this.metricsService.getOpenIncidentsCount();

  }

}
 
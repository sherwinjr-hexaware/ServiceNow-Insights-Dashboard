import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { MetricsService } from './metrics.service';
@Controller('api/metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}
  @Get('dashboards')
  async getAllDashboards() {
    return await this.metricsService.getAllDashboards();
  }
  @Get('dashboards/:id')
  async getDashboardById(@Param('id') id: string) {
    const dashboard = await this.metricsService.getDashboardWithWidgets(id);
    if (!dashboard || !dashboard.success) {
      throw new NotFoundException(`Dashboard with ID "${id}" not found.`);
    }
    return dashboard;
  }
  @Get('scorecard')
  async getScorecard() {
    return await this.metricsService.getScorecardMetrics();
  }
  @Get('charts')
  async getCharts() {
    return await this.metricsService.getChartMetrics();
  }
  @Get('top-callers')
  async getTopCallers() {
    return await this.metricsService.getTopCallersMetrics();
  }
}

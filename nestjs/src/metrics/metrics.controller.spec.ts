import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { NotFoundException } from '@nestjs/common';
const mockMetricsService = {
  getAllDashboards: jest.fn(),
  getDashboardWithWidgets: jest.fn(),
  getScorecardMetrics: jest.fn(),
  getChartMetrics: jest.fn(),
  getTopCallersMetrics: jest.fn(),
};
describe('MetricsController', () => {
  let controller: MetricsController;
  let service: MetricsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [
        {
          provide: MetricsService,
          useValue: mockMetricsService,
        },
      ],
    }).compile();
    controller = module.get<MetricsController>(MetricsController);
    service = module.get<MetricsService>(MetricsService);
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('getAllDashboards', () => {
    it('should return an array of dashboards', async () => {
      const result = [{ id: 'd1', name: 'Dashboard 1' }];
      jest.spyOn(service, 'getAllDashboards').mockResolvedValue(result);
      expect(await controller.getAllDashboards()).toBe(result);
      expect(service.getAllDashboards).toHaveBeenCalled();
    });
  });
  describe('getDashboardById', () => {
    const dashboardId = 'test-id';
    const mockDashboardResult = {
      success: true,
      data: { id: dashboardId, name: 'Test Dashboard' },
    };
    it('should return a dashboard if found', async () => {
      jest
        .spyOn(service, 'getDashboardWithWidgets')
        .mockResolvedValue(mockDashboardResult);
      expect(await controller.getDashboardById(dashboardId)).toBe(
        mockDashboardResult,
      );
      expect(service.getDashboardWithWidgets).toHaveBeenCalledWith(dashboardId);
    });
    it('should throw NotFoundException if dashboard not found (null)', async () => {
      jest.spyOn(service, 'getDashboardWithWidgets').mockResolvedValue(null);
      await expect(controller.getDashboardById(dashboardId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.getDashboardWithWidgets).toHaveBeenCalledWith(dashboardId);
    });
    it('should throw NotFoundException if dashboard not found (success: false)', async () => {
      jest
        .spyOn(service, 'getDashboardWithWidgets')
        .mockResolvedValue({ success: false, data: null, error: 'not found' });
      await expect(controller.getDashboardById(dashboardId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.getDashboardWithWidgets).toHaveBeenCalledWith(dashboardId);
    });
  });
  describe('getScorecard', () => {
    it('should return scorecard metrics', async () => {
      const result = { success: true, data: { m1: 1 } };
      jest.spyOn(service, 'getScorecardMetrics').mockResolvedValue(result);
      expect(await controller.getScorecard()).toBe(result);
      expect(service.getScorecardMetrics).toHaveBeenCalled();
    });
  });
  describe('getCharts', () => {
    it('should return chart metrics', async () => {
      const result = { success: true, data: { priority: [] } };
      jest.spyOn(service, 'getChartMetrics').mockResolvedValue(result);
      expect(await controller.getCharts()).toBe(result);
      expect(service.getChartMetrics).toHaveBeenCalled();
    });
  });
  describe('getTopCallers', () => {
    it('should return top callers metrics', async () => {
      const result = { success: true, data: { topMonthlyCallers: [] } };
      jest.spyOn(service, 'getTopCallersMetrics').mockResolvedValue(result);
      expect(await controller.getTopCallers()).toBe(result);
      expect(service.getTopCallersMetrics).toHaveBeenCalled();
    });
  });
});

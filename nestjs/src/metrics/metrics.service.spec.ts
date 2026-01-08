import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
const mockSupabaseService = {
  getDashboardAndWidgetsById: jest.fn(),
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        then: jest.fn((callback) => callback({ data: [], error: null })),
      })),
    })),
  },
};
describe('MetricsService', () => {
  let service: MetricsService;
  let supabaseService: SupabaseService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();
    service = module.get<MetricsService>(MetricsService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getDashboardWithWidgets', () => {
    const dashboardId = 'test-dashboard-id';
    const mockDashboardData = {
      id: dashboardId,
      name: 'Test Dashboard',
      widgets: [{ id: 'w1', name: 'Widget 1' }],
    };
    it('should return dashboard data if found', async () => {
      jest
        .spyOn(supabaseService, 'getDashboardAndWidgetsById')
        .mockResolvedValue(mockDashboardData);
      const result = await service.getDashboardWithWidgets(dashboardId);
      expect(result).toEqual({ success: true, data: mockDashboardData });
      expect(supabaseService.getDashboardAndWidgetsById).toHaveBeenCalledWith(
        dashboardId,
      );
    });
    it('should return null if dashboard not found', async () => {
      jest
        .spyOn(supabaseService, 'getDashboardAndWidgetsById')
        .mockResolvedValue(null);
      const result = await service.getDashboardWithWidgets(dashboardId);
      expect(result).toBeNull();
      expect(supabaseService.getDashboardAndWidgetsById).toHaveBeenCalledWith(
        dashboardId,
      );
    });
    it('should return error details if fetching dashboard fails', async () => {
      const errorMessage = 'Supabase error';
      jest
        .spyOn(supabaseService, 'getDashboardAndWidgetsById')
        .mockRejectedValue(new Error(errorMessage));
      const result = await service.getDashboardWithWidgets(dashboardId);
      expect(result).toEqual({
        success: false,
        data: null,
        error: errorMessage,
      });
      expect(supabaseService.getDashboardAndWidgetsById).toHaveBeenCalledWith(
        dashboardId,
      );
    });
  });
  describe('getAllDashboards', () => {
    const mockDashboardsList = [
      { id: 'd1', name: 'Dashboard 1', description: 'Desc 1' },
      { id: 'd2', name: 'Dashboard 2', description: 'Desc 2' },
    ];
    it('should return a list of dashboards', async () => {
      (supabaseService.supabase.from as jest.Mock).mockReturnThis();
      (
        supabaseService.supabase.from('dashboard').select as jest.Mock
      ).mockReturnValue({
        then: (callback) => callback({ data: mockDashboardsList, error: null }),
      });
      const result = await service.getAllDashboards();
      expect(result).toEqual(mockDashboardsList);
      expect(supabaseService.supabase.from).toHaveBeenCalledWith('dashboard');
      expect(
        supabaseService.supabase.from('dashboard').select,
      ).toHaveBeenCalledWith('id, name, description');
    });
    it('should return an empty array if fetching dashboards fails', async () => {
      const errorMessage = 'Supabase fetch error';
      (supabaseService.supabase.from as jest.Mock).mockReturnThis();
      (
        supabaseService.supabase.from('dashboard').select as jest.Mock
      ).mockReturnValue({
        then: (callback) =>
          callback({ data: null, error: { message: errorMessage } }),
      });
      const result = await service.getAllDashboards();
      expect(result).toEqual([]);
      expect(supabaseService.supabase.from).toHaveBeenCalledWith('dashboard');
    });
  });
});

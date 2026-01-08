import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from './supabase.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  })),
}));
describe('SupabaseService', () => {
  let service: SupabaseService;
  let mockSupabaseClient: jest.Mocked<SupabaseClient>;
  let mockFrom: jest.Mock;
  let mockSelect: jest.Mock;
  let mockEq: jest.Mock;
  let mockSingle: jest.Mock;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupabaseService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'SUPABASE_URL') return 'http://mock.supabase.url';
              if (key === 'SUPABASE_KEY') return 'mock_supabase_key';
              return null;
            }),
          },
        },
      ],
    }).compile();
    service = module.get<SupabaseService>(SupabaseService);
    const clientInstance = createClient('url', 'key');
    mockSupabaseClient = clientInstance as jest.Mocked<SupabaseClient>;
    mockFrom = mockSupabaseClient.from as jest.Mock;
    mockSelect = mockFrom().select as jest.Mock;
    mockEq = mockSelect().eq as jest.Mock;
    mockSingle = mockEq().single as jest.Mock;
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getDashboardAndWidgetsById', () => {
    const dashboardId = 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1';
    const mockDashboard = {
      id: dashboardId,
      name: 'Test Dashboard',
      description: 'desc',
    };
    const mockWidgets = [
      { id: 'w1', dashboard_id: dashboardId, name: 'Widget 1' },
      { id: 'w2', dashboard_id: dashboardId, name: 'Widget 2' },
    ];
    it('should return a dashboard with widgets if found', async () => {
      mockSingle.mockResolvedValueOnce({ data: mockDashboard, error: null });
      mockFrom().select.mockReturnValueOnce({
        eq: jest.fn().mockResolvedValue({ data: mockWidgets, error: null }),
      });
      const result = await service.getDashboardAndWidgetsById(dashboardId);
      expect(mockFrom).toHaveBeenCalledWith('dashboard');
      expect(mockEq).toHaveBeenCalledWith('id', dashboardId);
      expect(result).toEqual({ ...mockDashboard, widgets: mockWidgets });
    });
    it('should return null if dashboard not found', async () => {
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { code: 'PGRST116' },
      });
      mockFrom().select.mockReturnValueOnce({
        eq: jest.fn().mockResolvedValue({ data: [], error: null }),
      });
      const result = await service.getDashboardAndWidgetsById(dashboardId);
      expect(mockFrom).toHaveBeenCalledWith('dashboard');
      expect(mockEq).toHaveBeenCalledWith('id', dashboardId);
      expect(result).toBeNull();
    });
    it('should throw error if dashboard fetch fails', async () => {
      const mockError = new Error('Database error');
      mockSingle.mockResolvedValueOnce({ data: null, error: mockError });
      await expect(
        service.getDashboardAndWidgetsById(dashboardId),
      ).rejects.toThrow(mockError);
    });
    it('should throw error if widgets fetch fails', async () => {
      const mockError = new Error('Widget fetch error');
      mockSingle.mockResolvedValueOnce({ data: mockDashboard, error: null });
      mockFrom().select.mockReturnValueOnce({
        eq: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      });
      await expect(
        service.getDashboardAndWidgetsById(dashboardId),
      ).rejects.toThrow(mockError);
    });
  });
  describe('getDashboardAndWidgetsByName', () => {
    const dashboardName = 'Test Dashboard';
    const dashboardId = 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1';
    const mockDashboard = {
      id: dashboardId,
      name: dashboardName,
      description: 'desc',
    };
    const mockWidgets = [
      { id: 'w1', dashboard_id: dashboardId, name: 'Widget 1' },
    ];
    it('should return a dashboard with widgets if found by name', async () => {
      mockSingle.mockResolvedValueOnce({ data: mockDashboard, error: null });
      mockFrom().select.mockReturnValueOnce({
        eq: jest.fn().mockResolvedValue({ data: mockWidgets, error: null }),
      });
      const result = await service.getDashboardAndWidgetsByName(dashboardName);
      expect(mockFrom).toHaveBeenCalledWith('dashboard');
      expect(mockEq).toHaveBeenCalledWith('name', dashboardName);
      expect(result).toEqual({ ...mockDashboard, widgets: mockWidgets });
    });
    it('should return null if dashboard not found by name', async () => {
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { code: 'PGRST116' },
      });
      mockFrom().select.mockReturnValueOnce({
        eq: jest.fn().mockResolvedValue({ data: [], error: null }),
      });
      const result = await service.getDashboardAndWidgetsByName(dashboardName);
      expect(mockFrom).toHaveBeenCalledWith('dashboard');
      expect(mockEq).toHaveBeenCalledWith('name', dashboardName);
      expect(result).toBeNull();
    });
  });
});

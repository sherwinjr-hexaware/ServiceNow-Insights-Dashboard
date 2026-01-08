import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabase: SupabaseClient;
  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      this.logger.error('Supabase URL or Key not found in configuration.');
      throw new Error('Supabase configuration is missing.');
    }
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.logger.log('Supabase client initialized.');
  }
  async getDashboardAndWidgetsByName(
    dashboardName: string,
  ): Promise<any | null> {
    try {
      const { data: dashboardData, error: dashboardError } = await this.supabase
        .from('dashboard')
        .select('*')
        .eq('name', dashboardName)
        .single();
      if (dashboardError) {
        if (dashboardError.code === 'PGRST116') {
          this.logger.warn(`Dashboard "${dashboardName}" not found.`);
          return null;
        }
        throw dashboardError;
      }
      if (!dashboardData) {
        return null;
      }
      const { data: widgetsData, error: widgetsError } = await this.supabase
        .from('dashboard_widget_mapping')
        .select('*')
        .eq('dashboard_id', dashboardData.id);
      if (widgetsError) {
        throw widgetsError;
      }
      return {
        ...dashboardData,
        widgets: widgetsData || [],
      };
    } catch (error) {
      this.logger.error(
        `Error fetching dashboard "${dashboardName}": ${error.message}`,
      );
      throw error;
    }
  }
  async getDashboardAndWidgetsById(dashboardId: string): Promise<any | null> {
    try {
      const { data: dashboardData, error: dashboardError } = await this.supabase
        .from('dashboard')
        .select('*')
        .eq('id', dashboardId)
        .single();
      if (dashboardError) {
        if (dashboardError.code === 'PGRST116') {
          this.logger.warn(`Dashboard with ID "${dashboardId}" not found.`);
          return null;
        }
        throw dashboardError;
      }
      if (!dashboardData) {
        return null;
      }
      const { data: widgetsData, error: widgetsError } = await this.supabase
        .from('dashboard_widget_mapping')
        .select('*')
        .eq('dashboard_id', dashboardData.id);
      if (widgetsError) {
        throw widgetsError;
      }
      return {
        ...dashboardData,
        widgets: widgetsData || [],
      };
    } catch (error) {
      this.logger.error(
        `Error fetching dashboard with ID "${dashboardId}": ${error.message}`,
      );
      throw error;
    }
  }
  async getAllDashboardsMinimal(): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('dashboard')
        .select('id, name, description');
      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      this.logger.error(
        `Error fetching all dashboards minimally: ${error.message}`,
      );
      throw error;
    }
  }
}

import { API_URL } from '../config';

export interface DashboardWidget {
  id: string;
  dashboard_id: string;
  name: string;
  widget_type: string;
  config: Record<string, any>;
  position: Record<string, any>;
  created_at: string;
  updated_at: string;
}
export interface Dashboard {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  widgets?: DashboardWidget[];
}
export const getAllDashboards = async (): Promise<Dashboard[]> => {
  const response = await fetch(`${API_URL}/dashboards`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Network response was not ok');
  }
  const result = await response.json();
  return result;
};
export const getDashboardWithWidgets = async (id: string): Promise<Dashboard> => {
  const response = await fetch(`${API_URL}/dashboards/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Network response was not ok');
  }
  const result = await response.json();
  if (result.success && result.data) {
    return result.data;
  } else {
    throw new Error(result.error || 'Failed to retrieve dashboard data.');
  }
};

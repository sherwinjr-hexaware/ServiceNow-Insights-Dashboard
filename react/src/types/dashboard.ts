export interface AnalyticKPIData {
  title: string;
  value: string | number;
  link: {
    prefix: string;
    url: string;
    text: string;
  };
  icon: {
    name: string;
    color: string;
  };
}

export interface UserEngagementTab {
  key: 'newUser' | 'avgSession' | 'subscribers' | 'pageViews';
  title: string;
  value: string;
}

export interface UserEngagementData {
  actual: number[];
  projected: number[];
}

export interface UserEngagementChartData {
  newUser: UserEngagementData;
  avgSession: UserEngagementData;
  subscribers: UserEngagementData;
  pageViews: UserEngagementData;
}

export interface TopCampaignsData {
  campaign: string;
  users: number;
}

export interface UserByCountryData {
  id: number;
  country: {
    name: string;
    flag: string;
  };
  totalUsers: number;
  newUsers: number;
  engagedSessions: number;
  growthRate: string;
  actions?: boolean;
}

export interface OSUserData {
  name: string;
  value: number;
  children?: OSUserData[];
}

export interface SessionByOSData {
  actual: number[];
  projected: number[];
}

export interface UserByCohortData {
  time: string;
  count: number;
  engagements: number[];
}

export interface ClientLocation {
  name: string;
  value: number;
}

// New interfaces for Dashboard and DashboardWidget
export interface DashboardWidget {
  id: string;
  dashboard_id: string;
  name: string;
  widget_type: string;
  config: Record<string, any>; // JSONB type in Supabase, maps to object in TS
  position: Record<string, any>; // JSONB type in Supabase, maps to object in TS
  created_at: string;
  updated_at: string;
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  widgets?: DashboardWidget[]; // Optional, will be present when fetching a single dashboard with widgets
}

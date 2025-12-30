import { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';

import Paper from '@mui/material/Paper';

import Typography from '@mui/material/Typography';

import {

  analyticKPIs,

  topCampaignsChartData,

  userByCountryData,

  userEngagementChartData,

} from 'data/dashboard';

import AnalyticKPI from 'components/sections/dashboards/analytics/kpi/AnalyticKPI';

import TopCampaigns from 'components/sections/dashboards/analytics/top-campaigns/TopCampaigns';

import UserByCountry from 'components/sections/dashboards/analytics/user-by-country/UserByCountry';

import UserEngagement from 'components/sections/dashboards/analytics/user-engagement/UserEngagement';

import ProPlanCTA from 'components/sections/dashboards/analytics/cta/ProPlanCTA';

import { getLiveIncidentCount } from '../../lib/metrics';

const Analytics = () => {

  const [incidentCount, setIncidentCount] = useState<number>(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchIncidents = async () => {

      const data = await getLiveIncidentCount();

      if (data.success) {

        setIncidentCount(data.totalOpenIncidents);

      }

      setLoading(false);

    };

    fetchIncidents();

    const interval = setInterval(fetchIncidents, 300000);

    return () => clearInterval(interval);

  }, []);

  return (
<Grid container spacing={3}>

      {/* Existing KPIs */}

      {analyticKPIs.map((kpi) => (
<Grid key={kpi.title} size={{ xs: 6, md: 3, xl: 2 }}>
<AnalyticKPI kpi={kpi} />
</Grid>

      ))}

      {/* ✅ Live ServiceNow KPI */}
<Grid size={{ xs: 12, md: 4 }}>
<Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
<Typography variant="h6" color="text.secondary">

            Live Open Incidents
</Typography>
<Typography

            variant="h2"

            sx={{ fontWeight: 'bold', color: '#1976d2' }}
>

            {loading ? '...' : incidentCount}
</Typography>
<Typography variant="caption">

            ServiceNow (Real-Time)
</Typography>
</Paper>
</Grid>
<Grid size={{ xs: 12, lg: 7 }}>
<UserEngagement data={userEngagementChartData} />
</Grid>
<Grid size={{ xs: 12, lg: 5 }}>
<TopCampaigns data={topCampaignsChartData} />
</Grid>
<Grid size={{ xs: 12 }}>
<UserByCountry data={userByCountryData} />
</Grid>
<Grid size={{ xs: 12 }}>
<ProPlanCTA />
</Grid>
</Grid>

  );

};

export default Analytics;
 
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import {
  topCampaignsChartData,
  userByCountryData,
  userEngagementChartData,

} from 'data/dashboard';
import AnalyticKPI from 'components/sections/dashboards/analytics/kpi/AnalyticKPI';
import TopCampaigns from 'components/sections/dashboards/analytics/top-campaigns/TopCampaigns';
import UserByCountry from 'components/sections/dashboards/analytics/user-by-country/UserByCountry';
import UserEngagement from 'components/sections/dashboards/analytics/user-engagement/UserEngagement';
import ProPlanCTA from 'components/sections/dashboards/analytics/cta/ProPlanCTA';
import { getScorecardMetrics } from '../../lib/metrics';
const Analytics = () => {
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({

    m1: 0,

    m6: 0,

    m10: 0,

  });

  useEffect(() => {

    const fetchScorecard = async () => {

      const res = await getScorecardMetrics();

      if (res.success) {

        setMetrics(res.data);

      }

      setLoading(false);

    };

    fetchScorecard();

    const interval = setInterval(fetchScorecard, 300000);

    return () => clearInterval(interval);

  }, []);


  const analyticKPIs = [

    {

      title: 'Active Incidents',

      value: loading ? '...' : metrics.m1, 

      icon: { name: 'mdi:alert-circle-outline', color: 'primary' },

      link: { prefix: 'View', text: 'active incidents', url: '#' },

    },

    {

      title: 'Unassigned Incidents',

      value: loading ? '...' : metrics.m6, 

      icon: { name: 'mdi:account-off-outline', color: 'warning' },

      link: { prefix: 'View', text: 'unassigned incidents', url: '#' },

    },

    {

      title: 'Stale Incidents',

      value: loading ? '...' : metrics.m10, 

      icon: { name: 'mdi:clock-alert-outline', color: 'error' },

      link: { prefix: 'View', text: 'stale incidents', url: '#' },

    },

    {

      title: 'Active Referrals',

      value: 470,

      icon: { name: 'mdi:link-variant', color: 'info' },

      link: { prefix: 'See all', text: 'referrals', url: '#' },

    },

  ];

  return (
<Grid container spacing={3}>

      {analyticKPIs.map((kpi) => (
<Grid key={kpi.title} size={{ xs: 6, md: 3, xl: 2 }}>
<AnalyticKPI kpi={kpi} />
</Grid>

      ))}

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
 
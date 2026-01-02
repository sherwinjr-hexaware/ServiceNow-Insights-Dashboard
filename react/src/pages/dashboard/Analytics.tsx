import { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';

import AnalyticKPI from 'components/sections/dashboards/analytics/kpi/AnalyticKPI';

import ProPlanCTA from 'components/sections/dashboards/analytics/cta/ProPlanCTA';

import PriorityPie from 'components/charts/PriorityPie';

import CategoryBar from 'components/charts/CategoryBar';

import { getScorecardMetrics, getChartMetrics } from 'lib/metrics';

const Analytics = () => {

  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({ m1: 0, m6: 0, m10: 0 });

  const [charts, setCharts] = useState<any>(null);

  useEffect(() => {

    const fetchAll = async () => {

      const [scoreRes, chartRes] = await Promise.all([

        getScorecardMetrics(),

        getChartMetrics(),

      ]);

      if (scoreRes.success) setMetrics(scoreRes.data);

      if (chartRes.success) setCharts(chartRes.data);

      setLoading(false);

    };

    fetchAll();

  }, []);

 

  const kpiData = [

    {

      title: 'Active Incidents',

      value: loading ? '...' : metrics.m1,

      icon: { name: 'mdi:alert-circle-outline', color: 'primary' },

      link: { prefix: 'View', text: 'active', url: '#' },

    },

    {

      title: 'Unassigned',

      value: loading ? '...' : metrics.m6,

      icon: { name: 'mdi:account-off-outline', color: 'warning' },

      link: { prefix: 'View', text: 'unassigned', url: '#' },

    },

    {

      title: 'Stale Data',

      value: loading ? '...' : metrics.m10,

      icon: { name: 'mdi:clock-alert-outline', color: 'error' },

      link: { prefix: 'View', text: 'stale', url: '#' },

    },

  ];

  

  return (
<Grid container spacing={3}>


      {kpiData.map((kpi) => (
<Grid key={kpi.title} size={{ xs: 12, md: 4 }}>
<AnalyticKPI kpi={kpi} />
</Grid>

      ))}


<Grid size={{ xs: 12, md: 6 }}>

        {charts && <PriorityPie data={charts.priority} />}
</Grid>

<Grid size={{ xs: 12, md: 6 }}>

        {charts && <CategoryBar data={charts.category} />}
</Grid>


<Grid size={{ xs: 12 }}>
<ProPlanCTA />
</Grid>
</Grid>

  );

};

export default Analytics;
 
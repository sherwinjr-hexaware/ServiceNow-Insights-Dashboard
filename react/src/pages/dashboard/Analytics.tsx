import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { getChartMetrics, getScorecardMetrics, getTopCallersMetrics } from 'lib/metrics';
// Import TopCallersTable
import { useRefresh } from 'providers/RefreshProvider';
import CategoryBar from 'components/charts/CategoryBar';
import CriticalBacklogChart from 'components/charts/CriticalBacklogChart';
import GroupWorkload from 'components/charts/GroupWorkload';
import PriorityPie from 'components/charts/PriorityPie';
import SlaBreachChart from 'components/charts/SlaBreachChart';
import StateFunnel from 'components/charts/StateFunnel';
import ProPlanCTA from 'components/sections/dashboards/analytics/cta/ProPlanCTA';
import AnalyticKPI from 'components/sections/dashboards/analytics/kpi/AnalyticKPI';
import TopCallersTable from 'components/tables/TopCallersTable';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ m1: 0, m6: 0, m10: 0 });
  const [charts, setCharts] = useState<any>({
    priority: [],
    category: [],
    group: [],
    state: [],
    slaBreach: [],
    criticalBacklog: 0,
  });
  const [topCallersData, setTopCallersData] = useState<any[]>([]); // New state for top callers
  const { refreshCount } = useRefresh();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [scoreRes, chartRes, topCallersRes] = await Promise.all([
        getScorecardMetrics(),
        getChartMetrics(),
        getTopCallersMetrics(), // Fetch top callers metrics
      ]);

      if (scoreRes.success) setMetrics(scoreRes.data);
      if (chartRes.success) setCharts(chartRes.data);
      if (topCallersRes.success) setTopCallersData(topCallersRes.data.topMonthlyCallers); // Set top callers data

      setLoading(false);
    };

    fetchAll();
  }, [refreshCount]);

  const kpiData = [
    {
      title: 'Total Open Incidents',
      value: metrics.m1,
      icon: { name: 'mdi:alert-circle-outline', color: 'primary' },
      link: { prefix: 'View', text: 'active', url: '#' },
    },
    {
      title: 'Unassigned Tickets',
      value: metrics.m6,
      icon: { name: 'mdi:account-off-outline', color: 'warning' },
      link: { prefix: 'View', text: 'unassigned', url: '#' },
    },
    {
      title: 'Stale Tickets (>30d)',
      value: metrics.m10,
      icon: { name: 'mdi:clock-alert-outline', color: 'error' },
      link: { prefix: 'View', text: 'stale', url: '#' },
    },
  ];

  return (
    <Grid container spacing={3}>
      {kpiData.map((kpi) => (
        <Grid key={kpi.title} size={{ xs: 12, md: 4 }}>
          <AnalyticKPI kpi={kpi} isLoading={loading} />
        </Grid>
      ))}

      <Grid size={{ xs: 12, md: 6 }}>
        <PriorityPie data={charts.priority} isLoading={loading} />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <CategoryBar data={charts.category} isLoading={loading} />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <GroupWorkload data={charts.group} isLoading={loading} />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <StateFunnel data={charts.state} isLoading={loading} />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <SlaBreachChart data={charts.slaBreach} isLoading={loading} />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <CriticalBacklogChart value={charts.criticalBacklog} isLoading={loading} />
      </Grid>

      {/* New Grid item for TopCallersTable */}
      <Grid size={{ xs: 12, md: 6 }}>
        <TopCallersTable data={topCallersData} loading={loading} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ProPlanCTA />
      </Grid>
    </Grid>
  );
};

export default Analytics;

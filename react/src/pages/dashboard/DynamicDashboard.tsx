import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { Dashboard, getDashboardWithWidgets } from 'lib/DashboardService';
import PageLoader from 'components/loading/PageLoader';

const DynamicDashboard = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchDashboard = async () => {
      if (!uuid) {
        setError('Dashboard ID is missing.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const fetchedDashboard = await getDashboardWithWidgets(uuid);
        setDashboard(fetchedDashboard);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [uuid]);
  if (loading) {
    return <PageLoader />;
  }
  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }
  if (!dashboard) {
    return <Typography>Dashboard not found.</Typography>;
  }
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard: {dashboard.name}
      </Typography>
      <Typography variant="body1" paragraph>
        {dashboard.description}
      </Typography>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Widgets:
      </Typography>
      <Grid container spacing={3}>
        {dashboard.widgets && dashboard.widgets.length > 0 ? (
          dashboard.widgets.map((widget) => (
            <Grid item xs={12} sm={6} md={4} key={widget.id}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6">{widget.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Type: {widget.widget_type}
                </Typography>
                {widget.config && (
                  <Typography variant="body2" color="text.secondary">
                    Config: {JSON.stringify(widget.config)}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No widgets defined for this dashboard.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
export default DynamicDashboard;

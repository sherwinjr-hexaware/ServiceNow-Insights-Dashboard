import { Skeleton } from '@mui/material';
import * as echarts from 'echarts';
import ReactECharts from 'components/base/ReactEchart';

// Import Skeleton

interface SlaBreachChartProps {
  data: { name: string; value: number }[];
  isLoading: boolean; // Add isLoading prop
}

const SlaBreachChart = ({ data = [], isLoading }: SlaBreachChartProps) => {
  // Destructure isLoading
  const chartOptions = {
    title: {
      text: 'SLA Breach Status',
      left: 'center',
    },
    series: [
      {
        name: 'SLA Breach Status',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: data,
      },
    ],
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)',
    },
  };

  return isLoading ? (
    <Skeleton variant="circular" height={350} width="100%" /> // height is '21.875rem'
  ) : (
    <ReactECharts echarts={echarts} option={chartOptions} style={{ height: '21.875rem' }} />
  );
};

export default SlaBreachChart;

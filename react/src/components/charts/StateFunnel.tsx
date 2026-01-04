import { Skeleton } from '@mui/material';
import * as echarts from 'echarts';
import ReactECharts from 'components/base/ReactEchart';

// Import Skeleton

interface StateFunnelProps {
  data: { name: string; value: number }[];
  isLoading: boolean; // Add isLoading prop
}

const StateFunnel = ({ data = [], isLoading }: StateFunnelProps) => {
  // Destructure isLoading
  const chartOptions = {
    title: {
      text: 'State Funnel',
      left: 'center',
    },
    series: [
      {
        name: 'State Funnel',
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside',
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid',
          },
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1,
        },
        emphasis: {
          label: {
            fontSize: 20,
          },
        },
        data: data,
      },
    ],
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c}%',
    },
  };

  return isLoading ? (
    <Skeleton variant="rectangular" height={350} width="100%" /> // height is '21.875rem'
  ) : (
    <ReactECharts echarts={echarts} option={chartOptions} style={{ height: '21.875rem' }} />
  );
};

export default StateFunnel;

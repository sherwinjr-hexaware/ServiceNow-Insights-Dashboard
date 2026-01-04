import { Skeleton } from '@mui/material';
import * as echarts from 'echarts';
import ReactECharts from 'components/base/ReactEchart';

// Import Skeleton

interface GroupWorkloadProps {
  data: { name: string; value: number }[];
  isLoading: boolean; // Add isLoading prop
}

const GroupWorkload = ({ data = [], isLoading }: GroupWorkloadProps) => {
  // Destructure isLoading
  const chartOptions = {
    title: {
      text: 'Group Workload',
      left: 'center',
    },
    grid: {
      left: '20%',
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      axisLabel: {
        show: true,
        color: 'inherit',
      },
    },
    yAxis: {
      type: 'category',
      data: data.map((d) => d.name),
      axisLabel: {
        show: true,
        color: 'inherit',
      },
    },
    series: [
      {
        name: 'Workload',
        type: 'bar',
        data: data.map((d) => d.value),
        barWidth: '40%',
      },
    ],
    tooltip: {
      axisPointer: {
        type: 'shadow',
      },
    },
  };

  return isLoading ? (
    <Skeleton variant="rectangular" height={350} width="100%" /> // height is '21.875rem' which is 350px
  ) : (
    <ReactECharts echarts={echarts} option={chartOptions} style={{ height: '21.875rem' }} />
  );
};

export default GroupWorkload;

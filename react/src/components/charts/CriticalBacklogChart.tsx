import { Skeleton } from '@mui/material';
import * as echarts from 'echarts';
import ReactECharts from 'components/base/ReactEchart';

// Import Skeleton

interface CriticalBacklogChartProps {
  value: number;
  isLoading: boolean; // Add isLoading prop
}

const CriticalBacklogChart = ({ value = 0, isLoading }: CriticalBacklogChartProps) => {
  // Destructure isLoading
  const chartOptions = {
    title: {
      text: 'Critical Backlog',
      left: 'center',
      top: '2%', // Further adjust title position
      fontSize: 16, // Reduce font size
    },
    series: [
      {
        type: 'gauge',
        center: ['50%', '70%'],
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100, // Assuming a max of 100 for the gauge, this can be adjusted
        splitNumber: 10,
        itemStyle: {
          color: '#FFAB91',
        },
        progress: {
          show: true,
          width: 30,
        },
        pointer: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            width: 30,
          },
        },
        axisTick: {
          distance: -45,
          splitNumber: 5,
          lineStyle: {
            width: 2,
            color: '#999',
          },
        },
        splitLine: {
          distance: -52,
          length: 14,
          lineStyle: {
            width: 3,
            color: '#999',
          },
        },
        axisLabel: {
          distance: -20,
          color: '#999',
          fontSize: 14,
        },
        anchor: {
          show: false,
        },
        title: {
          show: false,
        },
        detail: {
          valueAnimation: true,
          width: '60%',
          lineHeight: 40,
          borderRadius: 8,
          offsetCenter: [0, '-15%'],
          fontSize: 30,
          fontWeight: 'bolder',
          formatter: '{value}',
          color: 'inherit',
        },
        data: [
          {
            value: value,
          },
        ],
      },
    ],
  };

  return isLoading ? (
    <Skeleton variant="rectangular" height={288} width="100%" /> // height is '18rem'
  ) : (
    <ReactECharts echarts={echarts} option={chartOptions} style={{ height: '18rem' }} />
  );
};

export default CriticalBacklogChart;

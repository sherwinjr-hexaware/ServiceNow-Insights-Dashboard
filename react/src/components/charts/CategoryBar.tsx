import { Skeleton } from '@mui/material';
import * as echarts from 'echarts';
import ReactEchart from 'components/base/ReactEchart';

// Import Skeleton

interface CategoryBarProps {
  data: {
    name: string;
    value: number;
  }[];
  isLoading: boolean; // Add isLoading prop
}

const CategoryBar = ({ data, isLoading }: CategoryBarProps) => {
  // Destructure isLoading
  const option = {
    title: {
      text: 'Category Distribution',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',

      axisPointer: { type: 'shadow' },
    },

    grid: {
      left: '3%',

      right: '4%',

      bottom: '15%', // Increased bottom margin

      containLabel: true,
    },

    xAxis: {
      type: 'category',

      data: data
        .filter(
          (d) =>
            typeof d.name === 'string' &&
            d.name.trim() !== '' &&
            typeof d.value === 'number' &&
            isFinite(d.value),
        )
        .map((d) => d.name),

      axisLabel: {
        interval: 0,

        rotate: 45, // Rotate labels to prevent overlap
      },
    },

    yAxis: {
      type: 'value',
    },

    series: [
      {
        name: 'Incidents',

        type: 'bar',

        data: data
          .filter(
            (d) =>
              typeof d.name === 'string' &&
              d.name.trim() !== '' &&
              typeof d.value === 'number' &&
              isFinite(d.value),
          )
          .map((d) => d.value),

        itemStyle: {
          color: '#5470c6',
        },
      },
    ],
  };

  return isLoading ? (
    <Skeleton variant="rectangular" height={360} width="100%" />
  ) : (
    <ReactEchart echarts={echarts} option={option} sx={{ height: 360, width: '100%' }} />
  );
};

export default CategoryBar;

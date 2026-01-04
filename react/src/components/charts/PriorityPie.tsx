import { Skeleton } from '@mui/material';
import * as echarts from 'echarts';
import ReactEchart from 'components/base/ReactEchart';

// Import Skeleton

interface PriorityPieProps {
  data: {
    name: string;
    value: number;
  }[];
  isLoading: boolean; // Add isLoading prop
}

const PriorityPie = ({ data, isLoading }: PriorityPieProps) => {
  // Destructure isLoading
  const processedData = data.map((item) => ({
    ...item,
    name: item.name.substring(item.name.indexOf('-') + 1).trim(),
  }));
  const option = {
    title: {
      text: 'Volume by Priority',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',

      formatter: '{b}: {c}',
    },

    color: ['red', 'yellow', 'green'],

    legend: {
      bottom: 0,

      type: 'scroll',
    },

    series: [
      {
        name: 'Priority',

        type: 'pie',

        radius: ['45%', '70%'],

        avoidLabelOverlap: false,

        minAngle: 5, // Ensure small slices are visible

        itemStyle: {
          borderRadius: 6,

          borderColor: '#fff',

          borderWidth: 2,
        },
        label: {
          show: false,
        },

        emphasis: {
          label: {
            show: true,

            fontSize: 14,

            fontWeight: 'bold',
          },
        },

        data: processedData,
      },
    ],
  };

  return isLoading ? (
    <Skeleton variant="circular" height={360} width="100%" /> // Pie chart, so circular skeleton
  ) : (
    <ReactEchart echarts={echarts} option={option} sx={{ height: 360, width: '100%' }} />
  );
};

export default PriorityPie;

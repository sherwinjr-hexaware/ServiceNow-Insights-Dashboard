import * as echarts from 'echarts';

import ReactEchart from 'components/base/ReactEchart';

interface PriorityPieProps {

  data: {

    name: string;

    value: number;

  }[];

}

const PriorityPie = ({ data }: PriorityPieProps) => {

  const option = {

    tooltip: {

      trigger: 'item',

      formatter: '{b}: {c}',

    },

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

        data, 

      },

    ],

  };

  return (
<ReactEchart

      echarts={echarts}

      option={option}

      sx={{ height: 360, width: '100%' }}

    />

  );

};

export default PriorityPie;
 
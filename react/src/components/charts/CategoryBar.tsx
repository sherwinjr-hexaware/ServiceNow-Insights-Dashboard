import * as echarts from 'echarts';
import ReactEchart from 'components/base/ReactEchart';
interface CategoryBarProps {

  data: {

    name: string;

    value: number;

  }[];

}

const CategoryBar = ({ data }: CategoryBarProps) => {

  const option = {

    tooltip: {

      trigger: 'axis',

      axisPointer: { type: 'shadow' },

    },

    grid: {

      left: '3%',

      right: '4%',

      bottom: '3%',

      containLabel: true,

    },

    xAxis: {

      type: 'value',

    },

    yAxis: {

      type: 'category',

      data: data.map((d) => d.name), 

      axisLabel: {

        interval: 0,

      },

    },

    series: [

      {

        name: 'Incidents',

        type: 'bar',

        data: data.map((d) => d.value),

        itemStyle: {

          color: '#5470c6',

        },

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

export default CategoryBar;
 
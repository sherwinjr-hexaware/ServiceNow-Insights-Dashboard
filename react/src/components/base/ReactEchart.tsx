import { useEffect, useMemo, useRef } from 'react';
import { Box, BoxProps, useTheme } from '@mui/material';
import { EChartsReactProps } from 'echarts-for-react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { tooltipFormatterList } from 'helpers/echart-utils';
import merge from 'lodash.merge';
import { grey } from 'theme/palette/colors';

export interface ReactEchartProps extends BoxProps {
  option: EChartsReactProps['option'];
  echarts?: EChartsReactProps['echarts'];
}

const ReactEchart = ({ option, echarts, ...rest }: ReactEchartProps) => {
  const chartRef = useRef<ReactEChartsCore | null>(null);
  const theme = useTheme();

  useEffect(() => {
    return () => {
      // Safely dispose of the ECharts instance only if it exists
      if (chartRef.current && typeof chartRef.current.getEchartsInstance === 'function') {
        const instance = chartRef.current.getEchartsInstance();
        if (instance && typeof instance.dispose === 'function') {
          instance.dispose();
        }
      }
    };
  }, []);

  const isTouchDevice = useMemo(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  const defaultTooltip = useMemo(
    () => ({
      trigger: 'axis',
      formatter: (params: any) => tooltipFormatterList(params, true),
      padding: [7, 10],
      axisPointer: { type: 'none' },
      textStyle: {
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: 400,
        fontSize: 12,
        color: theme.palette.common.white,
      },
      backgroundColor: grey[800],
      borderWidth: 0,
      borderColor: theme.palette.divider,
      extraCssText: 'box-shadow: none;',
      transitionDuration: 0,
      confine: true,
      triggerOn: isTouchDevice ? 'click' : 'mousemove|click',
      ...theme.applyStyles('dark', {
        backgroundColor: grey[900],
        borderWidth: 1,
      }),
    }),
    [theme, isTouchDevice],
  );

  return (
    <Box
      component={ReactEChartsCore}
      ref={chartRef}
      echarts={echarts}
      option={{
        ...option,
        tooltip: merge(defaultTooltip, option.tooltip),
      }}
      {...rest}
    />
  );
};

export default ReactEchart;

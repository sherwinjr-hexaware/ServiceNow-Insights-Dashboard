import { useMemo } from 'react';

import { Box, BoxProps, useTheme } from '@mui/material';

import { EChartsReactProps } from 'echarts-for-react';

import ReactEChartsCore from 'echarts-for-react/lib/core';

import merge from 'lodash.merge';

import { grey } from 'theme/palette/colors';

export interface ReactEchartProps extends BoxProps {

  option: EChartsReactProps['option'];

  echarts?: EChartsReactProps['echarts']; 

}

const ReactEchart = ({ option, echarts, ref, ...rest }: ReactEchartProps) => {

  const theme = useTheme();

  const isTouchDevice = useMemo(() => {

    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  }, []);

  const defaultTooltip = useMemo(() => ({

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

  }), [theme, isTouchDevice]);

  return (
<Box

      component={ReactEChartsCore}

      ref={ref}

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
 
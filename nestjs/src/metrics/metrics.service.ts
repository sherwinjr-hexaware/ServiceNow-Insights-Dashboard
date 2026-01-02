import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import axios from 'axios';

@Injectable()

export class MetricsService {

  private readonly logger = new Logger(MetricsService.name);

  constructor(private readonly config: ConfigService) {}


  private async fetchCount(query: string): Promise<number> {

    const baseUrl = this.config.get<string>('SN_INSTANCE_URL')?.replace(/\/+$/, '').replace(/\/api$/, '');

    const username = this.config.get<string>('SN_USERNAME');

    const password = this.config.get<string>('SN_PASSWORD');

    const fullUrl = `${baseUrl}/api/now/table/incident`;

    try {

      const response = await axios.get(fullUrl, {

        params: {

          sysparm_query: query,

          sysparm_limit: 1,

          sysparm_count: 'true',

        },

        auth: { username, password },

      });

      const count = response.headers['x-total-count'] || '0';

      return parseInt(count as string, 10);

    } catch (error) {

      const errorDetail = error.response?.data?.error?.message || error.message;

      this.logger.error(`Error fetching count for [${query}]: ${errorDetail}`);

      return 0;

    }

  }



  private async fetchGroupedData(groupBy: string): Promise<any[]> {

    const baseUrl = this.config.get<string>('SN_INSTANCE_URL')?.replace(/\/+$/, '').replace(/\/api$/, '');

    const username = this.config.get<string>('SN_USERNAME');

    const password = this.config.get<string>('SN_PASSWORD');

    const fullUrl = `${baseUrl}/api/now/stats/incident`;

    try {

      const response = await axios.get(fullUrl, {

        params: {

          sysparm_count: 'true',

          sysparm_group_by: groupBy,

          sysparm_query: 'active=true',

          sysparm_display_value: 'all', 

        },

        auth: { username, password },

      });

      return (response.data.result || []).map((item: any) => {

        const fieldData = item.groupby_fields?.[0];

        return {

          name: fieldData?.display_value || fieldData?.value || 'Unknown',

          value: parseInt(item.stats.count, 10),

        };

      });

    } catch (error) {

      const errorDetail = error.response?.data?.error?.message || error.message;

      this.logger.error(`Error fetching grouped data for ${groupBy}: ${errorDetail}`);

      return [];

    }

  }

  async getScorecardMetrics() {

    try {

      this.logger.log('Fetching scorecard metrics for Story 4...');

      const [m1, m6, m10] = await Promise.all([

        this.fetchCount('active=true'), 

        this.fetchCount('active=true^assigned_toISEMPTY'), 


        this.fetchCount('active=true^sys_updated_onRELATIVELT@dayofweek@ago@30')

      ]);

      return {

        success: true,

        data: { m1, m6, m10 },

      };

    } catch (error) {

      this.logger.error(`Scorecard processing failed: ${error.message}`);

      return { success: false, data: { m1: 0, m6: 0, m10: 0 } };

    }

  }

  async getChartMetrics() {

    try {

      this.logger.log('Fetching and normalizing chart metrics for Story 5...');

      const [priority, category, state, group] = await Promise.all([

        this.fetchGroupedData('priority'),

        this.fetchGroupedData('category'),

        this.fetchGroupedData('state'),

        this.fetchGroupedData('assignment_group'),

      ]);

      return {

        success: true,

        data: { priority, category, state, group },

      };

    } catch (error) {

      this.logger.error(`Chart metrics failed: ${error.message}`);

      return { success: false, data: null };

    }

  }

}
 
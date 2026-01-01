import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import axios from 'axios';

@Injectable()

export class MetricsService {

  private readonly logger = new Logger(MetricsService.name);

  constructor(private readonly config: ConfigService) {}

  private async fetchCount(query: string): Promise<number> {

    const baseUrl = this.config.get<string>('SN_INSTANCE_URL');

    const username = this.config.get<string>('SN_USERNAME');

    const password = this.config.get<string>('SN_PASSWORD');
    const cleanBaseUrl = baseUrl?.replace(/\/+$/, '').replace(/\/api$/, '');

    const fullUrl = `${cleanBaseUrl}/api/now/table/incident`;

    try {

      const response = await axios.get(fullUrl, {

        params: {

          sysparm_query: query,

          sysparm_limit: 1,

          sysparm_count: 'true',

        },

        auth: {

          username,

          password,

        },

      });

      const count = response.headers['x-total-count'] || '0';

      return parseInt(count as string, 10);

    } catch (error) {

      const errorDetail = error.response?.data?.error?.message || error.message;

      this.logger.error(`Error fetching count for [${query}]: ${errorDetail}`);

      return 0;

    }

  }

  async getScorecardMetrics() {

    try {

      this.logger.log('Fetching scorecard metrics...');
      const [m1, m6, m10] = await Promise.all([

        this.fetchCount('active=true'),

        this.fetchCount('active=true^assigned_toISEMPTY'),

        this.fetchCount('active=true^sys_updated_onRELATIVELE@dayofweek@ago@30'),

      ]);

      return {

        success: true,

        data: { m1, m6, m10 },

      };

    } catch (error) {

      this.logger.error(`Scorecard processing failed: ${error.message}`);

      return {

        success: false, 

        data: { m1: 0, m6: 0, m10: 0 },

      };

    }

  }

}
 
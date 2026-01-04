import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import axios from 'axios';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(private readonly config: ConfigService) {}

  private async fetchCount(query: string): Promise<number> {
    const baseUrl = this.config
      .get<string>('SN_INSTANCE_URL')
      ?.replace(/\/+$/, '')
      .replace(/\/api$/, '');

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

  private async fetchSlaData(): Promise<any[]> {
    const baseUrl = this.config
      .get<string>('SN_INSTANCE_URL')
      ?.replace(/\/+$/, '')
      .replace(/\/api$/, '');

    const username = this.config.get<string>('SN_USERNAME');

    const password = this.config.get<string>('SN_PASSWORD');

    const fullUrl = `${baseUrl}/api/now/stats/task_sla`;

    try {
      const response = await axios.get(fullUrl, {
        params: {
          sysparm_count: 'true',

          sysparm_group_by: 'has_breached',

          sysparm_query: 'stage=in_progress',

          sysparm_display_value: 'all',
        },

        auth: { username, password },
      });

      return (response.data.result || []).map((item: any) => {
        const fieldData = item.groupby_fields?.[0];

        const hasBreached = fieldData?.value === 'true';

        return {
          name: hasBreached ? 'Breached' : 'Not Breached',

          value: parseInt(item.stats.count, 10),
        };
      });
    } catch (error) {
      const errorDetail = error.response?.data?.error?.message || error.message;

      this.logger.error(`Error fetching SLA data: ${errorDetail}`);

      return [];
    }
  }

  private async fetchGroupedIncidents(
    groupBy: string,
    query: string,
    limit: number = 5,
    orderBy?: 'COUNTDESC',
  ): Promise<any[]> {
    const baseUrl = this.config
      .get<string>('SN_INSTANCE_URL')
      ?.replace(/\/+$/, '')
      .replace(/\/api$/, '');

    const username = this.config.get<string>('SN_USERNAME');

    const password = this.config.get<string>('SN_PASSWORD');

    const fullUrl = `${baseUrl}/api/now/stats/incident`;

    try {
      const params: any = {
        sysparm_count: 'true',

        sysparm_group_by: groupBy,

        sysparm_query: query,

        sysparm_display_value: 'all',
      };

      const response = await axios.get(fullUrl, {
        params,

        auth: { username, password },
      });

      this.logger.log(
        `Raw ServiceNow response for grouped incidents (query: ${query}, groupBy: ${groupBy}): ${JSON.stringify(response.data.result)}`,
      );

      let results = (response.data.result || []).map((item: any) => {
        const fieldData = item.groupby_fields?.[0];

        const name = fieldData?.display_value || fieldData?.value;

        return {
          name: name,

          value: parseInt(item.stats.count, 10),
        };
      });

      if (orderBy === 'COUNTDESC') {
        results.sort((a, b) => b.value - a.value);
      }

      return limit ? results.slice(0, limit) : results;
    } catch (error) {
      const errorDetail = error.response?.data?.error?.message || error.message;

      this.logger.error(
        `Error fetching grouped incidents for ${groupBy} with query ${query}: ${errorDetail}`,
      );

      return [];
    }
  }

  private async fetchGroupedData(groupBy: string): Promise<any[]> {
    const baseUrl = this.config
      .get<string>('SN_INSTANCE_URL')
      ?.replace(/\/+$/, '')
      .replace(/\/api$/, '');

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

      return (response.data.result || [])

        .map((item: any) => {
          const fieldData = item.groupby_fields?.[0];

          const name = fieldData?.display_value || fieldData?.value;

          return {
            name: name,

            value: parseInt(item.stats.count, 10),
          };
        })

        .filter(
          (item) => typeof item.name === 'string' && item.name.trim() !== '',
        );
    } catch (error) {
      const errorDetail = error.response?.data?.error?.message || error.message;

      this.logger.error(
        `Error fetching grouped data for ${groupBy}: ${errorDetail}`,
      );

      return [];
    }
  }

  async getScorecardMetrics() {
    try {
      this.logger.log('Fetching scorecard metrics for Story 4...');

      const thirtyDaysAgo = new Date();

      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const thirtyDaysAgoString = thirtyDaysAgo.toISOString().split('T')[0]; // Format as YYYY-MM-DD

      const [m1, m6, m10] = await Promise.all([
        this.fetchCount('active=true'),

        this.fetchCount('active=true^assigned_toISEMPTY'),

        this.fetchCount(`active=true^sys_updated_on<${thirtyDaysAgoString}`),
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

      const [priority, category, state, group, slaBreach, criticalBacklog] =
        await Promise.all([
          this.fetchGroupedData('priority'),

          this.fetchGroupedData('category'),

          this.fetchGroupedData('state'),

          this.fetchGroupedData('assignment_group'),

          this.fetchSlaData(),

          this.fetchCount('priority<3^stateNOT IN6,7'),
        ]);

      return {
        success: true,

        data: { priority, category, state, group, slaBreach, criticalBacklog },
      };
    } catch (error) {
      this.logger.error(`Chart metrics failed: ${error.message}`);

      return { success: false, data: null };
    }
  }

  async getTopCallersMetrics() {
    try {
      this.logger.log('Fetching top callers metrics for Story 6 (M8)...');

      const monthlyQuery =
        'opened_atONThis month@javascript:gs.beginningOfThisMonth()@javascript:gs.endOfThisMonth()';

      const topMonthlyCallers = await this.fetchGroupedIncidents(
        'caller_id',

        monthlyQuery,

        5,

        'COUNTDESC',
      );

      this.logger.log(
        `Data for topMonthlyCallers: ${JSON.stringify(topMonthlyCallers)}`,
      );

      return {
        success: true,

        data: { topMonthlyCallers },
      };
    } catch (error) {
      this.logger.error(`Top callers metrics failed: ${error.message}`);

      return { success: false, data: null };
    }
  }
}

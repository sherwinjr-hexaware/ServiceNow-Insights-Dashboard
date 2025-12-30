import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import axios from 'axios';

@Injectable()

export class MetricsService {

  private readonly logger = new Logger(MetricsService.name);

  constructor(private readonly config: ConfigService) {}

  async getOpenIncidentsCount() {

    const baseUrl = this.config.get<string>('SN_INSTANCE_URL');

    if (!baseUrl) {

      this.logger.error('ENV ERROR: SN_INSTANCE_URL is undefined');

      return { success: false, error: 'Env variables not loaded' };

    }

    const fullUrl = `${baseUrl}/now/table/incident`.replace(/([^:]\/)\/+/g, "$1");

    try {

      this.logger.log(`Connecting to: ${fullUrl}`);

      const response = await axios.get(fullUrl, {

        params: { 

          sysparm_query: 'active=true', 

          sysparm_limit: 1 

        },

        auth: {

          username: this.config.get<string>('SN_USERNAME'),

          password: this.config.get<string>('SN_PASSWORD'),

        },

      });
      const count = response.headers['x-total-count'] || "0";

      return { 

        success: true, 

        totalOpenIncidents: parseInt(count as string, 10) 

      };

    } catch (error) {

      this.logger.error(`API Error: ${error.message}`);

      return { 

        success: false, 

        error: 'Connection failed', 

        details: error.message 

      };

    }

  }

}
 
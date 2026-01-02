import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/metrics';


export const getScorecardMetrics = async () => {

  try {

    const response = await axios.get(`${API_BASE_URL}/scorecard`);

    return response.data; 

  } catch (error) {

    console.error('Error fetching scorecard metrics:', error);

    return { success: false, data: { m1: 0, m6: 0, m10: 0 } };

  }

};


export const getChartMetrics = async () => {

  try {

    const response = await axios.get(`${API_BASE_URL}/charts`);

    return response.data;

  } catch (error) {

    console.error('Error fetching chart metrics:', error);

    return { success: false, data: null };

  }

};
 
import axios from 'axios';
const API_BASE_URL = 'http://localhost:3000/api/metrics';

export const getLiveIncidentCount = async () => {

  try {

    const response = await axios.get(`${API_BASE_URL}/total-incidents`);
    return response.data;

  } catch (error) {

    console.error('Error fetching incidents from NestJS:', error);

    return { success: false, totalOpenIncidents: 0 };

  }

};
 
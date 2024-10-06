import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/';

const apiClient = axios.create({
    baseURL: API_BASE_URL
});

export async function getActivities(query) {
    return (await apiClient.get('activities' + query)).data;
}
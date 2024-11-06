import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/';
const token = localStorage.getItem('token');

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
});



// Fetch profile info
export async function fetchProfileInfo(token) {
    return (
        await apiClient.get("advertisers/myProfile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      ).data;
}

// Update profile info
export async function updateProfile(updatedData) {
    try {
        const response = await apiClient.put("advertisers/updateMyProfile", updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating profile info:', error);
        throw error;
    }
}
export async function changePassword(passwordData) {
    return (
      await apiClient.post("advertisers/changepassword", passwordData)
    ).data;
  }
  
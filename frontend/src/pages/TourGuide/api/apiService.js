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

export async function getMyItineraries(token) {
  return (await apiClient.get('myItineraries', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })).data;
}

export async function updateItinerary(id,updatedItinerary) {
  await apiClient.put(`itineraries/${id}`,updatedItinerary);
}

export async function updatePlace(token,id,place) {
  await apiClient.put(`updatePlace/${id}`, place, {
      headers: { Authorization: `Bearer ${token}` },
    });
} 


export async function fetchItineraries(){
    try {
        const [activitiesRes, tagsRes, historicalSitesRes] = await Promise.all([
          axios.get('http://localhost:5001/api/activities'),
          axios.get('http://localhost:5001/api/preference-tags'),
          axios.get('http://localhost:5001/api/getAllPlaces'),
        ]);

        setActivities(activitiesRes.data);
        console.log(activitiesRes.data);
        setTags(tagsRes.data);
        setHistoricalSites(historicalSitesRes.data);
        setTourGuides(tourGuidesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
  };

export async function deleteItinerary(id){
    try {
      await axios.delete(`http://localhost:5001/api/itineraries/${id}`);
      alert('Itinerary deleted successfully!');
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      alert('Failed to delete itinerary.');
    }
  };

  // Fetch profile info
  export async function fetchProfileInfo(token) {
    return (
        await apiClient.get("tourguides/myProfile", {
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
      const response = await apiClient.put("tourguides/updateMyProfile", updatedData);
      return response.data;
  } catch (error) {
      console.error('Error updating profile info:', error);
      throw error;
  }
}
export async function changePassword(passwordData) {
  return (
    await apiClient.post("tourguides/changepassword", passwordData)
  ).data;
}

export async function addItinerary(token,newItinerary) {
  await apiClient.post('itineraries', newItinerary, {
      headers: { Authorization: `Bearer ${token}` },
  });
} 

export async function getTags() {
  return (await apiClient.get("preference-tags")).data;
}

export async function getPlaceTags() {
  return (await apiClient.get('placetag')).data;
}

export async function getActivities() {
  return (await apiClient.get("activities")).data;
}

export async function getAllPlaces() {
  return (await apiClient.get("getAllPlaces")).data;
}
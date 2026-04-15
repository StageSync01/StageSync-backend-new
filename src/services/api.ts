const API_URL = "https://stagesync-backend-new-production.up.railway.app";

export const getEvents = async () => {
  try {
    const res = await fetch(`${API_URL}/events`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error:", error);
    return [];
  }
};
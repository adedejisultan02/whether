import axios from 'axios';

const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';
const API_KEY = 'JHA9JWNK424UKQX2H6N3P35G2';
 
export const fetchWeatherData = async (location, day, weekOffset) => {
  try {
    const today = new Date();
    const currentDayIndex = today.getDay();
    const targetDayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);

    const dayDifference = targetDayIndex - currentDayIndex + weekOffset * 7;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + dayDifference);

    const formattedDate = targetDate.toISOString().split('T')[0];
    const url = `${BASE_URL}/${location}/${formattedDate}?key=${API_KEY}&unitGroup=us&include=days,hours&elements=datetime,temp,conditions,windspeed,precipprob`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    throw new Error('Failed to fetch weather data.');
  }
};
  
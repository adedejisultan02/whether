import axios from 'axios';

const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';
const API_KEY = 'X7KU8WCNDDPVB2NE2EZQGJ878';
 
export const fetchWeatherData = async (location: any, day: any, weekOffset: any) => {
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
  } catch (error: any) {
    console.error('Error fetching weather data:', error.message);
    throw new Error('Failed to fetch weather data.');
  }
};
  
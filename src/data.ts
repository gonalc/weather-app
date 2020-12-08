import axios from 'axios';
import moment from 'moment';
const apiKey = process.env.VUE_APP_API_KEY;
// Helper functions to use across the app
export const fromKelvinToCelsius = (temp: number) => (temp - 273.15).toFixed(1);
export const getHistoricalWeather = async (lat: number, lon: number) => {
    try {
        const start = moment().subtract(30, 'days').format('X');
        const end = moment().subtract(1, 'days').format('X');
        const url = `http://history.openweathermap.org/data/2.5/history/city?lat=${lat}&lon${lon}&type=hour&start=${start}&end=${end}&appid=${apiKey}`;
        const historical = await axios.get(url);
        console.log({ historical });
    } catch (err) {
        console.error('Error fetching historical data: ', err);
    }
};

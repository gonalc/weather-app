<template>
  <div class="weather-card">
    <header>
      <h2 class="location">{{ location }}</h2>
      <div class="icon-container">
        <img :src="getIcon(icon)" />
      </div>
    </header>
    <p class="description text-normal">{{ weatherDescription }}</p>
    <p class="current-temp">
      <i class="fas fa-thermometer-quarter" />
      {{ currentTemperature }}°C
    </p>
    <div class="temp-range-container">
      <p class="temp-range-title">Temperature range</p>
      <p class="range-temp">{{ minTemperature }}°C - {{ maxTemperature }}°C</p>
    </div>
    <details>
      <summary>More details</summary>
      <p>
        <i class="fas fa-wind" />
        {{ windSpeed }}m/s
      </p>
      <p>
        <i class="fas fa-water" />
        {{ humidity }}%
      </p>
      <p>Pressure: {{ pressure }}hPa</p>
      <p>Sunrise at {{ sunrise }}</p>
      <p>Sunset at {{ sunset }}</p>
    </details>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from "vue";
import moment from "moment";
import { fromKelvinToCelsius } from '../data';

export default defineComponent({
  name: "DetailWeatherCard",
  props: {
    data: Object,
  },
  methods: {
    getIcon(iconId: string): string {
      const url = `http://openweathermap.org/img/wn/${iconId}@2x.png`;
      return url;
    },
  },
  data() {
    return {
      location: "",
      weatherDescription: "",
      currentTemperature: "",
      maxTemperature: "",
      minTemperature: "",
      windSpeed: 0,
      humidity: 0,
      pressure: 0,
      sunrise: "",
      sunset: "",
      icon: "",
    };
  },
  created() {
    const { data } = this.$props;
    if (data) {
      this.location = `${data.name}, ${data.sys.country}`;
      this.weatherDescription = `${data.weather[0].description}`;
      this.currentTemperature = fromKelvinToCelsius(data.main.temp);
      this.maxTemperature = fromKelvinToCelsius(data.main.temp_max);
      this.minTemperature = fromKelvinToCelsius(data.main.temp_min);
      this.windSpeed = data.wind.speed;
      this.humidity = data.main.humidity;
      this.pressure = data.main.pressure;
      this.sunrise = moment.unix(data.sys.sunrise).format("HH:mm");
      this.sunset = moment.unix(data.sys.sunset).format("HH:mm");
      this.icon = data.weather[0].icon;
    }
  },
});
</script>

<style scoped lang="scss">
@import "public/styles/colors";
@import "public/styles/fonts";
@import "public/styles/css3-mixins";

.weather-card {
  max-width: 250px;
  margin: 20px auto;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 10px;
  background-color: white;
  @include box-shadow(0, 5px, 15px, rgba(0, 0, 0, 0.15));
  p {
    margin: 5px 0;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: center;
    h2 {
      margin: 0;
      text-align: center;
    }
    .icon-container {
      width: 50px;
      margin: 0;
    }
  }
  .description {
    text-transform: capitalize;
  }
  details {
    cursor: pointer;
    summary {
      background-color: $light-blue;
      border-radius: 5px;
      color: white;
      padding: 5px;
    }
    &[open] {
      summary ~ * {
        animation: open 0.3s ease-in-out;
      }
    }
  }
}

@keyframes open {
  0% {
    opacity: 0;
    margin-left: -20px;
  }
  100% {
    opacity: 1;
    margin-left: 0px;
  }
}
</style>
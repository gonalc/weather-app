<template>
  <div class="Home">
    <div class="title-container">
      <h1>Check the weather in your town!</h1>
      <h2 class="text-center">Today is {{ date }}</h2>
    </div>
    <div v-if="loading" class="loader">
      <loader />
    </div>
    <div v-else class="weather-content">
      <div class="weather-form">
        <input
          type="text"
          placeholder="Type a place"
          aria-placeholder="Type a place"
          v-model="place"
          v-on:keyup.enter="getWeather"
        />
        <button class="submit-btn text-normal" @click="getWeather">
          Check weather
        </button>
      </div>

      <div v-if="currentWeather" class="detail-weather">
        <detail-weather-card :data="currentWeather" />
      </div>

      <div
        v-if="futureWeather && futureWeather.length > 0"
        class="extra-weather future"
      >
        <h2>Next week weather</h2>
        <div class="cards-container">
          <simple-weather-card
            v-for="(day, index) in futureWeather"
            :data="day"
            :daysInAdvance="index + 1"
            v-bind:key="day.dt"
            :isFuture="true"
          />
        </div>
      </div>

      <div
        v-if="pastWeather && pastWeather.length > 0"
        class="extra-weather past"
      >
        <h2>Weather in the last 5 days</h2>
        <div class="cards-container">
          <simple-weather-card
            v-for="(day, index) in pastWeather"
            :data="day"
            :daysInAdvance="index + 1"
            v-bind:key="day.dt"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from "vue";
import axios from "axios";
import moment from "moment";
import DetailWeatherCard from "./DetailWeatherCard.vue";
import SimpleWeatherCard from "./SimpleWeatherCard.vue";
import Loader from "./Loader.vue";

export default defineComponent({
  name: "Home",
  props: {},
  components: {
    DetailWeatherCard,
    SimpleWeatherCard,
    Loader,
  },
  data() {
    return {
      apiKey: process.env.VUE_APP_API_KEY,
      place: "",
      currentWeather: null,
      loading: true,
      futureWeather: [],
      pastWeather: new Array<any>(),
      date: "",
    };
  },
  methods: {
    async getFutureWeather(lat: number, lon: number) {
      const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${this.apiKey}`;
      try {
        const result = await axios.post(url);
        this.futureWeather = result.data.daily;
      } catch (err) {
        console.error("Error getting future data: ", err);
      } finally {
        console.log("API Call has finished");
      }
    },
    async getPastWeather(lat: number, lon: number, time: string) {
      const url = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${time}&appid=${this.apiKey}`;
      try {
        const result = await axios.post(url);
        const weatherObj = {
          date: moment.unix(Number(time)).format("DD/MM"),
          ...result.data,
        };
        const provWeather: any[] = this.pastWeather;
        provWeather.push(weatherObj);
        this.pastWeather = provWeather;
      } catch (err) {
        console.error("Error getting past weather: ", err);
      } finally {
        console.log("Finished past API Call");
      }
    },
    async getMoreWeather(lat: number, lon: number) {
      // Get future and past weather based on coordinates
      await this.getFutureWeather(lat, lon);
      for (let i = 5; i > 0; i--) {
        await this.getPastWeather(
          lat,
          lon,
          moment().subtract(i, "days").format("X")
        );
      }
    },
    async getWeather() {
      this.loading = true;
      this.pastWeather = [];
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.place}&appid=${this.apiKey}`;
      axios
        .post(url)
        .then(async (res) => {
          this.currentWeather = res.data;
          const { lat, lon } = res.data.coord;
          this.getMoreWeather(lat, lon);
        })
        .catch((err) => console.log("Error fetching data: ", err))
        .finally(() => {
          console.log("All calls have finished");
          this.loading = false;
        });
    },
  },
  created() {
    // Get current date
    this.date = moment().format("DD/MM/YYYY");
    // Get current position
    // Prefill the weather data with current location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}`;
        try {
          const result = await axios.post(url);
          this.place = result.data.name;
          this.currentWeather = result.data;
          this.getMoreWeather(latitude, longitude);
        } catch (err) {
          console.error("Error getting automatic location: ", err);
        } finally {
          console.log("Finished api call for auto location");
          this.loading = false;
        }
      },
      (error) => console.error("Error getting geolocation: ", error)
    );
  },
});
</script>

<style lang="scss">
@import "public/styles/colors";
@import "public/styles/variables";
@import "public/styles/css3-mixins";
.Home {
  padding-bottom: 50px;
  .title-container {
    h1 {
      text-align: center;
    }
  }
  .weather-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    input {
      padding: 5px 10px;
      border: 1px solid $gray;
      border-radius: 10px;
      transition: box-shadow 0.3s ease-in-out;
      &:focus {
        outline: none;
        border: none;
        @include box-shadow(0, 0, 0, 2px, $blue);
      }
    }
    .submit-btn {
      margin: 10px auto;
      cursor: pointer;
      border: none;
      padding: 5px 10px;
      border-radius: 10px;
      @include background-horizontal($light-blue, $blue);
      color: white;
      font-weight: bold;
      @include box-shadow(0, 5px, 15px, rgba($light-blue, 0.2));
      transition: box-shadow 0.3s ease-in-out;
      &:hover {
        @include box-shadow(0, 5px, 25px, rgba($light-blue, 0.4));
      }
    }
  }
  .extra-weather {
    .cards-container {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
    }
    &.past {
      .cards-container {
        flex-direction: row-reverse;
        justify-content: center;
        flex-wrap: wrap-reverse;
      }
    }
    @media screen and (max-width: $break-mobile) {
      .cards-container {
        flex-direction: column;
      }
      &.past {
        .cards-container {
          flex-direction: column-reverse;
        }
      }
    }
  }
}
</style>
<template>
  <div class="simple-card">
    <p class="date text-center">{{ date }}</p>
    <header>
      <p class="text-small">{{ description }}</p>
      <div class="icon-container">
        <img :src="getIcon(icon)" alt="" />
      </div>
    </header>
    <p class="range-temp">{{ minTemp }}°C - {{ maxTemp }}°C</p>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from "vue";
import moment from "moment";
import { fromKelvinToCelsius } from "@/data";

export default defineComponent({
  name: "SimpleWeatherCard",
  props: {
    data: Object,
    daysInAdvance: Number,
    dateString: String,
    isFuture: Boolean,
  },
  methods: {
    getIcon(iconId: string): string {
      const url = `http://openweathermap.org/img/wn/${iconId}@2x.png`;
      return url;
    },
  },
  data() {
    return {
      description: String,
      icon: String,
      minTemp: "",
      maxTemp: "",
      date: "",
    };
  },
  created() {
    const { data, isFuture } = this.$props;
    if (data) {
      if (isFuture) {
        this.description = data.weather[0].main;
        this.icon = data.weather[0].icon;
        this.minTemp = fromKelvinToCelsius(data.temp.min);
        this.maxTemp = fromKelvinToCelsius(data.temp.max);
        this.date = moment()
          .add(this.$props.daysInAdvance, "days")
          .format("DD/MM");
      } else {
          this.date = data.date;
          this.icon = data.current.weather[0].icon;
          this.description = data.current.weather[0].main;
          const hourTemp = data.hourly.map((h: any) => h.temp);
          const maxTemp = hourTemp.reduce((acc: number, curr: number) => {
              if (acc > curr) return acc;
              return curr;
          });
          const minTemp = hourTemp.reduce((acc: number, curr: number) => {
              if (acc < curr) return acc;
              return curr;
          });
          this.minTemp = fromKelvinToCelsius(minTemp);
          this.maxTemp = fromKelvinToCelsius(maxTemp);
      }
    }
  },
});
</script>

<style lang="scss" scoped>
@import "public/styles/css3-mixins";

.simple-card {
  box-sizing: border-box;
  padding: 10px;
  border-radius: 10px;
  margin: 10px;
  @include box-shadow(0, 5px, 15px, rgba(0, 0, 0, 0.15));
  p {
    margin: 0;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-container {
      width: 40px;
      margin: 0;
    }
  }
  .range-temp {
    margin: 0;
  }
}
</style>
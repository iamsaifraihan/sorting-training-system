<template>
  <div>
    <p>{{ time | secondsInMinutes }}</p>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "stopWatch",
  props: {
    running: {
      type: Boolean,
      default: false,
    },
    resetWhenStart: {
      type: Boolean,
      default: false,
    },
    restWhenStop: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    running: function (newVal) {
      if (newVal) this.startTimer();
      else this.stopTimer();
    },
  },
  mounted() {
    if (this.running) this.startTimer();
  },
  data() {
    return { time: 0, timer: null };
  },
  methods: {
    stopTimer: function () {
      clearInterval(this.timer);
      if (this.restWhenStop) this.resetTimer();
    },
    startTimer: function () {
      if (this.resetWhenStart) this.resetTimer();
      this.timer = setInterval(() => {
        this.time++;
      }, 1000);
    },
    resetTimer: function () {
      this.time = 0;
    },
  },
  filters: {
    secondsInMinutes: function (seconds) {
      return moment("2015-01-01")
        .startOf("day")
        .seconds(seconds)
        .format("HH:mm:ss");
    },
  },
};
</script>

<style scoped>
p {
  font-weight: bold;
  font-size: x-large;
}
</style>

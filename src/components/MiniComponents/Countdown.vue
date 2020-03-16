<template>
  <div class='timer' v-html="html"></div>
</template>

<script>
export default {
  name: 'Countdown',
  props: {
    endDate: String,
    type: String
  },
  data() {
    return {
      html: 'Loading...',
      intervalId: 0
    }
  },
  mounted() {    
    const fn = () => {
      let remainingSeconds = new Date(this.endDate) - Date.now()

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(remainingSeconds / (1000 * 60 * 60 * 24));
      var hours = Math.floor((remainingSeconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((remainingSeconds % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((remainingSeconds % (1000 * 60)) / 1000);

      switch (this.type) {
        case 'short':
          this.html = `${days}D:${hours}H:${minutes}m:${seconds}s`
          break
        case 'long':
          this.html = `${days} <span>days</span> ${hours} <span>hours</span> ${('0' + minutes).slice(-2)} <span>min</span> ${('0' + seconds).slice(-2)} <span>sec</span>`
          break
      }
    }

    fn()

    if (this.intervalId) clearInterval(this.intervalId)
    this.intervalId = setInterval(() => {
      fn()
    }, 1000)
  },
  destroyed() {
    if (this.intervalId) clearInterval(this.intervalId)
  }
}
</script>
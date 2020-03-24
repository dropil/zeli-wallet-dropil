<template>
  <input ref="input" type="text" v-model="input">
</template>

<script>
export default {
  name: 'AutoGrowInput',
  props: {
    min: {
      type: Number,
      default: 30
    },
    max: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      input: ''
    }
  },
  watch: {
    input(val) {
      this.$emit('input', val)

      let input = this.$refs.input
      let min = this.min
      let max = this.max

      setTimeout(() => {
        var tmp = document.createElement('div')
        tmp.style.padding = '0'
        
        if(getComputedStyle)
            tmp.style.cssText = getComputedStyle(input, null).cssText

        if(input.currentStyle)
            tmp.style.cssText = input.currentStyle.cssText

        tmp.style.width = ''
        tmp.style.position = 'absolute'
        tmp.innerHTML = input.value.replace(/&/g, "&amp;")
                                    .replace(/</g, "&lt;")
                                    .replace(/>/g, "&gt;")
                                    .replace(/"/g, "&quot;")
                                    .replace(/'/g, "&#039;")
                                    .replace(/ /g, '&nbsp;')                                    
        input.parentNode.appendChild(tmp)

        let width = tmp.clientWidth + 1
        tmp.parentNode.removeChild(tmp);
        
        if (this.input === '') width = this.min

        if (min <= width && width <= max)
            input.style.width = width + 'px'
        }, 1);
    }
  }
}
</script>
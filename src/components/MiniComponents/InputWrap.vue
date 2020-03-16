<template>
  <div class="input-wrap" :class="cls">
    <label v-if="input">{{placeholder}}</label>
    <input :type="actualType" :placeholder="placeholder" v-model="input" :class="inputCls">
    <div v-if="type==='password'" class="input-show" :class="{ show: showText }" @click="showText = !showText"></div>
  </div>  
</template>

<script>
export default {
  name: 'InputWrap',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: 'Enter value'
    },
    cls: {
      type: String,
      default: ''
    },
    inputCls: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      input: '',
      showText: false
    }
  },
  computed: {
    actualType() {
      if (this.type === 'password') return this.showText ? 'text' : 'password'
      return this.type
    }
  }
}
</script>
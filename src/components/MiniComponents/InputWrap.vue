<template>
  <div class="input-wrap" :class="cls">
    <label v-if="input">{{placeholder}}</label>
    <input ref="input" :type="actualType" :readonly="readonly" :placeholder="placeholder" v-model="input" :class="inputCls" @keydown="$emit('keydown', $event)">
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
    value: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
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
  watch: {
    input(val) {
      this.$emit('input', val)
    }
  },
  computed: {
    actualType() {
      if (this.type === 'password') return this.showText ? 'text' : 'password'
      return this.type
    }
  },
  mounted() {
    this.input = this.value
  },
  methods: {
    focus() {
      this.$refs.input.focus()
    }
  }
}
</script>
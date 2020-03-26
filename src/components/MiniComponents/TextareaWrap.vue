<template>
  <div class="input-wrap" :class="cls">
    <label v-if="input">{{placeholder}}</label>
    <textarea ref="input" :rows="rows" :placeholder="placeholder" v-model="input" :class="inputCls" @keydown="$emit('keydown', $event)" />
  </div>  
</template>

<script>
export default {
  name: 'TextareaWrap',
  props: {    
    placeholder: {
      type: String,
      default: 'Enter value'
    },
    value: {
      type: String,
      default: ''
    },    
    cls: {
      type: String,
      default: ''
    },
    inputCls: {
      type: String,
      default: ''
    },
    rows: {
      type: String,
      default: '4'
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
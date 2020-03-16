<template>
  <div class="toggle" :class="[classList, {reverse:position==='right'}]">
    <input v-if="position !== 'right'" @change="toggle()" :ref="uniqueId" type="checkbox" :id="uniqueId" :checked="checked || forceChecked" :disabled="forceChecked" />
    <label :ref="uniqueId+'label'" :for="uniqueId">{{text}}</label>
    <input v-if="position === 'right'" @change="toggle()" :ref="uniqueId" type="checkbox" :id="uniqueId" :checked="checked || forceChecked" :disabled="forceChecked" />
  </div>
</template>

<script>
import tools from '../../mixins/tools'

export default {
  name: "Toggle",
  props: {
    text: {
      type: String,
      default: ''
    },
    forceChecked: {
      type: Boolean,
      default: false
    },
    classList: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'left'
    },    
    localStorageKey: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      uniqueId: '',
      checked: tools.localStorage.get(this.localStorageKey + '_toggleswitch') === 'true'
    }
  },
  mounted () {
    this.uniqueId = tools.randomString()    
    if (this.checked) this.emit()
  },  
  methods: {
    toggle () {
      if (this.forceChecked) {
        tools.toastrWarning('This option cannot be disabled')
        return
      }

      this.checked = !this.checked
      this.emit()
      if (this.localStorageKey)
        tools.localStorage.set(this.localStorageKey + '_toggleswitch', this.checked.toString().toLowerCase())
    },
    emit () {
      this.$emit('toggle')
    }
  }
}
</script>
<template>
  <div class="checkbox" :class="classList" @click.prevent.stop="toggle()">
    <input :ref="uniqueId" type="checkbox" :id="uniqueId" :checked="checked || forceChecked" :disabled="forceChecked" />
    <label :ref="uniqueId+'label'" :for="uniqueId" class="check-box"></label>
    <span>{{text}}</span>
  </div>
</template>

<script>
import tools from '../../mixins/tools'
export default {
  name: "Checkbox",
  props: {
    text: {
      type: String,
      default: ""
    },
    forceChecked: {
      type: Boolean,
      default: false
    },
    classList: {
      type: String,
      default: ""
    },    
    localStorageKey: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      uniqueId: '',
      checked: tools.localStorage.get(this.localStorageKey + '_checkbox') === 'true'
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
        tools.localStorage.set(this.localStorageKey + '_checkbox', this.checked.toString().toLowerCase())
    },
    emit () {
      this.$emit('toggle')
    }
  }
};
</script>
<template>
  <div :id="uniqueId" class="dropdown" :class="[{open},cls]" @click="toggle()">
    {{text}}
    <div class="drop" :id="uniqueId+'-child'">
      <a 
      v-for="(item, index) in items" :key="index"
      :class="item.cls"
      @click.stop="clicked(item.emit)"
      >{{item.text}}
      </a>
    </div>
  </div>
</template>

<script>
import tools from '../../mixins/tools'

export default {
  name: 'Dropdown',
  props: {    
    defaultText: String,
    cls: String,
    items: Array
  },
  data() {
    return {
      uniqueId: '',
      open: false,
      text: this.defaultText
    }
  }, 
  mounted () {
    this.uniqueId = tools.randomString()
    this.f = event => this.closeEvent(event, this)
  },
  watch: {
    open () {
      this.bindCloseEvent()
    }
  },
  methods: {
    toggle () {
      this.open = !this.open
    },
    clicked (text) {
      this.text = text
      this.$emit('dropdown-click', text)
      this.open = false
    },
    setText (text) {
      this.text = text
    },
    closeEvent: (event, t) => {
      let offsets = document.getElementById(t.uniqueId).getBoundingClientRect();
      let childOffsets = document.getElementById(t.uniqueId+'-child').getBoundingClientRect();

      let top = offsets.top;
      let left = offsets.left;
      let right = offsets.right;
      let childBottom = childOffsets.bottom;

      let pageX = event.pageX
      let pageY = event.pageY

      if ((pageX >= left && pageX <= right) && (pageY >= top && pageY <= childBottom))
        return

      t.open = false
    },
    bindCloseEvent() {
      if (this.open) {
        document.addEventListener('mousedown', this.f)
      } else {
        document.removeEventListener('mousedown', this.f)
      }    
    }
  }
}
</script>
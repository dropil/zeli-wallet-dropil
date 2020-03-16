import { SET_PAGE_CLASS } from '../store/actions.type'

function getPageClass (vm) {
  const { pageClass } = vm.$options
  if (pageClass) {
    return typeof pageClass === 'function'
      ? pageClass.call(vm)
      : pageClass
  }

  return ''
}

export default {
  created () {
    let pageClass = getPageClass(this)
    if (pageClass) {
      this.$store.dispatch(SET_PAGE_CLASS, pageClass)
    }
  }
}

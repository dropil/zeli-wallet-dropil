<template>
  <div class="loading">
    <div class="centered">
      <i class="fas fa-spinner fa-spin"></i>
      <p>{{text}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    text: {
      type: String,
      default: 'Processing...'
    }
  }
}
</script>
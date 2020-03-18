<template>
  <footer class="footer">
    <div class="container lg">
      <div class="left">
        <div class="logo-copy">Copyright Dropil {{ year }}</div>
      </div>
      
      <div class="right">
        <ul class="nav">
          <li>
            <a href="https://dropilchain.com">Website</a>
          </li>          
          <li>
            <a href="https://github.com/dropil/dropil-chain-app">Github</i></a>
          </li>
          <li>
            <a href="https://home.dropil.com/support">Support</a>
          </li>
          <li>
            <a target="_blank" href="https://dropil.com/terms-of-use">Terms of Service</a>
          </li>
          <li>
            <a target="_blank" href="https://dropil.com/privacy-policy">Privacy Policy</a>
          </li>
        </ul>
        <ul class="social">
          <li>
            <a class="fb" target="_blank" href="https://facebook.com/DropilCoin"></a>
          </li>
          <li>
            <a class="tw" target="_blank" href="https://twitter.com/DropilCoin"></a>
          </li>
          <li>
            <a class="yt" target="_blank" href="https://youtube.com/c/DropilCoin"></a>
          </li>
          <li>
            <a class="tg" target="_blank" href="https://t.me/DropilCoin"></a>
          </li>
        </ul>
      </div>      
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  computed: {
    year() {
      return new Date().getFullYear()
    }
  }
}
</script>
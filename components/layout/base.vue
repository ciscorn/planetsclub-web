<template>
  <div :class="{ 'is-fill': fill }" class="basecontainer">
    <header v-if="!noheader" ref="header" :class="headerClass">
      <nav-bar :spaced="!fill && spaced" />
    </header>
    <main>
      <slot />
    </main>
    <!--
    <footer v-if="!nofooter" class="footer">
      <div class="container">planetsclub-web</div>
    </footer>
    -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NavBar from './navbar.vue'

export default Vue.extend({
  components: { NavBar },
  props: {
    noheader: { type: Boolean, default: false },
    nofooter: { type: Boolean, default: false },
    fill: { type: Boolean, default: false }
  },
  data() {
    return {
      seriesActive: false,
      spaced: true,
      alerts: [],
      headerClass: {
        header: true,
        'is-scrolled-out': false,
        'is-sticky': false
      },
      accumScrollY: 0,
      prevScrollY: 0
    }
  },
  apollo: {},
  mounted() {
    this.accumScrollY = 0
    this.prevScrollY = window.scrollY
    window.addEventListener('scroll', this.onScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    colorToCSS(color: string) {
      const style = {}
      style['is-' + color.toLowerCase()] = true
      return style
    },
    onScroll(): void {
      this.accumScrollY += window.scrollY - this.prevScrollY
      const headerRect = (this.$refs.header as Element).getBoundingClientRect()

      if (window.scrollY <= 0) {
        this.headerClass['is-sticky'] = false
        this.headerClass['is-scrolled-out'] = false
        this.accumScrollY = 0
      }

      this.spaced = headerRect.height * 2 > window.scrollY

      if (this.accumScrollY > 30) {
        // down
        if (window.scrollY <= headerRect.height) {
          this.headerClass['is-scrolled-out'] = false
          document.documentElement.style.setProperty(
            '--header-space',
            '3.25rem'
          )
        } else {
          this.headerClass['is-scrolled-out'] = true
          document.documentElement.style.setProperty('--header-space', '0')
        }
        this.accumScrollY = 0
      } else if (this.accumScrollY < -30) {
        // up
        if (window.scrollY <= headerRect.height) {
          this.headerClass['is-scrolled-out'] = false
          document.documentElement.style.setProperty(
            '--header-space',
            '3.25rem'
          )
        } else {
          this.headerClass['is-sticky'] = true
          this.headerClass['is-scrolled-out'] = false
          document.documentElement.style.setProperty(
            '--header-space',
            '3.25rem'
          )
        }
        this.accumScrollY = 0
      }
      this.prevScrollY = window.scrollY
    }
  }
})
</script>

<style lang="scss">
html,
body,
#__nuxt,
#__layout {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>

<style lang="scss" scoped>
@import 'bulma/sass/utilities/_all.sass';

.basecontainer {
  display: flex;
  flex-direction: column;
}
.is-fill {
  height: 100%;
  header,
  footer {
    flex-grow: 0;
  }
  main {
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
  }
}

.alerts-section {
  padding: 1.5rem 1.5em 0;
  .message-body {
    padding-top: 0.8em;
    padding-bottom: 0.8em;
  }
}

@include desktop {
  .header {
    .navbar {
      transition: padding-bottom 0.15s ease-out, padding-top 0.15s ease-out;
    }
    &.is-sticky {
      position: sticky;
      top: 0;
      z-index: 35;
      transform: translateY(0);
      transition: transform 0.15s ease-out;
    }
    &.is-scrolled-out {
      transform: translateY(-3.25rem);
    }
  }
}
</style>

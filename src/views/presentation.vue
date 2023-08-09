<template>
  <div class="clicker" @click="next"></div>
  <div class="slide" v-if="step < 3">
    <h1 class="slide_title">The Assignment</h1>
    <ul>
      <li class="fade" :class="{ fadeIn: step > 0 }">Generate and display planets</li>
      <li class="fade" :class="{ fadeIn: step > 1 }">Go as far as you want :-)</li>
    </ul>
  </div>
  <div class="slide" v-if="step <= 6">
    <h1 class="slide_title">Languages and Frameworks</h1>
    <img :class="{ fadeIn: step > 3 }" class="fade lang_logo" src="../assets/js-logo.png" alt="" />
    <img
      :class="{ fadeIn: step > 4 }"
      class="fade lang_logo"
      src="../assets/threejs-logo.png"
      alt=""
    />
    <img
      :class="{ fadeIn: step > 5 }"
      class="fade lang_logo"
      src="../assets/vuejs-logo.png"
      alt=""
    />
  </div>
  <div class="slide" v-if="step < 11" :class="{ final_pos: step > 9 }" @click="next">
    <h1 class="slide_title" v-if="step <= 9">Approach</h1>
    <h1 class="slide_title" v-if="step > 9">Planet</h1>
    <div :class="{ fadeIn: step > 7 }" class="fade img_left">
      <img src="../assets/planetgenerate-01.svg" class="logo-overlay" />
    </div>
    <div :class="{ fadeIn: step > 8 }" class="fade img_right">
      <img src="../assets/planetgenerate-02.svg" class="logo-overlay" />
    </div>
  </div>
  <div class="slide" v-if="step < 18">
    <h1>To the planet generator</h1>
  </div>
</template>

<style scoped>
.slide {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
  color: white;
}

.clicker {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 100;
}

.slide_title {
  flex-basis: 100%;
  text-align: center;
  margin-bottom: 1.2em;
  font-size: 3em;
}

.fade {
  opacity: 0;
  transition: opacity 0.2s linear;
}
.fadeIn {
  opacity: 1;
}

.lang_logo {
  height: 8em;
}

ul {
  padding-inline-start: 0;
  font-size: 1.5em;
}

.img_left,
.img_right {
  position: absolute;
  top: 50%;
  transition: transform 0.2s linear;
}

.img_left {
  left: 50%;
  width: 24vw;
  transform: translate(-140%, -50%);
}
.img_right {
  width: 26vw;
  left: 50%;
  transform: translate(40%, -50%);
}

.final_pos .img_left,
.final_pos .img_right {
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'presentation',
  data() {
    return {
      step: 0,
      lastStep: 11
    }
  },
  methods: {
    next() {
      if (this.step > this.lastStep) {
        this.$router.push('/generator')
        this.step = 0
        return
      }
      this.step++
    },
    prev() {
      if (this.step === 0) return
      this.step--
    },
    keyHandler(event) {
      if (event.code === 'Space' || event.code === 'ArrowRight') {
        this.next()
        return
      }
      if (event.code === 'ArrowLeft') {
        this.prev()
        return
      }
    }
  },
  created() {
    window.addEventListener('keydown', this.keyHandler)
  },
  destroyed() {
    window.removeEventListener('keydown', this.keyHandler)
  }
})
</script>

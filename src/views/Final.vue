<template>
  <div class="clicker" @click="next"></div>
  <div class="slide" v-if="step < 6">
    <h1 class="slide_title">Further ideas</h1>
    <ul>
      <li class="fade" :class="{ fadeIn: step > 0 }">
        Use GPU rendered shaders to create better materials
      </li>
      <li class="fade" :class="{ fadeIn: step > 1 }">
        Add a "time" component and show for example how a desert can develop
      </li>
      <li class="fade" :class="{ fadeIn: step > 2 }">Add a day/night cycle</li>
      <li class="fade" :class="{ fadeIn: step > 3 }">Option to control ruggedness of terrain</li>
      <li class="fade" :class="{ fadeIn: step > 4 }">Option to control water level</li>
    </ul>
  </div>
  <div class="slide" v-if="step > 5">
    <h1 class="slide_title">Thank you</h1>
    <h2 :class="{ fadeIn: step > 6 }" class="fade">Questions?</h2>
    <p :class="{ fadeIn: step > 9 }" class="fade back">
      <RouterLink to="/">to start</RouterLink> |
      <RouterLink to="/generator">to generator</RouterLink>
    </p>
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

.back {
  flex-basis: 100%;
  position: absolute;
  text-align: center;
  bottom: 2em;
  z-index: 200;
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
      lastStep: 110
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

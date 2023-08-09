<template>
  <div class="screenshot">
    <img @click="takeSnapshot" src="/src/assets/screenshot.svg" alt="" />
  </div>

  <div class="bottom_tab" :class="{ 'show-snapshots': snapshotsShown }">
    <div @click="snapshotsShown = !snapshotsShown" class="snapshot_title">
      <template v-if="snapshotsShown">▼</template>
      <template v-else>▲</template>
      snapshots ({{ snapshots.length }})
    </div>
    <div class="snapshots">
      <div class="fin" @click="toFinal">fin</div>
      <div class="snapshot" v-for="snap in snapshots">
        <img :src="snap.dataUrl" alt="" />
        <div class="snapshotActions">
          <a class="action download" target="_blank" :href="snap.dataUrl"
            ><img src="/src/assets/download.svg" alt=""
          /></a>
          <div class="action upload" @click="loadFromSnap(snap)">
            <img src="/src/assets/upload.svg" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="control_container" :class="{ 'hide-controls': !controlsShown }">
    <div @click="toggleControls" class="toggleControls">
      <template v-if="controlsShown">▶</template>
      <template v-else>◀</template>
    </div>
    <div class="controls">
      Parameter control

      <div class="inputgroup">
        <label for="planetSize">Planet Size</label>
        <input type="number" v-model="planetSize" />
      </div>

      <div class="inputgroup">
        <input id="colorOceanFloor" type="color" v-model="colors.oceanFloor" />
        <label for="colorOceanFloor">Ocean Floor</label>
        <div class="inputgroup">
          <input
            id="rangeOceanFloor"
            class="small"
            type="number"
            step="0.1"
            min="0"
            :max="colorRanges.sand - 0.1"
            v-model.number="colorRanges.oceanFloor"
            @change="checkRanges()"
          />
          <label for="rangeOceanFloor">Color Height</label>
        </div>
      </div>
      <div class="inputgroup">
        <input id="colorSand" type="color" v-model="colors.sand" />
        <label for="colorSand">Sand</label>
        <div class="inputgroup">
          <input
            id="rangeOceanFloor"
            class="small"
            type="number"
            step="0.1"
            :min="colorRanges.oceanFloor + 0.1"
            :max="colorRanges.vegetationLight - 0.1"
            v-model.number="colorRanges.sand"
            @change="checkRanges()"
          />
          <label for="rangeSand">Color Height</label>
        </div>
      </div>
      <div class="inputgroup">
        <input id="colorVegetationLight" type="color" v-model="colors.vegetationLight" />
        <label for="colorVegetationLight">Vegetation Light</label>
        <div class="inputgroup">
          <input
            id="rangeSand"
            class="small"
            type="number"
            step="0.1"
            :min="colorRanges.sand + 0.1"
            :max="colorRanges.vegetationDark - 0.1"
            v-model.number="colorRanges.vegetationLight"
            @change="checkRanges()"
          />
          <label for="rangeSand">Color Height</label>
        </div>
      </div>
      <div class="inputgroup">
        <input id="colorVegetationDark" type="color" v-model="colors.vegetationDark" />
        <label for="colorVegetationDark">Vegetation Dark</label>
        <div class="inputgroup">
          <input
            id="rangeVegetationLight"
            class="small"
            type="number"
            step="0.1"
            :min="colorRanges.vegetationLight + 0.1"
            :max="colorRanges.mountain - 0.1"
            v-model.number="colorRanges.vegetationDark"
            @change="checkRanges()"
          />
          <label for="rangeVegetationDark">Color Height</label>
        </div>
      </div>
      <div class="inputgroup">
        <input id="colorMountain" type="color" v-model="colors.mountain" />
        <label for="colorMountain">Mountain</label>
        <div class="inputgroup">
          <input
            id="rangeVegetationDark"
            class="small"
            type="number"
            step="0.1"
            :min="colorRanges.vegetationDark + 0.1"
            :max="colorRanges.snow - 0.1"
            v-model.number="colorRanges.mountain"
            @change="checkRanges()"
          />
          <label for="rangeMountain">Color Height</label>
        </div>
      </div>
      <div class="inputgroup">
        <input id="colorSnow" type="color" v-model="colors.snow" />
        <label for="colorSnow">Snow</label>
        <div class="inputgroup">
          <input
            id="rangeMountain"
            class="small"
            type="number"
            step="0.1"
            :min="colorRanges.mountain + 0.1"
            v-model.number="colorRanges.snow"
            @change="checkRanges()"
          />
          <label for="rangeSnow">Color Height</label>
        </div>
      </div>

      <div class="inputgroup">
        <label for="waterColorModifier">Water Color Modifier</label>
        <input
          id="waterColorModifier"
          type="range"
          v-model.number="waterColorModifier"
          step="36"
          min="-180"
          max="180"
        />
      </div>

      <div class="inputgroup">
        <input type="checkbox" v-model="randomiseSeed" id="randomiseSeed" />
        <label for="randomiseSeed">Random Seed Value</label>
        <div class="inputgroup">
          <input type="text" v-model="seed" :disabled="randomiseSeed" />
        </div>
      </div>

      <div class="inputgroup">
        <button @click="regenerate">regenerate</button>
      </div>
      <hr />
      <span @click="loadPreset(0)" class="btn">preset #1</span>,
      <span @click="loadPreset(1)" class="btn">preset #2</span>,
      <span @click="loadPreset(2)" class="btn">preset #3</span>
    </div>
  </div>
</template>

<style scoped>
hr {
  margin-top: 1em;
}
.btn {
  cursor: pointer;
}
.screenshot {
  position: fixed;
  width: 4em;
  opacity: 0.2;
  cursor: pointer;
}
.screenshot:hover {
  opacity: 0.8;
}

.show-snapshots .fin {
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 0.5em;
  cursor: pointer;
  z-index: 500;
}

.bottom_tab {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 20;
  height: 2.6em;
  overflow: hidden;
  transition: height 0.2s linear;
}
.show-snapshots {
  height: 14em;
}
.snapshot_title {
  padding: 0.5em 1em;
  cursor: pointer;
}
.snapshots {
  width: 100vw;
  border-top: 1px solid white;
  height: 10.5em;
  background-color: rgba(22, 8, 50, 0.7);
  display: flex;
}
.snapshot {
  height: 9em;
  padding-top: 0.5em;
  padding-left: 0.5em;
  position: relative;
}
.snapshot img {
  height: 9em;
  max-width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.snapshotActions {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
}
.snapshotActions .action {
  width: 2em;
  height: 2em;
  cursor: pointer;
}

.download img,
.upload img {
  border: 0px;
  height: auto;
  margin-right: 0.4em;
}

.control_container {
  border: 1px solid white;
  width: 20em;
  display: block;
  position: fixed;
  z-index: 100;
  color: white;
  right: 1em;
  top: 1em;
  padding: 0.8em;
  transition: all 0.2s linear;
  background-color: rgba(22, 8, 50, 0.7);
}

.toggleControls {
  position: absolute;
  left: -2.1em;
  width: 1.6em;
  height: 1.6em;
  text-align: center;
  line-height: 1.5em;
  cursor: pointer;
}

.hide-controls {
  transform: translateX(100%);
  right: 0;
  top: 0;
}

input[type='checkbox'] {
  margin-right: 0.5em;
}

input[type='checkbox'] + label,
input[type='number'] + label,
input[type='color'] + label {
  display: inline-block;
  vertical-align: middle;
}

label {
  display: block;
}
.inputgroup {
  margin-top: 0.5em;
}
.inputgroup > .inputgroup {
  margin-top: 0;
}

input[type='color'] {
  display: inline-block;
  vertical-align: middle;
  inline-size: 32px;
  padding: 2px;
  margin-right: 2em;
}

input[type='number'].small {
  width: 4em;
  margin-right: 0.4em;
}
</style>

<script lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { defineComponent } from 'vue'
import alea from 'alea'

import Water from '../components/3d/water'
import Land from '../components/3d/land'
import Clouds from '../components/3d/clouds'
import Stars from '../components/3d/stars'

// setup THREEjs scene/camera/renderer
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1500)
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  preserveDrawingBuffer: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x130329, 1)
document.body.appendChild(renderer.domElement)

// set camera so it sees default planet
camera.position.z = 260

// some light
const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(400, 0, 100)
camera.add(pointLight)
scene.add(camera)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight)

// Enable mouse controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// define variables
const planetSize = 120
const waterHeightModifier = 1
const initialSeed = Math.random()

// generate classes
const water = new Water(planetSize, waterHeightModifier)
const land = new Land(planetSize, initialSeed)
const clouds = new Clouds(planetSize)
const stars = new Stars(planetSize)

// setup snapshot functionality
let takeScreenshot = false
const snapshots = []

// render loop
const render = () => {
  const time = performance.now() * 0.001
  controls.update()
  water.render(time)
  land.render(time)
  clouds.render(time)
  stars.render(time)
  renderer.render(scene, camera)
  if (takeScreenshot === true) {
    snapshots[snapshots.length - 1].dataUrl = renderer.domElement.toDataURL()
    takeScreenshot = false
  }
}
const renderLoop = () => {
  render()
  requestAnimationFrame(renderLoop)
}

// create 3d objects
water.createObj()
land.createObj()
clouds.createObj()
stars.createObj()

// add 3d objects to scene
scene.add(water.obj)
scene.add(land.obj)
scene.add(clouds.obj)
scene.add(stars.obj)

// start renderloop
renderLoop()

// vuejs
export default defineComponent({
  name: 'generator',
  data() {
    return {
      seed: 0,
      randomiseSeed: true,
      controlsShown: false,
      snapshotsShown: false,
      planetSize: 120,
      waterHeightModifier: 1,
      waterColorModifier: 0,
      colors: {
        oceanFloor: '#665a48',
        sand: '#cfb997',
        vegetationLight: '#5f8d4e',
        vegetationDark: '#5e6f64',
        mountain: '#b3b3b3',
        snow: '#ffffff'
      },
      colorRanges: {
        oceanFloor: 0,
        sand: 2,
        vegetationLight: 3,
        vegetationDark: 6.5,
        mountain: 7,
        snow: 10.5
      },
      snapshots: snapshots,
      presets: [
        {
          planetSize: 110,
          seed: 0.6773973082108338,
          colors: {
            oceanFloor: '#665a48',
            sand: '#cfb997',
            vegetationLight: '#8c834d',
            vegetationDark: '#657069',
            mountain: '#b3b3b3',
            snow: '#d8d8d8'
          },
          ranges: {
            oceanFloor: 0,
            sand: 2,
            vegetationLight: 3,
            vegetationDark: 6.5,
            mountain: 7,
            snow: 10.5
          },
          waterColorModifier: -36,
          camera: { x: 0, y: 0, z: 260 }
        },
        {
          planetSize: 110,
          seed: 0.1859619978846042,
          colors: {
            oceanFloor: '#2b1aa0',
            sand: '#7891ce',
            vegetationLight: '#d6bd24',
            vegetationDark: '#a79300',
            mountain: '#b24e20',
            snow: '#d81172'
          },
          ranges: {
            oceanFloor: 0,
            sand: 2,
            vegetationLight: 3,
            vegetationDark: 6.5,
            mountain: 7,
            snow: 10.5
          },
          waterColorModifier: -108,
          camera: { x: 0, y: 0, z: 260 }
        },
        {
          planetSize: 110,
          seed: 0.17411251909892023,
          colors: {
            oceanFloor: '#4ae4e4',
            sand: '#90ceb3',
            vegetationLight: '#bf5e41',
            vegetationDark: '#1ac400',
            mountain: '#5cf2b4',
            snow: '#cdffe7'
          },
          ranges: {
            oceanFloor: 0,
            sand: 2,
            vegetationLight: 3,
            vegetationDark: 6.5,
            mountain: 7,
            snow: 10.5
          },
          waterColorModifier: 108,
          camera: { x: 0, y: 0, z: 270 }
        }
      ]
    }
  },
  mounted() {
    this.seed = initialSeed
  },
  computed: {
    colorKeys() {
      return Object.keys(this.colors)
    },
    numColors() {
      return this.colorKeys.length
    }
  },
  methods: {
    toggleControls() {
      this.controlsShown = !this.controlsShown
    },
    checkRanges() {
      if (this.colorRanges.oceanFloor < 0) {
        this.colorRanges.oceanFloor = 0
      }
      for (let i = 1; i < this.numColors; i++) {
        const prev = this.colorRanges[this.colorKeys[i - 1]]
        const curr = this.colorRanges[this.colorKeys[i]]
        if (curr <= prev) {
          this.colorRanges[this.colorKeys[i]] = prev + 0.1
        }
      }
    },
    regenerate() {
      // update the seed if needed
      if (this.randomiseSeed === true) {
        this.seed = Math.random()
      }
      clouds.setPlanetSize(this.planetSize)
      clouds.replaceMesh()

      water.setPlanetSize(this.planetSize)
      water.setWaterColorModifier(this.waterColorModifier)
      water.replaceMesh()

      land.setSeed(this.seed)
      land.setPlanetSize(this.planetSize)
      land.setColors(this.colors)
      land.setColorRanges(this.colorRanges)
      land.replaceMesh()
    },
    takeSnapshot() {
      this.snapshots.push(
        JSON.parse(
          JSON.stringify({
            dataUrl: '',
            planetSize: this.planetSize,
            seed: this.seed,
            colors: this.colors,
            ranges: this.colorRanges,
            waterColorModifier: this.waterColorModifier,
            camera: camera.position
          })
        )
      )
      takeScreenshot = true
      setTimeout(() => {
        this.snapshots.push({})
        this.snapshots.pop()
      }, 1000)
    },
    loadFromSnap(snap) {
      this.seed = snap.seed
      this.planetSize = snap.planetSize
      this.colors = snap.colors
      this.ranges = snap.colorRanges
      this.waterColorModifier = snap.waterColorModifier
      this.randomiseSeed = false
      camera.position.set(snap.camera.x, snap.camera.y, snap.camera.z)
      this.regenerate()
    },
    loadPreset(index) {
      console.log(this.presets[index % this.presets.length])
      this.loadFromSnap(this.presets[index % this.presets.length])
    },
    toFinal() {
      document.querySelectorAll('canvas').forEach((canvas) => canvas.remove())

      this.$router.push('/final')
    }
  }
})
</script>

import * as THREE from 'three'
import * as ExtraMath from './math'

export default class Water {
  constructor(planetSize, waterHeightModifier) {
    this.planetSize = planetSize
    this.obj
    this.waterHeightModifier = waterHeightModifier
    this.waterMaterial
    this.waterColorModifier = '0'
    this.prevWaterColorModifier = '0'
  }
  setPlanetSize(value) {
    this.planetSize = value
  }
  setWaterHeightModifier(value) {
    this.waterHeightModifier = value
  }
  setWaterColorModifier(value) {
    if (value === 0) {
      this.waterColorModifier = value
    } else {
      if (value < 0) {
        this.waterColorModifier = `m${value.toString().slice(1)}`
      } else {
        this.waterColorModifier = `p${value}`
      }
    }
  }
  createGeometry() {
    return new THREE.OctahedronGeometry(this.planetSize * 1.015 * this.waterHeightModifier, 30)
  }
  createMaterial() {
    // load water texture
    const textureLoader = new THREE.TextureLoader()
    const waterTexture = textureLoader.load(`/src/assets/water-${this.waterColorModifier}.jpg`)
    waterTexture.wrapS = THREE.RepeatWrapping
    waterTexture.wrapT = THREE.RepeatWrapping

    this.waterMaterial = new THREE.MeshStandardMaterial({
      map: waterTexture,
      roughness: 0.8,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9
    })
  }
  createObj() {
    // define geometry
    // Create a low-poly water mesh
    const waterGeometry = this.createGeometry()
    this.createMaterial()

    this.obj = new THREE.Mesh(waterGeometry, this.waterMaterial)
    this.obj.name = 'water'
  }
  render(time) {
    // Animate the water texture by updating the texture offset
    const speed = 0.1 // adjust the speed of the animation
    const frequency = 2 // adjust the frequency of the waves
    const amplitude = 0.02 // adjust the amplitude of the waves
    const xOffset = time * speed
    const yOffset = time * speed
    const xWave = Math.sin(xOffset * frequency) * amplitude
    const yWave = Math.sin(yOffset * frequency) * amplitude
    // this.waterMaterial.map.offset.set(xWave, yWave)
  }
  replaceMesh() {
    const newGeometry = this.createGeometry()
    if (this.waterColorModifier !== this.prevWaterColorModifier) {
      this.createMaterial()
      this.prevWaterColorModifier = this.waterColorModifier
      this.obj.material = this.waterMaterial
    }
    this.obj.geometry = newGeometry
  }
}

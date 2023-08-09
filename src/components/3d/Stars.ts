import * as THREE from 'three'
import * as ExtraMath from './math'

export default class Stars {
  constructor(planetSize) {
    this.planetSize = planetSize
    this.obj
    this.starsMaterial
  }
  setPlanetSize(newPlanetSize) {
    this.planetSize = newPlanetSize
  }
  createGeometry() {
    return new THREE.SphereGeometry(this.planetSize * 8, 32, 32)
  }
  createObj() {
    const geometry = this.createGeometry()

    // Create a material with a cloud texture
    const textureLoader = new THREE.TextureLoader()
    const starsTexture = textureLoader.load('/src/assets/stars1.png')
    starsTexture.wrapS = THREE.RepeatWrapping
    starsTexture.wrapT = THREE.RepeatWrapping
    starsTexture.repeat.set(22, 22)

    this.starsMaterial = new THREE.MeshStandardMaterial({
      map: starsTexture,
      color: '#ffffff',
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    })

    this.obj = new THREE.Mesh(geometry, this.starsMaterial)
    this.obj.name = 'stars'
  }
  render(time) {
    // Animate the cloud texture by updating the texture offset
    const speed = 0.002 // adjust the speed of the animation
    const xOffset = time * speed
    const yOffset = time * speed
    this.starsMaterial.map.offset.set(-xOffset, yOffset)
  }
  replaceMesh() {
    const newGeometry = this.createGeometry()
    this.obj.geometry = newGeometry
  }
}

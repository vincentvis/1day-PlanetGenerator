import * as THREE from 'three'
import * as ExtraMath from './math'

export default class Clouds {
  constructor(planetSize) {
    this.planetSize = planetSize
    this.obj
    this.cloudMaterial
  }
  setPlanetSize(newPlanetSize) {
    this.planetSize = newPlanetSize
  }
  createGeometry() {
    return new THREE.SphereGeometry(this.planetSize * 1.3, 32, 32)
  }
  createMaterial() {
    // Create a material with a cloud texture
    const textureLoader = new THREE.TextureLoader()
    const cloudTexture = textureLoader.load('/src/assets/clouds.png')
    cloudTexture.wrapS = THREE.RepeatWrapping
    cloudTexture.wrapT = THREE.RepeatWrapping
    cloudTexture.repeat.set(1, 1)

    this.cloudMaterial = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      color: '#ffffff',
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    })
  }
  createObj() {
    const cloudGeometry = this.createGeometry()
    this.createMaterial()

    this.obj = new THREE.Mesh(cloudGeometry, this.cloudMaterial)
    this.obj.name = 'clouds'
  }
  render(time) {
    // Animate the cloud texture by updating the texture offset
    const speed = 0.004 // adjust the speed of the animation
    const xOffset = time * speed
    this.cloudMaterial.map.offset.set(-xOffset, 0)
  }
  replaceMesh() {
    const newGeometry = this.createGeometry()
    this.obj.geometry = newGeometry
  }
}

import * as THREE from 'three'
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise'
import { createNoise4D } from 'simplex-noise'
import * as ExtraMath from './math'
import alea from 'alea'

export default class Land {
  constructor(planetSize, seed) {
    this.planetSize = planetSize
    this.obj
    this.seed = seed
    this.planetMaterial
    this.colors = {
      oceanFloor: 0x665a48,
      sand: 0xcfb997,
      vegetationLight: 0x5f8d4e,
      vegetationDark: 0x5e6f64,
      mountain: 0xb3b3b3,
      snow: 0xffffff
    }
    this.colorRanges = {
      oceanFloor: 0,
      sand: 2,
      vegetationLight: 3,
      vegetationDark: 6.5,
      mountain: 7,
      snow: 10.5
    }
    this.colorMax = 0xffffff
    this.colorMin = 0x000000
    this.colorRangeMin = 0
    this.colorRangeMax = 10.5
  }
  setSeed(newSeed) {
    this.seed = newSeed
  }
  setPlanetSize(newPlanetSize) {
    this.planetSize = newPlanetSize
  }
  setColors(colors) {
    Object.keys(colors).forEach((color) => {
      const fromHex = parseInt(colors[color].slice(1), 16)
      if (fromHex > this.colorMin && fromHex < this.colorMax) {
        this.colors[color] = fromHex
      }
    })
  }
  setColorRanges(colorRanges) {
    const maxInInput = Math.max(...Object.values(colorRanges))
    Object.keys(colorRanges).forEach((colorRange) => {
      // all colors should be within a min & max
      this.colorRanges[colorRange] = ExtraMath.map(
        colorRanges[colorRange],
        0,
        maxInInput,
        this.colorRangeMin,
        this.colorRangeMax
      )
    })
  }
  createGeometry() {
    const geometry = new THREE.OctahedronGeometry(this.planetSize, this.planetSize + 20)

    const rand = alea(this.seed)
    const perlin = new ImprovedNoise()
    const noise4D = createNoise4D(rand)

    // get the positional attributes from the geometry created
    const positionAttribute = geometry.getAttribute('position')
    const colorAttribute = new THREE.Float32BufferAttribute(positionAttribute.count * 3, 3)

    for (let i = 0; i < positionAttribute.count; i++) {
      const v3 = new THREE.Vector3(
        positionAttribute.getX(i),
        positionAttribute.getY(i),
        positionAttribute.getZ(i)
      )

      const noise1 = noise4D(v3.x / 72, v3.y / 64, v3.z / 72, 1)
      const noise2 = noise4D(v3.x / 28, v3.y / 24, v3.z / 28, 1)
      const noise3 = noise4D(v3.x / 12, v3.y / 12, v3.z / 12, 1)

      const initialHeight =
        (ExtraMath.smoothstep(-0.05, 0.05, noise1 + noise2) * 2 - 1) *
        (2 +
          ExtraMath.smoothstep(0.1, 0.2, Math.pow(noise1 + noise2, 2)) * 2 +
          ExtraMath.smoothstep(0.6, 0.7, Math.pow(noise1 + noise2, 2)) * 4 +
          noise3 * 0.2)

      // Use Perlin noise to add additional detail to the height
      const perlinNoise = perlin.noise(v3.x / 200, v3.y / 200, v3.z / 200)

      let height = initialHeight + perlinNoise * 2
      if (initialHeight > 7) {
        const peakNoise = perlin.noise(v3.x / 5, v3.y / 5, v3.z / 5)
        height += peakNoise * 8
      }

      v3.add(v3.clone().normalize().multiplyScalar(height))

      const color = this.getColorAtHeight(height)
      colorAttribute.setXYZ(i, color.r, color.g, color.b)
      positionAttribute.setXYZ(i, v3.x, v3.y, v3.z)
    }
    return [geometry, colorAttribute]
  }
  createMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 1,
      metalness: 0
    })
  }
  createObj() {
    // The basic shape we're going to work with
    const [geometry, colorAttribute] = this.createGeometry()
    this.createMaterial()

    this.obj = new THREE.Mesh(geometry, this.material)
    this.obj.name = 'planet'
    this.obj.geometry.setAttribute('color', colorAttribute)
  }
  getColorAtHeight(height: number): THREE.Color {
    // Sample the color map at the given height
    const colorMap = [
      { height: -8, color: new THREE.Color(this.colors.oceanFloor) },
      { height: this.colorRanges.oceanFloor, color: new THREE.Color(this.colors.oceanFloor) },
      { height: this.colorRanges.sand, color: new THREE.Color(this.colors.sand) },
      {
        height: this.colorRanges.vegetationLight,
        color: new THREE.Color(this.colors.vegetationLight)
      },
      {
        height: this.colorRanges.vegetationDark,
        color: new THREE.Color(this.colors.vegetationDark)
      },
      { height: this.colorRanges.mountain, color: new THREE.Color(this.colors.mountain) },
      {
        height: Math.max(this.colorRanges.mountain, this.colorRanges.snow - 1),
        color: new THREE.Color(this.colors.mountain)
      },
      { height: this.colorRanges.snow, color: new THREE.Color(this.colors.snow) },
      { height: 40, color: new THREE.Color(this.colors.snow) }
    ]

    for (let i = colorMap.length - 1; i >= 0; i--) {
      if (height >= colorMap[i].height) {
        // Interpolate between the current and next color based on the height
        // creates a gradient effect based on the difference in height
        const next = colorMap[i + 1] || colorMap[i]
        const prev = colorMap[i]
        const t = ExtraMath.map(height, prev.height, next.height, 0, 1)

        return prev.color.clone().lerp(next.color, t)
      }
    }

    return new THREE.Color(0xffffff)
  }
  replaceMesh() {
    const [newGeometry, colorAttribute] = this.createGeometry()
    this.obj.geometry = newGeometry
    this.obj.geometry.setAttribute('color', colorAttribute)
  }
  render(time) {}
}

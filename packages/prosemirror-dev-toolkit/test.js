import fs from 'fs'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'

const img1 = PNG.sync.read(fs.readFileSync('img1.png'))
const img2 = PNG.sync.read(fs.readFileSync('img2.png'))
const { width, height } = img1
const diff = new PNG({ width, height })

const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, {
  alpha: 0.2,
  threshold: 0.001
})
console.log('numDiffPixels: ', numDiffPixels)
fs.writeFileSync('diff.png', PNG.sync.write(diff))

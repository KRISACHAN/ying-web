import { ref } from 'vue'

const imageCreating = ref(false)
const image = ref(null)

const clearRect = canvas => {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const asyncDrawImage = (url, mainCanvas) =>
  new Promise(resovle => {
    const img = new Image()
    img.src = url
    img.onload = () => {
      const { naturalHeight, naturalWidth } = img
      const maxHeight = naturalHeight
      const maxWidth = naturalWidth
      const sizeRatio = document.body.clientWidth / maxWidth
      const usedHeight = Math.ceil(sizeRatio * maxHeight)
      const usedWidth = Math.ceil(sizeRatio * maxWidth)
      const cacheCanvas = document.createElement('canvas')
      cacheCanvas.width = maxWidth
      cacheCanvas.height = maxHeight
      mainCanvas.width = maxWidth
      mainCanvas.height = maxHeight
      clearRect(mainCanvas)
      cacheCanvas
        .getContext('2d')
        .drawImage(img, 0, 0, cacheCanvas.width, cacheCanvas.height)
      const mainCtx = mainCanvas.getContext('2d')
      mainCtx.clearRect(0, 0, usedWidth, usedHeight)
      mainCtx.drawImage(cacheCanvas, 0, 0)
      resovle(mainCanvas)
    }
  })

const asyncConvertCanvasToImage = async canvas =>
  new Promise((resovle, reject) => {
    const img = new Image()
    img.setAttribute('crossorigin', 'anonymous')
    img.src = canvas.toDataURL('image/png')
    img.onload = () => {
      try {
        resovle(img)
      } catch (error) {
        reject(error)
      }
    }
  })

const createTextToCard = async (canvas, text = '?') => {
  const dpr = window.devicePixelRatio
  const ctx = canvas.getContext('2d')

  const fontWeight = 'bolder'
  const fontSize = canvas.width * 0.5

  ctx.font = `${fontWeight} ${fontSize}px Arial`

  ctx.fillStyle = '#5086f7'
  ctx.textAlign = 'center'

  const textLeft = canvas.width * 0.5
  const textTop = canvas.height * 0.7

  ctx.fillText(text, textLeft, textTop)
}

const toRenderImage = async ({ url, canvasDom, text = '?' }) => {
  imageCreating.value = true
  const mainCanvas = await asyncDrawImage(url, canvasDom)
  await createTextToCard(mainCanvas, text)
  image.value = await asyncConvertCanvasToImage(mainCanvas)
  canvasDom.setAttribute('src', image.value.src)
  imageCreating.value = false
  return image.value
}

const useImage = () => {
  return {
    toRenderImage,
    imageCreating,
    image
  }
}

export default useImage

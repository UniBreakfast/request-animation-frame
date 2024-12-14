const ctx = canv.getContext("2d")

const params = {
  size: 80,
  lastTime: null,
  speed: 20 / 1000, // px/ms
  objects: [ makeTriangle(40, 40) ]
}

canv.width = innerWidth - 20
canv.height = innerHeight - 20

canv.onclick = draw
canv.onmousedown = () => canv.onmousemove = draw
canv.onmouseup = () => canv.onmousemove = null

requestAnimationFrame(drawAll)

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

function drawTriangle(x, y, size, angle = 0, color) {
  const r = Math.sqrt(size ** 2 - (size / 2) ** 2) / 3

  const x1 = 2 * r * Math.cos((150 + angle) / 360 * 2 * Math.PI) + x
  const x2 = 2 * r * Math.cos((30 + angle) / 360 * 2 * Math.PI) + x
  const x3 = 2 * r * Math.cos((270 + angle) / 360 * 2 * Math.PI) + x
  const y1 = 2 * r * Math.sin((150 + angle) / 360 * 2 * Math.PI) + y
  const y2 = 2 * r * Math.sin((30 + angle) / 360 * 2 * Math.PI) + y
  const y3 = 2 * r * Math.sin((270 + angle) / 360 * 2 * Math.PI) + y

  ctx.beginPath()
  ctx.lineTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.lineTo(x3, y3)
  ctx.closePath()

  ctx.fillStyle = color
  ctx.fill()
}

function drawAll(timestamp) {
  const time = timestamp - params.lastTime

  ctx.fillStyle = `rgba(255, 255, 255, .3)`
  ctx.fillRect(0, 0, canv.width, canv.height)
  params.objects.sort((a, b) => a.size - b.size)
  params.objects.forEach(makeObjectHandler(time))

  requestAnimationFrame(drawAll)
  params.lastTime = timestamp
}

function draw(e) {
  const { offsetX, offsetY } = e
  params.objects.push(makeTriangle(offsetX, offsetY))
}

function makeTriangle(x, y) {
  const rndNum = rnd(1, 90)
  return {
    x,
    y,
    timeLeft: 15e4,
    speed: rndNum / 1000,
    size: rndNum * 1,
    color: `hsl(${new Date().getSeconds() * 12} 85% ${rndNum}%)`,
    angle: 0,
    fall: rnd(-130, 130)
  }
}

function makeObjectHandler(time) {
  return object => {
    const distance = time * object.speed
    const { x, y, size, angle, color } = object

    drawTriangle(x, y, size, angle, color)
    object.timeLeft -= time
    object.x += distance
    object.angle += distance
    object.y += object.fall / 200

    if (object.timeLeft < 0) {
      params.objects.splice(params.objects.indexOf(object), 1)
    }
  }
}

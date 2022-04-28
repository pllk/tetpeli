ctx = canvas.getContext("2d")
tileSize = 50

function newImage(src) {
    let img = new Image()
    img.src = src
    return img
}
function floorToMul(num, mul) {
    return Math.floor(num / mul) * mul
}

let carrotsprite = newImage("images/carrot.png")
let carrots = []
let wallsprite = newImage("images/wall.png")
let walls = []
let path = []
let cmds = []

function getCollision(object, objects) {
    for (let o of objects) {
        if (o.x == object.x && o.y == object.y) {
            return o
        }
    }
}

const player = {
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    sprites: {
        up: newImage("images/rabbitup.png"),
        down: newImage("images/rabbitdown.png"),
        left: newImage("images/rabbitleft.png"),
        right: newImage("images/rabbitright.png"),
    },
    isMoving: true,
    points: 0,
    text: "",
    speaking: false,
}
player.sprite = player.sprites.up

const mouse = {
    x: 0,
    y: 0
}

const bubble = {
    text: "",
    draw: false,
}
canvas.onmousemove = event => {
    mouse.x = event.offsetX
    mouse.y = event.offsetY
}

canvas.onclick = () => {
    let x = floorToMul(mouse.x, tileSize)
    let y = floorToMul(mouse.y, tileSize)

    const collision = getCollision({ x: x, y: y }, walls)
    if (collision) {
        walls.splice(walls.indexOf(collision), 1)
        return
    }
    if (getCollision({ x: x, y: y }, carrots)) { return }
    walls.push({
        x: x,
        y: y,
    })
}
function randomCarrot() {
    let colliding = true
    let x, y
    while (colliding) {
        colliding = false
        x = floorToMul(Math.random() * canvas.width, tileSize)
        y = floorToMul(Math.random() * canvas.height, tileSize)
        const result = getCollision({ x: x, y: y }, carrots.concat(walls, [player]))
        if (result) {
            colliding = true
            break
        }
    }
    carrots.push({
        x: x,
        y: y
    })
}


for (let i = 0; i < 40; i++) {
    randomCarrot()
}

document.onkeydown = event => {
    if (event.key == "f") {
        randomCarrot()
    }
    if (event.repeat) { return }

    if (event.key == "ArrowUp") {
        handleMovement("up")
    } else if (event.key == "ArrowDown") {
        handleMovement("down")
    } else if (event.key == "ArrowLeft") {
        handleMovement("left")
    } else if (event.key == "ArrowRight") {
        handleMovement("right")
    }
}

function handleMovement(dir) {
    let x = player.tx
    let y = player.ty
    player.sprite = player.sprites[dir]

    if (player.x == player.tx) {
        if (dir == "up" && player.ty > 0) {
            y -= tileSize
        } else if (dir == "down" && player.ty < canvas.height - tileSize) {
            y += tileSize
        }
    }
    if (player.y == player.ty) {
        if (dir == "right" && player.tx < canvas.width - tileSize) {
            x += tileSize
        } else if (dir == "left" && player.tx > 0) {
            x -= tileSize
        }
    }
    if (getCollision({ x: x, y: y }, walls)) { return }

    player.tx = x
    player.ty = y
    player.isMoving = true
}


setInterval(() => {
    if (player.isMoving) {
        if (Math.round(player.x) == player.tx) {
            player.x = player.tx
        } else {
            player.x += Math.sign(player.tx - player.x) * (tileSize / 50)
        }

        if (Math.round(player.y) == player.ty) {
            player.y = player.ty
        } else {
            player.y += Math.sign(player.ty - player.y) * (tileSize / 50)
        }
        if (player.y == player.ty && player.x == player.tx) {
            player.isMoving = false
            player.x = player.tx
            path.push({
                x: player.x,
                y: player.y,
            })
        }
        const collision = getCollision(player, carrots)
        if (collision) {
            carrots.splice(carrots.indexOf(collision), 1)
            player.points += 1
        }
    }
}
)
setInterval(() => {
    if (cmds.length != 0) {
        const type = cmds[0].split(":")[0]
        const arg = cmds[0].split(":")[1]
        if (!player.isMoving) {
            cmds.shift()
            if (type == "move") {
                handleMovement(arg)
            }
            if (type == "say") {
                speech(arg)
            }
        }
    }
}, 500)

function addCmd(cmd) {
    cmds.push(cmd)
    console.log(cmds)
}

let speechTimeout
function speech(text) {
    clearTimeout(speechTimeout);
    player.speaking = true
    player.text = text
    speechTimeout = setTimeout(() => {
        player.speaking = false
        player.text = false
    }, 2000)
}

function reset() {
    player.x = 0
    player.y = 0
    player.tx = 0
    player.ty = 0
    cmds = []
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = "gray"
    ctx.setLineDash([4, 2])
    ctx.beginPath()


    for (let i = tileSize; i < canvas.width; i += tileSize) {
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
    }
    for (let i = tileSize; i < canvas.height; i += tileSize) {
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
    }
    ctx.stroke()

    ctx.setLineDash([0])
    ctx.fillStyle = "lightgray"
    for (let part of path) {
        ctx.beginPath()
        ctx.arc(part.x + tileSize / 2, part.y + tileSize / 2, tileSize / 4, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
    }
    for (let carrot of carrots) {
        ctx.drawImage(carrotsprite, carrot.x, carrot.y, tileSize, tileSize)
    }
    for (let wall of walls) {
        ctx.drawImage(wallsprite, wall.x, wall.y, tileSize, tileSize)
    }

    ctx.setLineDash([1, 1])
    ctx.fillStyle = "white"
    ctx.font = '48px arial';
    ctx.textAlign="right"
    ctx.drawImage(player.sprite, player.x, player.y, tileSize, tileSize)
    ctx.fillText(player.points+ "/10", 150, canvas.height - 10);

    if (player.speaking) {
        ctx.textAlign="left"
        ctx.font = '24px arial';
        const textSize =ctx.measureText(player.text)
        console.log(textSize)
        ctx.fillStyle = "black"
        ctx.fillRect(player.x-2, player.y-26, textSize.width+4, 24*1.286+4)
        ctx.fillStyle = "white"
        ctx.fillRect(player.x, player.y-24, textSize.width, 24*1.286)
        ctx.fillStyle = "black"
        ctx.fillText(player.text, player.x, player.y);
    }
    requestAnimationFrame(draw)
}

requestAnimationFrame(draw)
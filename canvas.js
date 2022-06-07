"use strict"
const ctx = canvas.getContext("2d")
const tileSize = 50

function newImage(src) {
    let img = new Image()
    img.src = src
    return img
}
function floorToMul(num, mul) {
    return Math.floor(num / mul) * mul
}

const carrotsprite = newImage("images/porkkana_lapinakyva.png")
let carrots = []
const wallsprite = newImage("images/Kivi3.png")
let walls = []
let path = []
let cmds = []
let points = 0
let allCarrots = 0
let level = 1
let steps = 0
let first = false

function getCollision(object, objects) {
    for (let o of objects) {
        if (o.x == object.x && o.y == object.y) {
            return o
        }
    }
}

class Entity {
    constructor(x, y, sprites) {
        this.x = x
        this.y = y
        this.tx = x
        this.ty = x
        this.isMoving = true
        this.text = ""
        this.speaking = false
        this.sprites = sprites
        this.sprite = this.sprites.up
    }
    update() {
        if (this.isMoving) {
            if (Math.round(this.x) == this.tx) {
                this.x = this.tx
            } else {
                this.x += Math.sign(this.tx - this.x) * (tileSize / 50)
            }

            if (Math.round(this.y) == this.ty) {
                this.y = this.ty
            } else {
                this.y += Math.sign(this.ty - this.y) * (tileSize / 50)
            }
            if (this.y == this.ty && this.x == this.tx) {
                this.isMoving = false
                /*path.push({
                    x: this.x,
                    y: this.y,
                })*/
            }
        }
        const collision = getCollision(this, carrots)
        if (collision) {
            carrots.splice(carrots.indexOf(collision), 1)
            points += 1
        }
    }
    handleMovement(dir) {
        let x = this.tx
        let y = this.ty
        this.sprite = this.sprites[dir]

        if (this.x == this.tx) {
            if (dir == "up" && this.ty > 0) {
                y -= tileSize
            } else if (dir == "down" && this.ty < canvas.height - tileSize) {
                y += tileSize
            }
        }
        if (this.y == this.ty) {
            if (dir == "right" && this.tx < canvas.width - tileSize) {
                x += tileSize
            } else if (dir == "left" && this.tx > 0) {
                x -= tileSize
            }
        }
        if (getCollision({
            x: x,
            y: y
        }, walls)) {
            return
        }

        this.tx = this.x = x
        this.ty = this.y = y
        // this.isMoving = true
        steps++
        const collision = getCollision(this, carrots)
        if (collision) {
            carrots.splice(carrots.indexOf(collision), 1)
            points += 1
        }

    }

    say(text) {
        clearTimeout(this.sayTimeout);
        this.speaking = true
        this.text = text
        this.sayTimeout = setTimeout(() => {
            this.speaking = false
            this.text = false
        }, 2500)
    }
}

let entities = {

}

setInterval(() => {
    if (cmds.length != 0) {
        const command = cmds[0].split(":")
        const type = command[0]
        const args = command[1].split(",")
        cmds.shift()
        if (type == "move") {
            entities[args[0]].handleMovement(args[1])
        }
        if (type == "say") {
            entities[args[0]].say(args[1])
        }
        if (type == "addEntity") {
            if (first) {
                first = false
                entities = {}
            }
            let sprites
            if (args[3] == "bunny") {
                sprites = {
                    up: newImage("images/pupu_takaa_lapinakyva.png"),
                    down: newImage("images/pupu_edesta_lapinakyva.png"),
                    left: newImage("images/pupu_sivusta_lapinakyva2.png"),
                    right: newImage("images/pupu_sivusta_lapinakyva.png"),
                }
            } else if (args[3] == "cat") {
                sprites = {
                    up: newImage("images/cat.png"),
                    down: newImage("images/cat.png"),
                    left: newImage("images/cat.png"),
                    right: newImage("images/cat.png"),
                }
            }
            entities[args[0]] = new Entity(args[1] * tileSize, args[2] * tileSize, sprites)
            console.log(entities)
        }

    }
}, 500)

function addCmd(cmd) {
    cmds.push(cmd)
}

setLevel(1)

function createCarrot(x, y) {
    carrots.push({x:x*tileSize, y:y*tileSize})
}

function createWall(x, y) {
    walls.push({x:x*tileSize, y:y*tileSize})
}

function createMap() {
    carrots = []
    walls = []
    
    if (level == 1) {
        createCarrot(3, 0)
    }
    if (level == 2) {
        createCarrot(2, 4)
    }
    if (level == 3) {
        for (var i = 1; i < 6; i++) {
            createCarrot(i, 0)
        }
    }
    if (level == 4) {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (i == 0 && j == 0) continue
                createCarrot(i, j)
            }
        }
    }
    if (level == 5) {
        for (var i = 0; i < 4; i++) {
            createWall(1,i)
        }
        createCarrot(2,0)
    }
    if (level == 6) {
        for (var i = 1; i < 16; i++) {
            createCarrot(i, 0)
        }
    }
    if (level == 7) {
        for (var i = 1; i < 11; i++) {
            createCarrot(i, i - 1)
            createCarrot(i, i)
        }
    }
    if (level == 8) {
        for (var i = 1; i < 16; i++) {
            createCarrot(i, 0)
            if (i%2 == 0) createCarrot(i, 1)
        }
    }
    if (level == 9) {
        for (var i = 1; i < 16; i++) {
            createCarrot(i, 0)
            createCarrot(i, 10)
        }
        for (var i = 1; i < 11; i++) {
            createCarrot(0, i)
            if (i != 10) createCarrot(15, i)
        }
    }
    if (level == 10) {
        for (var i = 1; i < 10; i++) {
            for (var j = 1; j < 10; j++) {
                createCarrot(i, j)
            }
        }
    }
    if (level == 11) {
        for (var i = 0; i < 16; i++) {
            for (var j = 0; j < 11; j++) {
                if (i == 0 && j == 0) continue;
                if (i%2 == 0 && j%2 == 0) createWall(i, j)
                else createCarrot(i, j)
            }
        }
    }
    if (level == 12) {
        for (var i = 0; i < 15; i++) createWall(i, 1)
        for (var i = 2; i < 9; i++) createWall(14, i)
        for (var i = 0; i < 16; i++) createWall(i, 10)
        for (var i = 2; i < 15; i++) createWall(i, 8)
        for (var i = 2; i < 10; i++) createWall(0, i)
        for (var i = 3; i < 8; i++) createWall(2, i)
        for (var i = 3; i < 13; i++) createWall(i, 3)
        for (var i = 4; i < 7; i++) createWall(12, i)
        for (var i = 3; i < 11; i++) {
            for (var j = 4; j < 7; j++) {
                createCarrot(i, j)
            }
        }
    }
    
    allCarrots = carrots.length    
}


function reset() {
    points = 0;
    cmds = []
    entities = {}
    createMap()
    let sprites = {
        up: newImage("images/pupu_takaa_lapinakyva.png"),
        down: newImage("images/pupu_edesta_lapinakyva.png"),
        left: newImage("images/pupu_sivusta_lapinakyva2.png"),
        right: newImage("images/pupu_sivusta_lapinakyva.png"),
    }
    entities[0] = new Entity(0, 0, sprites)
    steps = 0
    first = true
}

function setLevel(what) {
    level = what
    reset()
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = "gray"
    ctx.setLineDash([4, 2])
    ctx.lineWidth = 1

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
    ctx.setLineDash([])

    for (let e of Object.values(entities)) {
        ctx.drawImage(e.sprite, e.x, e.y, tileSize, tileSize)
        if (e.speaking) {
            ctx.textAlign = "left"
            ctx.textBaseline = 'top';
            ctx.font = '24px arial';

            ctx.strokeStyle = "black"
            ctx.fillStyle = "white"
            ctx.lineWidth = 2

            const padding = 4
            const x = e.x
            const y = e.y-20
            ctx.beginPath();

            ctx.rect(x-padding, y-padding, ctx.measureText(e.text).width + padding * 2, 24 + padding * 2)
            ctx.fill();

            ctx.stroke();
            ctx.fillStyle = "black"
            ctx.fillText(e.text, x, y);
        }
    }
    ctx.fillStyle = "white"
    ctx.font = '42px arial';
    ctx.textAlign = "left"
    ctx.textBaseline = "bottom";
    ctx.fillText("Taso: " + level, 0, canvas.height);
    ctx.fillText("Jäljellä: " + (allCarrots - points), 180, canvas.height);
    ctx.fillText("Askeleet: " + steps, 420, canvas.height);

    requestAnimationFrame(draw)
}

requestAnimationFrame(draw)

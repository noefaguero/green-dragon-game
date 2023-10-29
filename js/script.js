
const visor = document.getElementById("visor")
const container = document.getElementById("container")
const points = document.getElementById("points")
// reference of the green dragon
let green
let stylesheet

//////////////////////////// FUNCTIONS //////////////////////////////

////// COMMON FUNCTIONS

const createDragon = (color) => {
    let dragon = document.createElement("IMG")
    dragon.setAttribute("class", color)
    dragon.setAttribute("src", `assets/images/${color}.png`)

    if(color != "green"){
        // set the initial positions 
        let posY = Math.round(Math.random()*visor.clientHeight)
        dragon.style.top = posY + "px"
        dragon.style.left = "0px"
        // set the initial vertical direction
        dragon.classList.add("isgoingup")
    }

    visor.append(dragon)

    return dragon
}

const breatheFire = (dragon) => {
    // create fire element
    let fire = document.createElement("IMG")
    fire.setAttribute("class", "fire")
    fire.setAttribute("src", "assets/images/fire.gif")
    // set direction
    let direction = 1
    if (dragon === green) {
        direction = -1
    }
    // initial position
    if (direction == 1) {
        fire.style.top = dragon.style.top
        fire.style.left = dragon.style.left
    } else if (direction == -1) {
        fire.style.top = (parseInt(stylesheet.top) - 10) + "px"
        fire.style.left = (parseInt(stylesheet.left) - 100) + "px"
    }
    visor.append(fire)
    // move fire 1px for each 1ms
    setInterval(() => moveFire(direction,fire), 1)
}

const moveFire = (direction, dragon) => {
    
    let position = parseInt(dragon.style.left)

    if ( position > -dragon.clientWidth && position < (visor.clientWidth + dragon.clientWidth)) {
        dragon.style.left = (position + 5 * direction) + "px"
    } else {
        dragon.remove()
    }
}


////// GREEN DRAGON FUNCTIONS

const moveGreenDragon = (event) => {
    if(event.target.tagName === "IMG"){
        if (event.target.classList.contains("green")) {
            green.style.top = (parseInt(green.style.top) + (event.layerY - Math.round(event.target.clientHeight/2))) + "px"
        } else {
            green.style.top = (parseInt(event.target.style.top) + (event.layerY - Math.round(event.target.clientHeight/2))) + "px"
        }
    } else {
        green.style.top = event.layerY + "px"
    }
}

////// ENEMY FUNCTIONS

const moveEnemy = (dragon) => {
    let positionX = parseInt(dragon.style.left)
    let positionY = parseInt(dragon.style.top)

    // horizontal movement  
    if ( positionX < (visor.clientWidth + dragon.clientWidth)) {
        dragon.style.left = (parseInt(dragon.style.left) + 1) + "px"
    } else {
        dragon.remove()
    }

    // vertical movement
    if (positionY > 0 && positionY < visor.clientHeight) {
        if (dragon.classList.contains("isgoingup")) {
            dragon.style.top = (positionY - 1) + "px"
        } else {
            dragon.style.top = (positionY + 1) + "px"
        }
    } else if (positionY == 0) {
        dragon.classList.remove("isgoingup")
        dragon.style.top = (positionY + 1) + "px"
    } else if (positionY == visor.clientHeight) {
        dragon.classList.add("isgoingup")
        dragon.style.top = (positionY - 1) + "px"
    }
}

const sendEnemy = (dragon) => {
    // move enemy 1px for each 10ms
    setInterval(() => moveEnemy(dragon), 10)
}

const alternateEnemy = () => {
    // 1 in 5 enemies sent is a red dragon
    let num = Math.ceil(Math.random()*5)
    if (num != 1) {
        return "black"
    } else {
        return "red"
    }
}

///// FUNTIONS TO THE MANAGEMENT OF SCORE AND LEVELS

const setIntervalLevel = () => {
    let score = parseInt(points.textContent)
    let interval
    if (score < 100) {
        interval = 5000
    } else if (score >= 100 && score < 200){
        interval = 3000
    } else if (score >= 200 && score < 300){
        interval = 1000
    }
    return interval
}


////////////////////////////// EVENTS ////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    createDragon("green")
    // get the reference of green dragon
    green = document.querySelector(".green")
    // read the green dragon style
    stylesheet =  window.getComputedStyle(green)
    // send enemy for each 3s
    setInterval(() => sendEnemy(createDragon(alternateEnemy())), setIntervalLevel())
})
visor.addEventListener("mousemove", (event) => moveGreenDragon(event))
visor.addEventListener("click", () => breatheFire(green))
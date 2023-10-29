
const visor = document.getElementById("visor")
const container = document.getElementById("container")
let green
let pos

//////////////////////////// FUNCTIONS //////////////////////////////

////// COMMON FUNCTIONS

const createDragon = (color) => {
    let dragon = document.createElement("IMG")
    dragon.setAttribute("class", color)
    dragon.setAttribute("src", `assets/images/${color}.png`)

    if(color == "black"){
        // set initial positions 
        let posY = Math.random()*visor.clientHeight
        dragon.style.top = posY + "px"
        dragon.style.left = "0px"
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
        fire.style.top = (parseInt(pos.top) - 10) + "px"
        fire.style.left = (parseInt(pos.left) - 100) + "px"
    }
    visor.append(fire)
    // move fire 1px for each 1ms
    setInterval(() => moveFire(direction,fire), 1)
}

const moveFire = (direction, object) => {
    
    let position = parseInt(object.style.left)

    if ( position > (0 - object.clientWidth/2) && position < (visor.clientWidth - object.clientWidth/2)) {
        object.style.left = (position + direction) + "px"
    } else {
        object.remove()
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

////// ENEMIES FUNCTIONS

const moveEnemies = (object) => {
    let position = parseInt(object.style.left)
    
    if ( position < (visor.clientWidth - object.clientWidth/2)) {
        object.style.left = (parseInt(object.style.left) + 1) + "px"
    } else {
        object.remove()
    }
}

const sendEnemies = (object) => {
    // move enemies 1px for each 10ms
    setInterval(() => moveEnemies(object), 10)

}


////////////////////////////// EVENTS ////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    createDragon("green")
    // get the reference of green dragon
    green = document.querySelector(".green")
    // read the green dragon style
    pos =  window.getComputedStyle(green)
    
    // send enemies for each 1000-10000ms
    setInterval(() => sendEnemies(createDragon("black")), Math.random()*9000+1000)
})
visor.addEventListener("mousemove", (event) => moveGreenDragon(event))
visor.addEventListener("click", () => breatheFire(green))
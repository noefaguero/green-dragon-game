let green
const visor = document.getElementById("visor")
const container = document.getElementById("container")


//////////////////////////// FUNCTIONS //////////////////////////////

const createDragon = (color) => {
    let dragon = document.createElement("IMG")
    dragon.setAttribute("class", color)
    dragon.setAttribute("src", `assets/images/${color}.png`)
    visor.append(dragon)
}

const moveDragon = (event) => {
    if(event.target.tagName === "IMG"){
        green.style.top = (parseInt(green.style.top) + (event.layerY - Math.round(event.target.clientHeight/2))) + "px"
    } else {
        green.style.top = event.layerY + "px"
    }
}

const breatheFire = (dragon) => {
    // create fire element
    let fire = document.createElement("IMG")
    fire.setAttribute("class", "fire")
    fire.setAttribute("src", "assets/images/fire.gif")
    // set direction
    let direction = 1
    if (dragon.classList.contains("green")) {
        direction = -1
    }
    // initial position
    if (direction == 1) {
        fire.style.top = dragon.style.top
        fire.style.left = dragon.style.left
    } else if (direction == -1) {
        fire.style.top = (parseInt(dragon.style.top) - 10) + "px"
        let posX = window.getComputedStyle(dragon)
        fire.style.left = (parseInt(posX.left) - 100) + "px"
    }
    visor.append(fire)
    // move fire 1px for each 1ms
    setInterval(() => moveFire(direction,fire), 1)
}

const moveFire = (direction, object) => {
    
    position = parseInt(object.style.left)

    if ( position > (0 - object.clientWidth/2) && position < (visor.clientWidth - object.clientWidth/2)) {
        object.style.left = (position + direction) + "px"
    } else {
        object.remove()
    }
}


////////////////////////////// EVENTS ////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
    createDragon("green")
    green = document.querySelector(".green")
})
visor.addEventListener("mousemove", (event) => moveDragon(event))
visor.addEventListener("click", () => breatheFire(green))
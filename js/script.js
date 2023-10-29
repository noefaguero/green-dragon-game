const greendragon = document.getElementById("green-dragon")
const visor = document.getElementById("visor")
const container = document.getElementById("container")


//////////////////////////// FUNCTIONS //////////////////////////////
const moveDragon = (event) => {
    if(event.target.tagName === "IMG"){
        greendragon.style.top = (parseInt(greendragon.style.top) + (event.layerY - Math.round(event.target.clientHeight/2))) + "px"
    } else {
        greendragon.style.top = event.layerY + "px"
    }
}

const breatheFire = (direction) => {
    let fire = document.createElement("IMG")
    fire.setAttribute("class", "fire")
    fire.setAttribute("src", "assets/images/fire.gif")
    fire.style.top = greendragon.style.top
    fire.style.left = "950px"
    visor.append(fire)

    setInterval(() => moveFire(direction,fire), 1)

    
}


const moveFire = (direction,object) => {
    position = parseInt(object.style.left);
    if (direction === 1) {
        if (position >= (visor.clientWidth - object.clientWidth/2)) {
        } else {
            object.remove()
        }
    } else if (direction === -1){
        if (position > (0 - object.clientWidth/2)) {
            object.style.left = (position + direction) + "px"
        } else {
            object.remove()
        }
    }
}


////////////////////////////// EVENTS ////////////////////////////////
visor.addEventListener("mousemove", (event) => moveDragon(event))
visor.addEventListener("click", () => breatheFire(-1))
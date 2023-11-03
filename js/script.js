
const visor = document.getElementById("visor")
const container = document.getElementById("container")
const points = document.getElementById("points")
// reference of the green dragon (after the green dragon is created)
let green
// reference of the green dragon stylesheet
let stylesheet
let sendEnemy

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
        dragon.classList.add("isgoingup","enemy")
    }

    visor.append(dragon)

    return dragon
}

const moveFire = (fire) => {
    let position = parseInt(fire.style.left)

    if ( position > -fire.clientWidth && position < (visor.clientWidth + fire.clientWidth)) {
        return true //move
    } else {
        return false //stop, fire is out of visor
    }
}


const detectImpact = (fire) => {
    let enemies = visor.querySelectorAll(".enemy")
    enemies.forEach(enemy => {
        if (
            parseInt(fire.style.top) + 50 > parseInt(enemy.style.top) &&
            parseInt(fire.style.top) - 50 < parseInt(enemy.style.top) &&
            parseInt(fire.style.left) + 50 > parseInt(enemy.style.left) &&
            parseInt(fire.style.left) - 50 < parseInt(enemy.style.left)
        ) {
            if (!enemy.classList.contains("green")) {
                enemy.remove() 
                // increase the score
                if (enemy.classList.contains("black")) {
                    updateScore(10)
                } else if (enemy.classList.contains("red")) {
                    updateScore(30)
                }
            }
        }
    })
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
    const fireMovementInterval = () => 
        setInterval(() => {
            if (moveFire(fire)) {
                let position = parseInt(fire.style.left)
                fire.style.left = (position + 5 * direction) + "px"
            } else {
                clearInterval(fireMovementInterval)
                fire.remove() 
            }
        }, 1)
    fireMovementInterval()

    const impactDetectionInterval = () => 
        setInterval(() => {
            if (moveFire(fire)) {
                detectImpact(fire)
            } else {
                clearInterval(impactDetectionInterval)
            }
        }, 100)
    impactDetectionInterval()
    
}

////// GREEN DRAGON FUNCTIONS

const moveGreenDragon = (event) => {
    if(event.target.tagName === "IMG"){
        let half = Math.round(event.target.clientHeight/2)
        if (event.target.classList.contains("green")) {
            green.style.top = (parseInt(green.style.top) + (event.layerY - half)) + "px"
        } else {
            green.style.top = (parseInt(event.target.style.top) + (event.layerY - half)) + "px"
        }
    // the target is the container
    } else {
        green.style.top = event.layerY + "px"
    }
}

////// ENEMY FUNCTIONS

const moveEnemy = (dragon) => {
    let positionY = parseInt(dragon.style.top)
    let positionX = parseInt(dragon.style.left)
    
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

    // horizontal movement  
    if (positionX < visor.clientWidth) {
        dragon.style.left = (positionX + 1) + "px"
        // recurrent call
        setTimeout(() => moveEnemy(dragon), 10)
        /* He optado por una llamada recurrente con tiempo de espera, ya que si asigno un bucle por 
        intervalo y lo borro cuando el enemigo cruza el visor, se paran todos los enemigos.*/
    } else {
        // decrease the score
        if (dragon.classList.contains("black")) {
            updateScore(-10)
        } else {
            updateScore(-30)
        }
        dragon.remove()
    }
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

///// FUNCTIONS TO THE MANAGEMENT OF SCORE AND LEVELS

const setIntervalLevel = () => {
    let score = parseInt(points.textContent)
    let interval
    if (score < 100) {
        interval = 3000
    } else if (score >= 100 && score < 200){
        interval = 1000
    } else if (score >= 200 && score < 300){
        interval = 500
    }
    return interval
}

const updateScore = (pts) => {
    points.textContent = parseInt(points.textContent) + pts
}

////////////////////////////// EVENTS ////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    createDragon("green")
    // get the reference of green dragon
    green = document.querySelector(".green")
    // read the green dragon style
    stylesheet =  window.getComputedStyle(green)
    // crate enemy for each 3s
    setInterval(() => moveEnemy(createDragon(alternateEnemy())), setIntervalLevel())
})
visor.addEventListener("mousemove", (event) => moveGreenDragon(event))
visor.addEventListener("click", () => breatheFire(green))
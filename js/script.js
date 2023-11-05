const visor = document.getElementById("visor")
const container = document.getElementById("container")
const points = document.getElementById("points")
const hearts = document.getElementById("hearts")
// reference of the green dragon (after the green dragon is created)
let green
// reference of the green dragon stylesheet
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
        dragon.classList.add("isgoingup","enemy")
    }

    visor.appendChild(dragon)
    
    return dragon
   
}
    


const moveFire = (fire) => {
    let position = parseInt(fire.style.left)

    if (position > -fire.clientWidth && position < (visor.clientWidth + fire.clientWidth)) {
        return true //move
    } else {
        return false //stop, fire is out of visor
    }
}

const detectImpact = (fire) => {
    /// detect impact on the enemy
    let enemies = Array.from(visor.querySelectorAll(".enemy"))
    enemies.forEach(enemy => {
        if (
            parseInt(fire.style.top) + 50 > parseInt(enemy.style.top) &&
            parseInt(fire.style.top) - 50 < parseInt(enemy.style.top) &&
            parseInt(fire.style.left) + 50 > parseInt(enemy.style.left) &&
            parseInt(fire.style.left) - 50 < parseInt(enemy.style.left)
        ) {
            // increase the score
            if (enemy.classList.contains("black")) {
                updateScore(10)
            } else if (enemy.classList.contains("red")) {
                updateScore(30)
            }
            // remove the enemy
            enemy.classList.add("killed")
        }
    })

    // detect impact on the green dragon
    if (
        parseInt(fire.style.top) + 30 > parseInt(green.style.top) &&
        parseInt(fire.style.top) - 30 < parseInt(green.style.top) &&
        parseInt(fire.style.left) + 30 > parseInt(stylesheet.left) &&
        parseInt(fire.style.left) - 30 < parseInt(stylesheet.left)
    ) {
        updateHearts()
    }
}

const launchFire = (dragon) => {
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
        fire.style.top = (parseInt(dragon.style.top) - 10) + "px"
        fire.style.left = (parseInt(dragon.style.left) + 100) + "px"
    } else if (direction == -1) {
        fire.style.top = (parseInt(stylesheet.top) - 10) + "px"
        fire.style.left = (parseInt(stylesheet.left) - 100) + "px"
    }
    visor.append(fire)

    // move fire 1px for each 1ms
    let fireMovementInterval = setInterval(() => {
        if (moveFire(fire)) {
            let position = parseInt(fire.style.left)
            fire.style.left = (position + 5 * direction) + "px"
        } else {
            clearInterval(fireMovementInterval)
            fire.remove() 
        }
    }, 10)
  
     let impactDetectionInterval = setInterval(() => {
        if (moveFire(fire)) {
            detectImpact(fire)
        } else {
            clearInterval(impactDetectionInterval)
        }
    }, 100)
}

////// GREEN DRAGON FUNCTIONS

const moveGreenDragon = (event) => {
    if(event.target.tagName === "IMG"){
        green.style.top = (parseInt(event.target.style.top) + Math.round(event.offsetY - event.target.clientHeight/2)) + "px"
        
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
            dragon.style.top = (positionY - 2) + "px"
        } else {
            dragon.style.top = (positionY + 2) + "px"
        }
    } else if (positionY <= 0) {
        dragon.classList.remove("isgoingup")
        dragon.style.top = (positionY + 1) + "px"
    } else if (positionY >= visor.clientHeight) {
        dragon.classList.add("isgoingup")
        dragon.style.top = (positionY - 1) + "px"
    }

    // horizontal movement  
    if (dragon.classList.contains("killed")) {
        dragon.remove()
    } else {
        if (positionX < visor.clientWidth) {
            dragon.style.left = (positionX + 2) + "px"
            // recurrent call
            requestAnimationFrame(()=>moveEnemy(dragon))
            /* He optado por una llamada recurrente con tiempo de espera sincronizado con el renderizado del navegador, 
            ya que si asigno un bucle por intervalo y lo borro cuando el enemigo cruza el visor, se paran todos los enemigos.*/
        } else {
            // decrease the score
            if (dragon.classList.contains("black")) {
                updateScore(-10)
            } else if (dragon.classList.contains("red")) {
                updateScore(-30)
            }
            dragon.remove()
        }
    }
}


const alternateEnemy = () => {
    // 2 in 5 enemies is a red dragon
    let num = Math.ceil(Math.random()*5)
    if (num > 2) {
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
        interval = 1500
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
const updateHearts = () => {
    hearts.textContent = parseInt(hearts.textContent) - 1
}

////////////////////////////// EVENTS ////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    
    createDragon("green")
    // get the reference of green dragon
    green = document.querySelector(".green")
    // read the green dragon style
    stylesheet =  window.getComputedStyle(green)

    // crate enemy every 1.5s, 1, or 0.5s
    setInterval(() => {
        let dragon = createDragon(alternateEnemy())
        moveEnemy(dragon)
    }, setIntervalLevel())
    
    // every 2 second red dragon launch fire
    setInterval(() => {
        let reddragons = Array.from(document.querySelectorAll(".red"))
        reddragons.forEach((reddragon) => launchFire(reddragon))
    }, 2000)
})

visor.addEventListener("mousemove", (event) => moveGreenDragon(event))
visor.addEventListener("click", () => launchFire(green))
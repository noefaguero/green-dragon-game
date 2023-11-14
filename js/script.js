////////////////////////////// REFERENCES ///////////////////////////////
const scoreboard = document.getElementById("scoreboard")
const title = document.querySelector(".title")
const playpanel = document.getElementById("playpanel")
const tryagainpanel = document.getElementById("tryagainpanel")
const visor = document.getElementById("visor")
const container = document.getElementById("container")
const points = document.getElementById("points")
const hearts = document.getElementById("hearts")
// reference of the green dragon (after the green dragon is created)
let green
// reference of the green dragon stylesheet
let stylesheet
// reference of intervals
let createEnemyInterval
let launchFireInterval

////////////////////////////// FUNCTIONS ///////////////////////////////

/************************* COMMON FUNCTIONS ***************************/

// Function to create a dragon element with the specified color
const createDragon = (color) => {
    let dragon = document.createElement("IMG")
    dragon.setAttribute("class", color)
    dragon.setAttribute("src", `assets/images/${color}.gif`)

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
    

// Function to check if a fire element should continue moving
const moveFire = (fire) => {
    let position = parseInt(fire.style.left)

    if (
        position > -fire.clientWidth && 
        position < (visor.clientWidth + fire.clientWidth)
    ) {
        return true //move
    } else {
        return false //stop, fire is out of visor
    }
}

// Function to detect impact of fire on enemies and the green dragon
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
        parseInt(fire.style.top) + 40 > parseInt(green.style.top) &&
        parseInt(fire.style.top) - 40 < parseInt(green.style.top) &&
        parseInt(fire.style.left) + 40 > parseInt(stylesheet.left) &&
        parseInt(fire.style.left) - 40 < parseInt(stylesheet.left)
    ) {
        // Update hearts
        updateHearts()
    }
}

// Function to launch fire from a dragon
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
    // set initial position
    if (direction == 1) {
        fire.style.top = (parseInt(dragon.style.top) - 10) + "px"
        fire.style.left = (parseInt(dragon.style.left) + 100) + "px"
    } else if (direction == -1) {
        fire.style.top = (parseInt(stylesheet.top) - 10) + "px"
        fire.style.left = (parseInt(stylesheet.left) - 100) + "px"
    }
    visor.append(fire)

    // move fire 5px for each 1ms
    let fireMovementInterval = setInterval(() => {
        if (moveFire(fire)) {
            let position = parseInt(fire.style.left)
            fire.style.left = (position + 5 * direction) + "px"
        } else {
            clearInterval(fireMovementInterval)
            fire.remove() 
        }
    }, 10)
    
    //  check for impact every 100ms
    let impactDetectionInterval = setInterval(() => {
        if (moveFire(fire)) {
            detectImpact(fire)
        } else {
            clearInterval(impactDetectionInterval)
        }
    }, 100)
}

/************************* GREEN DRAGON FUNCTIONS ***************************/

// Function to move the green dragon based on mouse height
const moveGreenDragon = (event) => {
    if(event.target.tagName === "IMG"){
        green.style.top = (parseInt(event.target.style.top) + 
        Math.round(event.offsetY - event.target.clientHeight/2)) + "px"
        
    // the target is the container
    } else {
        green.style.top = event.layerY + "px"
    }
}

const createGreenDragon = () => {
    // create the green dragon
    createDragon("green")
    // get the reference of the green dragon
    green = document.querySelector(".green")
    green.classList.add("green-start")
    // read the green dragon style
    stylesheet = window.getComputedStyle(green)
}


/****************************** ENEMY FUNCTIONS *****************************/

// Function to move the enemy
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
        setTimeout(() => dragon.remove(), 900)
    } else {
        if (positionX < visor.clientWidth) {
            dragon.style.left = (positionX + 2) + "px"
            // recurrent call
            requestAnimationFrame(() => moveEnemy(dragon))
            /* He optado por una llamada recurrente con tiempo de espera 
            sincronizado con el renderizado del navegador, ya que si asigno 
            un bucle por intervalo y lo borro cuando el enemigo cruza el visor, 
            se paran todos los enemigos.*/
        } else {
            // decrease the hearts (lives)
            updateHearts()
            dragon.remove()
        }
    }
}

// Function to determine the type of enemy dragon
const alternateEnemy = () => {
    // 2 in 5 enemies is a red dragon
    let num = Math.ceil(Math.random()*5)
    if (num > 2) {
        return "black"
    } else {
        return "red"
    }
}

/************** FUNCTIONS TO THE MANAGEMENT OF SCORE AND LEVELS *************/

// Function to set the interval for enemy dragon appearance
const setIntervalLevel = () => {
    let score = parseInt(points.textContent)
    let interval
    if (score < 100) {
        interval = 2000
    } else if (score >= 100 && score < 500){
        interval = 500
    } else if (score >= 500){
        interval = 300
    }
    return interval
}

// Function to update the score
const updateScore = (pts) => {
    points.textContent = parseInt(points.textContent) + pts
}
// Function to update the hearts (lives)
const updateHearts = () => {
    let currentHearts = parseInt(hearts.textContent)
    if (currentHearts <= 1) {
        hearts.textContent = 0
        // stop the game
        gameOver()
        
    } else {
        hearts.textContent = --currentHearts
    }
}

///////////////////////////////// EVENTS /////////////////////////////////////

playpanel.children[1].focus()

playpanel.children[2].addEventListener("click", () => {
    playpanel.classList.add("hideplay")
    createGreenDragon()
    title.classList.add("title-start")
    startGame()
})

tryagainpanel.children[1].addEventListener("click", () => {
    tryagainpanel.classList.remove("showpanel")
    tryagainpanel.classList.add("hidepanel")
    startGame()
})

// Function to start the game
const startGame = () => {
    // display the game scope
    scoreboard.firstElementChild.textContent = playpanel.children[1].value
    visor.classList.add("showvisor")
    scoreboard.classList.add("showvisor")

    // initialize the scoreboard
    hearts.textContent = 3
    points.textContent = 0

    // create enemy every 2s, 0.5, or 0.3s
    createEnemyInterval = setInterval(() => {
        let dragon = createDragon(alternateEnemy())
        moveEnemy(dragon)
    }, setIntervalLevel())

    // every 2 seconds, red dragons launche fire
    launchFireInterval = setInterval(() => {
        let reddragons = Array.from(document.querySelectorAll(".red"))
        reddragons.forEach((reddragon) => launchFire(reddragon))
    }, 2000);

    // green dragon movement on mousemove
    visor.addEventListener("mousemove", moveGreenDragon)

    // launch fire on click
    visor.addEventListener("click", () => launchFire(green))
}

// Function to remove event listeners and clear intervals when the game is over
const gameOver = () => {
    // clear intervals
    clearInterval(launchFireInterval);
    clearInterval(createEnemyInterval);
    // remove event
    visor.removeEventListener("mousemove", moveGreenDragon)
    // display the try again panel
    tryagainpanel.lastElementChild.firstElementChild.textContent = points.textContent
    tryagainpanel.classList.remove("hidepanel")
    tryagainpanel.classList.add("showpanel")
};
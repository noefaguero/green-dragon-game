const greendragon = document.getElementById("green-dragon")
const visor = document.getElementById("visor")
const container = document.getElementById("container")



const moveDragon = (event) => {
    if(event.target.tagName === "IMG"){
        if (event.layerY > event.target.clientHeight/2) {
            console.log( event.layerY)
            greendragon.style.top = (parseInt(greendragon.style.top) + (event.layerY - Math.round(event.target.clientHeight/2))) + "px"
        } else {
            greendragon.style.top = (parseInt(greendragon.style.top) + (event.layerY - Math.round(event.target.clientHeight/2))) + "px"
        }
    } else {
        greendragon.style.top = event.layerY + "px"
    }
}


visor.addEventListener("mousemove", (event) => moveDragon(event))
import { Vector3 } from "./LA/vector3.js";
import { getCSSColor } from "./util.js";
import { drawScene } from "./main.js";




const vectors = [
    {
        name: "rock",
        vector: Vector3.baseI
    },
    {
        name: "paper",
        vector: Vector3.baseJ
    },
    {
        name: "scissors",
        vector: Vector3.baseK
    },
    {
        name: "pivot",
        vector: Vector3.one
    },
    {
        name: "cross-p",
        vector: undefined
    }
];
for (const el of vectors)
    el.color = getCSSColor(`--vec-${el.name}-color`).splice(0, 3);


const Game = {
    players: [undefined, undefined],
    
    p1: () => Game.players[0],
    p2: () => Game.players[1],

    pivot: vectors[3],
    cross: vectors[4],
};



function handlePlayerInput(event) {
    const playerIndex = event.target.parentNode.parentNode.dataset.player;

    Game.players[playerIndex] = vectors[event.target.value];

    const vectorText = document.querySelectorAll("span.player-choices")[playerIndex];

    vectorText.innerHTML = Game.players[playerIndex].name;
    vectorText.dataset.choice = Game.players[playerIndex].name;

    
    if (Game.p1() && Game.p2()){
        Game.cross.vector = Game.p1().vector.cross(Game.p2().vector);

        document.querySelector("span.result").innerHTML = Vector3.one.dot(Game.cross.vector);
    }
    
    
    drawScene();
}

document.querySelectorAll("form.player-choices").forEach(
    el => el.addEventListener("change", handlePlayerInput)
);


export { Game };
const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    }, 
    fieldCards: {
        player1: document.getElementById("player-infield-card"),
        computer: document.getElementById("computer-infield-card"),
    },

    actions: {
        button: document.getElementById("next-duel"),
    }, 
    
};

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards"
}

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id:0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },

    {
        id:1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },

    {
        id:2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    },
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldSide === playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
        });

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
        
        //return cardImage;   // tanto faz dentro ou fora do IF
    }
    return cardImage;
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player1.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.cardSprites.avatar.src = ""
    state.cardSprites.name.innerText="..."
    state.cardSprites.type.innerText=""


    state.fieldCards.player1.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId,computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";    
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "DRAW";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "WIN";
        await playAudio(duelResults);
        state.score.playerScore++;  
    }

    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "LOSE";
        await playAudio(duelResults);
        state.score.computerScore++;
    }

    return duelResults;
}

async function removeAllCardsImages() {
    let cards = document.querySelector("#computer-cards");
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    cards = document.querySelector("#player-cards");
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for( let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = ""; //Limpando o avatar lado esquerdo
    state.actions.button.style.display ="none"; //Botão some

    state.fieldCards.player1.style.display = "none"; // Cartas em campo somem
    state.fieldCards.computer.style.display = "none";

    init(); // zera a tela pra recomeçar
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init() {
    drawCards(5,playerSides.player1);
    drawCards(5,playerSides.computer);

    const bgmusic = document.getElementById("bgmusic")
    bgmusic.play()
}
init();
/*
 * Name: Hangman
 * Date: 8/12/20
 * Author: Shane Arcaro
 * Description: Javascript Hangman game
 */

const wordCollection = ['Computer', 'Science', 'Information', 'Technology', 'Engineer', 
'Business', 'Website', 'Design', 'Portfolio', 'School', 'Javascript', 'Python', 'Java',
'Location', 'Service', 'Subway', 'City', 'Building', 'Capital', 'Museum', 'Fictional',
'Crime', 'Sports', 'Team', 'Memorial', 'Mechanical', 'Enumerate', 'Concentrate']

let imageID = 0;
let word = randomWord();
let blankWord = createBlankWord();
let guessedCharacters = '';

addKeys();
updateBlankWord();

/**
 * Choose a random word from the word collection
 */
function randomWord() {
    return wordCollection[parseInt(Math.random() * wordCollection.length)].toUpperCase();
}

/**
 * Construct a blank word and present it to the user. The word will change
 * as the user guesses and fills in more characters.
 */
function createBlankWord() {
    let blankWord = '';
    for(let i = 0; i < word.length; i++)
        blankWord += '_ ';
    return blankWord;
}

/**
 * Use the character to search for all its positions in word.
 * Once the positions are found, repace appropriate index in
 * blank word.
 * @param {character to search} character 
 */
function findCharacters(character) {
    let positionsFound = []
    character = character.toUpperCase();

    for(let i = 0; i < word.length; i++) {
        if(word.charAt(i) == character) {
            positionsFound.push(i * 2);
        }
    }

    // Incorrect character has been pressed
    if(positionsFound.length == 0) {
        updateImage();

        if(document.getElementById('guessed-characters') == null) {
            addCharacterBank();
        }
        
        let guessed = document.getElementById('guessed-characters');
        guessed.textContent += (character + ' ');
        return;
    }

    for(let i = 0; i < positionsFound.length; i++) {
        let index = positionsFound[i];
        blankWord = blankWord.slice(0, index) + character + blankWord.slice(index + 1);
    }
    updateBlankWord();

    if(blankWord.indexOf('_') == -1) {
        addResetButton();
        disableKeys();
    }
}

/**
 * Updates the blank word on the screen
 */
function updateBlankWord() {
    const updateBlank = document.getElementById('blank-word');
    updateBlank.innerText = blankWord;
}


/**
 * Updates the 'lost game' word on the screen
 */
function updateLostWord() {
    const updateLost = document.getElementById('lost-word');
    let lostWord = ''

    for(let i = 0; i < word.length; i++)
        lostWord += word.charAt(i) + ' ';
    updateLost.textContent = lostWord;
}

/**
 * Update the hangman image when a incorrect character is chosen
 * The image is now reset by using updateNumber as an option parameter
 * by using it as a falsy value. 
 * @param {optional reset parameter} updateNumber 
 */
function updateImage(updateNumber) {
    const image = document.getElementById('img');
    let imageSource = image.src.slice(image.src.lastIndexOf('/') + 1, -4);
    let imageNumber = parseInt(imageSource.charAt(imageSource.length - 1), 10);

    imageNumber += imageNumber != 6 ? 1 : -6;
    imageNumber = (updateNumber || imageNumber) == -1 ? 0 : imageNumber;
    
    imageID = imageNumber;
    imageSource = imageSource.slice(0, imageSource.length - 1);
    newSource = imageSource + imageNumber + '.png';
    image.src = 'assets/' + newSource;

    if(imageID == 6) {
        addResetButton();
        disableKeys();
        updateLostWord();
    }
}

/**
 * Add buttons for every character of the alphabet and format them
 */
function addKeys() {
    for(let i = 65; i < 91; i++) {
        const letter = String.fromCharCode(i);
        const button = document.createElement('button');

        // console.log('Letter:', letter);
        button.appendChild(document.createTextNode(letter));

        button.style.width = '1.2rem';
        button.style.height = '2rem';
        button.style.margin = '.5rem .3rem';
        button.style.paddingRight = '1rem';

        button.id = letter;
        button.onclick = function(){retrieveCharacter(button.id)};

        const textArea = document.getElementById('text-area');
            textArea.appendChild(button);
    }
}

/**
 * Adding character bank to the screen and formatting properly.
 * CSS is clashing with the dynamic adding of this element for some reason,
 * may look at it again later.
 */
function addCharacterBank() {
    const charList = document.getElementById('char-list');
    const characterList = document.createElement('p');
    characterList.id = 'guessed-characters';

    characterList.style.fontFamily = 'Ubuntu sans-serif';

    characterList.style.position = 'absolute';
    characterList.style.fontWeight = '300';
    characterList.style.fontSize = '1.5rem';

    characterList.style.margin = '10rem 5rem 0';
    characterList.style.padding = '1rem';
    characterList.style.width = '7rem';
    characterList.style.border = '1px solid white';
    characterList.style.borderRadius = '50%';
    characterList.style.color = 'white';

    charList.appendChild(characterList);
}

/**
 * When a button is pressed get the character that corresponds to it
 * and compare it to the chosen word.
 * @param {ID of button being pressed} buttonID 
 */
function retrieveCharacter(buttonID) {
    const button = document.getElementById(buttonID);
    button.disabled = true;

    findCharacters(buttonID);
}

/**
 * After the game is over disable all keys from being pressed.
 */
function disableKeys() {
    for(let i = 65; i < 91; i++) {
        const letter = String.fromCharCode(i);
        const button = document.getElementById(letter);

        button.disabled = true;
    }
}

/**
 * After the game is over add a reset button to the screen.
 */
function addResetButton() {
    const resetButton = document.createElement('button');
    const resetText = document.createTextNode('Reset');

    resetButton.appendChild(resetText);

    resetButton.id = 'reset-button';
    resetButton.style.position = 'absolute';
    resetButton.style.margin = '2.3rem 0 0 1rem';
    resetButton.style.fontFamily = 'Ubuntu sans-serif';
    resetButton.style.background = 'none';
    resetButton.style.border = '1px solid white';
    resetButton.style.color = 'white';
    resetButton.style.width = '6rem';
    resetButton.style.height = '2rem';
    resetButton.style.borderRadius = '75%';
    resetButton.onclick = function(){resetGame()};

    const header = document.getElementById('reset');
    header.appendChild(resetButton);
}

/**
 * When the reset button is pressed game variables must be returned
 * to their defaulted state. The HTML elements that are dynamically
 * added to the screen will have their parents div elements all reset
 * as well.
 */
function resetGame() {
    const area = document.getElementById('text-area');
    const reset = document.getElementById('reset');
    const chars = document.getElementById('char-list');

    area.innerHTML = '';
    reset.innerHTML = '';
    chars.innerHTML = '';
    
    const lostWord = document.getElementById('lost-word');
    lostWord.textContent = '';

    imageID = 0;
    word = randomWord();
    blankWord = createBlankWord();

    addKeys();
    updateBlankWord();

    updateImage(-1);
}
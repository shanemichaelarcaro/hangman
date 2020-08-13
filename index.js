/*
 * Name: Hangman
 * Date: 8/12/20
 * Author: Shane Arcaro
 * Description: Javascript Hangman game
 */

const wordCollection = ['Computer', 'Science', 'Information', 'Technology', 'Engineer', 
'Business', 'Website', 'Design', 'Portfolio', 'School']

let imageID = 0;
let word = randomWord();
let blankWord = createBlankWord();

console.log('Word:', word);
console.log('Character:', 'i');

addKeys();
updateWord();

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
        return;
    }

    for(let i = 0; i < positionsFound.length; i++) {
        let index = positionsFound[i];
        blankWord = blankWord.slice(0, index) + character + blankWord.slice(index + 1);
    }
    updateWord();
    console.log('Blank Word:', blankWord);
}

function updateWord() {
    let updateBlank = document.getElementById('blank-word');
    updateBlank.innerText = blankWord;
}

/**
 * Update the hangman image when a incorrect character is chosen
 */
function updateImage() {
    if(imageID >= 6)
        return;
    let image = document.getElementById('img');
    let imageSource = image.src.slice(image.src.lastIndexOf('/') + 1, -4);
    let imageNumber = parseInt(imageSource.charAt(imageSource.length - 1), 10);

    imageNumber += 1;
    imageID = imageNumber;
    imageSource = imageSource.slice(0, imageSource.length - 1);
    newSource = imageSource + imageNumber + '.png';
    console.log('New Source:', newSource);
    image.src = 'assets/' + newSource;
}

/**
 * Add buttons for every character of the alphabet and format them
 */
function addKeys() {
    for(let i = 65; i < 91; i++) {
        let letter = String.fromCharCode(i);
        let button = document.createElement('button');

        // console.log('Letter:', letter);
        button.appendChild(document.createTextNode(letter));

        button.style.width = '1.2rem';
        button.style.height = '2rem';
        button.style.margin = '.5rem .3rem';
        button.style.paddingRight = '1rem';

        button.id = letter;
        button.onclick = function(){retrieveCharacter(button.id)};

        let textArea = document.getElementById('text-area');
            textArea.appendChild(button);
    }
}

/**
 * When a button is pressed get the character that corresponds to it
 * and compare it to the chosen word.
 * @param {ID of button being pressed} buttonID 
 */
function retrieveCharacter(buttonID) {
    findCharacters(buttonID);
    console.log('Pressed:', buttonID);
}


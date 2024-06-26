/////////////////////////////////////// PROGRAMM ///////////////////////////////////////

const rl = require("readline-sync");

// catgories to choose from
const categories = {
  animals: ["Monkey", "Dog", "Rabbit", "Pigeon", "Dolphin", "Snake"],
  cars: ["BMW", "Mercedes", "Ford", "Nissan", "Mitsubishi", "Ferrari"],
  numbers: ["123", "523", "1337", "752", "9523", "4298"],
  sports: ["Tennis", "Football", "Baseball", "Ski", "Boxing", "Sailing"],
  movies: ["Mad Max", "Die Hard", "Frozen", "Bambi", "Bloodsport", "Jumanji"],
};

// game logic
game();

// end of game
console.log("\nSee you next time !");

/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////// FUNCTIONS ///////////////////////////////////////

function game() {
  let end = false;
  while (!end) {
    console.clear();
    // print categories to show user the available commands
    printCategories(categories);

    // user chooses category he wants to play
    let choice = rl.question("\nType in a category name: ");

    // if userinput is not in categories object, get a new input until its valid
    while (!Object.hasOwn(categories, choice)) {
      choice = rl.question(
        "\nNo matching category found, pls choose a valid category name: "
      );
    }

    // get array which user choose
    const chosenArray = Object.values(categories[choice]);

    // create solution array - size based on number of chosenArray elements
    const solutionArr = [];
    chosenArray.forEach(() => {
      const arr = createRandomArray(chosenArray);
      solutionArr.push(arr);
    });

    // hide solution
    const hideArr = solutionArr.map((item, i) => {
      return item.map((_element, j) => {
        return (_element = `${i}${j}`);
      });
    });

    // function where the actual game logic is running
    gameLoop(solutionArr, hideArr);

    // end game or not
    console.log(
      "\n(>*.*)> Congratulations, you made it, well played ! <(*.*<)"
    );

    end = endTheGame();
  }
}

function gameLoop(solution, hide) {
  let finished = false;
  let round = 1;
  let usedCoordinates = [];
  let defaultCoordinates = [];
  let round1String;
  let round2String;
  let points = 0;
  let lastMatch = null;
  let firstUserInput = { col: null, row: null };
  const foundPairs = [];
  while (!finished) {
    // back to default
    if (round > 2) {
      round = 1;
      defaultCoordinates = [];
      usedCoordinates = [];
      round1String = "";
      round2String = "";
    }

    if (round === 1) {
      console.clear();
      console.log(hide);
      console.log("Points: ", points);
      if (lastMatch !== null) {
        console.log("Last Match: ", lastMatch);
      }
    }

    // generate input and check if input already found
    let userCoordinates = checkInput(foundPairs, firstUserInput);

    usedCoordinates.push(userCoordinates);

    // backup if compared values are false
    defaultCoordinates.push(hide[userCoordinates.col][userCoordinates.row]);

    console.clear();

    //  reveal hideArr
    hide[userCoordinates.col][userCoordinates.row] =
      solution[userCoordinates.col][userCoordinates.row];

    if (round === 1) {
      round1String = solution[userCoordinates.col][userCoordinates.row];
      firstUserInput = userCoordinates;
    }

    if (round === 2) {
      round2String = solution[userCoordinates.col][userCoordinates.row];
    }

    console.log(hide);

    console.log("Points: ", points);
    if (lastMatch !== null) {
      console.log("Last Match: ", lastMatch);
    }

    if (round1String !== round2String && round === 2) {
      console.log("\nNO MATCH ...");
      rl.question(
        "Take your time to memorize, then press [ENTER] to continue..."
      );
      hide[usedCoordinates[1].col][usedCoordinates[1].row] =
        defaultCoordinates[round - 1];
      hide[usedCoordinates[0].col][usedCoordinates[0].row] =
        defaultCoordinates[round - 2];
      firstUserInput = { col: null, row: null };
    }

    if (round1String === round2String && round === 2) {
      points++;
      lastMatch = round1String;
      foundPairs.push(usedCoordinates);
      firstUserInput = { col: null, row: null };
    }

    round++;

    if (points === 18) {
      console.log("Points: ", points);
      finished = true;
    }
  }
}

function checkInput(arrMatches, firstInput) {
  let userCoordinates = getUserCoordinates();
  for (const element of arrMatches) {
    for (item of element) {
      while (
        item.col === userCoordinates.col &&
        item.row === userCoordinates.row
      ) {
        console.log("\nALREADY FOUND ! Please choose other coordinates...");
        userCoordinates = getUserCoordinates();
      }
    }
  }
  while (
    firstInput.col === userCoordinates.col &&
    firstInput.row === userCoordinates.row
  ) {
    console.log(
      "\nSECOND INPUT MATCHES FIRST INPUT ! Please choose other coordinates..."
    );
    userCoordinates = getUserCoordinates();
  }
  return userCoordinates;
}

function printCategories(obj) {
  console.log(`
Categories:
***********\n`);
  for (const cat in obj) {
    console.log(`-> ${cat}`);
  }
}

function createRandomArray(arr) {
  const usedNums = [];
  const newArr = arr.map(() => {
    let randNum = Math.floor(Math.random() * arr.length);
    if (!usedNums.includes(randNum)) {
      usedNums.push(randNum);
      return (element = arr[randNum]);
    }
    while (usedNums.includes(randNum)) {
      randNum = Math.floor(Math.random() * arr.length);
    }
    usedNums.push(randNum);
    return (element = arr[randNum]);
  });
  return newArr;
}

function getUserCoordinates() {
  let userInput = rl.question("\nType in field coordinates: ");
  // RegEx
  let isInputValid = /^[0-5]{2}$/.test(userInput);
  while (!isInputValid) {
    userInput = rl.question(
      "\nValue not valid, range is [00 - 05 -> 50 - 55]: "
    );
    isInputValid = /^[0-5]{2}$/.test(userInput);
  }
  let coordinate1 = parseInt(userInput[0]);
  let coordinate2 = parseInt(userInput[1]);

  return { col: coordinate1, row: coordinate2 };
}

function endTheGame() {
  let endGame = rl.question("\nWanna play again [y/n]?: ");
  while (endGame !== "n" && endGame !== "y") {
    endGame = rl.question(
      "\nPlease choose between [y] for 'yes' and [n] for 'no': "
    );
  }
  if (endGame === "n") {
    return true;
  }
  return false;
}

/////////////////////////////////////////////////////////////////////////////////////////

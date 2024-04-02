/**
 * GameControl module.
 * @module GameControl
 * @description GameControl.js key objective is to control the game loop.
 * Usage Notes:
 * - call GameControl.gameLoop() to run the game levels.
 * - call or add listener to GameControl.startTimer() to start the game timer.
 */
import GameEnv from './GameEnv.js';
import LocalStorage from './LocalStorage.js';
import Socket from './Multiplayer.js';
import SettingsControl from "./SettingsControl.js";

/**
 * GameControl is a singleton object that controls the game loop.
 * @namespace GameControl
 * 
 * Coding Style Notes:
 * - GameControl is defined as an object literal
 * - GameControl is a singleton object, without a constructor.
 * - This coding style ensures one instance, thus the term object literal.
 * - Informerly, GameControl looks like defining a variable with methods contained inside.
 * - The object literal style is a common pattern in JavaScript.
 * - Observe, definition style of methods with GameControl.methodName = function() { ... }
 *   - Example: transitionToLevel(newLevel) { ... } versus transitionToLevel: function(newLevel) { ... }
 *   - Methods are defined as ES6 shorthand, versus the traditional function() style.
 *   - The shorthand style is a common pattern in JavaScript, more concise, and readable as it common to other coding languages.
 *   - But, it does not look like key-value pairs, which is the traditional object literal style.
 *   - This shorthand is part of ES6, and is supported by all modern browsers. references: https://caniuse.com/#feat=es6, https://www.w3schools.com/js/js_versions.asp
 * - Observe, scoping/encapulation of this.inTransition and sharing data between methods.
 *   - this.inTransition is defined in the object literal scope.
 *   - this.inTransition is shared between methods.
 *   - this.inTransition is not accessible outside of the object literal scope.
 *   - this.inTransition is not a global or static variable.
 * 
 */
const GameControl = {
    /**
     * A reference to the interval used for the game timer.
     * @type {number}
     */
    intervalId: null, // Variable to hold the timer interval reference
    /**
     * The start time of the game timer.
     * @type {number}
     */
    startTime: null, // Variable to hold the start time
    localStorageTimeKey: "localTimes",
    /**
     * Updates and displays the game timer.
     * @function updateTimer
     * @memberof GameControl
     */
    updateScore() {
        const id = document.getElementById("gameOver");

        if (id.hidden == false) {
            // Get the current user ID from SettingsControl
            const userID = GameEnv.userID

            // Subtract 3 seconds if destroyedMushroom is true
            //const adjustedElapsedTime = GameEnv.destroyedMushroom ? Math.max(0, elapsedTimeNum - 3) : elapsedTimeNum;
    
            // Retrieve existing time scores from local storage
        
            // Add the new time score with user ID to the array
            const newTimeScore = {
                userID: userID,
                time: GameEnv.coinScore,
                // You can add more properties if needed
            };

            // Save the updated array to local storage
            localStorage.setItem('userScores', JSON.stringify(GameEnv.userScore));
            Socket.sendData("leaderboard",GameEnv.userScore.toFixed(2));
            
        }
    
        const userScoreElement = document.getElementById('userScore');
        if ( userScoreElement) {
            // Update the displayed time
            userScoreElement.textContent = GameEnv.coinScore.toFixed(2);
            
            // Get the current user ID from SettingsControl
            const userID = SettingsControl.userID;
    
            /*
            // Retrieve existing time scores from local storage
            const existingTimeScores = JSON.parse(localStorage.getItem('timeScore')) || [];
    
            // Check if there is a recent time score for the current user
            const recentTimeScore = existingTimeScores.find(score => score.userID === userID);
    
            if (!recentTimeScore) {
                // Add the new time score with user ID to the array
                // Assume the existingTimeScores retrieval as described in the previous response

                // Assuming you have userID and elapsedTime defined somewhere in your code
                const userID = 'exampleUserID';
                const elapsedTime = elapsedTimeNum.toFixed(2); // Replace with the actual elapsed time value

                // Add the new time score with user ID to the array
                const newTimeScore = {
                    userID: userID,
                    time: elapsedTime,
                    // You can add more properties if needed
                };

                existingTimeScores.push(newTimeScore);

                // Log the updated array to the console for debugging
                //console.log(existingTimeScores);

                // Save the updated array to local storage
                localStorage.setItem('timeScores', JSON.stringify(existingTimeScores));

            }
            */
        }
    },   
    async saveTime(time) {
        if (time == 0) return;
        const userID = GameEnv.userID
        const oldTable = await this.getAllTimes()

        const data = {
            userID: userID,
            time: time
        }

        if (!oldTable) {
            localStorage.setItem(this.localStorageTimeKey, JSON.stringify([data]))
            return;
        }

        oldTable.push(data)

        localStorage.setItem(this.localStorageTimeKey, JSON.stringify(oldTable))
    },
    async getAllTimes() {
        let timeTable = null;

        try {
            timeTable = localStorage.getItem(this.localStorageTimeKey);
        }
        catch (e) {
            return e;
        }

        return JSON.parse(timeTable)
    },
    updateTimer() {
        
            const time = GameEnv.time

            if (GameEnv.timerActive) {
                const newTime = time + GameEnv.timerInterval
                GameEnv.time = newTime
                
                if (document.getElementById('timeScore')) {
                    document.getElementById('timeScore').textContent = (time/1000).toFixed(2) 
                }

                return newTime
            }
    },    
        
    /**
     * Starts the game timer.
     * @function startTimer
     * @memberof GameControl
     */
    startTimer() {
        this.intervalId = setInterval(() => this.updateTimer(), GameEnv.timerInterval);

        GameEnv.timerActive = true;
    },

    /**
     * Stops the game timer.
     * @function stopTimer
     * @memberof GameControl
     */
    stopTimer() {   
        if (!GameEnv.timerActive) return;
        
        this.saveTime(GameEnv.time)

        this.getAllTimes()

        GameEnv.timerActive = false
        GameEnv.time = 0;

        clearInterval(this.intervalId)
    },

    randomEventId: null, //Variable to determine which random event will activate.
    randomEventState: null, //Variable to hold the state. Is equal set to 1 when an event is triggered and then back to 0 once the event is completed.

    //HOW TO ADD A RANDOM EVENT
    //Import GameControl.js into the desired file
    //Put this code in the update function of any game object

    /**if (GameControl.randomEventId === # && GameControl.randomEventState === 1) {
        //random event goes here
        GameControl.endRandomEvent();
    }*/

    //Next, make sure that the event Id that triggers it is not being used
    //Make sure that the event id is within the possible numbers that can be picked
    //Once you are done make sure to add it to the random event key below

    startRandomEvent() {
        this.randomEventState = 1;
        this.randomEventId = Math.floor(Math.random() * 3) + 1; //The number multiplied by Math.random() is the number of possible events.
        /**Random Event Key
         * 1: Inverts the Color of the Background
         * 2: Time Stops all Goombas
         * 3: Kills a Random Goomba
        */
    },

    endRandomEvent() {
        this.randomEventId = 0;
    },


    /**
     * Transitions to a new level. Destroys the current level and loads the new level.
     * @param {Object} newLevel - The new level to transition to.
     */
    async transitionToLevel(newLevel) {
        this.inTransition = true;

        // Destroy existing game objects
        GameEnv.destroy();

        // Load GameLevel objects
        await newLevel.load();
        GameEnv.currentLevel = newLevel;

        // Update invert property
        GameEnv.setInvert();
        
        // Trigger a resize to redraw canvas elements
        window.dispatchEvent(new Event('resize'));

        this.inTransition = false;
    },

    /**
     * The main game control loop.
     * Checks if the game is in transition. If it's not, it updates the game environment,
     * checks if the current level is complete, and if it is, transitions to the next level.
     * If the current level is null, it transitions to the beginning of the game.
     * Finally, it calls itself again using requestAnimationFrame to create a loop.
     */    
    gameLoop() {
        // Turn game loop off during transitions
        if (!this.inTransition) {

            // Get current level
            GameEnv.update();
            const currentLevel = GameEnv.currentLevel;

            // currentLevel is defined
            if (currentLevel) {
                // run the isComplete callback function
                if (currentLevel.isComplete && currentLevel.isComplete()) {
                    const currentIndex = GameEnv.levels.indexOf(currentLevel);
                    // next index is in bounds
                    if (currentIndex !== -1 && currentIndex + 1 < GameEnv.levels.length) {
                        // transition to the next level
                        this.transitionToLevel(GameEnv.levels[currentIndex + 1]);
                    } 
                }
            // currentLevel is null, (ie start or restart game)
            } else {
                // transition to beginning of game
                this.transitionToLevel(GameEnv.levels[0]);
            }
        }

        // recycle gameLoop, aka recursion
        requestAnimationFrame(this.gameLoop.bind(this));  
    },
};

export default GameControl;

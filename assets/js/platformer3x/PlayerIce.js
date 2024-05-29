import GameEnv from './GameEnv.js';
import PlayerBase from './PlayerBase.js';
import GameControl from './GameControl.js';

export class PlayerIce extends PlayerBase {
    constructor(canvas, image, data) {
        super(canvas, image, data);
        const scaledHeight = GameEnv.innerHeight * (100 / 832);
        const finishlineX = .01 * GameEnv.innerWidth;
        this.setX(finishlineX);
        this.hillsStart = true;
        this.timer = false;
        GameEnv.invincible = false;
        this.hp = 100; // Add health points for the player
    }

    updateJump() {
        let jumpHeightFactor;
        if (GameEnv.difficulty === "easy") {
            jumpHeightFactor = 0.05;
        } else if (GameEnv.difficulty === "normal") {
            jumpHeightFactor = 0.04;
        } else {
            jumpHeightFactor = 0.03;
        }
<<<<<<< HEAD
        this.setY(this.y - (this.bottom * jumpHeightFactor));
=======
        this.yv = -this.bottom * jumpHeightFactor;
        this.y += this.yv;
        this.setY(this.y);
    }    
    update(){
            super.update();
        if (this.hillsStart) {
                this.setY(0);
                this.hillsStart = false;
            }
>>>>>>> platformer3xNEW/main
    }

    update() {
        super.update();
        if (this.hillsStart) {
            this.setY(0);
            this.hillsStart = false;
        }
    }

    handleCollisionStart() {
        super.handleCollisionStart();
        this.handleCollisionEvent("finishline");
        this.handleCollisionEvent("penguin");
    }

    handlePlayerReaction() {
        super.handlePlayerReaction();
        switch (this.state.collision) {
            case "finishline":
                if (this.collisionData.touchPoints.this.top && this.collisionData.touchPoints.other.bottom) {
                    this.x = this.collisionData.newX;
                    if (Math.abs(this.y - this.bottom) <= GameEnv.gravity) {
                        const index = GameEnv.levels.findIndex(level => level.tag === "Winter");
                        GameControl.transitionToLevel(GameEnv.levels[index]);
                    }
                } else if (this.collisionData.touchPoints.this.right) {
                    this.state.movement.right = false;
                    this.state.movement.left = true;
                } else if (this.collisionData.touchPoints.this.left) {
                    this.state.movement.left = false;
                    this.state.movement.right = true;
                }
                break;
            case "penguin":
                if (this.collisionData.touchPoints.this.top && this.collisionData.touchPoints.other.bottom && this.state.isDying == false) {
                    if (GameEnv.goombaBounce === true) {
                        GameEnv.goombaBounce = false;
                        this.y = -10;
                    }
                    if (GameEnv.goombaBounce1 === true) {
<<<<<<< HEAD
                        GameEnv.goombaBounce1 = false;
                        this.y = this.y - 250;
=======
                        GameEnv.goombaBounce1 = false; 
                        this.y = -25;
>>>>>>> platformer3xNEW/main
                    }
                } else if (this.collisionData.touchPoints.this.right || this.collisionData.touchPoints.this.left) {
                    if (GameEnv.difficulty === "normal" || GameEnv.difficulty === "hard") {
                        if (this.state.isDying == false) {
                            this.state.isDying = true;
                            this.canvas.style.transition = "transform 0.5s";
                            this.canvas.style.transform = "rotate(-90deg) translate(-26px, 0%)";
                            GameEnv.playSound("PlayerDeath");
                            setTimeout(async () => {
                                await GameControl.transitionToLevel(GameEnv.levels[GameEnv.levels.indexOf(GameEnv.currentLevel)]);
                            }, 900);
                        }
                    } else if (GameEnv.difficulty === "easy" && this.collisionData.touchPoints.this.right) {
                        this.x -= 10;
                    } else if (GameEnv.difficulty === "easy" && this.collisionData.touchPoints.this.left) {
                        this.x += 10;
                    }
                }
                break;
        }
    }

    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0 && !this.state.isDying) {
            this.state.isDying = true;
            this.state.animation = "death";
            this.canvas.style.transition = "transform 0.5s";
            this.canvas.style.transform = "rotate(-90deg) translate(-26px, 0%)";
            GameEnv.playSound("PlayerDeath");
    
            setTimeout(async () => {
                await GameControl.transitionToLevel(GameEnv.levels[GameEnv.levels.indexOf(GameEnv.currentLevel)]);
            }, 1); // Adjust the delay as needed for the death animation
        }
    }        
}

export default PlayerIce;
import GameEnv from './GameEnv.js';
import Character from './Character.js';
import GameControl from './GameControl.js';
import Enemy from './Enemy.js';
import GameLevel from './GameLevel.js';
import hpBar from './hpBar.js';

export class NarwhalBoss extends Enemy {
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition) {
        super(canvas, image, data, xPercentage, yPercentage, name, minPosition);
        this.storeSpeed = this.speed;
        this.animationSpeed = data?.animationSpeed || 1;
        this.counter = data?.animationSpeed;
        this.enemySpeed();
        this.maxHp = 100;
        this.currentHp = 100;
        this.hpBar = new hpBar(100, 15, this.canvasWidth, this.canvasHeight, this.maxHp, this.currentHp, this.x, this.y);
        this.attackRange = 50;
    }

    updateFrameX() {
        if (!this.state.isDying || this.state.animation != "death") {
            if (this.frameX < this.maxFrame) {
                if (this.counter > 0) {
                    this.frameX = this.frameX;
                    this.counter--;
                } else {
                    this.frameX++;
                    this.counter = this.animationSpeed;
                }
            } else {
                this.frameX = this.minFrame;
            }
        } else if (this.state.isDying && this.state.animation == "death") {
            this.animationSpeed = 20;
            if (this.frameX < this.maxFrame) {
                if (this.counter > 0) {
                    this.frameX = this.frameX;
                    this.counter--;
                } else {
                    this.frameX++;
                    this.counter = this.animationSpeed;
                }
            } else {
                this.destroy();
                this.hpBar.destroy();
            }
        }
    }

    updateMovement() {
        if (this.state.animation === "right") {
            this.speed = Math.abs(this.storeSpeed);
        } else if (this.state.animation === "left") {
            this.speed = -Math.abs(this.storeSpeed);
        } else {
            this.speed = 0;
        }
        this.x += this.speed;
        this.playerBottomCollision = false;
    }

    update() {
        super.update();
        this.hpBar.updateHpBar(this.currentHp, this.x, this.y, this.canvasWidth, this.canvasHeight);
    }

    collisionAction() {
        const other = this.collisionData.touchPoints.other;
    
        if (other.id === "tube") {
            if (this.state.direction === "left" && other.right) {
                this.state.animation = "right";
                this.state.direction = "right";
            } else if (this.state.direction === "right" && other.left) {
                this.state.animation = "left";
                this.state.direction = "left";
            }
        }
    
        if (other.id === "PlayerIce" || other.id === "player") {
            if (other.right && !other.bottom) {
                this.x -= 10;
                this.state.direction = "left";
                this.state.animation = "attackL";
                this.speed = 0;
                this.attackPlayerIce();
            } else if (other.left && !other.bottom) {
                this.x += 10;
                this.state.direction = "right";
                this.state.animation = "attackR";
                this.speed = 0;
                this.attackPlayerIce();
            } else if (other.bottom && this.immune == 0) {
                GameEnv.goombaBounce = true;
                this.takeDamage(10);
            }
        } else {
            if (this.currentHp <= 0) {
                this.state.animation = "death";
                if (!this.state.isDying) {
                    this.frameX = 0;
                }
                this.state.isDying = true;
                GameEnv.invincible = true;
                GameEnv.playSound("goombaDeath");
            } else if (GameEnv.playerAttack && Math.abs((this.x + this.canvasWidth) / 2 - (GameEnv.playerIce.x + GameEnv.playerIce.canvasWidth) / 2) < (this.canvasWidth / 2 + this.attackRange)) {
                this.takeDamage(1);
            }
        }
    
        if (other.id === "jumpPlatform") {
            if (this.state.direction === "left" && other.right) {
                this.state.animation = "right";
                this.state.direction = "right";
            } else if (this.state.direction === "right" && other.left) {
                this.state.direction = "left";
                this.state.animation = "left";
            }
        }
    }        

    attackPlayerIce() {
        if (GameEnv.playerIce && !GameEnv.playerIce.state.isDying) {
            GameEnv.playerIce.state.isDying = true;
            GameEnv.playerIce.state.animation = "death";
            GameEnv.playerIce.frameX = 0; // Reset animation frame to start death animation
            GameEnv.playSound("PlayerDeath"); // Play death sound
            // Add visual death effect
            GameEnv.playerIce.canvas.style.transition = "transform 0.5s";
            GameEnv.playerIce.canvas.style.transform = "rotate(-90deg) translate(-26px, 0%)";
            // Transition to current level (restart)
            setTimeout(async () => {
                await GameControl.transitionToLevel(GameEnv.levels[GameEnv.levels.indexOf(GameEnv.currentLevel)]);
            }, 900); // Adjust the delay as needed for the death animation
        }
    }
    

    takeDamage(damage) {
        this.currentHp -= damage;
        if (this.currentHp <= 0) {
            this.state.animation = "death";
            if (!this.state.isDying) {
                this.frameX = 0;
            }
            this.state.isDying = true;
            GameEnv.invincible = true;
            GameEnv.playSound("goombaDeath");
        }
    }
}

export default NarwhalBoss;
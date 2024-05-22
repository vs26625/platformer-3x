import Character from './Character.js';
import FlyingGoomba from './FlyingGoomba.js';
import GameEnv from './GameEnv.js';

export class Jellyfish extends FlyingGoomba {
    // Constructor sets up Character object 
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition, minYPercentage, maxYPercentage) {
        super(canvas, image, data);

        // Unused but must be defined
        this.name = name;
        this.yPercentage = yPercentage;

        // Initial Position of Goomba
        this.x = xPercentage * GameEnv.innerWidth;
        this.y = yPercentage * GameEnv.innerHeight;

        // Access in which a Goomba can travel
        this.minPosition = minPosition * GameEnv.innerWidth;
        this.maxPosition = this.x + xPercentage * GameEnv.innerWidth;

        // Define the Y-axis movement range
        this.minY = minYPercentage * GameEnv.innerHeight;
        this.maxY = maxYPercentage * GameEnv.innerHeight;

        this.immune = 0;

        // Define Speed of Enemy
        if (GameEnv.difficulty === "normal") {
            this.speed = this.speed;
        } else if (GameEnv.difficulty === "hard") {
            this.speed = this.speed * 2;
        } else if (GameEnv.difficulty === "easy") {
            this.speed = this.speed * 1;
        } else if (GameEnv.difficulty === "impossible") {
            this.speed = this.speed * 3;
        }

        // Additional Y-axis properties
        this.ySpeed = this.speed / 2; // Adjust this for desired Y-axis speed
        this.yDirection = 1; // 1 for down, -1 for up
    }

    update() {
        super.update();

        // X-axis movement
        if (this.x <= this.minPosition || (this.x + this.canvasWidth >= this.maxPosition) || this.x > (GameEnv.innerWidth - 100)) {
            this.speed = -this.speed;
        }

        if (this.speed < 0) {
            this.canvas.style.transform = 'scaleX(1)';
        } else {
            this.canvas.style.transform = 'scaleX(-1)';
        }

        // Randomly change X direction
        if (Math.random() < 0.005) {
            this.speed = Math.random() < 0.5 ? -this.speed : this.speed;
        }

        // Y-axis movement with bounds checking
        this.y += this.ySpeed * this.yDirection;
        if (this.y <= this.minY || this.y >= this.maxY) {
            this.yDirection = -this.yDirection; // Reverse direction when hitting bounds
        }

        // Randomly change Y direction
        if (Math.random() < 0.005) {
            this.yDirection = Math.random() < 0.5 ? -1 : 1;
        }

        // Chance for Goomba to turn Gold
        if (["normal", "hard"].includes(GameEnv.difficulty)) {
            if (Math.random() < 0.00001) {
                this.canvas.style.filter = 'brightness(1000%)';
                this.immune = 1;
            }
        }

        // Immunize Goomba & Texture It
        if (GameEnv.difficulty === "hard") {
            this.canvas.style.filter = "invert(100%)";
            this.canvas.style.scale = 1.25;
            this.immune = 1;
        } else if (GameEnv.difficulty === "impossible") {
            this.canvas.style.filter = 'brightness(1000%)';
            this.canvas.style.transform = "rotate(180deg)";
            this.immune = 1;
        }

        // Move the enemy
        this.x -= this.speed;
    }

    // Player action on collisions
}

export default Jellyfish;

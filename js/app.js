var allEnemies = []; // The array in which we store the Enemy objects.

// The constructor for Enemy objects.
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = -101; // This value is set to -101 so enemies will spawn off screen.
    this.y = this.generateY();
    this.hitbox = this.x + 50; // This helps us with collisions.
    this.speed = this.generateSpeed();
    allEnemies.push(this);
};

// Draw enemy on the screen.
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// This function moves enemies according to their speed property.
Enemy.prototype.moveEnemies = function(dt) {
    for (i = 0; i < allEnemies.length; i++) {
        allEnemies[i].x += (allEnemies[i].speed) * dt;
    }
};

// In order to save up memory, this removes from the allEnemies array
// objects that are not on the screen anymore.
// NOTE: Screen edge is not actually 700px, but using less than 700 makes the enemies move slower
// when approaching the edge of the screen.
Enemy.prototype.cleanEnemyArray = function() {
    for (i = 0; i < allEnemies.length; i++) {
        if (allEnemies[i].x > 700) {
            allEnemies.splice(i, 1);
        }
    }
};

// Update the enemy's position.
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.moveEnemies(dt);
    this.cleanEnemyArray();

    // Spawns enemies everytime there are less than 5 enemies in the allEnemies array.
    if (allEnemies.length < 5) {
        new Enemy();
    }
};

// Generates Y position from three possible values.
Enemy.prototype.generateY = function() {
    // An array containing the possible Y positions (first, second and third stone tiles);
    var yPositions = [217, 134, 51];
    return yPositions[Math.floor(Math.random() * yPositions.length)];
}

// Generate speed from a range of values.
Enemy.prototype.generateSpeed = function() {
    return Math.floor(Math.random() * (60 - 15) + 15);
}

// The constructor for Player objects.
var Player = function() {
    this.x = 202; // Initial X.
    this.y = 300; // Initial Y.
    this.sprite = 'images/char-boy.png';
};

// Draw the Player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Translates keyboard inputs into movement.
// Every 101 pixels is a horizontal block,
// every 83 pixels is a vertical one.
Player.prototype.handleInput = function(key) {
    if (this.y <= 300 && (this.x < 404 && this.x > 0)) {
        // Player is not on any edge or corner.
        switch (key) {
            case "up":
                this.y -= 83;
                break;
            case "down":
                this.y += 83;
                break;
            case "left":
                this.x -= 101;
                break;
            case "right":
                this.x += 101;
                break;
        }
    } else if ((this.x > 0 && this.x < 404) && this.y > 300) {
        // Player is on lower edge of screen, but not on any corner.
        switch (key) {
            case "up":
                this.y -= 83;
                break;
            case "left":
                this.x -= 101;
                break;
            case "right":
                this.x += 101;
                break;
        }
    } else if (this.y > 300 && 101 > this.x) {
        // Player is on the lower edge and left corner of screen.
        switch (key) {
            case "up":
                this.y -= 83;
                break;
            case "right":
                this.x += 101;
                break;
        }
    } else if (this.y > 300 && this.x > 303) {
        // Player is on the lower edge and right corner of the screen.
        switch (key) {
            case "up":
                this.y -= 83;
                break;
            case "left":
                this.x -= 101;
                break;
        }
    } else if (this.y <= 300 && this.x == 0) {
        // Player is on the left edge of screen.
        switch (key) {
            case "up":
                this.y -= 83;
                break;
            case "down":
                this.y += 83;
                break;
            case "right":
                this.x += 101;
                break;
        }
    } else if (this.y <= 300 && this.x > 303) {
        // Player is on the right edge of screen.
        switch (key) {
            case "up":
                this.y -= 83;
                break;
            case "down":
                this.y += 83;
                break;
            case "left":
                this.x -= 101;
                break;
        }
    }
};

// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    this.handleCollisions();
    this.handleWin();
};

// Resets player location if it hits an enemy.
Player.prototype.handleCollisions = function() {
    for (i = 0; i < allEnemies.length; i++) {
        if (allEnemies[i].y == this.y) {
            if (this.x < allEnemies[i].x - allEnemies[i].hitbox && this.x > allEnemies[i].x + allEnemies[i].hitbox) {
                this.x = 202;
                this.y = 300;
                var loseSound = new Audio("audio/hit.wav");
                loseSound.play();
            }
        }
    }
};

// Resets player location and play success sound effect when player reaches water.
Player.prototype.handleWin = function() {
    if (this.y <= 1) {
        var winSound = new Audio("audio/score.mp3");
        winSound.play();
        this.x = 202;
        this.y = 300;
    }
};

// Instantiates Player.
player = new Player();

// Create three starting instances of Enemy.
new Enemy();
new Enemy();
new Enemy();

// This listens for key presses and sends the keys to Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
const WIDTH = 360;
const HEIGHT = 800;

const mainConfig = {
    key: 'MainScene',
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    parent: 'gameContainer',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(mainConfig);
game.scene.add('MainScene', mainConfig);

let targetSquare;
let currentWitdth;
let currentHeight;

const RECTANGLE_HEIGHT = 20;
let upperLeftRectangle;
let upperRightRectangle;
let lowerLeftRectangle;
let lowerRightRectangle;
let deadEndCircle;

let isDropping;
let verticalOffset;
let isColliding;

let score = 0;
let scoreText;

let upperWidth;

function refreshState(self) {
    currentWitdth = 50;
    currentHeight = 50;
    isDropping = false;
    verticalOffset = 0;
    isColliding = false;
    upperWidth = getRandomInt(30, 100);
}

function preload() { 
    refreshState(this);
}

function calculateAnchorX() {
    return (WIDTH / 2) - (currentWitdth / 2);
}

function calculateAnchorY() {
    return (HEIGHT / 2) - (currentHeight / 2) - 200;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateRectangles() {
    upperLeftRectangle.clear();
    upperLeftRectangle.fillStyle(0xff0000, 1.0);
    upperLeftRectangle.fillRect(0, 600, upperWidth, RECTANGLE_HEIGHT);
    upperLeftRectangle.rect = new Phaser.Geom.Rectangle(0, 600, upperWidth, RECTANGLE_HEIGHT);

    upperRightRectangle.clear();
    upperRightRectangle.fillStyle(0xff0000, 1.0);
    upperRightRectangle.fillRect(WIDTH - upperWidth, 600, upperWidth, RECTANGLE_HEIGHT);
    upperRightRectangle.rect = new Phaser.Geom.Rectangle(WIDTH - upperWidth, 600, upperWidth, RECTANGLE_HEIGHT);

    let lowerWidth = upperWidth + 50;

    lowerLeftRectangle.clear();
    lowerLeftRectangle.fillStyle(0xff0000, 1.0);
    lowerLeftRectangle.fillRect(0, 620, lowerWidth, RECTANGLE_HEIGHT);
    lowerLeftRectangle.rect = new Phaser.Geom.Rectangle(0, 620, lowerWidth, RECTANGLE_HEIGHT);

    lowerRightRectangle.clear();
    lowerRightRectangle.fillStyle(0xff0000, 1.0);
    lowerRightRectangle.fillRect(WIDTH - lowerWidth, 620, lowerWidth, RECTANGLE_HEIGHT);
    lowerRightRectangle.rect = new Phaser.Geom.Rectangle(WIDTH - lowerWidth, 620, lowerWidth, RECTANGLE_HEIGHT);
}

function create() {
    targetSquare = this.add.graphics();
    targetSquare.fillStyle(0xff0000, 1.0);
    targetSquare.fillRect(calculateAnchorX(), calculateAnchorY(), currentWitdth, currentHeight);

    upperLeftRectangle = this.add.graphics();
    upperRightRectangle = this.add.graphics();
    lowerLeftRectangle = this.add.graphics();
    lowerRightRectangle = this.add.graphics();
    updateRectangles();

    deadEndCircle = this.add.graphics();
    deadEndCircle.fillStyle(0xff0000, 1.0);
    deadEndCircle.fillCircle(180, 700, 20);
    deadEndCircle.rect = new Phaser.Geom.Rectangle(160, 680, 40, 40);

    scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    this.input.on('pointerdown', function (pointer) {
        if (isDropping == false && isColliding == false) {
            isDropping = true;
        }
    });

    this.scene.get('LoseScene').scene.pause();
}

function update() {
    if (currentWitdth >= 250) {
        this.scene.start('LoseScene', { score: score });
    }

    if ((currentWitdth < 250) && (isDropping == false) && (isColliding == false)) {
        targetSquare.clear();
        currentWitdth += 1;
        currentHeight += 1;

        targetSquare.fillStyle(0xff0000, 1.0);
        targetSquare.fillRect(calculateAnchorX(), calculateAnchorY(), currentWitdth, currentHeight);
    } else {
        if (isDropping) {
            targetSquare.clear();

            verticalOffset += 1;
            var squareX = calculateAnchorX();
            var squareY = calculateAnchorY() + verticalOffset;
            targetSquare.fillStyle(0xff0000, 1.0);
            targetSquare.fillRect(squareX, squareY, currentWitdth, currentHeight);

            var targetRect = new Phaser.Geom.Rectangle(squareX, squareY, currentWitdth, currentHeight);

            if (Phaser.Geom.Intersects.RectangleToRectangle(targetRect, upperLeftRectangle.rect) ||
                Phaser.Geom.Intersects.RectangleToRectangle(targetRect, upperRightRectangle.rect)) {
                isDropping = false;
                isColliding = true;
                this.scene.start('LoseScene', { score: score });
            }

            if (Phaser.Geom.Intersects.RectangleToRectangle(targetRect, deadEndCircle.rect) ||
                Phaser.Geom.Intersects.RectangleToRectangle(targetRect, deadEndCircle.rect)) {
                isColliding = true;
                this.scene.start('LoseScene', { score: score });
            }

            if (Phaser.Geom.Intersects.RectangleToRectangle(targetRect, lowerLeftRectangle.rect) ||
                Phaser.Geom.Intersects.RectangleToRectangle(targetRect, lowerRightRectangle.rect)) {
                isDropping = false;
                isColliding = true;

                score += 1;
                scoreText.setText('Score: ' + score);

                alert("You got 1 point!");

                refreshState(this);
            }
        } else {
            targetSquare.clear();
            var squareX = calculateAnchorX();
            var squareY = calculateAnchorY() + verticalOffset;
            targetSquare.fillStyle(0xff0000, 1.0);
            targetSquare.fillRect(squareX, squareY, currentWitdth, currentHeight);
        }
    }
}

const loseConfig = {
    key: 'LoseScene',
    active: false,
    visible: false,
    preload: function () { },
    create: function () {
        const score = this.scene.settings.data.score;
        let showScore = score;

        this.add.text(WIDTH / 2, HEIGHT / 2, 'You Lose', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        if (!score) showScore = 0;

        this.add.text(WIDTH / 2, HEIGHT / 2 + 50, 'Score: ' + showScore, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        this.add.text(WIDTH / 2, HEIGHT / 2 + 100, 'Click to Restart', { fontSize: '16px', fill: '#fff' }).setOrigin(0.5);

        this.input.on('pointerdown', function () {
            window.location.reload();
        }, this);
    },
    update: function () { }
};
game.scene.add('LoseScene', loseConfig);


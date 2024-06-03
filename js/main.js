const WIDTH = 360;
const HEIGHT = 800;

const config = {
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

const game = new Phaser.Game(config);

let targetSquare;
let currentWitdth = 50;
let currentHeight = 50;

const RECTANGLE_HEIGHT = 20;
let upperLeftRectangle;
let upperRightRectangle;
let lowerLeftRectangle;
let lowerRightRectangle;
let upperRectangleLenght;
let lowerRectangleLenght;


let isDropping = false;
let verticalOffset = 0;
let isColliding = false;

function preload() {}

function calculateAnchorX() {
    return (WIDTH / 2) - (currentWitdth / 2);
}

function calculateAnchorY() {
    return (HEIGHT / 2) - (currentHeight / 2) - 200;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function create() {
    targetSquare = this.add.graphics();
    targetSquare.fillStyle(0xff0000, 1.0);
    targetSquare.fillRect(calculateAnchorX(), calculateAnchorY(), currentWitdth, currentHeight);

    let upperWidth = getRandomInt(30, 100);

    upperLeftRectangle = this.add.graphics();
    upperLeftRectangle.fillStyle(0xff0000, 1.0);
    upperLeftRectangle.fillRect(0, 600, upperWidth, RECTANGLE_HEIGHT);
    upperLeftRectangle.rect = new Phaser.Geom.Rectangle(0, 600, upperWidth, RECTANGLE_HEIGHT);

    upperRightRectangle = this.add.graphics();
    upperRightRectangle.fillStyle(0xff0000, 1.0);
    upperRightRectangle.fillRect(WIDTH - upperWidth, 600, upperWidth, RECTANGLE_HEIGHT);
    upperRightRectangle.rect = new Phaser.Geom.Rectangle(WIDTH - upperWidth, 600, upperWidth, RECTANGLE_HEIGHT);

    let lowerWidth = upperWidth + 50;

    lowerLeftRectangle = this.add.graphics();
    lowerLeftRectangle.fillStyle(0xff0000, 1.0);
    lowerLeftRectangle.fillRect(0, 620, lowerWidth, RECTANGLE_HEIGHT);
    lowerLeftRectangle.rect = new Phaser.Geom.Rectangle(0, 620, lowerWidth, RECTANGLE_HEIGHT);

    lowerRightRectangle = this.add.graphics();
    lowerRightRectangle.fillStyle(0xff0000, 1.0);
    lowerRightRectangle.fillRect(WIDTH - lowerWidth, 620, lowerWidth, RECTANGLE_HEIGHT);
    lowerRightRectangle.rect = new Phaser.Geom.Rectangle(WIDTH - lowerWidth, 620, lowerWidth, RECTANGLE_HEIGHT);

    this.input.on('pointerdown', function(pointer) {
        if (isDropping == false && isColliding == false) {
            isDropping = true;
        }
        
    });
}

function update() {
    if ((currentWitdth < 250) && (isDropping == false) && (isColliding == false)) {  
        targetSquare.clear();      
        currentWitdth += 1;
        currentHeight += 1;

        targetSquare.fillStyle(0xff0000, 1.0);
        targetSquare.fillRect(calculateAnchorX(), calculateAnchorY(), currentWitdth, currentHeight);
    } else {
        if (isDropping) {
            targetSquare.clear();
            
            verticalOffset += 5;
            const squareX = calculateAnchorX();
            const squareY = calculateAnchorY() + verticalOffset;
            targetSquare.fillStyle(0xff0000, 1.0);
            targetSquare.fillRect(squareX, squareY, currentWitdth, currentHeight);

            const targetRect = new Phaser.Geom.Rectangle(squareX, squareY, currentWitdth, currentHeight);

            if (Phaser.Geom.Intersects.RectangleToRectangle(targetRect, upperLeftRectangle.rect) ||
                Phaser.Geom.Intersects.RectangleToRectangle(targetRect, upperRightRectangle.rect)) {
                isDropping = false;
                isColliding = true;
                alert("LOSE");
            }

            if (Phaser.Geom.Intersects.RectangleToRectangle(targetRect, lowerLeftRectangle.rect) ||
                 Phaser.Geom.Intersects.RectangleToRectangle(targetRect, lowerRightRectangle.rect)) {
                isDropping = false;
                isColliding = true;
                alert("WIN");
            }
        } else {
            targetSquare.clear();
            const squareX = calculateAnchorX();
            const squareY = calculateAnchorY() + verticalOffset;
            targetSquare.fillStyle(0xff0000, 1.0);
            targetSquare.fillRect(squareX, squareY, currentWitdth, currentHeight);
        }
    }
}
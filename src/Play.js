class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200 // constant 
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100
        // Initialize counters
        this.shotCount = 0
        this.successfulShots = 0
        this.score = 0
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)
        
        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2) // sets the boundary to fit the ball
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)   // slows the ball after the hit
        this.ball.body.setDamping(true).setDrag(0.5) // applies drag to slow the ball after hit

        // add walls
        this.wallA = this.physics.add.sprite(0, height / 4, 'wall')
        this.wallA.setX(Phaser.Math.Between(0 + this.wallA.width / 2, width - this.wallA.width / 2))
        this.wallA.body.setImmovable(true)
        this.wallA.body.setCollideWorldBounds(true); // Ensure it doesn't go out of bounds        
        this.wallA.setVelocityX(100) // Initial movement to the right

        // cntrl + D will select a word and allow you to change multiple instances
        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width / 2))
        wallB.body.setImmovable(true)
        
        this.walls = this.add.group([this.wallA, wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        /* // add pointer input (RNG BASED)
        this.input.on('pointerdown', (pointer) => {
            let shotDirection = pointer.y <= this.ball.y ? 1 : -1
            this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X))
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)
        })
        */
        // add pointer input for shooting the ball
        this.input.on('pointerdown', (pointer) => {
            this.shotCount++
            // Determine the direction of the shot
            let shotDirectionX = pointer.x < this.ball.x ? 1 : -1; // If click is left of the ball, shoot right, else shoot left
            let shotDirectionY = pointer.y <= this.ball.y ? 1 : -1; // Direction for y (up or down)
        
            // Set the velocity based on the pointer's x and y positions
            this.ball.body.setVelocityX(shotDirectionX * Phaser.Math.Between(this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X * 2)); // Horizontal velocity
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirectionY); // Vertical velocity
        })   

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            this.successfulShots++
            this.score += 10 // Increase score for each successful shot
            this.updateDisplay() // Update the displayed values
            this.resetBall() // Reset the ball position
        })


        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)

        // style for text
        const textStyle = {
            fontFamily: 'Arial', // Change to any font you like
            fontSize: '24px',
            fontStyle: 'bold', // Can be 'italic', 'bold', 'bold italic'
            color: '#FFD700', // Gold color
            stroke: '#000000', // Outline color
            strokeThickness: 3, // Thickness of the outline
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 2,
                stroke: true,
                fill: true
            }
        };
        // Display text for shot counter, score, and percentage
        this.shotText = this.add.text(20, 20, `Shots: 0`, textStyle)
        this.scoreText = this.add.text(20, 50, `Score: 0`, textStyle)
        this.percentageText = this.add.text(20, 80, `Accuracy: 0%`, textStyle)
    }

    update() {
    // Update the display each frame
    this.updateDisplay()
    // Bounce wallA when it hits the screen edges
        // Manually check if wallA has hit the edges and reverse direction
        if (this.wallA.x <= this.wallA.width / 2) {
            this.wallA.setVelocityX(100); // Move right
        } else if (this.wallA.x >= width - this.wallA.width / 2) {
            this.wallA.setVelocityX(-100); // Move left
        }
        
    }

    updateDisplay() {
        // Update shot counter, score, and successful shot percentage
        this.shotText.setText(`Shots: ${this.shotCount}`)
        this.scoreText.setText(`Score: ${this.score}`)

        let successRate = this.shotCount > 0 ? Math.round((this.successfulShots / this.shotCount) * 100) : 0
        this.percentageText.setText(`Accuracy: ${successRate}%`)
    }

    // Function to reset the ball's position
    resetBall() {
        this.ball.setPosition(width / 2, height - height / 10)
        this.ball.setVelocity(0) // Stop any movement
    }    
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[X] Add ball reset logic on successful shot
[X] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[X] Make one obstacle move left/right and bounce against screen edges
[X] Create and display shot counter, score, and successful shot percentage
*/
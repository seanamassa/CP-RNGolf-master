// Code Practice: RNGolf
// Name: Sean Massa
// Date: 1/29/2025

'use strict'

//const { Physics } = require("phaser")

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    physics:{
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [ Play ]
}

let game = new Phaser.Game(config)

let { width, height } = game.config
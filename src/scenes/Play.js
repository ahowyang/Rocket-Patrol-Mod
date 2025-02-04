class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        // place title sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0)
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)
        
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, this.textures.get('spaceship'), 0, 30).setOrigin(0, 0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, this.textures.get('spaceship'), 0, 20).setOrigin(0, 0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, this.textures.get('spaceship'), 0, 10).setOrigin(0, 0)

        // add bonus spaceship (x1)
        this.bShip = new Spaceship2(this, game.config.width + 10, borderUISize*5 + borderPadding*4, 'spaceship2', 0, 50).setOrigin(0, 0)

        // define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

        // initialize scores
        this.p1Score = 0
        this.p2Score = 0
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        if(!this.p2Played) {
            this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig)
        } else {
            this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p2Score, scoreConfig)
        }
        
        // GAME OVER flag
        this.gameOver = false

        scoreConfig.fixedWidth = 0

        // sixty second play clock
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
            this.gameOver = true

            // storing score
            if(!this.p2Played) {
                this.add.text(game.config.width/2, game.config.height/2 + 64, `P1 score: ${this.p1Score}`, scoreConfig).setOrigin(0.5)
                this.add.text(game.config.width/2, game.config.height/2 + 128, 'P2 START (Press ←)', scoreConfig).setOrigin(0.5)
            }
            if(this.p2Played) {
                if(this.p1Contest > this.p2Score) {
                    this.add.text(game.config.width/2, game.config.height/2 + 128,  `P2 score: ${this.p2Score} | P1 wins!`, scoreConfig).setOrigin(0.5)
                } else if(this.p2Score > this.p1Contest) {
                    this.add.text(game.config.width/2, game.config.height/2 + 128, `P2 score: ${this.p2Score} | P2 wins!`, scoreConfig).setOrigin(0.5)
                } else if(this.p1Contest == this.p2Score) {
                    this.add.text(game.config.width/2, game.config.height/2 + 128, `P2 score: ${this.p2Score} | Tie!`, scoreConfig).setOrigin(0.5)
                }
                this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5)
            }
        }, null, this)

        // setting timer for display
        this.timerTxt = this.add.text(borderUISize + borderPadding + 500, borderUISize + borderPadding*2, this.timeLeft, scoreConfig)
        this.timeLeft = game.settings.gameTimer / 1000

        // displaying play clock
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                if(this.timeLeft > 0) {
                    this.timeLeft--
                    this.timerTxt.setText(`${this.timeLeft}`)
                }
            },
            loop: true
        })
    }

    update() {
        // check key input for restart
        if(this.gameOver && this.p2Played && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart()
        }

        // check key input for menu/p2 alternation
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            if(!this.p2Played) {
                this.p1Contest = this.p1Score
                this.scene.restart()
                this.p2Played = true
            } else {
                this.p1Score = 0
                this.p2Score = 0
                this.p2Played = false
                this.scene.start("menuScene")
            }
        }

        this.starfield.tilePositionX -= 4

        if(!this.gameOver) {
            this.p1Rocket.update()
            this.ship01.update()
            this.ship02.update()
            this.ship03.update()
            this.bShip.update()
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
        }
        if(this.checkCollision(this.p1Rocket, this.bShip)) {
            this.p1Rocket.reset()
            this.shipExplode(this.bShip)
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB coding
        if(rocket.x < ship.x + ship.width &&
        rocket.x + rocket.width > ship.x &&
        rocket.y < ship.y + ship.height &&
        rocket.height + rocket.y > ship.y) {
            return true
        } else {
            return false
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0)
        boom.anims.play('explode')              // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset()                        // reset ship position
            ship.alpha = 1                      // make ship visible again
            boom.destroy()                      // remove explosion sprite
        })
        // score add and text update
        if(!this.p2Played) {
            this.p1Score += ship.points
            this.scoreLeft.text = this.p1Score
        } else {
            this.p2Score += ship.points
            this.scoreLeft.text = this.p2Score
        }

        // choose an explosion sound to play at random
        let soundSeed = Math.floor(Math.random() * 4) + 1
        if(soundSeed == 1) {
            this.sound.play('sfx-explosion')
        } else if(soundSeed == 2) {
            this.sound.play('sfx-explosion02')
        } else if(soundSeed == 3) {
            this.sound.play('sfx-explosion03')
        } else if(soundSeed == 4) {
            this.sound.play('sfx-explosion04')
        }
    }
}
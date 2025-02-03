class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene")
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png')
        this.load.image('spaceship', './assets/spaceship.png')
        this.load.image('spaceship2', './assets/spaceship2.png')
        this.load.image('starfield', './assets/starfield.png')
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        })
        // load audio
        this.load.audio('sfx-select', './assets/sfx-select.wav')
        this.load.audio('sfx-explosion', './assets/sfx-explosion.wav')
        this.load.audio('sfx-explosion02', './assets/sfx-explosion02.wav')
        this.load.audio('sfx-explosion03', './assets/sfx-explosion03.wav')
        this.load.audio('sfx-explosion04', './assets/sfx-explosion04.wav')
        this.load.audio('sfx-shot', './assets/sfx-shot.wav')
        this.load.audio('bg-msc', './assets/song1.wav')
    }

    create() {
        // animation configuration
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        })

        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        // display menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2, 'Use ←→ arrows to move and (F) to fire', menuConfig).setOrigin(0.5)
        menuConfig.backgroundColor = '#00FF00'
        menuConfig.color = '#000'
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for Novice and → for Expert', menuConfig).setOrigin(0.5)

        // background music, produced using beepbox.co
        if(!this.bgMscToggle) {
            this.bgMsc = this.sound.add('bg-msc')
            this.bgMsc.loop = true
            this.bgMsc.play()
            this.bgMscToggle = true
        }
        
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            this.sound.play('sfx-select')
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000
            }
            this.scene.start('playScene')
        }
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            this.sound.play('sfx-select')
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000
            }
            
            this.scene.start('playScene')
        }
    }
}
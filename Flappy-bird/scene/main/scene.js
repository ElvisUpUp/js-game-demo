class Scene extends gameScene {
    constructor(game) {
        super(game)
        this.game = game
        this.game.over = false

        var bg = new gameImage(this.game, 'bg')
        this.addElement(bg)

        // 水管
        this.pipe = new Pipes(this.game)
        this.addElement(this.pipe)

        // 循环移动的地面
        this.skipCounts = 4
        this.grounds = []
        for (var i = 0; i < 30; i++) {
            var land = new gameImage(this.game, 'ground')
            land.x = i * 32
            land.y = this.game.canvas.height - land.h / 2
            this.addElement(land)
            this.grounds.push(land)
        }

        var b = new Bird(this.game)
        this.b = b
        this.addElement(b)

        var score = new Score(this.game)
        this.s = score
        this.addElement(score)

        this.setupInputs()

        window.addEventListener('keydown', (event) => {
            if (event.key === 'p') {
                this.game.pause();
            }
        })
    }
    update() {
        if (this.game.paused) {
            return
        }

        if (this.b.pass(this.pipe.pipes[1])) {
            if (this.b.isPass) {
                this.s.score++
                this.game.gScore = this.s.score
            }
        }

        // 死亡切换场景
        // 1是上面，0是下面
        if (this.b.over(this.pipe.pipes[1], this.pipe.pipes[0])) {
            log(this.game)
            this.game.over = true
            var end = new sceneEnd(this.game, 'bg')
            this.game.replaceScene(end)
        }

        super.update()
        this.skipCounts--
        var offset = -5
        if (this.skipCounts == 0) {
            this.skipCounts = 4
            offset = 15
        }
        // 地面移动
        for (var i = 0; i < 30; i++) {
            var land = this.grounds[i]
            land.x += offset
        }
    }
    draw() {
        super.draw()
    }
    setupInputs() {
        this.game.canvas.onclick = (event) => {
            this.b.rotation = -45
            this.b.jump()
        }
    }
}
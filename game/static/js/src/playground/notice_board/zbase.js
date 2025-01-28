class NoticeBoard extends AcGameObject {
    constructor(playgound) {
        super();
        this.playground = playgound;
        this.ctx = this.playground.game_map.ctx;
        this.message = "鼠标右键 移动，按 q + 左键 攻击";



    }

    start() {

    }

    write_text(text) {
        this.text = text;
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.font = "20px serif";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`${this.message}`, this.playground.width / 2, 20);
        if (this.playground.players.length < 2) {
            this.ctx.fillText(`${"已就绪" + this.playground.players.length + "人 , 两人后开始游戏"}`, this.playground.width / 2, 40);
        }
        //this.ctx.fillText(`${this.playground.players.length}`, this.playground.width / 2, 60);


    }
}
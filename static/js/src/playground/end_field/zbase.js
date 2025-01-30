class EndField extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.state = null;

        this.win_img = new Image();
        this.win_img.src = "https://cdn.acwing.com/media/article/image/2021/12/17/1_8f58341a5e-win.png"

        this.lose_img = new Image();
        this.lose_img.src = "https://cdn.acwing.com/media/article/image/2021/12/17/1_9254b5f95e-lose.png"

    }

    start() {

    }

    update() {
        this.render();
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("click", function () {
            if (outer.state === "win" || outer.state === "lose") {
                outer.playground.playground_hide();
                outer.playground.root.menu.menu_show();
            }
        });
    }

    win() {
        this.state = "win";
        let outer = this;

        setTimeout(function () {
            outer.add_listening_events();
        }, 1000);
    }

    lose() {
        this.state = "lose";
        let outer = this;
        setTimeout(function () {
            outer.add_listening_events();
        }, 1000);
    }

    render() {
        let length = this.playground.height / 2;
        if (this.state === "win") {

            this.ctx.drawImage(this.win_img, this.playground.width / 2 - length / 2, this.playground.height / 2 - length / 2, length, length);
        }
        else if (this.state === "lose") {
            this.ctx.drawImage(this.lose_img, this.playground.width / 2 - length / 2, this.playground.height / 2 - length / 2, length, length);
        }
    }
}
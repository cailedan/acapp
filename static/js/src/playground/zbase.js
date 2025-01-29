class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
<div class="ac-game-playground">

</div>
`);
        this.playground_hide();
        this.root.$ac_game.append(this.$playground);

        this.start();
    }

    resize() {

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;
        if (this.game_map) this.game_map.resize();
    }
    get_random_color() {
        let colors = ["blue", "red", "pink", "yellow", "green", "purple"];
        return colors[Math.floor(Math.random() * 6)];
    }

    start() {
        let outer = this;
        $(window).resize(function () {
            outer.resize();
        });

    }


    playground_show(mode) {

        this.$playground.show();


        this.game_map = new GameMap(this);
        this.resize();
        this.mode = mode;
        this.state = "waiting";
        this.player_count = 0;
        this.players = [];
        this.players.push(new Player(this, this.width / 2 / this.scale, this.height / 2 / this.scale, this.height * 0.05 / this.scale, "white", this.height * 0.15 / this.scale, "me", this.root.settings.username, this.root.settings.photo))

        if (mode === "single_mode") {
            for (let i = 0; i < 5; i++) {
                this.players.push(new Player(this, this.width / 2 / this.scale, this.height / 2 / this.scale, this.height * 0.05 / this.scale, this.get_random_color(), this.height * 0.15 / this.scale, "robot"))
            }
        }
        else if (mode === "multi_mode") {
            let outer = this;
            this.mps = new MultiPlayerSocket(this)
            this.chat_field = new ChatField(this);
            this.mps.uuid = this.players[0].uuid;  // 创建链接的窗口player的uuid
            this.mps.ws.onopen = () => {
                outer.mps.send_create_player(this.root.settings.username, this.root.settings.photo);

            };
            this.notice_board = new NoticeBoard(this);
        }
    }
    playground_hide() {
        this.$playground.hide();
    }
}
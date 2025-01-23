class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
<div class="ac-game-playground">
游戏界面
</div>
`);
        this.playground_hide();
        this.root.$ac_game.append(this.$playground);

        this.start();
    }

    start() {

    }


    playground_show() {
        this.$playground.show();
    }
    playground_hide() {
        this.$playground.hide();
    }
}
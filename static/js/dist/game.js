class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class="ac-game-menu">
            </div>
            `);
        this.root.$ac_game.append(this.$menu);
        console.log(this.$menu);
        console.log("menu");
    }
}
export class AcGame {
    constructor(id) {
        this.id = id;
        this.$ac_game = $('#' + id);
        this.menu = new AcGameMenu(this);
        //this.settings = new AcGameSettings(this);
        //this.playground = new AcGamePlayground(this);

        this.start();
    }

    start() {

    }

}

class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class="ac-game-menu">
                <div class="ac-game-menu-field">
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-single">
                        单人模式
                    </div>
                    <br>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-multiplayer">
                        多人模式
                    </div>
                    <br>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
                        退出
                    </div>                
                </div>
            </div>
            `);
        this.root.$ac_game.append(this.$menu);
        this.$single = this.$menu.find('.ac-game-menu-field-item-single');
        this.$multi = this.$menu.find('.ac-game-menu-field-item-multiplayer');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');

        this.start();
    }

    start() {
        this.add_listenning_events();
    }

    add_listenning_events() {
        let outer = this;
        this.$single.click(() => {
            outer.menu_hide();
            outer.root.playground.playground_show();
        })

        this.$multi.click(() => {
            console.log("multi");
        })
        this.$settings.click(() => {
            console.log("settings");
        })
    }

    menu_show() {
        this.$menu.show();

    }

    menu_hide() {
        this.$menu.hide();
    }
}
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
}class AcGame {
    constructor(id) {
        this.id = id;
        this.$ac_game = $('#' + id);
        this.menu = new AcGameMenu(this);
        //this.settings = new AcGameSettings(this);
        this.playground = new AcGamePlayground(this);

        this.start();
    }

    start() {

    }

}

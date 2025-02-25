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

        this.menu_hide();
        this.start();
    }

    start() {
        this.add_listenning_events();
        this.avatar = new AvatarSettings(this);
    }

    add_listenning_events() {
        let outer = this;
        this.$single.click(() => {
            outer.menu_hide();
            outer.root.playground.playground_show("single_mode");
        })

        this.$multi.click(() => {
            outer.menu_hide();
            outer.root.playground.playground_show("multi_mode");
        })
        this.$settings.click(() => {
            outer.root.settings.logout_on_remote();
        })
    }

    menu_show() {
        this.$menu.show();

    }

    menu_hide() {
        this.$menu.hide();
    }
}

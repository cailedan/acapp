class Settings {
    constructor(root) {

        this.root = root;
        this.platform = "web";
        if (this.root.AcWingOs) this.platform = "acapp";
        this.username = "";
        this.photo = "";
        this.$settings = $(`
            <div class="ac-game-settings">
                <div class="ac-game-settings-login">
                    <div class="ac-game-settings-title">
                        登  录
                    </div>
                    <div class="ac-game-settings-username">
                        <div class="ac-game-settings-item">
                            <input type="text" placeholder="用户名">
                        </div>      
                    </div>
                    <div class="ac-game-settings-password">
                        <div class="ac-game-settings-item">
                            <input type="password" placeholder="密码">
                        </div>
                    </div>
                    <div class="ac-game-settings-submit">
                        <div class="ac-game-settings-item">
                            <button>登 录</button>
                        </div>
                    </div>
                    <div class="ac-game-settings-error-message">
                        用户名或密码错误
                    </div>
                    <div class="ac-game-settings-options">
                        注册
                    </div>
                    <br>
                    <div class="ac-game-settings-acwing">
                        <img width="30" src="https://app7342.acapp.acwing.com.cn/static/images/settings/aclogo.png">
                        <div class="ac-game-settings-acwing-text">
                            acwing一键登录
                        </div>
                    </div>
                 
                </div>
                <div class="ac-game-settings-register">
                    <div class="ac-game-settings-title">
                        注册
                    </div>
                    <div class="ac-game-settings-username">
                        <div class="ac-game-settings-item">
                            <input type="text" placeholder="用户名">
                        </div>      
                    </div>
                    <div class="ac-game-settings-password ac-game-settings-password-first">
                        <div class="ac-game-settings-item">
                            <input type="password" placeholder="密码">
                        </div>
                    </div>
                     <div class="ac-game-settings-password ac-game-settings-password-second">
                        <div class="ac-game-settings-item">
                            <input type="password" placeholder="确认密码">
                        </div>
                    </div>
                    <div class="ac-game-settings-submit">
                        <div class="ac-game-settings-item">
                            <button>注册 </button>
                        </div>
                    </div>
                    <div class="ac-game-settings-error-message">
                        用户名或密码错误
                    </div>
                    <div class="ac-game-settings-options">
                        登录
                    </div>
            </div>
            `);

        this.$login = this.$settings.find(".ac-game-settings-login");
        this.$login_username = this.$login.find(".ac-game-settings-username input");
        this.$login_password = this.$login.find(".ac-game-settings-password input");
        this.$login_submit = this.$login.find(".ac-game-settings-submit button");
        this.$login_error_message = this.$login.find(".ac-game-settings-error-message");
        this.$login_options = this.$login.find(".ac-game-settings-options");
        this.$login.hide();

        this.$register = this.$settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ac-game-settings-error-message");
        this.$register_options = this.$register.find(".ac-game-settings-options");
        this.$register.hide();

        this.root.$ac_game.append(this.$settings);
        this.start();

    }

    start() {
        this.getinfo();
        this.add_listening_events();
    }

    add_listening_events() {
        this.add_listening_events_login();
        this.add_listening_events_register();
    }
    add_listening_events_login() {
        let outer = this;
        this.$login_options.click(() => {
            outer.register();
        });
    }

    add_listening_events_register() {
        let outer = this;
        this.$register_options.click(() => {
            outer.login();
        });
    }

    getinfo() {
        let outer = this;
        $.ajax({
            url: "https://app7342.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: (resp) => {
                console.log(resp);
                if (resp.result === "success") {
                    outer.username = resp.data.username;
                    outer.photo = resp.data.photo;
                    outer.settings_hide();
                    outer.root.menu.menu_show();
                } else {
                    outer.login();
                }
            }
        });
    }

    settings_hide() {
        //this.$settings.hide();
    }
    login() {

        if (this.platform === "web") {
            this.$register.hide();
            this.$login.show();

        }
    }

    register() {
        // if (this.platform === "acapp") {
        //     this.root.AcWingOs.register();
        //     return;
        // }


        if (this.platform === "web") {

            this.$login.hide();
            this.$register.show();
        }
    }



}
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
        this.$acwing_lgion = this.$settings.find(".ac-game-settings-acwing img");
        this.$login.hide();
        // this.$login_error_message.hide();

        this.$register = this.$settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ac-game-settings-error-message");
        this.$register_options = this.$register.find(".ac-game-settings-options");
        this.$register.hide();
        // this.$register_error_message.hide();

        this.root.$ac_game.append(this.$settings);
        this.start();

    }

    start() {
        if (this.platform === "acapp") {
            this.getinfo_acapp();
        }
        else {
            // this.refresh_jwt_token(); 服务器重启后，可先refresh accesss token
            if (this.root.access) {
                console.log("this.getinfo_web");

                this.getinfo_web();
                this.refresh_jwt_token();

            }
            else {
                console.log("this.login");
                this.login();

            }
            this.add_listening_events();
        }

    }

    refresh_jwt_token() {
        setInterval(() => {
            $.ajax({
                url: "https://app7342.acapp.acwing.com.cn/settings/token/refresh/",
                type: "post",
                data: {

                    refresh: this.root.refresh,
                },
                // headers: {
                //     'Authorization': "Bearer " + this.root.access,
                // },
                success: (resp) => {

                    this.root.access = resp.access;


                }
            });
        }, 4.5 * 60 * 1000);
    }

    add_listening_events() {
        this.add_listening_events_login();
        this.add_listening_events_register();

        this.$acwing_lgion.click(() => {
            this.acwing_login();
        });
    }
    add_listening_events_login() {
        let outer = this;
        this.$login_options.click(() => {
            outer.register();
        });
        this.$login_submit.click(() => {
            outer.login_on_remote();
        });
    }

    add_listening_events_register() {
        let outer = this;
        this.$register_options.click(() => {
            outer.login();
        });
        this.$register_submit.click(() => {
            outer.register_on_remote();
        });
    }

    acwing_login() {
        $.ajax({
            url: "https://app7342.acapp.acwing.com.cn/settings/acwing/web/apply_code/",
            type: "GET",
            success: function (resp) {
                if (resp.result === "success") {
                    window.location.replace(resp.apply_code_url);
                }
                else {
                    alert("获取登录链接失败");
                }
            }
        })
    }

    login_on_remote(username, password) {  //在远程服务器上登录
        username = username || this.$login_username.val();
        password = password || this.$login_password.val();
        this.$login_error_message.empty();

        let outer = this;
        $.ajax({
            url: "https://app7342.acapp.acwing.com.cn/settings/token/",
            type: "post",
            data: {

                username: username,
                password: password,
            },
            success: (resp) => {

                this.root.access = resp.access;
                this.root.refresh = resp.refresh;
                this.refresh_jwt_token();
                this.getinfo_web();

            },
            error: () => {
                this.$login_error_message.html("用户名或密码错误");
            }
        });
    }
    register_on_remote() {
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_message.empty();
        $.ajax({
            url: "https://app7342.acapp.acwing.com.cn/settings/register/",
            type: "post",
            data: {
                // username: username,
                // password: password,
                // password_confirm: password_confirm,
                username,
                password,
                password_confirm,
            },
            success: (resp) => {
                if (resp.result === "success") {
                    this.login_on_remote(username, password);
                } else {
                    outer.$register_error_message.html(resp.result);
                }
            }
        })
    }

    logout_on_remote() {
        if (this.platform === "acapp") {
            this.root.AcWingOs.api.window.close();
        }
        else {
            this.root.access = "";
            this.root.refresh = "";
            location.href = "/";
        }
    }

    acapp_login(appid, redirect_uri, scope, state) {
        let outer = this;
        this.root.AcWingOs.api.oauth2.authorize(appid, redirect_uri, scope, state, function (resp) {
            if (resp.result === "success") {
                outer.username = resp.username;
                outer.photo = resp.photo;
                outer.settings_hide();
                outer.root.menu.menu_show();
                outer.root.access = resp.access;
                outer.root.refresh = resp.refresh;
                outer.refresh_jwt_token();
            }
        });

    }
    getinfo_acapp() {
        let outer = this;
        $.ajax({
            url: "https://app7342.acapp.acwing.com.cn/settings/acwing/acapp/apply_code/",
            type: "GET",
            success: (resp) => {
                if (resp.result === "success") {
                    outer.acapp_login(resp.appid, resp.redirect_uri, resp.scope, resp.state);
                }
            }
        });
    }

    getinfo_web() {
        let outer = this;
        $.ajax({
            url: "https://app7342.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },

            headers: {
                'Authorization': "Bearer " + this.root.access,
            },

            success: (resp) => {

                if (resp.result === "success") {

                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.settings_hide();
                    outer.root.menu.menu_show();
                } else {
                    outer.login();
                }
            }
        });
    }

    settings_hide() {
        this.$settings.hide();
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
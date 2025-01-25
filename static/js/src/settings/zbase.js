class Settings {
    constructor(root) {

        this.root = root;
        this.platform = "web";
        if (this.root.AcWingOs) this.platform = "acapp";

        this.start();

    }

    start() {
        this.getinfo();
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
        /*if (this.platform === "acapp") {
            this.root.AcWingOs.login();
            return;
        }*/

        //this.$settings.show();
    }
    register() {
        // if (this.platform === "acapp") {
        //     this.root.AcWingOs.register();
        //     return;
        // }

        //this.$settings.show();
    }


}
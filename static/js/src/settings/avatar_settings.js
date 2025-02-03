class AvatarSettings {
    constructor(menu) {
        this.menu = menu;
        this.platform = "web";
        // if (this.root.AcWingOs) this.platform = "acapp";
        this.username = "";
        this.photo = "";
        this.$avatar_settings = $(`
            <div class="ac-game-avatar-settings">
                <div class="ac-game-avatar-settings-title">
                    修改头像
                </div>
                <div class="ac-game-avatar-settings-upload">
                    <div class="ac-game-avatar-settings-item">
                        <input type="file" accept="image/*" id="avatar-upload">
                    </div>
                </div>
                <div class="ac-game-avatar-settings-submit">
                    <div class="ac-game-avatar-settings-item">
                        <button>保存头像</button>
                    </div>
                </div>
                <div class="ac-game-avatar-settings-error-message">
                    
                </div>
            </div>
        `);

        this.$upload = this.$avatar_settings.find("#avatar-upload");
        this.$submit = this.$avatar_settings.find(".ac-game-avatar-settings-submit button");
        this.$error_message = this.$avatar_settings.find(".ac-game-avatar-settings-error-message");
        // this.$avatar_settings.hide();

        this.menu.$menu.append(this.$avatar_settings);
        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        this.$submit.click(() => {
            this.save_avatar();
        });
    }

    save_avatar() {
        let file = this.$upload[0].files[0];
        if (!file) {
            this.$error_message.html("请选择一个图片文件");
            return;
        }

        let formData = new FormData();
        formData.append("avatar", file);

        let outer = this;
        $.ajax({
            url: "https://app7342.acapp.acwing.com.cn/settings/save-avatar/", // 确保 URL 正确
            type: "post",
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'Authorization': "Bearer " + this.root.access,
            },
            success: (resp) => {
                if (resp.result === "success") {
                    outer.photo = resp.photo;
                    outer.$error_message.html("头像保存成功");
                    // 更新用户界面中的头像显示
                    outer.update_avatar_display(resp.photo);
                } else {
                    outer.$error_message.html(resp.result);
                }
            },
            error: () => {
                outer.$error_message.html("保存头像失败，请重试");
            }
        });
    }

    show() {
        this.$avatar_settings.show();
    }

    hide() {
        this.$avatar_settings.hide();
    }

    update_avatar_display(photo_url) {
        // 假设存在一个元素用于显示头像
        $("#avatar-display").attr("src", photo_url);
    }
}
class ChatField {
    constructor(playground) {
        this.playground = playground;

        this.$history = $(`<div class="chat-field-history">历史记录</div>`);
        this.$input = $(`<input type="text" class="chat-field-input">`);
        this.$history.hide();
        this.$input.hide();
        this.func_id = null;

        this.playground.$playground.append(this.$history);
        this.playground.$playground.append(this.$input);
        this.start();

    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        this.$input.keydown((e) => {
            if (e.which === 27) {
                this.input_hide();
            }
            if (e.which === 13) {
                let username = this.playground.root.settings.username;
                let text = this.$input.val();
                if (text) {
                    this.$input.val("");
                    this.add_message(username, text);
                    this.playground.mps.send_message(text);
                }
            }
        });
    }

    history_show() {
        this.$history.fadeIn();
        if (this.func_id) clearTimeout(this.func_id);
        this.func_id = setTimeout(() => {
            this.$history.fadeOut();
            this.func_id = null;
        }, 3000);
    }
    render_message(message) {
        return (`<div>${message}</div>`);
    }

    add_message(username, text) {
        this.history_show();
        let message = `[${username}] ${text}`;
        this.$history.append(this.render_message(message));
        this.$history.scrollTop(this.$history[0].scrollHeight);

    }

    input_show() {
        this.history_show();
        this.$input.show();
        this.$input.focus();
    }

    input_hide() {
        this.$input.hide();
        this.playground.game_map.$canvas.focus();
    }
}
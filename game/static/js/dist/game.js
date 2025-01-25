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
let AC_GAME_OBJECTS = [];

class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);
        this.has_called_start = false;
        this.timedelta = 0; // ms ,距离上一帧的时间间隔
    }

    start() {

    }

    update() {

    }

    on_destroy() {

    }
    destroy() {
        this.on_destroy();
        for (let i = 0; i < AC_GAME_OBJECTS.length; i++) {
            if (AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }

    }
}

let last_timestamp;
let AC_GAME_ANIMATION = function (timestamp) {
    for (let i = 0; i < AC_GAME_OBJECTS.length; i++) {
        let obj = AC_GAME_OBJECTS[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        }
        else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;


    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION);class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $('<canvas></canvas>');
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start() {

    }

    update() {
        this.render();
    }

    render() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}class Particle extends AcGameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.friction = 0.9;
        this.aps = 1;
    }

    start() {

    }

    update() {
        if (this.speed < this.aps || this.move_length < this.aps) {
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;
        this.render();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.vx = 0;
        this.vy = 0;
        this.damagex = 0;
        this.damagey = 0;
        this.damage_speed = 0;
        this.is_me = is_me;
        this.aps = 0.1;

        this.cur_skill = null;
        this.friction = 0.9;
        this.spent_time = 0;

        if (this.is_me === "me") {
            this.img = new Image();
            this.img.src = this.playground.root.settings.photo;

        }
    }

    start() {
        if (this.is_me === "me") {
            this.add_listening_events();
        }
        else if (this.is_me === "robot") {
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }
    }

    add_listening_events() {

        this.playground.game_map.$canvas.on("contextmenu", () => {
            return false;
        });
        this.playground.game_map.$canvas.on("mousedown", (e) => {
            const rect = this.ctx.canvas.getBoundingClientRect();
            if (e.which === 3) {
                this.move_to(e.clientX - rect.left, e.clientY - rect.top);

            }
            else if (e.which === 1) {
                if (this.cur_skill === "fireball") {
                    this.shoot_fireball(e.clientX - rect.left, e.clientY - rect.top);
                }

                this.cur_skill = null;
            }
        });

        $(window).keydown((e) => {
            if (e.which === 81) {
                this.cur_skill = "fireball";

            }
        });
    }

    shoot_fireball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height;
        let damage = this.playground.height * 0.015;

        new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, damage);
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }
    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    was_attacked(angle, damage) {
        this.radius -= damage;
        if (this.radius <= this.aps) {
            this.destroy();
            for (let i = 0; i < this.playground.players.length; i++) {
                let player = this.playground.players[i];
                if (player === this) {
                    this.playground.players.splice(i, 1);
                }
            }
            return false;
        }
        this.damagex = Math.cos(angle);
        this.damagey = Math.sin(angle);
        this.damage_speed = damage * 10;

        for (let i = 0; i < 10 * Math.random() * 5; i++) {
            let x = this.x, y = this.y;
            let radius = this.radius * Math.random() * 0.21;
            let angle = Math.random() * Math.PI * 2;
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 10;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);

        }

    }
    update() {
        this.spent_time += this.timedelta / 1000;
        if (this.spent_time > 5 && this.is_me === "robot") {
            if (Math.random() < 1 / 180.0) {
                let player = this.playground.players[0];
                this.shoot_fireball(player.x, player.y);
            }
        }


        if (this.damage_speed > this.aps * 10) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += 2 * this.damagex * this.damage_speed * this.timedelta / 1000;
            this.y += 2 * this.damagey * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        }
        else {
            if (this.move_length < this.aps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (this.is_me === "robot") {
                    let tx = Math.random() * this.playground.width;
                    let ty = Math.random() * this.playground.height;
                    this.move_to(tx, ty);
                }
            }
            else {
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }

        }
        this.render();

    }

    render() {
        if (this.is_me === "me") {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
            this.ctx.restore();
        }
        else if (this.is_me === "robot") {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();

        }
    }
}
class FireBall extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.aps = 0.1;
    }

    start() {

    }

    update() {
        if (this.move_length < this.aps || this.speed < this.aps) {
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;

        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if (this.player != player && this.is_collision(player)) {
                this.attack(player);
            }
        }

        this.render();
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);

        player.was_attacked(angle, this.damage);
        this.destroy();
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }
    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < this.radius + player.radius) {
            return true;
        }
        return false;
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();

    }
}class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
<div class="ac-game-playground">

</div>
`);
        this.playground_hide();

        this.start();
    }
    get_random_color() {
        let colors = ["blue", "red", "pink", "yellow", "green", "purple"];
        return colors[Math.floor(Math.random() * 6)];
    }

    start() {

    }


    playground_show() {
        this.$playground.show();
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, "me"))

        for (let i = 0; i < 5; i++) {
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, this.get_random_color(), this.height * 0.15, "robot"))
        }
    }
    playground_hide() {
        this.$playground.hide();
    }
}class Settings {
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



}export class AcGame {
    constructor(id, AcWingOs) {
        this.id = id;
        this.$ac_game = $('#' + id);
        this.AcWingOs = AcWingOs;

        this.settings = new Settings(this);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);

        this.start();
    }

    start() {

    }

}

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
let AC_GAME_OBJECTS = [];

class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);
        this.has_called_start = false;
        this.timedelta = 0; // ms ,距离上一帧的时间间隔
        this.uuid = this.create_uuid(); //创建每个对象的唯一id

    }

    create_uuid() {
        let res = "";
        for (let i = 0; i < 8; i++) {
            let x = parseInt(Math.floor(Math.random() * 10));
            res += x;
        }
        return res;

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

    resize() {
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    render() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}class NoticeBoard extends AcGameObject {
    constructor(playgound) {
        super();
        this.playground = playgound;
        this.ctx = this.playground.game_map.ctx;
        this.message = "鼠标右键 移动，按 q + 左键 攻击";



    }

    start() {

    }

    write_text(text) {
        this.text = text;
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.font = "20px serif";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`${this.message}`, this.playground.width / 2, 20);
        if (this.playground.players.length < 2) {
            this.ctx.fillText(`${"已就绪" + this.playground.players.length + "人 , 两人后开始游戏"}`, this.playground.width / 2, 40);
        }
        //this.ctx.fillText(`${this.playground.players.length}`, this.playground.width / 2, 60);


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
        this.aps = 1 / this.playground.scale;
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
        let scale = this.playground.scale;
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, is_me, username, photo) {

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
        this.username = username;
        this.photo = photo;
        this.aps = 0.01;

        this.cur_skill = null;
        this.friction = 0.9;
        this.spent_time = 0;
        this.fireballs = [];

        if (this.is_me !== "robot") {
            this.img = new Image();
            this.img.src = photo;

        }
    }

    start() {
        this.playground.player_count++;
        if (this.playground.players.length >= 2) {
            this.playground.state = "fighting";

        }

        if (this.is_me === "me") {
            this.add_listening_events();
        }
        else if (this.is_me === "robot") {
            let tx = Math.random() * this.playground.width / this.playground.scale;
            let ty = Math.random() * this.playground.height / this.playground.scale;
            this.move_to(tx, ty);
        }
    }

    add_listening_events() {


        this.playground.game_map.$canvas.on("contextmenu", () => {
            return false;
        });
        this.playground.game_map.$canvas.on("mousedown", (e) => {
            if (this.playground.mode === "multi_mode") {
                if (this.playground.state === "waiting") {
                    return false;
                }
            }
            const rect = this.ctx.canvas.getBoundingClientRect();
            if (e.which === 3) {
                let tx = (e.clientX - rect.left) / this.playground.scale;
                let ty = (e.clientY - rect.top) / this.playground.scale;
                this.move_to(tx, ty);
                if (this.playground.mode === "multi_mode") {
                    this.playground.mps.send_move_to(tx, ty);
                }
            }
            else if (e.which === 1) {
                let tx = (e.clientX - rect.left) / this.playground.scale;
                let ty = (e.clientY - rect.top) / this.playground.scale;
                if (this.cur_skill === "fireball") {

                    let fireball = this.shoot_fireball(tx, ty);
                    if (this.playground.mode === "multi_mode") {
                        this.playground.mps.send_shoot_fireball(tx, ty, fireball.uuid);
                    }
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
        let radius = this.playground.height * 0.01 / this.playground.scale;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5 / this.playground.scale;
        let move_length = this.playground.height / this.playground.scale;
        let damage = this.playground.height * 0.015 / this.playground.scale;

        let fireball = new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, damage);
        this.fireballs.push(fireball);
        return fireball;
    }
    destroy_fireball(uuid) {
        for (let i = 0; i < this.fireballs.length; i++) {
            let fireball = this.fireballs[i];
            if (fireball.uuid === uuid) {
                fireball.destroy();
                this.fireballs.splice(i, 1);
                break;
            }
        }
    }
    receive_attacked(x, y, angle, damage, ball_uuid, attacker) {
        this.x = x
        this.y = y
        this.was_attacked(angle, damage);
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

    update_move() {
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
                    let tx = Math.random() * this.playground.width / this.playground.scale;
                    let ty = Math.random() * this.playground.height / this.playground.scale;
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
    }
    update() {
        this.update_move();
        this.render();

    }

    render() {
        let scale = this.playground.scale;
        if (this.is_me !== "robot") {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, this.x * scale - this.radius * scale, this.y * scale - this.radius * scale, this.radius * scale * 2, this.radius * scale * 2);
            this.ctx.restore();
        }
        else if (this.is_me === "robot") {
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
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
        this.update_move();
        if (this.player.is_me !== "enemy") {
            this.update_attack();
        }

        this.render();
    }

    update_move() {

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }

    update_attack() {
        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if (this.player != player && this.is_collision(player)) {
                this.attack(player);
            }
        }

    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);

        player.was_attacked(angle, this.damage);

        if (this.playground.mode === "multi_mode") {
            this.playground.mps.send_attack(player.uuid, player.x, player.y, angle, this.damage, this.uuid);
        }
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
        let scale = this.playground.scale;
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();

    }
}class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;
        this.ws = new WebSocket("wss://app7342.acapp.acwing.com.cn/wss/multiplayer/");

        this.start();
    }

    start() {
        this.receive();
    }

    receive() {
        let outer = this;
        this.ws.onmessage = function (e) {
            let data = JSON.parse(e.data);
            let uuid = data.uuid;
            if (uuid === outer.uuid) return false;
            let event = data.event;
            if (event === "create_player") {
                outer.receive_create_player(uuid, data.username, data.photo);
            }
            else if (event === "move_to") {
                outer.receive_move_to(uuid, data.tx, data.ty);
            }
            else if (event === "shoot_fireball") {
                outer.receive_shoot_fireball(uuid, data.tx, data.ty, data.ball_uuid);
            }
            else if (event === "attack") {
                outer.receive_attack(uuid, data.attackee_uuid, data.x, data.y, data.angle, data.damage, data.ball_uuid);
            }
        };
    }

    send_create_player(username, photo) {
        let outer = this;

        this.ws.send(JSON.stringify({
            'event': 'create_player',
            'uuid': outer.uuid,
            'username': username,
            'photo': photo,
        }));
    }
    receive_create_player(uuid, username, photo) {
        let player = new Player(
            this.playground,
            this.playground.width / 2 / this.playground.scale,
            0.5,
            0.05,
            "white",
            0.15,
            "enemy",
            username,
            photo
        );
        player.uuid = uuid;
        this.playground.players.push(player);

    }

    send_move_to(tx, ty) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': 'move_to',
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    get_palyer(uuid) {
        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if (player.uuid === uuid) {
                return player;
            }
        }
        return false;
    }
    receive_move_to(uuid, tx, ty) {
        let player = this.get_palyer(uuid);
        if (player) {
            player.move_to(tx, ty);
        }
    }

    send_shoot_fireball(tx, ty, ball_uuid) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': 'shoot_fireball',
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_shoot_fireball(uuid, tx, ty, ball_uuid) {
        let player = this.get_palyer(uuid);
        if (player) {
            let fireball = player.shoot_fireball(tx, ty);
            fireball.uuid = ball_uuid;
        }
    }

    send_attack(attackee_uuid, x, y, angle, damage, ball_uuid) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': 'attack',
            'uuid': outer.uuid,
            'attackee_uuid': attackee_uuid,
            'x': x,
            'y': y,
            'angle': angle,
            'damage': damage,
            'ball_uuid': ball_uuid,
        }));

    }

    receive_attack(uuid, attackee_uuid, x, y, angle, damage, ball_uuid) {
        let attacker = this.get_palyer(uuid);
        let attackee = this.get_palyer(attackee_uuid);
        if (attacker && attackee) {
            attackee.receive_attacked(x, y, angle, damage, ball_uuid, attacker);
        }
    }


}class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
<div class="ac-game-playground">

</div>
`);
        this.playground_hide();
        this.root.$ac_game.append(this.$playground);

        this.start();
    }

    resize() {

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;
        if (this.game_map) this.game_map.resize();
    }
    get_random_color() {
        let colors = ["blue", "red", "pink", "yellow", "green", "purple"];
        return colors[Math.floor(Math.random() * 6)];
    }

    start() {
        let outer = this;
        $(window).resize(function () {
            outer.resize();
        });

    }


    playground_show(mode) {

        this.$playground.show();


        this.game_map = new GameMap(this);
        this.resize();
        this.mode = mode;
        this.state = "waiting";
        this.player_count = 0;
        this.players = [];
        this.players.push(new Player(this, this.width / 2 / this.scale, this.height / 2 / this.scale, this.height * 0.05 / this.scale, "white", this.height * 0.15 / this.scale, "me", this.root.settings.username, this.root.settings.photo))

        if (mode === "single_mode") {
            for (let i = 0; i < 5; i++) {
                this.players.push(new Player(this, this.width / 2 / this.scale, this.height / 2 / this.scale, this.height * 0.05 / this.scale, this.get_random_color(), this.height * 0.15 / this.scale, "robot"))
            }
        }
        else if (mode === "multi_mode") {
            let outer = this;
            this.mps = new MultiPlayerSocket(this)
            this.mps.uuid = this.players[0].uuid;  // 创建链接的窗口player的uuid
            this.mps.ws.onopen = () => {
                outer.mps.send_create_player(this.root.settings.username, this.root.settings.photo);

            };
            this.notice_board = new NoticeBoard(this);
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
            this.getinfo_web();
            this.add_listening_events();
        }

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

    login_on_remote() {  //在远程服务器上登录
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_message.empty();

        let outer = this;
        $.ajax({
            url: "https://app7342.acapp.acwing.com.cn/settings/signin/",
            type: "GET",
            data: {

                username: username,
                password: password,
            },
            success: (resp) => {

                if (resp.result === "success") {
                    location.reload();
                }
                else {
                    outer.$login_error_message.html();
                }
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
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: (resp) => {
                if (resp.result === "success") {
                    location.reload();
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
            $.ajax({
                url: "https://app7342.acapp.acwing.com.cn/settings/signout/",
                type: "GET",
                success: (resp) => {
                    if (resp.result === "success") {
                        location.reload();
                    }
                }
            });
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

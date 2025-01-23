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
            if (e.which === 3) {
                this.move_to(e.clientX, e.clientY);

            }
            else if (e.which === 1) {
                if (this.cur_skill === "fireball") {
                    this.shoot_fireball(e.clientX, e.clientY);
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
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();

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
        //this.playground_hide();
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, "me"))

        for (let i = 0; i < 5; i++) {
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, this.get_random_color(), this.height * 0.15, "robot"))
        }
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
    }
    playground_hide() {
        this.$playground.hide();
    }
}export default class AcGame {
    constructor(id) {
        this.id = id;
        this.$ac_game = $('#' + id);
        // this.menu = new AcGameMenu(this);
        //this.settings = new AcGameSettings(this);
        this.playground = new AcGamePlayground(this);

        this.start();
    }

    start() {

    }

}

class Player extends AcGameObject {
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

class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;
        this.ws = new WebSocket("wss://app7342.acapp.acwing.com.cn/wss/multiplayer/?token=" + playground.root.access);

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
            else if (event === "send_message") {
                outer.receive_message(uuid, data.text);
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

    get_player(uuid) {
        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if (player.uuid === uuid) {
                return player;
            }
        }
        return false;
    }
    receive_move_to(uuid, tx, ty) {
        let player = this.get_player(uuid);
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
        let player = this.get_player(uuid);
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
        let attacker = this.get_player(uuid);
        let attackee = this.get_player(attackee_uuid);
        if (attacker && attackee) {
            attackee.receive_attacked(x, y, angle, damage, ball_uuid, attacker);
        }
    }

    send_message(text) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': 'send_message',
            'uuid': outer.uuid,
            'text': text,
        }));
    }

    receive_message(uuid, text) {
        let username = this.get_player(uuid).username;
        // console.log("receive_message", username, text);
        this.playground.chat_field.add_message(username, text);
    }


}
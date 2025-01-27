class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;
        this.ws = new WebSocket("wss://app7342.acapp.acwing.com.cn/wss/multiplayer/");

        this.start();
    }

    start() {

    }
}
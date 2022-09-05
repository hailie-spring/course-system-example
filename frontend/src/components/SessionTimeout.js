const events = [
    "load",
    "mousemove",
    "mousedown",
    "click",
    "scroll",
    "keypress",
];

class SessionTimeout {
    constructor({ emptyToken, token }) {
        this.emptyToken = emptyToken;
        this.token = token;
        this.eventHandler = this.setLastActiveTime.bind(this);
        this.tracker();
        this.startInterval();
    }

    setLastActiveTime() {
        this.lastActiveTime = new Date();
    }

    startInterval() {
        this.intervalId = setInterval(() => {
            if ((new Date() - this.lastActiveTime > 3600000) ) {
                this.cleanUp();
                localStorage.clear();
                this.emptyToken();
            }
        }, 60000);
    }

    tracker() {
        Object.values(events).forEach((item) => {
            window.addEventListener(item, this.eventHandler);
        });
    }

    cleanUp() {
        Object.values(events).forEach((item) => {
            window.removeEventListener(item, this.eventHandler);
        });
        clearInterval(this.intervalId);
    }
}
export default SessionTimeout;
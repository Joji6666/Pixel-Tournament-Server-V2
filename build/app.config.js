"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = __importDefault(require("@colyseus/tools"));
const monitor_1 = require("@colyseus/monitor");
const playground_1 = require("@colyseus/playground");
/**
 * Import your Room files
 */
const MyRoom_1 = require("./rooms/MyRoom");
exports.default = (0, tools_1.default)({
    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define("my_room", MyRoom_1.MyRoom);
    },
    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         * Read more: https://expressjs.com/en/starter/basic-routing.html
         */
        app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*"); // 모든 도메인에서 접근을 허용하도록 설정 (보안상 문제가 있을 수 있으므로 실제 운영 환경에서는 조심히 설정)
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Expose-Headers", "Custom-Header");
            next();
        });
        app.get("/hello_world", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });
        /**
         * Use @colyseus/playground
         * (It is not recommended to expose this route in a production environment)
         */
        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground_1.playground);
        }
        /**
         * Use @colyseus/monitor
         * It is recommended to protect this route with a password
         * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
         */
        app.use("/colyseus", (0, monitor_1.monitor)());
    },
    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    },
});

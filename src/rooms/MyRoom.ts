import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 6;

  onCreate(options: any) {
    this.setState(new MyRoomState());
    console.log("room create");

    this.onMessage("input", (client, input) => {
      // get reference to the player who sent the message
      const player = this.state.players.get(client.sessionId);
      const velocity = 2;
      const idleValue = 0;

      if (input.shiftDown && !input.shiftUp) {
        player.isRunOn = true;
      }

      if (!input.shiftDown && input.shiftUp) {
        player.isRunOn = false;
      }

      if (input.leftUp) {
        player.x -= idleValue;
        player.moveState = "left_idle";
      }

      if (input.rightUp) {
        player.x -= idleValue;
        player.moveState = "right_idle";
      }

      if (input.upUp) {
        player.y -= idleValue;
        player.moveState = "back_idle";
      }

      if (input.downUp) {
        player.y -= idleValue;
        player.moveState = "front_idle";
      }

      if (input.collider) {
        if (input.left && input.up) {
          if (input.colliderSide === "right") {
            player.x -= 0;
            player.y -= velocity;
          }
          if (input.colliderSide === "front") {
            player.x -= 0;
            player.y -= velocity;
          } else {
            player.x -= velocity;
            player.y -= 0;
          }
        }
        if (input.right && input.up) {
          if (input.colliderSide === "left") {
            player.x += 0;
            player.y -= velocity;
          }
          if (input.colliderSide === "front") {
            player.x += 0;
            player.y -= velocity;
          } else {
            player.x += velocity;
            player.y -= 0;
          }
        }
        if (input.left && input.down) {
          if (input.colliderSide === "right") {
            player.x -= 0;
            player.y += velocity;
          }
          if (input.colliderSide === "back") {
            player.x -= 0;
            player.y += velocity;
          } else {
            player.x -= velocity;
            player.y -= 0;
          }
        }
        if (input.right && input.down) {
          if (input.colliderSide === "left") {
            player.x += 0;
            player.y += velocity;
          }
          if (input.colliderSide === "back") {
            player.x -= 0;
            player.y += velocity;
          } else {
            player.x += velocity;
            player.y -= 0;
          }
        }

        if (input.left && !input.up && !input.down) {
          if (input.beforePlayerMoveState !== ("left_move" || "left_idle")) {
            console.log(input.beforePlayerMoveState);
            console.log(input);
            player.x -= velocity;
          }
        }
        if (input.right && !input.up && !input.down) {
          if (input.beforePlayerMoveState !== ("right_move" || "right_idle")) {
            player.x += velocity;
          }
        }
        if (input.up && !input.left && !input.right) {
          if (input.beforePlayerMoveState !== ("back_move" || "back_idle")) {
            player.y -= velocity;
          }

          if (
            input.colliderSide === ("left" || "right") &&
            input.colliderDoneSide !== "back"
          ) {
            player.y -= velocity;
          }
        }
        if (input.down && !input.left && !input.right) {
          if (input.beforePlayerMoveState !== ("front_move" || "front_idle")) {
            player.y += velocity;
          }

          if (
            input.colliderSide === ("left" || "right") &&
            input.colliderDoneSide !== "front"
          ) {
            player.y += velocity;
          }
        }
      }

      if (input.left) {
        if (player.isRunOn) {
          player.x -= velocity + 2;
        } else {
          if (!input.collider) {
            console.log(input.collider);
            console.log("work??");
            player.x -= velocity;
          }
        }

        player.moveState = "left_walk";
      }
      if (input.right) {
        if (player.isRunOn) {
          player.x += velocity + 2;
        } else {
          if (!input.collider) {
            player.x += velocity;
          }
        }

        player.moveState = "right_walk";
      }

      if (input.up) {
        if (player.isRunOn) {
          player.y -= velocity + 2;
        } else {
          if (!input.collider) {
            player.y -= velocity;
          }
        }

        player.moveState = "back_walk";
      }
      if (input.down) {
        if (player.isRunOn) {
          player.y += velocity + 2;
        } else {
          if (!input.collider) {
            player.y += velocity;
          }
        }

        player.moveState = "front_walk";
      }
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    console.log(client.sessionId, "joined!");

    const mapWidth = 800;
    const mapHeight = 600;

    // create Player instance
    const player = new Player();

    // place Player at a random position
    player.x = Math.random() * mapWidth;
    player.y = Math.random() * mapHeight;

    // place player in the map of players by its sessionId
    // (client.sessionId is unique per connection!)
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}

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
          }

          if (
            input.colliderSide !== "right" &&
            input.colliderSide !== "front"
          ) {
            console.log("left up work");
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
          }

          if (input.colliderSide !== "left" && input.colliderSide !== "front") {
            console.log("right up work");
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
          }

          if (input.colliderSide !== "right" && input.colliderSide !== "back") {
            console.log(input.colliderSide, "diagonal left work3");
            console.log("diagonal left work");
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
          }

          if (input.colliderSide !== "left" && input.colliderSide !== "back") {
            console.log("diagonal right work3");
            player.x += velocity;
            player.y -= 0;
          }
        }

        if (input.left && !input.up && !input.down) {
          if (input.colliderSide !== "right") {
            console.log("solo right work");
            player.x -= velocity;
          }
        }
        if (input.right && !input.up && !input.down) {
          if (input.colliderSide !== "left") {
            console.log("solo left work");
            player.x += velocity;
          }
        }
        if (input.up && !input.left && !input.right) {
          if (input.colliderSide !== "back") {
            player.y -= velocity;
          }
        }
        if (input.down && !input.left && !input.right) {
          if (input.colliderSide !== "front") {
            player.y += velocity;
          }
        }
      }

      if (!input.collider) {
        console.log(input.collider, "no collider work");
        if (input.left) {
          if (player.isRunOn) {
            console.log("is run ok?");
            player.x -= velocity + 2;
          } else {
            if (!input.collider) {
              console.log("solo work");
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
              console.log("solo work");
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
      }

      if (input.playerX !== player.x) {
        player.x = input.playerX;
      }

      if (input.playerY !== player.y) {
        player.y = input.playerY;
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

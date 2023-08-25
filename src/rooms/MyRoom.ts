import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate(options: any) {
    this.setState(new MyRoomState());
    console.log("room create");
    this.onMessage("input", (client, input) => {
      // get reference to the player who sent the message
      const player = this.state.players.get(client.sessionId);
      const velocity = 2;
      const idleValue = 0;

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

      if (input.left) {
        player.x -= velocity;
        player.moveState = "left_walk";
      } else if (input.right) {
        player.x += velocity;
        player.moveState = "right_walk";
      }

      if (input.up) {
        player.y -= velocity;
        player.moveState = "back_walk";
      } else if (input.down) {
        player.y += velocity;
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

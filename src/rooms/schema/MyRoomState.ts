import { Schema, Context, type, MapSchema } from "@colyseus/schema";

export class Player extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  @type("string") moveState: string;
  @type("boolean") isRunOn: boolean;
  @type("string") playerStatusWeapon: string;
  @type("boolean") playerStatusWeaponIsDraw: boolean;
  @type("boolean") playerStatusWeaponIsAttack: boolean;
}

export class MyRoomState extends Schema {
  @type("string") mySynchronizedProperty: string = "Hello world";

  @type({ map: Player }) players = new MapSchema<Player>();
}

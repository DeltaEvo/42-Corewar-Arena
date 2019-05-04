import { Scene, AmbientLight, Color } from "three";

import Memory from "./Memory";

export default class Arena extends Scene {
  constructor() {
    super();

    this.add((this.memory = new Memory(4096)));
    this.add(new AmbientLight());

    this.background = new Color(0x404040);
  }
}

export default new Map([
  [
    0x01,
    {
      name: "live",
      cycles: 10,
      animation: "ring_white"
    }
  ],
  [
    0x02,
    {
      name: "ld",
      cycles: 5,
      animation: "ring_red"
    }
  ],
  [
    0x03,
    {
      name: "st",
      cycles: 5,
      animation: "ring_yellow"
    }
  ],
  [
    0x04,
    {
      name: "add",
      cycles: 10,
      animation: "ring_blue"
    }
  ],
  [
    0x05,
    {
      name: "sub",
      cycles: 10,
      animation: "ring_blue"
    }
  ],
  [
    0x06,
    {
      name: "and",
      cycles: 6,
      animation: "ring_green"
    }
  ],
  [
    0x07,
    {
      name: "or",
      cycles: 6,
      animation: "ring_green"
    }
  ],
  [
    0x08,
    {
      name: "xor",
      cycles: 6,
      animation: "ring_green"
    }
  ],
  [
    0x09,
    {
      name: "zjmp",
      cycles: 20
    }
  ],
  [
    0x0a,
    {
      name: "ldi",
      animation: "ring_red",
      cycles: 25
    }
  ],
  [
    0x0b,
    {
      name: "sti",
      cycles: 25,
      animation: "ring_yellow"
    }
  ],
  [
    0x0c,
    {
      name: "fork",
      cycles: 800
    }
  ],
  [
    0x0d,
    {
      name: "lld",
      animation: "ring_red",
      cycles: 10
    }
  ],
  [
    0x0e,
    {
      name: "lldi",
      animation: "ring_red",
      cycles: 50
    }
  ],
  [
    0x0f,
    {
      name: "lfork",
      cycles: 1000
    }
  ],
  [
    0x10,
    {
      name: "aff",
      cycles: 2
    }
  ]
]);

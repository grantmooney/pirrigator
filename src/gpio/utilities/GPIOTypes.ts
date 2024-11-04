import { Direction, Edge, Options } from "onoff";

export enum GPIOEnum {
  GPIO_4 = 4, //Pin 7
  GPIO_17 = 17, //Pin 11
  GPIO_27 = 27, //Pin 13
  GPIO_22 = 22, //Pin 15
  GPIO_5 = 5, //Pin 29
  GPIO_6 = 6, //Pin 31
  GPIO_13 = 13, //Pin 33
  GPIO_19 = 19, //Pin 35
  GPIO_26 = 26, //Pin 37
  GPIO_23 = 23, //Pin 16
  GPIO_24 = 24, //Pin 18
  GPIO_25 = 25, //Pin 22
  GPIO_12 = 12, //Pin 32
  GPIO_16 = 16, //Pin 36
  GPIO_20 = 20, //Pin 38
  GPIO_21 = 21, //Pin 40
}

export interface IGPIODefinition {
  pin: GPIOEnum;
  direction: Direction;
  edge?: Edge;
  options?: Options;
  description: string;
}

export interface IGPIODefinitions {
  LED1: IGPIODefinition;
  [key: string]: IGPIODefinition;
}

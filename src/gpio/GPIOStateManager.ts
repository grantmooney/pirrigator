import { Gpio } from "onoff"; //include onoff to interact with the GPIO
import { IS_LINUX } from "./utilities/Flags";
import { IGPIODefinitions } from "./utilities/GPIOTypes";

class GPIOStateManager {
  private gpios: Record<keyof IGPIODefinitions, Gpio>;
  private gpioDefinitions: IGPIODefinitions;

  constructor(gpioDefinitions: IGPIODefinitions) {
    this.gpioDefinitions = gpioDefinitions;

    if (!IS_LINUX) {
      this.gpios = {} as Record<keyof IGPIODefinitions, Gpio>;
      return;
    }

    // Map gpios from definitions
    this.gpios = Object.keys(this.gpioDefinitions).reduce(
      (acc, curr) => {
        const GPIODefinition = this.gpioDefinitions[curr];
        acc[curr] = new Gpio(
          GPIODefinition.pin,
          GPIODefinition.direction,
          GPIODefinition.edge,
          GPIODefinition.options,
        );
        return acc;
      },
      {} as Record<keyof IGPIODefinitions, Gpio>,
    );

    process.on("SIGINT", this.unexportOnClose); //function to run when user closes using ctrl+c
  }

  get count() {
    return Object.keys(this.gpios).length;
  }

  toggleGPIOState(gpioKey: keyof IGPIODefinitions) {
    if (!IS_LINUX) {
      console.log("Simulating GPIO toggle for key:", gpioKey);
      return;
    }

    if (!this.gpios[gpioKey]) {
      throw Error("GPIO Key does not exist");
    }

    if (this.gpios[gpioKey] && this.gpios[gpioKey].direction() === "out")
      if (this.gpios[gpioKey].readSync() === 0) {
        //function to start blinking  // const blinkInterval = setInterval(toggleLED, 250); //run the blinkLED function every 250ms

        //check the pin state, if the state is 0 (or off)
        this.gpios[gpioKey].writeSync(1); //set pin state to 1 (turn LED on)
      } else {
        this.gpios[gpioKey].writeSync(0); //set pin state to 0 (turn LED off)
      }
  }

  unexportOnClose() {
    if (!IS_LINUX) {
      console.log("Simulating GPIO unexportOnClose");
      return;
    }

    Object.values(this.gpios).forEach((gpio) => {
      // TODO: Also check for hard coded type/metadata
      if (gpio.direction() === "out") {
        gpio.writeSync(0); // Turn LED off
      }
      gpio.unexport(); // Unexport GPIO to free resources
    });
  }
}

export { GPIOStateManager };

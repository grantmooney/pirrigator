// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { GPIOStateManager } from "./gpio/GPIOStateManager";
import { GPIOEnum, IGPIODefinitions } from "./gpio/utilities/GPIOTypes";

const GPIODefinitions: IGPIODefinitions = {
  LED1: {
    pin: GPIOEnum.GPIO_4,
    direction: "out",
    description: "LED 1",
  },
};
const gpioStateManager = new GPIOStateManager(GPIODefinitions);

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/gpio/:pin/toggle", (req: Request, res: Response) => {
  try {
    console.log(req.params.pin);
    gpioStateManager.toggleGPIOState(req.params.pin);
    res.send("Toggling GPIO State for: " + req.params.pin);
  } catch (err) {
    console.error(err);
    const message = err instanceof Error && err.message ? err.message : "help";
    res.send("Exception thrown attempting to toggle: " + message);
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

function handleApplicationExit(code: number) {
  // function to run when exiting program
  console.log("Exiting with code:", code);
}

process.on("exit", (code) => {
  handleApplicationExit(code);
});
process.on("SIGINT", handleApplicationExit); // Triggered by user

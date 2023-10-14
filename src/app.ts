import express from "express";
import cors from "cors";
import { routeType } from "./interface/route-type";
import { corsOptions } from "./cors-config/corsOptions";

export class App {
  public app: express.Application = express();

  constructor({ path, route }: routeType) {
    this.middlewares();
    this.initializeRoutes({ path, route });
  }

  private middlewares() {
    this.app.use(express.json());
    this.app.use(cors(corsOptions));
  }

  private initializeRoutes({ path, route }: routeType) {
    this.app.use(path, route);
  }

  public listen(port: number, msg: string) {
    this.app.listen(port, () => console.log(msg));
  }
}

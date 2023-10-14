import { App } from "./app";
import { Route } from "./routes";

const port = 3030;
const url = `http://localhost:${port}`;
const msg = `App running at url-port: ${url}`;

const app = new App(new Route());

app.listen(port, msg);

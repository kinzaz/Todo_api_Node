import {Response,Router} from "express";
import {injectable} from "inversify";
import "reflect-metadata";
import {Logger} from "tslog";
import {ILogger} from "../logger/logger.interface";
import {IRoute} from "./route.interface";

@injectable()
export abstract class BaseController {
  private readonly _router: Router;

  constructor(private logger: ILogger<Logger<any>>) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public created(res: Response) {
    return res.sendStatus(201);
  }

  public send<T>(res: Response, code: number, message: T) {
    res.type("application/json");
    return res.status(code).json(message);
  }

  public ok<T>(res: Response, message: T) {
    this.send<T>(res, 200, message);
  }

  protected bindRoutes(routes: IRoute[]) {
    for (const route of routes) {
      this.logger.log(`${route.method} => ${route.path}`);
      const middleware = route.middlewares?.map(m => m.execute.bind(m))
      const handler = route.func.bind(this);
      const pipeline = middleware ? [...middleware, handler] : handler
      this.router[route.method](route.path, pipeline);
    }
  }
}

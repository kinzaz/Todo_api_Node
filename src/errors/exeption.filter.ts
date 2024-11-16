import {NextFunction,Request,Response} from "express";
import {inject,injectable} from "inversify";
import "reflect-metadata";
import {Logger} from "tslog";
import {ILogger} from "../logger/logger.interface";
import {TYPES} from "../types";
import {IExeptionFilter} from "./exeption.filter.interface";
import {HttpError} from "./http.error";

@injectable()
export class ExeptionFilter implements IExeptionFilter {
  constructor(@inject(TYPES.ILogger) private logger: ILogger<Logger<any>>) {}

  catch(
    err: Error | HttpError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (err instanceof HttpError) {
      this.logger.error(
        `${err.context} Ошибка: ${err.statusCode}: ${err.message}`
      );
      res.status(err.statusCode).send({ err: err.message });
    } else {
      this.logger.error(`${err.message}`);
      res.status(500).send({ err: err.message });
    }
  }
}

import { NextFunction, Request, Response, Router } from 'express';
import { IMiddleware } from './middleware.interface';

export interface IRoute<T = any, U = any, B = any> {
	path: string;
	func: (req: Request<T, U, B>, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	middlewares?: IMiddleware[];
}

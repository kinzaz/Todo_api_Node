import { NextFunction, Request, Response } from 'express';
import { TaskUpdateDto } from './dto/task-update.dto';

export interface ITaskController {
	create: (req: Request, res: Response, next: NextFunction) => void;
	delete: (req: Request, res: Response, next: NextFunction) => void;
	getTask: (req: Request, res: Response, next: NextFunction) => void;
	update: (req: Request<any, any, any>, res: Response, next: NextFunction) => void;
	getAll: (req: Request<{ id: string }, {}, TaskUpdateDto>, res: Response, next: NextFunction) => void;
}

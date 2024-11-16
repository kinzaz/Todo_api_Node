import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Logger } from 'tslog';
import { BaseController } from '../common/base.controller';
import { ValidateMiddleware } from '../common/validate.middleware';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { TaskCreateDto } from './dto/task-create.dto';
import { ITaskController } from './task.controller.interface';
import { ITaskService } from './task.service.interface';

@injectable()
export class TaskController extends BaseController implements ITaskController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger<Logger<any>>,
		@inject(TYPES.TaskService) private taskService: ITaskService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/',
				method: 'post',
				func: this.create,
				middlewares: [new ValidateMiddleware(TaskCreateDto)],
			},
		]);
	}

	async create({ body }: Request<{}, {}, TaskCreateDto>, res: Response, next: NextFunction) {
		const createdTask = await this.taskService.createTask(body);

		this.ok(res, {
			...createdTask,
			// TODO Create a middleware for converting
			id: Number(createdTask.id),
		});
	}
}

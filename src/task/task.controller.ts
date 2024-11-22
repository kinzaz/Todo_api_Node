import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Logger } from 'tslog';
import { BaseController } from '../common/base.controller';
import { ValidateMiddleware } from '../common/validate.middleware';
import { HttpError } from '../errors/http.error';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { TaskCreateDto } from './dto/task-create.dto';
import { TaskUpdateDto } from './dto/task-update.dto';
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
			{
				path: '/:id',
				method: 'delete',
				func: this.delete,
			},
			{
				path: '/:id',
				method: 'get',
				func: this.getTask,
			},
			{
				path: '/:id',
				method: 'patch',
				func: this.update,
			},
			{
				path: '/',
				method: 'get',
				func: this.getAll,
			},
		]);
	}

	async create({ body }: Request<{}, {}, TaskCreateDto>, res: Response, next: NextFunction) {
		try {
			const createdTask = await this.taskService.createTask(body);

			this.ok(res, {
				...createdTask,
				// TODO Create a middleware for converting
				id: Number(createdTask.id),
			});
		} catch (error) {
			this.send(res, 400, error);
		}
	}

	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const taskId = Number(req.params.id);
			if (isNaN(taskId) || taskId <= 0) {
				throw new HttpError(400, 'ID задачи должен быть положительным числом', '[TaskController]');
			}
			const task = await this.taskService.getTask(Number(taskId));
			if (task === null) {
				throw new HttpError(400, 'Задача отсутствует', '[TaskController]');
			}

			const deletedTask = await this.taskService.deleteTask(taskId);
			this.ok(res, {
				id: Number(deletedTask.id),
			});
		} catch (error) {
			if (error instanceof HttpError) {
				this.send(res, error.statusCode, { message: error.message });
			} else {
				console.error('Unexpected error:', error);
				this.send(res, 500, { message: 'Внутренняя ошибка сервера' });
			}
		}
	}

	async getTask(req: Request, res: Response, next: NextFunction) {
		try {
			const taskId = Number(req.params.id);

			if (isNaN(taskId) || taskId <= 0) {
				throw new HttpError(400, 'ID задачи должен быть положительным числом', '[TaskController]');
			}
			const task = await this.taskService.getTask(Number(taskId));
			if (task === null) {
				throw new HttpError(400, 'Задача отсутствует', '[TaskController]');
			}

			this.ok(res, {
				...task,
				// TODO Create a middleware for converting
				id: Number(task.id),
			});
		} catch (error) {
			if (error instanceof HttpError) {
				this.send(res, error.statusCode, { message: error.message });
			} else {
				console.error('Unexpected error:', error);
				this.send(res, 500, { message: 'Внутренняя ошибка сервера' });
			}
		}
	}

	async update(req: Request<{ id: string }, {}, TaskUpdateDto>, res: Response, next: NextFunction) {
		try {
			const taskId = Number(req.params.id);
			const task = await this.taskService.getTask(Number(taskId));
			if (task === null) {
				throw new HttpError(400, 'Задача отсутствует', '[TaskController]');
			}

			const updatedTask = await this.taskService.updateTask(taskId, req.body);
			if (!updatedTask) {
				throw new HttpError(500, 'Не удалось обновить задачу', '[TaskController]');
			}

			this.ok(res, {
				...updatedTask,
				id: Number(task.id),
			});
		} catch (error) {
			next(error);
		}
	}

	async getAll(_: Request, res: Response, next: NextFunction) {
		try {
			const tasks = await this.taskService.getAll();
			if (!tasks) {
				throw new HttpError(500, 'Не удалось получить список задач', '[TaskController]');
			}

			const tasksWithStringIds = tasks.map((task) => ({
				...task,
				id: task.id.toString(),
			}));

			this.ok(res, tasksWithStringIds);
		} catch (error) {
			next(error);
		}
	}
}

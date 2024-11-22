import { TaskModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IConfigService } from '../config/config.service.interface';
import { HttpError } from '../errors/http.error';
import { TYPES } from '../types';
import { TaskCreateDto } from './dto/task-create.dto';
import { TaskUpdateDto } from './dto/task-update.dto';
import { Task } from './task.entity';
import { ITaskRepository } from './task.repository.interface';
import { ITaskService } from './task.service.interface';

@injectable()
export class TaskService implements ITaskService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.TaskRepository) private taskRepository: ITaskRepository,
	) {}
	async createTask({ description, title }: TaskCreateDto): Promise<TaskModel> {
		const task = new Task(title, description);
		return this.taskRepository.create(task);
	}

	async deleteTask(id: number): Promise<TaskModel> {
		return this.taskRepository.delete(id);
	}

	async getTask(id: number): Promise<TaskModel | null> {
		const task = await this.taskRepository.get(id);
		if (task && task.deletedAt) {
			throw new HttpError(404, 'Задача была удалена');
		}
		return task;
	}

	async updateTask(taskId: number, task: TaskUpdateDto): Promise<TaskModel | null> {
		return await this.taskRepository.update(taskId, task);
	}

	async getAll() {
		return await this.taskRepository.getAll();
	}
}

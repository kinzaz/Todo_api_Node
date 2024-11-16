import { TaskModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { TaskCreateDto } from './dto/task-create.dto';
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
}

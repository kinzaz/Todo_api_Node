import { TaskModel } from '@prisma/client';
import { TaskCreateDto } from './dto/task-create.dto';
import { TaskUpdateDto } from './dto/task-update.dto';

export interface ITaskService {
	createTask: (task: TaskCreateDto) => Promise<TaskModel>;
	deleteTask: (id: number) => Promise<TaskModel>;
	getTask: (id: number) => Promise<TaskModel | null>;
	updateTask: (taskId: number, task: TaskUpdateDto) => Promise<TaskModel | null>;
	getAll: () => Promise<TaskModel[] | null>;
}

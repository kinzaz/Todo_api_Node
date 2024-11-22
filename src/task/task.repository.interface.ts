import { TaskModel } from '@prisma/client';
import { TaskUpdateDto } from './dto/task-update.dto';
import { Task } from './task.entity';

export interface ITaskRepository {
	create: (task: Task) => Promise<TaskModel>;
	delete: (id: number) => Promise<TaskModel>;
	get: (id: number) => Promise<TaskModel | null>;
	update: (taskId: number, task: TaskUpdateDto) => Promise<TaskModel | null>;
	getAll: () => Promise<TaskModel[] | null>;
}

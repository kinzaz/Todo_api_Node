import { TaskModel } from '@prisma/client';
import { Task } from './task.entity';

export interface ITaskRepository {
	create: (task: Task) => Promise<TaskModel>;
}

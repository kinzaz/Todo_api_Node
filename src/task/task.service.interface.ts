import { TaskModel } from '@prisma/client';
import { TaskCreateDto } from './dto/task-create.dto';

export interface ITaskService {
	createTask: (dto: TaskCreateDto) => Promise<TaskModel>;
	deleteTask: (id: number) => Promise<TaskModel>;
}

import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { Task } from './task.entity';
import { ITaskRepository } from './task.repository.interface';

@injectable()
export class TaskRepository implements ITaskRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async create({ description, title }: Task) {
		return this.prismaService.client.taskModel.create({
			data: {
				title,
				description,
			},
		});
	}

	async delete(id: number) {
		return this.prismaService.client.taskModel.delete({
			where: {
				id,
			},
		});
	}

	async get(id: number) {
		return this.prismaService.client.taskModel.findFirst({
			where: {
				id,
				deletedAt: null,
			},
		});
	}
}

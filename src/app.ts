import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Logger } from 'tslog';
import { PrismaService } from './database/prisma.service';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { ILogger } from './logger/logger.interface';
import { TaskController } from './task/task.controller';
import { TYPES } from './types';

@injectable()
export class App {
	app: Express;
	port: number;
	server?: Server;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger<Logger<any>>,
		@inject(TYPES.TaskController) private taskController: TaskController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8081;
	}

	useMiddleware() {
		this.app.use(express.json());
	}

	useRoutes() {
		this.app.use('/task', this.taskController.router);
	}

	useExeptionFilters() {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init() {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server is running on http://localhost:${this.port}`);
	}
}

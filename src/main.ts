import { Container, ContainerModule, interfaces } from 'inversify';
import { Logger } from 'tslog';
import { App } from './app';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { ExeptionFilter } from './errors/exeption.filter';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TaskController } from './task/task.controller';
import { ITaskController } from './task/task.controller.interface';
import { TaskRepository } from './task/task.repository';
import { ITaskRepository } from './task/task.repository.interface';
import { TaskService } from './task/task.service';
import { ITaskService } from './task/task.service.interface';
import { TYPES } from './types';

export const AppBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger<Logger<any>>>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<ITaskController>(TYPES.TaskController).to(TaskController);
	bind<ITaskService>(TYPES.TaskService).to(TaskService);
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<ITaskRepository>(TYPES.TaskRepository).to(TaskRepository);
	bind<App>(TYPES.Application).to(App);
});

function bootstrap() {
	const appContainer = new Container();
	appContainer.load(AppBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { appContainer, app };
}

export const { app, appContainer } = bootstrap();

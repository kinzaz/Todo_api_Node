import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Logger } from 'tslog';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';

const prisma = new PrismaClient();

export default prisma;

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.ILogger) private logger: ILogger<Logger<any>>) {
		this.client = new PrismaClient();
	}

	async connect() {
		try {
			await this.client.$connect();
			this.logger.log('[PrismaService] Success connection to DB');
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error('[PrismaService] Failed connection to DB: ', error.message);
			}
		}
	}
	async disconnect() {
		await this.client.$disconnect();
	}
}

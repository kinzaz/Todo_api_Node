export interface IConfigService {
	get: <T extends string = string>(key: string) => T;
}

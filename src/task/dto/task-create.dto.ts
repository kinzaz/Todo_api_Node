import {IsString} from 'class-validator';

export class TaskCreateDto {
  @IsString({message: "title is empty field"})
  title: string;
  description: string;
}
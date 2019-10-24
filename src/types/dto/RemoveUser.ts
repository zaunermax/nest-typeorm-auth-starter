import { IsNumber } from 'class-validator';

export class RemoveUser {
  @IsNumber()
  id!: number;
}

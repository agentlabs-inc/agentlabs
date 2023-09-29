import { IsDate, IsString } from 'class-validator';

export class RegisterResponseDto {
  @IsString()
  email: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

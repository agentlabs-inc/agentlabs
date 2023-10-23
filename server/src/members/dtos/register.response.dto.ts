import { IsDate, IsString } from 'class-validator';

export class RegisterResponseDto {
  @IsString()
  email: string | null;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

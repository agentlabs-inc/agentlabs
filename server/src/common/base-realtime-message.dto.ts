import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class RealtimeMessageError {
  @IsString()
  code: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsObject()
  context?: unknown;
}

export class BaseRealtimeMessageDto {
  @IsDateString()
  timestamp: string;

  @ApiProperty({
    description:
      'A message that describes the nature of the operation. Used as an helpful indicator. Not something to rely on.',
  })
  @IsOptional()
  @IsString()
  message: string;

  @IsObject()
  data: unknown;

  @ApiProperty({
    description: 'The error, if any occured.',
  })
  @ValidateNested()
  @IsString()
  @Type(() => RealtimeMessageError)
  error?: RealtimeMessageError;
}

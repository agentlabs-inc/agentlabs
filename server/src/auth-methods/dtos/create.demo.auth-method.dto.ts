import { IsArray, IsIn, IsNotEmpty, IsString } from 'class-validator';

export const SelectedAuthMethods = ['PASSWORDLESS_EMAIL', 'GOOGLE'] as const;
export type SelectedAuthMethod = (typeof SelectedAuthMethods)[number];

export class CreateDemoAuthMethodsDto {
  @IsArray()
  @IsNotEmpty()
  @IsIn(SelectedAuthMethods, { each: true })
  methods: SelectedAuthMethod[];

  @IsString()
  projectId: string;
}

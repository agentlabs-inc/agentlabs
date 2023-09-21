export const RegisterUserErrors = ['UserAlreadyExists'] as const;
export type RegisterUserError = (typeof RegisterUserErrors)[number];

export const LoginUserErrors = [
  'UserNotFound',
  'InvalidPassword',
  'UserDoesNotHavePasswordHashConfig',
  'UserDoesNotHavePassword',
] as const;
export type LoginUserError = (typeof LoginUserErrors)[number];

export const WhoAmIErrors = ['UserNotFound'] as const;
export type WhoAmIError = (typeof WhoAmIErrors)[number];

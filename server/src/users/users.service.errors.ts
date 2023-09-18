export const RegisterUserErrors = [
  'UserAlreadyExists',
  'UnknownError',
] as const;

export type RegisterUserError = (typeof RegisterUserErrors)[number];

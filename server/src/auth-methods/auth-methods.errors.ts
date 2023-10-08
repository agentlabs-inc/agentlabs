export const VerifyIfIsProjectUserErrors = [
  'ProjectNotFound',
  'NotAProjectUser',
] as const;

export type VerifyIfIsProjectUserError =
  (typeof VerifyIfIsProjectUserErrors)[number];

export const CreateAuthMethodErrors = [
  ...VerifyIfIsProjectUserErrors,
  'AuthMethodAlreadyExists',
] as const;
export type CreateAuthMethodError = (typeof CreateAuthMethodErrors)[number];

export const UpsertAuthMethodErrors = [...VerifyIfIsProjectUserErrors] as const;
export type UpsertAuthMethodError = (typeof UpsertAuthMethodErrors)[number];

export const ListAuthMethodsErrors = [...VerifyIfIsProjectUserErrors] as const;
export type ListAuthMethodsError = (typeof ListAuthMethodsErrors)[number];

export const CreateDemoAuthMethodsErrors = [
  ...VerifyIfIsProjectUserErrors,
] as const;
export type CreateDemoAuthMethodsError =
  (typeof CreateDemoAuthMethodsErrors)[number];

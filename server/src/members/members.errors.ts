export const RegisterMemberVerifyAuthMethodErrors = [
  'ProjectNotFound',
  'DisabledAuthMethod',
  'AuthMethodNotConfigured',
] as const;

export type RegisterMemberVerifyAuthMethodError =
  (typeof RegisterMemberVerifyAuthMethodErrors)[number];

export const RegisterPasswordlessEmailErrors = [
  ...RegisterMemberVerifyAuthMethodErrors,
] as const;

export type RegisterPasswordlessEmailError =
  (typeof RegisterPasswordlessEmailErrors)[number];

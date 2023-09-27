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

export const VerifyPasswordlessEmailErrors = [
  'ProjectNotFound',
  'CodeNotFound',
  'CodeExpired',
  'MemberBanned',
  'MemberNotFound',
] as const;

export type VerifyPasswordlessEmailError =
  (typeof VerifyPasswordlessEmailErrors)[number];

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

export const VerifyIfIsProjectUserErrors = [
  'ProjectNotFound',
  'NotAProjectUser',
] as const;

export type VerifyIfIsProjectUserError =
  (typeof VerifyIfIsProjectUserErrors)[number];

export const VerifiyIfIsProjectMemberErrors = ['NotAProjectMember'] as const;

export type VerifiyIfIsProjectMemberError =
  (typeof VerifiyIfIsProjectMemberErrors)[number];

export const ListMembersErrors = [...VerifyIfIsProjectUserErrors] as const;

export type ListMembersError = (typeof ListMembersErrors)[number];

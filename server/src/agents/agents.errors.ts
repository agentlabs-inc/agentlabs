export const VerifyIfIsProjectUserErrors = [
  'ProjectNotFound',
  'NotAProjectUser',
] as const;

export type VerifyIfIsProjectUserError =
  (typeof VerifyIfIsProjectUserErrors)[number];

export const VerifyIfCanUpdateAgentErrors = [
  ...VerifyIfIsProjectUserErrors,
  'AgentNotFound',
] as const;
export type VerifyIfCanUpdateAgentError =
  (typeof VerifyIfCanUpdateAgentErrors)[number];

export const CreateAgentErrors = [...VerifyIfIsProjectUserErrors] as const;
export type CreateAgentError = (typeof CreateAgentErrors)[number];

export const GetAgentByIdErrors = [
  ...VerifyIfIsProjectUserErrors,
  'AgentNotFound',
  'NotAProjectUser',
] as const;

export type GetAgentByIdError = (typeof GetAgentByIdErrors)[number];

export const UpdateAgentErrors = [...VerifyIfCanUpdateAgentErrors] as const;

export type UpdateAgentError = (typeof UpdateAgentErrors)[number];

export const UploadAgentLogoErrors = [
  'AgentNotFound',
  'ProhibitedMimeType',
] as const;

export type UploadAgentLogoError = (typeof UploadAgentLogoErrors)[number];

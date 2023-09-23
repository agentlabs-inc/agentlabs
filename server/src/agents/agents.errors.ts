export const VerifyIfIsProjectUserErrors = [
  'ProjectNotFound',
  'NotAProjectUser',
] as const;

export type VerifyIfIsProjectUserError =
  (typeof VerifyIfIsProjectUserErrors)[number];

export const CreateAgentErrors = [...VerifyIfIsProjectUserErrors] as const;
export type CreateAgentError = (typeof CreateAgentErrors)[number];

export const GetAgentByIdErrors = [
  ...VerifyIfIsProjectUserErrors,
  'AgentNotFound',
  'NotAProjectUser',
] as const;

export type GetAgentByIdError = (typeof GetAgentByIdErrors)[number];

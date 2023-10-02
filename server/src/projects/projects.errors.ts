export const VerifyIfIsOrganizationUserErrors = [
  'OrganizationNotFound',
  'NotAnOrganizationUser',
] as const;
export type VerifyIfIsOrganizationUserError =
  (typeof VerifyIfIsOrganizationUserErrors)[number];

export const CreateProjectErrors = [
  ...VerifyIfIsOrganizationUserErrors,
  'SlugAlreadyTaken',
] as const;
export type CreateProjectError = (typeof CreateProjectErrors)[number];

export const ListOrganizationProjectsErrors = [
  ...VerifyIfIsOrganizationUserErrors,
] as const;
export type ListOrganizationProjectsError =
  (typeof ListOrganizationProjectsErrors)[number];

export const GetPublicConfigErrors = [
  'UnprocessableHostname',
  'ProjectNotFound',
] as const;

export type GetPublicConfigError = (typeof GetPublicConfigErrors)[number];

export const FindProjectErrors = ['ProjectNotFound'] as const;

export type FindProjectError = (typeof FindProjectErrors)[number];

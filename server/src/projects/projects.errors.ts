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

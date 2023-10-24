import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { validateEnv } from 'src/config/validate-env';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProjectsConfig {}

export const projectsConfig = registerAs<ProjectsConfig>(
  'ProjectsConfig',
  (): ProjectsConfig => {
    const env = validateEnv(process.env);

    console.log('env', env);

    return {};
  },
);

export const InjectProjectsConfig = () => Inject(projectsConfig.KEY);

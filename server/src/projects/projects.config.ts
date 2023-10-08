import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { validateEnv } from 'src/config/validate-env';

export interface ProjectsConfig {
  googleDemoClientId: string;
  googleDemoClientSecret: string;
}

export const projectsConfig = registerAs<ProjectsConfig>(
  'ProjectsConfig',
  (): ProjectsConfig => {
    const env = validateEnv(process.env);

    console.log('env', env);

    return {
      googleDemoClientId: env.MEMBERS_DEMO_OAUTH_GOOGLE_CLIENT_ID,
      googleDemoClientSecret: env.MEMBERS_DEMO_OAUTH_GOOGLE_CLIENT_SECRET,
    };
  },
);

export const InjectProjectsConfig = () => Inject(projectsConfig.KEY);

import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { GITHUB_URL } from './landing-data';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'create-fedi-app',
      url: '/',
    },
    githubUrl: GITHUB_URL,
    themeSwitch: {
      enabled: false,
    },
    links: [
      {
        text: 'Home',
        url: '/',
        active: 'nested-url',
      },
    ],
  };
}

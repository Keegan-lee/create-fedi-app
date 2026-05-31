import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const withMDX = createMDX();

const config: NextConfig = {
  transpilePackages: ['@create-fedi-app/ui'],
};

export default withMDX(config);

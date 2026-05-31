import { execa } from 'execa';
import pc from 'picocolors';
import type { PackageManager } from './types.js';

export async function installDeps(pm: PackageManager, cwd: string): Promise<void> {
  const installCmd = pm === 'npm' ? ['install'] : ['install'];

  try {
    await execa(pm, installCmd, { cwd, stdio: 'ignore' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(
      pc.yellow(`\nWarning: dependency install failed — run \`${pm} install\` manually.\n`) +
      pc.dim(`  ${msg}\n`),
    );
  }
}

import fs from 'fs-extra';
import path from 'path';
import type { Database } from './types.js';

export interface ModuleFile {
  src: string;
  dest: string;
  merge: 'add' | 'replace' | 'append';
  /** When set, file is only applied for this database adapter. */
  databaseType?: Database;
}

export interface ModuleEnvVar {
  key: string;
  description: string;
  example: string;
  required: boolean;
}

export interface ModuleDatabaseTypeConfig {
  dependencies: string[];
  devDependencies: string[];
}

export interface ModuleManifest {
  name: string;
  description: string;
  dependencies: string[];
  devDependencies: string[];
  databaseType?: Partial<Record<Exclude<Database, 'none'>, ModuleDatabaseTypeConfig>>;
  scripts?: Record<string, string>;
  files: ModuleFile[];
  envVars: ModuleEnvVar[];
}

export async function applyModuleFile(
  moduleDir: string,
  targetDir: string,
  file: ModuleFile,
): Promise<void> {
  const srcPath = path.join(moduleDir, file.src);
  const destPath = path.join(targetDir, file.dest);

  if (!(await fs.pathExists(srcPath))) return;

  await fs.ensureDir(path.dirname(destPath));

  switch (file.merge) {
    case 'add':
      if (!(await fs.pathExists(destPath))) {
        await fs.copy(srcPath, destPath);
      }
      break;
    case 'replace':
      await fs.copy(srcPath, destPath, { overwrite: true });
      break;
    case 'append': {
      const srcContent = await fs.readFile(srcPath, 'utf-8');
      if (await fs.pathExists(destPath)) {
        await fs.appendFile(destPath, '\n' + srcContent);
      } else {
        await fs.writeFile(destPath, srcContent, 'utf-8');
      }
      break;
    }
  }
}

export function resolveModuleDependencies(
  manifest: ModuleManifest,
  database: Database,
): { dependencies: string[]; devDependencies: string[] } {
  const dependencies = [...manifest.dependencies];
  const devDependencies = [...manifest.devDependencies];

  if (database !== 'none' && manifest.databaseType?.[database]) {
    const typed = manifest.databaseType[database];
    dependencies.push(...typed.dependencies);
    devDependencies.push(...typed.devDependencies);
  }

  return { dependencies, devDependencies };
}

export function shouldApplyModuleFile(
  file: ModuleFile,
  database: Database,
): boolean {
  if (!file.databaseType) return true;
  return database !== 'none' && file.databaseType === database;
}

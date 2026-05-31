import fs from 'fs-extra';
import path from 'path';
import type { UserSelections } from './types.js';
import {
  applyModuleFile,
  resolveModuleDependencies,
  shouldApplyModuleFile,
  type ModuleManifest,
} from './modules.js';
import { buildDemoRoutes, renderDemoRoutesFile } from './demo-routes.js';

function getTemplatesDir(): string {
  const bundled = path.join(__dirname, 'templates');
  if (fs.existsSync(bundled)) return bundled;
  const fromRoot = path.resolve(__dirname, '../../../templates');
  if (fs.existsSync(fromRoot)) return fromRoot;
  throw new Error('Templates directory not found. Run `bun run build` in apps/cli.');
}

async function replaceInFiles(
  dir: string,
  replacements: [string, string][],
): Promise<void> {
  if (!(await fs.pathExists(dir))) return;
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await replaceInFiles(fullPath, replacements);
    } else {
      try {
        let content = await fs.readFile(fullPath, 'utf-8');
        let changed = false;
        for (const [from, to] of replacements) {
          const next = content.split(from).join(to);
          if (next !== content) changed = true;
          content = next;
        }
        if (changed) await fs.writeFile(fullPath, content, 'utf-8');
      } catch {
        // binary file — skip
      }
    }
  }
}

async function mergeModuleIntoPackageJson(
  targetDir: string,
  manifest: ModuleManifest,
  database: UserSelections['database'],
): Promise<void> {
  const pkgPath = path.join(targetDir, 'package.json');
  if (!(await fs.pathExists(pkgPath))) return;

  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8')) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
  };

  const { dependencies, devDependencies } = resolveModuleDependencies(
    manifest,
    database,
  );

  pkg.dependencies ??= {};
  pkg.devDependencies ??= {};
  pkg.scripts ??= {};

  for (const dep of dependencies) {
    pkg.dependencies[dep] ??= 'latest';
  }
  for (const dep of devDependencies) {
    pkg.devDependencies[dep] ??= 'latest';
  }
  if (manifest.scripts) {
    for (const [name, script] of Object.entries(manifest.scripts)) {
      pkg.scripts[name] ??= script;
    }
  }

  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
}

async function applyModule(
  moduleName: string,
  targetDir: string,
  templatesDir: string,
  selections: UserSelections,
): Promise<void> {
  const moduleDir = path.join(templatesDir, 'modules', moduleName);
  const manifestPath = path.join(moduleDir, 'module.json');

  if (!(await fs.pathExists(manifestPath))) return;

  let manifest: ModuleManifest;
  try {
    manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8')) as ModuleManifest;
  } catch {
    return;
  }

  for (const file of manifest.files) {
    if (!shouldApplyModuleFile(file, selections.database)) continue;
    await applyModuleFile(moduleDir, targetDir, file);
  }

  await mergeModuleIntoPackageJson(targetDir, manifest, selections.database);
}

function getSelectedModuleNames(selections: UserSelections): string[] {
  return [
    'webln-payments',
    'nostr-identity',
    'ecash-balance',
    ...selections.modules,
    ...(selections.includeAiRules ? ['ai-rules'] : []),
    ...(selections.database !== 'none' ? ['database'] : []),
  ];
}

async function applyModules(
  selections: UserSelections,
  targetDir: string,
  templatesDir: string,
): Promise<void> {
  const alwaysOn = ['webln-payments', 'nostr-identity', 'ecash-balance'];

  for (const mod of alwaysOn) {
    await applyModule(mod, targetDir, templatesDir, selections);
  }

  for (const mod of selections.modules) {
    await applyModule(mod, targetDir, templatesDir, selections);
  }

  if (selections.includeAiRules) {
    await applyModule('ai-rules', targetDir, templatesDir, selections);
  }

  if (selections.database !== 'none') {
    await applyModule('database', targetDir, templatesDir, selections);
  }
}

async function generateEnvLocal(
  selections: UserSelections,
  targetDir: string,
  templatesDir: string,
): Promise<void> {
  const examplePath = path.join(templatesDir, 'base', '.env.example');
  if (!(await fs.pathExists(examplePath))) return;

  const example = await fs.readFile(examplePath, 'utf-8');
  const envLocal = path.join(targetDir, '.env.local');

  const moduleNames = getSelectedModuleNames(selections);

  const extraLines: string[] = [];
  for (const mod of moduleNames) {
    const manifestPath = path.join(templatesDir, 'modules', mod, 'module.json');
    if (!(await fs.pathExists(manifestPath))) continue;
    try {
      const manifest = JSON.parse(
        await fs.readFile(manifestPath, 'utf-8'),
      ) as ModuleManifest;
      for (const envVar of manifest.envVars) {
        const comment = `# ${envVar.description}${envVar.required ? ' (required)' : ''}`;
        const exampleValue =
          mod === 'database' && envVar.key === 'DATABASE_URL'
            ? selections.database === 'supabase'
              ? 'postgresql://postgres:password@db.example.supabase.co:5432/postgres'
              : envVar.example
            : envVar.example;
        const line = `${envVar.key}=${exampleValue}`;
        extraLines.push(comment, line);
      }
    } catch {
      // skip malformed manifests
    }
  }

  const content =
    example + (extraLines.length > 0 ? '\n' + extraLines.join('\n') + '\n' : '');
  await fs.writeFile(envLocal, content, 'utf-8');
}

export async function scaffold(
  selections: UserSelections,
  targetDir: string,
): Promise<void> {
  const templatesDir = getTemplatesDir();
  const baseDir = path.join(templatesDir, 'base');

  await fs.ensureDir(targetDir);

  if (await fs.pathExists(baseDir)) {
    await fs.copy(baseDir, targetDir, { overwrite: true });
  }

  await replaceInFiles(targetDir, [
    ['{{PROJECT_NAME}}', selections.projectName],
    ['{{PACKAGE_MANAGER}}', selections.packageManager],
  ]);

  await applyModules(selections, targetDir, templatesDir);
  await generateDemoRoutes(selections, targetDir);
  await generateEnvLocal(selections, targetDir, templatesDir);
}

async function generateDemoRoutes(
  selections: UserSelections,
  targetDir: string,
): Promise<void> {
  const moduleNames = getSelectedModuleNames(selections);
  const routes = buildDemoRoutes(moduleNames);
  const content = renderDemoRoutesFile(routes);
  await fs.writeFile(path.join(targetDir, 'lib/demo-routes.ts'), content, 'utf-8');
}

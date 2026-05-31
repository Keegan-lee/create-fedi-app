import * as p from '@clack/prompts';
import fs from 'fs-extra';
import path from 'path';
import { parseCliArgs } from './parse-args.js';
import { promptUser } from './prompts.js';
import { scaffold } from './scaffold.js';
import type { UserSelections } from './types.js';
import { installDeps } from './install.js';
import { printNextSteps } from './next-steps.js';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pkg = require('../package.json') as { version: string };
const version = pkg.version;

function printHelp(): void {
  console.log(`create-fedi-app v${version}

Usage:
  npx create-fedi-app@latest
  node dist/index.js

Options:
  -h, --help     Show this message
  -v, --version  Show version

Non-interactive (skip prompts when --project-name is set):
  --project-name <name>       kebab-case directory name
  --database <none|turso|supabase>
  --modules <all|a,b,c>       comma-separated or "all"
  --ai-rules | --no-ai-rules
  --ai-provider <agnostic|anthropic|openai|groq|ollama>
  --package-manager <bun|pnpm|npm>
  --skip-install                scaffold only, do not install deps

Interactive prompts:
  1. Project name (kebab-case)
  2. Database: none | turso | supabase
  3. Optional modules (multiselect)
  4. Include AI rules directory
  5. AI provider (if AI modules selected)
  6. Package manager: bun | pnpm | npm

Docs: https://create-fedi-app.keeganfrancis.com/docs`);
}

async function main(): Promise<void> {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  if (process.argv.includes('--version') || process.argv.includes('-v')) {
    console.log(`create-fedi-app v${version}`);
    process.exit(0);
  }

  const skipInstall = process.argv.includes('--skip-install');
  let selections: UserSelections;
  let nonInteractive = false;

  try {
    const fromArgs = parseCliArgs(process.argv);
    if (fromArgs) {
      nonInteractive = true;
      selections = fromArgs;
      console.log(`create-fedi-app v${version} (non-interactive)`);
    } else {
      p.intro(`create-fedi-app v${version}`);
      selections = await promptUser();
    }
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), selections.projectName);

  if (await fs.pathExists(targetDir)) {
    const message = `Directory "${selections.projectName}" already exists. Choose a different name.`;
    if (nonInteractive) {
      console.error(message);
    } else {
      p.cancel(message);
    }
    process.exit(1);
  }

  try {
    if (nonInteractive) {
      console.log('Scaffolding project…');
      await scaffold(selections, targetDir);
      console.log('Project scaffolded');
    } else {
      const scaffoldSpinner = p.spinner();
      scaffoldSpinner.start('Scaffolding project…');
      try {
        await scaffold(selections, targetDir);
        scaffoldSpinner.stop('Project scaffolded');
      } catch (err) {
        scaffoldSpinner.stop('Scaffold failed');
        p.cancel(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    }
  } catch (err) {
    if (nonInteractive) {
      console.error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
    throw err;
  }

  if (!skipInstall) {
    if (nonInteractive) {
      console.log(`Installing dependencies with ${selections.packageManager}…`);
      await installDeps(selections.packageManager, targetDir);
      console.log('Dependencies installed');
    } else {
      const installSpinner = p.spinner();
      installSpinner.start(`Installing dependencies with ${selections.packageManager}…`);
      await installDeps(selections.packageManager, targetDir);
      installSpinner.stop('Dependencies installed');
    }
  }

  printNextSteps(selections);

  if (nonInteractive) {
    console.log('Happy building. Docs: https://create-fedi-app.keeganfrancis.com/docs');
  } else {
    p.outro('Happy building. Docs: https://create-fedi-app.keeganfrancis.com/docs');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

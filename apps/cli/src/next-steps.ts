import * as p from '@clack/prompts';
import type { UserSelections } from './types.js';

export function printNextSteps(selections: UserSelections): void {
  const pm = selections.packageManager;
  const name = selections.projectName;

  p.note(
    [
      `cd ${name}`,
      `cp .env.example .env.local    (fill in any required variables)`,
      `${pm} run dev                 (starts on localhost:3000)`,
      ``,
      `Test with Fedi:`,
      `▸ Install Fedi: https://fedi.xyz/get-the-app`,
      `▸ Join Mutinynet test federation (see docs for invite link)`,
      `▸ Add http://localhost:3000 as a custom Mini App in Fedi`,
      `▸ window.webln and window.nostr are now injected`,
      ``,
      `Docs: https://create-fedi-app.keeganfrancis.com/docs`,
    ].join('\n'),
    'Next steps',
  );
}

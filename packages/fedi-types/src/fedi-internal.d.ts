type FediInternalV0 = { version: 0 };
type FediInternalV1 = { version: 1 };
type FediInternalV2 = {
  version: 2;
  /**
   * Lists mini apps installed in the user's Fedi wallet.
   * Requires the `manageInstalledMiniApps` permission — call only on user gesture
   * and handle rejection (user may deny or remember denial).
   */
  getInstalledMiniApps(): Promise<Array<{ url: string }>>;
  /**
   * Prompts the user to install a mini app in Fedi.
   * Requires the `manageInstalledMiniApps` permission — call only on user gesture
   * and handle rejection (user may deny or remember denial).
   */
  installMiniApp(miniApp: {
    id: string;
    title: string;
    url: string;
    imageUrl?: string | null;
    description?: string;
  }): Promise<void>;
};

export type FediInternal = FediInternalV0 | FediInternalV1 | FediInternalV2;

declare global {
  interface Window {
    fediInternal?: FediInternal;
  }
}

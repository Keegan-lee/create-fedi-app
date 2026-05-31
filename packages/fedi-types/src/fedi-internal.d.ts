type FediInternalV0 = { version: 0 };
type FediInternalV1 = { version: 1 };
type FediInternalV2 = {
  version: 2;
  getInstalledMiniApps(): Promise<Array<{ url: string }>>;
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

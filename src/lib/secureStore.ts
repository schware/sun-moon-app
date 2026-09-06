import * as SecureStore from "expo-secure-store";

const KEYS = {
  githubPat: "github_pat",
  githubOwner: "github_owner",
  githubRepo: "github_repo",
  anthropicApiKey: "anthropic_api_key",
} as const;

export type AppSettings = {
  githubPat: string;
  githubOwner: string;
  githubRepo: string;
  anthropicApiKey: string;
};

export async function loadSettings(): Promise<AppSettings> {
  const [githubPat, githubOwner, githubRepo, anthropicApiKey] = await Promise.all([
    SecureStore.getItemAsync(KEYS.githubPat),
    SecureStore.getItemAsync(KEYS.githubOwner),
    SecureStore.getItemAsync(KEYS.githubRepo),
    SecureStore.getItemAsync(KEYS.anthropicApiKey),
  ]);

  return {
    githubPat: githubPat ?? "",
    githubOwner: githubOwner ?? "",
    githubRepo: githubRepo ?? "",
    anthropicApiKey: anthropicApiKey ?? "",
  };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(KEYS.githubPat, settings.githubPat),
    SecureStore.setItemAsync(KEYS.githubOwner, settings.githubOwner),
    SecureStore.setItemAsync(KEYS.githubRepo, settings.githubRepo),
    SecureStore.setItemAsync(KEYS.anthropicApiKey, settings.anthropicApiKey),
  ]);
}

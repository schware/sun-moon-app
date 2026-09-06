export type GitHubCredentials = {
  pat: string;
  owner: string;
  repo: string;
  branch?: string;
};

function toBase64(input: string): string {
  // React Native's global btoa only handles Latin1, so encode UTF-8 safely.
  const utf8 = unescape(encodeURIComponent(input));
  return btoa(utf8);
}

async function getFileSha(
  creds: GitHubCredentials,
  path: string
): Promise<string | undefined> {
  const url = `https://api.github.com/repos/${creds.owner}/${creds.repo}/contents/${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${creds.pat}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (res.status === 404) return undefined;
  if (!res.ok) {
    throw new Error(`GitHub 조회 실패 (${res.status}): ${await res.text()}`);
  }

  const data = await res.json();
  return data.sha as string;
}

/** Creates or updates a markdown file in the configured GitHub repo. */
export async function commitMarkdownFile(
  creds: GitHubCredentials,
  path: string,
  content: string,
  message: string
): Promise<void> {
  const sha = await getFileSha(creds, path);
  const url = `https://api.github.com/repos/${creds.owner}/${creds.repo}/contents/${path}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${creds.pat}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: toBase64(content),
      branch: creds.branch,
      sha,
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub 저장 실패 (${res.status}): ${await res.text()}`);
  }
}

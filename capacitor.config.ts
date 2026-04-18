import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import type { CapacitorConfig } from "@capacitor/cli";

function normalizeEnvValue(value: string | undefined) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

function readEnvFile(fileName: string) {
  const filePath = path.join(process.cwd(), fileName);

  if (!existsSync(filePath)) {
    return {};
  }

  const fileContents = readFileSync(filePath, "utf8");
  const entries: Record<string, string> = {};

  for (const rawLine of fileContents.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = normalizeEnvValue(line.slice(separatorIndex + 1));

    if (key) {
      entries[key] = value ?? "";
    }
  }

  return entries;
}

function normalizeBooleanEnvValue(value: string | undefined) {
  const normalized = normalizeEnvValue(value)?.toLowerCase();

  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

const fileEnv = {
  ...readEnvFile(".env"),
  ...readEnvFile(".env.local"),
};

const hostedServerUrl =
  normalizeEnvValue(process.env.NEXT_PUBLIC_APP_URL) ||
  fileEnv.NEXT_PUBLIC_APP_URL ||
  "http://10.0.2.2:3000";

const localDevServerUrl =
  normalizeEnvValue(process.env.CAPACITOR_SERVER_URL) ||
  fileEnv.CAPACITOR_SERVER_URL ||
  "http://10.0.2.2:3000";

const useLocalDevServer =
  normalizeBooleanEnvValue(process.env.CAPACITOR_USE_LOCAL_SERVER) ||
  normalizeBooleanEnvValue(fileEnv.CAPACITOR_USE_LOCAL_SERVER);

const baseServerUrl = useLocalDevServer ? localDevServerUrl : hostedServerUrl;

const serverPath =
  normalizeEnvValue(process.env.CAPACITOR_SERVER_PATH) ||
  fileEnv.CAPACITOR_SERVER_PATH ||
  "/mobile-login";

const serverUrl = (() => {
  if (!serverPath || serverPath === "/") {
    return baseServerUrl;
  }

  try {
    return new URL(serverPath, baseServerUrl.endsWith("/") ? baseServerUrl : `${baseServerUrl}/`).toString();
  } catch {
    return baseServerUrl;
  }
})();

const config: CapacitorConfig = {
  appId: "app.vaultstory.mobile",
  appName: "Vault Story",
  webDir: "public",
  server: {
    url: serverUrl,
    cleartext: serverUrl.startsWith("http://"),
  },
};

export default config;

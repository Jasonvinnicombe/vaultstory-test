import { Buffer } from "node:buffer";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { normalizeEnvValue } from "@/lib/supabase/config";

const STORAGE_PREFIXES = ["avatars", "vault-covers", "entry-assets"] as const;
const DEFAULT_SIGNED_URL_TTL_SECONDS = 60 * 10;

let r2Client: S3Client | null = null;

type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicBaseUrl: string | null;
};

function getR2Config(): R2Config {
  const accountId = normalizeEnvValue(process.env.R2_ACCOUNT_ID);
  const accessKeyId = normalizeEnvValue(process.env.R2_ACCESS_KEY_ID);
  const secretAccessKey = normalizeEnvValue(process.env.R2_SECRET_ACCESS_KEY);
  const bucket = normalizeEnvValue(process.env.R2_BUCKET);
  const publicBaseUrl = normalizeEnvValue(process.env.R2_PUBLIC_BASE_URL) ?? null;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error("Missing R2 configuration. Add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET.");
  }

  return { accountId, accessKeyId, secretAccessKey, bucket, publicBaseUrl };
}

export function isR2Configured() {
  return Boolean(
    normalizeEnvValue(process.env.R2_ACCOUNT_ID) &&
      normalizeEnvValue(process.env.R2_ACCESS_KEY_ID) &&
      normalizeEnvValue(process.env.R2_SECRET_ACCESS_KEY) &&
      normalizeEnvValue(process.env.R2_BUCKET),
  );
}

function getR2Client() {
  if (r2Client) {
    return r2Client;
  }

  const config = getR2Config();
  r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  return r2Client;
}

export function buildStorageObjectKey(bucket: string, path: string) {
  const normalizedBucket = bucket.trim().replace(/^\/+|\/+$/g, "");
  const normalizedPath = path.trim().replace(/^\/+/, "");
  return `${normalizedBucket}/${normalizedPath}`;
}

export function isR2ObjectKey(path: string | null | undefined) {
  if (!path) return false;
  return STORAGE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export async function uploadObjectToR2(params: {
  bucket: string;
  path: string;
  body: Buffer | Uint8Array;
  contentType?: string | null;
}) {
  const config = getR2Config();
  const client = getR2Client();
  const objectKey = buildStorageObjectKey(params.bucket, params.path);

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: objectKey,
      Body: params.body,
      ContentType: params.contentType ?? undefined,
    }),
  );

  return { objectKey };
}

export async function createPresignedUploadUrl(params: {
  bucket: string;
  path: string;
  contentType?: string | null;
  expiresIn?: number;
}) {
  const config = getR2Config();
  const client = getR2Client();
  const objectKey = buildStorageObjectKey(params.bucket, params.path);
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: objectKey,
    ContentType: params.contentType ?? undefined,
  });

  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn: params.expiresIn ?? DEFAULT_SIGNED_URL_TTL_SECONDS,
  });

  return { uploadUrl, objectKey };
}

export async function createSignedR2ObjectUrl(objectKey: string, expiresIn = DEFAULT_SIGNED_URL_TTL_SECONDS) {
  const config = getR2Config();
  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: objectKey,
  });

  return getSignedUrl(client, command, { expiresIn });
}

export function getPublicR2ObjectUrl(objectKey: string) {
  const { publicBaseUrl } = getR2Config();
  if (!publicBaseUrl) {
    return null;
  }

  return `${publicBaseUrl.replace(/\/+$/g, "")}/${objectKey.replace(/^\/+/, "")}`;
}

export async function deleteR2Object(objectKey: string) {
  const config = getR2Config();
  const client = getR2Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: objectKey,
    }),
  );
}

export async function listR2PrefixBytes(prefix: string) {
  const config = getR2Config();
  const client = getR2Client();
  let continuationToken: string | undefined;
  let usedBytes = 0;

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: config.bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }),
    );

    for (const object of response.Contents ?? []) {
      usedBytes += object.Size ?? 0;
    }

    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);

  return usedBytes;
}

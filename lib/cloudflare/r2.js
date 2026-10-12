/**
 * Cloudflare R2 (S3-compatible) helpers.
 * Requires env — until set, upload routes return a clear configuration error.
 */

export function getR2Config() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '';
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '';
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';
  const bucket = process.env.CLOUDFLARE_R2_BUCKET || '';
  const publicBase =
    process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL ||
    (accountId && bucket
      ? `https://${bucket}.${accountId}.r2.cloudflarestorage.com`
      : '');

  const configured = Boolean(
    accountId && accessKeyId && secretAccessKey && bucket && publicBase
  );

  return {
    configured,
    accountId,
    accessKeyId,
    secretAccessKey,
    bucket,
    publicBase: publicBase.replace(/\/$/, ''),
    endpoint: accountId
      ? `https://${accountId}.r2.cloudflarestorage.com`
      : '',
  };
}

export function assertR2Configured() {
  const cfg = getR2Config();
  if (!cfg.configured) {
    const err = new Error(
      'Cloudflare R2 is not configured. Add CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY, CLOUDFLARE_R2_BUCKET, CLOUDFLARE_R2_PUBLIC_BASE_URL.'
    );
    err.status = 503;
    throw err;
  }
  return cfg;
}

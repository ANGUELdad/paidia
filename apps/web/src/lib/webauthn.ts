function b64urlToBuffer(value: string): ArrayBuffer {
  const pad = "=".repeat((4 - (value.length % 4)) % 4);
  const b64 = (value + pad).replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function bufferToB64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function normalizePublicKey(options: Record<string, unknown>): PublicKeyCredentialCreationOptions | PublicKeyCredentialRequestOptions {
  const pk = (options.publicKey as Record<string, unknown>) || options;
  const challenge = pk.challenge;
  const out: Record<string, unknown> = { ...pk };
  if (typeof challenge === "string") out.challenge = b64urlToBuffer(challenge);
  if (out.user && typeof out.user === "object") {
    const user = { ...(out.user as Record<string, unknown>) };
    if (typeof user.id === "string") user.id = b64urlToBuffer(user.id);
    out.user = user;
  }
  if (Array.isArray(out.allowCredentials)) {
    out.allowCredentials = out.allowCredentials.map((c: Record<string, unknown>) => ({
      ...c,
      id: typeof c.id === "string" ? b64urlToBuffer(c.id) : c.id,
    }));
  }
  if (Array.isArray(out.excludeCredentials)) {
    out.excludeCredentials = out.excludeCredentials.map((c: Record<string, unknown>) => ({
      ...c,
      id: typeof c.id === "string" ? b64urlToBuffer(c.id) : c.id,
    }));
  }
  return out as unknown as PublicKeyCredentialCreationOptions;
}

export function credentialToJson(cred: PublicKeyCredential): Record<string, unknown> {
  const response = cred.response as AuthenticatorAttestationResponse | AuthenticatorAssertionResponse;
  const base: Record<string, unknown> = {
    id: cred.id,
    rawId: bufferToB64url(cred.rawId),
    type: cred.type,
    response: {
      clientDataJSON: bufferToB64url(response.clientDataJSON),
    },
  };
  const resp = base.response as Record<string, unknown>;
  if ("attestationObject" in response && response.attestationObject) {
    resp.attestationObject = bufferToB64url(response.attestationObject);
  }
  if ("authenticatorData" in response && response.authenticatorData) {
    resp.authenticatorData = bufferToB64url(response.authenticatorData);
  }
  if ("signature" in response && response.signature) {
    resp.signature = bufferToB64url(response.signature);
  }
  if ("userHandle" in response && response.userHandle) {
    resp.userHandle = bufferToB64url(response.userHandle);
  }
  return base;
}

export async function createPasskey(options: Record<string, unknown>): Promise<Record<string, unknown>> {
  const publicKey = normalizePublicKey(options) as PublicKeyCredentialCreationOptions;
  const cred = (await navigator.credentials.create({ publicKey })) as PublicKeyCredential | null;
  if (!cred) throw new Error("cancelled");
  return credentialToJson(cred);
}

export async function getPasskey(options: Record<string, unknown>): Promise<Record<string, unknown>> {
  const publicKey = normalizePublicKey(options) as PublicKeyCredentialRequestOptions;
  const cred = (await navigator.credentials.get({ publicKey })) as PublicKeyCredential | null;
  if (!cred) throw new Error("cancelled");
  return credentialToJson(cred);
}

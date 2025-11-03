/**
 * Minimal token: base64url(payload).base64url(hmacSHA256(payload, secret))
 * payload example: {"sid":"storeId","tbl":12,"modes":["store","delivery","reservation"],"exp":1735689600}
 */
export type QrPayload = { sid: string; tbl?: number; modes?: string[]; exp: number };
function b64u(input: ArrayBuffer | Uint8Array | string){
  let bytes: Uint8Array;
  if (typeof input === 'string') bytes = new TextEncoder().encode(input);
  else bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  let str = btoa(String.fromCharCode(...bytes));
  return str.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
async function hmacSHA256(message: string, secret: string){
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), {name:"HMAC", hash:"SHA-256"}, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return b64u(sig);
}
export async function signQrToken(payload: QrPayload, secret: string){
  const data = b64u(JSON.stringify(payload));
  const sig = await hmacSHA256(data, secret);
  return `${data}.${sig}`;
}
export async function verifyQrToken(token: string, secret: string): Promise<QrPayload|null>{
  try{
    const [data, sig] = token.split('.');
    if(!data||!sig) return null;
    const expect = await hmacSHA256(data, secret);
    if (expect !== sig) return null;
    const json = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(data.replace(/-/g,'+').replace(/_/g,'/')), c=>c.charCodeAt(0))));
    if (!json.exp || Date.now()/1000 > json.exp) return null;
    return json as QrPayload;
  }catch{ return null; }
}

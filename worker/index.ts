/**
 * Serves /docs/* (PDFs and ebooks) from the justmeat-files R2 bucket, so the
 * files keep their justmeat.co URLs without living in the static build.
 * wrangler.jsonc routes only /docs/* here; all other paths are static assets.
 */

const hasBody = (object: R2Object): object is R2ObjectBody => 'body' in object;

function rangeHeader({ range, size }: R2ObjectBody): string | undefined {
  if (!range) return undefined;
  // R2 may include unset fields as undefined, so test values rather than keys.
  const { offset, length, suffix } = range as { offset?: number; length?: number; suffix?: number };
  const start = suffix !== undefined ? size - suffix : (offset ?? 0);
  const end = suffix !== undefined || length === undefined ? size : start + length;
  return `bytes ${start}-${end - 1}/${size}`;
}

export default {
  async fetch(request, env): Promise<Response> {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405, headers: { allow: 'GET, HEAD' } });
    }

    const key = decodeURIComponent(new URL(request.url).pathname).slice(1);

    let object: R2Object | R2ObjectBody | null;
    try {
      object =
        request.method === 'HEAD'
          ? await env.FILES.head(key)
          : await env.FILES.get(key, { range: request.headers, onlyIf: request.headers });
    } catch {
      // R2 rejects ranges outside the file.
      return new Response('Range Not Satisfiable', { status: 416 });
    }

    // Missing file: let the assets layer answer with the site's 404 page.
    if (!object) return env.ASSETS.fetch(request);

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('accept-ranges', 'bytes');
    headers.set('cache-control', 'public, max-age=86400');

    if (!hasBody(object)) {
      if (request.method === 'HEAD') {
        headers.set('content-length', String(object.size));
        return new Response(null, { headers });
      }
      // A conditional request whose precondition matched (e.g. If-None-Match).
      return new Response(null, { status: 304, headers });
    }

    const contentRange = request.headers.has('range') ? rangeHeader(object) : undefined;
    if (contentRange) headers.set('content-range', contentRange);
    return new Response(object.body, { status: contentRange ? 206 : 200, headers });
  },
} satisfies ExportedHandler<Env>;

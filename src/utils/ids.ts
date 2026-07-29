/**
 * Coerce an unknown id value into the shape the backend expects.
 *
 * On the wire, IDs are integers. Form inputs — especially <select> —
 * deliver strings. We standardize on this helper so cache keys and
 * payload bodies are deterministic.
 *
 *   toIdKey(1)       === "1"
 *   toIdKey("1")     === "1"
 *   toIdKey(null)    === ""
 *
 * Use the result as a query-key segment AND as a value passed to
 * `Number(...)` when constructing a payload body.
 */
export function toIdKey(id: string | number | null | undefined): string {
  if (id === null || id === undefined) return '';
  return String(id);
}

/**
 * Convert a possibly-string id from form state into the integer the
 * backend expects. Empty strings become 0; coerce "1.5" via parseInt so
 * we don't ship floats.
 */
export function toIdNumber(id: string | number | null | undefined): number {
  if (id === null || id === undefined) return 0;
  if (typeof id === 'number') return id;
  if (id === '') return 0;
  return parseInt(id, 10) || 0;
}

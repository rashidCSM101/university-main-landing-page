/**
 * Ensures any external web link (e.g. www.linkedin.com/in/...) has a valid
 * absolute URL protocol (https://) so browsers do not treat it as a relative path.
 */
export function formatExternalUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || !url.trim()) return '#';
  const trimmed = url.trim();

  // If already starts with http:, https:, mailto:, tel:, or //, return as is
  if (/^(https?:|\/\/|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }

  // Prepend https://
  return `https://${trimmed}`;
}

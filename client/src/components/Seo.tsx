import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  ogType?: string;
}

/**
 * Shared SEO component — use on every page.
 * Automatically constructs canonical + OG URLs from the wenclims.org domain.
 */
export function Seo({
  title,
  description,
  path,
  noindex = false,
  ogType = 'website',
}: SeoProps) {
  const url = `https://wenclims.org${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      <link rel="canonical" href={url} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="https://wenclims.org/og-image.svg" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://wenclims.org/og-image.svg" />
    </Helmet>
  );
}

export default Seo;

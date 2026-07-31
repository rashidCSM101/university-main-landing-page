import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export const SEOHead = ({
  title,
  description = 'WenClims - Advanced Atmospheric Science, Rapid Event Attribution, & Climate Risk Services across the Indus Basin.',
  canonicalUrl,
  ogImage = '/assets/images/og-wenclims.png',
}: SEOHeadProps) => {
  const fullTitle = `${title} | WenClims Weather & Climate Services`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Helmet>
  );
};

export default SEOHead;

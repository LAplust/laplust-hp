import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import BackLink from '@/components/BackLink';
import { getAllNews, getNewsBySlug } from '@/lib/news';
import styles from './article.module.css';

const CATEGORY_LABEL: Record<string, string> = {
  company: 'Company',
  technology: 'Technology',
  event: 'Event',
  other: 'Other',
};

function formatDate(date: string) {
  const [y, m, d] = date.split('-');
  return `${y}.${Number(m)}.${Number(d)}`;
}

export function generateStaticParams() {
  return getAllNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getNewsBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/news_contents/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `/news_contents/${post.slug}`,
      publishedTime: post.date,
      images: post.ogImage ? [post.ogImage] : ['/images/og_default.png'],
    },
  };
}

export default async function NewsArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getNewsBySlug(slug);
  if (!post) notFound();
  const label = CATEGORY_LABEL[post.category] ?? post.category;

  // Google検索のリッチリザルト向け構造化データ
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    datePublished: post.date,
    mainEntityOfPage: `https://laplust.com/news_contents/${post.slug}`,
    ...(post.ogImage ? { image: [`https://laplust.com${post.ogImage}`] } : {}),
    publisher: {
      '@type': 'Organization',
      name: '株式会社LAplust',
      logo: { '@type': 'ImageObject', url: 'https://laplust.com/images/og_default.png' },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main style={{ paddingTop: 'calc(var(--header-height) + 40px)' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <nav className={styles.breadcrumb} aria-label="パンくず">
            <Link href="/">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 10.5 12 3l9 7.5V21h-6v-6h-6v6H3z" />
              </svg>
            </Link>
            <span>›</span>
            <Link href={`/category/${post.category}`}>{label}</Link>
          </nav>

          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <Link href={`/category/${post.category}`} className={styles.categoryChip}>
              {label}
            </Link>
          </div>

          {post.ogImage && <img className={styles.hero} src={post.ogImage} alt="" />}

          <article className="rich-text" dangerouslySetInnerHTML={{ __html: post.html }} />

          <div className={styles.shareRow}>
            <p>この記事をShareする</p>
            <div className={styles.shareIcons}>
              <a
                href={`https://twitter.com/share?url=${encodeURIComponent(`https://laplust.com/news_contents/${post.slug}`)}&text=${encodeURIComponent(post.title)}&hashtags=LAplust`}
                target="_blank"
                rel="noopener"
                aria-label="Xでシェア"
              >
                <svg viewBox="0 0 512 512" aria-hidden="true">
                  <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                </svg>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=https://laplust.com/news_contents/${post.slug}`}
                target="_blank"
                rel="noopener"
                aria-label="Facebookでシェア"
              >
                <svg viewBox="0 0 512 512" aria-hidden="true">
                  <path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z" />
                </svg>
              </a>
              <a
                href={`https://social-plugins.line.me/lineit/share?url=https://laplust.com/news_contents/${post.slug}`}
                target="_blank"
                rel="noopener"
                aria-label="LINEでシェア"
              >
                <svg viewBox="0 0 512 512" aria-hidden="true">
                  <path d="M311 196.8v81.3c0 2.1-1.6 3.7-3.7 3.7h-13c-1.3 0-2.4-.7-3-1.5l-37.3-50.3v48.2c0 2.1-1.6 3.7-3.7 3.7h-13c-2.1 0-3.7-1.6-3.7-3.7V196.9c0-2.1 1.6-3.7 3.7-3.7h12.9c1.1 0 2.4 .6 3 1.6l37.3 50.3V196.9c0-2.1 1.6-3.7 3.7-3.7h13c2.1-.1 3.8 1.6 3.8 3.5zm-93.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 2.1 1.6 3.7 3.7 3.7h13c2.1 0 3.7-1.6 3.7-3.7V196.8c0-1.9-1.6-3.7-3.7-3.7zm-31.4 68.1H150.3V196.8c0-2.1-1.6-3.7-3.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 1 .3 1.8 1 2.5c.7 .6 1.5 1 2.5 1h52.2c2.1 0 3.7-1.6 3.7-3.7v-13c0-1.9-1.6-3.7-3.5-3.7zm193.7-68.1H327.3c-1.9 0-3.7 1.6-3.7 3.7v81.3c0 1.9 1.6 3.7 3.7 3.7h52.2c2.1 0 3.7-1.6 3.7-3.7V265c0-2.1-1.6-3.7-3.7-3.7H344V247.7h35.5c2.1 0 3.7-1.6 3.7-3.7V230.9c0-2.1-1.6-3.7-3.7-3.7H344V213.5h35.5c2.1 0 3.7-1.6 3.7-3.7v-13c-.1-1.9-1.7-3.7-3.7-3.7zM512 93.4V419.4c-.1 51.2-42.1 92.7-93.4 92.6H92.6C41.4 511.9-.1 469.8 0 418.6V92.6C.1 41.4 42.2-.1 93.4 0H419.4c51.2 .1 92.7 42.1 92.6 93.4zM441.6 233.5c0-83.4-83.7-151.3-186.4-151.3s-186.4 67.9-186.4 151.3c0 74.7 66.3 137.4 155.9 149.3c21.8 4.7 19.3 12.7 14.4 42.1c-.8 4.7-3.8 18.4 16.1 10.1s107.3-63.2 146.5-108.2c27-29.7 39.9-59.8 39.9-93.1z" />
                </svg>
              </a>
            </div>
          </div>

          <BackLink fallback={`/category/${post.category}`} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

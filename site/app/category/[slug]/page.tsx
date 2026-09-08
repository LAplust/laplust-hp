import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import NewsList from '@/components/NewsList';
import HomeLink from '@/components/HomeLink';
import { getAllNews } from '@/lib/news';

// k04markw は現行サイトの「All」カテゴリのslug（URL維持のためそのまま使用）
const CATEGORIES = ['k04markw', 'company', 'technology', 'event', 'other'];

export function generateStaticParams() {
  return CATEGORIES.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const label = slug === 'k04markw' ? 'All' : slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `News - ${label}`,
    description:
      slug === 'k04markw'
        ? '株式会社LAplust（ラプラス）のすべてのニュース一覧です。'
        : `株式会社LAplust（ラプラス）の${label}カテゴリのニュース一覧です。`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!CATEGORIES.includes(slug)) notFound();
  const news = getAllNews().filter((n) => slug === 'k04markw' || n.categories.includes(slug));
  return (
    <>
      <SiteHeader />
      <main style={{ paddingTop: 'calc(var(--header-height) + 48px)' }}>
        <div className="container">
          <h1 className="page-title">News</h1>
          <NewsList items={news} activeCategory={slug} />
          <HomeLink />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

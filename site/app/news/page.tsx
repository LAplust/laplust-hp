import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import NewsList from '@/components/NewsList';
import HomeLink from '@/components/HomeLink';
import { getAllNews } from '@/lib/news';

export const metadata: Metadata = {
  title: 'News',
  description:
    '株式会社LAplust（ラプラス）のニュース一覧。プレスリリース、メディア掲載、イベント出展などの最新情報をお届けします。',
};

export default function NewsIndex() {
  const news = getAllNews();
  return (
    <>
      <SiteHeader />
      <main style={{ paddingTop: 'calc(var(--header-height) + 48px)' }}>
        <div className="container">
          <h1 className="page-title">News</h1>
          <NewsList items={news} activeCategory="k04markw" />
          <HomeLink />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

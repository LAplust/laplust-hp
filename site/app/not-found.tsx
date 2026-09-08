import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = { title: 'ページが見つかりません' };

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main
        style={{
          paddingTop: 'calc(var(--header-height) + 48px)',
          paddingBottom: 96,
          textAlign: 'center',
        }}
      >
        <div className="container">
          <h1 className="page-title">404 Not Found</h1>
          <p style={{ margin: '32px 0 8px', lineHeight: 2 }}>
            お探しのページが見つかりませんでした。
            <br />
            URLが変更されたか、削除された可能性があります。
          </p>
          <div style={{ marginTop: 40 }}>
            <Link href="/" className="btn-pill">
              TOPページへ
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

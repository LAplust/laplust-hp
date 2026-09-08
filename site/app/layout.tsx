import type { Metadata } from 'next';
import { Poppins, Noto_Sans_JP } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

const notoSansJp = Noto_Sans_JP({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://laplust.com'),
  title: {
    default: '株式会社LAplust（ラプラス）｜真の知能を実装し、人の活動を根底から支える',
    template: '%s｜株式会社LAplust（ラプラス）',
  },
  description:
    '株式会社LAplust（ラプラス）は、動画や画像解析に特化した機械学習/深層学習技術の研究開発を行い、実践知を蓄積し、課題解決するためのプロダクトを社会実装しています。',
  // 各ページの正規URLを自身のURLとして明示（'./'は現在のパスに解決される）
  alternates: { canonical: './' },
  openGraph: {
    type: 'website',
    siteName: '株式会社LAplust（ラプラス）',
    locale: 'ja_JP',
    // SNS等でシェアされた際に表示される既定画像（旧サイトと同一のロゴ画像）
    images: ['/images/og_default.png'],
  },
  twitter: { card: 'summary_large_image' },
};

const GTM_ID = 'GTM-K28LDCGJ';

// 本番ドメインでのみGTMを読み込む（localhost・NetlifyプレビューURLを計測から除外）
const GTM_SNIPPET = `(function(){
if(!/(^|\\.)laplust\\.com$/.test(location.hostname))return;
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // フォント変数は:rootで参照するため<html>側に付与する（bodyだと--font-en解決時に未定義になる）
    <html lang="ja" className={`${poppins.variable} ${notoSansJp.variable}`}>
      <head>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{ __html: GTM_SNIPPET }} />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}

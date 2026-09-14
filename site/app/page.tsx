import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import NewsCard from '@/components/NewsCard';
import ScrollReveal from '@/components/ScrollReveal';
import LazyVideo from '@/components/LazyVideo';
import { getAllNews } from '@/lib/news';
import styles from './page.module.css';

const GCS = '/assets/design/NxqgdRVEa1';

const ASSETS = {
  heroVideo: `${GCS}/s-1920x1080_576cb1c9-d182-4977-9867-6afddfd3aaac.mp4#t=0.01`,
  scrollIcon: `${GCS}/s-28x25_webp_baa795dc-01be-459e-92dd-b60493432a58.webp`,
  circle: `${GCS}/s-1346x1346_v-fms_webp_97709a95-ea9f-460a-9a0d-46f64a7db8b4_small.webp`,
  logo: `${GCS}/s-2400x635_v-frms_webp_3e014767-8a79-452d-96d8-a268976b0c55_small.webp`,
  arrowRight: `${GCS}/s-257x12_webp_6577ca90-af4b-4669-93e6-da6c721e394c.webp`,
  arrowLeft: `${GCS}/s-257x12_webp_1069f10d-b968-4a64-84f2-89cbd408cb75.webp`,
  ocaVideo: `${GCS}/s-1920x1080_c8ce9bb2-d528-4e03-bf3a-0a0e44aeefae.mp4#t=0.01`,
  laeyeVideo: `${GCS}/s-1920x1080_40ed8c41-691d-4c9c-979a-d4bddd00be99.mp4#t=0.01`,
  laeyeBand: `${GCS}/s-1244x701_v-fms_webp_442af2e0-c152-45cb-9243-5f954f0d81c0_middle.webp`,
  dxCard: `${GCS}/s-2400x1600_v-frms_webp_66cd531c-e6bf-438f-b7ee-04ade2fdc45e_small.webp`,
  agriCard: `${GCS}/s-2400x1800_v-frms_webp_6e6b4de8-78ca-48c9-8b16-b3d7ab542e51_small.webp`,
  techBand: `${GCS}/s-2400x927_v-frms_webp_393033b3-f8bc-4d61-8325-5ee8a3769b42.webp`,
};

// Google検索のリッチリザルト向け組織情報（構造化データ）
const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '株式会社LAplust',
  alternateName: 'LAplust, Inc.',
  url: 'https://laplust.com',
  logo: 'https://laplust.com/images/og_default.png',
};

export default function Home() {
  const news = getAllNews().slice(0, 3);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
      />
      <SiteHeader transparent />
      <ScrollReveal />
      <main>
        {/* ヒーロー */}
        <section className={styles.hero}>
          <video
            className={styles.heroVideo}
            src={ASSETS.heroVideo}
            poster="/images/posters/576cb1c9-d182-4977-9867-6afddfd3aaac.jpg"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className={styles.heroBody}>
            <h1 className={styles.heroTitle}>
              真の知能を実装し、
              <br />
              社会活動を根底から支える
            </h1>
            <p className={styles.heroSub}>
              Implementing Genuine Intelligence
              <br />
              to Fundamentally Support Social Activities
            </p>
            <Link href="/#business" className={styles.heroBtn}>
              Our Product
            </Link>
          </div>
          <Link href="/#news" className={styles.heroScroll} aria-label="下へスクロール">
            <img src={ASSETS.scrollIcon} alt="" />
          </Link>
        </section>

        {/* News */}
        <section className={styles.section} id="news" data-reveal>
          <div className="container">
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>News</h2>
              <Link href="/news" className={styles.viewMore}>
                View more
                <svg className="arrow-icon" viewBox="0 0 24 12" aria-hidden="true">
                  <path d="M0 6h22M16 1l6 5-6 5" />
                </svg>
              </Link>
            </div>
            <div className="news-grid" style={{ marginTop: 40 }}>
              {news.map((item) => (
                <NewsCard key={item.slug} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* Business */}
        <section className={styles.section} id="business">
          <div className="container">
            <h2 className={styles.sectionTitle} data-reveal>Business</h2>
            <p className={styles.businessLead} data-reveal>
              LAplustは、動画や画像解析に特化した機械学習/深層学習技術の研究開発を行い、実践知を蓄積し、課題解決するためのプロダクトを社会実装しています。
              Core Tech
              Interfaceに蓄積した実践知をLA-Eyeをはじめとするプロダクトや各課題に活用/直販し、2つの活動に好循環を生むことで、社会の活動を根底から支えます。
            </p>

            {/* 研究開発とプロダクトの循環図 */}
            <div className={styles.diagram} data-reveal>
              <div
                className={styles.diagramCircle}
                style={{ backgroundImage: `url(${ASSETS.circle})` }}
              >
                <p className={styles.diagramCircleLabel}>AI &amp; MLOps基盤</p>
                <p className={styles.diagramCircleTitle}>Core Tech Interface</p>
                <p className={styles.diagramCircleLabel}>研究開発</p>
              </div>
              <div className={styles.diagramCenter}>
                <p>社会実装/課題解決</p>
                <img src={ASSETS.arrowRight} alt="" />
                <img className={styles.diagramLogo} src={ASSETS.logo} alt="LAplust" />
                <img src={ASSETS.arrowLeft} alt="" />
                <p>実践知の蓄積</p>
              </div>
              <div
                className={styles.diagramCircle}
                style={{ backgroundImage: `url(${ASSETS.circle})` }}
              >
                <p className={styles.diagramCircleLabel}>社会課題&amp;ニーズ</p>
                <p className={styles.diagramCircleTitle}>LA-Eye</p>
                <p className={styles.diagramCircleLabel}>プロダクト</p>
              </div>
            </div>

            {/* プロダクト: ワンクリックアノテーション */}
            <div className={styles.productRow} data-reveal>
              <div className={styles.productVideo}>
                <LazyVideo
                  src={ASSETS.ocaVideo}
                  poster="/images/posters/c8ce9bb2-d528-4e03-bf3a-0a0e44aeefae.jpg"
                />
              </div>
              <div className={styles.productOverlay}>
                <h3 className={styles.productTitle}>LAplustワンクリックアノテーション</h3>
                <p className={styles.productKana}>ラプラスワンクリックアノテーション</p>
                <p className={styles.productDesc}>
                  画像アノテーションに掛る作業時間を99％削減し、同時に教師データの品質を大幅に改善し精度向上に貢献
                </p>
                <Link href="/la-oca" className={styles.whiteBtn}>
                  View more
                </Link>
              </div>
            </div>

            {/* プロダクト: LA-Eye/不良品判定 */}
            <div className={styles.productRow} data-reveal>
              <div className={styles.productVideo}>
                <LazyVideo
                  src={ASSETS.laeyeVideo}
                  poster="/images/posters/40ed8c41-691d-4c9c-979a-d4bddd00be99.jpg"
                />
              </div>
              <div className={styles.productOverlay}>
                <h3 className={styles.productTitle}>LA-Eye/不良品判定</h3>
                <p className={styles.productKana}>エル エーアイ</p>
                <p className={styles.productDesc}>
                  LA-Eyeとエッジコンピュータを連動。位置ずれしても、反射しても正しく判定。不良品の排出まで自動化し省人化もサポート。
                </p>
                <Link href="/la-eye" className={styles.whiteBtn}>
                  View more
                </Link>
              </div>
            </div>

            {/* LA-Eye 紹介バンド */}
            <div
              data-reveal
              className={styles.laeyeBand}
              style={{ backgroundImage: `url(${ASSETS.laeyeBand})` }}
            >
              <h3 className={styles.laeyeBandTitle}>LA-Eye</h3>
              <p className={styles.laeyeBandKana}>エル エーアイ</p>
              <p className={styles.laeyeBandDesc}>
                課題に合わせてカスタマイズ/ODM提供を行う目的特化の画像解析AI構築ツール。AIの構築・現場導入におけるアノテーションの手間を大きく引き下げ、検証から運用までのトータルコストと時間を最小化
              </p>
              <a
                href="https://laplust.notion.site/LA-Eye-259c08e5f34c80a6affbf5e959f0367a"
                target="_blank"
                rel="noopener"
                className={styles.whiteBtn}
              >
                View more
              </a>
            </div>

            {/* 事業リンクカード */}
            <div className={styles.bizCards} data-reveal>
              <Link href="/dx_system" className={styles.bizCard}>
                <div
                  className={styles.bizCardImage}
                  style={{ backgroundImage: `url(${ASSETS.dxCard})` }}
                />
                <p className={styles.bizCardTitle}>DX支援AIシステム開発</p>
                <p className={styles.bizCardDesc}>
                  業務効率化とデータ活用を自動化・最適化するAIソリューションを提供します。
                </p>
              </Link>
              <Link href="/agritech" className={styles.bizCard}>
                <div
                  className={styles.bizCardImage}
                  style={{ backgroundImage: `url(${ASSETS.agriCard})` }}
                />
                <p className={styles.bizCardTitle}>アグリテック</p>
                <p className={styles.bizCardDesc}>
                  業務効率化とデータ活用を自動化・最適化するAIソリューションを提供します。
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Technology */}
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle} data-reveal>Technology</h2>
            <div
              data-reveal
              className={styles.techBand}
              style={{ backgroundImage: `url(${ASSETS.techBand})` }}
            >
              <h3 className={styles.techBandTitle}>Core Tech Interface</h3>
              <p className={styles.techBandDesc}>
                共同研究・協業・現場課題の解決を加速するLAplust独自の技術基盤。MLOpsに必要な要素をモジュール化し、動画・画像解析AIをはじめとする多様な用途に展開。
              </p>
              <Link href="/technology" className={styles.techBandBtn}>
                View more
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CompanyContent from '@/components/CompanyContent';

// 現行サイト（Studio CMS）のCompanyページ群のURLをそのまま踏襲する
const SLUGS = ['1lp39toq', 'itkwppf3', 'ubdeqazo'];

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

// タブごとのタイトル・説明文（URLは現行サイト踏襲のためランダム文字列のまま）
const META: Record<string, { title: string; description: string }> = {
  '1lp39toq': {
    title: 'Company - 経営方針',
    description:
      '株式会社LAplust（ラプラス）の経営方針。長崎を拠点に、AI・ロボット技術で一次産業と製造業の課題解決に取り組んでいます。',
  },
  itkwppf3: {
    title: 'Company - 会社情報',
    description: '株式会社LAplust（ラプラス）の会社情報。所在地・設立・事業内容をご紹介します。',
  },
  ubdeqazo: {
    title: 'Company - メンバー',
    description: '株式会社LAplust（ラプラス）のメンバー紹介。経営陣・スタッフをご紹介します。',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = META[slug];
  if (!meta) return { title: 'Company' };
  return {
    title: meta.title,
    description: meta.description,
    // 経営方針タブは /company と同一内容のため、/company を正規URLとする
    ...(slug === '1lp39toq' ? { alternates: { canonical: '/company' } } : {}),
  };
}

export default async function BcmPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!SLUGS.includes(slug)) notFound();
  return <CompanyContent tabSet="bcm" activeKey={slug} />;
}

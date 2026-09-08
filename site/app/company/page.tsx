import type { Metadata } from 'next';
import CompanyContent from '@/components/CompanyContent';

export const metadata: Metadata = {
  title: 'Company',
  description:
    '株式会社LAplust（ラプラス）の会社概要。経営方針・会社情報・メンバーをご紹介します。長崎を拠点に、AI・ロボット技術で一次産業と製造業の課題解決に取り組んでいます。',
};

export default function CompanyPage() {
  return <CompanyContent tabSet="company" activeKey="management" />;
}

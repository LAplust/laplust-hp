import type { Metadata } from 'next';
import PolicyPage from '@/components/PolicyPage';

export const metadata: Metadata = {
  title: 'Site Policy',
  description:
    '株式会社LAplust（ラプラス）のサイトポリシー。当ウェブサイトのご利用条件について定めています。',
};

export default function SitePolicyPage() {
  return <PolicyPage title="Site Policy" file="site_policy" />;
}

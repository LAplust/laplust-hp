import type { Metadata } from 'next';
import PolicyPage from '@/components/PolicyPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    '株式会社LAplust（ラプラス）のプライバシーポリシー。個人情報の取り扱い方針について定めています。',
};

export default function PrivacyPolicyPage() {
  return <PolicyPage title="Privacy Policy" file="privacy_policy" />;
}

import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'サービスお問い合わせ',
};

const TYPE_OPTIONS = [
  'サービスに関するお問合せ',
  'お申し込み・プランに関するお問合せ',
  'パートナーシップ・共同研究に関するお問合せ',
  '採用に関するお問合せ',
  '取材・講演に関するお問合せ',
  'その他のお問合せ',
];

const SERVICE_OPTIONS = ['LA-Eye', 'LAplust ワンクリックアノテーション', 'その他'];

export default function LaEyeContactPage() {
  return (
    <>
      <SiteHeader />
      <main style={{ paddingTop: 'calc(var(--header-height) + 48px)', paddingBottom: 96 }}>
        <div className="container">
          <h1 className="page-title">Contact</h1>
          <ContactForm
            formName="la-eye-contact"
            typeOptions={TYPE_OPTIONS}
            serviceOptions={SERVICE_OPTIONS}
            requireCompany
            requireTel
            lead={
              <p>
                下記フォームへ必要事項をご記入の上、送信してください。3営業以内に担当者からご返答いたします。お電話からのご相談も承っておりますのでご連絡ください。
              </p>
            }
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

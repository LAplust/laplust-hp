'use client';

import { useState } from 'react';
import Link from 'next/link';
import { submitForm } from '@/lib/submitForm';

export default function ContactForm({
  lead,
  typeOptions,
  serviceOptions,
  requireCompany = false,
  requireTel = false,
}: {
  // フォーム上部の案内文（送信完了後は表示しない）
  lead?: React.ReactNode;
  // 記録先はGAS側で「お問い合わせ」シートに統一（送信元はpage列で判別）
  formName?: string;
  typeOptions: string[];
  // サービス選択ラジオ（LA-Eye用フォームのみ）
  serviceOptions?: string[];
  requireCompany?: boolean;
  requireTel?: boolean;
}) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    if (data['メールアドレス'] !== data['メールアドレス（確認）']) {
      setError('メールアドレスが一致しません。');
      return;
    }
    setError('');
    setStatus('sending');
    try {
      // /contact と /la-eye/contact で同じ「お問い合わせ」シートに記録する
      // （送信元は page 列と該当サービス列で判別できる）
      await submitForm('お問い合わせ', data);
      setStatus('done');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      {/* 現行版準拠: 完了時はフォームの上に紺色半透過のモーダルを重ねる */}
      {status === 'done' && (
        <div className="form-done" role="dialog" aria-modal="true" aria-label="お問い合わせ完了">
          <div className="form-done__panel">
            <button
              type="button"
              className="form-done__close"
              aria-label="閉じる"
              onClick={() => setStatus('idle')}
            >
              ×
            </button>
            <p className="form-done__title">お問い合わせが完了しました</p>
            <p className="form-done__lead">
              このたびは、当社へお問い合わせいただき有難うございます。
              <br />
              弊社でお問い合わせ内容を確認の上、3営業日以内にお返事いたします。
            </p>
            <Link href="/" className="form-done__btn">
              TOPページへ
            </Link>
          </div>
        </div>
      )}
      {lead && <div style={{ maxWidth: 640, margin: '40px auto 48px' }}>{lead}</div>}
      <form className="form" onSubmit={onSubmit}>
      {serviceOptions && (
        <div className="form__field">
          <span className="form__label">
            該当するサービスをお選びください<span className="req">*</span>
          </span>
          {serviceOptions.map((s) => (
            <label key={s} className="form__checkbox" style={{ marginTop: 8 }}>
              <input type="radio" name="該当サービス" value={s} required />
              <span>{s}</span>
            </label>
          ))}
        </div>
      )}
      <div className="form__field">
        <label className="form__label" htmlFor="type">
          お問い合わせ種別<span className="req">*</span>
        </label>
        <select id="type" name="お問い合わせ種別" className="form__select" required defaultValue="">
          <option value="" disabled>
            選択してください
          </option>
          {typeOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div className="form__field">
        <label className="form__label" htmlFor="name">
          お名前 (漢字)<span className="req">*</span>
        </label>
        <input
          id="name"
          name="お名前"
          type="text"
          className="form__input"
          placeholder="お名前を入力してください"
          required
        />
      </div>
      <div className="form__field">
        <label className="form__label" htmlFor="company">
          会社名{requireCompany && <span className="req">*</span>}
        </label>
        <input
          id="company"
          name="会社名"
          type="text"
          className="form__input"
          placeholder="会社名を入力してください"
          required={requireCompany}
        />
      </div>
      <div className="form__field">
        <label className="form__label" htmlFor="email">
          メールアドレス<span className="req">*</span>
        </label>
        <input
          id="email"
          name="メールアドレス"
          type="email"
          className="form__input"
          placeholder="mail@example.com"
          required
        />
      </div>
      <div className="form__field">
        <label className="form__label" htmlFor="email2">
          メールアドレス（確認）<span className="req">*</span>
        </label>
        <input
          id="email2"
          name="メールアドレス（確認）"
          type="email"
          className="form__input"
          placeholder="mail@example.com"
          required
        />
      </div>
      <div className="form__field">
        <label className="form__label" htmlFor="tel">
          電話番号{requireTel && <span className="req">*</span>}
        </label>
        <input
          id="tel"
          name="電話番号"
          type="tel"
          className="form__input"
          placeholder="09012345678"
          required={requireTel}
        />
      </div>
      <div className="form__field">
        <label className="form__label" htmlFor="body">
          お問い合わせ内容<span className="req">*</span>
        </label>
        <textarea
          id="body"
          name="お問い合わせ内容"
          className="form__textarea"
          placeholder="お問い合わせ内容を入力してください"
          required
        />
      </div>
      {/* honeypot（スパム対策・画面には表示されない） */}
      <div className="form__hp" aria-hidden="true">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="form__checkbox">
        <input type="checkbox" name="プライバシーポリシー同意" required />
        <span>
          <Link href="/privacy_policy" target="_blank">
            プライバシーポリシー
          </Link>
          に同意する
        </span>
      </label>
      {error && <p className="form__error">{error}</p>}
      {status === 'error' && (
        <p className="form__error">
          送信に失敗しました。時間をおいて再度お試しください。
        </p>
      )}
      <button type="submit" className="btn-pill form__submit" disabled={status === 'sending'}>
        {status === 'sending' ? '送信中…' : '送信'}
      </button>
      </form>
    </>
  );
}

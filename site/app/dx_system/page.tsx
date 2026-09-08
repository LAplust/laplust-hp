import type { Metadata } from 'next';
import ProjectListPage from '@/components/ProjectListPage';

export const metadata: Metadata = {
  title: 'DX支援システム開発 プロジェクト一覧',
  description:
    '株式会社LAplust（ラプラス）のDX支援システム開発 プロジェクト一覧。AI・画像解析を活用した業務効率化・システム開発の取り組みをご紹介します。',
};

export default function DxSystemPage() {
  return (
    <ProjectListPage
      category="DX支援システム開発"
      lead="業務効率化とデータ活用を自動化・最適化するAIソリューションを提供します。"
      projects={[
        { title: '【日本全国導入】電波鉄塔点検時の報告書作成工数削減', slug: 'report_saver' },
        { title: '【工場業務改革】生産実績収集システム', slug: 'production_system' },
        { title: '【即日着手】生産性向上DX研修', slug: 'dx_training' },
        { title: '【開発中】稼働実績収集AIカメラ', slug: 'ai_camera' },
        { title: '短期変動予測AI', slug: 'forecast_ai' },
      ]}
      extraLinks={[
        { title: 'パートナーシップ構築宣言', slug: 'partnership_declaration' },
        { title: 'DX推進に関するレポート', slug: 'dx_report' },
      ]}
    />
  );
}

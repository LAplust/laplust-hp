/**
 * HPフォーム受信スクリプト（Google Apps Script）
 *
 * サイトの3フォーム（お問い合わせ / LA-OCA無料申し込み / LA-Eye資料請求）からの
 * 送信を受け取り、このスクリプトが紐づくスプレッドシートへ1行ずつ追記し、
 * 担当者へ通知メールを送る。
 *
 * 導入手順は docs/260903_フォームSheets連携手順.md を参照。
 */

// ====== 設定 ======
const NOTIFY_EMAIL = 'info@laplust.com'; // 通知先（カンマ区切りで複数可）
const SEND_NOTIFICATION = true; // 通知メールを送らない場合は false

// 自動返信（訪問者宛ての受付完了メール）
const SEND_AUTO_REPLY = true;
const REPLY_FROM = 'info@laplust.com'; // Gmailの「他のメールアドレスから送信」に登録済みのエイリアス
const REPLY_NAME = '(自動返信)株式会社LAplust';
const REPLY_SIGNATURE = [
  '------------------------------------',
  '株式会社LAplust（ラプラス）',
  'Mail: info@laplust.com',
  'Web: https://laplust.com',
  '------------------------------------',
].join('\n');

// フォームごとの自動返信文（件名 / 冒頭文）
const REPLY_TEMPLATES = {
  'お問い合わせ': {
    subject: '【株式会社LAplust】お問い合わせを受け付けました',
    lead: 'この度はお問い合わせいただき、誠にありがとうございます。\n以下の内容で受け付けました。3営業日以内に担当者よりご返答いたします。',
  },
  'LA-OCA無料申し込み': {
    subject: '【株式会社LAplust】無料プランのお申し込みを受け付けました',
    lead: 'この度はLAplustワンクリックアノテーション無料プランにお申し込みいただき、誠にありがとうございます。\n以下の内容で受け付けました。内容を確認のうえ、担当者よりご連絡いたします。',
  },
  'LA-Eye資料請求': {
    subject: '【株式会社LAplust】資料請求を受け付けました',
    lead: 'この度はLA-Eyeの資料をご請求いただき、誠にありがとうございます。\n以下の内容で受け付けました。担当者より資料ダウンロードのご案内をお送りしますので、今しばらくお待ちください。',
  },
};

// ====== 営業メール判定 ======
// 人力入力の営業投稿はhoneypotでは防げないため、キーワードのスコア方式で判定する。
// 判定しても受付・シート記録・自動返信は通常どおり行い、担当者通知の件名だけを
// 仕分けする（誤判定で本物のお客様を見逃さないため）。
const SALES_CHECK_ENABLED = true;
const SALES_THRESHOLD = 3; // 合計スコアがこの値以上で「営業の可能性」と判定

// 強いシグナル（1ヒット2点）: 営業定型句・売り込み特有の言い回し
const SALES_KEYWORDS_STRONG = [
  '突然のご連絡',
  '突然のメール',
  '突然のお問い合わせ',
  '貴社ますます',
  '時下ますます',
  'ご提案の機会',
  'ご紹介の機会',
  'お打ち合わせの機会',
  'アポイント',
  '商談',
  '成果報酬',
  '完全成功報酬',
  'テレアポ',
  '営業代行',
  '集客支援',
  '集客代行',
  '販路拡大',
  '営業支援',
  '採用支援',
  '採用総合支援',
  '広告運用',
  'リード獲得',
  '無料トライアル',
  'ウェビナー',
  '15分ほど',
  '30分ほど',
  'ご都合のよろしい日時',
  '日程調整',
];

// 弱いシグナル（1ヒット1点）: 営業文でよく使われるが通常の問い合わせにも現れうる語
const SALES_KEYWORDS_WEAK = [
  'ご担当者様',
  '経営者様',
  '代表者様',
  '御社',
  'サービスのご案内',
  'ご案内させていただき',
  'ご提案させていただき',
  'お力になれ',
  '導入実績',
  'キャンペーン',
];

// 全項目のテキストを対象にスコアリングし、判定結果を返す
function checkSales(p, columns) {
  if (!SALES_CHECK_ENABLED) return { sales: false, score: 0, hits: [] };
  const text = columns.map((c) => String(p[c] || '')).join('\n');
  let score = 0;
  const hits = [];
  SALES_KEYWORDS_STRONG.forEach((k) => {
    if (text.indexOf(k) !== -1) {
      score += 2;
      hits.push(k);
    }
  });
  SALES_KEYWORDS_WEAK.forEach((k) => {
    if (text.indexOf(k) !== -1) {
      score += 1;
      hits.push(k);
    }
  });
  // 種別「その他のお問合せ」は営業投稿に多い（それ単独では判定しない）
  if (String(p['お問い合わせ種別'] || '').indexOf('その他') !== -1) {
    score += 1;
  }
  return { sales: score >= SALES_THRESHOLD, score: score, hits: hits };
}

// フォームごとのシート名と列の並び（フォーム側の form_name と一致させる）
const FORMS = {
  'お問い合わせ': [
    'お名前',
    '会社名',
    'メールアドレス',
    '電話番号',
    'お問い合わせ種別',
    '該当サービス',
    'お問い合わせ内容',
  ],
  'LA-OCA無料申し込み': ['メールアドレス'],
  'LA-Eye資料請求': ['お名前', '会社名', 'メールアドレス', '電話番号', '資料請求目的'],
};

function doPost(e) {
  try {
    const p = e.parameter || {};

    // honeypot（スパム対策）: 隠しフィールドに入力があれば黙って成功を返す
    if (p.website) {
      return jsonResponse({ ok: true });
    }

    const formName = p.form_name;
    const columns = FORMS[formName];
    if (!columns) {
      return jsonResponse({ ok: false, error: 'unknown form' });
    }

    // シートを取得（無ければヘッダー付きで自動作成）
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(formName);
    if (!sheet) {
      sheet = ss.insertSheet(formName);
      sheet.appendRow(['受信日時', ...columns, '送信元ページ', '営業判定']);
      sheet.getRange(1, 1, 1, columns.length + 3).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    const now = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
    const salesCheck = checkSales(p, columns);
    const salesLabel = salesCheck.sales ? `営業の可能性（スコア${salesCheck.score}）` : '';
    const row = [now, ...columns.map((c) => p[c] || ''), p.page || '', salesLabel];
    // appendRowは書式を無視して数値変換する（電話番号の先頭0が消える）ため、
    // 行の書式を「テキスト」にしてからsetValuesで書き込む
    const rowIdx = sheet.getLastRow() + 1;
    const range = sheet.getRange(rowIdx, 1, 1, row.length);
    range.setNumberFormat('@');
    range.setValues([row]);
    // 既存シートに「営業判定」ヘッダーが無ければ追加（列位置: 送信元ページの右）
    const salesHeaderCell = sheet.getRange(1, row.length);
    if (salesHeaderCell.getValue() === '') {
      salesHeaderCell.setValue('営業判定').setFontWeight('bold');
    }

    // 訪問者への自動返信（失敗しても受付自体は成功として扱う）
    let replyStatus = '無効';
    const visitorEmail = String(p['メールアドレス'] || '').trim();
    const template = REPLY_TEMPLATES[formName];
    if (SEND_AUTO_REPLY && template && visitorEmail) {
      try {
        const replyBody = [
          `${p['お名前'] ? p['お名前'] + ' 様' : 'ご担当者様'}`,
          '',
          template.lead,
          '',
          '＜ご送信内容＞',
          ...columns.map((c) => `【${c}】${p[c] || '(未入力)'}`),
          `受信日時: ${now}`,
          '',
          '※本メールはシステムによる自動送信です。',
          'お心当たりのない場合は、このメールを破棄してください。',
          '',
          REPLY_SIGNATURE,
        ].join('\n');
        GmailApp.sendEmail(visitorEmail, template.subject, replyBody, {
          from: REPLY_FROM,
          name: REPLY_NAME,
        });
        replyStatus = '送信済み';
      } catch (replyErr) {
        replyStatus = '失敗: ' + String(replyErr);
      }
    }

    if (SEND_NOTIFICATION && NOTIFY_EMAIL) {
      const body = [
        `HPの「${formName}」フォームに新しい送信がありました。`,
        '',
        ...(salesCheck.sales
          ? [
              `▼営業投稿の可能性があります（スコア${salesCheck.score} / 検出語: ${salesCheck.hits.join('、')}）`,
              '',
            ]
          : []),
        ...columns.map((c) => `【${c}】\n${p[c] || '(未入力)'}`),
        '',
        `受信日時: ${now}`,
        `送信元ページ: ${p.page || '-'}`,
        `自動返信: ${replyStatus}`,
        '',
        `スプレッドシート: ${ss.getUrl()}`,
      ].join('\n');
      // 営業と判定した通知は件名の先頭で仕分けする（Gmailフィルタで
      // 「件名: 【営業の可能性】」→ラベル付与＋受信トレイをスキップ、が可能）
      const subjectPrefix = salesCheck.sales ? '【営業の可能性】' : '';
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: `${subjectPrefix}【HP】${formName}フォームの新着（${p['お名前'] || p['メールアドレス'] || ''}）`,
        body: body,
      });
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

// 実行アカウントで差出人に使えるエイリアス一覧を実行ログに表示する
function logAliases() {
  Logger.log('利用可能なエイリアス: ' + JSON.stringify(GmailApp.getAliases()));
}

// 権限承認＆自動返信の動作確認用: エディタでこの関数を選んで「実行」すると、
// 承認ダイアログが表示され、承認後にNOTIFY_EMAIL宛へテストメールが届く
function testAutoReply() {
  GmailApp.sendEmail(NOTIFY_EMAIL, '【テスト】自動返信の権限確認', 'エイリアス送信の権限確認テストです。このメールが届いていれば設定完了です。', {
    from: REPLY_FROM,
    name: REPLY_NAME,
  });
}

// 営業判定ロジックの動作確認用: エディタでこの関数を選んで「実行」すると、
// 典型的な営業文と通常の問い合わせ文の判定結果が実行ログに表示される
function testSalesCheck() {
  const cols = FORMS['お問い合わせ'];
  const salesSample = {
    'お名前': '営業 太郎',
    'お問い合わせ種別': 'その他のお問合せ',
    'お問い合わせ内容':
      '突然のご連絡失礼いたします。採用支援サービスのご案内です。一度30分ほどお打ち合わせの機会をいただけますと幸いです。',
  };
  const normalSample = {
    'お名前': '顧客 花子',
    'お問い合わせ種別': 'サービスに関するお問合せ',
    'お問い合わせ内容': 'LA-Eyeの導入について、既存設備との連携が可能か教えてください。',
  };
  Logger.log('営業サンプル: ' + JSON.stringify(checkSales(salesSample, cols)));
  Logger.log('通常サンプル: ' + JSON.stringify(checkSales(normalSample, cols)));
}

// 動作確認用（ブラウザでWebアプリURLを開いたとき）
function doGet() {
  return jsonResponse({ ok: true, message: 'form receiver is running' });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

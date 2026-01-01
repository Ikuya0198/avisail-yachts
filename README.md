# Avisail Yachts - 高級日本ヨット販売サイト

日本の中古ヨットを世界中の富裕層バイヤー向けに紹介するラグジュアリーサイト。

## プロジェクト概要

**Avisail** には2つのサイトがあります：

| サイト | 用途 | URL |
|--------|------|-----|
| **Avisail Vessels** | 作業船（タンカー、タグボート、漁船） | https://avisail-vessel-trading.vercel.app |
| **Avisail Yachts** | 高級ヨット（本リポジトリ） | https://avisail-yachts.vercel.app |

## デザインコンセプト

- **ダークテーマ**: ネイビー背景 (#0A1628) + ゴールドアクセント (#D4AF37)
- **ラグジュアリー感**: Playfair Display セリフフォント、控えめなアニメーション
- **ターゲット**: 富裕層・ヨット愛好家

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router), React 19, TypeScript
- **スタイリング**: Tailwind CSS 4 + カスタムテーマ変数
- **デプロイ**: Vercel
- **スクレイパー**: Python (BeautifulSoup4, Pydantic)

## ディレクトリ構成

```
avisail-yachts/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # ヘッダー・フッター・メタデータ
│   │   ├── page.tsx        # ランディングページ
│   │   └── globals.css     # テーマ変数・カスタムスタイル
│   └── data/
│       └── yachts.json     # ヨットデータ（スクレイピング結果）
├── scraper/
│   ├── main.py             # スクレイパー実行スクリプト
│   ├── models.py           # データモデル定義
│   ├── requirements.txt    # Python依存関係
│   └── sources/
│       ├── base.py         # 基底スクレイパークラス
│       ├── aokiyacht.py    # 青木ヨット
│       ├── boatworld.py    # BoatWorld Japan
│       └── chukotei.py     # 中古艇ドットコム
└── public/                 # 静的ファイル
```

## スクレイピング対象サイト

| サイト | URL | 特徴 |
|--------|-----|------|
| 青木ヨット | https://www.aokiyacht.com/usedboat/ | セーリングヨット専門、整備済み中古艇 |
| BoatWorld | https://www.boatworld.jp/ | モーターボート、クルーザー |
| 中古艇ドットコム | https://www.chukotei.com/ | 日本最大の中古艇マーケットプレイス |

## スクレイパーの使い方

```bash
cd scraper

# 依存関係インストール
pip install -r requirements.txt

# 全サイトからスクレイピング（各サイト最大20件）
python main.py --max-items 20

# 特定サイトのみ
python main.py --source aoki --max-items 10

# 出力先を指定
python main.py --output ../src/data/yachts.json
```

## データモデル

### Yacht (ヨット)

```typescript
{
  id: string,              // 一意ID
  source: string,          // データソース (aokiyacht, boatworld, chukotei)
  source_url: string,      // 元サイトURL
  name: string,            // ヨット名
  name_en: string,         // 英語名
  yacht_type: string,      // sailing, motor, catamaran, cruiser
  maker: string,           // メーカー (Beneteau, YAMAHA, etc.)
  model: string,           // モデル名
  price: number,           // 価格（円）
  price_currency: string,  // JPY
  length_m: number,        // 全長（メートル）
  length_ft: number,       // 全長（フィート）
  year_built: number,      // 建造年
  engine_maker: string,    // エンジンメーカー
  horsepower: number,      // 馬力
  rig_type: string,        // リグタイプ（Sloop等）
  location: string,        // 保管場所
  images: string[],        // 画像URL配列
  status: string,          // available, negotiating, sold, incoming
}
```

## カスタムスタイル

`globals.css` で定義されたテーマ変数：

```css
:root {
  --gold: #D4AF37;         /* メインアクセント */
  --gold-light: #E5C76B;   /* ホバー時 */
  --gold-dark: #B8960C;    /* グラデーション */
  --navy: #0A1628;         /* 背景 */
  --navy-light: #152238;   /* カード背景 */
}
```

## 開発

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番起動
npm start
```

## 変更履歴

### 2026-01-01
- **初回リリース**
  - ダークテーマのランディングページ作成
  - ヒーローセクション、コレクション、サービス、コンタクトセクション
  - 3サイト用スクレイパー基盤構築（青木ヨット、BoatWorld、中古艇ドットコム）
  - サンプルヨットデータ10件追加
  - Vercelデプロイ完了
  - 作業船サイトとの相互リンクボタン追加

## 関連リポジトリ

- [avisail-vessel-trading](https://github.com/Ikuya0198/avisail-vessel-trading) - 作業船サイト
- [avisail-platform](https://github.com/Ikuya0198/avisail-platform) - バックエンドAPI

## お問い合わせ

- Email: yachts@avisail.com
- WhatsApp: +81 70-9310-1362

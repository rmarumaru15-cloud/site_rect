// src/data/portfolioData.js

export const dummyPortfolioData = {
  totalValue: 585000,
  dailyChange: 5200, // 前日比（円）
  dailyChangeRate: 0.0089, // 前日比率
  weeklyChange: 15700,
  monthlyChange: 35000,
  quarterlyChange: 65000, // 3か月
  semiannualChange: 80000, // 半年
  yearlyChange: 125000,
  twoYearChange: 205000,
  fiveYearChange: 350000,
};

export const dummyAssetDistribution = [
  { id: 'cash', value: 150000, label: '現金', color: '#1976d2' },
  { id: 'stocks', value: 250000, label: '株式', color: '#dc004e' },
  { id: 'investmentTrusts', value: 100000, label: '投資信託', color: '#3f51b5' },
  { id: 'crypto', value: 85000, label: '暗号資産', color: '#ff9800' },
  { id: 'foreignCurrency', value: 0, label: '外貨', color: '#4caf50' },
];

export const dummyInvestmentRegion = [
  { id: 'japan', value: 100000, label: '日本', color: '#e53935' },
  { id: 'northAmerica', value: 120000, label: '北米', color: '#3f51b5' },
  { id: 'europe', value: 30000, label: '欧州', color: '#ff9800' },
  { id: 'emerging', value: 25000, label: '新興国', color: '#6a1b9a' },
  { id: 'commodity', value: 25000, label: 'コモディティ', color: '#4caf50' },
  { id: 'balance', value: 50000, label: '地域バランス', color: '#ff5722' },
  { id: 'other', value: 0, label: 'その他', color: '#616161' },
];

export const dummyPortfolioHistory = {
  daily: {
    dates: ['2025-07-31', '2025-08-01'],
    total: [580000, 585000],
    stocks: [248000, 250000],
    investmentTrusts: [99500, 100000],
    crypto: [82000, 85000],
    cash: [150500, 150000],
  },
  weekly: {
    dates: ['7/26', '7/27', '7/28', '7/29', '7/30', '7/31', '8/1'],
    total: [569300, 572000, 575500, 578000, 580000, 582000, 585000],
    stocks: [240000, 241000, 243000, 245000, 248000, 249000, 250000],
    investmentTrusts: [98000, 98500, 99000, 99200, 99500, 99800, 100000],
    crypto: [80000, 81000, 82000, 83000, 82000, 83200, 85000],
    cash: [151300, 151500, 151500, 150800, 150500, 150000, 150000],
  },
  monthly: {
    dates: ['7/1', '7/8', '7/15', '7/22', '7/29', '8/1'],
    total: [550000, 560000, 565000, 575000, 580000, 585000],
    stocks: [240000, 242000, 245000, 247000, 248000, 250000],
    investmentTrusts: [99000, 99200, 99500, 99600, 99800, 100000],
    crypto: [95000, 90000, 88000, 85000, 82000, 85000],
    cash: [100000, 100000, 100000, 103400, 105200, 150000],
  },
};

export const dummyAssetList = [
  {
    id: 1,
    name: 'トヨタ自動車 (7203)',
    type: '株式',
    region: '日本',
    location: 'SBI証券',
    quantity: 100,
    acquisitionDate: '2024-05-15',
    acquisitionPrice: 2000,
    currentPrice: 2450,
    dailyChange: 1200,
    dailyChangeRate: 0.005,
  },
  {
    id: 2,
    name: 'eMAXIS Slim 全世界株式(オール・カントリー)',
    type: '投資信託',
    region: '地域バランス', // ★変更：地域を「地域バランス」に
    location: '楽天証券',
    quantity: 50,
    acquisitionDate: '2024-06-20',
    acquisitionPrice: 1800,
    currentPrice: 2000,
    dailyChange: 500,
    dailyChangeRate: 0.005,
  },
  {
    id: 3,
    name: 'Bitcoin',
    type: '暗号資産',
    region: 'その他',
    location: 'Coincheck',
    quantity: 0.025,
    acquisitionDate: '2024-07-10',
    acquisitionPrice: 2800000,
    currentPrice: 3400000,
    dailyChange: 3500,
    dailyChangeRate: 0.042,
  },
  {
    id: 4,
    name: '三菱UFJ銀行 (8306)',
    type: '株式',
    region: '日本',
    location: 'SBI証券',
    quantity: 200,
    acquisitionDate: '2024-04-01',
    acquisitionPrice: 1500,
    currentPrice: 1650,
    dailyChange: 200,
    dailyChangeRate: 0.002,
  },
  {
    id: 5,
    name: 'SPDR S&P 500 ETF (SPY)',
    type: '株式',
    region: '北米',
    location: 'SBI証券',
    quantity: 15,
    acquisitionDate: '2024-03-25',
    acquisitionPrice: 50000,
    currentPrice: 52000,
    dailyChange: 800,
    dailyChangeRate: 0.016,
  },
  {
    id: 6,
    name: '現金',
    type: '現金',
    region: '日本', // 現金も地域を付与
    location: '三菱UFJ銀行',
    quantity: 150000,
    acquisitionDate: '2024-01-01',
    acquisitionPrice: 1,
    currentPrice: 1,
    dailyChange: 0,
    dailyChangeRate: 0,
  },
];
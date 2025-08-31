import { createTheme } from '@mui/material/styles';

// ライトモードのテーマ設定
export const lightTheme = createTheme({
  palette: {
    mode: 'light', // ライトモードを指定
    primary: {
      main: '#1976d2', // メインカラー（MUIのデフォルト青系）
    },
    secondary: {
      main: '#dc004e', // サブカラー（MUIのデフォルト赤系）
    },
    background: {
      default: '#f4f6f8', // アプリケーションのデフォルト背景色
      paper: '#ffffff', // カードなどの要素の背景色
    },
    text: {
      primary: '#212121', // 主要テキストの色
      secondary: '#757575', // 副次的なテキストの色
    },
  },
  typography: {
    fontFamily: [
      'Noto Sans JP', // 日本語フォントを優先
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

// ダークモードのテーマ設定
export const darkTheme = createTheme({
  palette: {
    mode: 'dark', // ダークモードを指定
    primary: {
      main: '#90caf9', // ライトモードのprimary.mainに対応する明るい青
    },
    secondary: {
      main: '#f48fb1', // ライトモードのsecondary.mainに対応する明るい赤
    },
    background: {
      default: '#121212', // アプリケーションのデフォルト背景色
      paper: '#1d1d1d', // カードなどの要素の背景色
    },
    text: {
      primary: '#ffffff', // 主要テキストの色
      secondary: '#b0b0b0', // 副次的なテキストの色
    },
  },
  typography: {
    fontFamily: [
      'Noto Sans JP',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});
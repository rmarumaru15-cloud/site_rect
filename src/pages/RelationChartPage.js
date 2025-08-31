// src/pages/RelationChartPage.js
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { Link as RouterLink } from 'react-router-dom'; // React RouterのLink

import { profiles } from '../data/profiles'; // プロフィールデータをインポート

function RelationChartPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        運営者相関図
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 6 }}>
        愚人亭を運営するメンバーとその関係性をご紹介します。画像をクリックすると詳細プロフィールをご覧いただけます。
      </Typography>

      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {/* 例えば、運営者Aと運営者Bを並べ、その間に何らかの関連性を示す要素を入れる */}

        {/* 運営者Aのカード */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            component={RouterLink} // カード全体をリンクにする
            to={`/profile/${profiles[0].id}`} // 最初のプロフィールのIDにリンク
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 3,
              textDecoration: 'none', // リンクの下線をなくす
              color: 'inherit', // テキスト色を継承
              '&:hover': {
                boxShadow: 6, // ホバーで影を強調
                transform: 'translateY(-5px)', // 少し浮き上がらせる
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              },
            }}
          >
            <Avatar alt={profiles[0].name} src={profiles[0].avatar} sx={{ width: 120, height: 120, mb: 2 }} />
            <Typography variant="h6" component="div" gutterBottom align="center">
              {profiles[0].name}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {profiles[0].shortBio}
            </Typography>
          </Card>
        </Grid>

        {/* 相関関係を示す矢印やテキスト（ここでは簡略化） */}
        <Grid item xs={12} sm={12} md={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            {/* 矢印アイコンやテキストなどを配置して相関性を示す */}
            <Typography variant="h6" color="primary">共同運営</Typography>
            {/* <ArrowForwardIcon sx={{ fontSize: 40, color: 'primary.main', display: { xs: 'none', md: 'block' } }} /> */}
            {/* <ArrowDownwardIcon sx={{ fontSize: 40, color: 'primary.main', display: { xs: 'block', md: 'none' } }} /> */}
          </Box>
        </Grid>

        {/* 運営者Bのカード */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            component={RouterLink} // カード全体をリンクにする
            to={`/profile/${profiles[1].id}`} // 2番目のプロフィールのIDにリンク
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 3,
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-5px)',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              },
            }}
          >
            <Avatar alt={profiles[1].name} src={profiles[1].avatar} sx={{ width: 120, height: 120, mb: 2 }} />
            <Typography variant="h6" component="div" gutterBottom align="center">
              {profiles[1].name}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {profiles[1].shortBio}
            </Typography>
          </Card>
        </Grid>

        {/* もし3人目以降がいる場合、Grid itemを追加 */}
        {/* <Grid item xs={12} sm={6} md={4}>
          <Card ... component={RouterLink} to={`/profile/${profiles[2].id}`} ...>
            ...
          </Card>
        </Grid> */}

      </Grid>
    </Container>
  );
}

export default RelationChartPage;
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link'; // MUI Link
import IconButton from '@mui/material/IconButton';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
// import InstagramIcon from '@mui/icons-material/Instagram'; // 使わない場合はコメントアウトまたは削除

// React RouterのLinkをインポートし、MUIのLinkと区別するためにエイリアスを付ける
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button'; // 新たに追加

// プロフィールデータをインポート
import { profiles } from '../data/profiles';


function HomePage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          愚人亭一門の公式サイト
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4 }}>
          ここは最新情報や運営者のプロフィールなどを掲載するトップページです。
        </Typography>

        {/* --- 最新アプリセクション --- */}
        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
          最新アプリ
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Card elevation={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
            <Typography variant="h6" component="div" gutterBottom>
              ポートフォリオ管理アプリ
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
              自分のポートフォリオを管理するページ
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/portfolio" // 正しいパスに修正
              sx={{ mt: 2 }}
            >
              アプリを試す
            </Button>
          </Card>
        </Grid>
        
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={8} md={6}>
            <Card elevation={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <Typography variant="h6" component="div" gutterBottom>
                2025年参議院選挙 Tier表
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                次期参議院選挙の候補者や政党を自分なりにティア分けして、シェアできるツールです。
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink} // RouterLinkを使用
                to="/SangiinTierPage"
                sx={{ mt: 2 }}
              >
                アプリを試す
              </Button>
            </Card>
          </Grid>
        </Grid>

        {/* --- 運営者プロフィールセクション --- */}
        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 8, mb: 3 }}>
          運営者のご紹介
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* 1人目のプロフィール */}
          <Grid item xs={12} sm={6} md={5}>
            <Card elevation={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <Avatar alt={profiles[0].name} src={profiles[0].avatar} sx={{ width: 100, height: 100, mb: 2 }} />
              <Typography variant="h6" component="div" gutterBottom>
                {profiles[0].name}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                {profiles[0].shortBio}
              </Typography>
              <Box>
                {profiles[0].sns.youtube && (
                  <IconButton component={Link} href={profiles[0].sns.youtube} target="_blank" rel="noopener">
                    <YouTubeIcon color="error" fontSize="large" />
                  </IconButton>
                )}
                {profiles[0].sns.x && (
                  <IconButton component={Link} href={profiles[0].sns.x} target="_blank" rel="noopener">
                    <TwitterIcon color="primary" fontSize="large" />
                  </IconButton>
                )}
              </Box>
            </Card>
          </Grid>

          {/* 2人目のプロフィール */}
          <Grid item xs={12} sm={6} md={5}>
            <Card elevation={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <Avatar alt={profiles[1].name} src={profiles[1].avatar} sx={{ width: 100, height: 100, mb: 2 }} />
              <Typography variant="h6" component="div" gutterBottom>
                {profiles[1].name}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                {profiles[1].shortBio}
              </Typography>
              <Box>
                {profiles[1].sns.youtube && (
                  <IconButton component={Link} href={profiles[1].sns.youtube} target="_blank" rel="noopener">
                    <YouTubeIcon color="error" fontSize="large" />
                  </IconButton>
                )}
                {profiles[1].sns.x && (
                  <IconButton component={Link} href={profiles[1].sns.x} target="_blank" rel="noopener">
                    <TwitterIcon color="primary" fontSize="large" />
                  </IconButton>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* --- YouTube 最新動画セクション --- */}
        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 8, mb: 3 }}>
          最新の動画
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* YouTube動画1 */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>運営者Aの最新動画</Typography>
                <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                  {/* 正しいYouTube埋め込みURL形式に修正 */}
                  <iframe
                    src="https://www.youtube.com/embed/YOUR_VIDEO_ID_A" // ★ YouTube動画IDを設定 ★
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    title="YouTube video player A"
                  ></iframe>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  運営者Aが公開した最新の動画です。ぜひご覧ください！
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* YouTube動画2 */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>運営者Bの最新動画</Typography>
                <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                  {/* 正しいYouTube埋め込みURL形式に修正 */}
                  <iframe
                    src="https://www.youtube.com/embed/YOUR_VIDEO_ID_B" // ★ YouTube動画IDを設定 ★
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    title="YouTube video player B"
                  ></iframe>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  運営者Bによる、今週の政治解説ライブのアーカイブです。
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* --- X (旧Twitter) タイムラインセクション --- */}
        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 8, mb: 3 }}>
          最新の投稿 (X / 旧Twitter)
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={8}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>愚人亭 公式Xタイムライン</Typography>
                <Box sx={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <a className="twitter-timeline" href="https://twitter.com/exchange_119?ref_src=twsrc%5Etfw">Tweets by exchange_119</a>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </Box>
    </Container>
  );
}

export default HomePage;
// src/pages/ProfileDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // URLパラメータ取得用
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link'; // MUI Link
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // 戻るボタン用アイコン
import { Link as RouterLink } from 'react-router-dom'; // React RouterのLink
import TextField from '@mui/material/TextField';

function ProfileDetailPage() {
  const { id } = useParams(); // URLからidパラメータを取得
  const [profile, setProfile] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [newAsset, setNewAsset] = useState({ asset_name: '', amount: '', category: '' });

  useEffect(() => {
    // APIからデータを取得
    fetch(`http://localhost:5000/profiles/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProfile(data.profile);
        setPortfolios(data.portfolios);
      })
      .catch((error) => console.error('Error fetching profile data:', error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAsset({ ...newAsset, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/portfolios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newAsset, profile_id: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPortfolios([...portfolios, { id: data.id, ...newAsset }]);
        setNewAsset({ asset_name: '', amount: '', category: '' }); // フォームをリセット
      })
      .catch((error) => console.error('Error adding portfolio:', error));
  };

  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" color="error">
          指定されたプロフィールは見つかりませんでした。
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={RouterLink}
          to="/relation-chart"
          sx={{ mt: 3 }}
        >
          相関図へ戻る
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Avatar alt={profile.name} src={profile.avatar} sx={{ width: 150, height: 150, mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {profile.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          {profile.shortBio}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          {profile.sns_youtube && (
            <Link href={profile.sns_youtube} target="_blank" rel="noopener">
              <YouTubeIcon color="error" fontSize="large" />
            </Link>
          )}
          {profile.sns_twitter && (
            <Link href={profile.sns_twitter} target="_blank" rel="noopener">
              <TwitterIcon color="primary" fontSize="large" />
            </Link>
          )}
          {profile.sns_instagram && (
            <Link href={profile.sns_instagram} target="_blank" rel="noopener">
              <InstagramIcon sx={{ color: '#E4405F' }} fontSize="large" />
            </Link>
          )}
        </Box>
      </Box>

      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}> {/* pre-lineで改行を反映 */}
        {profile.longBio}
      </Typography>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>ポートフォリオ</Typography>
      <Box>
        {portfolios.map((portfolio) => (
          <Box key={portfolio.id} sx={{ mb: 2 }}>
            <Typography variant="body1">資産名: {portfolio.asset_name}</Typography>
            <Typography variant="body2">金額: ¥{portfolio.amount.toLocaleString()}</Typography>
            <Typography variant="body2">カテゴリ: {portfolio.category}</Typography>
          </Box>
        ))}
      </Box>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>新しい資産を追加</Typography>
      <form onSubmit={handleFormSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="資産名"
            name="asset_name"
            value={newAsset.asset_name}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="金額"
            name="amount"
            type="number"
            value={newAsset.amount}
            onChange={handleInputChange}
            required
          />
          <TextField
            label="カテゴリ"
            name="category"
            value={newAsset.category}
            onChange={handleInputChange}
          />
          <Button type="submit" variant="contained" color="primary">
            追加
          </Button>
        </Box>
      </form>

      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        component={RouterLink}
        to="/relation-chart"
        sx={{ mt: 4 }}
      >
        相関図へ戻る
      </Button>
    </Container>
  );
}

export default ProfileDetailPage;
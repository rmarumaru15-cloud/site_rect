import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';


function Apps() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        アプリ一覧
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 4 }}>
        現在公開中のアプリ一覧です。ぜひお試しください。
      </Typography>

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
              component={RouterLink}
              to="/SangiinTierPage"
              sx={{ mt: 2 }}
            >
              アプリを試す
            </Button>
          </Card>
        </Grid>
        <Grid item xs={12} sm={8} md={6}>
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
              to="/portfolio"
              sx={{ mt: 2 }}
            >
              アプリを試す
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Apps;
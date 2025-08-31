import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';

const assetTypes = ['株式', '投資信託', '暗号資産', '現金', '外貨'];
const regions = ['日本', '北米', '欧州', '新興国', 'コモディティ', '地域バランス', 'その他'];

function AddAssetPage() {
  const navigate = useNavigate();
  const [asset, setAsset] = useState({
    name: '',
    type: '',
    region: '',
    location: '',
    quantity: '',
    acquisitionDate: '',
    acquisitionPrice: '',
    currentPrice: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAsset(prevAsset => ({
      ...prevAsset,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('追加する資産:', asset);
    // ここに資産をポートフォリオに追加するロジックを実装します。
    // 現時点では、console.logで確認するのみとします。

    // フォームをリセット
    setAsset({
      name: '',
      type: '',
      region: '',
      location: '',
      quantity: '',
      acquisitionDate: '',
      acquisitionPrice: '',
      currentPrice: '',
    });

    // ポートフォリオページに戻る
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        新しい資産の追加
      </Typography>
      <Card elevation={3} sx={{ p: 4, mt: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="資産名"
                  name="name"
                  value={asset.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="asset-type-label">種類</InputLabel>
                  <Select
                    labelId="asset-type-label"
                    label="種類"
                    name="type"
                    value={asset.type}
                    onChange={handleChange}
                  >
                    {assetTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="asset-region-label">地域</InputLabel>
                  <Select
                    labelId="asset-region-label"
                    label="地域"
                    name="region"
                    value={asset.region}
                    onChange={handleChange}
                  >
                    {regions.map((region) => (
                      <MenuItem key={region} value={region}>
                        {region}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="保管場所"
                  name="location"
                  value={asset.location}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="数量"
                  name="quantity"
                  type="number"
                  inputProps={{ step: "0.01" }}
                  value={asset.quantity}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="取得日"
                  name="acquisitionDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={asset.acquisitionDate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="取得単価 (円)"
                  name="acquisitionPrice"
                  type="number"
                  inputProps={{ step: "any" }}
                  value={asset.acquisitionPrice}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="現在価格 (円)"
                  name="currentPrice"
                  type="number"
                  inputProps={{ step: "any" }}
                  value={asset.currentPrice}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/')}>
                  キャンセル
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  追加
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default AddAssetPage;
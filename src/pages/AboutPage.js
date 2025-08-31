// src/pages/HomePage.js
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function HomePage() {
  return (
    <Container maxWidth="md"> {/* コンテンツの最大幅を設定 */}
      <Box sx={{ my: 4 }}> {/* 上下のマージンを追加 */}
        <Typography variant="h4" component="h2" gutterBottom>
          アバウト
        </Typography>
        <Typography variant="body1">
          ここは勉強するために立ち上げたページです。
          不明な点や気になる点があれば、連絡ください。

           </Typography>
        <Typography variant="body1">
          <a href = "https://docs.google.com/forms/d/e/1FAIpQLSfAHOX78LVKX36yzafVzBjCZV9AQjompJpq07PdfN76ISyjQQ/viewform?usp=header"  target="_blank">問い合わせ先</a>
        </Typography>
        {/* 他のコンテンツもMUIコンポーネントで追加 */}
      </Box>
    </Container>
  );
}

export default HomePage;
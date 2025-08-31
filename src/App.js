import React, { useState, useMemo } from 'react'; // useMemoを追加
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InfoIcon from '@mui/icons-material/Info';
import AppsIcon from '@mui/icons-material/Apps';
import Box from '@mui/material/Box';

import HomePage from './pages/HomePage';

import AboutPage from './pages/AboutPage'; // ★ 追加
import AppsPage from './pages/Apps'; // ★ 追加
import PortfolioPage from './pages/PortfolioPage';
import SangiinTierPage from './pages/SangiinTierPage';
import { Switch } from '@mui/material'; // Switchを追加

// ナビゲーションメニューの定義
const navItems = [
  { text: 'ホーム', path: '/', icon: <HomeIcon /> },
  { text: 'アバウト', path: '/about', icon: <InfoIcon /> },
  { text: 'アプリ一覧', path: '/apps', icon: <AppsIcon /> },
];

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // ★ ダークモードの状態を復活

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleThemeChange = () => { // ★ ダークモード切り替えハンドラーを復活
    setDarkMode(!darkMode);
  };

  // ★ useMemoを使用してテーマを生成
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: darkMode ? '#90caf9' : '#1976d2',
          },
          secondary: {
            main: darkMode ? '#f48fb1' : '#dc004e',
          },
          success: {
            main: darkMode ? '#81c784' : '#4caf50',
          },
          error: {
            main: darkMode ? '#e57373' : '#f44336',
          },
          background: {
            default: darkMode ? '#121212' : '#f4f6f8',
            paper: darkMode ? '#1e1e1e' : '#ffffff',
          },
        },
        typography: {
          fontFamily: 'Roboto, Arial, sans-serif',
        },
      }),
    [darkMode]
  );

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ minWidth: 36 }}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </ListItemIcon>
            <ListItemText primary="ダークモード" />
            <Switch
              checked={darkMode}
              onChange={handleThemeChange}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                愚人亭一門
              </Link>
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              {navItems.map((item) => (
                <Button key={item.text} color="inherit" component={Link} to={item.path} startIcon={item.icon}>
                  {item.text}
                </Button>
              ))}
              <IconButton color="inherit" onClick={handleThemeChange}>
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <Box component="nav">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} /> {/* ★ 復活 */}
          <Route path="/apps" element={<AppsPage />} /> {/* ★ 復活 */}
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/SangiinTierPage" element={<SangiinTierPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Avatar, Menu, MenuItem, Switch } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import AppsIcon from '@mui/icons-material/Apps';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AppsPage from './pages/Apps';
import PortfolioPage from './pages/PortfolioPage';
import SangiinTierPage from './pages/SangiinTierPage';

const navItems = [
  { text: 'ホーム', path: '/', icon: <HomeIcon /> },
  { text: 'アバウト', path: '/about', icon: <InfoIcon /> },
  { text: 'アプリ一覧', path: '/apps', icon: <AppsIcon /> },
];

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, login, logout, loading } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

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
        },
      }),
    [darkMode]
  );

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={RouterLink} to={item.path}>
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        {user && (
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/portfolio">
              <ListItemIcon sx={{ minWidth: 36 }}>
                <span role="img" aria-label="portfolio">💼</span>
              </ListItemIcon>
              <ListItemText primary="ポートフォリオ" />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem>
            <ListItemIcon sx={{ minWidth: 36 }}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </ListItemIcon>
            <ListItemText primary="ダークモード" />
            <Switch checked={darkMode} onChange={handleThemeChange} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                愚人亭一門
              </RouterLink>
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              {navItems.map((item) => (
                <Button key={item.text} color="inherit" component={RouterLink} to={item.path}>
                  {item.text}
                </Button>
              ))}
              {user && (
                 <Button color="inherit" component={RouterLink} to="/portfolio">
                   ポートフォリオ
                 </Button>
              )}
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton color="inherit" onClick={handleThemeChange}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            {!loading && (
              <>
                {user ? (
                  <div>
                    <IconButton onClick={handleMenu} color="inherit">
                      <Avatar alt={user.name} src={user.avatar} />
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleClose}>Profile</MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </div>
                ) : (
                  <GoogleLogin
                    onSuccess={login}
                    onError={() => {
                      console.log('Login Failed');
                    }}
                  />
                )}
              </>
            )}
          </Toolbar>
        </AppBar>
        <Box component="nav">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/apps" element={<AppsPage />} />
            <Route path="/portfolio" element={
              <PrivateRoute>
                <PortfolioPage />
              </PrivateRoute>
            } />
            <Route path="/SangiinTierPage" element={<SangiinTierPage />} />
          </Routes>
        </main>
      </ThemeProvider>
    </Router>
  );
}

export default App;
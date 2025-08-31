import React, { useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom'; // navigateは不要になるため削除
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal'; // ★ 追加
import TextField from '@mui/material/TextField'; // ★ 追加
import MenuItem from '@mui/material/MenuItem'; // ★ 追加
import Select from '@mui/material/Select'; // ★ 追加
import InputLabel from '@mui/material/InputLabel'; // ★ 追加
import FormControl from '@mui/material/FormControl'; // ★ 追加

import {
  dummyPortfolioData,
  dummyAssetDistribution,
  dummyInvestmentRegion,
  dummyPortfolioHistory,
  dummyAssetList,
} from '../data/portfolioData';

// ★ 追加：モーダルのスタイル
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '70%', md: '50%' },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto'
};

const currencyFormatter = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY',
});

const percentFormatter = (value) => `${(value * 100).toFixed(2)}%`;

const signedPercentFormatter = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0.00%';
  const formatted = percentFormatter(value);
  return value > 0 ? `+${formatted}` : formatted;
};

const signedCurrencyFormatter = (value) => {
  const formatted = currencyFormatter.format(value);
  return value > 0 ? `+${formatted}` : formatted;
};

const periodOptions = [
  { label: '1日', value: 'dailyChange', chartKey: 'daily' },
  { label: '1週間', value: 'weeklyChange', chartKey: 'weekly' },
  { label: '1ヶ月', value: 'monthlyChange', chartKey: 'monthly' },
  { label: '3ヶ月', value: 'quarterlyChange' },
  { label: '半年', value: 'semiannualChange' },
  { label: '1年', value: 'yearlyChange' },
  { label: '2年', value: 'twoYearChange' },
  { label: '5年', value: 'fiveYearChange' },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'name', numeric: false, disablePadding: false, label: '名称' },
  { id: 'type', numeric: false, disablePadding: false, label: '種類' },
  { id: 'region', numeric: false, disablePadding: false, label: '地域' },
  { id: 'location', numeric: false, disablePadding: false, label: '保管場所' },
  { id: 'acquisitionDate', numeric: false, disablePadding: false, label: '取得日' },
  { id: 'acquisitionPrice', numeric: true, disablePadding: false, label: '取得単価' },
  { id: 'currentPrice', numeric: true, disablePadding: false, label: '現在価格' },
  { id: 'unrealizedGainLoss', numeric: true, disablePadding: false, label: '含み損益' },
  { id: 'dailyChange', numeric: true, disablePadding: false, label: '前日比' },
];

// ★ 追加：AddAssetPageから移動した定数
const assetTypes = ['株式', '投資信託', '暗号資産', '現金', '外貨'];
const regions = ['日本', '北米', '欧州', '新興国', 'コモディティ', '地域バランス', 'その他'];

function PortfolioPage() {
  // const navigate = useNavigate(); // navigateは不要になるため削除
  const [activePeriod, setActivePeriod] = useState('yearlyChange');
  const [pieChartTab, setPieChartTab] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filters, setFilters] = useState({
    types: dummyAssetDistribution.map(item => item.label),
    regions: dummyInvestmentRegion.map(item => item.label),
  });

  // ★ 追加：モーダルの状態
  const [openModal, setOpenModal] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: '',
    type: '',
    region: '',
    location: '',
    quantity: '',
    acquisitionDate: '',
    acquisitionPrice: '',
    currentPrice: '',
  });

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleNewAssetChange = (e) => {
    const { name, value } = e.target;
    setNewAsset(prevAsset => ({
      ...prevAsset,
      [name]: value,
    }));
  };

  const handleNewAssetSubmit = (e) => {
    e.preventDefault();
    console.log('追加する資産:', newAsset);
    // ここに資産をポートフォリオに追加するロジックを実装します。
    // 現時点では、console.logで確認するのみとします。

    // フォームをリセット
    setNewAsset({
      name: '',
      type: '',
      region: '',
      location: '',
      quantity: '',
      acquisitionDate: '',
      acquisitionPrice: '',
      currentPrice: '',
    });
    // モーダルを閉じる
    handleCloseModal();
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterChange = (type, value) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      const index = newFilters[type].indexOf(value);
      if (index === -1) {
        newFilters[type] = [...newFilters[type], value];
      } else {
        newFilters[type] = newFilters[type].filter(item => item !== value);
      }
      return newFilters;
    });
  };

  const totalValue = dummyPortfolioData.totalValue;
  const selectedOption = periodOptions.find(o => o.value === activePeriod);
  const selectedChangeValue = dummyPortfolioData[selectedOption.value];
  const selectedChangeRate = selectedChangeValue / (totalValue - selectedChangeValue);
  const changeColor = selectedChangeValue >= 0 ? 'success.main' : 'error.main';

  const chartData = useMemo(() => {
    const key = selectedOption.chartKey;
    if (!key || !dummyPortfolioHistory[key]) {
      return dummyPortfolioHistory.monthly;
    }
    return dummyPortfolioHistory[key];
  }, [selectedOption.chartKey]);

  const lineChartSeries = [
    {
      data: chartData.total,
      label: '総資産額',
      area: false,
      color: '#1976d2',
    },
    {
      data: chartData.stocks,
      label: '株式',
      area: true,
      stack: 'totalAssets',
      color: '#dc004e',
    },
    {
      data: chartData.investmentTrusts,
      label: '投資信託',
      area: true,
      stack: 'totalAssets',
      color: '#3f51b5',
    },
    {
      data: chartData.crypto,
      label: '暗号資産',
      area: true,
      stack: 'totalAssets',
      color: '#ff9800',
    },
    {
      data: chartData.cash,
      label: '現金',
      area: true,
      stack: 'totalAssets',
      color: '#4caf50',
    },
  ];

  const pieChartData = pieChartTab === 0 ? dummyAssetDistribution : dummyInvestmentRegion;
  
  const periodStartValue = chartData.total[0];
  const periodEndValue = chartData.total[chartData.total.length - 1];
  const periodGainLoss = periodEndValue - periodStartValue;
  const periodGainLossRate = periodGainLoss / periodStartValue;

  const filteredAssetList = useMemo(() => {
    return dummyAssetList.filter(asset => 
      filters.types.includes(asset.type) && filters.regions.includes(asset.region)
    );
  }, [filters, dummyAssetList]);

  const sortedAssetList = useMemo(() => {
    const processedList = filteredAssetList.map(asset => ({
      ...asset,
      unrealizedGainLoss: (asset.currentPrice - asset.acquisitionPrice) * asset.quantity,
    }));
    return stableSort(processedList, getComparator(order, orderBy));
  }, [order, orderBy, filteredAssetList]);

  const totalsByAssetType = useMemo(() => {
    return filteredAssetList.reduce((acc, asset) => {
      acc[asset.type] = (acc[asset.type] || 0) + (asset.currentPrice * asset.quantity);
      return acc;
    }, {});
  }, [filteredAssetList]);

  const totalsByRegion = useMemo(() => {
    return filteredAssetList.reduce((acc, asset) => {
      acc[asset.region] = (acc[asset.region] || 0) + (asset.currentPrice * asset.quantity);
      return acc;
    }, {});
  }, [filteredAssetList]);

  const filteredTotalValue = useMemo(() => {
    return filteredAssetList.reduce((sum, asset) => sum + (asset.currentPrice * asset.quantity), 0);
  }, [filteredAssetList]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        ポートフォリオ
      </Typography>
      <Box sx={{ my: 4 }}>
        <Card elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            総資産額
          </Typography>
          <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', my: 1 }}>
            {currencyFormatter.format(totalValue)}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mt: 2 }}>
            {periodOptions.map((option) => (
              <Button
                key={option.value}
                variant={activePeriod === option.value ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setActivePeriod(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">{selectedOption.label}の損益</Typography>
            <Typography variant="h6" color={changeColor} sx={{ fontWeight: 'bold' }}>
              {signedCurrencyFormatter(selectedChangeValue)}
              ({signedPercentFormatter(selectedChangeRate)})
            </Typography>
          </Box>
        </Card>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" gutterBottom>
                資産の推移
              </Typography>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body1" color={periodGainLoss >= 0 ? 'success.main' : 'error.main'} sx={{ fontWeight: 'bold' }}>
                  {signedCurrencyFormatter(periodGainLoss)}
                </Typography>
                <Typography variant="body2" color={periodGainLoss >= 0 ? 'success.main' : 'error.main'}>
                  ({signedPercentFormatter(periodGainLossRate)})
                </Typography>
              </Box>
            </Box>
            <LineChart
              xAxis={[{ scaleType: 'point', data: chartData.dates }]}
              series={lineChartSeries}
              height={300}
              margin={{ top: 20, bottom: 30, left: 60, right: 20 }}
              slotProps={{
                tooltip: {
                  label: ({ dataIndex, series }) => {
                    if (dataIndex === undefined) return null;

                    const totalValueSeries = series.find(s => s.label === '総資産額');
                    const assetSeries = series.filter(s => s.stack === 'totalAssets');

                    const currentValue = totalValueSeries.data[dataIndex];
                    const prevValue = dataIndex > 0 ? totalValueSeries.data[dataIndex - 1] : null;
                    const change = prevValue !== null ? currentValue - prevValue : null;
                    const changeRate = prevValue !== null ? change / prevValue : null;

                    return (
                      <Box sx={{ p: 1 }}>
                        <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                          {chartData.dates[dataIndex]}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          総資産額: {currencyFormatter.format(currentValue)}
                        </Typography>
                        {change !== null && (
                          <Typography variant="body2" color={change >= 0 ? 'success.main' : 'error.main'}>
                            前日比: {signedCurrencyFormatter(change)} ({signedPercentFormatter(changeRate)})
                          </Typography>
                        )}
                        <hr style={{ border: 'none', borderBottom: '1px solid #ccc', margin: '8px 0' }} />
                        {assetSeries.map((s, i) => {
                          const assetValue = s.data[dataIndex];
                          const assetPrevValue = dataIndex > 0 ? s.data[dataIndex - 1] : null;
                          const assetChange = assetPrevValue !== null ? assetValue - assetPrevValue : null;
                          const assetChangeRate = assetPrevValue !== null ? assetChange / assetPrevValue : null;
                          return (
                            <Box key={i}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: 8, height: 8, bgcolor: s.color, mr: 1 }} />
                                <Typography variant="body2">{s.label}: {currencyFormatter.format(assetValue)}</Typography>
                              </Box>
                              {assetChange !== null && (
                                <Typography variant="caption" color={assetChange >= 0 ? 'success.main' : 'error.main'} sx={{ ml: 2 }}>
                                  ({signedCurrencyFormatter(assetChange)})
                                </Typography>
                              )}
                            </Box>
                          );
                        })}
                      </Box>
                    );
                  },
                },
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={pieChartTab} onChange={(e, newValue) => setPieChartTab(newValue)} centered>
                <Tab label="種類別" />
                <Tab label="地域別" />
              </Tabs>
            </Box>
            <Box sx={{ py: 2 }}>
              <PieChart
                series={[
                  {
                    data: pieChartData,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    arcLabel: (item) => `${currencyFormatter.format(item.value)} (${percentFormatter(item.value / totalValue)})`,
                    arcLabelMinAngle: 15,
                  },
                ]}
                height={250}
                margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                sx={{
                  [`& .MuiPieArc-arcLabel`]: {
                    fill: 'white',
                    fontWeight: 'bold',
                  },
                }}
                slotProps={{
                  tooltip: {
                    formatter: (params) => {
                      const item = pieChartData.find(d => d.id === params.data.id);
                      if (!item) return null;
                      const percent = (item.value / totalValue) * 100;
                      return (
                        <Box sx={{ p: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {item.label}
                          </Typography>
                          <Typography variant="body2">
                            金額: {currencyFormatter.format(item.value)}
                          </Typography>
                          <Typography variant="body2">
                            配分: {percent.toFixed(2)}%
                          </Typography>
                        </Box>
                      );
                    },
                  },
                }}
              />
            </Box>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              {pieChartData.map((item) => (
                <Box key={item.id} sx={{ display: 'inline-block', mr: 2, my: 1 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      bgcolor: item.color,
                      display: 'inline-block',
                      mr: 1,
                      verticalAlign: 'middle',
                    }}
                  />
                  <Typography variant="body2" sx={{ display: 'inline-block' }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h5" gutterBottom>
                    資産の追加入力
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ my: 4 }}>
                        今後、このエリアに新しい資産を追加するためのフォームを実装します。
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<AddCircleIcon />}
                        sx={{ mt: 'auto', mb: 2 }}
                        onClick={handleOpenModal} // ★ 修正：ボタンをクリックするとモーダルを開く
                    >
                        新しい資産を追加
                    </Button>
                </Box>
            </Card>
        </Grid>
        <Grid item xs={12}>
          <Card elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              資産一覧
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                フィルター
              </Typography>
              <FormGroup row>
                {dummyAssetDistribution.map((item) => (
                  <FormControlLabel
                    key={item.id}
                    control={
                      <Checkbox
                        checked={filters.types.includes(item.label)}
                        onChange={() => handleFilterChange('types', item.label)}
                        sx={{
                          color: item.color,
                          '&.Mui-checked': {
                            color: item.color,
                          },
                        }}
                      />
                    }
                    label={item.label}
                  />
                ))}
              </FormGroup>
              <FormGroup row sx={{ mt: 1 }}>
                {dummyInvestmentRegion.map((item) => (
                  <FormControlLabel
                    key={item.id}
                    control={
                      <Checkbox
                        checked={filters.regions.includes(item.label)}
                        onChange={() => handleFilterChange('regions', item.label)}
                        sx={{
                          color: item.color,
                          '&.Mui-checked': {
                            color: item.color,
                          },
                        }}
                      />
                    }
                    label={item.label}
                  />
                ))}
              </FormGroup>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    合計: {currencyFormatter.format(filteredTotalValue)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Tooltip
                        title={
                            <Box sx={{ p: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>種類別合計</Typography>
                                {Object.entries(totalsByAssetType).map(([type, total]) => (
                                    <Typography key={type} variant="body2">
                                        {type}: {currencyFormatter.format(total)}
                                    </Typography>
                                ))}
                            </Box>
                        }
                    >
                        <Chip
                            label="種類別合計"
                            icon={<AttachMoneyIcon />}
                            color="primary"
                            variant="outlined"
                        />
                    </Tooltip>
                    <Tooltip
                        title={
                            <Box sx={{ p: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>地域別合計</Typography>
                                {Object.entries(totalsByRegion).map(([region, total]) => (
                                    <Typography key={region} variant="body2">
                                        {region}: {currencyFormatter.format(total)}
                                    </Typography>
                                ))}
                            </Box>
                        }
                    >
                        <Chip
                            label="地域別合計"
                            icon={<AttachMoneyIcon />}
                            color="secondary"
                            variant="outlined"
                        />
                    </Tooltip>
                </Box>
            </Box>

            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {headCells.map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        sortDirection={orderBy === headCell.id ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === headCell.id}
                          direction={orderBy === headCell.id ? order : 'asc'}
                          onClick={(event) => handleRequestSort(event, headCell.id)}
                        >
                          {headCell.label}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedAssetList.map((asset) => {
                    const unrealizedGainLossRate = asset.unrealizedGainLoss / (asset.acquisitionPrice * asset.quantity);
                    const gainLossColor = asset.unrealizedGainLoss >= 0 ? 'success.main' : 'error.main';
                    const dailyChangeColor = asset.dailyChange >= 0 ? 'success.main' : 'error.main';

                    return (
                      <TableRow key={asset.id}>
                        <TableCell component="th" scope="row">
                          {asset.name}
                        </TableCell>
                        <TableCell align="left">
                          <Chip label={asset.type} size="small" />
                        </TableCell>
                        <TableCell align="left">
                          <Chip label={asset.region} size="small" />
                        </TableCell>
                        <TableCell align="right">
                          <Chip label={asset.location} variant="outlined" size="small" />
                        </TableCell>
                        <TableCell align="right">{asset.acquisitionDate}</TableCell>
                        <TableCell align="right">
                          {currencyFormatter.format(asset.acquisitionPrice)}
                        </TableCell>
                        <TableCell align="right">
                          {currencyFormatter.format(asset.currentPrice)}
                        </TableCell>
                        <TableCell align="right">
                           <Box sx={{ color: gainLossColor, fontWeight: 'bold' }}>
                            {signedCurrencyFormatter(asset.unrealizedGainLoss)}
                            <Typography variant="caption" display="block">
                              ({signedPercentFormatter(unrealizedGainLossRate)})
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ color: dailyChangeColor }}
                        >
                          <Box>
                            {signedCurrencyFormatter(asset.dailyChange)}
                            <Typography variant="caption" display="block">
                              ({signedPercentFormatter(asset.dailyChangeRate)})
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      {/* ★ ここからモーダルコンポーネントの追加 */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="add-asset-modal-title"
        aria-describedby="add-asset-modal-description"
      >
        <Box sx={style}>
          <Typography id="add-asset-modal-title" variant="h5" component="h2" gutterBottom>
            新しい資産の追加
          </Typography>
          <form onSubmit={handleNewAssetSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="資産名"
                  name="name"
                  value={newAsset.name}
                  onChange={handleNewAssetChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="asset-type-label">種類</InputLabel>
                  <Select
                    labelId="asset-type-label"
                    label="種類"
                    name="type"
                    value={newAsset.type}
                    onChange={handleNewAssetChange}
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
                    value={newAsset.region}
                    onChange={handleNewAssetChange}
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
                  value={newAsset.location}
                  onChange={handleNewAssetChange}
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
                  value={newAsset.quantity}
                  onChange={handleNewAssetChange}
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
                  value={newAsset.acquisitionDate}
                  onChange={handleNewAssetChange}
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
                  value={newAsset.acquisitionPrice}
                  onChange={handleNewAssetChange}
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
                  value={newAsset.currentPrice}
                  onChange={handleNewAssetChange}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button variant="outlined" onClick={handleCloseModal}>
                  キャンセル
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  追加
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
      {/* ★ ここまでモーダルコンポーネントの追加 */}
    </Container>
  );
}

export default PortfolioPage;
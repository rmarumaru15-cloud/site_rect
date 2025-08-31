import React, { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AddAssetForm from '../components/AddAssetForm';

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
import CircularProgress from '@mui/material/CircularProgress';

const currencyFormatter = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY',
});

const percentFormatter = (value) => `${(value * 100).toFixed(2)}%`;

const signedCurrencyFormatter = (value) => {
  const formatted = currencyFormatter.format(value);
  return value > 0 ? `+${formatted}` : formatted;
};

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
  { id: 'symbol', numeric: false, disablePadding: false, label: 'Symbol' },
  { id: 'asset_type', numeric: false, disablePadding: false, label: 'Type' },
  { id: 'quantity', numeric: true, disablePadding: false, label: 'Quantity' },
  { id: 'purchase_price', numeric: true, disablePadding: false, label: 'Purchase Price' },
  { id: 'created_at', numeric: false, disablePadding: false, label: 'Purchase Date' },
];


function PortfolioPage() {
  const { user } = useContext(AuthContext);
  const [portfolioData, setPortfolioData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('symbol');
  const [pieChartTab, setPieChartTab] = useState(0);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user) {
        setLoading(false);
        return;
      };
      try {
        setLoading(true);
        const response = await axios.get('/api/portfolio');
        setPortfolioData(response.data);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [user]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const totalValue = useMemo(() => {
    return portfolioData.reduce((sum, asset) => sum + (asset.current_price || asset.purchase_price) * asset.quantity, 0);
  }, [portfolioData]);
  
  const assetDistribution = useMemo(() => {
    const distribution = portfolioData.reduce((acc, asset) => {
        const value = (asset.current_price || asset.purchase_price) * asset.quantity;
        if (!acc[asset.asset_type]) {
            acc[asset.asset_type] = { id: asset.asset_type, value: 0, label: asset.asset_type };
        }
        acc[asset.asset_type].value += value;
        return acc;
    }, {});
    return Object.values(distribution);
  }, [portfolioData]);

  const sortedAssetList = useMemo(() => {
    return stableSort(portfolioData, getComparator(order, orderBy));
  }, [order, orderBy, portfolioData]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Loading Portfolio...</Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Portfolio
        </Typography>
        <Typography align="center">Please log in to view your portfolio.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        My Portfolio
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Total Asset Value
            </Typography>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', my: 1 }}>
              {currencyFormatter.format(totalValue)}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={pieChartTab} onChange={(e, newValue) => setPieChartTab(newValue)} centered>
                <Tab label="Asset Type" />
              </Tabs>
            </Box>
            <Box sx={{ py: 2 }}>
              <PieChart
                series={[
                  {
                    data: assetDistribution,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    arcLabel: (item) => `${percentFormatter(item.value / totalValue)}`,
                    arcLabelMinAngle: 25,
                  },
                ]}
                height={250}
                margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                sx={{
                  '& .MuiPieArc-arcLabel': {
                    fill: 'white',
                    fontWeight: 'bold',
                  },
                }}
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h5" gutterBottom>
                    Add Asset
                </Typography>
                <AddAssetForm setPortfolioData={setPortfolioData} />
            </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Asset List
            </Typography>
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
                  {sortedAssetList.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell component="th" scope="row">
                          {asset.symbol}
                        </TableCell>
                        <TableCell align="left">
                          <Chip label={asset.asset_type} size="small" />
                        </TableCell>
                        <TableCell align="right">{asset.quantity}</TableCell>
                        <TableCell align="right">
                          {currencyFormatter.format(asset.purchase_price)}
                        </TableCell>
                        <TableCell align="left">
                          {new Date(asset.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PortfolioPage;
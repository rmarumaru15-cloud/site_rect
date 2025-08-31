import React, { useState, useRef, useEffect } from 'react';
import { Trash2, RotateCcw, Plus, Share2, Download, Twitter, Instagram, Copy } from 'lucide-react';
import {
  AppBar, Toolbar, Typography, Button, Container, Box,
  TextField, Select, MenuItem, Paper, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import html2canvas from 'html2canvas';
import * as d3 from 'd3';

// Tierの色定義
const tierColors = {
  'SS': '#FF7F7F',
  'S': '#FFA07A',
  'A': '#FFD700',
  'B': '#ADFF2F',
  'C': '#87CEEB',
  'D': '#9370DB',
  'E': '#C0C0C0',
  'F': '#8B4513',
  'unranked': '#D3D3D3',
};

// 初期アイテムの定義
const initialItemsData = [
  { id: 'jimin', name: '自民党', image: '/parties/jimin.png', tier: 'unranked', type: 'party' },
  { id: 'rikken', name: '立憲民主党', image: '/parties/rikken.png', tier: 'unranked', type: 'party' },
  { id: 'ishin', name: '日本維新の会', image: '/parties/ishin.png', tier: 'unranked', type: 'party' },
  { id: 'komei', name: '公明党', image: '/parties/komei.png', tier: 'unranked', type: 'party' },
  { id: 'kyosan', name: '日本共産党', image: '/parties/kyosan.png', tier: 'unranked', type: 'party' },
  { id: 'kokumin', name: '国民民主党', image: '/parties/kokumin.png', tier: 'unranked', type: 'party' },
  { id: 'reiwa', name: 'れいわ新選組', image: '/parties/reiwa.png', tier: 'unranked', type: 'party' },
  { id: 'sansei', name: '参政党', image: '/parties/sansei.png', tier: 'unranked', type: 'party' },
  { id: 'syakai', name: '社会民主党', image: '/parties/syakai.png', tier: 'unranked', type: 'party' },
  { id: 'nhk', name: 'NHK党', image: '/parties/nhk.png', tier: 'unranked', type: 'party' },
  { id: 'ootsuka', name: '諸派', image: '/parties/ootsuka.png', tier: 'unranked', type: 'candidate' },
];

// 各政党の非改選議席数（例）
// 実際の数値に合わせて調整してください
const nonReelectionSeats = {
  '自民党': 62,
  '公明党': 14,
  '立憲民主党': 18,
  '日本維新の会': 12,
  '日本共産党': 7,
  '国民民主党': 5,
  'れいわ新選組': 2,
  '参政党': 1,
  '社会民主党': 1,
  'NHK党': 1,
  '諸派': 0, // カスタムアイテムや諸派は0としています
};

const SangiinTierPage = () => {
  const [items, setItems] = useState(initialItemsData);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState('party');
  const [shareUrl, setShareUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [totalEstimatedSeats, setTotalEstimatedSeats] = useState(0); // 合計議席数表示用
  const [ldpKomeiTotalSeats, setLdpKomeiTotalSeats] = useState(0); // 自公合計議席数表示用
  const tierListRef = useRef(null); // 画像キャプチャ対象のref
  const chartRef = useRef(null);   // D3.js チャート描画用のref

  // ★★★ 追加するstate ★★★
  const [selectedItem, setSelectedItem] = useState(null); // 現在選択中のアイテム (null または { id: '...', name: '...' })

  // Twitterウィジェットの再ロードを制御
  useEffect(() => {
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load();
    }
  }, []);

  // ★★★ アイテムのタップハンドラ ★★★
  const handleItemTap = (item) => {
    if (selectedItem && selectedItem.id === item.id) {
      // 同じアイテムを再度タップした場合、選択解除
      setSelectedItem(null);
    } else {
      // 別のアイテムまたは未選択状態からアイテムを選択
      setSelectedItem(item);
    }
  };

  // ★★★ Tierエリアのタップハンドラ（アイテム移動） ★★★
  const handleTierAreaTap = (targetTier) => {
    if (selectedItem) {
      // 選択中のアイテムがあれば、そのTierを変更
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === selectedItem.id ? { ...item, tier: targetTier } : item
        )
      );
      // 移動後、選択状態を解除
      setSelectedItem(null);
    }
  };

  // ★★★ 空きスペースをタップしたときに選択解除するハンドラ ★★★
  const handleClearSelection = (e) => {
    // クリックイベントが特定の要素（アイテムやTierエリア）から伝播してきたものでないことを確認
    // data属性を使って、クリックされた要素がアイテムやドロップゾーンでない場合のみ選択解除
    if (e.target.closest('[data-selectable-item]') === null && e.target.closest('[data-tier-dropzone]') === null) {
      setSelectedItem(null);
    }
  };

  // ★★★ body全体にクリックイベントリスナーを設定し、空きスペースクリックで選択解除 ★★★
  useEffect(() => {
    // コンポーネントマウント時にリスナーを追加
    document.addEventListener('click', handleClearSelection);
    // コンポーネントアンマウント時にリスナーを削除
    return () => {
      document.removeEventListener('click', handleClearSelection);
    };
  }, [selectedItem]); // selectedItemが変更されたときにリスナーを再設定 (依存配列に追加)


  const getTierItemStyle = (item) => ({
    padding: '8px',
    margin: '4px',
    backgroundColor: item.type === 'party' ? '#E6F3FF' : '#FFFACD',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'grab', // ドラッグ＆ドロップのために残しておく
    display: 'inline-block',
    position: 'relative',
    boxShadow: '1px 1px 3px rgba(0,0,0,0.1)',
  });

  const tierRowStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: '80px',
    border: '2px dashed #ddd',
    margin: '10px 0',
    padding: '10px',
    alignItems: 'flex-start',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  };

  const getTierLabelStyle = (tier) => ({
    fontWeight: 'bold',
    minWidth: '50px',
    textAlign: 'center',
    marginRight: '10px',
    padding: '8px',
    borderRadius: '4px',
    color: 'white',
    backgroundColor: tierColors[tier] || '#607D8B',
  });

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDrop = (e, targetTier) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, tier: targetTier } : item
      )
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleResetTier = () => {
    const resetItems = initialItemsData.map(item => ({ ...item, tier: 'unranked' }));
    setItems(resetItems);
    setNewItemName('');
    setNewItemType('party');
    setShareUrl('');
    setShowShareModal(false);
    setShowStatsModal(false);
    setSelectedItem(null); // リセット時にも選択状態をクリア
  };

  const handleAddItem = () => {
    if (newItemName.trim() === '') return;

    const newId = `custom-${Date.now()}`;
    const newItem = {
      id: newId,
      name: newItemName,
      image: newItemType === 'party' ? '/parties/default_party.png' : '/parties/default_candidate.png',
      tier: 'unranked',
      type: newItemType,
    };
    setItems(prevItems => [...prevItems, newItem]);
    setNewItemName('');
  };

  const handleDeleteItem = (idToDelete) => {
    setItems(prevItems => prevItems.filter(item => item.id !== idToDelete));
    if (selectedItem && selectedItem.id === idToDelete) {
      setSelectedItem(null); // 削除したアイテムが選択中だった場合、選択解除
    }
  };

  const handleShare = () => {
    const tiers = ['SS', 'S', 'A', 'B', 'C', 'D', 'E', 'F'];
    let tierOutput = "";
    tiers.forEach(tier => {
      const itemsInTier = items.filter(item => item.tier === tier);
      if (itemsInTier.length > 0) {
        tierOutput += `${tier}Tier: ${itemsInTier.map(item => item.name).join(', ')}\n`;
      }
    });
    const unrankedItems = items.filter(item => item.tier === 'unranked');
    if (unrankedItems.length > 0) {
      tierOutput += `未分類: ${unrankedItems.map(item => item.name).join(', ')}\n`;
    }

    const siteUrl = window.location.origin; 
    const hashtags = "#2025年参議院選挙 #選挙tier表";
    const shareText = `私の参議院Tier表を作ってみました！\n\n${tierOutput}\nこのTier表はこちらから作成できます: ${siteUrl}\n${hashtags}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

    setShareUrl(twitterUrl);
    setShowShareModal(true);
  };

  const handleDownloadImage = () => {
    if (tierListRef.current) {
      html2canvas(tierListRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff',
      }).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'sangiin_tier_list.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch(error => {
        console.error('画像をキャプチャできませんでした:', error);
        alert('画像をダウンロード中にエラーが発生しました。コンソールを確認してください。');
      });
    } else {
      console.warn('キャプチャ対象の要素が見つかりません。');
      alert('画像をダウンロードできませんでした。ページを再読み込みしてください。');
    }
  };

  // D3.js で扇状グラフを描画する関数
  const drawSenjoGisekiChart = (data) => {
    if (!chartRef.current) {
        console.warn("Chart ref is null. D3.js chart cannot be drawn.");
        return;
    }

    d3.select(chartRef.current).select("svg").remove(); // 既存のSVGをクリア

    const width = 400;
    const height = 200;
    const radius = Math.min(width, height * 2) / 2;

    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height})`); // 半円の中心（下辺中央）に移動

    // ★★★ 自民党と公明党を隣り合わせにするソートロジック ★★★
    const customSort = (a, b) => {
        if (!a || !a.data || !b || !b.data) {
            return d3.descending(a?.value || 0, b?.value || 0);
        }

        const order = ['自民党', '公明党']; // 隣り合わせにしたい政党の順序
        const aIndex = order.indexOf(a.data.name);
        const bIndex = order.indexOf(b.data.name);

        if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex; // 指定された順序でソート
        }
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        
        return d3.descending(a.value, b.value);
    };

    const pie = d3.pie()
      .value(d => d.value)
      .sort(customSort) // カスタムソート関数を適用
      .startAngle(-Math.PI / 2) // -90度（左）から開始
      .endAngle(Math.PI / 2); // +90度（右）で終了 (合計180度)

    const arc = d3.arc()
      .innerRadius(radius * 0.4)
      .outerRadius(radius * 0.9);

    const partyColorScale = d3.scaleOrdinal(d3.schemeCategory10);

    svg.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => partyColorScale(d.data.name))
      .attr("stroke", "white")
      .style("stroke-width", "1px");

    svg.selectAll("text")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("transform", d => {
        const centroid = arc.centroid(d);
        const x = centroid[0] * 1.1;
        const y = centroid[1] * 1.1;
        return `translate(${x},${y})`;
      })
      .attr("text-anchor", "middle")
      .text(d => `${d.data.name} (${Math.round(d.data.value)}議席)`)
      .style("font-size", "10px")
      .style("fill", "black");

    // ★★★ 過半数ラインの描画 ★★★
    const totalSeatsInHouse = 248; // 参議院の総議席数
    const majorityThreshold = 125; // 過半数議席数 (248 / 2 + 1)

    // 過半数に相当する角度を計算 (全議席に対する割合)
    const majorityAngleRadians = (majorityThreshold / totalSeatsInHouse) * Math.PI;

    // 半円の開始角度 (-Math.PI / 2) から過半数角度を加算
    const lineAngle = -Math.PI / 2 + majorityAngleRadians;

    const lineStartX = 0; // 半円の中心 (グループの座標系)
    const lineStartY = 0; // 半円の中心 (グループの座標系)
    const lineEndX = radius * Math.cos(lineAngle);
    const lineEndY = radius * Math.sin(lineAngle);

    svg.append("line")
        .attr("x1", lineStartX)
        .attr("y1", lineStartY)
        .attr("x2", lineEndX)
        .attr("y2", lineEndY)
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5 5");
    
    // 過半数ラインのラベル
    svg.append("text")
        .attr("x", lineEndX)
        .attr("y", lineEndY - 10)
        .attr("text-anchor", lineAngle > 0 ? "start" : "end")
        .attr("fill", "red")
        .style("font-size", "10px")
        .text("過半数 (125議席)");
  };

  // items が変更されたときにチャートを再描画
  useEffect(() => {
    const tierSeatAllocation = {
        'SS': 40, 'S': 30, 'A': 20, 'B': 10, 'C': 5, 'D': 2, 'E': 1, 'F': 0, 'unranked': 0
    };

    const partiesPerTier = {};
    Object.keys(tierSeatAllocation).forEach(tier => {
        partiesPerTier[tier] = items.filter(item => item.tier === tier && item.type === 'party').length;
    });

    const d3Data = [];
    let currentTotalEstimatedSeats = 0;
    let currentLdpKomeiTotalSeats = 0;

    items.forEach(item => {
        if (item.type === 'party') {
            let allocatedSeats = 0;
            if (item.tier !== 'unranked') {
                const numPartiesInTier = partiesPerTier[item.tier];
                if (numPartiesInTier > 0) {
                    allocatedSeats = tierSeatAllocation[item.tier] / numPartiesInTier;
                }
            }
            const partyNonReelectionSeats = nonReelectionSeats[item.name] || 0;
            const totalPartySeats = allocatedSeats + partyNonReelectionSeats;

            if (totalPartySeats > 0) {
                d3Data.push({
                    name: item.name,
                    value: totalPartySeats
                });
            }
            
            currentTotalEstimatedSeats += totalPartySeats;

            if (item.name === '自民党' || item.name === '公明党') {
                currentLdpKomeiTotalSeats += totalPartySeats;
            }
        }
    });

    setTotalEstimatedSeats(Math.round(currentTotalEstimatedSeats));
    setLdpKomeiTotalSeats(Math.round(currentLdpKomeiTotalSeats));

    if (d3Data.length > 0) {
        drawSenjoGisekiChart(d3Data);
    } else {
        if (chartRef.current) {
            d3.select(chartRef.current).select("svg").remove();
        }
    }
  }, [items]);

  const calculateStatsContent = () => {
    const tierGoals = {
      'SS': 18, 'S': 12, 'A': 8, 'B': 4, 'C': 2, 'D': 1, 'E': 0, 'F': 0
    };
    const currentTierCounts = {};

    items.forEach(item => {
      if (item.tier !== 'unranked') {
        currentTierCounts[item.tier] = (currentTierCounts[item.tier] || 0) + 1;
      }
    });

    const tierSeatAllocation = {
        'SS': 40, 'S': 30, 'A': 20, 'B': 10, 'C': 5, 'D': 2, 'E': 1, 'F': 0, 'unranked': 0
    };
    const partiesPerTier = {};
    Object.keys(tierSeatAllocation).forEach(tier => {
        partiesPerTier[tier] = items.filter(item => item.tier === tier && item.type === 'party').length;
    });

    let totalD3SeatsForModalDisplay = 0;
    let ldpKomeiTotalSeatsForModalDisplay = 0;

    items.forEach(item => {
        if (item.type === 'party') {
            let allocatedSeats = 0;
            if (item.tier !== 'unranked') {
                const numPartiesInTier = partiesPerTier[item.tier];
                if (numPartiesInTier > 0) {
                    allocatedSeats = tierSeatAllocation[item.tier] / numPartiesInTier;
                }
            }
            const partyNonReelectionSeats = nonReelectionSeats[item.name] || 0;
            const totalPartySeats = allocatedSeats + partyNonReelectionSeats;
            totalD3SeatsForModalDisplay += totalPartySeats;

            if (item.name === '自民党' || item.name === '公明党') {
                ldpKomeiTotalSeatsForModalDisplay += totalPartySeats;
            }
        }
    });

    const majorityThreshold = 125;

    return (
      <Box>
        <Typography variant="h6">議席数サマリー (推定)</Typography>
        {Object.keys(tierGoals).map(tier => (
          <Typography key={tier} variant="body1">
            {`${tier}目標改選: ${tierGoals[tier]}議席 / 現在: ${currentTierCounts[tier] || 0}個`}
          </Typography>
        ))}
        {items.filter(item => item.tier === 'unranked').length > 0 && (
          <Typography variant="body1">未分類: {items.filter(item => item.tier === 'unranked').length}個</Typography>
        )}
        <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
            合計議席数 (Tier配置済 + 非改選): {Math.round(totalD3SeatsForModalDisplay)}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            自民党・公明党 合計: {Math.round(ldpKomeiTotalSeatsForModalDisplay)}議席
            {ldpKomeiTotalSeatsForModalDisplay >= majorityThreshold ? ' (過半数達成)' : ' (過半数まであと ' + Math.ceil(majorityThreshold - ldpKomeiTotalSeatsForModalDisplay) + '議席)'}
        </Typography>

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>未分類政党・候補者</Typography>
        {items.filter(item => item.tier === 'unranked').map(item => (
          <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>{item.name}</Typography>
            <IconButton size="small" onClick={() => handleDeleteItem(item.id)}>
              <Trash2 size={12} />
            </IconButton>
          </Box>
        ))}
      </Box>
    );
  };

  const majorityThreshold = 125; // JSXで使用するため再定義

  return (
    <Container maxWidth="lg" sx={{ padding: 3, backgroundColor: 'white', minHeight: '100vh', boxShadow: 3 }}>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            参議院 Tier Maker
          </Typography>
          <IconButton color="inherit" onClick={handleResetTier}>
            <RotateCcw />
          </IconButton>
          <IconButton color="inherit" onClick={handleShare}>
            <Share2 />
          </IconButton>
          <IconButton color="inherit" onClick={handleDownloadImage}>
            <Download />
          </IconButton>
          <IconButton color="inherit" onClick={() => setShowStatsModal(true)}>
            📊
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 新規アイテム追加フォーム */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="カスタムアイテム名"
          variant="outlined"
          size="small"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <Select
          value={newItemType}
          onChange={(e) => setNewItemType(e.target.value)}
          size="small"
        >
          <MenuItem value="party">政党</MenuItem>
          <MenuItem value="candidate">候補者</MenuItem>
        </Select>
        <Button variant="contained" onClick={handleAddItem} startIcon={<Plus />}>
          追加
        </Button>
      </Box>

      {/* Tier表本体（キャプチャ対象） */}
      <div ref={tierListRef} style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}>

        {/* 議席表 (扇状グラフ) の表示位置 */}
        <Typography variant="h6" sx={{ mt: 0, mb: 2, textAlign: 'center' }}>現在の議席予測 (Tier配置に基づく)</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <div id="senjo-giseki-chart" ref={chartRef}></div> {/* D3.jsの描画ターゲット */}
        </Box>
        
        {/* ★★★ 追加情報表示エリア ★★★ */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                合計議席数 (Tier配置済 + 非改選): 248席
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: ldpKomeiTotalSeats < majorityThreshold ? 'red' : 'black' }}>
                自民党・公明党 合計: {ldpKomeiTotalSeats}議席
                {ldpKomeiTotalSeats < majorityThreshold ? ` (過半数まであと ${Math.ceil(majorityThreshold - ldpKomeiTotalSeats)}議席)` : ' (過半数達成)'}
            </Typography>
        </Box>

        {/* Tierに政党が一つも配置されていない場合のメッセージ */}
        {items.filter(item => item.type === 'party' && item.tier !== 'unranked').length === 0 && (
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 1, mb: 3 }}>
                Tierに政党を配置するとグラフが表示されます。
            </Typography>
        )}
        {/* ここまでが議席表関連の描画エリア */}


        {/* 未分類アイテムエリア */}
        <Typography variant="h6" sx={{ mt: 0, mb: 2 }}>未分類アイテム</Typography>
        <Paper
          elevation={2}
          sx={{ ...tierRowStyle, border: 'none', backgroundColor: '#eee', padding: 2, minHeight: '120px' }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'unranked')}
          data-tier-dropzone="true" // ★★★ data属性を追加 ★★★
          onClick={() => handleTierAreaTap('unranked')} // ★★★ タップハンドラを追加 ★★★
        >
          {items.filter(item => item.tier === 'unranked').map(item => (
            <Box
              key={item.id}
              id={`item-${item.id}`}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, item)}
              onClick={(e) => {
                  e.stopPropagation(); // 親要素へのイベント伝播を停止
                  handleItemTap(item);
              }} // ★★★ タップハンドラを追加 ★★★
              data-selectable-item="true" // ★★★ data属性を追加 ★★★
              sx={{
                  ...getTierItemStyle(item),
                  // 選択中のアイテムにスタイルを適用
                  border: selectedItem && selectedItem.id === item.id ? '2px solid #1976d2' : '1px solid #ccc',
                  boxShadow: selectedItem && selectedItem.id === item.id ? '0px 0px 8px rgba(25, 118, 210, 0.5)' : '1px 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', display: 'block', margin: '0 auto 4px' }} />
              <Typography variant="caption" display="block" sx={{ textAlign: 'center', fontSize: '0.7rem' }}>
                {item.name}
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation(); // アイテム選択と削除が競合しないように停止
                  handleDeleteItem(item.id);
                }}
                sx={{ position: 'absolute', top: 0, right: 0, padding: '2px' }}
              >
                <Trash2 size={12} />
              </IconButton>
            </Box>
          ))}
        </Paper>

        {/* Tier 行のレンダリング */}
        {['SS', 'S', 'A', 'B', 'C', 'D', 'E', 'F'].map(tier => (
          <Box
            key={tier}
            sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}
          >
            <Box component="span" sx={getTierLabelStyle(tier)}>
              <Typography variant="h6">{tier}</Typography>
            </Box>
            <Paper
              elevation={1}
              sx={{ ...tierRowStyle, flexGrow: 1 }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, tier)}
              data-tier-dropzone="true" // ★★★ data属性を追加 ★★★
              onClick={() => handleTierAreaTap(tier)} // ★★★ タップハンドラを追加 ★★★
            >
              {items.filter(item => item.tier === tier).map(item => (
                <Box
                  key={item.id}
                  id={`item-${item.id}`}
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, item)}
                  onClick={(e) => {
                      e.stopPropagation(); // 親要素へのイベント伝播を停止
                      handleItemTap(item);
                  }} // ★★★ タップハンドラを追加 ★★★
                  data-selectable-item="true" // ★★★ data属性を追加 ★★★
                  sx={{
                      ...getTierItemStyle(item),
                      // 選択中のアイテムにスタイルを適用
                      border: selectedItem && selectedItem.id === item.id ? '2px solid #1976d2' : '1px solid #ccc',
                      boxShadow: selectedItem && selectedItem.id === item.id ? '0px 0px 8px rgba(25, 118, 210, 0.5)' : '1px 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', display: 'block', margin: '0 auto 4px' }} />
                  <Typography variant="caption" display="block" sx={{ textAlign: 'center', fontSize: '0.7rem' }}>
                    {item.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // アイテム選択と削除が競合しないように停止
                      handleDeleteItem(item.id);
                    }}
                    sx={{ position: 'absolute', top: 0, right: 0, padding: '2px' }}
                  >
                    <Trash2 size={12} />
                  </IconButton>
                </Box>
              ))}
            </Paper>
          </Box>
        ))}
      </div> {/* tierListRef の閉じタグ */}

      {/* ★★★ X (旧Twitter) タイムラインの埋め込み ★★★ */}
      <Box sx={{ mt: 4, mb: 4, p: 2, border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f5f8fa' }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>#選挙tier表 の投稿</Typography>
        <div className="twitter-timeline-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <a 
                className="twitter-timeline" 
                href="https://twitter.com/hashtag/%E9%81%B8%E6%8C%99tier%E8%A1%A8?src=hash&ref_src=twsrc%5Etfw" 
                data-tweet-limit="5"
                data-chrome="nofooter noborders noheader transparent"
                data-dnt="true"
            >
                #選挙tier表 のツイート
            </a>
        </div>
      </Box>

      {/* ★★★ 広告コードの挿入場所（両方iframe） ★★★ */}
      <Box sx={{ mt: 4, textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>
        <p>広告</p>
        
        {/* 楽天アフィリエイトの広告表示エリア (iframe) */}
        {/* widthとheightは楽天ウィジェットの指定サイズに合わせてください */}
        <iframe
          title="楽天アフィリエイト広告"
          width="468" // 楽天の指定サイズに合わせる
          height="160" // 楽天の指定サイズに合わせる
          frameBorder="0"
          scrolling="no"
          style={{ border: '0px', margin: '10px auto', display: 'block', maxWidth: '100%' }}
          // srcDoc属性でHTMLコンテンツを直接指定
          srcDoc={`
            <html>
            <head>
              <style>body{margin:0;padding:0;overflow:hidden;}</style>
            </head>
            <body>
              <script type="text/javascript">
                rakuten_design="slide";
                rakuten_affiliateId="447fea94.fe2f01f5.447fea95.5e192d59";
                rakuten_items="ctsmatch";
                rakuten_genreId="0";
                rakuten_size="468x160"; // この値はiframeのサイズと一致させる
                rakuten_target="_blank";
                rakuten_theme="gray";
                rakuten_border="on";
                rakuten_auto_mode="on";
                rakuten_genre_title="off";
                rakuten_recommend="on";
                rakuten_ts="1752666501907";
              </script>
              <script type="text/javascript" src="https://xml.affiliate.rakuten.co.jp/widget/js/rakuten_widget.js?20230106"></script>
            </body>
            </html>
          `}
        ></iframe>
        
        {/* Admaxの広告表示エリア (iframe) */}
        {/* widthとheightはAdmaxの広告サイズに合わせてください */}
        <iframe
          title="Admax広告"
          width="300" // Admaxの広告サイズに合わせて調整
          height="250" // Admaxの広告サイズに合わせて調整
          frameBorder="0"
          scrolling="no"
          style={{ border: '0px', margin: '10px auto', display: 'block', maxWidth: '100%' }}
          srcDoc={`
            <html>
            <head>
              <style>body{margin:0;padding:0;overflow:hidden;}</style>
            </head>
            <body>
              <div class="adm-ss-444bc8a2a1fc52558b100fe522d1db45"></div>
              <script src="https://adm.shinobi.jp/s/444bc8a2a1fc52558b100fe522d1db45"></script>
            </body>
            </html>
          `}
        ></iframe>

        <p>このサイトは広告収入で運営されています。</p>
      </Box>

      {/* Share Modal */}
      <Dialog open={showShareModal} onClose={() => setShowShareModal(false)}>
        <DialogTitle>Tier表を共有</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            value={shareUrl}
            InputProps={{ readOnly: true }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShareModal(false)}>閉じる</Button>
          <Button onClick={() => navigator.clipboard.writeText(shareUrl)}>
            <Copy size={16} /> コピー
          </Button>
          <IconButton
            component="a"
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter />
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* Stats Modal */}
      <Dialog open={showStatsModal} onClose={() => setShowStatsModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>評価統計</DialogTitle>
        <DialogContent>
          {calculateStatsContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStatsModal(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SangiinTierPage;
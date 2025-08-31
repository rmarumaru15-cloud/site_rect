const readline = require('readline');
const axios = require('axios');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('音声コマンド（テキストで入力してください）:');

rl.on('line', async (input) => {
  // 入力をサーバーに送信
  try {
    const res = await axios.post('http://localhost:5000/voice-command', {
      command: input
    });
    console.log('サーバーの応答:', res.data.result);
  } catch (err) {
    console.error('エラー:', err.response ? err.response.data : err.message);
  }
  console.log('\n続けてコマンドを入力してください:');
});

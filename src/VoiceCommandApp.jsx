import React, { useState } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function VoiceCommandApp() {
  const [command, setCommand] = useState('');
  const [result, setResult] = useState('');
  const [listening, setListening] = useState(false);

  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const startListening = () => {
    if (!recognition) {
      alert('このブラウザは音声認識に対応していません');
      return;
    }
    setListening(true);
    recognition.lang = 'ja-JP';
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setCommand(transcript);
      sendCommand(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  const sendCommand = async (cmd) => {
    const res = await fetch('http://localhost:5000/voice-command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: cmd })
    });
    const data = await res.json();
    setResult(data.result);
  };

  return (
    <div>
      <h2>音声コマンドアプリ</h2>
      <button onClick={startListening} disabled={listening}>
        {listening ? 'リスニング中...' : '音声入力開始'}
      </button>
      <div>
        <strong>コマンド:</strong> {command}
      </div>
      <div>
        <strong>サーバー応答:</strong> {result}
      </div>
    </div>
  );
}

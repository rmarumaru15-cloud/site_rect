import React, { useRef, useState, useEffect } from 'react';

export default function VoiceRecorderApp() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [audioName, setAudioName] = useState('');
  const [voiceList, setVoiceList] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    fetchVoiceList();
  }, []);

  const fetchVoiceList = async () => {
    try {
      const res = await fetch('http://localhost:5000/voice-list');
      if (!res.ok) {
        throw new Error('サーバーから音声リストを取得できませんでした: ' + res.status);
      }
      const files = await res.json();
      setVoiceList(files);
    } catch (err) {
      alert('音声リスト取得エラー: ' + err.message);
      setVoiceList([]);
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new window.MediaRecorder(stream);
    audioChunksRef.current = [];
    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      setAudioUrl(URL.createObjectURL(blob));
    };
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const uploadAudio = async () => {
    if (!audioUrl || !audioName) return;
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64 = reader.result.split(',')[1];
          const res = await fetch('http://localhost:5000/voice-upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: audioName, audioBase64: base64 })
          });
          if (!res.ok) {
            throw new Error('サーバーへのアップロードに失敗しました');
          }
          setAudioName('');
          setAudioUrl('');
          fetchVoiceList();
        } catch (err) {
          alert('アップロードに失敗しました: ' + err.message);
          console.error(err);
        }
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      alert('アップロードに失敗しました: ' + err.message);
      console.error(err);
    }
  };

  return (
    <div>
      <h2>音声録音＆再生アプリ</h2>
      <div>
        <button onClick={recording ? stopRecording : startRecording}>
          {recording ? '録音停止' : '録音開始'}
        </button>
      </div>
      {audioUrl && (
        <div>
          <audio src={audioUrl} controls />
          <div>
            <input
              type="text"
              placeholder="保存名"
              value={audioName}
              onChange={e => setAudioName(e.target.value)}
            />
            <button onClick={uploadAudio}>サーバーに保存</button>
          </div>
        </div>
      )}
      <h3>保存済み音声</h3>
      <ul>
        {voiceList.map(file => (
          <li key={file}>
            {file}
            <audio src={`http://localhost:5000/voice-audio/${file}`} controls style={{ marginLeft: 8 }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

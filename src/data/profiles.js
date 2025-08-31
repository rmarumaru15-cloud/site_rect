// src/data/profiles.js

export const profiles = [
  {
    id: 'a', // URLのパスに使われる一意のID
    name: '運営者A (〇〇)',
    shortBio: '政治経済、国際関係に精通し、独自の視点で深く分析する専門家。',
    longBio: `
      運営者A（〇〇）は、長年にわたり政治経済のアナリストとして活動。
      国際情勢の複雑な絡み合いを分かりやすく解説することに定評があります。
      特に、選挙制度や各政党の政策に対する深い洞察力は、多くのフォロワーから支持されています。
      趣味は歴史書を読むことと、地域のボランティア活動への参加。
      「政治をもっと身近に、もっと面白く」をモットーに情報発信を続けています。
    `,
    avatar: '/avatars/avatar-a.png',
    sns: {
      youtube: 'https://www.youtube.com/channel/YOUR_CHANNEL_ID_A', // YouTubeチャンネルURL
      x: 'https://twitter.com/YOUR_X_ACCOUNT_A', // XアカウントURL
      // instagram: 'https://instagram.com/YOUR_INSTAGRAM_A',
    },
    // 必要であれば追加情報
  },
  {
    id: 'b',
    name: '運営者B (△△)',
    shortBio: '市民目線で政治をわかりやすく解説する、行動派のインフルエンサー。',
    longBio: `
      運営者B（△△）は、若者にも政治への関心を持ってもらうため、SNSやライブ配信で積極的に活動しています。
      複雑な政治用語を噛み砕いて説明し、身近な問題との繋がりを示すことで、多くの共感を呼んでいます。
      毎週行われるライブ配信では、視聴者からの質問に直接答えるなど、インタラクティブなコミュニケーションを重視。
      特技は即興でのユーモアあふれる解説。
      「みんなで考え、みんなで変える政治」を目指して活動しています。
    `,
    avatar: '/avatars/avatar-b.png',
    sns: {
      youtube: 'https://www.youtube.com/channel/YOUR_CHANNEL_ID_B',
      x: 'https://twitter.com/YOUR_X_ACCOUNT_B',
      // instagram: 'https://instagram.com/YOUR_INSTAGRAM_B',
    },
    // 必要であれば追加情報
  },
  // 必要に応じて他の人物のプロフィールを追加
];
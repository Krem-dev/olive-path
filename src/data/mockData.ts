import { Devotion, Sermon, QAItem } from '../types/content';

// ── Daily Devotion ──
export const todaysDevotion: Devotion = {
  id: 'dev-1',
  date: new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  scripture:
    'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
  scriptureRef: 'Jeremiah 29:11',
  encouragement:
    'God has a purpose for your life. Trust His timing and walk in faith today.',
};

// ── Sermons / Teachings ──
export const sermons: Sermon[] = [
  {
    id: 's-1',
    title: 'The Power of Faith',
    scripture: 'Hebrews 11:1',
    summary:
      'An exploration of what it means to walk by faith and not by sight in our daily lives.',
    thumbnailUrl: 'https://picsum.photos/seed/sermon1/400/225',
    duration: '45 min',
    date: '2026-03-20',
    category: 'preaching',
    contentType: 'video',
    videoId: 'dQw4w9WgXcQ',
  },
  {
    id: 's-2',
    title: 'Grace That Transforms',
    scripture: 'Ephesians 2:8-9',
    summary:
      'Understanding the depth of God\'s grace and how it transforms every area of our lives.',
    thumbnailUrl: 'https://picsum.photos/seed/sermon2/400/225',
    duration: '38 min',
    date: '2026-03-17',
    category: 'preaching',
    contentType: 'audio',
    videoId: 'dQw4w9WgXcQ',
  },
  {
    id: 's-3',
    title: 'Walking in the Spirit',
    scripture: 'Galatians 5:16',
    summary:
      'Practical steps to living a Spirit-led life and bearing the fruit of the Spirit.',
    thumbnailUrl: 'https://picsum.photos/seed/sermon3/400/225',
    duration: '52 min',
    date: '2026-03-13',
    category: 'preaching',
    contentType: 'video',
    videoId: 'dQw4w9WgXcQ',
  },
  {
    id: 's-4',
    title: 'The Heart of Worship',
    scripture: 'John 4:24',
    summary:
      'What does it mean to worship God in spirit and in truth? A deep look at authentic worship.',
    thumbnailUrl: 'https://picsum.photos/seed/sermon4/400/225',
    duration: '41 min',
    date: '2026-03-10',
    category: 'preaching',
    contentType: 'reading',
  },
  {
    id: 's-5',
    title: 'Overcoming Fear',
    scripture: '2 Timothy 1:7',
    summary:
      'God has not given us a spirit of fear. Learn how to conquer anxiety through faith.',
    thumbnailUrl: 'https://picsum.photos/seed/sermon5/400/225',
    duration: '36 min',
    date: '2026-03-06',
    category: 'preaching',
    contentType: 'audio',
  },
  {
    id: 's-6',
    title: 'Purpose and Destiny',
    scripture: 'Psalm 139:16',
    summary:
      'Discovering and walking in the unique purpose God has ordained for your life.',
    thumbnailUrl: 'https://picsum.photos/seed/sermon6/400/225',
    duration: '48 min',
    date: '2026-03-03',
    category: 'preaching',
    contentType: 'video',
    videoId: 'dQw4w9WgXcQ',
  },
];

// ── Motivational Messages ──
export const motivations: Sermon[] = [
  {
    id: 'm-1',
    title: 'Rise Above Your Circumstances',
    scripture: 'Romans 8:28',
    summary:
      'Every setback is a setup for a greater comeback. God is working all things together for your good.',
    thumbnailUrl: 'https://picsum.photos/seed/motiv1/400/225',
    duration: '18 min',
    date: '2026-03-21',
    category: 'motivation',
    contentType: 'audio',
  },
  {
    id: 'm-2',
    title: 'You Are Not Alone',
    scripture: 'Isaiah 41:10',
    summary:
      'In your darkest moments, remember that God is right there with you. He will never leave you.',
    thumbnailUrl: 'https://picsum.photos/seed/motiv2/400/225',
    duration: '15 min',
    date: '2026-03-18',
    category: 'motivation',
    contentType: 'reading',
  },
  {
    id: 'm-3',
    title: 'The Strength Within',
    scripture: 'Philippians 4:13',
    summary:
      'You can do all things through Christ who strengthens you. Tap into your divine potential.',
    thumbnailUrl: 'https://picsum.photos/seed/motiv3/400/225',
    duration: '20 min',
    date: '2026-03-15',
    category: 'motivation',
    contentType: 'video',
    videoId: 'dQw4w9WgXcQ',
  },
  {
    id: 'm-4',
    title: 'Press Forward',
    scripture: 'Philippians 3:14',
    summary:
      'Forgetting what is behind and straining toward what is ahead — press on toward the goal.',
    thumbnailUrl: 'https://picsum.photos/seed/motiv4/400/225',
    duration: '22 min',
    date: '2026-03-12',
    category: 'motivation',
    contentType: 'audio',
  },
];

// ── Q&A ──
export const qaItems: QAItem[] = [
  {
    id: 'qa-1',
    question: 'What does the Bible say about tithing?',
    answer:
      'Tithing is the practice of giving a tenth of your income to God. It is an act of worship and obedience that demonstrates trust in God as our provider.',
    scripture: 'Malachi 3:10',
    category: 'Finance',
  },
  {
    id: 'qa-2',
    question: 'How do I know God\'s will for my life?',
    answer:
      'God reveals His will through His Word, prayer, the Holy Spirit, godly counsel, and circumstances. Seek Him earnestly and He will direct your path.',
    scripture: 'Proverbs 3:5-6',
    category: 'Guidance',
  },
  {
    id: 'qa-3',
    question: 'Is speaking in tongues for today?',
    answer:
      'Speaking in tongues is a gift of the Holy Spirit that is available to believers today. It is a means of prayer, edification, and spiritual communication.',
    scripture: '1 Corinthians 14:2',
    category: 'Holy Spirit',
  },
  {
    id: 'qa-4',
    question: 'What is the baptism of the Holy Spirit?',
    answer:
      'The baptism of the Holy Spirit is a distinct experience from salvation where believers receive supernatural power for service and witness.',
    scripture: 'Acts 1:8',
    category: 'Holy Spirit',
  },
  {
    id: 'qa-5',
    question: 'How should Christians handle anxiety?',
    answer:
      'The Bible instructs us to cast our anxieties on God through prayer and thanksgiving, trusting that His peace will guard our hearts and minds.',
    scripture: 'Philippians 4:6-7',
    category: 'Christian Living',
  },
  {
    id: 'qa-6',
    question: 'What does the Bible say about forgiveness?',
    answer:
      'Forgiveness is central to the Christian faith. As God has forgiven us through Christ, we are called to forgive others — not as a feeling, but as a choice of obedience.',
    scripture: 'Colossians 3:13',
    category: 'Christian Living',
  },
];

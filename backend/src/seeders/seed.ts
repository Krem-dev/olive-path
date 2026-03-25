import sequelize from '../db/connection';
import { User, Devotion, Sermon, QAItem, Notification } from '../models';

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // Sync all tables (force: true drops and recreates)
    await sequelize.sync({ force: true });
    console.log('Tables recreated.');

    // ── Users ──
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@olivepath.org',
      password: 'admin123',
      authProvider: 'email',
    });

    const testUser = await User.create({
      name: 'Grace Mensah',
      email: 'grace@example.com',
      password: 'test1234',
      authProvider: 'email',
    });

    console.log('Users seeded.');

    // ── Devotions ──
    const today = new Date();
    const devotions = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      devotions.push(date.toISOString().split('T')[0]);
    }

    await Devotion.bulkCreate([
      {
        date: devotions[0],
        scripture: '"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."',
        scriptureRef: 'Jeremiah 29:11',
        encouragement: 'God has a purpose for your life. Trust His timing and walk in faith today.',
      },
      {
        date: devotions[1],
        scripture: '"The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul."',
        scriptureRef: 'Psalm 23:1-3',
        encouragement: 'The Lord is guiding your every step. Rest in His provision and let Him restore your soul today.',
      },
      {
        date: devotions[2],
        scripture: '"Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to Him, and He will make your paths straight."',
        scriptureRef: 'Proverbs 3:5-6',
        encouragement: 'When the path seems unclear, surrender your understanding to God. He will direct your steps.',
      },
      {
        date: devotions[3],
        scripture: '"But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint."',
        scriptureRef: 'Isaiah 40:31',
        encouragement: 'Your strength comes from the Lord. Wait on Him and He will renew you for every challenge ahead.',
      },
      {
        date: devotions[4],
        scripture: '"I can do all things through Christ who strengthens me."',
        scriptureRef: 'Philippians 4:13',
        encouragement: 'No obstacle is too great when Christ is your strength. Step into today with confidence.',
      },
      {
        date: devotions[5],
        scripture: '"Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go."',
        scriptureRef: 'Joshua 1:9',
        encouragement: 'God goes before you and walks beside you. There is no place His presence cannot reach.',
      },
      {
        date: devotions[6],
        scripture: '"And we know that in all things God works for the good of those who love Him, who have been called according to His purpose."',
        scriptureRef: 'Romans 8:28',
        encouragement: 'Even in difficulty, God is working all things together for your good. Hold onto His promise.',
      },
    ]);

    console.log('Devotions seeded.');

    // ── Sermons (Preaching) ──
    await Sermon.bulkCreate([
      {
        title: 'The Power of Faith',
        scripture: 'Hebrews 11:1',
        summary: 'An in-depth exploration of what it means to walk by faith and not by sight. Rev. Ing. Eric Ofori Broni unpacks the essence of believing God beyond what we can see, drawing from the hall of faith in Hebrews 11.',
        thumbnailUrl: 'https://picsum.photos/seed/sermon1/400/225',
        videoId: 'dQw4w9WgXcQ',
        duration: '45 min',
        contentType: 'video',
        category: 'preaching',
        publishedAt: new Date('2026-03-20'),
        viewCount: 1250,
      },
      {
        title: 'Grace That Transforms',
        scripture: 'Ephesians 2:8-9',
        summary: 'Understanding the transformative power of God\'s grace. This teaching reveals how grace is not just forgiveness but a supernatural empowerment to live the life God has called us to.',
        thumbnailUrl: 'https://picsum.photos/seed/sermon2/400/225',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration: '38 min',
        contentType: 'audio',
        category: 'preaching',
        publishedAt: new Date('2026-03-18'),
        viewCount: 980,
      },
      {
        title: 'Walking in the Spirit',
        scripture: 'Galatians 5:16',
        summary: 'A practical teaching on how to live a Spirit-led life daily. Ps. Eric explains the difference between walking in the flesh and walking in the Spirit, with practical steps for every believer.',
        thumbnailUrl: 'https://picsum.photos/seed/sermon3/400/225',
        videoId: 'dQw4w9WgXcQ',
        duration: '52 min',
        contentType: 'video',
        category: 'preaching',
        publishedAt: new Date('2026-03-15'),
        viewCount: 2100,
      },
      {
        title: 'The Heart of Worship',
        scripture: 'John 4:24',
        summary: 'What does it truly mean to worship God in spirit and in truth? This message goes beyond the songs we sing to the posture of our hearts before God.',
        thumbnailUrl: 'https://picsum.photos/seed/sermon4/400/225',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        duration: '41 min',
        contentType: 'audio',
        category: 'preaching',
        publishedAt: new Date('2026-03-12'),
        viewCount: 750,
      },
      {
        title: 'Foundations of Prayer',
        scripture: 'Matthew 6:9-13',
        summary: 'Jesus gave us a model for prayer that covers every area of life. This teaching breaks down the Lord\'s Prayer and shows how to build a powerful prayer life.',
        thumbnailUrl: 'https://picsum.photos/seed/sermon5/400/225',
        duration: '35 min',
        contentType: 'reading',
        category: 'preaching',
        publishedAt: new Date('2026-03-10'),
        viewCount: 620,
      },
      {
        title: 'The Authority of the Believer',
        scripture: 'Luke 10:19',
        summary: 'Understanding the authority Christ has given to every believer. Learn how to exercise spiritual authority in your daily life and overcome the works of the enemy.',
        thumbnailUrl: 'https://picsum.photos/seed/sermon6/400/225',
        videoId: 'dQw4w9WgXcQ',
        duration: '48 min',
        contentType: 'video',
        category: 'preaching',
        publishedAt: new Date('2026-03-08'),
        viewCount: 1800,
      },
      {
        title: 'Understanding Covenant',
        scripture: 'Genesis 17:7',
        summary: 'God is a covenant-keeping God. This foundational teaching explores what it means to be in covenant with God and how that changes everything about how we approach life.',
        thumbnailUrl: 'https://picsum.photos/seed/sermon7/400/225',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        duration: '55 min',
        contentType: 'audio',
        category: 'preaching',
        publishedAt: new Date('2026-03-05'),
        viewCount: 1400,
      },
      {
        title: 'The Ministry of the Holy Spirit',
        scripture: 'John 14:26',
        summary: 'The Holy Spirit is more than a force — He is a person. Discover the many roles of the Holy Spirit in the life of a believer and how to cultivate intimacy with Him.',
        thumbnailUrl: 'https://picsum.photos/seed/sermon8/400/225',
        videoId: 'dQw4w9WgXcQ',
        duration: '60 min',
        contentType: 'video',
        category: 'preaching',
        publishedAt: new Date('2026-03-02'),
        viewCount: 3200,
      },
    ]);

    // ── Sermons (Motivation) ──
    await Sermon.bulkCreate([
      {
        title: 'Rise Above Your Circumstances',
        scripture: 'Romans 8:28',
        summary: 'No matter what you are going through, God is working behind the scenes. This motivational teaching will help you see beyond your current situation to the greatness God has planned for you.',
        thumbnailUrl: 'https://picsum.photos/seed/motiv1/400/225',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        duration: '18 min',
        contentType: 'audio',
        category: 'motivation',
        publishedAt: new Date('2026-03-22'),
        viewCount: 890,
      },
      {
        title: 'You Are Not Alone',
        scripture: 'Isaiah 41:10',
        summary: 'In your darkest moments, remember that God has promised never to leave you nor forsake you. Draw strength from His constant presence.',
        thumbnailUrl: 'https://picsum.photos/seed/motiv2/400/225',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        duration: '15 min',
        contentType: 'audio',
        category: 'motivation',
        publishedAt: new Date('2026-03-19'),
        viewCount: 1100,
      },
      {
        title: 'Purpose Over Pain',
        scripture: '2 Corinthians 4:17',
        summary: 'Your pain is not the end of your story. God uses our struggles to develop character, build resilience, and prepare us for the great things He has in store.',
        thumbnailUrl: 'https://picsum.photos/seed/motiv3/400/225',
        videoId: 'dQw4w9WgXcQ',
        duration: '22 min',
        contentType: 'video',
        category: 'motivation',
        publishedAt: new Date('2026-03-16'),
        viewCount: 670,
      },
      {
        title: 'The Strength to Continue',
        scripture: 'Philippians 3:14',
        summary: 'When you feel like giving up, press toward the mark. This message will reignite your passion and remind you why you started this journey of faith.',
        thumbnailUrl: 'https://picsum.photos/seed/motiv4/400/225',
        duration: '12 min',
        contentType: 'reading',
        category: 'motivation',
        publishedAt: new Date('2026-03-13'),
        viewCount: 540,
      },
      {
        title: 'Created for Greatness',
        scripture: 'Ephesians 2:10',
        summary: 'You are God\'s workmanship, created in Christ Jesus for good works. Step into the identity God has given you and walk in the greatness He has ordained.',
        thumbnailUrl: 'https://picsum.photos/seed/motiv5/400/225',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        duration: '20 min',
        contentType: 'audio',
        category: 'motivation',
        publishedAt: new Date('2026-03-09'),
        viewCount: 920,
      },
    ]);

    console.log('Sermons seeded.');

    // ── Q&A Items ──
    await QAItem.bulkCreate([
      {
        question: 'Is speaking in tongues for today?',
        answer: 'Yes. The gift of speaking in tongues is a valid and active gift of the Holy Spirit for believers today. It was given at Pentecost and remains available to all who seek it. It is a prayer language that edifies the believer and a powerful tool for intercession.',
        scripture: 'Acts 2:4',
        category: 'Holy Spirit',
        sortOrder: 1,
      },
      {
        question: 'What is the baptism of the Holy Spirit?',
        answer: 'The baptism of the Holy Spirit is a distinct experience from salvation where believers receive supernatural power for service and witness. It is evidenced by speaking in tongues and empowers believers to live effectively for Christ.',
        scripture: 'Acts 1:8',
        category: 'Holy Spirit',
        sortOrder: 2,
      },
      {
        question: 'How do I know God\'s will for my life?',
        answer: 'God reveals His will through His Word, through prayer, through the Holy Spirit\'s inner witness, through godly counsel, and through circumstances. Stay connected to God through daily devotion and He will make His path clear.',
        scripture: 'Proverbs 3:5-6',
        category: 'Guidance',
        sortOrder: 1,
      },
      {
        question: 'What does the Bible say about tithing?',
        answer: 'Tithing is a biblical principle of giving the first 10% of your increase to God. It is an act of worship, faith, and obedience. Malachi teaches that tithing opens the windows of heaven. In the New Testament, we are called to be generous and cheerful givers.',
        scripture: 'Malachi 3:10',
        category: 'Finance',
        sortOrder: 1,
      },
      {
        question: 'Is it wrong to be wealthy as a Christian?',
        answer: 'No. Wealth itself is not sinful — it is the love of money that is the root of evil. God blesses His people so they can be a blessing to others. What matters is your heart posture: are you a steward of what God has given, or has money become your god?',
        scripture: '1 Timothy 6:10',
        category: 'Finance',
        sortOrder: 2,
      },
      {
        question: 'How should a Christian handle anxiety?',
        answer: 'The Bible instructs us to cast all our anxieties on God because He cares for us. Through prayer, worship, and meditating on God\'s Word, we can experience the peace that surpasses all understanding. This doesn\'t mean we ignore professional help — God also works through counselors and medical professionals.',
        scripture: 'Philippians 4:6-7',
        category: 'Christian Living',
        sortOrder: 1,
      },
      {
        question: 'What is the role of the church in a believer\'s life?',
        answer: 'The church is the body of Christ and every believer is a vital part of it. Regular fellowship, worship, accountability, and service within a local church are essential for spiritual growth. The Bible warns against forsaking the assembling of believers.',
        scripture: 'Hebrews 10:25',
        category: 'Christian Living',
        sortOrder: 2,
      },
      {
        question: 'Can a Christian lose their salvation?',
        answer: 'The Bible teaches that those who are truly born again are kept by the power of God. However, believers must continue to walk in faith and obedience. God\'s grace is sufficient, but it is not a license to live in willful sin. Remain in Christ and His Word will remain in you.',
        scripture: 'John 10:28-29',
        category: 'Salvation',
        sortOrder: 1,
      },
      {
        question: 'How do I overcome temptation?',
        answer: 'Jesus overcame temptation by knowing and declaring the Word of God. We overcome temptation through the Word, prayer, accountability, and the power of the Holy Spirit. Flee from situations that lead to sin and draw near to God.',
        scripture: 'James 4:7',
        category: 'Christian Living',
        sortOrder: 3,
      },
      {
        question: 'What is the significance of water baptism?',
        answer: 'Water baptism is an outward declaration of an inward transformation. It symbolizes the death, burial, and resurrection of Jesus Christ. When we are baptized, we identify with Christ\'s death to sin and His resurrection to new life.',
        scripture: 'Romans 6:4',
        category: 'Salvation',
        sortOrder: 2,
      },
    ]);

    console.log('Q&A items seeded.');

    // ── Notifications for test user ──
    await Notification.bulkCreate([
      {
        userId: testUser.id,
        title: 'New Teaching Available',
        message: '"The Power of Faith" by Rev. Ing. Eric Ofori Broni is now available. Watch it now!',
        type: 'new_teaching',
      },
      {
        userId: testUser.id,
        title: 'Daily Devotion',
        message: 'Your daily devotion is ready. Start your day with God\'s Word.',
        type: 'devotion',
      },
      {
        userId: testUser.id,
        title: 'Welcome to Olive Path',
        message: 'Thank you for joining Olive Path Network. Explore teachings, devotions, and more. Making Christ known!',
        type: 'general',
        isRead: true,
      },
    ]);

    console.log('Notifications seeded.');
    console.log('\nSeed completed successfully!');
    console.log('Test user: grace@example.com / test1234');
    console.log('Admin user: admin@olivepath.org / admin123');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();

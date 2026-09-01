/* =========================================================
   Young Heroes - static content data
   Everything here is plain data so the app works 100% offline.
   ========================================================= */
window.YH = window.YH || {};

/* ---------- Hero avatars (free starters) ---------- */
YH.AVATARS = ['\u{1F9B8}', '\u{1F9B8}‍♀️', '\u{1F9D9}', '\u{1F9DA}', '\u{1F42F}', '\u{1F98A}',
    '\u{1F43C}', '\u{1F984}', '\u{1F428}', '\u{1F438}', '\u{1F981}', '\u{1F435}'];

YH.HERO_COLORS = [
    { id: 'blue', c1: '#4c6ef5', c2: '#22b8cf' },
    { id: 'pink', c1: '#f06595', c2: '#ff922b' },
    { id: 'green', c1: '#37b24d', c2: '#94d82d' },
    { id: 'purple', c1: '#845ef7', c2: '#e599f7' },
    { id: 'sun', c1: '#f59f00', c2: '#ffd43b' },
    { id: 'ocean', c1: '#1098ad', c2: '#63e6be' }
];

/* ---------- Shop: things kids buy with coins ---------- */
YH.SHOP = [
    { id: 'cap', emoji: '\u{1F9E2}', price: 20, type: 'hat' },
    { id: 'party', emoji: '\u{1F389}', price: 25, type: 'hat' },
    { id: 'star', emoji: '⭐', price: 35, type: 'hat' },
    { id: 'wizard', emoji: '\u{1F3A9}', price: 45, type: 'hat' },
    { id: 'crown', emoji: '\u{1F451}', price: 70, type: 'hat' },
    { id: 'butterfly', emoji: '\u{1F98B}', price: 30, type: 'pet' },
    { id: 'cat', emoji: '\u{1F408}', price: 40, type: 'pet' },
    { id: 'rocket', emoji: '\u{1F680}', price: 80, type: 'pet' },
    { id: 'robot', emoji: '\u{1F916}', price: 95, type: 'pet' },
    { id: 'dragon', emoji: '\u{1F409}', price: 130, type: 'pet' }
];

/* ---------- Badges ---------- */
YH.BADGES = [
    { id: 'first_step', emoji: '\u{1F463}', test: p => p.totalCorrect >= 1 },
    { id: 'streak5', emoji: '\u{1F525}', test: p => p.bestStreak >= 5 },
    { id: 'streak10', emoji: '⚡', test: p => p.bestStreak >= 10 },
    { id: 'coin50', emoji: '\u{1F4B0}', test: p => p.lifetimeCoins >= 50 },
    { id: 'coin200', emoji: '\u{1F48E}', test: p => p.lifetimeCoins >= 200 },
    { id: 'level5', emoji: '\u{1F3C5}', test: p => p.level >= 5 },
    { id: 'level10', emoji: '\u{1F3C6}', test: p => p.level >= 10 },
    { id: 'math100', emoji: '➕', test: p => (p.stats.math || 0) >= 100 },
    { id: 'word100', emoji: '\u{1F4DA}', test: p => (p.stats.word || 0) >= 100 },
    { id: 'bilingual', emoji: '\u{1F30D}', test: p => (p.stats.translate || 0) >= 25 },
    { id: 'speller', emoji: '\u{1F524}', test: p => (p.stats.spelling || 0) >= 25 },
    { id: 'listener', emoji: '\u{1F442}', test: p => (p.stats.listening || 0) >= 25 }
];

/* ---------- Game catalogue (the world map) ---------- */
YH.GAMES = [
    { id: 'addition', land: 'numbers', emoji: '➕', color: '#4c6ef5', kind: 'math' },
    { id: 'subtraction', land: 'numbers', emoji: '➖', color: '#f06595', kind: 'math' },
    { id: 'multiplication', land: 'numbers', emoji: '✖️', color: '#f59f00', kind: 'math' },
    { id: 'numbers', land: 'numbers', emoji: '\u{1F522}', color: '#37b24d', kind: 'math' },
    { id: 'wordmatch', land: 'words', emoji: '\u{1F5BC}️', color: '#845ef7', kind: 'word' },
    { id: 'translate', land: 'words', emoji: '\u{1F30D}', color: '#1098ad', kind: 'translate' },
    { id: 'spelling', land: 'words', emoji: '\u{1F524}', color: '#e8590c', kind: 'spelling' },
    { id: 'listening', land: 'words', emoji: '\u{1F442}', color: '#0ca678', kind: 'listening' }
];

/* ---------- Bilingual picture vocabulary ----------
   en : english word | ar : arabic word | img : picture emoji | cat : category
------------------------------------------------------ */
YH.WORDS = [
    /* animals */
    { en: 'cat', ar: 'قطة', img: '\u{1F431}', cat: 'animals' },
    { en: 'dog', ar: 'كلب', img: '\u{1F436}', cat: 'animals' },
    { en: 'lion', ar: 'أسد', img: '\u{1F981}', cat: 'animals' },
    { en: 'bird', ar: 'طائر', img: '\u{1F426}', cat: 'animals' },
    { en: 'fish', ar: 'سمكة', img: '\u{1F41F}', cat: 'animals' },
    { en: 'horse', ar: 'حصان', img: '\u{1F434}', cat: 'animals' },
    { en: 'camel', ar: 'جمل', img: '\u{1F42B}', cat: 'animals' },
    { en: 'bee', ar: 'نحلة', img: '\u{1F41D}', cat: 'animals' },
    { en: 'duck', ar: 'بطة', img: '\u{1F986}', cat: 'animals' },
    { en: 'elephant', ar: 'فيل', img: '\u{1F418}', cat: 'animals' },
    { en: 'rabbit', ar: 'أرنب', img: '\u{1F430}', cat: 'animals' },
    { en: 'sheep', ar: 'خروف', img: '\u{1F411}', cat: 'animals' },

    /* food */
    { en: 'apple', ar: 'تفاحة', img: '\u{1F34E}', cat: 'food' },
    { en: 'banana', ar: 'موزة', img: '\u{1F34C}', cat: 'food' },
    { en: 'bread', ar: 'خبز', img: '\u{1F35E}', cat: 'food' },
    { en: 'milk', ar: 'حليب', img: '\u{1F95B}', cat: 'food' },
    { en: 'water', ar: 'ماء', img: '\u{1F4A7}', cat: 'food' },
    { en: 'egg', ar: 'بيضة', img: '\u{1F95A}', cat: 'food' },
    { en: 'cheese', ar: 'جبن', img: '\u{1F9C0}', cat: 'food' },
    { en: 'grapes', ar: 'عنب', img: '\u{1F347}', cat: 'food' },
    { en: 'orange', ar: 'برتقالة', img: '\u{1F34A}', cat: 'food' },
    { en: 'honey', ar: 'عسل', img: '\u{1F36F}', cat: 'food' },
    { en: 'rice', ar: 'أرز', img: '\u{1F35A}', cat: 'food' },
    { en: 'cake', ar: 'كعكة', img: '\u{1F370}', cat: 'food' },

    /* colors */
    { en: 'red', ar: 'أحمر', img: '\u{1F7E5}', cat: 'colors' },
    { en: 'blue', ar: 'أزرق', img: '\u{1F7E6}', cat: 'colors' },
    { en: 'green', ar: 'أخضر', img: '\u{1F7E9}', cat: 'colors' },
    { en: 'yellow', ar: 'أصفر', img: '\u{1F7E8}', cat: 'colors' },
    { en: 'black', ar: 'أسود', img: '⬛', cat: 'colors' },
    { en: 'white', ar: 'أبيض', img: '⬜', cat: 'colors' },
    { en: 'purple', ar: 'بنفسجي', img: '\u{1F7EA}', cat: 'colors' },
    { en: 'brown', ar: 'بني', img: '\u{1F7EB}', cat: 'colors' },

    /* family & people */
    { en: 'mother', ar: 'أم', img: '\u{1F469}', cat: 'family' },
    { en: 'father', ar: 'أب', img: '\u{1F468}', cat: 'family' },
    { en: 'baby', ar: 'طفل', img: '\u{1F476}', cat: 'family' },
    { en: 'friend', ar: 'صديق', img: '\u{1F91D}', cat: 'family' },
    { en: 'teacher', ar: 'معلم', img: '\u{1F9D1}‍\u{1F3EB}', cat: 'family' },
    { en: 'doctor', ar: 'طبيب', img: '\u{1F9D1}‍⚕️', cat: 'family' },

    /* school */
    { en: 'book', ar: 'كتاب', img: '\u{1F4D5}', cat: 'school' },
    { en: 'pen', ar: 'قلم', img: '\u{1F58A}️', cat: 'school' },
    { en: 'school', ar: 'مدرسة', img: '\u{1F3EB}', cat: 'school' },
    { en: 'bag', ar: 'حقيبة', img: '\u{1F392}', cat: 'school' },
    { en: 'ruler', ar: 'مسطرة', img: '\u{1F4CF}', cat: 'school' },
    { en: 'paper', ar: 'ورقة', img: '\u{1F4C4}', cat: 'school' },

    /* nature */
    { en: 'sun', ar: 'شمس', img: '☀️', cat: 'nature' },
    { en: 'moon', ar: 'قمر', img: '\u{1F319}', cat: 'nature' },
    { en: 'star', ar: 'نجمة', img: '⭐', cat: 'nature' },
    { en: 'tree', ar: 'شجرة', img: '\u{1F333}', cat: 'nature' },
    { en: 'flower', ar: 'زهرة', img: '\u{1F338}', cat: 'nature' },
    { en: 'rain', ar: 'مطر', img: '\u{1F327}️', cat: 'nature' },
    { en: 'sea', ar: 'بحر', img: '\u{1F30A}', cat: 'nature' },
    { en: 'mountain', ar: 'جبل', img: '⛰️', cat: 'nature' },
    { en: 'fire', ar: 'نار', img: '\u{1F525}', cat: 'nature' },
    { en: 'snow', ar: 'ثلج', img: '❄️', cat: 'nature' },

    /* home & things */
    { en: 'house', ar: 'بيت', img: '\u{1F3E0}', cat: 'home' },
    { en: 'door', ar: 'باب', img: '\u{1F6AA}', cat: 'home' },
    { en: 'chair', ar: 'كرسي', img: '\u{1FA91}', cat: 'home' },
    { en: 'bed', ar: 'سرير', img: '\u{1F6CF}️', cat: 'home' },
    { en: 'key', ar: 'مفتاح', img: '\u{1F511}', cat: 'home' },
    { en: 'clock', ar: 'ساعة', img: '⏰', cat: 'home' },
    { en: 'car', ar: 'سيارة', img: '\u{1F697}', cat: 'home' },
    { en: 'ball', ar: 'كرة', img: '⚽', cat: 'home' },
    { en: 'boat', ar: 'قارب', img: '⛵', cat: 'home' },
    { en: 'plane', ar: 'طائرة', img: '✈️', cat: 'home' },

    /* body */
    { en: 'hand', ar: 'يد', img: '✋', cat: 'body' },
    { en: 'eye', ar: 'عين', img: '\u{1F441}️', cat: 'body' },
    { en: 'ear', ar: 'أذن', img: '\u{1F442}', cat: 'body' },
    { en: 'foot', ar: 'قدم', img: '\u{1F9B6}', cat: 'body' },
    { en: 'heart', ar: 'قلب', img: '❤️', cat: 'body' },
    { en: 'tooth', ar: 'سن', img: '\u{1F9B7}', cat: 'body' }
];

/* Themed objects used in math word problems */
YH.MATH_THEMES = [
    { en: 'apples', ar: 'تفاحات', img: '\u{1F34E}' },
    { en: 'stars', ar: 'نجوم', img: '⭐' },
    { en: 'balloons', ar: 'بالونات', img: '\u{1F388}' },
    { en: 'fish', ar: 'أسماك', img: '\u{1F41F}' },
    { en: 'cookies', ar: 'بسكويت', img: '\u{1F36A}' },
    { en: 'rockets', ar: 'صواريخ', img: '\u{1F680}' },
    { en: 'flowers', ar: 'زهور', img: '\u{1F338}' },
    { en: 'coins', ar: 'عملات', img: '\u{1FA99}' }
];

/* =========================================================
   Young Heroes - bilingual layer (English / العربية)
   Arabic is a fully optional feature: one tap swaps every
   label, flips the layout to RTL and switches the voice.
   ========================================================= */
window.YH = window.YH || {};

YH.STRINGS = {
    en: {
        'app.name': 'Young Heroes',
        'app.tagline': 'Learn. Play. Level up.',

        /* welcome */
        'welcome.hi': 'Welcome, hero!',
        'welcome.sub': 'Pick your hero and jump into the adventure. No sign-up, no passwords — just play.',
        'welcome.name': 'What should we call you?',
        'welcome.namePlaceholder': 'Your hero name',
        'welcome.chooseAvatar': 'Choose your hero',
        'welcome.chooseColor': 'Choose your colour',
        'welcome.start': 'Start the adventure!',
        'welcome.returning': 'Continue as',
        'welcome.newHero': 'New hero',

        /* top bar / general */
        'ui.level': 'Level',
        'ui.coins': 'Coins',
        'ui.xp': 'XP',
        'ui.map': 'World Map',
        'ui.back': 'Back',
        'ui.close': 'Close',
        'ui.play': 'Play',
        'ui.playAgain': 'Play again',
        'ui.next': 'Next',
        'ui.check': 'Check',
        'ui.clear': 'Clear',
        'ui.hint': 'Hint',
        'ui.listen': 'Listen again',
        'ui.best': 'Best',
        'ui.sound': 'Sound',
        'ui.music': 'Music',
        'ui.language': 'Language',
        'ui.on': 'on',
        'ui.off': 'off',

        /* map */
        'map.title': 'Choose your adventure',
        'map.numbers': 'Number Valley',
        'map.numbersSub': 'Add, take away, multiply and count',
        'map.words': 'Word Island',
        'map.wordsSub': 'Pictures, words, spelling and listening',
        'map.shop': 'Hero Shop',
        'map.trophies': 'Trophy Room',
        'map.grownups': 'For grown-ups',

        /* games */
        'game.addition': 'Adding Peaks',
        'game.addition.desc': 'Climb the mountain by adding numbers',
        'game.subtraction': 'Take-Away Cave',
        'game.subtraction.desc': 'Solve subtraction to light up the cave',
        'game.multiplication': 'Times Tower',
        'game.multiplication.desc': 'Multiply your way to the top',
        'game.numbers': 'Number Hunt',
        'game.numbers.desc': 'Count, compare and guess the number',
        'game.wordmatch': 'Picture Words',
        'game.wordmatch.desc': 'Match the picture to the right word',
        'game.translate': 'Two Worlds',
        'game.translate.desc': 'Match English and Arabic words',
        'game.spelling': 'Spell It!',
        'game.spelling.desc': 'Build the word letter by letter',
        'game.listening': 'Magic Ears',
        'game.listening.desc': 'Listen and pick the right picture',

        /* engine */
        'q.round': 'Round',
        'q.of': 'of',
        'q.streak': 'Streak',
        'q.correct': 'Correct!',
        'q.wrong': 'Not quite — try again!',
        'q.answerWas': 'The answer was',
        'q.tapAnswer': 'Tap the right answer',
        'q.typeAnswer': 'Type your answer',
        'q.buildWord': 'Tap the letters in order',
        'q.whichPicture': 'Which picture is it?',
        'q.whatIsThis': 'What is this?',
        'q.sayInArabic': 'What is this in Arabic?',
        'q.sayInEnglish': 'What is this in English?',
        'q.higher': 'Higher!',
        'q.lower': 'Lower!',
        'q.veryClose': 'Very close!',
        'q.count': 'How many do you see?',
        'q.bigger': 'Which number is bigger?',
        'q.smaller': 'Which number is smaller?',
        'q.missing': 'Which number is missing?',
        'q.guessRange': 'I am thinking of a number between {a} and {b}',

        /* results */
        'res.title': 'Round complete!',
        'res.perfect': 'Perfect run! You are unstoppable!',
        'res.great': 'Great job, hero!',
        'res.good': 'Nice work — keep going!',
        'res.keep': 'Good try! Practice makes heroes.',
        'res.correctCount': 'Correct answers',
        'res.coinsEarned': 'Coins earned',
        'res.xpEarned': 'XP earned',
        'res.newBest': 'New best score!',

        /* level / rewards */
        'rew.levelUp': 'LEVEL UP!',
        'rew.nowLevel': 'You reached level {n}',
        'rew.badge': 'New badge unlocked!',
        'rew.streak': '{n} in a row!',

        /* shop */
        'shop.title': 'Hero Shop',
        'shop.sub': 'Spend your coins on hats and pets',
        'shop.hats': 'Hats',
        'shop.pets': 'Pets',
        'shop.buy': 'Buy',
        'shop.owned': 'Owned',
        'shop.wear': 'Wear',
        'shop.worn': 'Wearing',
        'shop.remove': 'Take off',
        'shop.noCoins': 'Not enough coins yet — play a game to earn more!',
        'shop.bought': 'Nice! It is yours.',

        /* trophies */
        'trophy.title': 'Trophy Room',
        'trophy.sub': 'Badges you have unlocked',
        'trophy.locked': 'Keep playing to unlock',
        'trophy.stats': 'Your stats',
        'trophy.totalCorrect': 'Correct answers',
        'trophy.bestStreak': 'Best streak',
        'trophy.lifetimeCoins': 'Coins earned',
        'trophy.gamesPlayed': 'Rounds played',

        /* badges */
        'badge.first_step': 'First Step',
        'badge.streak5': 'On Fire',
        'badge.streak10': 'Lightning',
        'badge.coin50': 'Coin Collector',
        'badge.coin200': 'Treasure Hunter',
        'badge.level5': 'Rising Hero',
        'badge.level10': 'Champion',
        'badge.math100': 'Number Ninja',
        'badge.word100': 'Word Wizard',
        'badge.bilingual': 'Two Worlds',
        'badge.speller': 'Super Speller',
        'badge.listener': 'Golden Ears',

        /* grown-ups */
        'gu.title': 'For grown-ups',
        'gu.sub': 'Young Heroes keeps everything on this device. There is no account, no login and nothing is uploaded.',
        'gu.arabic': 'Arabic mode',
        'gu.arabicDesc': 'Switches the whole app to Arabic with right-to-left layout and an Arabic voice.',
        'gu.help': 'Show Arabic help in games',
        'gu.helpDesc': 'Adds a small Arabic translation under English words while playing.',
        'gu.reset': 'Reset progress',
        'gu.resetConfirm': 'Erase this hero and start over?',
        'gu.yes': 'Yes, reset',
        'gu.no': 'Cancel',

        /* AI panel */
        'ai.title': 'AI content (OpenAI)',
        'ai.on': 'Working',
        'ai.off': 'Not active',
        'ai.checking': 'Checking...',
        'ai.okNote': 'Questions and vocabulary are being written fresh by OpenAI. Games keep working if it stops.',
        'ai.howTitle': 'To switch it on:',
        'ai.step1': 'Copy .env.example to .env',
        'ai.step5': 'Open',
        'ai.retry': 'Check again',

        /* mascot lines */
        'm.welcome': 'Hi! I am Fen. Tap a game and let us play!',
        'm.good': 'Wow! You are getting good at this!',
        'm.tryAgain': 'Almost! Have another go.',
        'm.streak': 'You are on fire!',
        'm.hintMath': 'Try counting on your fingers.',
        'm.hintWord': 'Look at the picture again.'
    },

    ar: {
        'app.name': 'الأبطال الصغار',
        'app.tagline': 'تعلّم. العب. ارتقِ.',

        'welcome.hi': 'أهلاً أيها البطل!',
        'welcome.sub': 'اختر بطلك وابدأ المغامرة. بدون تسجيل ولا كلمات سر — فقط العب.',
        'welcome.name': 'ماذا نناديك؟',
        'welcome.namePlaceholder': 'اسم البطل',
        'welcome.chooseAvatar': 'اختر بطلك',
        'welcome.chooseColor': 'اختر لونك',
        'welcome.start': 'ابدأ المغامرة!',
        'welcome.returning': 'أكمل باسم',
        'welcome.newHero': 'بطل جديد',

        'ui.level': 'المستوى',
        'ui.coins': 'العملات',
        'ui.xp': 'نقاط الخبرة',
        'ui.map': 'خريطة العالم',
        'ui.back': 'رجوع',
        'ui.close': 'إغلاق',
        'ui.play': 'العب',
        'ui.playAgain': 'العب مرة أخرى',
        'ui.next': 'التالي',
        'ui.check': 'تحقّق',
        'ui.clear': 'مسح',
        'ui.hint': 'تلميح',
        'ui.listen': 'استمع مرة أخرى',
        'ui.best': 'الأفضل',
        'ui.sound': 'الصوت',
        'ui.music': 'الموسيقى',
        'ui.language': 'اللغة',
        'ui.on': 'مفعّل',
        'ui.off': 'متوقف',

        'map.title': 'اختر مغامرتك',
        'map.numbers': 'وادي الأرقام',
        'map.numbersSub': 'اجمع واطرح واضرب وعُدّ',
        'map.words': 'جزيرة الكلمات',
        'map.wordsSub': 'صور وكلمات وتهجئة واستماع',
        'map.shop': 'متجر الأبطال',
        'map.trophies': 'غرفة الجوائز',
        'map.grownups': 'لأولياء الأمور',

        'game.addition': 'قمم الجمع',
        'game.addition.desc': 'اصعد الجبل بجمع الأرقام',
        'game.subtraction': 'كهف الطرح',
        'game.subtraction.desc': 'حل الطرح لتضيء الكهف',
        'game.multiplication': 'برج الضرب',
        'game.multiplication.desc': 'اضرب طريقك إلى القمة',
        'game.numbers': 'صيد الأرقام',
        'game.numbers.desc': 'عُدّ وقارن وخمّن الرقم',
        'game.wordmatch': 'كلمات الصور',
        'game.wordmatch.desc': 'طابق الصورة مع الكلمة الصحيحة',
        'game.translate': 'عالمان',
        'game.translate.desc': 'طابق الكلمات الإنجليزية والعربية',
        'game.spelling': 'تهجّاها!',
        'game.spelling.desc': 'ابنِ الكلمة حرفاً بحرف',
        'game.listening': 'الأذن السحرية',
        'game.listening.desc': 'استمع واختر الصورة الصحيحة',

        'q.round': 'الجولة',
        'q.of': 'من',
        'q.streak': 'متتالية',
        'q.correct': 'إجابة صحيحة!',
        'q.wrong': 'ليس تماماً — حاول مرة أخرى!',
        'q.answerWas': 'الإجابة كانت',
        'q.tapAnswer': 'اختر الإجابة الصحيحة',
        'q.typeAnswer': 'اكتب إجابتك',
        'q.buildWord': 'اضغط الحروف بالترتيب',
        'q.whichPicture': 'أي صورة هي؟',
        'q.whatIsThis': 'ما هذا؟',
        'q.sayInArabic': 'ما هذا بالعربية؟',
        'q.sayInEnglish': 'ما هذا بالإنجليزية؟',
        'q.higher': 'أكبر!',
        'q.lower': 'أصغر!',
        'q.veryClose': 'قريب جداً!',
        'q.count': 'كم ترى؟',
        'q.bigger': 'أي رقم أكبر؟',
        'q.smaller': 'أي رقم أصغر؟',
        'q.missing': 'أي رقم ناقص؟',
        'q.guessRange': 'أفكر برقم بين {a} و {b}',

        'res.title': 'انتهت الجولة!',
        'res.perfect': 'أداء مثالي! لا يمكن إيقافك!',
        'res.great': 'عمل رائع أيها البطل!',
        'res.good': 'جميل — واصل التقدم!',
        'res.keep': 'محاولة جيدة! التدريب يصنع الأبطال.',
        'res.correctCount': 'الإجابات الصحيحة',
        'res.coinsEarned': 'العملات المكتسبة',
        'res.xpEarned': 'نقاط الخبرة',
        'res.newBest': 'رقم قياسي جديد!',

        'rew.levelUp': 'مستوى جديد!',
        'rew.nowLevel': 'وصلت إلى المستوى {n}',
        'rew.badge': 'وسام جديد!',
        'rew.streak': '{n} على التوالي!',

        'shop.title': 'متجر الأبطال',
        'shop.sub': 'اصرف عملاتك على القبعات والحيوانات',
        'shop.hats': 'قبعات',
        'shop.pets': 'رفاق',
        'shop.buy': 'شراء',
        'shop.owned': 'مملوك',
        'shop.wear': 'ارتدِ',
        'shop.worn': 'مُرتدى',
        'shop.remove': 'اخلع',
        'shop.noCoins': 'العملات غير كافية — العب لتكسب المزيد!',
        'shop.bought': 'رائع! أصبح لك.',

        'trophy.title': 'غرفة الجوائز',
        'trophy.sub': 'الأوسمة التي فتحتها',
        'trophy.locked': 'واصل اللعب لفتحه',
        'trophy.stats': 'إحصاءاتك',
        'trophy.totalCorrect': 'الإجابات الصحيحة',
        'trophy.bestStreak': 'أفضل متتالية',
        'trophy.lifetimeCoins': 'مجموع العملات',
        'trophy.gamesPlayed': 'الجولات الملعوبة',

        'badge.first_step': 'الخطوة الأولى',
        'badge.streak5': 'مشتعل',
        'badge.streak10': 'برق',
        'badge.coin50': 'جامع العملات',
        'badge.coin200': 'صائد الكنوز',
        'badge.level5': 'بطل صاعد',
        'badge.level10': 'البطل الأول',
        'badge.math100': 'نينجا الأرقام',
        'badge.word100': 'ساحر الكلمات',
        'badge.bilingual': 'عالمان',
        'badge.speller': 'خبير التهجئة',
        'badge.listener': 'الأذن الذهبية',

        'gu.title': 'لأولياء الأمور',
        'gu.sub': 'يحفظ تطبيق الأبطال الصغار كل شيء على هذا الجهاز. لا حساب ولا تسجيل دخول ولا رفع لأي بيانات.',
        'gu.arabic': 'الوضع العربي',
        'gu.arabicDesc': 'يحوّل التطبيق بالكامل إلى العربية مع تخطيط من اليمين إلى اليسار وصوت عربي.',
        'gu.help': 'إظهار المساعدة العربية داخل الألعاب',
        'gu.helpDesc': 'يضيف ترجمة عربية صغيرة تحت الكلمات الإنجليزية أثناء اللعب.',
        'gu.reset': 'إعادة ضبط التقدم',
        'gu.resetConfirm': 'هل تريد مسح هذا البطل والبدء من جديد؟',
        'gu.yes': 'نعم، أعد الضبط',
        'gu.no': 'إلغاء',

        /* AI panel */
        'ai.title': 'محتوى الذكاء الاصطناعي (OpenAI)',
        'ai.on': 'يعمل',
        'ai.off': 'غير مفعّل',
        'ai.checking': 'جارٍ التحقق...',
        'ai.okNote': 'يكتب OpenAI الأسئلة والمفردات بشكل جديد في كل مرة. تستمر الألعاب بالعمل إذا توقف.',
        'ai.howTitle': 'لتفعيله:',
        'ai.step1': 'انسخ ملف .env.example إلى .env',
        'ai.step5': 'افتح',
        'ai.retry': 'تحقق مرة أخرى',

        'm.welcome': 'مرحباً! أنا فِن. اختر لعبة ولنلعب!',
        'm.good': 'رائع! أصبحت ماهراً في هذا!',
        'm.tryAgain': 'اقتربت! جرّب مرة أخرى.',
        'm.streak': 'أنت مشتعل!',
        'm.hintMath': 'جرّب العدّ على أصابعك.',
        'm.hintWord': 'انظر إلى الصورة مرة أخرى.'
    }
};

YH.lang = 'en';

YH.t = function (key, vars) {
    var table = YH.STRINGS[YH.lang] || YH.STRINGS.en;
    var s = table[key];
    if (s === undefined) s = YH.STRINGS.en[key];
    if (s === undefined) return key;
    if (vars) {
        Object.keys(vars).forEach(function (k) {
            s = s.split('{' + k + '}').join(vars[k]);
        });
    }
    return s;
};

YH.isRTL = function () { return YH.lang === 'ar'; };

YH.applyLang = function (lang) {
    YH.lang = (lang === 'ar') ? 'ar' : 'en';
    var html = document.documentElement;
    html.setAttribute('lang', YH.lang);
    html.setAttribute('dir', YH.isRTL() ? 'rtl' : 'ltr');
    document.body.classList.toggle('rtl', YH.isRTL());
    var btn = document.getElementById('btnLang');
    if (btn) btn.textContent = YH.isRTL() ? 'EN' : 'ع';
    document.title = YH.t('app.name') + ' — ' + YH.t('app.tagline');
};

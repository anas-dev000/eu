const games = [
  {
    title: "لعبة المشاعر مع جوليا",
    category: "emotions",
    categoryAr: "مشاعر",
    description: "انضم إلى جوليا في مغامرة ممتعة لتعلم المشاعر. تساعد هذه اللعبة الأطفال على فهم تعابير الوجه والمشاعر المختلفة بطريقة بسيطة وجذابة.",
    link: "https://wordwall.net/ar/resource/11306503/%D9%84%D8%B9%D8%A8%D8%A9-%D8%A7%D9%84%D9%85%D8%B4%D8%A7%D8%B9%D8%B1",
    image: "/assets/images/games/game-1.jpg",
    tags: ["اجتماعي", "وجوه", "Sesame Street"]
  },
  {
    title: "روتين اليوم مع دانيال النمر",
    category: "social",
    categoryAr: "مهارات",
    description: "ساعد دانيال النمر في مهامه اليومية! لعبة رائعة لتعلم الروتين اليومي وبناء الثقة في النفس من خلال ممارسة العادات الجيدة.",
    link: "https://wordwall.net/ar/resource/33188853/%D8%A7%D9%84%D8%B1%D9%88%D8%AA%D9%8A%D9%86-%D8%A7%D9%84%D9%8A%D9%88%D9%85%D9%8A",
    image: "/assets/images/games/game-2.jpg",
    tags: ["روتين", "يومي", "PBS Kids"]
  },
  {
    title: "مطابقة الأشكال والألوان",
    category: "logic",
    categoryAr: "ذكاء",
    description: "لعبة تفاعلية باللغة العربية تهدف لتحسين الإدراك البصري وتصنيف الأشكال والألوان بدقة. ممتعة وسهلة الاستخدام.",
    link: "https://wordwall.net/ar/resource/1464056/%D9%84%D8%B9%D8%A8%D8%A9-%D9%85%D8%B7%D8%A7%D8%A8%D9%82%D8%A9-%D8%A7%D9%84%D8%A3%D8%B4%D9%83%D8%A7%D9%84",
    image: "/assets/images/games/game-3.jpg",
    tags: ["مطابقة", "ألوان", "Wordwall"]
  },
  {
    title: "تصنيف المشاعر الاجتماعية",
    category: "emotions",
    categoryAr: "مشاعر",
    description: "لعبة عربية تساعد الطفل على التصنيف الصحيح للمشاعر (سعيد، حزين، غاضب) من خلال مواقف وصور واقعية.",
    link: "https://wordwall.net/ar/resource/36450824/%D8%AA%D8%B5%D9%86%D9%8A%D9%81-%D8%A7%D9%84%D9%85%D8%B4%D8%A7%D8%B9%D8%B1",
    image: "/assets/images/games/game-4.jpg",
    tags: ["تصنيف", "عاطفي", "رسم"]
  },
  {
    title: "أحجية المحيط الهادئة",
    category: "sensory",
    categoryAr: "هدوء",
    description: "استمتع بأحجية صور الطبيعة الخلابة مع أصوات هادئة. مثالية لتحفيز التركيز والاسترخاء الحسي بعيداً عن الصخب.",
    link: "https://kids.nationalgeographic.com/games/puzzles",
    image: "/assets/images/games/game-5.jpg",
    tags: ["حسي", "طبيعة", "NatGeo"]
  },
  {
    title: "تحدي الذاكرة البصرية",
    category: "logic",
    categoryAr: "ذكاء",
    description: "اختبر قوة ملاحظتك وذاكرتك في العثور على أزواج الصور المتطابقة. لعبة رائعة لتدريب العقل وتحسين قوة التركيز.",
    link: "https://wordwall.net/ar/resource/70265384/%D8%AA%D8%AD%D9%84%D9%8A%D9%84-%D8%AF%D8%B1%D8%B3-%D8%A7%D9%84%D8%A7%D8%A8%D8%AA%D8%B3%D8%A7%D9%85%D8%A9-%D9%84%D8%BA%D8%A9-%D8%A7%D9%84%D9%82%D9%84%D9%88%D8%A8",
    image: "/assets/images/games/game-6.jpg",
    tags: ["ذاكرة", "صور", "لعب"]
  },
  {
    title: "تكوين الوجوه المبتسمة",
    category: "emotions",
    categoryAr: "مشاعر",
    description: "لعبة تفاعلية تسمح للطفل بتركيب أجزاء الوجه لإنشاء تعابير مختلفة، مما يساعده على فهم أجزاء الوجه وتعبيره.",
    link: "https://wordwall.net/ar/resource/17142980/%D8%A3%D9%83%D8%AA%D8%B4%D9%81-%D8%A7%D9%84%D8%B5%D9%88%D8%B1%D8%A9-%D8%A7%D9%84%D9%85%D8%AE%D9%81%D9%8A%D8%A9-%D8%AD",
    image: "/assets/images/games/game-7.jpg",
    tags: ["رسم", "وجوه", "ابداع"]
  },
  {
    title: "البحث عن الأشياء المخفية",
    category: "logic",
    categoryAr: "ذكاء",
    description: "هل تستطيع إيجاد كل الأشياء الضائعة؟ لعبة تدعم مهارات التحليل البصري والملاحظة الدقيقة للأبطال الصغار.",
    link: "https://wordwall.net/ar/resource/14778606/%D9%84%D8%B9%D8%A8%D8%A9-%D8%A7%D9%84%D8%A3%D9%86%D9%85%D8%A7%D8%B7",
    image: "/assets/images/games/game-8.jpg",
    tags: ["تركيز", "ملاحظة", "بحث"]
  },
  {
    title: "لعبة الأنماط والذكاء",
    category: "logic",
    categoryAr: "ذكاء",
    description: "أكمل النمط الصحيح! لعبة تعليمية تساعد على تطوير مهارات التسلسل المنطقي والتوقع بطريقة ممتعة وبسيطة.",
    link: "https://wordwall.net/ar/resource/35330275/%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D8%B6%D9%8A%D8%A7%D8%AA/%D8%A7%D9%84%D8%A3%D9%86%D9%85%D8%A7%D8%B7",
    image: "/assets/images/games/game-9.jpg",
    tags: ["أنماط", "منطق", "ذكاء"]
  },
  {
    title: "مساحة الرسم والهدوء",
    category: "sensory",
    categoryAr: "هدوء",
    description: "عبر عن إبداعك بحرية مع ألوان هادئة وأدوات رسم بسيطة لا تتطلب مجهوداً بصرياً عالياً وتوفر راحة نفسية.",
    link: "https://wordwall.net/ar/resource/30866666/%D8%AF%D8%B1%D8%B3-%D8%A7%D9%84%D8%B1%D8%B3%D9%85-%D8%A7%D9%84%D8%AD%D8%B1",
    image: "/assets/images/games/game-10.jpg",
    tags: ["رسم", "تلوين", "حسي"]
  },
  {
    title: "روتين اليوم مع دانيال النمر",
    category: "social",
    description: "ساعد دانيال النمر في مهامه اليومية! لعبة رائعة لتعلم الروتين اليومي وبناء الثقة في النفس من خلال ممارسة العادات الجيدة.",
    link: "https://wordwall.net/ar/resource/33188853/%D8%A7%D9%84%D8%B1%D9%88%D8%AA%D9%8A%D9%86-%D8%A7%D9%84%D9%8A%D9%88%D9%85%D9%8A",
    image: "/assets/images/games/game-2.jpg",
    tags: ["روتين", "يومي", "PBS Kids"]
  },
  {
    title: "تصنيف المشاعر الاجتماعية",
    category: "emotions",
    description: "لعبة عربية تساعد الطفل على التصنيف الصحيح للمشاعر (سعيد، حزين، غاضب) من خلال مواقف وصور واقعية.",
    link: "https://wordwall.net/ar/resource/36450824/%D8%AA%D8%B5%D9%86%D9%8A%D9%81-%D8%A7%D9%84%D9%85%D8%B4%D8%A7%D8%B9%D8%B1",
    image: "/assets/images/games/game-4.jpg",
    tags: ["تصنيف", "عاطفي", "رسم"]
  },

];

export default games;

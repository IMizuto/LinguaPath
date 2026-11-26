/* LinguaPath — Dữ liệu Luyện Nghe HSK 1–6 (36 bộ đề chuẩn thi thật: 180 câu Nghe hiểu + 72 câu Chép chính tả) */
window.LP_HSK_LISTENING_DATA = [
  {
    "id": "listen_hsk1",
    "level": 1,
    "badge": "HSK 1 • Sơ cấp",
    "title": "Bài 1: Chào hỏi, Gia đình & Thời gian hằng ngày",
    "subtitle": "Nghe câu ngắn Đúng/Sai, hội thoại cơ bản và chép chính tả câu giao tiếp nền tảng.",
    "tips": "Ở cấp độ HSK 1, hãy chú ý nghe các từ khóa chỉ thời gian (几点, 明天), đại từ (他, 她, 爸爸) và động từ chính (去, 吃, 看).",
    "questions": [
      {
        "id": "l1_q1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Người nói có 5 người trong gia đình.",
        "audioZh": "我家有三口人：爸爸、妈妈和我。",
        "audioPy": "Wǒ jiā yǒu sān kǒu rén: bàba, māma hé wǒ.",
        "audioVi": "Nhà tôi có 3 người: bố, mẹ và tôi.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Trong audio nói '有三口人' (có 3 người: bố, mẹ và tôi), không phải 5 người."
      },
      {
        "id": "l1_q2",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Hôm nay thời tiết rất lạnh, trời đang mưa.",
        "audioZh": "今天天气很冷，下大雨了。",
        "audioPy": "Jīntiān tiānqì hěn lěng, xià dàyǔ le.",
        "audioVi": "Thời tiết hôm nay rất lạnh, trời mưa to rồi.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Audio khớp hoàn toàn: '很冷' (rất lạnh) và '下大雨了' (mưa to rồi)."
      },
      {
        "id": "l1_q3",
        "partLabel": "Phần 3 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Ngày mai họ mấy giờ gặp nhau?",
        "audioZh": "男：明天上午你几点去学校？ 女：我八点半去学校，我们在学校门口见面吧。",
        "audioPy": "Nán: Míngtiān shàngwǔ nǐ jǐ diǎn qù xuéxiào? Nǚ: Wǒ bā diǎn bàn qù xuéxiào, wǒmen zài xuéxiào ménkǒu jiànmiàn ba.",
        "audioVi": "Nam: Sáng mai mấy giờ bạn đến trường? Nữ: 8 giờ rưỡi mình đến trường, chúng mình gặp ở cổng trường nhé.",
        "opts": [
          "7:30 sáng",
          "8:00 sáng",
          "8:30 sáng",
          "9:00 sáng"
        ],
        "ans": 2,
        "exp": "Người nữ nói '我八点半去学校' (8 giờ 30 phút sáng — 八点半)."
      },
      {
        "id": "l1_q4",
        "partLabel": "Phần 3 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ muốn uống gì?",
        "audioZh": "男：请问，你想喝茶还是喝咖啡？ 女：我不喝咖啡，给我一杯热茶吧，谢谢！",
        "audioPy": "Nán: Qǐngwèn, nǐ xiǎng hē chá háishi hē kāfēi? Nǚ: Wǒ bù hē kāfēi, gěi wǒ yì bēi rè chá ba, xièxie!",
        "audioVi": "Nam: Xin hỏi, bạn muốn uống trà hay cà phê? Nữ: Tôi không uống cà phê, cho tôi một cốc trà nóng nhé, cảm ơn!",
        "opts": [
          "Cà phê sữa",
          "Một cốc trà nóng",
          "Nước lạnh",
          "Nước ép táo"
        ],
        "ans": 1,
        "exp": "Người nữ từ chối cà phê ('我不喝咖啡') và gọi '一杯热茶' (một cốc trà nóng)."
      },
      {
        "id": "l1_q5",
        "partLabel": "Phần 4 • Đoạn ngắn & Hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Quyển sách tiếng Trung giá bao nhiêu tiền?",
        "audioZh": "老师昨天买了一本汉语书，这本书三十五块钱，很便宜。",
        "audioPy": "Lǎoshī zuótiān mǎile yì běn Hànyǔ shū, zhè běn shū sānshíwǔ kuài qián, hěn piányi.",
        "audioVi": "Thầy giáo hôm qua đã mua một quyển sách tiếng Hán, quyển sách này 35 tệ, rất rẻ.",
        "opts": [
          "25 tệ",
          "35 tệ",
          "45 tệ",
          "53 tệ"
        ],
        "ans": 1,
        "exp": "Trong bài nghe nói rõ '三十五块钱' (35 đồng/tệ)."
      }
    ],
    "dictations": [
      {
        "id": "l1_d1",
        "zh": "明天上午九点我去北京。",
        "py": "Míngtiān shàngwǔ jiǔ diǎn wǒ qù Běijīng.",
        "vi": "9 giờ sáng mai tôi đi Bắc Kinh.",
        "hint": "Thời gian (sáng mai 9 giờ) + tôi đi Bắc Kinh"
      },
      {
        "id": "l1_d2",
        "zh": "我很喜欢吃中国菜。",
        "py": "Wǒ hěn xǐhuan chī Zhōngguó cài.",
        "vi": "Tôi rất thích ăn món ăn Trung Quốc.",
        "hint": "Rất thích + ăn + món Trung Quốc"
      }
    ]
  },
  {
    "id": "listen_hsk1_02",
    "level": 1,
    "badge": "HSK 1 • Đề 2",
    "title": "Đề 2: Số đếm, Tuổi tác & Ngày tháng",
    "subtitle": "Luyện phân biệt con số, ngày tháng trong tuần và tuổi tác trong giao tiếp HSK 1.",
    "tips": "Chú ý nghe kỹ các cặp số dễ nhầm như 四 (4) và 十 (10), 三 (3) và 山, cũng như thứ tự ngày tháng năm (月 trước, 日/号 sau).",
    "questions": [
      {
        "id": "l1_02_q1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Con gái của cô ấy năm nay tám tuổi rồi.",
        "audioZh": "我女儿今年七岁，她很喜欢看书。",
        "audioPy": "Wǒ nǚ'ér jīnnián qī suì, tā hěn xǐhuan kànshū.",
        "audioVi": "Con gái tôi năm nay bảy tuổi, cháu rất thích đọc sách.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Trong bài nghe nói '今年七岁' (năm nay 7 tuổi), không phải 8 tuổi."
      },
      {
        "id": "l1_02_q2",
        "partLabel": "Phần 2 • Nghe câu & Tình huống",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Hôm nay là thứ Năm, ngày mười sáu tháng Chín.",
        "audioZh": "今天是九月十六号，星期四。",
        "audioPy": "Jīntiān shì jiǔ yuè shíliù hào, xīngqīsì.",
        "audioVi": "Hôm nay là ngày 16 tháng 9, thứ Năm.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "'九月十六号' là ngày 16 tháng 9 và '星期四' là thứ Năm, khớp hoàn toàn."
      },
      {
        "id": "l1_02_q3",
        "partLabel": "Phần 3 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Trong lớp có bao nhiêu bạn học sinh?",
        "audioZh": "男：你们班有多少个学生？ 女：我们班有十八个学生，十个女生，八个男生。",
        "audioPy": "Nán: Nǐmen bān yǒu duōshao gè xuésheng? Nǚ: Wǒmen bān yǒu shíbā gè xuésheng, shí gè nǚshēng, bā gè nánshēng.",
        "audioVi": "Nam: Lớp các bạn có bao nhiêu học sinh? Nữ: Lớp mình có 18 học sinh, 10 bạn nữ và 8 bạn nam.",
        "opts": [
          "10 học sinh",
          "16 học sinh",
          "18 học sinh",
          "20 học sinh"
        ],
        "ans": 2,
        "exp": "Người nữ trả lời rõ tổng số học sinh là '十八个学生' (18 học sinh)."
      },
      {
        "id": "l1_02_q4",
        "partLabel": "Phần 3 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Bây giờ là mấy giờ?",
        "audioZh": "女：请问，现在几点了？ 男：现在十点十五分，我们快走吧。",
        "audioPy": "Nǚ: Qǐngwèn, xiànzài jǐ diǎn le? Nán: Xiànzài shí diǎn shíwǔ fēn, wǒmen kuài zǒu ba.",
        "audioVi": "Nữ: Xin hỏi, bây giờ mấy giờ rồi? Nam: Bây giờ là 10 giờ 15 phút, chúng ta đi nhanh thôi.",
        "opts": [
          "9 giờ 15 phút",
          "10 giờ 15 phút",
          "10 giờ 50 phút",
          "11 giờ 15 phút"
        ],
        "ans": 1,
        "exp": "Người nam nói '十点十五分' (10 giờ 15 phút)."
      },
      {
        "id": "l1_02_q5",
        "partLabel": "Phần 4 • Đoạn ngắn & Hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Anh Minh dự định về nước vào lúc nào?",
        "audioZh": "小明现在在上海学习汉语，他下个月十二号回北京看爸爸妈妈。",
        "audioPy": "Xiǎo Míng xiànzài zài Shànghǎi xuéxí Hànyǔ, tā xià gè yuè shí'èr hào huí Běijīng kàn bàba māma.",
        "audioVi": "Tiểu Minh hiện đang học tiếng Hán ở Thượng Hải, ngày 12 tháng sau cậu ấy về Bắc Kinh thăm bố mẹ.",
        "opts": [
          "Ngày 2 tháng này",
          "Ngày 12 tháng sau",
          "Ngày 20 tháng sau",
          "Tuần sau"
        ],
        "ans": 1,
        "exp": "Bài nghe nêu rõ '下个月十二号' (ngày 12 tháng sau)."
      }
    ],
    "dictations": [
      {
        "id": "l1_02_d1",
        "zh": "昨天是八月二十号。",
        "py": "Zuótiān shì bā yuè èrshí hào.",
        "vi": "Hôm qua là ngày 20 tháng 8.",
        "hint": "Hôm qua + là + tháng 8 ngày 20"
      },
      {
        "id": "l1_02_d2",
        "zh": "我爸爸今年五十二岁。",
        "py": "Wǒ bàba jīnnián wǔshí'èr suì.",
        "vi": "Bố tôi năm nay 52 tuổi.",
        "hint": "Bố tôi + năm nay + 52 tuổi"
      }
    ]
  },
  {
    "id": "listen_hsk1_03",
    "level": 1,
    "badge": "HSK 1 • Đề 3",
    "title": "Đề 3: Ăn uống, Hoa quả & Nhà hàng",
    "subtitle": "Nghe tên các món ăn, đồ uống quen thuộc và cách gọi món cơ bản.",
    "tips": "Khi nghe hội thoại gọi món, đừng vội chọn món đầu tiên được nhắc tới vì người nói có thể từ chối bằng 不 hoặc 没.",
    "questions": [
      {
        "id": "l1_03_q1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Buổi trưa anh ấy thường ăn cơm ở nhà.",
        "audioZh": "他中午不回家，在学校吃米饭和水果。",
        "audioPy": "Tā zhōngwǔ bù huí jiā, zài xuéxiào chī mǐfàn hé shuǐguǒ.",
        "audioVi": "Buổi trưa anh ấy không về nhà, ăn cơm và hoa quả ở trường.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Bài nghe nói '不回家，在学校吃' (không về nhà, ăn ở trường)."
      },
      {
        "id": "l1_03_q2",
        "partLabel": "Phần 2 • Nghe câu & Tình huống",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Chị gái rất thích uống nước và ăn táo.",
        "audioZh": "姐姐每天早上喝一杯水，吃一个苹果。",
        "audioPy": "Jiějie měitiān zǎoshang hē yì bēi shuǐ, chī yí gè píngguǒ.",
        "audioVi": "Chị gái mỗi sáng uống một cốc nước, ăn một quả táo.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Mỗi sáng chị gái đều uống nước ('喝一杯水') và ăn táo ('吃一个苹果')."
      },
      {
        "id": "l1_03_q3",
        "partLabel": "Phần 3 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nam muốn mua bao nhiêu táo?",
        "audioZh": "女：先生，您买什么水果？ 男：我要两斤苹果，不要西瓜。",
        "audioPy": "Nǚ: Xiānsheng, nín mǎi shénme shuǐguǒ? Nán: Wǒ yào liǎng jīn píngguǒ, bú yào xīguā.",
        "audioVi": "Nữ: Thưa anh, anh mua hoa quả gì ạ? Nam: Tôi lấy hai cân táo, không lấy dưa hấu.",
        "opts": [
          "Một cân táo",
          "Hai cân táo",
          "Hai quả dưa hấu",
          "Ba cân táo"
        ],
        "ans": 1,
        "exp": "Người nam nói '要两斤苹果' (lấy hai cân táo; 1 cân Trung Quốc = 0,5 kg)."
      },
      {
        "id": "l1_03_q4",
        "partLabel": "Phần 3 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Tối nay họ ăn gì?",
        "audioZh": "男：今天晚上我们吃米饭还是吃饺子？ 女：妈妈不在家，我们去饭店吃饺子吧！",
        "audioPy": "Nán: Jīntiān wǎnshang wǒmen chī mǐfàn háishi chī jiǎozi? Nǚ: Māma bú zài jiā, wǒmen qù fàndiàn chī jiǎozi ba!",
        "audioVi": "Nam: Tối nay chúng ta ăn cơm hay ăn sủi cảo? Nữ: Mẹ không có ở nhà, chúng ta ra nhà hàng ăn sủi cảo đi!",
        "opts": [
          "Ăn cơm ở nhà",
          "Ăn sủi cảo ở nhà hàng",
          "Uống trà ở trường",
          "Ăn bánh mì"
        ],
        "ans": 1,
        "exp": "Người nữ đề nghị '去饭店吃饺子' (ra nhà hàng ăn sủi cảo)."
      },
      {
        "id": "l1_03_q5",
        "partLabel": "Phần 4 • Đoạn ngắn & Hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Cửa hàng có bán đồ uống nào?",
        "audioZh": "这个小饭店里的茶很好喝，菜也很便宜，但是这里没有咖啡。",
        "audioPy": "Zhège xiǎo fàndiàn lǐ de chá hěn hǎohē, cài yě hěn piányi, dànshì zhèlǐ méiyǒu kāfēi.",
        "audioVi": "Trà trong nhà hàng nhỏ này rất ngon, món ăn cũng rất rẻ, nhưng ở đây không có cà phê.",
        "opts": [
          "Cà phê nóng",
          "Nước ngọt",
          "Trà",
          "Sữa tươi"
        ],
        "ans": 2,
        "exp": "Bài nghe nêu rõ '茶很好喝' (trà rất ngon) và '没有咖啡' (không có cà phê)."
      }
    ],
    "dictations": [
      {
        "id": "l1_03_d1",
        "zh": "请问，这里有热茶吗？",
        "py": "Qǐngwèn, zhèlǐ yǒu rè chá ma?",
        "vi": "Xin hỏi, ở đây có trà nóng không?",
        "hint": "Xin hỏi + ở đây có + trà nóng không"
      },
      {
        "id": "l1_03_d2",
        "zh": "妈妈做菜做得很好吃。",
        "py": "Māma zuò cài zuò de hěn hǎochī.",
        "vi": "Mẹ nấu ăn rất ngon.",
        "hint": "Mẹ + nấu món ăn + rất ngon"
      }
    ]
  },
  {
    "id": "listen_hsk1_04",
    "level": 1,
    "badge": "HSK 1 • Đề 4",
    "title": "Đề 4: Trường học, Đọc sách & Nghề nghiệp",
    "subtitle": "Nghe các động từ học tập (写, 读, 学) và danh từ nghề nghiệp cơ bản.",
    "tips": "Phân biệt rõ người nói là 老师 (giáo viên), 学生 (học sinh) hay 医生 (bác sĩ) để không nhầm chủ thể câu hỏi.",
    "questions": [
      {
        "id": "l1_04_q1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Thầy Lý là bác sĩ làm việc ở bệnh viện.",
        "audioZh": "李老师不是医生，他在北京的一所大学教汉语。",
        "audioPy": "Lǐ lǎoshī bú shì yīshēng, tā zài Běijīng de yì suǒ dàxué jiāo Hànyǔ.",
        "audioVi": "Thầy Lý không phải bác sĩ, thầy dạy tiếng Hán ở một trường đại học tại Bắc Kinh.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Câu nói phủ định rõ '不是医生' (không phải bác sĩ), thầy dạy tiếng Hán."
      },
      {
        "id": "l1_04_q2",
        "partLabel": "Phần 2 • Nghe câu & Tình huống",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Bạn Tiểu Hoa biết nói tiếng Trung và viết chữ Hán.",
        "audioZh": "小花会说汉语，也会写很多汉字。",
        "audioPy": "Xiǎohuā huì shuō Hànyǔ, yě huì xiě hěn duō Hànzì.",
        "audioVi": "Tiểu Hoa biết nói tiếng Hán, cũng biết viết rất nhiều chữ Hán.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Bài nghe dùng '会说汉语，也会写很多汉字' khớp hoàn toàn."
      },
      {
        "id": "l1_04_q3",
        "partLabel": "Phần 3 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ đang làm gì?",
        "audioZh": "男：你在看电影吗？ 女：没有，我在电脑前学习写汉字呢。",
        "audioPy": "Nán: Nǐ zài kàn diànyǐng ma? Nǚ: Méiyǒu, wǒ zài diànnǎo qián xuéxí xiě Hànzì ne.",
        "audioVi": "Nam: Bạn đang xem phim à? Nữ: Không có, mình đang học viết chữ Hán trước máy tính đây.",
        "opts": [
          "Xem phim",
          "Học viết chữ Hán",
          "Ngủ trưa",
          "Nấu cơm"
        ],
        "ans": 1,
        "exp": "Người nữ phủ nhận xem phim ('没有') và nói '学习写汉字' (học viết chữ Hán)."
      },
      {
        "id": "l1_04_q4",
        "partLabel": "Phần 3 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Chiếc bút trên bàn là của ai?",
        "audioZh": "女：大卫，桌子上的这本书和这支笔是你的吗？ 男：书是我的，笔是王老师的。",
        "audioPy": "Nǚ: Dàwèi, zhuōzi shàng de zhè běn shū hé zhè zhī bǐ shì nǐ de ma? Nán: Shū shì wǒ de, bǐ shì Wáng lǎoshī de.",
        "audioVi": "Nữ: Đại Vệ, quyển sách và cây bút trên bàn này là của bạn phải không? Nam: Sách là của mình, còn bút là của cô Vương.",
        "opts": [
          "Của Đại Vệ",
          "Của người nữ",
          "Của cô Vương",
          "Của bạn học"
        ],
        "ans": 2,
        "exp": "Đại Vệ trả lời '笔是王老师的' (bút là của cô Vương)."
      },
      {
        "id": "l1_04_q5",
        "partLabel": "Phần 4 • Đoạn ngắn & Hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Bố của anh ấy làm nghề gì?",
        "audioZh": "我爸爸在医院工作，他是一名好医生；我妈妈在学校工作。",
        "audioPy": "Wǒ bàba zài yīyuàn gōngzuò, tā shì yì míng hǎo yīshēng; wǒ māma zài xuéxiào gōngzuò.",
        "audioVi": "Bố tôi làm việc ở bệnh viện, ông ấy là một bác sĩ giỏi; mẹ tôi làm việc ở trường học.",
        "opts": [
          "Giáo viên",
          "Bác sĩ",
          "Tài xế",
          "Nhân viên bán hàng"
        ],
        "ans": 1,
        "exp": "Bài nghe nói rõ '爸爸在医院工作，他是一名好医生' (bố là bác sĩ)."
      }
    ],
    "dictations": [
      {
        "id": "l1_04_d1",
        "zh": "我不会写这个汉字。",
        "py": "Wǒ bú huì xiě zhège Hànzì.",
        "vi": "Tôi không biết viết chữ Hán này.",
        "hint": "Tôi không biết (不会) + viết + chữ Hán này"
      },
      {
        "id": "l1_04_d2",
        "zh": "他是我最好的同学。",
        "py": "Tā shì wǒ zuì hǎo de tóngxué.",
        "vi": "Cậu ấy là bạn học thân nhất của tôi.",
        "hint": "Cậu ấy là + bạn học + tốt nhất của tôi"
      }
    ]
  },
  {
    "id": "listen_hsk1_05",
    "level": 1,
    "badge": "HSK 1 • Đề 5",
    "title": "Đề 5: Thời tiết, Quần áo & Mua sắm cơ bản",
    "subtitle": "Nghe tính từ miêu tả thời tiết, màu sắc, kích cỡ và hỏi giá tiền.",
    "tips": "Chú ý phân biệt 太...了 (quá... rồi) và 很 (rất), cùng các từ chỉ giá tiền như 多少钱, 块.",
    "questions": [
      {
        "id": "l1_05_q1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Thời tiết hôm nay không nóng cũng không lạnh, rất dễ chịu.",
        "audioZh": "今天天气不冷也不热，我们去公园玩儿吧。",
        "audioPy": "Jīntiān tiānqì bù lěng yě bú rè, wǒmen qù gōngyuán wánr ba.",
        "audioVi": "Thời tiết hôm nay không lạnh cũng không nóng, chúng ta đi công viên chơi nhé.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "'不冷也不热' nghĩa là không lạnh cũng không nóng, khớp với nhận định."
      },
      {
        "id": "l1_05_q2",
        "partLabel": "Phần 2 • Nghe câu & Tình huống",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Bộ quần áo mới này nhỏ quá, anh ấy mặc không vừa.",
        "audioZh": "这件衣服太大了，我想换一件小一点儿的。",
        "audioPy": "Zhè jiàn yīfu tài dà le, wǒ xiǎng huàn yí jiàn xiǎo yìdiǎnr de.",
        "audioVi": "Bộ quần áo này to quá rồi, tôi muốn đổi một cái nhỏ hơn một chút.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Áo bị '太大了' (to quá rồi) nên muốn đổi cái nhỏ hơn, không phải nhỏ quá."
      },
      {
        "id": "l1_05_q3",
        "partLabel": "Phần 3 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Bốn chiếc cốc giá tất cả bao nhiêu tiền?",
        "audioZh": "男：请问，这个杯子多少钱一个？ 女：十块钱一个，您买几个？ 男：我买四个。",
        "audioPy": "Nán: Qǐngwèn, zhège bēizi duōshao qián yí gè? Nǚ: Shí kuài qián yí gè, nín mǎi jǐ gè? Nán: Wǒ mǎi sì gè.",
        "audioVi": "Nam: Xin hỏi, chiếc cốc này bao nhiêu tiền một cái? Nữ: 10 tệ một cái, anh mua mấy cái? Nam: Tôi mua 4 cái.",
        "opts": [
          "10 tệ",
          "20 tệ",
          "40 tệ",
          "50 tệ"
        ],
        "ans": 2,
        "exp": "10 tệ một cái × 4 cái ('买四个') = 40 tệ."
      },
      {
        "id": "l1_05_q4",
        "partLabel": "Phần 3 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Ngày mai thời tiết thế nào?",
        "audioZh": "女：明天还下雨吗？ 男：明天不下雨了，天气会很晴朗，也很暖和。",
        "audioPy": "Nǚ: Míngtiān hái xiàyǔ ma? Nán: Míngtiān bú xiàyǔ le, tiānqì huì hěn qínglǎng, yě hěn nuǎnhuo.",
        "audioVi": "Nữ: Ngày mai còn mưa nữa không? Nam: Ngày mai hết mưa rồi, trời sẽ rất quang đãng và ấm áp.",
        "opts": [
          "Mưa rất to",
          "Tạnh mưa và ấm áp",
          "Trời rất lạnh",
          "Có tuyết rơi"
        ],
        "ans": 1,
        "exp": "Người nam nói '明天不下雨了' (ngày mai không mưa nữa) và '很暖和' (rất ấm áp)."
      },
      {
        "id": "l1_05_q5",
        "partLabel": "Phần 4 • Đoạn ngắn & Hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Bạn ấy mua gì cho mẹ?",
        "audioZh": "明天是妈妈的生日，我今天去商店给她买了一件漂亮的衣服和很多花。",
        "audioPy": "Míngtiān shì māma de shēngrì, wǒ jīntiān qù shāngdiàn gěi tā mǎile yí jiàn piàoliang de yīfu hé hěn duō huā.",
        "audioVi": "Ngày mai là sinh nhật mẹ, hôm nay tôi đi cửa hàng mua cho mẹ một bộ quần áo đẹp và nhiều hoa.",
        "opts": [
          "Quần áo và hoa",
          "Sách và bút",
          "Táo và trà",
          "Một chiếc máy tính"
        ],
        "ans": 0,
        "exp": "Câu nói liệt kê '一件漂亮的衣服和很多花' (một bộ quần áo đẹp và nhiều hoa)."
      }
    ],
    "dictations": [
      {
        "id": "l1_05_d1",
        "zh": "这件衣服不太贵。",
        "py": "Zhè jiàn yīfu bú tài guì.",
        "vi": "Bộ quần áo này không đắt lắm.",
        "hint": "Bộ quần áo này + không đắt lắm"
      },
      {
        "id": "l1_05_d2",
        "zh": "今天下午下雨了。",
        "py": "Jīntiān xiàwǔ xiàyǔ le.",
        "vi": "Chiều nay trời mưa rồi.",
        "hint": "Chiều nay + trời mưa rồi"
      }
    ]
  },
  {
    "id": "listen_hsk1_06",
    "level": 1,
    "badge": "HSK 1 • Đề 6",
    "title": "Đề 6: Đi lại, Địa điểm & Gọi điện thoại",
    "subtitle": "Nghe phương vị từ (里面, 前面, 后面), phương tiện và hội thoại qua điện thoại.",
    "tips": "Với bài nghe hỏi vị trí hoặc phương tiện, hãy để ý giới từ 在 (ở) và động từ 坐 (ngồi/đi bằng phương tiện).",
    "questions": [
      {
        "id": "l1_06_q1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Con mèo nhỏ đang nằm ngủ ở bên dưới cái ghế.",
        "audioZh": "你看，那只小猫在椅子下面睡觉呢。",
        "audioPy": "Nǐ kàn, nà zhī xiǎo māo zài yǐzi xiàmiàn shuìjiào ne.",
        "audioVi": "Bạn nhìn kìa, con mèo nhỏ kia đang ngủ ở dưới ghế đấy.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "'在椅子下面睡觉' nghĩa là đang ngủ ở dưới cái ghế, khớp hoàn toàn."
      },
      {
        "id": "l1_06_q2",
        "partLabel": "Phần 2 • Nghe câu & Tình huống",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Bố đi làm bằng máy bay vì công ty rất xa.",
        "audioZh": "我爸爸坐公共汽车去公司，不坐飞机。",
        "audioPy": "Wǒ bàba zuò gōnggòng qìchē qù gōngsī, bú zuò fēijī.",
        "audioVi": "Bố tôi đi xe buýt đến công ty, không đi máy bay.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Bài nghe nói '坐公共汽车' (đi xe buýt) và '不坐飞机' (không đi máy bay)."
      },
      {
        "id": "l1_06_q3",
        "partLabel": "Phần 3 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Hiện tại anh Trương đang ở đâu?",
        "audioZh": "男：喂，请问张先生在家吗？ 女：他不在家，他去火车站接朋友了。",
        "audioPy": "Nán: Wéi, qǐngwèn Zhāng xiānsheng zài jiā ma? Nǚ: Tā bú zài jiā, tā qù huǒchēzhàn jiē péngyou le.",
        "audioVi": "Nam: A-lô, xin hỏi ông Trương có ở nhà không ạ? Nữ: Ông ấy không ở nhà, ông ấy ra ga tàu hỏa đón bạn rồi.",
        "opts": [
          "Ở nhà",
          "Ở bệnh viện",
          "Ở ga tàu hỏa",
          "Ở trường học"
        ],
        "ans": 2,
        "exp": "Người nữ trả lời '去火车站接朋友了' (đã đi ga tàu hỏa đón bạn)."
      },
      {
        "id": "l1_06_q4",
        "partLabel": "Phần 3 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Bệnh viện nằm ở đâu?",
        "audioZh": "女：请问，医院在前面吗？ 男：不在前面，医院在那个大商店的后面。",
        "audioPy": "Nǚ: Qǐngwèn, yīyuàn zài qiánmiàn ma? Nán: Bú zài qiánmiàn, yīyuàn zài nàge dà shāngdiàn de hòumiàn.",
        "audioVi": "Nữ: Xin hỏi, bệnh viện ở phía trước phải không? Nam: Không phải phía trước, bệnh viện ở phía sau cửa hàng lớn kia.",
        "opts": [
          "Phía trước cửa hàng",
          "Phía sau cửa hàng lớn",
          "Bên trong trường học",
          "Bên cạnh ga tàu"
        ],
        "ans": 1,
        "exp": "Người nam chỉ rõ '在那个大商店的后面' (ở phía sau cửa hàng lớn kia)."
      },
      {
        "id": "l1_06_q5",
        "partLabel": "Phần 4 • Đoạn ngắn & Hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Từ nhà bạn ấy đến trường mất bao lâu?",
        "audioZh": "我家离学校很近，我每天走路十分钟就到学校了。",
        "audioPy": "Wǒ jiā lí xuéxiào hěn jìn, wǒ měitiān zǒulù shí fēnzhōng jiù dào xuéxiào le.",
        "audioVi": "Nhà tôi cách trường rất gần, mỗi ngày tôi đi bộ 10 phút là tới trường rồi.",
        "opts": [
          "Đi bộ 5 phút",
          "Đi bộ 10 phút",
          "Đi xe buýt 30 phút",
          "Đi tàu hỏa 1 tiếng"
        ],
        "ans": 1,
        "exp": "Bài nghe nói rõ '走路十分钟' (đi bộ 10 phút)."
      }
    ],
    "dictations": [
      {
        "id": "l1_06_d1",
        "zh": "请问，去火车站怎么走？",
        "py": "Qǐngwèn, qù huǒchēzhàn zěnme zǒu?",
        "vi": "Xin hỏi, đi đến ga tàu hỏa đi thế nào?",
        "hint": "Xin hỏi + đi ga tàu hỏa + đi thế nào"
      },
      {
        "id": "l1_06_d2",
        "zh": "小狗在桌子下面。",
        "py": "Xiǎo gǒu zài zhuōzi xiàmiàn.",
        "vi": "Con chó nhỏ ở dưới bàn.",
        "hint": "Chó nhỏ + ở + dưới cái bàn"
      }
    ]
  },
  {
    "id": "listen_hsk2",
    "level": 2,
    "badge": "HSK 2 • Sơ-Trung",
    "title": "Bài 2: Mua sắm, Giao thông & Sức khỏe",
    "subtitle": "Luyện nghe câu so sánh, phương tiện di chuyển và phản hồi trong cửa hàng.",
    "tips": "HSK 2 thường bẫy bằng chữ '没/不', số lượng, hoặc thay đổi kế hoạch ở vế sau (但是 / 不过).",
    "questions": [
      {
        "id": "l2_q1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Anh ấy thường đi làm bằng xe đạp vì gần công ty.",
        "audioZh": "因为公司离我家比较远，所以我每天坐公共汽车去上班。",
        "audioPy": "Yīnwèi gōngsī lí wǒ jiā bǐjiào yuǎn, suǒyǐ wǒ měitiān zuò gōnggòng qìchē qù shàngbān.",
        "audioVi": "Vì công ty cách nhà tôi khá xa, nên mỗi ngày tôi đều đi xe buýt đến chỗ làm.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Công ty khá xa ('比较远') và anh ấy đi xe buýt ('坐公共汽车'), không phải đi xe đạp."
      },
      {
        "id": "l2_q2",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Hôm nay cậu em trai bị ốm nên phải nghỉ ở nhà.",
        "audioZh": "弟弟昨天晚上发烧了，今天不能去学校上课，要在家休息。",
        "audioPy": "Dìdi zuótiān wǎnshang fāshāo le, jīntiān bù néng qù xuéxiào shàngkè, yào zài jiā xiūxi.",
        "audioVi": "Tối qua em trai bị sốt, hôm nay không thể đến trường học, phải nghỉ ngơi ở nhà.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Em trai bị sốt tối qua và hôm nay phải ở nhà nghỉ ngơi ('在家休息')."
      },
      {
        "id": "l2_q3",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Chiếc áo màu nào đắt hơn?",
        "audioZh": "女：这件红色的衣服两百块，那件白色的呢？ 男：白色的比红色的便宜三十块。",
        "audioPy": "Nǚ: Zhè jiàn hóngsè de yīfu liǎngbǎi kuài, nà jiàn báisè de ne? Nán: Báisè de bǐ hóngsè de piányi sānshí kuài.",
        "audioVi": "Nữ: Chiếc áo màu đỏ này 200 tệ, còn chiếc màu trắng kia thì sao? Nam: Chiếc màu trắng rẻ hơn chiếc màu đỏ 30 tệ.",
        "opts": [
          "Màu trắng đắt hơn",
          "Màu đỏ đắt hơn",
          "Hai chiếc giá bằng nhau",
          "Không nhắc đến giá"
        ],
        "ans": 1,
        "exp": "Áo trắng rẻ hơn áo đỏ 30 tệ (170 tệ < 200 tệ), suy ra áo màu đỏ đắt hơn."
      },
      {
        "id": "l2_q4",
        "partLabel": "Phần 3 • Hội thoại hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Tại sao người nam không đi xem phim tối nay?",
        "audioZh": "女：晚上我们一起去看电影吧！ 男：真抱歉，我今晚得准备明天的汉语考试。",
        "audioPy": "Nǚ: Wǎnshang wǒmen yìqǐ qù kàn diànyǐng ba! Nán: Zhēn bàoqiàn, wǒ jīnwǎn děi zhǔnbèi míngtiān de Hànyǔ kǎoshì.",
        "audioVi": "Nữ: Tối nay chúng mình cùng đi xem phim nhé! Nam: Thật xin lỗi, tối nay tôi phải chuẩn bị cho kỳ thi tiếng Hán ngày mai.",
        "opts": [
          "Vì anh ấy bị đau đầu",
          "Vì vé phim đã hết",
          "Vì phải ôn thi tiếng Hán",
          "Vì trời mưa to"
        ],
        "ans": 2,
        "exp": "Anh ấy nói '得准备明天的汉语考试' (phải chuẩn bị cho kỳ thi tiếng Hán ngày mai)."
      },
      {
        "id": "l2_q5",
        "partLabel": "Phần 4 • Đoạn ngắn tình huống",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Họ đang nói chuyện ở đâu?",
        "audioZh": "您好，请往这边走，我们的水果都在左边，苹果今天打八折，非常新鲜。",
        "audioPy": "Nínhǎo, qǐng wǎng zhèbiān zǒu, wǒmen de shuǐguǒ dōu zài zuǒbiān, píngguǒ jīntiān dǎ bā zhé, fēicháng xīnxiān.",
        "audioVi": "Xin chào quý khách, mời đi lối này, hoa quả của chúng tôi đều ở bên trái, táo hôm nay giảm 20%, rất tươi ngon.",
        "opts": [
          "Trong bệnh viện",
          "Trong siêu thị / cửa hàng hoa quả",
          "Tại ga tàu hỏa",
          "Trong thư viện"
        ],
        "ans": 1,
        "exp": "Có từ khóa '水果' (hoa quả), '苹果' (táo), '打八折' (giảm 20% — còn 80%)."
      }
    ],
    "dictations": [
      {
        "id": "l2_d1",
        "zh": "坐地铁比坐出租车便宜得多。",
        "py": "Zuò dìtiě bǐ zuò chūzūchē piányi de duō.",
        "vi": "Đi tàu điện ngầm rẻ hơn nhiều so với đi taxi.",
        "hint": "Đi tàu điện ngầm + so với + đi taxi + rẻ hơn nhiều"
      },
      {
        "id": "l2_d2",
        "zh": "他每天早上都去公园跑步。",
        "py": "Tā měitiān zǎoshang dōu qù gōngyuán pǎobù.",
        "vi": "Mỗi sáng anh ấy đều đến công viên chạy bộ.",
        "hint": "Mỗi sáng + đều + đi công viên chạy bộ"
      }
    ]
  },
  {
    "id": "listen_hsk2_02",
    "level": 2,
    "badge": "HSK 2 • Đề 2",
    "title": "Đề 2: Thể thao, Sở thích & Cuối tuần",
    "subtitle": "Nghe các môn thể thao (游泳, 打篮球, 踢足球) và tần suất hành động.",
    "tips": "Chú ý trạng ngữ chỉ tần suất như 每天, 每周, 有时候 và bổ ngữ thời lượng (một tiếng, nửa tiếng).",
    "questions": [
      {
        "id": "l2_02_q1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Anh ấy chơi bóng đá rất giỏi và tập mỗi ngày.",
        "audioZh": "我哥哥喜欢踢足球，但是因为工作忙，他只有周末才去踢。",
        "audioPy": "Wǒ gēge xǐhuan tī zúqiú, dànshì yīnwèi gōngzuò máng, tā zhǐyǒu zhōumò cái qù tī.",
        "audioVi": "Anh trai tôi thích đá bóng, nhưng vì công việc bận nên anh ấy chỉ cuối tuần mới đi đá.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Anh trai chỉ đi đá vào cuối tuần ('只有周末才去踢'), không phải mỗi ngày."
      },
      {
        "id": "l2_02_q2",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Mỗi tuần cô ấy đi bơi ở bể bơi hai lần.",
        "audioZh": "姐姐每周二和周五晚上都去游泳馆游泳，每次游一个小时。",
        "audioPy": "Jiějie měi zhōu'èr hé zhōuwǔ wǎnshang dōu qù yóuyǒngguǎn yóuyǒng, měi cì yóu yí gè xiǎoshí.",
        "audioVi": "Chị gái tối thứ Ba và thứ Sáu hằng tuần đều đến nhà bơi tập bơi, mỗi lần bơi một tiếng.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Mỗi tuần đi bơi vào thứ Ba và thứ Sáu ('每周二和周五'), tức hai lần mỗi tuần."
      },
      {
        "id": "l2_02_q3",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ thích làm gì vào ngày nghỉ?",
        "audioZh": "男：周末你一般喜欢去爬山还是去打球？ 女：我不喜欢运动，我更喜欢在家听音乐、画画儿。",
        "audioPy": "Nán: Zhōumò nǐ yìbān xǐhuan qù páshān háishi qù dǎqiú? Nǚ: Wǒ bù xǐhuan yùndòng, wǒ gèng xǐhuan zài jiā tīng yīnyuè, huàhuàr.",
        "audioVi": "Nam: Cuối tuần bạn thường thích đi leo núi hay chơi bóng? Nữ: Mình không thích vận động, mình thích ở nhà nghe nhạc và vẽ tranh hơn.",
        "opts": [
          "Đi leo núi",
          "Chơi bóng rổ",
          "Nghe nhạc và vẽ tranh",
          "Đi bơi"
        ],
        "ans": 2,
        "exp": "Người nữ nói '更喜欢在家听音乐、画画儿' (thích ở nhà nghe nhạc, vẽ tranh hơn)."
      },
      {
        "id": "l2_02_q4",
        "partLabel": "Phần 3 • Hội thoại hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Họ hẹn nhau lúc mấy giờ chơi bóng rổ?",
        "audioZh": "男：今天下午三点半我们去操场打篮球，好吗？ 女：三点半我还有课，四点一刻怎么样？ 男：行，那四点一刻见。",
        "audioPy": "Nán: Jīntiān xiàwǔ sān diǎn bàn wǒmen qù cāochǎng dǎ lánqiú, hǎo ma? Nǚ: Sān diǎn bàn wǒ hái yǒu kè, sì diǎn yíkè zěnmeyàng? Nán: Xíng, nà sì diǎn yíkè jiàn.",
        "audioVi": "Nam: 3 giờ rưỡi chiều nay chúng mình ra sân tập chơi bóng rổ nhé? Nữ: 3 giờ rưỡi mình vẫn còn tiết học, 4 giờ 15 phút thì sao? Nam: Được, vậy 4 giờ 15 phút gặp nhé.",
        "opts": [
          "3 giờ 15 phút",
          "3 giờ 30 phút",
          "4 giờ 15 phút",
          "4 giờ 30 phút"
        ],
        "ans": 2,
        "exp": "Người nam đồng ý đổi sang '四点一刻' (4 giờ 15 phút)."
      },
      {
        "id": "l2_02_q5",
        "partLabel": "Phần 4 • Đoạn ngắn tình huống",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Vì sao dạo này Tiểu Lý khỏe hơn trước?",
        "audioZh": "小李以前经常生病，从去年开始他每天坚持早起跑步，现在身体比以前好多了。",
        "audioPy": "Xiǎo Lǐ yǐqián jīngcháng shēngbìng, cóng qùnián kāishǐ tā měitiān jiānchí zǎoqǐ pǎobù, xiànzài shēntǐ bǐ yǐqián hǎo duō le.",
        "audioVi": "Tiểu Lý trước đây hay bị ốm, từ năm ngoái cậu ấy kiên trì dậy sớm chạy bộ mỗi ngày, giờ sức khỏe tốt hơn trước nhiều rồi.",
        "opts": [
          "Vì uống thuốc bổ hằng ngày",
          "Vì kiên trì dậy sớm chạy bộ",
          "Vì chuyển nhà gần bệnh viện",
          "Vì ngủ nhiều hơn vào buổi sáng"
        ],
        "ans": 1,
        "exp": "Nguyên nhân được nêu rõ: '每天坚持早起跑步' (kiên trì dậy sớm chạy bộ mỗi ngày)."
      }
    ],
    "dictations": [
      {
        "id": "l2_02_d1",
        "zh": "我最喜欢的运动是游泳。",
        "py": "Wǒ zuì xǐhuan de yùndòng shì yóuyǒng.",
        "vi": "Môn thể thao tôi thích nhất là bơi lội.",
        "hint": "Môn thể thao + thích nhất của tôi + là bơi lội"
      },
      {
        "id": "l2_02_d2",
        "zh": "周末我们一起去打篮球吧。",
        "py": "Zhōumò wǒmen yìqǐ qù dǎ lánqiú ba.",
        "vi": "Cuối tuần chúng mình cùng đi chơi bóng rổ nhé.",
        "hint": "Cuối tuần + chúng mình cùng + đi chơi bóng rổ nhé"
      }
    ]
  },
  {
    "id": "listen_hsk2_03",
    "level": 2,
    "badge": "HSK 2 • Đề 3",
    "title": "Đề 3: Đường phố, Hỏi đường & Phương tiện",
    "subtitle": "Luyện nghe chỉ đường (往左拐, 一直走), khoảng cách và chuyển tuyến xe.",
    "tips": "Hãy hình dung lộ trình theo các từ chỉ hướng: 一直走 (đi thẳng), 往左/右转 (rẽ trái/phải), 路口 (ngã tư).",
    "questions": [
      {
        "id": "l2_03_q1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Từ ga tàu điện ngầm đi đến bảo tàng cần rẽ phải ở ngã tư.",
        "audioZh": "出地铁站以后一直往前走，到第一个路口往左拐就是博物馆。",
        "audioPy": "Chū dìtiězhàn yǐhòu yìzhí wǎng qián zǒu, dào dì yī gè lùkǒu wǎng zuǒ guǎi jiù shì bówùguǎn.",
        "audioVi": "Ra khỏi ga tàu điện ngầm rồi đi thẳng về phía trước, đến ngã tư đầu tiên rẽ trái chính là bảo tàng.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Hướng dẫn nói '往左拐' (rẽ trái), không phải rẽ phải."
      },
      {
        "id": "l2_03_q2",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Đi tàu điện ngầm đến sân bay nhanh hơn nhiều so với lái xe.",
        "audioZh": "路上车太多了，坐地铁去机场比自己开车快得多。",
        "audioPy": "Lùshang chē tài duō le, zuò dìtiě qù jīchǎng bǐ zìjǐ kāichē kuài de duō.",
        "audioVi": "Trên đường nhiều xe quá, đi tàu điện ngầm ra sân bay nhanh hơn nhiều so với tự lái xe.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "'坐地铁...比自己开车快得多' nghĩa là đi tàu điện ngầm nhanh hơn tự lái xe nhiều."
      },
      {
        "id": "l2_03_q3",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ muốn đi đâu?",
        "audioZh": "女：请问，去人民医院坐几路公共汽车？ 男：您可以坐十一路车，在第三站下车。",
        "audioPy": "Nǚ: Qǐngwèn, qù Rénmín Yīyuàn zuò jǐ lù gōnggòng qìchē? Nán: Nín kěyǐ zuò shíyī lù chē, zài dì sān zhàn xiàchē.",
        "audioVi": "Nữ: Xin hỏi, đi Bệnh viện Nhân dân thì đi xe buýt số mấy? Nam: Chị có thể đi xe số 11, xuống ở bến thứ ba.",
        "opts": [
          "Nhà ga số 11",
          "Bệnh viện Nhân dân",
          "Siêu thị lớn",
          "Công viên Nhân dân"
        ],
        "ans": 1,
        "exp": "Người nữ hỏi đường đi '人民医院' (Bệnh viện Nhân dân)."
      },
      {
        "id": "l2_03_q4",
        "partLabel": "Phần 3 • Hội thoại hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Tại sao người nam chọn đi bộ về nhà?",
        "audioZh": "女：下雨了，你骑自行车回家吗？ 男：车坏了，好在离家只有五分钟的路，我走回去就行。",
        "audioPy": "Nǚ: Xiàyǔ le, nǐ qí zìxíngchē huí jiā ma? Nán: Chē huài le, hǎozài lí jiā zhǐyǒu wǔ fēnzhōng de lù, wǒ zǒu huíqù jiù xíng.",
        "audioVi": "Nữ: Trời mưa rồi, bạn đạp xe đạp về nhà à? Nam: Xe hỏng rồi, may mà chỉ cách nhà 5 phút đi đường, mình đi bộ về là được.",
        "opts": [
          "Vì muốn tập thể dục",
          "Vì xe đạp bị hỏng",
          "Vì trời tạnh mưa rồi",
          "Vì đường rất xa"
        ],
        "ans": 1,
        "exp": "Người nam giải thích '车坏了' (xe hỏng rồi) và nhà gần nên đi bộ về."
      },
      {
        "id": "l2_03_q5",
        "partLabel": "Phần 4 • Đoạn ngắn tình huống",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Cửa hàng sách nằm ở phía nào của trường học?",
        "audioZh": "我们学校东门外边有一家很大的书店，书店旁边是一家茶馆，同学们下课后常去那儿。",
        "audioPy": "Wǒmen xuéxiào dōngmén wàibiān yǒu yì jiā hěn dà de shūdiàn, shūdiàn pángbiān shì yì jiā cháguǎn, tóngxuémen xiàkè hòu cháng qù nàr.",
        "audioVi": "Bên ngoài cổng phía đông trường chúng tôi có một hiệu sách rất lớn, cạnh hiệu sách là một quán trà, các bạn học sau giờ học hay đến đó.",
        "opts": [
          "Bên trong cổng tây",
          "Bên ngoài cổng đông",
          "Bên cạnh bệnh viện",
          "Đối diện bến xe buýt"
        ],
        "ans": 1,
        "exp": "Bài nghe nói rõ hiệu sách nằm ở '学校东门外边' (bên ngoài cổng đông của trường)."
      }
    ],
    "dictations": [
      {
        "id": "l2_03_d1",
        "zh": "一直往前走就是地铁站。",
        "py": "Yìzhí wǎng qián zǒu jiù shì dìtiězhàn.",
        "vi": "Đi thẳng về phía trước chính là ga tàu điện ngầm.",
        "hint": "Đi thẳng về phía trước + chính là + ga tàu điện ngầm"
      },
      {
        "id": "l2_03_d2",
        "zh": "机场离市中心有点儿远。",
        "py": "Jīchǎng lí shìzhōngxīn yǒudiǎnr yuǎn.",
        "vi": "Sân bay cách trung tâm thành phố hơi xa một chút.",
        "hint": "Sân bay + cách trung tâm thành phố + hơi xa"
      }
    ]
  },
  {
    "id": "listen_hsk2_04",
    "level": 2,
    "badge": "HSK 2 • Đề 4",
    "title": "Đề 4: Đặt món, Siêu thị & Giá cả",
    "subtitle": "Nghe phép tính tổng tiền, giảm giá (打折) và khẩu vị món ăn.",
    "tips": "Ở dạng bài hỏi tiền thừa hoặc tổng tiền, hãy nhẩm nhanh phép tính ngay khi nghe con số và đơn vị.",
    "questions": [
      {
        "id": "l2_04_q1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Món cá hôm nay rất cay nên cô ấy không ăn được.",
        "audioZh": "这道鱼一点儿也不辣，非常甜，妈妈特别爱吃。",
        "audioPy": "Zhè dào yú yìdiǎnr yě bú là, fēicháng tián, māma tèbié ài chī.",
        "audioVi": "Món cá này chẳng cay chút nào, rất ngọt, mẹ đặc biệt thích ăn.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "'一点儿也不辣' nghĩa là chẳng cay chút nào, trái ngược với câu nhận định."
      },
      {
        "id": "l2_04_q2",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Người nói quên mang theo tiền mặt nhưng thanh toán bằng điện thoại.",
        "audioZh": "今天我忘带钱包了，还好可以用手机付款。",
        "audioPy": "Jīntiān wǒ wàng dài qiánbāo le, hái hǎo kěyǐ yòng shǒujī fùkuǎn.",
        "audioVi": "Hôm nay tôi quên mang ví tiền rồi, may mà có thể trả tiền bằng điện thoại.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Quên mang ví ('忘带钱包') và trả tiền qua điện thoại ('用手机付款') khớp hoàn toàn."
      },
      {
        "id": "l2_04_q3",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Khách hàng được trả lại bao nhiêu tiền thừa?",
        "audioZh": "男：一碗牛肉面和一杯茶一共多少钱？ 女：面二十五块，茶八块，一共三十三块。 男：给您五十块。",
        "audioPy": "Nán: Yì wǎn niúròumiàn hé yì bēi chá yígòng duōshao qián? Nǚ: Miàn èrshíwǔ kuài, chá bā kuài, yígòng sānshísān kuài. Nán: Gěi nín wǔshí kuài.",
        "audioVi": "Nam: Một bát mì bò và một cốc trà tổng cộng bao nhiêu tiền? Nữ: Mì 25 tệ, trà 8 tệ, tổng cộng 33 tệ. Nam: Gửi chị 50 tệ.",
        "opts": [
          "15 tệ",
          "17 tệ",
          "23 tệ",
          "27 tệ"
        ],
        "ans": 1,
        "exp": "Tổng 33 tệ, đưa 50 tệ thì tiền thừa là 50 − 33 = 17 tệ."
      },
      {
        "id": "l2_04_q4",
        "partLabel": "Phần 3 • Hội thoại hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Vì sao người nữ không mua đôi giày đen?",
        "audioZh": "男：这双黑色的鞋子挺好看的，你怎么不买？ 女：样子很好看，可惜没有我的号了，只有大号的。",
        "audioPy": "Nán: Zhè shuāng hēisè de xiézi tǐng hǎokàn de, nǐ zěnme bù mǎi? Nǚ: Yàngzi hěn hǎokàn, kěxī méiyǒu wǒ de hào le, zhǐyǒu dà hào de.",
        "audioVi": "Nam: Đôi giày màu đen này đẹp phết, sao bạn không mua? Nữ: Kiểu dáng rất đẹp, tiếc là hết cỡ của mình rồi, chỉ còn cỡ to thôi.",
        "opts": [
          "Vì màu đen không đẹp",
          "Vì giá quá đắt",
          "Vì không còn cỡ vừa chân",
          "Vì chất lượng không tốt"
        ],
        "ans": 2,
        "exp": "Người nữ nói '没有我的号了' (không còn cỡ của mình nữa)."
      },
      {
        "id": "l2_04_q5",
        "partLabel": "Phần 4 • Đoạn ngắn tình huống",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Hôm nay món nào trong siêu thị được giảm giá?",
        "audioZh": "欢迎来到天天超市！今天所有牛奶打七折，鸡蛋也很新鲜，欢迎大家购买。",
        "audioPy": "Huānyíng láidào Tiāntiān Chāoshì! Jīntiān suǒyǒu niúnǎi dǎ qī zhé, jīdàn yě hěn xīnxiān, huānyíng dàjiā gòumǎi.",
        "audioVi": "Chào mừng đến với Siêu thị Thiên Thiên! Hôm nay toàn bộ sữa tươi giảm 30%, trứng gà cũng rất tươi, mời mọi người chọn mua.",
        "opts": [
          "Trứng gà",
          "Sữa tươi",
          "Thịt bò",
          "Nước táo"
        ],
        "ans": 1,
        "exp": "Thông báo nói rõ '所有牛奶打七折' (toàn bộ sữa tươi bán giá 70%, tức giảm 30%)."
      }
    ],
    "dictations": [
      {
        "id": "l2_04_d1",
        "zh": "服务员，请给我一碗米饭。",
        "py": "Fúwùyuán, qǐng gěi wǒ yì wǎn mǐfàn.",
        "vi": "Nhân viên phục vụ, làm ơn cho tôi một bát cơm.",
        "hint": "Phục vụ + xin cho tôi + một bát cơm"
      },
      {
        "id": "l2_04_d2",
        "zh": "这双鞋比那双贵五十块。",
        "py": "Zhè shuāng xié bǐ nà shuāng guì wǔshí kuài.",
        "vi": "Đôi giày này đắt hơn đôi kia 50 tệ.",
        "hint": "Đôi giày này + so với đôi kia + đắt hơn 50 tệ"
      }
    ]
  },
  {
    "id": "listen_hsk2_05",
    "level": 2,
    "badge": "HSK 2 • Đề 5",
    "title": "Đề 5: Lịch hẹn, Sinh nhật & Du lịch ngắn",
    "subtitle": "Nghe lời mời, thời gian bắt đầu – kết thúc và kế hoạch đi du lịch.",
    "tips": "Cấu trúc 从...到... (từ... đến...) và 要...了 (sắp... rồi) là điểm ngữ pháp xuất hiện rất nhiều trong phần nghe HSK 2.",
    "questions": [
      {
        "id": "l2_05_q1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Bố mẹ sẽ đến thăm anh ấy vào ngày Chủ nhật tuần này.",
        "audioZh": "爸爸妈妈下个星期天坐火车来看我，我要去车站接他们。",
        "audioPy": "Bàba māma xià gè xīngqītiān zuò huǒchē lái kàn wǒ, wǒ yào qù chēzhàn jiē tāmen.",
        "audioVi": "Chủ nhật tuần sau bố mẹ đi tàu hỏa đến thăm tôi, tôi phải ra ga đón họ.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Bài nghe nói '下个星期天' (Chủ nhật tuần sau), không phải tuần này."
      },
      {
        "id": "l2_05_q2",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Cửa hàng mở cửa từ chín giờ sáng đến tám giờ tối.",
        "audioZh": "这家书店每天从上午九点开门，一直到晚上八点关门。",
        "audioPy": "Zhè jiā shūdiàn měitiān cóng shàngwǔ jiǔ diǎn kāimén, yìzhí dào wǎnshang bā diǎn guānmén.",
        "audioVi": "Hiệu sách này mỗi ngày mở cửa từ 9 giờ sáng, cho tới 8 giờ tối mới đóng cửa.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Khung giờ '从上午九点...到晚上八点' khớp hoàn toàn."
      },
      {
        "id": "l2_05_q3",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Cuối tuần này họ định tổ chức sinh nhật cho ai?",
        "audioZh": "女：星期六晚上你有时间吗？我们想给小红办一个生日晚会。 男：太好了，我一定去参加！",
        "audioPy": "Nǚ: Xīngqīliù wǎnshang nǐ yǒu shíjiān ma? Wǒmen xiǎng gěi Xiǎohóng bàn yí gè shēngrì wǎnhuì. Nán: Tài hǎo le, wǒ yídìng qù cānjiā!",
        "audioVi": "Nữ: Tối thứ Bảy bạn có rảnh không? Chúng mình muốn tổ chức tiệc sinh nhật cho Tiểu Hồng. Nam: Tuyệt quá, mình nhất định sẽ tham gia!",
        "opts": [
          "Cho người nam",
          "Cho người nữ",
          "Cho Tiểu Hồng",
          "Cho thầy giáo"
        ],
        "ans": 2,
        "exp": "Người nữ nói '给小红办一个生日晚会' (tổ chức tiệc sinh nhật cho Tiểu Hồng)."
      },
      {
        "id": "l2_05_q4",
        "partLabel": "Phần 3 • Hội thoại hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Cô ấy đã ở Tây An chơi mấy ngày?",
        "audioZh": "男：听说你去西安旅游了，好玩儿吗？ 女：非常好玩儿！我在那儿住了三天，拍了好多照片。",
        "audioPy": "Nán: Tīngshuō nǐ qù Xī'ān lǚyóu le, hǎowánr ma? Nǚ: Fēicháng hǎowánr! Wǒ zài nàr zhù le sān tiān, pāi le hǎoduō zhàopiàn.",
        "audioVi": "Nam: Nghe nói bạn đi Tây An du lịch về, vui không? Nữ: Rất vui! Mình ở đó 3 ngày, chụp được rất nhiều ảnh.",
        "opts": [
          "2 ngày",
          "3 ngày",
          "5 ngày",
          "1 tuần"
        ],
        "ans": 1,
        "exp": "Người nữ nói '在那儿住了三天' (ở đó 3 ngày)."
      },
      {
        "id": "l2_05_q5",
        "partLabel": "Phần 4 • Đoạn ngắn tình huống",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Vì sao anh ấy chuẩn bị máy ảnh?",
        "audioZh": "下个月我要和朋友一起去海边玩儿，我准备了新相机，想多拍一些好看的风景照。",
        "audioPy": "Xià gè yuè wǒ yào hé péngyou yìqǐ qù hǎibiān wánr, wǒ zhǔnbèi le xīn xiàngjī, xiǎng duō pāi yìxiē hǎokàn de fēngjǐngzhào.",
        "audioVi": "Tháng sau tôi sẽ cùng bạn ra biển chơi, tôi đã chuẩn bị máy ảnh mới để chụp thật nhiều ảnh phong cảnh đẹp.",
        "opts": [
          "Để đi bán máy ảnh",
          "Để chụp ảnh phong cảnh ở biển",
          "Để tặng sinh nhật bạn",
          "Để học chụp ảnh ở trường"
        ],
        "ans": 1,
        "exp": "Anh ấy chuẩn bị máy ảnh để đi biển và '多拍一些好看的风景照' (chụp thêm nhiều ảnh phong cảnh đẹp)."
      }
    ],
    "dictations": [
      {
        "id": "l2_05_d1",
        "zh": "下个月我要去上海旅游。",
        "py": "Xià gè yuè wǒ yào qù Shànghǎi lǚyóu.",
        "vi": "Tháng sau tôi sẽ đi Thượng Hải du lịch.",
        "hint": "Tháng sau + tôi sẽ + đi Thượng Hải du lịch"
      },
      {
        "id": "l2_05_d2",
        "zh": "别忘了明天来参加晚会。",
        "py": "Bié wàng le míngtiān lái cānjiā wǎnhuì.",
        "vi": "Đừng quên ngày mai đến tham gia buổi tiệc tối nhé.",
        "hint": "Đừng quên (别忘了) + ngày mai đến tham gia tiệc tối"
      }
    ]
  },
  {
    "id": "listen_hsk2_06",
    "level": 2,
    "badge": "HSK 2 • Đề 6",
    "title": "Đề 6: Học tập, Kỳ thi & Thói quen sinh hoạt",
    "subtitle": "Nghe thời gian biểu sinh hoạt, ôn thi và đánh giá kết quả bài làm.",
    "tips": "Chú ý phân biệt các bổ ngữ khả năng và trạng thái đơn giản như 已经...了, 还没...呢, 快要...了.",
    "questions": [
      {
        "id": "l2_06_q1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Em gái ngủ dậy rất muộn vào sáng Chủ nhật.",
        "audioZh": "平时妹妹六点半起床，但是星期天她常常九点才起床。",
        "audioPy": "Píngshí mèimei liù diǎn bàn qǐchuáng, dànshì xīngqītiān tā chángcháng jiǔ diǎn cái qǐchuáng.",
        "audioVi": "Ngày thường em gái dậy lúc 6 giờ rưỡi, nhưng Chủ nhật em ấy thường 9 giờ mới thức dậy.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Ngày Chủ nhật '九点才起床' (9 giờ mới dậy) là muộn hơn hẳn ngày thường."
      },
      {
        "id": "l2_06_q2",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Bài tập tiếng Hán hôm nay khó hơn bài hôm qua.",
        "audioZh": "昨天的汉语作业有很多生词，今天的作业比昨天的容易多了。",
        "audioPy": "Zuótiān de Hànyǔ zuòyè yǒu hěn duō shēngcí, jīntiān de zuòyè bǐ zuótiān de róngyì duō le.",
        "audioVi": "Bài tập tiếng Hán hôm qua có rất nhiều từ mới, bài hôm nay dễ hơn bài hôm qua nhiều.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Câu nói khẳng định bài hôm nay '比昨天的容易多了' (dễ hơn hôm qua nhiều), không phải khó hơn."
      },
      {
        "id": "l2_06_q3",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Cô Vương đã học tiếng Hán được bao lâu rồi?",
        "audioZh": "男：你的汉语说得真流利，学了几年了？ 女：哪里哪里，我只学了一年半，还有很多不会的。",
        "audioPy": "Nán: Nǐ de Hànyǔ shuō de zhēn liúlì, xué le jǐ nián le? Nǚ: Nǎli nǎli, wǒ zhǐ xué le yì nián bàn, hái yǒu hěn duō bú huì de.",
        "audioVi": "Nam: Tiếng Hán của bạn nói trôi chảy thật đấy, bạn học mấy năm rồi? Nữ: Đâu có đâu, mình mới học một năm rưỡi thôi, vẫn còn nhiều cái chưa biết lắm.",
        "opts": [
          "Nửa năm",
          "Một năm",
          "Một năm rưỡi",
          "Hai năm"
        ],
        "ans": 2,
        "exp": "Người nữ trả lời '只学了一年半' (mới học một năm rưỡi)."
      },
      {
        "id": "l2_06_q4",
        "partLabel": "Phần 3 • Hội thoại hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nam cảm thấy thế nào về kỳ thi sáng nay?",
        "audioZh": "女：上午的考试怎么样，题目难不难？ 男：阅读不太难，就是听力有点儿快，有两道题没听清楚。",
        "audioPy": "Nǚ: Shàngwǔ de kǎoshì zěnmeyàng, tímù nán bù nán? Nán: Yuèdú bú tài nán, jiùshì tīnglì yǒudiǎnr kuài, yǒu liǎng dào tí méi tīng qīngchu.",
        "audioVi": "Nữ: Kỳ thi sáng nay thế nào, đề có khó không? Nam: Đọc hiểu không khó lắm, chỉ có phần nghe hơi nhanh một chút, có hai câu mình nghe chưa rõ.",
        "opts": [
          "Phần đọc rất khó",
          "Phần nghe hơi nhanh",
          "Làm đúng hết tất cả câu",
          "Không kịp làm bài viết"
        ],
        "ans": 1,
        "exp": "Người nam nhận xét '听力有点儿快' (phần nghe hơi nhanh)."
      },
      {
        "id": "l2_06_q5",
        "partLabel": "Phần 4 • Đoạn ngắn tình huống",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Buổi tối bạn ấy thường đi ngủ vào lúc nào?",
        "audioZh": "我每天晚上九点半做完作业，然后看二十分钟报纸，十点半准时睡觉。",
        "audioPy": "Wǒ měitiān wǎnshang jiǔ diǎn bàn zuòwán zuòyè, ránhòu kàn èrshí fēnzhōng bàozhǐ, shí diǎn bàn zhǔnshí shuìjiào.",
        "audioVi": "Mỗi tối 9 giờ rưỡi tôi làm xong bài tập, sau đó đọc báo 20 phút, 10 giờ rưỡi đi ngủ đúng giờ.",
        "opts": [
          "9 giờ 30 tối",
          "9 giờ 50 tối",
          "10 giờ tối",
          "10 giờ 30 tối"
        ],
        "ans": 3,
        "exp": "Bài nghe nêu rõ '十点半准时睡觉' (10 giờ rưỡi đi ngủ đúng giờ)."
      }
    ],
    "dictations": [
      {
        "id": "l2_06_d1",
        "zh": "她每天晚上都复习生词。",
        "py": "Tā měitiān wǎnshang dōu fùxí shēngcí.",
        "vi": "Mỗi tối cô ấy đều ôn tập từ mới.",
        "hint": "Cô ấy + mỗi tối đều + ôn tập từ mới"
      },
      {
        "id": "l2_06_d2",
        "zh": "今天的问题我没听清楚。",
        "py": "Jīntiān de wèntí wǒ méi tīng qīngchu.",
        "vi": "Câu hỏi hôm nay tôi nghe chưa rõ.",
        "hint": "Câu hỏi hôm nay + tôi chưa nghe rõ (没听清楚)"
      }
    ]
  },
  {
    "id": "listen_hsk3",
    "level": 3,
    "badge": "HSK 3 • Trung cấp 1",
    "title": "Bài 3: Học tập, Kế hoạch cuối tuần & Thói quen",
    "subtitle": "Hội thoại 2-3 lượt với bổ ngữ kết quả, câu chữ 把 và từ nối nguyên nhân – kết quả.",
    "tips": "Chú ý câu hỏi cuối cùng: đôi khi hai người bàn nhiều phương án, nhưng quyết định cuối cùng mới là đáp án.",
    "questions": [
      {
        "id": "l3_q1",
        "partLabel": "Phần 3 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ cuối cùng quyết định mang theo gì?",
        "audioZh": "男：外边风很大，好像快下雨了，你带伞了吗？ 女：刚才忘了，谢谢提醒，我现在把雨伞放进包里。",
        "audioPy": "Nán: Wàibiān fēng hěn dà, hǎoxiàng kuài xiàyǔ le, nǐ dài sǎn le ma? Nǚ: Gāngcái wàng le, xièxie tíxǐng, wǒ xiànzài bǎ yǔsǎn fàngjìn bāo lǐ.",
        "audioVi": "Nam: Bên ngoài gió to lắm, hình như sắp mưa rồi, bạn mang ô chưa? Nữ: Lúc nãy quên mất, cảm ơn đã nhắc, giờ mình cất ô vào túi đây.",
        "opts": [
          "Áo khoác dày",
          "Chiếc ô (雨伞)",
          "Quyển sách",
          "Chai nước"
        ],
        "ans": 1,
        "exp": "Người nữ nói '把雨伞放进包里' (cất ô vào trong túi)."
      },
      {
        "id": "l3_q2",
        "partLabel": "Phần 3 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Tháng sau bạn Tiểu Vương sẽ đi đâu?",
        "audioZh": "女：听说小王下个月要去上海工作了，是真的吗？ 男：对，他找到了一家很不错的互联网公司，下周就搬过去。",
        "audioPy": "Nǚ: Tīngshuō Xiǎo Wáng xià ge yuè yào qù Shànghǎi gōngzuò le, shì zhēn de ma? Nán: Duì, tā zhǎodào le yì jiā hěn búcuò de hùliánwǎng gōngsī, xià zhōu jiù bān guòqù.",
        "audioVi": "Nữ: Nghe nói tháng sau Tiểu Vương sẽ đi Thượng Hải làm việc, có thật không? Nam: Đúng rồi, cậu ấy tìm được một công ty internet rất tốt, tuần sau chuyển sang đó.",
        "opts": [
          "Bắc Kinh",
          "Quảng Châu",
          "Thượng Hải",
          "Thành Đô"
        ],
        "ans": 2,
        "exp": "Câu trả lời khẳng định '去上海工作' (đi Thượng Hải làm việc)."
      },
      {
        "id": "l3_q3",
        "partLabel": "Phần 3 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Tại sao bài tập của người nam chưa làm xong?",
        "audioZh": "女：你今天的作业写完了没有？ 男：还差最后两道题，刚才电脑突然没电了，我正在找充电器呢。",
        "audioPy": "Nǚ: Nǐ jīntiān de zuòyè xiěwán le méiyǒu? Nán: Hái chà zuìhòu liǎng dào tí, gāngcái diànnǎo tūrán méi diàn le, wǒ zhèngzài zhǎo chōngdiànqì ne.",
        "audioVi": "Nữ: Bài tập hôm nay cậu làm xong chưa? Nam: Còn thiếu hai câu cuối, vừa nãy máy tính đột nhiên hết pin, mình đang tìm sạc đây.",
        "opts": [
          "Vì bài tập quá khó",
          "Vì máy tính hết pin",
          "Vì đi chơi thể thao",
          "Vì quên mang sách"
        ],
        "ans": 1,
        "exp": "Nam giải thích '电脑突然没电了' (máy tính đột nhiên hết pin)."
      },
      {
        "id": "l3_q4",
        "partLabel": "Phần 4 • Hội thoại dài",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Cuối tuần này hai người dự định làm gì?",
        "audioZh": "男：这个周末我想去爬山，锻炼一下身体，你去不去？ 女：爬山太累了，不如我们去图书馆看书，顺便喝杯奶茶吧！ 男：好主意，那就听你的。",
        "audioPy": "Nán: Zhège zhōumò wǒ xiǎng qù páshān, duànliàn yíxià shēntǐ, nǐ qù bu qù? Nǚ: Páshān tài lèi le, bùrú wǒmen qù túshūguǎn kànshū, shùnbiàn hē bēi nǎichá ba! Nán: Hǎo zhǔyi, nà jiù tīng nǐ de.",
        "audioVi": "Nam: Cuối tuần này mình muốn đi leo núi rèn luyện sức khỏe, bạn đi không? Nữ: Leo núi mệt quá, chi bằng chúng mình đến thư viện đọc sách, tiện thể uống cốc trà sữa nhé! Nam: Ý hay đấy, vậy nghe theo bạn.",
        "opts": [
          "Đi leo núi",
          "Đi bơi lội",
          "Đến thư viện đọc sách",
          "Ở nhà xem TV"
        ],
        "ans": 2,
        "exp": "Nam đề xuất leo núi nhưng cuối cùng đồng ý theo nữ: '去图书馆看书' (đến thư viện đọc sách)."
      },
      {
        "id": "l3_q5",
        "partLabel": "Phần 4 • Đoạn ngắn",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Điểm quan trọng nhất để học tốt tiếng Hán theo người nói là gì?",
        "audioZh": "学汉语最重要的不是背多少生词，而是每天坚持听和说，哪怕只有十五分钟。",
        "audioPy": "Xué Hànyǔ zuì zhòngyào de bú shì bèi duōshao shēngcí, ér shì měitiān jiānchí tīng hé shuō, nǎpà zhǐyǒu shíwǔ fēnzhōng.",
        "audioVi": "Học tiếng Hán điều quan trọng nhất không phải học thuộc bao nhiêu từ mới, mà là mỗi ngày kiên trì nghe và nói, dù chỉ 15 phút.",
        "opts": [
          "Thuộc thật nhiều từ mới",
          "Mỗi ngày kiên trì nghe và nói",
          "Chỉ làm bài tập ngữ pháp",
          "Viết 100 chữ Hán mỗi tối"
        ],
        "ans": 1,
        "exp": "Cấu trúc '不是…而是…' nhấn mạnh vế sau: '每天坚持听和说' (kiên trì nghe và nói mỗi ngày)."
      }
    ],
    "dictations": [
      {
        "id": "l3_d1",
        "zh": "请把桌上的那本词典递给我。",
        "py": "Qǐng bǎ zhuō shàng de nà běn cídiǎn dì gěi wǒ.",
        "vi": "Làm ơn đưa giúp tôi cuốn từ điển trên bàn kia.",
        "hint": "Câu chữ 把: đưa cuốn từ điển trên bàn cho tôi"
      },
      {
        "id": "l3_d2",
        "zh": "虽然很忙，但他每天都锻炼身体。",
        "py": "Suīrán hěn máng, dàn tā měitiān dōu duànliàn shēntǐ.",
        "vi": "Tuy rất bận nhưng ngày nào anh ấy cũng tập thể dục.",
        "hint": "Cặp liên từ 虽然...但... + rèn luyện sức khỏe"
      }
    ]
  },
  {
    "id": "listen_hsk3_02",
    "level": 3,
    "badge": "HSK 3 • Đề 2",
    "title": "Đề 2: Nhà ở, Thuê phòng & Đồ dùng gia đình",
    "subtitle": "Nghe miêu tả không gian phòng ở, đồ đạc (空调, 冰箱, 电梯) và việc dọn nhà.",
    "tips": "Trong HSK 3, phần Phán đoán Đúng/Sai thường thay đổi một chi tiết nhỏ như tầng lầu, hướng cửa sổ hoặc tiện nghi trong phòng.",
    "questions": [
      {
        "id": "l3_02_q1",
        "partLabel": "Phần 2 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Căn phòng mới thuê vừa có điều hòa vừa có tủ lạnh, lại gần ga tàu điện ngầm.",
        "audioZh": "我新租的房子虽然不大，但是空调、冰箱都有，而且离地铁站很近，走过去只要五分钟。",
        "audioPy": "Wǒ xīn zū de fángzi suīrán bú dà, dànshì kōngtiáo, bīngxiāng dōu yǒu, érqiě lí dìtiězhàn hěn jìn, zǒu guòqù zhǐyào wǔ fēnzhōng.",
        "audioVi": "Căn nhà tôi mới thuê tuy không rộng, nhưng điều hòa, tủ lạnh đều có đủ, hơn nữa cách ga tàu điện ngầm rất gần, đi bộ chỉ mất 5 phút.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Thông tin khớp hoàn toàn: có điều hòa, tủ lạnh và cách ga tàu điện ngầm 5 phút đi bộ."
      },
      {
        "id": "l3_02_q2",
        "partLabel": "Phần 2 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Họ phải leo thang bộ lên tầng tám vì tòa nhà chưa lắp thang máy.",
        "audioZh": "我们住的楼有电梯，不过今天电梯正在修理，我只好爬楼梯上八楼。",
        "audioPy": "Wǒmen zhù de lóu yǒu diàntī, búguò jīntiān diàntī zhèngzài xiūlǐ, wǒ zhǐhǎo pá lóutī shàng bā lóu.",
        "audioVi": "Tòa nhà chúng tôi ở có thang máy, nhưng hôm nay thang máy đang sửa, tôi đành phải leo cầu thang lên tầng 8.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Tòa nhà có thang máy ('有电梯'), chỉ là hôm nay đang sửa nên phải leo bộ."
      },
      {
        "id": "l3_02_q3",
        "partLabel": "Phần 3 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Tại sao người nữ muốn chuyển nhà?",
        "audioZh": "男：你现在的房间那么干净，为什么突然想搬家？ 女：房间是挺好的，就是楼下早上太吵了，我常常睡不好觉。",
        "audioPy": "Nán: Nǐ xiànzài de fángjiān nàme gānjìng, wèishénme tūrán xiǎng bānjiā? Nǚ: Fángjiān shì tǐng hǎo de, jiùshì lóuxià zǎoshang tài chǎo le, wǒ chángcháng shuì bù hǎo jiào.",
        "audioVi": "Nam: Phòng hiện tại của bạn sạch sẽ thế, sao tự nhiên lại muốn chuyển nhà? Nữ: Phòng thì tốt đấy, chỉ có điều dưới lầu buổi sáng ồn quá, mình thường xuyên ngủ không ngon giấc.",
        "opts": [
          "Vì tiền thuê nhà quá đắt",
          "Vì phòng không có điều hòa",
          "Vì dưới lầu buổi sáng quá ồn",
          "Vì cách công ty quá xa"
        ],
        "ans": 2,
        "exp": "Người nữ nêu lý do '楼下早上太吵了' (dưới lầu buổi sáng ồn quá)."
      },
      {
        "id": "l3_02_q4",
        "partLabel": "Phần 4 • Hội thoại dài",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Họ đặt chiếc bàn học ở vị trí nào?",
        "audioZh": "女：这张新书桌放在门口怎么样？ 男：门口走路不太方便。你看，窗户旁边光线好，又安静，放在那儿吧。 女：对，在窗户旁边看书眼睛也舒服。",
        "audioPy": "Nǚ: Zhè zhāng xīn shūzhuō fàng zài ménkǒu zěnmeyàng? Nán: Ménkǒu zǒulù bú tài fāngbiàn. Nǐ kàn, chuānghu pángbiān guāngxiàn hǎo, yòu ānjìng, fàng zài nàr ba. Nǚ: Duì, zài chuānghu pángbiān kànshū yǎnjing yě shūfu.",
        "audioVi": "Nữ: Chiếc bàn học mới này đặt ở cửa ra vào thế nào? Nam: Cửa ra vào đi lại không tiện lắm. Em xem, bên cạnh cửa sổ ánh sáng tốt lại yên tĩnh, đặt ở đó đi. Nữ: Đúng đấy, đọc sách cạnh cửa sổ mắt cũng dễ chịu.",
        "opts": [
          "Ngay cạnh cửa ra vào",
          "Bên cạnh cửa sổ",
          "Giữa phòng khách",
          "Gần chiếc tủ lạnh"
        ],
        "ans": 1,
        "exp": "Hai người thống nhất đặt bàn '在窗户旁边' (bên cạnh cửa sổ) vì ánh sáng tốt và yên tĩnh."
      },
      {
        "id": "l3_02_q5",
        "partLabel": "Phần 4 • Hội thoại dài",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Khi dọn phòng xong, người nói cảm thấy thế nào?",
        "audioZh": "星期六上午我花两个小时把房间打扫干净了，又买了一盆绿色的花放在桌子上，看着这么明亮的房间，心情一下子变好了。",
        "audioPy": "Xīngqīliù shàngwǔ wǒ huā liǎng gè xiǎoshí bǎ fángjiān dǎsǎo gānjìng le, yòu mǎi le yì pén lǜsè de huā fàng zài zhuōzi shàng, kàn zhe zhème míngliàng de fángjiān, xīnqíng yíxiàzi biàn hǎo le.",
        "audioVi": "Sáng thứ Bảy tôi dành hai tiếng dọn dẹp phòng sạch sẽ, lại mua một chậu cây xanh đặt lên bàn, nhìn căn phòng sáng sủa như vậy, tâm trạng bỗng thấy vui hẳn lên.",
        "opts": [
          "Rất mệt và buồn ngủ",
          "Tâm trạng vui vẻ hẳn lên",
          "Thấy căn phòng vẫn bừa bộn",
          "Muốn mua thêm bàn mới"
        ],
        "ans": 1,
        "exp": "Câu kết nêu rõ '心情一下子变好了' (tâm trạng bỗng chốc tốt hẳn lên)."
      }
    ],
    "dictations": [
      {
        "id": "l3_02_d1",
        "zh": "请把桌子打扫干净。",
        "py": "Qǐng bǎ zhuōzi dǎsǎo gānjìng.",
        "vi": "Xin hãy lau dọn cái bàn cho sạch sẽ.",
        "hint": "Câu chữ 把 + lau dọn bàn sạch sẽ (打扫干净)"
      },
      {
        "id": "l3_02_d2",
        "zh": "房间里又安静又明亮。",
        "py": "Fángjiān lǐ yòu ānjìng yòu míngliàng.",
        "vi": "Trong phòng vừa yên tĩnh vừa sáng sủa.",
        "hint": "Cấu trúc 又...又... + yên tĩnh + sáng sủa"
      }
    ]
  },
  {
    "id": "listen_hsk3_03",
    "level": 3,
    "badge": "HSK 3 • Đề 3",
    "title": "Đề 3: Du lịch, Hành lý & Khách sạn",
    "subtitle": "Nghe tình huống đặt phòng, gửi hành lý (行李箱), hộ chiếu và lịch trình tham quan.",
    "tips": "Nghe kỹ các động từ mang theo (带), để quên (忘), tìm lại (找到) và các câu bị động với 被 hoặc 让.",
    "questions": [
      {
        "id": "l3_03_q1",
        "partLabel": "Phần 2 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Anh ấy bị mất hộ chiếu nên không thể lên máy bay.",
        "audioZh": "刚到机场时我以为把护照弄丢了，后来才发现它一直在我的背包最里面。",
        "audioPy": "Gāng dào jīchǎng shí wǒ yǐwéi bǎ hùzhào nòngdiū le, hòulái cái fāxiàn tā yìzhí zài wǒ de bēibāo zuì lǐmiàn.",
        "audioVi": "Lúc mới tới sân bay tôi tưởng mình làm mất hộ chiếu rồi, sau mới phát hiện nó vẫn luôn nằm ở ngăn trong cùng của ba lô.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Anh ấy chỉ tưởng làm mất ('以为...弄丢了'), thực ra hộ chiếu vẫn nằm trong ba lô."
      },
      {
        "id": "l3_03_q2",
        "partLabel": "Phần 2 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Mùa thu ở Bắc Kinh thời tiết mát mẻ, là mùa du lịch rất đẹp.",
        "audioZh": "北京的秋天不冷不热，蓝天白云，红叶特别漂亮，是最适合旅游的季节。",
        "audioPy": "Běijīng de qiūtiān bù lěng bú rè, lántiān báiyún, hóngyè tèbié piàoliang, shì zuì shìhé lǚyóu de jìjié.",
        "audioVi": "Mùa thu ở Bắc Kinh không lạnh không nóng, trời xanh mây trắng, lá đỏ đặc biệt đẹp, là mùa thích hợp nhất để du lịch.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Khớp hoàn toàn: không lạnh không nóng, là mùa thích hợp nhất để du lịch."
      },
      {
        "id": "l3_03_q3",
        "partLabel": "Phần 3 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Khách hàng muốn đặt loại phòng nào?",
        "audioZh": "女：您好，请问还有安静一点儿的房间吗？ 男：有的，三楼面向花园的双人间特别安静，一天三百八十块。",
        "audioPy": "Nǚ: Nínhǎo, qǐngwèn hái yǒu ānjìng yìdiǎnr de fángjiān ma? Nán: Yǒu de, sān lóu miànxiàng huāyuán de shuāngrénjiān tèbié ānjìng, yì tiān sānbǎi bāshí kuài.",
        "audioVi": "Nữ: Xin chào, cho hỏi còn phòng nào yên tĩnh một chút không ạ? Nam: Dạ còn, phòng đôi hướng vườn ở tầng 3 đặc biệt yên tĩnh, mỗi ngày 380 tệ ạ.",
        "opts": [
          "Phòng đơn tầng 1",
          "Phòng yên tĩnh một chút",
          "Phòng hướng mặt đường",
          "Phòng giá 280 tệ"
        ],
        "ans": 1,
        "exp": "Khách nữ yêu cầu '安静一点儿的房间' (phòng yên tĩnh một chút)."
      },
      {
        "id": "l3_03_q4",
        "partLabel": "Phần 4 • Hội thoại dài",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Bây giờ họ sẽ làm gì với chiếc va li nặng?",
        "audioZh": "男：下午的火车还有三个小时才开，我们拉着大行李箱逛街太累了。 女：刚才我问过了，服务台可以免费帮客人照看行李，我们先把箱子放那儿吧。 男：太好了，这样就能轻松去吃饭了。",
        "audioPy": "Nán: Xiàwǔ de huǒchē hái yǒu sān gè xiǎoshí cái kāi, wǒmen lā zhe dà xínglǐxiāng guàngjiē tài lèi le. Nǚ: Gāngcái wǒ wèn guo le, fúwùtái kěyǐ miǎnfèi bāng kèrén zhàokàn xíngli, wǒmen xiān bǎ xiāngzi fàng nàr ba. Nán: Tài hǎo le, zhèyàng jiù néng qīngsōng qù chīfàn le.",
        "audioVi": "Nam: Tàu chiều còn 3 tiếng nữa mới chạy, mình kéo va li to đi dạo phố mệt lắm. Nữ: Nãy mình hỏi rồi, quầy dịch vụ giữ hành lý miễn phí cho khách đấy, mình gửi va li ở đó trước nhé. Nam: Tuyệt quá, vậy là có thể thảnh thơi đi ăn cơm rồi.",
        "opts": [
          "Mang va li lên tàu luôn",
          "Gửi va li tại quầy dịch vụ miễn phí",
          "Quay lại khách sạn nghỉ ngơi",
          "Mua thêm một chiếc va li nhỏ"
        ],
        "ans": 1,
        "exp": "Họ quyết định '先把箱子放那儿' (gửi va li ở quầy dịch vụ giữ miễn phí) rồi đi ăn cơm."
      },
      {
        "id": "l3_03_q5",
        "partLabel": "Phần 4 • Đoạn ngắn",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Khi đi du lịch, người nói khuyên ta nên làm gì?",
        "audioZh": "出去旅游前一定要提前查好当地的天气，多带一件厚衣服，还要把常用的地图软件下载到手机里，这样会方便得多。",
        "audioPy": "Chūqù lǚyóu qián yídìng yào tíqián chá hǎo dāngdì de tiānqì, duō dài yí jiàn hòu yīfu, hái yào bǎ chángyòng de dìtú ruǎnjiàn xiàzài dào shǒujī lǐ, zhèyàng huì fāngbiàn de duō.",
        "audioVi": "Trước khi đi du lịch nhất định phải tra trước thời tiết địa phương, mang thêm một chiếc áo dày, và tải sẵn phần mềm bản đồ vào điện thoại, như vậy sẽ tiện hơn nhiều.",
        "opts": [
          "Chỉ cần mang thật nhiều tiền mặt",
          "Tra thời tiết trước, mang áo dày và tải bản đồ",
          "Đặt vé tàu sát giờ khởi hành",
          "Không cần mang theo điện thoại"
        ],
        "ans": 1,
        "exp": "Bài khuyên 3 việc: xem trước thời tiết ('查好天气'), mang áo dày ('带厚衣服'), tải sẵn bản đồ ('把地图软件下载到手机里')."
      }
    ],
    "dictations": [
      {
        "id": "l3_03_d1",
        "zh": "出发前别忘了检查护照。",
        "py": "Chūfā qián bié wàng le jiǎnchá hùzhào.",
        "vi": "Trước khi xuất phát đừng quên kiểm tra hộ chiếu.",
        "hint": "Trước khi xuất phát + đừng quên + kiểm tra hộ chiếu"
      },
      {
        "id": "l3_03_d2",
        "zh": "这里的风景比照片上更美。",
        "py": "Zhèlǐ de fēngjǐng bǐ zhàopiàn shàng gèng měi.",
        "vi": "Phong cảnh ở đây còn đẹp hơn cả trong ảnh.",
        "hint": "Phong cảnh ở đây + so với trên ảnh + đẹp hơn"
      }
    ]
  },
  {
    "id": "listen_hsk3_04",
    "level": 3,
    "badge": "HSK 3 • Đề 4",
    "title": "Đề 4: Sức khỏe, Khám bệnh & Ẩm thực",
    "subtitle": "Nghe lời khuyên của bác sĩ (感冒, 吃药), thói quen ăn uống lành mạnh và nấu ăn.",
    "tips": "Các câu lời khuyên thường dùng cấu trúc 最好..., 应该..., 少吃/多喝... Hãy bắt đúng động từ theo sau.",
    "questions": [
      {
        "id": "l3_04_q1",
        "partLabel": "Phần 2 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Bác sĩ dặn anh ấy mỗi ngày uống thuốc hai lần và uống nhiều nước ấm.",
        "audioZh": "医生告诉我感冒了要注意休息，一天吃两次药，多喝热水，别喝冰水。",
        "audioPy": "Yīshēng gàosu wǒ gǎnmào le yào zhùyì xiūxi, yì tiān chī liǎng cì yào, duō hē rèshuǐ, bié hē bīngshuǐ.",
        "audioVi": "Bác sĩ bảo tôi bị cảm cúm thì phải chú ý nghỉ ngơi, ngày uống thuốc hai lần, uống nhiều nước ấm, đừng uống nước đá.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Khớp hoàn toàn: '一天吃两次药' (ngày uống thuốc 2 lần) và '多喝热水' (uống nhiều nước ấm)."
      },
      {
        "id": "l3_04_q2",
        "partLabel": "Phần 2 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Bữa sáng chỉ nên ăn hoa quả, không cần ăn gì thêm.",
        "audioZh": "很多人早上忙着上班就不吃早饭，其实这样对胃很不好，早饭一定要吃饱吃好。",
        "audioPy": "Hěn duō rén zǎoshang máng zhe shàngbān jiù bù chī zǎofàn, qíshí zhèyàng duì wèi hěn bù hǎo, zǎofàn yídìng yào chībǎo chīhǎo.",
        "audioVi": "Nhiều người buổi sáng vội đi làm nên bỏ bữa sáng, thực ra làm vậy rất hại dạ dày, bữa sáng nhất định phải ăn no ăn ngon.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Bài nghe khuyên bữa sáng nhất định phải ăn no và đầy đủ ('吃饱吃好'), không hề nói chỉ ăn hoa quả."
      },
      {
        "id": "l3_04_q3",
        "partLabel": "Phần 3 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Bây giờ người nam cảm thấy thế nào?",
        "audioZh": "女：你的脸色不太好，是不是头疼了？ 男：不是头疼，可能是昨天吃了太辣的菜，现在肚子有点儿不舒服。",
        "audioPy": "Nǚ: Nǐ de liǎnsè bú tài hǎo, shì bu shì tóuténg le? Nán: Bú shì tóuténg, kěnéng shì zuótiān chī le tài là de cài, xiànzài dùzi yǒudiǎnr bù shūfu.",
        "audioVi": "Nữ: Sắc mặt cậu không tốt lắm, có phải bị đau đầu rồi không? Nam: Không phải đau đầu, chắc hôm qua ăn đồ cay quá, giờ bụng hơi khó chịu một chút.",
        "opts": [
          "Đau đầu chóng mặt",
          "Đau răng",
          "Bụng hơi khó chịu",
          "Bị sốt cao"
        ],
        "ans": 2,
        "exp": "Người nam nói rõ '肚子有点儿不舒服' (bụng hơi khó chịu)."
      },
      {
        "id": "l3_04_q4",
        "partLabel": "Phần 4 • Hội thoại dài",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Tại sao người nữ không muốn gọi món thịt xào cay?",
        "audioZh": "男：菜单上有你最喜欢的辣子鸡，点一盘吧！ 女：这几天我嗓子一直疼，医生说不能吃油腻和辣的东西，我们还是点清淡一点儿的青菜汤吧。 男：好，那就听医生的，点青菜汤和蒸鱼。",
        "audioPy": "Nán: Càidān shàng yǒu nǐ zuì xǐhuan de làzǐjī, diǎn yì pán ba! Nǚ: Zhè jǐ tiān wǒ sǎngzi yìzhí téng, yīshēng shuō bù néng chī yóunì hé là de dōngxi, wǒmen háishi diǎn qīngdàn yìdiǎnr de qīngcàitāng ba. Nán: Hǎo, nà jiù tīng yīshēng de, diǎn qīngcàitāng hé zhēngyú.",
        "audioVi": "Nam: Trên thực đơn có món gà xào cay bạn thích nhất đấy, gọi một đĩa nhé! Nữ: Mấy hôm nay cổ họng mình cứ đau mãi, bác sĩ dặn không được ăn đồ dầu mỡ và cay, mình gọi canh rau thanh đạm chút đi. Nam: Ừ, vậy nghe theo bác sĩ, gọi canh rau và cá hấp.",
        "opts": [
          "Vì món đó quá đắt",
          "Vì cổ họng đang đau, kiêng đồ cay",
          "Vì quán hết thịt gà",
          "Vì cô ấy không thích ăn thịt"
        ],
        "ans": 1,
        "exp": "Người nữ bị đau họng ('嗓子一直疼') và bác sĩ dặn kiêng đồ cay, dầu mỡ."
      },
      {
        "id": "l3_04_q5",
        "partLabel": "Phần 4 • Đoạn ngắn",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Lợi ích của việc uống trà xanh sau bữa ăn là gì?",
        "audioZh": "饭后半小时喝一杯热绿茶，不仅能解腻，还能让人觉得很舒服，不过晚上睡觉前最好少喝，免得睡不着。",
        "audioPy": "Fànhòu bàn xiǎoshí hē yì bēi rè lǜchá, bùjǐn néng jiěnì, hái néng ràng rén juéde hěn shūfu, búguò wǎnshang shuìjiào qián zuìhǎo shǎo hē, miǎnde shuì bu zháo.",
        "audioVi": "Sau bữa ăn nửa tiếng uống một tách trà xanh nóng không chỉ giải ngán mà còn giúp người ta thấy rất dễ chịu, nhưng buổi tối trước khi ngủ tốt nhất uống ít thôi kẻo mất ngủ.",
        "opts": [
          "Giúp ngủ say hơn vào ban đêm",
          "Giải ngán và tạo cảm giác dễ chịu",
          "Thay thế hoàn toàn nước lọc",
          "Làm tăng cảm giác đói bụng"
        ],
        "ans": 1,
        "exp": "Bài nêu rõ '不仅能解腻，还能让人觉得很舒服' (giải ngán và giúp thấy dễ chịu)."
      }
    ],
    "dictations": [
      {
        "id": "l3_04_d1",
        "zh": "感冒了要多喝水，注意休息。",
        "py": "Gǎnmào le yào duō hē shuǐ, zhùyì xiūxi.",
        "vi": "Bị cảm rồi phải uống nhiều nước, chú ý nghỉ ngơi.",
        "hint": "Bị cảm rồi + uống nhiều nước + chú ý nghỉ ngơi"
      },
      {
        "id": "l3_04_d2",
        "zh": "为了健康，我们应该少吃甜食。",
        "py": "Wèile jiànkāng, wǒmen yīnggāi shǎo chī tiánshí.",
        "vi": "Vì sức khỏe, chúng ta nên ăn ít đồ ngọt.",
        "hint": "Vì sức khỏe (为了健康) + nên ăn ít đồ ngọt"
      }
    ]
  },
  {
    "id": "listen_hsk3_05",
    "level": 3,
    "badge": "HSK 3 • Đề 5",
    "title": "Đề 5: Giao tiếp bạn bè, Tặng quà & Sự kiện",
    "subtitle": "Nghe lời chúc mừng, cảm ơn, xin lỗi và cách diễn đạt sự thay đổi (越...越...).",
    "tips": "Để ý các câu hỏi về mối quan hệ giữa hai người nói (đồng nghiệp, bạn cùng lớp, khách và nhân viên) dựa vào cách xưng hô.",
    "questions": [
      {
        "id": "l3_05_q1",
        "partLabel": "Phần 2 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Cậu ấy rất vui khi nhận được món quà từ người bạn thân.",
        "audioZh": "收到好朋友寄来的生日礼物和卡片，小华高兴得跳了起来。",
        "audioPy": "Shōudào hǎo péngyou jì lái de shēngrì lǐwù hé kǎpiàn, Xiǎohuá gāoxìng de tiào le qǐlái.",
        "audioVi": "Nhận được quà sinh nhật và thiệp do bạn thân gửi tới, Tiểu Hoa vui đến mức nhảy cẫng lên.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "'高兴得跳了起来' thể hiện niềm vui cực độ khi nhận quà từ bạn thân."
      },
      {
        "id": "l3_05_q2",
        "partLabel": "Phần 2 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Hai người bạn cũ gặp lại nhau tại buổi hòa nhạc.",
        "audioZh": "真没想到，我在图书馆门口遇到了一位三年没见的老同学。",
        "audioPy": "Zhēn méi xiǎngdào, wǒ zài túshūguǎn ménkǒu yùdào le yí wèi sān nián méi jiàn de lǎo tóngxué.",
        "audioVi": "Thật không ngờ, tôi gặp lại một người bạn học cũ ba năm chưa gặp ngay trước cổng thư viện.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Họ gặp lại trước cổng thư viện ('图书馆门口'), không phải tại buổi hòa nhạc."
      },
      {
        "id": "l3_05_q3",
        "partLabel": "Phần 3 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Họ định mua gì làm quà chia tay cô giáo?",
        "audioZh": "男：陈老师下周就要回国了，我们送她什么礼物好呢？ 女：老师平时最喜欢喝中国茶，我们买一盒好茶叶送给她吧。",
        "audioPy": "Nán: Chén lǎoshī xià zhōu jiùyào huíguó le, wǒmen sòng tā shénme lǐwù hǎo ne? Nǚ: Lǎoshī píngshí zuì xǐhuan hē Zhōngguó chá, wǒmen mǎi yì hé hǎo cháyè sòng gěi tā ba.",
        "audioVi": "Nam: Tuần sau cô Trần sắp về nước rồi, chúng mình tặng cô món quà gì thì hay nhỉ? Nữ: Ngày thường cô thích uống trà Trung Quốc nhất, chúng mình mua một hộp trà ngon tặng cô đi.",
        "opts": [
          "Một quyển từ điển",
          "Một hộp trà ngon",
          "Một bó hoa tươi",
          "Một chiếc túi xách"
        ],
        "ans": 1,
        "exp": "Người nữ đề xuất '买一盒好茶叶' (mua một hộp trà ngon)."
      },
      {
        "id": "l3_05_q4",
        "partLabel": "Phần 4 • Hội thoại dài",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Tại sao người nam đến muộn buổi họp mặt?",
        "audioZh": "女：怎么现在才来？大家等你半个小时了！ 男：真对不起！我刚出门就发现忘记拿礼物了，只好跑回家去拿，路上又遇到堵车。 女：没关系，人来了就好，快进来坐吧。",
        "audioPy": "Nǚ: Zěnme xiànzài cái lái? Dàjiā děng nǐ bàn gè xiǎoshí le! Nán: Zhēn duìbuqǐ! Wǒ gāng chūmén jiù fāxiàn wàngjì ná lǐwù le, zhǐhǎo pǎo huí jiā qù ná, lùshang yòu yùdào dǔchē. Nǚ: Méi guānxi, rén lái le jiù hǎo, kuài jìnlái zuò ba.",
        "audioVi": "Nữ: Sao giờ mới tới? Mọi người đợi cậu nửa tiếng rồi đấy! Nam: Thật xin lỗi! Vừa ra khỏi cửa mình phát hiện quên lấy quà nên đành chạy về nhà lấy, trên đường lại gặp tắc đường. Nữ: Không sao, cậu tới là tốt rồi, mau vào ngồi đi.",
        "opts": [
          "Vì ngủ quên giờ hẹn",
          "Vì nhầm địa điểm gặp mặt",
          "Vì quay về lấy quà và gặp tắc đường",
          "Vì phải tăng ca ở công ty"
        ],
        "ans": 2,
        "exp": "Nam nêu đủ 2 lý do: quên quà phải chạy về lấy ('忘记拿礼物') và gặp tắc đường ('遇到堵车')."
      },
      {
        "id": "l3_05_q5",
        "partLabel": "Phần 4 • Đoạn ngắn",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Điều gì làm cho tình bạn trở nên bền chặt hơn?",
        "audioZh": "真正的好朋友不一定要天天见面，但只要你需要帮助，他总是会站在你身边，认真听你说话。",
        "audioPy": "Zhēnzhèng de hǎo péngyou bù yídìng yào tiāntiān jiànmiàn, dàn zhǐyào nǐ xūyào bāngzhù, tā zǒngshì huì zhàn zài nǐ shēnbiān, rènzhēn tīng nǐ shuōhuà.",
        "audioVi": "Bạn thân thực sự không nhất thiết phải ngày nào cũng gặp mặt, nhưng chỉ cần bạn cần giúp đỡ, họ luôn ở bên cạnh và chăm chú lắng nghe bạn nói.",
        "opts": [
          "Ngày nào cũng tặng quà cho nhau",
          "Luôn ở bên giúp đỡ và lắng nghe khi cần",
          "Sống chung một khu phố",
          "Có cùng sở thích mua sắm"
        ],
        "ans": 1,
        "exp": "Bài nhấn mạnh bạn thật sự luôn đứng bên khi cần giúp đỡ và chăm chú lắng nghe ('认真听你说话')."
      }
    ],
    "dictations": [
      {
        "id": "l3_05_d1",
        "zh": "谢谢你一直这么关心我。",
        "py": "Xièxie nǐ yìzhí zhème guānxīn wǒ.",
        "vi": "Cảm ơn bạn đã luôn quan tâm đến tôi như vậy.",
        "hint": "Cảm ơn bạn + luôn + quan tâm tôi như vậy"
      },
      {
        "id": "l3_05_d2",
        "zh": "我们的关系越来越好了。",
        "py": "Wǒmen de guānxi yuèláiyuè hǎo le.",
        "vi": "Mối quan hệ của chúng tôi ngày càng tốt hơn.",
        "hint": "Mối quan hệ + ngày càng (越来越) + tốt hơn"
      }
    ]
  },
  {
    "id": "listen_hsk3_06",
    "level": 3,
    "badge": "HSK 3 • Đề 6",
    "title": "Đề 6: Môi trường, Bốn mùa & Cuộc sống đô thị",
    "subtitle": "Nghe các chủ đề bảo vệ môi trường, cây xanh, phân loại rác và thay đổi bốn mùa.",
    "tips": "Ở cuối HSK 3, đoạn văn ngắn thường tổng kết bằng một câu kêu gọi hành động hoặc nêu ý nghĩa tích cực.",
    "questions": [
      {
        "id": "l3_06_q1",
        "partLabel": "Phần 2 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Khi đi siêu thị, cô ấy luôn tự mang theo túi vải để giảm túi ni-lông.",
        "audioZh": "为了保护环境，妈妈每次去超市都自己带环保袋，尽量不用塑料袋。",
        "audioPy": "Wèile bǎohù huánjìng, māma měi cì qù chāoshì dōu zìjǐ dài huánbǎodài, jìnliàng bú yòng sùliàodài.",
        "audioVi": "Để bảo vệ môi trường, mẹ tôi mỗi lần đi siêu thị đều tự mang túi bảo vệ môi trường, cố gắng không dùng túi ni-lông.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Mẹ tự mang túi bảo vệ môi trường và hạn chế dùng túi nhựa ('尽量不用塑料袋')."
      },
      {
        "id": "l3_06_q2",
        "partLabel": "Phần 2 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Người nói thích mùa hè nhất vì có thể đi trượt tuyết.",
        "audioZh": "四个季节里我最喜欢冬天，因为下雪的时候可以去滑雪。",
        "audioPy": "Sì gè jìjié lǐ wǒ zuì xǐhuan dōngtiān, yīnwèi xiàxuě de shíhou kěyǐ qù huáxuě.",
        "audioVi": "Trong bốn mùa tôi thích mùa đông nhất, vì khi tuyết rơi có thể đi trượt tuyết.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Người nói thích mùa đông nhất ('最喜欢冬天'), không phải mùa hè."
      },
      {
        "id": "l3_06_q3",
        "partLabel": "Phần 3 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ nhắc người nam điều gì trước khi ra ngoài?",
        "audioZh": "男：东西都收拾好了，我们走吧！ 女：等一下，你别忘了把空调关了，这样还能省电。",
        "audioPy": "Nán: Dōngxi dōu shōushi hǎo le, wǒmen zǒu ba! Nǚ: Děng yíxià, nǐ bié wàng le bǎ kōngtiáo guān le, zhèyàng hái néng shěngdiàn.",
        "audioVi": "Nam: Đồ đạc thu dọn xong cả rồi, chúng ta đi thôi! Nữ: Đợi chút, anh đừng quên tắt điều hòa nhé, làm vậy còn tiết kiệm được điện.",
        "opts": [
          "Mang theo ô",
          "Tắt điều hòa để tiết kiệm điện",
          "Khóa cửa ban công",
          "Đổ rác trước khi đi"
        ],
        "ans": 1,
        "exp": "Người nữ dặn '别忘了把空调关了' (đừng quên tắt điều hòa)."
      },
      {
        "id": "l3_06_q4",
        "partLabel": "Phần 4 • Hội thoại dài",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Khu phố nơi họ sống dạo này thay đổi thế nào?",
        "audioZh": "男：几年没回来，这里变化真大啊！ 女：是啊，以前这条街又窄又旧，现在不仅种了很多树，还建了一个大公园。 男：空气比以前清新多了，住在这儿真幸福。",
        "audioPy": "Nán: Jǐ nián méi huílái, zhèlǐ biànhuà zhēn dà a! Nǚ: Shì a, yǐqián zhè tiáo jiē yòu zhǎi yòu jiù, xiànzài bùjǐn zhòng le hěn duō shù, hái jiàn le yí gè dà gōngyuán. Nán: Kōngqì bǐ yǐqián qīngxīn duō le, zhù zài zhèr zhēn xìngfú.",
        "audioVi": "Nam: Mấy năm không quay lại, nơi này thay đổi lớn thật đấy! Nữ: Đúng vậy, trước kia con phố này vừa hẹp vừa cũ, giờ không chỉ trồng nhiều cây xanh mà còn xây thêm một công viên lớn. Nam: Không khí trong lành hơn trước nhiều, sống ở đây thật hạnh phúc.",
        "opts": [
          "Đông xe và ồn ào hơn",
          "Trồng nhiều cây và có thêm công viên lớn",
          "Các cửa hàng đều đóng cửa",
          "Không khí ô nhiễm hơn trước"
        ],
        "ans": 1,
        "exp": "Người nữ nói '种了很多树，还建了一个大公园' (trồng nhiều cây và xây công viên lớn)."
      },
      {
        "id": "l3_06_q5",
        "partLabel": "Phần 4 • Đoạn ngắn",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Mục đích chính của việc đi xe đạp đi làm là gì?",
        "audioZh": "现在越来越多上班族选择骑自行车上下班，这不仅能减少汽车带来的空气污染，还能顺便锻炼身体，一举两得。",
        "audioPy": "Xiànzài yuèláiyuè duō shàngbānzú xuǎnzé qí zìxíngchē shàngxiàbān, zhè bùjǐn néng jiǎnshǎo qìchē dàilái de kōngqì wūrǎn, hái néng shùnbiàn duànliàn shēntǐ, yìjǔ-liǎngdé.",
        "audioVi": "Hiện nay ngày càng nhiều nhân viên văn phòng chọn đi xe đạp đi làm, việc này không chỉ giảm ô nhiễm không khí do ô tô gây ra mà còn tiện thể rèn luyện sức khỏe, một công đôi việc.",
        "opts": [
          "Tiết kiệm tiền mua xe buýt",
          "Giảm ô nhiễm không khí và rèn luyện sức khỏe",
          "Đi làm nhanh hơn đi tàu điện",
          "Tránh nắng vào buổi trưa"
        ],
        "ans": 1,
        "exp": "Bài nêu hai lợi ích rõ ràng: '减少…空气污染' (giảm ô nhiễm không khí) và '锻炼身体' (rèn luyện sức khỏe)."
      }
    ],
    "dictations": [
      {
        "id": "l3_06_d1",
        "zh": "保护环境要从小事做起。",
        "py": "Bǎohù huánjìng yào cóng xiǎoshì zuòqǐ.",
        "vi": "Bảo vệ môi trường phải bắt đầu từ những việc nhỏ.",
        "hint": "Bảo vệ môi trường + phải từ việc nhỏ + làm起"
      },
      {
        "id": "l3_06_d2",
        "zh": "春天的公园里开满了鲜花。",
        "py": "Chūntiān de gōngyuán lǐ kāimǎn le xiānhuā.",
        "vi": "Trong công viên mùa xuân nở đầy hoa tươi.",
        "hint": "Công viên mùa xuân + nở đầy (开满) + hoa tươi"
      }
    ]
  },
  {
    "id": "listen_hsk4",
    "level": 4,
    "badge": "HSK 4 • Trung cấp 2",
    "title": "Bài 4: Công việc, Giao tiếp & Thái độ sống",
    "subtitle": "Nghe hội thoại dài và đoạn văn ngắn về văn hóa công sở, thói quen sống tích cực.",
    "tips": "Trong HSK 4, cần phân biệt thái độ người nói (đồng tình, tiếc nuối, khuyên nhủ) và nắm ý chính của đoạn độc thoại.",
    "questions": [
      {
        "id": "l4_q1",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ nghĩ gì về kế hoạch mới của phòng?",
        "audioZh": "男：经理刚才发的新计划你看了吗？我觉得任务有点太重了。 女：确实很有挑战性，不过只要大家分工合作，按时完成应该没问题。",
        "audioPy": "Nán: Jīnglǐ gāngcái fā de xīn jìhuà nǐ kàn le ma? Wǒ juéde rènwu yǒudiǎn tài zhòng le. Nǚ: Quèshí hěn yǒu tiǎozhànxìng, búguò zhǐyào dàjiā fēngōng hézuò, ànshí wánchéng yīnggāi méi wèntí.",
        "audioVi": "Nam: Kế hoạch mới giám đốc vừa gửi bạn xem chưa? Tôi thấy nhiệm vụ hơi nặng quá. Nữ: Đúng là rất có tính thử thách, nhưng chỉ cần mọi người phân công hợp tác thì hoàn thành đúng hạn chắc không vấn đề.",
        "opts": [
          "Hoàn toàn phản đối vì quá khó",
          "Thấy thách thức nhưng tin có thể hoàn thành",
          "Muốn xin nghỉ phép tuần này",
          "Chưa hề đọc bản kế hoạch"
        ],
        "ans": 1,
        "exp": "Nữ công nhận có thử thách ('有挑战性') nhưng lạc quan rằng chỉ cần hợp tác sẽ hoàn thành đúng hạn."
      },
      {
        "id": "l4_q2",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Hai người đang nói về thói quen nào?",
        "audioZh": "女：你最近气色好多了，是不是换了新的护肤品？ 男：哪儿啊，我只是戒掉了熬夜的习惯，晚上十一点前一定睡觉。",
        "audioPy": "Nǚ: Nǐ zuìjìn qìsè hǎo duō le, shì bu shì huàn le xīn de hùfūpǐn? Nán: Nǎr a, wǒ zhǐshì jièdiào le áoyè de xíguàn, wǎnshang shíyī diǎn qián yídìng shuìjiào.",
        "audioVi": "Nữ: Dạo này sắc mặt cậu tốt lên nhiều đấy, có phải đổi mỹ phẩm dưỡng da mới không? Nam: Đâu có, mình chỉ bỏ thói quen thức khuya thôi, trước 11 giờ tối nhất định đi ngủ.",
        "opts": [
          "Tập gym buổi sáng",
          "Uống nhiều nước lọc",
          "Bỏ thói quen thức khuya",
          "Đổi mỹ phẩm mới"
        ],
        "ans": 2,
        "exp": "Anh ấy nói rõ '戒掉了熬夜的习惯' (bỏ thói quen thức khuya)."
      },
      {
        "id": "l4_q3",
        "partLabel": "Phần 3 • Đoạn văn ngắn",
        "type": "mcq",
        "prompt": "Nghe đoạn độc thoại: Theo người nói, khi gặp thất bại ta nên làm gì?",
        "audioZh": "人生中遇到失败其实并不可怕，真正重要的是从失败中总结经验，找出问题的原因，这样下次才能做得更好。",
        "audioPy": "Rénshēng zhōng yùdào shībài qíshí bìng bù kěpà, zhēnzhèng zhòngyào de shì cóng shībài zhōng zǒngjié jīngyàn, zhǎochū wèntí de yuányīn, zhèyàng xiàcì cái néng zuò de gèng hǎo.",
        "audioVi": "Trong đời gặp thất bại thật ra không đáng sợ, điều thực sự quan trọng là tổng kết kinh nghiệm từ thất bại, tìm ra nguyên nhân vấn đề, như vậy lần sau mới làm tốt hơn.",
        "opts": [
          "Bỏ cuộc ngay lập tức",
          "Đổ lỗi cho hoàn cảnh",
          "Tổng kết kinh nghiệm và tìm nguyên nhân",
          "Giấu kín không cho ai biết"
        ],
        "ans": 2,
        "exp": "Cụm từ khóa: '总结经验，找出问题的原因' (tổng kết kinh nghiệm, tìm ra nguyên nhân vấn đề)."
      },
      {
        "id": "l4_q4",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Chuyến bay bị lùi lại vì lý do gì?",
        "audioZh": "男：不好意思，请问飞往广州的航班为什么还没登机？ 女：先生您好，由于广州机场现在有大雾，航班预计推迟一个小时起飞。",
        "audioPy": "Nán: Bù hǎoyìsi, qǐngwèn fēi wǎng Guǎngzhōu de hángbān wèishénme hái méi dēngjī? Nǚ: Xiānsheng nínhǎo, yóuyú Guǎngzhōu jīchǎng xiànzài yǒu dàwù, hángbān yùjì tuīchí yí ge xiǎoshí qǐfēi.",
        "audioVi": "Nam: Xin lỗi, cho hỏi chuyến bay đi Quảng Châu sao vẫn chưa lên máy bay? Nữ: Chào anh, do sân bay Quảng Châu hiện có sương mù dày, chuyến bay dự kiến hoãn cất cánh 1 tiếng.",
        "opts": [
          "Máy bay gặp sự cố kỹ thuật",
          "Sân bay Quảng Châu có sương mù dày",
          "Phi hành đoàn đến muộn",
          "Hành khách chưa làm thủ tục đủ"
        ],
        "ans": 1,
        "exp": "'由于广州机场现在有大雾' = do sân bay Quảng Châu hiện có sương mù lớn."
      },
      {
        "id": "l4_q5",
        "partLabel": "Phần 3 • Đoạn văn ngắn",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Tại sao nhiều người trẻ thích đọc sách điện tử?",
        "audioZh": "现在越来越多年轻人喜欢用手机或阅读器看电子书，不仅携带方便，而且很多电子书的价格比纸质书便宜很多。",
        "audioPy": "Xiànzài yuèláiyuè duō niánqīngrén xǐhuan yòng shǒujī huò yuèdúqì kàn diànzǐshū, bùjǐn xiédài fāngbiàn, érqiě hěn duō diànzǐshū de jiàgé bǐ zhǐzhìshū piányi hěn duō.",
        "audioVi": "Hiện nay ngày càng nhiều bạn trẻ thích dùng điện thoại hoặc máy đọc sách để đọc sách điện tử, không chỉ tiện mang theo mà giá nhiều sách điện tử còn rẻ hơn sách giấy rất nhiều.",
        "opts": [
          "Vì sách giấy không còn bán nữa",
          "Vì tiện mang theo và giá rẻ hơn",
          "Vì đọc trên điện thoại tốt cho mắt hơn",
          "Vì sách điện tử luôn có tranh màu"
        ],
        "ans": 1,
        "exp": "Cặp '不仅携带方便，而且…价格比纸质书便宜很多' (tiện mang theo và giá rẻ hơn nhiều)."
      }
    ],
    "dictations": [
      {
        "id": "l4_d1",
        "zh": "只要坚持努力，梦想就一定会实现。",
        "py": "Zhǐyào jiānchí nǔlì, mèngxiǎng jiù yídìng huì shíxiàn.",
        "vi": "Chỉ cần kiên trì nỗ lực, ước mơ nhất định sẽ thành hiện thực.",
        "hint": "Chỉ cần... thì... (只要...就...) + ước mơ thành hiện thực"
      },
      {
        "id": "l4_d2",
        "zh": "这次活动给我们留下了深刻的印象。",
        "py": "Zhè cì huódòng gěi wǒmen liúxià le shēnkè de yìnxiàng.",
        "vi": "Hoạt động lần này đã để lại cho chúng tôi ấn tượng sâu sắc.",
        "hint": "Để lại ấn tượng sâu sắc (留下深刻的印象)"
      }
    ]
  },
  {
    "id": "listen_hsk4_02",
    "level": 4,
    "badge": "HSK 4 • Đề 2",
    "title": "Đề 2: Phỏng vấn xin việc & Kỹ năng công sở",
    "subtitle": "Nghe phần phán đoán Đúng/Sai và hội thoại về tuyển dụng, hợp tác nhóm, thái độ nghề nghiệp.",
    "tips": "Phần 1 HSK 4 đọc một đoạn ngắn rồi đưa ra nhận định; hãy đối chiếu chủ thể, nguyên nhân và kết luận thật cẩn thận.",
    "questions": [
      {
        "id": "l4_02_q1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe đoạn sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Khi đi phỏng vấn xin việc, ứng viên chỉ cần chú ý ăn mặc chỉnh tề là đủ.",
        "audioZh": "参加面试时，穿得整齐得体固然重要，但更重要的是提前了解公司的业务，并真诚地表达自己的能力与想法。",
        "audioPy": "Cānjiā miànshì shí, chuān de zhěngqí détǐ gùrán zhòngyào, dàn gèng zhòngyào de shì tíqián liǎojiě gōngsī de yèwù, bìng zhēnchéng de biǎodá zìjǐ de nénglì yǔ xiǎngfǎ.",
        "audioVi": "Khi tham gia phỏng vấn, ăn mặc gọn gàng lịch sự đương nhiên quan trọng, nhưng quan trọng hơn là tìm hiểu trước nghiệp vụ công ty và chân thành bày tỏ năng lực, suy nghĩ của bản thân.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Bài nghe dùng '固然重要，但更重要的是…' nhấn mạnh việc tìm hiểu công ty và bày tỏ năng lực quan trọng hơn."
      },
      {
        "id": "l4_02_q2",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Tại sao người nam lại khen đồng nghiệp mới?",
        "audioZh": "女：小周刚来我们部门一个星期，你觉得他工作怎么样？ 男：他特别虚心，遇到不懂的地方马上请教同事，而且写报告非常认真仔细。",
        "audioPy": "Nǚ: Xiǎo Zhōu gāng lái wǒmen bùmén yí gè xīngqī, nǐ juéde tā gōngzuò zěnmeyàng? Nán: Tā tèbié xūxīn, yùdào bù dǒng de dìfang mǎshàng qǐngjiào tóngshì, érqiě xiě bàogào fēicháng rènzhēn zǐxì.",
        "audioVi": "Nữ: Tiểu Chu mới sang phòng mình một tuần, anh thấy cậu ấy làm việc thế nào? Nam: Cậu ấy rất khiêm tốn, gặp chỗ chưa hiểu liền hỏi đồng nghiệp, hơn nữa viết báo cáo cực kỳ nghiêm túc tỉ mỉ.",
        "opts": [
          "Vì cậu ấy có nhiều năm kinh nghiệm",
          "Vì cậu ấy khiêm tốn và làm việc tỉ mỉ",
          "Vì cậu ấy luôn về muộn nhất phòng",
          "Vì cậu ấy giỏi nói đùa"
        ],
        "ans": 1,
        "exp": "Nam khen Tiểu Chu '特别虚心' (rất khiêm tốn) và '认真仔细' (nghiêm túc tỉ mỉ)."
      },
      {
        "id": "l4_02_q3",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Buổi họp sáng nay có thay đổi gì?",
        "audioZh": "男：王经理刚才通知说，原定九点半的会议改到十点十五分在三号会议室举行，资料我已经发到大家邮箱了。 女：收到，谢谢提醒，我先把资料打印出来。",
        "audioPy": "Nán: Wáng jīnglǐ gāngcái tōngzhī shuō, yuándìng jiǔ diǎn bàn de huìyì gǎidào shí diǎn shíwǔ fēn zài sān hào huìyìshì jǔxíng, zīliào wǒ yǐjīng fā dào dàjiā yóuxiāng le. Nǚ: Shōudào, xièxie tíxǐng, wǒ xiān bǎ zīliào dǎyìn chūlái.",
        "audioVi": "Nam: Giám đốc Vương vừa thông báo cuộc họp dự kiến 9 giờ rưỡi đổi sang 10 giờ 15 tại phòng họp số 3, tài liệu tôi đã gửi vào hộp thư của mọi người rồi. Nữ: Đã rõ, cảm ơn đã nhắc, tôi in tài liệu ra trước đây.",
        "opts": [
          "Bị hủy bỏ sang tuần sau",
          "Đổi sang 10 giờ 15 tại phòng họp số 3",
          "Chuyển sang họp trực tuyến",
          "Tổ chức sớm hơn lúc 8 giờ rưỡi"
        ],
        "ans": 1,
        "exp": "Cuộc họp '改到十点十五分在三号会议室举行' (đổi sang 10:15 ở phòng họp số 3)."
      },
      {
        "id": "l4_02_q4",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ khuyên người nam giải quyết áp lực công việc bằng cách nào?",
        "audioZh": "男：最近几个项目同时推进，我每天加班到九点，感觉压力特别大，效率反而低了。 女：任务多的时候更要分清轻重缓急，把最重要的事情排在前面，也要给自己留出休息的时间。 男：你说得对，我确实应该调整一下工作节奏。",
        "audioPy": "Nán: Zuìjìn jǐ gè xiàngmù tóngshí tuījìn, wǒ měitiān jiābān dào jiǔ diǎn, gǎnjué yālì tèbié dà, xiàolǜ fǎn'ér dī le. Nǚ: Rènwu duō de shíhou gèng yào fēnqīng qīngzhòng huǎnjí, bǎ zuì zhòngyào de shìqing pái zài qiánmiàn, yě yào gěi zìjǐ liúchū xiūxi de shíjiān. Nán: Nǐ shuō de duì, wǒ quèshí yīnggāi tiáozhěng yíxià gōngzuò jiézòu.",
        "audioVi": "Nam: Dạo này mấy dự án cùng triển khai, ngày nào tôi cũng tăng ca tới 9 giờ, áp lực lớn quá mà hiệu suất lại giảm. Nữ: Lúc nhiều việc càng phải phân biệt việc nào nặng nhẹ gấp gáp, xếp việc quan trọng nhất lên trước và chừa thời gian nghỉ ngơi cho mình. Nam: Bạn nói đúng, tôi đúng là nên điều chỉnh lại nhịp độ làm việc.",
        "opts": [
          "Xin nghỉ việc ngay lập tức",
          "Tiếp tục tăng ca muộn hơn",
          "Sắp xếp thứ tự ưu tiên và dành thời gian nghỉ ngơi",
          "Giao hết việc cho đồng nghiệp mới"
        ],
        "ans": 2,
        "exp": "Người nữ khuyên '分清轻重缓急' (phân biệt việc gấp quan trọng) và '留出休息的时间' (chừa thời gian nghỉ ngơi)."
      },
      {
        "id": "l4_02_q5",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Theo người nói, bí quyết giữ uy tín trong công việc là gì?",
        "audioZh": "在职场中，能力强固然令人佩服，但真正让人愿意长期合作的是守时与守信。答应别人的事情一定要尽力做到，做不到就提前说明。",
        "audioPy": "Zài zhíchǎng zhōng, nénglì qiáng gùrán lìng rén pèifú, dàn zhēnzhèng ràng rén yuànyì chángqī hézuò de shì shǒushí yǔ shǒuxìn. Dāying biérén de shìqing yídìng yào jìnlì zuòdào, zuò bú dào jiù tíqián shuōmíng.",
        "audioVi": "Nơi công sở, năng lực giỏi tất nhiên đáng khâm phục, nhưng điều thực sự khiến người khác muốn hợp tác lâu dài là đúng giờ và giữ chữ tín. Việc đã hứa nhất định cố gắng làm bằng được, không làm được thì báo trước.",
        "opts": [
          "Đúng giờ và giữ chữ tín",
          "Nói chuyện thật khéo léo",
          "Làm việc một mình không nhờ ai",
          "Luôn nhận mọi việc dù quá sức"
        ],
        "ans": 0,
        "exp": "Bài nhấn mạnh hai phẩm chất cốt lõi: '守时与守信' (đúng giờ và giữ chữ tín)."
      }
    ],
    "dictations": [
      {
        "id": "l4_02_d1",
        "zh": "无论做什么工作，态度都很重要。",
        "py": "Wúlùn zuò shénme gōngzuò, tàidu dōu hěn zhòngyào.",
        "vi": "Bất kể làm công việc gì, thái độ đều rất quan trọng.",
        "hint": "无论...都... + thái độ (态度) rất quan trọng"
      },
      {
        "id": "l4_02_d2",
        "zh": "只要大家共同努力，就一定能成功。",
        "py": "Zhǐyào dàjiā gòngtóng nǔlì, jiù yídìng néng chénggōng.",
        "vi": "Chỉ cần mọi người cùng nhau nỗ lực thì nhất định sẽ thành công.",
        "hint": "Chỉ cần... thì... + cùng nhau nỗ lực (共同努力)"
      }
    ]
  },
  {
    "id": "listen_hsk4_03",
    "level": 4,
    "badge": "HSK 4 • Đề 3",
    "title": "Đề 3: Tiêu dùng thông minh & Thương mại điện tử",
    "subtitle": "Nghe về thói quen mua sắm trực tuyến, đổi trả hàng, chất lượng và tiết kiệm.",
    "tips": "Chú ý các cặp từ đối lập trong tiêu dùng như 便宜 (rẻ) với 质量 (chất lượng), 方便 (tiện) với 冲动消费 (mua sắm bốc đồng).",
    "questions": [
      {
        "id": "l4_03_q1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe đoạn sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Cô ấy mua hàng trực tuyến chủ yếu vì thấy giảm giá mạnh, dù không cần dùng đến.",
        "audioZh": "虽然网上打折活动很多，但我买东西前都会先想清楚自己是不是真的需要，从不因为便宜就随便下单。",
        "audioPy": "Suīrán wǎngshàng dǎzhé huódòng hěn duō, dàn wǒ mǎi dōngxi qián dōu huì xiān xiǎng qīngchu zìjǐ shì bu shì zhēn de xūyào, cóng bù yīnwèi piányi jiù suíbiàn xiàdān.",
        "audioVi": "Tuy trên mạng có nhiều chương trình giảm giá, nhưng trước khi mua đồ tôi đều nghĩ kỹ xem mình có thực sự cần không, chưa bao giờ chỉ vì rẻ mà đặt mua bừa bãi.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Cô ấy nói '从不因为便宜就随便下单' (chưa bao giờ đặt mua bừa chỉ vì rẻ)."
      },
      {
        "id": "l4_03_q2",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Vì sao người nữ muốn trả lại chiếc áo khoác vừa mua trên mạng?",
        "audioZh": "男：你昨天收到的那件大衣穿着怎么样？ 女：颜色跟网页上的照片差得太远了，而且袖子也有点儿短，我打算申请退货。",
        "audioPy": "Nán: Nǐ zuótiān shōudào de nà jiàn dàyī chuān zhe zěnmeyàng? Nǚ: Yánsè gēn wǎngyè shàng de zhàopiàn chà de tài yuǎn le, érqiě xiùzi yě yǒudiǎnr duǎn, wǒ dǎsuàn shēnqǐng tuìhuò.",
        "audioVi": "Nam: Chiếc áo khoác bạn nhận được hôm qua mặc thế nào? Nữ: Màu sắc khác quá xa so với ảnh trên trang mạng, hơn nữa tay áo cũng hơi ngắn, mình định gửi yêu cầu trả hàng.",
        "opts": [
          "Vì áo bị rách khuy",
          "Vì màu khác ảnh và tay áo hơi ngắn",
          "Vì giao hàng chậm một tuần",
          "Vì bạn trai không thích kiểu này"
        ],
        "ans": 1,
        "exp": "Hai lý do được nêu: màu sắc khác ảnh ('颜色…差得太远') và tay áo ngắn ('袖子也有点儿短')."
      },
      {
        "id": "l4_03_q3",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nam thích mua sách ở cửa hàng truyền thống vì lý do gì?",
        "audioZh": "女：网上买书又便宜又快，你怎么还专门跑去书店买？ 男：我喜欢在书店里慢慢翻看每一本书的感觉，这样还能顺便休息一下。",
        "audioPy": "Nǚ: Wǎngshàng mǎishū yòu piányi yòu kuài, nǐ zěnme hái zhuānmén pǎo qù shūdiàn mǎi? Nán: Wǒ xǐhuan zài shūdiàn lǐ mànmàn fānkàn měi yì běn shū de gǎnjué, zhèyàng hái néng shùnbiàn xiūxi yíxià.",
        "audioVi": "Nữ: Mua sách trên mạng vừa rẻ vừa nhanh, sao cậu vẫn cất công ra hiệu sách mua thế? Nam: Mình thích cảm giác thong thả lật xem từng cuốn sách ở hiệu sách, như vậy còn tiện thể thư giãn một chút.",
        "opts": [
          "Vì hiệu sách giảm giá nhiều hơn",
          "Vì thích cảm giác lật xem trực tiếp và thư giãn",
          "Vì nhà cậu ấy ở ngay cạnh hiệu sách",
          "Vì trên mạng không có sách mới"
        ],
        "ans": 1,
        "exp": "Nam thích '慢慢翻看每一本书的感觉' (cảm giác thong thả lật xem từng cuốn sách) và thư giãn."
      },
      {
        "id": "l4_03_q4",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Họ quyết định mua chiếc máy giặt nào?",
        "audioZh": "男：这台白色的洗衣机价格只要两千，比旁边那台银色的便宜八百呢！ 女：可是银色那台更省水省电，声音也小得多，用久了其实更划算。 男：有道理，买电器还是得看长远，就买银色的吧。",
        "audioPy": "Nán: Zhè tái báisè de xǐyījī jiàgé zhǐyào liǎngqiān, bǐ pángbiān nà tái yínsè de piányi bābǎi ne! Nǚ: Kěshì yínsè nà tái gèng shěngshuǐ shěngdiàn, shēngyīn yě xiǎo de duō, yòng jiǔ le qíshí gèng huásuàn. Nán: Yǒu dàolǐ, mǎi diànqì hái shì děi kàn chángyuǎn, jiù mǎi yínsè de ba.",
        "audioVi": "Nam: Chiếc máy giặt màu trắng này giá chỉ 2000 tệ, rẻ hơn chiếc màu bạc bên cạnh 800 tệ đấy! Nữ: Nhưng chiếc màu bạc tiết kiệm nước và điện hơn, tiếng cũng êm hơn nhiều, dùng lâu dài thực ra hời hơn. Nam: Có lý đấy, mua đồ điện vẫn phải tính lâu dài, cứ lấy chiếc màu bạc đi.",
        "opts": [
          "Chiếc màu trắng vì rẻ hơn",
          "Chiếc màu bạc vì tiết kiệm và êm hơn",
          "Không mua chiếc nào cả",
          "Đợi tháng sau giảm giá mới mua"
        ],
        "ans": 1,
        "exp": "Cuối cùng người nam đồng ý: '就买银色的吧' (mua chiếc màu bạc) vì tiết kiệm điện nước và chạy êm."
      },
      {
        "id": "l4_03_q5",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Thói quen ghi chép chi tiêu giúp ích gì cho bạn trẻ?",
        "audioZh": "养成每月记账的习惯非常有用，它能帮我们清楚地看到钱都花在了哪里，从而减少不必要的开支，慢慢存下一笔钱。",
        "audioPy": "Yǎngchéng měi yuè jìzhàng de xíguàn fēicháng yǒuyòng, tā néng bāng wǒmen qīngchu de kàndào qián dōu huā zài le nǎlǐ, cóng'ér jiǎnshǎo bú bìyào de kāizhī, mànmàn cúnxià yì bǐ qián.",
        "audioVi": "Hình thành thói quen ghi chép thu chi hằng tháng rất hữu ích, nó giúp ta thấy rõ tiền đã tiêu vào đâu, từ đó giảm các khoản chi không cần thiết và dần tiết kiệm được một khoản.",
        "opts": [
          "Giúp kiếm thêm công việc phụ",
          "Giúp biết rõ tiền tiêu vào đâu và tiết kiệm hơn",
          "Giúp mua được nhiều đồ giảm giá",
          "Giúp tính toán nhanh hơn khi đi chợ"
        ],
        "ans": 1,
        "exp": "Bài nêu rõ ghi chép thu chi giúp nắm được tiền đi đâu ('清楚地看到钱都花在了哪里') và giảm chi tiêu thừa để tiết kiệm."
      }
    ],
    "dictations": [
      {
        "id": "l4_03_d1",
        "zh": "买东西不能只看价格，还要看质量。",
        "py": "Mǎi dōngxi bù néng zhǐ kàn jiàgé, hái yào kàn zhìliàng.",
        "vi": "Mua đồ không thể chỉ nhìn giá cả, còn phải xem chất lượng.",
        "hint": "Không thể chỉ nhìn giá + còn phải xem chất lượng (质量)"
      },
      {
        "id": "l4_03_d2",
        "zh": "网上购物确实给生活带来了方便。",
        "py": "Wǎngshàng gòuwù quèshí gěi shēnghuó dàilái le fāngbiàn.",
        "vi": "Mua sắm trực tuyến thực sự đã mang lại sự tiện lợi cho cuộc sống.",
        "hint": "Mua sắm trực tuyến + thực sự (确实) + mang lại tiện lợi"
      }
    ]
  },
  {
    "id": "listen_hsk4_04",
    "level": 4,
    "badge": "HSK 4 • Đề 4",
    "title": "Đề 4: Gia đình, Nuôi dạy & Thế hệ trẻ",
    "subtitle": "Nghe quan điểm giáo dục con cái, giao tiếp giữa các thế hệ và tình cảm gia đình.",
    "tips": "Chú ý thái độ của cha mẹ và con cái; các từ như 理解 (thấu hiểu), 鼓励 (khích lệ), 批评 (phê bình) thường quyết định đáp án.",
    "questions": [
      {
        "id": "l4_04_q1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe đoạn sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Khi con làm sai, cha mẹ nên quát mắng ngay để trẻ nhớ lâu.",
        "audioZh": "孩子犯错的时候，父母不要急着批评，而应该耐心听孩子解释原因，这样孩子才愿意跟父母说真话。",
        "audioPy": "Háizi fàncuò de shíhou, fùmǔ búyào jí zhe pīpíng, ér yīnggāi nàixīn tīng háizi jiěshì yuányīn, zhèyàng háizi cái yuànyì gēn fùmǔ shuō zhēnhuà.",
        "audioVi": "Khi con mắc lỗi, cha mẹ đừng vội trách mắng mà nên kiên nhẫn nghe con giải thích nguyên nhân, như vậy con mới sẵn lòng nói thật với cha mẹ.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Bài nghe khuyên '不要急着批评' (đừng vội phê bình), mà hãy kiên nhẫn lắng nghe."
      },
      {
        "id": "l4_04_q2",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Vì sao dạo này người nữ thường gọi điện về cho mẹ?",
        "audioZh": "男：看你每天晚饭后都给家里打电话，是不是最近想家了？ 女：以前忙工作很少联系，后来发现妈妈其实特别盼着听我的声音，哪怕聊十分钟她也很开心。",
        "audioPy": "Nán: Kàn nǐ měitiān wǎnfàn hòu dōu gěi jiālǐ dǎ diànhuà, shì bu shì zuìjìn xiǎng jiā le? Nǚ: Yǐqián máng gōngzuò hěn shǎo liánxì, hòulái fāxiàn māma qíshí tèbié pàn zhe tīng wǒ de shēngyīn, nǎpà liáo shí fēnzhōng tā yě hěn kāixīn.",
        "audioVi": "Nam: Thấy tối nào sau bữa cơm cậu cũng gọi về nhà, dạo này nhớ nhà à? Nữ: Trước bận việc ít liên lạc, sau này nhận ra mẹ thực ra rất mong được nghe giọng mình, dù chỉ trò chuyện 10 phút bà cũng rất vui.",
        "opts": [
          "Vì muốn xin tiền mẹ",
          "Vì nhận ra mẹ rất mong được nghe giọng mình",
          "Vì mẹ đang bị ốm nặng",
          "Vì cậu ấy sắp chuyển về quê"
        ],
        "ans": 1,
        "exp": "Người nữ nhận ra '妈妈其实特别盼着听我的声音' (mẹ rất mong được nghe giọng mình)."
      },
      {
        "id": "l4_04_q3",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Bố của người nam nghĩ sao về việc con trai học nấu ăn?",
        "audioZh": "女：你爸爸不是一直反对男生进厨房吗，怎么今天看他夸你了？ 男：他尝了我做的红烧鱼，觉得味道真不错，还说学会做饭以后生活能照顾好自己。",
        "audioPy": "Nǚ: Nǐ bàba bú shì yìzhí fǎnduì nánshēng jìn chúfáng ma, zěnme jīntiān kàn tā kuā nǐ le? Nán: Tā cháng le wǒ zuò de hóngshāoyú, juéde wèidao zhēn búcuò, hái shuō xuéhuì zuòfàn yǐhòu shēnghuó néng zhàogù hǎo zìjǐ.",
        "audioVi": "Nữ: Không phải bố cậu trước giờ phản đối con trai vào bếp sao, sao hôm nay thấy bác khen cậu thế? Nam: Ông nếm thử món cá kho tớ làm thấy ngon thật, lại bảo biết nấu ăn sau này tự chăm sóc tốt cho bản thân.",
        "opts": [
          "Vẫn phản đối kịch liệt",
          "Khen ngon và ủng hộ để tự chăm sóc bản thân",
          "Chê món cá kho quá mặn",
          "Bảo con trai nên đi ăn hàng"
        ],
        "ans": 1,
        "exp": "Bố khen vị rất ngon và nói biết nấu ăn giúp tự chăm sóc bản thân ('照顾好自己')."
      },
      {
        "id": "l4_04_q4",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Hai vợ chồng thống nhất giải quyết việc dùng điện thoại của con thế nào?",
        "audioZh": "女：儿子每天放学就抱着手机玩游戏，这样下去视力肯定会下降。 男：直接把手机收走他肯定不高兴，不如规定好每天写完作业后只能玩半小时，周末再一起去打球。 女：这个办法既公平又有效，今晚我们就跟他商量一下。",
        "audioPy": "Nǚ: Érzi měitiān fàngxué jiù bào zhe shǒujī wán yóuxì, zhèyàng xiàqù shìlì kěndìng huì xiàjiàng. Nán: Zhíjiē bǎ shǒujī shōuzǒu tā kěndìng bù gāoxìng, bùrú guīdìng hǎo měitiān xiěwán zuòyè hòu zhǐ néng wán bàn xiǎoshí, zhōumò zài yìqǐ qù dǎqiú. Nǚ: Zhège bànfǎ jì gōngpíng yòu yǒuxiào, jīnwǎn wǒmen jiù gēn tā shāngliang yíxià.",
        "audioVi": "Nữ: Con trai ngày nào tan học cũng ôm điện thoại chơi trò chơi, cứ thế này thị lực chắc chắn giảm sút. Nam: Thu thẳng điện thoại chắc chắn nó không vui, chi bằng quy định mỗi ngày làm xong bài tập chỉ được chơi nửa tiếng, cuối tuần cả nhà cùng đi chơi bóng. Nữ: Cách này vừa công bằng vừa hiệu quả, tối nay mình bàn với con nhé.",
        "opts": [
          "Tịch thu hoàn toàn điện thoại",
          "Cho chơi tự do vào buổi tối",
          "Quy định chơi nửa tiếng sau khi làm xong bài và vận động cuối tuần",
          "Mua cho con máy tính mới"
        ],
        "ans": 2,
        "exp": "Hai người chốt quy định: làm xong bài chỉ chơi 30 phút và cuối tuần cùng chơi thể thao."
      },
      {
        "id": "l4_04_q5",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Mục đích chính của việc cho trẻ làm việc nhà là gì?",
        "audioZh": "让孩子从小分担一些简单的家务，比如洗碗、整理房间，不仅能培养他们的独立能力，还能让他们懂得感谢父母的辛苦付出。",
        "audioPy": "Ràng háizi cóng xiǎo fēndān yìxiē jiǎndān de jiāwù, bǐrú xǐwǎn, zhěnglǐ fángjiān, bùjǐn néng péiyǎng tāmen de dúlì nénglì, hái néng ràng tāmen dǒngde gǎnxiè fùmǔ de xīnkǔ fùchū.",
        "audioVi": "Cho trẻ từ nhỏ san sẻ một số việc nhà đơn giản như rửa bát, dọn phòng, không chỉ rèn luyện tính tự lập mà còn giúp trẻ biết trân trọng sự vất vả của cha mẹ.",
        "opts": [
          "Giảm bớt tiền thuê người giúp việc",
          "Rèn tính tự lập và biết ơn sự vất vả của cha mẹ",
          "Giúp trẻ học giỏi môn toán hơn",
          "Để trẻ không có thời gian xem ti-vi"
        ],
        "ans": 1,
        "exp": "Hai lợi ích được nêu: '培养他们的独立能力' (rèn tính tự lập) và '懂得感谢父母的辛苦付出' (biết ơn cha mẹ)."
      }
    ],
    "dictations": [
      {
        "id": "l4_04_d1",
        "zh": "多沟通才能增进彼此的理解。",
        "py": "Duō gōutōng cái néng zēngjìn bǐcǐ de lǐjiě.",
        "vi": "Giao tiếp nhiều mới có thể tăng cường sự thấu hiểu lẫn nhau.",
        "hint": "Giao tiếp nhiều + mới có thể + tăng cường thấu hiểu (理解)"
      },
      {
        "id": "l4_04_d2",
        "zh": "父母的鼓励给了他很大的信心。",
        "py": "Fùmǔ de gǔlì gěi le tā hěn dà de xìnxīn.",
        "vi": "Sự khích lệ của cha mẹ đã tiếp cho anh ấy rất nhiều tự tin.",
        "hint": "Sự khích lệ (鼓励) + của cha mẹ + cho anh ấy tự tin (信心)"
      }
    ]
  },
  {
    "id": "listen_hsk4_05",
    "level": 4,
    "badge": "HSK 4 • Đề 5",
    "title": "Đề 5: Bảo vệ môi trường & Giao thông xanh",
    "subtitle": "Nghe thông báo công cộng, sáng kiến tiết kiệm tài nguyên và lối sống xanh.",
    "tips": "Chú ý các động từ học thuật phổ thông ở HSK 4 như 节约 (tiết kiệm), 浪费 (lãng phí), 减少 (giảm bớt), 垃圾分类 (phân loại rác).",
    "questions": [
      {
        "id": "l4_05_q1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe đoạn sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Khách sạn vẫn thay khăn tắm mỗi ngày dù khách không yêu cầu.",
        "audioZh": "为了节约水资源，这家宾馆提倡客人连续入住期间如果不主动要求，就不每天更换床单和毛巾。",
        "audioPy": "Wèile jiéyuē shuǐzīyuán, zhè jiā bīnguǎn tíchàng kèrén liánxù rùzhù qījiān rúguǒ bù zhǔdòng yāoqiú, jiù bù měitiān gēnghuàn chuángdān hé máojīn.",
        "audioVi": "Để tiết kiệm tài nguyên nước, khách sạn này khuyến khích khách lưu trú liên tiếp nếu không chủ động yêu cầu thì sẽ không thay ga giường và khăn tắm hằng ngày.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Nếu khách không chủ động yêu cầu, khách sạn sẽ KHÔNG thay mỗi ngày ('不每天更换')."
      },
      {
        "id": "l4_05_q2",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ đề xuất điều gì cho chuyến dã ngoại?",
        "audioZh": "男：周末去郊外野餐，我们买几箱一次性筷子和塑料杯吧，省得洗。 女：一次性餐具太浪费资源了，我们各自带自己的水杯和饭盒，干净又环保。",
        "audioPy": "Nán: Zhōumò qù jiāowài yěcān, wǒmen mǎi jǐ xiāng yícìxìng kuàizi hé sùliàobēi ba, shěngde xǐ. Nǚ: Yícìxìng cānjù tài làngfèi zīyuán le, wǒmen gèzì dài zìjǐ de shuǐbēi hé fànhé, gānjìng yòu huánbǎo.",
        "audioVi": "Nam: Cuối tuần đi dã ngoại ngoại ô, mình mua mấy thùng đũa dùng một lần và cốc nhựa nhé, đỡ phải rửa. Nữ: Đồ ăn dùng một lần lãng phí tài nguyên lắm, mỗi người tự mang bình nước và hộp cơm của mình đi, vừa sạch vừa thân thiện môi trường.",
        "opts": [
          "Mua thật nhiều đũa dùng một lần",
          "Mỗi người tự mang bình nước và hộp cơm",
          "Đặt đồ ăn giao tận nơi",
          "Hủy chuyến dã ngoại vì sợ rác"
        ],
        "ans": 1,
        "exp": "Người nữ đề xuất '各自带自己的水杯和饭盒' (mỗi người tự mang bình nước và hộp cơm)."
      },
      {
        "id": "l4_05_q3",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Khu dân cư mới lắp đặt thêm gì?",
        "audioZh": "男：你们小区门口最近新装了不少漂亮的垃圾桶啊！ 女：是啊，现在分成可回收、厨余和其他垃圾几类，居民们慢慢都习惯先分类再扔了。",
        "audioPy": "Nán: Nǐmen xiǎoqū ménkǒu zuìjìn xīn zhuāng le bù shǎo piàoliang de lājītǒng a! Nǚ: Shì a, xiànzài fēnchéng kě huíshōu, chúyú hé qítā lājī jǐ lèi, jūmínmen mànmàn dōu xíguàn xiān fēnlèi zài rēng le.",
        "audioVi": "Nam: Cổng khu nhà bạn dạo này mới lắp thêm bao nhiêu thùng rác đẹp thế! Nữ: Đúng rồi, giờ chia thành rác tái chế, rác hữu cơ nhà bếp và rác khác, cư dân dần quen với việc phân loại rồi mới vứt.",
        "opts": [
          "Trạm xe buýt mới",
          "Thùng rác phân loại theo nhóm",
          "Đèn đường năng lượng mặt trời",
          "Ghế đá trong công viên"
        ],
        "ans": 1,
        "exp": "Khu dân cư lắp các thùng rác phân loại ('分成可回收、厨余和其他垃圾')."
      },
      {
        "id": "l4_05_q4",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Tại sao người nam lại mua xe đạp điện thay vì ô tô?",
        "audioZh": "女：你工作几年攒了些钱，怎么不买辆小汽车呢？ 男：市中心停车太难了，油费也不便宜。我买一辆电动车，平时上下班既灵活又环保，遇到远门再坐高铁。 女：算得真清楚，确实实用多了！",
        "audioPy": "Nán: Shìzhōngxīn tíngchē tài nán le, yóufèi yě bù piányi. Wǒ mǎi yí liàng diàndòngchē, píngshí shàngxiàbān jì línghuó yòu huánbǎo, yùdào yuǎnmén zài zuò gāotiě. Nǚ: Suàn de zhēn qīngchu, quèshí shíyòng duō le!",
        "audioVi": "Nữ: Anh đi làm mấy năm tích góp được chút tiền, sao không mua một chiếc ô tô con? Nam: Trung tâm thành phố đỗ xe khó lắm, tiền xăng cũng chẳng rẻ. Tôi mua một chiếc xe điện, đi làm hằng ngày vừa linh hoạt vừa bảo vệ môi trường, có việc đi xa thì đi tàu cao tốc. Nữ: Tính toán rành mạch thật, đúng là thiết thực hơn nhiều!",
        "opts": [
          "Vì chưa biết lái ô tô",
          "Vì trung tâm khó đỗ xe, xăng đắt và xe điện linh hoạt hơn",
          "Vì công ty cấm nhân viên đi ô tô",
          "Vì nhà gần ga tàu cao tốc nên đi bộ"
        ],
        "ans": 1,
        "exp": "Nam giải thích: đỗ xe khó ('停车太难'), xăng đắt ('油费不便宜'), xe điện linh hoạt và thân thiện môi trường."
      },
      {
        "id": "l4_05_q5",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Ý chính của đoạn văn về 'không lãng phí thức ăn' là gì?",
        "audioZh": "在饭店点菜时，我们要根据人数来点，吃多少点多少，吃不完的菜可以打包带回家，这既是对粮食的尊重，也能养成节约的好习惯。",
        "audioPy": "Zài fàndiàn diǎncài shí, wǒmen yào gēnjù rénshù lái diǎn, chī duōshao diǎn duōshao, chī bu wán de cài kěyǐ dǎbāo dài huí jiā, zhè jì shì duì liángshi de zūnzhòng, yě néng yǎngchéng jiéyuē de hǎo xíguàn.",
        "audioVi": "Khi gọi món ở nhà hàng, chúng ta nên gọi theo số người, ăn bao nhiêu gọi bấy nhiêu, đồ ăn thừa có thể gói mang về, điều này vừa thể hiện sự tôn trọng lương thực vừa rèn thói quen tiết kiệm.",
        "opts": [
          "Nên đi ăn nhà hàng ít lại",
          "Gọi món vừa đủ ăn và gói phần thừa mang về",
          "Chỉ gọi những món ăn rẻ tiền",
          "Không nên đi ăn đông người"
        ],
        "ans": 1,
        "exp": "Bài khuyên '吃多少点多少' (gọi vừa đủ ăn) và '打包带回家' (gói mang về)."
      }
    ],
    "dictations": [
      {
        "id": "l4_05_d1",
        "zh": "养成节约用水的好习惯非常重要。",
        "py": "Yǎngchéng jiéyuē yòngshuǐ de hǎo xíguàn fēicháng zhòngyào.",
        "vi": "Hình thành thói quen tiết kiệm nước rất quan trọng.",
        "hint": "Hình thành thói quen tốt (养成...的好习惯) + tiết kiệm nước"
      },
      {
        "id": "l4_05_d2",
        "zh": "绿色出行让城市变得更美丽。",
        "py": "Lǜsè chūxíng ràng chéngshì biàn de gèng měilì.",
        "vi": "Di chuyển xanh giúp thành phố trở nên tươi đẹp hơn.",
        "hint": "Di chuyển xanh (绿色出行) + làm cho thành phố trở nên đẹp hơn"
      }
    ]
  },
  {
    "id": "listen_hsk4_06",
    "level": 4,
    "badge": "HSK 4 • Đề 6",
    "title": "Đề 6: Văn hóa đọc, Nghệ thuật & Du lịch trải nghiệm",
    "subtitle": "Nghe nhận định về bảo tàng, nghệ thuật truyền thống và du lịch chậm.",
    "tips": "Chú ý các cặp liên từ chuyển ý như 尽管...但是..., 虽然...然而... vì phần cốt lõi thường nằm sau vế chuyển ý.",
    "questions": [
      {
        "id": "l4_06_q1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe đoạn sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "Ngày càng ít bạn trẻ quan tâm đến bảo tàng vì thấy nhàm chán.",
        "audioZh": "过去人们总觉得博物馆很枯燥，但现在越来越多博物馆增加了互动体验项目，吸引了大批年轻人周末前去参观。",
        "audioPy": "Guòqù rénmen zǒng juéde bówùguǎn hěn kūzào, dàn xiànzài yuèláiyuè duō bówùguǎn zēngjiā le hùdòng tǐyàn xiàngmù, xīyǐn le dàpī niánqīngrén zhōumò qiánqù cānguān.",
        "audioVi": "Trước đây người ta hay nghĩ bảo tàng rất khô khan, nhưng hiện nay ngày càng nhiều bảo tàng bổ sung hoạt động trải nghiệm tương tác, thu hút đông đảo bạn trẻ tới tham quan vào cuối tuần.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Ngược lại, hiện nay bảo tàng thu hút rất đông bạn trẻ nhờ có hoạt động tương tác ('吸引了大批年轻人')."
      },
      {
        "id": "l4_06_q2",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nam nhận xét bộ phim tối qua thế nào?",
        "audioZh": "女：昨晚那部电影大家都在夸，你看完觉得怎么样？ 男：音乐和画面确实很美，不过故事情节有些太慢了，看到一半我都差点儿睡着。",
        "audioPy": "Nǚ: Zuówǎn nà bù diànyǐng dàjiā dōu zài kuā, nǐ kànwán juéde zěnmeyàng? Nán: Yīnyuè hé huàmiàn quèshí hěn měi, búguò gùshi qíngjié yǒuxiē tài màn le, kàndào yíbàn wǒ dōu chàdiǎnr shuìzháo.",
        "audioVi": "Nữ: Bộ phim tối qua ai cũng khen, cậu xem xong thấy thế nào? Nam: Âm nhạc và hình ảnh đúng là rất đẹp, nhưng tiết tấu cốt truyện hơi chậm quá, xem nửa chừng tớ suýt ngủ gật.",
        "opts": [
          "Khen cốt truyện vô cùng hấp dẫn",
          "Âm nhạc hình ảnh đẹp nhưng cốt truyện hơi chậm",
          "Chê âm thanh và hình ảnh quá tệ",
          "Muốn đi xem lại lần thứ hai"
        ],
        "ans": 1,
        "exp": "Nam khen nhạc và hình ảnh đẹp nhưng chê '故事情节有些太慢了' (cốt truyện hơi chậm)."
      },
      {
        "id": "l4_06_q3",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Tại sao người nữ lại thích hình thức du lịch chậm?",
        "audioZh": "男：这次假期你只去一个古镇，不多跑几个城市吗？ 女：以前旅游总是赶时间打卡拍照，太累了。这次我想在一个地方多住几天，慢慢感受当地的生活。",
        "audioPy": "Nǚ: Yǐqián lǚyóu zǒngshì gǎn shíjiān dǎkǎ pāizhào, tài lèi le. Zhè cì wǒ xiǎng zài yí gè dìfang duō zhù jǐ tiān, mànmàn gǎnshòu dāngdì de shēnghuó.",
        "audioVi": "Nam: Kỳ nghỉ lần này bạn chỉ đi một cổ trấn thôi à, không đi thêm vài thành phố nữa sao? Nữ: Trước đây đi du lịch cứ chạy đua thời gian chụp ảnh lưu niệm mệt quá. Lần này mình muốn ở lại một nơi vài ngày để thong thả cảm nhận đời sống địa phương.",
        "opts": [
          "Vì không đủ tiền đi nhiều nơi",
          "Vì muốn thong thả cảm nhận đời sống địa phương",
          "Vì phương tiện giao thông không thuận tiện",
          "Vì có bạn bè sống tại cổ trấn"
        ],
        "ans": 1,
        "exp": "Người nữ muốn '慢慢感受当地的生活' (thong thả cảm nhận đời sống địa phương)."
      },
      {
        "id": "l4_06_q4",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Hai người hẹn nhau làm gì vào chiều thứ Bảy?",
        "audioZh": "男：周六下午市图书馆有一场关于中国茶文化的讲座，听说还有茶艺表演，你有兴趣吗？ 女：太好了，我一直想了解茶道，不过票好不好抢？ 男：免费预约，我已经帮咱们俩订好座位了。",
        "audioPy": "Nán: Zhōuliù xiàwǔ shì túshūguǎn yǒu yì chǎng guānyú Zhōngguó chá wénhuà de jiǎngzuò, tīngshuō hái yǒu cháyì biǎoyǎn, nǐ yǒu xìngqu ma? Nǚ: Tài hǎo le, wǒ yìzhí xiǎng liǎojiě chádào, búguò piào hǎo bù hǎo qiǎng? Nán: Miǎnfèi yùyuē, wǒ yǐjīng bāng zánmen liǎ dìnghǎo zuòwèi le.",
        "audioVi": "Nam: Chiều thứ Bảy tại thư viện thành phố có buổi tọa đàm về văn hóa trà Trung Hoa, nghe nói còn có biểu diễn trà nghệ, cậu có hứng thú không? Nữ: Tuyệt quá, tớ vẫn luôn muốn tìm hiểu trà đạo, nhưng vé có khó đặt không? Nam: Đặt chỗ miễn phí, tớ đặt sẵn ghế cho cả hai đứa rồi.",
        "opts": [
          "Đi uống trà sữa cùng bạn",
          "Tham dự tọa đàm văn hóa trà ở thư viện",
          "Đi mua vé xem biểu diễn ca nhạc",
          "Ở nhà đọc sách về lịch sử"
        ],
        "ans": 1,
        "exp": "Họ đã đặt chỗ tham dự buổi tọa đàm văn hóa trà tại thư viện thành phố ('茶文化讲座')."
      },
      {
        "id": "l4_06_q5",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Tác dụng lớn nhất của việc đọc sách mỗi ngày là gì?",
        "audioZh": "哪怕每天只抽出二十分钟阅读，长期坚持下来，不仅能丰富知识面，还能让人在浮躁的生活中保持内心的平静与思考的深度。",
        "audioPy": "Nǎpà měitiān zhǐ chōuchū èrshí fēnzhōng yuèdú, chángqī jiānchí xiàlái, bùjǐn néng fēngfù zhīshimiàn, hái néng ràng rén zài fúzào de shēnghuó zhōng bǎochí nèixīn de píngjìng yǔ sīkǎo de shēndù.",
        "audioVi": "Dù mỗi ngày chỉ dành ra 20 phút đọc sách, kiên trì lâu dài không chỉ mở rộng vốn kiến thức mà còn giúp con người giữ được sự bình tĩnh trong tâm hồn và chiều sâu tư duy giữa cuộc sống xô bồ.",
        "opts": [
          "Giúp đọc nhanh hơn gấp đôi",
          "Mở rộng kiến thức, giữ tâm tĩnh và tư duy sâu",
          "Giúp dễ ngủ vào buổi trưa",
          "Thay thế hoàn toàn việc giao tiếp"
        ],
        "ans": 1,
        "exp": "Bài nêu rõ đọc sách giúp '丰富知识面' (giàu kiến thức), '保持内心的平静' (giữ tâm bình tĩnh) và '思考的深度' (chiều sâu tư duy)."
      }
    ],
    "dictations": [
      {
        "id": "l4_06_d1",
        "zh": "阅读能开阔我们的视野。",
        "py": "Yuèdú néng kāikuò wǒmen de shìyě.",
        "vi": "Đọc sách có thể mở rộng tầm nhìn của chúng ta.",
        "hint": "Đọc sách (阅读) + mở rộng tầm nhìn (开阔视野)"
      },
      {
        "id": "l4_06_d2",
        "zh": "这种传统艺术值得我们好好保护。",
        "py": "Zhè zhǒng chuántǒng yìshù zhídé wǒmen hǎohǎo bǎohù.",
        "vi": "Loại hình nghệ thuật truyền thống này đáng để chúng ta trân trọng gìn giữ.",
        "hint": "Nghệ thuật truyền thống + đáng để (值得) + bảo vệ"
      }
    ]
  },
  {
    "id": "listen_hsk5",
    "level": 5,
    "badge": "HSK 5 • Cao cấp 1",
    "title": "Bài 5: Xã hội Hiện đại, Tâm lý & Văn hóa",
    "subtitle": "Nghe bài nói dài với thành ngữ, lập luận hai chiều và chi tiết ẩn ý.",
    "tips": "Ở HSK 5, đáp án đúng thường được diễn đạt lại bằng từ đồng nghĩa (paraphrase), hãy chú ý câu kết luận hoặc ý phản bác.",
    "questions": [
      {
        "id": "l5_q1",
        "partLabel": "Phần 1 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Quan điểm của người nữ về làm việc từ xa (remote) là gì?",
        "audioZh": "男：我觉得在家办公效率高多了，省去了每天挤地铁的时间。 女：话虽如此，可长期不见面交流，团队之间的默契很容易下降，工作和生活的界限也会变得模糊。",
        "audioPy": "Nán: Wǒ juéde zài jiā bàngōng xiàolǜ gāo duō le, shěngqù le měitiān jǐ dìtiě de shíjiān. Nǚ: Huà suī rúcǐ, kě chángqī bú jiànmiàn jiāoliú, tuánduì zhījiān de mòqì hěn róngyì xiàjiàng, gōngzuò hé shēnghuó de jièxiàn yě huì biàn de móhu.",
        "audioVi": "Nam: Tôi thấy làm việc tại nhà hiệu quả hơn hẳn, tiết kiệm được thời gian chen chúc tàu điện ngầm mỗi ngày. Nữ: Nói vậy cũng đúng, nhưng lâu dài không gặp mặt trao đổi thì sự ăn ý của nhóm dễ giảm sút, ranh giới công việc và cuộc sống cũng trở nên mờ nhạt.",
        "opts": [
          "Hoàn toàn ủng hộ làm ở nhà 100%",
          "Chỉ ra hai mặt trái của làm việc tại nhà",
          "Khuyên người nam nên đổi nghề",
          "Cho rằng tàu điện ngầm quá đắt đỏ"
        ],
        "ans": 1,
        "exp": "Nữ dùng '话虽如此，可…' để nêu 2 nhược điểm: giảm sự ăn ý nhóm và mờ ranh giới công việc – đời sống."
      },
      {
        "id": "l5_q2",
        "partLabel": "Phần 2 • Đoạn văn dài",
        "type": "mcq",
        "prompt": "Nghe đoạn văn: Tác giả muốn truyền tải bài học gì qua câu chuyện về loài tre?",
        "audioZh": "有一种竹子，前四年几乎看不到它长高，但到了第五年，它却能以每天三十厘米的速度疯狂生长。原来，前四年它一直在地下深深扎根。人的成长也是如此，寂寞的积累往往决定着未来的高度。",
        "audioPy": "Yǒu yì zhǒng zhúzi, qián sì nián jīhū kàn bú dào tā zhǎng gāo, dàn dào le dì wǔ nián, tā què néng yǐ měitiān sānshí límǐ de sùdù fēngkuáng shēngzhǎng. Yuánlái, qián sì nián tā yìzhí zài dìxià shēnshēn zhāgēn. Rén de chéngzhǎng yě shì rúcǐ, jìmò de jīlěi wǎngwǎng juédìng zhe wèilái de gāodù.",
        "audioVi": "Có một loài tre, 4 năm đầu gần như không thấy cao lên, nhưng sang năm thứ 5 lại mọc nhanh tới 30cm mỗi ngày. Hóa ra 4 năm đầu nó luôn âm thầm cắm rễ sâu dưới đất. Sự trưởng thành của con người cũng vậy, quá trình tích lũy lặng lẽ quyết định tầm cao tương lai.",
        "opts": [
          "Trồng tre cần rất nhiều phân bón",
          "Tích lũy âm thầm là nền tảng bứt phá sau này",
          "Thành công chỉ phụ thuộc vào may mắn",
          "Không nên kiên nhẫn quá 4 năm"
        ],
        "ans": 1,
        "exp": "Câu chủ đề nằm ở cuối: '寂寞的积累往往决定着未来的高度' (sự tích lũy thầm lặng quyết định tầm cao tương lai)."
      },
      {
        "id": "l5_q3",
        "partLabel": "Phần 2 • Đoạn văn & Tin tức",
        "type": "mcq",
        "prompt": "Nghe đoạn tin tức: Thành phố đang thực hiện biện pháp nào để bảo vệ môi trường?",
        "audioZh": "为了缓解交通拥堵并减少碳排放，市政府今年新增了三十条免费社区微循环公交线路，同时鼓励市民使用共享单车完成最后一公里的出行。",
        "audioPy": "Wèile huǎnjiě jiāotōng yōngdǔ bìng jiǎnshǎo tàn páifàng, shì zhèngfǔ jīnniān xīnzēng le sānshí tiáo miǎnfèi shèqū wēixúnhuán gōngjiāo xiànlù, tóngshí gǔlì shìmín shǐyòng gòngxiǎng dānchē wánchéng zuìhòu yì gōnglǐ de chūxíng.",
        "audioVi": "Để giảm ùn tắc giao thông và khí thải carbon, chính quyền thành phố năm nay mở mới 30 tuyến xe buýt cộng đồng miễn phí, đồng thời khuyến khích người dân dùng xe đạp công cộng cho chặng cuối cùng.",
        "opts": [
          "Cấm toàn bộ xe ô tô cá nhân",
          "Mở 30 tuyến xe buýt miễn phí & khuyến khích xe đạp",
          "Tăng giá vé tàu điện ngầm gấp đôi",
          "Xây thêm 30 bãi đỗ xe lớn"
        ],
        "ans": 1,
        "exp": "Nêu rõ 2 biện pháp: mở 30 tuyến buýt cộng đồng miễn phí ('三十条免费…公交线路') và khuyến khích xe đạp công cộng ('共享单车')."
      },
      {
        "id": "l5_q4",
        "partLabel": "Phần 1 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Tại sao người nam chưa vội nhận lời mời hợp tác?",
        "audioZh": "女：那家公司开出的条件这么优厚，你怎么还在犹豫？ 男：条件确实不错，但我必须先评估一下对方的资金实力和项目风险，不能草率做决定。",
        "audioPy": "Nán: Tiáojiàn quèshí búcuò, dàn wǒ bìxū xiān pínggū yíxià duìfāng de zījīn shílì hé xiàngmù fēngxiǎn, bù néng cǎoshuài zuò juédìng.",
        "audioVi": "Nữ: Công ty kia đưa ra điều kiện hậu hĩnh thế, sao anh vẫn còn do dự? Nam: Điều kiện đúng là tốt, nhưng tôi phải đánh giá năng lực tài chính và rủi ro dự án của đối phương trước, không thể quyết định vội vàng.",
        "opts": [
          "Anh ấy muốn đòi tăng lương gấp ba",
          "Anh ấy muốn đánh giá năng lực tài chính và rủi ro trước",
          "Anh ấy sắp chuyển ra nước ngoài",
          "Anh ấy không hiểu nội dung hợp đồng"
        ],
        "ans": 1,
        "exp": "Anh ấy nhấn mạnh cần '评估一下对方的资金实力和项目风险' (đánh giá tiềm lực vốn và rủi ro dự án)."
      },
      {
        "id": "l5_q5",
        "partLabel": "Phần 2 • Đoạn văn dài",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Điều gì tạo nên sức hút lâu dài của một món ăn truyền thống?",
        "audioZh": "一道传统美食之所以能流传百年，靠的不仅是独特的配方和精湛的手艺，更在于它承载着一代代人的乡愁与记忆。",
        "audioPy": "Yí dào chuántǒng měishí zhī suǒyǐ néng liúchuán bǎinián, kào de bùjǐn shì dútè de pèifāng hé jīngzhàn de shǒuyì, gèng zàiyú tā chéngzài zhe yídàidài rén de xiāngchóu yǔ jìyì.",
        "audioVi": "Một món ngon truyền thống sở dĩ lưu truyền trăm năm, không chỉ nhờ công thức độc đáo và tay nghề tinh xảo, mà còn bởi nó chuyên chở nỗi nhớ quê và ký ức của bao thế hệ.",
        "opts": [
          "Giá bán cực kỳ đắt đỏ",
          "Công thức, tay nghề và ký ức văn hóa qua nhiều thế hệ",
          "Được quảng cáo trên truyền hình",
          "Nguyên liệu nhập khẩu hiếm có"
        ],
        "ans": 1,
        "exp": "Cấu trúc '不仅…更在于…' nêu đủ cả tay nghề/công thức lẫn '乡愁与记忆' (nỗi nhớ quê hương & ký ức)."
      }
    ],
    "dictations": [
      {
        "id": "l5_d1",
        "zh": "无论遇到什么困难，我们都要保持冷静。",
        "py": "Wúlùn yùdào shénme kùnnan, wǒmen dōu yào bǎochí lěngjìng.",
        "vi": "Bất luận gặp khó khăn gì, chúng ta đều phải giữ bình tĩnh.",
        "hint": "无论...都... + giữ bình tĩnh (保持冷静)"
      },
      {
        "id": "l5_d2",
        "zh": "科技的发展大大改变了人们的沟通方式。",
        "py": "Kējì de fāzhǎn dàdà gǎibiàn le rénmen de gōutōng fāngshì.",
        "vi": "Sự phát triển của khoa học công nghệ đã thay đổi mạnh mẽ phương thức giao tiếp của mọi người.",
        "hint": "Phát triển công nghệ + thay đổi + cách thức giao tiếp"
      }
    ]
  },
  {
    "id": "listen_hsk5_02",
    "level": 5,
    "badge": "HSK 5 • Đề 2",
    "title": "Đề 2: Đô thị hóa, Nhịp sống nhanh & Cân bằng tâm lý",
    "subtitle": "Nghe hội thoại và bài nói về áp lực đô thị, giải tỏa căng thẳng và tối giản hóa đời sống.",
    "tips": "Trong HSK 5, người nói hay dùng phản vấn hoặc nói giảm nói tránh; hãy bám sát thái độ thực chất ở cuối lượt thoại.",
    "questions": [
      {
        "id": "l5_02_q1",
        "partLabel": "Phần 1 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Tại sao người nam lại từ chối lời mời tham gia câu lạc bộ mới?",
        "audioZh": "女：下班后参加这个读书俱乐部多充实啊，你怎么不报名？ 男：平时工作节奏已经够快了，周末我宁愿留出空白时间发呆或散步，不想把日程排得满满的。",
        "audioPy": "Nǚ: Xiàbān hòu cānjiā zhège dúshū jùlèbù duō chōngshí a, nǐ zěnme bù bàomíng? Nán: Píngshí gōngzuò jiézòu yǐjīng gòu kuài le, zhōumò wǒ nìngyuàn liúchū kòngbái shíjiān fādāi huò sànbù, bù xiǎng bǎ rìchéng pái de mǎnmǎn de.",
        "audioVi": "Nữ: Tan làm tham gia câu lạc bộ đọc sách này thật phong phú, sao anh không đăng ký? Nam: Nhịp làm việc ngày thường đã đủ nhanh rồi, cuối tuần tôi thà chừa khoảng thời gian trống để thảnh thơi hoặc đi dạo, không muốn xếp lịch dày đặc.",
        "opts": [
          "Vì phí tham gia quá cao",
          "Vì muốn giữ thời gian trống nghỉ ngơi cuối tuần",
          "Vì anh ấy không thích đọc sách",
          "Vì cuối tuần phải đi công tác xa"
        ],
        "ans": 1,
        "exp": "Anh ấy dùng '宁愿留出空白时间…不想把日程排得满满的' (muốn giữ thời gian trống thư giãn, không muốn kín lịch)."
      },
      {
        "id": "l5_02_q2",
        "partLabel": "Phần 1 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ nghĩ gì về cuộc sống ở thị trấn nhỏ?",
        "audioZh": "男：很多人向往大城市的机会，你却选择回小城市工作，不觉得遗憾吗？ 女：大城市固然资源丰富，但小城市通勤时间短、生活成本低，让我有更多精力陪伴家人和追求爱好。",
        "audioPy": "Nán: Hěn duō rén xiàngwǎng dà chéngshì de jīhuì, nǐ què xuǎnzé huí xiǎo chéngshì gōngzuò, bù juéde yíhàn ma? Nǚ: Dà chéngshì gùrán zīyuán fēngfù, dàn xiǎo chéngshì tōngqín shíjiān duǎn, shēnghuó chéngběn dī, ràng wǒ yǒu gèng duō jīnglì péibàn jiārén hé zhuīqiú àihào.",
        "audioVi": "Nam: Nhiều người hướng tới cơ hội ở đô thị lớn, còn bạn lại chọn về thành phố nhỏ làm việc, không thấy tiếc sao? Nữ: Thành phố lớn đúng là dồi dào nguồn lực, nhưng thành phố nhỏ thời gian đi lại ngắn, chi phí sống thấp, giúp mình có thêm sức lực bên gia đình và theo đuổi sở thích.",
        "opts": [
          "Rất hối hận vì ít cơ hội phát triển",
          "Hài lòng vì tiết kiệm thời gian, chi phí và có thời gian cho gia đình",
          "Đang tìm cách quay lại thành phố lớn",
          "Cho rằng thành phố nhỏ buồn tẻ"
        ],
        "ans": 1,
        "exp": "Người nữ nhấn mạnh ưu thế của thành phố nhỏ: đi lại ngắn, chi phí thấp, có thời gian cho gia đình và sở thích."
      },
      {
        "id": "l5_02_q3",
        "partLabel": "Phần 2 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Phương pháp dọn dẹp 'tối giản' mang lại thay đổi gì cho người nữ?",
        "audioZh": "男：你把客厅里那么多摆设都清理掉了，不觉得空荡荡的吗？ 女：以前房间堆满东西，每次找东西都要翻半天，心里也跟着烦躁。现在只保留真正用得上的物品，不仅打扫省事，整个人的思绪也清晰多了。",
        "audioPy": "Nán: Nǐ bǎ kètīng lǐ nàme duō bǎishè dōu qīnglǐ diào le, bù juéde kōngdàngdàng de ma? Nǚ: Yǐqián fángjiān duīmǎn dōngxi, měi cì zhǎo dōngxi dōu yào fān bàntiān, xīnlǐ yě gēn zhe fánzào. Xiànzài zhǐ bǎoliú zhēnzhèng yòng de shàng de wùpǐn, bùjǐn dǎsǎo shěngshì, zhěnggè rén de sīxù yě qīngxī duō le.",
        "audioVi": "Nam: Cậu dọn bỏ bao nhiêu đồ trang trí trong phòng khách thế, không thấy trống trải à? Nữ: Trước phòng chất đầy đồ, mỗi lần tìm gì phải lục lọi mãi, trong lòng cũng bực bội theo. Giờ chỉ giữ lại đồ thực sự dùng tới, không chỉ dọn dẹp nhàn hơn mà đầu óc cũng sáng suốt hẳn ra.",
        "opts": [
          "Phòng trở nên thiếu tiện nghi",
          "Dọn dẹp nhẹ nhàng và đầu óc sáng suốt hơn",
          "Phải mua sắm lại toàn bộ nội thất",
          "Khó tìm đồ đạc hơn trước"
        ],
        "ans": 1,
        "exp": "Kết quả tích cực được nêu rõ: '打扫省事，整个人的思绪也清晰多了' (dọn dẹp nhàn và đầu óc sáng suốt hơn)."
      },
      {
        "id": "l5_02_q4",
        "partLabel": "Phần 2 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Theo bài nói, nguyên nhân khiến nhiều người luôn cảm thấy lo âu là gì?",
        "audioZh": "现代人的焦虑往往并不来源于当下缺少什么，而是来自无休止的攀比与对未来的过度担忧。学会把注意力拉回眼前正在做的事，才能真正感受到生活的踏实。",
        "audioPy": "Xiàndàirén de jiāolǜ wǎngwǎng bìng bù láiyuán yú dāngxià quēshǎo shénme, ér shì láizì wúxiūzhǐ de pānbǐ yǔ duì wèilái de guòdù dānyōu. Xuéhuì bǎ zhùyìlì lāhuí yǎnqián zhèngzài zuò de shì, cái néng zhēnzhèng gǎnshòu dào shēnghuó de tāshi.",
        "audioVi": "Nỗi lo âu của người hiện đại thường không bắt nguồn từ việc hiện tại thiếu thốn gì, mà đến từ sự so bì không ngừng và nỗi lo thái quá về tương lai. Học cách kéo sự tập trung về việc đang làm trước mắt mới thực sự cảm nhận được sự vững tâm trong đời sống.",
        "opts": [
          "Do thiếu thốn vật chất nghiêm trọng",
          "Do so bì không ngừng và lo lắng thái quá cho tương lai",
          "Do làm việc quá ít thời gian",
          "Do không có bạn bè chia sẻ"
        ],
        "ans": 1,
        "exp": "Cấu trúc '并不来源于…而是来自…' nêu nguyên nhân: '无休止的攀比' (so bì không dứt) và '对未来的过度担忧' (lo quá mức cho tương lai)."
      },
      {
        "id": "l5_02_q5",
        "partLabel": "Phần 2 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Các đô thị hiện đại đang cải tạo không gian công cộng theo hướng nào?",
        "audioZh": "近年来，许多城市开始利用高架桥下和街角闲置的空地，改造成社区口袋公园与慢行步道，让忙碌的市民推开家门就能接触自然、舒缓身心。",
        "audioPy": "Jìnniánlái, xǔduō chéngshí kāishǐ lìyòng gāojiàqiáo xià hé jiējiǎo xiánzhì de kōngdì, gǎizào chéng shèqū kǒudài gōngyuán yǔ mànxíng bùdào, ràng mánglù de shìmín tuīkāi jiāmén jiù néng jiēchù zìrán, shūhuǎn shēnxīn.",
        "audioVi": "Những năm gần đây, nhiều thành phố bắt đầu tận dụng khoảng đất trống dưới gầm cầu vượt và góc phố để cải tạo thành công viên bỏ túi và lối đi bộ thư giãn, giúp người dân bận rộn mở cửa nhà ra là có thể gần gũi thiên nhiên, thư thái tinh thần.",
        "opts": [
          "Xây thêm nhiều trung tâm thương mại lớn",
          "Tận dụng đất trống làm công viên nhỏ và đường đi bộ",
          "Phá bỏ công viên cũ để mở rộng đường",
          "Chuyển toàn bộ khu dân cư ra ngoại ô"
        ],
        "ans": 1,
        "exp": "Bài nêu rõ tận dụng đất trống cải tạo thành '社区口袋公园与慢行步道' (công viên nhỏ cộng đồng và lối đi bộ)."
      }
    ],
    "dictations": [
      {
        "id": "l5_02_d1",
        "zh": "学会在忙碌中放慢脚步是一种智慧。",
        "py": "Xuéhuì zài mánglù zhōng fàngmàn jiǎobù shì yì zhǒng zhìhuì.",
        "vi": "Học cách bước chậm lại giữa bộn bề là một loại trí tuệ.",
        "hint": "Bước chậm lại giữa bận rộn + là một trí tuệ (智慧)"
      },
      {
        "id": "l5_02_d2",
        "zh": "良好的心态有助于缓解工作压力。",
        "py": "Liánghǎo de xīntài yǒuzhùyú huǎnjiě gōngzuò yālì.",
        "vi": "Tâm thế tích cực giúp giảm bớt áp lực công việc.",
        "hint": "Tâm thế tốt (良好心态) + có ích cho + giảm áp lực (缓解压力)"
      }
    ]
  },
  {
    "id": "listen_hsk5_03",
    "level": 5,
    "badge": "HSK 5 • Đề 3",
    "title": "Đề 3: Khoa học Đời sống & Giáo dục Sáng tạo",
    "subtitle": "Nghe các phát hiện khoa học gần gũi, phương pháp tự học và tư duy sáng tạo.",
    "tips": "Khi nghe đoạn phổ biến khoa học, hãy chú ý mối quan hệ nhân quả (导致, 从而, 表明) và ví dụ minh họa.",
    "questions": [
      {
        "id": "l5_03_q1",
        "partLabel": "Phần 1 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ đánh giá thế nào về phương pháp ghi chép của mình?",
        "audioZh": "男：我看你听课时写得密密麻麻的，几乎把老师每句话都记下来了。 女：以前我也这样，结果复习时抓不住重点。现在我只记核心观点和疑问，课后再用自己的话整理一遍，效果好多了。",
        "audioPy": "Nán: Wǒ kàn nǐ tīngkè shí xiě de mìmìmámá de, jīhū bǎ lǎoshī měi jù huà dōu jì xiàlái le. Nǚ: Yǐqián wǒ yě zhèyàng, jiéguǒ fùxí shí zhuā bu zhù zhòngdiǎn. Xiànzài wǒ zhǐ jì héxīn guāndiǎn hé yíwèn, kèhòu zài yòng zìjǐ de huà zhěnglǐ yíbiàn, xiàoguǒ hǎo duō le.",
        "audioVi": "Nam: Mình thấy cậu nghe giảng ghi chép kín đặc trang giấy, gần như chép hết từng câu thầy nói. Nữ: Trước đây mình cũng thế, kết quả lúc ôn tập chẳng nắm được trọng tâm. Giờ mình chỉ ghi quan điểm cốt lõi và thắc mắc, sau buổi học dùng lời của mình hệ thống lại một lượt, hiệu quả hơn hẳn.",
        "opts": [
          "Chép từng chữ một là hiệu quả nhất",
          "Ghi ý cốt lõi và tự diễn đạt lại giúp ôn tập tốt hơn",
          "Không cần ghi chép gì khi nghe giảng",
          "Chỉ cần chụp ảnh bảng là đủ"
        ],
        "ans": 1,
        "exp": "Cô ấy chuyển sang '只记核心观点和疑问' và '用自己的话整理一遍', thấy hiệu quả hơn hẳn."
      },
      {
        "id": "l5_03_q2",
        "partLabel": "Phần 1 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Vì sao họ lo lắng về việc trẻ em phụ thuộc vào thiết bị tìm kiếm?",
        "audioZh": "女：现在的孩子遇到不会的题，一秒钟就能从网上搜到答案，真是太方便了。 男：方便归方便，但我担心他们少了独立思考和反复琢磨的过程，遇到新问题就容易束手无策。",
        "audioPy": "Nán: Fāngbiàn guī fāngbiàn, dàn wǒ dānxīn tāmen shǎo le dúlì sīkǎo hé fǎnfù zuómo de guòchéng, yùdào xīn wèntí jiù róngyì shùshǒu-wúcè.",
        "audioVi": "Nữ: Trẻ con bây giờ gặp bài không biết làm, một giây là tra được đáp án trên mạng, tiện thật đấy. Nam: Tiện thì có tiện, nhưng tôi lo các cháu thiếu đi quá trình suy nghĩ độc lập và nghiền ngẫm, gặp bài toán mới dễ lúng túng bó tay.",
        "opts": [
          "Vì mạng hay bị ngắt kết nối",
          "Vì trẻ thiếu quá trình tự suy nghĩ và nghiền ngẫm",
          "Vì đáp án trên mạng luôn sai",
          "Vì làm hỏng mắt trẻ em"
        ],
        "ans": 1,
        "exp": "Người nam lo '少了独立思考和反复琢磨的过程' (thiếu quá trình tư duy độc lập và nghiền ngẫm)."
      },
      {
        "id": "l5_03_q3",
        "partLabel": "Phần 2 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn khoa học: Nghiên cứu về giấc ngủ trưa cho thấy điều gì?",
        "audioZh": "心理学研究发现，中午进行十五到二十分钟的短暂小睡，足以让大脑恢复敏锐度与专注力；相反，如果午睡超过一个小时，人体进入深睡眠后突然醒来，反而会感到浑身乏力、头脑昏沉。",
        "audioPy": "Xīnlǐxué yánjiū fāxiàn, zhōngwǔ jìnxíng shíwǔ dào èrshí fēnzhōng de duǎnzàn xiǎoshuì, zúyǐ ràng dànǎo huīfù mǐnruìdù yǔ zhuānzhùlì; xiāngfǎn, rúguǒ wǔshuì chāoguò yí gè xiǎoshí, réntǐ jìnrù shēn shuìmián hòu tūrán xǐnglái, fǎn'ér huì gǎndào húnshēn fálì, tóunǎo hūnchén.",
        "audioVi": "Nghiên cứu tâm lý học phát hiện chợp mắt ngắn 15 đến 20 phút vào buổi trưa đủ giúp não bộ phục hồi độ nhạy bén và sự tập trung; ngược lại, nếu ngủ trưa quá một tiếng, cơ thể rơi vào giấc ngủ sâu rồi tỉnh dậy đột ngột lại dễ thấy mệt mỏi rã rời, đầu óc nặng nề.",
        "opts": [
          "Ngủ trưa càng lâu càng tỉnh táo",
          "Ngủ trưa 15–20 phút giúp phục hồi tập trung tốt nhất",
          "Không nên ngủ trưa vào ngày làm việc",
          "Ngủ trưa hai tiếng giúp tăng trí nhớ"
        ],
        "ans": 1,
        "exp": "Bài chỉ rõ ngủ ngắn 15–20 phút ('十五到二十分钟的短暂小睡') giúp phục hồi độ nhạy bén và tập trung."
      },
      {
        "id": "l5_03_q4",
        "partLabel": "Phần 2 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn: Trong giáo dục sáng tạo, sai lầm đóng vai trò gì?",
        "audioZh": "许多创新成果并不是一次性完美诞生的，而是在无数次试错中打磨出来的。如果教育过分强调‘绝对正确’，学生就会害怕犯错，进而失去探索未知领域的热情与勇气。",
        "audioPy": "Xǔduō chuàngxīn chéngguǒ bìng bú shì yícìxìng wánměi dànshēng de, ér shì zài wúshù cì shìcuò zhōng dǎmó chūlái de. Rúguǒ jiàoyù guòfèn qiángdiào 'juéduì zhèngquè', xuésheng jiù huì hàipà fàncuò, jìn'ér shīqù tànsuǒ wèizhī lǐngyù de rèqíng yǔ yǒngqì.",
        "audioVi": "Nhiều thành quả sáng tạo không ra đời hoàn hảo ngay lần đầu, mà được mài giũa qua vô số lần thử và sai. Nếu giáo dục nhấn mạnh quá mức sự 'đúng tuyệt đối', học sinh sẽ sợ mắc lỗi, từ đó mất đi nhiệt huyết và dũng khí khám phá lĩnh vực mới.",
        "opts": [
          "Sai lầm chứng tỏ học sinh thiếu năng lực",
          "Thử và sai là quá trình tất yếu nuôi dưỡng sáng tạo",
          "Nên phạt nặng khi học sinh làm sai",
          "Sáng tạo chỉ dành cho thiên tài bẩm sinh"
        ],
        "ans": 1,
        "exp": "Tác giả khẳng định sáng tạo được mài giũa qua '无数次试错' (vô số lần thử và sai), không nên sợ sai."
      },
      {
        "id": "l5_03_q5",
        "partLabel": "Phần 2 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn tin tức: Loại vật liệu mới mà nhóm nghiên cứu phát triển có đặc điểm gì?",
        "audioZh": "我国科研团队近日研发出一种源自海藻的新型包装膜，不仅具备良好的防水性能，而且在自然土壤中只需四周即可完全降解，有望逐步替代传统塑料。",
        "audioPy": "Wǒguó kēyán tuánduì jìnrì yánfā chū yì zhǒng yuánzì hǎizǎo de xīnxíng bāozhuāngmó, bùjǐn jùbèi liánghǎo de fángshuǐ xìngnéng, érqiě zài zìrán tǔrǎng zhōng zhǐ xū sì zhōu jí kě wánquán jiàngjiě, yǒuwàng zhúbù tìdài chuántǒng sùliào.",
        "audioVi": "Nhóm nghiên cứu khoa học gần đây đã phát triển một loại màng bọc mới chiết xuất từ tảo biển, không chỉ có tính năng chống thấm tốt mà trong đất tự nhiên chỉ cần bốn tuần là phân hủy hoàn toàn, hứa hẹn từng bước thay thế nhựa truyền thống.",
        "opts": [
          "Làm từ dầu mỏ và giá rất rẻ",
          "Làm từ tảo biển, chống thấm và phân hủy sinh học nhanh",
          "Chỉ dùng được trong phòng thí nghiệm",
          "Mất mười năm mới phân hủy hết"
        ],
        "ans": 1,
        "exp": "Nêu rõ 3 đặc điểm: nguồn gốc tảo biển ('源自海藻'), chống thấm ('防水性能') và tự phân hủy trong 4 tuần ('四周即可完全降解')."
      }
    ],
    "dictations": [
      {
        "id": "l5_03_d1",
        "zh": "科学实验需要严谨的态度和持久的耐心。",
        "py": "Kēxué shíyàn xūyào yánjǐn de tàidu hé chíjiǔ de nàixīn.",
        "vi": "Thí nghiệm khoa học đòi hỏi thái độ nghiêm túc và sự kiên nhẫn bền bỉ.",
        "hint": "Thí nghiệm khoa học + thái độ nghiêm túc (严谨) + kiên nhẫn bền bỉ"
      },
      {
        "id": "l5_03_d2",
        "zh": "好奇心是推动人类不断探索的动力。",
        "py": "Hàoqíxīn shì tuīdòng rénlèi búduàn tànsuǒ de dònglì.",
        "vi": "Sự tò mò là động lực thúc đẩy con người không ngừng khám phá.",
        "hint": "Sự tò mò (好奇心) + thúc đẩy khám phá + động lực (动力)"
      }
    ]
  },
  {
    "id": "listen_hsk5_04",
    "level": 5,
    "badge": "HSK 5 • Đề 4",
    "title": "Đề 4: Di sản Văn hóa & Nghệ thuật Ẩm thực",
    "subtitle": "Nghe về bảo tồn di sản phi vật thể, nghề thủ công và tinh thần người nghệ nhân.",
    "tips": "HSK 5 thường khai thác câu chuyện nghề thủ công, văn hóa truyền thống gắn với thông điệp 'kế thừa và đổi mới'.",
    "questions": [
      {
        "id": "l5_04_q1",
        "partLabel": "Phần 1 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Vì sao xưởng gốm cổ lại thu hút được nhiều bạn trẻ?",
        "audioZh": "男：那家老陶瓷作坊以前生意挺冷清的，怎么今年突然火起来了？ 女：老手艺人的孙女回来帮忙，把传统图案和现代生活用品结合起来，设计出的茶具既古典又实用。",
        "audioPy": "Nán: Nà jiā lǎo táocí zuōfang yǐqián shēngyi tǐng lěngqīng de, zěnme jīnnián tūrán huǒ qǐlái le? Nǚ: Lǎo shǒuyìrén de sūnnǚ huílái bāngmáng, bǎ chuántǒng tú'àn hé xiàndài shēnghuó yòngpǐn jiéhé qǐlái, shèjì chū de chájù jì gǔdiǎn yòu shíyòng.",
        "audioVi": "Nam: Xưởng gốm cổ kia trước đây buôn bán vắng vẻ lắm, sao năm nay tự nhiên nổi tiếng thế? Nữ: Cháu gái của nghệ nhân cao tuổi về phụ giúp, kết hợp họa tiết truyền thống với đồ dùng sinh hoạt hiện đại, thiết kế ra bộ ấm trà vừa cổ điển vừa thiết thực.",
        "opts": [
          "Vì giảm giá xuống một nửa",
          "Vì kết hợp họa tiết truyền thống với thiết kế hiện đại thiết thực",
          "Vì mở thêm quán cà phê bên cạnh",
          "Vì dừng làm gốm thủ công"
        ],
        "ans": 1,
        "exp": "Thành công nhờ '把传统图案和现代生活用品结合起来' (kết hợp truyền thống và hiện đại)."
      },
      {
        "id": "l5_04_q2",
        "partLabel": "Phần 1 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nam cảm thấy thế nào về việc học thư pháp?",
        "audioZh": "女：看你天天练习毛笔字，手腕不酸吗？ 男：刚开始确实觉得枯燥又吃力，可写着写着就发现，每次提笔静心书写，浮躁的情绪都会慢慢沉静下来。",
        "audioPy": "Nán: Gāng kāishǐ quèshí juéde kūzào yòu chīlì, kě xiě zhe xiě zhe jiù fāxiàn, měi cì tíbǐ jìngxīn shūxiě, fúzào de qíngxù dōu huì mànmàn chénjìng xiàlái.",
        "audioVi": "Nữ: Thấy anh ngày nào cũng luyện viết bút lông, cổ tay không mỏi sao? Nam: Mới đầu đúng là thấy khô khan lại tốn sức, nhưng càng viết càng nhận ra mỗi lần cầm bút tĩnh tâm viết chữ, tâm trạng xao động đều dần lắng dịu xuống.",
        "opts": [
          "Thấy quá nhàm chán nên sắp bỏ",
          "Giúp tâm trạng xao động dần lắng dịu lại",
          "Chỉ học để đi thi lấy chứng chỉ",
          "Thấy dễ hơn viết bút bi"
        ],
        "ans": 1,
        "exp": "Nam chia sẻ thư pháp giúp '浮躁的情绪都会慢慢沉静下来' (cảm xúc xao động dần tĩnh lặng lại)."
      },
      {
        "id": "l5_04_q3",
        "partLabel": "Phần 2 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn: Trong văn hóa ẩm thực Trung Hoa, yếu tố nào được coi trọng ngang với hương vị?",
        "audioZh": "中国烹饪讲究‘色、香、味’俱全，其实除此之外，‘时令’同样至关重要。顺应四季变化挑选当季新鲜食材，既保留了食物最天然的本味，也体现了人与自然和谐共处的智慧。",
        "audioPy": "Zhōngguó pēngrèn jiǎngjiu 'sè, xiāng, wèi' jùquán, qíshí chú cǐ zhīwài, 'shílìng' tóngyàng zhìguān zhòngyào. Shùnyìng sìjì biànhuà tiāoxuǎn dāngjì xīnxiān shícái, jì bǎoliú le shíwù zuì tiānrán de běnwèi, yě tǐxiàn le rén yǔ zìrán héxié gòngchǔ de zhìhuì.",
        "audioVi": "Ẩm thực Trung Hoa chú trọng hội tụ đủ 'sắc, hương, vị', ngoài ra yếu tố 'theo mùa' cũng tối quan trọng. Thuận theo biến đổi bốn mùa chọn nguyên liệu tươi đúng vụ vừa giữ trọn vị tự nhiên nhất của món ăn, vừa thể hiện trí tuệ sống hài hòa giữa người với thiên nhiên.",
        "opts": [
          "Dùng thật nhiều gia vị đắt tiền",
          "Chọn nguyên liệu tươi thuận theo mùa vụ",
          "Nấu mọi món ăn trong thời gian dài",
          "Trang trí bàn ăn thật cầu kỳ"
        ],
        "ans": 1,
        "exp": "Bài nhấn mạnh '时令' (theo mùa) và '顺应四季变化挑选当季新鲜食材' (chọn nguyên liệu tươi đúng mùa)."
      },
      {
        "id": "l5_04_q4",
        "partLabel": "Phần 2 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn: Nghệ nhân chạm khắc gỗ giữ bí quyết gì để tác phẩm có hồn?",
        "audioZh": "一位有着四十年经验的木雕老艺人说，机器雕刻虽然精准高效，却千篇一律；真正打动人心的木雕，必须顺着每块木头独有的纹理去构思，把匠人的心血与情感融入每一刀之中。",
        "audioPy": "Yí wèi yǒu zhe sìshí nián jīngyàn de mùdiāo lǎo yìrén shuō, jīqì diāokè suīrán jīngzhǔn gāoxiào, què qiānpiān-yílǜ; zhēnzhèng dǎdòng rénxīn de mùdiāo, bìxū shùn zhe měi kuài mùtou dúyǒu de wénlǐ qù gòusī, bǎ jiàngrén de xīnxuè yǔ qínggǎn róngrù měi yì dāo zhī zhōng.",
        "audioVi": "Một nghệ nhân điêu khắc gỗ 40 năm kinh nghiệm chia sẻ, máy móc chạm khắc tuy chuẩn xác hiệu suất cao nhưng trăm cái như một; tác phẩm thực sự lay động lòng người phải nương theo vân gỗ riêng biệt để lên ý tưởng, gửi gắm tâm huyết và tình cảm người thợ vào từng nhát đục.",
        "opts": [
          "Dùng máy móc tự động hoàn toàn",
          "Sáng tạo theo vân gỗ tự nhiên và đặt tâm huyết vào từng nhát đục",
          "Chỉ dùng một loại gỗ quý duy nhất",
          "Làm thật nhanh để tăng sản lượng"
        ],
        "ans": 1,
        "exp": "Điêu khắc thủ công giá trị ở chỗ nương theo vân gỗ ('顺着…独有的纹理去构思') và gửi gắm tâm huyết ('心血与情感')."
      },
      {
        "id": "l5_04_q5",
        "partLabel": "Phần 2 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn tin tức: Việc đưa nghệ thuật dân gian vào trường học nhằm mục đích gì?",
        "audioZh": "为了让非物质文化遗产后继有人，当地中小学今年开设了剪纸、皮影戏等兴趣课堂，请民间艺人走进校园手把手教学，让孩子们在动手实践中爱上传统文化。",
        "audioPy": "Wèile ràng fēi wùzhì wénhuà yíchǎn hòujì-yǒurén, dāngdì zhōngxiǎoxué jīnniān kāishè le jiǎnzhǐ, píyǐngxì děng xìngqù kètáng, qǐng mínjiān yìrén zǒujìn xiàoyuán shǒubǎshǒu jiàoxué, ràng háizimen zài dòngshǒu shíjiàn zhōng àishàng chuántǒng wénhuà.",
        "audioVi": "Nhằm giúp di sản văn hóa phi vật thể có thế hệ kế thừa, các trường phổ thông địa phương năm nay mở lớp năng khiếu cắt giấy, múa rối bóng, mời nghệ nhân dân gian vào trường cầm tay chỉ việc để học sinh thêm yêu văn hóa truyền thống qua thực hành.",
        "opts": [
          "Giúp học sinh kiếm tiền sớm",
          "Đào tạo thế hệ kế thừa và nuôi dưỡng tình yêu văn hóa truyền thống",
          "Thay thế các môn khoa học tự nhiên",
          "Tổ chức lễ hội thương mại cuối năm"
        ],
        "ans": 1,
        "exp": "Mục tiêu nêu ngay đầu câu: '让非物质文化遗产后继有人' (có người kế thừa) và giúp học sinh '爱上传统文化'."
      }
    ],
    "dictations": [
      {
        "id": "l5_04_d1",
        "zh": "保护文化遗产是每一代人的责任。",
        "py": "Bǎohù wénhuà yíchǎn shì měi yí dài rén de zérèn.",
        "vi": "Bảo vệ di sản văn hóa là trách nhiệm của mỗi thế hệ.",
        "hint": "Bảo vệ di sản văn hóa + là trách nhiệm (责任) của mỗi thế hệ"
      },
      {
        "id": "l5_04_d2",
        "zh": "传统手艺需要传承，也需要创新。",
        "py": "Chuántǒng shǒuyì xūyào chuánchéng, yě xūyào chuàngxīn.",
        "vi": "Nghề thủ công truyền thống cần được kế thừa và cũng cần đổi mới.",
        "hint": "Nghề thủ công truyền thống + cần kế thừa (传承) + cần đổi mới (创新)"
      }
    ]
  },
  {
    "id": "listen_hsk5_05",
    "level": 5,
    "badge": "HSK 5 • Đề 5",
    "title": "Đề 5: Khởi nghiệp, Quản trị & Kinh tế Chia sẻ",
    "subtitle": "Nghe về bài học khởi nghiệp, lắng nghe phản hồi khách hàng và quản lý rủi ro.",
    "tips": "Chú ý từ vựng thương mại và quản trị như 市场调研 (khảo sát thị trường), 客户反馈 (phản hồi khách hàng), 盲目跟风 (chạy theo phong trào mù quáng).",
    "questions": [
      {
        "id": "l5_05_q1",
        "partLabel": "Phần 1 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Nguyên nhân chính khiến quán cà phê đối diện đóng cửa là gì?",
        "audioZh": "女：对面那家装修得那么漂亮的店怎么半年就关门了？ 男：老板太盲目跟风了，开店前根本没做市场调研，定位也不清，光靠装修吸引不了回头客。",
        "audioPy": "Nǚ: Duìmiàn nà jiā zhuāngxiū de nàme piàoliang de diàn zěnme bànnián jiù guānmén le? Nán: Lǎobǎn tài mángmù gēnfēng le, kāidiàn qián gēnběn méi zuò shìchǎng diàoyán, dìngwèi yě bù qīng, guāng kào zhuāngxiū xīyǐn bù liǎo huítóukè.",
        "audioVi": "Nữ: Quán đối diện trang trí đẹp thế mà sao nửa năm đã đóng cửa rồi? Nam: Ông chủ chạy theo phong trào mù quáng quá, trước khi mở chẳng khảo sát thị trường, định vị cũng mơ hồ, chỉ dựa vào trang trí thì không giữ được khách quay lại.",
        "opts": [
          "Vì tiền thuê mặt bằng tăng gấp đôi",
          "Vì chạy theo phong trào, thiếu khảo sát và định vị mờ nhạt",
          "Vì nhân viên phục vụ nghỉ việc hàng loạt",
          "Vì đồ uống bán giá quá rẻ"
        ],
        "ans": 1,
        "exp": "Nam phân tích rõ: '盲目跟风', '没做市场调研', '定位不清' (chạy theo phong trào, không khảo sát, định vị không rõ)."
      },
      {
        "id": "l5_05_q2",
        "partLabel": "Phần 1 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ khuyên đồng nghiệp xử lý phàn nàn của khách thế nào?",
        "audioZh": "男：这位客户的意见实在太挑剔了，真让人头疼。 女：先别急着反驳，换个角度想想，正是这些挑剔的反馈能帮我们发现产品平时忽略的漏洞。",
        "audioPy": "Nán: Zhè wèi kèhù de yìjiàn shízài tài tiāotì le, zhēn ràng rén tóuténg. Nǚ: Xiān bié jí zhe fǎnbó, huàn gè jiǎodù xiǎngxiang, zhèng shì zhèxiē tiāotì de fǎnkuì néng bāng wǒmen fāxiàn chǎnpǐn píngshí hūlüè de lòudòng.",
        "audioVi": "Nam: Ý kiến của vị khách này thật sự quá khắt khe, đau đầu thật đấy. Nữ: Đừng vội phản bác đã, đổi góc nhìn mà nghĩ, chính những góp ý khó tính ấy mới giúp mình phát hiện thiếu sót thường ngày bị bỏ qua ở sản phẩm.",
        "opts": [
          "Phớt lờ không trả lời khách nữa",
          "Tranh luận đến cùng để bảo vệ quan điểm",
          "Đón nhận để tìm ra thiếu sót cần cải thiện",
          "Hoàn tiền ngay để kết thúc hợp đồng"
        ],
        "ans": 2,
        "exp": "Người nữ khuyên nhìn nhận tích cực vì góp ý khắt khe giúp phát hiện '忽略的漏洞' (lỗ hổng bị bỏ sót)."
      },
      {
        "id": "l5_05_q3",
        "partLabel": "Phần 2 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Hai người rút ra kết luận gì về việc tìm bạn đồng hành khởi nghiệp?",
        "audioZh": "男：我想找关系最好的哥们儿一起合伙创业，这样沟通起来最省心。 女：感情好当然是基础，但更关键的是你们的能力能不能互补、理念是否一致。只靠交情，遇到利益分歧时反而容易连朋友都做不成。 男：嗯，确实得把责任和规则提前谈清楚。",
        "audioPy": "Nán: Wǒ xiǎng zhǎo guānxi zuì hǎo de gēmenr yìqǐ héhuǒ chuàngyè, zhèyàng gōutōng qǐlái zuì shěngxīn. Nǚ: Gǎnqíng hǎo dāngrán shì jīchǔ, dàn gèng guānjiàn de shì nǐmen de nénglì néng bu néng hùbǔ, lǐniàn shìfǒu yízhì. Zhǐ kào jiāoqing, yùdào lìyì fēnqí shí fǎn'ér róngyì lián péngyou dōu zuò bu chéng. Nán: Ńg, quèshí děi bǎ zérèn hé guīzé tíqián tán qīngchu.",
        "audioVi": "Nam: Tớ định rủ cậu bạn thân nhất cùng góp vốn khởi nghiệp, như thế trao đổi đỡ mệt đầu nhất. Nữ: Tình cảm tốt tất nhiên là nền tảng, nhưng then chốt hơn là năng lực hai người có bổ trợ cho nhau không và quan điểm có đồng nhất không. Chỉ dựa vào tình cảm, lúc nảy sinh bất đồng lợi ích dễ mất luôn cả tình bạn. Nam: Ừ, đúng là phải bàn rõ trách nhiệm và quy tắc từ đầu.",
        "opts": [
          "Chỉ cần rủ bạn thân nhất là chắc chắn thành công",
          "Cần năng lực bổ trợ, chung định hướng và rõ ràng quy tắc",
          "Tuyệt đối không bao giờ hợp tác với người quen",
          "Không cần chia trách nhiệm khi mới bắt đầu"
        ],
        "ans": 1,
        "exp": "Hai người thống nhất cần năng lực bổ trợ ('能力互补'), chung lý tưởng và làm rõ trách nhiệm quy tắc từ đầu."
      },
      {
        "id": "l5_05_q4",
        "partLabel": "Phần 2 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Điều gì giúp nền kinh tế chia sẻ phát triển lành mạnh lâu dài?",
        "audioZh": "从共享充电宝到共享汽车，共享经济确实提高了闲置资源的利用率。然而，如果没有完善的信用制度与严格的维护管理，便利很快就会变成城市管理的负担。",
        "audioPy": "Cóng gòngxiǎng chōngdiànbǎo dào gòngxiǎng qìchē, gòngxiǎng jīngjì quèshí tígāo le xiánzhì zīyuán de lìyònglǜ. Rán'ér, rúguǒ méiyǒu wánshàn de xìnyòng zhìdù yǔ yángé de wéihù guǎnlǐ, biànlì hěn kuài jiù huì biànchéng chéngshì guǎnlǐ de fùdān.",
        "audioVi": "Từ sạc dự phòng chia sẻ đến ô tô chia sẻ, kinh tế chia sẻ thực sự nâng cao hiệu suất sử dụng nguồn lực nhàn rỗi. Tuy nhiên, nếu thiếu cơ chế tín nhiệm hoàn thiện và quản lý bảo trì nghiêm ngặt, sự tiện lợi sẽ nhanh chóng biến thành gánh nặng cho quản lý đô thị.",
        "opts": [
          "Giảm giá dịch vụ xuống mức thấp nhất",
          "Có hệ thống tín nhiệm hoàn thiện và quản lý bảo trì chặt chẽ",
          "Mở rộng quy mô thật nhanh ra mọi thành phố",
          "Chỉ phục vụ khách du lịch nước ngoài"
        ],
        "ans": 1,
        "exp": "Sau '然而', bài chỉ rõ điều kiện tiên quyết là '完善的信用制度与严格的维护管理' (hệ thống tín nhiệm và quản lý bảo trì)."
      },
      {
        "id": "l5_05_q5",
        "partLabel": "Phần 2 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Một nhà quản lý giỏi nên đối xử với nhân viên thế nào?",
        "audioZh": "优秀的管理者不是事事亲力亲为的‘救火队员’，而是懂得放手信任下属、明确目标并为团队扫清障碍的引路人。",
        "audioPy": "Yōuxiù de guǎnlǐzhě bú shì shìshì qīnlì-qīnwéi de 'jiùhuǒ duìyuán', ér shì dǒngde fàngshǒu xìnrèn xiàshǔ, míngquè mùbiāo bìng wèi tuánduì sǎoqīng zhàng'ài de yǐnlùrén.",
        "audioVi": "Người quản lý xuất sắc không phải là 'lính cứu hỏa' việc gì cũng tự tay làm, mà là người dẫn đường biết buông tay tin tưởng cấp dưới, xác định rõ mục tiêu và dọn sạch trở ngại cho cả đội.",
        "opts": [
          "Tự tay làm thay mọi công việc của nhân viên",
          "Tin tưởng giao quyền, định hướng mục tiêu và tháo gỡ vướng mắc",
          "Kiểm soát chặt từng phút làm việc",
          "Chỉ tuyển người có cùng tính cách với mình"
        ],
        "ans": 1,
        "exp": "Cụm từ khóa: '放手信任下属' (tin tưởng giao quyền), '明确目标' (làm rõ mục tiêu), '扫清障碍' (dọn sạch trở ngại)."
      }
    ],
    "dictations": [
      {
        "id": "l5_05_d1",
        "zh": "创业不仅需要热情，更需要周密的计划。",
        "py": "Chuàngyè bùjǐn xūyào rèqíng, gèng xūyào zhōumì de jìhuà.",
        "vi": "Khởi nghiệp không chỉ cần nhiệt huyết mà còn cần kế hoạch chu đáo.",
        "hint": "Khởi nghiệp (创业) + nhiệt huyết + kế hoạch chu đáo (周密)"
      },
      {
        "id": "l5_05_d2",
        "zh": "倾听客户的真实需求才能赢得市场。",
        "py": "Qīngtīng kèhù de zhēnshí xūqiú cái néng yíngdé shìchǎng.",
        "vi": "Lắng nghe nhu cầu thực sự của khách hàng mới có thể chinh phục thị trường.",
        "hint": "Lắng nghe (倾听) + nhu cầu thực + giành được thị trường"
      }
    ]
  },
  {
    "id": "listen_hsk5_06",
    "level": 5,
    "badge": "HSK 5 • Đề 6",
    "title": "Đề 6: Mối quan hệ Xã hội & Nghệ thuật Lắng nghe",
    "subtitle": "Nghe về kỹ năng giao tiếp, đồng cảm, giải quyết hiểu lầm và giữ ranh giới lành mạnh.",
    "tips": "Với các câu hỏi tâm lý – ứng xử, đáp án đúng thường phản ánh sự tôn trọng, thấu hiểu và giao tiếp chân thành.",
    "questions": [
      {
        "id": "l5_06_q1",
        "partLabel": "Phần 1 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ khuyên bạn làm gì khi người khác đang buồn bã?",
        "audioZh": "男：朋友遇到挫折时，我总是急着帮他出主意，可他好像并不领情。 女：人在难过的时候，最需要的往往不是道理或方案，而是有人安静地倾听，让他觉得自己被理解了。",
        "audioPy": "Nán: Péngyou yùdào cuòzhé shí, wǒ zǒngshì jí zhe bāng tā chū zhǔyi, kě tā hǎoxiàng bìng bù lǐngqíng. Nǚ: Rén zài nánguò de shíhou, zuì xūyào de wǎngwǎng bú shì dàolǐ huò fāng'àn, ér shì yǒurén ānjìng de qīngtīng, ràng tā juéde zìjǐ bèi lǐjiě le.",
        "audioVi": "Nam: Lúc bạn bè gặp trắc trở, mình luôn vội vã hiến kế giúp cậu ấy, nhưng có vẻ cậu ấy chẳng mấy cảm kích. Nữ: Khi người ta đang buồn, điều cần nhất thường không phải lý lẽ hay giải pháp, mà là có ai đó lặng lẽ lắng nghe để họ thấy mình được thấu hiểu.",
        "opts": [
          "Phân tích đúng sai thật chi tiết",
          "Lặng lẽ lắng nghe để họ cảm thấy được thấu hiểu",
          "Chuyển sang nói chuyện vui để họ quên đi",
          "Để họ tự suy nghĩ một mình vài tuần"
        ],
        "ans": 1,
        "exp": "Người nữ nhấn mạnh '安静地倾听，让他觉得自己被理解了' (lặng lẽ lắng nghe để họ thấy được thấu hiểu)."
      },
      {
        "id": "l5_06_q2",
        "partLabel": "Phần 1 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Tại sao hai đồng nghiệp trước đây hiểu lầm nhau?",
        "audioZh": "女：你们俩前阵子不是还冷战吗，怎么今天聊得这么开心？ 男：其实根本没什么大矛盾，就是当时双方都在微信上用文字沟通，语气被误会了。当面把话说开后，误会一下子就消除了。",
        "audioPy": "Nǚ: Nǐmen liǎ qiánzhènzi bú shì hái lěngzhàn ma, zěnme jīntiān liáo de zhème kāixīn? Nán: Qíshí gēnběn méi shénme dà máodùn, jiùshì dāngshí shuāngfāng dōu zài Wēixìn shàng yòng wénzì gōutōng, yǔqì bèi wùhuì le. Dāngmiàn bǎ huà shuōkāi hòu, wùhuì yíxiàzi jiù xiāochú le.",
        "audioVi": "Nữ: Hai cậu dạo trước chẳng phải vẫn chiến tranh lạnh sao, nay nói chuyện vui vẻ thế? Nam: Thực ra chẳng có mâu thuẫn gì lớn, chỉ tại lúc đó hai bên nhắn tin bằng chữ trên ứng dụng nên hiểu nhầm ngữ khí của nhau. Gặp mặt nói thẳng ra là hiểu lầm tan biến ngay.",
        "opts": [
          "Vì tranh chấp quyền lợi trong dự án",
          "Vì nhắn tin bằng chữ khiến ngữ khí bị hiểu lầm",
          "Vì có người thứ ba nói xấu sau lưng",
          "Vì bất đồng giờ giấc làm việc"
        ],
        "ans": 1,
        "exp": "Nguyên nhân do '用文字沟通，语气被误会了' (giao tiếp bằng tin nhắn chữ dẫn đến hiểu lầm ngữ khí)."
      },
      {
        "id": "l5_06_q3",
        "partLabel": "Phần 2 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Vì sao nhiều người ngại nói lời từ chối với người khác?",
        "audioZh": "生活中，许多人明明自己分身乏术，却还是勉强答应别人的请求，生怕拒绝会伤害彼此的感情。其实，委婉而坚定地说明自己的难处，远比勉强答应却做不好更值得尊重。",
        "audioPy": "Shēnghuó zhōng, xǔduō rén míngmíng zìjǐ fēnshēn-fáshù, què háishi miǎnqiǎng dāying biérén de qǐngqiú, shēngpà jùjué huì shānghài bǐcǐ de gǎnqíng. Qíshí, wěiwǎn ér jiāndìng de shuōmíng zìjǐ de nánchù, yuǎn bǐ miǎnqiǎng dāying què zuò bù hǎo gèng zhídé zūnzhòng.",
        "audioVi": "Trong cuộc sống, nhiều người rõ ràng đang bận rộn không xoay xở kịp nhưng vẫn gượng gạo nhận lời giúp người khác, sợ từ chối sẽ làm tổn thương tình cảm. Thực ra, khéo léo nhưng kiên quyết trình bày khó khăn của bản thân đáng trân trọng hơn nhiều so với miễn cưỡng nhận lời rồi làm không tốt.",
        "opts": [
          "Vì muốn khoe năng lực của bản thân",
          "Vì sợ từ chối sẽ làm tổn thương tình cảm",
          "Vì thích làm việc hộ người khác",
          "Vì không biết cách nói chuyện"
        ],
        "ans": 1,
        "exp": "Bài nêu rõ tâm lý ngại từ chối là do '生怕拒绝会伤害彼此的感情' (sợ từ chối làm tổn thương tình cảm)."
      },
      {
        "id": "l5_06_q4",
        "partLabel": "Phần 2 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Theo tác giả, cách tốt nhất để duy trì mối quan hệ lâu dài là gì?",
        "audioZh": "无论是亲人还是朋友，再亲密的关系也需要适当的边界感。尊重对方的独立空间，不把自己的标准强加于人，感情才能保持长久的舒适与温度。",
        "audioPy": "Wúlùn shì qīnrén háishi péngyou, zài qīnmì de guānxi yě xūyào shìdàng de biānjiègǎn. Zūnzhòng duìfāng de dúlì kōngjiān, bù bǎ zìjǐ de biāozhǔn qiángjiā yú rén, gǎnqíng cái néng bǎochí chángjiǔ de shūshì yǔ wēndù.",
        "audioVi": "Bất kể người thân hay bạn bè, mối quan hệ thân thiết đến đâu cũng cần có ý thức ranh giới thích hợp. Tôn trọng không gian riêng của đối phương, không áp đặt tiêu chuẩn của mình lên người khác thì tình cảm mới duy trì được sự thoải mái và ấm áp lâu dài.",
        "opts": [
          "Chia sẻ mọi bí mật cá nhân cho nhau",
          "Giữ ranh giới thích hợp và tôn trọng không gian riêng",
          "Luôn làm theo mọi yêu cầu của đối phương",
          "Giữ khoảng cách hoàn toàn để tránh va chạm"
        ],
        "ans": 1,
        "exp": "Cụm từ khóa: '适当的边界感' (ý thức ranh giới hợp lý) và '尊重对方的独立空间' (tôn trọng không gian riêng)."
      },
      {
        "id": "l5_06_q5",
        "partLabel": "Phần 2 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Điều gì tạo nên sức mạnh lan tỏa của lời khen chân thành?",
        "audioZh": "真正打动人的赞美，不是空洞的客套话，而是具体地指出对方付出的细节。一句真诚的肯定，往往能成为他人坚持下去的动力。",
        "audioPy": "Zhēnzhèng dǎdòng rén de zànměi, bú shì kōngdòng de kètàohuà, ér shì jùtǐ de zhǐchū duìfāng fùchū de xìjié. Yí jù zhēnchéng de kěndìng, wǎngwǎng néng chéngwéi tārén jiānchí xiàqù de dònglì.",
        "audioVi": "Lời khen thực sự lay động lòng người không phải những câu xã giao sáo rỗng, mà là chỉ ra cụ thể chi tiết nỗ lực của đối phương. Một câu ghi nhận chân thành thường có thể trở thành động lực để người khác tiếp tục cố gắng.",
        "opts": [
          "Dùng nhiều từ ngữ hoa mỹ nhất có thể",
          "Chỉ ra cụ thể chi tiết nỗ lực của đối phương",
          "Khen ngợi trước đám đông thật lớn",
          "So sánh họ với những người giỏi hơn"
        ],
        "ans": 1,
        "exp": "Bài giải thích lời khen chạm tới trái tim là '具体地指出对方付出的细节' (chỉ ra cụ thể chi tiết công sức đối phương bỏ ra)."
      }
    ],
    "dictations": [
      {
        "id": "l5_06_d1",
        "zh": "真诚的倾听比急于建议更有力量。",
        "py": "Zhēnchéng de qīngtīng bǐ jíyú jiànyì gèng yǒu lìliàng.",
        "vi": "Sự lắng nghe chân thành có sức mạnh hơn việc vội vàng góp ý.",
        "hint": "Lắng nghe chân thành + hơn vội góp ý + có sức mạnh hơn"
      },
      {
        "id": "l5_06_d2",
        "zh": "面对面的交流能消除许多误会。",
        "py": "Miànduìmiàn de jiāoliú néng xiāochú xǔduō wùhuì.",
        "vi": "Giao tiếp trực diện có thể hóa giải rất nhiều hiểu lầm.",
        "hint": "Giao tiếp mặt đối mặt + xóa bỏ (消除) + hiểu lầm (误会)"
      }
    ]
  },
  {
    "id": "listen_hsk6",
    "level": 6,
    "badge": "HSK 6 • Cao cấp 2",
    "title": "Bài 6: Kinh tế, Khoa học & Triết lý Nhân sinh",
    "subtitle": "Nghe bài bình luận học thuật và phỏng vấn chuyên sâu tốc độ chuẩn bản xứ.",
    "tips": "HSK 6 đòi hỏi khả năng tổng hợp thông tin đa đoạn, nhận diện hàm ý phản biện và thuật ngữ học thuật chính xác.",
    "questions": [
      {
        "id": "l6_q1",
        "partLabel": "Phần 2 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe trích đoạn phỏng vấn: Chuyên gia cảnh báo điều gì về Trí tuệ nhân tạo (AI)?",
        "audioZh": "人工智能无疑极大地提升了信息处理的效率，然而如果我们过度依赖算法推荐，反而可能陷入‘信息茧房’，逐渐丧失独立思考和辨别真伪的能力。",
        "audioPy": "Réngōng zhìnéng wúyí jídà de tíshēng le xìnxī chǔlǐ de xiàolǜ, rán'ér rúguǒ wǒmen guòdù yīlài suànfǎ tuījiàn, fǎn'ér kěnéng xiànrù 'xìnxī jiǎnfáng', zhújiàn sàngshī dúlì sīkǎo hé biànbié zhēnwěi de nénglì.",
        "audioVi": "AI chắc chắn nâng cao vượt bậc hiệu suất xử lý thông tin, tuy nhiên nếu phụ thuộc quá mức vào thuật toán gợi ý, chúng ta dễ rơi vào 'kén thông tin', dần đánh mất khả năng tư duy độc lập và phân biệt thật giả.",
        "opts": [
          "AI sẽ làm máy tính chạy chậm hơn",
          "Lệ thuộc thuật toán có thể làm suy giảm tư duy độc lập",
          "AI không có khả năng xử lý văn bản",
          "Con người nên ngừng sử dụng internet hoàn toàn"
        ],
        "ans": 1,
        "exp": "Sau từ chuyển ý '然而', chuyên gia cảnh báo nguy cơ rơi vào '信息茧房' và '丧失独立思考和辨别真伪的能力'."
      },
      {
        "id": "l6_q2",
        "partLabel": "Phần 3 • Bài nói & Bình luận",
        "type": "mcq",
        "prompt": "Nghe bài giảng ngắn: Tác giả ví von việc đọc sách kinh điển với điều gì?",
        "audioZh": "读快餐式文章就像喝碳酸饮料，一时痛快却毫无营养；而研读经典著作则如同细品陈年好茶，初尝或许平淡甚至微苦，回味却绵长深远，能滋养人的精神世界。",
        "audioPy": "Dú kuàicānshì wénzhāng jiù xiàng hē tànsuān yǐnliào, yìshí tòngkuài què háo wú yíngyǎng; ér yándú jīngdiǎn zhùzuò zé rútóng xìpǐn chénnián hǎochá, chūcháng huòxǔ píngdàn shènzhì wēikǔ, huíwèi què miáncháng shēnyuǎn, néng zīyǎng rén de jīngshén shìjiè.",
        "audioVi": "Đọc bài viết kiểu thức ăn nhanh giống uống nước ngọt có ga, sảng khoái nhất thời nhưng vô bổ; còn nghiền ngẫm tác phẩm kinh điển như nhâm nhi trà ngon lâu năm, mới nếm có thể nhạt thậm chí hơi đắng, nhưng dư vị sâu dài, nuôi dưỡng tinh thần.",
        "opts": [
          "Uống nước ngọt có ga",
          "Nhâm nhi trà ngon lâu năm",
          "Ăn một bữa tiệc lớn",
          "Nghe một bản nhạc sôi động"
        ],
        "ans": 1,
        "exp": "Đọc tác phẩm kinh điển được so sánh trực tiếp: '如同细品陈年好茶' (như thưởng thức trà ngon lâu năm)."
      },
      {
        "id": "l6_q3",
        "partLabel": "Phần 1 • Nghe đoạn chọn ý đúng",
        "type": "mcq",
        "prompt": "Nghe nhận định kinh tế: Yếu tố nào giúp doanh nghiệp nhỏ vượt qua khủng hoảng?",
        "audioZh": "在市场剧烈波动的时期，盲目追求规模扩张往往隐藏着巨大隐患；相反，那些聚焦核心业务、保持充足现金流并敏锐调整策略的中小企业，反而更具抗风险能力。",
        "audioPy": "Zài shìchǎng jùliè bōdòng de shíqī, mángmù zhuīqiú guīmó kuòzhāng wǎngwǎng yǐncáng zhe jùdà yǐnhuàn; xiāngfǎn, nàxiē jùjiāo héxīn yèwù, bǎochí chōngzú xiànjīnliú bìng mǐnruì tiáozhěng cèlüè de zhōngxiǎo qǐyè, fǎn'ér gèng jù kàng fēngxiǎn nénglì.",
        "audioVi": "Trong giai đoạn thị trường biến động mạnh, mù quáng mở rộng quy mô thường ẩn chứa rủi ro lớn; ngược lại, các doanh nghiệp vừa và nhỏ tập trung mảng cốt lõi, giữ dòng tiền dồi dào và điều chỉnh chiến lược nhạy bén lại có sức chống chịu rủi ro cao hơn.",
        "opts": [
          "Mở rộng quy mô thật nhanh bằng mọi giá",
          "Tập trung cốt lõi, giữ dòng tiền và linh hoạt chiến lược",
          "Ngừng toàn bộ hoạt động kinh doanh",
          "Vay nợ dài hạn để đầu tư bất động sản"
        ],
        "ans": 1,
        "exp": "Nêu rõ 3 trụ cột: '聚焦核心业务' (tập trung cốt lõi), '保持充足现金流' (giữ dòng tiền), '敏锐调整策略' (điều chỉnh chiến lược nhạy bén)."
      },
      {
        "id": "l6_q4",
        "partLabel": "Phần 2 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe hội thoại học thuật: Tại sao nghiên cứu lịch sử vẫn có giá trị trong thời đại số?",
        "audioZh": "男：有人认为数字化时代只需要关注前沿技术，历史研究已经过时了。 女：我不敢苟同。历史并非僵化的故纸堆，它揭示了人性与社会演变的规律，能为当下的决策提供宝贵的坐标系。",
        "audioPy": "Nán: Yǒurén rènwéi shùzìhuà shídài zhǐ xūyào guānzhù qiányán jìshù, lìshǐ yánjiū yǐjīng guòshí le. Nǚ: Wǒ bù gǎn gǒutóng. Lìshǐ bìngfēi jiānghuà de gùzhǐduī, tā jiēshì le rénxìng yǔ shèhuì yǎnbiàn de guīlǜ, néng wèi dāngxià de juécè tígōng bǎoguì de zuòbiāoxì.",
        "audioVi": "Nam: Có người cho rằng thời đại số chỉ cần quan tâm công nghệ tiên phong, nghiên cứu lịch sử đã lỗi thời rồi. Nữ: Tôi không đồng tình. Lịch sử không phải đống giấy cũ cứng nhắc, nó hé lộ quy luật nhân tính và biến đổi xã hội, cung cấp hệ quy chiếu quý giá cho quyết định hiện tại.",
        "opts": [
          "Vì lịch sử giúp kiếm tiền nhanh hơn công nghệ",
          "Vì lịch sử hé lộ quy luật xã hội và làm hệ quy chiếu cho hiện tại",
          "Vì công nghệ số không lưu trữ được dữ liệu",
          "Vì mọi quyết định hiện đại đều lặp lại y hệt quá khứ"
        ],
        "ans": 1,
        "exp": "Nữ phản bác ('我不敢苟同') và giải thích lịch sử hé lộ quy luật ('揭示了…规律') và làm hệ quy chiếu ('提供宝贵的坐标系')."
      },
      {
        "id": "l6_q5",
        "partLabel": "Phần 3 • Bài nói & Bình luận",
        "type": "mcq",
        "prompt": "Nghe đoạn văn: Ý nghĩa cốt lõi của câu '留白' (để khoảng trống) trong nghệ thuật lẫn cuộc sống là gì?",
        "audioZh": "中国传统山水画讲究‘留白’，即不在画面上填满笔墨，而是给观者留下想象的空间。其实生活也是如此，适当放慢脚步、保留内心的余地，才能体会到真正的从容与丰盈。",
        "audioPy": "Zhōngguó chuántǒng shānshuǐhuà jiǎngjiu 'liúbái', jí bú zài huàmiàn shàng tiánmǎn bǐmò, ér shì gěi guānzhě liúxià xiǎngxiàng de kōngjiān. Qíshí shēnghuó yě shì rúcǐ, shìdàng fàngmàn jiǎobù, bǎoliú nèixīn de yúdì, cái néng tǐhuì dào zhēnzhèng de cóngróng yǔ fēngyíng.",
        "audioVi": "Tranh thủy mặc truyền thống Trung Hoa chú trọng 'lưu bạch' (khoảng trắng), tức không tô kín mực mà chừa không gian tưởng tượng cho người xem. Cuộc sống cũng vậy, biết chậm lại vừa phải, giữ khoảng lặng trong tâm hồn mới cảm nhận được sự ung dung và viên mãn thực sự.",
        "opts": [
          "Tiết kiệm mực vẽ khi sáng tác tranh",
          "Chừa khoảng trống giúp có không gian tưởng tượng và sự ung dung",
          "Không nên đặt mục tiêu trong cuộc sống",
          "Tránh giao tiếp với mọi người xung quanh"
        ],
        "ans": 1,
        "exp": "Bài nhấn mạnh giá trị của khoảng trống: không gian tưởng tượng ('想象的空间') và sự ung dung viên mãn trong tâm ('从容与丰盈')."
      }
    ],
    "dictations": [
      {
        "id": "l6_d1",
        "zh": "真正的智慧往往来源于对生活的深刻观察。",
        "py": "Zhēnzhèng de zhìhuì wǎngwǎng láiyuán yú duì shēnghuó de shēnkè guānchá.",
        "vi": "Trí tuệ thực sự thường bắt nguồn từ sự quan sát sâu sắc đối với cuộc sống.",
        "hint": "Trí tuệ thực sự + bắt nguồn từ (来源于) + quan sát sâu sắc"
      },
      {
        "id": "l6_d2",
        "zh": "只有在实践中不断反思，才能实现真正的突破。",
        "py": "Zhǐyǒu zài shíjiàn zhōng búduàn fǎnsī, cái néng shíxiàn zhēnzhèng de tūpò.",
        "vi": "Chỉ có không ngừng suy ngẫm trong thực tiễn mới có thể đạt được bước đột phá thực sự.",
        "hint": "Chỉ có... mới... (只有...才...) + suy ngẫm (反思) + đột phá (突破)"
      }
    ]
  },
  {
    "id": "listen_hsk6_02",
    "level": 6,
    "badge": "HSK 6 • Đề 2",
    "title": "Đề 2: Chuyển đổi Số, Dữ liệu & Đạo đức Công nghệ",
    "subtitle": "Nghe phân tích chuyên sâu về quyền riêng tư dữ liệu, tự động hóa và trách nhiệm thuật toán.",
    "tips": "Phần 1 HSK 6 yêu cầu chọn câu tóm tắt trung thực nhất với đoạn nghe; hãy loại ngay đáp án nói quá (tất cả, tuyệt đối) hoặc sai lệch quan hệ nhân quả.",
    "questions": [
      {
        "id": "l6_02_q1",
        "partLabel": "Phần 1 • Nghe đoạn chọn ý đúng",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và chọn nhận định khớp chính xác nhất với nội dung:",
        "audioZh": "大数据技术的普及使个性化服务愈发精准，但便利的背后也潜藏着个人隐私泄露的风险。如何在挖掘数据价值与筑牢安全边界之间取得平衡，已成为当前数字治理的核心命题。",
        "audioPy": "Dàshùjù jìshù de pǔjí shǐ gèxìnghuà fúwù yùfā jīngzhǔn, dàn biànlì de bèihòu yě qiáncáng zhe gèrén yǐnsī xièlòu de fēngxiǎn. Rúhé zài wājué shùjù jiàzhí yǔ zhùláo ānquán biānjiè zhījiān qǔdé pínghéng, yǐ chéngwéi dāngqián shùzì zhìlǐ de héxīn mìngtí.",
        "audioVi": "Sự phổ cập của công nghệ dữ liệu lớn giúp dịch vụ cá nhân hóa ngày càng chính xác, nhưng đằng sau sự tiện lợi cũng tiềm ẩn rủi ro rò rỉ quyền riêng tư cá nhân. Làm sao cân bằng giữa khai thác giá trị dữ liệu và dựng vững rào chắn an toàn đã trở thành đề tài cốt lõi của quản trị số hiện nay.",
        "opts": [
          "Dữ liệu lớn không mang lại giá trị thực tiễn nào cho dịch vụ",
          "Cần cân bằng giữa khai thác dữ liệu và bảo vệ quyền riêng tư",
          "Nên ngừng hoàn toàn mọi dịch vụ cá nhân hóa trên mạng",
          "Rò rỉ quyền riêng tư là vấn đề không thể kiểm soát được"
        ],
        "ans": 1,
        "exp": "Câu kết nêu trọng tâm: '在挖掘数据价值与筑牢安全边界之间取得平衡' (cân bằng giữa khai thác giá trị dữ liệu và bảo vệ an toàn)."
      },
      {
        "id": "l6_02_q2",
        "partLabel": "Phần 2 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe trích đoạn phỏng vấn: Chuyên gia nhận định thế nào về việc tự động hóa thay thế lao động?",
        "audioZh": "男：不少人担忧智能自动化会引发大规模失业，您怎么看？ 女：历史上的每一次技术革新确实都会淘汰部分重复性岗位，但同时也催生出大量新兴职业。关键在于教育体系与在职培训能否及时转型，帮助劳动者掌握难以被机器替代的创造力与共情能力。",
        "audioPy": "Nán: Bù shǎo rén dānyōu zhìnéng zìdònghuà huì yǐnfā dà guīmó shīyè, nín zěnme kàn? Nǚ: Lìshǐ shàng de měi yí cì jìshù géxīn quèshí dōu huì táotài bùfen chóngfùxìng gǎngwèi, dàn tóngshí yě cuīshēng chū dàliàng xīnxīng zhíyè. Guānjiàn zàiyú jiàoyù tǐxì yǔ zàizhí péixùn néngfǒu jíshí zhuǎnxíng, bāngzhù láodòngzhě zhǎngwò nányǐ bèi jīqì tìdài de chuàngzàolì yǔ gòngqíng nénglì.",
        "audioVi": "Nam: Không ít người lo ngại tự động hóa thông minh sẽ gây thất nghiệp quy mô lớn, ông/bà nhìn nhận thế nào? Nữ: Mỗi cuộc cách mạng công nghệ trong lịch sử đúng là đều đào thải một số vị trí lặp đi lặp lại, nhưng đồng thời cũng sản sinh hàng loạt nghề mới. Mấu chốt nằm ở việc hệ thống giáo dục và đào tạo tại chức có kịp chuyển mình để giúp người lao động nắm giữ năng lực sáng tạo và đồng cảm khó bị máy móc thay thế hay không.",
        "opts": [
          "Tự động hóa hoàn toàn không ảnh hưởng tới việc làm",
          "Công nghệ đào thải việc lặp lại nhưng tạo nghề mới, cốt lõi là đào tạo chuyển đổi",
          "Người lao động nên phản đối việc áp dụng máy móc mới",
          "Máy móc sớm muộn cũng thay thế hoàn toàn khả năng đồng cảm"
        ],
        "ans": 1,
        "exp": "Chuyên gia khẳng định công nghệ vừa đào thải việc lặp lại vừa tạo nghề mới, mấu chốt là chuyển đổi đào tạo nâng cao sáng tạo và đồng cảm."
      },
      {
        "id": "l6_02_q3",
        "partLabel": "Phần 2 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe hội thoại chuyên đề: Tại sao giao diện phần mềm cần chú trọng đến người cao tuổi?",
        "audioZh": "女：你们团队为什么专门为老年人重新设计手机应用界面？ 男：数字时代不应把任何群体甩在后面。字体太小、步骤繁琐会筑起一道无形的‘数字鸿沟’，把常用功能简化到三步之内，才能让技术真正充满人文关怀。",
        "audioPy": "Nǚ: Nǐmen tuánduì wèishénme zhuānmén wèi lǎoniánrén chóngxīn shèjì shǒujī yìngyòng jièmiàn? Nán: Shùzì shídài bù yīng bǎ rènhé qúntǐ shuǎi zài hòumiàn. Zìtǐ tài xiǎo, bùzhòu fánsuǒ huì zhùqǐ yí dào wúxíng de 'shùzì hónggōu', bǎ chángyòng gōngnéng jiǎnhuà dào sān bù zhī nèi, cái néng ràng jìshù zhēnzhèng chōngmǎn rénwén guānhuái.",
        "audioVi": "Nữ: Tại sao nhóm anh lại thiết kế riêng lại giao diện ứng dụng di động cho người cao tuổi? Nam: Thời đại số không nên bỏ lại bất kỳ nhóm người nào phía sau. Cỡ chữ quá nhỏ, thao tác rườm rà sẽ dựng lên một 'khoảng cách số' vô hình; đơn giản hóa tính năng thường dùng trong vòng ba bước mới giúp công nghệ thực sự thấm đẫm tính nhân văn.",
        "opts": [
          "Để tăng doanh thu quảng cáo từ người cao tuổi",
          "Để thu hẹp khoảng cách số và thể hiện tính nhân văn của công nghệ",
          "Vì người trẻ tuổi không còn dùng ứng dụng di động nữa",
          "Vì quy định bắt buộc chỉ được thiết kế tối đa ba nút bấm"
        ],
        "ans": 1,
        "exp": "Mục tiêu nêu rõ: không bỏ lại ai phía sau, xóa bỏ '数字鸿沟' (khoảng cách số) và thể hiện '人文关怀' (tính nhân văn)."
      },
      {
        "id": "l6_02_q4",
        "partLabel": "Phần 3 • Bài nói & Bình luận",
        "type": "mcq",
        "prompt": "Nghe bài bình luận: Điều gì khiến tin giả lan truyền nhanh trong môi trường mạng?",
        "audioZh": "在信息爆炸的社交媒体时代，情绪往往比事实跑得更快。不少谣言正是利用人们愤怒、焦虑或猎奇的心理迅速扩散，因此我们在转发任何未经核实的消息前，都应当多一分审慎，少一分盲从。",
        "audioPy": "Zài xìnxī bàozhà de shèjiāo méitǐ shídài, qíngxù wǎngwǎng bǐ shìshí pǎo de gèng kuài. Bù shǎo yáoyán zhèngshì lìyòng rénmen fènnù, jiāolǜ huò lièqí de xīnlǐ xùnsù kuòsàn, yīncǐ wǒmen zài zhuǎnfā rènhé wèi jīng héshí de xiāoxi qián, dōu yīngdāng duō yì fēn shěnshèn, shǎo yì fēn mángcóng.",
        "audioVi": "Trong thời đại truyền thông xã hội bùng nổ thông tin, cảm xúc thường chạy nhanh hơn sự thật. Không ít tin đồn chính là lợi dụng tâm lý phẫn nộ, lo âu hoặc hiếu kỳ của con người để lan rộng nhanh chóng, vì vậy trước khi chia sẻ bất kỳ thông tin chưa kiểm chứng nào, chúng ta đều nên thận trọng thêm một phần, mù quáng bớt một phần.",
        "opts": [
          "Vì người dùng luôn kiểm chứng kỹ trước khi chia sẻ",
          "Vì tin giả đánh vào cảm xúc phẫn nộ, lo âu hoặc hiếu kỳ",
          "Vì mạng xã hội thiếu tốc độ truyền tải văn bản",
          "Vì các cơ quan báo chí ngừng hoạt động"
        ],
        "ans": 1,
        "exp": "Bài nêu rõ tin đồn lan nhanh do '利用人们愤怒、焦虑或猎奇的心理' (lợi dụng tâm lý phẫn nộ, lo âu, hiếu kỳ)."
      },
      {
        "id": "l6_02_q5",
        "partLabel": "Phần 3 • Bài nói & Bình luận",
        "type": "mcq",
        "prompt": "Nghe đoạn bình luận: Tác giả ví thái độ đúng đắn đối với công cụ số như thế nào?",
        "audioZh": "技术本身并无善恶之分，它好比一把锋利的双刃剑。真正决定技术走向的，不是代码有多么复杂，而是设计者心中的伦理底线以及使用者驾驭工具时的理性与克制。",
        "audioPy": "Jìshù běnshēn bìng wú shàn'è zhī fēn, tā hǎobǐ yì bǎ fēnglì de shuāngrènjiàn. Zhēnzhèng juédìng jìshù zǒuxiàng de, bú shì dàimǎ yǒu duōme fùzá, ér shì shèjìzhě xīnzhōng de lúnlǐ dǐxiàn yǐjí shǐyòngzhě jiàyù gōngjù shí de lǐxìng yǔ kèzhì.",
        "audioVi": "Bản thân công nghệ vốn không có thiện ác, nó ví như một thanh kiếm hai lưỡi sắc bén. Thứ thực sự quyết định hướng đi của công nghệ không phải mã nguồn phức tạp đến đâu, mà là giới hạn đạo đức trong tâm người thiết kế cùng sự lý trí, tiết chế của người làm chủ công cụ.",
        "opts": [
          "Phụ thuộc hoàn toàn vào độ phức tạp của mã nguồn",
          "Quyết định bởi đạo đức người tạo ra và sự lý trí của người dùng",
          "Công nghệ tự nó mang bản chất tiêu cực",
          "Càng hiện đại thì càng không cần giới hạn đạo đức"
        ],
        "ans": 1,
        "exp": "Cấu trúc '不是…而是…' nhấn mạnh yếu tố quyết định là '伦理底线' (giới hạn đạo đức) và '理性与克制' (lý trí và tiết chế)."
      }
    ],
    "dictations": [
      {
        "id": "l6_02_d1",
        "zh": "科技应当服务于人，而不是支配人的生活。",
        "py": "Kējì yīngdāng fúwù yú rén, ér bú shì zhīpèi rén de shēnghuó.",
        "vi": "Công nghệ nên phục vụ con người chứ không phải chi phối cuộc sống của con người.",
        "hint": "Phục vụ con người (服务于人) + không phải chi phối (支配)"
      },
      {
        "id": "l6_02_d2",
        "zh": "面对海量信息，我们需要保持独立判断。",
        "py": "Miànduì hǎiliàng xìnxī, wǒmen xūyào bǎochí dúlì pànduàn.",
        "vi": "Trước biển thông tin khổng lồ, chúng ta cần giữ vững phán đoán độc lập.",
        "hint": "Thông tin khổng lồ (海量信息) + giữ phán đoán độc lập"
      }
    ]
  },
  {
    "id": "listen_hsk6_03",
    "level": 6,
    "badge": "HSK 6 • Đề 3",
    "title": "Đề 3: Kinh tế Vĩ mô, Chuỗi cung ứng & Phát triển Bền vững",
    "subtitle": "Nghe phân tích xu hướng kinh tế xanh, chuỗi cung ứng linh hoạt và thương hiệu bền vững.",
    "tips": "Các bài kinh tế HSK 6 hay dùng từ ghép bốn chữ và cấu trúc đối chiếu lợi ích ngắn hạn (短期收益) với phát triển dài hạn (长远发展).",
    "questions": [
      {
        "id": "l6_03_q1",
        "partLabel": "Phần 1 • Nghe đoạn chọn ý đúng",
        "type": "mcq",
        "prompt": "Nghe đoạn tin kinh tế và chọn kết luận chính xác nhất:",
        "audioZh": "过去衡量企业成功往往只盯着短期利润率，但如今越来越多跨国公司将碳足迹、员工福祉和供应链透明度纳入核心考核指标，因为绿色转型已不再是可选项，而是赢得未来市场的通行证。",
        "audioPy": "Guòqù héngliáng qǐyè chénggōng wǎngwǎng zhǐ dīng zhe duǎnqī lìrùnlǜ, dàn rújīn yuèláiyuè duō kuàguó gōngsī jiāng tànzújì, yuángōng fúzhǐ hé gōngyìngliàn tòumíngdù nàrù héxīn kǎohé zhǐbiāo, yīnwèi lǜsè zhuǎnxíng yǐ bú zài shì kěxuǎnxiàng, ér shì yíngdé wèilái shìchǎng de tōngxíngzhèng.",
        "audioVi": "Trước kia thước đo thành công của doanh nghiệp thường chỉ nhìn vào tỷ suất lợi nhuận ngắn hạn, nhưng nay ngày càng nhiều tập đoàn đưa dấu chân carbon, phúc lợi nhân viên và tính minh bạch chuỗi cung ứng vào chỉ số đánh giá cốt lõi, bởi chuyển đổi xanh không còn là lựa chọn phụ mà là tấm vé thông hành để chinh phục thị trường tương lai.",
        "opts": [
          "Lợi nhuận ngắn hạn vẫn là tiêu chuẩn duy nhất hiện nay",
          "Chuyển đổi xanh và phát triển bền vững đang trở thành tiêu chuẩn tất yếu",
          "Phúc lợi nhân viên làm giảm tính minh bạch chuỗi cung ứng",
          "Chỉ các doanh nghiệp nhỏ mới cần quan tâm đến khí thải"
        ],
        "ans": 1,
        "exp": "Bài khẳng định chuyển đổi xanh '不再是可选项，而是赢得未来市场的通行证' (không còn là tùy chọn mà là điều kiện tất yếu)."
      },
      {
        "id": "l6_03_q2",
        "partLabel": "Phần 2 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe trích đoạn phỏng vấn: Giám đốc chuỗi cung ứng đã rút ra bài học gì sau biến động thị trường?",
        "audioZh": "女：经历了几次国际物流受阻后，贵公司在供应链布局上做了哪些调整？ 男：过去我们过度追求单一来源的低成本，抗冲击能力很脆弱。现在我们坚持‘多元化与区域化’原则，宁可保留适度冗余库存，也要确保极端情况下生产不断链。",
        "audioPy": "Nǚ: Jīnglì le jǐ cì guójì wùliú shòuzǔ hòu, guì gōngsī zài gōngyìngliàn bùjú shàng zuò le nǎxiē tiáozhěng? Nán: Guòqù wǒmen guòdù zhuīqiú dānyī láiyuán de dī chéngběn, kàng chōngjī nénglì hěn cuìruò. Xiànzài wǒmen jiānchí 'duōyuánhuà yǔ qūyùhuà' yuánzé, nìngkě bǎoliú shìdù rǒngyú kùcún, yě yào quèbǎo jíduān qíngkuàng xià shēngchǎn bú duànliàn.",
        "audioVi": "Nữ: Sau vài lần vận tải quốc tế gặp trở ngại, quý công ty đã điều chỉnh bố cục chuỗi cung ứng thế nào? Nam: Trước kia chúng tôi chạy theo chi phí thấp từ một nguồn duy nhất quá mức nên sức chống chịu rất mong manh. Giờ chúng tôi kiên trì nguyên tắc 'đa dạng hóa và khu vực hóa', thà duy trì tồn kho dự phòng vừa phải để bảo đảm sản xuất không đứt gãy trong tình huống cực đoan.",
        "opts": [
          "Tiếp tục cắt giảm toàn bộ tồn kho để hạ giá thành",
          "Chuyển sang đa dạng hóa nguồn cung và giữ dự phòng hợp lý",
          "Chỉ nhập nguyên liệu từ một nhà cung cấp giá rẻ nhất",
          "Tạm dừng hoạt động vận chuyển quốc tế"
        ],
        "ans": 1,
        "exp": "Chiến lược mới là '多元化与区域化' (đa dạng hóa và khu vực hóa) cùng '适度冗余库存' (tồn kho dự phòng hợp lý)."
      },
      {
        "id": "l6_03_q3",
        "partLabel": "Phần 2 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe hội thoại: Theo nhà phân tích, vì sao nhiều thương hiệu lâu năm vẫn giữ được vị thế?",
        "audioZh": "男：新兴品牌层出不穷，为什么少数百年老字号依然屹立不倒？ 女：秘诀在于它们既有‘守正’的定力，始终严守产品品质；又有‘创新’的魄力，懂得用贴近当代审美的语言与年轻消费者对话。",
        "audioPy": "Nán: Xīnxīng pǐnpái céngchū-bùqióng, wèishénme shǎoshù bǎinián lǎozìhào yīrán yìlì-bùdǎo? Nǚ: Mìjué zàiyú tāmen jì yǒu 'shǒuzhèng' de dìnglì, shǐzhōng yánshǒu chǎnpǐn pǐnzhì; yòu yǒu 'chuàngxīn' de pòlì, dǒngde yòng tiējìn dāngdài shěnměi de yǔyán yǔ niánqīng xiāofèizhě duìhuà.",
        "audioVi": "Nam: Thương hiệu mới mọc lên như nấm, tại sao một số ít thương hiệu trăm năm vẫn đứng vững không lay chuyển? Nữ: Bí quyết nằm ở chỗ họ vừa có bản lĩnh 'giữ chuẩn' luôn nghiêm ngặt chất lượng sản phẩm, vừa có khí phách 'đổi mới' biết đối thoại với người tiêu dùng trẻ bằng ngôn ngữ gần gũi thẩm mỹ đương đại.",
        "opts": [
          "Vì được bảo hộ độc quyền trên thị trường",
          "Vì vừa giữ vững chất lượng vừa đổi mới cách tiếp cận người trẻ",
          "Vì luôn giữ nguyên bao bì cũ từ trăm năm trước",
          "Vì chi toàn bộ ngân sách cho giảm giá sâu"
        ],
        "ans": 1,
        "exp": "Cặp '既…又…' nêu rõ 2 trụ cột: '严守产品品质' (giữ chặt chất lượng) và '创新…与年轻消费者对话' (đổi mới tiếp cận thế hệ trẻ)."
      },
      {
        "id": "l6_03_q4",
        "partLabel": "Phần 3 • Bài nói & Bình luận",
        "type": "mcq",
        "prompt": "Nghe bài bình luận: Mô hình 'kinh tế tuần hoàn' mang lại lợi ích gì?",
        "audioZh": "传统的‘开采—制造—丢弃’线性模式已难以为继，而循环经济则通过延长产品寿命、推动修复翻新与材料再生，将废弃物重新转化为生产资源，从而大幅降低对原生矿产和能源的消耗。",
        "audioPy": "Chuántǒng de 'kāicǎi—zhìzào—diūqì' xiànxìng móshì yǐ nányǐ wéijì, ér xúnhuán jīngjì zé tōngguò yáncháng chǎnpǐn shòumìng, tuīdòng xiūfù fānxīn yǔ cáiliào zàishēng, jiāng fèiqìwù chóngxīn zhuǎnhuà wéi shēngchǎn zīyuán, cóng'ér dàfú jiàngdī duì yuánshēng kuàngchǎn hé néngyuán de xiāohào.",
        "audioVi": "Mô hình tuyến tính truyền thống 'khai thác – chế tạo – vứt bỏ' đã khó duy trì tiếp; trong khi kinh tế tuần hoàn kéo dài vòng đời sản phẩm, thúc đẩy sửa chữa làm mới và tái sinh vật liệu, biến chất thải trở lại thành tài nguyên sản xuất, qua đó giảm mạnh mức tiêu hao khoáng sản nguyên sinh và năng lượng.",
        "opts": [
          "Khuyến khích người dân mua mới thay vì sửa chữa",
          "Biến phế thải thành tài nguyên và giảm tiêu hao khoáng sản, năng lượng",
          "Loại bỏ hoàn toàn quá trình chế tạo công nghiệp",
          "Tăng tốc độ khai thác tài nguyên thiên nhiên"
        ],
        "ans": 1,
        "exp": "Bài nêu rõ kinh tế tuần hoàn '将废弃物重新转化为生产资源' và '大幅降低对原生矿产和能源的消耗'."
      },
      {
        "id": "l6_03_q5",
        "partLabel": "Phần 3 • Bài nói & Bình luận",
        "type": "mcq",
        "prompt": "Nghe đoạn bình luận: Tác giả khuyên nhà đầu tư tránh sai lầm nào?",
        "audioZh": "投资市场最忌讳‘羊群效应’，看到别人买什么就一窝蜂地追涨，结果往往在高位接盘。真正成熟的投资决策，应当建立在对行业周期与企业基本面的扎实研究之上。",
        "audioPy": "Tóuzī shìchǎng zuì jìhuì 'yángqún xiàoyìng', kàndào biérén mǎi shénme jiù yìwōfēng de zhuīzhǎng, jiéguǒ wǎngwǎng zài gāowèi jiēpán. Zhēnzhèng chéngshú de tóuzī juécè, yīngdāng jiànlì zài duì hángyè zhōuqī yǔ qǐyè jīběnmiàn de zhāshi yánjiū zhīshàng.",
        "audioVi": "Thị trường đầu tư tối kỵ 'hiệu ứng bầy đàn', thấy người khác mua gì liền ùa theo đuổi giá cao, kết cục thường ôm đỉnh. Quyết định đầu tư thực sự chín chắn phải đặt trên nền tảng nghiên cứu vững chắc về chu kỳ ngành và yếu tố cơ bản của doanh nghiệp.",
        "opts": [
          "Nghiên cứu quá kỹ chu kỳ ngành trước khi mua",
          "Chạy theo hiệu ứng bầy đàn thiếu cơ sở nghiên cứu",
          "Đầu tư dài hạn vào doanh nghiệp nền tảng tốt",
          "Giữ tâm lý bình tĩnh khi thị trường biến động"
        ],
        "ans": 1,
        "exp": "Từ khóa đầu câu: '最忌讳‘羊群效应’' (tối kỵ hiệu ứng bầy đàn, ùa theo đám đông)."
      }
    ],
    "dictations": [
      {
        "id": "l6_03_d1",
        "zh": "高质量发展不能以牺牲环境为代价。",
        "py": "Gāo zhìliàng fāzhǎn bù néng yǐ xīshēng huánjìng wéi dàijià.",
        "vi": "Phát triển chất lượng cao không thể lấy việc đánh đổi môi trường làm cái giá.",
        "hint": "Phát triển chất lượng cao + lấy... làm cái giá (以...为代价)"
      },
      {
        "id": "l6_03_d2",
        "zh": "企业必须在竞争中不断提升核心实力。",
        "py": "Qǐyè bìxū zài jìngzhēng zhōng búduàn tíshēng héxīn shílì.",
        "vi": "Doanh nghiệp bắt buộc phải không ngừng nâng cao thực lực cốt lõi trong cạnh tranh.",
        "hint": "Trong cạnh tranh + không ngừng nâng cao + thực lực cốt lõi (核心实力)"
      }
    ]
  },
  {
    "id": "listen_hsk6_04",
    "level": 6,
    "badge": "HSK 6 • Đề 4",
    "title": "Đề 4: Ngôn ngữ, Tư duy Phản biện & Giao thoa Văn hóa",
    "subtitle": "Nghe bài giảng về ngôn ngữ học, dịch thuật văn học và đối thoại liên văn hóa.",
    "tips": "Chú ý các thuật ngữ trừu tượng như 语境 (ngữ cảnh), 思维方式 (lối tư duy), 文化共鸣 (cộng hưởng văn hóa), 求同存异 (cầu đồng tồn dị).",
    "questions": [
      {
        "id": "l6_04_q1",
        "partLabel": "Phần 1 • Nghe đoạn chọn ý đúng",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và chọn ý diễn đạt đúng nhất quan điểm tác giả:",
        "audioZh": "学习一门外语绝不仅仅是记忆词汇和语法规则，更像是推开一扇通往另一种思维方式的窗户。当你真正理解了某种表达背后的文化语境，跨文化沟通中的许多隔阂便会迎刃而解。",
        "audioPy": "Xuéxí yì mén wàiyǔ jué bù jǐnjǐn shì jìyì cíhuì hé yǔfǎ guīzé, gèng xiàng shì tuīkāi yì shàn tōngwǎng lìng yì zhǒng sīwéi fāngshì de chuānghu. Dāng nǐ zhēnzhèng lǐjiě le mǒu zhǒng biǎodá bèihòu de wénhuà yǔjìng, kuà wénhuà gōutōng zhōng de xǔduō géhé biàn huì yíngrèn-érjiě.",
        "audioVi": "Học một ngoại ngữ tuyệt đối không chỉ là ghi nhớ từ vựng và quy tắc ngữ pháp, mà còn giống như mở ra một ô cửa dẫn tới lối tư duy khác. Khi thực sự hiểu ngữ cảnh văn hóa đằng sau cách diễn đạt, nhiều rào cản trong giao tiếp liên văn hóa sẽ tự khắc được tháo gỡ.",
        "opts": [
          "Chỉ cần thuộc thật nhiều ngữ pháp là đủ giao tiếp liên văn hóa",
          "Học ngoại ngữ giúp mở rộng tư duy và hiểu ngữ cảnh văn hóa để xóa rào cản",
          "Mỗi nền văn hóa đều có rào cản ngôn ngữ không thể vượt qua",
          "Nên dịch từng chữ một để giữ nguyên nghĩa gốc"
        ],
        "ans": 1,
        "exp": "Bài nhấn mạnh học ngoại ngữ mở ra '另一种思维方式' và hiểu '文化语境' giúp tháo gỡ rào cản giao tiếp."
      },
      {
        "id": "l6_04_q2",
        "partLabel": "Phần 2 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe trích đoạn phỏng vấn dịch giả: Điều khó nhất khi dịch tác phẩm văn học là gì?",
        "audioZh": "男：人工智能翻译如今非常流畅，文学翻译还有不可替代的价值吗？ 女：机器可以准确传达字面信息，却很难捕捉文字弦外之音里的情感节奏与文化意象。优秀的文学译者就像在两种语言之间架起心灵桥梁，既忠于原作神韵，又让译文自然地道。",
        "audioPy": "Nán: Réngōng zhìnéng fānyì rújīn fēicháng liúchàng, wénxué fānyì hái yǒu bù kě tìdài de jiàzhí ma? Nǚ: Jīqì kěyǐ zhǔnquè chuándá zìmiàn xìnxī, què hěn nán bǔzhuō wénzì xiánwài-zhīyīn lǐ de qínggǎn jiézòu yǔ wénhuà yìxiàng. Yōuxiù de wénxué yìzhě jiù xiàng zài liǎng zhǒng yǔyán zhījiān jiàqǐ xīnlíng qiáoliáng, jì zhōngyú yuánzuò shényùn, yòu ràng yìwén zìrán dìdao.",
        "audioVi": "Nam: Dịch thuật trí tuệ nhân tạo nay trôi chảy lắm rồi, dịch văn học còn giá trị không thể thay thế sao? Nữ: Máy móc có thể truyền đạt chính xác thông tin mặt chữ, nhưng rất khó nắm bắt nhịp điệu cảm xúc và hình tượng văn hóa ẩn sau lời văn. Dịch giả văn học giỏi như bắc nhịp cầu tâm hồn giữa hai ngôn ngữ, vừa trung thành thần thái nguyên tác, vừa khiến bản dịch tự nhiên chuẩn mực.",
        "opts": [
          "Dịch sát từng từ vựng mặt chữ",
          "Truyền tải nhịp điệu cảm xúc, hình tượng văn hóa và thần thái nguyên tác",
          "Dịch thật nhanh để kịp tiến độ xuất bản",
          "Thay đổi hoàn toàn cốt truyện cho hợp độc giả mới"
        ],
        "ans": 1,
        "exp": "Dịch giả nhấn mạnh giá trị không thể thay thế là truyền tải '情感节奏与文化意象' và '忠于原作神韵' (thần thái nguyên tác)."
      },
      {
        "id": "l6_04_q3",
        "partLabel": "Phần 2 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe hội thoại: Người nữ hiểu thế nào về 'tư duy phản biện'?",
        "audioZh": "男：我看你开会时总爱提出质疑，是不是觉得别人想得不够周全？ 女：提出质疑并不等于否定别人。真正的批判性思考，是学会先追问论据是否可靠、逻辑是否严密，即使面对自己深信的观点也要敢于检验。",
        "audioPy": "Nán: Wǒ kàn nǐ kāihuì shí zǒng ài tíchū zhìyí, shì bu shì juéde biérén xiǎng de bú gòu zhōuquán? Nǚ: Tíchū zhìyí bìng bù děngyú fǒudìng biérén. Zhēnzhèng de pīpànxìng sīkǎo, shì xuéhuì xiān zhuīwèn lùnjù shìfǒu kěkào, luóji shìfǒu yánmì, jíshǐ miànduì zìjǐ shēnxìn de guāndiǎn yě yào gǎnyú jiǎnyàn.",
        "audioVi": "Nam: Tớ thấy lúc họp cậu hay đặt câu hỏi chất vấn, có phải thấy người khác nghĩ chưa chu đáo không? Nữ: Đặt nghi vấn không đồng nghĩa phủ định người khác. Tư duy phản biện thực sự là biết truy vấn xem luận cứ có đáng tin, lập luận có chặt chẽ không, ngay cả với quan điểm mình tin tưởng sâu sắc cũng dám tự kiểm chứng.",
        "opts": [
          "Là phản đối mọi ý kiến của đồng nghiệp trong cuộc họp",
          "Là kiểm chứng độ tin cậy của luận cứ và tính chặt chẽ của lập luận",
          "Là bảo vệ quan điểm cá nhân đến cùng không thay đổi",
          "Là tránh phát biểu để không gây tranh cãi"
        ],
        "ans": 1,
        "exp": "Nữ định nghĩa rõ: '追问论据是否可靠、逻辑是否严密' và dám kiểm chứng ngay cả quan điểm của chính mình."
      },
      {
        "id": "l6_04_q4",
        "partLabel": "Phần 3 • Bài nói & Bình luận",
        "type": "mcq",
        "prompt": "Nghe bài nói: Tác giả khuyên chúng ta ứng xử thế nào khi tiếp xúc với nền văn hóa khác biệt?",
        "audioZh": "各美其美，美人之美，美美与共。面对不同的风俗与价值观，如果只用单一尺子去评判优劣，往往会陷入偏见；唯有怀着谦逊与好奇去平等对话，才能在差异中发现共鸣。",
        "audioPy": "Gè měi qí měi, měi rén zhī měi, měiměi yǔ gòng. Miànduì bùtóng de fēngsú yǔ jiàzhíguān, rúguǒ zhǐ yòng dānyī chǐzi qù píngpàn yōuliè, wǎngwǎng huì xiànrù piānjiàn; wéiyǒu huái zhe qiānxùn yǔ hàoqí qù píngděng duìhuà, cái néng zài chāyì zhōng fāxiàn gòngmíng.",
        "audioVi": "Mỗi nét đẹp riêng, trân trọng cái đẹp của người, cùng nhau tỏa sáng. Trước phong tục và hệ giá trị khác biệt, nếu chỉ dùng một thước đo duy nhất để phán xét hơn thua sẽ dễ rơi vào định kiến; chỉ khi mang lòng khiêm tốn và tò mò để đối thoại bình đẳng mới tìm thấy sự đồng điệu trong khác biệt.",
        "opts": [
          "Dùng chuẩn mực của mình để đánh giá mọi nền văn hóa khác",
          "Khiêm tốn, cởi mở đối thoại bình đẳng để tìm sự đồng điệu",
          "Hòa tan hoàn toàn bản sắc riêng của bản thân",
          "Tránh tiếp xúc với những phong tục xa lạ"
        ],
        "ans": 1,
        "exp": "Câu kết nêu rõ: '怀着谦逊与好奇去平等对话，才能在差异中发现共鸣' (khiêm tốn, đối thoại bình đẳng tìm sự đồng điệu)."
      },
      {
        "id": "l6_04_q5",
        "partLabel": "Phần 3 • Bài nói & Bình luận",
        "type": "mcq",
        "prompt": "Nghe đoạn văn: Tác giả cảnh báo điều gì về việc lạm dụng viết tắt và biểu tượng thay lời?",
        "audioZh": "网络表情包和缩写词虽能拉近距离，但若长期用简单的符号代替完整表达，人的语言组织能力可能会悄然退化，遇到需要严谨论述的场合就会词不达意。",
        "audioPy": "Wǎngluò biǎoqíngbāo hé suōxiěcí suī néng lājìn jùlí, dàn ruò chángqī yòng jiǎndān de fúhào dàitì wánzhěng biǎodá, rén de yǔyán zǔzhī nénglì kěnéng huì qiǎorán tuìhuà, yùdào xūyào yánjǐn lùnshù de chǎnghé jiù huì cí-bù-dáyì.",
        "audioVi": "Nhãn dán mạng và từ viết tắt tuy giúp kéo gần khoảng cách, nhưng nếu lâu dài dùng ký hiệu đơn giản thay cho diễn đạt trọn vẹn, năng lực tổ chức ngôn ngữ có thể âm thầm thoái hóa, gặp dịp cần trình bày chặt chẽ sẽ lúng túng không diễn tả hết ý.",
        "opts": [
          "Làm tăng tốc độ đánh máy trên điện thoại",
          "Có thể khiến năng lực tổ chức ngôn ngữ suy giảm khi cần diễn đạt chặt chẽ",
          "Giúp bài viết học thuật trở nên sinh động hơn",
          "Khiến người đọc không thể hiểu được cảm xúc vui buồn"
        ],
        "ans": 1,
        "exp": "Tác giả cảnh báo '语言组织能力可能会悄然退化' (khả năng tổ chức ngôn ngữ thoái hóa) dẫn đến '词不达意'."
      }
    ],
    "dictations": [
      {
        "id": "l6_04_d1",
        "zh": "语言不仅是交流工具，更是文化的载体。",
        "py": "Yǔyán bùjǐn shì jiāoliú gōngjù, gèng shì wénhuà de zàitǐ.",
        "vi": "Ngôn ngữ không chỉ là công cụ giao tiếp mà còn là vật chuyên chở văn hóa.",
        "hint": "Không chỉ là công cụ giao tiếp + vật mang văn hóa (载体)"
      },
      {
        "id": "l6_04_d2",
        "zh": "平等对话是消除文化偏见的有效途径。",
        "py": "Píngděng duìhuà shì xiāochú wénhuà piānjiàn de yǒuxiào tújìng.",
        "vi": "Đối thoại bình đẳng là con đường hiệu quả để xóa bỏ định kiến văn hóa.",
        "hint": "Đối thoại bình đẳng + xóa bỏ định kiến + con đường hiệu quả (有效途径)"
      }
    ]
  },
  {
    "id": "listen_hsk6_05",
    "level": 6,
    "badge": "HSK 6 • Đề 5",
    "title": "Đề 5: Khoa học Khám phá, Vũ trụ & Y học Tương lai",
    "subtitle": "Nghe tin tức khoa học vũ trụ, y học phòng ngừa và phương pháp nghiên cứu liên ngành.",
    "tips": "Khi nghe thuật ngữ khoa học (深空探测, 基因, 预防医学, 跨学科), không cần hoảng nếu gặp từ mới — hãy bám vào động từ chính và mục đích thí nghiệm.",
    "questions": [
      {
        "id": "l6_05_q1",
        "partLabel": "Phần 1 • Nghe đoạn chọn ý đúng",
        "type": "mcq",
        "prompt": "Nghe đoạn tin khoa học và chọn kết luận chính xác nhất:",
        "audioZh": "深空探测不仅满足人类对宇宙起源的好奇，更在无形中倒逼材料科学、精密制造与能源存储等基础技术的跨越式进步，许多航天成果最终都转化为了普通人日常可用的民用科技。",
        "audioPy": "Shēnkōng tàncè bùjǐn mǎnzú rénlèi duì yǔzhòu qǐyuán de hàoqí, gèng zài wúxíng zhōng dàobī cáiliào kēxué, jīngmì zhìzào yǔ néngyuán cúnchǔ děng jīchǔ jìshù de kuàyuèshì jìnbù, xǔduō hángtiān chéngguǒ zuìzhōng dōu zhuǎnhuà wéi le pǔtōngrén rìcháng kěyòng de mínyòng kējì.",
        "audioVi": "Thám hiểm không gian sâu không chỉ thỏa mãn sự tò mò của nhân loại về nguồn gốc vũ trụ, mà còn âm thầm thúc ép các công nghệ nền tảng như khoa học vật liệu, chế tạo chính xác và lưu trữ năng lượng tiến bước nhảy vọt; nhiều thành tựu hàng không vũ trụ cuối cùng đã chuyển hóa thành công nghệ dân dụng phục vụ đời sống thường ngày.",
        "opts": [
          "Thám hiểm vũ trụ tốn kém và không mang lại lợi ích dân sinh",
          "Thám hiểm không gian thúc đẩy công nghệ nền tảng và chuyển hóa thành ứng dụng dân dụng",
          "Vật liệu hàng không không thể dùng ngoài vũ trụ",
          "Khoa học cơ bản phát triển độc lập với công nghệ vũ trụ"
        ],
        "ans": 1,
        "exp": "Bài nêu hai giá trị lớn: thúc đẩy công nghệ nền tảng ('基础技术的跨越式进步') và chuyển hóa thành '民用科技' (công nghệ dân dụng)."
      },
      {
        "id": "l6_05_q2",
        "partLabel": "Phần 2 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe trích đoạn phỏng vấn bác sĩ: Trọng tâm của y học hiện đại đang chuyển dịch ra sao?",
        "audioZh": "女：您从医三十年，觉得现代医学理念最大的变化是什么？ 男：过去医疗重心往往放在‘病发后如何抢救’，如今越来越强调‘关口前移’，通过定期体检、健康饮食与早期筛查把疾病阻挡在发生之前，也就是常说的预防为主。",
        "audioPy": "Nǚ: Nín cóngyī sānshí nián, juéde xiàndài yīxué lǐniàn zuì dà de biànhuà shì shénme? Nán: Guòqù yīliáo zhòngxīn wǎngwǎng fàng zài 'bìngfā hòu rúhé qiǎngjiù', rújīn yuèláiyuè qiángdiào 'guānkǒu qiányí', tōngguò dìngqī tǐjiǎn, jiànkāng yǐnshí yǔ zǎoqī shāichá bǎ jíbìng zǔdǎng zài fāshēng zhīqián, yě jiùshì chángshuō de yùfáng wéi zhǔ.",
        "audioVi": "Nữ: Ông hành nghề y ba mươi năm, thấy thay đổi lớn nhất trong quan niệm y học hiện đại là gì? Nam: Trước đây trọng tâm y tế thường đặt ở việc 'cấp cứu thế nào sau khi phát bệnh', nay ngày càng nhấn mạnh 'đưa phòng tuyến lên trước', qua khám định kỳ, ăn uống lành mạnh và tầm soát sớm để chặn bệnh trước khi khởi phát, tức lấy phòng ngừa làm chính.",
        "opts": [
          "Chỉ tập trung phát triển thuốc cấp cứu đắt tiền",
          "Chuyển từ chữa bệnh sau khi phát tác sang lấy phòng ngừa làm chính",
          "Giảm bớt các đợt khám sức khỏe định kỳ",
          "Phụ thuộc hoàn toàn vào phẫu thuật hiện đại"
        ],
        "ans": 1,
        "exp": "Bác sĩ nêu rõ sự chuyển dịch từ '病发后如何抢救' sang '预防为主' (lấy phòng ngừa làm chính)."
      },
      {
        "id": "l6_05_q3",
        "partLabel": "Phần 2 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe hội thoại khoa học: Tại sao các dự án đột phá hiện nay cần hợp tác liên ngành?",
        "audioZh": "男：为什么现在的实验室里既有生物学家，又有计算机工程师和伦理学者？ 女：单一学科的视角已经很难应对复杂的前沿课题。不同背景的学者坐在一起碰撞思想，往往能在学科交叉的边缘地带激发出意想不到的灵感。",
        "audioPy": "Nán: Wèishénme xiànzài de shíyànshì lǐ jì yǒu shēngwù xuéjiā, yòu yǒu jìsuànjī gōngchéngshī hé lúnlǐ xuézhě? Nǚ: Dānyī xuékē de shìjiǎo yǐjīng hěn nán yìngduì fùzá de qiányán kètí. Bùtóng bèijǐng de xuézhě zuò zài yìqǐ pèngzhuàng sīxiǎng, wǎngwǎng néng zài xuékē jiāochā de biānyuán dìdài jīfā chū yìxiǎng-búdào de línggǎn.",
        "audioVi": "Nam: Tại sao trong phòng thí nghiệm ngày nay vừa có nhà sinh học, lại vừa có kỹ sư máy tính và học giả đạo đức học? Nữ: Góc nhìn của một ngành đơn lẻ đã rất khó giải quyết các đề tài tiên phong phức tạp. Học giả từ các nền tảng khác nhau cùng trao đổi va chạm tư tưởng thường khơi dậy những cảm hứng bất ngờ ngay tại vùng giao thoa giữa các ngành.",
        "opts": [
          "Để tiết kiệm diện tích phòng thí nghiệm",
          "Vì vấn đề phức tạp đòi hỏi góc nhìn đa ngành để khơi nguồn cảm hứng mới",
          "Vì mỗi chuyên ngành đang thiếu nhân lực nghiên cứu",
          "Để giảm số lượng báo cáo khoa học phải viết"
        ],
        "ans": 1,
        "exp": "Lý do là '单一学科的视角…很难应对复杂的前沿课题' và giao thoa đa ngành giúp '激发出意想不到的灵感'."
      },
      {
        "id": "l6_05_q4",
        "partLabel": "Phần 3 • Bài nói & Bình luận",
        "type": "mcq",
        "prompt": "Nghe bài nói: Tác giả đề cao phẩm chất nào nhất ở một nhà nghiên cứu khoa học?",
        "audioZh": "科学探索的道路从不是一帆风顺的，成百上千次实验失败才是常态。真正优秀的科研人员未必是最聪明的，但一定具备甘坐‘冷板凳’的定力，耐得住寂寞，对未知始终保持敬畏与诚实。",
        "audioPy": "Kēxué tànsuǒ de dàolù cóng bú shì yìfān-fēngshùn de, chéngbǎi-shàngqiān cì shíyàn shībài cái shì chángtài. Zhēnzhèng yōuxiù de kēyán rényuán wèibì shì zuì cōngming de, dàn yídìng jùbèi gānzuò 'lěngbǎndèng' de dìnglì, nài de zhù jìmò, duì wèizhī shǐzhōng bǎochí jìngwèi yǔ chéngshí.",
        "audioVi": "Con đường khám phá khoa học chưa bao giờ thuận buồm xuôi gió, hàng trăm hàng nghìn lần thí nghiệm thất bại mới là chuyện thường. Nhà nghiên cứu thực sự xuất sắc chưa chắc là người thông minh nhất, nhưng nhất định có bản lĩnh cam chịu 'ghế lạnh', bền bỉ trước cô đơn, luôn giữ lòng kính sợ và trung thực trước điều chưa biết.",
        "opts": [
          "Thành công ngay trong lần thử nghiệm đầu tiên",
          "Sự bền bỉ kiên trì trước thất bại và lòng trung thực khoa học",
          "Luôn chọn những đề tài dễ và nhanh ra kết quả",
          "Khả năng diễn thuyết thu hút truyền thông"
        ],
        "ans": 1,
        "exp": "Bài nhấn mạnh '甘坐‘冷板凳’的定力，耐得住寂寞' (kiên trì bền bỉ) và '敬畏与诚实' (kính sợ và trung thực)."
      },
      {
        "id": "l6_05_q5",
        "partLabel": "Phần 3 • Bài nói & Bình luận",
        "type": "mcq",
        "prompt": "Nghe đoạn văn: Mục đích của các hoạt động phổ biến khoa học (科普) cho công chúng là gì?",
        "audioZh": "把深奥的科学原理用通俗易懂的生活语言讲给大众听，并非降低学术标准，而是为了让科学精神走进寻常百姓家，提升全社会的科学素养，让理性思考成为日常习惯。",
        "audioPy": "Bǎ shēn'ào de kēxué yuánlǐ yòng tōngsú-yìdǒng de shēnghuó yǔyán jiǎng gěi dàzhòng tīng, bìngfēi jiàngdī xuéshù biāozhǔn, ér shì wèile ràng kēxué jīngshén zǒujìn xúncháng bǎixìngjiā, tíshēng quán shèhuì de kēxué sùyǎng, ràng lǐxìng sīkǎo chéngwéi rìcháng xíguàn.",
        "audioVi": "Đem những nguyên lý khoa học uyên thâm kể cho đại chúng bằng ngôn ngữ đời thường dễ hiểu tuyệt không phải hạ thấp chuẩn mực học thuật, mà là để tinh thần khoa học đi vào từng nếp nhà, nâng cao dân trí khoa học toàn xã hội và đưa tư duy lý trí thành thói quen hằng ngày.",
        "opts": [
          "Thay thế hoàn toàn chương trình đại học",
          "Nâng cao dân trí khoa học và lan tỏa thói quen tư duy lý trí",
          "Chứng minh khoa học là lĩnh vực dễ dàng",
          "Thu hút học sinh bỏ các môn nghệ thuật"
        ],
        "ans": 1,
        "exp": "Mục tiêu nêu rõ: '提升全社会的科学素养，让理性思考成为日常习惯' (nâng cao tri thức khoa học và tư duy lý trí)."
      }
    ],
    "dictations": [
      {
        "id": "l6_05_d1",
        "zh": "基础研究是所有技术创新的源头活水。",
        "py": "Jīchǔ yánjiū shì suǒyǒu jìshù chuàngxīn de yuántóu huóshuǐ.",
        "vi": "Nghiên cứu cơ bản là nguồn suối đầu nguồn của mọi đổi mới công nghệ.",
        "hint": "Nghiên cứu cơ bản (基础研究) + nguồn đầu nguồn (源头活水)"
      },
      {
        "id": "l6_05_d2",
        "zh": "科学的进步离不开实事求是的态度。",
        "py": "Kēxué de jìnbù lí bu kāi shíshì-qiúshì de tàidu.",
        "vi": "Sự tiến bộ của khoa học không thể tách rời thái độ cầu thị thực tế.",
        "hint": "Tiến bộ khoa học + không thể tách rời + thái độ 实事求是"
      }
    ]
  },
  {
    "id": "listen_hsk6_06",
    "level": 6,
    "badge": "HSK 6 • Đề 6",
    "title": "Đề 6: Triết lý Đông phương, Mỹ học & Sức khỏe Tinh thần",
    "subtitle": "Nghe các bài tản văn triết lý, mỹ học truyền thống và nghệ thuật sống an nhiên.",
    "tips": "Các đoạn triết lý cuối HSK 6 thường mượn hình ảnh thiên nhiên (nước, núi, ánh sáng, mùa màng) để ẩn dụ cho đạo lý nhân sinh; hãy đọc xuyên suốt tới câu kết luận.",
    "questions": [
      {
        "id": "l6_06_q1",
        "partLabel": "Phần 1 • Nghe đoạn chọn ý đúng",
        "type": "mcq",
        "prompt": "Nghe đoạn tản văn và chọn thông điệp phù hợp nhất:",
        "audioZh": "古人常说‘上善若水’，水看似柔弱，遇到岩石便绕道而行，从不硬碰硬，却能凭借日复一日的坚持滴水穿石。做人处世亦是如此，懂得柔韧变通而又守住内心方向，往往比一味刚强走得更远。",
        "audioPy": "Gǔrén cháng shuō 'shàngshàn ruò shuǐ', shuǐ kànsì róuruò, yùdào yánshí biàn ràodào ér xíng, cóng bù yìngpèngyìng, què néng píngjiè rìfù-yírì de jiānchí dīshuǐ-chuānshí. Zuòrén chǔshì yì shì rúcǐ, dǒngde róurèn biàntōng ér yòu shǒuzhù nèixīn fāngxiàng, wǎngwǎng bǐ yíwèi gāngqiáng zǒu de gèng yuǎn.",
        "audioVi": "Người xưa thường nói 'thượng thiện nhược thủy' (đức cao nhất tựa như nước). Nước thoạt nhìn mềm yếu, gặp đá liền vòng qua chứ không đối đầu cứng nhắc, nhưng nhờ kiên trì ngày qua ngày lại có thể nước chảy đá mòn. Ứng xử ở đời cũng vậy, biết mềm dẻo linh hoạt mà vẫn giữ vững phương hướng nội tâm thường đi xa hơn sự cứng nhắc một chiều.",
        "opts": [
          "Làm người phải luôn đối đầu trực diện không nhượng bộ",
          "Mềm dẻo linh hoạt nhưng kiên định mục tiêu giúp đi xa hơn",
          "Nước yếu ớt nên không thể vượt qua đá tảng",
          "Sự kiên trì không có tác dụng khi gặp trở ngại lớn"
        ],
        "ans": 1,
        "exp": "Câu kết đúc rút: '懂得柔韧变通而又守住内心方向，往往比一味刚强走得更远' (mềm dẻo linh hoạt nhưng giữ vững phương hướng)."
      },
      {
        "id": "l6_06_q2",
        "partLabel": "Phần 2 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe trích đoạn phỏng vấn kiến trúc sư: Thiết kế 'sân vườn truyền thống' muốn gợi cảm giác gì cho người xem?",
        "audioZh": "男：参观古典园林时，为什么总觉得空间比实际面积大得多？ 女：这正是‘移步换景’与‘借景’的妙处。设计师通过曲折的小径、漏窗和远处的山影，把有限的院落与无限的自然融为一体，让人的心境随之开阔。",
        "audioPy": "Nán: Cānguān gǔdiǎn yuánlín shí, wèishénme zǒng juéde kōngjiān bǐ shíjì miànjī dà de duō? Nǚ: Zhè zhèngshì 'yíbù-huànjǐng' yǔ 'jièjǐng' de miàochù. Shèjìshī tōngguò qūzhé de xiǎojìng, lòuchuāng hé yuǎnchù de shānyǐng, bǎ yǒuxiàn de yuànluò yǔ wúxiàn de zìrán róngwéi yìtǐ, ràng rén de xīnjìng suízhī kāikuò.",
        "audioVi": "Nam: Khi tham quan vườn cổ điển, tại sao luôn thấy không gian rộng lớn hơn diện tích thực tế rất nhiều? Nữ: Đó chính là nét kỳ diệu của thủ pháp 'dời bước đổi cảnh' và 'mượn cảnh'. Kiến trúc sư qua lối nhỏ quanh co, cửa sổ thoáng và bóng núi xa xăm đã hòa quyện khoảng sân hữu hạn vào thiên nhiên vô hạn, giúp tâm cảnh con người rộng mở theo.",
        "opts": [
          "Tạo cảm giác khép kín và tách biệt với thiên nhiên",
          "Hòa quyện không gian hữu hạn với thiên nhiên để mở rộng tâm cảnh",
          "Tiết kiệm tối đa vật liệu xây dựng truyền thống",
          "Thể hiện sự xa hoa bằng diện tích mặt bằng cực lớn"
        ],
        "ans": 1,
        "exp": "Kiến trúc sư giải thích nghệ thuật này giúp '把有限的院落与无限的自然融为一体，让人的心境随之开阔'."
      },
      {
        "id": "l6_06_q3",
        "partLabel": "Phần 2 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe hội thoại: Theo chuyên gia tâm lý, thái độ lành mạnh với 'sự không hoàn hảo' là gì?",
        "audioZh": "女：很多年轻人对自身要求极高，哪怕一点小瑕疵也会自责半天，您有什么建议？ 男：追求卓越固然值得鼓励，但完美主义往往伴随着沉重的精神内耗。学会接纳自己的局限，把精力投入到力所能及的改善中，内心反而会变得更强大、更自由。",
        "audioPy": "Nǚ: Hěn duō niánqīngrén duì zìshēn yāoqiú jí gāo, nǎpà yìdiǎn xiǎo xiácī yě huì zìzé bàntiān, nín yǒu shénme jiànyì? Nán: Zhuīqiú zhuóyuè gùrán zhídé gǔlì, dàn wánměi zhǔyì wǎngwǎng bànsuí zhe chénzhòng de jīngshén nèihào. Xuéhuì jiēnà zìjǐ de júxiàn, bǎ jīnglì tóurù dào lìsuǒ-néngjí de gǎishàn zhōng, nèixīn fǎn'ér huì biàn de gèng qiángdà, gèng zìyóu.",
        "audioVi": "Nữ: Nhiều bạn trẻ đòi hỏi bản thân cực cao, chỉ một khiếm khuyết nhỏ cũng tự trách hồi lâu, ông có lời khuyên gì không? Nam: Theo đuổi sự xuất sắc tất nhiên đáng khích lệ, nhưng chủ nghĩa hoàn hảo thường đi kèm sự hao tổn tinh thần nặng nề. Học cách chấp nhận giới hạn của bản thân và dồn tâm sức vào những cải thiện trong khả năng, nội tâm lại trở nên mạnh mẽ và tự do hơn.",
        "opts": [
          "Giữ vững chủ nghĩa hoàn hảo trong mọi việc",
          "Chấp nhận giới hạn bản thân và tập trung cải thiện trong khả năng",
          "Từ bỏ hoàn toàn mọi mục tiêu phấn đấu",
          "Tự trách mình nhiều hơn để tiến bộ nhanh"
        ],
        "ans": 1,
        "exp": "Chuyên gia khuyên '接纳自己的局限' (chấp nhận giới hạn) và dồn sức cho những cải thiện trong tầm tay để tránh hao tổn tinh thần."
      },
      {
        "id": "l6_06_q4",
        "partLabel": "Phần 3 • Bài nói & Bình luận",
        "type": "mcq",
        "prompt": "Nghe bài nói: Tác giả muốn nhắc nhở điều gì qua hình ảnh 'mùa màng và thời gian'?",
        "audioZh": "我们常常高估一年内能完成的事，却低估十年坚持所能带来的蜕变。春播秋收急不得，生命中真正厚重的果实，都需要阳光、雨露与时间的共同滋养。耐心地耕耘当下，时间自会给你满意的回响。",
        "audioPy": "Wǒmen chángcháng gāogū yì nián nèi néng wánchéng de shì, què dīgū shí nián jiānchí suǒ néng dàilái de tuìbiàn. Chūnbō-qiūshōu jí bu de, shēngmìng zhōng zhēnzhèng hòuzhòng de guǒshí, dōu xūyào yángguāng, yǔlù yǔ shíjiān de gòngtóng zīyǎng. Nàixīn de gēngyún dāngxià, shíjiān zì huì gěi nǐ mǎnyì de huíxiǎng.",
        "audioVi": "Chúng ta thường đánh giá quá cao những gì có thể làm trong một năm, nhưng lại đánh giá thấp sự lột xác mà mười năm kiên trì mang lại. Xuân gieo thu gặt không thể vội vàng, những trái ngọt thực sự nặng trĩu trong đời đều cần nắng gió, sương mưa và thời gian cùng nuôi dưỡng. Kiên nhẫn vun trồng hiện tại, thời gian tự khắc sẽ hồi đáp xứng đáng.",
        "opts": [
          "Thành công lớn luôn đến chỉ trong vòng một năm",
          "Kiên nhẫn vun trồng dài hạn sẽ đem lại thành quả xứng đáng",
          "Không cần nỗ lực ở hiện tại vì thời gian sẽ tự giải quyết",
          "Đặt mục tiêu ngắn hạn luôn hiệu quả hơn mục tiêu dài hạn"
        ],
        "ans": 1,
        "exp": "Thông điệp cốt lõi: không thể nóng vội ('急不得'), hãy kiên nhẫn vun trồng dài lâu ('耐心地耕耘当下')."
      },
      {
        "id": "l6_06_q5",
        "partLabel": "Phần 3 • Bài nói & Bình luận",
        "type": "mcq",
        "prompt": "Nghe đoạn tản văn: Ý nghĩa của 'hạnh phúc giản dị' trong bài là gì?",
        "audioZh": "快乐有时并不需要惊天动地的壮举，它或许就藏在清晨窗台的一缕阳光里、雨夜归来的一碗热汤中，或是与挚友无言相对却彼此心安的片刻。唯有敏锐地感知微小的美好，生活才不会在匆忙中黯然失色。",
        "audioPy": "Kuàilè yǒushí bìng bù xūyào jīngtiān-dòngdì de zhuàngjǔ, tā huòxǔ jiù cáng zài qīngchén chuāngtái de yì lǚ yángguāng lǐ, yǔyè guīlái de yì wǎn rètāng zhōng, huòshì yǔ zhìyǒu wúyán xiāngduì què bǐcǐ xīn'ān de piànkè. Wéiyǒu mǐnruì de gǎnzhī wēixiǎo de měihǎo, shēnghuó cái bú huì zài cōngmáng zhōng ànrán-shīsè.",
        "audioVi": "Niềm vui đôi khi chẳng cần những chiến công kinh thiên động địa, nó có lẽ ẩn ngay trong tia nắng sớm bên bệ cửa sổ, bát canh nóng khi đêm mưa trở về, hay khoảnh khắc lặng lẽ bên tri kỷ mà lòng thấy bình yên. Chỉ khi nhạy bén cảm nhận những điều tốt đẹp nhỏ bé, cuộc sống mới không phai nhạt sắc màu giữa bộn bề vội vã.",
        "opts": [
          "Chỉ những thành tựu vĩ đại mới mang lại niềm vui thật sự",
          "Biết trân trọng và cảm nhận những khoảnh khắc tốt đẹp bình dị hằng ngày",
          "Cần sống thật vội vã để làm được nhiều việc lớn",
          "Niềm vui chỉ có được khi ở một mình tách biệt xã hội"
        ],
        "ans": 1,
        "exp": "Bài khuyên biết cảm nhận những điều đẹp đẽ nhỏ bé ('敏锐地感知微小的美好') trong đời sống thường nhật."
      }
    ],
    "dictations": [
      {
        "id": "l6_06_d1",
        "zh": "接纳不完美，才能收获内心的从容。",
        "py": "Jiēnà bù wánměi, cái néng shōuhuò nèixīn de cóngróng.",
        "vi": "Chấp nhận sự không hoàn hảo mới có thể gặt hái sự ung dung trong tâm hồn.",
        "hint": "Chấp nhận không hoàn hảo (接纳不完美) + ung dung nội tâm (从容)"
      },
      {
        "id": "l6_06_d2",
        "zh": "时间终将犒赏每一个脚踏实地的人。",
        "py": "Shíjiān zhōngjiāng kàoshǎng měi yí gè jiǎotà-shídì de rén.",
        "vi": "Thời gian cuối cùng sẽ đền đáp xứng đáng cho mỗi người bước đi vững chãi.",
        "hint": "Thời gian + ban thưởng (犒赏) + người thực tế vững chãi (脚踏实地)"
      }
    ]
  }
];

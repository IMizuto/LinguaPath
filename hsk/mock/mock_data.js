// LinguaPath HSK 1-6 Full Mock Tests (12 bo de doc lap)
window.LP_HSK_MOCK_TESTS = [
  {
    "id": "mock_hsk1_1",
    "level": 1,
    "testNo": 1,
    "badge": "HSK 1 • Đề thi thử số 1",
    "title": "Đề thi thử HSK 1 — Đề số 1",
    "subtitle": "Đời sống hằng ngày, mua sắm & thời tiết • 10 câu Nghe + 10 câu Đọc • 35 phút",
    "durationSec": 2100,
    "maxScore": 200,
    "passScore": 120,
    "listening": [
      {
        "id": "m11_l1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "今天很冷。",
        "statementPy": "Jīntiān hěn lěng.",
        "audioZh": "今天三十五度，天气太热了。",
        "audioPy": "Jīntiān sānshíwǔ dù, tiānqì tài rè le.",
        "audioVi": "Hôm nay 35 độ, thời tiết nóng quá rồi.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Audio nói thời tiết hôm nay nóng quá ('天气太热了'), trái ngược với nhận định '今天很冷' (Hôm nay rất lạnh)."
      },
      {
        "id": "m11_l2",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "他在医院工作。",
        "statementPy": "Tā zài yīyuàn gōngzuò.",
        "audioZh": "我哥哥是医生，他在医院工作。",
        "audioPy": "Wǒ gēge shì yīshēng, tā zài yīyuàn gōngzuò.",
        "audioVi": "Anh trai tôi là bác sĩ, anh ấy làm việc ở bệnh viện.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Audio khớp hoàn toàn: anh trai là bác sĩ và làm việc ở bệnh viện ('在医院工作')."
      },
      {
        "id": "m11_l3",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "桌上有一本书。",
        "statementPy": "Zhuō shàng yǒu yì běn shū.",
        "audioZh": "桌子上放着两个杯子，没有书。",
        "audioPy": "Zhuōzi shàng fàngzhe liǎng ge bēizi, méiyǒu shū.",
        "audioVi": "Trên bàn đặt hai cái cốc, không có sách.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Audio nói trên bàn chỉ có hai cái cốc và '没有书' (không có sách), nên nhận định trên là Sai."
      },
      {
        "id": "m11_l4",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "她会做中国菜。",
        "statementPy": "Tā huì zuò Zhōngguó cài.",
        "audioZh": "我妈妈很喜欢做饭，她做的中国菜非常好吃。",
        "audioPy": "Wǒ māma hěn xǐhuan zuòfàn, tā zuò de Zhōngguó cài fēicháng hǎochī.",
        "audioVi": "Mẹ tôi rất thích nấu ăn, món Trung Quốc mẹ nấu vô cùng ngon.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Mẹ thích nấu ăn và nấu món Trung Quốc rất ngon, chứng tỏ bà biết nấu món Trung Quốc ('会做中国菜')."
      },
      {
        "id": "m11_l5",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ muốn mua mấy cân táo?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：请问，您要买什么水果？ 女：给我来四斤苹果吧，谢谢。",
        "audioPy": "Nán: Qǐngwèn, nín yào mǎi shénme shuǐguǒ? Nǚ: Gěi wǒ lái sì jīn píngguǒ ba, xièxie.",
        "audioVi": "Nam: Xin hỏi, cô muốn mua hoa quả gì ạ? Nữ: Lấy cho tôi 4 cân táo nhé, cảm ơn.",
        "opts": [
          "2 cân",
          "3 cân",
          "4 cân",
          "5 cân"
        ],
        "ans": 2,
        "exp": "Người nữ nói rõ '给我来四斤苹果吧' (Lấy cho tôi 4 cân táo nhé)."
      },
      {
        "id": "m11_l6",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Bây giờ là mấy giờ?",
        "statement": "",
        "statementPy": "",
        "audioZh": "女：现在几点了？我们要迟到了吗？ 男：现在十点十分，不晚。",
        "audioPy": "Nǚ: Xiànzài jǐ diǎn le? Wǒmen yào chídào le ma? Nán: Xiànzài shí diǎn shí fēn, bù wǎn.",
        "audioVi": "Nữ: Bây giờ mấy giờ rồi? Chúng ta sắp muộn chưa? Nam: Bây giờ là 10 giờ 10 phút, chưa muộn.",
        "opts": [
          "9 giờ 10 phút",
          "10 giờ 05 phút",
          "10 giờ 10 phút",
          "10 giờ 50 phút"
        ],
        "ans": 2,
        "exp": "Người nam trả lời '现在十点十分' (10 giờ 10 phút)."
      },
      {
        "id": "m11_l7",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nam đi Thượng Hải bằng phương tiện gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "女：你下星期怎么去上海？坐飞机吗？ 男：不坐飞机，我坐火车去。",
        "audioPy": "Nǚ: Nǐ xià xīngqī zěnme qù Shànghǎi? Zuò fēijī ma? Nán: Bú zuò fēijī, wǒ zuò huǒchē qù.",
        "audioVi": "Nữ: Tuần sau bạn đi Thượng Hải bằng gì? Đi máy bay à? Nam: Không đi máy bay, tôi đi tàu hỏa.",
        "opts": [
          "Máy bay",
          "Tàu hỏa",
          "Xe buýt",
          "Xe tắc-xi"
        ],
        "ans": 1,
        "exp": "Người nam nói '不坐飞机，我坐火车去' (Không đi máy bay, tôi đi tàu hỏa)."
      },
      {
        "id": "m11_l8",
        "partLabel": "Phần 3 • Hội thoại & Hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Con mèo nhỏ đang ở đâu?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：小花猫去哪儿了？我找不到了。 女：你看，它在椅子下面睡觉呢。",
        "audioPy": "Nán: Xiǎo huāmāo qù nǎr le? Wǒ zhǎo bú dào le. Nǚ: Nǐ kàn, tā zài yǐzi xiàmiàn shuìjiào ne.",
        "audioVi": "Nam: Con mèo hoa nhỏ đi đâu rồi? Tôi tìm không thấy. Nữ: Bạn xem, nó đang ngủ ở dưới ghế kìa.",
        "opts": [
          "Trên bàn học",
          "Dưới cái ghế",
          "Trong phòng ngủ",
          "Ngoài cửa hàng"
        ],
        "ans": 1,
        "exp": "Người nữ chỉ vị trí '在椅子下面睡觉' (đang ngủ ở phía dưới cái ghế)."
      },
      {
        "id": "m11_l9",
        "partLabel": "Phần 3 • Hội thoại & Hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Áo khoác của người nữ giá bao nhiêu tiền?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：你的新衣服真漂亮，多少钱买的？ 女：不贵，才九十块钱。",
        "audioPy": "Nán: Nǐ de xīn yīfu zhēn piàoliang, duōshao qián mǎi de? Nǚ: Bú guì, cái jiǔshí kuài qián.",
        "audioVi": "Nam: Bộ quần áo mới của bạn đẹp thật đấy, mua bao nhiêu tiền vậy? Nữ: Không đắt, chỉ 90 tệ thôi.",
        "opts": [
          "60 tệ",
          "70 tệ",
          "80 tệ",
          "90 tệ"
        ],
        "ans": 3,
        "exp": "Người nữ nói '才九十块钱' (chỉ 90 đồng/tệ)."
      },
      {
        "id": "m11_l10",
        "partLabel": "Phần 3 • Hội thoại & Hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Tối qua người nói đi ngủ lúc mấy giờ?",
        "statement": "",
        "statementPy": "",
        "audioZh": "昨天晚上我看了一个电影，十一点才回家，十二点睡觉。",
        "audioPy": "Zuótiān wǎnshang wǒ kànle yí ge diànyǐng, shíyī diǎn cái huí jiā, shí'èr diǎn shuìjiào.",
        "audioVi": "Tối qua tôi xem một bộ phim, 11 giờ mới về nhà, 12 giờ đi ngủ.",
        "opts": [
          "10 giờ tối",
          "11 giờ tối",
          "12 giờ đêm",
          "9 giờ tối"
        ],
        "ans": 2,
        "exp": "Đoạn văn nói '十一点才回家，十二点睡觉' (11 giờ về nhà, 12 giờ đi ngủ)."
      }
    ],
    "reading": [
      {
        "id": "m11_r1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "kind": "tf",
        "passageZh": "星期天我喜欢在家里看电视，不想出门。",
        "passagePy": "Xīngqītiān wǒ xǐhuan zài jiā lǐ kàn diànshì, bù xiǎng chūmén.",
        "passageVi": "Chủ nhật tôi thích xem ti-vi ở nhà, không muốn ra ngoài.",
        "q": "他星期天想去商店买东西。",
        "qPy": "Tā xīngqītiān xiǎng qù shāngdiàn mǎi dōngxi.",
        "orderItems": [],
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Đoạn văn nói Chủ nhật thích xem ti-vi ở nhà và không muốn ra ngoài ('不想出门'), không phải muốn đi cửa hàng mua đồ."
      },
      {
        "id": "m11_r2",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "kind": "tf",
        "passageZh": "李老师今年四十二岁，他教我们写汉字。",
        "passagePy": "Lǐ lǎoshī jīnnián sìshí'èr suì, tā jiāo wǒmen xiě Hànzì.",
        "passageVi": "Thầy Lý năm nay 42 tuổi, thầy dạy chúng tôi viết chữ Hán.",
        "q": "李老师教学生写汉字。",
        "qPy": "Lǐ lǎoshī jiāo xuésheng xiě Hànzì.",
        "orderItems": [],
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Câu nhận định khớp hoàn toàn với nội dung bài đọc: thầy Lý dạy học sinh viết chữ Hán."
      },
      {
        "id": "m11_r3",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "kind": "tf",
        "passageZh": "我不会开车，每天坐出租车去公司。",
        "passagePy": "Wǒ bú huì kāichē, měitiān zuò chūzūchē qù gōngsī.",
        "passageVi": "Tôi không biết lái xe, mỗi ngày đi xe tắc-xi đến công ty.",
        "q": "他每天自己开车去上班。",
        "qPy": "Tā měitiān zìjǐ kāichē qù shàngbān.",
        "orderItems": [],
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Bài đọc nói rõ '不会开车' (không biết lái xe) và đi xe tắc-xi ('坐出租车'), nên nói tự lái xe là Sai."
      },
      {
        "id": "m11_r4",
        "partLabel": "Phần 2 • Ghép câu đối đáp",
        "kind": "match",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn câu trả lời phù hợp cho câu hỏi: “请问，北京火车站在哪儿？”",
        "qPy": "Qǐngwèn, Běijīng huǒchēzhàn zài nǎr?",
        "orderItems": [],
        "opts": [
          "就在前面，坐五分钟车就到了。",
          "我买了两张电影票。",
          "今天的米饭很好吃。",
          "他今年二十五岁了。"
        ],
        "ans": 0,
        "exp": "Hỏi đường đến ga tàu hỏa Bắc Kinh ('在哪儿？'), câu đáp hợp lý là '就在前面，坐五分钟车就到了。' (Ngay phía trước, đi xe 5 phút là tới)."
      },
      {
        "id": "m11_r5",
        "partLabel": "Phần 2 • Ghép câu đối đáp",
        "kind": "match",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn câu trả lời phù hợp cho câu hỏi: “今天下午谁和你一起去喝茶？”",
        "qPy": "Jīntiān xiàwǔ shéi hé nǐ yìqǐ qù hē chá?",
        "orderItems": [],
        "opts": [
          "一杯热茶十块钱。",
          "我的好朋友小张和我一起去。",
          "茶杯在桌子上面。",
          "下午四点半下雨了。"
        ],
        "ans": 1,
        "exp": "Câu hỏi có đại từ nghi vấn '谁' (ai), nên đáp án phải chỉ người: '我的好朋友小张和我一起去。' (Bạn thân Tiểu Trương đi cùng tôi)."
      },
      {
        "id": "m11_r6",
        "partLabel": "Phần 3 • Điền từ vào chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ đúng điền vào chỗ trống: “外面在下雨，你多穿（      ）衣服再出去。”",
        "qPy": "Wàimiàn zài xiàyǔ, nǐ duō chuān ( ... ) yīfu zài chūqù.",
        "orderItems": [],
        "opts": [
          "一点儿",
          "几个",
          "多少",
          "什么"
        ],
        "ans": 0,
        "exp": "'多穿一点儿衣服' nghĩa là 'mặc thêm một chút quần áo'; '几个' dùng cho danh từ đếm được số ít nhưng không đi trực tiếp sau '多穿' theo ngữ cảnh này, '一点儿' (một chút) là tự nhiên và chuẩn HSK 1 nhất."
      },
      {
        "id": "m11_r7",
        "partLabel": "Phần 3 • Điền từ vào chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ đúng điền vào chỗ trống: “对不起，我不（      ）那个人是谁。”",
        "qPy": "Duìbuqǐ, wǒ bú ( ... ) nà ge rén shì shéi.",
        "orderItems": [],
        "opts": [
          "认识",
          "睡觉",
          "喝水",
          "写字"
        ],
        "ans": 0,
        "exp": "'认识' (rènshi) có nghĩa là quen biết; '我不认识那个人' (Tôi không quen người kia)."
      },
      {
        "id": "m11_r8",
        "partLabel": "Phần 4 • Đọc đoạn ngắn & Chọn đáp án",
        "kind": "mcq",
        "passageZh": "我是越南人，现在在广州工作。每天早上七点半我喝一杯咖啡，然后坐公共汽车去公司。中午我和同事一起吃午饭。",
        "passagePy": "Wǒ shì Yuènán rén, xiànzài zài Guǎngzhōu gōngzuò. Měitiān zǎoshang qī diǎn bàn wǒ hē yì bēi kāfēi, ránhòu zuò gōnggòng qìchē qù gōngsī. Zhōngwǔ wǒ hé tóngshì yìqǐ chī wǔfàn.",
        "passageVi": "Tôi là người Việt Nam, hiện đang làm việc ở Quảng Châu. Mỗi sáng 7 giờ rưỡi tôi uống một cốc cà phê, sau đó đi xe buýt đến công ty. Buổi trưa tôi ăn cơm trưa cùng đồng nghiệp.",
        "q": "Người viết hiện tại đang sống và làm việc ở thành phố nào?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Bắc Kinh",
          "Thượng Hải",
          "Quảng Châu",
          "Hà Nội"
        ],
        "ans": 2,
        "exp": "Trong đoạn văn có câu '现在在广州工作' (hiện đang làm việc ở Quảng Châu)."
      },
      {
        "id": "m11_r9",
        "partLabel": "Phần 4 • Đọc đoạn ngắn & Chọn đáp án",
        "kind": "mcq",
        "passageZh": "昨天是爸爸的生日，妈妈去商店买了一个大蛋糕，我画了一张漂亮的画送给爸爸，爸爸高兴极了。",
        "passagePy": "Zuótiān shì bàba de shēngrì, māma qù shāngdiàn mǎile yí ge dà dàngāo, wǒ huàle yì zhāng piàoliang de huà sònggěi bàba, bàba gāoxìng jíle.",
        "passageVi": "Hôm qua là sinh nhật của bố, mẹ ra cửa hàng mua một chiếc bánh ga-tô lớn, tôi vẽ một bức tranh đẹp tặng bố, bố vui lắm.",
        "q": "Người con đã tặng món quà gì cho bố nhân ngày sinh nhật?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Một chiếc bánh ga-tô",
          "Một bức tranh tự vẽ",
          "Một quyển sách",
          "Một cái cốc mới"
        ],
        "ans": 1,
        "exp": "Đoạn văn nói '我画了一张漂亮的画送给爸爸' (tôi vẽ một bức tranh đẹp tặng bố); bánh ga-tô là mẹ mua."
      },
      {
        "id": "m11_r10",
        "partLabel": "Phần 4 • Đọc đoạn ngắn & Chọn đáp án",
        "kind": "mcq",
        "passageZh": "这家水果店的西瓜很甜，但是有点儿贵，一个要三十块钱。香蕉很便宜，四块钱一斤，所以我买了三斤香蕉。",
        "passagePy": "Zhè jiā shuǐguǒdiàn de xīguā hěn tián, dànshì yǒudiǎnr guì, yí ge yào sānshí kuài qián. Xiāngjiāo hěn piányi, sì kuài qián yì jīn, suǒyǐ wǒ mǎile sān jīn xiāngjiāo.",
        "passageVi": "Dưa hấu của tiệm hoa quả này rất ngọt, nhưng hơi đắt, một quả giá 30 tệ. Chuối rất rẻ, 4 tệ một cân, nên tôi đã mua 3 cân chuối.",
        "q": "Người viết đã trả bao nhiêu tiền để mua chuối?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "4 tệ",
          "12 tệ",
          "30 tệ",
          "34 tệ"
        ],
        "ans": 1,
        "exp": "Chuối giá 4 tệ một cân ('四块钱一斤') và người viết mua 3 cân ('三斤'), vậy tổng cộng hết 4 × 3 = 12 tệ."
      }
    ],
    "writing": []
  },
  {
    "id": "mock_hsk1_2",
    "level": 1,
    "testNo": 2,
    "badge": "HSK 1 • Đề thi thử số 2",
    "title": "Đề thi thử HSK 1 — Đề số 2",
    "subtitle": "Trường học, bạn bè & giao tiếp cơ bản • 10 câu Nghe + 10 câu Đọc • 35 phút",
    "durationSec": 2100,
    "maxScore": 200,
    "passScore": 120,
    "listening": [
      {
        "id": "m12_l1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "他认识王老师。",
        "statementPy": "Tā rènshi Wáng lǎoshī.",
        "audioZh": "王老师是我的汉语老师，我很喜欢上他的课。",
        "audioPy": "Wáng lǎoshī shì wǒ de Hànyǔ lǎoshī, wǒ hěn xǐhuan shàng tā de kè.",
        "audioVi": "Thầy Vương là giáo viên tiếng Hán của tôi, tôi rất thích học tiết của thầy.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Thầy Vương là giáo viên tiếng Hán của người nói, nên đương nhiên người nói quen biết thầy Vương ('认识王老师')."
      },
      {
        "id": "m12_l2",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "姐姐今年十八岁。",
        "statementPy": "Jiějie jīnnián shíbā suì.",
        "audioZh": "我姐姐二十二岁了，她在银行工作。",
        "audioPy": "Wǒ jiějie èrshí'èr suì le, tā zài yínháng gōngzuò.",
        "audioVi": "Chị gái tôi 22 tuổi rồi, chị ấy làm việc ở ngân hàng.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Audio nói chị gái 22 tuổi ('二十二岁'), không phải 18 tuổi ('十八岁')."
      },
      {
        "id": "m12_l3",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "她正在打电话。",
        "statementPy": "Tā zhèngzài dǎ diànhuà.",
        "audioZh": "妹妹在房间里给朋友打电话呢。",
        "audioPy": "Mèimei zài fángjiān lǐ gěi péngyou dǎ diànhuà ne.",
        "audioVi": "Em gái đang gọi điện thoại cho bạn ở trong phòng.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Audio nói '在房间里给朋友打电话呢' (đang gọi điện thoại cho bạn), khớp với nhận định trên."
      },
      {
        "id": "m12_l4",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "今天是星期三。",
        "statementPy": "Jīntiān shì xīngqīsān.",
        "audioZh": "昨天是星期四，今天是星期五，明天我们放假。",
        "audioPy": "Zuótiān shì xīngqīsì, jīntiān shì xīngqīwǔ, míngtiān wǒmen fàngjià.",
        "audioVi": "Hôm qua là thứ Năm, hôm nay là thứ Sáu, ngày mai chúng tôi được nghỉ.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Audio nói hôm nay là thứ Sáu ('今天是星期五'), không phải thứ Tư ('星期三')."
      },
      {
        "id": "m12_l5",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Ngày mai người nam muốn làm gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "女：明天上午你有空吗？我们去买东西吧。 男：明天上午我要去医院看朋友。",
        "audioPy": "Nǚ: Míngtiān shàngwǔ nǐ yǒukòng ma? Wǒmen qù mǎi dōngxi ba. Nán: Míngtiān shàngwǔ wǒ yào qù yīyuàn kàn péngyou.",
        "audioVi": "Nữ: Sáng mai bạn có rảnh không? Chúng mình đi mua đồ nhé. Nam: Sáng mai tôi phải đến bệnh viện thăm bạn.",
        "opts": [
          "Đi mua đồ ở cửa hàng",
          "Đến bệnh viện thăm bạn",
          "Ở nhà xem ti-vi",
          "Đến trường học bài"
        ],
        "ans": 1,
        "exp": "Người nam trả lời '要去医院看朋友' (phải đến bệnh viện thăm bạn)."
      },
      {
        "id": "m12_l6",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Chữ Hán mà người nữ nhắc tới viết như thế nào?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：这个汉字怎么写？你能教我吗？ 女：这个字很简单，我写给你看。",
        "audioPy": "Nán: Zhège Hànzì zěnme xiě? Nǐ néng jiāo wǒ ma? Nǚ: Zhège zì hěn jiǎndān, wǒ xiě gěi nǐ kàn.",
        "audioVi": "Nam: Chữ Hán này viết thế nào? Bạn dạy tôi được không? Nữ: Chữ này rất đơn giản, để tôi viết cho bạn xem.",
        "opts": [
          "Rất khó viết",
          "Rất đơn giản",
          "Rất nhiều nét",
          "Không đọc được"
        ],
        "ans": 1,
        "exp": "Người nữ nói '这个字很简单' (chữ này rất đơn giản)."
      },
      {
        "id": "m12_l7",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ đến từ nước nào?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：请问，你是英国人吗？ 女：不是，我是美国人，我来中国学汉语。",
        "audioPy": "Nán: Qǐngwèn, nǐ shì Yīngguó rén ma? Nǚ: Bú shì, wǒ shì Měiguó rén, wǒ lái Zhōngguó xué Hànyǔ.",
        "audioVi": "Nam: Xin hỏi, bạn là người Anh phải không? Nữ: Không phải, tôi là người Mỹ, tôi sang Trung Quốc học tiếng Hán.",
        "opts": [
          "Trung Quốc",
          "Nước Anh",
          "Nước Mỹ",
          "Việt Nam"
        ],
        "ans": 2,
        "exp": "Người nữ trả lời '我是美国人' (Tôi là người Mỹ)."
      },
      {
        "id": "m12_l8",
        "partLabel": "Phần 3 • Hội thoại & Hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nam muốn ăn món gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "女：午饭你想吃米饭还是吃面条？ 男：我不想吃米饭，给我一碗牛肉面吧。",
        "audioPy": "Nǚ: Wǔfàn nǐ xiǎng chī mǐfàn háishi chī miàntiáo? Nán: Wǒ bù xiǎng chī mǐfàn, gěi wǒ yì wǎn niúròumiàn ba.",
        "audioVi": "Nữ: Bữa trưa bạn muốn ăn cơm hay ăn mì? Nam: Tôi không muốn ăn cơm, cho tôi một bát mì thịt bò nhé.",
        "opts": [
          "Cơm trắng",
          "Bánh bao",
          "Mì thịt bò",
          "Sủi cảo"
        ],
        "ans": 2,
        "exp": "Người nam gọi '一碗牛肉面' (một bát mì thịt bò)."
      },
      {
        "id": "m12_l9",
        "partLabel": "Phần 3 • Hội thoại & Hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Lớp học có tất cả bao nhiêu học sinh?",
        "statement": "",
        "statementPy": "",
        "audioZh": "女：你们班有多少个学生？ 男：有八个男同学，十个女同学。",
        "audioPy": "Nǚ: Nǐmen bān yǒu duōshao ge xuésheng? Nán: Yǒu bā ge nán tóngxué, shí ge nǚ tóngxué.",
        "audioVi": "Nữ: Lớp các bạn có bao nhiêu học sinh? Nam: Có 8 bạn nam và 10 bạn nữ.",
        "opts": [
          "8 học sinh",
          "10 học sinh",
          "16 học sinh",
          "18 học sinh"
        ],
        "ans": 3,
        "exp": "Lớp có 8 bạn nam + 10 bạn nữ = 18 học sinh."
      },
      {
        "id": "m12_l10",
        "partLabel": "Phần 3 • Hội thoại & Hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Cuối tuần họ sẽ đi đâu?",
        "statement": "",
        "statementPy": "",
        "audioZh": "这周六天气很好，我和同学打算去山上看花，顺便拍几张照片。",
        "audioPy": "Zhè zhōuliù tiānqì hěn hǎo, wǒ hé tóngxué dǎsuàn qù shān shàng kàn huā, shùnbiàn pāi jǐ zhāng zhàopiàn.",
        "audioVi": "Thứ Bảy tuần này thời tiết rất đẹp, tôi và bạn học dự định lên núi ngắm hoa, tiện thể chụp vài bức ảnh.",
        "opts": [
          "Đi xem phim",
          "Lên núi ngắm hoa",
          "Đi bơi ở bể bơi",
          "Ở nhà đọc sách"
        ],
        "ans": 1,
        "exp": "Đoạn văn nói '打算去山上看花' (dự định lên núi ngắm hoa)."
      }
    ],
    "reading": [
      {
        "id": "m12_r1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "kind": "tf",
        "passageZh": "我的电脑在桌子上，旁边有一杯热茶。",
        "passagePy": "Wǒ de diànnǎo zài zhuōzi shàng, pángbiān yǒu yì bēi rè chá.",
        "passageVi": "Máy tính của tôi ở trên bàn, bên cạnh có một cốc trà nóng.",
        "q": "桌子上有电脑和茶。",
        "qPy": "Zhuōzi shàng yǒu diànnǎo hé chá.",
        "orderItems": [],
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Trên bàn có máy tính và bên cạnh có cốc trà, nên nhận định trên là Đúng."
      },
      {
        "id": "m12_r2",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "kind": "tf",
        "passageZh": "现在是十二月，北京已经下雪了，非常冷。",
        "passagePy": "Xiànzài shì shí'èr yuè, Běijīng yǐjīng xiàxuě le, fēicháng lěng.",
        "passageVi": "Bây giờ là tháng 12, Bắc Kinh đã có tuyết rơi rồi, vô cùng lạnh.",
        "q": "十二月北京的天气很热。",
        "qPy": "Shí'èr yuè Běijīng de tiānqì hěn rè.",
        "orderItems": [],
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Tháng 12 Bắc Kinh có tuyết và '非常冷' (vô cùng lạnh), không phải '很热' (rất nóng)."
      },
      {
        "id": "m12_r3",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "kind": "tf",
        "passageZh": "我女儿今年六岁，她每天都高高兴兴地去上学。",
        "passagePy": "Wǒ nǚ'ér jīnnián liù suì, tā měitiān dōu gāogāoxìngxìng de qù shàngxué.",
        "passageVi": "Con gái tôi năm nay 6 tuổi, bé ngày nào cũng vui vẻ đi học.",
        "q": "他女儿不喜欢去学校。",
        "qPy": "Tā nǚ'ér bù xǐhuan qù xuéxiào.",
        "orderItems": [],
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Cô bé '高高兴兴地去上学' (vui vẻ đi học mỗi ngày), trái với nhận định không thích đi học."
      },
      {
        "id": "m12_r4",
        "partLabel": "Phần 2 • Ghép câu đối đáp",
        "kind": "match",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn câu đáp lại lời cảm ơn: “谢谢你帮我拿行李！”",
        "qPy": "Xièxie nǐ bāng wǒ ná xíngli!",
        "orderItems": [],
        "opts": [
          "不客气，这是我应该做的。",
          "我现在去机场。",
          "行李箱很重。",
          "明天见，再见！"
        ],
        "ans": 0,
        "exp": "Khi ai đó nói cảm ơn ('谢谢'), câu đáp chuẩn mực nhất là '不客气' (Không có gì / Đừng khách sáo)."
      },
      {
        "id": "m12_r5",
        "partLabel": "Phần 2 • Ghép câu đối đáp",
        "kind": "match",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn câu hỏi phù hợp cho câu trả lời: “我坐飞机去，两个小时就到了。”",
        "qPy": "Wǒ zuò fēijī qù, liǎng ge xiǎoshí jiù dào le.",
        "orderItems": [],
        "opts": [
          "你什么时候回来？",
          "你怎么去北京？",
          "北京的天气怎么样？",
          "你在哪儿买飞机票？"
        ],
        "ans": 1,
        "exp": "Câu trả lời nêu phương tiện ('坐飞机去' — đi máy bay), nên câu hỏi phải dùng '怎么' (bằng cách nào): '你怎么去北京？'."
      },
      {
        "id": "m12_r6",
        "partLabel": "Phần 3 • Điền từ vào chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ đúng điền vào chỗ trống: “请大家先看（      ），然后回答我的问题。”",
        "qPy": "Qǐng dàjiā xiān kàn ( ... ), ránhòu huídá wǒ de wèntí.",
        "orderItems": [],
        "opts": [
          "黑板",
          "天气",
          "水果",
          "飞机"
        ],
        "ans": 0,
        "exp": "Trong lớp học, giáo viên thường nói '看黑板' (nhìn lên bảng đen), rồi trả lời câu hỏi."
      },
      {
        "id": "m12_r7",
        "partLabel": "Phần 3 • Điền từ vào chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ đúng điền vào chỗ trống: “我（      ）学了一年汉语，现在能听懂一点儿了。”",
        "qPy": "Wǒ ( ... ) xuéle yì nián Hànyǔ, xiànzài néng tīngdǒng yìdiǎnr le.",
        "orderItems": [],
        "opts": [
          "已经",
          "太",
          "哪儿",
          "几"
        ],
        "ans": 0,
        "exp": "'已经...了' biểu thị hành động đã xảy ra được một năm ('我已经学了一年汉语' — Tôi đã học tiếng Hán được một năm rồi)."
      },
      {
        "id": "m12_r8",
        "partLabel": "Phần 4 • Đọc đoạn ngắn & Chọn đáp án",
        "kind": "mcq",
        "passageZh": "小兰是我的同班同学，她特别喜欢猫。她家里养了两只白色的猫，每天下课回家她都要先喂猫吃鱼。",
        "passagePy": "Xiǎolán shì wǒ de tóngbān tóngxué, tā tèbié xǐhuan māo. Tā jiā lǐ yǎngle liǎng zhī báisè de māo, měitiān xiàkè huí jiā tā dōu yào xiān wèi māo chī yú.",
        "passageVi": "Tiểu Lan là bạn cùng lớp của tôi, bạn ấy đặc biệt thích mèo. Nhà bạn ấy nuôi hai con mèo màu trắng, mỗi ngày tan học về nhà bạn ấy đều cho mèo ăn cá trước.",
        "q": "Nhà của Tiểu Lan nuôi những con vật gì?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Một con chó đen",
          "Hai con mèo trắng",
          "Hai con cá nhỏ",
          "Ba con mèo vàng"
        ],
        "ans": 1,
        "exp": "Đoạn văn nói '养了两只白色的猫' (nuôi hai con mèo màu trắng)."
      },
      {
        "id": "m12_r9",
        "partLabel": "Phần 4 • Đọc đoạn ngắn & Chọn đáp án",
        "kind": "mcq",
        "passageZh": "今天上午八点半我有汉语课，十点半下课。中午十一点半我去图书馆找朋友，下午两点我们一起去打篮球。",
        "passagePy": "Jīntiān shàngwǔ bā diǎn bàn wǒ yǒu Hànyǔ kè, shí diǎn bàn xiàkè. Zhōngwǔ shíyī diǎn bàn wǒ qù túshūguǎn zhǎo péngyou, xiàwǔ liǎng diǎn wǒmen yìqǐ qù dǎ lánqiú.",
        "passageVi": "Sáng nay 8 giờ rưỡi tôi có tiết tiếng Hán, 10 giờ rưỡi tan học. Trưa 11 giờ rưỡi tôi đến thư viện tìm bạn, 2 giờ chiều chúng tôi cùng đi chơi bóng rổ.",
        "q": "Lúc 11 giờ 30 trưa, người viết đi đâu?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Đến lớp học tiếng Hán",
          "Đến sân bóng rổ",
          "Đến thư viện tìm bạn",
          "Về nhà ăn cơm"
        ],
        "ans": 2,
        "exp": "Đoạn văn ghi rõ '中午十一点半我去图书馆找朋友' (11 giờ rưỡi trưa đến thư viện tìm bạn)."
      },
      {
        "id": "m12_r10",
        "partLabel": "Phần 4 • Đọc đoạn ngắn & Chọn đáp án",
        "kind": "mcq",
        "passageZh": "张先生上个月去南京旅游了一周。他觉得南京很美，那里的盐水鸭也很好吃，他拍了很多好看的照片。",
        "passagePy": "Zhāng xiānsheng shàng ge yuè qù Nánjīng lǚyóule yì zhōu. Tā juéde Nánjīng hěn měi, nàlǐ de yánshuǐyā yě hěn hǎochī, tā pāile hěn duō hǎokàn de zhàopiàn.",
        "passageVi": "Ông Trương tháng trước đã đi du lịch Nam Kinh một tuần. Ông thấy Nam Kinh rất đẹp, vịt muối ở đó cũng rất ngon, ông đã chụp nhiều ảnh đẹp.",
        "q": "Ông Trương đi du lịch Nam Kinh vào lúc nào và trong bao lâu?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Tuần trước, đi 3 ngày",
          "Tháng trước, đi 1 tuần",
          "Tháng này, đi 1 tuần",
          "Năm ngoái, đi 1 tháng"
        ],
        "ans": 1,
        "exp": "Đoạn văn ghi '上个月去南京旅游了一周' (tháng trước đi du lịch Nam Kinh một tuần)."
      }
    ],
    "writing": []
  },
  {
    "id": "mock_hsk2_1",
    "level": 2,
    "testNo": 1,
    "badge": "HSK 2 • Đề thi thử số 1",
    "title": "Đề thi thử HSK 2 — Đề số 1",
    "subtitle": "Giao thông, sức khỏe & công việc hằng ngày • 10 câu Nghe + 10 câu Đọc • 50 phút",
    "durationSec": 3000,
    "maxScore": 200,
    "passScore": 120,
    "listening": [
      {
        "id": "m21_l1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "他每天走路去地铁站。",
        "statementPy": "Tā měitiān zǒulù qù dìtiězhàn.",
        "audioZh": "我家离地铁站很近，走路只要五分钟，所以我每天都走着去。",
        "audioPy": "Wǒ jiā lí dìtiězhàn hěn jìn, zǒulù zhǐ yào wǔ fēnzhōng, suǒyǐ wǒ měitiān dōu zǒuzhe qù.",
        "audioVi": "Nhà tôi cách ga tàu điện ngầm rất gần, đi bộ chỉ mất 5 phút, nên ngày nào tôi cũng đi bộ tới đó.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Audio nói rõ '每天都走着去' (mỗi ngày đều đi bộ đến ga tàu điện ngầm), hoàn toàn trùng khớp."
      },
      {
        "id": "m21_l2",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "王经理今天在办公室。",
        "statementPy": "Wáng jīnglǐ jīntiān zài bàngōngshì.",
        "audioZh": "王经理昨天去北京出差了，后天上午才回公司。",
        "audioPy": "Wáng jīnglǐ zuótiān qù Běijīng chūchāi le, hòutiān shàngwǔ cái huí gōngsī.",
        "audioVi": "Giám đốc Vương hôm qua đi công tác Bắc Kinh rồi, sáng ngày kia mới về công ty.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Giám đốc Vương đi công tác ở Bắc Kinh và ngày kia mới về, nên hôm nay không ở văn phòng."
      },
      {
        "id": "m21_l3",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "妹妹比姐姐高一点儿。",
        "statementPy": "Mèimei bǐ jiějie gāo yìdiǎnr.",
        "audioZh": "姐姐身高一米六八，妹妹比姐姐矮三厘米。",
        "audioPy": "Jiějie shēngāo yì mǐ liùbā, mèimei bǐ jiějie ǎi sān límǐ.",
        "audioVi": "Chị gái cao 1 mét 68, em gái thấp hơn chị gái 3 xen-ti-mét.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Audio nói '妹妹比姐姐矮三厘米' (em gái thấp hơn chị gái 3 xen-ti-mét), không phải cao hơn."
      },
      {
        "id": "m21_l4",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "他已经喝完药了。",
        "statementPy": "Tā yǐjīng hēwán yào le.",
        "audioZh": "弟弟感冒了，刚才已经喝了药，现在正躺在床上休息呢。",
        "audioPy": "Dìdi gǎnmào le, gāngcái yǐjīng hēle yào, xiànzài zhèng tǎng zài chuáng shàng xiūxi ne.",
        "audioVi": "Em trai bị cảm rồi, lúc nãy đã uống thuốc xong, giờ đang nằm nghỉ trên giường.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Audio xác nhận '刚才已经喝了药' (lúc nãy đã uống thuốc rồi)."
      },
      {
        "id": "m21_l5",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nam muốn tìm vật gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：你看见我的眼镜了吗？桌子上没有。 女：刚才在沙发上看见了，你去看看吧。",
        "audioPy": "Nán: Nǐ kànjiàn wǒ de yǎnjìng le ma? Zhuōzi shàng méiyǒu. Nǚ: Gāngcái zài shāfā shàng kànjiàn le, nǐ qù kànkan ba.",
        "audioVi": "Nam: Bạn có thấy kính mắt của tôi đâu không? Trên bàn không có. Nữ: Lúc nãy thấy ở trên ghế sô-pha đấy, bạn ra xem thử đi.",
        "opts": [
          "Chìa khóa",
          "Kính mắt",
          "Điện thoại",
          "Ví tiền"
        ],
        "ans": 1,
        "exp": "Người nam hỏi '看见我的眼镜了吗' (thấy kính mắt của tôi không)."
      },
      {
        "id": "m21_l6",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Tại sao người nữ không đi xem ca nhạc?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：今晚七点有音乐会，你跟我一起去吗？ 女：真可惜，我今晚得准备明天的考试，去不了。",
        "audioPy": "Nán: Jīnwǎn qī diǎn yǒu yīnyuèhuì, nǐ gēn wǒ yìqǐ qù ma? Nǚ: Zhēn kěxī, wǒ jīnwǎn děi zhǔnbèi míngtiān de kǎoshì, qùbuliǎo.",
        "audioVi": "Nam: Tối nay 7 giờ có buổi hòa nhạc, bạn đi cùng tôi nhé? Nữ: Tiếc quá, tối nay tôi phải ôn cho kỳ thi ngày mai nên không đi được.",
        "opts": [
          "Vì trời mưa to",
          "Vì phải chuẩn bị cho kỳ thi ngày mai",
          "Vì không mua được vé",
          "Vì bị ốm phải đi bệnh viện"
        ],
        "ans": 1,
        "exp": "Người nữ nói '得准备明天的考试' (phải chuẩn bị cho kỳ thi ngày mai)."
      },
      {
        "id": "m21_l7",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Căn phòng mới của người nữ như thế nào?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：听说你搬新家了，房子怎么样？ 女：不大，但是很干净，旁边还有一个大公园。",
        "audioPy": "Nán: Tīngshuō nǐ bān xīn jiā le, fángzi zěnmeyàng? Nǚ: Bú dà, dànshì hěn gānjìng, pángbiān hái yǒu yí ge dà gōngyuán.",
        "audioVi": "Nam: Nghe nói bạn chuyển sang nhà mới rồi, nhà thế nào? Nữ: Không lớn, nhưng rất sạch sẽ, bên cạnh còn có một công viên lớn.",
        "opts": [
          "Rất rộng nhưng cũ",
          "Không lớn nhưng sạch sẽ, gần công viên",
          "Rất đắt nhưng xa công ty",
          "Nhỏ và hơi ồn ào"
        ],
        "ans": 1,
        "exp": "Người nữ miêu tả '不大，但是很干净，旁边还有一个大公园'."
      },
      {
        "id": "m21_l8",
        "partLabel": "Phần 3 • Hội thoại dài & Hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Chuyến tàu sẽ khởi hành lúc mấy giờ?",
        "statement": "",
        "statementPy": "",
        "audioZh": "女：师傅，开快一点儿行吗？我的火车八点四十开。 男：放心吧，现在才七点半，二十分钟就能到火车站。",
        "audioPy": "Nǚ: Shīfu, kāi kuài yìdiǎnr xíng ma? Wǒ de huǒchē bā diǎn sìshí kāi. Nán: Fàngxīn ba, xiànzài cái qī diǎn bàn, èrshí fēnzhōng jiù néng dào huǒchēzhàn.",
        "audioVi": "Nữ: Bác tài ơi, chạy nhanh một chút được không ạ? Tàu của cháu 8 giờ 40 chạy. Nam: Yên tâm đi, giờ mới 7 giờ rưỡi, 20 phút nữa là tới ga tàu rồi.",
        "opts": [
          "7 giờ 30",
          "7 giờ 50",
          "8 giờ 20",
          "8 giờ 40"
        ],
        "ans": 3,
        "exp": "Người nữ nói rõ '我的火车八点四十开' (tàu của cháu 8 giờ 40 khởi hành)."
      },
      {
        "id": "m21_l9",
        "partLabel": "Phần 3 • Hội thoại dài & Hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Hai người đang nói chuyện ở đâu?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：请问，这件蓝色的衬衫可以试穿一下吗？ 女：可以的，试衣间在左边，如果号码不合适我再帮您换。",
        "audioPy": "Nán: Qǐngwèn, zhè jiàn lánsè de chènshān kěyǐ shìchuān yíxià ma? Nǚ: Kěyǐ de, shìyījiān zài zuǒbiān, rúguǒ hàomǎ bù héshì wǒ zài bāng nín huàn.",
        "audioVi": "Nam: Xin hỏi, chiếc áo sơ mi màu xanh này có thể mặc thử một chút không? Nữ: Được ạ, phòng thử đồ ở bên trái, nếu cỡ không vừa tôi sẽ đổi giúp anh.",
        "opts": [
          "Ở cửa hàng quần áo",
          "Ở bưu điện",
          "Ở nhà hàng",
          "Ở thư viện"
        ],
        "ans": 0,
        "exp": "Có áo sơ mi ('衬衫'), mặc thử ('试穿') và phòng thử đồ ('试衣间'), nên họ đang ở cửa hàng quần áo."
      },
      {
        "id": "m21_l10",
        "partLabel": "Phần 3 • Hội thoại dài & Hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Tháng trước người nói bắt đầu học môn gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "以前我下班以后总是看手机，觉得很累。上个月我开始跟老师学习游泳，现在身体越来越好了。",
        "audioPy": "Yǐqián wǒ xiàbān yǐhòu zǒngshì kàn shǒujī, juéde hěn lèi. Shàng ge yuè wǒ kāishǐ gēn lǎoshī xuéxí yóuyǒng, xiànzài shēntǐ yuèláiyuè hǎo le.",
        "audioVi": "Trước kia sau khi tan làm tôi toàn xem điện thoại, cảm thấy rất mệt. Tháng trước tôi bắt đầu học bơi cùng thầy giáo, bây giờ sức khỏe ngày càng tốt lên rồi.",
        "opts": [
          "Học tiếng Hán",
          "Học bơi lội",
          "Học nấu ăn",
          "Chạy bộ buổi sáng"
        ],
        "ans": 1,
        "exp": "Đoạn văn nói rõ '上个月我开始跟老师学习游泳' (tháng trước bắt đầu học bơi)."
      }
    ],
    "reading": [
      {
        "id": "m21_r1",
        "partLabel": "Phần 1 • Điền từ vào chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ đúng điền vào chỗ trống: “这个字我学（      ）很多次，但是还是记不住。”",
        "qPy": "Zhège zì wǒ xué ( ... ) hěn duō cì, dànshì háishi jì bu zhù.",
        "orderItems": [],
        "opts": [
          "过",
          "着",
          "的",
          "吗"
        ],
        "ans": 0,
        "exp": "Trợ từ động thái '过' đứng sau động từ biểu thị từng trải qua hành động ('学过很多次' — từng học qua rất nhiều lần)."
      },
      {
        "id": "m21_r2",
        "partLabel": "Phần 1 • Điền từ vào chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ đúng điền vào chỗ trống: “因为工作太忙，（      ）我周末也没时间休息。”",
        "qPy": "Yīnwèi gōngzuò tài máng, ( ... ) wǒ zhōumò yě méi shíjiān xiūxi.",
        "orderItems": [],
        "opts": [
          "所以",
          "但是",
          "虽然",
          "如果"
        ],
        "ans": 0,
        "exp": "Cặp quan hệ từ nhân quả chuẩn: '因为...所以...' (Bởi vì... cho nên...)."
      },
      {
        "id": "m21_r3",
        "partLabel": "Phần 1 • Điền từ vào chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ đúng điền vào chỗ trống: “外面的路太滑了，你骑车的时候一定要（      ）一点儿。”",
        "qPy": "Wàimiàn de lù tài huá le, nǐ qíchē de shíhou yídìng yào ( ... ) yìdiǎnr.",
        "orderItems": [],
        "opts": [
          "慢",
          "远",
          "高",
          "贵"
        ],
        "ans": 0,
        "exp": "Đường trơn ('路太滑了') thì khi đi xe phải chậm một chút ('慢一点儿')."
      },
      {
        "id": "m21_r4",
        "partLabel": "Phần 2 • Ghép câu hợp ngữ cảnh",
        "kind": "match",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn câu đối đáp phù hợp với câu hỏi: “你觉得这本小说怎么样？”",
        "qPy": "Nǐ juéde zhè běn xiǎoshuō zěnmeyàng?",
        "orderItems": [],
        "opts": [
          "非常有意思，我两天就看完了。",
          "书店在学校对面。",
          "我昨天买了两支笔。",
          "他每天坐地铁去图书馆。"
        ],
        "ans": 0,
        "exp": "Hỏi cảm nhận về cuốn tiểu thuyết ('怎么样？'), đáp án phù hợp là đánh giá '非常有意思，我两天就看完了。' (Vô cùng thú vị, tôi đọc 2 ngày là xong)."
      },
      {
        "id": "m21_r5",
        "partLabel": "Phần 2 • Ghép câu hợp ngữ cảnh",
        "kind": "match",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn câu nối tiếp hợp lý với câu sau: “门开着呢，……”",
        "qPy": "Mén kāizhe ne, ......",
        "orderItems": [],
        "opts": [
          "大家请进来坐吧。",
          "我去医院看牙医。",
          "昨天晚上九点半睡的。",
          "这个苹果有点儿酸。"
        ],
        "ans": 0,
        "exp": "'Cửa đang mở đấy, mời mọi người vào ngồi đi' ('门开着呢，大家请进来坐吧。') là hai vế liền mạch tự nhiên nhất."
      },
      {
        "id": "m21_r6",
        "partLabel": "Phần 2 • Ghép câu hợp ngữ cảnh",
        "kind": "match",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn câu hỏi tương ứng với câu trả lời: “大概需要一个半小时。”",
        "qPy": "Dàgài xūyào yí ge bàn xiǎoshí.",
        "orderItems": [],
        "opts": [
          "从这里开车到机场要多长时间？",
          "机票多少钱一张？",
          "你什么时候去旅游？",
          "谁和你一起去机场？"
        ],
        "ans": 0,
        "exp": "Câu trả lời nêu khoảng thời gian ('大概需要一个半小时' — khoảng 1 tiếng rưỡi), nên câu hỏi phải dùng '多长时间' (bao lâu)."
      },
      {
        "id": "m21_r7",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "大卫来中国工作两年了。刚来的时候，他只会说几句简单的汉语。现在他每天都跟中国同事聊天，所以汉语进步得非常快，已经能看懂中文报纸了。",
        "passagePy": "Dàwèi lái Zhōngguó gōngzuò liǎng nián le. Gāng lái de shíhou, tā zhǐ huì shuō jǐ jù jiǎndān de Hànyǔ. Xiànzài tā měitiān dōu gēn Zhōngguó tóngshì liáotiān, suǒyǐ Hànyǔ jìnbù de fēicháng kuài, yǐjīng néng kàndǒng Zhōngwén bàozhǐ le.",
        "passageVi": "Đại Vệ sang Trung Quốc làm việc được 2 năm rồi. Lúc mới sang, anh ấy chỉ biết nói vài câu tiếng Hán đơn giản. Bây giờ mỗi ngày anh đều trò chuyện với đồng nghiệp Trung Quốc, nên tiếng Hán tiến bộ rất nhanh, đã có thể đọc hiểu báo tiếng Trung rồi.",
        "q": "Tại sao tiếng Hán của Đại Vệ tiến bộ rất nhanh?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Vì mỗi ngày anh ấy đều xem ti-vi cả tối",
          "Vì anh ấy ngày nào cũng trò chuyện với đồng nghiệp Trung Quốc",
          "Vì anh ấy có giáo viên dạy riêng ở nhà",
          "Vì anh ấy đã học tiếng Hán 10 năm trước đó"
        ],
        "ans": 1,
        "exp": "Đoạn văn nói rõ '现在他每天都跟中国同事聊天，所以汉语进步得非常快'."
      },
      {
        "id": "m21_r8",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "今天是妈妈的休息日，她一大早就去菜市场买了很多新鲜的鱼和蔬菜，准备中午给全家做一顿丰盛的午饭。",
        "passagePy": "Jīntiān shì māma de xiūxirì, tā yídàzǎo jiù qù càishìchǎng mǎile hěn duō xīnxiān de yú hé shūcài, zhǔnbèi zhōngwǔ gěi quánjiā zuò yí dùn fēngshèng de wǔfàn.",
        "passageVi": "Hôm nay là ngày nghỉ của mẹ, sáng sớm tinh mơ mẹ đã đi chợ mua rất nhiều cá và rau tươi, chuẩn bị trưa nay nấu cho cả nhà một bữa trưa thịnh soạn.",
        "q": "Sáng sớm nay mẹ đã đi đâu?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Đi siêu thị mua quần áo",
          "Đi chợ mua cá và rau tươi",
          "Đi công viên tập thể dục",
          "Đi bệnh viện kiểm tra sức khỏe"
        ],
        "ans": 1,
        "exp": "Đoạn văn ghi '去菜市场买了很多新鲜的鱼和蔬菜' (đi chợ mua nhiều cá và rau tươi)."
      },
      {
        "id": "m21_r9",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "李明非常喜欢动物，但是他住的楼房不允许养狗。所以每个周末他都会去朋友小王家，帮小王遛狗和给小狗洗澡。",
        "passagePy": "Lǐ Míng fēicháng xǐhuan dòngwù, dànshì tā zhù de lóufáng bù yǔnxǔ yǎng gǒu. Suǒyǐ měi ge zhōumò tā dōu huì qù péngyou Xiǎo Wáng jiā, bāng Xiǎo Wáng liù gǒu hé gěi xiǎogǒu xǐzǎo.",
        "passageVi": "Lý Minh rất thích động vật, nhưng tòa nhà cậu ấy ở không cho phép nuôi chó. Vì thế cuối tuần nào cậu ấy cũng sang nhà bạn Tiểu Vương giúp dắt chó đi dạo và tắm cho chó con.",
        "q": "Tại sao Lý Minh không nuôi chó ở nhà mình?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Vì cậu ấy không thích động vật",
          "Vì bố mẹ không đồng ý",
          "Vì tòa nhà nơi cậu ấy ở không cho phép nuôi chó",
          "Vì cậu ấy quá bận rộn vào ngày thường"
        ],
        "ans": 2,
        "exp": "Đoạn văn giải thích rõ '他住的楼房不允许养狗' (tòa nhà cậu ấy ở không cho phép nuôi chó)."
      },
      {
        "id": "m21_r10",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "从前天开始一直在下小雨，气温下降了很多。明天虽然雨会停，但是风很大，大家出门记得带一件外套。",
        "passagePy": "Cóng qiántiān kāishǐ yìzhí zài xià xiǎoyǔ, qìwēn xiàjiàngle hěn duō. Míngtiān suīrán yǔ huì tíng, dànshì fēng hěn dà, dàjiā chūmén jìde dài yí jiàn wàitào.",
        "passageVi": "Từ hôm kia trời vẫn luôn mưa nhỏ, nhiệt độ giảm xuống nhiều. Ngày mai tuy mưa sẽ tạnh, nhưng gió rất to, mọi người ra ngoài nhớ mang theo một chiếc áo khoác.",
        "q": "Thời tiết ngày mai dự báo sẽ như thế nào?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Mưa to suốt cả ngày",
          "Nắng nóng và không có gió",
          "Tạnh mưa nhưng gió rất to",
          "Có tuyết rơi vào buổi sáng"
        ],
        "ans": 2,
        "exp": "Đoạn văn nói '明天虽然雨会停，但是风很大' (Ngày mai tuy tạnh mưa nhưng gió rất to)."
      }
    ],
    "writing": []
  },
  {
    "id": "mock_hsk2_2",
    "level": 2,
    "testNo": 2,
    "badge": "HSK 2 • Đề thi thử số 2",
    "title": "Đề thi thử HSK 2 — Đề số 2",
    "subtitle": "Thể thao, giải trí, nấu ăn & kế hoạch cuối tuần • 10 câu Nghe + 10 câu Đọc • 50 phút",
    "durationSec": 3000,
    "maxScore": 200,
    "passScore": 120,
    "listening": [
      {
        "id": "m22_l1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "他每天早上都去跑步。",
        "statementPy": "Tā měitiān zǎoshang dōu qù pǎobù.",
        "audioZh": "为了锻炼身体，我爷爷每天早上六点半都去公园跑步。",
        "audioPy": "Wèile duànliàn shēntǐ, wǒ yéye měitiān zǎoshang liù diǎn bàn dōu qù gōngyuán pǎobù.",
        "audioVi": "Để rèn luyện sức khỏe, ông nội tôi sáng nào lúc 6 giờ rưỡi cũng ra công viên chạy bộ.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Ông nội sáng nào cũng ra công viên chạy bộ ('每天早上...都去公园跑步'), đúng với nhận định."
      },
      {
        "id": "m22_l2",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "这次考试他考得很好。",
        "statementPy": "Zhè cì kǎoshì tā kǎo de hěn hǎo.",
        "audioZh": "这次汉语考试的题有点儿难，他只考了六十分。",
        "audioPy": "Zhè cì Hànyǔ kǎoshì de tí yǒudiǎnr nán, tā zhǐ kǎole liùshí fēn.",
        "audioVi": "Đề thi tiếng Hán lần này hơi khó, cậu ấy chỉ thi được 60 điểm.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Đề hơi khó và cậu ấy chỉ được 60 điểm ('只考了六十分'), không phải thi rất tốt."
      },
      {
        "id": "m22_l3",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "饭馆里的菜味道不错。",
        "statementPy": "Fànguǎn lǐ de cài wèidào búcuò.",
        "audioZh": "那家新开的饭馆服务很好，菜也特别好吃，我们下周再去一次吧。",
        "audioPy": "Nà jiā xīn kāi de fànguǎn fúwù hěn hǎo, cài yě tèbié hǎochī, wǒmen xià zhōu zài qù yí cì ba.",
        "audioVi": "Nhà hàng mới mở kia phục vụ rất tốt, món ăn cũng đặc biệt ngon, tuần sau chúng ta đi thêm lần nữa nhé.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Audio khen món ăn đặc biệt ngon ('菜也特别好吃'), đồng nghĩa hương vị rất ổn ('味道不错')."
      },
      {
        "id": "m22_l4",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "他打算周日去踢足球。",
        "statementPy": "Tā dǎsuàn zhōurì qù tī zúqiú.",
        "audioZh": "这个星期天我要帮父母打扫房间，不能跟朋友去踢球了。",
        "audioPy": "Zhège xīngqītiān wǒ yào bāng fùmǔ dǎsǎo fángjiān, bù néng gēn péngyou qù tīqiú le.",
        "audioVi": "Chủ nhật này tôi phải giúp bố mẹ dọn dẹp phòng ốc, không thể đi đá bóng cùng bạn được nữa.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Chủ nhật cậu ấy bận dọn phòng giúp bố mẹ nên '不能...去踢球了' (không đi đá bóng được)."
      },
      {
        "id": "m22_l5",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nam muốn gọi thêm món gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "女：两个菜够吃了吗？还要再点一个汤吗？ 男：够了，不用点汤，再来两碗米饭就行。",
        "audioPy": "Nǚ: Liǎng ge cài gòu chī le ma? Hái yào zài diǎn yí ge tāng ma? Nán: Gòu le, búyòng diǎn tāng, zài lái liǎng wǎn mǐfàn jiù xíng.",
        "audioVi": "Nữ: Hai món đủ ăn chưa? Có cần gọi thêm một bát canh nữa không? Nam: Đủ rồi, không cần gọi canh đâu, cho thêm hai bát cơm trắng là được.",
        "opts": [
          "Một bát canh cá",
          "Hai bát cơm trắng",
          "Một đĩa rau xào",
          "Hai cốc trà đá"
        ],
        "ans": 1,
        "exp": "Người nam nói '再来两碗米饭就行' (lấy thêm hai bát cơm trắng là được)."
      },
      {
        "id": "m22_l6",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Chiếc điện thoại mới dùng thế nào?",
        "statement": "",
        "statementPy": "",
        "audioZh": "女：你上星期买的新手机怎么样？ 男：拍照非常清楚，就是电池用得有点儿快。",
        "audioPy": "Nǚ: Nǐ shàng xīngqī mǎi de xīn shǒujī zěnmeyàng? Nán: Pāizhào fēicháng qīngchu, jiùshì diànchí yòng de yǒudiǎnr kuài.",
        "audioVi": "Nữ: Chiếc điện thoại mới bạn mua tuần trước thế nào? Nam: Chụp ảnh vô cùng rõ nét, chỉ có điều pin hết hơi nhanh.",
        "opts": [
          "Chụp ảnh mờ, pin lâu",
          "Chụp ảnh rõ nét nhưng pin hơi nhanh hết",
          "Giá rất rẻ nhưng hay hỏng",
          "Màn hình nhỏ, khó dùng"
        ],
        "ans": 1,
        "exp": "Người nam nhận xét '拍照非常清楚，就是电池用得有点儿快' (chụp ảnh rất nét, chỉ có pin dùng hơi nhanh hết)."
      },
      {
        "id": "m22_l7",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Ai là người biết nói tiếng Nhật?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：你会说日语吗？我有一封日文信看不懂。 女：我不会，你去问问小李吧，他在日本留过学。",
        "audioPy": "Nán: Nǐ huì shuō Rìyǔ ma? Wǒ yǒu yì fēng Rìwén xìn kàn bù dǒng. Nǚ: Wǒ bú huì, nǐ qù wènwen Xiǎo Lǐ ba, tā zài Rìběn liú guo xué.",
        "audioVi": "Nam: Bạn có biết tiếng Nhật không? Tôi có một bức thư tiếng Nhật đọc không hiểu. Nữ: Tôi không biết, bạn ra hỏi Tiểu Lý xem, cậu ấy từng du học ở Nhật Bản đấy.",
        "opts": [
          "Người nam",
          "Người nữ",
          "Tiểu Lý",
          "Thầy giáo Vương"
        ],
        "ans": 2,
        "exp": "Người nữ không biết và gợi ý hỏi Tiểu Lý vì cậu ấy từng du học ở Nhật ('他在日本留过学')."
      },
      {
        "id": "m22_l8",
        "partLabel": "Phần 3 • Hội thoại dài & Hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Vì sao anh An chưa tới?",
        "statement": "",
        "statementPy": "",
        "audioZh": "女：会议还有五分钟就开始了，小安怎么还没来？ 男：他刚才打电话说路上堵车，可能要晚十分钟到。",
        "audioPy": "Nǚ: Huìyì hái yǒu wǔ fēnzhōng jiù kāishǐ le, Xiǎo Ān zěnme hái méi lái? Nán: Tā gāngcái dǎ diànhuà shuō lù shàng dǔchē, kěnéng yào wǎn shí fēnzhōng dào.",
        "audioVi": "Nữ: Còn 5 phút nữa là họp rồi, sao Tiểu An vẫn chưa tới? Nam: Cậu ấy vừa gọi điện bảo trên đường tắc xe, có lẽ sẽ đến muộn 10 phút.",
        "opts": [
          "Cậu ấy quên giờ họp",
          "Cậu ấy bị tắc đường",
          "Cậu ấy đi nhầm tòa nhà",
          "Cậu ấy xin nghỉ phép"
        ],
        "ans": 1,
        "exp": "Tiểu An gọi điện báo '路上堵车' (trên đường bị tắc xe)."
      },
      {
        "id": "m22_l9",
        "partLabel": "Phần 3 • Hội thoại dài & Hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Bức ảnh được chụp ở đâu?",
        "statement": "",
        "statementPy": "",
        "audioZh": "女：这张照片真好看，后面是蓝蓝的大海，你们是什么时候去的？ 男：这是去年夏天我去青岛旅游时拍的。",
        "audioPy": "Nǚ: Zhè zhāng zhàopiàn zhēn hǎokàn, hòumiàn shì lánlán de dàhǎi, nǐmen shì shénme shíhou qù de? Nán: Zhè shì qùnián xiàtiān wǒ qù Qīngdǎo lǚyóu shí pāi de.",
        "audioVi": "Nữ: Bức ảnh này đẹp thật đấy, phía sau là biển xanh bao la, các bạn đi lúc nào vậy? Nam: Đây là ảnh mình chụp khi đi du lịch Thanh Đảo mùa hè năm ngoái.",
        "opts": [
          "Ở công viên gần nhà",
          "Ở Thanh Đảo bên bờ biển",
          "Ở vùng núi phía Bắc",
          "Ở cổng trường đại học"
        ],
        "ans": 1,
        "exp": "Người nam nói đây là ảnh chụp khi đi du lịch Thanh Đảo ('去青岛旅游时拍的') có biển phía sau."
      },
      {
        "id": "m22_l10",
        "partLabel": "Phần 3 • Hội thoại dài & Hỏi đáp",
        "type": "mcq",
        "prompt": "Nghe đoạn ngắn và trả lời: Người nói thích nhất điều gì vào mùa thu?",
        "statement": "",
        "statementPy": "",
        "audioZh": "一年有四个季节，我最喜欢秋天。秋天既不太冷也不太热，树叶变成黄色，周末还可以去郊外爬山。",
        "audioPy": "Yì nián yǒu sì ge jìjié, wǒ zuì xǐhuan qiūtiān. Qiūtiān jì bú tài lěng yě bú tài rè, shùyè biànchéng huángsè, zhōumò hái kěyǐ qù jiāowài páshān.",
        "audioVi": "Một năm có bốn mùa, tôi thích nhất là mùa thu. Mùa thu vừa không quá lạnh cũng không quá nóng, lá cây chuyển màu vàng, cuối tuần còn có thể đi ngoại ô leo núi.",
        "opts": [
          "Mùa xuân hoa nở",
          "Mùa hè đi bơi",
          "Mùa thu mát mẻ và đi leo núi",
          "Mùa đông ngắm tuyết rơi"
        ],
        "ans": 2,
        "exp": "Đoạn văn nói '我最喜欢秋天' (thích nhất mùa thu) vì không quá lạnh cũng không quá nóng và cuối tuần có thể đi leo núi."
      }
    ],
    "reading": [
      {
        "id": "m22_r1",
        "partLabel": "Phần 1 • Điền từ vào chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ đúng điền vào chỗ trống: “弟弟（      ）着耳机在听音乐，没听见你叫他。”",
        "qPy": "Dìdi ( ... ) zhe ěrjī zài tīng yīnyuè, méi tīngjiàn nǐ jiào tā.",
        "orderItems": [],
        "opts": [
          "戴",
          "穿",
          "拿",
          "走"
        ],
        "ans": 0,
        "exp": "Đeo tai nghe, đeo kính, đội mũ dùng động từ '戴' (dài): '戴着耳机'."
      },
      {
        "id": "m22_r2",
        "partLabel": "Phần 1 • Điền từ vào chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ đúng điền vào chỗ trống: “今天比昨天（      ）多了，太阳也出来了。”",
        "qPy": "Jīntiān bǐ zuótiān ( ... ) duō le, tàiyáng yě chūlái le.",
        "orderItems": [],
        "opts": [
          "暖和",
          "便宜",
          "认真",
          "清楚"
        ],
        "ans": 0,
        "exp": "Có mặt trời mọc ('太阳出来了'), nói về thời tiết thì dùng '暖和' (ấm áp): '今天比昨天暖和多了'."
      },
      {
        "id": "m22_r3",
        "partLabel": "Phần 1 • Điền từ vào chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ đúng điền vào chỗ trống: “虽然这双鞋有点儿贵，（      ）穿起来特别舒服。”",
        "qPy": "Suīrán zhè shuāng xié yǒudiǎnr guì, ( ... ) chuān qǐlái tèbié shūfu.",
        "orderItems": [],
        "opts": [
          "但是",
          "所以",
          "或者",
          "而且"
        ],
        "ans": 0,
        "exp": "Cặp quan hệ từ tương phản '虽然...但是...' (Tuy... nhưng...)."
      },
      {
        "id": "m22_r4",
        "partLabel": "Phần 2 • Ghép câu hợp ngữ cảnh",
        "kind": "match",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn câu đối đáp phù hợp khi bạn nhờ người khác giúp: “你能帮我拿一下那个箱子吗？”",
        "qPy": "Nǐ néng bāng wǒ ná yíxià nà ge xiāngzi ma?",
        "orderItems": [],
        "opts": [
          "没问题，我这就帮你搬过去。",
          "箱子是红色的。",
          "我昨天去超市了。",
          "明天早上九点半开始。"
        ],
        "ans": 0,
        "exp": "Khi đồng ý giúp đỡ, cách đáp tự nhiên nhất là '没问题，我这就帮你搬过去。' (Không thành vấn đề, tôi bê sang giúp bạn ngay đây)."
      },
      {
        "id": "m22_r5",
        "partLabel": "Phần 2 • Ghép câu hợp ngữ cảnh",
        "kind": "match",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn câu nối tiếp hợp lý: “饭菜已经做好了，……”",
        "qPy": "Fàncài yǐjīng zuòhǎo le, ......",
        "orderItems": [],
        "opts": [
          "快洗洗手来吃饭吧。",
          "我现在要去睡觉。",
          "这件衣服太小了。",
          "外面下着大雨呢。"
        ],
        "ans": 0,
        "exp": "Cơm canh đã nấu xong ('饭菜已经做好了'), câu tiếp theo hợp logic nhất là '快洗洗手来吃饭吧。' (Mau rửa tay rồi ra ăn cơm đi)."
      },
      {
        "id": "m22_r6",
        "partLabel": "Phần 2 • Ghép câu hợp ngữ cảnh",
        "kind": "match",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn câu trả lời phù hợp cho câu hỏi: “你以前学过太极拳吗？”",
        "qPy": "Nǐ yǐqián xué guo Tàijíquán ma?",
        "orderItems": [],
        "opts": [
          "没有学过，这是我第一次练习。",
          "公园里有很多树。",
          "我每天喝两杯水。",
          "这张桌子非常重。"
        ],
        "ans": 0,
        "exp": "Câu hỏi dùng '...过吗？' (đã từng ... chưa?), nên câu phủ định chuẩn xác là '没有学过，这是我第一次练习。' (Chưa từng học, đây là lần đầu tiên tôi tập)."
      },
      {
        "id": "m22_r7",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "小陈每天下班以后都会先去健身房锻炼四十分钟，然后再回家做晚饭。他觉得运动不仅能让人变瘦，还能让心情更快乐。",
        "passagePy": "Xiǎo Chén měitiān xiàbān yǐhòu dōu huì xiān qù jiànshēnfáng duànliàn sìshí fēnzhōng, ránhòu zài huí jiā zuò wǎnfàn. Tā juéde yùndòng bùjǐn néng ràng rén biàn shòu, hái néng ràng xīnqíng gèng kuàilè.",
        "passageVi": "Tiểu Trần mỗi ngày sau khi tan làm đều đến phòng tập thể dục tập 40 phút trước, rồi mới về nhà nấu bữa tối. Cậu ấy thấy vận động không chỉ giúp người ta gầy đi mà còn giúp tâm trạng vui vẻ hơn.",
        "q": "Tiểu Trần thường làm gì ngay sau khi tan làm?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Đi thẳng về nhà ngủ",
          "Đi phòng tập thể dục tập 40 phút",
          "Đi ăn tối ở nhà hàng cùng bạn",
          "Đi dạo ở siêu thị gần nhà"
        ],
        "ans": 1,
        "exp": "Đoạn văn nói '下班以后都会先去健身房锻炼四十分钟' (sau khi tan làm đều đi phòng tập thể dục tập 40 phút trước)."
      },
      {
        "id": "m22_r8",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "这次周末的班级聚会定在周六晚上六点半。每个人可以带一道自己做的菜或者买一些水果来，大家一起唱歌、玩游戏。",
        "passagePy": "Zhè cì zhōumò de bānjí jùhuì dìng zài zhōuliù wǎnshang liù diǎn bàn. Měi ge rén kěyǐ dài yí dào zìjǐ zuò de cài huòzhě mǎi yìxiē shuǐguǒ lái, dàjiā yìqǐ chànggē, wán yóuxì.",
        "passageVi": "Buổi liên hoan lớp cuối tuần này ấn định vào 6 giờ rưỡi tối thứ Bảy. Mỗi người có thể mang một món tự nấu hoặc mua ít hoa quả tới, mọi người cùng nhau hát và chơi trò chơi.",
        "q": "Mỗi người tham gia buổi liên hoan có thể mang theo gì?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Một món tự nấu hoặc hoa quả",
          "Một quyển sách giáo khoa",
          "Vé xem phim cuối tuần",
          "Đồ dùng học tập mới"
        ],
        "ans": 0,
        "exp": "Đoạn văn nêu rõ '带一道自己做的菜或者买一些水果来' (mang một món tự nấu hoặc mua ít hoa quả tới)."
      },
      {
        "id": "m22_r9",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "我哥哥非常喜欢画画，他房间里挂着很多自己画的山水画。虽然他不是专业的画家，但是朋友们都说他画得很有水平。",
        "passagePy": "Wǒ gēge fēicháng xǐhuan huàhuà, tā fángjiān lǐ guàzhe hěn duō zìjǐ huà de shānshuǐhuà. Suīrán tā bú shì zhuānyè de huàjiā, dànshì péngyoumen dōu shuō tā huà de hěn yǒu shuǐpíng.",
        "passageVi": "Anh trai tôi rất thích vẽ tranh, trong phòng anh ấy treo rất nhiều tranh sơn thủy do tự tay anh vẽ. Tuy anh không phải họa sĩ chuyên nghiệp, nhưng bạn bè đều khen anh vẽ rất có trình độ.",
        "q": "Trong phòng anh trai có treo thứ gì?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Ảnh chụp gia đình",
          "Nhiều bức tranh sơn thủy tự vẽ",
          "Bản đồ thế giới",
          "Áp-phích phim điện ảnh"
        ],
        "ans": 1,
        "exp": "Đoạn văn nói '挂着很多自己画的山水画' (treo rất nhiều tranh sơn thủy tự vẽ)."
      },
      {
        "id": "m22_r10",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "为了保护眼睛，老师告诉大家看电脑四十五分钟以后要站起来休息十分钟，看看远处的绿色植物，不要一直盯着屏幕。",
        "passagePy": "Wèile bǎohù yǎnjing, lǎoshī gàosu dàjiā kàn diànnǎo sìshíwǔ fēnzhōng yǐhòu yào zhàn qǐlái xiūxi shí fēnzhōng, kànkan yuǎnchù de lǜsè zhíwù, búyào yìzhí dīngzhe píngmù.",
        "passageVi": "Để bảo vệ mắt, thầy giáo dặn mọi người sau khi nhìn máy tính 45 phút phải đứng dậy nghỉ 10 phút, ngắm cây xanh ở đằng xa, đừng nhìn chằm chằm vào màn hình mãi.",
        "q": "Thầy giáo khuyên nên làm gì sau khi dùng máy tính 45 phút?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Tắt đèn đi ngủ ngay",
          "Đứng dậy nghỉ 10 phút và nhìn cây xanh ở xa",
          "Uống một cốc cà phê đặc",
          "Chuyển sang xem điện thoại"
        ],
        "ans": 1,
        "exp": "Thầy khuyên '站起来休息十分钟，看看远处的绿色植物' (đứng dậy nghỉ 10 phút, nhìn cây xanh ở xa)."
      }
    ],
    "writing": []
  },
  {
    "id": "mock_hsk3_1",
    "level": 3,
    "testNo": 1,
    "badge": "HSK 3 • Đề thi thử số 1",
    "title": "Đề thi thử HSK 3 — Đề số 1",
    "subtitle": "Học tập, công nghệ & thói quen sống • 10 Nghe + 10 Đọc + 5 Viết • 85 phút",
    "durationSec": 5100,
    "maxScore": 300,
    "passScore": 180,
    "listening": [
      {
        "id": "m31_l1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "他把行李忘在出租车上了。",
        "statementPy": "Tā bǎ xíngli wàng zài chūzūchē shàng le.",
        "audioZh": "刚才下出租车太匆忙了，我差点儿把黑色的箱子忘在车里，幸好司机提醒了我。",
        "audioPy": "Gāngcái xià chūzūchē tài cōngmáng le, wǒ chàdiǎnr bǎ hēisè de xiāngzi wàng zài chē lǐ, xìnghǎo sījī tíxǐngle wǒ.",
        "audioVi": "Lúc nãy xuống xe tắc-xi vội quá, suýt nữa tôi bỏ quên chiếc vali màu đen trên xe, may mà tài xế nhắc tôi.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Audio nói '差点儿把黑色的箱子忘在车里，幸好司机提醒了我' (suýt nữa quên, may mà tài xế đã nhắc), nghĩa là anh ấy đã kịp lấy vali xuống xe chứ không bỏ quên."
      },
      {
        "id": "m31_l2",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "这学期小刘的数学成绩进步很大。",
        "statementPy": "Zhè xuéqī Xiǎo Liú de shùxué chéngjì jìnbù hěn dà.",
        "audioZh": "小刘以前数学总是不及格，这学期他每天认真做练习，这次竟然考了九十二分。",
        "audioPy": "Xiǎo Liú yǐqián shùxué zǒngshì bù jígé, zhè xuéqī tā měitiān rènzhēn zuò liànxí, zhè cì jìngrán kǎole jiǔshí'èr fēn.",
        "audioVi": "Tiểu Lưu trước đây môn toán luôn không đạt, học kỳ này cậu ấy chăm chỉ làm bài tập mỗi ngày, lần này thế mà thi được 92 điểm.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Từ chỗ luôn trượt chuyển lên 92 điểm chứng tỏ thành tích môn toán kỳ này tiến bộ rất lớn ('进步很大')."
      },
      {
        "id": "m31_l3",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "除了汉语以外，她还会说泰语。",
        "statementPy": "Chúle Hànyǔ yǐwài, tā hái huì shuō Tàiyǔ.",
        "audioZh": "我的同学玛丽不仅会说流利的汉语，还会讲一口漂亮的法语。",
        "audioPy": "Wǒ de tóngxué Mǎlì bùjǐn huì shuō liúlì de Hànyǔ, hái huì jiǎng yì kǒu piàoliang de Fǎyǔ.",
        "audioVi": "Bạn học Ma-ry của tôi không chỉ nói tiếng Hán lưu loát mà còn nói tiếng Pháp rất hay.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Audio nói bạn ấy biết tiếng Hán và tiếng Pháp ('法语'), không phải tiếng Thái ('泰语')."
      },
      {
        "id": "m31_l4",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ khuyên người nam làm gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：最近工作压力太大了，我每天晚上都睡不好觉。 女：你别老喝浓茶，睡前用热水泡泡脚会舒服得多。",
        "audioPy": "Nán: Zuìjìn gōngzuò yālì tài dà le, wǒ měitiān wǎnshang dōu shuì bu hǎo jiào. Nǚ: Nǐ bié lǎo hē nóng chá, shuì qián yòng rèshuǐ pàopao jiǎo huì shūfu de duō.",
        "audioVi": "Nam: Dạo này áp lực công việc lớn quá, tối nào tôi cũng ngủ không ngon. Nữ: Anh đừng uống trà đặc mãi nữa, trước khi ngủ ngâm chân nước ấm sẽ dễ chịu hơn nhiều.",
        "opts": [
          "Uống thêm trà đặc buổi tối",
          "Ít uống trà đặc và ngâm chân nước ấm trước khi ngủ",
          "Xin nghỉ việc một tháng",
          "Uống thuốc ngủ mỗi ngày"
        ],
        "ans": 1,
        "exp": "Người nữ khuyên '别老喝浓茶，睡前用热水泡泡脚' (đừng hay uống trà đặc, ngâm chân nước nóng trước khi ngủ)."
      },
      {
        "id": "m31_l5",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Vì sao máy điều hòa chưa bật mát được?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：我刚按了空调开关，怎么屋里还是这么热？ 女：你没把窗户关上，而且温度调得太高了。",
        "audioPy": "Nán: Wǒ gāng ànle kōngtiáo kāiguān, zěnme wū lǐ háishi zhème rè? Nǚ: Nǐ méi bǎ chuānghu guānshàng, érqiě wēndù tiáo de tài gāo le.",
        "audioVi": "Nam: Tôi vừa bấm nút điều hòa rồi, sao trong phòng vẫn nóng thế nhỉ? Nữ: Anh chưa đóng cửa sổ lại, hơn nữa nhiệt độ chỉnh cao quá.",
        "opts": [
          "Điều hòa bị hỏng hoàn toàn",
          "Trong nhà mất điện",
          "Chưa đóng cửa sổ và đặt nhiệt độ quá cao",
          "Điều khiển hết pin"
        ],
        "ans": 2,
        "exp": "Người nữ nêu hai nguyên nhân: chưa đóng cửa sổ ('没把窗户关上') và nhiệt độ chỉnh quá cao ('温度调得太高')."
      },
      {
        "id": "m31_l6",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Chiếc đồng hồ đeo tay có chuyện gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "女：你的手表怎么慢了二十分钟？ 男：大概是电池快没电了，下班后我去街口修一下。",
        "audioPy": "Nǚ: Nǐ de shǒubiǎo zěnme mànle èrshí fēnzhōng? Nán: Dàgài shì diànchí kuài méi diàn le, xiàbān hòu wǒ qù jiēkǒu xiū yíxià.",
        "audioVi": "Nữ: Đồng hồ đeo tay của anh sao lại chạy chậm 20 phút thế? Nam: Chắc là pin sắp hết rồi, tan làm tôi ra đầu phố sửa một chút.",
        "opts": [
          "Bị rơi vỡ mặt kính",
          "Chạy chậm 20 phút",
          "Chạy nhanh 20 phút",
          "Bị mất ở công ty"
        ],
        "ans": 1,
        "exp": "Người nữ hỏi rõ '你的手表怎么慢了二十分钟？' (chạy chậm 20 phút)."
      },
      {
        "id": "m31_l7",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Họ quyết định chọn nhà hàng nào?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：川菜馆太辣了，爷爷吃不了。我们去那家粤菜馆吧，既清淡又有特色。 女：行，那我先在网上订个座位。",
        "audioPy": "Nán: Chuāncàiguǎn tài là le, yéye chī bu liǎo. Wǒmen qù nà jiā Yuècàiguǎn ba, jì qīngdàn yòu yǒu tèsè. Nǚ: Xíng, nà wǒ xiān zài wǎngshàng dìng ge zuòwèi.",
        "audioVi": "Nam: Quán món Tứ Xuyên cay quá, ông nội không ăn được. Mình đi quán món Quảng Đông kia đi, vừa thanh đạm vừa đặc sắc. Nữ: Được, vậy em đặt bàn trên mạng trước nhé.",
        "opts": [
          "Quán món Tứ Xuyên",
          "Quán món Quảng Đông",
          "Quán lẩu cay",
          "Ăn cơm tại nhà"
        ],
        "ans": 1,
        "exp": "Người nam đề xuất '那家粤菜馆' (quán món Quảng Đông thanh đạm) và người nữ đồng ý đặt bàn."
      },
      {
        "id": "m31_l8",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Quyển từ điển cuối cùng tìm thấy ở đâu?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：我的汉语词典怎么找不着了？书包和抽屉里我都翻过了。 女：你再想想，昨天是不是借给同桌小高了？ 男：哎呀，对！我现在去向他要回来。",
        "audioPy": "Nán: Wǒ de Hànyǔ cídiǎn zěnme zhǎobuzháo le? Shūbāo hé chōuti lǐ wǒ dōu fānguò le. Nǚ: Nǐ zài xiǎngxiang, zuótiān shì bu shì jiègěi tóngzhuō Xiǎo Gāo le? Nán: Āiyā, duì! Wǒ xiànzài qù xiàng tā yào huílái.",
        "audioVi": "Nam: Sao từ điển tiếng Hán của mình tìm mãi không thấy? Trong cặp sách và ngăn kéo mình đều lục rồi. Nữ: Cậu nghĩ kỹ xem, hôm qua có phải cho bạn cùng bàn Tiểu Cao mượn rồi không? Nam: Ái chà, đúng rồi! Giờ mình đi đòi lại đây.",
        "opts": [
          "Trong cặp sách",
          "Trong ngăn kéo bàn",
          "Ở chỗ bạn cùng bàn Tiểu Cao",
          "Ở thư viện trường"
        ],
        "ans": 2,
        "exp": "Cậu ấy nhớ ra hôm qua đã cho bạn cùng bàn Tiểu Cao mượn ('借给同桌小高了')."
      },
      {
        "id": "m31_l9",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Thói quen đọc sách của người nói mang lại lợi ích gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "不管工作多忙，我每天睡前都会坚持读半小时书。这个习惯不但帮我学到了很多新知识，还让我的心慢慢安静下来。",
        "audioPy": "Bùguǎn gōngzuò duō máng, wǒ měitiān shuì qián dōu huì jiānchí dú bàn xiǎoshí shū. Zhège xíguàn búdàn bāng wǒ xuédàole hěn duō xīn zhīshi, hái ràng wǒ de xīn mànmàn ānjìng xiàlái.",
        "audioVi": "Bất kể công việc bận rộn đến đâu, mỗi ngày trước khi ngủ tôi đều kiên trì đọc sách nửa tiếng. Thói quen này không chỉ giúp tôi học được nhiều kiến thức mới mà còn giúp tâm trí dần lắng dịu lại.",
        "opts": [
          "Giúp ngủ muộn hơn mỗi đêm",
          "Học thêm kiến thức mới và tâm trí bình tĩnh lại",
          "Giúp đọc nhanh gấp đôi người khác",
          "Giúp kiếm được nhiều tiền hơn"
        ],
        "ans": 1,
        "exp": "Đoạn văn nói rõ: '不但帮我学到了很多新知识，还让我的心慢慢安静下来'."
      },
      {
        "id": "m31_l10",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Kết quả cuối cùng của cuộc thi chạy là gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "校运会的长跑比赛真精彩！开始的时候小赵跑在最前面，但是最后五百米小周越跑越快，终于第一个冲过了终点。",
        "audioPy": "Xiàoyùnhuì de chángpǎo bǐsài zhēn jīngcǎi! Kāishǐ de shíhou Xiǎo Zhào pǎo zài zuì qiánmiàn, dànshì zuìhòu wǔbǎi mǐ Xiǎo Zhōu yuè pǎo yuè kuài, zhōngyú dì-yī ge chōngguòle zhōngdiǎn.",
        "audioVi": "Cuộc thi chạy đường dài tại hội thao trường thật kịch tính! Lúc đầu Tiểu Triệu chạy dẫn đầu, nhưng 500 mét cuối Tiểu Chu càng chạy càng nhanh và cuối cùng về đích đầu tiên.",
        "opts": [
          "Tiểu Triệu giành giải nhất",
          "Tiểu Chu về đích đầu tiên",
          "Cả hai về đích cùng lúc",
          "Cuộc thi bị hủy vì trời mưa"
        ],
        "ans": 1,
        "exp": "500 mét cuối Tiểu Chu bứt tốc và '第一个冲过了终点' (về đích đầu tiên)."
      }
    ],
    "reading": [
      {
        "id": "m31_r1",
        "partLabel": "Phần 1 • Chọn từ điền chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ đúng điền vào chỗ trống: “这个城市变化太大了，我（      ）都认不出来了。”",
        "qPy": "Zhège chéngshì biànhuà tài dà le, wǒ ( ... ) dōu rèn bu chūlái le.",
        "orderItems": [],
        "opts": [
          "几乎",
          "刚才",
          "经常",
          "一共"
        ],
        "ans": 0,
        "exp": "'几乎' (jīhū — hầu như, suýt chút nữa): '我几乎都认不出来了' (tôi hầu như không nhận ra nổi nữa)."
      },
      {
        "id": "m31_r2",
        "partLabel": "Phần 1 • Chọn từ điền chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ đúng điền vào chỗ trống: “蛋糕不小心被小猫（      ）地上了，不能吃了。”",
        "qPy": "Dàngāo bù xiǎoxīn bèi xiǎomāo ( ... ) dì shàng le, bù néng chī le.",
        "orderItems": [],
        "opts": [
          "弄到",
          "打算",
          "介绍",
          "解决"
        ],
        "ans": 0,
        "exp": "Câu bị động dùng '被...弄到地上' (bị mèo con làm rơi/làm vương xuống đất)."
      },
      {
        "id": "m31_r3",
        "partLabel": "Phần 1 • Chọn từ điền chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ đúng điền vào chỗ trống: “只要坚持练习，你的口语一定会（      ）流利。”",
        "qPy": "Zhǐyào jiānchí liànxí, nǐ de kǒuyǔ yídìng huì ( ... ) liúlì.",
        "orderItems": [],
        "opts": [
          "越来越",
          "越来",
          "差不多",
          "另外"
        ],
        "ans": 0,
        "exp": "Cấu trúc '越来越 + Tính từ' (ngày càng...): '越来越流利' (ngày càng lưu loát)."
      },
      {
        "id": "m31_r4",
        "partLabel": "Phần 2 • Ghép cặp câu hợp nghĩa",
        "kind": "match",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn câu đối đáp tự nhiên nhất cho lời mời: “周末我们一起去爬香山看红叶，怎么样？”",
        "qPy": "Zhōumò wǒmen yìqǐ qù pá Xiāngshān kàn hóngyè, zěnmeyàng?",
        "orderItems": [],
        "opts": [
          "好主意！听说现在那儿的红叶正好看了。",
          "香山在北京的西边。",
          "我昨天买了一双运动鞋。",
          "天气预报说昨天很冷。"
        ],
        "ans": 0,
        "exp": "Đáp lại lời rủ đi leo núi Hương Sơn ngắm lá đỏ hợp lý nhất là khen ngợi và đồng ý: '好主意！听说现在那儿的红叶正好看了。'."
      },
      {
        "id": "m31_r5",
        "partLabel": "Phần 2 • Ghép cặp câu hợp nghĩa",
        "kind": "match",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn câu mở đầu phù hợp cho vế sau: “……，然后把护照和登机牌拿出来。”",
        "qPy": "......, ránhòu bǎ hùzhào hé dēngjīpái ná chūlái.",
        "orderItems": [],
        "opts": [
          "大家先排好队",
          "这架飞机飞得很稳",
          "行李箱一共二十公斤",
          "机场离市区三十公里"
        ],
        "ans": 0,
        "exp": "Cấu trúc trình tự '先...，然后...' (Trước tiên... sau đó...): '大家先排好队，然后把护照和登机牌拿出来。' (Mọi người xếp hàng ngay ngắn trước, sau đó lấy hộ chiếu và thẻ lên máy bay ra)."
      },
      {
        "id": "m31_r6",
        "partLabel": "Phần 2 • Ghép cặp câu hợp nghĩa",
        "kind": "match",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn giải thích phù hợp cho câu: “难怪他今天这么高兴呢！”",
        "qPy": "Nánguài tā jīntiān zhème gāoxìng ne!",
        "orderItems": [],
        "opts": [
          "原来他刚收到了理想大学的录取通知。",
          "他刚才把水杯打碎了。",
          "今天早上下了一场大雪。",
          "他还没决定去不去参加比赛。"
        ],
        "ans": 0,
        "exp": "'难怪...' (Thảo nào...) thường đi cùng '原来...' (hóa ra là...) để nêu nguyên nhân tích cực khiến anh ấy vui: vừa nhận giấy báo trúng tuyển đại học mơ ước."
      },
      {
        "id": "m31_r7",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "很多年轻人习惯早上不吃早饭，其实这样对胃很不好。经过一夜的休息，身体需要新的能量，如果长期不吃早饭，不但容易觉得累，还会影响上午的工作效率。",
        "passagePy": "Hěn duō niánqīngrén xíguàn zǎoshang bù chī zǎofàn, qíshí zhèyàng duì wèi hěn bù hǎo. Jīngguò yí yè de xiūxi, shēntǐ xūyào xīn de néngliàng, rúguǒ chángqī bù chī zǎofàn, búdàn róngyì juéde lèi, hái huì yǐngxiǎng shàngwǔ de gōngzuò xiàolǜ.",
        "passageVi": "Nhiều bạn trẻ có thói quen không ăn sáng, thực ra điều này rất có hại cho dạ dày. Sau một đêm nghỉ ngơi, cơ thể cần năng lượng mới; nếu lâu dài không ăn sáng, không chỉ dễ cảm thấy mệt mà còn ảnh hưởng đến hiệu suất làm việc buổi sáng.",
        "q": "Theo đoạn văn, việc thường xuyên bỏ bữa sáng có tác hại gì?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Làm tăng cân nhanh chóng",
          "Dễ mệt mỏi và ảnh hưởng hiệu suất làm việc buổi sáng",
          "Khiến buổi tối khó ngủ hơn",
          "Làm giảm thị lực"
        ],
        "ans": 1,
        "exp": "Đoạn văn nêu rõ '不但容易觉得累，还会影响上午的工作效率' (không chỉ dễ mệt mà còn ảnh hưởng hiệu suất làm việc buổi sáng)."
      },
      {
        "id": "m31_r8",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "选择礼物是一门学问。买礼物不一定非要花很多钱，最重要的是了解对方的兴趣和需要。有时候一张亲手写的卡片，比昂贵的礼物更能让人感动。",
        "passagePy": "Xuǎnzé lǐwù shì yì mén xuéwèn. Mǎi lǐwù bù yídìng fēi yào huā hěn duō qián, zuì zhòngyào de shì liǎojiě duìfāng de xìngqù hé xūyào. Yǒu shíhou yì zhāng qīnshǒu xiě de kǎpiàn, bǐ ángguì de lǐwù gèng néng ràng rén gǎndòng.",
        "passageVi": "Chọn quà là một nghệ thuật. Mua quà không nhất thiết phải tốn nhiều tiền, quan trọng nhất là hiểu sở thích và nhu cầu của đối phương. Đôi khi một tấm thiệp tự tay viết còn khiến người nhận cảm động hơn món quà đắt tiền.",
        "q": "Theo tác giả, điều gì quan trọng nhất khi chọn quà?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Món quà phải thật đắt tiền",
          "Quà phải mua từ nước ngoài",
          "Hiểu sở thích và nhu cầu của người nhận",
          "Gói quà bằng giấy màu đỏ"
        ],
        "ans": 2,
        "exp": "Đoạn văn khẳng định '最重要的是了解对方的兴趣和需要' (quan trọng nhất là hiểu sở thích và nhu cầu của đối phương)."
      },
      {
        "id": "m31_r9",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "上周社区图书馆举办了“旧书换新书”活动。居民们可以把家里看过的干净图书带到现场，换取别人带来的书籍。这样既节省了买书的钱，又让好书被更多人看到。",
        "passagePy": "Shàng zhōu shèqū túshūguǎn jǔbànle “Jiù shū huàn xīn shū” huódòng. Jūmínmen kěyǐ bǎ jiā lǐ kànguo de gānjìng túshū dài dào xiànchǎng, huànqǔ biérén dàilái de shūjí. Zhèyàng jì jiéshěngle mǎi shū de qián, yòu ràng hǎo shū bèi gèng duō rén kàndào.",
        "passageVi": "Tuần trước thư viện khu dân cư đã tổ chức hoạt động \"Đổi sách cũ lấy sách mới\". Cư dân có thể mang sách sạch sẽ đã đọc ở nhà tới hiện trường để đổi lấy sách do người khác mang đến. Cách này vừa tiết kiệm tiền mua sách, vừa giúp sách hay đến được với nhiều người hơn.",
        "q": "Hoạt động tại thư viện khu dân cư yêu cầu sách mang đi đổi phải như thế nào?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Phải là sách mới mua chưa mở",
          "Phải là sách sạch sẽ đã đọc ở nhà",
          "Phải là sách giáo khoa tiểu học",
          "Phải kèm theo hóa đơn mua hàng"
        ],
        "ans": 1,
        "exp": "Đoạn văn nói '把家里看过的干净图书带到现场' (mang sách sạch sẽ đã đọc ở nhà đến hiện trường)."
      },
      {
        "id": "m31_r10",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "学骑自行车的时候，我摔倒了好几次，差点儿放弃。但是爸爸一直在旁边鼓励我，让我慢慢找平衡。练习了三天以后，我终于能自己骑着车在院子里转圈了。",
        "passagePy": "Xué qí zìxíngchē de shíhou, wǒ shuāidǎole hǎo jǐ cì, chàdiǎnr fàngqì. Dànshì bàba yìzhí zài pángbiān gǔlì wǒ, ràng wǒ mànmàn zhǎo pínghéng. Liànxíle sān tiān yǐhòu, wǒ zhōngyú néng zìjǐ qízhe chē zài yuànzi lǐ zhuànquān le.",
        "passageVi": "Lúc tập đi xe đạp, tôi bị ngã mấy lần, suýt nữa bỏ cuộc. Nhưng bố luôn ở bên cạnh động viên tôi, bảo tôi từ từ tìm thăng bằng. Sau khi tập ba ngày, cuối cùng tôi đã có thể tự đạp xe chạy vòng quanh trong sân.",
        "q": "Người viết mất bao lâu để tự đi được xe đạp?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Một buổi sáng",
          "Ba ngày luyện tập",
          "Hai tuần",
          "Một tháng"
        ],
        "ans": 1,
        "exp": "Đoạn văn nói '练习了三天以后，我终于能自己骑着车...' (sau khi tập 3 ngày cuối cùng đã tự đạp được)."
      }
    ],
    "writing": [
      {
        "id": "m31_w1",
        "partLabel": "Phần 1 • Sắp xếp câu",
        "type": "reorder",
        "words": [
          "桌子上的",
          "请",
          "关掉",
          "把",
          "台灯"
        ],
        "answer": "请把桌子上的台灯关掉。",
        "py": "Qǐng bǎ zhuōzi shàng de táidēng guāndiào.",
        "vi": "Xin hãy tắt chiếc đèn bàn ở trên bàn đi.",
        "exp": "Cấu trúc câu chữ 把: '请' (Xin hãy) + '把' + Tân ngữ '桌子上的台灯' (chiếc đèn bàn trên bàn) + Động từ kết quả '关掉' (tắt đi)."
      },
      {
        "id": "m31_w2",
        "partLabel": "Phần 1 • Sắp xếp câu",
        "type": "reorder",
        "words": [
          "借给了",
          "我",
          "刚买的",
          "妹妹",
          "把",
          "词典"
        ],
        "answer": "我把刚买的词典借给了妹妹。",
        "py": "Wǒ bǎ gāng mǎi de cídiǎn jiègěile mèimei.",
        "vi": "Tôi đã cho em gái mượn quyển từ điển vừa mua.",
        "exp": "Cấu trúc câu chữ 把 chỉ sự chuyển giao: Chủ ngữ '我' + '把' + Tân ngữ '刚买的词典' + Động từ '借给了' + Đối tượng '妹妹'."
      },
      {
        "id": "m31_w3",
        "partLabel": "Phần 1 • Sắp xếp câu",
        "type": "reorder",
        "words": [
          "越来越",
          "今天的",
          "刮得",
          "风",
          "大了"
        ],
        "answer": "今天的风刮得越来越大了。",
        "py": "Jīntiān de fēng guā de yuèláiyuè dà le.",
        "vi": "Gió hôm nay thổi ngày càng lớn rồi.",
        "exp": "Bổ ngữ trình độ với 得: Chủ ngữ '今天的风' + Động từ '刮' + '得' + '越来越大了'."
      },
      {
        "id": "m31_w4",
        "partLabel": "Phần 2 • Nhìn Pinyin viết chữ Hán",
        "type": "pinyin_write",
        "sentenceBefore": "只要努力学习，你就一定会",
        "sentenceAfter": "功的。",
        "targetPy": "chéng",
        "targetHanzi": "成",
        "hint": "Âm Hán Việt: Thành (trong 成功 — thành công)",
        "fullZh": "只要努力学习，你就一定会成功的。",
        "fullVi": "Chỉ cần chăm chỉ học tập, bạn nhất định sẽ thành công.",
        "exp": "Chữ cần viết là '成' (chéng), ghép với '功' tạo thành '成功' (thành công)."
      },
      {
        "id": "m31_w5",
        "partLabel": "Phần 2 • Nhìn Pinyin viết chữ Hán",
        "type": "pinyin_write",
        "sentenceBefore": "外面下雨了，记得带",
        "sentenceAfter": "再出门。",
        "targetPy": "sǎn",
        "targetHanzi": "伞",
        "hint": "Danh từ: cái ô / cái dù (hình dáng giống chiếc ô mở ra)",
        "fullZh": "外面下雨了，记得带伞再出门。",
        "fullVi": "Bên ngoài trời mưa rồi, nhớ mang theo ô rồi hãy ra khỏi nhà.",
        "exp": "Chữ cần viết là '伞' (sǎn — cái ô), đi với động từ '带伞' (mang ô)."
      }
    ]
  },
  {
    "id": "mock_hsk3_2",
    "level": 3,
    "testNo": 2,
    "badge": "HSK 3 • Đề thi thử số 2",
    "title": "Đề thi thử HSK 3 — Đề số 2",
    "subtitle": "Môi trường, văn hóa du lịch & giao tiếp • 10 Nghe + 10 Đọc + 5 Viết • 85 phút",
    "durationSec": 5100,
    "maxScore": 300,
    "passScore": 180,
    "listening": [
      {
        "id": "m32_l1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "他们决定骑共享单车去博物馆。",
        "statementPy": "Tāmen juédìng qí gòngxiǎng dānchē qù bówùguǎn.",
        "audioZh": "博物馆离这里只有两公里，天气又这么好，我们别打车了，骑共享单车过去吧。",
        "audioPy": "Bówùguǎn lí zhèlǐ zhǐ yǒu liǎng gōnglǐ, tiānqì yòu zhème hǎo, wǒmen bié dǎchē le, qí gòngxiǎng dānchē guòqù ba.",
        "audioVi": "Bảo tàng cách đây chỉ có hai ki-lô-mét, thời tiết lại đẹp thế này, mình đừng bắt tắc-xi nữa, đạp xe đạp công cộng sang đó đi.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Audio đề xuất không bắt tắc-xi mà đạp xe đạp công cộng ('骑共享单车过去'), khớp với nhận định."
      },
      {
        "id": "m32_l2",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "小周对这次面试不太满意。",
        "statementPy": "Xiǎo Zhōu duì zhè cì miànshì bú tài mǎnyì.",
        "audioZh": "今天上午的面试非常顺利，小周回答问题很流利，面试官也笑着点头了。",
        "audioPy": "Jīntiān shàngwǔ de miànshì fēicháng shùnlì, Xiǎo Zhōu huídá wèntí hěn liúlì, miànshìguān yě xiàozhe diǎntóu le.",
        "audioVi": "Buổi phỏng vấn sáng nay vô cùng suôn sẻ, Tiểu Chu trả lời câu hỏi rất lưu loát, người phỏng vấn cũng mỉm cười gật đầu.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Buổi phỏng vấn diễn ra '非常顺利' (vô cùng suôn sẻ), người phỏng vấn còn mỉm cười gật đầu, nên nói Tiểu Chu không hài lòng là Sai."
      },
      {
        "id": "m32_l3",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe câu sau và chọn Đúng hoặc Sai với nhận định bên dưới:",
        "statement": "这件毛衣是用洗衣机洗坏的。",
        "statementPy": "Zhè jiàn máoyī shì yòng xǐyījī xǐ huài de.",
        "audioZh": "妈妈早就提醒过我这件羊毛衫只能手洗，我忘了，放进洗衣机里洗，结果变小了。",
        "audioPy": "Māma zǎo jiù tíxǐngguò wǒ zhè jiàn yángmáoshān zhǐ néng shǒuxǐ, wǒ wàng le, fàngjìn xǐyījī lǐ xǐ, jiéguǒ biàn xiǎo le.",
        "audioVi": "Mẹ đã nhắc tôi từ lâu rằng chiếc áo len lông cừu này chỉ được giặt tay, tôi quên mất lại bỏ vào máy giặt giặt, kết quả bị co nhỏ lại.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Chiếc áo len bị bỏ vào máy giặt ('放进洗衣机里洗') nên bị hỏng co nhỏ lại, khớp với nhận định."
      },
      {
        "id": "m32_l4",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ khuyên mua loại vé nào?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：去杭州的高铁票买好了吗？ 女：一等座卖完了，不过二等座不仅便宜，而且位置也很舒服，我就买二等座吧。",
        "audioPy": "Nán: Qù Hángzhōu de gāotiě piào mǎihǎo le ma? Nǚ: Yìděngzuò màiwán le, búguò èrděngzuò bùjǐn piányi, érqiě wèizi yě hěn shūfu, wǒ jiù mǎi èrděngzuò ba.",
        "audioVi": "Nam: Vé tàu cao tốc đi Hàng Châu mua xong chưa? Nữ: Ghế hạng nhất bán hết rồi, nhưng ghế hạng hai không chỉ rẻ mà chỗ ngồi cũng rất thoải mái, mình mua ghế hạng hai nhé.",
        "opts": [
          "Vé ghế hạng nhất",
          "Vé ghế hạng hai",
          "Vé giường nằm",
          "Vé xe khách"
        ],
        "ans": 1,
        "exp": "Ghế hạng nhất hết vé nên người nữ đề nghị '买二等座' (mua ghế hạng hai)."
      },
      {
        "id": "m32_l5",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Vì sao anh Lâm nghỉ làm hôm nay?",
        "statement": "",
        "statementPy": "",
        "audioZh": "女：小林今天没来上班，是不是又去参加比赛了？ 男：不是，他牙疼得厉害，上午请假去医院看牙了。",
        "audioPy": "Nǚ: Xiǎo Lín jīntiān méi lái shàngbān, shì bu shì yòu qù cānjiā bǐsài le? Nán: Bú shì, tā yá téng de lìhai, shàngwǔ qǐngjià qù yīyuàn kàn yá le.",
        "audioVi": "Nữ: Tiểu Lâm hôm nay không đi làm, có phải lại đi thi đấu rồi không? Nam: Không phải, cậu ấy đau răng dữ dội, sáng nay xin phép đi bệnh viện khám răng rồi.",
        "opts": [
          "Đi thi đấu thể thao",
          "Đi đón người thân ở sân bay",
          "Đau răng nên đi bệnh viện khám",
          "Bị ốm cảm lạnh ở nhà"
        ],
        "ans": 2,
        "exp": "Người nam trả lời '牙疼得厉害，上午请假去医院看牙了' (đau răng dữ dội, xin nghỉ đi khám răng)."
      },
      {
        "id": "m32_l6",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nam cảm thấy bộ phim thế nào?",
        "statement": "",
        "statementPy": "",
        "audioZh": "女：大家都说那部新电影特别精彩，你看了吗？ 男：看了，前面的故事挺吸引人，不过结尾太简单了，有点儿失望。",
        "audioPy": "Nǚ: Dàjiā dōu shuō nà bù xīn diànyǐng tèbié jīngcǎi, nǐ kànle ma? Nán: Kàn le, qiánmiàn de gùshi tǐng xīyǐn rén, búguò jiéwěi tài jiǎndān le, yǒudiǎnr shīwàng.",
        "audioVi": "Nữ: Mọi người đều bảo bộ phim mới kia đặc biệt hay, anh xem chưa? Nam: Xem rồi, phần đầu câu chuyện khá cuốn hút, nhưng cái kết đơn giản quá, hơi thất vọng một chút.",
        "opts": [
          "Tuyệt vời từ đầu đến cuối",
          "Quá dài và buồn ngủ",
          "Phần đầu cuốn hút nhưng kết thúc hơi thất vọng",
          "Chưa có thời gian đi xem"
        ],
        "ans": 2,
        "exp": "Người nam khen '前面的故事挺吸引人' nhưng chê '结尾太简单了，有点儿失望'."
      },
      {
        "id": "m32_l7",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Tờ hóa đơn có vấn đề gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：服务员，请帮我看一下账单，我们只要了两杯果汁，这里怎么写了三杯？ 女：真不好意思，是我算错了，我马上为您重新打一张。",
        "audioPy": "Nán: Fúwùyuán, qǐng bāng wǒ kàn yíxià zhàngdān, wǒmen zhǐ yàole liǎng bēi guǒzhī, zhèlǐ zěnme xiěle sān bēi? Nǚ: Zhēn bù hǎoyìsi, shì wǒ suàncuò le, wǒ mǎshàng wèi nín chóngxīn dǎ yì zhāng.",
        "audioVi": "Nam: Nhân viên ơi, xem giúp tôi hóa đơn một chút, chúng tôi chỉ gọi 2 cốc nước ép, sao ở đây lại ghi 3 cốc? Nữ: Thật ngại quá, là tôi tính nhầm rồi, tôi in lại ngay một tờ khác cho anh ạ.",
        "opts": [
          "Tính thiếu tiền hai món ăn",
          "Ghi nhầm 2 cốc nước ép thành 3 cốc",
          "Quên giảm giá cho khách quen",
          "In nhầm tên của bàn bên cạnh"
        ],
        "ans": 1,
        "exp": "Khách chỉ gọi 2 cốc nước ép nhưng hóa đơn ghi 3 cốc ('只要了两杯果汁，这里怎么写了三杯')."
      },
      {
        "id": "m32_l8",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Họ định tặng món quà gì cho cô giáo?",
        "statement": "",
        "statementPy": "",
        "audioZh": "女：教师节快到了，我们送给周老师什么礼物好呢？ 男：周老师喜欢喝茶，买一盒好茶叶吧。 女：茶叶她家里肯定不少，不如大家一起买一束鲜花和一张祝贺卡吧。 男：行，这个想法既简单又有心意。",
        "audioPy": "Nǚ: Jiàoshījié kuài dào le, wǒmen sònggěi Zhōu lǎoshī shénme lǐwù hǎo ne? Nán: Zhōu lǎoshī xǐhuan hē chá, mǎi yì hé hǎo cháyè ba. Nǚ: Cháyè tā jiā lǐ kěndìng bù shǎo, bùrú dàjiā yìqǐ mǎi yí shù xiānhuā hé yì zhāng zhùhèkǎ ba. Nán: Xíng, zhège xiǎngfǎ jì jiǎndān yòu yǒu xīnyì.",
        "audioVi": "Nữ: Sắp đến Ngày Nhà giáo rồi, chúng mình tặng quà gì cho cô Châu đây? Nam: Cô Châu thích uống trà, mua một hộp trà ngon đi. Nữ: Trà ở nhà cô chắc không thiếu đâu, chi bằng cả lớp mua một bó hoa tươi và một tấm thiệp chúc mừng nhé. Nam: Được đấy, ý kiến này vừa giản dị vừa đầy tấm lòng.",
        "opts": [
          "Một hộp trà ngon",
          "Một bó hoa tươi và một tấm thiệp chúc mừng",
          "Một bộ ấm chén mới",
          "Một quyển sách văn học"
        ],
        "ans": 1,
        "exp": "Cuối cùng cả hai thống nhất mua '一束鲜花和一张祝贺卡' (một bó hoa tươi và một tấm thiệp chúc mừng)."
      },
      {
        "id": "m32_l9",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Tại sao nhiều người mang túi vải khi đi siêu thị?",
        "statement": "",
        "statementPy": "",
        "audioZh": "现在越来越多的人去超市买东西时自己带环保袋，不再买塑料袋。这样不但能省下几毛钱，更重要的是可以减少垃圾，保护我们的环境。",
        "audioPy": "Xiànzài yuèláiyuè duō de rén qù chāoshì mǎi dōngxi shí zìjǐ dài huánbǎodài, bú zài mǎi sùliàodài. Zhèyàng búdàn néng shěngxià jǐ máo qián, gèng zhòngyào de shì kěyǐ jiǎnshǎo lājī, bǎohù wǒmen de huánjìng.",
        "audioVi": "Hiện nay ngày càng nhiều người khi đi siêu thị mua sắm tự mang theo túi bảo vệ môi trường, không mua túi ni-lông nữa. Làm vậy không chỉ tiết kiệm được vài hào tiền lẻ, điều quan trọng hơn là giảm rác thải và bảo vệ môi trường của chúng ta.",
        "opts": [
          "Vì siêu thị không còn bán túi ni-lông",
          "Vì túi vải đẹp hơn khi chụp ảnh",
          "Để tiết kiệm tiền, giảm rác thải và bảo vệ môi trường",
          "Vì túi vải đựng được đồ nặng hơn gấp mười lần"
        ],
        "ans": 2,
        "exp": "Đoạn văn nêu hai lý do: tiết kiệm tiền lẻ ('省下几毛钱') và giảm rác thải, bảo vệ môi trường ('减少垃圾，保护环境')."
      },
      {
        "id": "m32_l10",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Chuyến đi Tây An đã để lại ấn tượng gì nhất cho tác giả?",
        "statement": "",
        "statementPy": "",
        "audioZh": "今年国庆节，我和家人坐高铁去了西安。那里不仅有几千年历史的兵马俑，还有许多味道正宗的特色小吃，尤其是肉夹馍让我至今难忘。",
        "audioPy": "Jīnnián Guóqìngjié, wǒ hé jiārén zuò gāotiě qùle Xī'ān. Nàlǐ bùjǐn yǒu jǐ qiān nián lìshǐ de Bīngmǎyǒng, hái yǒu xǔduō wèidào zhèngzōng de tèsè xiǎochī, yóuqí shì ròujiāmó ràng wǒ zhìjīn nánwàng.",
        "audioVi": "Dịp Quốc khánh năm nay, tôi và gia đình đi tàu cao tốc tới Tây An. Ở đó không chỉ có Đội quân Đất nung lịch sử mấy nghìn năm, mà còn có rất nhiều món ăn vặt đặc sản chuẩn vị, đặc biệt là bánh kẹp thịt khiến tôi đến nay vẫn khó quên.",
        "opts": [
          "Khách sạn rất sang trọng",
          "Thời tiết mát mẻ dễ chịu",
          "Món bánh kẹp thịt đặc sản khiến tác giả nhớ mãi",
          "Chuyến tàu cao tốc chạy rất nhanh"
        ],
        "ans": 2,
        "exp": "Đoạn văn nhấn mạnh '尤其是肉夹馍让我至今难忘' (đặc biệt là món bánh kẹp thịt khiến tôi đến nay khó quên)."
      }
    ],
    "reading": [
      {
        "id": "m32_r1",
        "partLabel": "Phần 1 • Chọn từ điền chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ đúng điền vào chỗ trống: “请把垃圾放到分类垃圾桶里，别（      ）地上。”",
        "qPy": "Qǐng bǎ lājī fàng dào fēnlèi lājītǒng lǐ, bié ( ... ) dì shàng.",
        "orderItems": [],
        "opts": [
          "扔在",
          "放在",
          "拿在",
          "写在"
        ],
        "ans": 0,
        "exp": "'扔在地上' nghĩa là 'vứt xuống đất' (không vứt rác bừa bãi ra đất)."
      },
      {
        "id": "m32_r2",
        "partLabel": "Phần 1 • Chọn từ điền chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ đúng điền vào chỗ trống: “小王的性格很开朗，他总是（      ）地跟每个人打招呼。”",
        "qPy": "Xiǎo Wáng de xìnggé hěn kāilǎng, tā zǒngshì ( ... ) de gēn měi ge rén dǎ zhāohu.",
        "orderItems": [],
        "opts": [
          "热情",
          "安静",
          "紧张",
          "奇怪"
        ],
        "ans": 0,
        "exp": "Tính cách cởi mở ('开朗') thì luôn chào hỏi mọi người một cách nhiệt tình ('热情地')."
      },
      {
        "id": "m32_r3",
        "partLabel": "Phần 1 • Chọn từ điền chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ đúng điền vào chỗ trống: “这次会议的内容很重要，请你（      ）用笔记本记下来。”",
        "qPy": "Zhè cì huìyì de nèiróng hěn zhòngyào, qǐng nǐ ( ... ) yòng bǐjìběn jì xiàlái.",
        "orderItems": [],
        "opts": [
          "认真",
          "马虎",
          "容易",
          "突然"
        ],
        "ans": 0,
        "exp": "Nội dung cuộc họp quan trọng nên cần ghi chép nghiêm túc/cẩn thận ('认真用笔记本记下来')."
      },
      {
        "id": "m32_r4",
        "partLabel": "Phần 2 • Ghép cặp câu hợp nghĩa",
        "kind": "match",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn câu nối tiếp hợp lý với câu: “如果明天上午不下雨，……”",
        "qPy": "Rúguǒ míngtiān shàngwǔ bú xiàyǔ, ......",
        "orderItems": [],
        "opts": [
          "我们就按原计划去植物园野餐。",
          "昨晚的月饼非常甜。",
          "我已经把作业交给了老师。",
          "他刚买了一辆蓝色自行车。"
        ],
        "ans": 0,
        "exp": "Cấu trúc điều kiện '如果...就...' (Nếu... thì...): Nếu sáng mai không mưa thì đi dã ngoại ở vườn bách thảo theo kế hoạch ban đầu."
      },
      {
        "id": "m32_r5",
        "partLabel": "Phần 2 • Ghép cặp câu hợp nghĩa",
        "kind": "match",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn câu trả lời phù hợp cho câu hỏi: “你为什么突然决定换工作了？”",
        "qPy": "Nǐ wèishénme tūrán juédìng huàn gōngzuò le?",
        "orderItems": [],
        "opts": [
          "因为新公司离我家很近，而且发展机会也更多。",
          "新公司楼下有一家咖啡馆。",
          "我每天早上七点半起床。",
          "同事们都很喜欢喝绿茶。"
        ],
        "ans": 0,
        "exp": "Câu hỏi '为什么' (tại sao) cần câu trả lời '因为...' (bởi vì công ty mới gần nhà và có nhiều cơ hội phát triển hơn)."
      },
      {
        "id": "m32_r6",
        "partLabel": "Phần 2 • Ghép cặp câu hợp nghĩa",
        "kind": "match",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn câu đối đáp phù hợp với lời xin lỗi: “实在对不起，我把你的伞弄丢了。”",
        "qPy": "Shízài duìbuqǐ, wǒ bǎ nǐ de sǎn nòngdiū le.",
        "orderItems": [],
        "opts": [
          "没关系，一把旧伞而已，别放在心上。",
          "今天的雨下得真大啊。",
          "我买伞的时候花了三十块。",
          "这把伞是黄色的。"
        ],
        "ans": 0,
        "exp": "Đáp lại lời xin lỗi lịch sự là câu thông cảm '没关系，...别放在心上' (Không sao đâu, chỉ là cái ô cũ thôi, đừng để bụng nhé)."
      },
      {
        "id": "m32_r7",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "很多人在遇到困难时习惯自己扛着，其实学会向朋友倾诉也是一种力量。朋友不一定能帮你解决所有问题，但他们的倾听和陪伴能让你感到不那么孤单。",
        "passagePy": "Hěn duō rén zài yùdào kùnnan shí xíguàn zìjǐ kángzhe, qíshí xuéhuì xiàng péngyou qīngsù yě shì yì zhǒng lìliàng. Péngyou bù yídìng néng bāng nǐ jiějué suǒyǒu wèntí, dàn tāmen de qīngtīng hé péibàn néng ràng nǐ gǎndào bú nàme gūdān.",
        "passageVi": "Nhiều người khi gặp khó khăn quen tự mình gánh vác, thực ra học cách tâm sự với bạn bè cũng là một loại sức mạnh. Bạn bè không nhất thiết giải quyết được hết mọi vấn đề giúp bạn, nhưng sự lắng nghe và đồng hành của họ khiến bạn cảm thấy đỡ cô đơn hơn.",
        "q": "Theo đoạn văn, việc tâm sự với bạn bè khi gặp khó khăn có tác dụng gì?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Bạn bè sẽ giải quyết toàn bộ khó khăn giúp bạn",
          "Sự lắng nghe và đồng hành giúp bạn bớt cảm thấy cô đơn",
          "Giúp bạn quên đi công việc hiện tại",
          "Giúp bạn kết bạn với nhiều người lạ hơn"
        ],
        "ans": 1,
        "exp": "Đoạn văn nói '他们的倾听和陪伴能让你感到不那么孤单' (sự lắng nghe và đồng hành của họ giúp bạn cảm thấy bớt cô đơn)."
      },
      {
        "id": "m32_r8",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "云南的丽江古城是一座风景如画的小城。这里保留着古老的石板路和木头房子，小河从家家户户门前流过。每年都有来自世界各地的游客到这里感受慢生活。",
        "passagePy": "Yúnnán de Lìjiāng gǔchéng shì yí zuò fēngjǐng rú huà de xiǎochéng. Zhèlǐ bǎoliúzhe gǔlǎo de shíbǎnlù hé mùtou fángzi, xiǎohé cóng jiājiāhùhù ménqián liúguò. Měinián dōu yǒu láizì shìjiè gèdì de yóukè dào zhèlǐ gǎnshòu màn shēnghuó.",
        "passageVi": "Cổ trấn Lệ Giang ở Vân Nam là một thị trấn nhỏ phong cảnh đẹp như tranh. Nơi đây vẫn lưu giữ những con đường lát đá cổ xưa và những ngôi nhà gỗ, con suối nhỏ chảy qua trước cửa từng nhà. Mỗi năm đều có du khách từ khắp nơi trên thế giới tới đây cảm nhận nhịp sống chậm.",
        "q": "Du khách từ khắp nơi đến cổ trấn Lệ Giang chủ yếu để trải nghiệm điều gì?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Mua sắm tại các trung tâm thương mại lớn",
          "Ngắm cảnh và cảm nhận nhịp sống chậm nơi cổ trấn",
          "Tham gia các giải chạy bộ đường dài",
          "Làm việc tại các công ty công nghệ"
        ],
        "ans": 1,
        "exp": "Đoạn văn nêu '来这里感受慢生活' (tới đây cảm nhận cuộc sống chậm rãi)."
      },
      {
        "id": "m32_r9",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "记单词的时候不要光用眼睛看，最好一边读出声，一边用手写几遍，并且试着用新词造一个句子。把多种感官用起来，记忆效果会比死记硬背好得多。",
        "passagePy": "Jì dāncí de shíhou búyào guāng yòng yǎnjing kàn, zuì hǎo yìbiān dú chū shēng, yìbiān yòng shǒu xiě jǐ biàn, bìngqiě shìzhe yòng xīncí zào yí ge jùzi. Bǎ duō zhǒng gǎnguān yòng qǐlái, jìyì xiàoguǒ huì bǐ sǐjìyìngbèi hǎo de duō.",
        "passageVi": "Khi nhớ từ vựng đừng chỉ nhìn bằng mắt, tốt nhất là vừa đọc thành tiếng, vừa viết tay vài lần, đồng thời thử đặt một câu với từ mới. Vận dụng nhiều giác quan cùng lúc thì hiệu quả ghi nhớ sẽ tốt hơn học vẹt nhiều.",
        "q": "Đoạn văn khuyên người học từ vựng nên làm gì?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Chỉ cần đọc thầm bằng mắt thật nhanh",
          "Kết hợp đọc to, viết tay và đặt câu với từ mới",
          "Mỗi ngày học thuộc một trăm từ bằng cách chép phạt",
          "Không cần viết chữ Hán, chỉ cần nghe băng"
        ],
        "ans": 1,
        "exp": "Đoạn văn khuyên '一边读出声，一边用手写几遍，并且试着用新词造一个句子'."
      },
      {
        "id": "m32_r10",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "周阿姨退休以后并没有闲着，她报名参加了社区的合唱团，还学会了用智能手机剪辑旅游视频。她说，只要保持好奇心，什么时候开始学新东西都不晚。",
        "passagePy": "Zhōu āyí tuìxiū yǐhòu bìng méiyǒu xiánzhe, tā bàomíng cānjiāle shèqū de héchàngtuán, hái xuéhuìle yòng zhìnéng shǒujī jiǎnjí lǚyóu shìpín. Tā shuō, zhǐyào bǎochí hàoqíxīn, shénme shíhou kāishǐ xué xīn dōngxi dōu bù wǎn.",
        "passageVi": "Cô Châu sau khi nghỉ hưu không hề ngồi không, cô đăng ký tham gia đội hợp xướng của khu phố, còn học được cách dùng điện thoại thông minh để dựng phim du lịch. Cô nói, chỉ cần giữ được sự tò mò thì bắt đầu học điều mới vào lúc nào cũng không muộn.",
        "q": "Câu nói nào thể hiện đúng nhất quan điểm của cô Châu?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Người lớn tuổi nên nghỉ ngơi, không cần học nữa",
          "Chỉ cần giữ sự ham học hỏi thì học lúc nào cũng không muộn",
          "Dựng phim trên điện thoại rất khó đối với người nghỉ hưu",
          "Sau khi nghỉ hưu chỉ nên tham gia đội hợp xướng"
        ],
        "ans": 1,
        "exp": "Cô Châu nói '只要保持好奇心，什么时候开始学新东西都不晚'."
      }
    ],
    "writing": [
      {
        "id": "m32_w1",
        "partLabel": "Phần 1 • Sắp xếp câu",
        "type": "reorder",
        "words": [
          "写完了",
          "小王",
          "早就",
          "作业",
          "今天的",
          "把"
        ],
        "answer": "小王早就把今天的作业写完了。",
        "py": "Xiǎo Wáng zǎo jiù bǎ jīntiān de zuòyè xiěwán le.",
        "vi": "Tiểu Vương sớm đã làm xong bài tập hôm nay rồi.",
        "exp": "Trật tự chuẩn câu chữ 把 có phó từ thời gian: '小王' + '早就' + '把' + '今天的作业' + '写完了'."
      },
      {
        "id": "m32_w2",
        "partLabel": "Phần 1 • Sắp xếp câu",
        "type": "reorder",
        "words": [
          "热情地",
          "被",
          "接走了",
          "客人",
          "机场的",
          "工作人员"
        ],
        "answer": "客人被机场的工作人员热情地接走了。",
        "py": "Kèrén bèi jīchǎng de gōngzuò rényuán rèqíng de jiēzǒu le.",
        "vi": "Khách đã được nhân viên sân bay đón đi một cách nhiệt tình.",
        "exp": "Câu bị động chữ 被: Chủ ngữ '客人' + '被' + Chủ thể '机场的工作人员' + Trạng ngữ '热情地' + Động từ '接走了'."
      },
      {
        "id": "m32_w3",
        "partLabel": "Phần 1 • Sắp xếp câu",
        "type": "reorder",
        "words": [
          "非常",
          "中国文化",
          "哥哥",
          "感兴趣",
          "对"
        ],
        "answer": "哥哥对中国文化非常感兴趣。",
        "py": "Gēge duì Zhōngguó wénhuà fēicháng gǎn xìngqù.",
        "vi": "Anh trai vô cùng hứng thú với văn hóa Trung Quốc.",
        "exp": "Cấu trúc cố định 'A 对 B (非常) 感兴趣' (A rất có hứng thú với B)."
      },
      {
        "id": "m32_w4",
        "partLabel": "Phần 2 • Nhìn Pinyin viết chữ Hán",
        "type": "pinyin_write",
        "sentenceBefore": "感谢您这段时间对我的",
        "sentenceAfter": "助。",
        "targetPy": "bāng",
        "targetHanzi": "帮",
        "hint": "Âm Hán Việt: Bang (ghép với 助 thành 帮助 — giúp đỡ)",
        "fullZh": "感谢您这段时间对我的帮助。",
        "fullVi": "Cảm ơn sự giúp đỡ của anh/chị dành cho tôi trong thời gian qua.",
        "exp": "Chữ cần điền là '帮' (bāng), ghép với '助' thành '帮助' (giúp đỡ)."
      },
      {
        "id": "m32_w5",
        "partLabel": "Phần 2 • Nhìn Pinyin viết chữ Hán",
        "type": "pinyin_write",
        "sentenceBefore": "明天我要去",
        "sentenceAfter": "加一个重要的会议。",
        "targetPy": "cān",
        "targetHanzi": "参",
        "hint": "Âm Hán Việt: Tham (ghép với 加 thành 参加 — tham gia)",
        "fullZh": "明天我要去参加一个重要的会议。",
        "fullVi": "Ngày mai tôi phải đi tham dự một cuộc họp quan trọng.",
        "exp": "Chữ cần viết là '参' (cān), ghép với '加' thành '参加' (tham gia, tham dự)."
      }
    ]
  },
  {
    "id": "mock_hsk4_1",
    "level": 4,
    "testNo": 1,
    "badge": "HSK 4 • Đề số 1",
    "title": "Đề Thi Thử HSK 4 — Đề Số 1",
    "subtitle": "25 câu chuẩn thi máy • Nghe (10) • Đọc (10) • Viết (5) • Chủ đề: Công việc & Di chuyển",
    "durationSec": 6000,
    "maxScore": 300,
    "passScore": 180,
    "listening": [
      {
        "id": "m4_1_l1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe đoạn thu âm sau và phán đoán câu nhận định bên dưới là Đúng hay Sai:",
        "statement": "★ 她打算坐高铁去上海。",
        "statementPy": "Tā dǎsuàn zuò gāotiě qù Shànghǎi.",
        "audioZh": "本来我想买下周一去上海的机票，可是最近机票太贵了，而且机场离市区很远，所以我还是决定改坐高铁，既方便又准时。",
        "audioPy": "Běnlái wǒ xiǎng mǎi xià zhōuyī qù Shànghǎi de jīpiào, kěshì zuìjìn jīpiào tài guì le, érqiě jīchǎng lí shìqū hěn yuǎn, suǒyǐ wǒ háishi juédìng gǎi zuò gāotiě, jì fāngbiàn yòu zhǔnshí.",
        "audioVi": "Vốn dĩ tôi định mua vé máy bay đi Thượng Hải vào thứ Hai tuần tới, nhưng gần đây vé máy bay đắt quá, hơn nữa sân bay lại xa nội thành, nên tôi vẫn quyết định đổi sang đi tàu cao tốc, vừa tiện lợi vừa đúng giờ.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Đúng (对). Người nói giải thích vé máy bay đắt và sân bay xa nên quyết định đổi sang đi tàu cao tốc ('改坐高铁')."
      },
      {
        "id": "m4_1_l2",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe đoạn thu âm sau và phán đoán câu nhận định bên dưới là Đúng hay Sai:",
        "statement": "★ 他对这次面试的结果很满意。",
        "statementPy": "Tā duì zhè cì miànshì de jiéguǒ hěn mǎnyì.",
        "audioZh": "今天的面试虽然我准备了整整一个星期，但进门之后还是有点紧张，有几个问题没回答好，估计这次希望不大了，只能继续投简历吧。",
        "audioPy": "Jīntiān de miànshì suīrán wǒ zhǔnbèi le zhěngzhěng yí ge xīngqī, dàn jìnmén zhīhòu háishi yǒudiǎn jǐnzhāng, yǒu jǐ ge wèntí méi huídá hǎo, gūjì zhè cì xīwàng bú dà le, zhǐ néng jìxù tóu jiǎnlì ba.",
        "audioVi": "Buổi phỏng vấn hôm nay tuy tôi đã chuẩn bị suốt cả một tuần, nhưng sau khi bước vào cửa vẫn hơi hồi hộp, có mấy câu trả lời chưa tốt, ước chừng lần này hy vọng không lớn rồi, đành tiếp tục nộp hồ sơ thôi.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Sai (错). Anh ấy cảm thấy hồi hộp, trả lời vài câu chưa tốt và cho rằng lần này ít hy vọng ('希望不大了'), không hề hài lòng."
      },
      {
        "id": "m4_1_l3",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe đoạn thu âm sau và phán đoán câu nhận định bên dưới là Đúng hay Sai:",
        "statement": "★ 这家书店周末也开门。",
        "statementPy": "Zhè jiā shūdiàn zhōumò yě kāimén.",
        "audioZh": "为了方便平时上班的读者，我们书店从这个月起调整了营业时间：周一到周五晚上九点关门，星期六和星期天照常营业，全天开放。",
        "audioPy": "Wèile fāngbiàn píngshí shàngbān de dúzhě, wǒmen shūdiàn cóng zhège yuè qǐ tiáozhěng le yíngyè shíjiān: zhōuyī dào zhōuwǔ wǎnshang jiǔ diǎn guānmén, xīngqīliù hé xīngqītiān zhàocháng yíngyè, quántiān kāifàng.",
        "audioVi": "Để thuận tiện cho độc giả đi làm ngày thường, hiệu sách chúng tôi từ tháng này điều chỉnh giờ mở cửa: thứ Hai đến thứ Sáu đóng cửa lúc 9 giờ tối, thứ Bảy và Chủ Nhật vẫn mở cửa bình thường, phục vụ cả ngày.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Đúng (对). Đoạn thu âm nói rõ thứ Bảy và Chủ Nhật vẫn kinh doanh bình thường, mở cửa cả ngày ('照常营业，全天开放')."
      },
      {
        "id": "m4_1_l4",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Tại sao người nam vẫn chưa chuyển nhà?",
        "statement": "",
        "statementPy": "",
        "audioZh": "女：你不是说月底要搬到公司附近吗？怎么还没动静？ 男：别提了，新房子的房东临时涨房租，我只好重新在网上找合适的房子。",
        "audioPy": "Nǚ: Nǐ bú shì shuō yuèdǐ yào bān dào gōngsī fùjìn ma? Zěnme hái méi dòngjing? Nán: Bié tí le, xīn fángzi de fángdōng línshí zhǎng fángzū, wǒ zhǐhǎo chóngxīn zài wǎngshàng zhǎo héshì de fángzi.",
        "audioVi": "Nữ: Không phải anh nói cuối tháng sẽ chuyển đến gần công ty sao? Sao vẫn chưa thấy động tĩnh gì? Nam: Đừng nhắc nữa, chủ nhà mới đột ngột tăng tiền thuê, tôi đành phải lên mạng tìm lại căn khác phù hợp.",
        "opts": [
          "Vì công ty vừa đổi địa điểm làm việc",
          "Vì chủ nhà mới bất ngờ tăng tiền thuê phòng",
          "Vì anh ấy chưa thu dọn xong đồ đạc",
          "Vì khu nhà mới quá ồn ào vào ban đêm"
        ],
        "ans": 1,
        "exp": "Người nam nói: '新房子的房东临时涨房租' (Chủ căn nhà mới đột ngột tăng tiền thuê nhà)."
      },
      {
        "id": "m4_1_l5",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Hai người đang bàn về việc gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：小李，这份报告的数据好像跟上个月的对不上，你再核对一下。 女：好的王经理，我马上打开电脑重新检查一遍，半小时后发给您。",
        "audioPy": "Nán: Xiǎo Lǐ, zhè fèn bàogào de shùjù hǎoxiàng gēn shàng ge yuè de duì bu shàng, nǐ zài héduì yíxià. Nǚ: Hǎo de Wáng jīnglǐ, wǒ mǎshàng dǎkāi diànnǎo chóngxīn jiǎnchá yíbiàn, bàn xiǎoshí hòu fā gěi nín.",
        "audioVi": "Nam: Tiểu Lý này, số liệu của bản báo cáo này hình như không khớp với tháng trước, cô đối chiếu lại một chút nhé. Nữ: Vâng thưa Giám đốc Vương, tôi mở máy tính kiểm tra lại ngay, nửa tiếng nữa sẽ gửi cho ông.",
        "opts": [
          "Đặt phòng họp cho tuần sau",
          "Kiểm tra lại số liệu trong bản báo cáo",
          "Sửa chữa máy tính bị hỏng ở văn phòng",
          "Tuyển thêm nhân viên mới cho phòng"
        ],
        "ans": 1,
        "exp": "Giám đốc Vương yêu cầu đối chiếu lại số liệu báo cáo ('这份报告的数据...再核对一下')."
      },
      {
        "id": "m4_1_l6",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ khuyên người nam nên làm gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：这套西装颜色很沉稳，就是价格稍微贵了点儿，我有点犹豫。 女：你下周要去参加重要会议，穿得正式一些很有必要，而且衣服质量确实不错，值得买。",
        "audioPy": "Nán: Zhè tào xīzhuāng yánsè hěn chénwěn, jiùshì jiàgé shāowēi guì le diǎnr, wǒ yǒudiǎn yóuyù. Nǚ: Nǐ xià zhōu yào qù cānjiā zhòngyào huìyì, chuān de zhèngshì yìxiē hěn yǒu bìyào, érqiě yīfu zhìliàng quèshí búcuò, zhídé mǎi.",
        "audioVi": "Nam: Bộ đồ tây này màu sắc rất chững chạc, chỉ là giá hơi đắt một chút nên tôi hơi do dự. Nữ: Tuần sau anh đi dự hội nghị quan trọng, mặc trang trọng một chút rất cần thiết, vả lại chất lượng áo đúng là rất tốt, đáng mua đấy.",
        "opts": [
          "Đợi sang tháng sau giảm giá rồi mua",
          "Chọn bộ khác rẻ hơn ở cửa hàng bên cạnh",
          "Mua bộ đồ tây đó vì chất lượng tốt và hợp dịp họp",
          "Mượn đồng nghiệp một bộ để tiết kiệm tiền"
        ],
        "ans": 2,
        "exp": "Người nữ nói mặc trang trọng rất cần thiết, chất lượng tốt và đáng mua ('值得买')."
      },
      {
        "id": "m4_1_l7",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Cuối tuần này hai người nhiều khả năng sẽ làm gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "女：天气预报说这个星期天有中雨，咱们去郊区骑车的事儿是不是得改期？ 男：确实不太安全，不如去参观省博物馆新开的展览吧，听说特别精彩。",
        "audioPy": "Nǚ: Tiānqì yùbào shuō zhège xīngqītiān yǒu zhōngyǔ, zánmen qù jiāoqū qíchē de shìr shì bu shì děi gǎiqī? Nán: Quèshí bú tài ānquán, bùrú qù cānguān shěng bówùguǎn xīn kāi de zhǎnlǎn ba, tīngshuō tèbié jīngcǎi.",
        "audioVi": "Nữ: Dự báo thời tiết nói Chủ Nhật này có mưa vừa, chuyện chúng mình đi ngoại ô đạp xe có phải nên dời lịch không? Nam: Đúng là không an toàn lắm, chi bằng đi tham quan triển lãm mới mở ở bảo tàng tỉnh đi, nghe nói đặc sắc lắm.",
        "opts": [
          "Vẫn đạp xe ra ngoại ô như kế hoạch cũ",
          "Ở nhà xem dự báo thời tiết",
          "Đi tham quan triển lãm mới ở bảo tàng tỉnh",
          "Đi xem phim ở trung tâm thương mại"
        ],
        "ans": 2,
        "exp": "Do trời mưa, người nam đề xuất '去参观省博物馆新开的展览吧' (đi xem triển lãm mới ở bảo tàng tỉnh)."
      },
      {
        "id": "m4_1_l8",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nam đánh giá thế nào về quán ăn mới mở?",
        "statement": "",
        "statementPy": "",
        "audioZh": "女：昨晚你跟朋友去吃的那家川菜馆怎么样？值得推荐吗？ 男：菜的味道倒是很正宗，服务员态度也热情，就是排队的人实在太多了，我们等了一个多小时才坐下，下次去得提前在网上取号。",
        "audioPy": "Nǚ: Zuówǎn nǐ gēn péngyou qù chī de nà jiā Chuāncàiguǎn zěnmeyàng? Zhídé tuījiàn ma? Nán: Cài de wèidào dào shì hěn zhèngzōng, fúwùyuán tàidù yě rèqíng, jiùshì páiduì de rén shízài tài duō le, wǒmen děng le yí ge duō xiǎoshí cái zuòxià, xiàcì qù děi tíqián zài wǎngshàng qǔhào.",
        "audioVi": "Nữ: Quán món Tứ Xuyên tối qua cậu đi ăn cùng bạn thế nào? Có đáng giới thiệu không? Nam: Vị món ăn thì rất chuẩn vị, thái độ phục vụ cũng nhiệt tình, chỉ có điều người xếp hàng đông quá, bọn mình đợi hơn một tiếng mới được ngồi, lần sau đi phải lấy số trước trên mạng.",
        "opts": [
          "Món ăn quá cay và phục vụ chậm chạp",
          "Giá cả quá đắt so với chất lượng",
          "Món ngon, phục vụ nhiệt tình nhưng phải xếp hàng rất lâu",
          "Không gian rộng rãi nên không cần đặt bàn"
        ],
        "ans": 2,
        "exp": "Anh ấy khen chuẩn vị ('很正宗'), nhiệt tình ('热情'), nhưng chê phải đợi hơn 1 tiếng mới có chỗ ('排队的人实在太多了')."
      },
      {
        "id": "m4_1_l9",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Điều gì giúp nâng cao hiệu quả làm việc buổi sáng theo người nói?",
        "statement": "",
        "statementPy": "",
        "audioZh": "很多上班族习惯早上到公司后先回复各种消息，结果一上午过去了，最重要的任务却还没开始。其实，每天早上头脑最清醒的那一个小时，应该优先处理最难、最核心的工作，这样一天的效率都会大大提高。",
        "audioPy": "Hěn duō shàngbānzú xíguàn zǎoshang dào gōngsī hòu xiān huífù gèzhǒng xiāoxi, jiéguǒ yí shàngwǔ guòqù le, zuì zhòngyào de rènwu què hái méi kāishǐ. Qíshí, měitiān zǎoshang tóunǎo zuì qīngxǐng de nà yí ge xiǎoshí, yīnggāi yōuxiān chǔlǐ zuì nán, zuì héxīn de gōngzuò, zhèyàng yì tiān de xiàolǜ dōu huì dàdà tígāo.",
        "audioVi": "Nhiều nhân viên văn phòng quen buổi sáng đến công ty là trả lời các loại tin nhắn trước, kết quả hết cả buổi sáng mà nhiệm vụ quan trọng nhất vẫn chưa bắt đầu. Thật ra, một tiếng đầu óc tỉnh táo nhất mỗi sáng nên ưu tiên xử lý công việc khó và cốt lõi nhất, như vậy hiệu suất cả ngày sẽ tăng lên đáng kể.",
        "opts": [
          "Trả lời toàn bộ tin nhắn ngay khi vừa đến công ty",
          "Ưu tiên giải quyết việc khó và cốt lõi nhất vào giờ đầu buổi sáng",
          "Uống hai tách cà phê trước khi bật máy tính",
          "Dành việc quan trọng nhất để làm vào cuối buổi chiều"
        ],
        "ans": 1,
        "exp": "Đoạn văn nhấn mạnh dùng một giờ tỉnh táo nhất buổi sáng để '优先处理最难、最核心的工作' (ưu tiên xử lý việc khó và cốt lõi nhất)."
      },
      {
        "id": "m4_1_l10",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Vì sao bác Trương lại cảm thấy vui khi nghỉ hưu?",
        "statement": "",
        "statementPy": "",
        "audioZh": "张叔叔去年从中学退休以后，不但没有觉得寂寞，反而把生活安排得十分丰富。他报名参加了社区的书法班，每周还跟老朋友们去公园打太极拳，身体比以前更硬朗了。",
        "audioPy": "Zhāng shūshu qùnián cóng zhōngxué tuìxiū yǐhòu, búdàn méiyǒu juéde jìmò, fǎn'ér bǎ shēnghuó ānpái de shífēn fēngfù. Tā bàomíng cānjiā le shèqū de shūfǎbān, měizhōu hái gēn lǎo péngyoumen qù gōngyuán dǎ tàijíquán, shēntǐ bǐ yǐqián gèng yìnglang le.",
        "audioVi": "Chú Trương sau khi nghỉ hưu ở trường trung học năm ngoái, chẳng những không thấy cô đơn mà còn sắp xếp cuộc sống vô cùng phong phú. Chú đăng ký lớp thư pháp ở khu dân cư, mỗi tuần còn cùng bạn cũ ra công viên tập thái cực quyền, sức khỏe còn rắn rỏi hơn trước.",
        "opts": [
          "Vì chú tiếp tục đi dạy thêm ở trung tâm ngoại ngữ",
          "Vì chú sắp xếp cuộc sống phong phú với lớp thư pháp và tập thái cực quyền",
          "Vì chú chuyển về quê sống một mình yên tĩnh",
          "Vì con cháu tổ chức đi du lịch nước ngoài suốt cả năm"
        ],
        "ans": 1,
        "exp": "Chú Trương tham gia lớp thư pháp ('书法班') và tập thái cực quyền ('打太极拳') nên sống phong phú và khỏe mạnh hơn."
      }
    ],
    "reading": [
      {
        "id": "m4_1_r1",
        "partLabel": "Phần 1 • Chọn từ điền vào chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ thích hợp điền vào chỗ trống: 无论做什么事情，我们都不能只看表面，而要仔细______里面的原因。",
        "qPy": "Wúlùn zuò shénme shìqing, wǒmen dōu bù néng zhǐ kàn biǎomiàn, ér yào zǐxì ______ lǐmiàn de yuányīn.",
        "orderItems": [],
        "opts": [
          "分析",
          "排队",
          "举办",
          "丰富"
        ],
        "ans": 0,
        "exp": "Đáp án đúng: A. 分析 (fēnxī — phân tích). Cụm '分析原因' (phân tích nguyên nhân) là kết hợp chuẩn xác. B: xếp hàng, C: tổ chức, D: phong phú."
      },
      {
        "id": "m4_1_r2",
        "partLabel": "Phần 1 • Chọn từ điền vào chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ thích hợp điền vào chỗ trống: 这位导游不仅普通话说得非常流利，______对当地的历史文化也很了解。",
        "qPy": "Zhè wèi dǎoyóu bùjǐn Pǔtōnghuà shuō de fēicháng liúlì, ______ duì dāngdì de lìshǐ wénhuà yě hěn liǎojiě.",
        "orderItems": [],
        "opts": [
          "否则",
          "因此",
          "而且",
          "于是"
        ],
        "ans": 2,
        "exp": "Đáp án đúng: C. 而且 (érqiě — mà còn). Cấu trúc liên từ cố định: '不仅……，而且……' (không chỉ... mà còn...). A: nếu không thì, B: do đó, D: thế là."
      },
      {
        "id": "m4_1_r3",
        "partLabel": "Phần 1 • Chọn từ điền vào chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ thích hợp điền vào chỗ trống: 经过半年的努力锻炼，他终于______减掉了十公斤，整个人显得特别精神。",
        "qPy": "Jīngguò bàn nián de nǔlì duànliàn, tā zhōngyú ______ jiǎndiào le shí gōngjīn, zhěng ge rén xiǎnde tèbié jīngshen.",
        "orderItems": [],
        "opts": [
          "成功",
          "正常",
          "骄傲",
          "严格"
        ],
        "ans": 0,
        "exp": "Đáp án đúng: A. 成功 (chénggōng — thành công). Phó từ/động từ '成功减掉了十公斤' (giảm thành công 10 kg). B: bình thường, C: kiêu ngạo, D: nghiêm khắc."
      },
      {
        "id": "m4_1_r4",
        "partLabel": "Phần 2 • Sắp xếp câu thành đoạn văn",
        "kind": "order",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Sắp xếp 3 câu A - B - C thành đoạn văn có logic mạch lạc nhất:",
        "qPy": "",
        "orderItems": [
          "A. 不过，也有人认为网络购物容易让人买回许多不需要的东西。",
          "B. 如今，越来越多的人喜欢在网上购买生活用品。",
          "C. 因为这样既可以节省逛街的时间，又方便比较不同商家的价格。"
        ],
        "opts": [
          "B - C - A",
          "A - B - C",
          "C - B - A",
          "B - A - C"
        ],
        "ans": 0,
        "exp": "Thứ tự đúng: B - C - A. Câu B nêu hiện tượng mua sắm trực tuyến ngày càng phổ biến; câu C dùng '因为这样' giải thích lý do; câu A dùng '不过' chuyển sang mặt trái.\n• Pinyin: Rújīn, yuèláiyuè duō de rén xǐhuan zài wǎngshàng gòumǎi shēnghuó yòngpǐn. Yīnwèi zhèyàng jì kěyǐ jiéshěng guàngjiē de shíjiān, yòu fāngbiàn bǐjiào bùtóng shāngjiā de jiàgé. Búguò, yě yǒu rén rènwéi wǎngluò gòuwù róngyì ràng rén mǎihuí xǔduō bù xūyào de dōngxi.\n• Dịch: Ngày nay, ngày càng nhiều người thích mua đồ dùng sinh hoạt trên mạng. Bởi làm vậy vừa tiết kiệm thời gian dạo phố, vừa tiện so sánh giá các cửa hàng khác nhau. Tuy nhiên, cũng có người cho rằng mua sắm trực tuyến dễ khiến người ta mua về nhiều thứ không cần thiết."
      },
      {
        "id": "m4_1_r5",
        "partLabel": "Phần 2 • Sắp xếp câu thành đoạn văn",
        "kind": "order",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Sắp xếp 3 câu A - B - C thành đoạn văn có logic mạch lạc nhất:",
        "qPy": "",
        "orderItems": [
          "A. 于是，他决定每天晚上少看一个小时手机，早点上床休息。",
          "B. 最近几个月，小陈总觉得白天上班时很难集中注意力。",
          "C. 医生检查后告诉他，这主要是因为长期睡眠不足引起的。"
        ],
        "opts": [
          "B - C - A",
          "C - B - A",
          "A - C - B",
          "B - A - C"
        ],
        "ans": 0,
        "exp": "Thứ tự đúng: B - C - A. Câu B nêu triệu chứng khó tập trung; câu C bác sĩ chỉ ra nguyên nhân thiếu ngủ; câu A dùng '于是' nêu giải pháp.\n• Pinyin: Zuìjìn jǐ ge yuè, Xiǎo Chén zǒng juéde báitiān shàngbān shí hěn nán jízhōng zhùyìlì. Yīshēng jiǎnchá hòu gàosu tā, zhè zhǔyào shì yīnwèi chángqī shuìmián bùzú yǐnqǐ de. Yúshì, tā juédìng měitiān wǎnshang shǎo kàn yí ge xiǎoshí shǒujī, zǎodiǎn shàngchuáng xiūxi.\n• Dịch: Mấy tháng gần đây, Tiểu Trần luôn thấy ban ngày đi làm rất khó tập trung. Sau khi kiểm tra, bác sĩ bảo anh nguyên nhân chủ yếu là thiếu ngủ kéo dài. Thế là anh quyết định mỗi tối xem điện thoại ít đi một tiếng, lên giường nghỉ ngơi sớm."
      },
      {
        "id": "m4_1_r6",
        "partLabel": "Phần 2 • Sắp xếp câu thành đoạn văn",
        "kind": "order",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Sắp xếp 3 câu A - B - C thành đoạn văn có logic mạch lạc nhất:",
        "qPy": "",
        "orderItems": [
          "A. 只要我们坚持用真诚的态度对待别人，就一定能交到真朋友。",
          "B. 真正的友谊并不是靠经常一起吃饭、送礼物来维持的。",
          "C. 相反，它体现在困难时互相支持、快乐时彼此分享。"
        ],
        "opts": [
          "C - B - A",
          "B - C - A",
          "A - B - C",
          "B - A - C"
        ],
        "ans": 1,
        "exp": "Thứ tự đúng: B - C - A. Câu B phủ định cách hiểu sai về tình bạn ('并不是靠……'); câu C dùng '相反' nêu bản chất thật sự; câu A tổng kết bài học.\n• Pinyin: Zhēnzhèng de yǒuyì bìng bú shì kào jīngcháng yìqǐ chīfàn, sòng lǐwù lái wéichí de. Xiāngfǎn, tā tǐxiàn zài kùnnan shí hùxiāng zhīchí, kuàilè shí bǐcǐ fēnxiǎng. Zhǐyào wǒmen jiānchí yòng zhēnchéng de tàidù duìdài biérén, jiù yídìng néng jiāodào zhēn péngyou.\n• Dịch: Tình bạn chân chính không phải dựa vào việc thường xuyên ăn uống cùng nhau, tặng quà mà duy trì. Ngược lại, nó thể hiện ở việc ủng hộ nhau lúc khó khăn và sẻ chia khi vui vẻ. Chỉ cần ta kiên trì đối xử chân thành với người khác, nhất định sẽ kết giao được bạn thật lòng."
      },
      {
        "id": "m4_1_r7",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "很多人在旅行前喜欢把行程安排得满满的，生怕错过任何一个著名的景点。然而，走马观花式的旅行往往让人感到十分疲惫，根本来不及感受当地的风土人情。其实，放慢脚步，在街角的小店喝杯茶，跟当地人聊聊天，反而能收获更难忘的回忆。",
        "passagePy": "Hěn duō rén zài lǚxíng qián xǐhuan bǎ xíngchéng ānpái de mǎnmǎn de, shēngpà cuòguò rènhé yí ge zhùmíng de jǐngdiǎn. Rán'ér, zǒumǎguānhuā shì de lǚxíng wǎngwǎng ràng rén gǎndào shífēn píbèi, gēnběn láibují gǎnshòu dāngdì de fēngtǔ rénqíng. Qíshí, fàngmàn jiǎobù, zài jiējiǎo de xiǎodiàn hē bēi chá, gēn dāngdìrén liáoliao tiān, fǎn'ér néng shōuhuò gèng nánwàng de huíyì.",
        "passageVi": "Nhiều người trước khi đi du lịch thích sắp xếp lịch trình kín mít, chỉ sợ bỏ lỡ bất kỳ danh thắng nổi tiếng nào. Tuy nhiên, kiểu du lịch cưỡi ngựa xem hoa thường khiến người ta cảm thấy vô cùng mệt mỏi, căn bản không kịp cảm nhận phong tục tình người địa phương. Thật ra, chậm bước lại, uống tách trà ở quán nhỏ góc phố, trò chuyện với người bản địa, ngược lại có thể gặt hái những kỷ niệm khó quên hơn.",
        "q": "Theo đoạn văn, cách du lịch nào giúp có được trải nghiệm đáng nhớ hơn?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Xếp lịch thật dày để đi hết mọi điểm nổi tiếng",
          "Đi theo đoàn đông người để tiết kiệm chi phí",
          "Chậm rãi tận hưởng không khí và trò chuyện với người địa phương",
          "Chỉ chụp ảnh tại cổng các khu du lịch lớn"
        ],
        "ans": 2,
        "exp": "Câu cuối đoạn văn nêu rõ: chậm bước lại ('放慢脚步'), uống trà ở quán nhỏ và trò chuyện với người bản địa sẽ thu được kỷ niệm khó quên hơn."
      },
      {
        "id": "m4_1_r8",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "研究发现，室内摆放一些绿色植物不仅能美化环境，还能让人心情变得更平静。尤其对于整天面对电脑屏幕的办公室职员来说，工作间隙看一看桌上的绿植，有助于缓解眼睛疲劳。不过，选植物时要了解它们是否需要充足的阳光，否则很容易枯萎。",
        "passagePy": "Yánjiū fāxiàn, shìnèi bǎifàng yìxiē lǜsè zhíwù bùjǐn néng měihuà huánjìng, hái néng ràng rén xīnqíng biànde gèng píngjìng. Yóuqí duìyú zhěngtiān miànduì diànnǎo píngmù de bàngōngshì zhíyuán lái shuō, gōngzuò jiànxì kàn yi kàn zhuōshàng de lǜzhí, yǒuzhùyú huǎnjiě yǎnjing píláo. Búguò, xuǎn zhíwù shí yào liǎojiě tāmen shìfǒu xūyào chōngzú de yángguāng, fǒuzé hěn róngyì kūwěi.",
        "passageVi": "Nghiên cứu phát hiện, bày một số cây xanh trong nhà không chỉ làm đẹp môi trường mà còn giúp tâm trạng trở nên bình tĩnh hơn. Đặc biệt với nhân viên văn phòng cả ngày đối diện màn hình máy tính, giờ nghỉ giữa lúc làm việc ngắm cây xanh trên bàn có tác dụng giảm mỏi mắt. Tuy nhiên, khi chọn cây cần tìm hiểu xem chúng có cần đủ ánh nắng hay không, nếu không sẽ rất dễ héo úa.",
        "q": "Đoạn văn nhắc nhở điều gì khi chọn cây xanh đặt trong phòng làm việc?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Phải chọn cây có hoa nhiều màu sắc rực rỡ",
          "Cần tìm hiểu nhu cầu ánh sáng của cây để tránh bị héo",
          "Nên đặt cây sát màn hình máy tính để chắn bức xạ",
          "Chỉ nên tưới nước mỗi tháng một lần"
        ],
        "ans": 1,
        "exp": "Câu cuối viết: '选植物时要了解它们是否需要充足的阳光，否则很容易枯萎' (cần tìm hiểu xem cây có cần đủ nắng không)."
      },
      {
        "id": "m4_1_r9",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "“垃圾分类”看起来是一件小事，实际上却需要极大的耐心和坚持。刚推行时，不少居民觉得记不清各种垃圾桶的颜色，十分麻烦。但随着社区志愿者耐心地解释和引导，大家慢慢养成了习惯，小区的环境也比以前干净整洁多了。",
        "passagePy": "'Lājī fēnlèi' kàn qǐlái shì yí jiàn xiǎoshì, shíjìshàng què xūyào jídà de nàixīn hé jiānchí. Gāng tuīxíng shí, bùshǎo jūmín juéde jì bu qīng gèzhǒng lājītǒng de yánsè, shífēn máfan. Dàn suízhe shèqū zhìyuànzhě nàixīn de jiěshì hé yǐndǎo, dàjiā mànmàn yǎngchéng le xíguàn, xiǎoqū de huánjìng yě bǐ yǐqián gānjìng zhěngjié duō le.",
        "passageVi": "'Phân loại rác' nhìn tưởng là việc nhỏ, thực tế lại đòi hỏi sự kiên nhẫn và bền bỉ rất lớn. Lúc mới triển khai, không ít cư dân thấy không nhớ nổi màu sắc các loại thùng rác, rất phiền phức. Nhưng nhờ tình nguyện viên khu dân cư kiên nhẫn giải thích và hướng dẫn, mọi người dần hình thành thói quen, môi trường khu chung cư cũng sạch đẹp gọn gàng hơn trước nhiều.",
        "q": "Nhờ đâu mà cư dân dần hình thành được thói quen phân loại rác?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Nhờ lắp đặt máy tự động phân loại ở từng tầng",
          "Nhờ các tình nguyện viên kiên nhẫn giải thích và hướng dẫn",
          "Nhờ tăng tiền phạt đối với người vứt rác bừa bãi",
          "Nhờ giảm số lượng thùng rác xuống còn một màu"
        ],
        "ans": 1,
        "exp": "Đoạn văn nêu rõ: '随着社区志愿者耐心地解释和引导，大家慢慢养成了习惯'."
      },
      {
        "id": "m4_1_r10",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "每个人学习外语的方法都不太一样。有的人喜欢通过背单词书来打基础，有的人则喜欢看原声电影来提高听力。不管采用哪种方式，最怕的就是“三天打鱼，两天晒网”。每天哪怕只花二十分钟，只要长期积累，水平自然会提高。",
        "passagePy": "Měi ge rén xuéxí wàiyǔ de fāngfǎ dōu bú tài yíyàng. Yǒude rén xǐhuan tōngguò bèi dāncíshū lái dǎ jīchǔ, yǒude rén zé xǐhuan kàn yuánshēng diànyǐng lái tígāo tīnglì. Bùguǎn cǎiyòng nǎ zhǒng fāngshì, zuì pà de jiùshì 'sān tiān dǎ yú, liǎng tiān shài wǎng'. Měitiān nǎpà zhǐ huā èrshí fēnzhōng, zhǐyào chángqī jīlěi, shuǐpíng zìrán huì tígāo.",
        "passageVi": "Phương pháp học ngoại ngữ của mỗi người đều không hoàn toàn giống nhau. Có người thích học thuộc sách từ vựng để xây nền tảng, có người lại thích xem phim nguyên bản để nâng cao kỹ năng nghe. Dù áp dụng cách nào, đáng sợ nhất vẫn là 'ba ngày đánh cá, hai ngày phơi lưới' (làm việc thiếu kiên trì). Mỗi ngày dù chỉ dành 20 phút, chỉ cần tích lũy lâu dài, trình độ tự khắc sẽ tăng lên.",
        "q": "Tác giả muốn nhấn mạnh điều quan trọng nhất khi học ngoại ngữ là gì?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Phải học thuộc hết cả cuốn từ điển trước khi nghe",
          "Mỗi ngày cần học ít nhất ba tiếng đồng hồ",
          "Sự kiên trì tích lũy đều đặn mỗi ngày, tránh bỏ dở",
          "Chỉ cần xem phim là đủ, không cần học từ vựng"
        ],
        "ans": 2,
        "exp": "Tác giả nhắc tránh '三天打鱼，两天晒网' (làm bữa đực bữa cái) và khẳng định '每天哪怕只花二十分钟，只要长期积累，水平自然会提高'."
      }
    ],
    "writing": [
      {
        "id": "m4_1_w1",
        "partLabel": "Phần 1 • Sắp xếp từ thành câu",
        "type": "reorder",
        "words": [
          "经理",
          "仔细",
          "把",
          "重新",
          "计划书",
          "修改了",
          "一遍"
        ],
        "answer": "经理把计划书仔细重新修改了一遍。",
        "py": "Jīnglǐ bǎ jìhuàshū zǐxì chóngxīn xiūgǎi le yíbiàn.",
        "vi": "Giám đốc đã sửa lại bản kế hoạch một lượt thật cẩn thận.",
        "exp": "Cấu trúc câu chữ 把: Chủ ngữ (经理) + 把 + Tân ngữ (计划书) + Trạng ngữ (仔细 + 重新) + Động từ + 了 + Bổ ngữ động lượng (一遍)."
      },
      {
        "id": "m4_1_w2",
        "partLabel": "Phần 1 • Sắp xếp từ thành câu",
        "type": "reorder",
        "words": [
          "这个",
          "给",
          "印象",
          "我",
          "留下了",
          "城市",
          "深刻的"
        ],
        "answer": "这个城市给我留下了深刻的印象。",
        "py": "Zhège chéngshì gěi wǒ liúxià le shēnkè de yìnxiàng.",
        "vi": "Thành phố này đã để lại cho tôi ấn tượng sâu sắc.",
        "exp": "Cấu trúc cố định HSK 4: '……给某人留下了深刻的印象' (Cái gì đó để lại cho ai ấn tượng sâu sắc)."
      },
      {
        "id": "m4_1_w3",
        "partLabel": "Phần 1 • Sắp xếp từ thành câu",
        "type": "reorder",
        "words": [
          "他",
          "甚至",
          "忙得",
          "连",
          "都",
          "吃午饭",
          "忘记了"
        ],
        "answer": "他忙得甚至连吃午饭都忘记了。",
        "py": "Tā máng de shènzhì lián chī wǔfàn dōu wàngjì le.",
        "vi": "Anh ấy bận đến nỗi thậm chí ngay cả ăn trưa cũng quên mất.",
        "exp": "Kết hợp bổ ngữ trình độ '忙得……' với cấu trúc nhấn mạnh '甚至连……都……' (thậm chí ngay cả... cũng...)."
      },
      {
        "id": "m4_1_w4",
        "partLabel": "Phần 2 • Đặt câu với từ cho sẵn",
        "type": "make_sentence",
        "keyword": "鼓励",
        "keywordPy": "gǔlì",
        "requiredTokens": [
          "鼓励"
        ],
        "sceneHint": "Đặt một câu hoàn chỉnh (tối thiểu 6 chữ Hán) dùng từ 鼓励 (động viên, khích lệ) trong bối cảnh học tập hoặc gia đình.",
        "sampleZh": "老师经常鼓励我们要勇敢面对困难。",
        "samplePy": "Lǎoshī jīngcháng gǔlì wǒmen yào yǒnggǎn miànduì kùnnan.",
        "sampleVi": "Thầy giáo thường xuyên động viên chúng tôi phải dũng cảm đối mặt với khó khăn.",
        "exp": "Động từ '鼓励' dùng theo mẫu 'A 鼓励 B (làm gì)' hoặc danh từ '给予鼓励'. Câu mẫu rõ chủ ngữ, phó từ tần suất và cụm động-tân chuẩn HSK 4."
      },
      {
        "id": "m4_1_w5",
        "partLabel": "Phần 2 • Đặt câu với từ cho sẵn",
        "type": "make_sentence",
        "keyword": "尽管",
        "keywordPy": "jǐnguǎn",
        "requiredTokens": [
          "尽管"
        ],
        "sceneHint": "Đặt một câu hoàn chỉnh (tối thiểu 6 chữ Hán) dùng liên từ 尽管 (mặc dù..., thường đi với 还是 / 但是).",
        "sampleZh": "尽管外面下着大雨，他还是准时赶到了会议室。",
        "samplePy": "Jǐnguǎn wàimiàn xià zhe dàyǔ, tā háishi zhǔnshí gǎndào le huìyìshì.",
        "sampleVi": "Mặc dù bên ngoài trời đang mưa to, anh ấy vẫn đến phòng họp đúng giờ.",
        "exp": "Liên từ '尽管' biểu thị nhượng bộ ('mặc dù'), vế sau thường phối hợp với '还是' hoặc '但是' để tạo câu phức mạch lạc."
      }
    ]
  },
  {
    "id": "mock_hsk4_2",
    "level": 4,
    "testNo": 2,
    "badge": "HSK 4 • Đề số 2",
    "title": "Đề Thi Thử HSK 4 — Đề Số 2",
    "subtitle": "25 câu chuẩn thi máy • Nghe (10) • Đọc (10) • Viết (5) • Chủ đề: Sức khỏe & Giáo dục",
    "durationSec": 6000,
    "maxScore": 300,
    "passScore": 180,
    "listening": [
      {
        "id": "m4_2_l1",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe đoạn thu âm sau và phán đoán câu nhận định bên dưới là Đúng hay Sai:",
        "statement": "★ 他今天早上没赶上第一班公交车。",
        "statementPy": "Tā jīntiān zǎoshang méi gǎnshàng dì-yī bān gōngjiāochē.",
        "audioZh": "今天早上闹钟响了以后我又睡了十分钟，出门时已经七点二十了，到车站的时候第一班公交车刚刚开走，只好等下一班。",
        "audioPy": "Jīntiān zǎoshang nàozhōng xiǎng le yǐhòu wǒ yòu shuì le shí fēnzhōng, chūmén shí yǐjīng qī diǎn èrshí le, dào chēzhàn de shíhou dì-yī bān gōngjiāochē gānggāng kāizǒu, zhǐhǎo děng xià yì bān.",
        "audioVi": "Sáng nay sau khi đồng hồ báo thức reo tôi ngủ thêm mười phút nữa, lúc ra khỏi nhà đã 7 giờ 20 rồi, khi tới bến thì chuyến xe buýt đầu tiên vừa mới chạy mất, đành đợi chuyến tiếp theo.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 0,
        "exp": "Đúng (对). Khi đến bến thì chuyến xe buýt đầu tiên vừa mới chạy mất ('刚刚开走'), nghĩa là không kịp bắt chuyến đó."
      },
      {
        "id": "m4_2_l2",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe đoạn thu âm sau và phán đoán câu nhận định bên dưới là Đúng hay Sai:",
        "statement": "★ 这位医生建议病人每天多喝甜饮料。",
        "statementPy": "Zhè wèi yīshēng jiànyì bìngrén měitiān duō hē tián yǐnliào.",
        "audioZh": "你的血糖稍微有点高，平时一定要注意饮食清淡，少吃油炸食物，尤其要戒掉各种含糖饮料，多喝白开水。",
        "audioPy": "Nǐ de xuètáng shāowēi yǒudiǎn gāo, píngshí yídìng yào zhùyì yǐnshí qīngdàn, shǎo chī yóuzhá shíwù, yóuqí yào jièdiào gèzhǒng hántáng yǐnliào, duō hē báikāishuǐ.",
        "audioVi": "Đường huyết của bạn hơi cao một chút, ngày thường nhất định phải chú ý ăn uống thanh đạm, ít ăn đồ chiên rán, đặc biệt phải bỏ các loại nước ngọt có đường, uống nhiều nước lọc đun sôi.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Sai (错). Bác sĩ khuyên bỏ đồ uống có đường ('戒掉各种含糖饮料') và uống nhiều nước lọc ('多喝白开水')."
      },
      {
        "id": "m4_2_l3",
        "partLabel": "Phần 1 • Phán đoán Đúng/Sai",
        "type": "tf",
        "prompt": "Nghe đoạn thu âm sau và phán đoán câu nhận định bên dưới là Đúng hay Sai:",
        "statement": "★ 小刘最后决定自己修理那台旧笔记本。",
        "statementPy": "Xiǎo Liú zuìhòu juédìng zìjǐ xiūlǐ nà tái jiù bǐjìběn.",
        "audioZh": "小刘那台笔记本用了六年，最近经常突然黑屏。他本来想拿去维修店修一下，后来算了算维修费太高，干脆直接换了一台新电脑。",
        "audioPy": "Xiǎo Liú nà tái bǐjìběn yòng le liù nián, zuìjìn jīngcháng tūrán hēipíng. Tā běnlái xiǎng ná qù wéixiūdiàn xiū yíxià, hòulái suàn le suàn wéixiūfèi tài gāo, gāncuì zhíjiē huàn le yì tái xīn diànnǎo.",
        "audioVi": "Chiếc máy tính xách tay của Tiểu Lưu dùng đã 6 năm, gần đây hay bị đen màn hình đột ngột. Ban đầu cậu định mang ra tiệm sửa, sau tính thấy phí sửa cao quá nên dứt khoát đổi thẳng sang máy mới.",
        "opts": [
          "Đúng (对)",
          "Sai (错)"
        ],
        "ans": 1,
        "exp": "Sai (错). Tiểu Lưu không tự sửa mà quyết định mua máy mới ('直接换了一台新电脑')."
      },
      {
        "id": "m4_2_l4",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ thấy cuốn tiểu thuyết mới đọc thế nào?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：上周借给你的那本小说看完了吗？觉得怎么样？ 女：前面几章稍微有点慢热，不过从第四章开始情节特别吸引人，我一口气就读完了。",
        "audioPy": "Nán: Shàng zhōu jiè gěi nǐ de nà běn xiǎoshuō kànwán le ma? Juéde zěnmeyàng? Nǚ: Qiánmiàn jǐ zhāng shāowēi yǒudiǎn mànrè, búguò cóng dì-sì zhāng kāishǐ qíngjié tèbié xīyǐn rén, wǒ yìkǒuqì jiù dúwán le.",
        "audioVi": "Nam: Cuốn tiểu thuyết cho cậu mượn tuần trước đọc xong chưa? Thấy thế nào? Nữ: Mấy chương đầu hơi chậm nhịp một chút, nhưng từ chương 4 trở đi tình tiết cực kỳ lôi cuốn, mình đọc một mạch hết luôn.",
        "opts": [
          "Đọc chán từ đầu đến cuối nên bỏ dở",
          "Mấy chương đầu hơi chậm nhưng phần sau rất cuốn hút",
          "Nội dung quá khó hiểu nên chưa đọc hết",
          "Chưa kịp mở ra xem vì bận thi"
        ],
        "ans": 1,
        "exp": "Cô ấy nói mấy chương đầu hơi chậm ('有点慢热'), nhưng từ chương 4 rất lôi cuốn ('特别吸引人') nên đọc một mạch xong."
      },
      {
        "id": "m4_2_l5",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Tại sao phòng tập thể dục hôm nay đóng cửa sớm?",
        "statement": "",
        "statementPy": "",
        "audioZh": "女：现在才晚上七点，健身房怎么就把灯关了？ 男：您没看到门口的通知吗？今天晚上电路检修，暂时提前到七点闭馆，明天恢复正常。",
        "audioPy": "Nǚ: Xiànzài cái wǎnshang qī diǎn, jiànshēnfáng zěnme jiù bǎ dēng guān le? Nán: Nín méi kàndào ménkǒu de tōngzhī ma? Jīntiān wǎnshang diànlù jiǎnxiū, zànshí tíqián dào qī diǎn bìguǎn, míngtiān huīfù zhèngcháng.",
        "audioVi": "Nữ: Giờ mới 7 giờ tối, sao phòng tập đã tắt đèn rồi? Nam: Chị không thấy thông báo ở cửa sao? Tối nay kiểm tra sửa chữa đường điện nên tạm thời đóng cửa sớm lúc 7 giờ, ngày mai hoạt động bình thường.",
        "opts": [
          "Vì huấn luyện viên nghỉ ốm đột xuất",
          "Vì tối nay sửa chữa kiểm tra đường điện",
          "Vì trời mưa to làm ngập tầng hầm",
          "Vì hết hợp đồng thuê mặt bằng"
        ],
        "ans": 1,
        "exp": "Lý do được nêu rõ: '今天晚上电路检修' (Tối nay kiểm tra sửa chữa mạch điện)."
      },
      {
        "id": "m4_2_l6",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Hai người đang ở đâu?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：请您把这张表格填好，顺便把身份证给我核对一下。 女：好的，麻烦问一下，办完新卡以后密码可以在旁边的机器上修改吗？",
        "audioPy": "Nán: Qǐng nín bǎ zhè zhāng biǎogé tiánhǎo, shùnbiàn bǎ shēnfènzhèng gěi wǒ héduì yíxià. Nǚ: Hǎo de, máfan wèn yíxià, bànwán xīn kǎ yǐhòu mìmǎ kěyǐ zài pángbiān de jīqì shàng xiūgǎi ma?",
        "audioVi": "Nam: Mời chị điền xong tờ biểu mẫu này, tiện thể đưa căn cước công dân để tôi đối chiếu chút nhé. Nữ: Vâng, phiền anh hỏi chút, sau khi làm xong thẻ mới thì mật khẩu có thể đổi ở máy bên cạnh không?",
        "opts": [
          "Ở ngân hàng",
          "Ở hiệu thuốc",
          "Ở ga tàu hỏa",
          "Ở bưu điện gửi hàng"
        ],
        "ans": 0,
        "exp": "Các chi tiết 'điền biểu mẫu', 'đối chiếu căn cước', 'làm thẻ mới' và 'đổi mật khẩu ở máy bên cạnh' chỉ bối cảnh ngân hàng."
      },
      {
        "id": "m4_2_l7",
        "partLabel": "Phần 2 • Hội thoại ngắn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nam muốn tặng quà gì cho mẹ?",
        "statement": "",
        "statementPy": "",
        "audioZh": "女：下个月就是阿姨六十岁生日了，你打算送她什么礼物？ 男：她平时最喜欢听京剧和散步，我想给她买一双轻便舒服的运动鞋。",
        "audioPy": "Nán: Xià ge yuè jiùshì āyí liùshí suì shēngrì le, nǐ dǎsuàn sòng tā shénme lǐwù? Nán: Tā píngshí zuì xǐhuan tīng Jīngjù hé sànbù, wǒ xiǎng gěi tā mǎi yì shuāng qīngbiàn shūfu de yùndòngxié.",
        "audioVi": "Nữ: Tháng sau là sinh nhật 60 tuổi của bác gái rồi, cậu định tặng bác món quà gì? Nam: Mẹ mình bình thường thích nhất nghe Kinh kịch và đi dạo, mình định mua tặng mẹ một đôi giày thể thao nhẹ và êm.",
        "opts": [
          "Một cặp vé xem Kinh kịch",
          "Một đôi giày thể thao nhẹ và thoải mái",
          "Một chiếc đồng hồ đeo tay cổ điển",
          "Một bộ ấm trà gốm sứ"
        ],
        "ans": 1,
        "exp": "Người nam nói rõ: '我想给她买一双轻便舒服的运动鞋' (mua một đôi giày thể thao nhẹ nhàng êm ái)."
      },
      {
        "id": "m4_2_l8",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Vì sao người nữ lại chuyển từ chuyên ngành kế toán sang thiết kế?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：听说你大学毕业后并没有做会计，而是改行做平面设计了，家里人支持吗？ 女：刚开始父母也很担心，但我从小就喜欢画画，做设计虽然经常熬夜，却让我每天都充满热情，现在作品得到认可，他们也放心了。",
        "audioPy": "Nán: Tīngshuō nǐ dàxué bìyè hòu bìng méiyǒu zuò kuàijì, érshì gǎiháng zuò píngmiàn shèjì le, jiālǐrén zhīchí ma? Nǚ: Gāng kāishǐ fùmǔ yě hěn dānxīn, dàn wǒ cóngxiǎo jiù xǐhuan huàhuà, zuò shèjì suīrán jīngcháng áoyè, què ràng wǒ měitiān dōu chōngmǎn rèqíng, xiànzài zuòpǐn dédào rènkě, tāmen yě fàngxīn le.",
        "audioVi": "Nam: Nghe nói sau khi tốt nghiệp đại học cậu không làm kế toán mà chuyển sang thiết kế đồ họa, người nhà có ủng hộ không? Nữ: Lúc đầu bố mẹ cũng lo lắm, nhưng từ nhỏ mình đã thích vẽ, làm thiết kế tuy hay thức khuya nhưng khiến mình mỗi ngày đều tràn đầy nhiệt huyết, giờ tác phẩm được công nhận nên bố mẹ cũng yên tâm rồi.",
        "opts": [
          "Vì nghề kế toán không có cơ hội thăng tiến",
          "Vì yêu thích hội họa từ nhỏ và cảm thấy tràn đầy đam mê với thiết kế",
          "Vì công việc thiết kế không bao giờ phải tăng ca",
          "Vì bố mẹ yêu cầu cô đổi sang ngành thiết kế"
        ],
        "ans": 1,
        "exp": "Cô chia sẻ thích vẽ từ nhỏ ('从小就喜欢画画') và nghề thiết kế khiến cô mỗi ngày đều tràn đầy nhiệt huyết ('充满热情')."
      },
      {
        "id": "m4_2_l9",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Tác giả khuyên chúng ta nên đối diện với những lời phê bình như thế nào?",
        "statement": "",
        "statementPy": "",
        "audioZh": "没有人喜欢听批评的话，但有时候，刺耳的意见恰恰能帮我们看清自己的不足。只要对方不是恶意攻击，我们就应该虚心听一听，把批评当成一次改进自己的机会。",
        "audioPy": "Méiyǒu rén xǐhuan tīng pīpíng de huà, dàn yǒu shíhou, cì'ěr de yìjiàn qiàqià néng bāng wǒmen kànqīng zìjǐ de bùzú. Zhǐyào duìfāng bú shì èyì gōngjī, wǒmen jiù yīnggāi xūxīn tīng yi tīng, bǎ pīpíng dàngchéng yí cì gǎijìn zìjǐ de jīhuì.",
        "audioVi": "Không ai thích nghe lời phê bình, nhưng đôi khi những ý kiến khó nghe lại giúp chúng ta nhìn rõ thiếu sót của bản thân. Chỉ cần đối phương không công kích ác ý, ta nên khiêm tốn lắng nghe, xem lời phê bình như một cơ hội để hoàn thiện mình.",
        "opts": [
          "Phản bác ngay để bảo vệ danh dự cá nhân",
          "Khiêm tốn lắng nghe và coi đó là cơ hội cải thiện bản thân",
          "Bỏ qua mọi nhận xét của người khác",
          "Chỉ nghe lời khen từ bạn bè thân thiết"
        ],
        "ans": 1,
        "exp": "Đoạn văn khuyên: '虚心听一听，把批评当成一次改进自己的机会' (khiêm tốn lắng nghe, coi phê bình là cơ hội cải thiện)."
      },
      {
        "id": "m4_2_l10",
        "partLabel": "Phần 3 • Hội thoại dài & Đoạn văn",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Vì sao việc ghi chép tay trong lớp học vẫn rất hữu ích?",
        "statement": "",
        "statementPy": "",
        "audioZh": "现在很多大学生喜欢直接用手机拍下老师的板书，觉得这样既省事又不会漏掉重点。但心理学研究显示，亲手记笔记能迫使大脑主动整理和筛选信息，记忆效果比单纯拍照好得多。",
        "audioPy": "Xiànzài hěn duō dàxuéshēng xǐhuan zhíjiē yòng shǒujī pāixià lǎoshī de bǎnshū, juéde zhèyàng jì shěngshì yòu bú huì lòudiào zhòngdiǎn. Dàn xīnlǐxué yánjiū xiǎnshì, qīnshǒu jì bǐjì néng pòshǐ dànǎo zhǔdòng zhěnglǐ hé shāixuǎn xìnxī, jìyì xiàoguǒ bǐ dānchún pāizhào hǎo de duō.",
        "audioVi": "Hiện nay nhiều sinh viên đại học thích dùng điện thoại chụp thẳng bảng viết của thầy cô, thấy vừa đỡ tốn công vừa không bỏ sót trọng điểm. Nhưng nghiên cứu tâm lý học cho thấy tự tay ghi chép buộc não bộ chủ động sắp xếp và chọn lọc thông tin, hiệu quả ghi nhớ tốt hơn hẳn việc chỉ chụp ảnh.",
        "opts": [
          "Vì chữ viết tay đẹp hơn chữ chụp trên màn hình",
          "Vì giúp não chủ động sắp xếp, chọn lọc thông tin nên nhớ lâu hơn",
          "Vì điện thoại thường bị hết pin giữa giờ học",
          "Vì thầy cô không cho phép mang điện thoại vào lớp"
        ],
        "ans": 1,
        "exp": "Bài nêu: tự ghi chép thúc đẩy não bộ chủ động sắp xếp và chọn lọc thông tin ('主动整理和筛选信息'), giúp nhớ tốt hơn."
      }
    ],
    "reading": [
      {
        "id": "m4_2_r1",
        "partLabel": "Phần 1 • Chọn từ điền vào chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ thích hợp điền vào chỗ trống: 只要你提前做好充分的______，上台演讲时就不会那么紧张了。",
        "qPy": "Zhǐyào nǐ tíqián zuòhǎo chōngfèn de ______, shàngtái yǎnjiǎng shí jiù bú huì nàme jǐnzhāng le.",
        "orderItems": [],
        "opts": [
          "准备",
          "改变",
          "态度",
          "保护"
        ],
        "ans": 0,
        "exp": "Đáp án đúng: A. 准备 (zhǔnbèi — sự chuẩn bị). Cụm cố định: '做好充分的准备' (chuẩn bị đầy đủ). B: thay đổi, C: thái độ, D: bảo vệ."
      },
      {
        "id": "m4_2_r2",
        "partLabel": "Phần 1 • Chọn từ điền vào chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ thích hợp điền vào chỗ trống: 图书馆里非常安静，大家都在______地看着自己手中的书。",
        "qPy": "Túshūguǎn lǐ fēicháng ānjìng, dàjiā dōu zài ______ de kàn zhe zìjǐ shǒuzhōng de shū.",
        "orderItems": [],
        "opts": [
          "热闹",
          "专心",
          "激动",
          "幽默"
        ],
        "ans": 1,
        "exp": "Đáp án đúng: B. 专心 (zhuānxīn — chuyên tâm, chăm chú). Phù hợp bối cảnh đọc sách yên tĩnh trong thư viện. A: náo nhiệt, C: kích động, D: hài hước."
      },
      {
        "id": "m4_2_r3",
        "partLabel": "Phần 1 • Chọn từ điền vào chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ thích hợp điền vào chỗ trống: 这次比赛虽然没有拿到第一名，______我们已经发挥出了最好的水平。",
        "qPy": "Zhè cì bǐsài suīrán méiyǒu nádào dì-yī míng, ______ wǒmen yǐjīng fāhuī chū le zuì hǎo de shuǐpíng.",
        "orderItems": [],
        "opts": [
          "因此",
          "但是",
          "或者",
          "并且"
        ],
        "ans": 1,
        "exp": "Đáp án đúng: B. 但是 (dànshì — nhưng). Cặp liên từ '虽然……，但是……' (tuy... nhưng...). A: vì thế, C: hoặc là, D: và/hơn nữa."
      },
      {
        "id": "m4_2_r4",
        "partLabel": "Phần 2 • Sắp xếp câu thành đoạn văn",
        "kind": "order",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Sắp xếp 3 câu A - B - C thành đoạn văn có logic mạch lạc nhất:",
        "qPy": "",
        "orderItems": [
          "A. 此外，散步时呼吸新鲜空气，也能让紧张了一天的神经放松下来。",
          "B. 晚饭后出去散步半个小时，是一种既简单又健康的习惯。",
          "C. 它不仅可以帮助消化食物，还能够避免体重增加太快。"
        ],
        "opts": [
          "B - C - A",
          "A - B - C",
          "C - A - B",
          "B - A - C"
        ],
        "ans": 0,
        "exp": "Thứ tự đúng: B - C - A. Câu B giới thiệu thói quen đi dạo sau bữa tối; câu C nêu lợi ích tiêu hóa & cân nặng; câu A dùng '此外' bổ sung lợi ích thư giãn thần kinh.\n• Pinyin: Wǎnfàn hòu chūqù sànbù bàn ge xiǎoshí, shì yì zhǒng jì jiǎndān yòu jiànkāng de xíguàn. Tā bùjǐn kěyǐ bāngzhù xiāohuà shíwù, hái nénggòu bìmiǎn tǐzhòng zēngjiā tài kuài. Cǐwài, sànbù shí hūxī xīnxiān kōngqì, yě néng ràng jǐnzhāng le yì tiān de shénjīng fàngsōng xiàlái.\n• Dịch: Đi dạo nửa tiếng sau bữa tối là một thói quen vừa đơn giản vừa lành mạnh. Nó không chỉ giúp tiêu hóa thức ăn mà còn tránh tăng cân quá nhanh. Ngoài ra, hít thở không khí trong lành khi đi bộ cũng giúp hệ thần kinh căng thẳng cả ngày được thư giãn."
      },
      {
        "id": "m4_2_r5",
        "partLabel": "Phần 2 • Sắp xếp câu thành đoạn văn",
        "kind": "order",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Sắp xếp 3 câu A - B - C thành đoạn văn có logic mạch lạc nhất:",
        "qPy": "",
        "orderItems": [
          "A. 后来她听从老师的建议，每天大声朗读课文十分钟。",
          "B. 刚来中国留学时，玛丽因为怕说错，总是不敢开口讲汉语。",
          "C. 半年之后，她的发音不仅标准了很多，自信心也增强了。"
        ],
        "opts": [
          "A - B - C",
          "B - A - C",
          "C - B - A",
          "B - C - A"
        ],
        "ans": 1,
        "exp": "Thứ tự đúng: B - A - C. Trình tự thời gian: Ban đầu mới sang du học ngại nói (B) -> Sau đó làm theo lời khuyên luyện đọc to mỗi ngày (A) -> Nửa năm sau tiến bộ rõ rệt (C).\n• Pinyin: Gāng lái Zhōngguó liúxué shí, Mǎlì yīnwèi pà shuōcuò, zǒngshì bù gǎn kāikǒu jiǎng Hànyǔ. Hòulái tā tīngcóng lǎoshī de jiànyì, měitiān dàshēng lǎngdú kèwén shí fēnzhōng. Bàn nián zhīhòu, tā de fāyīn bùjǐn biāozhǔn le hěn duō, zìxìnxīn yě zēngqiáng le.\n• Dịch: Lúc mới sang Trung Quốc du học, Mary vì sợ nói sai nên luôn không dám mở miệng nói tiếng Hán. Sau đó cô nghe theo lời khuyên của thầy giáo, mỗi ngày đọc to bài khóa 10 phút. Nửa năm sau, phát âm của cô không chỉ chuẩn hơn nhiều mà sự tự tin cũng tăng lên."
      },
      {
        "id": "m4_2_r6",
        "partLabel": "Phần 2 • Sắp xếp câu thành đoạn văn",
        "kind": "order",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Sắp xếp 3 câu A - B - C thành đoạn văn có logic mạch lạc nhất:",
        "qPy": "",
        "orderItems": [
          "A. 因此，学会合理分配时间，是每个大学生必须掌握的能力。",
          "B. 大学生活表面上看起来自由时间很多，其实各种任务并不少。",
          "C. 如果缺乏计划，很容易出现临近考试才熬夜复习的情况。"
        ],
        "opts": [
          "B - C - A",
          "C - B - A",
          "A - B - C",
          "B - A - C"
        ],
        "ans": 0,
        "exp": "Thứ tự đúng: B - C - A. Câu B nêu thực tế cuộc sống đại học; câu C chỉ hậu quả nếu thiếu kế hoạch; câu A dùng '因此' kết luận.\n• Pinyin: Dàxué shēnghuó biǎomiànshàng kàn qǐlái zìyóu shíjiān hěn duō, qíshí gèzhǒng rènwu bìng bù shǎo. Rúguǒ quēfá jìhuà, hěn róngyì chūxiàn línjìn kǎoshì cái áoyè fùxí de qíngkuàng. Yīncǐ, xuéhuì hélǐ fēnpèi shíjiān, shì měi ge dàxuéshēng bìxū zhǎngwò de nénglì.\n• Dịch: Cuộc sống đại học bề ngoài trông có vẻ nhiều thời gian rảnh, kỳ thực các loại nhiệm vụ không ít chút nào. Nếu thiếu kế hoạch, rất dễ xảy ra tình trạng sát ngày thi mới thức đêm ôn tập. Do đó, học cách phân bổ thời gian hợp lý là năng lực mỗi sinh viên đều phải nắm vững."
      },
      {
        "id": "m4_2_r7",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "俗话说“一分耕耘，一分收获”。在学习乐器的过程中，最初的几个星期往往最枯燥，手指也会因为反复练习而感到酸痛。很多孩子就是在这个阶段选择放弃，实在可惜。其实，只要咬牙坚持过去，当你能够完整弹出第一首曲子时，所有的辛苦都会变成快乐。",
        "passagePy": "Súhuà shuō 'yì fēn gēngyún, yì fēn shōuhuò'. Zài xuéxí yuèqì de guòchéng zhōng, zuìchū de jǐ ge xīngqī wǎngwǎng zuì kūzào, shǒuzhǐ yě huì yīnwèi fǎnfù liànxí ér gǎndào suāntòng. Hěn duō háizi jiùshì zài zhège jiēduàn xuǎnzé fàngqì, shízài kěxī. Qíshí, zhǐyào yǎoyá jiānchí guòqù, dāng nǐ nénggòu wánzhěng tánchū dì-yī shǒu qǔzi shí, suǒyǒu de xīnkǔ dōu huì biànchéng kuàilè.",
        "passageVi": "Tục ngữ có câu 'có công mài sắt, có ngày nên kim' (một phần cày cấy, một phần thu hoạch). Trong quá trình học nhạc cụ, mấy tuần đầu tiên thường khô khan nhất, ngón tay cũng sẽ đau nhức vì tập đi tập lại. Rất nhiều trẻ em chọn bỏ cuộc chính ở giai đoạn này, thật đáng tiếc. Thật ra, chỉ cần nghiến răng kiên trì vượt qua, khi bạn có thể đàn trọn vẹn bản nhạc đầu tiên, mọi vất vả sẽ hóa thành niềm vui.",
        "q": "Theo đoạn văn, vì sao nhiều trẻ em dễ bỏ cuộc khi mới học nhạc cụ?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Vì học phí quá đắt đỏ đối với gia đình",
          "Vì giai đoạn đầu khô khan và ngón tay bị đau nhức",
          "Vì giáo viên không cho phép tự chọn bài hát",
          "Vì nhạc cụ quá nặng khó mang theo"
        ],
        "ans": 1,
        "exp": "Đoạn văn nêu rõ: mấy tuần đầu '最枯燥' (khô khan nhất) và ngón tay '感到酸痛' (đau nhức) khiến nhiều trẻ bỏ cuộc."
      },
      {
        "id": "m4_2_r8",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "冬天空气干燥，皮肤很容易缺水。除了使用保湿面霜以外，更重要的是从内部补充水分。每天保证喝足八杯温水，多吃梨、苹果等富含水分的水果，同时在房间里放一盆清水或者使用加湿器，都能有效改善干燥带来的不适。",
        "passagePy": "Dōngtiān kōngqì gānzào, pífū hěn róngyì quēshuǐ. Chúle shǐyòng bǎoshī miànshuāng yǐwài, gèng zhòngyào de shì cóng nèibù bǔchōng shuǐfèn. Měitiān bǎozhèng hēzú bā bēi wēnshuǐ, duō chī lí, píngguǒ děng fùhán shuǐfèn de shuǐguǒ, tóngshí zài fángjiān lǐ fàng yì pén qīngshuǐ huòzhě shǐyòng jiāshīqì, dōu néng yǒuxiào gǎishàn gānzào dàilái de búshì.",
        "passageVi": "Mùa đông không khí hanh khô, da rất dễ thiếu nước. Ngoài việc dùng kem dưỡng ẩm ra, quan trọng hơn là bổ sung nước từ bên trong. Mỗi ngày đảm bảo uống đủ tám cốc nước ấm, ăn nhiều trái cây giàu nước như lê, táo, đồng thời đặt một chậu nước sạch trong phòng hoặc dùng máy tạo ẩm đều giúp cải thiện hiệu quả sự khó chịu do hanh khô.",
        "q": "Đoạn văn cho rằng điều nào QUAN TRỌNG HƠN cả việc bôi kem dưỡng ẩm vào mùa đông?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Tắm nước thật nóng nhiều lần trong ngày",
          "Bổ sung đủ nước từ bên trong bằng nước ấm và hoa quả",
          "Đóng kín toàn bộ cửa sổ suốt cả mùa đông",
          "Hạn chế vận động ngoài trời vào buổi sáng"
        ],
        "ans": 1,
        "exp": "Đoạn văn dùng cấu trúc '除了……以外，更重要的是从内部补充水分' (quan trọng hơn là bổ sung nước từ bên trong)."
      },
      {
        "id": "m4_2_r9",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "前几年，小周在城市里工作，每天加班到深夜，身体越来越差。后来他回到了家乡的小镇，利用家里空闲的老房子开了一家民宿。虽然收入没有以前在公司高，但每天呼吸着清新的空气，陪伴在父母身边，他觉得现在的日子踏实又幸福。",
        "passagePy": "Qián jǐ nián, Xiǎo Zhōu zài chéngshì lǐ gōngzuò, měitiān jiābān dào shēnyè, shēntǐ yuèláiyuè chà. Hòulái tā huídào le jiāxiāng de xiǎozhèn, lìyòng jiālǐ kòngxián de lǎo fángzi kāi le yì jiā mínsù. Suīrán shōurù méiyǒu yǐqián zài gōngsī gāo, dàn měitiān hūxī zhe qīngxīn de kōngqì, péibàn zài fùmǔ shēnbiān, tā juéde xiànzài de rìzi tāshi yòu xìngfú.",
        "passageVi": "Mấy năm trước, Tiểu Chu làm việc ở thành phố, ngày nào cũng tăng ca đến khuya, sức khỏe ngày càng kém. Sau đó anh quay về thị trấn quê nhà, tận dụng ngôi nhà cũ bỏ trống của gia đình mở một nhà nghỉ gia đình. Tuy thu nhập không cao bằng hồi ở công ty, nhưng mỗi ngày hít thở bầu không khí trong lành, ở bên chăm sóc bố mẹ, anh cảm thấy cuộc sống hiện tại vừa vững vàng vừa hạnh phúc.",
        "q": "Tiểu Chu cảm thấy thế nào về cuộc sống hiện tại ở quê nhà?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Hối tiếc vì thu nhập thấp hơn lúc ở thành phố",
          "Buồn chán vì thị trấn nhỏ ít bạn bè",
          "Bình yên và hạnh phúc dù thu nhập không cao bằng trước",
          "Áp lực vì phải tự sửa chữa toàn bộ nhà cũ"
        ],
        "ans": 2,
        "exp": "Câu cuối viết rõ: '他觉得现在的日子踏实又幸福' (anh cảm thấy những ngày hiện tại vững tâm và hạnh phúc)."
      },
      {
        "id": "m4_2_r10",
        "partLabel": "Phần 3 • Đọc hiểu đoạn văn",
        "kind": "mcq",
        "passageZh": "与朋友聊天时，如果我们总是急着打断对方、发表自己的看法，对方就会觉得没有被尊重。真正会聊天的人，往往懂得适当地保持沉默，先耐心听完别人的故事，再给出真诚的回应，这样才能让交流变得愉快而深入。",
        "passagePy": "Yǔ péngyou liáotiān shí, rúguǒ wǒmen zǒngshì jí zhe dǎduàn duìfāng, fābiǎo zìjǐ de kànfǎ, duìfāng jiù huì juéde méiyǒu bèi zūnzhòng. Zhēnzhèng huì liáotiān de rén, wǎngwǎng dǒngde shìdàng de bǎochí chénmò, xiān nàixīn tīngwán biérén de gùshi, zài gěichū zhēnchéng de huíyìng, zhèyàng cái néng ràng jiāoliú biànde yúkuài ér shēnrù.",
        "passageVi": "Khi trò chuyện với bạn bè, nếu chúng ta luôn vội ngắt lời đối phương để phát biểu quan điểm của mình, đối phương sẽ cảm thấy không được tôn trọng. Người thực sự khéo trò chuyện thường biết giữ im lặng đúng lúc, kiên nhẫn nghe hết câu chuyện của người khác trước, rồi mới đưa ra phản hồi chân thành, như vậy cuộc giao tiếp mới trở nên vui vẻ và sâu sắc.",
        "q": "Theo đoạn văn, người khéo trò chuyện thường làm gì?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Nói thật nhanh để thể hiện sự thông minh",
          "Luôn phản biện ngay khi đối phương vừa mở lời",
          "Kiên nhẫn lắng nghe hết lời người khác rồi mới đáp lại chân thành",
          "Giữ im lặng hoàn toàn từ đầu đến cuối buổi gặp"
        ],
        "ans": 2,
        "exp": "Đoạn văn nêu: '先耐心听完别人的故事，再给出真诚的回应' (kiên nhẫn nghe hết câu chuyện rồi mới hồi đáp chân thành)."
      }
    ],
    "writing": [
      {
        "id": "m4_2_w1",
        "partLabel": "Phần 1 • Sắp xếp từ thành câu",
        "type": "reorder",
        "words": [
          "我们",
          "自然环境",
          "有责任",
          "保护",
          "身边的",
          "每个人都"
        ],
        "answer": "我们每个人都有责任保护身边的自然环境。",
        "py": "Wǒmen měi ge rén dōu yǒu zérèn bǎohù shēnbiān de zìrán huánjìng.",
        "vi": "Mỗi người chúng ta đều có trách nhiệm bảo vệ môi trường tự nhiên xung quanh mình.",
        "exp": "Chủ ngữ (我们每个人) + Phó từ (都) + Vị ngữ (有责任 + 保护身边的自然环境)."
      },
      {
        "id": "m4_2_w2",
        "partLabel": "Phần 1 • Sắp xếp từ thành câu",
        "type": "reorder",
        "words": [
          "那家",
          "不但",
          "服务周到",
          "而且",
          "饭菜可口",
          "餐厅"
        ],
        "answer": "那家餐厅不但服务周到而且饭菜可口。",
        "py": "Nà jiā cāntīng búdàn fúwù zhōudào érqiě fàncài kěkǒu.",
        "vi": "Nhà hàng kia chẳng những phục vụ chu đáo mà món ăn còn ngon miệng.",
        "exp": "Cặp liên từ liên kết tính chất tích cực: '不但……，而且……' đứng sau chủ ngữ chung '那家餐厅'."
      },
      {
        "id": "m4_2_w3",
        "partLabel": "Phần 1 • Sắp xếp từ thành câu",
        "type": "reorder",
        "words": [
          "早睡早起",
          "他",
          "身体健康",
          "坚持",
          "为了",
          "每天"
        ],
        "answer": "为了身体健康他每天坚持早睡早起。",
        "py": "Wèile shēntǐ jiànkāng tā měitiān jiānchí zǎoshuì zǎoqǐ.",
        "vi": "Để cơ thể khỏe mạnh, mỗi ngày anh ấy đều kiên trì ngủ sớm dậy sớm.",
        "exp": "Cụm mục đích '为了身体健康' đặt đầu câu, theo sau là chủ ngữ '他' + trạng ngữ thời gian '每天' + '坚持早睡早起'."
      },
      {
        "id": "m4_2_w4",
        "partLabel": "Phần 2 • Đặt câu với từ cho sẵn",
        "type": "make_sentence",
        "keyword": "按照",
        "keywordPy": "ànzhào",
        "requiredTokens": [
          "按照"
        ],
        "sceneHint": "Đặt một câu hoàn chỉnh (tối thiểu 6 chữ Hán) dùng giới từ 按照 (theo, dựa theo quy định/kế hoạch).",
        "sampleZh": "请大家严格按照公司的规定完成这项任务。",
        "samplePy": "Qǐng dàjiā yángé ànzhào gōngsī de guīdìng wánchéng zhè xiàng rènwu.",
        "sampleVi": "Mời mọi người thực hiện nghiêm túc nhiệm vụ này theo đúng quy định của công ty.",
        "exp": "Giới từ '按照' đứng trước danh từ chỉ quy chuẩn/kế hoạch như '规定', '计划', '要求', tạo thành cụm trạng ngữ trước động từ chính."
      },
      {
        "id": "m4_2_w5",
        "partLabel": "Phần 2 • Đặt câu với từ cho sẵn",
        "type": "make_sentence",
        "keyword": "后悔",
        "keywordPy": "hòuhuǐ",
        "requiredTokens": [
          "后悔"
        ],
        "sceneHint": "Đặt một câu hoàn chỉnh (tối thiểu 6 chữ Hán) dùng động từ/tính từ 后悔 (hối hận, tiếc nuối).",
        "sampleZh": "当初没有好好学外语，现在找工作时我感到很后悔。",
        "samplePy": "Dāngchū méiyǒu hǎohǎo xué wàiyǔ, xiànzài zhǎo gōngzuò shí wǒ gǎndào hěn hòuhuǐ.",
        "sampleVi": "Lúc trước không học ngoại ngữ cho tốt, giờ đi tìm việc tôi cảm thấy rất hối hận.",
        "exp": "'后悔' có thể làm vị ngữ trực tiếp ('感到很后悔') hoặc mang tân ngữ chỉ việc đã làm ('后悔做出这个决定')."
      }
    ]
  },
  {
    "id": "mock_hsk5_1",
    "level": 5,
    "testNo": 1,
    "badge": "HSK 5 • Đề số 1",
    "title": "Đề Thi Thử HSK 5 — Đề Số 1",
    "subtitle": "24 câu chuẩn thi máy • Nghe (10) • Đọc (10) • Viết (4) • Chủ đề: Văn hóa đọc & Tâm lý",
    "durationSec": 7200,
    "maxScore": 300,
    "passScore": 180,
    "listening": [
      {
        "id": "m5_1_l1",
        "partLabel": "Phần 1 • Hội thoại dài",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Hai người đánh giá thế nào về việc làm việc từ xa?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：你们部门试行居家办公快三个月了，大家适应得怎么样？ 女：刚开始觉得不用挤地铁很幸福，但时间长了发现，工作和生活的界限变模糊了，晚上九点还在回消息，有时候比去办公室还累。 男：看来还是弹性坐班更合理，既保留集中讨论的效率，又能照顾到各自的生活节奏。",
        "audioPy": "Nán: Nǐmen bùmén shìxíng jūjiā bàngōng kuài sān ge yuè le, dàjiā shìyìng de zěnmeyàng? Nǚ: Gāng kāishǐ juéde búyòng jǐ dìtiě hěn xìngfú, dàn shíjiān cháng le fāxiàn, gōngzuò hé shēnghuó de jièxiàn biàn móhu le, wǎnshang jiǔ diǎn hái zài huí xiāoxi, yǒu shíhou bǐ qù bàngōngshì hái lèi. Nán: Kànlái háishi tánxìng zuòbān gèng hélǐ, jì bǎoliú jízhōng tǎolùn de xiàolǜ, yòu néng zhàogù dào gèzì de shēnghuó jiézòu.",
        "audioVi": "Nam: Bộ phận cô thử nghiệm làm việc tại nhà gần ba tháng rồi, mọi người thích nghi thế nào? Nữ: Lúc đầu thấy không phải chen tàu điện ngầm rất sướng, nhưng lâu dần phát hiện ranh giới công việc và đời sống bị mờ đi, chín giờ tối vẫn trả lời tin nhắn, đôi khi còn mệt hơn đến văn phòng. Nam: Xem ra vẫn là kết hợp linh hoạt hợp lý hơn, vừa giữ được hiệu suất thảo luận tập trung, vừa chăm lo được nhịp sống riêng.",
        "opts": [
          "Làm tại nhà hoàn toàn hiệu quả hơn đến văn phòng",
          "Làm tại nhà làm mờ ranh giới công việc và đời sống, mô hình linh hoạt hợp lý hơn",
          "Nhân viên đều muốn quay lại làm việc toàn thời gian tại công ty",
          "Đi tàu điện ngầm buổi sáng là nguyên nhân chính gây mệt mỏi"
        ],
        "ans": 1,
        "exp": "Nữ nêu mặt trái làm tại nhà ('工作和生活的界限变模糊了'), nam kết luận mô hình linh hoạt ('弹性坐班') hợp lý hơn."
      },
      {
        "id": "m5_1_l2",
        "partLabel": "Phần 1 • Hội thoại dài",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ khuyên người nam xử lý dự án bị trễ tiến độ ra sao?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：这个季度的新品推广进度慢了不少，合作方已经在催了，我真想把所有细节一次性改完。 女：越是紧急的时候越不能慌。你先把核心模块保质保量上线，次要功能放在下一轮迭代里完善，主动跟对方沟通好时间表，对方反而会信任你。",
        "audioPy": "Nán: Zhège jìdù de xīnpǐn tuīguǎng jìndù màn le bùshǎo, hézuòfāng yǐjīng zài cuī le, wǒ zhēn xiǎng bǎ suǒyǒu xìjié yícìxìng gǎiwán. Nǚ: Yuè shì jǐnjí de shíhou yuè bù néng huāng. Nǐ xiān bǎ héxīn mókuài bǎozhì-bǎoliàng shàngxiàn, cìyào gōngnéng fàng zài xià yì lún diédài lǐ wánshàn, zhǔdòng gēn duìfāng gōutōng hǎo shíjiānbiǎo, duìfāng fǎn'ér huì xìnrèn nǐ.",
        "audioVi": "Nam: Tiến độ quảng bá sản phẩm mới quý này chậm đi khá nhiều, đối tác đang giục rồi, tôi thật sự muốn sửa hết mọi chi tiết trong một lần. Nữ: Càng lúc khẩn cấp càng không được rối. Anh hãy đưa phần cốt lõi lên đúng chuẩn trước, các chức năng phụ để vòng nâng cấp sau hoàn thiện, chủ động trao đổi rõ lịch trình với đối tác thì họ ngược lại sẽ tin tưởng anh.",
        "opts": [
          "Tăng ca thâu đêm để hoàn thiện toàn bộ chi tiết cùng lúc",
          "Hoãn toàn bộ dự án sang quý tiếp theo",
          "Ưu tiên ra mắt phần cốt lõi đảm bảo chất lượng và báo rõ lịch trình",
          "Đổi đối tác mới để giảm áp lực tiến độ"
        ],
        "ans": 2,
        "exp": "Cô khuyên ưu tiên phần cốt lõi ('先把核心模块保质保量上线') và chủ động thống nhất lịch trình với đối tác."
      },
      {
        "id": "m5_1_l3",
        "partLabel": "Phần 1 • Hội thoại dài",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Vì sao cửa hàng trà cổ truyền lại thu hút được nhiều bạn trẻ?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：街口那家老字号茶馆以前客人大多是老年人，怎么今年突然变成年轻人的打卡地了？ 女：人家可聪明了，保留了传统手工泡茶的工艺，同时把装修改成了简洁明亮的风格，还推出了低糖的水果冷萃茶，很符合年轻人的口味。",
        "audioPy": "Nán: Jiēkǒu nà jiā lǎozìhào cháguǎn yǐqián kèrén dàduō shì lǎoniánrén, zěnme jīnnián tūrán biànchéng niánqīngrén de dǎkǎdì le? Nǚ: Rénjiā kě cōngming le, bǎoliú le chuántǒng shǒugōng pàochá de gōngyì, tóngshí bǎ zhuāngxiū gǎichéng le jiǎnjié míngliàng de fēnggé, hái tuīchū le dītáng de shuǐguǒ lěngcuìchá, hěn fúhé niánqīngrén de kǒuwèi.",
        "audioVi": "Nam: Quán trà lâu đời ở đầu phố trước kia khách phần lớn là người cao tuổi, sao năm nay bỗng trở thành điểm đến yêu thích của giới trẻ vậy? Nữ: Họ khéo lắm, giữ nguyên kỹ nghệ pha trà thủ công truyền thống, đồng thời sửa lại không gian theo phong cách tối giản sáng sủa, còn ra mắt trà ủ lạnh hoa quả ít đường, rất hợp khẩu vị người trẻ.",
        "opts": [
          "Vì quán giảm giá một nửa cho toàn bộ thực đơn",
          "Vì giữ tinh hoa truyền thống kết hợp không gian hiện đại và sản phẩm mới hợp vị",
          "Vì quán chuyển sang bán cà phê và bánh ngọt phương Tây",
          "Vì quán mời ca sĩ nổi tiếng biểu diễn mỗi tối"
        ],
        "ans": 1,
        "exp": "Quán giữ công nghệ pha trà truyền thống ('保留了传统手工泡茶的工艺'), đổi trang trí sáng sủa tối giản và thêm trà ủ lạnh ít đường."
      },
      {
        "id": "m5_1_l4",
        "partLabel": "Phần 1 • Hội thoại dài",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Điều gì khiến người nam cảm thấy hài lòng nhất sau chuyến đi tình nguyện?",
        "statement": "",
        "statementPy": "",
        "audioZh": "女：你去山区支教了一个学期，一定吃了很多苦吧？ 男：住宿条件确实比城里简陋，冬天教室也很冷。但看到孩子们从一开始害羞不敢说话，到后来主动拿着作文来找我讨论，那种被需要和见证成长的感觉，是什么都换不来的。",
        "audioPy": "Nǚ: Nǐ qù shānqū zhījiào le yí ge xuéqī, yídìng chī le hěn duō kǔ ba? Nán: Zhùsù tiáojiàn quèshí bǐ chénglǐ jiǎnlòu, dōngtiān jiàoshì yě hěn lěng. Dàn kàndào háizimen cóng yì kāishǐ hàixiū bù gǎn shuōhuà, dào hòulái zhǔdòng ná zhe zuòwén lái zhǎo wǒ tǎolùn, nà zhǒng bèi xūyào hé jiànzhèng chéngzhǎng de gǎnjué, shì shénme dōu huàn bu lái de.",
        "audioVi": "Nữ: Cậu lên vùng núi dạy học tình nguyện cả một học kỳ, chắc vất vả lắm nhỉ? Nam: Điều kiện ăn ở đúng là đơn sơ hơn thành phố, mùa đông lớp học cũng rất lạnh. Nhưng nhìn bọn trẻ từ chỗ ban đầu rụt rè không dám nói, đến sau này chủ động mang bài tập làm văn tìm mình trao đổi, cảm giác được cần đến và chứng kiến sự trưởng thành ấy chẳng gì đánh đổi được.",
        "opts": [
          "Được thưởng học bổng toàn phần từ trường đại học",
          "Điều kiện ăn ở ấm áp và đầy đủ tiện nghi",
          "Được chứng kiến học sinh tự tin trưởng thành từng ngày",
          "Có nhiều thời gian rảnh rỗi ngắm cảnh núi rừng"
        ],
        "ans": 2,
        "exp": "Người nam nhấn mạnh cảm giác chứng kiến học sinh trưởng thành ('见证成长的感觉') là điều không gì đổi được."
      },
      {
        "id": "m5_1_l5",
        "partLabel": "Phần 1 • Hội thoại dài",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ khuyên bạn nên chọn chiếc máy ảnh nào?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：我想买台相机记录旅行，网上推荐的专业单反画质特别棒，就是太沉了，另一款微单小巧便携，真纠结。 女：如果你不是专门搞商业摄影，平时只是旅游拍风景和日常，还是选轻便的微单吧。买太重最后往往懒得带出门，放在家里落灰才最浪费。",
        "audioPy": "Nán: Wǒ xiǎng mǎi tái xiàngjī jìlù lǚxíng, wǎngshàng tuījiàn de zhuānyè dānfǎn huàzhì tèbié bàng, jiùshì tài chén le, lìng yì kuǎn wēidān xiǎoqiǎo biànxié, zhēn jiūjié. Nǚ: Rúguǒ nǐ bú shì zhuānmén gǎo shāngyè shèyǐng, píngshí zhǐshì lǚyóu pāi fēngjǐng hé rìcháng, háishi xuǎn qīngbiàn de wēidān ba. Mǎi tài zhòng zuìhòu wǎngwǎng lǎnde dài chūmén, fàng zài jiālǐ luòhuī cái zuì làngfèi.",
        "audioVi": "Nam: Mình định mua chiếc máy ảnh lưu giữ kỷ niệm du lịch, máy cơ chuyên nghiệp trên mạng khuyên chất lượng ảnh cực đẹp, mỗi tội nặng quá, mẫu máy không gương lật kia thì nhỏ gọn dễ mang, phân vân thật. Nữ: Nếu cậu không chụp ảnh thương mại chuyên nghiệp, bình thường chỉ đi du lịch chụp phong cảnh và đời thường thì nên chọn máy nhỏ gọn đi. Mua máy nặng quá cuối cùng toàn lười mang ra ngoài, để ở nhà bám bụi mới phí nhất.",
        "opts": [
          "Chọn máy cơ chuyên nghiệp dù nặng nhưng chất lượng ảnh cao nhất",
          "Chọn máy nhỏ gọn dễ mang theo cho nhu cầu du lịch",
          "Không cần mua máy ảnh, chỉ dùng điện thoại là đủ",
          "Thuê máy ảnh mỗi lần đi công tác nước ngoài"
        ],
        "ans": 1,
        "exp": "Cô khuyên '选轻便的微单吧' (chọn máy nhẹ tiện mang theo) vì máy quá nặng dễ bị bỏ xó ở nhà."
      },
      {
        "id": "m5_1_l6",
        "partLabel": "Phần 2 • Đoạn văn hiểu ý chính",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Hiện tượng 'đọc lướt tin ngắn' kéo dài có thể dẫn đến hệ quả nào?",
        "statement": "",
        "statementPy": "",
        "audioZh": "如今人们每天通过短视频和社交平台获取大量碎片化信息。表面上看，我们似乎知道得越来越多，但长期习惯于几十秒的浅层阅读，会削弱大脑持续思考复杂问题的能力。因此，每周留出固定时间完整读完几章纸质书，依然十分必要。",
        "audioPy": "Rújīn rénmen měitiān tōngguò duǎn shìpín hé shèjiāo píngtái huòqǔ dàliàng suìpiànhuà xìnxī. Biǎomiànshàng kàn, wǒmen sìhū zhīdao de yuèláiyuè duō, dàn chángqī xíguàn yú jǐshí miǎo de qiǎncéng yuèdú, huì xuēruò dànǎo chíxù sīkǎo fùzá wèntí de nénglì. Yīncǐ, měizhōu liúchū gùdìng shíjiān wánzhěng dúwán jǐ zhāng zhǐzhìshū, yīrán shífēn bìyào.",
        "audioVi": "Ngày nay mọi người mỗi ngày tiếp nhận lượng lớn thông tin rời rạc qua đoạn phim ngắn và mạng xã hội. Bề ngoài trông có vẻ chúng ta biết ngày càng nhiều, nhưng thói quen lâu dài với kiểu đọc nông vài chục giây sẽ làm suy yếu khả năng suy nghĩ bền bỉ về các vấn đề phức tạp. Vì vậy, mỗi tuần dành thời gian cố định đọc trọn vẹn vài chương sách giấy vẫn vô cùng cần thiết.",
        "opts": [
          "Giúp não bộ ghi nhớ mọi chi tiết nhanh hơn gấp đôi",
          "Làm suy yếu khả năng tư duy sâu và bền bỉ trước vấn đề phức tạp",
          "Khiến mọi người hoàn toàn ngừng sử dụng điện thoại thông minh",
          "Làm giảm chi phí xuất bản sách giấy truyền thống"
        ],
        "ans": 1,
        "exp": "Đoạn văn chỉ rõ: '会削弱大脑持续思考复杂问题的能力' (làm suy yếu năng lực suy nghĩ bền bỉ đối với vấn đề phức tạp)."
      },
      {
        "id": "m5_1_l7",
        "partLabel": "Phần 2 • Đoạn văn hiểu ý chính",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Câu chuyện về người thợ gốm muốn truyền tải thông điệp gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "景德镇有位老陶艺师烧制瓷器四十多年，每次开窑，只要发现釉色有一点点瑕疵，他都会亲手敲碎重做。徒弟觉得太可惜，老人却说，一件有缺陷的作品卖出去，换来的是眼前的钱，砸掉的是手艺人一辈子的招牌。",
        "audioPy": "Jǐngdézhèn yǒu wèi lǎo táoyìshī shāozhì cíqì sìshí duō nián, měicì kāiyáo, zhǐyào fāxiàn yòusè yǒu yìdiǎndiǎn xiácī, tā dōu huì qīnshǒu qiāosuì chóngzuò. Túdì juéde tài kěxī, lǎorén què shuō, yí jiàn yǒu quēxiàn de zuòpǐn màichuqu, huànlái de shì yǎnqián de qián, zádiào de shì shǒuyìrén yíbèizi de zhāopai.",
        "audioVi": "Ở Cảnh Đức Trấn có một nghệ nhân gốm già nung đồ sứ hơn bốn mươi năm; mỗi lần mở lò, hễ phát hiện màu men có chút xíu tì vết, ông đều tự tay đập vỡ làm lại. Đồ đệ thấy quá tiếc, ông lão bèn nói: bán một sản phẩm có khiếm khuyết ra ngoài, đổi lấy là tiền trước mắt, nhưng đập vỡ mất danh tiếng cả đời của người thợ.",
        "opts": [
          "Làm nghề thủ công cần chạy theo số lượng để tăng thu nhập",
          "Uy tín và chất lượng lâu dài quý giá hơn lợi ích trước mắt",
          "Đồ sứ có vết nứt nhẹ sẽ bán được giá cao hơn đồ hoàn hảo",
          "Học nghề gốm chỉ cần vài tháng là có thể mở xưởng riêng"
        ],
        "ans": 1,
        "exp": "Lời ông lão nhấn mạnh không đánh đổi danh dự cả đời ('一辈子的招牌') lấy món lợi trước mắt ('眼前的钱')."
      },
      {
        "id": "m5_1_l8",
        "partLabel": "Phần 2 • Đoạn văn hiểu ý chính",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Vì sao nhiều người hay cảm thấy hối tiếc sau khi mua hàng giảm giá lớn?",
        "statement": "",
        "statementPy": "",
        "audioZh": "各大购物节期间，商家的满减和限时折扣常常让人产生“不买就亏了”的冲动。心理学家指出，这种消费行为往往不是出于实际需要，而是被稀缺感和紧迫感推动的。等快递拆开后，很多物品其实很快就被闲置在角落里。",
        "audioPy": "Gè dà gòuwùjié qījiān, shāngjiā de mǎnjiǎn hé xiànshí zhékòu chángcháng ràng rén chǎnshēng 'bù mǎi jiù kuī le' de chōngdòng. Xīnlǐxuéjiā zhǐchū, zhè zhǒng xiāofèi xíngwéi wǎngwǎng bú shì chūyú shíjì xūyào, ér shì bèi xīquēgǎn hé jǐnpògǎn tuīdòng de. Děng kuàidì chāikāi hòu, hěn duō wùpǐn qíshí hěn kuài jiù bèi xiánzhì zài jiǎoluò lǐ.",
        "audioVi": "Trong các lễ hội mua sắm lớn, ưu đãi giảm giá theo mức chi và giảm giá giới hạn thời gian của nhà bán hàng thường khiến người ta nảy sinh xung động 'không mua là lỗ'. Nhà tâm lý học chỉ ra hành vi tiêu dùng này thường không xuất phát từ nhu cầu thực tế, mà bị thúc đẩy bởi cảm giác khan hiếm và cấp bách. Đợi bóc hàng giao tới, nhiều món đồ thực ra nhanh chóng bị xếp xó ở góc nhà.",
        "opts": [
          "Vì chất lượng hàng giảm giá luôn bị lỗi thời hoàn toàn",
          "Vì quyết định mua bị thúc đẩy bởi cảm giác gấp gáp thay vì nhu cầu thật",
          "Vì thời gian giao hàng kéo dài quá ba tháng",
          "Vì người mua không biết cách áp dụng mã giảm giá"
        ],
        "ans": 1,
        "exp": "Đoạn văn giải thích người mua không xuất phát từ nhu cầu thật ('不是出于实际需要') mà bị cảm giác khan hiếm, thúc bách chi phối."
      },
      {
        "id": "m5_1_l9",
        "partLabel": "Phần 2 • Đoạn văn hiểu ý chính",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Lợi ích nổi bật của du lịch sinh thái đối với cộng đồng địa phương là gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "与传统观光旅游不同，生态旅游不仅强调游客对自然景观的欣赏，更注重环境保护与当地居民的共同参与。合理开发生态路线，既能让村民通过经营民宿和讲解文化获得稳定收入，也能促使大家更自觉地守护山林与水源。",
        "audioPy": "Yǔ chuántǒng guānguāng lǚyóu bùtóng, shēngtài lǚyóu bùjǐn qiángdiào yóukè duì zìrán jǐngguān de xīnshǎng, gèng zhùzhòng huánjìng bǎohù yǔ dāngdì jūmín de gòngtóng cānyù. Hélǐ kāifā shēngtài lùxiàn, jì néng ràng cūnmín tōngguò jīngyíng mínsù hé jiǎngjiě wénhuà huòdé wěndìng shōurù, yě néng cùshǐ dàjiā gèng zìjué de shǒuhù shānlín yǔ shuǐyuán.",
        "audioVi": "Khác với du lịch tham quan truyền thống, du lịch sinh thái không chỉ nhấn mạnh việc du khách thưởng ngoạn cảnh quan tự nhiên, mà còn coi trọng bảo vệ môi trường và sự tham gia chung của cư dân bản địa. Khai thác hợp lý tuyến sinh thái vừa giúp người dân có thu nhập ổn định qua kinh doanh nhà nghỉ và thuyết minh văn hóa, vừa thúc đẩy mọi người tự giác gìn giữ rừng núi và nguồn nước.",
        "opts": [
          "Xây dựng nhiều khu nghỉ dưỡng bê tông quy mô khổng lồ",
          "Vừa tạo thu nhập ổn định cho dân bản địa vừa nâng ý thức giữ gìn thiên nhiên",
          "Cấm hoàn toàn người dân địa phương tiếp xúc với du khách",
          "Thay thế toàn bộ nông nghiệp bằng dịch vụ khách sạn"
        ],
        "ans": 1,
        "exp": "Đoạn văn nêu lợi ích kép: tạo thu nhập ổn định ('获得稳定收入') và giúp dân tự giác bảo vệ rừng núi, nguồn nước ('自觉地守护山林与水源')."
      },
      {
        "id": "m5_1_l10",
        "partLabel": "Phần 2 • Đoạn văn hiểu ý chính",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Theo người nói, bí quyết giữ tâm lý cân bằng trong xã hội hiện đại là gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "现代生活节奏越来越快，我们常常习惯于拿别人的高光时刻跟自己的日常作比较，结果无形中背上了沉重的心理包袱。其实，每个人都有自己的人生时区，与其盲目焦虑，不如专注打磨当下的每一步，按自己的节奏稳步前行。",
        "audioPy": "Xiàndài shēnghuó jiézòu yuèláiyuè kuài, wǒmen chángcháng xíguàn yú ná biérén de gāoguāng shíkè gēn zìjǐ de rìcháng zuò bǐjiào, jiéguǒ wúxíngzhōng bèishàng le chénzhòng de xīnlǐ bāofu. Qíshí, měi ge rén dōu yǒu zìjǐ de rénshēng shíqū, yǔqí mángmù jiāolǜ, bùrú zhuānzhù dǎmó dāngxià de měi yí bù, àn zìjǐ de jiézòu wěnbù qiánxíng.",
        "audioVi": "Nhịp sống hiện đại ngày càng nhanh, chúng ta thường quen lấy khoảnh khắc rực rỡ của người khác so với đời thường của mình, kết quả vô hình trung mang trên vai gánh nặng tâm lý nặng nề. Thật ra, mỗi người đều có múi giờ cuộc đời riêng; thay vì lo âu mù quáng, chi bằng tập trung trau chuốt từng bước hiện tại, vững vàng tiến bước theo nhịp độ của chính mình.",
        "opts": [
          "Liên tục so sánh thành tích của bản thân với bạn bè đồng trang lứa",
          "Ngừng đặt ra mọi mục tiêu dài hạn trong công việc",
          "Không so sánh mù quáng, tập trung bước từng bước theo nhịp riêng của mình",
          "Chuyển khỏi thành phố để tránh tiếp xúc với mạng xã hội"
        ],
        "ans": 2,
        "exp": "Câu kết khuyến khích: '专注打磨当下的每一步，按自己的节奏稳步前行' (tập trung vào hiện tại, đi theo nhịp riêng)."
      }
    ],
    "reading": [
      {
        "id": "m5_1_r1",
        "partLabel": "Phần 1 • Điền từ ngữ cảnh",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ thích hợp điền vào chỗ trống: 面对突如其来的市场变化，这家老牌企业并没有退缩，而是迅速______了产品结构，成功渡过难关。",
        "qPy": "Miànduì tūrúqílái de shìchǎng biànhuà, zhè jiā lǎopái qǐyè bìng méiyǒu tuìsuō, érshì xùnsù ______ le chǎnpǐn jiégòu, chénggōng dùguò nánguān.",
        "orderItems": [],
        "opts": [
          "调整",
          "维持",
          "忽略",
          "模仿"
        ],
        "ans": 0,
        "exp": "Đáp án đúng: A. 调整 (tiáozhěng — điều chỉnh). Kết hợp chuẩn: '调整产品结构' (điều chỉnh cơ cấu sản phẩm). B: duy trì, C: lơ là, D: bắt chước."
      },
      {
        "id": "m5_1_r2",
        "partLabel": "Phần 1 • Điền từ ngữ cảnh",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ thích hợp điền vào chỗ trống: 这篇报道虽然篇幅不长，但用词准确、逻辑严密，把整个事件的来龙去脉交代得十分______。",
        "qPy": "Zhè piān bàodào suīrán piānfú bù cháng, dàn yòngcí zhǔnquè, luójí yánmì, bǎ zhěng ge shìjiàn de láilóng-qùmài jiāodài de shífēn ______.",
        "orderItems": [],
        "opts": [
          "模糊",
          "彻底",
          "犹豫",
          "普通"
        ],
        "ans": 1,
        "exp": "Đáp án đúng: B. 彻底 (chèdǐ — triệt để, tường tận, rõ ràng). Phù hợp với cụm '交代得十分彻底' (trình bày đầu đuôi ngọn ngành cực kỳ rõ ràng). A: mơ hồ, C: do dự, D: bình thường."
      },
      {
        "id": "m5_1_r3",
        "partLabel": "Phần 1 • Điền từ ngữ cảnh",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ thích hợp điền vào chỗ trống: 科学研究需要脚踏实地的精神，绝对不能______，更不能为了追求速度而编造实验数据。",
        "qPy": "Kēxué yánjiū xūyào jiǎotàshídì de jīngshén, juéduì bù néng ______, gèng bù néng wèile zhuīqiú sùdù ér biānzào shíyàn shùjù.",
        "orderItems": [],
        "opts": [
          "急功近利",
          "实事求是",
          "专心致志",
          "坚持不懈"
        ],
        "ans": 0,
        "exp": "Đáp án đúng: A. 急功近利 (jígōng-jìnlì — nóng vội cầu thành, ham lợi trước mắt). Phù hợp vế sau '绝对不能……，更不能编造数据'. B: thực sự cầu thị, C: chuyên tâm nhất trí, D: kiên trì không mệt mỏi."
      },
      {
        "id": "m5_1_r4",
        "partLabel": "Phần 2 • Đọc hiểu đoạn văn chuyên đề",
        "kind": "mcq",
        "passageZh": "在古代中国，古琴不仅是一件乐器，更被文人视为修身养性的重要媒介。传统观念认为，弹奏古琴讲究“心静气和”，演奏者不必追求炫目的技巧或喧闹的舞台效果，而重在通过清淡幽远的琴声，表达内心的平和与对自然万物的敬意。正因如此，古琴艺术至今仍被视作东方美学中“留白”意境的代表。",
        "passagePy": "Zài gǔdài Zhōngguó, gǔqín bùjǐn shì yí jiàn yuèqì, gèng bèi wénrén shìwéi xiūshēn-yǎngxìng de zhòngyào méijiè. Chuántǒng guānniàn rènwéi, tánzòu gǔqín jiǎngjiu 'xīnjìng-qìhé', yǎnzòuzhě búbì zhuīqiú xuànmù de jìqiǎo huò xuānnào de wǔtái xiàoguǒ, ér zhòng zài tōngguò qīngdàn yōuyuǎn de qínshēng, biǎodá nèixīn de pínghé yǔ duì zìrán wànwù de jìngyì. Zhèng yīn rúcǐ, gǔqín yìshù zhìjīn réng bèi shìzuò Dōngfāng měixué zhōng 'liúbái' yìjìng de dàibiǎo.",
        "passageVi": "Ở Trung Quốc cổ đại, cổ cầm không chỉ là một nhạc cụ mà còn được giới văn nhân coi là phương tiện quan trọng để tu tâm dưỡng tính. Quan niệm truyền thống cho rằng chơi cổ cầm đề cao 'tâm tĩnh khí hòa', người diễn tấu không cần chạy theo kỹ xảo chói lọi hay hiệu ứng sân khấu ồn ào, mà chú trọng gửi gắm sự bình yên nội tâm và lòng kính trọng vạn vật tự nhiên qua tiếng đàn thanh đạm sâu lắng. Chính vì vậy, nghệ thuật cổ cầm đến nay vẫn được xem là đại diện cho ý cảnh 'khoảng trắng' trong mỹ học phương Đông.",
        "q": "Theo đoạn văn, nghệ thuật diễn tấu cổ cầm truyền thống coi trọng điều gì nhất?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Kỹ xảo biểu diễn phức tạp và ánh sáng sân khấu rực rỡ",
          "Sự tĩnh tại trong tâm hồn và vẻ đẹp thanh đạm, sâu lắng",
          "Âm lượng vang dội để thu hút đám đông khán giả",
          "Sự kết hợp giữa nhạc cụ cổ điển và nhạc điện tử hiện đại"
        ],
        "ans": 1,
        "exp": "Đoạn văn nêu rõ: cổ cầm coi trọng '心静气和' và thể hiện sự bình yên nội tâm qua tiếng đàn thanh đạm sâu lắng ('清淡幽远的琴声')."
      },
      {
        "id": "m5_1_r5",
        "partLabel": "Phần 2 • Đọc hiểu đoạn văn chuyên đề",
        "kind": "mcq",
        "passageZh": "心理学中有一个著名的“峰终定律”：人们对一段体验的整体记忆，往往并不取决于整个过程每分每秒的平均感受，而是主要由两个关键节点决定——体验达到最高潮（或最糟糕）的“峰值”，以及体验结束时的“终值”。比如一次旅行，哪怕中间遇到过小插曲，只要旅途中有令人惊艳的风景，且返程顺利愉快，人们事后回忆起来依然会给予很高评价。",
        "passagePy": "Xīnlǐxué zhōng yǒu yí ge zhùmíng de 'Fēngzhōng Dìnglǜ': rénmen duì yí duàn tǐyàn de zhěngtǐ jìyì, wǎngwǎng bìng bù qǔjué yú zhěng ge guòchéng měifēn-měimiǎo de píngjūn gǎnshòu, érshì zhǔyào yóu liǎng ge guānjiàn jiédiǎn juédìng——tǐyàn dádào zuì gāocháo (huò zuì zāogāo) de 'fēngzhí', yǐjí tǐyàn jiéshù shí de 'zhōngzhí'. Bǐrú yí cì lǚxíng, nǎpà zhōngjiān yùdào guo xiǎo chāqǔ, zhǐyào lǚtú zhōng yǒu lìng rén jīngyàn de fēngjǐng, qiě fǎnchéng shùnlì yúkuài, rénmen shìhòu huíyì qǐlái yīrán huì jǐyǔ hěn gāo píngjià.",
        "passageVi": "Trong tâm lý học có một 'Định luật Đỉnh - Kết' nổi tiếng: ký ức tổng thể của con người về một trải nghiệm thường không phụ thuộc vào cảm nhận trung bình từng phút từng giây suốt quá trình, mà chủ yếu được quyết định bởi hai điểm mấu chốt — 'điểm đỉnh' khi trải nghiệm lên cao trào (hoặc tệ nhất) và 'điểm kết' khi trải nghiệm khép lại. Ví dụ một chuyến du lịch, dù giữa chừng có trục trặc nhỏ, chỉ cần dọc đường có cảnh đẹp kinh ngạc và lúc trở về suôn sẻ vui vẻ, khi hồi tưởng lại người ta vẫn đánh giá rất cao.",
        "q": "Theo 'Định luật Đỉnh - Kết', yếu tố nào quyết định chủ yếu ấn tượng chung sau một trải nghiệm?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Cảm nhận trung bình cộng của toàn bộ thời gian trải nghiệm",
          "Khoảnh khắc khởi đầu ngay trong năm phút đầu tiên",
          "Điểm cao trào nổi bật nhất và cảm xúc lúc kết thúc",
          "Số tiền mà người tham gia đã chi trả cho trải nghiệm đó"
        ],
        "ans": 2,
        "exp": "Định luật chỉ rõ ấn tượng tổng thể phụ thuộc vào '峰值' (điểm cao trào) và '终值' (thời điểm kết thúc)."
      },
      {
        "id": "m5_1_r6",
        "partLabel": "Phần 2 • Đọc hiểu đoạn văn chuyên đề",
        "kind": "mcq",
        "passageZh": "近年来，“城市微更新”理念在许多老城区悄然兴起。与过去大拆大建的做法不同，微更新更像是一场精细的“外科小手术”：保留老街巷原有的历史肌理和邻里烟火气，仅对破损的路面、昏暗的照明、闲置的角落进行适度改造，把街角空地变成袖珍公园或社区书屋，既延续了城市记忆，又切实改善了居民的居住品质。",
        "passagePy": "Jìnniánlái, 'chéngshì wēi gēngxīn' lǐniàn zài xǔduō lǎo chéngqū qiǎorán xīngqǐ. Yǔ guòqù dàchāi-dàjiàn de zuòfǎ bùtóng, wēi gēngxīn gèng xiàng shì yì chǎng jīngxì de 'wàikē xiǎo shǒushù': bǎoliú lǎo jiēxiàng yuányǒu de lìshǐ jīlǐ hé línlǐ yānhuǒqì, jǐn duì pòsǔn de lùmiàn, hūn'àn de zhàomíng, xiánzhì de jiǎoluò jìnxíng shìdù gǎizào, bǎ jiējiǎo kòngdì biànchéng xiùzhēn gōngyuán huò shèqū shūwū, jì yánxù le chéngshì jìyì, yòu qièshí gǎishàn le jūmín de jūzhù pǐnzhì.",
        "passageVi": "Những năm gần đây, tư duy 'vi cải tạo đô thị' âm thầm nở rộ tại nhiều khu phố cổ. Khác với cách phá bỏ xây mới hàng loạt trước đây, vi cải tạo giống như một 'ca tiểu phẫu' tinh tế: giữ lại kết cấu lịch sử vốn có và hơi thở đời sống láng giềng của ngõ phố cũ, chỉ cải tạo vừa phải mặt đường hư hỏng, hệ thống chiếu sáng tối tăm, các góc bỏ trống, biến khoảng đất góc phố thành công viên bỏ túi hoặc nhà sách cộng đồng, vừa nối dài ký ức đô thị vừa nâng cao thiết thực chất lượng sống cho cư dân.",
        "q": "Điểm khác biệt cốt lõi của 'vi cải tạo đô thị' so với cách làm cũ là gì?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Di dời toàn bộ cư dân khu phố cổ ra vùng ngoại ô mới",
          "Phá bỏ toàn bộ nhà cũ để xây trung tâm thương mại cao tầng",
          "Giữ lại nét lịch sử và nhịp sống cũ, chỉ nâng cấp tinh tế những điểm thiếu sót",
          "Cấm ô tô và xe máy đi vào toàn bộ nội thành"
        ],
        "ans": 2,
        "exp": "Đoạn văn đối lập '大拆大建' (phá lớn xây lớn) với việc giữ lại nét lịch sử ('保留老街巷原有的历史肌理') và chỉ cải tạo vừa phải các hạng mục xuống cấp."
      },
      {
        "id": "m5_1_r7",
        "partLabel": "Phần 2 • Đọc hiểu đoạn văn chuyên đề",
        "kind": "mcq",
        "passageZh": "不少人认为，睡眠不足只要在周末多睡几个小时就能“补回来”。然而睡眠医学研究显示，工作日长期缺觉导致的精神疲劳与注意力下降，很难靠周末突击补觉彻底消除。更糟糕的是，周末突然睡到中午会打乱人体原有的生物钟，导致周日晚上失眠，周一早晨更加困倦。",
        "passagePy": "Bùshǎo rén rènwéi, shuìmián bùzú zhǐyào zài zhōumò duō shuì jǐ ge xiǎoshí jiù néng 'bǔ huílái'. Rán'ér shuìmián yīxué yánjiū xiǎnshì, gōngzuòrì chángqī quējiào dǎozhì de jīngshén píláo yǔ zhùyìlì xiàjiàng, hěn nán kào zhōumò tūjī bǔjiào chèdǐ xiāochú. Gèng zāogāo de shì, zhōumò tūrán shuì dào zhōngwǔ huì dǎluàn réntǐ yuányǒu de shēngwùzhōng, dǎozhì zhōurì wǎnshang shīmián, zhōuyī zǎochén gèngjiā kùnjuàn.",
        "passageVi": "Không ít người cho rằng thiếu ngủ chỉ cần cuối tuần ngủ bù thêm vài tiếng là có thể 'bù lại'. Tuy nhiên nghiên cứu y học giấc ngủ cho thấy sự mệt mỏi tinh thần và suy giảm tập trung do thiếu ngủ dài ngày trong tuần rất khó xóa bỏ hoàn toàn bằng cách ngủ bù dồn cuối tuần. Tệ hơn nữa, cuối tuần đột ngột ngủ đến tận trưa sẽ làm rối loạn đồng hồ sinh học vốn có, dẫn đến mất ngủ tối Chủ Nhật và uể oải hơn vào sáng thứ Hai.",
        "q": "Theo nghiên cứu trong đoạn văn, việc ngủ nướng đến trưa vào cuối tuần gây ra tác hại gì?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Xóa sạch hoàn toàn mọi mệt mỏi tích tụ cả tuần",
          "Làm rối loạn đồng hồ sinh học và khiến sáng thứ Hai càng buồn ngủ hơn",
          "Giúp cải thiện trí nhớ ngắn hạn rõ rệt trong ngày đầu tuần",
          "Làm giảm nhu cầu uống nước của cơ thể"
        ],
        "ans": 1,
        "exp": "Câu cuối viết rõ: ngủ đến trưa cuối tuần sẽ '打乱人体原有的生物钟' (làm loạn đồng hồ sinh học), khiến tối Chủ Nhật mất ngủ và sáng thứ Hai mệt hơn."
      },
      {
        "id": "m5_1_r8",
        "partLabel": "Phần 2 • Đọc hiểu đoạn văn chuyên đề",
        "kind": "mcq",
        "passageZh": "在农业生产中，农作物并非施肥越多长得越好。过量使用化肥不仅会造成土壤板结、污染地下水，还会使植物茎叶徒长而抵抗力下降，反而更容易招致病虫害。因此，科学测土、按需精准施肥，才是实现农业高产与生态保护双赢的关键。",
        "passagePy": "Zài nóngyè shēngchǎn zhōng, nóngzuòwù bìng fēi shīféi yuè duō zhǎng de yuè hǎo. Guòliàng shǐyòng huàféi bùjǐn huì zàochéng tǔrǎng bǎnjié, wūrǎn dìxiàshuǐ, hái huì shǐ zhíwù jīngyè túzhǎng ér dǐkànglì xiàjiàng, fǎn'ér gèng róngyì zhāozhì bìngchónghài. Yīncǐ, kēxué cètǔ, ànxū jīngzhǔn shīféi, cái shì shíxiàn nóngyè gāochǎn yǔ shēngtài bǎohù shuāngyíng de guānjiàn.",
        "passageVi": "Trong sản xuất nông nghiệp, không phải cứ bón càng nhiều phân thì cây trồng phát triển càng tốt. Lạm dụng phân bón hóa học không chỉ gây chai cứng đất, ô nhiễm nước ngầm, mà còn khiến thân lá cây mọc vống lên nhưng sức đề kháng giảm sút, ngược lại dễ thu hút sâu bệnh hơn. Do đó, đo đạc đất khoa học và bón phân chuẩn xác theo nhu cầu mới là chìa khóa đạt mục tiêu kép năng suất cao và bảo vệ sinh thái.",
        "q": "Điều gì KHÔNG phải là hậu quả của việc bón phân hóa học quá liều được nêu trong bài?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Làm đất bị chai cứng",
          "Gây ô nhiễm nguồn nước ngầm",
          "Làm cây giảm sức đề kháng và dễ mắc sâu bệnh",
          "Giúp tăng độ phì nhiêu tự nhiên của đất lâu dài"
        ],
        "ans": 3,
        "exp": "Đoạn văn liệt kê 3 tác hại: chai cứng đất ('土壤板结'), ô nhiễm nước ngầm ('污染地下水') và cây giảm đề kháng dễ sâu bệnh; KHÔNG hề nói giúp tăng độ phì tự nhiên."
      },
      {
        "id": "m5_1_r9",
        "partLabel": "Phần 2 • Đọc hiểu đoạn văn chuyên đề",
        "kind": "mcq",
        "passageZh": "许多人以为，优秀的演讲者天生口才极佳，其实背后往往离不开反复的打磨。真正打动听众的，从来不是华丽辞藻的堆砌，而是演讲者对主题真诚的思考、清晰的逻辑结构，以及贴近普通人生活的真实案例。",
        "passagePy": "Xǔduō rén yǐwéi, yōuxiù de yǎnjiǎngzhě tiānshēng kǒucái jíjiā, qíshí bèihòu wǎngwǎng lí bu kāi fǎnfù de dǎmó. Zhēnzhèng dǎdòng tīngzhòng de, cónglái bú shì huálì cízǎo de duīqì, érshì yǎnjiǎngzhě duì zhǔtí zhēnchéng de sīkǎo, qīngxī de luójí jiégòu, yǐjí tiējìn pǔtōngrén shēnghuó de zhēnshí ànlì.",
        "passageVi": "Nhiều người tưởng rằng diễn giả xuất sắc vốn dĩ có tài ăn nói bẩm sinh, kỳ thực đằng sau thường không thể thiếu quá trình mài giũa lặp đi lặp lại. Điều thực sự lay động người nghe xưa nay không phải sự chồng chất câu từ hoa mỹ, mà là suy nghĩ chân thành của diễn giả về chủ đề, cấu trúc logic rõ ràng và những câu chuyện chân thực gần gũi với đời sống bình thường.",
        "q": "Theo đoạn văn, yếu tố nào thực sự làm lay động khán giả trong một bài diễn thuyết?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Tài ăn nói bẩm sinh mà không cần luyện tập trước",
          "Sử dụng thật nhiều từ ngữ cổ điển, hoa mỹ và phức tạp",
          "Suy nghĩ chân thành, bố cục mạch lạc và ví dụ thực tế gần gũi",
          "Tốc độ nói thật nhanh cùng âm lượng thật lớn"
        ],
        "ans": 2,
        "exp": "Đoạn văn khẳng định yếu tố thuyết phục là '真诚的思考、清晰的逻辑结构，以及贴近普通人生活的真实案例'."
      },
      {
        "id": "m5_1_r10",
        "partLabel": "Phần 2 • Đọc hiểu đoạn văn chuyên đề",
        "kind": "mcq",
        "passageZh": "数字地图和语音导航极大地方便了人们的出行，让我们即使来到陌生城市也不必担心迷路。不过，也有科学家提醒，如果长期完全依赖电子导航，人类大脑中负责空间记忆和路线规划的区域就会缺少锻炼。偶尔放下手机，凭借路标和记忆自己认一次路，对保持大脑活力大有裨益。",
        "passagePy": "Shùzì dìtú hé yǔyīn dǎoháng jídà de fāngbiàn le rénmen de chūxíng, ràng wǒmen jíshǐ láidào mòshēng chéngshì yě búbì dānxīn mílù. Búguò, yě yǒu kēxuéjiā tíxǐng, rúguǒ chángqī wánquán yīlài diànzǐ dǎoháng, rénlèi dànǎo zhōng fùzé kōngjiān jìyì hé lùxiàn guīhuà de qūyù jiù huì quēshǎo duànliàn. Ǒu'ěr fàngxià shǒujī, píngjiè lùbiāo hé jìyì zìjǐ rèn yí cì lù, duì bǎochí dànǎo huólì dà yǒu bìyì.",
        "passageVi": "Bản đồ số và dẫn đường bằng giọng nói giúp việc đi lại thuận tiện vô cùng, khiến ta dù tới thành phố xa lạ cũng không lo lạc đường. Tuy nhiên, cũng có nhà khoa học nhắc nhở rằng nếu lệ thuộc hoàn toàn vào chỉ đường điện tử trong thời gian dài, vùng não bộ phụ trách ghi nhớ không gian và hoạch định lộ trình sẽ thiếu rèn luyện. Thỉnh thoảng đặt điện thoại xuống, tự nhận biết đường dựa vào biển chỉ dẫn và trí nhớ rất có ích cho việc giữ sự linh hoạt của não.",
        "q": "Lời khuyên của nhà khoa học ở cuối đoạn văn là gì?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Xóa bỏ hoàn toàn ứng dụng bản đồ trên điện thoại",
          "Thỉnh thoảng tự tìm đường bằng biển báo và trí nhớ để rèn luyện não",
          "Chỉ nên đi lại ở những tuyến đường quen thuộc gần nhà",
          "Luôn ghi âm lại giọng chỉ đường để nghe vào buổi tối"
        ],
        "ans": 1,
        "exp": "Câu cuối khuyên: '偶尔放下手机，凭借路标和记忆自己认一次路，对保持大脑活力大有裨益'."
      }
    ],
    "writing": [
      {
        "id": "m5_1_w1",
        "partLabel": "Phần 1 • Sắp xếp từ thành câu",
        "type": "reorder",
        "words": [
          "我们",
          "在",
          "宝贵的",
          "挫折中",
          "学到了",
          "经验",
          "许多"
        ],
        "answer": "我们在挫折中学到了许多宝贵的经验。",
        "py": "Wǒmen zài cuòzhé zhōng xuédào le xǔduō bǎoguì de jīngyàn.",
        "vi": "Chúng tôi đã học được rất nhiều kinh nghiệm quý báu từ trong thất bại.",
        "exp": "Chủ ngữ '我们' + Cụm giới từ chỉ nơi chốn/hoàn cảnh '在挫折中' + Động từ '学到了' + Định ngữ '许多宝贵的' + Tân ngữ '经验'."
      },
      {
        "id": "m5_1_w2",
        "partLabel": "Phần 1 • Sắp xếp từ thành câu",
        "type": "reorder",
        "words": [
          "取决于",
          "坚持下去",
          "有多大",
          "能否",
          "热情",
          "你对这件事"
        ],
        "answer": "能否坚持下去取决于你对这件事有多大热情。",
        "py": "Néngfǒu jiānchí xiàqù qǔjué yú nǐ duì zhè jiàn shì yǒu duōdà rèqíng.",
        "vi": "Có thể kiên trì được hay không phụ thuộc vào việc bạn có bao nhiêu nhiệt huyết với việc này.",
        "exp": "Cụm chủ ngữ nghi vấn chính phản '能否坚持下去' + Động từ '取决于' (phụ thuộc vào) + Mệnh đề tân ngữ '你对这件事有多大热情'."
      },
      {
        "id": "m5_1_w3",
        "partLabel": "Phần 1 • Sắp xếp từ thành câu",
        "type": "reorder",
        "words": [
          "当地政府",
          "采取",
          "有效措施",
          "空气质量",
          "改善",
          "正在"
        ],
        "answer": "当地政府正在采取有效措施改善空气质量。",
        "py": "Dāngdì zhèngfǔ zhèngzài cǎiqǔ yǒuxiào cuòshī gǎishàn kōngqì zhìliàng.",
        "vi": "Chính quyền địa phương đang áp dụng các biện pháp hiệu quả để cải thiện chất lượng không khí.",
        "exp": "Kết hợp động từ chuẩn HSK 5: '采取有效措施' (áp dụng biện pháp hiệu quả) + mục đích '改善空气质量'."
      },
      {
        "id": "m5_1_w4",
        "partLabel": "Phần 2 • Viết đoạn văn 80 chữ theo từ khóa",
        "type": "essay_keywords",
        "title": "Cân bằng áp lực và nâng cao hiệu quả",
        "keywords": [
          "压力",
          "调整",
          "散步",
          "效率",
          "乐观"
        ],
        "minChars": 60,
        "targetChars": 80,
        "promptVi": "Sử dụng đầy đủ 5 từ khóa (压力, 调整, 散步, 效率, 乐观) viết một đoạn văn khoảng 80 chữ Hán chia sẻ cách giải tỏa áp lực trong công việc hoặc học tập.",
        "sampleZh": "现代生活节奏很快，每个人都会面临工作或学习上的压力。遇到困难时，我不会一味抱怨，而是及时调整心态。每天晚饭后去公园散步半小时，既能放松神经，又能让第二天做事的效率大幅提高。只要保持乐观，再大的难题也能克服。",
        "samplePy": "Xiàndài shēnghuó jiézòu hěn kuài, měi ge rén dōu huì miànlín gōngzuò huò xuéxí shàng de yālì. Yùdào kùnnan shí, wǒ bú huì yíwèi bàoyuàn, érshì jíshí tiáozhěng xīntài. Měitiān wǎnfàn hòu qù gōngyuán sànbù bàn xiǎoshí, jì néng fàngsōng shénjīng, yòu néng ràng dì-èr tiān zuòshì de xiàolǜ dàfú tígāo. Zhǐyào bǎochí lèguān, zài dà de nántí yě néng kèfú.",
        "sampleVi": "Nhịp sống hiện đại rất nhanh, ai cũng phải đối mặt với áp lực trong công việc hoặc học tập. Khi gặp khó khăn, tôi không than vãn mãi mà kịp thời điều chỉnh tâm thái. Mỗi ngày sau bữa tối ra công viên đi dạo nửa tiếng, vừa thư giãn thần kinh vừa giúp hiệu suất làm việc hôm sau tăng mạnh. Chỉ cần giữ sự lạc quan, nan đề lớn đến mấy cũng vượt qua được.",
        "exp": "Bài mẫu liên kết tự nhiên cả 5 từ khóa theo mạch mở-thân-kết: đặt vấn đề (压力) -> cách xử lý (调整, 散步) -> kết quả tích cực (效率, 乐观)."
      }
    ]
  },
  {
    "id": "mock_hsk5_2",
    "level": 5,
    "testNo": 2,
    "badge": "HSK 5 • Đề số 2",
    "title": "Đề Thi Thử HSK 5 — Đề Số 2",
    "subtitle": "24 câu chuẩn thi máy • Nghe (10) • Đọc (10) • Viết (4) • Chủ đề: Đổi mới & Giáo dục gia đình",
    "durationSec": 7200,
    "maxScore": 300,
    "passScore": 180,
    "listening": [
      {
        "id": "m5_2_l1",
        "partLabel": "Phần 1 • Hội thoại dài",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ nghĩ sao về cách giáo dục con tự lập?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：我看你家孩子才八岁，就自己整理书包、洗袜子了，平时你真舍得让他干活啊？ 女：越舍不得放手，孩子长大后越缺乏独立能力。其实只要教会他方法，孩子从完成小事中反而能获得满满的成就感。",
        "audioPy": "Nán: Wǒ kàn nǐ jiā háizi cái bā suì, jiù zìjǐ zhěnglǐ shūbāo, xǐ wàzi le, píngshí nǐ zhēn shěde ràng tā gànhuó a? Nǚ: Yuè shěbude fàngshǒu, háizi zhǎngdà hòu yuè quēfá dúlì nénglì. Qíshí zhǐyào jiāohuì tā fāngfǎ, háizi cóng wánchéng xiǎoshì zhōng fǎn'ér néng huòdé mǎnmǎn de chéngjiùgǎn.",
        "audioVi": "Nam: Tôi thấy con nhà chị mới tám tuổi mà đã tự sắp cặp sách, giặt tất rồi, ngày thường chị nỡ để cháu làm việc nhà thật sao? Nữ: Càng không nỡ buông tay, con lớn lên càng thiếu năng lực tự lập. Thật ra chỉ cần dạy cháu phương pháp, trẻ em qua việc hoàn thành việc nhỏ ngược lại có được cảm giác thành tựu tràn đầy.",
        "opts": [
          "Trẻ tám tuổi còn quá nhỏ, chưa nên làm bất cứ việc nhà nào",
          "Để trẻ tự làm việc vừa sức giúp rèn tính tự lập và tăng cảm giác thành tựu",
          "Cha mẹ nên làm hộ hết để trẻ tập trung học thêm ngoại ngữ",
          "Trẻ con chỉ nên làm việc nhà vào kỳ nghỉ hè"
        ],
        "ans": 1,
        "exp": "Người mẹ giải thích nếu không buông tay trẻ sẽ thiếu khả năng tự lập ('缺乏独立能力'), làm việc nhỏ giúp trẻ có cảm giác thành tựu ('成就感')."
      },
      {
        "id": "m5_2_l2",
        "partLabel": "Phần 1 • Hội thoại dài",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Vì sao buổi triển lãm sách cũ lại thu hút đông khách đến vậy?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：今天周末，旧书市集人真多啊，连不少年轻人都来淘书。 女：可不是嘛，很多绝版书平时根本买不到，而且摊主都是爱书之人，一边挑书一边聊阅读心得，这种面对面的交流感是网购代替不了的。",
        "audioPy": "Nán: Jīntiān zhōumò, jiùshū shìjí rén zhēn duō a, lián bùshǎo niánqīngrén dōu lái táoshū. Nǚ: Kě bú shì ma, hěn duō juébǎnshū píngshí gēnběn mǎi bu dào, érqiě tānzhǔ dōu shì àishū zhī rén, yìbiān tiāoshū yìbiān liáo yuèdú xīndé, zhè zhǒng miànduìmiàn de jiāoliúgǎn shì wǎnggòu dàitì bu liǎo de.",
        "audioVi": "Nam: Hôm nay cuối tuần, chợ phiên sách cũ đông người thật đấy, ngay cả nhiều bạn trẻ cũng tới săn sách. Nữ: Đúng vậy đó, nhiều cuốn sách ngừng tái bản ngày thường chẳng mua nổi, hơn nữa chủ sạp đều là người yêu sách, vừa chọn sách vừa trò chuyện cảm nhận đọc sách, cảm giác giao lưu trực tiếp này mua qua mạng không thay thế được.",
        "opts": [
          "Vì sách cũ ở đây được tặng miễn phí cho sinh viên",
          "Vì có nhiều sách hiếm và không khí giao lưu trực tiếp giữa người yêu sách",
          "Vì khu chợ có biểu diễn âm nhạc ngoài trời suốt cả ngày",
          "Vì giá sách mới ở nhà sách đang tăng gấp đôi"
        ],
        "ans": 1,
        "exp": "Cô nêu hai lý do: có nhiều sách tuyệt bản ('绝版书') và cảm giác trao đổi trực tiếp ('面对面的交流感') không thể thay thế."
      },
      {
        "id": "m5_2_l3",
        "partLabel": "Phần 1 • Hội thoại dài",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nam gặp vấn đề gì với bài thuyết trình ngày mai?",
        "statement": "",
        "statementPy": "",
        "audioZh": "女：明天的项目汇报准备好了吗？我看你还在盯着电脑发愁呢。 男：我把三年来的所有数据全放进演示文稿里了，结果四十多页，老板只给十分钟，真不知道该删哪部分。 女：汇报不是写论文，挑出最能说明结论的三组核心数据，其余的放进附录备查就行。",
        "audioPy": "Nǚ: Míngtiān de xiàngmù huìbào zhǔnbèi hǎo le ma? Wǒ kàn nǐ hái zài dīng zhe diànnǎo fāchóu ne. Nán: Wǒ bǎ sān nián lái de suǒyǒu shùjù quán fàngjìn yǎnshì wéngǎo lǐ le, jiéguǒ sìshí duō yè, lǎobǎn zhǐ gěi shí fēnzhōng, zhēn bù zhīdào gāi shān nǎ bùfen. Nǚ: Huìbào bú shì xiě lùnwén, tiāochū zuì néng shuōmíng jiélùn de sān zǔ héxīn shùjù, qíyú de fàngjìn fùlù bèichá jiù xíng.",
        "audioVi": "Nữ: Báo cáo dự án ngày mai chuẩn bị xong chưa? Mình thấy cậu vẫn nhìn chằm chằm máy tính lo lắng kìa. Nam: Mình đưa toàn bộ số liệu ba năm qua vào bản trình chiếu, kết quả hơn bốn mươi trang, mà sếp chỉ cho mười phút, thật không biết nên bỏ phần nào. Nữ: Báo cáo không phải viết luận văn, cứ chọn ba nhóm số liệu cốt lõi chứng minh kết luận nhất, phần còn lại đưa vào phụ lục dự phòng tra cứu là được.",
        "opts": [
          "Bị mất toàn bộ tệp dữ liệu trình chiếu trước ngày họp",
          "Bản trình chiếu quá dài so với thời gian 10 phút được giao",
          "Không tìm được số liệu của ba năm trước",
          "Máy chiếu trong phòng họp bị hỏng màn hình"
        ],
        "ans": 1,
        "exp": "Người nam làm tới hơn 40 trang trong khi sếp chỉ cho 10 phút ('四十多页，老板只给十分钟')."
      },
      {
        "id": "m5_2_l4",
        "partLabel": "Phần 1 • Hội thoại dài",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Hai người đang thảo luận về vấn đề gì trong đội ngũ?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：最近咱们研发组和市场部之间好像总因为需求变更产生摩擦，进度也受了影响。 女：关键在于双方平时沟通太少，各站各的角度看问题。下周咱们组织一次联合碰头会，把双方的工作流程和难点摊开来对齐一下。",
        "audioPy": "Nán: Zuìjìn zánmen yánfāzǔ hé shìchǎngbù zhījiān hǎoxiàng zǒng yīnwèi xūqiú biàngēng chǎnshēng mócā, jìndù yě shòu le yǐngxiǎng. Nǚ: Guānjiàn zàiyú shuāngfāng píngshí gōutōng tài shǎo, gè zhàn gè de jiǎodù kàn wèntí. Xià zhōu zánmen zǔzhī yí cì liánhé pèngtóuhuì, bǎ shuāngfāng de gōngzuò liúchéng hé nándiǎn tānkāilái duìqí yíxià.",
        "audioVi": "Nam: Gần đây giữa nhóm nghiên cứu phát triển và phòng thị trường hình như hay nảy sinh xích mích vì thay đổi yêu cầu, tiến độ cũng bị ảnh hưởng. Nữ: Mấu chốt là hai bên ngày thường ít trao đổi, bên nào cũng đứng từ góc độ của mình nhìn vấn đề. Tuần sau chúng ta tổ chức một buổi họp chung, trải hết quy trình và điểm khó của hai bên ra để thống nhất lại.",
        "opts": [
          "Thay đổi nhân sự lãnh đạo của cả hai phòng ban",
          "Sự thiếu phối hợp và hiểu nhầm giữa bộ phận kỹ thuật và thị trường",
          "Việc cắt giảm ngân sách nghiên cứu sản phẩm mới",
          "Cách tính tiền thưởng cuối năm cho nhân viên mới"
        ],
        "ans": 1,
        "exp": "Hai người bàn về xích mích giữa nhóm nghiên cứu và phòng thị trường do thiếu trao đổi ('沟通太少')."
      },
      {
        "id": "m5_2_l5",
        "partLabel": "Phần 1 • Hội thoại dài",
        "type": "mcq",
        "prompt": "Nghe hội thoại và trả lời: Người nữ khuyên bạn nên xử lý món đồ cũ thế nào?",
        "statement": "",
        "statementPy": "",
        "audioZh": "男：家里堆了不少以前买的书、小家电和八成新的外套，扔掉实在心疼，留着又占地方。 女：现在社区周末经常有环保置换市集，或者你也可以挂到二手交易平台上，既能腾出居住空间，又能让物品在别人手里继续发挥价值。",
        "audioPy": "Nán: Jiālǐ duī le bùshǎo yǐqián mǎi de shū, xiǎo jiādiàn hé bāchéng xīn de wàitào, rēngdiào shízài xīnténg, liúzhe yòu zhàn dìfang. Nǚ: Xiànzài shèqū zhōumò jīngcháng yǒu huánbǎo zhìhuàn shìjí, huòzhě nǐ yě kěyǐ guà dào èrshǒu jiāoyì píngtái shàng, jì néng téngchū jūzhù kōngjiān, yòu néng ràng wùpǐn zài biérén shǒulǐ jìxù fāhuī jiàzhí.",
        "audioVi": "Nam: Trong nhà chất đống khá nhiều sách cũ, đồ gia dụng nhỏ và áo khoác còn mới tám mươi phần trăm, vứt đi thì xót mà giữ lại thì chật chỗ. Nữ: Giờ cuối tuần khu dân cư hay có phiên chợ trao đổi xanh, hoặc cậu đăng lên sàn giao dịch đồ cũ, vừa giải phóng không gian sống vừa để đồ vật tiếp tục phát huy giá trị ở tay người khác.",
        "opts": [
          "Thuê kho bên ngoài để cất giữ toàn bộ đồ đạc cũ",
          "Đem trao đổi ở chợ cộng đồng hoặc bán lại trên sàn đồ cũ",
          "Bỏ hết vào thùng rác tái chế vào sáng sớm",
          "Giữ nguyên trong phòng khách làm đồ trang trí"
        ],
        "ans": 1,
        "exp": "Cô đề xuất mang tới phiên chợ trao đổi xanh ('环保置换市集') hoặc đăng lên nền tảng đồ cũ ('二手交易平台')."
      },
      {
        "id": "m5_2_l6",
        "partLabel": "Phần 2 • Đoạn văn hiểu ý chính",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Điểm hấp dẫn đặc trưng của ẩm thực địa phương nằm ở đâu?",
        "statement": "",
        "statementPy": "",
        "audioZh": "各地传统美食之所以历经百年依然动人，往往不仅在于食材新鲜或调味独特，更在于每道菜背后都藏着当地的气候物产与生活智慧。比如北方冬季寒冷，人们善用发酵和炖煮保存热量；南方湿热，饮食则偏重清鲜与驱湿。",
        "audioPy": "Gèdì chuántǒng měishí zhī suǒyǐ lìjīng bǎinián yīrán dòngrén, wǎngwǎng bùjǐn zàiyú shícái xīnxiān huò tiáowèi dútè, gèng zàiyú měi dào cài bèihòu dōu cáng zhe dāngdì de qìhòu wùchǎn yǔ shēnghuó zhìhuì. Bǐrú Běifāng dōngjì hánlěng, rénmen shànyòng fājiào hé dùnzhǔ bǎocún rèliàng; Nánfāng shīrè, yǐnshí zé piānzhòng qīngxiān yǔ qūshī.",
        "audioVi": "Ẩm thực truyền thống các vùng miền sở dĩ trải qua hàng trăm năm vẫn cuốn hút thường không chỉ vì nguyên liệu tươi hay gia vị độc đáo, mà còn vì đằng sau mỗi món ăn ẩn chứa khí hậu sản vật và trí tuệ sinh tồn của địa phương. Ví dụ miền Bắc mùa đông lạnh giá, người dân khéo dùng lên men và hầm nhừ để giữ nhiệt; miền Nam nóng ẩm thì ăn uống thiên về thanh tươi và trừ thấp.",
        "opts": [
          "Giá thành luôn rẻ hơn nhiều so với món ăn hiện đại",
          "Phản ánh điều kiện khí hậu, sản vật và trí tuệ sống bản địa",
          "Sử dụng các loại gia vị nhập khẩu đắt tiền từ nước ngoài",
          "Tất cả các vùng miền đều dùng chung một công thức chế biến"
        ],
        "ans": 1,
        "exp": "Đoạn văn nêu rõ điểm cốt lõi: '每道菜背后都藏着当地的气候物产与生活智慧' (ẩn chứa khí hậu sản vật và trí tuệ sống địa phương)."
      },
      {
        "id": "m5_2_l7",
        "partLabel": "Phần 2 • Đoạn văn hiểu ý chính",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Việc trồng cây xanh xen kẽ trong thành phố mang lại tác dụng nào sau đây?",
        "statement": "",
        "statementPy": "",
        "audioZh": "在钢筋水泥密集的大城市里，公园绿地和行道树绝不仅仅是视觉上的装饰。它们能有效吸收汽车尾气与粉尘，通过蒸腾作用降低夏季地表温度，缓解城市热岛效应，同时也是鸟类和昆虫赖以栖息的小型生态廊道。",
        "audioPy": "Zài gāngjīn-shuǐní mìjí de dà chéngshì lǐ, gōngyuán lǜdì hé xíngdàoshù jué bù jǐnjǐn shì shìjué shàng de zhuāngshì. Tāmen néng yǒuxiào xīshōu qìchē wěiqì yǔ fěnchén, tōngguò zhēngténg zuòyòng jiàngdī xiàjì dìbiǎo wēndù, huǎnjiě chéngshì rèdǎo xiàoyìng, tóngshí yě shì niǎolèi hé kūnchóng làiyǐ qīxī de xiǎoxíng shēngtài lángdào.",
        "audioVi": "Trong những đô thị lớn dày đặc bê tông cốt thép, công viên mảng xanh và cây ven đường tuyệt đối không chỉ là vật trang trí thị giác. Chúng có thể hấp thụ hiệu quả khí thải xe cộ và bụi mịn, hạ nhiệt độ bề mặt mùa hè nhờ quá trình thoát hơi nước, giảm hiệu ứng đảo nhiệt đô thị, đồng thời là hành lang sinh thái nhỏ nơi chim chóc và côn trùng nương náu.",
        "opts": [
          "Chỉ đóng vai trò làm đẹp cảnh quan cho các khu trung tâm",
          "Lọc bụi khí thải, giảm nhiệt mùa hè và tạo nơi cư trú cho sinh vật",
          "Làm tăng nhiệt độ mặt đường vào những ngày nắng gắt",
          "Ngăn chặn hoàn toàn lưu lượng giao thông nội đô"
        ],
        "ans": 1,
        "exp": "Bài liệt kê 3 vai trò sinh thái: hút khí thải bụi, giảm hiệu ứng đảo nhiệt ('缓解城市热岛效应') và làm hành lang sinh thái cho chim, côn trùng."
      },
      {
        "id": "m5_2_l8",
        "partLabel": "Phần 2 • Đoạn văn hiểu ý chính",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Vì sao nhiều người trẻ ngày nay lại quan tâm đến nhạc cụ dân tộc?",
        "statement": "",
        "statementPy": "",
        "audioZh": "过去不少人觉得二胡、琵琶、古筝这些民族乐器显得“太传统”，很难融入流行文化。近几年，一些青年音乐人把民族乐器与交响乐、现代节奏结合起来，创作出许多气势恢宏又充满韵味的作品，成功让传统民乐重新走进年轻人的歌单。",
        "audioPy": "Guòqù bùshǎo rén juéde èrhú, pípá, gǔzhēng zhèxiē mínzú yuèqì xiǎnde 'tài chuántǒng', hěn nán róngrù liúxíng wénhuà. Jìn jǐ nián, yìxiē qīngnián yīnyuèrén bǎ mínzú yuèqì yǔ jiāoxiǎngyuè, xiàndài jiézòu jiéhé qǐlái, chuàngzuò chū xǔduō qìshì huīhóng yòu chōngmǎn yùnwèi de zuòpǐn, chénggōng ràng chuántǒng mínyuè chóngxīn zǒujìn niánqīngrén de gēdān.",
        "audioVi": "Trước đây không ít người thấy các nhạc cụ dân tộc như nhị hồ, tỳ bà, đàn tranh có vẻ 'quá truyền thống', khó hòa nhập văn hóa đại chúng. Vài năm gần đây, một số nhạc sĩ trẻ kết hợp nhạc cụ dân tộc với nhạc giao hưởng và tiết tấu hiện đại, sáng tác nhiều tác phẩm vừa hào hùng vừa đậm đà dư vị, đưa nhạc dân tộc truyền thống trở lại danh sách nhạc của giới trẻ.",
        "opts": [
          "Vì giá bán nhạc cụ dân tộc giảm xuống rất thấp",
          "Vì các nghệ sĩ trẻ kết hợp sáng tạo nhạc cụ dân tộc với tiết tấu hiện đại",
          "Vì các trường đại học bắt buộc mọi sinh viên phải thi đàn tranh",
          "Vì nhạc hiện đại phương Tây không còn được phát hành nữa"
        ],
        "ans": 1,
        "exp": "Các nhạc sĩ trẻ kết hợp nhạc cụ dân tộc với giao hưởng và nhịp điệu hiện đại ('与交响乐、现代节奏结合起来') tạo sức hút mới."
      },
      {
        "id": "m5_2_l9",
        "partLabel": "Phần 2 • Đoạn văn hiểu ý chính",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Cách ngủ trưa khoa học nhất được gợi ý trong bài là gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "午睡是许多上班族恢复精力的好办法，但时间长度大有讲究。医学专家建议，健康成年人的午睡控制在二十分钟到三十分钟最为理想。如果睡得太久进入深度睡眠，醒来后反而会头昏脑胀，还会影响晚上的入睡质量。",
        "audioPy": "Wǔshuì shì xǔduō shàngbānzú huīfù jīnglì de hǎo bànfǎ, dàn shíjiān chángdù dà yǒu jiǎngjiu. Yīxué zhuānjiā jiànyì, jiànkāng chéngniánrén de wǔshuì kòngzhì zài èrshí fēnzhōng dào sānshí fēnzhōng zuì wéi lǐxiǎng. Rúguǒ shuì de tài jiǔ jìnrù shēndù shuìmián, xǐnglái hòu fǎn'ér huì tóuhūn-nǎozhàng, hái huì yǐngxiǎng wǎnshang de rùshuì zhìliàng.",
        "audioVi": "Ngủ trưa là cách hay giúp nhiều nhân viên văn phòng hồi phục tinh lực, nhưng độ dài thời gian rất đáng lưu ý. Chuyên gia y học khuyên người trưởng thành khỏe mạnh nên khống chế giấc ngủ trưa trong khoảng 20 đến 30 phút là lý tưởng nhất. Nếu ngủ quá lâu bước vào giấc ngủ sâu, lúc tỉnh dậy ngược lại sẽ choáng váng nặng đầu, còn ảnh hưởng chất lượng giấc ngủ ban đêm.",
        "opts": [
          "Ngủ trưa ít nhất từ một tiếng rưỡi đến hai tiếng mỗi ngày",
          "Kiểm soát thời lượng ngủ trưa trong khoảng 20 đến 30 phút",
          "Uống cà phê ngay trước khi chợp mắt 10 phút",
          "Không cần ngủ trưa vì dễ làm gián đoạn công việc buổi chiều"
        ],
        "ans": 1,
        "exp": "Chuyên gia khuyên: '控制在二十分钟到三十分钟最为理想' (duy trì từ 20 đến 30 phút là lý tưởng nhất)."
      },
      {
        "id": "m5_2_l10",
        "partLabel": "Phần 2 • Đoạn văn hiểu ý chính",
        "type": "mcq",
        "prompt": "Nghe đoạn văn và trả lời: Phẩm chất nào giúp các đội nhóm sáng tạo vượt qua rào cản giao tiếp?",
        "statement": "",
        "statementPy": "",
        "audioZh": "在跨学科合作中，不同专业背景的人常常使用截然不同的术语，对同一件事的理解也可能南辕北辙。优秀的团队成员不会因此嘲笑对方的“外行”，而是保持好奇与耐心，主动提问并把复杂概念翻译成大家都能听懂的语言，这样创意才能真正碰撞出火花。",
        "audioPy": "Zài kuà xuékē hézuò zhōng, bùtóng zhuānyè bèijǐng de rén chángcháng shǐyòng jiérán bùtóng de shùyǔ, duì tóng yí jiàn shì de lǐjiě yě kěnéng nányuán-běizhé. Yōuxiù de tuánduì chéngyuán bú huì yīncǐ cháoxiào duìfāng de 'wàiháng', érshì bǎochí hàoqí yǔ nàixīn, zhǔdòng tíwèn bìng bǎ fùzá gàiniàn fānyì chéng dàjiā dōu néng tīngdǒng de yǔyán, zhèyàng chuàngyì cái néng zhēnzhèng pèngzhuàng chū huǒhuā.",
        "audioVi": "Trong hợp tác liên ngành, người có nền tảng chuyên môn khác nhau thường dùng thuật ngữ hoàn toàn khác biệt, cách hiểu về cùng một việc cũng có thể trái ngược nhau. Thành viên xuất sắc không vì thế mà chê cười đối phương 'ngoại đạo', mà giữ sự tò mò và kiên nhẫn, chủ động đặt câu hỏi và chuyển hóa khái niệm phức tạp thành ngôn ngữ ai cũng hiểu được, như vậy sáng tạo mới thực sự bùng nổ.",
        "opts": [
          "Chỉ tuyển những thành viên tốt nghiệp cùng một chuyên ngành",
          "Giữ thái độ kiên nhẫn, cầu thị và diễn đạt khái niệm chuyên môn dễ hiểu",
          "Tránh thảo luận trực tiếp, chỉ gửi văn bản chuyên ngành dài",
          "Yêu cầu mọi người tự học thuộc từ điển thuật ngữ của ngành khác"
        ],
        "ans": 1,
        "exp": "Đoạn văn nêu rõ: '保持好奇与耐心，主动提问并把复杂概念翻译成大家都能听懂的语言'."
      }
    ],
    "reading": [
      {
        "id": "m5_2_r1",
        "partLabel": "Phần 1 • Điền từ ngữ cảnh",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ thích hợp điền vào chỗ trống: 虽然两座城市相隔千里，但便利的高铁网络使它们之间的经济往来日益______。",
        "qPy": "Suīrán liǎng zuò chéngshì xiānggé qiānlǐ, dàn biànlì de gāotiě wǎngluò shǐ tāmen zhījiān de jīngjì wǎnglái rìyì ______.",
        "orderItems": [],
        "opts": [
          "密切",
          "冷淡",
          "艰难",
          "分散"
        ],
        "ans": 0,
        "exp": "Đáp án đúng: A. 密切 (mìqiè — mật thiết, chặt chẽ). Cụm kết hợp chuẩn: '往来日益密切' (giao lưu ngày càng chặt chẽ). B: lạnh nhạt, C: gian nan, D: phân tán."
      },
      {
        "id": "m5_2_r2",
        "partLabel": "Phần 1 • Điền từ ngữ cảnh",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ thích hợp điền vào chỗ trống: 这部纪录片没有刻意煽情，而是通过平实的镜头语言，真实______了普通手艺人的坚守。",
        "qPy": "Zhè bù jìlùpiàn méiyǒu kèyì shānqíng, érshì tōngguò píngshí de jìngtóu yǔyán, zhēnshí ______ le pǔtōng shǒuyìrén de jiānshǒu.",
        "orderItems": [],
        "opts": [
          "呈现",
          "掩盖",
          "否认",
          "推迟"
        ],
        "ans": 0,
        "exp": "Đáp án đúng: A. 呈现 (chéngxiàn — khắc họa, tái hiện, bày ra trước mắt). Phù hợp với '镜头语言' và '真实呈现'. B: che giấu, C: phủ nhận, D: trì hoãn."
      },
      {
        "id": "m5_2_r3",
        "partLabel": "Phần 1 • Điền từ ngữ cảnh",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ thích hợp điền vào chỗ trống: 无论在哪个行业工作，诚信都是最宝贵的职业道德，一旦失去信任，就很难再______。",
        "qPy": "Wúlùn zài nǎ ge hángyè gōngzuò, chéngxìn dōu shì zuì bǎoguì de zhíyè dàodé, yídàn shīqù xìnrèn, jiù hěn nán zài ______.",
        "orderItems": [],
        "opts": [
          "挽回",
          "保持",
          "拒绝",
          "省略"
        ],
        "ans": 0,
        "exp": "Đáp án đúng: A. 挽回 (wǎnhuí — vãn hồi, lấy lại). Cụm cố định: '失去信任……很难挽回' (mất niềm tin rất khó lấy lại). B: giữ gìn, C: từ chối, D: tỉnh lược."
      },
      {
        "id": "m5_2_r4",
        "partLabel": "Phần 2 • Đọc hiểu đoạn văn chuyên đề",
        "kind": "mcq",
        "passageZh": "很多家长在辅导孩子写作业时，看到孩子算错一道题或者写字慢，就忍不住大声指责。然而教育专家指出，过度的焦虑和催促不仅无法提高学习效率，反而会让孩子把“学习”与“被批评的恐惧”联系在一起，久而久之产生厌学情绪。给孩子留出试错的空间，往往比急着纠正错误更有效。",
        "passagePy": "Hěn duō jiāzhǎng zài fǔdǎo háizi xiě zuòyè shí, kàndào háizi suàncuò yí dào tí huòzhě xiězì màn, jiù rěn bu zhù dàshēng zhǐzé. Rán'ér jiàoyù zhuānjiā zhǐchū, guòdù de jiāolǜ hé cuīcù bùjǐn wúfǎ tígāo xuéxí xiàolǜ, fǎn'ér huì ràng háizi bǎ 'xuéxí' yǔ 'bèi pīpíng de kǒngjù' liánxì zài yìqǐ, jiǔ'érjiǔzhī chǎnshēng yànxué qíngxù. Gěi háizi liúchū shìcuò de kōngjiān, wǎngwǎng bǐ jí zhe jiūzhèng cuòwù gèng yǒuxiào.",
        "passageVi": "Nhiều phụ huynh khi kèm con làm bài tập, hễ thấy con tính sai một bài hoặc viết chậm là không kiềm chế được mà lớn tiếng trách mắng. Tuy nhiên chuyên gia giáo dục chỉ ra sự lo âu và thúc giục thái quá chẳng những không nâng cao hiệu quả học tập mà còn khiến trẻ gắn liền 'việc học' với 'nỗi sợ bị phê bình', lâu dần sinh ra tâm lý chán học. Dành cho trẻ không gian thử sai thường hiệu quả hơn việc vội vàng sửa lỗi.",
        "q": "Theo chuyên gia giáo dục, việc cha mẹ hay quát mắng khi kèm con học có hậu quả gì?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Giúp trẻ làm bài tập nhanh hơn hẳn gấp đôi",
          "Khiến trẻ gắn việc học với nỗi sợ và dần sinh ra chán học",
          "Giúp trẻ tự giác sửa lỗi sai mà không cần hướng dẫn",
          "Tăng sự gắn kết tình cảm giữa cha mẹ và con cái"
        ],
        "ans": 1,
        "exp": "Đoạn văn nêu rõ: '让孩子把学习与被批评的恐惧联系在一起，久而久之产生厌学情绪'."
      },
      {
        "id": "m5_2_r5",
        "partLabel": "Phần 2 • Đọc hiểu đoạn văn chuyên đề",
        "kind": "mcq",
        "passageZh": "在信息爆炸的时代，判断力比记忆力更加稀缺。过去我们评价一个人“博学”，常常看他脑子里记住了多少具体事实；而今天，各类搜索引擎随时能提供海量资料，真正拉开人与人差距的，是能否辨别信息真伪、提出有价值的问题，并将零散知识整合成解决实际方案的能力。",
        "passagePy": "Zài xìnxī bàozhà de shídài, pànduànlì bǐ jìyìlì gèngjiā xīquē. Guòqù wǒmen píngjià yí ge rén 'bóxué', chángcháng kàn tā nǎozi lǐ jìzhù le duōshǎo jùtǐ shìshí; ér jīntiān, gèlèi sōusuǒ yǐnqíng suíshí néng tígōng hǎiliàng zīliào, zhēnzhèng lākāi rén yǔ rén chājù de, shì néngfǒu biànbié xìnxī zhēnwěi, tíchū yǒu jiàzhí de wèntí, bìng jiāng língsǎn zhīshi zhěnghé chéng jiějué shíjì fāng'àn de nénglì.",
        "passageVi": "Trong thời đại bùng nổ thông tin, năng lực phán đoán còn khan hiếm hơn trí nhớ. Trước đây khi đánh giá một người 'uyên bác', ta thường xem họ nhớ được bao nhiêu dữ kiện cụ thể trong đầu; còn hôm nay, các công cụ tìm kiếm bất cứ lúc nào cũng cung cấp được kho tư liệu khổng lồ, điều thực sự tạo ra khoảng cách giữa người với người là khả năng phân biệt thật giả, đặt câu hỏi giá trị và tích hợp kiến thức rời rạc thành giải pháp thực tế.",
        "q": "Trong thời đại bùng nổ thông tin ngày nay, năng lực nào tạo nên sự khác biệt lớn nhất?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Khả năng học thuộc lòng hàng nghìn dữ kiện lịch sử",
          "Khả năng chọn lọc thật giả, đặt câu hỏi hay và tổng hợp giải pháp",
          "Tốc độ gõ bàn phím khi sử dụng công cụ tìm kiếm",
          "Số lượng sách giấy lưu trữ trong thư viện cá nhân"
        ],
        "ans": 1,
        "exp": "Bài chỉ rõ điều tạo khoảng cách là '辨别信息真伪、提出有价值的问题，并将零散知识整合成解决实际方案的能力'."
      },
      {
        "id": "m5_2_r6",
        "partLabel": "Phần 2 • Đọc hiểu đoạn văn chuyên đề",
        "kind": "mcq",
        "passageZh": "很多人搬进新家后喜欢买各种漂亮的收纳盒，以为这样屋子就会永远整洁。然而没过几个月，家里又恢复了凌乱。整理师指出，收纳只是整理过程的最后一步，真正的核心在于“定期筛选”——果断清理不再使用的物品，控制新物品进入家门的速度，空间才能真正变得清爽有序。",
        "passagePy": "Hěn duō rén bānjìn xīnjiā hòu xǐhuan mǎi gèzhǒng piàoliang de shōunàhé, yǐwéi zhèyàng wūzi jiù huì yǒngyuǎn zhěngjié. Rán'ér méi guò jǐ ge yuè, jiālǐ yòu huīfù le língluàn. Zhěnglǐshī zhǐchū, shōunà zhǐshì zhěnglǐ guòchéng de zuìhòu yí bù, zhēnzhèng de héxīn zàiyú 'dìngqī shāixuǎn'——guǒduàn qīnglǐ búzài shǐyòng de wùpǐn, kòngzhì xīn wùpǐn jìnrù jiāmén de sùdù, kōngjiān cái néng zhēnzhèng biànde qīngshuǎng yǒuxù.",
        "passageVi": "Nhiều người sau khi dọn vào nhà mới thích mua đủ loại hộp đựng đẹp mắt, tưởng rằng như vậy nhà cửa sẽ mãi gọn gàng. Thế nhưng chẳng qua vài tháng, trong nhà lại trở về cảnh bừa bộn. Chuyên gia sắp xếp chỉ ra cất giữ chỉ là bước cuối cùng của quá trình dọn dẹp, cốt lõi thực sự nằm ở 'sàng lọc định kỳ' — dứt khoát dọn bỏ đồ không còn dùng, kiểm soát tốc độ đồ mới vào nhà thì không gian mới thực sự thoáng đãng ngăn nắp.",
        "q": "Theo chuyên gia sắp xếp, yếu tố cốt lõi giúp nhà cửa gọn gàng lâu dài là gì?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Mua thật nhiều hộp đựng đồng bộ màu sắc",
          "Thường xuyên sàng lọc bỏ đồ thừa và hạn chế mua thêm",
          "Thuê dịch vụ dọn dẹp chuyên nghiệp mỗi tuần",
          "Chuyển sang căn hộ có diện tích lớn gấp đôi"
        ],
        "ans": 1,
        "exp": "Đoạn văn nhấn mạnh cốt lõi nằm ở '定期筛选' (sàng lọc định kỳ), dọn bỏ đồ không dùng và kiểm soát lượng đồ mới."
      },
      {
        "id": "m5_2_r7",
        "partLabel": "Phần 2 • Đọc hiểu đoạn văn chuyên đề",
        "kind": "mcq",
        "passageZh": "长期以来，人们习惯将野生动物栖息地的减少单纯归咎于城市扩张。其实，许多看似不起眼的人类设施——例如横穿森林的高速公路、夜晚刺眼的户外照明灯——同样在悄悄改变动物的迁徙路线与觅食规律。目前不少国家开始为动物修建专门的“生态天桥”，正是为了修补这些被割裂的自然家园。",
        "passagePy": "Chángqī yǐlái, rénmen xíguàn jiāng yěshēng dòngwù qīxīdì de jiǎnshǎo dānchún guījiù yú chéngshì kuòzhāng. Qíshí, xǔduō kànsì bù qǐyǎn de rénlèi shèshī——lìrú héngchuān sēnlín de gāosù gōnglù, yèwǎn cìyǎn de hùwài zhàomíngdēng——tóngyàng zài qiāoqiāo gǎibiàn dòngwù de qiānxǐ lùxiàn yǔ mìshí guīlǜ. Mùqián bùshǎo guójiā kāishǐ wèi dòngwù xiūjiàn zhuānmén de 'shēngtài tiānqiáo', zhèng shì wèile xiūbǔ zhèxiē bèi gēliè de zìrán jiāyuán.",
        "passageVi": "Lâu nay người ta quen quy kết đơn thuần việc thu hẹp môi trường sống của động vật hoang dã cho sự mở rộng đô thị. Kỳ thực nhiều công trình tưởng chừng nhỏ nhặt của con người — chẳng hạn đường cao tốc cắt ngang rừng, đèn chiếu sáng ngoài trời chói mắt ban đêm — cũng đang âm thầm làm thay đổi tuyến di cư và quy luật kiếm ăn của động vật. Hiện nay không ít quốc gia bắt đầu xây 'cầu vượt sinh thái' dành riêng cho động vật nhằm hàn gắn những mái nhà tự nhiên bị chia cắt ấy.",
        "q": "Mục đích của việc xây dựng 'cầu vượt sinh thái' được nhắc đến trong đoạn văn là gì?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Tạo điểm ngắm cảnh mới cho khách du lịch đi qua rừng",
          "Giúp động vật di chuyển an toàn qua các vùng sinh cảnh bị chia cắt",
          "Giảm bớt ùn tắc giao thông trên các tuyến đường cao tốc",
          "Cung cấp thêm ánh sáng ban đêm cho khu vực ngoại ô"
        ],
        "ans": 1,
        "exp": "Câu cuối nêu rõ: xây '生态天桥' là để '修补这些被割裂的自然家园' (hàn gắn lại không gian tự nhiên bị chia cắt)."
      },
      {
        "id": "m5_2_r8",
        "partLabel": "Phần 2 • Đọc hiểu đoạn văn chuyên đề",
        "kind": "mcq",
        "passageZh": "有人把阅读经典文学比作“与跨越时空的智者对话”。初读时，我们或许只记住了曲折的故事情节；等经历过人生的起落后再翻开同一本书，往往会在曾经忽略的段落里突然产生共鸣。优秀的经典作品就像一面镜子，不同年龄的读者都能在其中照见当时的自己。",
        "passagePy": "Yǒurén bǎ yuèdú jīngdiǎn wénxué bǐzuò 'yǔ kuàyuè shíkōng de zhìzhě duìhuà'. Chūdú shí, wǒmen huòxǔ zhǐ jìzhù le qūzhé de gùshi qíngjié; děng jīnglì guo rénshēng de qǐluò hòu zài fānkāi tóng yì běn shū, wǎngwǎng huì zài céngjīng hūlüè de duànluò lǐ tūrán chǎnshēng gòngmíng. Yōuxiù de jīngdiǎn zuòpǐn jiù xiàng yí miàn jìngzi, bùtóng niánlíng de dúzhě dōu néng zài qízhōng zhàojiàn dāngshí de zìjǐ.",
        "passageVi": "Có người ví việc đọc văn học kinh điển như 'đối thoại cùng bậc hiền triết vượt qua không gian và thời gian'. Khi mới đọc, có lẽ ta chỉ nhớ cốt truyện ly kỳ; đợi sau khi trải qua thăng trầm cuộc đời rồi mở lại chính cuốn sách ấy, ta thường bất ngờ tìm thấy sự đồng cảm ở những đoạn từng bỏ qua. Tác phẩm kinh điển xuất sắc tựa như tấm gương, độc giả ở mỗi độ tuổi đều có thể soi thấy chính mình lúc ấy trong đó.",
        "q": "Tác giả so sánh tác phẩm văn học kinh điển với 'tấm gương' nhằm nhấn mạnh điều gì?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Sách kinh điển chỉ dành cho người lớn tuổi đã trải đời",
          "Mỗi lần đọc ở các giai đoạn đời khác nhau đều mang lại cảm nhận và sự đồng cảm mới",
          "Nội dung sách kinh điển luôn phản ánh chính xác lịch sử cổ đại",
          "Đọc lại sách cũ làm lãng phí thời gian tìm hiểu sách mới"
        ],
        "ans": 1,
        "exp": "Người đọc ở từng độ tuổi và trải nghiệm khác nhau khi mở lại cùng một cuốn sách lại có sự đồng cảm mới ('不同年龄的读者都能在其中照见当时的自己')."
      },
      {
        "id": "m5_2_r9",
        "partLabel": "Phần 2 • Đọc hiểu đoạn văn chuyên đề",
        "kind": "mcq",
        "passageZh": "在医院和养老院中，越来越多的机构开始引入“音乐陪伴”项目。临床观察表明，温和熟悉的旋律能够降低患者的紧张激素水平，缓解慢性疼痛带来的不安情绪。对于记忆力逐渐衰退的老人而言，童年时期听过的老歌甚至能唤醒深埋在脑海中的温暖片段，让他们重新露出笑容。",
        "passagePy": "Zài yīyuàn hé yǎnglǎoyuàn zhōng, yuèláiyuè duō de jīgòu kāishǐ yǐnrù 'yīnyuè péibàn' xiàngmù. Línchuáng guānchá biǎomíng, wēnhé shúxī de xuánlǜ nénggòu jiàngdī huànzhě de jǐnzhāng jīsù shuǐpíng, huǎnjiě mànxìng téngtòng dàilái de bù'ān qíngxù. Duìyú jìyìlì zhújiàn shuāituì de lǎorén éryán, tóngnián shíqī tīng guo de lǎogē shènzhì néng huànxǐng shēnmái zài nǎohǎi zhōng de wēnnuǎn piànduàn, ràng tāmen chóngxīn lùchū xiàoróng.",
        "passageVi": "Tại bệnh viện và viện dưỡng lão, ngày càng nhiều cơ sở bắt đầu đưa vào chương trình 'âm nhạc đồng hành'. Quan sát lâm sàng cho thấy giai điệu êm dịu quen thuộc có thể giảm nồng độ hoóc-môn căng thẳng của người bệnh, xoa dịu nỗi bất an do cơn đau mạn tính. Đối với người cao tuổi trí nhớ suy giảm dần, những bài hát cũ từng nghe thời thơ ấu thậm chí có thể đánh thức những mảnh ký ức ấm áp chôn sâu trong tâm trí, giúp họ mỉm cười trở lại.",
        "q": "Những bài hát quen thuộc thời thơ ấu có tác dụng đặc biệt gì với người cao tuổi suy giảm trí nhớ?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Thay thế hoàn toàn các loại thuốc điều trị hằng ngày",
          "Gợi lại những ký ức ấm áp và mang đến niềm vui cho họ",
          "Giúp họ nhớ lại toàn bộ số điện thoại của con cháu",
          "Khiến bệnh viện không cần bố trí nhân viên chăm sóc"
        ],
        "ans": 1,
        "exp": "Câu cuối viết rõ: '唤醒深埋在脑海中的温暖片段，让他们重新露出笑容' (đánh thức ký ức ấm áp và giúp họ cười trở lại)."
      },
      {
        "id": "m5_2_r10",
        "partLabel": "Phần 2 • Đọc hiểu đoạn văn chuyên đề",
        "kind": "mcq",
        "passageZh": "很多职场新人一进入公司，就急着在短时间内证明自己，恨不得把所有工作都揽下来。结果精力分散，每件事都只做到了及格线，反而给团队留下了不够稳重的印象。事实上，把一件看似普通的日常工作做到极致、零失误，远比接十件任务却频频出错更能赢得同事的信任。",
        "passagePy": "Hěn duō zhíchǎng xīnrén yì jìnrù gōngsī, jiù jí zhe zài duǎn shíjiān nèi zhèngmíng zìjǐ, hěnbude bǎ suǒyǒu gōngzuò dōu lǎn xiàlái. Jiéguǒ jīnglì fēnsàn, měi jiàn shì dōu zhǐ zuòdào le jígéxiàn, fǎn'ér gěi tuánduì liúxià le búgòu wěnzhòng de yìnxiàng. Shìshíshàng, bǎ yí jiàn kànsì pǔtōng de rìcháng gōngzuò zuòdào jízhì, líng shīwù, yuǎn bǐ jiē shí jiàn rènwu què pínpín chūcuò gèng néng yíngdé tóngshì de xìnrèn.",
        "passageVi": "Nhiều nhân viên mới vừa vào công ty đã nóng lòng chứng tỏ bản thân trong thời gian ngắn, chỉ muốn ôm đồm tất cả mọi việc. Kết quả là phân tán sức lực, việc nào cũng chỉ làm ở mức trung bình, ngược lại để lại ấn tượng thiếu chín chắn trong đội ngũ. Trên thực tế, làm một công việc thường ngày tưởng chừng bình dị đạt mức xuất sắc, không sai sót sẽ dễ giành được sự tin cậy của đồng nghiệp hơn nhiều so với việc nhận mười nhiệm vụ mà liên tục mắc lỗi.",
        "q": "Lời khuyên dành cho người mới đi làm trong đoạn văn là gì?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Nhận càng nhiều dự án cùng lúc càng chứng tỏ năng lực cao",
          "Làm thật chỉn chu và xuất sắc từng việc nhỏ để xây dựng niềm tin",
          "Từ chối mọi công việc thường ngày để chỉ làm dự án lớn",
          "Thay đổi công ty liên tục trong năm đầu tiên"
        ],
        "ans": 1,
        "exp": "Đoạn văn khẳng định: '把一件看似普通的日常工作做到极致、零失误' hiệu quả hơn ôm đồm nhiều việc mà hay sai sót."
      }
    ],
    "writing": [
      {
        "id": "m5_2_w1",
        "partLabel": "Phần 1 • Sắp xếp từ thành câu",
        "type": "reorder",
        "words": [
          "这个",
          "引起了",
          "话题",
          "社会各界的",
          "广泛",
          "讨论"
        ],
        "answer": "这个话题引起了社会各界的广泛讨论。",
        "py": "Zhège huàtí yǐnqǐ le shèhuì gèjiè de guǎngfàn tǎolùn.",
        "vi": "Chủ đề này đã thu hút sự thảo luận rộng rãi của các tầng lớp xã hội.",
        "exp": "Cụm kết hợp chuẩn HSK 5: '引起……广泛讨论' (gây ra/thu hút sự thảo luận rộng rãi) với định ngữ '社会各界的'."
      },
      {
        "id": "m5_2_w2",
        "partLabel": "Phần 1 • Sắp xếp từ thành câu",
        "type": "reorder",
        "words": [
          "无论",
          "遇到",
          "都要",
          "冷静分析",
          "什么挫折",
          "我们"
        ],
        "answer": "无论遇到什么挫折我们都要冷静分析。",
        "py": "Wúlùn yùdào shénme cuòzhé wǒmen dōu yào lěngjìng fēnxī.",
        "vi": "Bất kể gặp phải thất bại gì, chúng ta đều phải bình tĩnh phân tích.",
        "exp": "Cấu trúc điều kiện không điều kiện '无论……都……' đứng đầu câu, theo sau là chủ ngữ '我们' + '都要冷静分析'."
      },
      {
        "id": "m5_2_w3",
        "partLabel": "Phần 1 • Sắp xếp từ thành câu",
        "type": "reorder",
        "words": [
          "他",
          "凭借",
          "扎实的",
          "赢得了",
          "评委们的",
          "专业知识",
          "认可"
        ],
        "answer": "他凭借扎实的专业知识赢得了评委们的认可。",
        "py": "Tā píngjiè zhāshi de zhuānyè zhīshi yíngdé le píngwěimen de rènkě.",
        "vi": "Anh ấy nhờ kiến thức chuyên môn vững chắc đã giành được sự công nhận của ban giám khảo.",
        "exp": "Giới từ HSK 5 '凭借' (dựa vào/nhờ vào) + '扎实的专业知识' + Động từ '赢得了' + '评委们的认可'."
      },
      {
        "id": "m5_2_w4",
        "partLabel": "Phần 2 • Viết đoạn văn 80 chữ theo từ khóa",
        "type": "essay_keywords",
        "title": "Sáng tạo trên nền tảng văn hóa truyền thống",
        "keywords": [
          "传统",
          "创新",
          "吸引",
          "体验",
          "自豪"
        ],
        "minChars": 60,
        "targetChars": 80,
        "promptVi": "Sử dụng đầy đủ 5 từ khóa (传统, 创新, 吸引, 体验, 自豪) viết một đoạn văn khoảng 80 chữ Hán nói về cách đưa văn hóa truyền thống đến gần giới trẻ.",
        "sampleZh": "上周末我参观了一个传统手工艺展览。主办方大胆进行了创新，设置了互动体验区，让观众亲手制作剪纸和陶瓷。这种新颖的形式成功吸引了许多年轻人前来打卡。看到古老文化在新时代焕发活力，我感到无比自豪。",
        "samplePy": "Shàng zhōumò wǒ cānguān le yí ge chuántǒng shǒugōngyì zhǎnlǎn. Zhǔbànfāng dàdǎn jìnxíng le chuàngxīn, shèzhì le hùdòng tǐyànqū, ràng guānzhòng qīnshǒu zhìzuò jiǎnzhǐ hé táocí. Zhè zhǒng xīnyǐng de xíngshì chénggōng xīyǐn le xǔduō niánqīngrén qiánlái dǎkǎ. Kàndào gǔlǎo wénhuà zài xīn shídài huànfā huólì, wǒ gǎndào wúbǐ zìháo.",
        "sampleVi": "Cuối tuần trước tôi đã tham quan một triển lãm thủ công mỹ nghệ truyền thống. Ban tổ chức mạnh dạn đổi mới, bố trí khu trải nghiệm tương tác để khán giả tự tay làm tranh cắt giấy và đồ gốm. Hình thức mới mẻ này thu hút thành công nhiều bạn trẻ tới tham dự. Nhìn thấy văn hóa cổ xưa tỏa sáng sức sống ở thời đại mới, tôi cảm thấy vô cùng tự hào.",
        "exp": "Đoạn văn dẫn dắt tự nhiên từ trải nghiệm thực tế, kết hợp mượt mà 5 từ khóa: 传统 -> 创新 -> 体验 -> 吸引 -> 自豪, văn phong chuẩn HSK 5."
      }
    ]
  },
  {
    "id": "mock_hsk6_1",
    "level": 6,
    "testNo": 1,
    "badge": "HSK 6 • Đề số 1",
    "title": "Đề Thi Thử HSK 6 — Đề Số 1",
    "subtitle": "23 câu chuẩn thi máy • Nghe (10) • Đọc (10) • Viết (3) • Chủ đề: Khoa học & Triết lý sống",
    "durationSec": 8100,
    "maxScore": 300,
    "passScore": 180,
    "listening": [
      {
        "id": "m6_1_l1",
        "partLabel": "Phần 1 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe trích đoạn phỏng vấn và trả lời: Nhà nghiên cứu kiến trúc xanh nhấn mạnh điều gì về vật liệu truyền thống?",
        "statement": "",
        "statementPy": "",
        "audioZh": "主持人：林教授，如今摩天大楼普遍采用玻璃幕墙和钢结构，您为什么在项目中反而重新启用夯土和竹材？ 林教授：很多人误以为传统材料等同于落后。实际上，经过现代工艺改良的竹材抗压强度极高，而夯土墙体具有良好的调温调湿性能。就地取材不仅大幅降低了运输碳排放，还能让建筑真正顺应当地气候。",
        "audioPy": "Zhǔchírén: Lín jiàoshòu, rújīn mótiān dàlóu pǔbiàn cǎiyòng bōli mùqiáng hé gāng jiégòu, nín wèishénme zài xiàngmù zhōng fǎn'ér chóngxīn qǐyòng hāngtǔ hé zhúcái? Lín jiàoshòu: Hěn duō rén wùyǐwéi chuántǒng cáiliào děngtóng yú luòhòu. Shíjìshàng, jīngguò xiàndài gōngyì gǎiliáng de zhúcái kàngyā qiángdù jí gāo, ér hāngtǔ qiángtǐ jùyǒu liánghǎo de tiáowēn tiáoshī xìngnéng. Jiùdì-qǔcái bùjǐn dàfú jiàngdī le yùnshū tànpáifàng, hái néng ràng jiànzhù zhēnzhèng shùnyìng dāngdì qìhòu.",
        "audioVi": "Người dẫn chương trình: Thưa Giáo sư Lâm, ngày nay nhà chọc trời phổ biến dùng vách kính và kết cấu thép, vì sao trong dự án của mình ông lại tái sử dụng đất nện và tre? Giáo sư Lâm: Nhiều người lầm tưởng vật liệu truyền thống đồng nghĩa với lạc hậu. Thực tế, vật liệu tre được cải tiến bằng công nghệ hiện đại có cường độ chịu nén cực cao, còn tường đất nện có tính năng điều hòa nhiệt độ và độ ẩm rất tốt. Khai thác vật liệu tại chỗ không chỉ giảm mạnh phát thải các-bon từ vận chuyển mà còn giúp công trình thực sự thuận theo khí hậu địa phương.",
        "opts": [
          "Vật liệu truyền thống rẻ hơn nên không cần bảo trì công trình",
          "Vật liệu bản địa được cải tiến vừa bền chắc, điều hòa khí hậu vừa giảm phát thải",
          "Kính và thép hoàn toàn không phù hợp với kiến trúc hiện đại",
          "Tre và đất nện chỉ dùng được cho các ngôi nhà tạm thời ở nông thôn"
        ],
        "ans": 1,
        "exp": "Giáo sư Lâm chỉ rõ tre cải tiến chịu lực cao, đất nện điều hòa nhiệt ẩm và khai thác tại chỗ giúp giảm phát thải vận chuyển, hợp khí hậu địa phương."
      },
      {
        "id": "m6_1_l2",
        "partLabel": "Phần 1 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe trích đoạn phỏng vấn và trả lời: Theo vị bác sĩ tâm lý, 'hiệu ứng mệt mỏi vì lựa chọn' xảy ra khi nào?",
        "statement": "",
        "statementPy": "",
        "audioZh": "主持人：有人说选择越多越自由，可为什么面对几十种套餐反而觉得心累？ 医生：这就是心理学所说的“决策疲劳”。人每天消耗在判断与权衡上的意志力是有限的。当我们在琐碎小事上反复消耗精力时，等到处理真正重大的决定，大脑往往会倾向于拖延甚至做出草率的选择。",
        "audioPy": "Zhǔchírén: Yǒurén shuō xuǎnzé yuè duō yuè zìyóu, kě wèishénme miànduì jǐshí zhǒng tàocān fǎn'ér juéde xīnlèi? Yīshēng: Zhè jiùshì xīnlǐxué suǒ shuō de 'juécè píláo'. Rén měitiān xiāohào zài pànduàn yǔ quánhéng shàng de yìzhìlì shì yǒuxiàn de. Dāng wǒmen zài suǒsuì xiǎoshì shàng fǎnfù xiāohào jīnglì shí, děngdào chǔlǐ zhēnzhèng zhòngdà de juédìng, dànǎo wǎngwǎng huì qīngxiàng yú tuōyán shènzhì zuòchū cǎoshuài de xuǎnzé.",
        "audioVi": "Người dẫn chương trình: Có người nói càng nhiều lựa chọn càng tự do, nhưng sao đứng trước hàng chục thực đơn lại thấy mệt tâm? Bác sĩ: Đây chính là điều tâm lý học gọi là 'mệt mỏi quyết định'. Ý chí con người tiêu hao mỗi ngày cho việc phán đoán và cân nhắc là hữu hạn. Khi ta liên tục tiêu tốn tinh lực vào những việc nhỏ vụn vặt, đến lúc xử lý quyết định thực sự trọng đại, não bộ thường có xu hướng trì hoãn thậm chí chọn bừa vội vàng.",
        "opts": [
          "Khi con người không có bất kỳ lựa chọn nào để quyết định",
          "Khi ý chí bị bào mòn vì cân nhắc quá nhiều việc nhỏ dẫn đến giảm chất lượng quyết định lớn",
          "Khi thời gian làm việc kéo dài quá 12 tiếng mỗi ngày",
          "Khi giá cả các gói dịch vụ chênh lệch quá cao"
        ],
        "ans": 1,
        "exp": "Bác sĩ giải thích ý chí có hạn; tiêu tốn quá nhiều sức cân nhắc việc vặt ('在琐碎小事上反复消耗精力') sẽ làm não trì hoãn hoặc quyết định cẩu thả khi gặp việc lớn."
      },
      {
        "id": "m6_1_l3",
        "partLabel": "Phần 1 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe trích đoạn phỏng vấn và trả lời: Nhà ngôn ngữ học nhìn nhận thế nào về các từ ngữ mới trên mạng?",
        "statement": "",
        "statementPy": "",
        "audioZh": "主持人：您对网络流行语频繁进入日常对话感到担忧吗？ 学者：语言从来不是一成不变的化石，它随着社会生活不断新陈代谢。有些网络热词只是昙花一现，过两年便自然淘汰；而那些真正精准概括了时代特征与群体心理的词汇，则会沉淀下来，成为现代汉语鲜活的补充。",
        "audioPy": "Zhǔchírén: Nín duì wǎngluò liúxíngyǔ pínfán jìnrù rìcháng duìhuà gǎndào dānyōu ma? Xuézhě: Yǔyán cónglái bú shì yìchéng-búbiàn de huàshí, tā suízhe shèhuì shēnghuó búduàn xīnchén-dàixiè. Yǒuxiē wǎngluò rècí zhǐshì tánhuā-yíxiàn, guò liǎng nián biàn zìrán táotài; ér nàxiē zhēnzhèng jīngzhǔn gàikuò le shídài tèzhēng yǔ qúntǐ xīnlǐ de cíhuì, zé huì chéndiàn xiàlái, chéngwéi xiàndài Hànyǔ xiānhuó de bǔchōng.",
        "audioVi": "Người dẫn chương trình: Ông có lo ngại khi từ ngữ thịnh hành trên mạng liên tục bước vào hội thoại hằng ngày không? Học giả: Ngôn ngữ xưa nay không phải hóa thạch bất biến, nó không ngừng trao đổi chất cùng đời sống xã hội. Một số từ nóng trên mạng chỉ sớm nở tối tàn, qua hai năm tự khắc bị đào thải; còn những từ thực sự khái quát chính xác đặc trưng thời đại và tâm lý cộng đồng sẽ lắng đọng lại, trở thành sự bổ sung sinh động cho tiếng Hán hiện đại.",
        "opts": [
          "Cần ban hành lệnh cấm tuyệt đối mọi từ mới xuất hiện trên mạng",
          "Ngôn ngữ tự thanh lọc: từ nhất thời sẽ biến mất, từ giá trị sẽ bổ sung làm giàu ngôn ngữ",
          "Từ ngữ mạng sẽ thay thế hoàn toàn ngữ pháp cổ điển trong vòng năm năm",
          "Chỉ giới trẻ dưới 20 tuổi mới hiểu được ý nghĩa của từ mới"
        ],
        "ans": 1,
        "exp": "Học giả ví ngôn ngữ tự trao đổi chất: từ nhất thời '昙花一现' rồi tự đào thải, từ phản ánh đúng thời đại sẽ lắng đọng bổ sung cho tiếng Hán."
      },
      {
        "id": "m6_1_l4",
        "partLabel": "Phần 1 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe trích đoạn phỏng vấn và trả lời: Điều gì quyết định sự thành công của bảo tàng số theo bà Trần?",
        "statement": "",
        "statementPy": "",
        "audioZh": "主持人：陈馆长，很多博物馆都在做线上三维文物展示，怎样才能避免“技术很炫却留不住观众”？ 陈馆长：技术永远只是手段，核心还是“讲好文物背后的故事”。当观众不仅能放大看清青铜器上的铭文，还能听懂工匠当年的生活境遇与审美追求，历史才算真正活了起来。",
        "audioPy": "Zhǔchírén: Chén guǎnzhǎng, hěn duō bówùguǎn dōu zài zuò xiànshàng sānwéi wénwù zhǎnshì, zěnyàng cái néng bìmiǎn 'jìshù hěn xuàn què liú bu zhù guānzhòng'? Chén guǎnzhǎng: Jìshù yǒngyuǎn zhǐshì shǒuduàn, héxīn háishi 'jiǎnghǎo wénwù bèihòu de gùshi'. Dāng guānzhòng bùjǐn néng fàngdà kànqīng qīngtóngqì shàng de míngwén, hái néng tīngdǒng gōngjiàng dāngnián de shēnghuó jìngyù yǔ shěnměi zhuīqiú, lìshǐ cái suàn zhēnzhèng huó le qǐlái.",
        "audioVi": "Người dẫn chương trình: Thưa Giám đốc Trần, nhiều bảo tàng đều làm trưng bày cổ vật ba chiều trực tuyến, làm sao tránh tình trạng 'kỹ thuật rất bắt mắt nhưng không giữ chân được khán giả'? Giám đốc Trần: Kỹ thuật mãi chỉ là phương tiện, cốt lõi vẫn là 'kể hay câu chuyện đằng sau cổ vật'. Khi khán giả không chỉ phóng to xem rõ chữ khắc trên đồ đồng thanh mà còn hiểu được hoàn cảnh sống và khát vọng thẩm mỹ của nghệ nhân năm xưa, lịch sử mới thực sự sống dậy.",
        "opts": [
          "Đầu tư kính thực tế ảo đắt tiền nhất cho mọi khách tham quan",
          "Truyền tải sâu sắc câu chuyện văn hóa và con người đằng sau hiện vật",
          "Giảm bớt phần thuyết minh chữ viết để màn hình trống thoáng hơn",
          "Chỉ trưng bày những bảo vật bằng vàng bạc có giá trị thương mại cao"
        ],
        "ans": 1,
        "exp": "Bà Trần khẳng định kỹ thuật chỉ là phương tiện, cốt lõi là kể câu chuyện đằng sau cổ vật ('讲好文物背后的故事')."
      },
      {
        "id": "m6_1_l5",
        "partLabel": "Phần 1 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe trích đoạn phỏng vấn và trả lời: Chuyên gia năng lượng cảnh báo rủi ro nào khi chuyển đổi sang năng lượng tái tạo?",
        "statement": "",
        "statementPy": "",
        "audioZh": "主持人：风电和光伏成本大幅下降，是否意味着很快就能完全替代传统电网结构？ 专家：可再生能源最大的挑战在于间歇性与不稳定性——风停了、阴天了，发电量就会骤降。因此，加快配套储能电站建设与智能电网调度，比单纯盲目扩建发电装机容量更为紧迫。",
        "audioPy": "Zhǔchírén: Fēngdiàn hé guāngfú chéngběn dàfú xiàjiàng, shìfǒu yìwèizhe hěn kuài jiù néng wánquán tìdài chuántǒng diànwǎng jiégòu? Zhuānjiā: Kězàishēng néngyuán zuìdà de tiǎozhàn zàiyú jiànxiēxìng yǔ bù wěndìngxìng——fēng tíng le, yīntiān le, fādiànliàng jiù huì zhòujiàng. Yīncǐ, jiākuài pèitào chǔnéng diànzhàn jiànshè yǔ zhìnéng diànwǎng diàodù, bǐ dānchún mángmù kuòjiàn fādiàn zhuāngjī róngliàng gèng wéi jǐnpò.",
        "audioVi": "Người dẫn chương trình: Chi phí điện gió và điện mặt trời giảm mạnh, phải chăng đồng nghĩa với việc sắp có thể thay thế hoàn toàn kết cấu lưới điện truyền thống? Chuyên gia: Thách thức lớn nhất của năng lượng tái tạo nằm ở tính gián đoạn và thiếu ổn định — gió ngừng thổi, trời âm u là sản lượng điện tụt mạnh ngay. Do đó, đẩy nhanh xây dựng trạm tích trữ năng lượng đồng bộ và điều độ lưới điện thông minh còn cấp bách hơn việc chỉ mở rộng công suất lắp đặt một cách mù quáng.",
        "opts": [
          "Chi phí lắp đặt pin mặt trời vẫn đang tăng liên tục mỗi năm",
          "Tính gián đoạn phụ thuộc thời tiết nên cần đồng bộ hệ thống lưu trữ và điều độ thông minh",
          "Năng lượng gió gây ô nhiễm tiếng ồn nghiêm trọng cho các đại dương",
          "Điện mặt trời không thể truyền tải qua đường dây cao thế"
        ],
        "ans": 1,
        "exp": "Chuyên gia chỉ ra thách thức '间歇性与不稳定性' (tính gián đoạn và bất ổn) và nhấn mạnh nhu cầu trạm lưu trữ + điều độ lưới điện thông minh."
      },
      {
        "id": "m6_1_l6",
        "partLabel": "Phần 2 • Bình luận học thuật",
        "type": "mcq",
        "prompt": "Nghe đoạn bình luận và trả lời: Nguyên lý 'cửa sổ vỡ' nhấn mạnh bài học quản lý nào?",
        "statement": "",
        "statementPy": "",
        "audioZh": "社会心理学中的“破窗效应”告诉我们：如果一栋建筑的一扇窗户被打破却无人修补，很快就会引来更多窗户被恶意破坏。同样，在一个组织或社区里，对微小违规行为的纵容，往往会慢慢侵蚀整体规则的严肃性，最终酿成难以收拾的混乱。防微杜渐，才是治理的根本。",
        "audioPy": "Shèhuì xīnlǐxué zhōng de 'Pòchuāng Xiàoyìng' gàosu wǒmen: rúguǒ yí dòng jiànzhù de yí shàn chuānghu bèi dǎpò què wúrén xiūbǔ, hěn kuài jiù huì yǐnlái gèng duō chuānghu bèi èyì pòhuài. Tóngyàng, zài yí ge zǔzhī huò shèqū lǐ, duì wēixiǎo wéiguī xíngwéi de zòngróng, wǎngwǎng huì mànmàn qīnshí zhěngtǐ guīzé de yánsùxìng, zuìzhōng niàngchéng nányǐ shōushí de hùnluàn. Fángwēi-dùjiàn, cái shì zhìlǐ de gēnběn.",
        "audioVi": "Hiệu ứng 'cửa sổ vỡ' trong tâm lý học xã hội cho ta biết: nếu một ô cửa sổ của tòa nhà bị đập vỡ mà không ai sửa, chẳng bao lâu sẽ dẫn tới nhiều ô cửa khác bị phá hoại ác ý. Tương tự, trong một tổ chức hoặc cộng đồng, sự dung túng cho hành vi vi phạm nhỏ nhặt thường sẽ dần xói mòn tính nghiêm minh của toàn bộ quy tắc, cuối cùng gây ra hỗn loạn khó vãn hồi. Phòng ngừa từ mầm mống nhỏ mới là gốc rễ của quản trị.",
        "opts": [
          "Chỉ cần tập trung xử lý các vụ vi phạm đặc biệt nghiêm trọng",
          "Phải chấn chỉnh ngay từ những sai phạm nhỏ để giữ kỷ cương chung",
          "Nên thay thế toàn bộ cửa kính tòa nhà bằng vật liệu chống vỡ",
          "Quy tắc càng lỏng lẻo thì nhân viên càng phát huy sự sáng tạo"
        ],
        "ans": 1,
        "exp": "Đoạn bình luận kết luận bằng thành ngữ '防微杜渐' (phòng ngay từ khi sai sót còn nhỏ), tránh dung túng lỗi nhỏ gây xói mòn quy tắc."
      },
      {
        "id": "m6_1_l7",
        "partLabel": "Phần 2 • Bình luận học thuật",
        "type": "mcq",
        "prompt": "Nghe đoạn bình luận và trả lời: Vì sao lịch sử khoa học luôn trân trọng cả những thí nghiệm thất bại?",
        "statement": "",
        "statementPy": "",
        "audioZh": "公众阅读科学史时，目光往往只聚焦于成功的那一瞬间，却忽略了无数次沉默的试错。事实上，科学探索的本质就是在未知的黑暗中绘制地图，每一次被证伪的假设，都帮后人排除了一条死胡同，缩小了真理隐藏的范围。从这个意义上讲，诚实记录并公开失败数据，本身就是宝贵的学术贡献。",
        "audioPy": "Gōngzhòng yuèdú kēxuéshǐ shí, mùguāng wǎngwǎng zhǐ jùjiāo yú chénggōng de nà yí shùnjiān, què hūlüè le wúshù cì chénmò de shìcuò. Shìshíshàng, kēxué tànsuǒ de běnzhì jiùshì zài wèizhī de hēi'àn zhōng huìzhì dìtú, měi yí cì bèi zhèngwěi de jiǎshè, dōu bāng hòurén páichú le yì tiáo sǐhútòng, suōxiǎo le zhēnlǐ yǐncáng de fànwéi. Cóng zhège yìyì shàng jiǎng, chéngshí jìlù bìng gōngkāi shībài shùjù, běnshēn jiùshì bǎoguì de xuéshù gòngxiàn.",
        "audioVi": "Khi công chúng đọc lịch sử khoa học, ánh nhìn thường chỉ tập trung vào khoảnh khắc thành công mà bỏ quên vô số lần thử sai thầm lặng. Thực tế, bản chất của khám phá khoa học là vẽ bản đồ trong màn đêm chưa biết; mỗi giả thuyết bị bác bỏ đều giúp người đi sau loại trừ một ngõ cụt, thu hẹp phạm vi nơi chân lý ẩn giấu. Xét theo nghĩa đó, ghi chép trung thực và công bố dữ liệu thất bại tự thân đã là đóng góp học thuật quý báu.",
        "opts": [
          "Vì thí nghiệm thất bại giúp tiết kiệm toàn bộ kinh phí nghiên cứu",
          "Vì chúng loại bỏ các hướng đi sai và thu hẹp phạm vi tìm ra chân lý",
          "Vì các tạp chí khoa học chỉ thích đăng bài viết về thất bại",
          "Vì nhà khoa học không cần kiểm chứng lại các giả thuyết cũ"
        ],
        "ans": 1,
        "exp": "Mỗi giả thuyết bị chứng minh sai giúp '排除了一条死胡同，缩小了真理隐藏的范围' (loại trừ một ngõ cụt, thu hẹp phạm vi tìm chân lý)."
      },
      {
        "id": "m6_1_l8",
        "partLabel": "Phần 2 • Bình luận học thuật",
        "type": "mcq",
        "prompt": "Nghe đoạn bình luận và trả lời: Hiện tượng 'người tiêu dùng tự mâu thuẫn' trong tiêu dùng xanh phản ánh điều gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "一项针对环保消费的调查显示，超过八成受访者声称愿意支持绿色低碳产品，但在实际付款时，真正持续购买的却不足三成。这种“态度与行动的落差”说明，仅仅依靠道德呼吁远远不够，只有当环保产品在价格、便利度与使用体验上真正具备竞争力，绿色消费才能从口号变成日常。",
        "audioPy": "Yí xiàng zhēnduì huánbǎo xiāofèi de diàochá xiǎnshì, chāoguò bāchéng shòufǎngzhě shēngchēng yuànyì zhīchí lǜsè dītàn chǎnpǐn, dàn zài shíjì fùkuǎn shí, zhēnzhèng chíxù gòumǎi de què bùzú sānchéng. Zhè zhǒng 'tàidù yǔ xíngdòng de luòchā' shuōmíng, jǐnjǐn yīkào dàodé hūyù yuǎnyuǎn búgòu, zhǐyǒu dāng huánbǎo chǎnpǐn zài jiàgé, biànlìdù yǔ shǐyòng tǐyàn shàng zhēnzhèng jùbèi jìngzhēnglì, lǜsè xiāofèi cái néng cóng kǒuhào biànchéng rìcháng.",
        "audioVi": "Một khảo sát về tiêu dùng bảo vệ môi trường cho thấy hơn 80% người được hỏi tuyên bố sẵn sàng ủng hộ sản phẩm xanh phát thải thấp, nhưng khi thanh toán thực tế, tỷ lệ mua bền vững chưa tới 30%. Khoảng cách giữa 'thái độ và hành động' này chứng tỏ chỉ dựa vào kêu gọi đạo đức là chưa đủ; chỉ khi sản phẩm thân thiện môi trường thực sự có sức cạnh tranh về giá cả, độ tiện lợi và trải nghiệm sử dụng thì tiêu dùng xanh mới biến từ khẩu hiệu thành thói quen thường nhật.",
        "opts": [
          "Người tiêu dùng hoàn toàn không quan tâm đến vấn đề môi trường",
          "Sản phẩm xanh cần cạnh tranh về giá, sự tiện lợi và trải nghiệm chứ không chỉ kêu gọi đạo đức",
          "Nên cấm bán toàn bộ sản phẩm không có nhãn xanh trên thị trường",
          "Khảo sát xã hội học không phản ánh được bất kỳ xu hướng nào"
        ],
        "ans": 1,
        "exp": "Đoạn bình luận chỉ ra khoảng cách thái độ-hành động chứng minh kêu gọi đạo đức chưa đủ, sản phẩm xanh phải cạnh tranh về '价格、便利度与使用体验'."
      },
      {
        "id": "m6_1_l9",
        "partLabel": "Phần 2 • Bình luận học thuật",
        "type": "mcq",
        "prompt": "Nghe đoạn bình luận và trả lời: Tác giả nhận xét thế nào về cảm giác 'thời gian trôi nhanh hơn' khi trưởng thành?",
        "statement": "",
        "statementPy": "",
        "audioZh": "为什么人越长大，越觉得一年过得飞快？神经科学认为，这与大脑处理“新鲜刺激”的方式密切相关。童年时一切都是未知，大脑必须记录大量细节，因此主观时间显得格外漫长；而成年后生活陷入重复的惯性轨道，大脑自动开启“省电模式”，留下的记忆节点寥寥无几，回首时便觉得光阴似箭。",
        "audioPy": "Wèishénme rén yuè zhǎngdà, yuè juéde yì nián guò de fēikuài? Shénjīng kēxué rènwéi, zhè yǔ dànǎo chǔlǐ 'xīnxiān cìjī' de fāngshì mìqiè xiāngguān. Tóngnián shí yíqiè dōu shì wèizhī, dànǎo bìxū jìlù dàliàng xìjié, yīncǐ zhǔguān shíjiān xiǎnde géwài màncháng; ér chéngnián hòu shēnghuó xiànrù chóngfù de guànxìng guǐdào, dànǎo zìdòng kāiqǐ 'shěngdiàn móshì', liúxià de jìyì jiédiǎn liáoliáo-wújǐ, huíshǒu shí biàn juéde guāngyīn-sìjiàn.",
        "audioVi": "Vì sao con người càng lớn càng thấy một năm trôi qua nhanh như bay? Khoa học thần kinh cho rằng điều này liên quan mật thiết tới cách não xử lý 'kích thích mới mẻ'. Thời thơ ấu mọi thứ đều mới lạ, não bộ phải ghi chép vô số chi tiết nên thời gian chủ quan trở nên dài đằng đẵng; còn khi trưởng thành, cuộc sống rơi vào quỹ đạo thói quen lặp lại, não tự động bật 'chế độ tiết kiệm điện', để lại lác đác vài mốc ký ức nên ngoảnh lại thấy thời gian như tên bay.",
        "opts": [
          "Do nhịp đồng hồ sinh học của người lớn chạy nhanh hơn trẻ em",
          "Do cuộc sống lặp lại ít trải nghiệm mới nên não ghi lại ít dấu mốc ký ức",
          "Do người trưởng thành ngủ nhiều giờ hơn trẻ em mỗi ngày",
          "Do áp lực công việc khiến người lớn quên mất khái niệm ngày tháng"
        ],
        "ans": 1,
        "exp": "Cuộc sống lặp lại ('重复的惯性轨道') khiến não ghi lại ít điểm ký ức ('记忆节点寥寥无几'), tạo cảm giác thời gian trôi nhanh."
      },
      {
        "id": "m6_1_l10",
        "partLabel": "Phần 2 • Bình luận học thuật",
        "type": "mcq",
        "prompt": "Nghe đoạn bình luận và trả lời: Theo người nói, giá trị cốt lõi của việc đi du lịch văn hóa chiều sâu là gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "真正富有价值的文化旅行，从来不是拿着清单在网红景点前拍照证明“到此一游”，而是一次打破自身认知边界的契机。当你带着谦卑与好奇走进另一种生活方式，理解那些看似陌生的风俗背后所蕴含的生存逻辑时，你不仅看见了更广阔的世界，也反过来更清晰地认识了自己。",
        "audioPy": "Zhēnzhèng fùyǒu jiàzhí de wénhuà lǚxíng, cónglái bú shì ná zhe qīngdān zài wǎnghóng jǐngdiǎn qián pāizhào zhèngmíng 'dào cǐ yì yóu', érshì yí cì dǎpò zìshēn rènzhī biānjiè de qìjī. Dāng nǐ dài zhe qiānbēi yǔ hàoqí zǒujìn lìng yì zhǒng shēnghuó fāngshì, lǐjiě nàxiē kànsì mòshēng de fēngsú bèihòu suǒ yùnhán de shēngcún luójí shí, nǐ bùjǐn kànjiàn le gèng guǎngkuò de shìjiè, yě fǎnguòlái gèng qīngxī de rènshi le zìjǐ.",
        "audioVi": "Chuyến du lịch văn hóa thực sự có giá trị xưa nay không phải cầm danh sách chụp ảnh trước các điểm nổi tiếng trên mạng để chứng minh 'đã từng tới đây', mà là cơ hội phá vỡ ranh giới nhận thức của bản thân. Khi bạn mang theo sự khiêm nhường và tò mò bước vào một lối sống khác, thấu hiểu logic sinh tồn ẩn sau những phong tục tưởng chừng xa lạ, bạn không chỉ nhìn thấy thế giới rộng lớn hơn mà còn soi chiếu lại để hiểu rõ chính mình hơn.",
        "opts": [
          "Chụp thật nhiều ảnh ở các điểm nổi tiếng để chia sẻ với bạn bè",
          "Mở rộng giới hạn nhận thức, thấu hiểu nền văn hóa khác và hiểu rõ bản thân hơn",
          "Mua sắm đặc sản địa phương với giá rẻ nhất có thể",
          "Trải nghiệm mọi khách sạn sang trọng nhất ở các quốc gia"
        ],
        "ans": 1,
        "exp": "Đoạn bình luận nhấn mạnh du lịch chiều sâu giúp '打破自身认知边界' (phá vỡ giới hạn nhận thức), hiểu văn hóa khác và hiểu rõ chính mình."
      }
    ],
    "reading": [
      {
        "id": "m6_1_r1",
        "partLabel": "Phần 1 • Tìm câu bệnh ngữ (找病句)",
        "kind": "error",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn câu mắc lỗi ngữ pháp hoặc diễn đạt sai (找病句):",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "通过这次深入基层的调研，使年轻干部们对群众的实际需求有了更直观的认识。",
          "经过连续三个月的反复试验，科研团队终于攻克了这项困扰行业多年的技术难题。",
          "无论面对多么复杂的国际形势，我们都应当保持战略定力，稳步推进各项改革。",
          "这座建于明代的古桥历经数百年风雨侵蚀，至今依然巍然屹立在江面之上。"
        ],
        "ans": 0,
        "exp": "Đáp án sai ngữ pháp: A (Thiếu chủ ngữ — 成分残缺). Dùng đồng thời giới từ '通过……' và động từ sai khiến '使……' làm toàn câu mất chủ ngữ. Cần bỏ '通过' hoặc bỏ '使'.\n• Dịch câu A (đã sửa): Qua đợt khảo sát thực tế cơ sở lần này, các cán bộ trẻ đã có nhận thức trực quan hơn về nhu cầu thực tế của người dân."
      },
      {
        "id": "m6_1_r2",
        "partLabel": "Phần 1 • Tìm câu bệnh ngữ (找病句)",
        "kind": "error",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn câu mắc lỗi ngữ pháp hoặc diễn đạt sai (找病句):",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "为了避免今后不再发生类似的安全事故，学校全面升级了实验室的防火设施。",
          "能否培养起良好的自主学习习惯，是决定学生高中阶段成绩提升的关键因素。",
          "随着人工智能技术的不断普及，许多传统岗位的技能要求正在发生深刻变化。",
          "这位作家笔下的人物形象鲜明生动，寥寥数语便能勾勒出人物复杂的内心世界。"
        ],
        "ans": 0,
        "exp": "Đáp án sai ngữ pháp: A (Phủ định thừa / ngược nghĩa — 否定不当). '避免' (tránh) bản thân đã mang nghĩa phủ định, đi với '不再' thành phủ định kép ('tránh không xảy ra nữa' = mong nó xảy ra). Cần bỏ '不'.\n• Dịch câu A (đã sửa): Để tránh tái diễn sự cố an toàn tương tự trong tương lai, nhà trường đã nâng cấp toàn diện thiết bị phòng cháy của phòng thí nghiệm."
      },
      {
        "id": "m6_1_r3",
        "partLabel": "Phần 1 • Tìm câu bệnh ngữ (找病句)",
        "kind": "error",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn câu mắc lỗi ngữ pháp hoặc diễn đạt sai (找病句):",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "新出台的政策不仅降低了小微企业的税收负担，还为其融资提供了便利渠道。",
          "图书馆在改建过程中充分保留了原有的砖木结构，力求延续历史风貌。",
          "近年来，我国的粮食产量和农业科技水平都有了大幅度的提高和改善。",
          "在激烈的市场竞争中，企业唯有不断增强自主创新能力，才能立于不败之地。"
        ],
        "ans": 2,
        "exp": "Đáp án sai ngữ pháp: C (Kết hợp không tương xứng — 搭配不当). '粮食产量' (sản lượng lương thực) chỉ có thể '提高' (nâng cao), không đi với '改善' (cải thiện); hơn nữa hai chủ ngữ ghép với hai động từ gây lệch phối hợp. Nên tách thành '粮食产量大幅提高，农业科技水平显著改善'.\n• Dịch câu C (đã sửa): Những năm gần đây, sản lượng lương thực và trình độ khoa học công nghệ nông nghiệp của nước ta đều có bước nâng cao và cải thiện rõ rệt."
      },
      {
        "id": "m6_1_r4",
        "partLabel": "Phần 2 • Điền từ học thuật vào chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ thích hợp điền vào chỗ trống: 古人读书讲究“熟读精思”，只有反复咀嚼文字背后的深意，才能真正做到______，将其化为己用。",
        "qPy": "Gǔrén dúshū jiǎngjiu 'shúdú jīngsī', zhǐyǒu fǎnfù jǔjué wénzì bèihòu de shēnyì, cái néng zhēnzhèng zuòdào ______, jiāng qí huàwéi jǐyòng.",
        "orderItems": [],
        "opts": [
          "融会贯通",
          "走马观花",
          "断章取义",
          "墨守成规"
        ],
        "ans": 0,
        "exp": "Đáp án đúng: A. 融会贯通 (rónghuì-guàntōng — dung hội quán thông, thấu hiểu toàn diện và vận dụng linh hoạt). B: cưỡi ngựa xem hoa, C: cắt xén câu chữ hiểu sai ý, D: bảo thủ rập khuôn."
      },
      {
        "id": "m6_1_r5",
        "partLabel": "Phần 2 • Điền từ học thuật vào chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ thích hợp điền vào chỗ trống: 面对海量真假难辨的网络信息，保持独立思考与审慎态度，有助于我们______误导，做出理性判断。",
        "qPy": "Miànduì hǎiliàng zhēnjiǎ-nánbiàn de wǎngluò xìnxī, bǎochí dúlì sīkǎo yǔ shěnshèn tàidù, yǒuzhùyú wǒmen ______ wùdǎo, zuòchū lǐxìng pànduàn.",
        "orderItems": [],
        "opts": [
          "抵御",
          "迎合",
          "渲染",
          "加剧"
        ],
        "ans": 0,
        "exp": "Đáp án đúng: A. 抵御 (dǐyù — chống lại, kháng cự trước tác động xấu). Cụm chuẩn HSK 6: '抵御误导' (chống lại sự dẫn dắt sai lệch). B: chiều lòng, C: tô vẽ phóng đại, D: làm trầm trọng thêm."
      },
      {
        "id": "m6_1_r6",
        "partLabel": "Phần 3 • Điền câu vào đoạn văn (选句填空)",
        "kind": "insert",
        "passageZh": "在探讨城市发展时，人们往往将目光投向高楼大厦与交通枢纽等“硬实力”。然而，真正决定一座城市吸引力与生命力的，往往是其看不见的文化底蕴与公共精神。（ ______ ）。正是这些润物无声的细节，让外来者产生归属感，也让本地人引以为傲。",
        "passagePy": "Zài tàntǎo chéngshì fāzhǎn shí, rénmen wǎngwǎng jiāng mùguāng tóuxiàng gāolóu-dàshà yǔ jiāotōng shūniǔ děng 'yìng shílì'. Rán'ér, zhēnzhèng juédìng yí zuò chéngshì xīyǐnlì yǔ shēngmìnglì de, wǎngwǎng shì qí kàn bu jiàn de wénhuà dǐyùn yǔ gōnggòng jīngshén. ( ______ ). Zhèng shì zhèxiē rùnwù-wúshēng de xìjié, ràng wàiláizhě chǎnshēng guīshǔgǎn, yě ràng běndìrén yǐn yǐ wéi ào.",
        "passageVi": "Khi bàn về phát triển đô thị, người ta thường hướng ánh nhìn vào 'thực lực cứng' như cao ốc và đầu mối giao thông. Tuy nhiên, thứ thực sự quyết định sức hút và sức sống của một thành phố thường lại là bề dày văn hóa và tinh thần công cộng vô hình. ( ______ ). Chính những chi tiết thấm sâu lặng lẽ ấy khiến người phương xa nảy sinh cảm giác thuộc về, và cũng khiến người bản địa lấy làm tự hào.",
        "q": "Chọn câu thích hợp nhất điền vào chỗ trống （ ______ ） trong đoạn văn trên:",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "街边随处可见的公益书屋、礼让行人的驾驶习惯以及包容开放的社区氛围，共同构成了城市的温度",
          "因此，加大地铁线路和大型商业中心的投资力度依然是当务之急",
          "相比之下，农村地区的自然风光虽然优美，却缺少现代化的医疗设施",
          "很多历史名城在工业化进程中不可避免地拆除了部分传统建筑"
        ],
        "ans": 0,
        "exp": "Đáp án đúng: A. Vế trước nói về '文化底蕴与公共精神' (nền tảng văn hóa và tinh thần công cộng vô hình), vế sau chỉ lại bằng '正是这些润物无声的细节' (chính những chi tiết thầm lặng này). Câu A liệt kê chính xác các chi tiết đó (nhà sách cộng đồng, nhường người đi bộ, không khí cởi mở)."
      },
      {
        "id": "m6_1_r7",
        "partLabel": "Phần 3 • Điền câu vào đoạn văn (选句填空)",
        "kind": "insert",
        "passageZh": "科学研究常常需要跨越漫长的时间跨度，许多基础理论在诞生之初，甚至完全看不到任何商业应用的影子。（ ______ ）。正如电磁感应定律在十九世纪提出时曾被视为纯粹的学术游戏，但百年之后却支撑起了整个人类现代电力文明。",
        "passagePy": "Kēxué yánjiū chángcháng xūyào kuàyuè màncháng de shíjiān kuàdù, xǔduō jīchǔ lǐlùn zài dànshēng zhī chū, shènzhì wánquán kàn bu dào rènhé shāngyè yìngyòng de yǐngzi. ( ______ ). Zhèngrú diàncí gǎnyìng dìnglǜ zài shíjiǔ shìjì tíchū shí céng bèi shìwéi chúncuì de xuéshù yóuxì, dàn bǎinián zhīhòu què zhīchēng qǐ le zhěng ge rénlèi xiàndài diànlì wénmíng.",
        "passageVi": "Nghiên cứu khoa học thường phải vượt qua khoảng thời gian dài đằng đẵng, nhiều lý thuyết nền tảng lúc mới ra đời thậm chí hoàn toàn chưa thấy bóng dáng ứng dụng thương mại nào. ( ______ ). Cũng giống như định luật cảm ứng điện từ khi được đề xuất ở thế kỷ 19 từng bị xem là trò chơi học thuật thuần túy, nhưng trăm năm sau lại nâng đỡ cả nền văn minh điện lực hiện đại của nhân loại.",
        "q": "Chọn câu thích hợp nhất điền vào chỗ trống （ ______ ） trong đoạn văn trên:",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "然而，若因此削减基础学科的经费，无异于为了眼前的果实而砍掉树根",
          "所以高校应当鼓励所有学者转向短期回报较高的应用技术开发",
          "可见，商业赞助才是推动基础物理学突破的唯一动力",
          "不过，现代实验室的仪器精度已经远远超越了十九世纪的水平"
        ],
        "ans": 0,
        "exp": "Đáp án đúng: A. Câu trước nêu lý thuyết nền tảng ban đầu chưa thấy ứng dụng thương mại; câu A chuyển ý khẳng định không thể vì thế mà cắt giảm đầu tư khoa học cơ bản, nối mượt với ví dụ định luật cảm ứng điện từ ở câu sau."
      },
      {
        "id": "m6_1_r8",
        "partLabel": "Phần 4 • Đọc hiểu bài viết chuyên sâu",
        "kind": "mcq",
        "passageZh": "在当代社会，“效率至上”几乎成了一种普遍信仰：吃饭要快餐，读书要“三分钟速览”，连休息也被精确计算。然而，生物进化与人类创造力的规律恰恰相反——许多重大的科学灵感和艺术杰作，往往诞生于看似“无所事事”的漫步、发呆或沉思之中。神经科学研究证实，当大脑不专注于具体任务时，“默认模式网络”反而处于高度活跃状态，负责将零散的记忆与知识进行跨界重组。因此，适度的“留白”与慢思考，并非浪费生命，而是深度创造不可或缺的土壤。",
        "passagePy": "Zài dāngdài shèhuì, 'xiàolǜ zhìshàng' jīhū chéng le yì zhǒng pǔbiàn xìnyǎng: chīfàn yào kuàicān, dúshū yào 'sān fēnzhōng sùlǎn', lián xiūxi yě bèi jīngquè jìsuàn. Rán'ér, shēngwù jìnhuà yǔ rénlèi chuàngzàolì de guīlǜ qiàqià xiāngfǎn——xǔduō zhòngdà de kēxué línggǎn hé yìshù jiézuò, wǎngwǎng dànshēng yú kànsì 'wúsuǒshìshì' de mànbù, fādāi huò chénsī zhīzhōng. Shénjīng kēxué yánjiū zhèngshí, dāng dànǎo bú zhuānzhù yú jùtǐ rènwu shí, 'mòrèn móshì wǎngluò' fǎn'ér chǔyú gāodù huóyuè zhuàngtài, fùzé jiāng língsǎn de jìyì yǔ zhīshi jìnxíng kuàjiè chóngzǔ. Yīncǐ, shìdù de 'liúbái' yǔ màn sīkǎo, bìng fēi làngfèi shēngmìng, érshì shēndù chuàngzào bù kě huòquē de tǔrǎng.",
        "passageVi": "Trong xã hội đương đại, 'hiệu suất tối thượng' gần như trở thành một tín ngưỡng phổ quát: ăn uống phải đồ ăn nhanh, đọc sách phải 'tóm tắt trong ba phút', ngay cả nghỉ ngơi cũng bị tính toán chính xác. Tuy nhiên, quy luật tiến hóa sinh học và sức sáng tạo của nhân loại lại hoàn toàn ngược lại — nhiều cảm hứng khoa học trọng đại và kiệt tác nghệ thuật thường ra đời trong những lúc đi dạo, thả hồn hay trầm tư tưởng chừng 'chẳng làm gì'. Nghiên cứu khoa học thần kinh chứng thực rằng khi não bộ không tập trung vào nhiệm vụ cụ thể, 'mạng lưới chế độ mặc định' ngược lại ở trạng thái hoạt động cao, phụ trách tái cấu trúc liên kết ký ức và kiến thức rời rạc. Do đó, 'khoảng lặng' vừa phải và tư duy chậm không phải lãng phí cuộc đời, mà là mảnh đất không thể thiếu của sáng tạo chiều sâu.",
        "q": "Theo nghiên cứu khoa học thần kinh trong bài, điều gì xảy ra khi não không tập trung vào nhiệm vụ cụ thể?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Toàn bộ hoạt động thần kinh ngừng trệ để tiết kiệm năng lượng",
          "'Mạng lưới chế độ mặc định' hoạt động mạnh để tái kết hợp ký ức và tri thức",
          "Khả năng sáng tạo nghệ thuật giảm xuống mức thấp nhất trong ngày",
          "Con người dễ rơi vào trạng thái lo âu và mất ngủ kéo dài"
        ],
        "ans": 1,
        "exp": "Đoạn văn nêu rõ: khi não không tập trung vào nhiệm vụ cụ thể, '默认模式网络' hoạt động cao để tái tổ hợp ký ức và tri thức rời rạc ('将零散的记忆与知识进行跨界重组')."
      },
      {
        "id": "m6_1_r9",
        "partLabel": "Phần 4 • Đọc hiểu bài viết chuyên sâu",
        "kind": "mcq",
        "passageZh": "人类对海洋的探索至今仍远不如对月球表面的了解。深海高压、漆黑且低温的极端环境，长期阻碍着科研设备的下潜。然而，正是在这片看似荒芜的深渊热液喷口周围，科学家发现了无需依赖阳光、仅靠化能合成维生的奇特生态系统。这一发现不仅颠覆了传统生物学对“生命必须依靠光合作用”的固有认知，也为人类寻找地外生命提供了全新的思路——在木卫二或土卫二的冰下海洋中，或许同样孕育着不为人知的生命形态。",
        "passagePy": "Rénlèi duì hǎiyáng de tànsuǒ zhìjīn réng yuǎn bùrú duì yuèqiú biǎomiàn de liǎojiě. Shēnhǎi gāoyā, qīhēi qiě dīwēn de jíduān huánjìng, chángqī zǔ'ài zhe kēyán shèbèi de xiàqián. Rán'ér, zhèng shì zài zhè piàn kànsì huāngwú de shēnyuān rèyè pēnkǒu zhōuwéi, kēxuéjiā fāxiàn le wúxū yīlài yángguāng, jǐn kào huànéng héchéng wéishēng de qítè shēngtàixìtǒng. Zhè yì fāxiàn bùjǐn diānfù le chuántǒng shēngwùxué duì 'shēngmìng bìxū yīkào guānghé zuòyòng' de gùyǒu rènzhī, yě wèi rénlèi xúnzhǎo dìwài shēngmìng tígōng le quánxīn de sīlù——zài Mùwèi'èr huò Tǔwèi'èr de bīngxià hǎiyáng zhōng, huòxǔ tóngyàng yùnyù zhe bù wéi rén zhī de shēngmìng xíngtài.",
        "passageVi": "Sự khám phá của nhân loại đối với đại dương đến nay vẫn thua xa hiểu biết về bề mặt Mặt Trăng. Môi trường cực đoan áp suất cao, tối đen và nhiệt độ thấp ở biển sâu lâu nay cản trở thiết bị khoa học lặn xuống. Thế nhưng, chính xung quanh các miệng phun thủy nhiệt ở vực sâu tưởng chừng hoang vu ấy, các nhà khoa học đã phát hiện hệ sinh thái kỳ lạ không cần dựa vào ánh sáng mặt trời, chỉ sống nhờ tổng hợp hóa năng. Phát hiện này không chỉ đảo lộn nhận thức cố hữu của sinh học truyền thống rằng 'sự sống bắt buộc phải dựa vào quang hợp', mà còn mở ra hướng tư duy hoàn toàn mới cho nhân loại khi tìm kiếm sự sống ngoài Trái Đất — trong đại dương dưới lớp băng của vệ tinh sao Mộc hay sao Thổ, biết đâu cũng đang thai nghén những dạng sống chưa từng được biết tới.",
        "q": "Ý nghĩa khoa học lớn nhất của việc phát hiện hệ sinh thái quanh miệng phun thủy nhiệt biển sâu là gì?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Chứng minh sinh vật biển sâu có thể sống hoàn toàn không cần nước",
          "Phá bỏ định kiến mọi sự sống đều cần ánh nắng quang hợp và gợi mở hướng tìm sự sống ngoài hành tinh",
          "Giúp con người khai thác khoáng sản dưới đáy biển dễ dàng hơn trên đất liền",
          "Khẳng định bề mặt Mặt Trăng từng có hệ sinh thái đại dương tương tự"
        ],
        "ans": 1,
        "exp": "Đoạn văn nêu hai ý nghĩa: đảo lộn nhận thức sự sống phải dựa vào quang hợp ('颠覆了……固有认知') và mở ra hướng mới tìm sự sống ngoài Trái Đất ('为寻找地外生命提供了全新思路')."
      },
      {
        "id": "m6_1_r10",
        "partLabel": "Phần 4 • Đọc hiểu bài viết chuyên sâu",
        "kind": "mcq",
        "passageZh": "在翻译理论中，“直译”与“意译”的争论持续了数百年。过分拘泥于原文的词序和句式，译文往往生硬晦涩，令读者如坠云雾；反之，若脱离文本肆意发挥，又容易丧失原作独特的文化气息与修辞风貌。真正高明的译者，懂得在两种语言之间架起桥梁：既忠实传递原著的精神内核与逻辑脉络，又巧妙化解文化意象的隔阂，使译作在保持“异域韵味”的同时，读来如母语般自然流畅。",
        "passagePy": "Zài fānyì lǐlùn zhōng, 'zhíyì' yǔ 'yìyì' de zhēnglùn chíxù le shùbǎi nián. Guòfèn jūnì yú yuánwén de cíxù hé jùshì, yìwén wǎngwǎng shēngyìng huìsè, lìng dúzhě rú zhuì yúnwù; fǎnzhī, ruò tuōlí wénběn sìyì fāhuī, yòu róngyì sàngshī yuánzuò dútè de wénhuà qìxī yǔ xiūcí fēngmào. Zhēnzhèng gāomíng de yìzhě, dǒngde zài liǎng zhǒng yǔyán zhījiān jiàqǐ qiáoliáng: jì zhōngshí chuándì yuánzhù de jīngshén nèihé yǔ luójí màiluò, yòu qiǎomiào huàjiě wénhuà yìxiàng de géhé, shǐ yìzuò zài bǎochí 'yìyù yùnwèi' de tóngshí, dúlái rú mǔyǔ bān zìrán liúchàng.",
        "passageVi": "Trong lý thuyết dịch thuật, cuộc tranh luận giữa 'dịch sát chữ' và 'dịch thoát ý' đã kéo dài hàng trăm năm. Quá câu nệ trật tự từ và cấu trúc câu nguyên tác thì bản dịch thường cứng nhắc tối nghĩa, khiến người đọc như lạc vào sương mù; ngược lại, nếu rời xa văn bản mà phóng tác tùy tiện lại dễ đánh mất hơi thở văn hóa và phong thái tu từ độc đáo của nguyên tác. Dịch giả thực sự cao tay biết bắc cây cầu giữa hai ngôn ngữ: vừa truyền tải trung thành hạt nhân tinh thần và mạch logic của tác phẩm gốc, vừa khéo léo hóa giải rào cản hình tượng văn hóa, giúp bản dịch vừa giữ được 'dư vị dị vực' vừa đọc tự nhiên trôi chảy như tiếng mẹ đẻ.",
        "q": "Theo tác giả, một dịch giả xuất sắc cần đạt được sự cân bằng nào?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Luôn ưu tiên giữ nguyên từng dấu câu và trật tự từ của văn bản gốc",
          "Tự do thay đổi nội dung cốt truyện để phù hợp hoàn toàn với thị hiếu độc giả mới",
          "Vừa trung thành tinh thần và nét văn hóa nguyên tác, vừa diễn đạt trôi chảy tự nhiên",
          "Lược bỏ toàn bộ thành ngữ và hình ảnh văn hóa đặc trưng của ngôn ngữ nguồn"
        ],
        "ans": 2,
        "exp": "Câu cuối mô tả dịch giả cao tay kết hợp hài hòa hai mặt: trung thành tinh thần nguyên tác, giữ dư vị văn hóa ('保持异域韵味') và tự nhiên như tiếng mẹ đẻ ('自然流畅')."
      }
    ],
    "writing": [
      {
        "id": "m6_1_w1",
        "partLabel": "Phần 1 • Sắp xếp câu học thuật",
        "type": "reorder",
        "words": [
          "却为",
          "虽然",
          "这项改革",
          "长远发展",
          "引发了争议",
          "奠定了基础",
          "在短期内"
        ],
        "answer": "这项改革在短期内虽然引发了争议却为长远发展奠定了基础。",
        "py": "Zhè xiàng gǎigé zài duǎnqī nèi suīrán yǐnfā le zhēngyì què wèi chángyuǎn fāzhǎn diàndìng le jīchǔ.",
        "vi": "Cuộc cải cách này tuy gây ra tranh cãi trong ngắn hạn nhưng đã đặt nền móng cho sự phát triển lâu dài.",
        "exp": "Cấu trúc tương phản chuẩn HSK 6: Chủ ngữ '这项改革' + thời gian '在短期内' + '虽然……却……' + cụm kết hợp '为……奠定了基础' (đặt nền móng cho...)."
      },
      {
        "id": "m6_1_w2",
        "partLabel": "Phần 1 • Sắp xếp câu học thuật",
        "type": "reorder",
        "words": [
          "把理论知识",
          "才能",
          "只有",
          "紧密结合",
          "我们",
          "真正发挥作用",
          "与社会实践"
        ],
        "answer": "我们只有把理论知识与社会实践紧密结合才能真正发挥作用。",
        "py": "Wǒmen zhǐyǒu bǎ lǐlùn zhīshi yǔ shèhuì shíjiàn jǐnmì jiéhé cái néng zhēnzhèng fāhuī zuòyòng.",
        "vi": "Chúng ta chỉ có kết hợp chặt chẽ kiến thức lý luận với thực tiễn xã hội mới có thể thực sự phát huy tác dụng.",
        "exp": "Cấu trúc điều kiện duy nhất '只有……才……' lồng ghép câu chữ 把: '把 A 与 B 紧密结合' (kết hợp chặt chẽ A với B)."
      },
      {
        "id": "m6_1_w3",
        "partLabel": "Phần 2 • Tóm tắt văn bản (缩写)",
        "type": "essay_summary",
        "title": "Người thợ mộc già và ngôi nhà cuối cùng",
        "readSeconds": 600,
        "sourceTitle": "老木匠的最后一栋房子",
        "sourceZh": "一位技艺精湛的老木匠干了一辈子建筑工作，到了退休的年纪，他向老板提出辞职，希望能回家陪伴家人，安度晚年。老板非常舍不得这位勤恳的老员工，便诚恳地请求他再帮忙建造最后一栋房子。老木匠不好意思拒绝，只好勉强答应下来。然而，在接下来的施工过程中，老木匠的心思早已飞到了退休生活上。他不再像往常那样精益求精，而是开始敷衍了事，不仅选用了较为廉价的普通木材，连门窗接缝处的打磨也十分粗糙。几个月后，房子终于完工了。老板前来验收时，却微笑着把房子的大门钥匙递到老木匠手里，深情地说：“这栋房子，是我送给您这么多年辛勤付出的退休礼物！”老木匠听完瞬间呆住了，满脸羞愧。他万万没有想到，自己最后偷工减料建起来的房子，竟然正是要留给自己下半生居住的家园。",
        "sourcePy": "Yí wèi jìyì jīngzhàn de lǎo mùjiàng gàn le yíbèizi jiànzhù gōngzuò, dào le tuìxiū de niánjì, tā xiàng lǎobǎn tíchū cízhí, xīwàng néng huíjiā péibàn jiārén, āndù wǎnnián. Lǎobǎn fēicháng shěbude zhè wèi qínkěn de lǎo yuángōng, biàn chéngkěn de qǐngqiú tā zài bāngmáng jiànzào zuìhòu yí dòng fángzi. Lǎo mùjiàng bù hǎoyìsi jùjué, zhǐhǎo miǎnqiǎng dāying xiàlái. Rán'ér, zài jiēxiàlái de shīgōng guòchéng zhōng, lǎo mùjiàng de xīnsi zǎoyǐ fēidào le tuìxiū shēnghuó shàng. Tā búzài xiàng wǎngcháng nàyàng jīngyì-qiújīng, érshì kāishǐ fūyǎn-liǎoshì, bùjǐn xuǎnyòng le jiàowéi liánjià de pǔtōng mùcái, lián ménchuāng jiēfèngchù de dǎmó yě shífēn cūcāo. Jǐ ge yuè hòu, fángzi zhōngyú wángōng le. Lǎobǎn qiánlái yànshōu shí, què wēixiào zhe bǎ fángzi de dàmén yàoshi dìdào lǎo mùjiàng shǒulǐ, shēnqíng de shuō: 'Zhè dòng fángzi, shì wǒ sòng gěi nín zhème duō nián xīnqín fùchū de tuìxiū lǐwù!' Lǎo mùjiàng tīngwán shùnjiān dāizhù le, mǎnliǎn xiūkuì. Tā wànwàn méiyǒu xiǎngdào, zìjǐ zuìhòu tōugōng-jiǎnliào jiàn qǐlái de fángzi, jìngrán zhèng shì yào liúgěi zìjǐ xiàbànshēng jūzhù de jiāyuán.",
        "sourceVi": "Một người thợ mộc già tay nghề điêu luyện làm nghề xây dựng cả đời, đến tuổi nghỉ hưu ông xin thôi việc với ông chủ, mong được về nhà bên gia đình an hưởng tuổi già. Ông chủ rất quyến luyến người thợ cần mẫn này bèn chân thành nhờ ông giúp xây nốt ngôi nhà cuối cùng. Người thợ mộc ngại từ chối nên đành miễn cưỡng nhận lời. Thế nhưng trong quá trình thi công sau đó, tâm trí ông lão đã bay theo cuộc sống hưu trí từ lâu. Ông không còn cầu toàn tỉ mỉ như thường lệ nữa mà bắt đầu làm qua loa đại khái, chẳng những chọn loại gỗ thường rẻ tiền hơn mà ngay cả việc mài giũa chỗ tiếp giáp cửa ra vào và cửa sổ cũng hết sức thô sơ. Vài tháng sau, ngôi nhà cuối cùng cũng hoàn thành. Khi ông chủ đến nghiệm thu, ông lại mỉm cười trao chìa khóa cửa chính vào tay người thợ mộc già, xúc động nói: 'Ngôi nhà này là món quà nghỉ hưu tôi tặng ông vì bao năm cống hiến tận tụy!' Người thợ mộc nghe xong lập tức sững sờ, mặt đầy hổ thẹn. Ông chẳng thể ngờ ngôi nhà cuối cùng mình làm ẩu cắt xén vật liệu lại chính là mái ấm dành cho chính bản thân mình sinh sống suốt quãng đời còn lại.",
        "keywords": [
          "退休",
          "建造",
          "敷衍了事",
          "礼物",
          "羞愧"
        ],
        "minChars": 110,
        "targetChars": 180,
        "promptVi": "Đọc kỹ văn bản gốc trong 10 phút (tối đa 600 giây), sau đó ẩn văn bản và tóm tắt lại thành đoạn văn khoảng 140–180 chữ Hán. Lưu ý: giữ đúng mạch truyện ngôi thứ ba, đầy đủ các tình tiết then chốt, tuyệt đối không tự thêm bình luận chủ quan.",
        "sampleZh": "一位老木匠到年龄准备退休时，老板恳请他再帮忙建造最后一栋房子。老木匠勉强答应，但在施工中却心思涣散，不再像从前那样认真，不仅选用了廉价材料，做工也十分敷衍了事。房子完工验收那天，老板微笑着把钥匙交到老木匠手中，表示这是送给他的退休礼物。老木匠听后感到无比羞愧，他没想到自己偷工减料建成的房子，竟成了自己未来的住所。",
        "samplePy": "Yí wèi lǎo mùjiàng dào niánlíng zhǔnbèi tuìxiū shí, lǎobǎn kěnqǐng tā zài bāngmáng jiànzào zuìhòu yí dòng fángzi. Lǎo mùjiàng miǎnqiǎng dāying, dàn zài shīgōng zhōng què xīnsi huànsàn, búzài xiàng cóngqián nàyàng rènzhēn, bùjǐn xuǎnyòng le liánjià cáiliào, zuògōng yě shífēn fūyǎn-liǎoshì. Fángzi wángōng yànshōu nà tiān, lǎobǎn wēixiào zhe bǎ yàoshi jiāodào lǎo mùjiàng shǒuzhōng, biǎoshì zhè shì sòng gěi tā de tuìxiū lǐwù. Lǎo mùjiàng tīng hòu gǎndào wúbǐ xiūkuì, tā méi xiǎngdào zìjǐ tōugōng-jiǎnliào jiànchéng de fángzi, jìng chéng le zìjǐ wèilái de zhùsuǒ.",
        "sampleVi": "Khi một người thợ mộc già đến tuổi chuẩn bị nghỉ hưu, ông chủ khẩn khoản nhờ ông giúp xây nốt ngôi nhà cuối cùng. Người thợ mộc miễn cưỡng nhận lời, nhưng trong lúc thi công lại lơ đãng, không còn tận tâm như trước, chẳng những chọn vật liệu rẻ tiền mà tay nghề cũng vô cùng qua loa. Ngày ngôi nhà hoàn thành nghiệm thu, ông chủ mỉm cười trao chìa khóa vào tay người thợ mộc, bày tỏ đây là món quà nghỉ hưu tặng ông. Người thợ mộc nghe xong cảm thấy vô cùng hổ thẹn, ông không ngờ ngôi nhà mình làm ẩu cắt xén công đoạn lại chính là nơi ở tương lai của bản thân.",
        "exp": "Tóm tắt chuẩn HSK 6: giữ đúng tuyến nhân vật (老木匠, 老板), đủ 4 bước cốt truyện (xin nghỉ & nhận xây nhà cuối -> làm qua loa vật liệu kém -> ông chủ tặng nhà làm quà hưu -> thợ mộc hổ thẹn), giữ ngôi thứ ba khách quan và lồng gọn cả 5 từ khóa cốt lõi."
      }
    ]
  },
  {
    "id": "mock_hsk6_2",
    "level": 6,
    "testNo": 2,
    "badge": "HSK 6 • Đề số 2",
    "title": "Đề Thi Thử HSK 6 — Đề Số 2",
    "subtitle": "23 câu chuẩn thi máy • Nghe (10) • Đọc (10) • Viết (3) • Chủ đề: Di sản & Tư duy phản biện",
    "durationSec": 8100,
    "maxScore": 300,
    "passScore": 180,
    "listening": [
      {
        "id": "m6_2_l1",
        "partLabel": "Phần 1 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe trích đoạn phỏng vấn và trả lời: Nhà nông học đánh giá thế nào về nông nghiệp chính xác?",
        "statement": "",
        "statementPy": "",
        "audioZh": "主持人：有人担心无人机、土壤传感器等智能设备会彻底取代老农的经验，您怎么看？ 农学家：这其实是一种误解。传感器能精确测出每块田地的湿度和养分分布，帮农户告别“大水漫灌”的粗放模式；但什么时候该防范霜冻、如何观察作物长势的细微变化，依然离不开经验丰富的种植者来做最终判断。",
        "audioPy": "Zhǔchírén: Yǒurén dānxīn wúrénjī, tǔrǎng chuángǎnqì děng zhìnéng shèbèi huì chèdǐ qǔdài lǎonóng de jīngyàn, nín zěnme kàn? Nóngxuéjiā: Zhè qíshí shì yì zhǒng wùjiě. Chuángǎnqì néng jīngquè cèchū měi kuài tiándì de shīdù hé yǎngfèn fēnbù, bāng nónghù gàobié 'dàshuǐ mànguàn' de cūfàng móshì; dàn shénme shíhou gāi fángfàn shuāngdòng, rúhé guānchá zuòwù zhǎngshì de xìwēi biànhuà, yīrán lí bu kāi jīngyàn fēngfù de zhòngzhízhě lái zuò zuìzhōng pànduàn.",
        "audioVi": "Người dẫn chương trình: Có người lo ngại thiết bị thông minh như máy bay không người lái, cảm biến đất sẽ thay thế hoàn toàn kinh nghiệm của lão nông, ông nhìn nhận thế nào? Nhà nông học: Đây kỳ thực là một sự hiểu nhầm. Cảm biến có thể đo chính xác độ ẩm và phân bố dinh dưỡng từng thửa ruộng, giúp nông hộ từ bỏ kiểu canh tác thô sơ tưới tràn ngập; nhưng khi nào cần phòng sương giá, quan sát biến chuyển tinh tế của cây trồng ra sao thì vẫn không thể thiếu người trồng giàu kinh nghiệm đưa ra phán đoán cuối cùng.",
        "opts": [
          "Thiết bị cảm biến sẽ thay thế hoàn toàn vai trò của nông dân trong tương lai gần",
          "Công nghệ giúp canh tác chính xác nhưng vẫn cần kinh nghiệm con người quyết định cuối cùng",
          "Nông dân lớn tuổi từ chối sử dụng máy bay không người lái vì chi phí cao",
          "Kiểu tưới tràn truyền thống giúp tiết kiệm nước hơn cảm biến thông minh"
        ],
        "ans": 1,
        "exp": "Nhà nông học khẳng định công nghệ hỗ trợ đo đạc chính xác ('精确测出'), nhưng việc phán đoán thời tiết và sinh trưởng cây trồng vẫn cần người giàu kinh nghiệm."
      },
      {
        "id": "m6_2_l2",
        "partLabel": "Phần 1 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe trích đoạn phỏng vấn và trả lời: Theo bà Lưu, thách thức lớn nhất khi phục chế sách cổ là gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "主持人：修复一本破损严重的古籍，最考验修复师的是哪一步？ 刘老师：选纸和配墨固然讲究“修旧如旧”，但最难的其实是保持内心的定力。有些脆化得像饼干一样的纸页，必须用镊子和毛笔在显微镜下一点点剥离、补缀，哪怕急躁一秒钟，几百年的文物就可能毁在手里。",
        "audioPy": "Zhǔchírén: Xiūfù yì běn pòsǔn yánzhòng de gǔjí, zuì kǎoyàn xiūfùshī de shì nǎ yí bù? Liú lǎoshī: Xuǎnzhǐ hé pèimò gùrán jiǎngjiu 'xiūjiù-rújiù', dàn zuìnán de qíshí shì bǎochí nèixīn de dìnglì. Yǒuxiē cuìhuà de xiàng bǐnggān yíyàng de zhǐyè, bìxū yòng nièzi hé máobǐ zài xiǎnwēijìng xià yìdiǎndiǎn bōlí, bǔzhuì, nǎpà jízào yì miǎozhōng, jǐbǎi nián de wénwù jiù kěnéng huǐ zài shǒulǐ.",
        "audioVi": "Người dẫn chương trình: Phục chế một cuốn sách cổ hư hại nặng, bước nào thử thách nghệ nhân phục chế nhất? Cô Lưu: Chọn giấy và pha mực đương nhiên phải tuân thủ 'tu sửa cũ như cũ', nhưng khó nhất kỳ thực là giữ sự điềm tĩnh nội tâm. Có những trang giấy giòn như bánh quy, buộc phải dùng nhíp và bút lông bóc tách, vá nối từng chút dưới kính hiển vi; dù chỉ nóng vội một giây, cổ vật hàng trăm năm có thể hỏng ngay trong tay.",
        "opts": [
          "Tìm mua đủ loại giấy công nghiệp hiện đại cùng màu sắc",
          "Giữ sự kiên nhẫn và tĩnh tâm tuyệt đối khi thao tác tỉ mỉ",
          "Dịch toàn bộ nội dung chữ cổ sang ngôn ngữ hiện đại",
          "Sử dụng máy quét tốc độ cao để in lại thành bản mới"
        ],
        "ans": 1,
        "exp": "Cô Lưu nhấn mạnh '最难的其实是保持内心的定力' (khó nhất là giữ sự bình tĩnh kiên nhẫn nội tâm), không được nóng vội dù chỉ một giây."
      },
      {
        "id": "m6_2_l3",
        "partLabel": "Phần 1 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe trích đoạn phỏng vấn và trả lời: Chuyên gia đô thị đề xuất nguyên tắc gì khi thiết kế đường đi bộ?",
        "statement": "",
        "statementPy": "",
        "audioZh": "主持人：很多城市修了不少景观大道，可市民平时还是不爱步行，问题出在哪儿？ 设计师：过去规划往往习惯以汽车通行速度为核心，导致人行道窄、遮阴树少、过街天桥绕远路。真正友好的慢行系统，必须站在行人的尺度上考虑连贯性、安全感与遮风避雨的舒适度。",
        "audioPy": "Zhǔchírén: Hěn duō chéngshì xiū le bùshǎo jǐngguān dàdào, kě shìmín píngshí háishi bú ài bùxíng, wèntí chū zài nǎr? Shèjìshī: Guòqù guīhuà wǎngwǎng xíguàn yǐ qìchē tōngxíng sùdù wéi héxīn, dǎozhì rénxíngdào zhǎi, zhēyīnshù shǎo, guòjiē tiānqiáo rào yuǎnlù. Zhēnzhèng yǒuhǎo de mànxíng xìtǒng, bìxū zhàn zài xíngrén de chǐdù shàng kǎolǜ liánguànxìng, ānquángǎn yǔ zhēfēng-bìyǔ de shūshìdù.",
        "audioVi": "Người dẫn chương trình: Nhiều thành phố xây không ít đại lộ cảnh quan, nhưng người dân ngày thường vẫn ngại đi bộ, vấn đề nằm ở đâu? Kiến trúc sư: Quy hoạch trước đây thường quen lấy tốc độ lưu thông ô tô làm trung tâm, dẫn tới vỉa hè hẹp, ít cây bóng mát, cầu vượt sang đường phải đi vòng xa. Hệ thống đi bộ thân thiện thực sự phải đứng từ góc độ người đi bộ để tính đến tính liên hoàn, cảm giác an toàn và độ thoải mái che nắng trú mưa.",
        "opts": [
          "Mở rộng thêm nhiều làn đường cho xe cơ giới chạy nhanh hơn",
          "Thiết kế theo thước đo người đi bộ, đảm bảo liên hoàn, an toàn và thoải mái",
          "Xây dựng nhiều cầu vượt cao tầng ở mọi ngã tư lớn",
          "Cấm đặt ghế nghỉ và cây xanh trên vỉa hè để thông thoáng"
        ],
        "ans": 1,
        "exp": "Kiến trúc sư nêu rõ cần đặt mình vào '行人的尺度' (thước đo người đi bộ), chú trọng tính liên hoàn, an toàn và che nắng mưa."
      },
      {
        "id": "m6_2_l4",
        "partLabel": "Phần 1 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe trích đoạn phỏng vấn và trả lời: Nhà kinh tế học lưu ý điều gì về mô hình 'kinh tế bạc' (phục vụ người cao tuổi)?",
        "statement": "",
        "statementPy": "",
        "audioZh": "主持人：随着老龄化程度加深，越来越多企业看重“银发经济”，您对产品研发有什么建议？ 经济学家：千万别把老年人简化成“只需要治病和买保健品”的群体。如今新一代长者普遍受教育程度较高，他们同样渴望高质量的文化旅游、终身学习课程以及操作简便的适老化智能家居。",
        "audioPy": "Zhǔchírén: Suízhe lǎolínghuà chéngdù jiāshēn, yuèláiyuè duō qǐyè kànzhòng 'yínfà jīngjì', nín duì chǎnpǐn yánfā yǒu shénme jiànyì? Jīngjìxuéjiā: Qiānwàn bié bǎ lǎoniánrén jiǎnhuà chéng 'zhǐ xūyào zhìbìng hé mǎi bǎojiànpǐn' de qúntǐ. Rújīn xīn yí dài zhǎngzhě pǔbiàn shòu jiàoyù chéngdù jiào gāo, tāmen tóngyàng kěwàng gāo zhìliàng de wénhuà lǚyóu, zhōngshēn xuéxí kèchéng yǐjí cāozuò jiǎnbiàn de shìlǎohuà zhìnéng jiājū.",
        "audioVi": "Người dẫn chương trình: Khi mức độ già hóa dân số tăng lên, ngày càng nhiều doanh nghiệp coi trọng 'kinh tế tóc bạc', ông có gợi ý gì cho khâu phát triển sản phẩm? Nhà kinh tế: Tuyệt đối đừng đơn giản hóa người cao tuổi thành nhóm 'chỉ cần chữa bệnh và mua thực phẩm chức năng'. Thế hệ người lớn tuổi mới hiện nay phổ biến có trình độ học vấn khá cao, họ cũng khát khao du lịch văn hóa chất lượng cao, các khóa học suốt đời và thiết bị nhà thông minh dễ thao tác phù hợp tuổi tác.",
        "opts": [
          "Chỉ cần tập trung sản xuất thuốc men và thực phẩm chức năng",
          "Đáp ứng cả nhu cầu du lịch văn hóa, học tập và công nghệ thân thiện người già",
          "Loại bỏ hoàn toàn tính năng điện tử vì người cao tuổi không dùng được",
          "Giữ nguyên mẫu mã cũ từ mấy thập kỷ trước để tiết kiệm chi phí"
        ],
        "ans": 1,
        "exp": "Nhà kinh tế nhắc không gò bó vào thuốc men, mà cần phát triển du lịch văn hóa, học tập suốt đời và thiết bị thông minh thân thiện ('适老化智能家居')."
      },
      {
        "id": "m6_2_l5",
        "partLabel": "Phần 1 • Phỏng vấn chuyên sâu",
        "type": "mcq",
        "prompt": "Nghe trích đoạn phỏng vấn và trả lời: Điều gì làm nên sức bền của một tình bạn lâu năm theo nhà xã hội học?",
        "statement": "",
        "statementPy": "",
        "audioZh": "主持人：为什么很多学生时代的好友，步入社会几年后就渐渐断了联系？ 学者：因为共同的日常场景消失了，生活轨迹不可避免地出现分化。真正能够跨越岁月长河的友谊，并不强求每天朝夕相处，而在于彼此尊重对方的人生选择，并且在关键时刻依然能够坦诚倾听、不带功利地互相托底。",
        "audioPy": "Zhǔchírén: Wèishénme hěn duō xuésheng shídài de hǎoyǒu, bùrù shèhuì jǐ nián hòu jiù jiànjiàn duàn le liánxì? Xuézhě: Yīnwèi gòngtóng de rìcháng chǎngjǐng xiāoshī le, shēnghuó guǐjì bù kě bìmiǎn de chūxiàn fēnhuà. Zhēnzhèng nénggòu kuàyuè suìyuè chánghé de yǒuyì, bìng bù qiǎngqiú měitiān zhāoxī-xiāngchǔ, ér zàiyú bǐcǐ zūnzhòng duìfāng de rénshēng xuǎnzé, bìngqiě zài guānjiàn shíkè yīrán nénggòu tǎnchéng qīngtīng, bú dài gōnglì de hùxiāng tuōdǐ.",
        "audioVi": "Người dẫn chương trình: Vì sao nhiều bạn thân thời đi học sau vài năm bước vào đời lại dần đứt liên lạc? Học giả: Vì bối cảnh sinh hoạt chung biến mất, quỹ đạo cuộc sống tất yếu phân nhánh. Tình bạn thực sự vượt qua dòng chảy năm tháng không ép buộc ngày nào cũng kề cận, mà nằm ở sự tôn trọng lựa chọn cuộc đời của nhau, và vào thời khắc then chốt vẫn biết chân thành lắng nghe, nâng đỡ nhau không vụ lợi.",
        "opts": [
          "Phải gặp mặt uống trà và trò chuyện ít nhất mỗi ngày một lần",
          "Làm việc chung một công ty để duy trì bối cảnh giao tiếp giống nhau",
          "Tôn trọng lối đi riêng của nhau, chân thành lắng nghe và nâng đỡ không vụ lợi",
          "Thường xuyên tặng nhau những món quà đắt tiền vào dịp lễ"
        ],
        "ans": 2,
        "exp": "Học giả nhấn mạnh hai điểm: tôn trọng lựa chọn sống của đối phương ('尊重对方的人生选择') và lắng nghe chân thành, hỗ trợ không vụ lợi lúc quan trọng."
      },
      {
        "id": "m6_2_l6",
        "partLabel": "Phần 2 • Bình luận học thuật",
        "type": "mcq",
        "prompt": "Nghe đoạn bình luận và trả lời: Hiện tượng 'hiệu ứng buồng vang' trên mạng xã hội có nguy cơ gây ra điều gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "在算法推荐的主导下，网络平台总是优先向用户推送他们原本就认同的观点和内容，久而久之便形成了所谓的“回音室效应”。身处其中的人会误以为全世界都和自己想的一样，不仅视野日益狭窄，面对不同意见时也更容易变得固执甚至情绪对立。主动接触多元声音，是保持理性清醒的重要途径。",
        "audioPy": "Zài suànfǎ tuījiàn de zhǔdǎo xià, wǎngluò píngtái zǒngshì yōuxiān xiàng yònghù tuīsòng tāmen yuánběn jiù rèntóng de guāndiǎn hé nèiróng, jiǔ'érjiǔzhī biàn xíngchéng le suǒwèi de 'huíyīnshì xiàoyìng'. Shēnchǔ qízhōng de rén huì wùyǐwéi quán shìjiè dōu hé zìjǐ xiǎng de yíyàng, bùjǐn shìyě rìyì xiázhǎi, miànduì bùtóng yìjiàn shí yě gèng róngyì biànde gùzhí shènzhì qíngxù duìlì. Zhǔdòng jiēchù duōyuán shēngyīn, shì bǎochí lǐxìng qīngxǐng de zhòngyào tújìng.",
        "audioVi": "Dưới sự dẫn dắt của thuật toán gợi ý, nền tảng mạng luôn ưu tiên đẩy cho người dùng những quan điểm và nội dung họ vốn đã đồng tình, lâu dần hình thành cái gọi là 'hiệu ứng buồng vang'. Người ở trong đó dễ lầm tưởng cả thế giới đều nghĩ giống mình, chẳng những tầm nhìn ngày càng thu hẹp mà khi gặp ý kiến trái chiều cũng dễ trở nên cố chấp thậm chí đối đầu cảm xúc. Chủ động tiếp xúc với tiếng nói đa chiều là con đường quan trọng để giữ sự tỉnh táo lý trí.",
        "opts": [
          "Giúp mọi người đạt được sự đồng thuận tuyệt đối trong mọi tranh luận",
          "Thu hẹp tầm nhìn và khiến con người cố chấp, dễ đối đầu với quan điểm khác biệt",
          "Làm giảm tốc độ truyền tải dữ liệu trên các thiết bị di động",
          "Khiến thuật toán gợi ý không còn hoạt động hiệu quả cho mục đích thương mại"
        ],
        "ans": 1,
        "exp": "Đoạn bình luận chỉ rõ tác hại của '回音室效应': tầm nhìn thu hẹp ('视野日益狭窄') và dễ cố chấp, đối lập cảm xúc trước ý kiến khác biệt."
      },
      {
        "id": "m6_2_l7",
        "partLabel": "Phần 2 • Bình luận học thuật",
        "type": "mcq",
        "prompt": "Nghe đoạn bình luận và trả lời: Vì sao việc đặt ra 'ranh giới rõ ràng' lại quan trọng trong các mối quan hệ?",
        "statement": "",
        "statementPy": "",
        "audioZh": "在人际交往中，有些人习惯毫无底线地满足他人要求，以为这样就能换取好感与认可。然而心理学家指出，缺乏边界感的善良往往容易被视作理所当然，不仅会让自己长期陷入委屈与疲惫，反而不利于建立健康平等的关系。真正成熟的关系，是既懂得适度体谅别人，也敢于礼貌而坚定地表达自己的底线。",
        "audioPy": "Zài rénjì jiāowǎng zhōng, yǒuxiē rén xíguàn háowú dǐxiàn de mǎnzú tārén yāoqiú, yǐwéi zhèyàng jiù néng huànqǔ hǎogǎn yǔ rènkě. Rán'ér xīnlǐxuéjiā zhǐchū, quēfá biānjiègǎn de shànliáng wǎngwǎng róngyì bèi shìzuò lǐsuǒdāngrán, bùjǐn huì ràng zìjǐ chángqī xiànrù wěiqu yǔ píbèi, fǎn'ér bú lìyú jiànlì jiànkāng píngděng de guānxi. Zhēnzhèng chéngshú de guānxi, shì jì dǒngde shìdù tǐliàng biérén, yě gǎnyú lǐmào ér jiāndìng de biǎodá zìjǐ de dǐxiàn.",
        "audioVi": "Trong giao tiếp xã hội, có người quen chiều theo yêu cầu của người khác không giới hạn, tưởng rằng làm vậy sẽ đổi lấy thiện cảm và sự công nhận. Thế nhưng nhà tâm lý học chỉ ra lòng tốt thiếu ranh giới thường dễ bị xem là hiển nhiên, chẳng những khiến bản thân lâu dài rơi vào tủi thân và kiệt sức mà còn bất lợi cho việc xây dựng quan hệ lành mạnh bình đẳng. Mối quan hệ thực sự trưởng thành là vừa biết cảm thông vừa phải với người khác, vừa dám lịch sự mà kiên quyết bày tỏ giới hạn của mình.",
        "opts": [
          "Nhường nhịn vô điều kiện giúp tình cảm giữa hai bên bền chặt nhất",
          "Thiếu ranh giới dễ khiến lòng tốt bị coi nhẹ và gây kiệt sức cho bản thân",
          "Nên từ chối giúp đỡ mọi người xung quanh để bảo vệ thời gian riêng",
          "Chỉ những người làm lãnh đạo mới cần thiết lập ranh giới cá nhân"
        ],
        "ans": 1,
        "exp": "Nhà tâm lý chỉ ra lòng tốt thiếu ranh giới dễ bị xem là đương nhiên ('被视作理所当然') và gây tủi thân, mệt mỏi."
      },
      {
        "id": "m6_2_l8",
        "partLabel": "Phần 2 • Bình luận học thuật",
        "type": "mcq",
        "prompt": "Nghe đoạn bình luận và trả lời: Điểm mấu chốt để bảo tồn di sản ẩm thực truyền thống là gì?",
        "statement": "",
        "statementPy": "",
        "audioZh": "在餐饮工业化与连锁化的浪潮中，许多地方传统小吃面临着工艺简化甚至味道趋同的隐忧。其实，真正让地方风味历经代代相传而不衰的，不只是配方表上的克数，更是几代人对本地食材特性的精准把握与手工火候的耐心守候。如果只追求标准化出餐速度而放弃了这道门槛，失落的将不仅是舌尖上的记忆，更是一方水土的文化标识。",
        "audioPy": "Zài cānyǐn gōngyèhuà yǔ liánsuǒhuà de làngcháo zhōng, xǔduō dìfāng chuántǒng xiǎochī miànlín zhe gōngyì jiǎnhuà shènzhì wèidào qūtóng de yǐnyōu. Qíshí, zhēnzhèng ràng dìfāng fēngwèi lìjīng dàidài xiāngchuán ér bù shuāi de, bù zhǐ shì pèifāngbiǎo shàng de kèshù, gèng shì jǐ dài rén duì běndì shícái tèxìng de jīngzhǔn bǎwò yǔ shǒugōng huǒhou de nàixīn shǒuhòu. Rúguǒ zhǐ zhuīqiú biāozhǔnhuà chūcān sùdù ér fàngqì le zhè dào ménkǎn, shīluò de jiāng bùjǐn shì shéjiān shàng de jìyì, gèng shì yì fāng shuǐtǔ de wénhuà biāozhì.",
        "audioVi": "Trong làn sóng công nghiệp hóa và chuỗi hóa ngành ăn uống, nhiều món ăn vặt truyền thống địa phương đối mặt nguy cơ giản lược quy trình thậm chí đồng nhất hương vị. Kỳ thực điều làm hương vị địa phương truyền qua nhiều thế hệ không suy tàn không chỉ là số gam trên bảng công thức, mà còn là sự nắm bắt chuẩn xác đặc tính nguyên liệu bản địa và sự kiên nhẫn canh lửa thủ công của nhiều thế hệ. Nếu chỉ chạy theo tốc độ ra món chuẩn hóa mà từ bỏ ngưỡng cửa ấy, thứ đánh mất sẽ không chỉ là ký ức đầu lưỡi mà còn là dấu ấn văn hóa của cả một vùng đất.",
        "opts": [
          "Thay toàn bộ đầu bếp thủ công bằng dây chuyền nấu tự động",
          "Gìn giữ sự am hiểu nguyên liệu bản địa và sự tỉ mỉ trong kỹ thuật lửa thủ công",
          "Đơn giản hóa mọi bước chế biến để mở rộng chuỗi cửa hàng toàn cầu",
          "Giữ bí quyết hoàn toàn bí mật không truyền dạy cho thế hệ trẻ"
        ],
        "ans": 1,
        "exp": "Đoạn bình luận nhấn mạnh '对本地食材特性的精准把握与手工火候的耐心守候' (nắm chắc đặc tính nguyên liệu bản địa và sự kiên nhẫn giữ lửa thủ công)."
      },
      {
        "id": "m6_2_l9",
        "partLabel": "Phần 2 • Bình luận học thuật",
        "type": "mcq",
        "prompt": "Nghe đoạn bình luận và trả lời: Đoạn văn nhìn nhận thế nào về mối quan hệ giữa thiên tài và sự khổ luyện?",
        "statement": "",
        "statementPy": "",
        "audioZh": "人们在赞叹卓越运动员或音乐家的惊人表现时，常常习惯将其归功于“天赋异禀”。诚然，先天的身体条件与感知敏锐度决定了起跑线的高度，但科学追踪研究却发现，几乎所有顶尖高手在成名之前，都经历过长达十年以上极其枯燥且有针对性的刻意练习。天赋只是入场券，真正让人站上巅峰的，是日复一日对薄弱环节的打磨。",
        "audioPy": "Rénmen zài zàntàn zhuóyuè yùndòngyuán huò yīnyuèjiā de jīngrén biǎoxiàn shí, chángcháng xíguàn jiāng qí guīgōng yú 'tiānfù yìbǐng'. Chéngrán, xiāntiān de shēntǐ tiáojiàn yǔ gǎnzhī mǐnruìdù juédìng le qǐpǎoxiàn de gāodù, dàn kēxué zhuīzōng yánjiū què fāxiàn, jīhū suǒyǒu dǐngjiān gāoshǒu zài chéngmíng zhīqián, dōu jīnglì guo chángdá shí nián yǐshàng jíqí kūzào qiě yǒu zhēnduìxìng de kèyì liànxí. Tiānfù zhǐshì rùchǎngquàn, zhēnzhèng ràng rén zhànshàng diānfēng de, shì rìfùyírì duì bóruò huánjié de dǎmó.",
        "audioVi": "Khi tán thưởng màn thể hiện kinh ngạc của vận động viên hay nhạc công kiệt xuất, người ta hay quy công cho 'thiên phú khác thường'. Đành rằng thể chất bẩm sinh và độ nhạy bén cảm nhận quyết định vị trí vạch xuất phát, nhưng nghiên cứu theo dõi khoa học phát hiện hầu hết cao thủ hàng đầu trước khi thành danh đều trải qua hơn mười năm khổ luyện có chủ đích cực kỳ khô khan. Tài năng chỉ là tấm vé vào cửa, thứ thực sự đưa con người lên đỉnh cao là sự mài giũa điểm yếu lặp đi lặp lại từng ngày.",
        "opts": [
          "Tài năng bẩm sinh là yếu tố duy nhất tạo nên nhà vô địch",
          "Tài năng chỉ là điểm khởi đầu, khổ luyện có chủ đích lâu dài mới đưa đến đỉnh cao",
          "Bất kỳ ai luyện tập ngẫu nhiên vài tháng cũng có thể đạt trình độ đỉnh cao",
          "Các vận động viên hàng đầu thường tránh rèn luyện những kỹ năng mình còn yếu"
        ],
        "ans": 1,
        "exp": "Câu kết khẳng định: '天赋只是入场券，真正让人站上巅峰的，是日复一日对薄弱环节的打磨'."
      },
      {
        "id": "m6_2_l10",
        "partLabel": "Phần 2 • Bình luận học thuật",
        "type": "mcq",
        "prompt": "Nghe đoạn bình luận và trả lời: Vì sao thành phố hiện đại cần chú trọng xây dựng 'không gian thứ ba' (như thư viện, công viên, quán trà cộng đồng)?",
        "statement": "",
        "statementPy": "",
        "audioZh": "社会学家把家庭称为“第一空间”，把工作场所称为“第二空间”，而把免费或低门槛向公众开放的图书馆、社区公园、街角茶馆等公共聚会场所称为“第三空间”。在人情渐趋疏离的现代都市中，高质量的第三空间能够打破职业与阶层的隔阂，让陌生人之间产生温和友善的连接，从而提升整座城市的信任感与归属感。",
        "audioPy": "Shèhuìxuéjiā bǎ jiātíng chēngwéi 'dì-yī kōngjiān', bǎ gōngzuò chǎngsuǒ chēngwéi 'dì-èr kōngjiān', ér bǎ miǎnfèi huò dī ménkǎn xiàng gōngzhòng kāifàng de túshūguǎn, shèqū gōngyuán, jiējiǎo cháguǎn děng gōnggòng jùhuì chǎngsuǒ chēngwéi 'dì-sān kōngjiān'. Zài rénqíng jiànqū shūlí de xiàndài dūshì zhōng, gāo zhìliàng de dì-sān kōngjiān nénggòu dǎpò zhiyè yǔ jiēcéng de géhé, ràng mòshēngrén zhījiān chǎnshēng wēnhé yǒushàn de liánjiē, cóngr'ér tíshēng zhěng zuò chéngshì de xìnrèngǎn yǔ guīshǔgǎn.",
        "audioVi": "Nhà xã hội học gọi gia đình là 'không gian thứ nhất', nơi làm việc là 'không gian thứ hai', còn thư viện, công viên cộng đồng, quán trà góc phố mở cửa miễn phí hoặc dễ tiếp cận cho công chúng là 'không gian thứ ba'. Trong đô thị hiện đại nơi tình người dần xa cách, không gian thứ ba chất lượng cao có thể phá vỡ rào cản nghề nghiệp và tầng lớp, tạo nên kết nối ôn hòa thân thiện giữa những người xa lạ, qua đó nâng cao lòng tin và cảm giác gắn bó của toàn thành phố.",
        "opts": [
          "Để thay thế hoàn toàn nhu cầu xây dựng nhà ở và văn phòng",
          "Để tạo kết nối thân thiện giữa cư dân, xóa rào cản và tăng lòng tin đô thị",
          "Để tăng nguồn thu thuế thương mại từ các khu giải trí cao cấp",
          "Để khuyến khích người dân làm việc từ xa suốt cả tuần"
        ],
        "ans": 1,
        "exp": "Không gian thứ ba giúp '打破职业与阶层的隔阂' (phá bỏ ngăn cách nghề nghiệp tầng lớp), kết nối thân thiện và tăng lòng tin, sự gắn bó ('提升整座城市的信任感与归属感')."
      }
    ],
    "reading": [
      {
        "id": "m6_2_r1",
        "partLabel": "Phần 1 • Tìm câu bệnh ngữ (找病句)",
        "kind": "error",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn câu mắc lỗi ngữ pháp hoặc diễn đạt sai (找病句):",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "这部历史题材的电影之所以深受观众喜爱，是因为其精良的制作与真挚的情感的原因。",
          "在数字经济蓬勃发展的背景下，传统制造业亟须加快转型升级的步伐。",
          "考古工作者历时五年，终于在这座古城遗址中发掘出大量珍贵的汉代陶器。",
          "面对突如其来的暴雨天气，市政排水部门迅速启动了应急预案。"
        ],
        "ans": 0,
        "exp": "Đáp án sai ngữ pháp: A (Lẫn lộn cấu trúc câu — 句式杂糅). Đã dùng '之所以……，是因为……' thì không thể thêm '的原因' ở cuối câu (hoặc dùng '是因为……' hoặc '是……的原因').\n• Dịch câu A (đã sửa): Bộ phim đề tài lịch sử này sở dĩ được khán giả yêu thích sâu sắc là nhờ khâu sản xuất chỉn chu và tình cảm chân thành."
      },
      {
        "id": "m6_2_r2",
        "partLabel": "Phần 1 • Tìm câu bệnh ngữ (找病句)",
        "kind": "error",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn câu mắc lỗi ngữ pháp hoặc diễn đạt sai (找病句):",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "尽管前方道路崎岖泥泞，救援队员们依然背负着物资向受灾村落艰难挺进。",
          "据不完全统计，参加本次国际环保论坛的专家学者大约有五百人左右。",
          "阅读经典著作不仅能够拓宽我们的知识视野，还能潜移默化地塑造精神品格。",
          "只有建立起完善的数据安全保护机制，公众才能放心地享受智慧城市带来的便利。"
        ],
        "ans": 1,
        "exp": "Đáp án sai ngữ pháp: B (Lặp nghĩa thừa từ — 语义重复). '大约' (khoảng chừng) và '左右' (xấp xỉ/khoảng) đều biểu thị số ước lượng, không được dùng đồng thời trong cùng một cụm số lượng. Cần bỏ một trong hai từ.\n• Dịch câu B (đã sửa): Theo thống kê chưa đầy đủ, các chuyên gia học giả tham dự diễn đàn bảo vệ môi trường quốc tế lần này có khoảng 500 người."
      },
      {
        "id": "m6_2_r3",
        "partLabel": "Phần 1 • Tìm câu bệnh ngữ (找病句)",
        "kind": "error",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn câu mắc lỗi ngữ pháp hoặc diễn đạt sai (找病句):",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "这位老教授从事古典诗词研究四十余载，培养了一大批优秀的学术接班人。",
          "随着生态保护力度的持续加大，这片湿地又重新迎来了成群结队的候鸟。",
          "学校开展了丰富多彩的读书活动，大大提高了同学们对阅读的兴趣和水平。",
          "无论时代如何变迁，诚实守信永远是维系社会正常运转的基石。"
        ],
        "ans": 2,
        "exp": "Đáp án sai ngữ pháp: C (Phối hợp từ sai — 搭配不当). '提高' đi được với '水平' (nâng cao trình độ), nhưng không đi với '兴趣' (hứng thú phải dùng '激发' hoặc '培养', không nói '提高兴趣').\n• Dịch câu C (đã sửa): Nhà trường đã tổ chức các hoạt động đọc sách phong phú đa dạng, khơi dậy mạnh mẽ hứng thú và nâng cao trình độ đọc của học sinh."
      },
      {
        "id": "m6_2_r4",
        "partLabel": "Phần 2 • Điền từ học thuật vào chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ thích hợp điền vào chỗ trống: 真正高明的领导者懂得______，善于发现团队中每位成员的独特优势并给予发挥空间。",
        "qPy": "Zhēnzhèng gāomíng de lǐngdǎozhě dǒngde ______, shànyú fāxiàn tuánduì zhōng měi wèi chéngyuán de dútè yōushì bìng jǐyǔ fāhuī kōngjiān.",
        "orderItems": [],
        "opts": [
          "知人善任",
          "刚愎自用",
          "优柔寡断",
          "推卸责任"
        ],
        "ans": 0,
        "exp": "Đáp án đúng: A. 知人善任 (zhīrén-shànrèn — biết người và khéo dùng người đúng sở trường). B: bảo thủ cố chấp tự phụ, C: do dự thiếu quyết đoán, D: đùn đẩy trách nhiệm."
      },
      {
        "id": "m6_2_r5",
        "partLabel": "Phần 2 • Điền từ học thuật vào chỗ trống",
        "kind": "fill",
        "passageZh": "",
        "passagePy": "",
        "passageVi": "",
        "q": "Chọn từ thích hợp điền vào chỗ trống: 任何一项制度的设计都不可能做到十全十美，唯有在实践检验中不断______，才能使之日臻完善。",
        "qPy": "Rènhé yí xiàng zhìdù de shèjì dōu bù kěnéng zuòdào shíquán-shíměi, wéiyǒu zài shíjiàn jiǎnyàn zhōng búduàn ______, cái néng shǐ zhī rìzhēn wánshàn.",
        "orderItems": [],
        "opts": [
          "修订",
          "废除",
          "隐瞒",
          "停滞"
        ],
        "ans": 0,
        "exp": "Đáp án đúng: A. 修订 (xiūdìng — tu chỉnh, sửa đổi bổ sung cho hoàn thiện). Phù hợp ngữ cảnh '制度设计……不断修订……日臻完善'. B: bãi bỏ, C: che giấu, D: đình trệ."
      },
      {
        "id": "m6_2_r6",
        "partLabel": "Phần 3 • Điền câu vào đoạn văn (选句填空)",
        "kind": "insert",
        "passageZh": "阅读经典的意义，并不在于机械背诵书中的名言警句，而在于潜移默化地重塑我们的思维方式。（ ______ ）。当一个人在面对生活困境时能够保持一份从容与悲悯，在面对喧嚣舆论时能够守住独立判断，这便是长期阅读所沉淀下来的真正力量。",
        "passagePy": "Yuèdú jīngdiǎn de yìyì, bìng bú zàiyú jīxiè bèisòng shūzhōng de míngyán jǐngjù, ér zàiyú qiányímòhuà de chóngsù wǒmen de sīwéi fāngshì. ( ______ ). Dāng yí ge rén zài miànduì shēnghuó kùnjìng shí nénggòu bǎochí yí fèn cóngróng yǔ bēimǐn, zài miànduì xuānxiāo yúlùn shí nénggòu shǒuzhù dúlì pànduàn, zhè biàn shì chángqī yuèdú suǒ chéndiàn xiàlái de zhēnzhèng lìliàng.",
        "passageVi": "Ý nghĩa của việc đọc sách kinh điển không nằm ở việc học thuộc lòng máy móc các danh ngôn trong sách, mà ở việc âm thầm tái tạo phương thức tư duy của chúng ta. ( ______ ). Khi một người đứng trước nghịch cảnh cuộc sống vẫn giữ được nét ung dung và lòng trắc ẩn, đứng trước dư luận ồn ào vẫn giữ vững phán đoán độc lập, đó chính là sức mạnh thực sự lắng đọng từ việc đọc sách lâu dài.",
        "q": "Chọn câu thích hợp nhất điền vào chỗ trống （ ______ ） trong đoạn văn trên:",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "或许过不了多久，我们会忘记书里具体的章节细节，但那些精神养分早已融入日常言行之中",
          "因此，图书馆应当每天延长开放时间并增加畅销小说的采购数量",
          "很多畅销书虽然印刷精美，却缺乏经得起时间检验的思想深度",
          "相比之下，听有声书比阅读纸质书籍更容易让人感到困倦"
        ],
        "ans": 0,
        "exp": "Đáp án đúng: A. Câu trước nói đọc sách định hình tư duy một cách thầm lặng; câu A tiếp nối ý 'có thể sẽ quên chi tiết chương sách, nhưng dưỡng chất tinh thần đã thấm vào lời ăn tiếng nói hằng ngày', dẫn mượt sang ví dụ ở câu cuối."
      },
      {
        "id": "m6_2_r7",
        "partLabel": "Phần 3 • Điền câu vào đoạn văn (选句填空)",
        "kind": "insert",
        "passageZh": "在探讨古代丝绸之路的历史价值时，人们最先想到的往往是丝绸、瓷器与香料等物质商品的流通。（ ______ ）。事实上，随着商队的驼铃声穿梭于亚欧大陆之间的，还有造纸术、天文历法、建筑技艺以及多元宗教与艺术风格，这些文明要素的交融深刻影响了沿线各民族的发展轨迹。",
        "passagePy": "Zài tàntǎo gǔdài Sīchóu zhī Lù de lìshǐ jiàzhí shí, rénmen zuìxiān xiǎngdào de wǎngwǎng shì sīchóu, cíqì yǔ xiāngliào děng wùzhì shāngpǐn de liútōng. ( ______ ). Shìshíshàng, suízhe shāngduì de tuólíngshēng chuānsuō yú Yà-Ōu dàlù zhījiān de, hái yǒu zàozhǐshù, tiānwén lìfǎ, jiànzhù jìyì yǐjí duōyuán zōngjiào yǔ yìshù fēnggé, zhèxiē wénmíng yàosù de jiāoróng shēnkè yǐngxiǎng le yánxiàn gè mínzú de fāzhǎn guǐjì.",
        "passageVi": "Khi bàn về giá trị lịch sử của Con đường Tơ lụa cổ đại, điều người ta nghĩ đến đầu tiên thường là sự lưu thông của các hàng hóa vật chất như tơ lụa, đồ sứ và hương liệu. ( ______ ). Thực tế, đồng hành cùng tiếng chuông lạc đà của các đoàn thương nhân xuyên suốt lục địa Á-Âu còn có kỹ thuật làm giấy, thiên văn lịch pháp, kỹ nghệ kiến trúc cùng các tôn giáo và phong cách nghệ thuật đa dạng; sự giao hòa của những yếu tố văn minh này đã ảnh hưởng sâu sắc tới quỹ đạo phát triển của các dân tộc dọc tuyến đường.",
        "q": "Chọn câu thích hợp nhất điền vào chỗ trống （ ______ ） trong đoạn văn trên:",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "然而，若仅仅将其视作一条单纯的贸易通道，无疑低估了它在人类文明史上的意义",
          "不过，由于古代交通工具简陋，长途运输商品的风险与成本都极其高昂",
          "正因如此，丝绸和瓷器在当时的欧洲市场上一向供不应求",
          "近年来，现代高速铁路的开通已经大大缩短了欧亚大陆之间的运输时间"
        ],
        "ans": 0,
        "exp": "Đáp án đúng: A. Vế trước nêu ấn tượng thông thường về thương mại vật chất; câu A chuyển tiếp hợp lý rằng nếu chỉ coi đó là tuyến buôn bán đơn thuần thì đã đánh giá thấp ý nghĩa văn minh của nó, mở đường cho câu sau liệt kê giao lưu tri thức & nghệ thuật."
      },
      {
        "id": "m6_2_r8",
        "partLabel": "Phần 4 • Đọc hiểu bài viết chuyên sâu",
        "kind": "mcq",
        "passageZh": "随着电子存储设备的普及，人类记录信息的能力达到了前所未有的高度，但“数字失忆”的隐患也随之浮现。一方面，我们习惯将电话号码、日程安排甚至知识笔记统统托付给云端，大脑主动记忆与联想的机会大幅减少；另一方面，软件格式更迭与存储介质老化，反而使某些二三十年前的数字文档比几百年前的纸质档案更难读取。如何确保当代珍贵的“数字记忆”长久留存，已成为档案学界亟待解决的新课题。",
        "passagePy": "Suízhe diànzǐ cúnchǔ shèbèi de pǔjí, rénlèi jìlù xìnxī de nénglì dádào le qiánsuǒwèiyǒu de gāodù, dàn 'shùzì shīyì' de yǐnhuàn yě suízhī fúxiàn. Yì fāngmiàn, wǒmen xíguàn jiāng diànhuà hàomǎ, rìchéng ānpái shènzhì zhīshi bǐjì tǒngtǒng tuōfù gěi yúnduān, dànǎo zhǔdòng jìyì yǔ liánxiǎng de jīhuì dàfú jiǎnshǎo; lìng yì fāngmiàn, ruǎnjiàn géshì gēngdié yǔ cúnchǔ jièzhì lǎohuà, fǎn'ér shǐ mǒuxiē èr-sānshí nián qián de shùzì wéndàng bǐ jǐbǎi nián qián de zhǐzhì dàng'àn gèng nán dúqǔ. Rúhé quèbǎo dāngdài zhēnguì de 'shùzì jìyì' chángjiǔ liúcún, yǐ chéngwéi dàng'àn xuéjiè jídài jiějué de xīn kètí.",
        "passageVi": "Cùng với sự phổ cập của thiết bị lưu trữ điện tử, khả năng ghi chép thông tin của nhân loại đạt tới tầm cao chưa từng có, nhưng mối lo 'mất trí nhớ kỹ thuật số' cũng theo đó lộ diện. Một mặt, chúng ta quen giao phó toàn bộ số điện thoại, lịch trình thậm chí ghi chú tri thức lên đám mây, cơ hội để não bộ chủ động ghi nhớ và liên tưởng giảm mạnh; mặt khác, sự thay thế định dạng phần mềm và lão hóa vật mang tin lại khiến một số tài liệu số cách đây hai ba mươi năm còn khó đọc hơn hồ sơ giấy hàng trăm năm trước. Làm thế nào đảm bảo 'ký ức số' quý giá đương đại được lưu giữ lâu dài đã trở thành đề tài mới cấp thiết của giới lưu trữ học.",
        "q": "Khái niệm 'mất trí nhớ kỹ thuật số' trong bài phản ánh hai khía cạnh nào?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Giá thuê dịch vụ lưu trữ đám mây ngày càng đắt đỏ và thiếu ổn định",
          "Não người lười ghi nhớ chủ động hơn, đồng thời tài liệu số cũ dễ lỗi thời khó đọc lại",
          "Các thiết bị điện tử tiêu thụ quá nhiều điện năng khi sao lưu dữ liệu",
          "Giới lưu trữ học từ chối áp dụng công nghệ số vào bảo quản tài liệu cổ"
        ],
        "ans": 1,
        "exp": "Đoạn văn chia rõ hai mặt '一方面……；另一方面……': não ít ghi nhớ chủ động hơn, và định dạng cũ / thiết bị lão hóa làm tài liệu số khó đọc lại."
      },
      {
        "id": "m6_2_r9",
        "partLabel": "Phần 4 • Đọc hiểu bài viết chuyên sâu",
        "kind": "mcq",
        "passageZh": "批判性思维常常被误解为“专门挑毛病”或“否定一切”。事实上，真正的批判性思维并非情绪化的反驳，而是一种严谨的求真态度——在面对任何结论时，先追问其论据是否充分、推理过程是否存在跳跃或偷换概念，同时也愿意用同样的标准审视自己的既有偏见。具备这种能力的人，既不会盲从权威，也不会固执己见，而是随时准备根据更可靠的证据修正认知。",
        "passagePy": "Pīpànxìng sīwéi chángcháng bèi wùjiě wéi 'zhuānmén tiāo máobìng' huò 'fǒudìng yíqiè'. Shìshíshàng, zhēnzhèng de pīpànxìng sīwéi bìng fēi qíngxùhuà de fǎnbó, érshì yì zhǒng yánjǐn de qiúzhēn tàidù——zài miànduì rènhé jiélùn shí, xiān zhuīwèn qí lùnjù shìfǒu chōngfèn, tuīlǐ guòchéng shìfǒu cúnzài tiàoyuè huò tōuhuàn gàiniàn, tóngshí yě yuànyì yòng tóngyàng de biāozhǔn shěnshì zìjǐ de jìyǒu piānjiàn. Jùbèi zhè zhǒng nénglì de rén, jì bú huì mángcóng quánwēi, yě bú huì gùzhí jǐjiàn, érshì suíshí zhǔnbèi gēnjù gèng kěkào de zhèngjù xiūzhèng rènzhī.",
        "passageVi": "Tư duy phản biện thường bị hiểu lầm là 'chuyên bới móc lỗi' hoặc 'phủ nhận tất cả'. Thực tế, tư duy phản biện đích thực không phải sự phản bác cảm tính, mà là thái độ tìm cầu chân lý nghiêm túc — khi đứng trước bất kỳ kết luận nào, trước hết truy vấn xem luận cứ có đầy đủ không, quá trình suy luận có nhảy cóc hay đánh tráo khái niệm không, đồng thời sẵn sàng dùng chính tiêu chuẩn ấy để tự soi xét định kiến sẵn có của bản thân. Người có năng lực này vừa không mù quáng nghe theo uy quyền, vừa không cố chấp bảo thủ, mà luôn sẵn sàng hiệu chỉnh nhận thức dựa trên bằng chứng đáng tin cậy hơn.",
        "q": "Theo đoạn văn, đặc trưng quan trọng của người có tư duy phản biện đích thực là gì?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Luôn phản đối mọi ý kiến của đa số để thể hiện sự khác biệt",
          "Kiểm chứng luận cứ, suy luận khách quan và sẵn sàng tự soi xét định kiến bản thân",
          "Tuyệt đối tin tưởng vào trực giác ban đầu mà không cần bằng chứng",
          "Chỉ đặt câu hỏi với người khác, không bao giờ nghi ngờ quan điểm của mình"
        ],
        "ans": 1,
        "exp": "Đoạn văn nêu rõ: kiểm tra luận cứ & suy luận, tự soi xét định kiến bản thân ('审视自己的既有偏见'), sẵn sàng sửa đổi theo chứng cứ tin cậy hơn."
      },
      {
        "id": "m6_2_r10",
        "partLabel": "Phần 4 • Đọc hiểu bài viết chuyên sâu",
        "kind": "mcq",
        "passageZh": "传统中医在诊断疾病时常说“治未病”，意思是最高明的医术不是等病症严重爆发后再猛药攻伐，而是在身体刚刚出现微小失衡迹象时，通过作息微调、饮食节制与情绪疏导加以纠正。这种智慧同样适用于现代企业的风险管理：与其在危机全面爆发后耗费巨资公关善后，不如在日常运营中建立敏锐的预警机制，及时化解隐患于萌芽状态。",
        "passagePy": "Chuántǒng Zhōngyī zài zhěnduàn jíbìng shí cháng shuō 'zhì wèi bìng', yìsi shì zuì gāomíng de yīshù bú shì děng bìngzhèng yánzhòng bàofā hòu zài měngyào gōngfá, érshì zài shēntǐ gānggāng chūxiàn wēixiǎo shīhéng jìxiàng shí, tōngguò zuòxī wēitiáo, yǐnshí jiézhì yǔ qíngxù shūdǎo jiāyǐ jiūzhèng. Zhè zhǒng zhìhuì tóngyàng shìyòng yú xiàndài qǐyè de fēngxiǎn guǎnlǐ: yǔqí zài wēijī quánmiàn bàofā hòu hàofèi jùzī gōngguān shànhòu, bùrú zài rìcháng yùnyíng zhōng jiànlì mǐnruì de yùjǐng jīzhì, jíshí huàjiě yǐnhuàn yú méngyá zhuàngtài.",
        "passageVi": "Đông y truyền thống khi chẩn bệnh thường nói 'trị bệnh từ khi chưa phát', nghĩa là y thuật cao minh nhất không phải đợi bệnh chứng bùng phát nghiêm trọng rồi mới dùng thuốc mạnh công phá, mà khi cơ thể vừa xuất hiện dấu hiệu mất cân bằng nhỏ đã điều chỉnh kịp thời qua nếp sinh hoạt, tiết chế ăn uống và giải tỏa cảm xúc. Trí tuệ này cũng áp dụng tương tự vào quản trị rủi ro của doanh nghiệp hiện đại: thay vì đợi khủng hoảng bùng nổ toàn diện mới tốn tiền bạc xử lý hậu quả, chi bằng xây dựng cơ chế cảnh báo sớm nhạy bén trong vận hành hằng ngày, kịp thời hóa giải nguy cơ ngay từ lúc mới manh nha.",
        "q": "Tác giả liên hệ triết lý 'trị bệnh từ khi chưa phát' của Đông y với quản trị doanh nghiệp nhằm rút ra bài học gì?",
        "qPy": "",
        "orderItems": [],
        "opts": [
          "Doanh nghiệp nên chi thật nhiều ngân sách cho việc xử lý khủng hoảng truyền thông",
          "Cần xây dựng cơ chế cảnh báo sớm để hóa giải rủi ro ngay từ mầm mống",
          "Nhân viên công ty nên áp dụng thực đơn ăn kiêng theo y học cổ truyền",
          "Mọi rủi ro kinh doanh đều có thể tự biến mất nếu kiên nhẫn chờ đợi"
        ],
        "ans": 1,
        "exp": "Câu cuối kết luận: nên '建立敏锐的预警机制，及时化解隐患于萌芽状态' (lập cơ chế cảnh báo nhạy bén, hóa giải nguy cơ từ lúc mới nhen nhóm)."
      }
    ],
    "writing": [
      {
        "id": "m6_2_w1",
        "partLabel": "Phần 1 • Sắp xếp câu học thuật",
        "type": "reorder",
        "words": [
          "必须",
          "决策者",
          "面对",
          "清醒的头脑",
          "局面",
          "保持",
          "复杂的"
        ],
        "answer": "面对复杂的局面决策者必须保持清醒的头脑。",
        "py": "Miànduì fùzá de júmiàn juécèzhě bìxū bǎochí qīngxǐng de tóunǎo.",
        "vi": "Đối diện với cục diện phức tạp, người ra quyết sách bắt buộc phải giữ cái đầu tỉnh táo.",
        "exp": "Trạng ngữ tình huống '面对复杂的局面' đặt đầu câu, theo sau là chủ ngữ '决策者' + động từ năng nguyện '必须' + cụm động-tân '保持清醒的头脑'."
      },
      {
        "id": "m6_2_w2",
        "partLabel": "Phần 1 • Sắp xếp câu học thuật",
        "type": "reorder",
        "words": [
          "自然规律",
          "实现",
          "只有",
          "可持续发展",
          "人类才能",
          "尊重",
          "长期的"
        ],
        "answer": "只有尊重自然规律人类才能实现长期的可持续发展。",
        "py": "Zhǐyǒu zūnzhòng zìrán guīlǜ rénlèi cái néng shíxiàn chángqī de kě chíxù fāzhǎn.",
        "vi": "Chỉ có tôn trọng quy luật tự nhiên thì nhân loại mới có thể hiện thực hóa sự phát triển bền vững lâu dài.",
        "exp": "Cấu trúc '只有……才能……' chuẩn học thuật HSK 6: '尊重自然规律' (tôn trọng quy luật tự nhiên) và '实现可持续发展' (thực hiện phát triển bền vững)."
      },
      {
        "id": "m6_2_w3",
        "partLabel": "Phần 2 • Tóm tắt văn bản (缩写)",
        "type": "essay_summary",
        "title": "Hai chiếc bình gốm và dòng suối",
        "readSeconds": 600,
        "sourceTitle": "有裂缝的陶罐",
        "sourceZh": "从前有个挑水夫，每天用扁担挑着两只大陶罐到山下的溪边去取水。其中一只陶罐完好无损，每次都能把满满一罐清泉送到主人家里；而另一只陶罐却在底部有一道细小的裂缝，等走到山顶时，罐里的水往往已经漏掉了一大半。两年过去了，完好无损的陶罐对自己的表现十分骄傲，而有裂缝的陶罐却常常因为自己的缺陷感到深深的自卑。终于有一天，它忍不住向挑水夫道歉：“真对不起，因为我的破损，您每天白白流了那么多汗水。”挑水夫听了温和地笑着说：“你难道没有留意过吗？在每天回家的那条小路边，只有你经过的那一侧开满了绚烂的鲜花。其实我早知道你有裂缝，便刻意在你走的那一边撒下了花种。正因为你一路洒下的水滴浇灌了它们，我才能采摘到这些美丽的花朵去装点主人的餐桌。”",
        "sourcePy": "Cóngqián yǒu ge tiāoshuǐfū, měitiān yòng biǎndan tiāozhe liǎng zhī dà táoguàn dào shānxià de xībiān qù qǔshuǐ. Qízhōng yì zhī táoguàn wánhǎo-wúsǔn, měicì dōu néng bǎ mǎnmǎn yí guàn qīngquán sòngdào zhǔrén jiālǐ; ér lìng yì zhī táoguàn què zài dǐbù yǒu yí dào xìxiǎo de lièfèng, děng zǒudào shāndǐng shí, guànlǐ de shuǐ wǎngwǎng yǐjīng lòudiào le yí dà bàn. Liǎng nián guòqù le, wánhǎo-wúsǔn de táoguàn duì zìjǐ de biǎoxiàn shífēn jiāo'ào, ér yǒu lièfèng de táoguàn què chángcháng yīnwèi zìjǐ de quēxiàn gǎndào shēnshēn de zìbēi. Zhōngyú yǒu yì tiān, tā rěn bu zhù xiàng tiāoshuǐfū dàoqiàn: 'Zhēn duìbuqǐ, yīnwèi wǒ de pòsǔn, nín měitiān báibái liú le nàme duō hànshuǐ.' Tiāoshuǐfū tīng le wēnhé de xiào zhe shuō: 'Nǐ nándào méiyǒu liúyì guo ma? Zài měitiān huíjiā de nà tiáo xiǎolùbiān, zhǐyǒu nǐ jīngguò de nà yí cè kāimǎn le xuànlàn de xiānhuā. Qíshí wǒ zǎo zhīdao nǐ yǒu lièfèng, biàn kèyì zài nǐ zǒu de nà yì biān sǎxià le huāzhǒng. Zhèng yīnwèi nǐ yílù sǎxià de shuǐdī jiāoguàn le tāmen, wǒ cái néng cǎizhāi dào zhèxiē měilì de huāduǒ qù zhuāngdiǎn zhǔrén de cānzhuō.'",
        "sourceVi": "Ngày xưa có một người gánh nước, mỗi ngày dùng đòn gánh gánh hai chiếc bình gốm lớn xuống con suối dưới chân núi lấy nước. Trong đó có một chiếc bình lành lặn nguyên vẹn, lần nào cũng đưa trọn vẹn một bình nước suối mát về nhà chủ; còn chiếc bình kia dưới đáy lại có một vết nứt nhỏ, đợi lúc đi lên tới đỉnh núi thì nước trong bình thường đã rò rỉ mất quá nửa. Hai năm trôi qua, chiếc bình lành lặn vô cùng tự hào về thành tích của mình, còn chiếc bình nứt lại thường cảm thấy tự ti sâu sắc vì khiếm khuyết của bản thân. Cuối cùng một ngày nọ, nó không kìm được bèn xin lỗi người gánh nước: 'Thật xin lỗi ông, vì vết hỏng của tôi mà mỗi ngày ông đổ mồ hôi vô ích nhiều thế.' Người gánh nước nghe xong ôn tồn mỉm cười nói: 'Chẳng lẽ ngươi chưa từng để ý sao? Bên con đường nhỏ dẫn về nhà mỗi ngày, chỉ riêng phía ngươi đi qua mới nở rộ đầy hoa tươi rực rỡ. Thật ra ta sớm biết ngươi có vết nứt nên cố ý gieo hạt hoa dọc bên phía ngươi đi. Chính nhờ những giọt nước ngươi rỏ xuống dọc đường đã tưới tắm chúng, ta mới hái được những bông hoa xinh đẹp ấy trang hoàng bàn ăn cho chủ nhân.'",
        "keywords": [
          "挑水夫",
          "裂缝",
          "自卑",
          "花种",
          "浇灌"
        ],
        "minChars": 110,
        "targetChars": 180,
        "promptVi": "Đọc kỹ văn bản gốc trong 10 phút (tối đa 600 giây), sau đó ẩn văn bản và tóm tắt lại thành đoạn văn khoảng 140–180 chữ Hán. Giữ trọn cốt truyện và lời giải thích của người gánh nước, không thêm bài học đạo lý cá nhân.",
        "sampleZh": "一位挑水夫每天用两只陶罐取水。其中一只完好无损，总能装满水送回家；另一只却因底部有裂缝，路上总会漏掉大半水。久而久之，有裂缝的陶罐深感自卑，便向挑水夫道歉。挑水夫笑着安慰它说，回家路边只有它经过的那一侧开满了鲜花，正是自己早早知情并撒下花种，靠它漏出的水滴一路浇灌，才得以采摘鲜花去装点主人的餐桌。",
        "samplePy": "Yí wèi tiāoshuǐfū měitiān yòng liǎng zhī táoguàn qǔshuǐ. Qízhōng yì zhī wánhǎo-wúsǔn, zǒng néng zhuāngmǎn shuǐ sònghuí jiā; lìng yì zhī què yīn dǐbù yǒu lièfèng, lùshàng zǒng huì lòudiào dàbàn shuǐ. Jiǔ'érjiǔzhī, yǒu lièfèng de táoguàn shēngǎn zìbēi, biàn xiàng tiāoshuǐfū dàoqiàn. Tiāoshuǐfū xiào zhe ānwèi tā shuō, huíjiā lùbiān zhǐyǒu tā jīngguò de nà yí cè kāimǎn le xiānhuā, zhèng shì zìjǐ zǎozǎo zhīqíng bìng sǎxià huāzhǒng, kào tā lòuchū de shuǐdī yílù jiāoguàn, cái déyǐ cǎizhāi xiānhuā qù zhuāngdiǎn zhǔrén de cānzhuō.",
        "sampleVi": "Một người gánh nước mỗi ngày dùng hai chiếc bình gốm lấy nước. Trong đó một chiếc nguyên vẹn, luôn chở đầy nước về nhà; chiếc còn lại vì đáy có vết nứt nên dọc đường luôn rò mất quá nửa nước. Lâu dần, chiếc bình nứt cảm thấy rất tự ti bèn xin lỗi người gánh nước. Người gánh nước mỉm cười an ủi nó rằng bên vệ đường về nhà chỉ có phía nó đi qua mới nở đầy hoa tươi, chính vì ông sớm biết chuyện và gieo hạt hoa, nhờ những giọt nước nó rò ra tưới tắm suốt dọc đường mới hái được hoa đẹp trang trí bàn ăn cho chủ nhân.",
        "exp": "Tóm tắt chuẩn HSK 6: cô đọng hai năm diễn biến, giữ đúng 5 từ khóa cốt lõi (挑水夫, 裂缝, 自卑, 花种, 浇灌), chuyển thoại trực tiếp thành tường thuật gián tiếp súc tích, không thêm bình luận ngoài văn bản."
      }
    ]
  }
];

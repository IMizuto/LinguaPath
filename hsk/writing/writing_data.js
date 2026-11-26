/* LinguaPath — Dữ liệu Luyện Viết Chữ Hán (120 chữ HSK 1–3), 50 Bộ thủ & Viết HSK 1–6 */

(function (global) {

  "use strict";

  const radicals = [
  {
    "char": "一",
    "pinyin": "yī",
    "hv": "Nhất",
    "nameVi": "Bộ Nhất",
    "strokes": 1,
    "meaning": "Số một, nét ngang cơ bản",
    "examples": [
      "三 (sān: số ba)",
      "上 (shàng: trên)",
      "下 (xià: dưới)"
    ]
  },
  {
    "char": "丨",
    "pinyin": "gǔn",
    "hv": "Cổn",
    "nameVi": "Bộ Cổn",
    "strokes": 1,
    "meaning": "Nét sổ thẳng từ trên xuống",
    "examples": [
      "中 (zhōng: giữa)",
      "丰 (fēng: phong phú)",
      "串 (chuàn: xâu chuỗi)"
    ]
  },
  {
    "char": "丶",
    "pinyin": "zhǔ",
    "hv": "Chủ",
    "nameVi": "Bộ Chủ",
    "strokes": 1,
    "meaning": "Điểm, giọt, nét chấm",
    "examples": [
      "主 (zhǔ: chủ)",
      "玉 (yù: ngọc)",
      "太 (tài: quá)"
    ]
  },
  {
    "char": "丿",
    "pinyin": "piě",
    "hv": "Phiệt",
    "nameVi": "Bộ Phiệt",
    "strokes": 1,
    "meaning": "Nét phẩy chéo sang trái",
    "examples": [
      "人 (rén: người)",
      "么 (me: trợ từ)",
      "久 (jiǔ: lâu)"
    ]
  },
  {
    "char": "乙",
    "pinyin": "yǐ",
    "hv": "Ất",
    "nameVi": "Bộ Ất",
    "strokes": 1,
    "meaning": "Can Ất, nét cong móc",
    "examples": [
      "九 (jiǔ: số chín)",
      "也 (yě: cũng)",
      "飞 (fēi: bay)"
    ]
  },
  {
    "char": "人",
    "pinyin": "rén",
    "hv": "Nhân",
    "nameVi": "Bộ Nhân (dạng ghép: 亻)",
    "strokes": 2,
    "meaning": "Con người",
    "examples": [
      "你 (nǐ: bạn)",
      "他 (tā: anh ấy)",
      "休 (xiū: nghỉ ngơi)"
    ]
  },
  {
    "char": "刀",
    "pinyin": "dāo",
    "hv": "Đao",
    "nameVi": "Bộ Đao (dạng ghép: 刂)",
    "strokes": 2,
    "meaning": "Con dao, cắt gọt",
    "examples": [
      "分 (fēn: chia)",
      "切 (qiē: cắt)",
      "到 (dào: đến)"
    ]
  },
  {
    "char": "力",
    "pinyin": "lì",
    "hv": "Lực",
    "nameVi": "Bộ Lực",
    "strokes": 2,
    "meaning": "Sức lực, nỗ lực",
    "examples": [
      "加 (jiā: thêm)",
      "动 (dòng: động)",
      "努 (nǔ: cố gắng)"
    ]
  },
  {
    "char": "又",
    "pinyin": "yòu",
    "hv": "Hựu",
    "nameVi": "Bộ Hựu",
    "strokes": 2,
    "meaning": "Bàn tay phải, lại nữa",
    "examples": [
      "友 (yǒu: bạn bè)",
      "双 (shuāng: đôi)",
      "反 (fǎn: phản)"
    ]
  },
  {
    "char": "口",
    "pinyin": "kǒu",
    "hv": "Khẩu",
    "nameVi": "Bộ Khẩu",
    "strokes": 3,
    "meaning": "Cái miệng, lời nói, ăn uống",
    "examples": [
      "吃 (chī: ăn)",
      "喝 (hē: uống)",
      "叫 (jiào: gọi)"
    ]
  },
  {
    "char": "囗",
    "pinyin": "wéi",
    "hv": "Vi",
    "nameVi": "Bộ Vi",
    "strokes": 3,
    "meaning": "Bao quanh, vây kín",
    "examples": [
      "国 (guó: nước)",
      "园 (yuán: vườn)",
      "回 (huí: về)"
    ]
  },
  {
    "char": "土",
    "pinyin": "tǔ",
    "hv": "Thổ",
    "nameVi": "Bộ Thổ",
    "strokes": 3,
    "meaning": "Đất đai, nơi chốn",
    "examples": [
      "地 (dì: đất)",
      "坐 (zuò: ngồi)",
      "城 (chéng: thành phố)"
    ]
  },
  {
    "char": "大",
    "pinyin": "dà",
    "hv": "Đại",
    "nameVi": "Bộ Đại",
    "strokes": 3,
    "meaning": "To lớn",
    "examples": [
      "天 (tiān: trời)",
      "太 (tài: quá)",
      "奇 (qí: kỳ lạ)"
    ]
  },
  {
    "char": "女",
    "pinyin": "nǚ",
    "hv": "Nữ",
    "nameVi": "Bộ Nữ",
    "strokes": 3,
    "meaning": "Phụ nữ, con gái",
    "examples": [
      "妈 (mā: mẹ)",
      "姐 (jiě: chị)",
      "好 (hǎo: tốt)"
    ]
  },
  {
    "char": "子",
    "pinyin": "zǐ",
    "hv": "Tử",
    "nameVi": "Bộ Tử",
    "strokes": 3,
    "meaning": "Con cái, đứa trẻ",
    "examples": [
      "学 (xué: học)",
      "字 (zì: chữ)",
      "孩 (hái: trẻ con)"
    ]
  },
  {
    "char": "十",
    "pinyin": "shí",
    "hv": "Thập",
    "nameVi": "Bộ Thập",
    "strokes": 2,
    "meaning": "Số mười, đầy đủ",
    "examples": [
      "千 (qiān: nghìn)",
      "午 (wǔ: trưa)",
      "南 (nán: phía nam)"
    ]
  },
  {
    "char": "厂",
    "pinyin": "hǎn",
    "hv": "Hán",
    "nameVi": "Bộ Hán",
    "strokes": 2,
    "meaning": "Sườn núi, vách đá, nhà xưởng",
    "examples": [
      "厅 (tīng: phòng)",
      "历 (lì: lịch)",
      "厚 (hòu: dày)"
    ]
  },
  {
    "char": "广",
    "pinyin": "guǎng",
    "hv": "Nghiễm",
    "nameVi": "Bộ Nghiễm",
    "strokes": 3,
    "meaning": "Mái nhà, rộng rãi",
    "examples": [
      "店 (diàn: cửa hàng)",
      "床 (chuáng: giường)",
      "座 (zuò: chỗ ngồi)"
    ]
  },
  {
    "char": "彳",
    "pinyin": "chì",
    "hv": "Xích",
    "nameVi": "Bộ Xích",
    "strokes": 3,
    "meaning": "Bước chân trái, đi lại",
    "examples": [
      "行 (xíng: đi, được)",
      "很 (hěn: rất)",
      "得 (dé: được)"
    ]
  },
  {
    "char": "门",
    "pinyin": "mén",
    "hv": "Môn",
    "nameVi": "Bộ Môn",
    "strokes": 3,
    "meaning": "Cánh cửa, cổng",
    "examples": [
      "问 (wèn: hỏi)",
      "间 (jiān: khoảng, phòng)",
      "开 (kāi: mở)"
    ]
  },
  {
    "char": "心",
    "pinyin": "xīn",
    "hv": "Tâm",
    "nameVi": "Bộ Tâm (dạng ghép: 忄)",
    "strokes": 4,
    "meaning": "Trái tim, tâm trạng, suy nghĩ",
    "examples": [
      "想 (xiǎng: nghĩ/nhớ)",
      "快 (kuài: nhanh)",
      "忙 (máng: bận)"
    ]
  },
  {
    "char": "手",
    "pinyin": "shǒu",
    "hv": "Thủ",
    "nameVi": "Bộ Thủ (dạng ghép: 扌)",
    "strokes": 4,
    "meaning": "Bàn tay, hành động tay",
    "examples": [
      "打 (dǎ: đánh/gọi)",
      "找 (zhǎo: tìm)",
      "拿 (ná: cầm)"
    ]
  },
  {
    "char": "日",
    "pinyin": "rì",
    "hv": "Nhật",
    "nameVi": "Bộ Nhật",
    "strokes": 4,
    "meaning": "Mặt trời, ngày, thời gian",
    "examples": [
      "明 (míng: sáng/mai)",
      "早 (zǎo: sớm)",
      "时 (shí: giờ)"
    ]
  },
  {
    "char": "月",
    "pinyin": "yuè",
    "hv": "Nguyệt",
    "nameVi": "Bộ Nguyệt",
    "strokes": 4,
    "meaning": "Mặt trăng, tháng; hoặc thịt/cơ thể",
    "examples": [
      "期 (qī: kỳ/tuần)",
      "朋 (péng: bạn)",
      "脸 (liǎn: mặt)"
    ]
  },
  {
    "char": "木",
    "pinyin": "mù",
    "hv": "Mộc",
    "nameVi": "Bộ Mộc",
    "strokes": 4,
    "meaning": "Cây cối, đồ gỗ",
    "examples": [
      "树 (shù: cây)",
      "桌 (zhuō: bàn)",
      "休 (xiū: nghỉ)"
    ]
  },
  {
    "char": "水",
    "pinyin": "shuǐ",
    "hv": "Thủy",
    "nameVi": "Bộ Thủy (dạng ghép: 氵)",
    "strokes": 4,
    "meaning": "Nước, chất lỏng, sông hồ",
    "examples": [
      "河 (hé: sông)",
      "洗 (xǐ: rửa)",
      "茶 (chá: trà)"
    ]
  },
  {
    "char": "火",
    "pinyin": "huǒ",
    "hv": "Hỏa",
    "nameVi": "Bộ Hỏa (dạng ghép: 灬)",
    "strokes": 4,
    "meaning": "Lửa, nóng, nấu nướng",
    "examples": [
      "热 (rè: nóng)",
      "灯 (dēng: đèn)",
      "炒 (chǎo: xào)"
    ]
  },
  {
    "char": "山",
    "pinyin": "shān",
    "hv": "Sơn",
    "nameVi": "Bộ Sơn",
    "strokes": 3,
    "meaning": "Núi non",
    "examples": [
      "岁 (suì: tuổi)",
      "岛 (dǎo: đảo)",
      "出 (chū: ra ngoài)"
    ]
  },
  {
    "char": "小",
    "pinyin": "xiǎo",
    "hv": "Tiểu",
    "nameVi": "Bộ Tiểu",
    "strokes": 3,
    "meaning": "Nhỏ bé",
    "examples": [
      "少 (shǎo: ít)",
      "尖 (jiān: nhọn)",
      "尘 (chén: bụi)"
    ]
  },
  {
    "char": "寸",
    "pinyin": "cùn",
    "hv": "Thốn",
    "nameVi": "Bộ Thốn",
    "strokes": 3,
    "meaning": "Tấc (đơn vị đo), phép tắc",
    "examples": [
      "对 (duì: đúng)",
      "时 (shí: giờ)",
      "导 (dǎo: dẫn)"
    ]
  },
  {
    "char": "工",
    "pinyin": "gōng",
    "hv": "Công",
    "nameVi": "Bộ Công",
    "strokes": 3,
    "meaning": "Công việc, thợ thuyền",
    "examples": [
      "左 (zuǒ: bên trái)",
      "差 (chà: kém)",
      "空 (kōng: trống)"
    ]
  },
  {
    "char": "夕",
    "pinyin": "xī",
    "hv": "Tịch",
    "nameVi": "Bộ Tịch",
    "strokes": 3,
    "meaning": "Chiều tối, đêm",
    "examples": [
      "多 (duō: nhiều)",
      "外 (wài: ngoài)",
      "夜 (yè: đêm)"
    ]
  },
  {
    "char": "艹",
    "pinyin": "cǎo",
    "hv": "Thảo",
    "nameVi": "Bộ Thảo (Thảo đầu)",
    "strokes": 3,
    "meaning": "Cỏ cây, thực vật",
    "examples": [
      "花 (huā: hoa)",
      "草 (cǎo: cỏ)",
      "茶 (chá: trà)"
    ]
  },
  {
    "char": "辶",
    "pinyin": "chuò",
    "hv": "Sước",
    "nameVi": "Bộ Sước",
    "strokes": 3,
    "meaning": "Bước đi, di chuyển, xa gần",
    "examples": [
      "进 (jìn: vào)",
      "远 (yuǎn: xa)",
      "送 (sòng: tiễn/tặng)"
    ]
  },
  {
    "char": "牛",
    "pinyin": "niú",
    "hv": "Ngưu",
    "nameVi": "Bộ Ngưu",
    "strokes": 4,
    "meaning": "Con trâu, con bò",
    "examples": [
      "物 (wù: vật)",
      "特 (tè: đặc biệt)",
      "件 (jiàn: chiếc/vụ)"
    ]
  },
  {
    "char": "犬",
    "pinyin": "quǎn",
    "hv": "Khuyển",
    "nameVi": "Bộ Khuyển (dạng ghép: 犭)",
    "strokes": 4,
    "meaning": "Con chó, loài thú",
    "examples": [
      "狗 (gǒu: chó)",
      "猫 (māo: mèo)",
      "猪 (zhū: lợn)"
    ]
  },
  {
    "char": "王",
    "pinyin": "wáng",
    "hv": "Vương",
    "nameVi": "Bộ Ngọc / Vương",
    "strokes": 4,
    "meaning": "Vua; ngọc quý (bên trái)",
    "examples": [
      "玩 (wán: chơi)",
      "现 (xiàn: hiện tại)",
      "班 (bān: lớp)"
    ]
  },
  {
    "char": "文",
    "pinyin": "wén",
    "hv": "Văn",
    "nameVi": "Bộ Văn",
    "strokes": 4,
    "meaning": "Văn tự, chữ viết, văn hóa",
    "examples": [
      "这 (zhè: đây)",
      "刘 (liú: họ Lưu)",
      "斑 (bān: vằn)"
    ]
  },
  {
    "char": "方",
    "pinyin": "fāng",
    "hv": "Phương",
    "nameVi": "Bộ Phương",
    "strokes": 4,
    "meaning": "Hình vuông, phương hướng",
    "examples": [
      "放 (fàng: đặt/thả)",
      "旁 (páng: bên cạnh)",
      "旅 (lǚ: du lịch)"
    ]
  },
  {
    "char": "马",
    "pinyin": "mǎ",
    "hv": "Mã",
    "nameVi": "Bộ Mã",
    "strokes": 3,
    "meaning": "Con ngựa",
    "examples": [
      "吗 (ma: không?)",
      "妈 (mā: mẹ)",
      "骑 (qí: cưỡi)"
    ]
  },
  {
    "char": "车",
    "pinyin": "chē",
    "hv": "Xa",
    "nameVi": "Bộ Xa",
    "strokes": 4,
    "meaning": "Xe cộ, phương tiện",
    "examples": [
      "轻 (qīng: nhẹ)",
      "较 (jiào: tương đối)",
      "辆 (liàng: chiếc xe)"
    ]
  },
  {
    "char": "见",
    "pinyin": "jiàn",
    "hv": "Kiến",
    "nameVi": "Bộ Kiến",
    "strokes": 4,
    "meaning": "Nhìn thấy, gặp mặt",
    "examples": [
      "觉 (jué: cảm thấy)",
      "观 (guān: xem)",
      "现 (xiàn: hiện)"
    ]
  },
  {
    "char": "田",
    "pinyin": "tián",
    "hv": "Điền",
    "nameVi": "Bộ Điền",
    "strokes": 5,
    "meaning": "Ruộng đồng",
    "examples": [
      "男 (nán: nam giới)",
      "画 (huà: vẽ)",
      "思 (sī: suy nghĩ)"
    ]
  },
  {
    "char": "目",
    "pinyin": "mù",
    "hv": "Mục",
    "nameVi": "Bộ Mục",
    "strokes": 5,
    "meaning": "Con mắt, nhìn ngắm",
    "examples": [
      "看 (kàn: nhìn/xem)",
      "睡 (shuì: ngủ)",
      "眼 (yǎn: mắt)"
    ]
  },
  {
    "char": "石",
    "pinyin": "shí",
    "hv": "Thạch",
    "nameVi": "Bộ Thạch",
    "strokes": 5,
    "meaning": "Đá, khoáng chất",
    "examples": [
      "破 (pò: vỡ)",
      "研 (yán: nghiên cứu)",
      "碗 (wǎn: cái bát)"
    ]
  },
  {
    "char": "禾",
    "pinyin": "hé",
    "hv": "Hòa",
    "nameVi": "Bộ Hòa",
    "strokes": 5,
    "meaning": "Cây lúa, mùa màng",
    "examples": [
      "秋 (qiū: mùa thu)",
      "种 (zhòng: trồng)",
      "租 (zū: thuê)"
    ]
  },
  {
    "char": "竹",
    "pinyin": "zhú",
    "hv": "Trúc",
    "nameVi": "Bộ Trúc (dạng ghép: ⺮)",
    "strokes": 6,
    "meaning": "Cây tre, trúc",
    "examples": [
      "笑 (xiào: cười)",
      "笔 (bǐ: bút)",
      "第 (dì: thứ...)"
    ]
  },
  {
    "char": "米",
    "pinyin": "mǐ",
    "hv": "Mễ",
    "nameVi": "Bộ Mễ",
    "strokes": 6,
    "meaning": "Gạo, hạt ngũ cốc",
    "examples": [
      "粉 (fěn: bột/bún)",
      "糖 (táng: đường/kẹo)",
      "精 (jīng: tinh túy)"
    ]
  },
  {
    "char": "言",
    "pinyin": "yán",
    "hv": "Ngôn",
    "nameVi": "Bộ Ngôn (dạng ghép: 讠)",
    "strokes": 7,
    "meaning": "Lời nói, ngôn ngữ",
    "examples": [
      "请 (qǐng: mời)",
      "谢 (xiè: cảm ơn)",
      "话 (huà: lời nói)"
    ]
  },
  {
    "char": "足",
    "pinyin": "zú",
    "hv": "Túc",
    "nameVi": "Bộ Túc (dạng ghép: ⻊)",
    "strokes": 7,
    "meaning": "Bàn chân, bước đi, đầy đủ",
    "examples": [
      "跑 (pǎo: chạy)",
      "踢 (tī: đá)",
      "路 (lù: đường)"
    ]
  }
];

  const practiceChars = [
  {
    "char": "一",
    "pinyin": "yī",
    "hv": "Nhất",
    "meaning": "Số 1",
    "radical": "一 (Nhất)",
    "strokes": 1,
    "tip": "Viết 1 nét ngang (一) từ trái sang phải, hơi chếch nhẹ lên trên.",
    "level": 1
  },
  {
    "char": "二",
    "pinyin": "èr",
    "hv": "Nhị",
    "meaning": "Số 2",
    "radical": "二 (Nhị)",
    "strokes": 2,
    "tip": "Nét ngang trên ngắn hơn nét ngang dưới.",
    "level": 1
  },
  {
    "char": "三",
    "pinyin": "sān",
    "hv": "Tam",
    "meaning": "Số 3",
    "radical": "一 (Nhất)",
    "strokes": 3,
    "tip": "Ba nét ngang: trên vừa, giữa ngắn nhất, dưới dài nhất.",
    "level": 1
  },
  {
    "char": "四",
    "pinyin": "sì",
    "hv": "Tứ",
    "meaning": "Số 4",
    "radical": "囗 (Vi)",
    "strokes": 5,
    "tip": "Viết khung ngoài trước (sổ trái, ngang gập), điền ruột bên trong (phẩy, sổ cong), cuối cùng đóng đáy.",
    "level": 1
  },
  {
    "char": "五",
    "pinyin": "wǔ",
    "hv": "Ngũ",
    "meaning": "Số 5",
    "radical": "二 (Nhị)",
    "strokes": 4,
    "tip": "Ngang trên → sổ hơi nghiêng → ngang gập → ngang đáy dài.",
    "level": 1
  },
  {
    "char": "六",
    "pinyin": "liù",
    "hv": "Lục",
    "meaning": "Số 6",
    "radical": "八 (Bát)",
    "strokes": 4,
    "tip": "Chấm đỉnh → ngang dài → phẩy trái → chấm dài phải cân xứng.",
    "level": 1
  },
  {
    "char": "七",
    "pinyin": "qī",
    "hv": "Thất",
    "meaning": "Số 7",
    "radical": "一 (Nhị/Nhất)",
    "strokes": 2,
    "tip": "Ngang hơi hất lên trước, sau đó viết sổ cong móc (乚).",
    "level": 1
  },
  {
    "char": "八",
    "pinyin": "bā",
    "hv": "Bát",
    "meaning": "Số 8",
    "radical": "八 (Bát)",
    "strokes": 2,
    "tip": "Phẩy trái trước thấp hơn, mác phải sau cao hơn và mở rộng.",
    "level": 1
  },
  {
    "char": "九",
    "pinyin": "jiǔ",
    "hv": "Cửu",
    "meaning": "Số 9",
    "radical": "乙 (Ất)",
    "strokes": 2,
    "tip": "Viết nét phẩy đứng (丿) trước, sau đó viết ngang gập cong móc.",
    "level": 1
  },
  {
    "char": "十",
    "pinyin": "shí",
    "hv": "Thập",
    "meaning": "Số 10",
    "radical": "十 (Thập)",
    "strokes": 2,
    "tip": "Quy tắc 'Ngang trước sổ sau': nét ngang trước, nét sổ thẳng xuyên giữa sau.",
    "level": 1
  },
  {
    "char": "人",
    "pinyin": "rén",
    "hv": "Nhân",
    "meaning": "Con người",
    "radical": "人 (Nhân)",
    "strokes": 2,
    "tip": "Quy tắc 'Phẩy trước mác sau': nét phẩy (丿) từ đỉnh, nét mác (㇏) đỡ ở giữa.",
    "level": 1
  },
  {
    "char": "大",
    "pinyin": "dà",
    "hv": "Đại",
    "meaning": "To lớn",
    "radical": "大 (Đại)",
    "strokes": 3,
    "tip": "Nét ngang trước, phẩy xuyên từ đỉnh qua giữa, cuối cùng nét mác cân hai bên.",
    "level": 1
  },
  {
    "char": "小",
    "pinyin": "xiǎo",
    "hv": "Tiểu",
    "meaning": "Nhỏ bé",
    "radical": "小 (Tiểu)",
    "strokes": 3,
    "tip": "Quy tắc 'Giữa trước hai bên sau': sổ móc ở giữa trước, rồi chấm trái, chấm phải.",
    "level": 1
  },
  {
    "char": "天",
    "pinyin": "tiān",
    "hv": "Thiên",
    "meaning": "Trời, ngày",
    "radical": "大 (Đại)",
    "strokes": 4,
    "tip": "Ngang trên ngắn → ngang dưới dài → phẩy xuyên → mác phải.",
    "level": 1
  },
  {
    "char": "太",
    "pinyin": "tài",
    "hv": "Thái",
    "meaning": "Quá, rất",
    "radical": "大 (Đại)",
    "strokes": 4,
    "tip": "Viết chữ 大 trước, thêm nét chấm (丶) ở phía dưới bên phải.",
    "level": 1
  },
  {
    "char": "女",
    "pinyin": "nǚ",
    "hv": "Nữ",
    "meaning": "Phụ nữ, con gái",
    "radical": "女 (Nữ)",
    "strokes": 3,
    "tip": "Phẩy gập chấm (𡿨) → phẩy dài cắt ngang → nét ngang dài cuối cùng.",
    "level": 1
  },
  {
    "char": "子",
    "pinyin": "zǐ",
    "hv": "Tử",
    "meaning": "Con cái, đứa trẻ",
    "radical": "子 (Tử)",
    "strokes": 3,
    "tip": "Ngang phẩy → cong móc ở giữa → nét ngang xuyên qua sau cùng.",
    "level": 1
  },
  {
    "char": "好",
    "pinyin": "hǎo",
    "hv": "Hảo",
    "meaning": "Tốt, khỏe, hay",
    "radical": "女 (Nữ)",
    "strokes": 6,
    "tip": "Trái trước phải sau: viết bộ 女 (3 nét) bên trái thu gọn, chữ 子 (3 nét) bên phải.",
    "level": 1
  },
  {
    "char": "学",
    "pinyin": "xué",
    "hv": "Học",
    "meaning": "Học tập",
    "radical": "子 (Tử)",
    "strokes": 8,
    "tip": "Trên trước dưới sau: 3 chấm đầu → mái mịch (冖) → chữ 子 ở dưới.",
    "level": 1
  },
  {
    "char": "生",
    "pinyin": "shēng",
    "hv": "Sinh",
    "meaning": "Sinh ra, học sinh",
    "radical": "生 (Sinh)",
    "strokes": 5,
    "tip": "Phẩy ngắn trái → ngang → ngang → sổ thẳng giữa → ngang đáy dài nhất.",
    "level": 1
  },
  {
    "char": "家",
    "pinyin": "jiā",
    "hv": "Gia",
    "meaning": "Nhà, gia đình",
    "radical": "宀 (Miên)",
    "strokes": 10,
    "tip": "Viết mái nhà 宀 (3 nét) ở trên trước, chữ 豕 (7 nét) ở dưới sau.",
    "level": 1
  },
  {
    "char": "爸",
    "pinyin": "bà",
    "hv": "Ba",
    "meaning": "Bố, cha",
    "radical": "父 (Phụ)",
    "strokes": 8,
    "tip": "Trên viết bộ 父 (4 nét), dưới viết chữ 巴 (4 nét) cân trục dọc.",
    "level": 1
  },
  {
    "char": "妈",
    "pinyin": "mā",
    "hv": "Mụ",
    "meaning": "Mẹ, má",
    "radical": "女 (Nữ)",
    "strokes": 6,
    "tip": "Trái viết bộ 女 (3 nét), phải viết chữ 马 (3 nét).",
    "level": 1
  },
  {
    "char": "友",
    "pinyin": "yǒu",
    "hv": "Hữu",
    "meaning": "Bạn bè",
    "radical": "又 (Hựu)",
    "strokes": 4,
    "tip": "Ngang trên → phẩy dài sang trái → viết bộ 又 ở phần dưới.",
    "level": 1
  },
  {
    "char": "我",
    "pinyin": "wǒ",
    "hv": "Ngã",
    "meaning": "Tôi, mình",
    "radical": "戈 (Qua)",
    "strokes": 7,
    "tip": "Phẩy đỉnh trái → ngang dài → sổ móc → hất → nét斜钩 (nghiêng móc) → phẩy → chấm đỉnh phải.",
    "level": 1
  },
  {
    "char": "你",
    "pinyin": "nǐ",
    "hv": "Nhĩ",
    "meaning": "Bạn, anh/chị",
    "radical": "人 (Nhân)",
    "strokes": 7,
    "tip": "Bộ Nhân đứng 亻 (2 nét) bên trái → phần trên 尔 (phẩy, ngang móc) → chữ 小 ở dưới.",
    "level": 1
  },
  {
    "char": "他",
    "pinyin": "tā",
    "hv": "Tha",
    "meaning": "Anh ấy, ông ấy",
    "radical": "人 (Nhân)",
    "strokes": 5,
    "tip": "Bộ 亻 bên trái → chữ 也 (3 nét: ngang gập móc, sổ, sổ cong móc) bên phải.",
    "level": 1
  },
  {
    "char": "她",
    "pinyin": "tā",
    "hv": "Tha",
    "meaning": "Cô ấy, bà ấy",
    "radical": "女 (Nữ)",
    "strokes": 6,
    "tip": "Bộ 女 (3 nét) bên trái → chữ 也 (3 nét) bên phải.",
    "level": 1
  },
  {
    "char": "们",
    "pinyin": "men",
    "hv": "Môn",
    "meaning": "Các, chúng (số nhiều)",
    "radical": "人 (Nhân)",
    "strokes": 5,
    "tip": "Bộ 亻 (2 nét) bên trái → chữ 门 (3 nét: chấm, sổ, ngang gập móc) bên phải.",
    "level": 1
  },
  {
    "char": "的",
    "pinyin": "de",
    "hv": "Đích",
    "meaning": "Của (trợ từ sở hữu)",
    "radical": "白 (Bạch)",
    "strokes": 8,
    "tip": "Trái là chữ 白 (5 nét), phải là chữ 勺 (3 nét).",
    "level": 1
  },
  {
    "char": "是",
    "pinyin": "shì",
    "hv": "Thị",
    "meaning": "Là, đúng",
    "radical": "日 (Nhật)",
    "strokes": 9,
    "tip": "Trên viết chữ 日 (4 nét) → ngang dài phân cách → dưới viết sổ, ngang, phẩy, mác.",
    "level": 1
  },
  {
    "char": "不",
    "pinyin": "bù",
    "hv": "Bất",
    "meaning": "Không",
    "radical": "一 (Nhất)",
    "strokes": 4,
    "tip": "Ngang dài trên → phẩy ở giữa → sổ thẳng từ giao điểm → chấm phải.",
    "level": 1
  },
  {
    "char": "有",
    "pinyin": "yǒu",
    "hv": "Hữu",
    "meaning": "Có",
    "radical": "月 (Nguyệt)",
    "strokes": 6,
    "tip": "Ngang → phẩy dài xuyên xuống → chữ 月 (4 nét) gọn bên dưới.",
    "level": 1
  },
  {
    "char": "在",
    "pinyin": "zài",
    "hv": "Tại",
    "meaning": "Ở, đang",
    "radical": "土 (Thổ)",
    "strokes": 6,
    "tip": "Ngang → phẩy dài → sổ dọc bên trái → chữ 土 (3 nét) bên trong.",
    "level": 1
  },
  {
    "char": "谁",
    "pinyin": "shuí",
    "hv": "Thùy",
    "meaning": "Ai",
    "radical": "言 (Ngôn)",
    "strokes": 10,
    "tip": "Bộ Ngôn 讠 (2 nét) bên trái → chữ 隹 (8 nét) bên phải.",
    "level": 1
  },
  {
    "char": "什",
    "pinyin": "shén",
    "hv": "Thập",
    "meaning": "Gì (trong 什么)",
    "radical": "人 (Nhân)",
    "strokes": 4,
    "tip": "Bộ 亻 (2 nét) bên trái → chữ 十 (2 nét) bên phải.",
    "level": 1
  },
  {
    "char": "么",
    "pinyin": "me",
    "hv": "Ma",
    "meaning": "Trợ từ (什么, 怎么)",
    "radical": "丿 (Phiệt)",
    "strokes": 3,
    "tip": "Phẩy ngắn trên → phẩy gập hất → nét chấm ở góc phải dưới.",
    "level": 1
  },
  {
    "char": "中",
    "pinyin": "zhōng",
    "hv": "Trung",
    "meaning": "Giữa, Trung Quốc",
    "radical": "丨 (Cổn)",
    "strokes": 4,
    "tip": "Viết chữ 口 (sổ trái, ngang gập, ngang đóng) trước, nét sổ dài xuyên giữa sau.",
    "level": 1
  },
  {
    "char": "国",
    "pinyin": "guó",
    "hv": "Quốc",
    "meaning": "Đất nước",
    "radical": "囗 (Vi)",
    "strokes": 8,
    "tip": "Vào trước đóng sau: viết khung 囗 (chưa đóng đáy) → viết chữ 玉 bên trong → đóng nét ngang đáy.",
    "level": 1
  },
  {
    "char": "文",
    "pinyin": "wén",
    "hv": "Văn",
    "meaning": "Ngôn ngữ, văn tự",
    "radical": "文 (Văn)",
    "strokes": 4,
    "tip": "Chấm đỉnh → ngang dài → phẩy cong sang trái → mác dài sang phải.",
    "level": 1
  },
  {
    "char": "字",
    "pinyin": "zì",
    "hv": "Tự",
    "meaning": "Chữ viết",
    "radical": "子 (Tử)",
    "strokes": 6,
    "tip": "Mái 宀 (3 nét) ở trên → chữ 子 (3 nét) ở dưới.",
    "level": 2
  },
  {
    "char": "名",
    "pinyin": "míng",
    "hv": "Danh",
    "meaning": "Tên gọi",
    "radical": "口 (Khẩu)",
    "strokes": 6,
    "tip": "Bộ 夕 (3 nét) ở trên → bộ 口 (3 nét) ở dưới.",
    "level": 2
  },
  {
    "char": "叫",
    "pinyin": "jiào",
    "hv": "Khiếu",
    "meaning": "Gọi là, tên là",
    "radical": "口 (Khẩu)",
    "strokes": 5,
    "tip": "Bộ 口 (3 nét) bên trái → nét sổ hất + nét sổ dài bên phải.",
    "level": 2
  },
  {
    "char": "爱",
    "pinyin": "ài",
    "hv": "Ái",
    "meaning": "Yêu, thích",
    "radical": "爪 (Trảo)",
    "strokes": 10,
    "tip": "Phẩy 3 chấm trên → mái mịch 冖 → chữ 友 (4 nét) ở dưới.",
    "level": 2
  },
  {
    "char": "书",
    "pinyin": "shū",
    "hv": "Thư",
    "meaning": "Sách",
    "radical": "乙 (Ất)",
    "strokes": 4,
    "tip": "Ngang gập → ngang gập móc → nét sổ thẳng → nét chấm trên phải.",
    "level": 2
  },
  {
    "char": "水",
    "pinyin": "shuǐ",
    "hv": "Thủy",
    "meaning": "Nước",
    "radical": "水 (Thủy)",
    "strokes": 4,
    "tip": "Sổ móc ở giữa trước → ngang gập phẩy bên trái → phẩy ngắn + mác bên phải.",
    "level": 2
  },
  {
    "char": "米",
    "pinyin": "mǐ",
    "hv": "Mễ",
    "meaning": "Gạo, mét",
    "radical": "米 (Mễ)",
    "strokes": 6,
    "tip": "Chấm trái, phẩy phải → ngang → sổ thẳng → phẩy trái, mác phải cân xứng.",
    "level": 2
  },
  {
    "char": "茶",
    "pinyin": "chá",
    "hv": "Trà",
    "meaning": "Trà, chè",
    "radical": "艹 (Thảo)",
    "strokes": 9,
    "tip": "Bộ Thảo 艹 (3 nét) → nón chữ 人 (2 nét) → chữ 朩 (4 nét) ở dưới.",
    "level": 2
  },
  {
    "char": "吃",
    "pinyin": "chī",
    "hv": "Ngật",
    "meaning": "Ăn",
    "radical": "口 (Khẩu)",
    "strokes": 6,
    "tip": "Bộ 口 bên trái → phần trên chữ 乞 (phẩy, ngang) → nét ngang gập cong móc.",
    "level": 2
  },
  {
    "char": "喝",
    "pinyin": "hē",
    "hv": "Hát",
    "meaning": "Uống",
    "radical": "口 (Khẩu)",
    "strokes": 12,
    "tip": "Bộ 口 bên trái → trên chữ 日 → dưới khung 勹 bọc chữ 人 và nét gập.",
    "level": 2
  },
  {
    "char": "看",
    "pinyin": "kàn",
    "hv": "Khán",
    "meaning": "Nhìn, xem, đọc",
    "radical": "目 (Mục)",
    "strokes": 9,
    "tip": "Trên là bàn tay 手 biến thể (4 nét che mắt), dưới là con mắt 目 (5 nét).",
    "level": 2
  },
  {
    "char": "听",
    "pinyin": "tīng",
    "hv": "Thính",
    "meaning": "Nghe",
    "radical": "口 (Khẩu)",
    "strokes": 7,
    "tip": "Bộ 口 (3 nét) bên trái → chữ 斤 (4 nét: phẩy, phẩy đứng, ngang, sổ) bên phải.",
    "level": 2
  },
  {
    "char": "说",
    "pinyin": "shuō",
    "hv": "Thuyết",
    "meaning": "Nói",
    "radical": "言 (Ngôn)",
    "strokes": 9,
    "tip": "Bộ Ngôn 讠 (2 nét) bên trái → chữ 兑 (7 nét) bên phải.",
    "level": 2
  },
  {
    "char": "读",
    "pinyin": "dú",
    "hv": "Độc",
    "meaning": "Đọc to",
    "radical": "言 (Ngôn)",
    "strokes": 10,
    "tip": "Bộ 讠 (2 nét) bên trái → chữ 卖 (8 nét) bên phải.",
    "level": 2
  },
  {
    "char": "写",
    "pinyin": "xiě",
    "hv": "Tả",
    "meaning": "Viết",
    "radical": "冖 (Mịch)",
    "strokes": 5,
    "tip": "Mái 冖 (2 nét) ở trên → chữ 与 (3 nét: ngang, sổ gập móc, ngang) ở dưới.",
    "level": 2
  },
  {
    "char": "去",
    "pinyin": "qù",
    "hv": "Khứ",
    "meaning": "Đi",
    "radical": "厶 (Tư)",
    "strokes": 5,
    "tip": "Viết chữ 土 (3 nét) ở trên → bộ 厶 (2 nét: phẩy gập, chấm) ở dưới.",
    "level": 2
  },
  {
    "char": "来",
    "pinyin": "lái",
    "hv": "Lai",
    "meaning": "Đến",
    "radical": "木 (Mộc)",
    "strokes": 7,
    "tip": "Ngang trên → chấm trái, phẩy phải → ngang dài → sổ thẳng → phẩy trái, mác phải.",
    "level": 2
  },
  {
    "char": "回",
    "pinyin": "huí",
    "hv": "Hồi",
    "meaning": "Quay về",
    "radical": "囗 (Vi)",
    "strokes": 6,
    "tip": "Vào trước đóng sau: khung 囗 ngoài → chữ 口 nhỏ ở giữa → đóng nét ngang đáy ngoài.",
    "level": 2
  },
  {
    "char": "做",
    "pinyin": "zuò",
    "hv": "Tác",
    "meaning": "Làm",
    "radical": "人 (Nhân)",
    "strokes": 11,
    "tip": "Bộ 亻 (2 nét) → chữ 古 (5 nét) ở giữa → bộ 攵 (4 nét) bên phải.",
    "level": 2
  },
  {
    "char": "买",
    "pinyin": "mǎi",
    "hv": "Mãi",
    "meaning": "Mua",
    "radical": "乙 (Ất)",
    "strokes": 6,
    "tip": "Ngang gập móc trên → 2 chấm trong → chữ 头 (ngang, phẩy, chấm) ở dưới.",
    "level": 2
  },
  {
    "char": "卖",
    "pinyin": "mài",
    "hv": "Mại",
    "level": 2,
    "meaning": "Bán (cặp dễ nhầm 买/卖)",
    "radical": "十 (Thập)",
    "strokes": 8,
    "tip": "Giống chữ 买 (mua) nhưng có thêm bộ 十 (thập) trên đỉnh: 'thêm mười/thêm lời mới bán'."
  },
  {
    "char": "入",
    "pinyin": "rù",
    "hv": "Nhập",
    "level": 2,
    "meaning": "Vào (cặp dễ nhầm 人/入/八)",
    "radical": "入 (Nhập)",
    "strokes": 2,
    "tip": "Khác với 人 (phẩy cao hơn mác): chữ 入 có nét mác bên phải cao vươn lên trên che nét phẩy."
  },
  {
    "char": "午",
    "pinyin": "wǔ",
    "hv": "Ngọ",
    "level": 2,
    "meaning": "Buổi trưa (cặp dễ nhầm 午/牛)",
    "radical": "十 (Thập)",
    "strokes": 4,
    "tip": "Khác với 牛 (con bò): nét sổ thẳng của 午 KHÔNG nhô lên khỏi nét ngang trên cùng."
  },
  {
    "char": "牛",
    "pinyin": "niú",
    "hv": "Ngưu",
    "level": 2,
    "meaning": "Con bò/trâu (cặp dễ nhầm 午/牛)",
    "radical": "牛 (Ngưu)",
    "strokes": 4,
    "tip": "Khác với 午 (trưa): nét sổ thẳng nhô hẳn lên trên đầu như sừng con bò."
  },
  {
    "char": "开",
    "pinyin": "kāi",
    "hv": "Khai",
    "level": 2,
    "meaning": "Mở, lái xe",
    "radical": "廾 (Củng)",
    "strokes": 4,
    "tip": "Ngang ngắn trên → ngang dài dưới → phẩy trái → sổ thẳng phải."
  },
  {
    "char": "关",
    "pinyin": "guān",
    "hv": "Quan",
    "level": 2,
    "meaning": "Đóng, liên quan",
    "radical": "八 (Bát)",
    "strokes": 6,
    "tip": "Chấm trái, phẩy phải trên đầu → chữ 天 ở dưới."
  },
  {
    "char": "早",
    "pinyin": "zǎo",
    "hv": "Tảo",
    "level": 2,
    "meaning": "Sớm, buổi sáng",
    "radical": "日 (Nhật)",
    "strokes": 6,
    "tip": "Trên là mặt trời 日 (4 nét), dưới là bộ 十 (2 nét) — mặt trời lên trên ngọn cỏ."
  },
  {
    "char": "晚",
    "pinyin": "wǎn",
    "hv": "Vãn",
    "level": 2,
    "meaning": "Muộn, buổi tối",
    "radical": "日 (Nhật)",
    "strokes": 11,
    "tip": "Trái là bộ 日 (ngày), phải là chữ 免 (miễn)."
  },
  {
    "char": "明",
    "pinyin": "míng",
    "hv": "Minh",
    "level": 2,
    "meaning": "Sáng, ngày mai",
    "radical": "日 (Nhật)",
    "strokes": 8,
    "tip": "Trái là mặt trời 日 (4 nét), phải là mặt trăng 月 (4 nét) ghép lại thành sáng."
  },
  {
    "char": "日",
    "pinyin": "rì",
    "hv": "Nhật",
    "level": 2,
    "meaning": "Mặt trời, ngày",
    "radical": "日 (Nhật)",
    "strokes": 4,
    "tip": "Sổ trái → ngang gập móc → ngang giữa → ngang đóng đáy."
  },
  {
    "char": "月",
    "pinyin": "yuè",
    "hv": "Nguyệt",
    "level": 2,
    "meaning": "Mặt trăng, tháng",
    "radical": "月 (Nguyệt)",
    "strokes": 4,
    "tip": "Phẩy trái → ngang gập móc → hai nét ngang nhỏ bên trong."
  },
  {
    "char": "年",
    "pinyin": "nián",
    "hv": "Niên",
    "level": 2,
    "meaning": "Năm",
    "radical": "干 (Can)",
    "strokes": 6,
    "tip": "Phẩy ngắn → ngang → ngang → sổ ngắn trái → ngang dài → sổ thẳng xuyên giữa."
  },
  {
    "char": "上",
    "pinyin": "shàng",
    "hv": "Thượng",
    "level": 2,
    "meaning": "Trên, lên",
    "radical": "一 (Nhất)",
    "strokes": 3,
    "tip": "Sổ thẳng trước → ngang ngắn giữa → ngang dài ở đáy."
  },
  {
    "char": "下",
    "pinyin": "xià",
    "hv": "Hạ",
    "level": 2,
    "meaning": "Dưới, xuống",
    "radical": "一 (Nhất)",
    "strokes": 3,
    "tip": "Ngang dài trên → sổ thẳng giữa → chấm phải."
  },
  {
    "char": "左",
    "pinyin": "zuǒ",
    "hv": "Tả",
    "level": 2,
    "meaning": "Bên trái",
    "radical": "工 (Công)",
    "strokes": 5,
    "tip": "Ngang → phẩy dài → bên trong là chữ 工 (công). Ghi nhớ: 左 có 工, 右 có 口."
  },
  {
    "char": "右",
    "pinyin": "yòu",
    "hv": "Hữu",
    "level": 2,
    "meaning": "Bên phải",
    "radical": "口 (Khẩu)",
    "strokes": 5,
    "tip": "Ngang → phẩy dài → bên trong là chữ 口 (miệng — tay phải cầm đũa đưa vào miệng)."
  },
  {
    "char": "多",
    "pinyin": "duō",
    "hv": "Đa",
    "level": 2,
    "meaning": "Nhiều",
    "radical": "夕 (Tịch)",
    "strokes": 6,
    "tip": "Hai bộ 夕 (3 nét) xếp chồng chéo từ trên xuống dưới."
  },
  {
    "char": "少",
    "pinyin": "shǎo",
    "hv": "Thiểu",
    "level": 2,
    "meaning": "Ít, thiếu",
    "radical": "小 (Tiểu)",
    "strokes": 4,
    "tip": "Sổ thẳng (không móc) → chấm trái → chấm phải → nét phẩy dài chéo xuống dưới."
  },
  {
    "char": "问",
    "pinyin": "wèn",
    "hv": "Vấn",
    "level": 2,
    "meaning": "Hỏi thăm",
    "radical": "门 (Môn)",
    "strokes": 6,
    "tip": "Viết khung ngoài bộ 门 (cửa) trước, chữ 口 (miệng) đặt giữa sau — mở cửa hỏi thăm."
  },
  {
    "char": "找",
    "pinyin": "zhǎo",
    "hv": "Trảo",
    "level": 2,
    "meaning": "Tìm kiếm",
    "radical": "手 (Thủ)",
    "strokes": 7,
    "tip": "Trái là bộ Tài gẩy 扌 (3 nét), phải là bộ Qua 戈 (4 nét)."
  },
  {
    "char": "犬",
    "pinyin": "quǎn",
    "hv": "Khuyển",
    "level": 3,
    "meaning": "Con chó (cặp dễ nhầm 大/太/犬)",
    "radical": "犬 (Khuyển)",
    "strokes": 4,
    "tip": "Khác với 太 (chấm ở dưới): chữ 犬 có nét chấm nằm ở góc TRÊN bên phải chữ 大."
  },
  {
    "char": "己",
    "pinyin": "jǐ",
    "hv": "Kỷ",
    "level": 3,
    "meaning": "Bản thân (cặp dễ nhầm 己/已/巳)",
    "radical": "己 (Kỷ)",
    "strokes": 3,
    "tip": "Mẹo 3 chữ: 己 (kỷ) mở miệng hoàn toàn, 已 (dĩ) mở nửa, 巳 (tỵ) đóng kín hoàn toàn."
  },
  {
    "char": "已",
    "pinyin": "yǐ",
    "hv": "Dĩ",
    "level": 3,
    "meaning": "Đã (trong 已经 — cặp 己/已/巳)",
    "radical": "己 (Kỷ)",
    "strokes": 3,
    "tip": "Nét sổ cong móc xuất phát từ giữa nét sổ trái (nửa kín nửa hở), khác 己 (hở) và 巳 (kín)."
  },
  {
    "char": "巳",
    "pinyin": "sì",
    "hv": "Tỵ",
    "level": 3,
    "meaning": "Chi Tỵ / 9–11h (cặp 己/已/巳)",
    "radical": "己 (Kỷ)",
    "strokes": 3,
    "tip": "Nét sổ cong móc nối kín lên tận đỉnh nét ngang trên cùng, đóng kín hoàn toàn."
  },
  {
    "char": "未",
    "pinyin": "wèi",
    "hv": "Vị",
    "level": 3,
    "meaning": "Chưa, tương lai (cặp 未/末)",
    "radical": "木 (Mộc)",
    "strokes": 5,
    "tip": "Mẹo nhớ 未/末: 未 (vị lai) nét ngang TRÊN ngắn, DƯỚI dài; 末 (mạt/cuối) nét ngang TRÊN dài, DƯỚI ngắn."
  },
  {
    "char": "末",
    "pinyin": "mò",
    "hv": "Mạt",
    "level": 3,
    "meaning": "Cuối cùng (trong 周末 — cặp 未/末)",
    "radical": "木 (Mộc)",
    "strokes": 5,
    "tip": "Nét ngang trên cùng DÀI hơn nét ngang thứ hai — ngược lại hoàn toàn với chữ 未."
  },
  {
    "char": "土",
    "pinyin": "tǔ",
    "hv": "Thổ",
    "level": 3,
    "meaning": "Đất (cặp dễ nhầm 土/士)",
    "radical": "土 (Thổ)",
    "strokes": 3,
    "tip": "Ngang trên ngắn, ngang đáy dài (đất trải rộng bên dưới). Ngược lại là chữ 士 (sĩ: trên dài dưới ngắn)."
  },
  {
    "char": "士",
    "pinyin": "shì",
    "hv": "Sĩ",
    "level": 3,
    "meaning": "Học sĩ, binh sĩ (cặp 土/士)",
    "radical": "士 (Sĩ)",
    "strokes": 3,
    "tip": "Ngang trên dài (bờ vai rộng), ngang dưới ngắn — khác với 土 (đất)."
  },
  {
    "char": "晴",
    "pinyin": "qíng",
    "hv": "Tình",
    "level": 3,
    "meaning": "Trời nắng (cặp 晴/睛/请/情)",
    "radical": "日 (Nhật)",
    "strokes": 12,
    "tip": "Bộ 日 (mặt trời) bên trái + 青 (thanh) bên phải → trời trong nắng đẹp."
  },
  {
    "char": "睛",
    "pinyin": "jīng",
    "hv": "Tinh",
    "level": 3,
    "meaning": "Con ngươi (眼睛 — cặp 晴/睛)",
    "radical": "目 (Mục)",
    "strokes": 13,
    "tip": "Bộ 目 (mắt, 2 nét ngang trong) bên trái + 青 bên phải. Đừng nhầm với 日 (chỉ có 1 nét ngang) trong 晴!"
  },
  {
    "char": "请",
    "pinyin": "qǐng",
    "hv": "Thỉnh",
    "level": 3,
    "meaning": "Mời, xin (cặp 请/情/清)",
    "radical": "言 (Ngôn)",
    "strokes": 10,
    "tip": "Bộ Ngôn 讠 (lời nói) bên trái + 青 bên phải."
  },
  {
    "char": "情",
    "pinyin": "qíng",
    "hv": "Tình",
    "level": 3,
    "meaning": "Tình cảm, sự việc (cặp 请/情/清)",
    "radical": "心 (Tâm)",
    "strokes": 11,
    "tip": "Bộ Tâm đứng 忄 (trái tim) bên trái + 青 bên phải."
  },
  {
    "char": "清",
    "pinyin": "qīng",
    "hv": "Thanh",
    "level": 3,
    "meaning": "Trong sạch, rõ ràng (清楚)",
    "radical": "水 (Thủy)",
    "strokes": 11,
    "tip": "Bộ Ba chấm thủy 氵 (nước) bên trái + 青 bên phải."
  },
  {
    "char": "借",
    "pinyin": "jiè",
    "hv": "Tá",
    "level": 3,
    "meaning": "Mượn, cho mượn",
    "radical": "人 (Nhân)",
    "strokes": 10,
    "tip": "Trái bộ Nhân đứng 亻 (2 nét), phải chữ 昔 (8 nét)."
  },
  {
    "char": "忘",
    "pinyin": "wàng",
    "hv": "Vong",
    "level": 3,
    "meaning": "Quên (忘记)",
    "radical": "心 (Tâm)",
    "strokes": 7,
    "tip": "Trên là chữ 亡 (mất, 3 nét), dưới là bộ 心 (tâm, 4 nét) — mất khỏi tâm trí là quên."
  },
  {
    "char": "忙",
    "pinyin": "máng",
    "hv": "Mang",
    "level": 3,
    "meaning": "Bận rộn",
    "radical": "心 (Tâm)",
    "strokes": 6,
    "tip": "Trái bộ Tâm đứng 忄 (3 nét), phải chữ 亡 (3 nét) — tim không có lúc nghỉ."
  },
  {
    "char": "换",
    "pinyin": "huàn",
    "hv": "Hoán",
    "level": 3,
    "meaning": "Đổi, thay đổi",
    "radical": "手 (Thủ)",
    "strokes": 10,
    "tip": "Trái bộ Tài gẩy 扌 (3 nét), phải chữ 奂 (7 nét)."
  },
  {
    "char": "试",
    "pinyin": "shì",
    "hv": "Thí",
    "level": 3,
    "meaning": "Thử, thi cử (考试)",
    "radical": "言 (Ngôn)",
    "strokes": 8,
    "tip": "Trái bộ Ngôn 讠 (2 nét), phải chữ 式 (6 nét). Lưu ý: không có nét phẩy thừa trong 式."
  },
  {
    "char": "伞",
    "pinyin": "sǎn",
    "hv": "Tản",
    "level": 3,
    "meaning": "Cái ô, dù",
    "radical": "人 (Nhân)",
    "strokes": 6,
    "tip": "Chữ tượng hình: mái 人 che trên đầu → hai chấm nhỏ → ngang → sổ thẳng làm cán ô."
  },
  {
    "char": "饿",
    "pinyin": "è",
    "hv": "Ngạ",
    "level": 3,
    "meaning": "Đói bụng",
    "radical": "食 (Thực)",
    "strokes": 10,
    "tip": "Trái bộ Thực 饣 (3 nét, ăn uống), phải chữ 我 (7 nét)."
  },
  {
    "char": "饱",
    "pinyin": "bǎo",
    "hv": "Bão",
    "level": 3,
    "meaning": "No bụng",
    "radical": "食 (Thực)",
    "strokes": 8,
    "tip": "Trái bộ Thực 饣 (3 nét), phải chữ 包 (5 nét)."
  },
  {
    "char": "甜",
    "pinyin": "tián",
    "hv": "Điềm",
    "level": 3,
    "meaning": "Ngọt ngào",
    "radical": "舌 (Thiệt)",
    "strokes": 11,
    "tip": "Trái chữ 舌 (cái lưỡi, 6 nét), phải chữ 甘 (ngọt, 5 nét)."
  },
  {
    "char": "刷",
    "pinyin": "shuā",
    "hv": "Soát",
    "level": 3,
    "meaning": "Chải, đánh răng, quẹt thẻ",
    "radical": "刀 (Đao)",
    "strokes": 8,
    "tip": "Trái là 尸 + 巾 (6 nét), phải là bộ Đao đứng 刂 (2 nét)."
  },
  {
    "char": "哭",
    "pinyin": "kū",
    "hv": "Khốc",
    "level": 3,
    "meaning": "Khóc",
    "radical": "口 (Khẩu)",
    "strokes": 10,
    "tip": "Hai chữ 口 (hai mắt) ở trên + chữ 犬 (4 nét, nhớ chấm góc trên phải!) ở dưới."
  },
  {
    "char": "笑",
    "pinyin": "xiào",
    "hv": "Tiếu",
    "level": 3,
    "meaning": "Cười",
    "radical": "竹 (Trúc)",
    "strokes": 10,
    "tip": "Trên là bộ Trúc ⺮ (6 nét), dưới là chữ 夭 (4 nét: phẩy đầu + 大)."
  },
  {
    "char": "踢",
    "pinyin": "tī",
    "hv": "Thích",
    "level": 3,
    "meaning": "Đá (bóng)",
    "radical": "足 (Túc)",
    "strokes": 15,
    "tip": "Trái bộ Túc ⻊ (bàn chân, 7 nét), phải chữ 易 (8 nét)."
  },
  {
    "char": "跑",
    "pinyin": "pǎo",
    "hv": "Bào",
    "level": 3,
    "meaning": "Chạy bộ",
    "radical": "足 (Túc)",
    "strokes": 12,
    "tip": "Trái bộ Túc ⻊ (7 nét), phải chữ 包 (5 nét)."
  },
  {
    "char": "照",
    "pinyin": "zhào",
    "hv": "Chiếu",
    "level": 3,
    "meaning": "Chụp ảnh, chiếu sáng, chăm sóc",
    "radical": "火 (Hỏa)",
    "strokes": 13,
    "tip": "Trên là 昭 (日+刀+口, 9 nét), dưới là 4 chấm hỏa 灬 (4 nét)."
  },
  {
    "char": "练",
    "pinyin": "liàn",
    "hv": "Luyện",
    "level": 3,
    "meaning": "Luyện tập (练习)",
    "radical": "纟 (Mịch)",
    "strokes": 8,
    "tip": "Trái bộ Mịch 纟 (3 nét), phải là 东 biến thể (5 nét: ngang, phẩy gập, ngang gập móc, phẩy, chấm)."
  },
  {
    "char": "习",
    "pinyin": "xí",
    "hv": "Tập",
    "level": 3,
    "meaning": "Học tập, ôn tập (学习)",
    "radical": "乙 (Ất)",
    "strokes": 3,
    "tip": "Ngang gập móc → chấm → hất lên từ trái sang phải."
  },
  {
    "char": "准",
    "pinyin": "zhǔn",
    "hv": "Chuẩn",
    "level": 3,
    "meaning": "Chuẩn xác, chuẩn bị (准备)",
    "radical": "冫 (Băng)",
    "strokes": 10,
    "tip": "Trái bộ Hai chấm băng 冫 (2 nét — cẩn thận đừng viết thành 3 chấm thủy!), phải chữ 隹 (8 nét)."
  },
  {
    "char": "备",
    "pinyin": "bèi",
    "hv": "Bị",
    "level": 3,
    "meaning": "Chuẩn bị, dự phòng",
    "radical": "夂 (Truy)",
    "strokes": 8,
    "tip": "Trên là bộ Truy 夂 (3 nét), dưới là chữ 田 (5 nét)."
  },
  {
    "char": "健",
    "pinyin": "jiàn",
    "hv": "Kiện",
    "level": 3,
    "meaning": "Khỏe mạnh (健康)",
    "radical": "人 (Nhân)",
    "strokes": 10,
    "tip": "Trái bộ Nhân đứng 亻 (2 nét), phải chữ 建 (8 nét: viết 聿 trước, 廴 sau)."
  },
  {
    "char": "康",
    "pinyin": "kāng",
    "hv": "Khang",
    "level": 3,
    "meaning": "An khang, khỏe mạnh",
    "radical": "广 (Nghiễm)",
    "strokes": 11,
    "tip": "Viết mái 广 (3 nét) trước, phần lõi 隶 (8 nét) bên trong sau."
  },
  {
    "char": "瘦",
    "pinyin": "shòu",
    "hv": "Sấu",
    "level": 3,
    "meaning": "Gầy, ốm",
    "radical": "疒 (Nạch)",
    "strokes": 14,
    "tip": "Viết bộ Nạch 疒 (5 nét) bao ngoài trước, viết 叟 (9 nét) bên trong sau."
  },
  {
    "char": "胖",
    "pinyin": "pàng",
    "hv": "Bàn",
    "level": 3,
    "meaning": "Béo, mập",
    "radical": "月 (Nguyệt)",
    "strokes": 9,
    "tip": "Trái bộ Nhục nguyệt 月 (cơ thể, 4 nét), phải chữ 半 (một nửa, 5 nét)."
  },
  {
    "char": "决",
    "pinyin": "jué",
    "hv": "Quyết",
    "level": 3,
    "meaning": "Quyết định (决定)",
    "radical": "冫 (Băng)",
    "strokes": 6,
    "tip": "Trái bộ Hai chấm băng 冫 (2 nét), phải chữ 夬 (4 nét)."
  },
  {
    "char": "定",
    "pinyin": "dìng",
    "hv": "Định",
    "level": 3,
    "meaning": "Định sẵn, nhất định (一定)",
    "radical": "宀 (Miên)",
    "strokes": 8,
    "tip": "Mái 宀 (3 nét) trên đầu → ngang → sổ → ngang ngắn → phẩy → mác dài."
  },
  {
    "char": "帮",
    "pinyin": "bāng",
    "hv": "Bang",
    "level": 3,
    "meaning": "Giúp đỡ (帮忙)",
    "radical": "巾 (Cân)",
    "strokes": 9,
    "tip": "Trên là 邦 (丰 + 阝, 6 nét), dưới là bộ 巾 (khăn vải, 3 nét)."
  },
  {
    "char": "信",
    "pinyin": "xìn",
    "hv": "Tín",
    "level": 3,
    "meaning": "Thư từ, tin tưởng (相信)",
    "radical": "人 (Nhân)",
    "strokes": 9,
    "tip": "Trái bộ Nhân đứng 亻 (2 nét), phải chữ 言 (lời nói, 7 nét) — lời con người nói ra phải đáng tin."
  }
];

  const reorderTasks = [
  {
    "id": "r3_01",
    "level": 3,
    "words": [
      "房间",
      "把",
      "打扫",
      "我",
      "干净",
      "了"
    ],
    "answer": "我把房间打扫干净了。",
    "pinyin": "Wǒ bǎ fángjiān dǎsǎo gānjìng le.",
    "vi": "Tôi đã dọn dẹp phòng sạch sẽ rồi.",
    "exp": "Câu chữ 把: Chủ ngữ (我) + 把 + Tân ngữ (房间) + Động từ (打扫) + Bổ ngữ kết quả (干净) + 了."
  },
  {
    "id": "r3_02",
    "level": 3,
    "words": [
      "一边",
      "音乐",
      "听",
      "一边",
      "他",
      "做作业"
    ],
    "answer": "他一边听音乐一边做作业。",
    "pinyin": "Tā yìbiān tīng yīnyuè yìbiān zuò zuòyè.",
    "vi": "Anh ấy vừa nghe nhạc vừa làm bài tập.",
    "exp": "Cấu trúc '一边 V1 一边 V2' diễn tả hai hành động xảy ra đồng thời."
  },
  {
    "id": "r3_03",
    "level": 3,
    "words": [
      "汉语",
      "的",
      "越来越",
      "好",
      "她",
      "说得"
    ],
    "answer": "她的汉语说得越来越好。",
    "pinyin": "Tā de Hànyǔ shuō de yuèláiyuè hǎo.",
    "vi": "Tiếng Hán của cô ấy nói ngày càng tốt.",
    "exp": "Bổ ngữ trạng thái 'V + 得 + 越来越 + Tính từ' diễn tả mức độ tăng dần theo thời gian."
  },
  {
    "id": "r3_04",
    "level": 3,
    "words": [
      "今天",
      "比",
      "冷",
      "昨天",
      "一点儿"
    ],
    "answer": "今天比昨天冷一点儿。",
    "pinyin": "Jīntiān bǐ zuótiān lěng yìdiǎnr.",
    "vi": "Hôm nay lạnh hơn hôm qua một chút.",
    "exp": "Câu so sánh hơn 'A 比 B + Tính từ + 一点儿' (không dùng 很 trước tính từ)."
  },
  {
    "id": "r3_05",
    "level": 3,
    "words": [
      "虽然",
      "但是",
      "下雨",
      "了",
      "去",
      "我还是",
      "了"
    ],
    "answer": "虽然下雨了，但是我还是去了。",
    "pinyin": "Suīrán xiàyǔ le, dànshì wǒ háishì qù le.",
    "vi": "Tuy trời mưa rồi, nhưng tôi vẫn đi.",
    "exp": "Cặp liên từ nhượng bộ '虽然…但是…' (Tuy… nhưng…), kết hợp phó từ 还是 (vẫn)."
  },
  {
    "id": "r3_06",
    "level": 3,
    "words": [
      "刚才",
      "被",
      "哥哥",
      "喝完",
      "牛奶",
      "了"
    ],
    "answer": "牛奶刚才被哥哥喝完了。",
    "pinyin": "Niúnǎi gāngcái bèi gēge hēwán le.",
    "vi": "Sữa vừa nãy đã bị anh trai uống hết rồi.",
    "exp": "Câu bị động chữ 被: Đối tượng chịu tác động (牛奶) + Thời gian (刚才) + 被 + Tác nhân (哥哥) + Động từ + Bổ ngữ (喝完了)."
  },
  {
    "id": "r3_07",
    "level": 3,
    "words": [
      "先",
      "回家",
      "我们",
      "吃饭",
      "再",
      "吧"
    ],
    "answer": "我们先吃饭再回家吧。",
    "pinyin": "Wǒmen xiān chīfàn zài huíjiā ba.",
    "vi": "Chúng ta ăn cơm trước rồi hãy về nhà nhé.",
    "exp": "Cấu trúc trình tự thời gian '先…再…' (làm gì trước, rồi mới làm gì sau)."
  },
  {
    "id": "r3_08",
    "level": 3,
    "words": [
      "中国",
      "历史",
      "非常",
      "他",
      "对",
      "感兴趣"
    ],
    "answer": "他对中国历史非常感兴趣。",
    "pinyin": "Tā duì Zhōngguó lìshǐ fēicháng gǎn xìngqù.",
    "vi": "Anh ấy rất có hứng thú với lịch sử Trung Quốc.",
    "exp": "Cụm cố định '对 + Danh từ + 感兴趣' (có hứng thú với cái gì)."
  },
  {
    "id": "r3_09",
    "level": 3,
    "words": [
      "机场",
      "去",
      "我们",
      "坐",
      "打算",
      "出租车"
    ],
    "answer": "我们打算坐出租车去机场。",
    "pinyin": "Wǒmen dǎsuàn zuò chūzūchē qù jīchǎng.",
    "vi": "Chúng tôi dự định đi taxi ra sân bay.",
    "exp": "Câu liên động với '打算' (dự định): Chủ ngữ + 打算 + Phương tiện (坐出租车) + Mục đích (去机场)."
  },
  {
    "id": "r3_10",
    "level": 3,
    "words": [
      "因为",
      "所以",
      "堵车",
      "迟到",
      "我",
      "了"
    ],
    "answer": "因为堵车，所以我迟到了。",
    "pinyin": "Yīnwèi dǔchē, suǒyǐ wǒ chídào le.",
    "vi": "Vì tắc đường nên tôi đã đến muộn.",
    "exp": "Cặp liên từ nhân quả '因为…所以…' (Bởi vì… cho nên…)."
  },
  {
    "id": "r3_11",
    "level": 3,
    "words": [
      "借回来",
      "妹妹",
      "两本书",
      "从图书馆"
    ],
    "answer": "妹妹从图书馆借回来两本书。",
    "pinyin": "Mèimei cóng túshūguǎn jiè huílái liǎng běn shū.",
    "vi": "Em gái đã mượn từ thư viện về hai quyển sách.",
    "exp": "Bổ ngữ xu hướng kép 'V + 回来' (借回来: mượn về) kết hợp cụm giới từ chỉ nơi chốn '从 + Địa điểm + Động từ'."
  },
  {
    "id": "r3_12",
    "level": 3,
    "words": [
      "语法",
      "听懂",
      "讲的",
      "都",
      "老师",
      "我",
      "了"
    ],
    "answer": "老师讲的语法我都听懂了。",
    "pinyin": "Lǎoshī jiǎng de yǔfǎ wǒ dōu tīngdǒng le.",
    "vi": "Ngữ pháp thầy giáo giảng tôi đều nghe hiểu rồi.",
    "exp": "Bổ ngữ kết quả '听懂' (nghe hiểu), kết hợp cấu trúc nhấn mạnh tân ngữ đưa lên đầu câu với '都'."
  },
  {
    "id": "r3_13",
    "level": 3,
    "words": [
      "太小了",
      "黑板上的字",
      "看不清楚",
      "我"
    ],
    "answer": "黑板上的字太小了，我看不清楚。",
    "pinyin": "Hēibǎn shàng de zì tài xiǎo le, wǒ kàn bù qīngchu.",
    "vi": "Chữ trên bảng đen nhỏ quá, tôi nhìn không rõ.",
    "exp": "Bổ ngữ khả năng dạng phủ định 'V + 不 + Bổ ngữ' (看不清楚: nhìn không rõ) đi với cụm nguyên nhân '太…了'."
  },
  {
    "id": "r3_14",
    "level": 3,
    "words": [
      "寄出去",
      "把",
      "请帮我",
      "这封信"
    ],
    "answer": "请帮我把这封信寄出去。",
    "pinyin": "Qǐng bāng wǒ bǎ zhè fēng xìn jì chūqù.",
    "vi": "Xin hãy giúp tôi gửi bức thư này đi.",
    "exp": "Câu chữ 把 kết hợp bổ ngữ xu hướng '出去' (寄出去: gửi đi) và câu cầu khiến '请帮我…'."
  },
  {
    "id": "r3_15",
    "level": 3,
    "words": [
      "喝",
      "每天早上",
      "妈妈",
      "牛奶",
      "让我",
      "一杯"
    ],
    "answer": "妈妈让我每天早上喝一杯牛奶。",
    "pinyin": "Māma ràng wǒ měitiān zǎoshang hē yì bēi niúnǎi.",
    "vi": "Mẹ bảo tôi mỗi sáng uống một cốc sữa bò.",
    "exp": "Câu kiêm ngữ với động từ sai khiến '让': Chủ ngữ 1 (妈妈) + 让 + Kiêm ngữ (我) + Vị ngữ của kiêm ngữ (每天早上喝一杯牛奶)."
  },
  {
    "id": "r3_16",
    "level": 3,
    "words": [
      "一样",
      "今天的天气",
      "暖和",
      "昨天",
      "跟"
    ],
    "answer": "今天的天气跟昨天一样暖和。",
    "pinyin": "Jīntiān de tiānqì gēn zuótiān yíyàng nuǎnhuo.",
    "vi": "Thời tiết hôm nay ấm áp giống như hôm qua.",
    "exp": "Câu so sánh bằng: 'A 跟 B 一样 + Tính từ' (A giống với B ở điểm nào đó)."
  },
  {
    "id": "r3_17",
    "level": 3,
    "words": [
      "越下越大",
      "我们",
      "雨",
      "快回家吧"
    ],
    "answer": "雨越下越大，我们快回家吧。",
    "pinyin": "Yǔ yuè xià yuè dà, wǒmen kuài huíjiā ba.",
    "vi": "Mưa càng rơi càng to, chúng ta mau về nhà thôi.",
    "exp": "Cấu trúc '越 V 越 Adj' diễn tả mức độ tăng tiến đồng thời với quá trình hành động."
  },
  {
    "id": "r3_18",
    "level": 3,
    "words": [
      "快要",
      "我们",
      "火车",
      "快点儿走吧",
      "开了"
    ],
    "answer": "火车快要开了，我们快点儿走吧。",
    "pinyin": "Huǒchē kuàiyào kāi le, wǒmen kuàidiǎnr zǒu ba.",
    "vi": "Tàu hỏa sắp chạy rồi, chúng ta đi nhanh một chút nhé.",
    "exp": "Cấu trúc biểu thị sự việc sắp xảy ra trong thời gian rất gần: '快要 + Động từ + 了'."
  },
  {
    "id": "r3_19",
    "level": 3,
    "words": [
      "学习",
      "已经",
      "两年半",
      "我",
      "汉语",
      "了"
    ],
    "answer": "我学习汉语已经两年半了。",
    "pinyin": "Wǒ xuéxí Hànyǔ yǐjīng liǎng nián bàn le.",
    "vi": "Tôi đã học tiếng Hán được hai năm rưỡi rồi.",
    "exp": "Bổ ngữ thời lượng khi có tân ngữ: 'Động từ + Tân ngữ + (已经) + Khoảng thời gian + 了' (có '了' cuối câu chỉ hành động vẫn tiếp diễn)."
  },
  {
    "id": "r3_20",
    "level": 3,
    "words": [
      "漂亮的花",
      "放着",
      "桌子上",
      "一束"
    ],
    "answer": "桌子上放着一束漂亮的花。",
    "pinyin": "Zhuōzi shàng fàngzhe yí shù piàoliang de huā.",
    "vi": "Trên bàn đang đặt một bó hoa xinh đẹp.",
    "exp": "Câu tồn hiện với '着': 'Địa điểm + Động từ + 着 + Danh từ không xác định (số từ + lượng từ + danh từ)'."
  },
  {
    "id": "r4_01",
    "level": 4,
    "words": [
      "除了",
      "以外",
      "汉语",
      "英语",
      "还会说",
      "她"
    ],
    "answer": "除了汉语以外，她还会说英语。",
    "pinyin": "Chúle Hànyǔ yǐwài, tā hái huì shuō Yīngyǔ.",
    "vi": "Ngoài tiếng Hán ra, cô ấy còn biết nói tiếng Anh.",
    "exp": "Cấu trúc '除了…以外，…还…' mang nghĩa bao gồm thêm ('ngoài A ra, còn B')."
  },
  {
    "id": "r4_02",
    "level": 4,
    "words": [
      "只要",
      "努力",
      "就",
      "一定",
      "能成功",
      "坚持"
    ],
    "answer": "只要坚持努力，就一定能成功。",
    "pinyin": "Zhǐyào jiānchí nǔlì, jiù yídìng néng chénggōng.",
    "vi": "Chỉ cần kiên trì nỗ lực thì nhất định có thể thành công.",
    "exp": "Câu điều kiện đủ '只要…就…' (Chỉ cần… thì…)."
  },
  {
    "id": "r4_03",
    "level": 4,
    "words": [
      "不仅",
      "聪明",
      "而且",
      "很",
      "工作",
      "小李",
      "认真"
    ],
    "answer": "小李不仅聪明，而且工作很认真。",
    "pinyin": "Xiǎo Lǐ bùjǐn cōngming, érqiě gōngzuò hěn rènzhēn.",
    "vi": "Tiểu Lý không những thông minh mà làm việc còn rất chăm chỉ.",
    "exp": "Liên từ tăng tiến '不仅…而且…' (Không những… mà còn…)."
  },
  {
    "id": "r4_04",
    "level": 4,
    "words": [
      "把",
      "护照",
      "在",
      "他",
      "忘",
      "酒店里了"
    ],
    "answer": "他把护照忘在酒店里了。",
    "pinyin": "Tā bǎ hùzhào wàng zài jiǔdiàn lǐ le.",
    "vi": "Anh ấy để quên hộ chiếu ở trong khách sạn rồi.",
    "exp": "Động từ 忘 dùng trong câu chữ 把 kết hợp bổ ngữ kết quả 在: '把 + Vật + 忘在 + Địa điểm + 了'."
  },
  {
    "id": "r4_05",
    "level": 4,
    "words": [
      "养成",
      "早睡早起",
      "的",
      "好习惯",
      "我们",
      "应该"
    ],
    "answer": "我们应该养成早睡早起的好习惯。",
    "pinyin": "Wǒmen yīnggāi yǎngchéng zǎoshuì zǎoqǐ de hǎo xíguàn.",
    "vi": "Chúng ta nên rèn luyện thói quen tốt ngủ sớm dậy sớm.",
    "exp": "Cụm kết hợp chuẩn HSK 4: '养成…的好习惯' (hình thành thói quen tốt…)."
  },
  {
    "id": "r4_06",
    "level": 4,
    "words": [
      "竟然",
      "这件事情",
      "连",
      "都",
      "不知道",
      "他"
    ],
    "answer": "这件事情连他竟然都不知道。",
    "pinyin": "Zhè jiàn shìqing lián tā jìngrán dōu bù zhīdào.",
    "vi": "Chuyện này ngay cả anh ấy vậy mà cũng không biết.",
    "exp": "Cấu trúc nhấn mạnh '连…都…' kết hợp phó từ '竟然' (ngạc nhiên, không ngờ)."
  },
  {
    "id": "r4_07",
    "level": 4,
    "words": [
      "关于",
      "这个",
      "问题",
      "大家",
      "讨论了",
      "很久"
    ],
    "answer": "关于这个问题，大家讨论了很久。",
    "pinyin": "Guānyú zhège wèntí, dàjiā tǎolùn le hěn jiǔ.",
    "vi": "Về vấn đề này, mọi người đã thảo luận rất lâu.",
    "exp": "Giới từ '关于 + Chủ đề' đặt đầu câu để nêu phạm vi thảo luận."
  },
  {
    "id": "r4_08",
    "level": 4,
    "words": [
      "无论",
      "天气",
      "多么",
      "恶劣",
      "按时",
      "出发",
      "我们都"
    ],
    "answer": "无论天气多么恶劣，我们都按时出发。",
    "pinyin": "Wúlùn tiānqì duōme èliè, wǒmen dōu ànshí chūfā.",
    "vi": "Bất kể thời tiết khắc nghiệt thế nào, chúng tôi đều xuất phát đúng giờ.",
    "exp": "Cấu trúc vô điều kiện '无论…多么…，都…' (Bất kể… thế nào, đều…)."
  },
  {
    "id": "r4_09",
    "level": 4,
    "words": [
      "随着",
      "经济的",
      "发展",
      "人们的生活",
      "越来越",
      "方便"
    ],
    "answer": "随着经济的发展，人们的生活越来越方便。",
    "pinyin": "Suízhe jīngjì de fāzhǎn, rénmen de shēnghuó yuèláiyuè fāngbiàn.",
    "vi": "Cùng với sự phát triển của kinh tế, cuộc sống của mọi người ngày càng thuận tiện.",
    "exp": "Giới từ '随着 + Cụm danh từ' (Cùng với / Theo đà…) mở đầu mệnh đề bối cảnh."
  },
  {
    "id": "r4_10",
    "level": 4,
    "words": [
      "难道",
      "你",
      "不想",
      "参加",
      "这次",
      "活动",
      "吗"
    ],
    "answer": "难道你不想参加这次活动吗？",
    "pinyin": "Nándào nǐ bù xiǎng cānjiā zhè cì huódòng ma?",
    "vi": "Chẳng lẽ bạn không muốn tham gia hoạt động lần này sao?",
    "exp": "Câu phản vấn '难道…吗？' nhấn mạnh sự ngạc nhiên hoặc khẳng định ngầm."
  },
  {
    "id": "r4_11",
    "level": 4,
    "words": [
      "才能",
      "认真复习",
      "好成绩",
      "只有",
      "考出"
    ],
    "answer": "只有认真复习，才能考出好成绩。",
    "pinyin": "Zhǐyǒu rènzhēn fùxí, cái néng kǎochū hǎo chéngjì.",
    "vi": "Chỉ có ôn tập nghiêm túc mới có thể thi đạt thành tích tốt.",
    "exp": "Cặp liên từ điều kiện duy nhất '只有…，才…' (Chỉ có… mới…)."
  },
  {
    "id": "r4_12",
    "level": 4,
    "words": [
      "他还是",
      "任务",
      "按时完成了",
      "尽管",
      "很重"
    ],
    "answer": "尽管任务很重，他还是按时完成了。",
    "pinyin": "Jǐnguǎn rènwu hěn zhòng, tā háishì ànshí wánchéng le.",
    "vi": "Mặc dù nhiệm vụ rất nặng nề, anh ấy vẫn hoàn thành đúng hạn.",
    "exp": "Cặp liên từ nhượng bộ '尽管…，还是…' (Mặc dù…, nhưng vẫn…)."
  },
  {
    "id": "r4_13",
    "level": 4,
    "words": [
      "大家都",
      "以外",
      "小王",
      "去过北京了",
      "除了"
    ],
    "answer": "除了小王以外，大家都去过北京了。",
    "pinyin": "Chúle Xiǎo Wáng yǐwài, dàjiā dōu qùguo Běijīng le.",
    "vi": "Ngoại trừ Tiểu Vương ra, mọi người đều đã từng đến Bắc Kinh rồi.",
    "exp": "Cấu trúc '除了…以外，…都…' mang nghĩa loại trừ (trừ A ra, tất cả những đối tượng còn lại đều…)."
  },
  {
    "id": "r4_14",
    "level": 4,
    "words": [
      "被",
      "那本有趣的",
      "借走了",
      "小说",
      "朋友"
    ],
    "answer": "那本有趣的小说被朋友借走了。",
    "pinyin": "Nà běn yǒuqù de xiǎoshuō bèi péngyou jièzǒu le.",
    "vi": "Quyển tiểu thuyết thú vị kia đã bị bạn mượn đi mất rồi.",
    "exp": "Câu bị động chữ 被 với cụm danh từ làm chủ ngữ và bổ ngữ xu hướng '借走' (mượn đi)."
  },
  {
    "id": "r4_15",
    "level": 4,
    "words": [
      "使",
      "非常兴奋",
      "大家都",
      "感到",
      "这个好消息"
    ],
    "answer": "这个好消息使大家都感到非常兴奋。",
    "pinyin": "Zhège hǎo xiāoxi shǐ dàjiā dōu gǎndào fēicháng xīngfèn.",
    "vi": "Tin tốt này khiến mọi người đều cảm thấy vô cùng phấn khởi.",
    "exp": "Câu kiêm ngữ gây khiến với '使' (khiến cho): 'Nguyên nhân + 使 + Đối tượng + Cảm xúc/Trạng thái'."
  },
  {
    "id": "r4_16",
    "level": 4,
    "words": [
      "就",
      "既然",
      "勇敢去做吧",
      "已经决定了",
      "你"
    ],
    "answer": "既然你已经决定了，就勇敢去做吧。",
    "pinyin": "Jìrán nǐ yǐjīng juédìng le, jiù yǒnggǎn qù zuò ba.",
    "vi": "Đã như vậy (một khi) bạn đã quyết định rồi thì hãy dũng cảm đi làm đi.",
    "exp": "Cặp liên từ suy luận '既然…，就…' (Một khi đã… thì…), dựa trên sự thật đã xác định ở vế trước."
  },
  {
    "id": "r4_17",
    "level": 4,
    "words": [
      "懒惰",
      "而是因为",
      "他迟到",
      "生病了",
      "不是因为"
    ],
    "answer": "他迟到不是因为懒惰，而是因为生病了。",
    "pinyin": "Tā chídào bú shì yīnwèi lǎnduò, érshì yīnwèi shēngbìng le.",
    "vi": "Anh ấy đến muộn không phải vì lười biếng, mà là vì bị ốm rồi.",
    "exp": "Cặp liên từ đối lập khẳng định '不是…，而是…' (Không phải…, mà là…)."
  },
  {
    "id": "r4_18",
    "level": 4,
    "words": [
      "省钱",
      "很环保",
      "一方面",
      "骑自行车",
      "另一方面"
    ],
    "answer": "骑自行车一方面省钱，另一方面很环保。",
    "pinyin": "Qí zìxíngchē yì fāngmiàn shěngqián, lìng yì fāngmiàn hěn huánbǎo.",
    "vi": "Đi xe đạp một mặt tiết kiệm tiền, mặt khác rất bảo vệ môi trường.",
    "exp": "Cấu trúc song song nêu hai khía cạnh '一方面…，另一方面…' (Một mặt…, mặt khác…)."
  },
  {
    "id": "r4_19",
    "level": 4,
    "words": [
      "也不会",
      "即使",
      "再大的困难",
      "放弃",
      "遇到",
      "我"
    ],
    "answer": "即使遇到再大的困难，我也不会放弃。",
    "pinyin": "Jíshǐ yùdào zài dà de kùnnan, wǒ yě bú huì fàngqì.",
    "vi": "Cho dù gặp phải khó khăn lớn đến đâu, tôi cũng sẽ không bỏ cuộc.",
    "exp": "Cấu trúc giả thiết nhượng bộ '即使…，也…' (Cho dù…, cũng…)."
  },
  {
    "id": "r4_20",
    "level": 4,
    "words": [
      "没来得及",
      "时间太紧",
      "吃早饭",
      "由于",
      "他"
    ],
    "answer": "由于时间太紧，他没来得及吃早饭。",
    "pinyin": "Yóuyú shíjiān tài jǐn, tā méi láidejí chī zǎofàn.",
    "vi": "Do thời gian quá gấp gáp nên anh ấy không kịp ăn sáng.",
    "exp": "Giới từ chỉ nguyên nhân trang trọng '由于' (do) kết hợp cụm động từ HSK 4 '没来得及 + V' (không kịp làm gì)."
  }
];

  const pinyinWriteTasks = [
  {
    "id": "pw1_01",
    "level": 1,
    "before": "请问，你叫什么名",
    "after": "？",
    "targetPy": "zi",
    "answer": "字",
    "answerPy": "zì",
    "fullZh": "请问，你叫什么名字？",
    "fullPy": "Qǐngwèn, nǐ jiào shénme míngzi?",
    "vi": "Xin hỏi, bạn tên là gì?",
    "hint": "Mái nhà 宀 (3 nét) ở trên, chữ 子 (đứa trẻ, 3 nét) ở dưới.",
    "exp": "Danh từ '名字' (tên); chữ '字' (zì) nghĩa là chữ viết, đọc thanh nhẹ khi ghép sau 名."
  },
  {
    "id": "pw1_02",
    "level": 1,
    "before": "今天天气很",
    "after": "，我们去公园吧。",
    "targetPy": "hǎo",
    "answer": "好",
    "answerPy": "hǎo",
    "fullZh": "今天天气很好，我们去公园吧。",
    "fullPy": "Jīntiān tiānqì hěn hǎo, wǒmen qù gōngyuán ba.",
    "vi": "Hôm nay thời tiết rất đẹp, chúng ta đi công viên nhé.",
    "hint": "Trái là bộ Nữ 女 (3 nét), phải là chữ Tử 子 (3 nét).",
    "exp": "Tính từ cốt lõi HSK 1 '好' (tốt, đẹp, khỏe), ghép trực tiếp với phó từ mức độ 很."
  },
  {
    "id": "pw1_03",
    "level": 1,
    "before": "我是越南人，我在",
    "after": "汉语。",
    "targetPy": "xué",
    "answer": "学",
    "answerPy": "xué",
    "fullZh": "我是越南人，我在学汉语。",
    "fullPy": "Wǒ shì Yuènán rén, wǒ zài xué Hànyǔ.",
    "vi": "Tôi là người Việt Nam, tôi đang học tiếng Trung.",
    "hint": "Ba nét chấm trên đầu + mái mịch 冖 + chữ 子 ở dưới (8 nét).",
    "exp": "Động từ '学' (học) đứng sau 在 diễn tả hành động đang diễn ra."
  },
  {
    "id": "pw1_04",
    "level": 1,
    "before": "我想",
    "after": "一杯热茶。",
    "targetPy": "hē",
    "answer": "喝",
    "answerPy": "hē",
    "fullZh": "我想喝一杯热茶。",
    "fullPy": "Wǒ xiǎng hē yì bēi rè chá.",
    "vi": "Tôi muốn uống một cốc trà nóng.",
    "hint": "Bộ Khẩu 口 (miệng) bên trái + chữ 曷 bên phải.",
    "exp": "Động từ '喝' (uống) luôn đi với đồ uống như 茶, 水, 咖啡, 牛奶."
  },
  {
    "id": "pw1_05",
    "level": 1,
    "before": "妈妈在厨房",
    "after": "中国菜。",
    "targetPy": "zuò",
    "answer": "做",
    "answerPy": "zuò",
    "fullZh": "妈妈在厨房做中国菜。",
    "fullPy": "Māma zài chúfáng zuò Zhōngguó cài.",
    "vi": "Mẹ đang nấu món Trung Quốc trong bếp.",
    "hint": "Trái bộ Nhân đứng 亻, giữa chữ 古 (cổ), phải bộ Phộc 攵.",
    "exp": "'做菜 / 做饭' là cụm động từ cố định nghĩa là nấu món ăn / nấu cơm."
  },
  {
    "id": "pw1_06",
    "level": 1,
    "before": "这本书多少",
    "after": "？",
    "targetPy": "qián",
    "answer": "钱",
    "answerPy": "qián",
    "fullZh": "这本书多少钱？",
    "fullPy": "Zhè běn shū duōshao qián?",
    "vi": "Quyển sách này bao nhiêu tiền?",
    "hint": "Trái bộ Kim 钅 (kim loại, 5 nét), phải chữ 戋 (hai nét ngang + 戈).",
    "exp": "Mẫu hỏi giá cơ bản nhất HSK 1: 'Danh từ + 多少钱？'."
  },
  {
    "id": "pw1_07",
    "level": 1,
    "before": "我的手机在桌子",
    "after": "面。",
    "targetPy": "shàng",
    "answer": "上",
    "answerPy": "shàng",
    "fullZh": "我的手机在桌子上面。",
    "fullPy": "Wǒ de shǒujī zài zhuōzi shàngmiàn.",
    "vi": "Điện thoại của tôi ở trên mặt bàn.",
    "hint": "Gồm 3 nét: sổ thẳng → ngang ngắn giữa → ngang dài ở đáy.",
    "exp": "Phương vị từ '上面' (bên trên) đặt sau danh từ chỉ vật làm mốc vị trí."
  },
  {
    "id": "pw1_08",
    "level": 1,
    "before": "明天是",
    "after": "期一，我们要上课。",
    "targetPy": "xīng",
    "answer": "星",
    "answerPy": "xīng",
    "fullZh": "明天是星期一，我们要上课。",
    "fullPy": "Míngtiān shì xīngqīyī, wǒmen yào shàngkè.",
    "vi": "Ngày mai là thứ Hai, chúng ta phải lên lớp.",
    "hint": "Trên là bộ Nhật 日 (mặt trời, 4 nét), dưới là chữ 生 (sinh, 5 nét).",
    "exp": "Thứ trong tuần ghép theo mẫu '星期 + số 1–6' (Chủ nhật là 星期日/天)."
  },
  {
    "id": "pw1_09",
    "level": 1,
    "before": "她很喜",
    "after": "听音乐和看电影。",
    "targetPy": "huan",
    "answer": "欢",
    "answerPy": "huān",
    "fullZh": "她很喜欢听音乐和看电影。",
    "fullPy": "Tā hěn xǐhuan tīng yīnyuè hé kàn diànyǐng.",
    "vi": "Cô ấy rất thích nghe nhạc và xem phim.",
    "hint": "Trái bộ Hựu 又 (2 nét), phải bộ Khiếm 欠 (4 nét).",
    "exp": "Động từ tâm lý '喜欢' (thích) kết hợp tốt với phó từ mức độ 很 / 非常."
  },
  {
    "id": "pw1_10",
    "level": 1,
    "before": "我很高兴",
    "after": "识你！",
    "targetPy": "rèn",
    "answer": "认",
    "answerPy": "rèn",
    "fullZh": "我很高兴认识你！",
    "fullPy": "Wǒ hěn gāoxìng rènshi nǐ!",
    "vi": "Tôi rất vui được quen biết bạn!",
    "hint": "Trái bộ Ngôn 讠 (2 nét), phải chữ 人 (2 nét) — nói chuyện để nhận ra nhau.",
    "exp": "Cụm chào hỏi kinh điển: '认识你很高兴' hoặc '我很高兴认识你'."
  },
  {
    "id": "pw2_01",
    "level": 2,
    "before": "明天早上八点，我",
    "after": "你去机场。",
    "targetPy": "sòng",
    "answer": "送",
    "answerPy": "sòng",
    "fullZh": "明天早上八点，我送你去机场。",
    "fullPy": "Míngtiān zǎoshang bā diǎn, wǒ sòng nǐ qù jīchǎng.",
    "vi": "8 giờ sáng mai tôi tiễn bạn ra sân bay.",
    "hint": "Chữ 关 (6 nét) bên trong + bộ Sước 辶 (3 nét) bao trái dưới.",
    "exp": "Động từ '送' vừa nghĩa là 'tặng quà', vừa nghĩa là 'đưa tiễn ai đó đến đâu'."
  },
  {
    "id": "pw2_02",
    "level": 2,
    "before": "请问，去火车站怎么",
    "after": "？",
    "targetPy": "zǒu",
    "answer": "走",
    "answerPy": "zǒu",
    "fullZh": "请问，去火车站怎么走？",
    "fullPy": "Qǐngwèn, qù huǒchēzhàn zěnme zǒu?",
    "vi": "Xin hỏi, đi đến ga tàu hỏa đi đường nào ạ?",
    "hint": "Trên là bộ Thổ 土 (3 nét), dưới là phần chân 龰 (4 nét).",
    "exp": "Mẫu hỏi đường chuẩn giao tiếp HSK 2: '去 + Địa điểm + 怎么走？'."
  },
  {
    "id": "pw2_03",
    "level": 2,
    "before": "今天比昨天",
    "after": "多了，快穿外套吧。",
    "targetPy": "lěng",
    "answer": "冷",
    "answerPy": "lěng",
    "fullZh": "今天比昨天冷多了，快穿外套吧。",
    "fullPy": "Jīntiān bǐ zuótiān lěng duō le, kuài chuān wàitào ba.",
    "vi": "Hôm nay lạnh hơn hôm qua nhiều, mau mặc áo khoác đi.",
    "hint": "Trái bộ Hai chấm băng 冫 (2 nét, băng giá), phải chữ 令 (5 nét).",
    "exp": "Câu so sánh 'A 比 B + Tính từ + 多了' nhấn mạnh mức độ chênh lệch lớn."
  },
  {
    "id": "pw2_04",
    "level": 2,
    "before": "你每天晚上几点",
    "after": "觉？",
    "targetPy": "shuì",
    "answer": "睡",
    "answerPy": "shuì",
    "fullZh": "你每天晚上几点睡觉？",
    "fullPy": "Nǐ měitiān wǎnshang jǐ diǎn shuìjiào?",
    "vi": "Mỗi tối bạn đi ngủ lúc mấy giờ?",
    "hint": "Trái bộ Mục 目 (mắt, 5 nét), phải chữ 垂 (rủ xuống, 8 nét) — mí mắt rủ xuống là ngủ.",
    "exp": "'睡觉' (shuìjiào) là động từ ly hợp, lưu ý chữ 觉 ở đây đọc là jiào."
  },
  {
    "id": "pw2_05",
    "level": 2,
    "before": "这件白色的衣服很",
    "after": "，我要买它。",
    "targetPy": "piányi",
    "answer": "便宜",
    "answerPy": "piányi",
    "fullZh": "这件白色的衣服很便宜，我要买它。",
    "fullPy": "Zhè jiàn báisè de yīfu hěn piányi, wǒ yào mǎi tā.",
    "vi": "Chiếc áo màu trắng này rất rẻ, tôi muốn mua nó.",
    "hint": "便 = 亻 + 更; 宜 = mái 宀 + 且.",
    "exp": "Lưu ý đa âm: '便' trong '便宜' (rẻ) đọc pián, còn trong '方便' (tiện lợi) đọc biàn."
  },
  {
    "id": "pw2_06",
    "level": 2,
    "before": "房间里太暗了，请帮我",
    "after": "一下灯。",
    "targetPy": "kāi",
    "answer": "开",
    "answerPy": "kāi",
    "fullZh": "房间里太暗了，请帮我开一下灯。",
    "fullPy": "Fángjiān lǐ tài àn le, qǐng bāng wǒ kāi yíxià dēng.",
    "vi": "Trong phòng tối quá, làm ơn bật giúp tôi cái đèn chút.",
    "hint": "Hai nét ngang + phẩy trái + sổ thẳng phải (4 nét).",
    "exp": "Động từ '开' dùng cho bật đèn (开灯), mở cửa (开门), lái xe (开车)."
  },
  {
    "id": "pw2_07",
    "level": 2,
    "before": "我每天早上七点",
    "after": "床，然后去跑步。",
    "targetPy": "qǐ",
    "answer": "起",
    "answerPy": "qǐ",
    "fullZh": "我每天早上七点起床，然后去跑步。",
    "fullPy": "Wǒ měitiān zǎoshang qī diǎn qǐchuáng, ránhòu qù pǎobù.",
    "vi": "Mỗi sáng 7 giờ tôi thức dậy, sau đó đi chạy bộ.",
    "hint": "Bộ Tẩu 走 (7 nét) bao trái dưới + chữ 己 (3 nét, mở miệng) bên phải.",
    "exp": "'起床' (thức dậy rời giường) là động từ ly hợp quen thuộc ở HSK 2."
  },
  {
    "id": "pw2_08",
    "level": 2,
    "before": "虽然下雨了，但是我还是去",
    "after": "班了。",
    "targetPy": "shàng",
    "answer": "上",
    "answerPy": "shàng",
    "fullZh": "虽然下雨了，但是我还是去上班了。",
    "fullPy": "Suīrán xiàyǔ le, dànshì wǒ háishi qù shàngbān le.",
    "vi": "Tuy trời mưa nhưng tôi vẫn đi làm.",
    "hint": "Gồm 3 nét: sổ → ngang ngắn → ngang dài.",
    "exp": "Cụm '上班' (đi làm) đối lập với '下班' (tan làm), kết hợp cặp liên từ '虽然…但是…'."
  },
  {
    "id": "pw2_09",
    "level": 2,
    "before": "他每天都去游泳馆游",
    "after": "。",
    "targetPy": "yǒng",
    "answer": "泳",
    "answerPy": "yǒng",
    "fullZh": "他每天都去游泳馆游泳。",
    "fullPy": "Tā měitiān dōu qù yóuyǒngguǎn yóuyǒng.",
    "vi": "Ngày nào anh ấy cũng đến bể bơi để bơi.",
    "hint": "Trái bộ Ba chấm thủy 氵 (nước), phải chữ 永 (vĩnh cửu, 5 nét).",
    "exp": "'游泳' (bơi lội) gồm hai chữ đều có bộ Thủy 氵 ở bên trái."
  },
  {
    "id": "pw2_10",
    "level": 2,
    "before": "请慢一点儿说，我没听",
    "after": "。",
    "targetPy": "dǒng",
    "answer": "懂",
    "answerPy": "dǒng",
    "fullZh": "请慢一点儿说，我没听懂。",
    "fullPy": "Qǐng màn yìdiǎnr shuō, wǒ méi tīngdǒng.",
    "vi": "Xin hãy nói chậm một chút, tôi nghe chưa hiểu.",
    "hint": "Trái bộ Tâm đứng 忄 (3 nét), phải chữ 董 (bộ Thảo 艹 + 重).",
    "exp": "Bổ ngữ kết quả '听懂' (nghe hiểu), phủ định dùng '没听懂'."
  },
  {
    "id": "pw3_01",
    "level": 3,
    "before": "下课以后，我常去图书馆",
    "after": "书。",
    "targetPy": "jiè",
    "answer": "借",
    "answerPy": "jiè",
    "fullZh": "下课以后，我常去图书馆借书。",
    "fullPy": "Xiàkè yǐhòu, wǒ cháng qù túshūguǎn jiè shū.",
    "vi": "Sau khi tan học, tôi thường đến thư viện mượn sách.",
    "hint": "Gồm bộ Nhân đứng 亻 (người) bên trái và chữ 昔 (xưa) bên phải — người xưa cho nhau mượn đồ.",
    "exp": "Động từ '借' (mượn / cho mượn). Mẫu quen thuộc: '去图书馆借书' (đến thư viện mượn sách) hoặc '借给 + Ai' (cho ai mượn)."
  },
  {
    "id": "pw3_02",
    "level": 3,
    "before": "不好意思，我把你的电话号码",
    "after": "了。",
    "targetPy": "wàng",
    "answer": "忘",
    "answerPy": "wàng",
    "fullZh": "不好意思，我把你的电话号码忘了。",
    "fullPy": "Bù hǎoyìsi, wǒ bǎ nǐ de diànhuà hàomǎ wàng le.",
    "vi": "Ngại quá, tôi quên mất số điện thoại của bạn rồi.",
    "hint": "Trên là chữ 亡 (mất đi), dưới là bộ Tâm 心 (trái tim, trí nhớ) — mất khỏi tâm trí tức là quên.",
    "exp": "Động từ '忘' (quên) dùng rất nhiều trong câu chữ 把: '把 + Tân ngữ + 忘了'. Lưu ý phân biệt với '忙' (bận, bộ Tâm đứng bên trái)."
  },
  {
    "id": "pw3_03",
    "level": 3,
    "before": "天气这么好，我们出去",
    "after": "吧。",
    "targetPy": "sànbù",
    "answer": "散步",
    "answerPy": "sànbù",
    "fullZh": "天气这么好，我们出去散步吧。",
    "fullPy": "Tiānqì zhème hǎo, wǒmen chūqù sànbù ba.",
    "vi": "Thời tiết đẹp thế này, chúng ta ra ngoài tản bộ đi.",
    "hint": "Chữ 散 có bộ Phộc 攵 (tay cầm gậy nhỏ) ở bên phải; chữ 步 gồm chữ 止 (bàn chân) ở trên và phần 少 (thiếu một chấm) ở dưới.",
    "exp": "Động từ ly hợp '散步' (đi dạo, tản bộ). Có thể tách thành '散一会儿步' (đi dạo một lát)."
  },
  {
    "id": "pw3_04",
    "level": 3,
    "before": "这双鞋太小了，我想",
    "after": "一双大一点儿的。",
    "targetPy": "huàn",
    "answer": "换",
    "answerPy": "huàn",
    "fullZh": "这双鞋太小了，我想换一双大一点儿的。",
    "fullPy": "Zhè shuāng xié tài xiǎo le, wǒ xiǎng huàn yì shuāng dà yìdiǎnr de.",
    "vi": "Đôi giày này nhỏ quá, tôi muốn đổi một đôi to hơn một chút.",
    "hint": "Bên trái là bộ Thủ gẩy 扌 (bàn tay trao đổi), bên phải là chữ 奂.",
    "exp": "Động từ '换' (đổi, thay đổi). Các cụm HSK 3 hay gặp: '换钱' (đổi tiền), '换衣服' (thay quần áo), '换乘' (chuyển tuyến)."
  },
  {
    "id": "pw3_05",
    "level": 3,
    "before": "爸爸每天都很忙，经常",
    "after": "身体不舒服。",
    "targetPy": "juéde",
    "answer": "觉得",
    "answerPy": "juéde",
    "fullZh": "爸爸每天都很忙，经常觉得身体不舒服。",
    "fullPy": "Bàba měitiān dōu hěn máng, jīngcháng juéde shēntǐ bù shūfu.",
    "vi": "Bố ngày nào cũng rất bận, thường cảm thấy cơ thể không khỏe.",
    "hint": "Chữ 觉 có 3 chấm đầu + mái 冖 + bộ Kiến 见 (nhìn nhận); chữ 得 có bộ Xích 彳 (bước đi) bên trái.",
    "exp": "Động từ tri giác '觉得' (cảm thấy, cho rằng). Đằng sau thường là tính từ hoặc một mệnh đề nêu cảm nhận."
  },
  {
    "id": "pw3_06",
    "level": 3,
    "before": "这道数学题太难了，",
    "after": "我算了半天也没做出来。",
    "targetPy": "dànshì",
    "answer": "但是",
    "answerPy": "dànshì",
    "fullZh": "这道数学题太难了，但是我算了半天也没做出来。",
    "fullPy": "Zhè dào shùxué tí tài nán le, dànshì wǒ suàn le bàntiān yě méi zuò chūlái.",
    "vi": "Bài toán này khó quá, nhưng tôi tính nửa ngày rồi vẫn không làm ra.",
    "hint": "Chữ 但 gồm bộ Nhân đứng 亻 và chữ 旦 (mặt trời mọc trên đường chân trời); chữ 是 trên 日 dưới 疋 biến thể.",
    "exp": "Liên từ chuyển ngoặt '但是' (nhưng, thế nhưng), thường đứng đầu vế thứ hai sau dấu phẩy."
  },
  {
    "id": "pw3_07",
    "level": 3,
    "before": "房间里太热了，请把",
    "after": "打开吧。",
    "targetPy": "kōngtiáo",
    "answer": "空调",
    "answerPy": "kōngtiáo",
    "fullZh": "房间里太热了，请把空调打开吧。",
    "fullPy": "Fángjiān lǐ tài rè le, qǐng bǎ kōngtiáo dǎkāi ba.",
    "vi": "Trong phòng nóng quá, xin hãy bật điều hòa lên đi.",
    "hint": "Chữ 空 trên bộ Huyệt 穴 dưới chữ 工 (trống rỗng, không khí); chữ 调 bên trái bộ Ngôn 讠 bên phải chữ 周 (điều chỉnh).",
    "exp": "Danh từ '空调' (máy điều hòa không khí). Động từ đi kèm chuẩn: '开空调' / '把空调打开' (bật điều hòa), '关空调' (tắt điều hòa)."
  },
  {
    "id": "pw3_08",
    "level": 3,
    "before": "爷爷戴着老花镜，正在",
    "after": "报纸。",
    "targetPy": "kàn",
    "answer": "看",
    "answerPy": "kàn",
    "fullZh": "爷爷戴着老花镜，正在看报纸。",
    "fullPy": "Yéye dàizhe lǎohuājìng, zhèngzài kàn bàozhǐ.",
    "vi": "Ông nội đang đeo kính lão đọc báo.",
    "hint": "Trên là bàn tay 手 biến thể che trán, dưới là con mắt 目 — đưa tay lên che nắng để nhìn xa.",
    "exp": "Trong tiếng Trung, đọc sách/báo hay xem tivi đều dùng động từ '看' (看报纸, 看书, 看电视)."
  },
  {
    "id": "pw3_09",
    "level": 3,
    "before": "外面的太阳太大了，出门别忘了带",
    "after": "。",
    "targetPy": "sǎn",
    "answer": "伞",
    "answerPy": "sǎn",
    "fullZh": "外面的太阳太大了，出门别忘了带伞。",
    "fullPy": "Wàimiàn de tàiyáng tài dà le, chūmén bié wàng le dài sǎn.",
    "vi": "Nắng bên ngoài to quá, ra ngoài đừng quên mang ô nhé.",
    "hint": "Chữ tượng hình cái ô: mái chữ 人 xòe rộng ở trên, bốn chấm người đứng dưới tán, nét ngang và sổ làm cán ô.",
    "exp": "Danh từ '伞' (cái ô, cây dù). Lượng từ đi kèm là '把' (一把伞), có thể ghép thành '雨伞' (ô che mưa), '太阳伞' (ô che nắng)."
  },
  {
    "id": "pw3_10",
    "level": 3,
    "before": "这件红裙子很漂亮，你可以先",
    "after": "一下。",
    "targetPy": "shì",
    "answer": "试",
    "answerPy": "shì",
    "fullZh": "这件红裙子很漂亮，你可以先试一下。",
    "fullPy": "Zhè jiàn hóng qúnzi hěn piàoliang, nǐ kěyǐ xiān shì yíxià.",
    "vi": "Chiếc váy đỏ này rất đẹp, bạn có thể thử trước một chút.",
    "hint": "Bên trái là bộ Ngôn 讠, bên phải là chữ 式 (quy cách) — dùng lời nói và phép đo để thử nghiệm.",
    "exp": "Động từ '试' (thử, mặc thử, nếm thử). Hay lặp lại động từ thành '试试' hoặc dùng '试一下'."
  },
  {
    "id": "pw3_11",
    "level": 3,
    "before": "爷爷每天坚持锻炼，所以身体非常",
    "after": "。",
    "targetPy": "jiànkāng",
    "answer": "健康",
    "answerPy": "jiànkāng",
    "fullZh": "爷爷每天坚持锻炼，所以身体非常健康。",
    "fullPy": "Yéye měitiān jiānchí duànliàn, suǒyǐ shēntǐ fēicháng jiànkāng.",
    "vi": "Ông nội mỗi ngày kiên trì tập luyện, nên cơ thể vô cùng khỏe mạnh.",
    "hint": "Chữ 健 có bộ Nhân đứng 亻 và chữ 建; chữ 康 có bộ Nghiễm 广 ở ngoài và chữ 隶 ở trong.",
    "exp": "Tính từ kiêm danh từ '健康' (khỏe mạnh, sức khỏe). Cấu trúc hay gặp: '身体健康' (cơ thể khỏe mạnh) hoặc '保持健康' (giữ gìn sức khỏe)."
  },
  {
    "id": "pw3_12",
    "level": 3,
    "before": "今天太累了，我现在又困又",
    "after": "。",
    "targetPy": "è",
    "answer": "饿",
    "answerPy": "è",
    "fullZh": "今天太累了，我现在又困又饿。",
    "fullPy": "Jīntiān tài lèi le, wǒ xiànzài yòu kùn yòu è.",
    "vi": "Hôm nay mệt quá, bây giờ tôi vừa buồn ngủ vừa đói.",
    "hint": "Bên trái là bộ Thực 饣 (ăn uống), bên phải là chữ 我 (ngã — tôi) — tôi cần đồ ăn vì đang đói.",
    "exp": "Tính từ '饿' (đói bụng), trái nghĩa với '饱' (no). Mẫu câu '又 A 又 B' diễn tả hai trạng thái tồn tại cùng lúc."
  },
  {
    "id": "pw3_13",
    "level": 3,
    "before": "她最近经常锻炼，比以前",
    "after": "多了。",
    "targetPy": "shòu",
    "answer": "瘦",
    "answerPy": "shòu",
    "fullZh": "她最近经常锻炼，比以前瘦多了。",
    "fullPy": "Tā zuìjìn jīngcháng duànliàn, bǐ yǐqián shòu duō le.",
    "vi": "Gần đây cô ấy thường tập thể dục, gầy hơn trước nhiều rồi.",
    "hint": "Bên ngoài là bộ Nạch 疒 (liên quan thể trạng), bên trong là chữ 叟 (ông già — người gầy).",
    "exp": "Tính từ '瘦' (gầy, mảnh mai), trái nghĩa với '胖' (béo). So sánh mức độ chênh lệch lớn dùng 'A 比 B + Tính từ + 多了'."
  },
  {
    "id": "pw3_14",
    "level": 3,
    "before": "西瓜很",
    "after": "，大家都爱吃。",
    "targetPy": "tián",
    "answer": "甜",
    "answerPy": "tián",
    "fullZh": "西瓜很甜，大家都爱吃。",
    "fullPy": "Xīguā hěn tián, dàjiā dōu ài chī.",
    "vi": "Dưa hấu rất ngọt, mọi người đều thích ăn.",
    "hint": "Bên trái là chữ 舌 (cái lưỡi), bên phải là chữ 甘 (ngọt ngào) — đầu lưỡi nếm vị ngọt.",
    "exp": "Tính từ '甜' (ngọt), nằm trong nhóm tính từ vị giác HSK 3: 甜 (ngọt), 酸 (chua), 苦 (đắng), 辣 (cay), 咸 (mặn)."
  },
  {
    "id": "pw3_15",
    "level": 3,
    "before": "每天晚上睡觉前都要",
    "after": "牙。",
    "targetPy": "shuā",
    "answer": "刷",
    "answerPy": "shuā",
    "fullZh": "每天晚上睡觉前都要刷牙。",
    "fullPy": "Měitiān wǎnshang shuìjiào qián dōu yào shuāyá.",
    "vi": "Mỗi tối trước khi đi ngủ đều phải đánh răng.",
    "hint": "Bên trái là chữ 尸 và bộ Cân 巾 (khăn/lông bàn chải), bên phải là bộ Đao đứng 刂.",
    "exp": "Động từ '刷' (chải, quét, đánh). Cụm cố định cần nhớ: '刷牙' (đánh răng), '刷卡' (quẹt thẻ)."
  },
  {
    "id": "pw3_16",
    "level": 3,
    "before": "你放心吧，我已经",
    "after": "好明天的火车票了。",
    "targetPy": "zhǔnbèi",
    "answer": "准备",
    "answerPy": "zhǔnbèi",
    "fullZh": "你放心吧，我已经准备好明天的火车票了。",
    "fullPy": "Nǐ fàngxīn ba, wǒ yǐjīng zhǔnbèihǎo míngtiān de huǒchēpiào le.",
    "vi": "Bạn yên tâm đi, tôi đã chuẩn bị xong vé tàu ngày mai rồi.",
    "hint": "Chữ 准 có bộ Băng 冫 và chữ 隹; chữ 备 trên là bộ Truy 夂, dưới là bộ Điền 田.",
    "exp": "Động từ '准备' (chuẩn bị) kết hợp bổ ngữ kết quả '好' (准备好: chuẩn bị sẵn sàng xong xuôi)."
  },
  {
    "id": "pw3_17",
    "level": 3,
    "before": "哥哥非常喜欢和朋友们一起",
    "after": "足球。",
    "targetPy": "tī",
    "answer": "踢",
    "answerPy": "tī",
    "fullZh": "哥哥非常喜欢和朋友们一起踢足球。",
    "fullPy": "Gēge fēicháng xǐhuan hé péngyoumen yìqǐ tī zúqiú.",
    "vi": "Anh trai vô cùng thích cùng bạn bè đá bóng.",
    "hint": "Bên trái là bộ Túc ⻊ (bàn chân), bên phải là chữ 易 — dùng chân để đá.",
    "exp": "Động từ '踢' (đá) dùng cho môn thể thao bằng chân như '踢足球' (đá bóng), phân biệt với '打篮球' (chơi bóng rổ dùng tay)."
  },
  {
    "id": "pw3_18",
    "level": 3,
    "before": "刚才听到这个坏消息，她伤心地",
    "after": "了起来。",
    "targetPy": "kū",
    "answer": "哭",
    "answerPy": "kū",
    "fullZh": "刚才听到这个坏消息，她伤心地哭了起来。",
    "fullPy": "Gāngcái tīngdào zhège huài xiāoxi, tā shāngxīn de kū le qǐlái.",
    "vi": "Vừa nãy nghe thấy tin xấu này, cô ấy buồn bã bật khóc.",
    "hint": "Trên là hai bộ Khẩu 口 (như hai con mắt ngấn lệ), dưới là chữ 犬 (con chó — chú ý có nét chấm ở góc trên phải).",
    "exp": "Động từ '哭' (khóc), trái nghĩa với '笑' (cười). Bổ ngữ xu hướng 'V + 起来' diễn tả hành động bắt đầu phát sinh ('哭了起来': òa khóc)."
  },
  {
    "id": "pw3_19",
    "level": 3,
    "before": "这里风景这么美，我们来拍几张",
    "after": "片吧。",
    "targetPy": "zhào",
    "answer": "照",
    "answerPy": "zhào",
    "fullZh": "这里风景这么美，我们来拍几张照片吧。",
    "fullPy": "Zhèlǐ fēngjǐng zhème měi, wǒmen lái pāi jǐ zhāng zhàopiàn ba.",
    "vi": "Phong cảnh ở đây đẹp thế này, chúng ta chụp vài tấm ảnh đi.",
    "hint": "Trên trái là bộ Nhật 日, trên phải là 召, dưới là bốn chấm Hỏa 灬 (ánh sáng chiếu rọi).",
    "exp": "Danh từ '照片' (bức ảnh) đi với lượng từ '张' (一张照片) và động từ '拍' (chụp ảnh: 拍照片) hoặc '照相'."
  },
  {
    "id": "pw3_20",
    "level": 3,
    "before": "学习汉字其实不难，只要多",
    "after": "就会记住。",
    "targetPy": "liànxí",
    "answer": "练习",
    "answerPy": "liànxí",
    "fullZh": "学习汉字其实不难，只要多练习就会记住。",
    "fullPy": "Xuéxí Hànzì qíshí bù nán, zhǐyào duō liànxí jiù huì jìzhù.",
    "vi": "Học chữ Hán thật ra không khó, chỉ cần luyện tập nhiều thì sẽ nhớ được.",
    "hint": "Chữ 练 bên trái là bộ Mịch 纟 (sợi tơ), bên phải là chữ 东 biến thể (chú ý nét ngang gập móc); chữ 习 có nét ngang gập móc và chấm hất.",
    "exp": "Động từ kiêm danh từ '练习' (luyện tập, bài tập). Cụm hay dùng: '多练习' (luyện tập nhiều), '做练习' (làm bài tập)."
  }
];

  const makeSentenceTasks = [
  {
    "id": "ms3_01",
    "level": 3,
    "keyword": "决定",
    "keywordPy": "juédìng",
    "pos": "Động từ / Danh từ",
    "keywordVi": "quyết định",
    "scenePrompt": "Tình huống: Một sinh viên nhìn bản đồ Trung Quốc và hồ sơ du học trên bàn với ánh mắt quyết tâm.",
    "grammarPattern": "Chủ ngữ + 决定 + Động từ / Cụm động từ",
    "samples": [
      {
        "zh": "大学毕业后，我决定去北京留学一年。",
        "py": "Dàxué bìyè hòu, wǒ juédìng qù Běijīng liúxué yì nián.",
        "vi": "Sau khi tốt nghiệp đại học, tôi quyết định đi Bắc Kinh du học một năm."
      },
      {
        "zh": "她做了一个非常重要的决定。",
        "py": "Tā zuò le yígè fēicháng zhòngyào de juédìng.",
        "vi": "Cô ấy đã đưa ra một quyết định vô cùng quan trọng."
      }
    ],
    "note": "Khi làm động từ, 决定 đi trực tiếp với động từ hành động; khi làm danh từ thường đi với 做一个决定."
  },
  {
    "id": "ms3_02",
    "level": 3,
    "keyword": "关心",
    "keywordPy": "guānxīn",
    "pos": "Động từ",
    "keywordVi": "quan tâm, chăm lo",
    "scenePrompt": "Tình huống: Mẹ gọi điện hỏi thăm con đang học xa nhà xem trời lạnh có mặc đủ ấm không.",
    "grammarPattern": "Chủ ngữ + (很/非常)关心 + Tân ngữ (người/sự việc)",
    "samples": [
      {
        "zh": "妈妈一直非常关心我的身体和学习。",
        "py": "Māma yìzhí fēicháng guānxīn wǒ de shēntǐ hé xuéxí.",
        "vi": "Mẹ luôn vô cùng quan tâm đến sức khỏe và việc học của tôi."
      },
      {
        "zh": "谢谢大家这段时间对我的关心和帮助。",
        "py": "Xièxie dàjiā zhè duàn shíjiān duì wǒ de guānxīn hé bāngzhù.",
        "vi": "Cảm ơn mọi người thời gian qua đã quan tâm và giúp đỡ tôi."
      }
    ],
    "note": "Động từ tâm lý 关心 có thể nhận phó từ mức độ 很/非常 phía trước và mang tân ngữ trực tiếp phía sau."
  },
  {
    "id": "ms3_03",
    "level": 3,
    "keyword": "终于",
    "keywordPy": "zhōngyú",
    "pos": "Phó từ",
    "keywordVi": "cuối cùng thì (kết quả mong đợi)",
    "scenePrompt": "Tình huống: Sau nhiều tháng ôn thi, bạn cầm tờ chứng chỉ HSK đậu điểm cao trên tay đầy vui mừng.",
    "grammarPattern": "Chủ ngữ + 终于 + Động từ + 了",
    "samples": [
      {
        "zh": "经过半年的努力，我终于通过了HSK三级考试。",
        "py": "Jīngguò bàn nián de nǔlì, wǒ zhōngyú tōngguò le HSK sānjí kǎoshì.",
        "vi": "Sau nửa năm nỗ lực, tôi cuối cùng đã thi đỗ HSK 3."
      },
      {
        "zh": "等了一个小时，公共汽车终于来了。",
        "py": "Děng le yígè xiǎoshí, gōnggòng qìchē zhōngyú lái le.",
        "vi": "Đợi suốt một tiếng đồng hồ, xe buýt cuối cùng cũng đến rồi."
      }
    ],
    "note": "终于 diễn tả kết quả đạt được sau quá trình chờ đợi/cố gắng dài, cuối câu thường có 了."
  },
  {
    "id": "ms3_04",
    "level": 3,
    "keyword": "习惯",
    "keywordPy": "xíguàn",
    "pos": "Động từ / Danh từ",
    "keywordVi": "quen với / thói quen",
    "scenePrompt": "Tình huống: Một người nước ngoài dùng đũa gắp thức ăn rất thành thạo trong quán ăn Trung Hoa.",
    "grammarPattern": "Chủ ngữ + (已经)习惯 + Động từ/Danh từ | 养成…的习惯",
    "samples": [
      {
        "zh": "来中国半年了，我已经习惯用筷子吃饭了。",
        "py": "Lái Zhōngguó bàn nián le, wǒ yǐjīng xíguàn yòng kuàizi chīfàn le.",
        "vi": "Đến Trung Quốc nửa năm rồi, tôi đã quen ăn cơm bằng đũa rồi."
      },
      {
        "zh": "早睡早起是一个非常好的生活习惯。",
        "py": "Zǎoshuì zǎoqǐ shì yígè fēicháng hǎo de shēnghuó xíguàn.",
        "vi": "Ngủ sớm dậy sớm là một thói quen sinh hoạt rất tốt."
      }
    ],
    "note": "Cẩn thận phân biệt 习惯 làm động từ (đứng trước V/N) và làm danh từ (đi với 好习惯, 养成习惯)."
  },
  {
    "id": "ms3_05",
    "level": 3,
    "keyword": "影响",
    "keywordPy": "yǐngxiǎng",
    "pos": "Động từ / Danh từ",
    "keywordVi": "ảnh hưởng",
    "scenePrompt": "Tình huống: Tiếng ồn ngoài đường khiến bạn khó tập trung đọc sách trong phòng.",
    "grammarPattern": "A + 影响 + B | A + 对 + B + 有(很大)影响",
    "samples": [
      {
        "zh": "晚上喝太多咖啡会影响睡眠质量。",
        "py": "Wǎnshang hē tài duō kāfēi huì yǐngxiǎng shuìmián zhìliàng.",
        "vi": "Buổi tối uống quá nhiều cà phê sẽ ảnh hưởng đến chất lượng giấc ngủ."
      },
      {
        "zh": "这位老师对我的成长产生了很大的影响。",
        "py": "Zhè wèi lǎoshī duì wǒ de chéngzhǎng chǎnshēng le hěn dà de yǐngxiǎng.",
        "vi": "Thầy giáo này đã tạo ra ảnh hưởng rất lớn đến sự trưởng thành của tôi."
      }
    ],
    "note": "Khi dùng làm động từ không thêm giới từ 到 thừa thãi trong câu cơ bản; khi làm danh từ dùng 对…有影响."
  },
  {
    "id": "ms3_06",
    "level": 3,
    "keyword": "必须",
    "keywordPy": "bìxū",
    "pos": "Phó từ",
    "keywordVi": "nhất định phải, bắt buộc phải",
    "scenePrompt": "Tình huống: Biển báo quy định mọi người phải tắt điện thoại và giữ yên lặng trong phòng thi.",
    "grammarPattern": "Chủ ngữ + 必须 + Động từ / Cụm động từ",
    "samples": [
      {
        "zh": "参加考试时，每个人都必须带好证件。",
        "py": "Cānjiā kǎoshì shí, měi gè rén dōu bìxū dài hǎo zhèngjiàn.",
        "vi": "Khi đi thi, mỗi người đều bắt buộc phải mang đầy đủ giấy tờ."
      },
      {
        "zh": "为了按时完成任务，我们今天必须加班。",
        "py": "Wèile ànshí wánchéng rènwu, wǒmen jīntiān bìxū jiābān.",
        "vi": "Để hoàn thành nhiệm vụ đúng hạn, hôm nay chúng ta bắt buộc phải tăng ca."
      }
    ],
    "note": "Phân biệt 必须 (phó từ + động từ: bắt buộc phải làm gì) với 必需 (động/tính từ + danh từ: đồ dùng thiết yếu 必需品)."
  },
  {
    "id": "ms3_07",
    "level": 3,
    "keyword": "愿意",
    "keywordPy": "yuànyì",
    "pos": "Động từ năng nguyện",
    "keywordVi": "bằng lòng, sẵn lòng",
    "scenePrompt": "Tình huống: Một bạn học sinh vui vẻ giơ tay nhận lời hướng dẫn bạn mới làm quen với trường.",
    "grammarPattern": "Chủ ngữ + (很/非常)愿意 + Động từ",
    "samples": [
      {
        "zh": "只要你需要帮助，我随时都愿意帮你。",
        "py": "Zhǐyào nǐ xūyào bāngzhù, wǒ suíshí dōu yuànyì bāng nǐ.",
        "vi": "Chỉ cần bạn cần giúp đỡ, lúc nào tôi cũng sẵn lòng giúp bạn."
      },
      {
        "zh": "她不愿意放弃自己喜欢的专业。",
        "py": "Tā bú yuànyì fàngqì zìjǐ xǐhuan de zhuānyè.",
        "vi": "Cô ấy không bằng lòng từ bỏ chuyên ngành mình yêu thích."
      }
    ],
    "note": "Phủ định của 愿意 là 不愿意 (không dùng 没愿意)."
  },
  {
    "id": "ms3_08",
    "level": 3,
    "keyword": "虽然…但是…",
    "keywordPy": "suīrán…dànshì…",
    "pos": "Liên từ",
    "keywordVi": "tuy… nhưng…",
    "scenePrompt": "Tình huống: Trời ngoài cửa sổ mưa khá to nhưng quán cà phê sách vẫn ấm cúng và đông khách.",
    "grammarPattern": "虽然 + Vế nhượng bộ，但是 + Vế chuyển ngoặt",
    "samples": [
      {
        "zh": "虽然汉语语法有点儿难，但是非常有趣。",
        "py": "Suīrán Hànyǔ yǔfǎ yǒudiǎnr nán, dànshì fēicháng yǒuqù.",
        "vi": "Tuy ngữ pháp tiếng Trung hơi khó nhưng vô cùng thú vị."
      },
      {
        "zh": "虽然他工作很忙，但是每天都会陪孩子看书。",
        "py": "Suīrán tā gōngzuò hěn máng, dànshì měitiān dōu huì péi háizi kànshū.",
        "vi": "Tuy công việc anh ấy rất bận nhưng ngày nào cũng đọc sách cùng con."
      }
    ],
    "note": "Nếu hai vế cùng một chủ ngữ, 虽然 có thể đặt trước hoặc sau chủ ngữ; nếu khác chủ ngữ, 虽然 đứng đầu câu."
  },
  {
    "id": "ms3_09",
    "level": 3,
    "keyword": "一边…一边…",
    "keywordPy": "yìbiān…yìbiān…",
    "pos": "Phó từ liên kết",
    "keywordVi": "vừa… vừa… (2 hành động song song)",
    "scenePrompt": "Tình huống: Một cô gái đeo tai nghe vừa nghe podcast tiếng Trung vừa đi bộ trong công viên.",
    "grammarPattern": "Chủ ngữ + 一边 + V1，一边 + V2",
    "samples": [
      {
        "zh": "她喜欢一边听汉语播客，一边在公园散步。",
        "py": "Tā xǐhuan yìbiān tīng Hànyǔ bōkè, yìbiān zài gōngyuán sànbù.",
        "vi": "Cô ấy thích vừa nghe podcast tiếng Trung vừa đi dạo trong công viên."
      },
      {
        "zh": "不要一边吃饭一边看手机，对身体不好。",
        "py": "Búyào yìbiān chīfàn yìbiān kàn shǒujī, duì shēntǐ bù hǎo.",
        "vi": "Đừng vừa ăn cơm vừa xem điện thoại, không tốt cho sức khỏe."
      }
    ],
    "note": "一边…一边… chỉ dùng cho hai động tác có thể xảy ra đồng thời cùng một lúc (không dùng cho tính từ song song — tính từ dùng 又…又…)."
  },
  {
    "id": "ms3_10",
    "level": 3,
    "keyword": "越…越…",
    "keywordPy": "yuè…yuè…",
    "pos": "Phó từ liên kết",
    "keywordVi": "càng… càng…",
    "scenePrompt": "Tình huống: Một người kiên trì luyện viết chữ Hán mỗi ngày, chữ trên trang giấy càng lúc càng đẹp.",
    "grammarPattern": "Chủ ngữ + 越 + V1 + 越 + Adj/V2",
    "samples": [
      {
        "zh": "汉字越练越漂亮，你一定要坚持每天写。",
        "py": "Hànzì yuè liàn yuè piàoliang, nǐ yídìng yào jiānchí měitiān xiě.",
        "vi": "Chữ Hán càng luyện càng đẹp, bạn nhất định phải kiên trì viết mỗi ngày."
      },
      {
        "zh": "天气越冷，火锅店的生意就越好。",
        "py": "Tiānqì yuè lěng, huǒguōdiàn de shēngyi jiù yuè hǎo.",
        "vi": "Trời càng lạnh, việc kinh doanh của quán lẩu lại càng tốt."
      }
    ],
    "note": "Không thêm 很 sau chữ 越 thứ hai (không nói 越练越很漂亮)."
  },
  {
    "id": "ms4_01",
    "level": 4,
    "keyword": "坚持",
    "keywordPy": "jiānchí",
    "pos": "Động từ",
    "keywordVi": "kiên trì, bền bỉ giữ vững",
    "scenePrompt": "Tình huống: Một cô gái trẻ mặc đồ thể thao chạy bộ vào sáng sớm trong công viên dù trời hơi se lạnh.",
    "grammarPattern": "Chủ ngữ + 坚持 + Động từ / Cụm danh từ (+ 下去)",
    "samples": [
      {
        "zh": "她每天早上都坚持去公园跑步。",
        "py": "Tā měitiān zǎoshang dōu jiānchí qù gōngyuán pǎobù.",
        "vi": "Mỗi sáng cô ấy đều kiên trì ra công viên chạy bộ."
      },
      {
        "zh": "只要坚持下去，你的汉语水平一定会提高。",
        "py": "Zhǐyào jiānchí xiàqù, nǐ de Hànyǔ shuǐpíng yídìng huì tígāo.",
        "vi": "Chỉ cần kiên trì tiếp tục, trình độ tiếng Hán của bạn nhất định sẽ nâng cao."
      }
    ],
    "note": "Người Việt hay ghép thừa giới từ (như '坚持着做') hoặc nhầm với '保持' (duy trì trạng thái sẵn có như giữ im lặng, giữ sạch). '坚持' đi trực tiếp với động từ hành động."
  },
  {
    "id": "ms4_02",
    "level": 4,
    "keyword": "丰富",
    "keywordPy": "fēngfù",
    "pos": "Tính từ / Động từ",
    "keywordVi": "phong phú, làm phong phú thêm",
    "scenePrompt": "Tình huống: Trên bàn ăn bày đầy các món ăn đa dạng màu sắc và hương vị; hoặc kệ sách nhiều thể loại.",
    "grammarPattern": "Danh từ + 很丰富 / 丰富 + Danh từ (như 经验、知识、生活)",
    "samples": [
      {
        "zh": "桌上的菜非常丰富，看起来真香。",
        "py": "Zhuō shàng de cài fēicháng fēngfù, kàn qǐlái zhēn xiāng.",
        "vi": "Món ăn trên bàn vô cùng phong phú, trông thật thơm ngon."
      },
      {
        "zh": "阅读可以丰富我们的课余生活。",
        "py": "Yuèdú kěyǐ fēngfù wǒmen de kèyú shēnghuó.",
        "vi": "Đọc sách có thể làm phong phú thêm đời sống ngoài giờ của chúng ta."
      }
    ],
    "note": "Chú ý '丰富' không dùng để miêu tả số lượng tiền bạc hay người ('rất đông người' phải dùng '很多人', không nói '人很丰富')."
  },
  {
    "id": "ms4_03",
    "level": 4,
    "keyword": "认真",
    "keywordPy": "rènzhēn",
    "pos": "Tính từ",
    "keywordVi": "nghiêm túc, chăm chú, cẩn thận",
    "scenePrompt": "Tình huống: Một cậu học sinh ngồi ngay ngắn trước bàn học, mắt chăm chú ghi chép bài vở.",
    "grammarPattern": "认真地 + Động từ / Động từ + 得 + 很认真",
    "samples": [
      {
        "zh": "小明在教室里认真地听老师讲课。",
        "py": "Xiǎo Míng zài jiàoshì lǐ rènzhēn de tīng lǎoshī jiǎngkè.",
        "vi": "Tiểu Minh ở trong lớp học chăm chú nghe thầy giáo giảng bài."
      },
      {
        "zh": "无论做什么工作，态度都要认真。",
        "py": "Wúlùn zuò shénme gōngzuò, tàidù dōu yào rènzhēn.",
        "vi": "Bất kể làm công việc gì, thái độ đều phải nghiêm túc."
      }
    ],
    "note": "Khi làm trạng ngữ đứng trước động từ hai âm tiết hoặc cụm dài, nên thêm trợ từ kết cấu '地' (认真地检查), tránh đặt nhầm sang '的'."
  },
  {
    "id": "ms4_04",
    "level": 4,
    "keyword": "鼓励",
    "keywordPy": "gǔlì",
    "pos": "Động từ / Danh từ",
    "keywordVi": "động viên, khích lệ",
    "scenePrompt": "Tình huống: Cô giáo mỉm cười vỗ vai động viên một học sinh vừa hơi rụt rè khi đứng lên phát biểu.",
    "grammarPattern": "A + 鼓励 + B + Động từ / 得到…的鼓励",
    "samples": [
      {
        "zh": "老师经常鼓励学生多用汉语交流。",
        "py": "Lǎoshī jīngcháng gǔlì xuésheng duō yòng Hànyǔ jiāoliú.",
        "vi": "Thầy cô thường xuyên khuyến khích học sinh giao tiếp bằng tiếng Hán nhiều hơn."
      },
      {
        "zh": "朋友的鼓励给了我很大的勇气。",
        "py": "Péngyou de gǔlì gěi le wǒ hěn dà de yǒngqì.",
        "vi": "Sự động viên của bạn bè đã tiếp thêm cho tôi rất nhiều dũng khí."
      }
    ],
    "note": "Tránh nhầm '鼓励' (khích lệ tinh thần làm việc tốt) với '安慰' (an ủi khi người khác đang buồn bã, thất bại)."
  },
  {
    "id": "ms4_05",
    "level": 4,
    "keyword": "遗憾",
    "keywordPy": "yíhàn",
    "pos": "Tính từ / Danh từ",
    "keywordVi": "đáng tiếc, lấy làm tiếc",
    "scenePrompt": "Tình huống: Hai người bạn đứng trước cửa rạp chiếu phim treo biển hết vé, nét mặt hơi tiếc nuối.",
    "grammarPattern": "很遗憾 + (Mệnh đề) / 感到遗憾",
    "samples": [
      {
        "zh": "真遗憾，今天的电影票已经卖完了。",
        "py": "Zhēn yíhàn, jīntiān de diànyǐngpiào yǐjīng màiwán le.",
        "vi": "Thật đáng tiếc, vé xem phim hôm nay đã bán hết rồi."
      },
      {
        "zh": "没能参加你的生日聚会，我感到很遗憾。",
        "py": "Méi néng cānjiā nǐ de shēngrì jùhuì, wǒ gǎndào hěn yíhàn.",
        "vi": "Không thể tham dự tiệc sinh nhật của bạn, tôi cảm thấy rất lấy làm tiếc."
      }
    ],
    "note": "Không dùng '遗憾' cho vật chất bị hư hỏng nhỏ (làm vỡ cốc nên dùng '真可惜'), '遗憾' thường diễn tả sự nuối tiếc về cơ hội hoặc sự việc không trọn vẹn."
  },
  {
    "id": "ms4_06",
    "level": 4,
    "keyword": "安排",
    "keywordPy": "ānpái",
    "pos": "Động từ / Danh từ",
    "keywordVi": "sắp xếp, bố trí",
    "scenePrompt": "Tình huống: Một nhân viên đang ngồi ghi chú lịch trình làm việc lên sổ kế hoạch hằng tuần.",
    "grammarPattern": "安排 + Thời gian/Công việc / 安排 + Ai + Làm gì",
    "samples": [
      {
        "zh": "请帮我合理安排一下明天的日程。",
        "py": "Qǐng bāng wǒ hélǐ ānpái yíxià míngtiān de rìchéng.",
        "vi": "Xin hãy giúp tôi sắp xếp hợp lý lịch trình ngày mai một chút."
      },
      {
        "zh": "这次出差已经按照计划安排好了。",
        "py": "Zhè cì chūchāi yǐjīng ànzhào jìhuà ānpái hǎo le.",
        "vi": "Chuyến công tác lần này đã được sắp xếp ổn thỏa theo kế hoạch."
      }
    ],
    "note": "Người Việt hay dùng nhầm '安排' để nói sắp xếp đồ đạc trên bàn; sắp đặt vật lý phải dùng '整理' (chỉnh đốn, dọn dẹp) hoặc '放好', còn '安排' dùng cho thời gian, con người, công việc."
  },
  {
    "id": "ms4_07",
    "level": 4,
    "keyword": "热闹",
    "keywordPy": "rènao",
    "pos": "Tính từ",
    "keywordVi": "náo nhiệt, nhộn nhịp, đông vui",
    "scenePrompt": "Tình huống: Khu chợ đêm rực rỡ ánh đèn lồng, đông đúc người qua lại trò chuyện và mua sắm.",
    "grammarPattern": "Địa điểm + 很热闹 / 热闹的 + Danh từ",
    "samples": [
      {
        "zh": "周末的夜市非常热闹，到处都是人。",
        "py": "Zhōumò de yèshì fēicháng rènao, dàochù dōu shì rén.",
        "vi": "Chợ đêm cuối tuần vô cùng nhộn nhịp, khắp nơi đều là người."
      },
      {
        "zh": "春节的时候，家里总是特别热闹。",
        "py": "Chūnjié de shíhou, jiālǐ zǒngshì tèbié rènao.",
        "vi": "Vào dịp Tết Nguyên Đán, trong nhà lúc nào cũng đặc biệt đông vui."
      }
    ],
    "note": "Chú ý '闹' trong '热闹' đọc thanh nhẹ (rènao). Tính từ này mang sắc thái tích cực (đông vui), khác với '吵' (ồn ào gây khó chịu)."
  },
  {
    "id": "ms4_08",
    "level": 4,
    "keyword": "顺利",
    "keywordPy": "shùnlì",
    "pos": "Tính từ",
    "keywordVi": "thuận lợi, suôn sẻ",
    "scenePrompt": "Tình huống: Hai đồng nghiệp bắt tay nhau tươi cười hài lòng sau khi ký xong hợp đồng trong phòng họp.",
    "grammarPattern": "Sự việc + 进行得很顺利 / 顺利地 + Động từ",
    "samples": [
      {
        "zh": "祝你明天的面试一切顺利！",
        "py": "Zhù nǐ míngtiān de miànshì yíqiè shùnlì!",
        "vi": "Chúc buổi phỏng vấn ngày mai của bạn mọi việc suôn sẻ!"
      },
      {
        "zh": "由于准备充分，会议进行得十分顺利。",
        "py": "Yóuyú zhǔnbèi chōngfèn, huìyì jìnxíng de shífēn shùnlì.",
        "vi": "Nhờ chuẩn bị chu đáo, cuộc họp diễn ra vô cùng thuận lợi."
      }
    ],
    "note": "Tránh viết sai thành '我很顺利' khi muốn nói 'mọi việc của tôi suôn sẻ'; chủ ngữ của '顺利' phải là sự việc, quá trình (như 比赛, 工作, 一切)."
  },
  {
    "id": "ms4_09",
    "level": 4,
    "keyword": "经验",
    "keywordPy": "jīngyàn",
    "pos": "Danh từ",
    "keywordVi": "kinh nghiệm",
    "scenePrompt": "Tình huống: Một bác kỹ sư lớn tuổi đang tận tình chỉ dẫn cho nhân viên trẻ trước bảng vẽ kỹ thuật.",
    "grammarPattern": "有经验 / 积累经验 / 分享经验",
    "samples": [
      {
        "zh": "这位老师有着二十年的教学经验。",
        "py": "Zhè wèi lǎoshī yǒuzhe èrshí nián de jiàoxué jīngyàn.",
        "vi": "Thầy giáo này có hai mươi năm kinh nghiệm giảng dạy."
      },
      {
        "zh": "多参加实习能帮大学生积累宝贵经验。",
        "py": "Duō cānjiā shíxí néng bāng dàxuéshēng jīlěi bǎoguì jīngyàn.",
        "vi": "Tham gia thực tập nhiều giúp sinh viên đại học tích lũy kinh nghiệm quý báu."
      }
    ],
    "note": "Không dùng động từ '做经验' hay '学经验'; động từ chuẩn đi với '经验' là '积累' (tích lũy), '总结' (tổng kết), '交流/分享' (chia sẻ)."
  },
  {
    "id": "ms4_10",
    "level": 4,
    "keyword": "仔细",
    "keywordPy": "zǐxì",
    "pos": "Tính từ",
    "keywordVi": "tỉ mỉ, kỹ lưỡng, cẩn thận",
    "scenePrompt": "Tình huống: Một người đeo kính đang cầm kính lúp hoặc cúi sát kiểm tra kỹ từng dòng số liệu trên tài liệu.",
    "grammarPattern": "仔细地 + Động từ / 看得很仔细",
    "samples": [
      {
        "zh": "交卷之前，请仔细检查一遍答案。",
        "py": "Jiāojuàn zhīqián, qǐng zǐxì jiǎnchá yíbiàn dá'àn.",
        "vi": "Trước khi nộp bài, hãy kiểm tra lại đáp án một lượt thật kỹ."
      },
      {
        "zh": "他做事一向很仔细，很少出错。",
        "py": "Tā zuòshì yíxiàng hěn zǐxì, hěn shǎo chūcuò.",
        "vi": "Anh ấy làm việc trước giờ rất tỉ mỉ, rất ít khi sai sót."
      }
    ],
    "note": "Phân biệt: '仔细' nhấn mạnh sự kỹ càng khi quan sát/xem xét (仔细看, 仔细听), còn '小心' nhấn mạnh sự đề phòng nguy hiểm hoặc sự cố (过马路要小心)."
  },
  {
    "id": "ms4_11",
    "level": 4,
    "keyword": "骄傲",
    "keywordPy": "jiāo'ào",
    "pos": "Tính từ",
    "keywordVi": "tự hào (tích cực) / kiêu ngạo (tiêu cực)",
    "scenePrompt": "Tình huống: Vận động viên giơ cao chiếc cúp vô địch trên bục nhận giải, cha mẹ đứng dưới vỗ tay rạng rỡ.",
    "grammarPattern": "为 + Ai/Điều gì + 感到骄傲 / 不要骄傲",
    "samples": [
      {
        "zh": "父母都为女儿取得的成绩感到骄傲。",
        "py": "Fùmǔ dōu wèi nǚ'ér qǔdé de chéngjì gǎndào jiāo'ào.",
        "vi": "Bố mẹ đều cảm thấy tự hào vì thành tích con gái đạt được."
      },
      {
        "zh": "取得一点进步就骄傲，是不对的。",
        "py": "Qǔdé yìdiǎn jìnbù jiù jiāo'ào, shì bú duì de.",
        "vi": "Mới tiến bộ một chút đã kiêu ngạo là không đúng đâu."
      }
    ],
    "note": "Từ '骄傲' có hai sắc thái đối lập tùy ngữ cảnh: đi với '为…感到骄傲' là 'tự hào', đứng một mình khuyên răn thường mang nghĩa 'kiêu ngạo, tự phụ'."
  },
  {
    "id": "ms4_12",
    "level": 4,
    "keyword": "保护",
    "keywordPy": "bǎohù",
    "pos": "Động từ",
    "keywordVi": "bảo vệ, giữ gìn",
    "scenePrompt": "Tình huống: Nhóm tình nguyện viên trẻ mặc áo xanh đang cùng nhau trồng cây non và nhặt rác ven hồ.",
    "grammarPattern": "保护 + Tân ngữ (环境、眼睛、动物、安全)",
    "samples": [
      {
        "zh": "保护环境是我们每个人的责任。",
        "py": "Bǎohù huánjìng shì wǒmen měi gè rén de zérèn.",
        "vi": "Bảo vệ môi trường là trách nhiệm của mỗi người chúng ta."
      },
      {
        "zh": "看书时要注意保护好自己的眼睛。",
        "py": "Kànshū shí yào zhùyì bǎohù hǎo zìjǐ de yǎnjing.",
        "vi": "Khi đọc sách cần chú ý bảo vệ tốt đôi mắt của mình."
      }
    ],
    "note": "Đừng nhầm với '保存' (bảo quản, lưu giữ tệp hoặc thực phẩm) hay '保证' (bảo đảm, cam đoan)."
  },
  {
    "id": "ms4_13",
    "level": 4,
    "keyword": "尊重",
    "keywordPy": "zūnzhòng",
    "pos": "Động từ / Danh từ",
    "keywordVi": "tôn trọng, kính trọng",
    "scenePrompt": "Tình huống: Bạn trẻ cúi chào lễ phép và nhường ghế ngồi trên xe buýt cho một cụ già tóc bạc.",
    "grammarPattern": "尊重 + Đối tượng (长辈、意见、文化、选择)",
    "samples": [
      {
        "zh": "我们应该学会尊重别人的意见。",
        "py": "Wǒmen yīnggāi xuéhuì zūnzhòng biérén de yìjiàn.",
        "vi": "Chúng ta nên học cách tôn trọng ý kiến của người khác."
      },
      {
        "zh": "到不同国家旅游时，要尊重当地文化。",
        "py": "Dào bùtóng guójiā lǚyóu shí, yào zūnzhòng dāngdì wénhuà.",
        "vi": "Khi du lịch đến các quốc gia khác, cần tôn trọng văn hóa địa phương."
      }
    ],
    "note": "Có thể đi kèm mức độ: '很尊重' hoặc '互相尊重' (tôn trọng lẫn nhau). Không nhầm với '尊敬' (chỉ dùng cho người bề trên, ít dùng cho ý kiến hay thói quen)."
  },
  {
    "id": "ms4_14",
    "level": 4,
    "keyword": "改变",
    "keywordPy": "gǎibiàn",
    "pos": "Động từ / Danh từ",
    "keywordVi": "thay đổi, biến đổi",
    "scenePrompt": "Tình huống: Trước kia đường phố chật hẹp đầy xe cộ, nay trở thành con đường xanh sạch đẹp với hàng cây rợp bóng.",
    "grammarPattern": "改变 + Danh từ (习惯、计划、想法、面貌)",
    "samples": [
      {
        "zh": "他已经改变主意，决定留在这里工作。",
        "py": "Tā yǐjīng gǎibiàn zhǔyi, juédìng liú zài zhèlǐ gōngzuò.",
        "vi": "Anh ấy đã thay đổi ý định, quyết định ở lại đây làm việc."
      },
      {
        "zh": "科技的发展改变了人们的生活方式。",
        "py": "Kējì de fāzhǎn gǎibiàn le rénmen de shēnghuó fāngshì.",
        "vi": "Sự phát triển của khoa học công nghệ đã làm thay đổi lối sống của con người."
      }
    ],
    "note": "Phân biệt với '变化': '改变' là động từ ngoại động (thay đổi cái gì đó, mang được tân ngữ), còn '变化' thường là danh từ hoặc nội động từ (发生很大变化)."
  },
  {
    "id": "ms4_15",
    "level": 4,
    "keyword": "耐心",
    "keywordPy": "nàixīn",
    "pos": "Tính từ / Danh từ",
    "keywordVi": "kiên nhẫn, nhẫn nại",
    "scenePrompt": "Tình huống: Người mẹ ngồi bên bàn tỉ mỉ hướng dẫn con nhỏ tập viết từng nét chữ Hán.",
    "grammarPattern": "耐心地 + Động từ / 对 + Ai + 很有耐心",
    "samples": [
      {
        "zh": "妈妈总是耐心地教孩子写汉字。",
        "py": "Māma zǒngshì nàixīn de jiāo háizi xiě Hànzì.",
        "vi": "Mẹ luôn kiên nhẫn dạy con viết chữ Hán."
      },
      {
        "zh": "做一名优秀的教师必须非常有耐心。",
        "py": "Zuò yì míng yōuxiù de jiàoshī bìxū fēicháng yǒu nàixīn.",
        "vi": "Làm một giáo viên xuất sắc nhất định phải rất có lòng kiên nhẫn."
      }
    ],
    "note": "Phân biệt: '耐心' là nhẫn nại chờ đợi hoặc giảng giải không cáu gắt; '坚持' là kiên trì theo đuổi mục tiêu đến cùng không bỏ cuộc."
  },
  {
    "id": "ms4_16",
    "level": 4,
    "keyword": "适合",
    "keywordPy": "shìhé",
    "pos": "Động từ",
    "keywordVi": "thích hợp, phù hợp với",
    "scenePrompt": "Tình huống: Cô gái đứng trước gương cửa hàng thử một chiếc áo khoác vừa vặn và rất hợp dáng.",
    "grammarPattern": "A + (很/非常) + 适合 + B",
    "samples": [
      {
        "zh": "这件浅蓝色的外套非常适合你。",
        "py": "Zhè jiàn qiǎn lánsè de wàitào fēicháng shìhé nǐ.",
        "vi": "Chiếc áo khoác màu xanh nhạt này vô cùng hợp với bạn."
      },
      {
        "zh": "找到适合自己的学习方法非常重要。",
        "py": "Zhǎodào shìhé zìjǐ de xuéxí fāngfǎ fēicháng zhòngyào.",
        "vi": "Tìm được phương pháp học tập phù hợp với bản thân vô cùng quan trọng."
      }
    ],
    "note": "'适合' là động từ nên nhận phó từ chỉ mức độ (很适合你) và mang trực tiếp tân ngữ phía sau; đừng nhầm với tính từ '合适' (vừa vặn, không mang tân ngữ trực tiếp: 这双鞋很合适)."
  },
  {
    "id": "ms4_17",
    "level": 4,
    "keyword": "印象",
    "keywordPy": "yìnxiàng",
    "pos": "Danh từ",
    "keywordVi": "ấn tượng",
    "scenePrompt": "Tình huống: Du khách nước ngoài vui vẻ chụp ảnh cùng người dân địa phương thân thiện bên phố cổ.",
    "grammarPattern": "对 + Ai/Nơi nào + 印象很深 / 给…留下深刻印象",
    "samples": [
      {
        "zh": "我对这座美丽的城市印象非常深刻。",
        "py": "Wǒ duì zhè zuò měilì de chéngshì yìnxiàng fēicháng shēnkè.",
        "vi": "Tôi có ấn tượng vô cùng sâu sắc đối với thành phố xinh đẹp này."
      },
      {
        "zh": "他礼貌的谈吐给大家留下了好印象。",
        "py": "Tā lǐmào de tántǔ gěi dàjiā liúxià le hǎo yìnxiàng.",
        "vi": "Cách ăn nói lịch sự của anh ấy đã để lại ấn tượng tốt cho mọi người."
      }
    ],
    "note": "Trong tiếng Việt hay nói 'tôi rất ấn tượng về…', nhưng trong tiếng Trung '印象' là danh từ nên không nói '我很印象', mà phải dùng '我对…印象很深' hoặc '给我留下了深刻印象'."
  },
  {
    "id": "ms4_18",
    "level": 4,
    "keyword": "后悔",
    "keywordPy": "hòuhuǐ",
    "pos": "Động từ",
    "keywordVi": "hối hận, hối tiếc",
    "scenePrompt": "Tình huống: Chàng trai nhìn chiếc áo mua vội bị lỗi đường may hoặc nhìn đồng hồ lỡ chuyến tàu vì dậy muộn.",
    "grammarPattern": "后悔 + (Động từ / Cụm câu) / 后悔莫及",
    "samples": [
      {
        "zh": "刚才买东西没仔细检查，现在真后悔。",
        "py": "Gāngcái mǎi dōngxi méi zǐxì jiǎnchá, xiànzài zhēn hòuhuǐ.",
        "vi": "Vừa nãy mua đồ không kiểm tra kỹ, bây giờ thật hối hận."
      },
      {
        "zh": "早知如此，他肯定不会做出让自己后悔的决定。",
        "py": "Zǎozhī rúcǐ, tā kěndìng bú huì zuòchū ràng zìjǐ hòuhuǐ de juédìng.",
        "vi": "Biết sớm thế này, anh ấy chắc chắn sẽ không đưa ra quyết định khiến bản thân hối hận."
      }
    ],
    "note": "Chú ý '后悔' chỉ sự ăn năn về việc bản thân đã làm sai hoặc lỡ làm, khác với '遗憾' (tiếc nuối khách quan dù không phải lỗi của mình)."
  },
  {
    "id": "ms4_19",
    "level": 4,
    "keyword": "感动",
    "keywordPy": "gǎndòng",
    "pos": "Động từ / Tính từ",
    "keywordVi": "cảm động, xúc động",
    "scenePrompt": "Tình huống: Một cô gái rưng rưng nước mắt mỉm cười khi nhận bó hoa và tấm thiệp chúc mừng bất ngờ từ bạn bè.",
    "grammarPattern": "被…感动 / 感到非常感动 / 令人感动",
    "samples": [
      {
        "zh": "看了这部感人的电影，观众们都非常感动。",
        "py": "Kàn le zhè bù gǎnrén de diànyǐng, guānzhòngmen dōu fēicháng gǎndòng.",
        "vi": "Xem xong bộ phim cảm động này, khán giả đều vô cùng xúc động."
      },
      {
        "zh": "大家被这位志愿者的无私精神深深感动了。",
        "py": "Dàjiā bèi zhè wèi zhìyuànzhě de wúsī jīngshén shēnshēn gǎndòng le.",
        "vi": "Mọi người đều bị tinh thần vô tư của tình nguyện viên này làm cho cảm động sâu sắc."
      }
    ],
    "note": "Phân biệt rõ: '感动' dùng cho cảm xúc trong lòng người ('我很感动': tôi rất cảm động), còn miêu tả câu chuyện/bộ phim khiến người xem xúc động nên dùng '感人' ('这个故事很感人')."
  },
  {
    "id": "ms4_20",
    "level": 4,
    "keyword": "提高",
    "keywordPy": "tígāo",
    "pos": "Động từ",
    "keywordVi": "nâng cao, cải thiện",
    "scenePrompt": "Tình huống: Biểu đồ đường màu xanh đi lên rõ rệt cùng hình ảnh học viên tự tin thuyết trình bằng tiếng Trung.",
    "grammarPattern": "提高 + Danh từ (水平、能力、效率、质量)",
    "samples": [
      {
        "zh": "每天坚持朗读能很快提高口语水平。",
        "py": "Měitiān jiānchí lǎngdú néng hěn kuài tígāo kǒuyǔ shuǐpíng.",
        "vi": "Mỗi ngày kiên trì đọc to có thể nhanh chóng nâng cao trình độ khẩu ngữ."
      },
      {
        "zh": "公司采取新措施后，工作效率大大提高了。",
        "py": "Gōngsī cǎiqǔ xīn cuòshī hòu, gōngzuò xiàolǜ dàdà tígāo le.",
        "vi": "Sau khi công ty áp dụng biện pháp mới, hiệu suất làm việc đã nâng cao rõ rệt."
      }
    ],
    "note": "Không dùng '提高价格' để nói tăng giá hàng hóa (nên dùng '涨价' hoặc '提高售价' khi có chủ đích), và không dùng '提高时间' để nói kéo dài thời gian (dùng '延长时间')."
  },
  {
    "id": "ms5_01",
    "level": 5,
    "keyword": "克服",
    "keywordPy": "kèfú",
    "pos": "Động từ",
    "keywordVi": "khắc phục, vượt qua",
    "scenePrompt": "Tình huống: Một vận động viên gặp chấn thương nhẹ vẫn kiên trì tập phục hồi để quay lại đường chạy.",
    "grammarPattern": "Chủ ngữ + 克服 + 困难/缺点/恐惧/障碍",
    "samples": [
      {
        "zh": "只要大家齐心协力，就一定能克服眼前的困难。",
        "py": "Zhǐyào dàjiā qíxīn xiélì, jiù yídìng néng kèfú yǎnqián de kùnnan.",
        "vi": "Chỉ cần mọi người đồng lòng hợp sức thì nhất định có thể vượt qua khó khăn trước mắt."
      },
      {
        "zh": "他经过反复练习，终于克服了上台演讲的紧张心理。",
        "py": "Tā jīngguò fǎnfù liànxí, zhōngyú kèfú le shàngtái yǎnjiǎng de jǐnzhāng xīnlǐ.",
        "vi": "Qua nhiều lần tập luyện, anh ấy cuối cùng đã khắc phục được tâm lý căng thẳng khi lên sân khấu thuyết trình."
      }
    ],
    "note": "克服 chuyên đi với khó khăn, khuyết điểm, tâm lý tiêu cực — tránh nhầm với 征服 (chinh phục thiên nhiên/khán giả)."
  },
  {
    "id": "ms5_02",
    "level": 5,
    "keyword": "发挥",
    "keywordPy": "fāhuī",
    "pos": "Động từ",
    "keywordVi": "phát huy (năng lực, vai trò, ưu thế)",
    "scenePrompt": "Tình huống: Nhóm sinh viên phân công mỗi người một thế mạnh để hoàn thành xuất sắc dự án nghiên cứu.",
    "grammarPattern": "Chủ ngữ + (充分)发挥 + 作用/优势/潜力/水平",
    "samples": [
      {
        "zh": "在这次团队合作中，每个人都充分发挥了自己的优势。",
        "py": "Zài zhè cì tuánduì hézuò zhōng, měi gè rén dōu chōngfèn fāhuī le zìjǐ de yōushì.",
        "vi": "Trong lần hợp tác nhóm này, mỗi người đều đã phát huy tối đa ưu thế của mình."
      },
      {
        "zh": "人工智能正在医疗诊断领域发挥越来越重要的作用。",
        "py": "Réngōng zhìnéng zhèngzài yīliáo zhěnduàn lǐngyù fāhuī yuèláiyuè zhòngyào de zuòyòng.",
        "vi": "Trí tuệ nhân tạo đang phát huy vai trò ngày càng quan trọng trong lĩnh vực chẩn đoán y tế."
      }
    ],
    "note": "Kết hợp kinh điển HSK 5: 充分发挥作用 / 发挥优势 / 发挥水平."
  },
  {
    "id": "ms5_03",
    "level": 5,
    "keyword": "改善",
    "keywordPy": "gǎishàn",
    "pos": "Động từ",
    "keywordVi": "cải thiện (điều kiện, môi trường, quan hệ)",
    "scenePrompt": "Tình huống: Con đường cũ trong khu phố được trồng thêm nhiều cây xanh và làm sạch đẹp hơn hẳn.",
    "grammarPattern": "Chủ ngữ + 改善 + 生活/环境/条件/关系/睡眠",
    "samples": [
      {
        "zh": "规律运动和早睡早起明显改善了她的睡眠质量。",
        "py": "Guīlǜ yùndòng hé zǎoshuì zǎoqǐ míngxiǎn gǎishàn le tā de shuìmián zhìliàng.",
        "vi": "Tập thể dục điều độ và ngủ sớm dậy sớm đã cải thiện rõ rệt chất lượng giấc ngủ của cô ấy."
      },
      {
        "zh": "新地铁线路开通后，周边居民的出行条件得到了很大改善。",
        "py": "Xīn dìtiě xiànlù kāitōng hòu, zhōubiān jūmín de chūxíng tiáojiàn dédào le hěn dà gǎishàn.",
        "vi": "Sau khi tuyến tàu điện ngầm mới khai trương, điều kiện đi lại của cư dân quanh đây được cải thiện rất nhiều."
      }
    ],
    "note": "改善 đi với điều kiện/môi trường/sức khỏe; kỹ thuật và phương pháp dùng 改进."
  },
  {
    "id": "ms5_04",
    "level": 5,
    "keyword": "珍惜",
    "keywordPy": "zhēnxī",
    "pos": "Động từ",
    "keywordVi": "trân trọng, quý trọng",
    "scenePrompt": "Tình huống: Nhóm bạn thân chụp ảnh kỷ niệm ngày tốt nghiệp đại học trước khi mỗi người một ngả.",
    "grammarPattern": "Chủ ngữ + 珍惜 + 时间/机会/友谊/眼前的一切",
    "samples": [
      {
        "zh": "青春只有一次，我们应当珍惜每一分每一秒的学习时间。",
        "py": "Qīngchūn zhǐyǒu yí cì, wǒmen yīngdāng zhēnxī měi yì fēn měi yì miǎo de xuéxí shíjiān.",
        "vi": "Tuổi trẻ chỉ có một lần, chúng ta nên trân trọng từng phút từng giây học tập."
      },
      {
        "zh": "这段来之不易的友谊值得我们用一生去珍惜。",
        "py": "Zhè duàn láizhībùyì de yǒuyì zhídé wǒmen yòng yìshēng qù zhēnxī.",
        "vi": "Tình bạn khó có được này đáng để chúng ta trân trọng suốt đời."
      }
    ],
    "note": "珍惜 chuyên dùng cho giá trị tinh thần, thời gian, cơ hội, tài nguyên (không dùng cho đồ vật vật lý bình thường)."
  },
  {
    "id": "ms5_05",
    "level": 5,
    "keyword": "反映",
    "keywordPy": "fǎnyìng",
    "pos": "Động từ",
    "keywordVi": "phản ánh, báo cáo lên trên",
    "scenePrompt": "Tình huống: Một bộ phim tài liệu ghi lại chân thực nhịp sống mưu sinh của người lao động thành phố.",
    "grammarPattern": "Tác phẩm/Dữ liệu + 反映 + 现实/问题 | 向 + Cấp trên + 反映 + 情况",
    "samples": [
      {
        "zh": "这篇调查报告真实地反映了年轻人的消费观念变化。",
        "py": "Zhè piān diàochá bàogào zhēnshí de fǎnyìng le niánqīngrén de xiāofèi guānniàn biànhuà.",
        "vi": "Bản báo cáo khảo sát này phản ánh chân thực sự thay đổi quan niệm tiêu dùng của giới trẻ."
      },
      {
        "zh": "大家已经把食堂卫生问题向学校后勤部门反映了。",
        "py": "Dàjiā yǐjīng bǎ shítáng wèishēng wèntí xiàng xuéxiào hòuqín bùmén fǎnyìng le.",
        "vi": "Mọi người đã phản ánh vấn đề vệ sinh căng-tin lên bộ phận hậu cần của trường rồi."
      }
    ],
    "note": "Đừng nhầm chữ 反映 (phản ánh/báo cáo) với từ đồng âm 反应 (phản ứng sinh lý/hóa học)."
  },
  {
    "id": "ms5_06",
    "level": 5,
    "keyword": "宁可…也不…",
    "keywordPy": "nìngkě…yě bù…",
    "pos": "Liên từ",
    "keywordVi": "thà… chứ nhất định không…",
    "scenePrompt": "Tình huống: Một người thợ thủ công tỉ mỉ làm chậm từng chi tiết chứ không chịu xuất xưởng sản phẩm lỗi.",
    "grammarPattern": "Chủ ngữ + 宁可 + Lựa chọn A (chịu thiệt), 也(不) + Lựa chọn B",
    "samples": [
      {
        "zh": "她宁可多花一倍时间打磨作品，也不愿降低质量标准。",
        "py": "Tā nìngkě duō huā yí bèi shíjiān dǎmó zuòpǐn, yě búyuàn jiàngdī zhìliàng biāozhǔn.",
        "vi": "Cô ấy thà bỏ thêm gấp đôi thời gian trau chuốt tác phẩm chứ không chịu hạ tiêu chuẩn chất lượng."
      },
      {
        "zh": "我宁可走路上班锻炼身体，也不想在早高峰堵在路上。",
        "py": "Wǒ nìngkě zǒulù shàngbān duànliàn shēntǐ, yě bù xiǎng zài zǎogāofēng dǔ zài lùshang.",
        "vi": "Tôi thà đi bộ đi làm để rèn luyện sức khỏe chứ không muốn kẹt xe giờ cao điểm sáng."
      }
    ],
    "note": "Khác với 与其A，不如B (chọn B), mẫu 宁可A，也不B là CHỌN vế A (dù bất lợi hơn) để tránh vế B."
  },
  {
    "id": "ms5_07",
    "level": 5,
    "keyword": "无论…都…",
    "keywordPy": "wúlùn…dōu…",
    "pos": "Liên từ",
    "keywordVi": "bất kể / dù… thì đều…",
    "scenePrompt": "Tình huống: Một chú shipper vẫn cần mẫn giao hàng đúng giờ bất kể trời nắng gắt hay mưa rào.",
    "grammarPattern": "无论 + Điều kiện mở (多么/怎么/什么/还是), Chủ ngữ + 都 + Kết quả",
    "samples": [
      {
        "zh": "无论遇到多大的挫折，他都始终保持乐观的心态。",
        "py": "Wúlùn yùdào duō dà de cuòzhé, tā dōu shǐzhōng bǎochí lèguān de xīntài.",
        "vi": "Dù gặp phải thất bại lớn đến đâu, anh ấy vẫn luôn giữ tâm thế lạc quan."
      },
      {
        "zh": "无论刮风还是下雨，爷爷每天清晨都会去湖边打太极拳。",
        "py": "Wúlùn guāfēng háishi xiàyǔ, yéye měitiān qīngchén dōu huì qù húbiān dǎ tàijíquán.",
        "vi": "Bất kể gió hay mưa, sáng sớm nào ông nội cũng ra bờ hồ tập thái cực quyền."
      }
    ],
    "note": "Sau 无论 bắt buộc là một mệnh đề có tính lựa chọn (A还是B) hoặc chứa từ nghi vấn (什么/怎么/多么), không đi với điều kiện đơn lẻ."
  },
  {
    "id": "ms5_08",
    "level": 5,
    "keyword": "启发",
    "keywordPy": "qǐfā",
    "pos": "Động từ / Danh từ",
    "keywordVi": "gợi mở, truyền cảm hứng",
    "scenePrompt": "Tình huống: Đọc xong một cuốn sách hay, bạn chợt nảy ra ý tưởng mới và ghi chép lia lịa vào sổ tay.",
    "grammarPattern": "A + 启发 + B (+ V) | A + 给 + B + 带来很大启发",
    "samples": [
      {
        "zh": "导师的这番话给了我很大的启发，让我找到了新的研究思路。",
        "py": "Dǎoshī de zhè fān huà gěi le wǒ hěn dà de qǐfā, ràng wǒ zhǎodào le xīn de yánjiū sīlù.",
        "vi": "Lời nói này của thầy hướng dẫn đã gợi mở cho tôi rất nhiều, giúp tôi tìm ra hướng nghiên cứu mới."
      },
      {
        "zh": "好的教育应当善于启发学生独立思考。",
        "py": "Hǎo de jiàoyù yīngdāng shànyú qǐfā xuésheng dúlì sīkǎo.",
        "vi": "Nền giáo dục tốt cần khéo léo khơi gợi học sinh tư duy độc lập."
      }
    ],
    "note": "Dùng rất tự nhiên trong bài viết nghị luận HSK 5 với cụm '深受启发' (được gợi mở sâu sắc)."
  },
  {
    "id": "ms5_09",
    "level": 5,
    "keyword": "避免",
    "keywordPy": "bìmiǎn",
    "pos": "Động từ",
    "keywordVi": "tránh khỏi, né tránh",
    "scenePrompt": "Tình huống: Bạn kiểm tra kỹ lại bài viết hai lần trước khi nộp để không mắc lỗi sai chính tả đáng tiếc.",
    "grammarPattern": "Chủ ngữ + 避免 + (发生)Sự việc xấu / Động từ",
    "samples": [
      {
        "zh": "提前做好规划可以有效避免临时手忙脚乱。",
        "py": "Tíqián zuò hǎo guīhuà kěyǐ yǒuxiào bìmiǎn línshí shǒumáng-jiǎoluàn.",
        "vi": "Lập kế hoạch trước có thể tránh hiệu quả tình trạng cuống cuồng vào phút chót."
      },
      {
        "zh": "沟通时表达清楚，就能避免许多不必要的误会。",
        "py": "Gōutōng shí biǎodá qīngchu, jiù néng bìmiǎn xǔduō bú bìyào de wùhuì.",
        "vi": "Khi giao tiếp diễn đạt rõ ràng là có thể tránh được nhiều hiểu lầm không đáng có."
      }
    ],
    "note": "避免 bản thân đã mang nghĩa phủ định ('tránh không để xảy ra'), nên KHÔNG thêm 不 sau 避免 (sai: 避免不犯错 → đúng: 避免犯错)."
  },
  {
    "id": "ms5_10",
    "level": 5,
    "keyword": "明显",
    "keywordPy": "míngxiǎn",
    "pos": "Tính từ",
    "keywordVi": "rõ rệt, rõ ràng",
    "scenePrompt": "Tình huống: Biểu đồ kết quả học tập cho thấy điểm số tăng vọt sau hai tháng ôn tập có hệ thống.",
    "grammarPattern": "Chủ ngữ + (有)明显(的) + Danh từ | 明显 + Động từ/Tính từ",
    "samples": [
      {
        "zh": "坚持每天跟读半小时后，她的发音有了明显的进步。",
        "py": "Jiānchí měitiān gēndú bàn xiǎoshí hòu, tā de fāyīn yǒu le míngxiǎn de jìnbù.",
        "vi": "Sau khi kiên trì đọc nhại nửa tiếng mỗi ngày, phát âm của cô ấy đã có tiến bộ rõ rệt."
      },
      {
        "zh": "入秋以后，早晚的温差明显变大了。",
        "py": "Rùqiū yǐhòu, zǎowǎn de wēnchā míngxiǎn biàn dà le.",
        "vi": "Sau khi sang thu, chênh lệch nhiệt độ sáng tối lớn lên rõ rệt."
      }
    ],
    "note": "明显 vừa làm định ngữ (明显的进步/变化), vừa làm trạng ngữ trực tiếp trước động từ (明显提高/改善)."
  }
];

  const essayPrompts = [
  {
    "id": "w5_01",
    "level": 5,
    "type": "keywords",
    "title": "HSK 5 • Đề 1: Chuyến du lịch cuối tuần",
    "targetChars": 80,
    "recommendedMinutes": 15,
    "keywords": [
      {
        "zh": "周末",
        "py": "zhōumò",
        "vi": "cuối tuần"
      },
      {
        "zh": "风景",
        "py": "fēngjǐng",
        "vi": "phong cảnh"
      },
      {
        "zh": "放松",
        "py": "fàngsōng",
        "vi": "thư giãn"
      },
      {
        "zh": "照相",
        "py": "zhàoxiàng",
        "vi": "chụp ảnh"
      },
      {
        "zh": "难忘",
        "py": "nánwàng",
        "vi": "khó quên"
      }
    ],
    "instruction": "Sử dụng đầy đủ 5 từ khóa trên để viết một đoạn văn ngắn khoảng 80 chữ Hán kể về một chuyến đi ngắn ngày giúp bạn giải tỏa áp lực.",
    "outline": [
      "Mở đoạn: Nêu thời gian (周末) và lý do muốn ra ngoài thư giãn (放松) sau tuần làm việc/học tập.",
      "Thân đoạn: Tả phong cảnh thiên nhiên đẹp (风景) và hoạt động cùng bạn bè chụp ảnh lưu niệm (照相).",
      "Kết đoạn: Bày tỏ cảm xúc vui vẻ, kỷ niệm khó quên (难忘)."
    ],
    "sampleZh": "平时工作很忙，压力很大，所以我决定这个周末和朋友去郊外爬山放松一下。那天天气特别好，山上的风景非常迷人，到处都是绿树和鲜花。我们一边聊天一边欣赏美景，还用手机照相留念。这次短途旅行让我心情愉快，真是令人难忘。",
    "sampleVi": "Ngày thường công việc rất bận, áp lực lớn nên tôi quyết định cuối tuần này cùng bạn đi ngoại ô leo núi thư giãn một chút. Hôm đó thời tiết đặc biệt đẹp, phong cảnh trên núi vô cùng quyến rũ, khắp nơi đều là cây xanh và hoa tươi. Chúng tôi vừa trò chuyện vừa ngắm cảnh đẹp, còn dùng điện thoại chụp ảnh kỷ niệm. Chuyến du lịch ngắn này giúp tâm trạng tôi vui vẻ hẳn lên, thật sự rất khó quên."
  },
  {
    "id": "w5_02",
    "level": 5,
    "type": "keywords",
    "title": "HSK 5 • Đề 2: Thói quen đọc sách",
    "targetChars": 80,
    "recommendedMinutes": 15,
    "keywords": [
      {
        "zh": "习惯",
        "py": "xíguàn",
        "vi": "thói quen"
      },
      {
        "zh": "丰富",
        "py": "fēngfù",
        "vi": "phong phú"
      },
      {
        "zh": "安静",
        "py": "ānjìng",
        "vi": "yên tĩnh"
      },
      {
        "zh": "知识",
        "py": "zhīshi",
        "vi": "kiến thức"
      },
      {
        "zh": "坚持",
        "py": "jiānchí",
        "vi": "kiên trì"
      }
    ],
    "instruction": "Dùng 5 từ khóa trên viết đoạn văn khoảng 80 chữ Hán chia sẻ lợi ích của việc duy trì thói quen đọc sách mỗi ngày.",
    "outline": [
      "Mở đoạn: Giới thiệu thói quen (习惯) đọc sách trước khi đi ngủ trong không gian yên tĩnh (安静).",
      "Thân đoạn: Sách giúp mở rộng kiến thức (知识) và làm cuộc sống tinh thần thêm phong phú (丰富).",
      "Kết đoạn: Khẳng định sẽ tiếp tục kiên trì (坚持) thói quen tốt này."
    ],
    "sampleZh": "从小我就养成了每天晚上读书的好习惯。夜深了，周围非常安静，正是看书的好时候。读书不仅能帮我学到很多有用的知识，还能让我的精神生活变得更加丰富。无论工作多忙，我每天都会抽出半小时阅读，这个好习惯我会一直坚持下去。",
    "sampleVi": "Từ nhỏ tôi đã hình thành thói quen tốt đọc sách mỗi tối. Đêm khuya, xung quanh vô cùng yên tĩnh, đúng là lúc thích hợp để đọc sách. Đọc sách không chỉ giúp tôi học được nhiều kiến thức hữu ích mà còn làm đời sống tinh thần thêm phong phú. Dù công việc bận rộn đến đâu, mỗi ngày tôi đều dành nửa tiếng đọc sách và sẽ kiên trì thói quen này mãi."
  },
  {
    "id": "w5_03",
    "level": 5,
    "type": "keywords",
    "title": "HSK 5 • Đề 3: Vượt qua khó khăn khi học tiếng Trung",
    "targetChars": 80,
    "recommendedMinutes": 15,
    "keywords": [
      {
        "zh": "困难",
        "py": "kùnnan",
        "vi": "khó khăn"
      },
      {
        "zh": "鼓励",
        "py": "gǔlì",
        "vi": "động viên"
      },
      {
        "zh": "方法",
        "py": "fāngfǎ",
        "vi": "phương pháp"
      },
      {
        "zh": "进步",
        "py": "jìnbù",
        "vi": "tiến bộ"
      },
      {
        "zh": "信心",
        "py": "xìnxīn",
        "vi": "niềm tin"
      }
    ],
    "instruction": "Viết đoạn văn khoảng 80 chữ Hán kể lại trải nghiệm gặp khó khăn khi học ngoại ngữ và cách bạn tiến bộ nhờ sự động viên.",
    "outline": [
      "Mở đoạn: Ban đầu học chữ Hán gặp nhiều khó khăn (困难), suýt nản lòng.",
      "Thân đoạn: Nhờ thầy cô/bạn bè động viên (鼓励) và tìm ra phương pháp (方法) học phù hợp.",
      "Kết đoạn: Dần dần tiến bộ (进步) rõ rệt và có thêm niềm tin (信心)."
    ],
    "sampleZh": "刚开始学习汉语时，我遇到了很多困难，特别是汉字很难记住，我差点想放弃。幸好老师一直鼓励我，还教给我科学的学习方法。每天我坚持听录音、写汉字，几个月后，我的汉语水平有了很大的进步。现在我对学好汉语充满了信心。",
    "sampleVi": "Khi mới bắt đầu học tiếng Hán, tôi gặp rất nhiều khó khăn, đặc biệt là chữ Hán rất khó nhớ nên suýt nữa muốn bỏ cuộc. May mà thầy cô luôn động viên và dạy tôi phương pháp học khoa học. Mỗi ngày tôi kiên trì nghe băng và viết chữ Hán, vài tháng sau trình độ tiếng Hán đã tiến bộ rõ rệt. Bây giờ tôi tràn đầy tự tin sẽ học giỏi tiếng Hán."
  },
  {
    "id": "w5_04",
    "level": 5,
    "type": "keywords",
    "title": "HSK 5 • Đề 4: Sống xanh bảo vệ môi trường",
    "targetChars": 80,
    "recommendedMinutes": 15,
    "keywords": [
      {
        "zh": "环境",
        "py": "huánjìng",
        "vi": "môi trường"
      },
      {
        "zh": "垃圾",
        "py": "lājī",
        "vi": "rác thải"
      },
      {
        "zh": "节约",
        "py": "jiéyuē",
        "vi": "tiết kiệm"
      },
      {
        "zh": "塑料袋",
        "py": "sùliàodài",
        "vi": "túi ni-lông"
      },
      {
        "zh": "责任",
        "py": "zérèn",
        "vi": "trách nhiệm"
      }
    ],
    "instruction": "Viết đoạn văn khoảng 80 chữ Hán nói về những hành động nhỏ hằng ngày để bảo vệ môi trường.",
    "outline": [
      "Mở đoạn: Bảo vệ môi trường (环境) là trách nhiệm (责任) của mỗi người.",
      "Thân đoạn: Hành động cụ thể: phân loại rác (垃圾), giảm dùng túi ni-lông (塑料袋), tiết kiệm (节约) điện nước.",
      "Kết đoạn: Lời kêu gọi mọi người cùng hành động để cuộc sống tươi đẹp hơn."
    ],
    "sampleZh": "保护环境是我们每个人的责任。在日常生活中，我们可以从身边的小事做起。比如，出门买菜时尽量少用塑料袋，改用环保布袋；平时注意节约用水和用电；还要把垃圾分类放好。只要大家一起行动，我们的地球一定会变得越来越美丽。",
    "sampleVi": "Bảo vệ môi trường là trách nhiệm của mỗi người chúng ta. Trong cuộc sống hằng ngày, ta có thể bắt đầu từ những việc nhỏ bên cạnh mình. Ví dụ khi đi chợ cố gắng hạn chế dùng túi ni-lông mà đổi sang túi vải; chú ý tiết kiệm điện nước; phân loại rác cẩn thận. Chỉ cần mọi người cùng hành động, Trái Đất của chúng ta nhất định sẽ ngày càng tươi đẹp."
  },
  {
    "id": "w5_05",
    "level": 5,
    "type": "keywords",
    "title": "HSK 5 • Đề 5: Bữa cơm gia đình ấm áp",
    "targetChars": 80,
    "recommendedMinutes": 15,
    "keywords": [
      {
        "zh": "加班",
        "py": "jiābān",
        "vi": "tăng ca"
      },
      {
        "zh": "准备",
        "py": "zhǔnbèi",
        "vi": "chuẩn bị"
      },
      {
        "zh": "味道",
        "py": "wèidào",
        "vi": "hương vị"
      },
      {
        "zh": "感动",
        "py": "gǎndòng",
        "vi": "cảm động"
      },
      {
        "zh": "幸福",
        "py": "xìngfú",
        "vi": "hạnh phúc"
      }
    ],
    "instruction": "Dùng 5 từ khóa trên viết một câu chuyện nhỏ khoảng 80 chữ Hán về tình cảm gia đình.",
    "outline": [
      "Mở đoạn: Tối qua tăng ca (加班) về muộn và rất mệt.",
      "Thân đoạn: Về nhà thấy người thân đã chuẩn bị (准备) sẵn cơm nóng canh ngọt, hương vị (味道) tuyệt vời.",
      "Kết đoạn: Cảm thấy vô cùng cảm động (感动) và hạnh phúc (幸福)."
    ],
    "sampleZh": "昨晚因为公司有急事，我加班到很晚才回到家，又累又饿。一进门，就看见妈妈正在厨房为我准备热乎乎的晚饭。虽然只是几道普通的家常菜，但味道特别香。看着妈妈关心的眼神，我心里非常感动，觉得有家人的陪伴真幸福。",
    "sampleVi": "Tối qua vì công ty có việc gấp nên tôi tăng ca đến rất muộn mới về nhà, vừa mệt vừa đói. Vừa bước vào cửa đã thấy mẹ đang chuẩn bị bữa tối nóng hổi cho mình trong bếp. Tuy chỉ là vài món ăn gia đình bình dị nhưng hương vị thơm ngon đặc biệt. Nhìn ánh mắt quan tâm của mẹ, lòng tôi vô cùng cảm động và thấy thật hạnh phúc khi có gia đình bên cạnh."
  },
  {
    "id": "w5_06",
    "level": 5,
    "type": "keywords",
    "title": "HSK 5 • Đề 6: Tập thể dục & Sức khỏe",
    "targetChars": 80,
    "recommendedMinutes": 15,
    "keywords": [
      {
        "zh": "健康",
        "py": "jiànkāng",
        "vi": "sức khỏe"
      },
      {
        "zh": "锻炼",
        "py": "duànliàn",
        "vi": "rèn luyện"
      },
      {
        "zh": "熬夜",
        "py": "áoyè",
        "vi": "thức khuya"
      },
      {
        "zh": "精神",
        "py": "jīngshen",
        "vi": "tinh thần"
      },
      {
        "zh": "重要",
        "py": "zhòngyào",
        "vi": "quan trọng"
      }
    ],
    "instruction": "Viết đoạn văn khoảng 80 chữ Hán khuyên bạn bè giữ gìn sức khỏe và thay đổi thói quen sinh hoạt.",
    "outline": [
      "Mở đoạn: Nhấn mạnh sức khỏe (健康) là tài sản quan trọng (重要) nhất.",
      "Thân đoạn: Tránh thức khuya (熬夜), dành thời gian rèn luyện (锻炼) thân thể.",
      "Kết đoạn: Tập thể thao giúp tinh thần (精神) sảng khoái, làm việc hiệu quả."
    ],
    "sampleZh": "人们常说，健康是人生中最重要的财富。以前我经常熬夜看手机，第二天总是觉得很累。后来我改掉了这个坏毛病，每天早起去公园跑步锻炼半小时。坚持一段时间后，我不仅身体变好了，白天工作时精神也特别集中，效率高了很多。",
    "sampleVi": "Người ta thường nói sức khỏe là tài sản quan trọng nhất đời người. Trước đây tôi hay thức khuya xem điện thoại nên hôm sau luôn cảm thấy mệt mỏi. Sau này tôi bỏ thói quen xấu đó, mỗi sáng dậy sớm ra công viên chạy bộ rèn luyện nửa tiếng. Kiên trì một thời gian, không chỉ cơ thể khỏe hơn mà ban ngày làm việc tinh thần cũng rất tập trung, hiệu suất tăng lên nhiều."
  },
  {
    "id": "w5_07",
    "level": 5,
    "type": "keywords",
    "title": "HSK 5 • Đề 7: Chuẩn bị phỏng vấn xin việc",
    "targetChars": 80,
    "recommendedMinutes": 15,
    "keywords": [
      {
        "zh": "面试",
        "py": "miànshì",
        "vi": "phỏng vấn"
      },
      {
        "zh": "紧张",
        "py": "jǐnzhāng",
        "vi": "căng thẳng"
      },
      {
        "zh": "经验",
        "py": "jīngyàn",
        "vi": "kinh nghiệm"
      },
      {
        "zh": "礼貌",
        "py": "lǐmào",
        "vi": "lễ phép/lịch sự"
      },
      {
        "zh": "录取",
        "py": "lùqǔ",
        "vi": "trúng tuyển"
      }
    ],
    "instruction": "Viết đoạn văn khoảng 80 chữ Hán kể lại một buổi phỏng vấn đáng nhớ.",
    "outline": [
      "Mở đoạn: Trước buổi phỏng vấn (面试) đầu tiên cảm thấy hơi căng thẳng (紧张).",
      "Thân đoạn: Giữ thái độ lịch sự (礼貌), tự tin trình bày kinh nghiệm (经验) thực tập.",
      "Kết đoạn: Cuối cùng nhận được thông báo trúng tuyển (录取)."
    ],
    "sampleZh": "上星期是我大学毕业后第一次参加工作面试，出发前我心里非常紧张。进门后，我礼貌地向面试官问好，慢慢地冷静下来。我认真回答了提问，并介绍了自己实习时积累的经验。两天后，我收到了被公司录取的好消息，真是太开心了。",
    "sampleVi": "Tuần trước là lần đầu tiên tôi đi phỏng vấn xin việc sau khi tốt nghiệp đại học, trước khi đi lòng rất căng thẳng. Sau khi vào phòng, tôi lễ phép chào người phỏng vấn rồi dần bình tĩnh lại. Tôi trả lời nghiêm túc các câu hỏi và giới thiệu kinh nghiệm tích lũy khi thực tập. Hai ngày sau tôi nhận được tin vui trúng tuyển, thật sự quá hạnh phúc."
  },
  {
    "id": "w5_08",
    "level": 5,
    "type": "keywords",
    "title": "HSK 5 • Đề 8: Mua sắm trực tuyến tiện lợi",
    "targetChars": 80,
    "recommendedMinutes": 15,
    "keywords": [
      {
        "zh": "网购",
        "py": "wǎnggòu",
        "vi": "mua sắm online"
      },
      {
        "zh": "方便",
        "py": "fāngbiàn",
        "vi": "thuận tiện"
      },
      {
        "zh": "质量",
        "py": "zhìliàng",
        "vi": "chất lượng"
      },
      {
        "zh": "评价",
        "py": "píngjià",
        "vi": "đánh giá"
      },
      {
        "zh": "后悔",
        "py": "hòuhuǐ",
        "vi": "hối hận"
      }
    ],
    "instruction": "Viết đoạn văn khoảng 80 chữ Hán nêu cảm nhận về mua sắm trực tuyến và kinh nghiệm chọn hàng.",
    "outline": [
      "Mở đoạn: Mua sắm online (网购) ngày càng phổ biến vì rất thuận tiện (方便).",
      "Thân đoạn: Trước khi mua cần xem kỹ đánh giá (评价) để đảm bảo chất lượng (质量).",
      "Kết đoạn: Mua sắm lý trí để không phải hối hận (后悔)."
    ],
    "sampleZh": "现在网购已经成为年轻人生活中不可缺少的一部分，因为它不仅价格便宜，而且非常方便。不过，网上的商品质量有好有坏，所以我在下单前总会仔细看看其他买家的评价。只要理性消费、货比三家，就能买到满意的东西，不会觉得后悔。",
    "sampleVi": "Ngày nay mua sắm trực tuyến đã trở thành một phần không thể thiếu trong đời sống giới trẻ vì giá cả phải chăng mà lại rất thuận tiện. Tuy nhiên chất lượng hàng trên mạng có tốt có xấu, nên trước khi đặt hàng tôi luôn xem kỹ đánh giá của người mua trước. Chỉ cần tiêu dùng lý trí và so sánh kỹ, bạn sẽ mua được món đồ ưng ý mà không phải hối hận."
  },
  {
    "id": "w6_01",
    "level": 6,
    "type": "summary",
    "title": "HSK 6 • Đề 1: Cậu bé và những chiếc đinh trên hàng rào",
    "targetChars": 400,
    "recommendedMinutes": 45,
    "keywords": [],
    "sourceText": "有一个小男孩，脾气非常暴躁，只要遇到一点儿不如意的事情，就会大发雷霆，甚至对身边的朋友和家人说出十分伤人的话。他的父亲看到孩子这样，心里十分担忧，一直想找个好办法来帮他改掉这个坏毛病。\n\n有一天，父亲给了小男孩一大包铁钉和一把锤子，语重心长地对他说：“孩子，以后每当你控制不住自己的脾气，对别人发火的时候，就到院子后面，往那块木头栅栏上钉一颗钉子。”小男孩觉得这事挺新鲜，便答应了。\n\n第一天，小男孩因为一点小事和同学吵架，又对妹妹发了火，他在栅栏上整整钉了三十七颗钉子。每次举起锤子砸钉子时，他都觉得很解气，但看着满手心的红印子，心里也隐隐觉得有点累。接下来的几个星期里，他开始学着控制自己的情绪。每当怒气快要涌上来时，一想到又要跑去院子里费力气钉钉子，他就会先深呼吸几口，努力让自己冷静下来。\n\n慢慢地，小男孩每天往栅栏上钉钉子的数量越来越少，从一天二十几颗降到十几颗，再到几颗。他发现，其实忍住不发脾气比去钉钉子要轻松得多。终于有一天，小男孩一整天都没有发一次脾气，一颗钉子也没钉。他兴奋地跑去告诉父亲。父亲听了很欣慰，微笑着说：“真了不起！从今天起，只要你一整天都没有发脾气，就可以从栅栏上拔掉一颗钉子。”\n\n日子一天天过去，小男孩越来越懂得体谅别人，脾气也温和了许多。终于，他把木头栅栏上的最后一颗钉子也拔掉了。他高高兴兴地拉着父亲来到院子后面，指着栅栏说：“爸爸，您看，所有的钉子都被我拔光了！”\n\n父亲走上前，轻轻抚摸着那块木头栅栏，没有立刻表扬他，而是指着木头上密密麻麻的小洞说：“孩子，你做得很好，学会了控制情绪。可是你看，这面栅栏还能恢复到原来的样子吗？那些钉子虽然拔掉了，但留下的坑洞却永远不会消失。这就像我们发脾气时说出的伤人的话一样，即使事后你道了歉，在别人心里留下的伤口依然难以完全抹去。所以，说话之前一定要三思，千万不要轻易伤害爱我们的人。”小男孩低头看着栅栏上的洞，沉默了许久，终于深刻地明白了父亲的良苦用心。",
    "instruction": "Đọc kỹ câu chuyện (~850 chữ) trong 10 phút, sau đó tóm tắt lại cốt truyện, giữ nguyên các tình tiết chính và thông điệp cốt lõi xuống khoảng 350–400 chữ Hán (không nêu ý kiến cá nhân).",
    "outline": [
      "Mở bài: Cậu bé nóng tính hay nói lời làm tổn thương người khác; người cha lo lắng nên đưa đinh và búa, dặn mỗi lần nổi nóng hãy đóng một cái đinh lên hàng rào gỗ.",
      "Diễn biến 1: Ngày đầu cậu đóng 37 cái đinh; dần dần thấy đóng đinh mệt nên học cách kiềm chế, số đinh giảm dần cho đến ngày không đóng cái nào.",
      "Diễn biến 2: Cha khen ngợi và bảo mỗi ngày không nổi nóng được nhổ 1 cái đinh; cuối cùng cậu nhổ sạch toàn bộ đinh.",
      "Kết bài: Cha chỉ vào những lỗ đinh trên gỗ nhắc nhở: lời nói làm tổn thương người khác giống như vết đinh, dù xin lỗi vẫn để lại vết sẹo khó xóa."
    ],
    "sampleZh": "有个小男孩脾气十分暴躁，经常在生气时说出伤人的话。父亲为了帮他改掉这个毛病，给了他一包钉子和一把锤子，让他每发一次脾气，就在后院的木栅栏上钉一颗钉子。\n\n第一天，小男孩就钉了三十七颗钉子。后来，他觉得钉钉子太累，便开始学着控制情绪，每天钉的钉子越来越少。终于有一天，他一整天都没有发火。父亲得知后非常高兴，让他以后每忍住一天不发脾气，就从栅栏上拔掉一颗钉子。\n\n不久之后，小男孩把所有的钉子都拔光了，兴奋地请父亲来看。然而，父亲指着栅栏上密密麻麻的坑洞告诉他：钉子虽然拔掉了，木头却再也无法恢复原样。发脾气时说出的伤人话语也是如此，即使事后道歉，在别人心里留下的伤痕依然难以消除。小男孩听后，深深领悟了父亲的教诲。",
    "sampleVi": "Có một cậu bé tính khí rất nóng nảy, thường nói những lời làm tổn thương người khác khi tức giận. Để giúp con sửa tật xấu này, người cha đưa cho cậu một túi đinh và một chiếc búa, bảo mỗi lần nổi nóng hãy đóng một cái đinh lên hàng rào gỗ sau vườn. Ngày đầu tiên cậu đóng 37 cái đinh. Sau đó vì thấy đóng đinh quá mệt, cậu bắt đầu học cách kiềm chế cảm xúc, số đinh đóng mỗi ngày ít dần rồi đến một ngày không đóng cái nào. Người cha rất vui, bảo cậu từ nay mỗi ngày nhịn được không nổi giận thì nhổ đi một cái đinh. Không lâu sau cậu nhổ sạch toàn bộ đinh và hào hứng mời cha ra xem. Thế nhưng người cha chỉ vào những lỗ đinh dày đặc trên hàng rào và nói: đinh tuy đã nhổ, nhưng gỗ không thể trở lại như xưa. Lời nói làm tổn thương người khác khi nóng giận cũng vậy, dù sau đó có xin lỗi thì vết sẹo trong lòng người ta vẫn khó xóa nhòa. Cậu bé nghe xong liền thấu hiểu sâu sắc lời dạy của cha."
  },
  {
    "id": "w6_02",
    "level": 6,
    "type": "summary",
    "title": "HSK 6 • Đề 2: Chiếc cốc thủy tinh và áp lực cuộc sống",
    "targetChars": 400,
    "recommendedMinutes": 45,
    "keywords": [],
    "sourceText": "在一堂心理学公开课上，一位经验丰富的老教授走上讲台，没有急着翻开课本，而是微笑着从讲台下端起一个装了半杯水的透明玻璃杯。教室里顿时安静下来，学生们纷纷猜测教授又要做什么经典的实验。\n\n教授环视了一下全班同学，问了一个看似十分简单的问题：“各位同学，请大家猜一猜，我手里拿的这杯水有多重？”台下的学生立刻活跃起来，有的说二百克，有的说三百克，还有的猜测大约半斤左右。教授听完大家的回答，笑着摇了摇头说：“其实，它的绝对重量并没有那么重要，真正决定它重量的，是我举着它的时间。”\n\n学生们都露出疑惑的表情，教授接着解释道：“如果我只举着这杯水一分钟，我觉得它轻而易举，一点问题也没有；如果我连续举着它一个小时，我的右臂肯定会感到酸痛难忍；如果我被迫一整天都保持这个姿势举着它，那么到了晚上，我的手臂恐怕就会完全麻木，甚至失去知觉。在这三种情况里，水杯本身的重量自始至终都没有发生任何变化，可是我举得越久，它在我眼里就会变得越沉重。”\n\n同学们若有所思地点了点头。教授把水杯轻轻放回讲桌上，神情变得严肃而温和：“其实，生活中的各种压力、烦恼和痛苦，就像这杯水一样。如果你只是偶尔想一想，或者短暂地承受一下，它不会对你造成太大的影响；但如果你整天把这些烦恼放在心上，从早到晚背负着它们，却从来不肯放下，那么这些压力就会越积越重，最终让你筋疲力尽，甚至崩溃，无法再继续前进。”\n\n下课铃声快响了，教授总结道：“记住，不管你的工作有多繁忙，生活中有多少不如意，每天晚上睡觉之前，一定要学会像我刚才那样，把那杯‘水’轻轻地放在桌子上。只有学会适时地放下负担，让心灵得到充分的休息，第二天早上醒来时，你才会有足够的力量去迎接新的挑战。”教室里响起了热烈的掌声。",
    "instruction": "Đọc kỹ bài giảng (~770 chữ) và tóm tắt súc tích lại xuống khoảng 350–400 chữ Hán, giữ rõ thí nghiệm ly nước của giáo sư và bài học về cách buông bỏ áp lực.",
    "outline": [
      "Mở bài: Trong giờ tâm lý, giáo sư cầm một ly nước hỏi sinh viên nó nặng bao nhiêu.",
      "Thân bài: Sinh viên đoán 200–300g, nhưng giáo sư giải thích trọng lượng thật phụ thuộc vào thời gian cầm (1 phút thấy nhẹ, 1 giờ mỏi tay, cả ngày tê liệt dù trọng lượng ly không đổi).",
      "Kết bài: Giáo sư ví áp lực cuộc sống giống như ly nước đó: nếu không biết đặt xuống nghỉ ngơi trước khi ngủ, con người sẽ kiệt sức; học cách buông bỏ mới có sức cho ngày mới."
    ],
    "sampleZh": "在一堂心理学课上，老教授端起半杯水问学生这杯水有多重。学生们纷纷猜测在二三百克左右。教授却笑着说，绝对重量并不重要，关键在于举着它的时间。\n\n教授解释说，如果只举一分钟，会觉得很轻松；举一个小时，手臂就会酸痛；如果举上一整天，手臂就会麻木甚至失去知觉。在这期间，水杯本身的重量从未改变，但举得越久，感受到的重量就越沉重。\n\n随后教授将杯子放回桌上，告诉大家生活中的压力与烦恼就像这杯水。如果短暂思考并无大碍，但若整天背负不放，压力就会让人筋疲力尽。因此，每天睡前都应学会放下“水杯”，让身心充分休息，才能在第二天拥有足够的力量去面对新的挑战。",
    "sampleVi": "Trong một tiết học tâm lý, vị giáo sư lớn tuổi cầm nửa ly nước lên hỏi sinh viên xem ly nước nặng bao nhiêu. Các sinh viên đoán khoảng hai ba trăm gam. Giáo sư mỉm cười nói trọng lượng tuyệt đối không quan trọng, mấu chốt nằm ở thời gian cầm nó. Thầy giải thích nếu chỉ cầm một phút sẽ thấy rất nhẹ; cầm một giờ cánh tay sẽ đau mỏi; nếu cầm suốt cả ngày cánh tay sẽ tê cứng thậm chí mất cảm giác. Trong suốt thời gian đó, trọng lượng ly nước không hề thay đổi, nhưng cầm càng lâu thì cảm giác càng nặng nề. Sau đó giáo sư đặt ly nước lên bàn và nói áp lực, phiền muộn trong cuộc sống cũng giống như ly nước này. Nghĩ thoáng qua thì không sao, nhưng nếu cả ngày gánh trên vai không chịu buông, áp lực sẽ khiến ta kiệt sức. Vì vậy trước khi ngủ mỗi tối, hãy học cách đặt 'ly nước' xuống để thân tâm nghỉ ngơi đầy đủ, mới có đủ sức lực đón nhận thử thách ngày hôm sau."
  },
  {
    "id": "w6_03",
    "level": 6,
    "type": "summary",
    "title": "HSK 6 • Đề 3: Đường xa mới biết sức ngựa — Bức tranh bị cắt góc",
    "targetChars": 400,
    "recommendedMinutes": 45,
    "keywords": [],
    "sourceText": "很久以前，有一位著名的老画家，年纪越来越大，精力大不如前，便想从自己的三个徒弟中挑选一个最优秀的人，来继承自己全部的绘画技艺和画室。这三个徒弟平时都很勤奋，基本功也十分扎实，一时间老画家也很难做出决定，于是决定通过一次特殊的测试来考察他们的真正水平。\n\n一天，老画家拿出三张一模一样的上等宣纸，交给三个徒弟，并对他们说：“请你们用七天时间，各自画一幅《深山古寺》交给我。记住，无论画成什么样，都要用心去构思。”说完便转身离开了。七天之后，三个徒弟如期交上了自己的画作。\n\n大徒弟画得十分精细，山石、松树、古寺的屋檐都刻画得栩栩如生，连寺门前的台阶都数得清清楚楚；二徒弟则擅长用墨，整幅画云雾缭绕，古寺隐约可见，显得十分幽静雅致。老画家看了前两幅画，微微点了点头，但并没有多说什么。接着，他展开了三徒弟的画。\n\n令人惊讶的是，三徒弟的画上根本没有画什么古寺，画面里只有一片连绵起伏的青山、一条弯弯曲曲的小路，以及小路尽头的一座小木桥，甚至连寺庙的屋顶都没露出来。就在大家以为三徒弟跑题了的时候，老画家却露出了满意的笑容，指着画中正在过桥的一个挑水小和尚说道：“你们看，这小和尚挑着水往山林深处走，山林尽头虽然看不见寺庙，但只要有挑水和尚在，人们自然就会知道，那深山里一定藏着一座古寺。这就是‘画外之意’，也是艺术最高的境界。”最终，三徒弟凭借独特的想象力和意境赢得了老画家的认可。",
    "instruction": "Đọc kỹ câu chuyện (~680 chữ) và tóm tắt xuống khoảng 320–380 chữ Hán, làm rõ bài thi chọn đệ tử của lão họa sĩ và lý do người đệ tử thứ ba chiến thắng.",
    "outline": [
      "Mở bài: Lão họa sĩ muốn chọn người kế nghiệp trong 3 đệ tử nên ra đề thi vẽ bức 'Thâm sơn cổ tự' trong 7 ngày.",
      "Diễn biến: Đại đệ tử vẽ chi tiết từng bậc thềm, nhị đệ tử vẽ mây mù u tịch. Riêng tam đệ tử chỉ vẽ núi non, đường mòn, cầu nhỏ và chú tiểu gánh nước đi vào rừng sâu mà không vẽ chùa.",
      "Kết bài: Lão họa sĩ khen ngợi bức tranh thứ ba có 'họa ngoại chi ý' (ý tại ngôn ngoại) và chọn tam đệ tử làm người kế nghiệp."
    ],
    "sampleZh": "从前有位老画家，想从三个勤奋的徒弟中选出最优秀的一位来继承技艺。于是，他让三人用七天时间各自画一幅《深山古寺》。\n\n七天后，大徒弟交来的画作细节逼真，连寺前的台阶都清晰可见；二徒弟的画则水墨浓淡相宜，古寺在云雾中若隐若现。老画家看后只是微微点头。最后，他打开三徒弟的画，却发现画面上只有青山、小路和木桥，根本没有出现寺庙，只有桥上一个正挑水往深山走去的小和尚。\n\n众人正感到疑惑时，老画家却赞叹不已。他指出，虽然画中看不见寺庙，但小和尚挑水进山，自然让人联想到深山中藏着古寺，这正是艺术中难得的“画外之意”。最终，富有想象力和意境的三徒弟得到了老画家的认可。",
    "sampleVi": "Ngày xưa có một vị họa sĩ già muốn chọn ra người xuất sắc nhất trong ba đệ tử chăm chỉ để truyền lại nghề. Ông giao cho cả ba vẽ bức 'Thâm sơn cổ tự' trong bảy ngày. Bảy ngày sau, tranh của đại đệ tử chi tiết sống động đến từng bậc thềm trước chùa; tranh của nhị đệ tử thủy mặc hài hòa, ngôi chùa ẩn hiện trong mây mù. Lão họa sĩ xem xong chỉ khẽ gật đầu. Cuối cùng ông mở tranh của tam đệ tử, ngạc nhiên thay trên tranh chỉ có núi xanh, đường nhỏ và cây cầu gỗ, hoàn toàn không thấy ngôi chùa đâu, chỉ có một chú tiểu đang gánh nước đi sâu vào núi. Khi mọi người còn đang thắc mắc, lão họa sĩ lại hết lời khen ngợi. Ông chỉ ra rằng tuy trong tranh không thấy chùa, nhưng hình ảnh chú tiểu gánh nước vào núi tự nhiên gợi người xem liên tưởng tới ngôi cổ tự ẩn sâu trong rừng, đó chính là 'ý ngoài bức tranh' quý giá của nghệ thuật. Cuối cùng tam đệ tử giàu trí tưởng tượng và ý cảnh đã được sư phụ chọn."
  },
  {
    "id": "w6_04",
    "level": 6,
    "type": "summary",
    "title": "HSK 6 • Đề 4: Bí mật của cây tre Mao Trúc",
    "targetChars": 400,
    "recommendedMinutes": 45,
    "keywords": [],
    "sourceText": "在自然界众多的植物当中，有一种生长在中国南方的竹子叫作“毛竹”，它的生长过程非常奇特，常常让人感到不可思议。如果你把毛竹的种子埋进土壤里，在最初的四年时间里，无论你怎样精心地浇水、施肥、除草，地面上都几乎看不到它有任何明显的动静。\n\n第一年，它只长出几厘米高的嫩芽；第二年，依然没有太大变化；到了第三年和第四年，它还是默默地待在那里，仿佛停止了生长一样。很多缺乏耐心的种植者看到这种情况，往往会以为种子早就烂在地里，于是早早地放弃了照顾，甚至直接把地翻耕改种其他作物。\n\n然而，奇迹却往往发生在第五年。当第五个春天来临，雨水滋润大地的时候，毛竹仿佛在一夜之间被唤醒了，它以每天大约三十厘米的惊人速度疯狂地向上蹿升！短短六个星期的时间，它就能轻轻松松长到十五米高，把周围原本高大的树木远远地甩在身后，成为森林里一道壮观的风景。\n\n难道毛竹真的是仅用了六个星期就长成了参天大树吗？其实不然。植物学家经过仔细挖掘和研究后发现，在前四年看似毫无动静的岁月里，毛竹并不是在偷懒，而是把所有的养分和精力都集中在了地下。它的根系在黑暗的土壤里悄悄地向四周和深处延伸了数百平方米，编织了一张庞大而坚固的地下网络。正是有了前四年默默扎根的充分积累，第五年它才能在地面上爆发出如此惊人的成长力量。\n\n其实，人类的学习与成长又何尝不是如此呢？很多时候，我们努力了一段时间却迟迟看不到回报，于是便开始怀疑自己，甚至选择半途而废。但只要明白毛竹的道理，耐住寂寞，在看不见的地方不断扎根积累，总有一天会迎来属于自己的“第五年”。",
    "instruction": "Đọc kỹ bài văn (~730 chữ) và tóm tắt súc tích xuống khoảng 350–400 chữ Hán, nêu bật quy luật sinh trưởng 4 năm âm thầm bén rễ - năm thứ 5 bứt phá của trúc Mao Trúc và thông điệp ẩn dụ.",
    "outline": [
      "Mở bài: Trúc Mao Trúc ở miền Nam Trung Quốc có quá trình sinh trưởng kỳ lạ: 4 năm đầu gần như không cao lên, khiến nhiều người trồng thiếu kiên nhẫn bỏ cuộc.",
      "Thân bài: Đến năm thứ 5, chỉ trong 6 tuần trúc mọc vọt 15m (khoảng 30cm/ngày). Thực chất 4 năm đầu nó dồn toàn bộ dinh dưỡng phát triển bộ rễ rộng hàng trăm mét vuông dưới lòng đất.",
      "Kết bài: Con người học tập, phấn đấu cũng giống trúc Mao Trúc: kiên trì tích lũy âm thầm ở nơi người khác không thấy sẽ có ngày bứt phá."
    ],
    "sampleZh": "中国南方的毛竹有着十分奇特的生长规律。在最初的四年里，无论人们怎样精心浇水施肥，地面上的毛竹几乎不见长高，只停留在几厘米的高度，许多缺乏耐心的种植者往往会因此放弃。\n\n然而到了第五年春天，毛竹却以每天约三十厘米的速度迅速生长，短短六周便能长到十五米高。其实，毛竹并非只用了六周就长成，科学家研究发现，在前四年看似沉寂的时间里，它把所有精力都用来在地下扎根，其根系悄悄延伸了数百平方米，为后来的爆发奠定了坚实基础。\n\n毛竹的成长告诉我们，人生的努力与积累也是如此。在尚未看到成果时不要轻易怀疑或放弃，只要耐住寂寞、不断充实自己，终会迎来厚积薄发的一天。",
    "sampleVi": "Cây trúc Mao Trúc ở miền Nam Trung Quốc có quy luật sinh trưởng rất kỳ lạ. Trong 4 năm đầu tiên, dù người ta chăm chỉ tưới nước bón phân thế nào, phần thân trên mặt đất gần như không cao lên, chỉ dừng ở vài xăng-ti-mét khiến nhiều người trồng thiếu kiên nhẫn bỏ cuộc. Thế nhưng đến mùa xuân năm thứ 5, trúc lại mọc vọt với tốc độ khoảng 30cm mỗi ngày, chỉ trong 6 tuần đã cao tới 15 mét. Thực ra trúc không hề lớn thành chỉ trong 6 tuần; các nhà khoa học phát hiện suốt 4 năm tưởng chừng đứng yên đó, nó dồn toàn bộ sức lực để đâm rễ ngầm rộng hàng trăm mét vuông dưới lòng đất, tạo nền móng vững chắc cho sự bứt phá sau này. Sự trưởng thành của trúc Mao Trúc nhắc nhở chúng ta rằng nỗ lực và tích lũy trong đời cũng vậy: khi chưa thấy thành quả đừng vội nghi ngờ hay bỏ cuộc, cứ bền bỉ trau dồi âm thầm rồi sẽ đến ngày bứt phá rực rỡ."
  }
];

  global.LP_HSK_WRITING_DATA = { radicals, practiceChars, reorderTasks, pinyinWriteTasks, makeSentenceTasks, essayPrompts };

})(typeof window !== 'undefined' ? window : globalThis);


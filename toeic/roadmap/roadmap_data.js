/* LinguaPath TOEIC Roadmap — Dữ liệu Lộ trình học 4 Chặng chuẩn mục tiêu ETS (0 → 900+)
 * 100% cấu trúc nhẹ, 0 import dữ liệu nặng; chỉ định nghĩa khung chặng & tham chiếu ID.
 */
(function (root) {
  "use strict";

  var STORAGE_KEY = "lp_toeic_roadmap_v1";
  var PLACEMENT_KEY = "lp_toeic_placement_v1";

  var READY_MODULES = {
    roadmap: true,
    vocab: true,
    grammar: true,
    listening: true,
    reading: true,
    mock: true,
    sw: true
  };

  var START_LEVELS = [
    {
      id: "zero",
      label: "Mất gốc / Từ số 0",
      shortLabel: "Mất gốc (0)",
      badge: "Từ Chặng 1",
      targetLevel: "0 → 350+",
      startStageIdx: 0,
      desc: "Bắt đầu từ số 0: 12 chuyên đề ngữ pháp lấy gốc, từ vựng tả tranh Part 1 và nghe chép chậm 0.75x."
    },
    {
      id: "basic",
      label: "Nền tảng (~350)",
      shortLabel: "Nền tảng ~350",
      badge: "Từ Chặng 2",
      targetLevel: "350 → 550+",
      startStageIdx: 1,
      desc: "Bỏ qua Chặng 1; tập trung 844 từ Barron's 600 & văn phòng, Part 2 hỏi–đáp, Part 6 và Part 7 đoạn đơn."
    },
    {
      id: "intermediate",
      label: "Trung cấp (~550)",
      shortLabel: "Trung cấp ~550",
      badge: "Từ Chặng 3",
      targetLevel: "550 → 750+",
      startStageIdx: 2,
      desc: "Đi thẳng vào Part 3–4 hội thoại/bài nói, Part 7 đoạn kép và cụm từ thương mại Hackers/ETS."
    },
    {
      id: "advanced",
      label: "Bứt phá (~750+)",
      shortLabel: "Bứt phá 750+",
      badge: "Từ Chặng 4",
      targetLevel: "750 → 900+",
      startStageIdx: 3,
      desc: "Chinh phục đảo ngữ, giả định, bẫy trả lời gián tiếp Part 2, Part 7 ba đoạn và Full Test bấm giờ 900+."
    }
  ];

  var PACES = [
    { id: "light", label: "Nhẹ nhàng", dailyDesc: "45–60 phút/ngày", factor: 1.45 },
    { id: "standard", label: "Tiêu chuẩn", dailyDesc: "1.5–2 giờ/ngày", factor: 1.0 },
    { id: "intensive", label: "Cấp tốc", dailyDesc: "3 giờ+/ngày", factor: 0.65 }
  ];

  // Tổng 3,189 từ vựng chia 4 chặng điểm mục tiêu (tiền tố toeic1_ .. toeic4_)
  var VOCAB_LEVEL_TOTALS = {
    1: 709,
    2: 844,
    3: 821,
    4: 815
  };

  var STAGES = [
    {
      id: "stage1",
      order: 1,
      level: 1,
      icon: "m0",
      color: "#b45309",
      badge: "CHẶNG 1 • LẤY GỐC TỪ SỐ 0",
      title: "Nền tảng Từ loại, 6 Thì cốt lõi & Tả tranh Part 1",
      levelRange: "0 → 350+",
      baseWeeksMin: 4,
      baseWeeksMax: 5,
      goal: "Nắm vững 12 chuyên đề ngữ pháp lấy gốc, 709 từ tả tranh/hành động Part 1, nghe chậm 0.75x và đạt >= 350 điểm Mini Test.",
      tip: "Chưa cần học vội đề dài 200 câu. Hãy hoàn thành 12 bài từ loại & nghe chép chậm để tai quen phát âm Mỹ–Anh–Úc.",
      tasks: [
        {
          id: "t1_grammar",
          module: "grammar",
          moduleLabel: "Ngữ pháp lấy gốc",
          title: "12 chuyên đề Từ loại & 6 Thì cơ bản",
          desc: "Phân biệt cấu trúc S–V–O, hậu tố Danh–Động–Tính–Trạng từ và 6 thì nền tảng hay gặp nhất.",
          evalType: "id_list",
          storageKey: "lp_toeic_grammar_done_v1",
          ids: { prefix: "tg_", start: 1, end: 12, pad: 2 },
          basePath: "toeic/grammar/index.html",
          idParam: "id",
          unitLabel: "chuyên đề"
        },
        {
          id: "t1_vocab",
          module: "vocab",
          moduleLabel: "Từ vựng SRS • Chặng 1",
          title: "709 từ vựng Lấy gốc & Tả tranh Part 1",
          desc: "Động từ hành động mắt/tay/chân, đồ vật văn phòng và giới từ vị trí kèm hình ảnh minh họa.",
          evalType: "toeic_vocab_level",
          storageKey: "lp_toeic_vocab_srs_v1",
          level: 1,
          target: 709,
          defaultUrl: "toeic/vocab/index.html?level=1",
          unitLabel: "từ"
        },
        {
          id: "t1_listen_dict",
          module: "listening",
          moduleLabel: "Nghe nền tảng",
          title: "6 bài Nghe chép chính tả chậm 0.75x",
          desc: "Luyện bắt âm cuối, nối âm và từ khóa ngắn theo cụm câu Part 1–2 ở tốc độ chậm.",
          evalType: "id_list",
          storageKey: "lp_toeic_listening_done_v1",
          ids: { prefix: "tl_d", start: 1, end: 6, pad: 2 },
          basePath: "toeic/listening/index.html",
          idParam: "id",
          unitLabel: "bài"
        },
        {
          id: "t1_listen_p1",
          module: "listening",
          moduleLabel: "Listening Part 1",
          title: "6 bài Luyện Part 1: Tả người & Tả vật",
          desc: "Nhận diện động tác đang diễn ra (be + V-ing) và bẫy bị động tiếp diễn (being + V-ed).",
          evalType: "id_list",
          storageKey: "lp_toeic_listening_done_v1",
          ids: { prefix: "tl_p1_", start: 1, end: 6, pad: 2 },
          basePath: "toeic/listening/index.html",
          idParam: "id",
          unitLabel: "bài"
        },
        {
          id: "t1_read_p5",
          module: "reading",
          moduleLabel: "Reading Part 5",
          title: "6 bộ Part 5: Nhận diện Từ loại 5 giây",
          desc: "Luyện phản xạ điền nhanh Danh–Động–Tính–Trạng từ theo vị trí trước/sau chỗ trống.",
          evalType: "id_list",
          storageKey: "lp_toeic_reading_done_v1",
          ids: { prefix: "tr_p5_", start: 1, end: 6, pad: 2 },
          basePath: "toeic/reading/index.html",
          idParam: "id",
          unitLabel: "bộ"
        },
        {
          id: "t1_mock",
          module: "mock",
          moduleLabel: "Kiểm tra mốc 350+",
          title: "2 Đề Mini Test đạt >= 350 điểm",
          desc: "Bài thi rút gọn có chấm điểm quy đổi ETS để kiểm chứng vượt ngưỡng lấy gốc.",
          evalType: "toeic_mock_tier",
          storageKey: "lp_toeic_mock_submissions_v1",
          minScore: 350,
          tier: "mini",
          target: 2,
          defaultUrl: "toeic/mock/index.html?tier=mini",
          unitLabel: "đề"
        }
      ]
    },
    {
      id: "stage2",
      order: 2,
      level: 2,
      icon: "m1",
      color: "#d97706",
      badge: "CHẶNG 2 • CƠ BẢN CHUẨN ĐẦU RA",
      title: "600 Essential Words, Part 2 Hỏi–Đáp & Part 6–7 Đơn",
      levelRange: "350 → 550+",
      baseWeeksMin: 5,
      baseWeeksMax: 6,
      goal: "Hoàn thành 844 từ Barron's 600 & văn phòng, 14 chuyên đề ngữ pháp trung cấp, Part 2, Part 6 và Part 7 đoạn đơn đạt >= 550 điểm.",
      tip: "Ở Part 2, luôn tập trung 2 từ đầu câu hỏi (Who/Where/When/How) và loại ngay các đáp án lặp lại từ giống âm.",
      tasks: [
        {
          id: "t2_vocab",
          module: "vocab",
          moduleLabel: "Từ vựng SRS • Chặng 2",
          title: "844 từ Barron's 600 Essential & Văn phòng",
          desc: "Bộ chủ đề kinh điển: Hợp đồng, Tiếp thị, Bảo hành, Tuyển dụng, Mua sắm, Văn phòng kèm Word Family.",
          evalType: "toeic_vocab_level",
          storageKey: "lp_toeic_vocab_srs_v1",
          level: 2,
          target: 844,
          defaultUrl: "toeic/vocab/index.html?level=2",
          unitLabel: "từ"
        },
        {
          id: "t2_grammar",
          module: "grammar",
          moduleLabel: "Ngữ pháp Part 5–6",
          title: "14 chuyên đề Bị động, S–V, To-V/V-ing & Liên từ",
          desc: "Hòa hợp chủ–vị, phân biệt Giới từ vs Liên từ (despite/although), so sánh và đại từ quan hệ.",
          evalType: "id_list",
          storageKey: "lp_toeic_grammar_done_v1",
          ids: { prefix: "tg_", start: 13, end: 26, pad: 2 },
          basePath: "toeic/grammar/index.html",
          idParam: "id",
          unitLabel: "chuyên đề"
        },
        {
          id: "t2_listen_p2",
          module: "listening",
          moduleLabel: "Listening Part 2",
          title: "10 bài Part 2: Hỏi–Đáp WH, Yes/No & Lựa chọn",
          desc: "Giao diện chuẩn ETS chỉ 3 đáp án A/B/C và ẩn chữ khi nghe để rèn phản xạ thực chiến.",
          evalType: "id_list",
          storageKey: "lp_toeic_listening_done_v1",
          ids: { prefix: "tl_p2_", start: 1, end: 10, pad: 2 },
          basePath: "toeic/listening/index.html",
          idParam: "id",
          unitLabel: "bài"
        },
        {
          id: "t2_read_p6",
          module: "reading",
          moduleLabel: "Reading Part 6",
          title: "8 bộ Part 6: Điền đoạn văn & Điền câu hoàn chỉnh",
          desc: "Luyện ngữ cảnh Email/Thông báo và dạng câu hỏi chọn cả câu phù hợp mạch văn.",
          evalType: "id_list",
          storageKey: "lp_toeic_reading_done_v1",
          ids: { prefix: "tr_p6_", start: 1, end: 8, pad: 2 },
          basePath: "toeic/reading/index.html",
          idParam: "id",
          unitLabel: "bộ"
        },
        {
          id: "t2_read_p7s",
          module: "reading",
          moduleLabel: "Reading Part 7",
          title: "6 bộ Part 7: Đoạn đơn (Single Passages)",
          desc: "Rèn kỹ năng Skimming/Scanning qua Email, Memo, Quảng cáo và Tin nhắn Chat.",
          evalType: "id_list",
          storageKey: "lp_toeic_reading_done_v1",
          ids: { prefix: "tr_p7s_", start: 1, end: 6, pad: 2 },
          basePath: "toeic/reading/index.html",
          idParam: "id",
          unitLabel: "bộ"
        },
        {
          id: "t2_mock",
          module: "mock",
          moduleLabel: "Kiểm tra mốc 550+",
          title: "4 Đề Mini/Full đạt >= 550 điểm",
          desc: "Đánh giá nhịp làm bài và độ chính xác 2 kỹ năng Nghe–Đọc ở ngưỡng chuẩn đầu ra.",
          evalType: "toeic_mock_tier",
          storageKey: "lp_toeic_mock_submissions_v1",
          minScore: 550,
          target: 4,
          defaultUrl: "toeic/mock/index.html",
          unitLabel: "đề"
        }
      ]
    },
    {
      id: "stage3",
      order: 3,
      level: 3,
      icon: "m3",
      color: "#0d9488",
      badge: "CHẶNG 3 • TRUNG CẤP DOANH NGHIỆP",
      title: "Hackers/ETS Vocab, Part 3–4 Hội thoại & Part 7 Kép",
      levelRange: "550 → 750+",
      baseWeeksMin: 6,
      baseWeeksMax: 8,
      goal: "Nắm 821 từ & cụm từ thương mại Hackers/Susan Chyn, thành thạo Part 3–4 kèm bảng biểu Graphic, Part 7 đoạn kép và đạt >= 750 điểm Full Test.",
      tip: "Khi luyện Part 3–4, hãy đọc trước 3 câu hỏi và từ khóa trong 8 giây nghỉ giữa mỗi đoạn; chú ý bảng biểu Graphic ở các cụm cuối.",
      tasks: [
        {
          id: "t3_vocab",
          module: "vocab",
          moduleLabel: "Từ vựng SRS • Chặng 3",
          title: "821 từ Hackers, ETS & Cụm từ Susan Chyn",
          desc: "Phrasal Verbs, cụm giới từ cố định và từ vựng Marketing, Vận chuyển, Ngân hàng, Bảo hiểm.",
          evalType: "toeic_vocab_level",
          storageKey: "lp_toeic_vocab_srs_v1",
          level: 3,
          target: 821,
          defaultUrl: "toeic/vocab/index.html?level=3",
          unitLabel: "từ"
        },
        {
          id: "t3_grammar",
          module: "grammar",
          moduleLabel: "Ngữ pháp trung–cao",
          title: "14 chuyên đề MĐQH rút gọn, Phân từ & Điều kiện",
          desc: "Rút gọn V-ing/V-ed, phân biệt mệnh đề danh ngữ/trạng ngữ và bẫy từ nối trong Part 5–6.",
          evalType: "id_list",
          storageKey: "lp_toeic_grammar_done_v1",
          ids: { prefix: "tg_", start: 27, end: 40, pad: 2 },
          basePath: "toeic/grammar/index.html",
          idParam: "id",
          unitLabel: "chuyên đề"
        },
        {
          id: "t3_listen_p3",
          module: "listening",
          moduleLabel: "Listening Part 3",
          title: "10 bài Part 3: Hội thoại 2–3 người & Graphic",
          desc: "Luyện nghe thông tin phân vai, câu hỏi ngụ ý trong ngoặc kép và đối chiếu lịch trình/bảng biểu.",
          evalType: "id_list",
          storageKey: "lp_toeic_listening_done_v1",
          ids: { prefix: "tl_p3_", start: 1, end: 10, pad: 2 },
          basePath: "toeic/listening/index.html",
          idParam: "id",
          unitLabel: "bài"
        },
        {
          id: "t3_listen_p4",
          module: "listening",
          moduleLabel: "Listening Part 4",
          title: "8 bài Part 4: Bài nói ngắn & Câu hỏi ngụ ý",
          desc: "Thông báo sân bay, tin nhắn thoại, giới thiệu diễn giả và quảng cáo sản phẩm chuẩn ETS.",
          evalType: "id_list",
          storageKey: "lp_toeic_listening_done_v1",
          ids: { prefix: "tl_p4_", start: 1, end: 8, pad: 2 },
          basePath: "toeic/listening/index.html",
          idParam: "id",
          unitLabel: "bài"
        },
        {
          id: "t3_read_p7d",
          module: "reading",
          moduleLabel: "Reading Part 7",
          title: "10 bộ Part 7: Đoạn kép (Double Passages)",
          desc: "Chia đôi màn hình CBT đối chiếu Email đặt hàng ↔ Hóa đơn/Lịch trình kèm bảng Paraphrase.",
          evalType: "id_list",
          storageKey: "lp_toeic_reading_done_v1",
          ids: { prefix: "tr_p7d_", start: 1, end: 10, pad: 2 },
          basePath: "toeic/reading/index.html",
          idParam: "id",
          unitLabel: "bộ"
        },
        {
          id: "t3_mock",
          module: "mock",
          moduleLabel: "Full Test mốc 750+",
          title: "6 Đề Full Test 200 câu đạt >= 750 điểm",
          desc: "Làm trọn bộ 45p Nghe + 75p Đọc liên hoàn để rèn sức bền 120 phút.",
          evalType: "toeic_mock_tier",
          storageKey: "lp_toeic_mock_submissions_v1",
          minScore: 750,
          requireFull: true,
          target: 6,
          defaultUrl: "toeic/mock/index.html?tier=full",
          unitLabel: "đề"
        }
      ]
    },
    {
      id: "stage4",
      order: 4,
      level: 4,
      icon: "m5",
      color: "#7c3aed",
      badge: "CHẶNG 4 • BỨT PHÁ ĐỈNH CAO",
      title: "Paraphrase 850–990, Part 7 Ba đoạn & Full Test thực chiến",
      levelRange: "750 → 900+",
      baseWeeksMin: 5,
      baseWeeksMax: 7,
      goal: "Chinh phục 815 từ nâng cao & cặp Paraphrase, làm chủ đảo ngữ/giả định, Part 2 trả lời gián tiếp, Part 7 ba đoạn và vượt mốc 850–900+.",
      tip: "Giai đoạn 850+ phân hóa ở tốc độ xử lý Part 7 ba đoạn (<1 phút/câu) và các câu trả lời gián tiếp Part 2 (\"Why don't we check the inventory?\" / \"I haven't received the memo yet\").",
      tasks: [
        {
          id: "t4_vocab",
          module: "vocab",
          moduleLabel: "Từ vựng SRS • Chặng 4",
          title: "815 từ 850–990 & Cặp Paraphrase Part 7",
          desc: "Kế toán, Thuế, Báo cáo tài chính, HĐQT và các cặp đồng nghĩa đổi từ giữa đoạn văn và đáp án.",
          evalType: "toeic_vocab_level",
          storageKey: "lp_toeic_vocab_srs_v1",
          level: 4,
          target: 815,
          defaultUrl: "toeic/vocab/index.html?level=4",
          unitLabel: "từ"
        },
        {
          id: "t4_grammar",
          module: "grammar",
          moduleLabel: "Ngữ pháp 850–990",
          title: "10 chuyên đề Đảo ngữ, Giả định cách & Bẫy Part 5–6",
          desc: "Subjunctive (suggest/insist that + V-bare), đảo ngữ điều kiện (Should/Were/Had) và bẫy từ dễ nhầm.",
          evalType: "id_list",
          storageKey: "lp_toeic_grammar_done_v1",
          ids: { prefix: "tg_", start: 41, end: 50, pad: 2 },
          basePath: "toeic/grammar/index.html",
          idParam: "id",
          unitLabel: "chuyên đề"
        },
        {
          id: "t4_listen_adv",
          module: "listening",
          moduleLabel: "Listening 850–990",
          title: "8 bài Bẫy trả lời gián tiếp Part 2 & Nghe 1.2x",
          desc: "Luyện phản xạ với giọng Úc/Anh nhanh, nhiễu đồng âm và câu trả lời hàm ý gián tiếp.",
          evalType: "id_list",
          storageKey: "lp_toeic_listening_done_v1",
          ids: { prefix: "tl_adv_", start: 1, end: 8, pad: 2 },
          basePath: "toeic/listening/index.html",
          idParam: "id",
          unitLabel: "bài"
        },
        {
          id: "t4_read_p7t",
          module: "reading",
          moduleLabel: "Reading Part 7",
          title: "12 bộ Part 7: Đoạn ba (Triple Passages) & Suy luận",
          desc: "Đối chiếu chéo 3 nguồn văn bản (Bài báo + Email + Lịch biểu) dưới áp lực thời gian.",
          evalType: "id_list",
          storageKey: "lp_toeic_reading_done_v1",
          ids: { prefix: "tr_p7t_", start: 1, end: 12, pad: 2 },
          basePath: "toeic/reading/index.html",
          idParam: "id",
          unitLabel: "bộ"
        },
        {
          id: "t4_mock",
          module: "mock",
          moduleLabel: "Full Test mốc 850–900+",
          title: "8 Đề Full Test 200 câu đạt >= 850 điểm",
          desc: "Thi thử 120 phút liên tục, kiểm soát tỷ lệ sai <= 15 câu/200 câu.",
          evalType: "toeic_mock_tier",
          storageKey: "lp_toeic_mock_submissions_v1",
          minScore: 850,
          requireFull: true,
          target: 8,
          defaultUrl: "toeic/mock/index.html?tier=full",
          unitLabel: "đề"
        },
        {
          id: "t4_due_review",
          module: "vocab",
          moduleLabel: "Kỷ luật SRS hằng ngày",
          title: "Ôn sạch toàn bộ từ TOEIC SRS đến hạn",
          desc: "Giữ hàng đợi ôn tập bằng 0 để khóa chặt phản xạ từ vựng trước ngày thi thật.",
          evalType: "due_review",
          storageKey: "lp_toeic_vocab_srs_v1",
          defaultUrl: "toeic/vocab/index.html?filter=due",
          unitLabel: "lượt"
        }
      ]
    }
  ];

  var api = {
    STORAGE_KEY: STORAGE_KEY,
    PLACEMENT_KEY: PLACEMENT_KEY,
    READY_MODULES: READY_MODULES,
    START_LEVELS: START_LEVELS,
    PACES: PACES,
    VOCAB_LEVEL_TOTALS: VOCAB_LEVEL_TOTALS,
    STAGES: STAGES
  };

  if (typeof window !== "undefined") window.LP_TOEIC_ROADMAP_DATA = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);

/* LinguaPath HSK Roadmap — Dữ liệu Lộ trình học 6 Chặng chuẩn hóa từ kho tài liệu thực tế
 * 100% ID thật đối chiếu trực tiếp từ kho dữ liệu HSK 1–6 & HSKK (0 ID ma).
 * Không nạp dữ liệu nặng (vocab_data, grammar_data...); chỉ định nghĩa cấu trúc chặng & tham chiếu ID.
 */
(function (root) {
  "use strict";

  var STORAGE_KEY = "lp_hsk_roadmap_v1";

  var START_LEVELS = [
    {
      id: "foundation",
      label: "Mới bắt đầu / Pinyin",
      shortLabel: "Mới bắt đầu",
      badge: "Từ Chặng 1",
      targetLevel: "Pinyin → HSK 1–2",
      startStageIdx: 0,
      desc: "Bắt đầu từ Chương 0 Pinyin, 150 từ HSK 1, 214 bộ thủ và chữ Hán căn bản."
    },
    {
      id: "intermediate",
      label: "Đã có HSK 2",
      shortLabel: "Đã có HSK 2",
      badge: "Từ Chặng 3",
      targetLevel: "HSK 3–4 & HSKK Trung",
      startStageIdx: 2,
      desc: "Bỏ qua nhập môn HSK 1–2; đi thẳng vào liên từ HSK 3, viết câu và HSKK Trung cấp."
    },
    {
      id: "advanced",
      label: "Tăng tốc HSK 4+",
      shortLabel: "Tăng tốc HSK 4+",
      badge: "Từ Chặng 5",
      targetLevel: "HSK 5–6 & HSKK Cao",
      startStageIdx: 4,
      desc: "Tập trung ngữ pháp cao cấp, đọc báo chí, viết đoạn văn và HSKK Cao cấp."
    }
  ];

  var PACES = [
    { id: "light", label: "Nhẹ nhàng", dailyDesc: "45–60 phút/ngày", factor: 1.45 },
    { id: "standard", label: "Tiêu chuẩn", dailyDesc: "1.5–2 giờ/ngày", factor: 1.0 },
    { id: "intensive", label: "Cấp tốc", dailyDesc: "3 giờ+/ngày", factor: 0.65 }
  ];

  // Tổng số từ vựng thật trong hsk/vocab/vocab_data.js (5,112 từ)
  var VOCAB_LEVEL_TOTALS = {
    1: 150,
    2: 147,
    3: 301,
    4: 609,
    5: 1397,
    6: 2508
  };

  // ID thật 106 bài giảng (hsk/lessons/lessons_data.js & lessons_hsk2..6.js)
  var HSK1_LESSON_IDS = [
    "c0_1", "c0_2", "c0_3",
    "hsk1_01", "hsk1_02", "hsk1_03", "hsk1_04", "hsk1_05",
    "hsk1_06", "hsk1_07", "hsk1_08", "hsk1_09", "hsk1_10",
    "hsk1_11", "hsk1_12", "hsk1_13", "hsk1_14", "hsk1_15"
  ];
  var HSK2_LESSON_IDS = [
    "hsk2_01", "hsk2_02", "hsk2_03", "hsk2_04", "hsk2_05",
    "hsk2_06", "hsk2_07", "hsk2_08", "hsk2_09", "hsk2_10",
    "hsk2_11", "hsk2_12", "hsk2_13", "hsk2_14", "hsk2_15"
  ];
  var HSK3_LESSON_IDS = [
    "hsk3_01", "hsk3_02", "hsk3_03", "hsk3_04", "hsk3_05",
    "hsk3_06", "hsk3_07", "hsk3_08", "hsk3_09", "hsk3_10",
    "hsk3_11", "hsk3_12", "hsk3_13", "hsk3_14", "hsk3_15",
    "hsk3_16", "hsk3_17", "hsk3_18", "hsk3_19", "hsk3_20"
  ];
  var HSK4_LESSON_IDS = [
    "hsk4_01", "hsk4_02", "hsk4_03", "hsk4_04", "hsk4_05",
    "hsk4_06", "hsk4_07", "hsk4_08", "hsk4_09", "hsk4_10",
    "hsk4_11", "hsk4_12", "hsk4_13", "hsk4_14", "hsk4_15",
    "hsk4_16", "hsk4_17", "hsk4_18", "hsk4_19", "hsk4_20"
  ];
  var HSK5_LESSON_IDS = [
    "hsk5_01", "hsk5_02", "hsk5_03", "hsk5_04", "hsk5_05",
    "hsk5_06", "hsk5_07", "hsk5_08", "hsk5_09", "hsk5_10",
    "hsk5_11", "hsk5_12", "hsk5_13", "hsk5_14", "hsk5_15",
    "hsk5_16", "hsk5_17", "hsk5_18"
  ];
  var HSK6_LESSON_IDS = [
    "hsk6_01", "hsk6_02", "hsk6_03", "hsk6_04", "hsk6_05",
    "hsk6_06", "hsk6_07", "hsk6_08", "hsk6_09", "hsk6_10",
    "hsk6_11", "hsk6_12", "hsk6_13", "hsk6_14", "hsk6_15"
  ];

  // ID thật 108 chuyên đề ngữ pháp (grammar_data.js + grammar_data_adv.js)
  var HSK1_GRAMMAR_IDS = [
    "hsk1_shi_you_zai", "hsk1_ma_ne_ba", "hsk1_de_pos", "hsk1_time_place_order",
    "hsk1_interrogative_pronouns", "hsk1_v_bu_v_questions", "hsk1_numbers_liang_er", "hsk1_time_date_money",
    "hsk1_measure_words_intro", "hsk1_bu_mei_negation", "hsk1_adj_predicate_hen", "hsk1_he_gen_ye_dou",
    "hsk1_modal_xiang_yao_hui_neng", "hsk1_duo_adj_age", "hsk1_verb_reduplication_yi", "hsk1_le_end_of_sentence",
    "hsk1_qu_lai_serial_verbs", "hsk1_location_nouns"
  ];
  var HSK2_GRAMMAR_IDS = [
    "hsk2_bi_meiyou", "hsk2_le_guo", "hsk2_de_degree_manner", "hsk2_zhengzai_zhe",
    "hsk2_shi_de_emphasis", "hsk2_cong_li_wang", "hsk2_gen_yiyang", "hsk2_haishi_huozhe",
    "hsk2_youdianr_yidianr", "hsk2_yao_kuaiyao_le", "hsk2_bie_buyao_imperative", "hsk2_yinwei_suoyi",
    "hsk2_suiran_danshi", "hsk2_ruguo_jiu", "hsk2_yi_jiu_sequence", "hsk2_hai_zai_you_freq",
    "hsk2_chang_yiban_frequency", "hsk2_neng_keyi_hui"
  ];
  var HSK3_GRAMMAR_IDS = [
    "hsk3_result_complement", "hsk3_direction_complement", "hsk3_ba_sentence", "hsk3_bei_passive",
    "hsk3_potential_complement", "hsk3_duration_complement", "hsk3_frequency_complement", "hsk3_yibian_yibian",
    "hsk3_yue_yue", "hsk3_chule_yiwai", "hsk3_lian_dou_emphasis", "hsk3_jiu_cai_basic",
    "hsk3_gang_gangcai", "hsk3_budan_erqie_ji_you", "hsk3_zhiyou_zhiyao", "hsk3_xian_zai_ranhou",
    "hsk3_existential_sentences", "hsk3_interrogative_indefinite"
  ];
  var HSK4_GRAMMAR_IDS = [
    "hsk4_jiu_cai", "hsk4_zai_you", "hsk4_complex_conj", "hsk4_pivotal_serial",
    "hsk4_ji_you_he", "hsk4_jiran_jiu", "hsk4_jishi_napa", "hsk4_chufei_fouze",
    "hsk4_bushi_ershi", "hsk4_faner_que", "hsk4_daodi_jiujing", "hsk4_xiang_dangran",
    "hsk4_ba_bei_adv", "hsk4_direction_comp_basic", "hsk4_result_state_comp", "hsk4_shihe_heshi",
    "hsk4_zhongyu_daodi", "hsk4_zhishi_zhiyou"
  ];
  var HSK5_GRAMMAR_IDS = [
    "hsk5_reduplication", "hsk5_rhetorical_question", "hsk5_potential_complement", "hsk5_confusable_adv",
    "hsk5_yuqi_ningke", "hsk5_bujin_shenzhi", "hsk5_wulun_buguan", "hsk5_dui_guanyu_zhanyu",
    "hsk5_youyu_yinci", "hsk5_chong_direction_ext", "hsk5_degree_possibility_comp", "hsk5_jianzhi_shizai",
    "hsk5_jurang_jingran_ouran", "hsk5_baochi_weichi_jianchi", "hsk5_jieguo_houguo_chengguo", "hsk5_chengyu_study_effort",
    "hsk5_chengyu_life_social", "hsk5_chengyu_nature_emotion"
  ];
  var HSK6_GRAMMAR_IDS = [
    "hsk6_formal_conj", "hsk6_classical_patterns", "hsk6_emphasis_inversion", "hsk6_confusable_words",
    "hsk6_zhisuoyi_eryan", "hsk6_wubu_wufei_wuyi", "hsk6_zhi_suo_zhe", "hsk6_sentence_errors_1",
    "hsk6_sentence_errors_2", "hsk6_yizhi_conger", "hsk6_jiezhi_bixu", "hsk6_nanmian_weimian",
    "hsk6_yihan_quexi_juedui", "hsk6_aspect_register_comp", "hsk6_chengyu_strategy", "hsk6_chengyu_logic_irony",
    "hsk6_chengyu_virtue_talent", "hsk6_chengyu_society_change"
  ];

  // ID thật 36 đề Nghe (hsk/listening/listening_data.js)
  function buildSkillIds(prefix, lv) {
    return [
      prefix + lv,
      prefix + lv + "_02",
      prefix + lv + "_03",
      prefix + lv + "_04",
      prefix + lv + "_05",
      prefix + lv + "_06"
    ];
  }

  // ID thật 92 mục Khẩu ngữ (hsk/speaking/speaking_data.js)
  var TONE_PAIR_IDS = { prefix: "tp_", start: 1, end: 20 };
  var HSKK_BEG_IDS = [
    "rep_b1", "rep_b2", "rep_b3", "rep_b4", "rep_b5", "rep_b6",
    "hskk_b1", "hskk_b2", "hskk_b3", "hskk_b4", "hskk_b5", "hskk_b6",
    "hskk_b7", "hskk_b8", "hskk_b9", "hskk_b10", "hskk_b11", "hskk_b12"
  ];
  var HSKK_MID_P1_IDS = [
    "rep_m1", "rep_m2", "rep_m3", "rep_m4", "rep_m5", "rep_m6",
    "hskk_m1", "hskk_m2", "hskk_m3"
  ];
  var HSKK_MID_P2_IDS = [
    "hskk_m4", "hskk_m5", "hskk_m6", "hskk_m7", "hskk_m8", "hskk_m9",
    "hskk_m10", "hskk_m11", "hskk_m12"
  ];
  var HSKK_ADV_P1_IDS = [
    "rep_a1", "rep_a2", "rep_a3", "rep_a4", "rep_a5", "rep_a6",
    "hskk_a1", "hskk_a2", "hskk_a3"
  ];
  var HSKK_ADV_P2_IDS = [
    "hskk_a4", "hskk_a5", "hskk_a6", "hskk_a7", "hskk_a8", "hskk_a9",
    "hskk_a10", "hskk_a11", "hskk_a12"
  ];

  var STAGES = [
    {
      id: "hsk1",
      order: 1,
      level: 1,
      icon: "m1",
      color: "#dc2626",
      badge: "CHẶNG 1 • NHẬP MÔN PINYIN & HSK 1",
      title: "Chuẩn hóa Pinyin, 4 thanh điệu & 150 từ HSK 1",
      levelRange: "Pinyin → HSK 1",
      baseWeeksMin: 4,
      baseWeeksMax: 5,
      goal: "Đọc chuẩn 21 thanh mẫu, 36 vận mẫu, nắm 150 từ cốt lõi, 50 bộ thủ và 18 cấu trúc câu đơn.",
      tip: "Hoàn thành 3 bài Chương 0 Pinyin và 20 cặp thanh điệu trước khi vào bài khóa HSK 1.",
      tasks: [
        {
          id: "hsk1_lessons",
          module: "lessons",
          moduleLabel: "Bài giảng",
          title: "Chương 0 Pinyin & 15 bài giảng HSK 1",
          desc: "3 bài Pinyin nhập môn + 15 bài khóa song ngữ kèm chiết tự và slide.",
          evalType: "id_list",
          storageKey: "lp_hsk_lessons_done_v1",
          ids: HSK1_LESSON_IDS,
          basePath: "hsk/lessons/index.html",
          idParam: "lesson",
          unitLabel: "bài"
        },
        {
          id: "hsk1_vocab",
          module: "vocab",
          moduleLabel: "Từ vựng SRS",
          title: "150 từ vựng SRS HSK 1",
          desc: "Học đủ 150 từ giao tiếp cơ bản qua 4 chế độ SRS và âm Hán-Việt.",
          evalType: "hsk_vocab_level",
          storageKey: "lp_hsk_vocab_srs_v1",
          level: 1,
          target: 150,
          defaultUrl: "hsk/vocab/index.html?level=1",
          unitLabel: "từ"
        },
        {
          id: "hsk1_grammar",
          module: "grammar",
          moduleLabel: "Ngữ pháp",
          title: "18 chuyên đề Ngữ pháp HSK 1",
          desc: "Câu chữ 是/有/在, câu hỏi 吗/呢/吧, từ để hỏi và phủ định 不/没.",
          evalType: "id_list",
          storageKey: "lp_hsk_grammar_done_v1",
          ids: HSK1_GRAMMAR_IDS,
          basePath: "hsk/grammar/index.html",
          unitLabel: "chuyên đề"
        },
        {
          id: "hsk1_mw",
          module: "grammar",
          moduleLabel: "Lượng từ",
          title: "30 lượng từ thông dụng đầu tiên",
          desc: "Làm quen bộ lượng từ cơ bản như 个, 本, 张, 只 trong giao tiếp.",
          evalType: "hsk_mw_quota",
          storageKey: "lp_hsk_mw_done_v1",
          offset: 0,
          target: 30,
          defaultUrl: "hsk/grammar/index.html?mode=mw",
          unitLabel: "lượng từ"
        },
        {
          id: "hsk1_radicals",
          module: "writing",
          moduleLabel: "Luyện viết",
          title: "50 bộ thủ Khang Hy nền tảng",
          desc: "Nhận mặt nghĩa và nét gốc của 50 bộ thủ xuất hiện nhiều nhất.",
          evalType: "hsk_writing_bucket",
          storageKey: "lp_hsk_writing_done_v1",
          bucket: "radicals",
          offset: 0,
          target: 50,
          defaultUrl: "hsk/writing/index.html?level=1&tab=radicals",
          unitLabel: "bộ thủ"
        },
        {
          id: "hsk1_chars",
          module: "writing",
          moduleLabel: "Luyện viết",
          title: "20 chữ Hán khung chữ Mễ cơ bản",
          desc: "Luyện đúng thứ tự nét bút thuận của 20 chữ Hán mở đầu.",
          evalType: "hsk_writing_bucket",
          storageKey: "lp_hsk_writing_done_v1",
          bucket: "chars",
          offset: 0,
          target: 20,
          defaultUrl: "hsk/writing/index.html?level=1",
          unitLabel: "chữ"
        },
        {
          id: "hsk1_listen",
          module: "listening",
          moduleLabel: "Nghe",
          title: "6 đề Nghe hiểu & Dictation HSK 1",
          desc: "Nghe chọn tranh và chép chính tả câu ngắn tốc độ 0.72x–1.0x.",
          evalType: "id_list",
          storageKey: "lp_hsk_listening_done_v1",
          ids: buildSkillIds("listen_hsk", 1),
          basePath: "hsk/listening/index.html",
          unitLabel: "đề"
        },
        {
          id: "hsk1_read",
          module: "reading",
          moduleLabel: "Đọc",
          title: "6 bài Đọc hiểu song ngữ HSK 1",
          desc: "Làm quen đọc đoạn hội thoại ngắn có bật/tắt Pinyin đối chiếu.",
          evalType: "id_list",
          storageKey: "lp_hsk_reading_done_v1",
          ids: buildSkillIds("read_hsk", 1),
          basePath: "hsk/reading/index.html",
          unitLabel: "bài"
        },
        {
          id: "hsk1_speak_tones",
          module: "speaking",
          moduleLabel: "Khẩu ngữ",
          title: "20 cặp thanh điệu dễ nhầm",
          desc: "Phân biệt thanh 1–2–3–4 và biến điệu thanh 3 qua đo âm chuẩn.",
          evalType: "id_list",
          storageKey: "lp_hsk_speaking_done_v1",
          ids: TONE_PAIR_IDS,
          defaultUrl: "hsk/speaking/index.html?level=1",
          unitLabel: "cặp"
        },
        {
          id: "hsk1_speak_shadow",
          module: "speaking",
          moduleLabel: "Khẩu ngữ",
          title: "3 bài Shadowing HSK 1",
          desc: "Nhại giọng câu chào hỏi và giới thiệu bản thân chuẩn ngữ điệu.",
          evalType: "id_list",
          storageKey: "lp_hsk_speaking_done_v1",
          ids: ["sh_1", "sh_2", "sh_7"],
          defaultUrl: "hsk/speaking/index.html?level=1",
          unitLabel: "bài"
        },
        {
          id: "hsk1_mock",
          module: "mock",
          moduleLabel: "Thi thử Mock",
          title: "2 đề Full Mock HSK 1",
          desc: "Thi thử bấm giờ chuẩn 2 phần Nghe + Đọc và đạt mốc 120/200.",
          evalType: "hsk_mock_level",
          storageKey: "lp_hsk_mock_results_v1",
          level: 1,
          ids: ["mock_hsk1_1", "mock_hsk1_2"],
          target: 2,
          defaultUrl: "hsk/mock/index.html?level=1",
          unitLabel: "đề đạt"
        }
      ]
    },
    {
      id: "hsk2",
      order: 2,
      level: 2,
      icon: "m2",
      color: "#0284c7",
      badge: "CHẶNG 2 • SƠ CẤP & HSKK SƠ CẤP",
      title: "Giao tiếp Sơ cấp, Trạng thái động tác & HSKK Sơ cấp",
      levelRange: "HSK 2 + HSKK Sơ",
      baseWeeksMin: 4,
      baseWeeksMax: 5,
      goal: "Mở rộng thêm 147 từ HSK 2, làm chủ 了/过/着, câu so sánh 比 và hoàn thành 18 mục HSKK Sơ cấp.",
      tip: "Tắt dần Pinyin khi làm bài Đọc HSK 2 để ép não nhận diện trực tiếp mặt chữ Hán.",
      tasks: [
        {
          id: "hsk2_lessons",
          module: "lessons",
          moduleLabel: "Bài giảng",
          title: "15 bài giảng HSK 2",
          desc: "15 bài khóa tình huống đời sống, du lịch, mua sắm và công việc.",
          evalType: "id_list",
          storageKey: "lp_hsk_lessons_done_v1",
          ids: HSK2_LESSON_IDS,
          basePath: "hsk/lessons/index.html",
          idParam: "lesson",
          unitLabel: "bài"
        },
        {
          id: "hsk2_vocab",
          module: "vocab",
          moduleLabel: "Từ vựng SRS",
          title: "147 từ vựng SRS HSK 2",
          desc: "Nạp trọn 147 từ HSK 2 kết hợp ôn vòng lặp SRS HSK 1.",
          evalType: "hsk_vocab_level",
          storageKey: "lp_hsk_vocab_srs_v1",
          level: 2,
          target: 147,
          defaultUrl: "hsk/vocab/index.html?level=2",
          unitLabel: "từ"
        },
        {
          id: "hsk2_grammar",
          module: "grammar",
          moduleLabel: "Ngữ pháp",
          title: "18 chuyên đề Ngữ pháp HSK 2",
          desc: "So sánh 比, trợ từ 了/过/着, cấu trúc 是…的 và liên từ cơ bản.",
          evalType: "id_list",
          storageKey: "lp_hsk_grammar_done_v1",
          ids: HSK2_GRAMMAR_IDS,
          basePath: "hsk/grammar/index.html",
          unitLabel: "chuyên đề"
        },
        {
          id: "hsk2_mw",
          module: "grammar",
          moduleLabel: "Lượng từ",
          title: "30 lượng từ sơ cấp tiếp theo",
          desc: "Nâng tổng lượng từ đã nắm lên 60 từ thường dùng hằng ngày.",
          evalType: "hsk_mw_quota",
          storageKey: "lp_hsk_mw_done_v1",
          offset: 30,
          target: 30,
          defaultUrl: "hsk/grammar/index.html?mode=mw",
          unitLabel: "lượng từ"
        },
        {
          id: "hsk2_radicals",
          module: "writing",
          moduleLabel: "Luyện viết",
          title: "50 bộ thủ tiếp theo (Đủ 100 bộ)",
          desc: "Phân biệt nhóm bộ thủ chỉ tâm lý, hành động và tự nhiên.",
          evalType: "hsk_writing_bucket",
          storageKey: "lp_hsk_writing_done_v1",
          bucket: "radicals",
          offset: 50,
          target: 50,
          defaultUrl: "hsk/writing/index.html?level=2&tab=radicals",
          unitLabel: "bộ thủ"
        },
        {
          id: "hsk2_chars",
          module: "writing",
          moduleLabel: "Luyện viết",
          title: "20 chữ Hán khung chữ Mễ HSK 2",
          desc: "Luyện viết cân đối các chữ ghép 2 bộ thủ trái-phải và trên-dưới.",
          evalType: "hsk_writing_bucket",
          storageKey: "lp_hsk_writing_done_v1",
          bucket: "chars",
          offset: 20,
          target: 20,
          defaultUrl: "hsk/writing/index.html?level=2",
          unitLabel: "chữ"
        },
        {
          id: "hsk2_listen",
          module: "listening",
          moduleLabel: "Nghe",
          title: "6 đề Nghe hiểu & Dictation HSK 2",
          desc: "Luyện nghe hội thoại 2–3 lượt và bắt từ khóa phủ định/thời gian.",
          evalType: "id_list",
          storageKey: "lp_hsk_listening_done_v1",
          ids: buildSkillIds("listen_hsk", 2),
          basePath: "hsk/listening/index.html",
          unitLabel: "đề"
        },
        {
          id: "hsk2_read",
          module: "reading",
          moduleLabel: "Đọc",
          title: "6 bài Đọc hiểu HSK 2",
          desc: "Đọc đoạn văn ngắn và đối chiếu mệnh đề đúng-sai nhanh.",
          evalType: "id_list",
          storageKey: "lp_hsk_reading_done_v1",
          ids: buildSkillIds("read_hsk", 2),
          basePath: "hsk/reading/index.html",
          unitLabel: "bài"
        },
        {
          id: "hsk2_speak_shadow",
          module: "speaking",
          moduleLabel: "Khẩu ngữ",
          title: "3 bài Shadowing HSK 2",
          desc: "Luyện nhịp nói trôi chảy ở tốc độ giao tiếp đời thường.",
          evalType: "id_list",
          storageKey: "lp_hsk_speaking_done_v1",
          ids: ["sh_3", "sh_4", "sh_8"],
          defaultUrl: "hsk/speaking/index.html?level=2",
          unitLabel: "bài"
        },
        {
          id: "hsk2_speak_hskk",
          module: "speaking",
          moduleLabel: "Khẩu ngữ HSKK",
          title: "18 mục HSKK Sơ cấp trọn bộ",
          desc: "6 bộ nghe nhắc lại câu và 12 đề trả lời câu hỏi HSKK Sơ cấp.",
          evalType: "id_list",
          storageKey: "lp_hsk_speaking_done_v1",
          ids: HSKK_BEG_IDS,
          defaultUrl: "hsk/speaking/index.html?level=2",
          unitLabel: "mục"
        },
        {
          id: "hsk2_mock",
          module: "mock",
          moduleLabel: "Thi thử Mock",
          title: "2 đề Full Mock HSK 2",
          desc: "Thi thử chuẩn 2 kỹ năng Nghe + Đọc, mục tiêu đạt ≥ 120/200.",
          evalType: "hsk_mock_level",
          storageKey: "lp_hsk_mock_results_v1",
          level: 2,
          ids: ["mock_hsk2_1", "mock_hsk2_2"],
          target: 2,
          defaultUrl: "hsk/mock/index.html?level=2",
          unitLabel: "đề đạt"
        }
      ]
    },
    {
      id: "hsk3",
      order: 3,
      level: 3,
      icon: "m3",
      color: "#7c3aed",
      badge: "CHẶNG 3 • BẢN LỀ VIẾT CÂU & HSK 3",
      title: "Bổ ngữ, Câu chữ 把/被 & Luyện viết câu HSK 3",
      levelRange: "HSK 3 + HSKK Trung",
      baseWeeksMin: 6,
      baseWeeksMax: 7,
      goal: "Nắm 301 từ HSK 3, thành thạo bổ ngữ kết quả/xu hướng, câu 把/被 và bắt đầu phần thi Viết HSK.",
      tip: "Luyện Xếp câu (20 bài) trước khi làm Nhìn Pinyin viết chữ để nắm chắc trật tự từ HSK 3.",
      tasks: [
        {
          id: "hsk3_lessons",
          module: "lessons",
          moduleLabel: "Bài giảng",
          title: "20 bài giảng HSK 3",
          desc: "20 bài khóa chuyển tiếp sang văn phong hội thoại dài không Pinyin.",
          evalType: "id_list",
          storageKey: "lp_hsk_lessons_done_v1",
          ids: HSK3_LESSON_IDS,
          basePath: "hsk/lessons/index.html",
          idParam: "lesson",
          unitLabel: "bài"
        },
        {
          id: "hsk3_vocab",
          module: "vocab",
          moduleLabel: "Từ vựng SRS",
          title: "301 từ vựng SRS HSK 3",
          desc: "Hoàn thành 301 từ cốt lõi HSK 3 để tự tin đọc văn bản không phiên âm.",
          evalType: "hsk_vocab_level",
          storageKey: "lp_hsk_vocab_srs_v1",
          level: 3,
          target: 301,
          defaultUrl: "hsk/vocab/index.html?level=3",
          unitLabel: "từ"
        },
        {
          id: "hsk3_grammar",
          module: "grammar",
          moduleLabel: "Ngữ pháp",
          title: "18 chuyên đề Ngữ pháp HSK 3",
          desc: "Bổ ngữ kết quả/xu hướng/khả năng, câu chữ 把, bị động 被 và liên từ kép.",
          evalType: "id_list",
          storageKey: "lp_hsk_grammar_done_v1",
          ids: HSK3_GRAMMAR_IDS,
          basePath: "hsk/grammar/index.html",
          unitLabel: "chuyên đề"
        },
        {
          id: "hsk3_mw",
          module: "grammar",
          moduleLabel: "Lượng từ",
          title: "35 lượng từ HSK 3 (Đủ 95 từ)",
          desc: "Làm chủ nhóm lượng từ chỉ sự việc, thời lượng và tập hợp.",
          evalType: "hsk_mw_quota",
          storageKey: "lp_hsk_mw_done_v1",
          offset: 60,
          target: 35,
          defaultUrl: "hsk/grammar/index.html?mode=mw",
          unitLabel: "lượng từ"
        },
        {
          id: "hsk3_radicals",
          module: "writing",
          moduleLabel: "Luyện viết",
          title: "50 bộ thủ tiếp theo (Đủ 150 bộ)",
          desc: "Mở rộng bộ thủ giúp đoán nhanh nghĩa từ vựng HSK 3–4.",
          evalType: "hsk_writing_bucket",
          storageKey: "lp_hsk_writing_done_v1",
          bucket: "radicals",
          offset: 100,
          target: 50,
          defaultUrl: "hsk/writing/index.html?level=3&tab=radicals",
          unitLabel: "bộ thủ"
        },
        {
          id: "hsk3_reorder",
          module: "writing",
          moduleLabel: "Luyện viết",
          title: "20 bài Xếp từ thành câu HSK 3",
          desc: "Rèn cấu trúc Chủ–Trạng–Vị–Bổ–Tân chuẩn dạng thi Viết Phần 1 HSK 3.",
          evalType: "hsk_writing_bucket",
          storageKey: "lp_hsk_writing_done_v1",
          bucket: "reorder",
          prefix: "r3_",
          offset: 0,
          target: 20,
          defaultUrl: "hsk/writing/index.html?level=3",
          unitLabel: "bài"
        },
        {
          id: "hsk3_pinyin_write",
          module: "writing",
          moduleLabel: "Luyện viết",
          title: "10 bài Nhìn Pinyin viết chữ HSK 3",
          desc: "Luyện nhớ mặt chữ và điền chữ Hán vào câu theo gợi ý Pinyin.",
          evalType: "hsk_writing_bucket",
          storageKey: "lp_hsk_writing_done_v1",
          bucket: "pinyinWrite",
          prefix: "pw3_",
          offset: 0,
          target: 10,
          defaultUrl: "hsk/writing/index.html?level=3",
          unitLabel: "bài"
        },
        {
          id: "hsk3_listen",
          module: "listening",
          moduleLabel: "Nghe",
          title: "6 đề Nghe hiểu & Dictation HSK 3",
          desc: "Nghe hiểu đoạn hội thoại 4 lượt và đoán suy luận ngữ cảnh.",
          evalType: "id_list",
          storageKey: "lp_hsk_listening_done_v1",
          ids: buildSkillIds("listen_hsk", 3),
          basePath: "hsk/listening/index.html",
          unitLabel: "đề"
        },
        {
          id: "hsk3_read",
          module: "reading",
          moduleLabel: "Đọc",
          title: "6 bài Đọc hiểu HSK 3",
          desc: "Tập đọc hoàn toàn không Pinyin với bài điền từ và trả lời câu hỏi.",
          evalType: "id_list",
          storageKey: "lp_hsk_reading_done_v1",
          ids: buildSkillIds("read_hsk", 3),
          basePath: "hsk/reading/index.html",
          unitLabel: "bài"
        },
        {
          id: "hsk3_speak_shadow",
          module: "speaking",
          moduleLabel: "Khẩu ngữ",
          title: "3 bài Shadowing HSK 3",
          desc: "Tập nối câu ghép có liên từ và nhấn trọng tâm câu.",
          evalType: "id_list",
          storageKey: "lp_hsk_speaking_done_v1",
          ids: ["sh_5", "sh_6", "sh_9"],
          defaultUrl: "hsk/speaking/index.html?level=3",
          unitLabel: "bài"
        },
        {
          id: "hsk3_speak_hskk1",
          module: "speaking",
          moduleLabel: "Khẩu ngữ HSKK",
          title: "9 mục HSKK Trung cấp (Phần 1)",
          desc: "6 bộ nhắc lại câu dài + 3 đề nói miêu tả tranh/trả lời câu hỏi.",
          evalType: "id_list",
          storageKey: "lp_hsk_speaking_done_v1",
          ids: HSKK_MID_P1_IDS,
          defaultUrl: "hsk/speaking/index.html?level=3",
          unitLabel: "mục"
        },
        {
          id: "hsk3_mock",
          module: "mock",
          moduleLabel: "Thi thử Mock",
          title: "2 đề Full Mock HSK 3",
          desc: "Thi thử đầy đủ 3 phần Nghe–Đọc–Viết chuẩn thang điểm 300.",
          evalType: "hsk_mock_level",
          storageKey: "lp_hsk_mock_results_v1",
          level: 3,
          ids: ["mock_hsk3_1", "mock_hsk3_2"],
          target: 2,
          defaultUrl: "hsk/mock/index.html?level=3",
          unitLabel: "đề đạt"
        }
      ]
    },
    {
      id: "hsk4",
      order: 4,
      level: 4,
      icon: "m4",
      color: "#d97706",
      badge: "CHẶNG 4 • TRUNG CẤP HỌC THUẬT & HSK 4",
      title: "Liên từ phức, Đặt câu & Hoàn tất HSKK Trung cấp",
      levelRange: "HSK 4 + HSKK Trung",
      baseWeeksMin: 8,
      baseWeeksMax: 10,
      goal: "Làm chủ 609 từ HSK 4, 214 bộ thủ trọn bộ, 20 bài Đặt câu và đạt chuẩn ≥ 180/300 điểm Mock HSK 4.",
      tip: "Giữ nhịp ôn SRS hằng ngày trước khi nạp từ HSK 4 mới để tránh quên mặt chữ.",
      tasks: [
        {
          id: "hsk4_lessons",
          module: "lessons",
          moduleLabel: "Bài giảng",
          title: "20 bài giảng HSK 4",
          desc: "20 bài đọc học thuật chủ đề nghề nghiệp, giáo dục, xã hội và văn hóa.",
          evalType: "id_list",
          storageKey: "lp_hsk_lessons_done_v1",
          ids: HSK4_LESSON_IDS,
          basePath: "hsk/lessons/index.html",
          idParam: "lesson",
          unitLabel: "bài"
        },
        {
          id: "hsk4_vocab",
          module: "vocab",
          moduleLabel: "Từ vựng SRS",
          title: "609 từ vựng SRS HSK 4",
          desc: "Mở rộng vốn từ lên 1,207 từ tích lũy để đọc trôi chảy văn bản trung cấp.",
          evalType: "hsk_vocab_level",
          storageKey: "lp_hsk_vocab_srs_v1",
          level: 4,
          target: 609,
          defaultUrl: "hsk/vocab/index.html?level=4",
          unitLabel: "từ"
        },
        {
          id: "hsk4_grammar",
          module: "grammar",
          moduleLabel: "Ngữ pháp",
          title: "18 chuyên đề Ngữ pháp HSK 4",
          desc: "Cặp liên từ 既然…就, 即使…也, 除非…否则 và phân biệt cặp từ gần nghĩa.",
          evalType: "id_list",
          storageKey: "lp_hsk_grammar_done_v1",
          ids: HSK4_GRAMMAR_IDS,
          basePath: "hsk/grammar/index.html",
          unitLabel: "chuyên đề"
        },
        {
          id: "hsk4_mw",
          module: "grammar",
          moduleLabel: "Lượng từ",
          title: "35 lượng từ HSK 4 (Đủ 130 từ)",
          desc: "Nắm chắc lượng từ kết hợp danh từ trừu tượng và văn viết.",
          evalType: "hsk_mw_quota",
          storageKey: "lp_hsk_mw_done_v1",
          offset: 95,
          target: 35,
          defaultUrl: "hsk/grammar/index.html?mode=mw",
          unitLabel: "lượng từ"
        },
        {
          id: "hsk4_radicals",
          module: "writing",
          moduleLabel: "Luyện viết",
          title: "64 bộ thủ cuối (Đủ 214 bộ Khang Hy)",
          desc: "Hoàn tất toàn bộ 214 bộ thủ Khang Hy phục vụ đoán nghĩa cấp 5–6.",
          evalType: "hsk_writing_bucket",
          storageKey: "lp_hsk_writing_done_v1",
          bucket: "radicals",
          offset: 150,
          target: 64,
          defaultUrl: "hsk/writing/index.html?level=4&tab=radicals",
          unitLabel: "bộ thủ"
        },
        {
          id: "hsk4_reorder",
          module: "writing",
          moduleLabel: "Luyện viết",
          title: "20 bài Xếp câu phức HSK 4",
          desc: "Luyện sắp xếp câu ghép có liên từ và cụm định ngữ dài.",
          evalType: "hsk_writing_bucket",
          storageKey: "lp_hsk_writing_done_v1",
          bucket: "reorder",
          prefix: "r4_",
          offset: 0,
          target: 20,
          defaultUrl: "hsk/writing/index.html?level=4",
          unitLabel: "bài"
        },
        {
          id: "hsk4_pinyin_write",
          module: "writing",
          moduleLabel: "Luyện viết",
          title: "10 bài Nhìn Pinyin viết chữ cuối",
          desc: "Hoàn thành trọn bộ 20 bài luyện nhớ chữ Hán theo Pinyin.",
          evalType: "hsk_writing_bucket",
          storageKey: "lp_hsk_writing_done_v1",
          bucket: "pinyinWrite",
          prefix: "pw3_",
          offset: 10,
          target: 10,
          defaultUrl: "hsk/writing/index.html?level=4",
          unitLabel: "bài"
        },
        {
          id: "hsk4_make_sentence",
          module: "writing",
          moduleLabel: "Luyện viết",
          title: "20 bài Đặt câu với từ cho sẵn",
          desc: "Mô phỏng chuẩn đề Viết Phần 2 HSK 4 (nhìn tranh + đặt câu với từ khóa).",
          evalType: "hsk_writing_bucket",
          storageKey: "lp_hsk_writing_done_v1",
          bucket: "makeSentence",
          prefix: "ms4_",
          offset: 0,
          target: 20,
          defaultUrl: "hsk/writing/index.html?level=4",
          unitLabel: "bài"
        },
        {
          id: "hsk4_listen",
          module: "listening",
          moduleLabel: "Nghe",
          title: "6 đề Nghe hiểu & Dictation HSK 4",
          desc: "Nghe đoạn độc thoại ngắn và nắm ý chính, thái độ người nói.",
          evalType: "id_list",
          storageKey: "lp_hsk_listening_done_v1",
          ids: buildSkillIds("listen_hsk", 4),
          basePath: "hsk/listening/index.html",
          unitLabel: "đề"
        },
        {
          id: "hsk4_read",
          module: "reading",
          moduleLabel: "Đọc",
          title: "6 bài Đọc hiểu HSK 4",
          desc: "Rèn sắp xếp câu A-B-C và suy luận ý đoạn văn dưới áp lực thời gian.",
          evalType: "id_list",
          storageKey: "lp_hsk_reading_done_v1",
          ids: buildSkillIds("read_hsk", 4),
          basePath: "hsk/reading/index.html",
          unitLabel: "bài"
        },
        {
          id: "hsk4_speak_shadow",
          module: "speaking",
          moduleLabel: "Khẩu ngữ",
          title: "3 bài Shadowing HSK 4",
          desc: "Nâng tốc độ nói và giữ độ chính xác thanh điệu trên câu phức.",
          evalType: "id_list",
          storageKey: "lp_hsk_speaking_done_v1",
          ids: ["sh_10", "sh_11", "sh_12"],
          defaultUrl: "hsk/speaking/index.html?level=4",
          unitLabel: "bài"
        },
        {
          id: "hsk4_speak_hskk2",
          module: "speaking",
          moduleLabel: "Khẩu ngữ HSKK",
          title: "9 mục HSKK Trung cấp (Hoàn tất)",
          desc: "Hoàn tất 9 đề nói miêu tả tranh & trả lời tình huống HSKK Trung cấp.",
          evalType: "id_list",
          storageKey: "lp_hsk_speaking_done_v1",
          ids: HSKK_MID_P2_IDS,
          defaultUrl: "hsk/speaking/index.html?level=4",
          unitLabel: "mục"
        },
        {
          id: "hsk4_mock",
          module: "mock",
          moduleLabel: "Thi thử Mock",
          title: "2 đề Full Mock HSK 4",
          desc: "Thi thử chuẩn 105 phút Nghe–Đọc–Viết mục tiêu ≥ 180/300.",
          evalType: "hsk_mock_level",
          storageKey: "lp_hsk_mock_results_v1",
          level: 4,
          ids: ["mock_hsk4_1", "mock_hsk4_2"],
          target: 2,
          defaultUrl: "hsk/mock/index.html?level=4",
          unitLabel: "đề đạt"
        }
      ]
    },
    {
      id: "hsk5",
      order: 5,
      level: 5,
      icon: "zap",
      color: "#059669",
      badge: "CHẶNG 5 • CAO CẤP BÁO CHÍ & VIẾT ĐOẠN",
      title: "Thành ngữ, Đọc báo chí & Viết đoạn văn HSK 5",
      levelRange: "HSK 5 + HSKK Cao",
      baseWeeksMin: 12,
      baseWeeksMax: 14,
      goal: "Chinh phục 1,397 từ HSK 5, hoàn tất 168 lượng từ, luyện 12 bài viết đoạn và bước vào HSKK Cao cấp.",
      tip: "Chia nhỏ 1,397 từ HSK 5 thành nhịp 25–30 từ/ngày và bôi vàng từ khóa khi đọc bài dài.",
      tasks: [
        {
          id: "hsk5_lessons",
          module: "lessons",
          moduleLabel: "Bài giảng",
          title: "18 bài giảng HSK 5",
          desc: "18 bài văn nghị luận, truyện ngắn và bài báo chuyên sâu.",
          evalType: "id_list",
          storageKey: "lp_hsk_lessons_done_v1",
          ids: HSK5_LESSON_IDS,
          basePath: "hsk/lessons/index.html",
          idParam: "lesson",
          unitLabel: "bài"
        },
        {
          id: "hsk5_vocab",
          module: "vocab",
          moduleLabel: "Từ vựng SRS",
          title: "1,397 từ vựng SRS HSK 5",
          desc: "Tăng gấp đôi vốn từ vựng sang nhóm từ viết báo chí và thành ngữ 4 chữ.",
          evalType: "hsk_vocab_level",
          storageKey: "lp_hsk_vocab_srs_v1",
          level: 5,
          target: 1397,
          defaultUrl: "hsk/vocab/index.html?level=5",
          unitLabel: "từ"
        },
        {
          id: "hsk5_grammar",
          module: "grammar",
          moduleLabel: "Ngữ pháp",
          title: "18 chuyên đề Ngữ pháp HSK 5",
          desc: "Câu phản vấn, cặp phó từ dễ nhầm, phân biệt động từ và 3 nhóm thành ngữ.",
          evalType: "id_list",
          storageKey: "lp_hsk_grammar_done_v1",
          ids: HSK5_GRAMMAR_IDS,
          basePath: "hsk/grammar/index.html",
          unitLabel: "chuyên đề"
        },
        {
          id: "hsk5_mw",
          module: "grammar",
          moduleLabel: "Lượng từ",
          title: "38 lượng từ cuối (Đủ 168 lượng từ)",
          desc: "Hoàn tất 100% kho 168 lượng từ chuẩn HSK 1–6.",
          evalType: "hsk_mw_quota",
          storageKey: "lp_hsk_mw_done_v1",
          offset: 130,
          target: 38,
          defaultUrl: "hsk/grammar/index.html?mode=mw",
          unitLabel: "lượng từ"
        },
        {
          id: "hsk5_essays",
          module: "writing",
          moduleLabel: "Luyện viết",
          title: "12 bài Viết đoạn văn HSK 5",
          desc: "Viết đoạn 80+ chữ theo bộ từ cho sẵn hoặc tả tranh có bài mẫu đối chiếu.",
          evalType: "hsk_writing_bucket",
          storageKey: "lp_hsk_writing_done_v1",
          bucket: "essays",
          prefix: "w5_",
          offset: 0,
          target: 12,
          defaultUrl: "hsk/writing/index.html?level=5",
          unitLabel: "bài"
        },
        {
          id: "hsk5_listen",
          module: "listening",
          moduleLabel: "Nghe",
          title: "6 đề Nghe hiểu & Dictation HSK 5",
          desc: "Luyện nghe đoạn hội thoại dài và tin tức tốc độ chuẩn bản xứ.",
          evalType: "id_list",
          storageKey: "lp_hsk_listening_done_v1",
          ids: buildSkillIds("listen_hsk", 5),
          basePath: "hsk/listening/index.html",
          unitLabel: "đề"
        },
        {
          id: "hsk5_read",
          module: "reading",
          moduleLabel: "Đọc",
          title: "6 bài Đọc hiểu báo chí HSK 5",
          desc: "Đọc bài dài 600–800 chữ, luyện điền từ vào đoạn và chọn tiêu đề.",
          evalType: "id_list",
          storageKey: "lp_hsk_reading_done_v1",
          ids: buildSkillIds("read_hsk", 5),
          basePath: "hsk/reading/index.html",
          unitLabel: "bài"
        },
        {
          id: "hsk5_speak_shadow",
          module: "speaking",
          moduleLabel: "Khẩu ngữ",
          title: "3 bài Shadowing HSK 5",
          desc: "Luyện diễn đạt đoạn văn dài giữ ngữ điệu tự nhiên.",
          evalType: "id_list",
          storageKey: "lp_hsk_speaking_done_v1",
          ids: ["sh_13", "sh_14", "sh_15"],
          defaultUrl: "hsk/speaking/index.html?level=5",
          unitLabel: "bài"
        },
        {
          id: "hsk5_speak_hskk1",
          module: "speaking",
          moduleLabel: "Khẩu ngữ HSKK",
          title: "9 mục HSKK Cao cấp (Phần 1)",
          desc: "6 bộ nghe nhắc lại đoạn văn dài + 3 đề đọc diễn cảm và bàn luận.",
          evalType: "id_list",
          storageKey: "lp_hsk_speaking_done_v1",
          ids: HSKK_ADV_P1_IDS,
          defaultUrl: "hsk/speaking/index.html?level=5",
          unitLabel: "mục"
        },
        {
          id: "hsk5_mock",
          module: "mock",
          moduleLabel: "Thi thử Mock",
          title: "2 đề Full Mock HSK 5",
          desc: "Thi thử bấm giờ chuẩn 125 phút cho trọn bộ Nghe–Đọc–Viết.",
          evalType: "hsk_mock_level",
          storageKey: "lp_hsk_mock_results_v1",
          level: 5,
          ids: ["mock_hsk5_1", "mock_hsk5_2"],
          target: 2,
          defaultUrl: "hsk/mock/index.html?level=5",
          unitLabel: "đề đạt"
        }
      ]
    },
    {
      id: "hsk6",
      order: 6,
      level: 6,
      icon: "m5",
      color: "#e11d48",
      badge: "CHẶNG 6 • TINH THÔNG HSK 6 & HSKK CAO CẤP",
      title: "Chữa câu bệnh, Tóm tắt văn bản 1,000 chữ & Đích HSK 6",
      levelRange: "HSK 6 + HSKK Cao",
      baseWeeksMin: 16,
      baseWeeksMax: 20,
      goal: "Hoàn tất 2,508 từ HSK 6, làm chủ đọc tìm câu sai, viết tóm tắt 400 chữ và chinh phục Mock HSK 6.",
      tip: "Trong đề Viết tóm tắt HSK 6, ghi nhanh nhân vật–sự kiện–kết quả trong 10 phút đọc trước khi viết.",
      tasks: [
        {
          id: "hsk6_lessons",
          module: "lessons",
          moduleLabel: "Bài giảng",
          title: "15 bài giảng HSK 6",
          desc: "15 bài văn học thuật, bình luận xã hội, kinh tế và triết lý sống.",
          evalType: "id_list",
          storageKey: "lp_hsk_lessons_done_v1",
          ids: HSK6_LESSON_IDS,
          basePath: "hsk/lessons/index.html",
          idParam: "lesson",
          unitLabel: "bài"
        },
        {
          id: "hsk6_vocab",
          module: "vocab",
          moduleLabel: "Từ vựng SRS",
          title: "2,508 từ vựng SRS HSK 6",
          desc: "Phủ kín trọn bộ 5,112 từ HSK 1–6 cùng hệ thống từ văn viết trang trọng.",
          evalType: "hsk_vocab_level",
          storageKey: "lp_hsk_vocab_srs_v1",
          level: 6,
          target: 2508,
          defaultUrl: "hsk/vocab/index.html?level=6",
          unitLabel: "từ"
        },
        {
          id: "hsk6_grammar",
          module: "grammar",
          moduleLabel: "Ngữ pháp",
          title: "18 chuyên đề Ngữ pháp HSK 6",
          desc: "Cấu trúc cổ văn, nhận diện 2 dạng câu bệnh và 4 nhóm thành ngữ cao cấp.",
          evalType: "id_list",
          storageKey: "lp_hsk_grammar_done_v1",
          ids: HSK6_GRAMMAR_IDS,
          basePath: "hsk/grammar/index.html",
          unitLabel: "chuyên đề"
        },
        {
          id: "hsk6_chars",
          module: "writing",
          moduleLabel: "Luyện viết",
          title: "20 chữ Hán phức tạp (Đủ 60 chữ Mễ)",
          desc: "Củng cố chính xác nét viết tay các chữ Hán nhiều nét hay viết nhầm.",
          evalType: "hsk_writing_bucket",
          storageKey: "lp_hsk_writing_done_v1",
          bucket: "chars",
          offset: 40,
          target: 20,
          defaultUrl: "hsk/writing/index.html?level=6",
          unitLabel: "chữ"
        },
        {
          id: "hsk6_essays",
          module: "writing",
          moduleLabel: "Luyện viết",
          title: "8 bài Viết tóm tắt văn bản HSK 6",
          desc: "Đọc bài 1,000 chữ trong 10 phút rồi viết tóm tắt súc tích ~400 chữ.",
          evalType: "hsk_writing_bucket",
          storageKey: "lp_hsk_writing_done_v1",
          bucket: "essays",
          prefix: "w6_",
          offset: 0,
          target: 8,
          defaultUrl: "hsk/writing/index.html?level=6",
          unitLabel: "bài"
        },
        {
          id: "hsk6_listen",
          module: "listening",
          moduleLabel: "Nghe",
          title: "6 đề Nghe hiểu & Dictation HSK 6",
          desc: "Nghe bài giảng, phỏng vấn và phóng sự tốc độ cao chuẩn đề thật.",
          evalType: "id_list",
          storageKey: "lp_hsk_listening_done_v1",
          ids: buildSkillIds("listen_hsk", 6),
          basePath: "hsk/listening/index.html",
          unitLabel: "đề"
        },
        {
          id: "hsk6_read",
          module: "reading",
          moduleLabel: "Đọc",
          title: "6 bài Đọc hiểu nâng cao HSK 6",
          desc: "Luyện bắt lỗi câu bệnh (Ngữ bệnh) và đọc hiểu bài dài học thuật.",
          evalType: "id_list",
          storageKey: "lp_hsk_reading_done_v1",
          ids: buildSkillIds("read_hsk", 6),
          basePath: "hsk/reading/index.html",
          unitLabel: "bài"
        },
        {
          id: "hsk6_speak_shadow",
          module: "speaking",
          moduleLabel: "Khẩu ngữ",
          title: "3 bài Shadowing HSK 6",
          desc: "Luyện trình bày quan điểm học thuật mạch lạc và nhấn nhá chuẩn.",
          evalType: "id_list",
          storageKey: "lp_hsk_speaking_done_v1",
          ids: ["sh_16", "sh_17", "sh_18"],
          defaultUrl: "hsk/speaking/index.html?level=6",
          unitLabel: "bài"
        },
        {
          id: "hsk6_speak_hskk2",
          module: "speaking",
          moduleLabel: "Khẩu ngữ HSKK",
          title: "9 mục HSKK Cao cấp (Hoàn tất)",
          desc: "Hoàn thành 9 đề nghị luận vấn đề xã hội chuẩn HSKK Cao cấp.",
          evalType: "id_list",
          storageKey: "lp_hsk_speaking_done_v1",
          ids: HSKK_ADV_P2_IDS,
          defaultUrl: "hsk/speaking/index.html?level=6",
          unitLabel: "mục"
        },
        {
          id: "hsk6_mock",
          module: "mock",
          moduleLabel: "Thi thử Mock",
          title: "2 đề Full Mock HSK 6",
          desc: "Thi thử 140 phút gồm Nghe–Đọc–Viết tóm tắt, mục tiêu ≥ 180/300.",
          evalType: "hsk_mock_level",
          storageKey: "lp_hsk_mock_results_v1",
          level: 6,
          ids: ["mock_hsk6_1", "mock_hsk6_2"],
          target: 2,
          defaultUrl: "hsk/mock/index.html?level=6",
          unitLabel: "đề đạt"
        },
        {
          id: "hsk6_srs_daily",
          module: "vocab",
          moduleLabel: "Ôn tập SRS",
          title: "Giữ sạch từ vựng HSK SRS đến hạn",
          desc: "Duy trì ôn lặp lại ngắt quãng mỗi ngày để không rơi rụng 5,112 từ.",
          evalType: "due_review",
          storageKey: "lp_hsk_vocab_srs_v1",
          defaultUrl: "hsk/vocab/index.html?filter=due",
          unitLabel: "trạng thái"
        }
      ]
    }
  ];

  var data = {
    STORAGE_KEY: STORAGE_KEY,
    START_LEVELS: START_LEVELS,
    PACES: PACES,
    VOCAB_LEVEL_TOTALS: VOCAB_LEVEL_TOTALS,
    STAGES: STAGES
  };

  if (typeof window !== "undefined") window.LP_HSK_ROADMAP_DATA = data;
  if (typeof module !== "undefined" && module.exports) module.exports = data;
})(typeof window !== "undefined" ? window : globalThis);

/* LinguaPath IELTS Roadmap — Dữ liệu Lộ trình học 5 Mốc chuẩn hóa từ kho tài liệu thực tế
 * Không nạp dữ liệu nặng (vocab_data, grammar_data...); chỉ định nghĩa cấu trúc mốc & tham chiếu ID.
 */
(function (root) {
  "use strict";

  var STORAGE_KEY = "lp_ielts_roadmap_v1";

  var START_LEVELS = [
    {
      id: "foundation",
      label: "Mất gốc / Nền tảng",
      badge: "Từ Mốc 1",
      targetBand: "3.5 → 6.5+",
      startStageIdx: 0,
      desc: "Từ loại, Thì cơ bản, 41 bài phát âm IPA & 278 từ vựng nền."
    },
    {
      id: "intermediate",
      label: "Đã có cơ bản (5.0+)",
      badge: "Từ Mốc 2",
      targetBand: "5.0 → 7.5",
      startStageIdx: 1,
      desc: "Mệnh đề, dạng bài 4 kỹ năng, Writing Task 1 & Speaking Part 1."
    },
    {
      id: "advanced",
      label: "Tăng tốc luyện đề (6.0+)",
      badge: "Từ Mốc 3",
      targetBand: "6.0 → 8.0+",
      startStageIdx: 2,
      desc: "Grammar in Writing, Task 2, Part 2–3 & chuỗi đề thi máy CBT."
    }
  ];

  var PACES = [
    { id: "light", label: "Nhẹ nhàng", dailyDesc: "45–60 phút/ngày", factor: 1.45 },
    { id: "standard", label: "Tiêu chuẩn", dailyDesc: "1.5–2 giờ/ngày", factor: 1.0 },
    { id: "intensive", label: "Cấp tốc", dailyDesc: "3 giờ+/ngày", factor: 0.65 }
  ];

  // 20 chủ đề chính xác trong ielts/vocab/vocab_data.js (1,827 từ: w_0 .. w_1826)
  var VOCAB_TOPICS = [
    { idx: 0, name: "Relationships, families and early learning (Các mối quan hệ, gia đình và giáo dục sớm)", shortName: "Gia đình & Giáo dục sớm", startIdx: 0, endIdx: 34 },
    { idx: 1, name: "The body, the mind (Cơ thể, tâm trí)", shortName: "Cơ thể & Tâm trí", startIdx: 35, endIdx: 72 },
    { idx: 2, name: "Diet, health and exercise (Chế độ dinh dưỡng, sức khỏe và luyện tập)", shortName: "Dinh dưỡng & Sức khỏe", startIdx: 73, endIdx: 162 },
    { idx: 3, name: "Life, leisure (Cuộc sống, thời gian rảnh)", shortName: "Cuộc sống & Giải trí", startIdx: 163, endIdx: 193 },
    { idx: 4, name: "Study, education, research (Học tập, giáo dục, nghiên cứu)", shortName: "Học tập & Nghiên cứu", startIdx: 194, endIdx: 277 },
    { idx: 5, name: "Language, linguistics (Ngôn ngữ, ngôn ngữ học)", shortName: "Ngôn ngữ học", startIdx: 278, endIdx: 340 },
    { idx: 6, name: "Tourism, travel (Du lịch)", shortName: "Du lịch", startIdx: 341, endIdx: 414 },
    { idx: 7, name: "Time, history (Thời gian, lịch sử)", shortName: "Thời gian & Lịch sử", startIdx: 415, endIdx: 564 },
    { idx: 8, name: "Flora and fauna, agriculture (Hệ thực vật, nông nghiệp)", shortName: "Thực vật & Nông nghiệp", startIdx: 565, endIdx: 714 },
    { idx: 9, name: "Space, the planets (Không gian, các hành tinh)", shortName: "Không gian & Hành tinh", startIdx: 715, endIdx: 830 },
    { idx: 10, name: "Design and innovation (Thiết kế và đổi mới)", shortName: "Thiết kế & Đổi mới", startIdx: 831, endIdx: 971 },
    { idx: 11, name: "Technology (Công nghệ)", shortName: "Công nghệ", startIdx: 972, endIdx: 1025 },
    { idx: 12, name: "Globalisation (Toàn cầu hóa)", shortName: "Toàn cầu hóa", startIdx: 1026, endIdx: 1093 },
    { idx: 13, name: "Urbanisation (Đô thị hóa)", shortName: "Đô thị hóa", startIdx: 1094, endIdx: 1180 },
    { idx: 14, name: "Business (Kinh doanh)", shortName: "Kinh doanh", startIdx: 1181, endIdx: 1270 },
    { idx: 15, name: "The arts (Nghệ thuật)", shortName: "Nghệ thuật", startIdx: 1271, endIdx: 1402 },
    { idx: 16, name: "The environment (Môi trường)", shortName: "Môi trường", startIdx: 1403, endIdx: 1500 },
    { idx: 17, name: "Natural resources and alternative fuels (Tài nguyên thiên nhiên và các nguồn năng lượng thay thế)", shortName: "Tài nguyên & Năng lượng", startIdx: 1501, endIdx: 1647 },
    { idx: 18, name: "Crime and punishment (Tội phạm và hình phạt)", shortName: "Tội phạm & Pháp luật", startIdx: 1648, endIdx: 1747 },
    { idx: 19, name: "The media (Truyền thông)", shortName: "Truyền thông", startIdx: 1748, endIdx: 1826 }
  ];

  var SPEAK_PRON_M1_IDS = [
    "sp_pr_5994", "sp_pr_5995", "sp_pr_5996", "sp_pr_5997", "sp_pr_5999", "sp_pr_13841", "sp_pr_5998",
    "sp_pr_6000", "sp_pr_6001", "sp_pr_6002", "sp_pr_6003", "sp_pr_6004", "sp_pr_6005", "sp_pr_6006",
    "sp_pr_6007", "sp_pr_6008", "sp_pr_5969", "sp_pr_5970", "sp_pr_5971", "sp_pr_5972", "sp_pr_5973",
    "sp_pr_5974", "sp_pr_5975", "sp_pr_5976", "sp_pr_5977", "sp_pr_5978", "sp_pr_5979", "sp_pr_5980",
    "sp_pr_5981", "sp_pr_5982", "sp_pr_5983", "sp_pr_5984", "sp_pr_5985", "sp_pr_5986", "sp_pr_5987",
    "sp_pr_5988", "sp_pr_5989", "sp_pr_5990", "sp_pr_5991", "sp_pr_5992", "sp_pr_5993"
  ];

  var SPEAK_PRON_M2_IDS = [
    "sp_pr_6009", "sp_pr_6010", "sp_pr_6011", "sp_pr_6012", "sp_pr_6013", "sp_pr_6014", "sp_pr_6015",
    "sp_pr_6016", "sp_pr_6017", "sp_pr_6018", "sp_pr_6019", "sp_pr_6020", "sp_pr_6021", "sp_pr_6022",
    "sp_pr_6023"
  ];

  var SPEAK_PRON_M3_IDS = [
    "sp_pr_6024", "sp_pr_6025", "sp_pr_6026", "sp_pr_6027", "sp_pr_6028", "sp_pr_6029", "sp_pr_6030",
    "sp_pr_6031", "sp_pr_6032", "sp_pr_6033", "sp_pr_6034", "sp_pr_6035", "sp_pr_6036", "sp_pr_6037",
    "sp_pr_6038", "sp_pr_6039", "sp_pr_6040", "sp_pr_6041", "sp_pr_6042", "sp_pr_6043", "sp_pr_6044",
    "sp_pr_6045"
  ];

  var SPEAK_VID_P1_IDS = [
    "sp_vid_14608", "sp_vid_14609", "sp_vid_14610", "sp_vid_14611", "sp_vid_14612",
    "sp_vid_14613", "sp_vid_14614", "sp_vid_14615", "sp_vid_14616", "sp_vid_14617"
  ];

  var SPEAK_VID_P2_IDS = [
    "sp_vid_14618", "sp_vid_14619", "sp_vid_14620", "sp_vid_14621", "sp_vid_14622",
    "sp_vid_14625", "sp_vid_14626", "sp_vid_14623", "sp_vid_14624", "sp_vid_14627",
    "sp_vid_14628", "sp_vid_14629", "sp_vid_14630", "sp_vid_14631", "sp_vid_14632"
  ];

  var SPEAK_VID_P3_IDS = [
    "sp_vid_14633", "sp_vid_14634", "sp_vid_14635", "sp_vid_14636", "sp_vid_14637",
    "sp_vid_14638", "sp_vid_14639", "sp_vid_14640", "sp_vid_14641"
  ];

  var STAGES = [
    {
      id: "m1",
      order: 1,
      icon: "🌱",
      color: "#0d9488",
      badge: "MỐC 1 • NỀN TẢNG CỐT LÕI",
      title: "Xây móng Ngữ pháp, Phát âm & Kỹ năng đọc-nghe nền",
      bandRange: "Band 3.5 → 5.0",
      baseWeeksMin: 4,
      baseWeeksMax: 5,
      goal: "Nắm chắc từ loại, 6 thì cơ bản, 41 bài IPA và kỹ thuật Paraphrase, Skimming, Scanning.",
      tip: "1–2 bài Grammar + 15 từ SRS + 1 bài Nghe hoặc Phát âm mỗi ngày.",
      tasks: [
        {
          id: "m1_grammar_pos",
          module: "grammar",
          moduleLabel: "Ngữ pháp",
          icon: "📚",
          title: "Từ loại & Cấu trúc so sánh (Chương 1)",
          desc: "29 bài: Danh từ, Đại từ, Tính/Trạng từ, So sánh, Giới từ, Liên từ.",
          evalType: "id_list",
          storageKey: "s4_grammar_done",
          ids: { prefix: "item_", start: 1, end: 29 },
          basePath: "ielts/grammar/index.html",
          unitLabel: "bài"
        },
        {
          id: "m1_grammar_tenses_basic",
          module: "grammar",
          moduleLabel: "Ngữ pháp",
          icon: "📚",
          title: "Tổng quan Động từ, Thì Hiện tại & Quá khứ",
          desc: "12 bài (30–41): chia động từ và các thì cơ bản.",
          evalType: "id_list",
          storageKey: "s4_grammar_done",
          ids: { prefix: "item_", start: 30, end: 41 },
          basePath: "ielts/grammar/index.html",
          unitLabel: "bài"
        },
        {
          id: "m1_vocab_t1_5",
          module: "vocab",
          moduleLabel: "Từ vựng nền",
          icon: "🧠",
          title: "278 từ vựng SRS Chủ đề 1–5",
          desc: "Gia đình, Cơ thể, Sức khỏe, Đời sống & Học tập.",
          evalType: "vocab_range",
          storageKey: "s4_vocab_srs_v1",
          startIdx: 0,
          endIdx: 277,
          topicIndices: [0, 1, 2, 3, 4],
          basePath: "ielts/vocab/index.html",
          unitLabel: "từ"
        },
        {
          id: "m1_speak_pron_core",
          module: "speaking",
          moduleLabel: "Speaking",
          icon: "🗣️",
          title: "41 bài Phát âm nền (Nguyên âm & Phụ âm)",
          desc: "16 nguyên âm + 25 phụ âm chuẩn IPA kèm drills.",
          evalType: "id_list",
          storageKey: "lp_speaking_done_v1",
          ids: SPEAK_PRON_M1_IDS,
          basePath: "ielts/speaking/index.html",
          unitLabel: "bài"
        },
        {
          id: "m1_listen_core",
          module: "listening",
          moduleLabel: "Listening",
          icon: "🎧",
          title: "6 video Phương pháp nghe nền tảng",
          desc: "Paraphrase, Predicting, Numbers, Distractors & Signposting.",
          evalType: "id_list",
          storageKey: "s4_listening_done",
          ids: { prefix: "listening_u1_", start: 1, end: 6 },
          basePath: "ielts/listening/index.html",
          unitLabel: "bài"
        },
        {
          id: "m1_listen_dict_basic",
          module: "listening",
          moduleLabel: "Listening",
          icon: "🎧",
          title: "8 bài Chép chính tả từ vựng thiết yếu",
          desc: "Từ loại, Số & Chữ cái, Tiền tệ, Địa chỉ, Ngày tháng.",
          evalType: "id_list",
          storageKey: "s4_listening_done",
          ids: { prefix: "listening_u2_", start: 1, end: 8 },
          basePath: "ielts/listening/index.html",
          unitLabel: "bài"
        },
        {
          id: "m1_read_core",
          module: "reading",
          moduleLabel: "Reading",
          icon: "📖",
          title: "6 video Kỹ thuật đọc cốt lõi",
          desc: "Skimming, Scanning, Keywords, Paraphrase & Predicting.",
          evalType: "id_list",
          storageKey: "s4_reading_done",
          ids: { prefix: "reading_u1_", start: 1, end: 6 },
          basePath: "ielts/reading/index.html",
          unitLabel: "bài"
        }
      ]
    },
    {
      id: "m2",
      order: 2,
      icon: "🌿",
      color: "#2563eb",
      badge: "MỐC 2 • TRUNG CẤP & DẠNG BÀI CƠ BẢN",
      title: "Hoàn thiện Thì, Mệnh đề & Làm chủ các dạng câu hỏi",
      bandRange: "Band 5.0 → 6.0",
      baseWeeksMin: 5,
      baseWeeksMax: 6,
      goal: "Hoàn thiện Thì, Mệnh đề; giải quyết đủ dạng bài Listening/Reading và vào Task 1 + Part 1.",
      tip: "Kết hợp đọc Academic song ngữ, nghe chép ngắn u_3 và từ vựng SRS theo kỹ năng.",
      tasks: [
        {
          id: "m2_grammar_tenses_adv",
          module: "grammar",
          moduleLabel: "Ngữ pháp",
          icon: "📚",
          title: "Thì Hoàn thành, Tương lai, Modals & Phrasal Verbs",
          desc: "35 bài (42–76): hoàn tất Chương 2 về Thì và Động từ.",
          evalType: "id_list",
          storageKey: "s4_grammar_done",
          ids: { prefix: "item_", start: 42, end: 76 },
          basePath: "ielts/grammar/index.html",
          unitLabel: "bài"
        },
        {
          id: "m2_grammar_clauses",
          module: "grammar",
          moduleLabel: "Ngữ pháp",
          icon: "📚",
          title: "Mệnh đề & Câu phức (Chương 3)",
          desc: "23 bài (77–99): Quan hệ, Điều kiện, Gián tiếp & Bị động.",
          evalType: "id_list",
          storageKey: "s4_grammar_done",
          ids: { prefix: "item_", start: 77, end: 99 },
          basePath: "ielts/grammar/index.html",
          unitLabel: "bài"
        },
        {
          id: "m2_vocab_t6_10",
          module: "vocab",
          moduleLabel: "Từ vựng nền",
          icon: "🧠",
          title: "553 từ vựng SRS Chủ đề 6–10",
          desc: "Ngôn ngữ, Du lịch, Lịch sử, Thực vật & Không gian.",
          evalType: "vocab_range",
          storageKey: "s4_vocab_srs_v1",
          startIdx: 278,
          endIdx: 830,
          topicIndices: [5, 6, 7, 8, 9],
          basePath: "ielts/vocab/index.html",
          unitLabel: "từ"
        },
        {
          id: "m2_listen_types",
          module: "listening",
          moduleLabel: "Listening",
          icon: "🎧",
          title: "6 video Xử lý đủ dạng câu hỏi Listening",
          desc: "Completion, Short Answer, Map/Diagram, MCQ & Matching.",
          evalType: "id_list",
          storageKey: "s4_listening_done",
          ids: { prefix: "listening_u1_", start: 7, end: 12 },
          basePath: "ielts/listening/index.html",
          unitLabel: "bài"
        },
        {
          id: "m2_listen_traps",
          module: "listening",
          moduleLabel: "Listening",
          icon: "🎧",
          title: "7 bài Chép chính tả bẫy phát âm & Map",
          desc: "Nghề nghiệp, Cụm từ, Nuốt âm, Từ dài & Chỉ đường Map.",
          evalType: "id_list",
          storageKey: "s4_listening_done",
          ids: { prefix: "listening_u2_", start: 9, end: 15 },
          basePath: "ielts/listening/index.html",
          unitLabel: "bài"
        },
        {
          id: "m2_listen_u3_basic",
          module: "listening",
          moduleLabel: "Listening",
          icon: "🎧",
          title: "20 bài Nghe chép đoạn ngắn theo chủ đề",
          desc: "20 đoạn hội thoại đời sống đầu tiên trong Unit 3.",
          evalType: "prefix_quota",
          storageKey: "s4_listening_done",
          prefix: "listening_u3_",
          offset: 0,
          target: 20,
          defaultUrl: "ielts/listening/index.html?unit=u_3",
          unitLabel: "bài"
        },
        {
          id: "m2_listen_srs_1",
          module: "listening",
          moduleLabel: "Listening SRS",
          icon: "🎧",
          title: "500 từ vựng Listening SRS đầu tiên",
          desc: "Chủ đề 1–3: Daily Life, Job Seeking, Tourism (Unit 5).",
          evalType: "srs_quota",
          storageKey: "s4_listening_srs_v1",
          offset: 0,
          target: 500,
          defaultUrl: "ielts/listening/index.html?id=listening_u5_1",
          unitLabel: "từ"
        },
        {
          id: "m2_read_types",
          module: "reading",
          moduleLabel: "Reading",
          icon: "📖",
          title: "10 video Chiến thuật giải 10 dạng câu hỏi Reading",
          desc: "Completion, T/F/NG, Y/N/NG, MCQ & Matching Headings.",
          evalType: "id_list",
          storageKey: "s4_reading_done",
          ids: { prefix: "reading_u1_", start: 7, end: 16 },
          basePath: "ielts/reading/index.html",
          unitLabel: "bài"
        },
        {
          id: "m2_read_passages_1",
          module: "reading",
          moduleLabel: "Reading",
          icon: "📖",
          title: "15 bài đọc Academic song ngữ đầu tiên",
          desc: "15 bài đọc hiểu song ngữ + từ đồng nghĩa đầu Unit 2.",
          evalType: "prefix_quota",
          storageKey: "s4_reading_done",
          prefix: "reading_u2_",
          offset: 0,
          target: 15,
          defaultUrl: "ielts/reading/index.html?unit=u_2",
          unitLabel: "bài"
        },
        {
          id: "m2_read_srs_1",
          module: "reading",
          moduleLabel: "Reading SRS",
          icon: "📖",
          title: "600 từ vựng Reading SRS đầu tiên",
          desc: "Chủ đề 1–3: History, Technology, Education (Unit 3).",
          evalType: "srs_quota",
          storageKey: "s4_reading_srs_v1",
          offset: 0,
          target: 600,
          defaultUrl: "ielts/reading/index.html?id=reading_u3_1",
          unitLabel: "từ"
        },
        {
          id: "m2_write_t1_basic",
          module: "writing",
          moduleLabel: "Writing",
          icon: "✍️",
          title: "13 bài Lý thuyết Writing Task 1 cơ bản",
          desc: "Tiêu chí chấm & phân tích biểu đồ Trend / Comparative.",
          evalType: "id_list",
          storageKey: "s4_writing_done",
          ids: { prefix: "writing_u1_", start: 1, end: 13 },
          basePath: "ielts/writing/index.html",
          unitLabel: "bài"
        },
        {
          id: "m2_speak_pron_mid",
          module: "speaking",
          moduleLabel: "Speaking",
          icon: "🗣️",
          title: "15 bài Cụm phụ âm, Âm đuôi & Trọng âm từ",
          desc: "Sửa lỗi mất âm cuối (-s/-ed) và trọng âm từ.",
          evalType: "id_list",
          storageKey: "lp_speaking_done_v1",
          ids: SPEAK_PRON_M2_IDS,
          basePath: "ielts/speaking/index.html",
          unitLabel: "bài"
        },
        {
          id: "m2_speak_p1_strat",
          module: "speaking",
          moduleLabel: "Speaking",
          icon: "🗣️",
          title: "10 video Chiến thuật Speaking & Part 1",
          desc: "Tiêu chí chấm & 7 dạng câu hỏi Speaking Part 1.",
          evalType: "id_list",
          storageKey: "lp_speaking_done_v1",
          ids: SPEAK_VID_P1_IDS,
          basePath: "ielts/speaking/index.html",
          unitLabel: "bài"
        },
        {
          id: "m2_speak_p1_prac",
          module: "speaking",
          moduleLabel: "Speaking",
          icon: "🗣️",
          title: "Thực hành 10 chủ đề Speaking Part 1",
          desc: "Ghi âm & nghe lại 10 chủ đề Part 1 (Unit 2).",
          evalType: "prefix_quota",
          storageKey: "lp_speaking_done_v1",
          prefix: "sp_p1_",
          offset: 0,
          target: 10,
          defaultUrl: "ielts/speaking/index.html?unit=u_2",
          unitLabel: "chủ đề"
        }
      ]
    },
    {
      id: "m3",
      order: 3,
      icon: "🚀",
      color: "#7c3aed",
      badge: "MỐC 3 • HỌC THUẬT & CHUYÊN SÂU",
      title: "Chinh phục Grammar in Writing, Task 1–2 & Part 2",
      bandRange: "Band 6.0 → 6.5+",
      baseWeeksMin: 6,
      baseWeeksMax: 8,
      goal: "Hoàn tất Ngữ pháp học thuật; làm chủ Writing Task 1–2 và Speaking Part 2.",
      tip: "Viết xong Task 1/2 nên đối chiếu bài mẫu Simon để sửa ngay lỗi lập luận.",
      tasks: [
        {
          id: "m3_grammar_writing",
          module: "grammar",
          moduleLabel: "Ngữ pháp",
          icon: "📚",
          title: "Grammar in Writing — Văn viết học thuật (Chương 4)",
          desc: "21 bài (100–120): Liên kết ý, Danh từ hóa & Dấu câu.",
          evalType: "id_list",
          storageKey: "s4_grammar_done",
          ids: { prefix: "item_", start: 100, end: 120 },
          basePath: "ielts/grammar/index.html",
          unitLabel: "bài"
        },
        {
          id: "m3_vocab_t11_15",
          module: "vocab",
          moduleLabel: "Từ vựng nền",
          icon: "🧠",
          title: "440 từ vựng SRS Chủ đề 11–15",
          desc: "Thiết kế, Công nghệ, Toàn cầu hóa, Đô thị hóa & Kinh doanh.",
          evalType: "vocab_range",
          storageKey: "s4_vocab_srs_v1",
          startIdx: 831,
          endIdx: 1270,
          topicIndices: [10, 11, 12, 13, 14],
          basePath: "ielts/vocab/index.html",
          unitLabel: "từ"
        },
        {
          id: "m3_write_t1_adv",
          module: "writing",
          moduleLabel: "Writing",
          icon: "✍️",
          title: "8 bài Lý thuyết Task 1 nâng cao",
          desc: "Mixed Chart, Process và Map (bài 14–21).",
          evalType: "id_list",
          storageKey: "s4_writing_done",
          ids: { prefix: "writing_u1_", start: 14, end: 21 },
          basePath: "ielts/writing/index.html",
          unitLabel: "bài"
        },
        {
          id: "m3_write_t2_theory",
          module: "writing",
          moduleLabel: "Writing",
          icon: "✍️",
          title: "Trọn bộ 21 bài Lý thuyết Writing Task 2",
          desc: "Lập luận, Phản đề, tiêu chí TR/CC/LR/GRA & 5 dạng Task 2.",
          evalType: "id_list",
          storageKey: "s4_writing_done",
          ids: { prefix: "writing_u2_", start: 1, end: 21 },
          basePath: "ielts/writing/index.html",
          unitLabel: "bài"
        },
        {
          id: "m3_write_prac_1",
          module: "writing",
          moduleLabel: "Writing",
          icon: "✍️",
          title: "Thực hành 15 đề Writing Task 1 (Unit 3)",
          desc: "Table, Line, Bar, Pie kèm bài mẫu Simon.",
          evalType: "prefix_quota",
          storageKey: "s4_writing_done",
          prefix: "writing_u3_",
          offset: 0,
          target: 15,
          defaultUrl: "ielts/writing/index.html?unit=u_3",
          unitLabel: "đề"
        },
        {
          id: "m3_write_t2_types",
          module: "writing",
          moduleLabel: "Writing",
          icon: "✍️",
          title: "Thực hành 10 đề Task 2 theo dạng câu hỏi (Unit 4)",
          desc: "Opinion, Discussion, Problems & Two-part Question.",
          evalType: "prefix_quota",
          storageKey: "s4_writing_done",
          prefix: "writing_u4_",
          offset: 0,
          target: 10,
          defaultUrl: "ielts/writing/index.html?unit=u_4",
          unitLabel: "đề"
        },
        {
          id: "m3_speak_pron_adv",
          module: "speaking",
          moduleLabel: "Speaking",
          icon: "🗣️",
          title: "22 bài Nhịp điệu, Ngữ điệu & Nối âm tự nhiên",
          desc: "Ngắt cụm ý, nhấn thông tin mới & nối âm tự nhiên.",
          evalType: "id_list",
          storageKey: "lp_speaking_done_v1",
          ids: SPEAK_PRON_M3_IDS,
          basePath: "ielts/speaking/index.html",
          unitLabel: "bài"
        },
        {
          id: "m3_speak_p2_strat",
          module: "speaking",
          moduleLabel: "Speaking",
          icon: "🗣️",
          title: "15 video Chiến thuật Speaking Part 2",
          desc: "Cách tả Người, Đồ vật, Địa điểm & Trải nghiệm.",
          evalType: "id_list",
          storageKey: "lp_speaking_done_v1",
          ids: SPEAK_VID_P2_IDS,
          basePath: "ielts/speaking/index.html",
          unitLabel: "bài"
        },
        {
          id: "m3_speak_p2_prac",
          module: "speaking",
          moduleLabel: "Speaking",
          icon: "🗣️",
          title: "Thực hành 10 chủ đề Speaking Part 2 (Cue Card)",
          desc: "Bấm giờ 1 phút chuẩn bị + 2 phút nói (Unit 3).",
          evalType: "prefix_quota",
          storageKey: "lp_speaking_done_v1",
          prefix: "sp_p2_",
          offset: 0,
          target: 10,
          defaultUrl: "ielts/speaking/index.html?unit=u_3",
          unitLabel: "chủ đề"
        },
        {
          id: "m3_listen_u3_more",
          module: "listening",
          moduleLabel: "Listening",
          icon: "🎧",
          title: "25 bài Nghe chép theo chủ đề tiếp theo (Unit 3)",
          desc: "Chủ đề Công nghệ, Đô thị, Doanh nghiệp & Môi trường.",
          evalType: "prefix_quota",
          storageKey: "s4_listening_done",
          prefix: "listening_u3_",
          offset: 20,
          target: 25,
          defaultUrl: "ielts/listening/index.html?unit=u_3",
          unitLabel: "bài"
        },
        {
          id: "m3_listen_u4_1",
          module: "listening",
          moduleLabel: "Listening",
          icon: "🎧",
          title: "30 section Nghe chép đề thi IELTS thật (Unit 4)",
          desc: "Làm quen giọng đọc & tốc độ đề Cambridge.",
          evalType: "prefix_quota",
          storageKey: "s4_listening_done",
          prefix: "listening_u4_",
          offset: 0,
          target: 30,
          defaultUrl: "ielts/listening/index.html?unit=u_4",
          unitLabel: "section"
        },
        {
          id: "m3_listen_srs_2",
          module: "listening",
          moduleLabel: "Listening SRS",
          icon: "🎧",
          title: "Thêm 800 từ Listening SRS (Tổng ≥ 1,300 từ)",
          desc: "Chủ đề 4–7: Urban, Culture, Nature & Business.",
          evalType: "srs_quota",
          storageKey: "s4_listening_srs_v1",
          offset: 500,
          target: 800,
          defaultUrl: "ielts/listening/index.html?id=listening_u5_4",
          unitLabel: "từ"
        },
        {
          id: "m3_read_passages_2",
          module: "reading",
          moduleLabel: "Reading",
          icon: "📖",
          title: "Thêm 30 bài đọc Academic song ngữ (Unit 2)",
          desc: "Đọc sâu & tìm dẫn chứng paraphrase học thuật.",
          evalType: "prefix_quota",
          storageKey: "s4_reading_done",
          prefix: "reading_u2_",
          offset: 15,
          target: 30,
          defaultUrl: "ielts/reading/index.html?unit=u_2",
          unitLabel: "bài"
        },
        {
          id: "m3_read_srs_2",
          module: "reading",
          moduleLabel: "Reading SRS",
          icon: "📖",
          title: "Thêm 1,000 từ Reading SRS (Tổng ≥ 1,600 từ)",
          desc: "Chủ đề 4–7: Business, Plants, Animals & Nature.",
          evalType: "srs_quota",
          storageKey: "s4_reading_srs_v1",
          offset: 600,
          target: 1000,
          defaultUrl: "ielts/reading/index.html?id=reading_u3_4",
          unitLabel: "từ"
        }
      ]
    },
    {
      id: "m4",
      order: 4,
      icon: "🔥",
      color: "#d97706",
      badge: "MỐC 4 • TĂNG TỐC & LUYỆN ĐỀ",
      title: "Bứt phá Practice Zone CBT, Part 3 & Chủ đề lớn Task 2",
      bandRange: "Band 6.5 → 7.5",
      baseWeeksMin: 6,
      baseWeeksMax: 8,
      goal: "Hoàn tất 1,827 từ vựng nền; luyện đề CBT Listening/Reading, Task 2 và Speaking Part 3.",
      tip: "Sau mỗi đề CBT, xem ngay video chữa câu sai và nghe thêm 2–3 bài TED Talks/tuần.",
      tasks: [
        {
          id: "m4_vocab_t16_20",
          module: "vocab",
          moduleLabel: "Từ vựng nền",
          icon: "🧠",
          title: "556 từ vựng SRS Chủ đề 16–20 (Về đích)",
          desc: "Nghệ thuật, Môi trường, Tài nguyên, Tội phạm & Truyền thông.",
          evalType: "vocab_range",
          storageKey: "s4_vocab_srs_v1",
          startIdx: 1271,
          endIdx: 1826,
          topicIndices: [15, 16, 17, 18, 19],
          basePath: "ielts/vocab/index.html",
          unitLabel: "từ"
        },
        {
          id: "m4_listen_cbt_1",
          module: "listening",
          moduleLabel: "Listening CBT",
          icon: "🎧",
          title: "Hoàn thành 10 đề Listening Practice Zone CBT",
          desc: "Thi máy Practice Zone & xem video chữa đề Unit 6.",
          evalType: "submissions_quota",
          storageKey: "lp_listening_submissions_v1",
          offset: 0,
          target: 10,
          defaultUrl: "ielts/listening/index.html?pz=1",
          unitLabel: "đề"
        },
        {
          id: "m4_listen_u4_2",
          module: "listening",
          moduleLabel: "Listening",
          icon: "🎧",
          title: "Thêm 40 section Chép chính tả đề IELTS (Unit 4)",
          desc: "Tập trung Section 3 & 4 học thuật trong Unit 4.",
          evalType: "prefix_quota",
          storageKey: "s4_listening_done",
          prefix: "listening_u4_",
          offset: 30,
          target: 40,
          defaultUrl: "ielts/listening/index.html?unit=u_4",
          unitLabel: "section"
        },
        {
          id: "m4_listen_srs_3",
          module: "listening",
          moduleLabel: "Listening SRS",
          icon: "🎧",
          title: "Hoàn tất 876 từ Listening SRS cuối (Đủ 2,176 từ)",
          desc: "Chủ đề 8–10: Education, Health, Technology & Science.",
          evalType: "srs_quota",
          storageKey: "s4_listening_srs_v1",
          offset: 1300,
          target: 876,
          defaultUrl: "ielts/listening/index.html?id=listening_u5_8",
          unitLabel: "từ"
        },
        {
          id: "m4_read_cbt_1",
          module: "reading",
          moduleLabel: "Reading CBT",
          icon: "📖",
          title: "Hoàn thành 10 đề Reading Practice Zone CBT",
          desc: "Canh 20 phút/Passage chuẩn thi máy & xem chữa Unit 4.",
          evalType: "submissions_quota",
          storageKey: "lp_reading_submissions_v1",
          offset: 0,
          target: 10,
          defaultUrl: "ielts/reading/index.html?pz=1",
          unitLabel: "đề"
        },
        {
          id: "m4_read_passages_3",
          module: "reading",
          moduleLabel: "Reading",
          icon: "📖",
          title: "Thêm 30 bài đọc Academic song ngữ (Unit 2)",
          desc: "Hoàn tất mốc 75 bài đọc Academic song ngữ Unit 2.",
          evalType: "prefix_quota",
          storageKey: "s4_reading_done",
          prefix: "reading_u2_",
          offset: 45,
          target: 30,
          defaultUrl: "ielts/reading/index.html?unit=u_2",
          unitLabel: "bài"
        },
        {
          id: "m4_read_srs_3",
          module: "reading",
          moduleLabel: "Reading SRS",
          icon: "📖",
          title: "Hoàn tất 1,369 từ Reading SRS cuối (Đủ 2,969 từ)",
          desc: "Chủ đề 8–10: Health, Psychology, Culture & Art.",
          evalType: "srs_quota",
          storageKey: "s4_reading_srs_v1",
          offset: 1600,
          target: 1369,
          defaultUrl: "ielts/reading/index.html?id=reading_u3_8",
          unitLabel: "từ"
        },
        {
          id: "m4_write_t1_more",
          module: "writing",
          moduleLabel: "Writing",
          icon: "✍️",
          title: "Thêm 20 đề Writing Task 1 (Process & Map)",
          desc: "Luyện sâu dạng Process và Map trong Unit 3.",
          evalType: "prefix_quota",
          storageKey: "s4_writing_done",
          prefix: "writing_u3_",
          offset: 15,
          target: 20,
          defaultUrl: "ielts/writing/index.html?unit=u_3",
          unitLabel: "đề"
        },
        {
          id: "m4_write_t2_topics",
          module: "writing",
          moduleLabel: "Writing",
          icon: "✍️",
          title: "20 đề Writing Task 2 theo chủ đề lớn (Unit 5)",
          desc: "Giáo dục, Môi trường, Công nghệ & Xã hội (mẫu Simon 8.0+).",
          evalType: "prefix_quota",
          storageKey: "s4_writing_done",
          prefix: "writing_u5_",
          offset: 0,
          target: 20,
          defaultUrl: "ielts/writing/index.html?unit=u_5",
          unitLabel: "đề"
        },
        {
          id: "m4_write_pz_1",
          module: "writing",
          moduleLabel: "Writing CBT",
          icon: "✍️",
          title: "Nộp 5 bài thi Writing Practice Zone bấm giờ",
          desc: "Viết Task 1 + Task 2 trong 60 phút & chấm 4 tiêu chí.",
          evalType: "submissions_quota",
          storageKey: "lp_submissions_history",
          offset: 0,
          target: 5,
          defaultUrl: "ielts/writing/index.html?pz=1",
          unitLabel: "bài"
        },
        {
          id: "m4_speak_p3_strat",
          module: "speaking",
          moduleLabel: "Speaking",
          icon: "🗣️",
          title: "9 video Chiến thuật Speaking Part 3",
          desc: "Comparing, Advantages, Why, Solutions & Opinion.",
          evalType: "id_list",
          storageKey: "lp_speaking_done_v1",
          ids: SPEAK_VID_P3_IDS,
          basePath: "ielts/speaking/index.html",
          unitLabel: "bài"
        },
        {
          id: "m4_speak_p3_prac",
          module: "speaking",
          moduleLabel: "Speaking",
          icon: "🗣️",
          title: "Thực hành 15 chủ đề Speaking Part 3 (Unit 4)",
          desc: "Thảo luận hai chiều & phát triển luận điểm (Unit 4).",
          evalType: "prefix_quota",
          storageKey: "lp_speaking_done_v1",
          prefix: "sp_p3_",
          offset: 0,
          target: 15,
          defaultUrl: "ielts/speaking/index.html?unit=u_4",
          unitLabel: "chủ đề"
        },
        {
          id: "m4_speak_vocab_1",
          module: "speaking",
          moduleLabel: "Speaking SRS",
          icon: "🗣️",
          title: "15 chủ đề Collocations & Idioms Speaking (Unit 1)",
          desc: "Vốn diễn đạt tự nhiên Band 7.0+ theo bộ Q3/2026.",
          evalType: "prefix_quota",
          storageKey: "lp_speaking_done_v1",
          prefix: "sp_v_",
          offset: 0,
          target: 15,
          defaultUrl: "ielts/speaking/index.html?unit=u_1",
          unitLabel: "chủ đề"
        },
        {
          id: "m4_ted_shadow",
          module: "tedtalks",
          moduleLabel: "TED Talks",
          icon: "🎙️",
          title: "Bổ trợ 10 bài TED Talks Song ngữ & Shadowing",
          desc: "Nghe chép & nhại giọng bản xứ tăng độ trôi chảy.",
          evalType: "prefix_quota",
          storageKey: "s4_ted_done",
          prefix: "",
          offset: 0,
          target: 10,
          defaultUrl: "tedtalks/index.html",
          unitLabel: "bài"
        }
      ]
    },
    {
      id: "m5",
      order: 5,
      icon: "🏆",
      color: "#e11d48",
      badge: "MỐC 5 • THỰC CHIẾN & BỨT PHÁ",
      title: "Nước rút Full Test CBT cả 4 kỹ năng & Duy trì SRS",
      bandRange: "Band 7.5 → 8.0+",
      baseWeeksMin: 4,
      baseWeeksMax: 4,
      goal: "Thi thử Full Test bấm giờ 4 kỹ năng, giữ độ chính xác ≥ 34–36/40 Listening/Reading.",
      tip: "Giữ sạch từ vựng SRS đến hạn mỗi ngày và luân phiên thi thử 1 đề Full Test.",
      tasks: [
        {
          id: "m5_listen_cbt_2",
          module: "listening",
          moduleLabel: "Listening CBT",
          icon: "🎧",
          title: "15 Full Tests Listening Practice Zone (Tổng 25 đề)",
          desc: "Thi thử 40 câu bấm giờ, mục tiêu ≥ 35/40.",
          evalType: "submissions_quota",
          storageKey: "lp_listening_submissions_v1",
          offset: 10,
          target: 15,
          defaultUrl: "ielts/listening/index.html?pz=1",
          unitLabel: "đề"
        },
        {
          id: "m5_read_cbt_2",
          module: "reading",
          moduleLabel: "Reading CBT",
          icon: "📖",
          title: "15 Full Tests Reading Practice Zone (Tổng 25 đề)",
          desc: "Thi thử 60 phút 3 Passages liên tục.",
          evalType: "submissions_quota",
          storageKey: "lp_reading_submissions_v1",
          offset: 10,
          target: 15,
          defaultUrl: "ielts/reading/index.html?pz=1",
          unitLabel: "đề"
        },
        {
          id: "m5_write_cam3",
          module: "writing",
          moduleLabel: "Writing CBT",
          icon: "✍️",
          title: "3 bộ đề chuẩn Cambridge (Unit 6)",
          desc: "3 đề thi thử Cambridge kèm bài mẫu phân tích.",
          evalType: "id_list",
          storageKey: "s4_writing_done",
          ids: { prefix: "writing_pz_", start: 1, end: 3 },
          basePath: "ielts/writing/index.html",
          unitLabel: "bộ đề"
        },
        {
          id: "m5_write_pz_2",
          module: "writing",
          moduleLabel: "Writing CBT",
          icon: "✍️",
          title: "Thêm 10 bài thi Writing Practice Zone (Tổng 15 bài)",
          desc: "Viết full 60 phút từ kho 1,183 đề thi thật.",
          evalType: "submissions_quota",
          storageKey: "lp_submissions_history",
          offset: 5,
          target: 10,
          defaultUrl: "ielts/writing/index.html?pz=1",
          unitLabel: "bài"
        },
        {
          id: "m5_speak_pz",
          module: "speaking",
          moduleLabel: "Speaking CBT",
          icon: "🗣️",
          title: "10 Mock Exams Full (Warm-up + Part 1–2–3)",
          desc: "Thi thử với Giám khảo ảo/AI (1,084 bộ đề thực chiến).",
          evalType: "submissions_quota",
          storageKey: "lp_speaking_submissions_v1",
          offset: 0,
          target: 10,
          defaultUrl: "ielts/speaking/index.html?pz=1",
          unitLabel: "đề"
        },
        {
          id: "m5_speak_vocab_2",
          module: "speaking",
          moduleLabel: "Speaking SRS",
          icon: "🗣️",
          title: "Củng cố thêm 20 chủ đề Collocations & Idioms",
          desc: "Mở rộng từ vựng Speaking theo chủ đề mới nhất (Unit 1).",
          evalType: "prefix_quota",
          storageKey: "lp_speaking_done_v1",
          prefix: "sp_v_",
          offset: 15,
          target: 20,
          defaultUrl: "ielts/speaking/index.html?unit=u_1",
          unitLabel: "chủ đề"
        },
        {
          id: "m5_srs_daily",
          module: "vocab",
          moduleLabel: "Ôn tập SRS",
          icon: "🔔",
          title: "Giữ sạch từ vựng SRS đến hạn hôm nay",
          desc: "Ôn tập SRS hàng ngày để giữ vững trí nhớ dài hạn.",
          evalType: "due_review",
          defaultUrl: "ielts/vocab/index.html?topic=ALL_DUE",
          unitLabel: "trạng thái"
        }
      ]
    }
  ];

  var data = {
    STORAGE_KEY: STORAGE_KEY,
    START_LEVELS: START_LEVELS,
    PACES: PACES,
    VOCAB_TOPICS: VOCAB_TOPICS,
    STAGES: STAGES
  };

  if (typeof window !== "undefined") window.LP_IELTS_ROADMAP_DATA = data;
  if (typeof module !== "undefined" && module.exports) module.exports = data;
})(typeof window !== "undefined" ? window : globalThis);

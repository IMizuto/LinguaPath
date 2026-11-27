/* LinguaPath TOEIC Reading Manifest — Danh mục 42 bộ Luyện Đọc TOEIC Part 5–7 (4 Chặng • 0–990)
 * Tổng chính xác: 42 bộ đọc • 264 câu hỏi (nạp lười từng bộ từ data/drills/*.json)
 */
(function (root) {
  "use strict";

  var manifest = {
    "version": 1,
    "totalLessons": 42,
    "totalQuestions": 264,
    "levels": [
      {
        "level": 1,
        "id": "lv1",
        "range": "0–350",
        "title": "Part 5 • Phản xạ Câu đơn 5 giây",
        "lessonCount": 6,
        "questionCount": 48
      },
      {
        "level": 2,
        "id": "lv2",
        "range": "350–550",
        "title": "Part 6 Điền đoạn văn & Part 7 Đoạn đơn",
        "lessonCount": 14,
        "questionCount": 106
      },
      {
        "level": 3,
        "id": "lv3",
        "range": "550–750",
        "title": "Part 7 • Đoạn kép (Double Passages)",
        "lessonCount": 10,
        "questionCount": 50
      },
      {
        "level": 4,
        "id": "lv4",
        "range": "750–990",
        "title": "Part 7 • Đoạn ba (Triple Passages) & Suy luận",
        "lessonCount": 12,
        "questionCount": 60
      }
    ],
    "parts": [
      {
        "id": "part5",
        "label": "Part 5 • Câu đơn",
        "lessonCount": 6,
        "questionCount": 48
      },
      {
        "id": "part6",
        "label": "Part 6 • Điền đoạn văn",
        "lessonCount": 8,
        "questionCount": 64
      },
      {
        "id": "part7s",
        "label": "Part 7 • Đoạn đơn",
        "lessonCount": 6,
        "questionCount": 42
      },
      {
        "id": "part7d",
        "label": "Part 7 • Đoạn kép",
        "lessonCount": 10,
        "questionCount": 50
      },
      {
        "id": "part7t",
        "label": "Part 7 • Đoạn ba",
        "lessonCount": 12,
        "questionCount": 60
      }
    ],
    "lessons": [
      {
        "id": "tr_p5_01",
        "order": 1,
        "level": 1,
        "part": "part5",
        "partLabel": "Part 5 • Câu đơn",
        "title": "Part 5 • Bộ 01: Phản xạ Từ loại 5 giây (Word Form)",
        "subtitle": "Nhận diện nhanh Danh – Động – Tính – Trạng từ dựa vào mạo từ, sở hữu cách và hậu tố.",
        "timeLimitMin": 4,
        "questionCount": 8,
        "passageCount": 0,
        "genres": [],
        "file": "data/drills/tr_p5_01.json"
      },
      {
        "id": "tr_p5_02",
        "order": 2,
        "level": 1,
        "part": "part5",
        "partLabel": "Part 5 • Câu đơn",
        "title": "Part 5 • Bộ 02: Đại từ & Hòa hợp Chủ–Vị",
        "subtitle": "Chinh phục bảng đại từ nhân xưng/sở hữu/phản thân và quy tắc chia động từ số ít – số nhiều.",
        "timeLimitMin": 4,
        "questionCount": 8,
        "passageCount": 0,
        "genres": [],
        "file": "data/drills/tr_p5_02.json"
      },
      {
        "id": "tr_p5_03",
        "order": 3,
        "level": 1,
        "part": "part5",
        "partLabel": "Part 5 • Câu đơn",
        "title": "Part 5 • Bộ 03: Thì Động từ, Bị động & Phân từ",
        "subtitle": "Xử lý chuẩn xác dấu hiệu thời gian (since, by the time, last), câu bị động và rút gọn phân từ.",
        "timeLimitMin": 4,
        "questionCount": 8,
        "passageCount": 0,
        "genres": [],
        "file": "data/drills/tr_p5_03.json"
      },
      {
        "id": "tr_p5_04",
        "order": 4,
        "level": 1,
        "part": "part5",
        "partLabel": "Part 5 • Câu đơn",
        "title": "Part 5 • Bộ 04: Giới từ & Liên từ kinh điển TOEIC",
        "subtitle": "Phân biệt nhanh cặp bẫy Despite/Although, During/While, Because of/Because và By/Until.",
        "timeLimitMin": 4,
        "questionCount": 8,
        "passageCount": 0,
        "genres": [],
        "file": "data/drills/tr_p5_04.json"
      },
      {
        "id": "tr_p5_05",
        "order": 5,
        "level": 1,
        "part": "part5",
        "partLabel": "Part 5 • Câu đơn",
        "title": "Part 5 • Bộ 05: Từ vựng Văn phòng, Hợp đồng & Nhân sự",
        "subtitle": "Luyện 8 cụm từ thương mại tần suất cao nhất Part 5 (comply with, eligible, reimburse, allocate...).",
        "timeLimitMin": 4,
        "questionCount": 8,
        "passageCount": 0,
        "genres": [],
        "file": "data/drills/tr_p5_05.json"
      },
      {
        "id": "tr_p5_06",
        "order": 6,
        "level": 1,
        "part": "part5",
        "partLabel": "Part 5 • Câu đơn",
        "title": "Part 5 • Bộ 06: Tổng hợp Bẫy Part 5 chuẩn ETS",
        "subtitle": "Tránh các bẫy kinh điển: Mệnh đề quan hệ, To-V/V-ing, Cặp từ dễ nhầm, Liên từ tương quan & Giả định.",
        "timeLimitMin": 4,
        "questionCount": 8,
        "passageCount": 0,
        "genres": [],
        "file": "data/drills/tr_p5_06.json"
      },
      {
        "id": "tr_p6_01",
        "order": 7,
        "level": 2,
        "part": "part6",
        "partLabel": "Part 6 • Điền đoạn văn",
        "title": "Part 6 • Bộ 01: Đăng ký Phúc lợi Nhân sự & Bảo trì Thang máy",
        "subtitle": "Luyện 2 văn bản quen thuộc nhất công sở (Email nhân sự & Thông báo tòa nhà) kèm 2 câu Điền câu.",
        "timeLimitMin": 8,
        "questionCount": 8,
        "passageCount": 2,
        "genres": [
          "email",
          "notice"
        ],
        "file": "data/drills/tr_p6_01.json"
      },
      {
        "id": "tr_p6_02",
        "order": 8,
        "level": 2,
        "part": "part6",
        "partLabel": "Part 6 • Điền đoạn văn",
        "title": "Part 6 • Bộ 02: Chính sách Công tác phí & Không gian Coworking",
        "subtitle": "Kết hợp Thông báo nội bộ (Memo) tài chính và Quảng cáo (Ad) không gian làm việc chung.",
        "timeLimitMin": 8,
        "questionCount": 8,
        "passageCount": 2,
        "genres": [
          "memo",
          "ad"
        ],
        "file": "data/drills/tr_p6_02.json"
      },
      {
        "id": "tr_p6_03",
        "order": 9,
        "level": 2,
        "part": "part6",
        "partLabel": "Part 6 • Điền đoạn văn",
        "title": "Part 6 • Bộ 03: Thư Tri ân Đối tác & Tin khai trương Kho vận",
        "subtitle": "Thực chiến dạng Thư thương mại (Letter) và Bài báo kinh doanh (Article) chuẩn đề thi ETS.",
        "timeLimitMin": 8,
        "questionCount": 8,
        "passageCount": 2,
        "genres": [
          "letter",
          "article"
        ],
        "file": "data/drills/tr_p6_03.json"
      },
      {
        "id": "tr_p6_04",
        "order": 10,
        "level": 2,
        "part": "part6",
        "partLabel": "Part 6 • Điền đoạn văn",
        "title": "Part 6 • Bộ 04: Đổi Lịch Tập huấn CNTT & Giờ Mở cửa Thư viện",
        "subtitle": "Luyện kỹ năng xử lý thông báo dời lịch họp/đào tạo (Email) và thông báo cộng đồng (Notice).",
        "timeLimitMin": 8,
        "questionCount": 8,
        "passageCount": 2,
        "genres": [
          "email",
          "notice"
        ],
        "file": "data/drills/tr_p6_04.json"
      },
      {
        "id": "tr_p6_05",
        "order": 11,
        "level": 2,
        "part": "part6",
        "partLabel": "Part 6 • Điền đoạn văn",
        "title": "Part 6 • Bộ 05: Tuyển dụng Nội bộ & Bảo hành Thiết bị",
        "subtitle": "Luyện văn phong tuyển dụng nhân sự (Memo) và thư phản hồi bảo hành khách hàng (Letter).",
        "timeLimitMin": 8,
        "questionCount": 8,
        "passageCount": 2,
        "genres": [
          "memo",
          "letter"
        ],
        "file": "data/drills/tr_p6_05.json"
      },
      {
        "id": "tr_p6_06",
        "order": 12,
        "level": 2,
        "part": "part6",
        "partLabel": "Part 6 • Điền đoạn văn",
        "title": "Part 6 • Bộ 06: Xác nhận Tiệc Hội nghị & Dịch vụ Lưu trữ Đám mây",
        "subtitle": "Kết hợp Email điều phối sự kiện (Catering) và Quảng cáo phần mềm doanh nghiệp (SaaS Ad).",
        "timeLimitMin": 8,
        "questionCount": 8,
        "passageCount": 2,
        "genres": [
          "email",
          "ad"
        ],
        "file": "data/drills/tr_p6_06.json"
      },
      {
        "id": "tr_p6_07",
        "order": 13,
        "level": 2,
        "part": "part6",
        "partLabel": "Part 6 • Điền đoạn văn",
        "title": "Part 6 • Bộ 07: Cải tạo Căn-tin Công ty & Xe buýt Điện Đô thị",
        "subtitle": "Luyện thông báo cải tạo cơ sở vật chất (Notice) và bài báo giao thông xanh (Article).",
        "timeLimitMin": 8,
        "questionCount": 8,
        "passageCount": 2,
        "genres": [
          "notice",
          "article"
        ],
        "file": "data/drills/tr_p6_07.json"
      },
      {
        "id": "tr_p6_08",
        "order": 14,
        "level": 2,
        "part": "part6",
        "partLabel": "Part 6 • Điền đoạn văn",
        "title": "Part 6 • Bộ 08: Thư Mời Diễn giả & Kiểm kê Kho Cuối năm",
        "subtitle": "Hoàn thiện kỹ năng Part 6 với Thư mời trang trọng (Letter) và Memo điều phối kho vận (Memo).",
        "timeLimitMin": 8,
        "questionCount": 8,
        "passageCount": 2,
        "genres": [
          "letter",
          "memo"
        ],
        "file": "data/drills/tr_p6_08.json"
      },
      {
        "id": "tr_p7s_01",
        "order": 15,
        "level": 2,
        "part": "part7s",
        "partLabel": "Part 7 • Đoạn đơn",
        "title": "Part 7 Đơn • Bộ 01: Email Sửa Đơn hàng & Chat Chuẩn bị Demo",
        "subtitle": "Luyện kỹ năng đọc nhanh Email thương mại và chuỗi tin nhắn Chat nhóm (Text Message Chain) chuẩn ETS.",
        "timeLimitMin": 10,
        "questionCount": 7,
        "passageCount": 2,
        "genres": [
          "email",
          "chat"
        ],
        "file": "data/drills/tr_p7s_01.json"
      },
      {
        "id": "tr_p7s_02",
        "order": 16,
        "level": 2,
        "part": "part7s",
        "partLabel": "Part 7 • Đoạn đơn",
        "title": "Part 7 Đơn • Bộ 02: Chính sách Làm việc Hybrid & Bảng Lịch Đào tạo",
        "subtitle": "Luyện đối chiếu thông tin Memo nhân sự và đọc bảng lịch trình kèm ghi chú chân trang (Table).",
        "timeLimitMin": 10,
        "questionCount": 7,
        "passageCount": 2,
        "genres": [
          "memo",
          "table"
        ],
        "file": "data/drills/tr_p7s_02.json"
      },
      {
        "id": "tr_p7s_03",
        "order": 17,
        "level": 2,
        "part": "part7s",
        "partLabel": "Part 7 • Đoạn đơn",
        "title": "Part 7 Đơn • Bộ 03: Tin Tuyển dụng Robotics & Bài báo Mở rộng Thương hiệu",
        "subtitle": "Rèn kỹ năng quét chi tiết Quảng cáo tuyển dụng (Ad) và xử lý câu Từ vựng ngữ cảnh trong Bài báo (Article).",
        "timeLimitMin": 10,
        "questionCount": 7,
        "passageCount": 2,
        "genres": [
          "ad",
          "article"
        ],
        "file": "data/drills/tr_p7s_03.json"
      },
      {
        "id": "tr_p7s_04",
        "order": 18,
        "level": 2,
        "part": "part7s",
        "partLabel": "Part 7 • Đoạn đơn",
        "title": "Part 7 Đơn • Bộ 04: Thư Xin lỗi Khách hàng & Bảng Cước Chuyển phát",
        "subtitle": "Thực hành xử lý Thư bồi thường dịch vụ (Letter) và Bảng cước vận chuyển nhiều điều kiện (Table).",
        "timeLimitMin": 10,
        "questionCount": 7,
        "passageCount": 2,
        "genres": [
          "letter",
          "table"
        ],
        "file": "data/drills/tr_p7s_04.json"
      },
      {
        "id": "tr_p7s_05",
        "order": 19,
        "level": 2,
        "part": "part7s",
        "partLabel": "Part 7 • Đoạn đơn",
        "title": "Part 7 Đơn • Bộ 05: Chat Hỗ trợ Khách sạn & Thông báo Cải tạo Vườn Bách thảo",
        "subtitle": "Thực chiến tin nhắn dịch vụ khách sạn (Chat) và thông báo tham quan công cộng (Notice).",
        "timeLimitMin": 10,
        "questionCount": 7,
        "passageCount": 2,
        "genres": [
          "chat",
          "notice"
        ],
        "file": "data/drills/tr_p7s_05.json"
      },
      {
        "id": "tr_p7s_06",
        "order": 20,
        "level": 2,
        "part": "part7s",
        "partLabel": "Part 7 • Đoạn đơn",
        "title": "Part 7 Đơn • Bộ 06: Hướng dẫn Gian hàng Triển lãm & Phà Năng lượng Mặt trời",
        "subtitle": "Tổng ôn Part 7 Đoạn đơn với Email điều phối triển lãm thương mại và Bài báo công nghệ xanh.",
        "timeLimitMin": 10,
        "questionCount": 7,
        "passageCount": 2,
        "genres": [
          "email",
          "article"
        ],
        "file": "data/drills/tr_p7s_06.json"
      },
      {
        "id": "tr_p7d_01",
        "order": 21,
        "level": 3,
        "part": "part7d",
        "partLabel": "Part 7 • Đoạn kép",
        "title": "Part 7 Kép • Bộ 01: Email khiếu nại & Hóa đơn thiết bị",
        "subtitle": "Đối chiếu Email báo thiếu hàng với bảng Hóa đơn để xác định mã sản phẩm và mức chiết khấu doanh nghiệp.",
        "timeLimitMin": 10,
        "questionCount": 5,
        "passageCount": 2,
        "genres": [
          "email",
          "table"
        ],
        "file": "data/drills/tr_p7d_01.json"
      },
      {
        "id": "tr_p7d_02",
        "order": 22,
        "level": 3,
        "part": "part7d",
        "partLabel": "Part 7 • Đoạn kép",
        "title": "Part 7 Kép • Bộ 02: Tin tuyển dụng & Email đổi lịch phỏng vấn",
        "subtitle": "Nối thông tin giữa mô tả công việc tại Harborline Logistics và thư phản hồi của ứng viên Mateo Silva.",
        "timeLimitMin": 10,
        "questionCount": 5,
        "passageCount": 2,
        "genres": [
          "ad",
          "email"
        ],
        "file": "data/drills/tr_p7d_02.json"
      },
      {
        "id": "tr_p7d_03",
        "order": 23,
        "level": 3,
        "part": "part7d",
        "partLabel": "Part 7 • Đoạn kép",
        "title": "Part 7 Kép • Bộ 03: Lịch Hội nghị & Email điều chỉnh phòng",
        "subtitle": "Kết hợp Bảng chương trình GreenTech Summit với Email cập nhật thay đổi địa điểm và thời lượng diễn giả.",
        "timeLimitMin": 10,
        "questionCount": 5,
        "passageCount": 2,
        "genres": [
          "table",
          "email"
        ],
        "file": "data/drills/tr_p7d_03.json"
      },
      {
        "id": "tr_p7d_04",
        "order": 24,
        "level": 3,
        "part": "part7d",
        "partLabel": "Part 7 • Đoạn kép",
        "title": "Part 7 Kép • Bộ 04: Trang sản phẩm & Đánh giá khách hàng",
        "subtitle": "Đối chiếu thông số, phụ kiện đi kèm của máy pha cà phê BrewMaster Pro-X với trải nghiệm thực tế của chủ quán.",
        "timeLimitMin": 10,
        "questionCount": 5,
        "passageCount": 2,
        "genres": [
          "ad",
          "review"
        ],
        "file": "data/drills/tr_p7d_04.json"
      },
      {
        "id": "tr_p7d_05",
        "order": 25,
        "level": 3,
        "part": "part7d",
        "partLabel": "Part 7 • Đoạn kép",
        "title": "Part 7 Kép • Bộ 05: Thư khiếu nại tiệc & Phản hồi CSKH",
        "subtitle": "Kết nối thư phản ánh sự cố dịch vụ tiệc hội nghị với email bồi hoàn chi phí và đề xuất ưu đãi sự kiện kế tiếp.",
        "timeLimitMin": 10,
        "questionCount": 5,
        "passageCount": 2,
        "genres": [
          "letter",
          "email"
        ],
        "file": "data/drills/tr_p7d_05.json"
      },
      {
        "id": "tr_p7d_06",
        "order": 26,
        "level": 3,
        "part": "part7d",
        "partLabel": "Part 7 • Đoạn kép",
        "title": "Part 7 Kép • Bộ 06: Chat nhóm IT & Memo bảo trì hệ thống",
        "subtitle": "Liên kết tin nhắn nội bộ nhóm kỹ thuật với thông báo toàn công ty về lịch nâng cấp máy chủ và nghỉ bù.",
        "timeLimitMin": 10,
        "questionCount": 5,
        "passageCount": 2,
        "genres": [
          "chat",
          "memo"
        ],
        "file": "data/drills/tr_p7d_06.json"
      },
      {
        "id": "tr_p7d_07",
        "order": 27,
        "level": 3,
        "part": "part7d",
        "partLabel": "Part 7 • Đoạn kép",
        "title": "Part 7 Kép • Bộ 07: Thông báo bãi xe tòa nhà & Email đổi gói",
        "subtitle": "Nối quy định hệ thống nhận diện biển số mới tại Meridian Plaza với yêu cầu nâng cấp thẻ sạc xe điện của nhân viên.",
        "timeLimitMin": 10,
        "questionCount": 5,
        "passageCount": 2,
        "genres": [
          "notice",
          "email"
        ],
        "file": "data/drills/tr_p7d_07.json"
      },
      {
        "id": "tr_p7d_08",
        "order": 28,
        "level": 3,
        "part": "part7d",
        "partLabel": "Part 7 • Đoạn kép",
        "title": "Part 7 Kép • Bộ 08: Bài báo giao thông & Thư gửi tòa soạn",
        "subtitle": "Phân tích dự án tuyến xe buýt nhanh khu công nghiệp Riverbend và phản hồi của Hiệp hội Doanh nghiệp địa phương.",
        "timeLimitMin": 10,
        "questionCount": 5,
        "passageCount": 2,
        "genres": [
          "article",
          "letter"
        ],
        "file": "data/drills/tr_p7d_08.json"
      },
      {
        "id": "tr_p7d_09",
        "order": 29,
        "level": 3,
        "part": "part7d",
        "partLabel": "Part 7 • Đoạn kép",
        "title": "Part 7 Kép • Bộ 09: Bảng gói tiệc khách sạn & Email đặt sự kiện",
        "subtitle": "Đối chiếu quy mô khách, loại hình tiệc và phụ phí thực đơn đặc biệt giữa bảng giá Grand Oak Hotel và yêu cầu đặt tiệc.",
        "timeLimitMin": 10,
        "questionCount": 5,
        "passageCount": 2,
        "genres": [
          "table",
          "email"
        ],
        "file": "data/drills/tr_p7d_09.json"
      },
      {
        "id": "tr_p7d_10",
        "order": 30,
        "level": 3,
        "part": "part7d",
        "partLabel": "Part 7 • Đoạn kép",
        "title": "Part 7 Kép • Bộ 10: Quy định công tác phí & Email giải trình",
        "subtitle": "Đối chiếu hạn mức lưu trú theo nhóm thành phố (Tier-1) và thời hạn nộp chứng từ điện tử trên hồ sơ công tác Chicago.",
        "timeLimitMin": 10,
        "questionCount": 5,
        "passageCount": 2,
        "genres": [
          "memo",
          "email"
        ],
        "file": "data/drills/tr_p7d_10.json"
      },
      {
        "id": "tr_p7t_01",
        "order": 31,
        "level": 4,
        "part": "part7t",
        "partLabel": "Part 7 • Đoạn ba",
        "title": "Part 7 Ba • Bộ 01: Giải thưởng Kiến trúc Xanh, Email đổi giờ & Lịch hội thảo",
        "subtitle": "Nối chéo bài báo công bố giải thưởng, email điều chỉnh diễn giả và bảng lịch trình hội thảo tại Vancouver.",
        "timeLimitMin": 12,
        "questionCount": 5,
        "passageCount": 3,
        "genres": [
          "article",
          "email",
          "table"
        ],
        "file": "data/drills/tr_p7t_01.json"
      },
      {
        "id": "tr_p7t_02",
        "order": 32,
        "level": 4,
        "part": "part7t",
        "partLabel": "Part 7 • Đoạn ba",
        "title": "Part 7 Ba • Bộ 02: Chính sách hội viên, Hóa đơn phòng Lab & Email khiếu nại",
        "subtitle": "Tính toán chênh lệch chiết khấu hai bậc (12% vs 5%), phí vận chuyển lạnh và bảo hành thiết bị lỗi qua 3 văn bản.",
        "timeLimitMin": 12,
        "questionCount": 5,
        "passageCount": 3,
        "genres": [
          "ad",
          "table",
          "email"
        ],
        "file": "data/drills/tr_p7t_02.json"
      },
      {
        "id": "tr_p7t_03",
        "order": 33,
        "level": 4,
        "part": "part7t",
        "partLabel": "Part 7 • Đoạn ba",
        "title": "Part 7 Ba • Bộ 03: Quy trình tuyển dụng, Lịch phỏng vấn & Email hoán đổi ca",
        "subtitle": "Xác định ứng viên bị trễ chuyến bay, người đổi lịch và quyền lợi thanh toán vé máy bay qua 3 văn bản nhân sự.",
        "timeLimitMin": 12,
        "questionCount": 5,
        "passageCount": 3,
        "genres": [
          "notice",
          "table",
          "email"
        ],
        "file": "data/drills/tr_p7t_03.json"
      },
      {
        "id": "tr_p7t_04",
        "order": 34,
        "level": 4,
        "part": "part7t",
        "partLabel": "Part 7 • Đoạn ba",
        "title": "Part 7 Ba • Bộ 04: Bài báo khai trương Resort, Đánh giá khách & Email Giám đốc",
        "subtitle": "Kết nối tin khai trương chuỗi khách sạn sinh thái Solis Suites với phản hồi 3 sao và chỉ đạo khắc phục nội bộ.",
        "timeLimitMin": 12,
        "questionCount": 5,
        "passageCount": 3,
        "genres": [
          "article",
          "review",
          "email"
        ],
        "file": "data/drills/tr_p7t_04.json"
      },
      {
        "id": "tr_p7t_05",
        "order": 35,
        "level": 4,
        "part": "part7t",
        "partLabel": "Part 7 • Đoạn ba",
        "title": "Part 7 Ba • Bộ 05: Memo đào tạo An ninh mạng, Bảng lớp học & Chat nhóm",
        "subtitle": "Xác định lộ trình bắt buộc (Foundation vs Refresher) dựa trên thâm niên, điểm kiểm tra năm ngoái và lịch công tác.",
        "timeLimitMin": 12,
        "questionCount": 5,
        "passageCount": 3,
        "genres": [
          "memo",
          "table",
          "chat"
        ],
        "file": "data/drills/tr_p7t_05.json"
      },
      {
        "id": "tr_p7t_06",
        "order": 36,
        "level": 4,
        "part": "part7t",
        "partLabel": "Part 7 • Đoạn ba",
        "title": "Part 7 Ba • Bộ 06: Bảng giá in ấn, Email đặt hàng triển lãm & Hóa đơn sai phí",
        "subtitle": "Kiểm tra điều kiện áp mã khuyến mãi EXPO15, ngưỡng miễn phí ship $1,000 và khoản phụ thu in gấp bị tính nhầm.",
        "timeLimitMin": 12,
        "questionCount": 5,
        "passageCount": 3,
        "genres": [
          "ad",
          "email",
          "table"
        ],
        "file": "data/drills/tr_p7t_06.json"
      },
      {
        "id": "tr_p7t_07",
        "order": 37,
        "level": 4,
        "part": "part7t",
        "partLabel": "Part 7 • Đoạn ba",
        "title": "Part 7 Ba • Bộ 07: Lịch bảo trì tòa nhà, Danh bạ tầng & Email làm việc từ xa",
        "subtitle": "Đối chiếu phân khu tầng bảo trì điều hòa/thang máy của Apex Tower với bảng danh bạ công ty thuê và email công ty luật.",
        "timeLimitMin": 12,
        "questionCount": 5,
        "passageCount": 3,
        "genres": [
          "notice",
          "table",
          "email"
        ],
        "file": "data/drills/tr_p7t_07.json"
      },
      {
        "id": "tr_p7t_08",
        "order": 38,
        "level": 4,
        "part": "part7t",
        "partLabel": "Part 7 • Đoạn ba",
        "title": "Part 7 Ba • Bộ 08: Bài báo ẩm thực, Bảng gói tiệc & Email đặt tiệc kỷ niệm",
        "subtitle": "Kết hợp thông tin phòng riêng từ bài báo, phép tính ngân sách kèm 20% phí dịch vụ trên bảng giá và yêu cầu đặt bàn.",
        "timeLimitMin": 12,
        "questionCount": 5,
        "passageCount": 3,
        "genres": [
          "article",
          "table",
          "email"
        ],
        "file": "data/drills/tr_p7t_08.json"
      },
      {
        "id": "tr_p7t_09",
        "order": 39,
        "level": 4,
        "part": "part7t",
        "partLabel": "Part 7 • Đoạn ba",
        "title": "Part 7 Ba • Bộ 09: Thư mời tài trợ, Bảng quyền lợi gói & Email xác nhận",
        "subtitle": "Phân tích ưu đãi đăng ký sớm 10%, quy định treo băng-rôn trên cao và tổng số vé VIP của TerraDrone Robotics.",
        "timeLimitMin": 12,
        "questionCount": 5,
        "passageCount": 3,
        "genres": [
          "letter",
          "table",
          "email"
        ],
        "file": "data/drills/tr_p7t_09.json"
      },
      {
        "id": "tr_p7t_10",
        "order": 40,
        "level": 4,
        "part": "part7t",
        "partLabel": "Part 7 • Đoạn ba",
        "title": "Part 7 Ba • Bộ 10: Nâng cấp thẻ hội viên đường sắt, Đánh giá App & Email kỹ thuật",
        "subtitle": "Giải mã lỗi phân hạng sai từ Platinum xuống Silver khiến tài khoản bị cộng thiếu điểm và mất nút nâng hạng ghế.",
        "timeLimitMin": 12,
        "questionCount": 5,
        "passageCount": 3,
        "genres": [
          "notice",
          "review",
          "email"
        ],
        "file": "data/drills/tr_p7t_10.json"
      },
      {
        "id": "tr_p7t_11",
        "order": 41,
        "level": 4,
        "part": "part7t",
        "partLabel": "Part 7 • Đoạn ba",
        "title": "Part 7 Ba • Bộ 11: Tiêu chí chuyển văn phòng, Bảng đấu thầu & Email chốt nhà thầu",
        "subtitle": "Sàng lọc 4 báo giá chuyển trụ sở công ty phần mềm CloudBridge theo 4 tiêu chí bắt buộc về ngân sách, cuối tuần và bảo hiểm IT.",
        "timeLimitMin": 12,
        "questionCount": 5,
        "passageCount": 3,
        "genres": [
          "memo",
          "table",
          "email"
        ],
        "file": "data/drills/tr_p7t_11.json"
      },
      {
        "id": "tr_p7t_12",
        "order": 42,
        "level": 4,
        "part": "part7t",
        "partLabel": "Part 7 • Đoạn ba",
        "title": "Part 7 Ba • Bộ 12: Bài báo tài chính, Báo cáo doanh thu Quý 2 & Email CFO",
        "subtitle": "Tổng hợp phân tích thương vụ sáp nhập SunPeak, biên lợi nhuận 4 khu vực châu Á – TBD và kế hoạch phân bổ vốn Quý 3.",
        "timeLimitMin": 12,
        "questionCount": 5,
        "passageCount": 3,
        "genres": [
          "article",
          "table",
          "email"
        ],
        "file": "data/drills/tr_p7t_12.json"
      }
    ]
  };

  if (typeof window !== "undefined") window.LP_TOEIC_READING_MANIFEST = manifest;
  if (typeof module !== "undefined" && module.exports) module.exports = manifest;
})(typeof window !== "undefined" ? window : globalThis);

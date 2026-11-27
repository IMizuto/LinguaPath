/**
 * LinguaPath — IELTS Listening Strategy & Distractors Toolkit (Sidecar)
 * Chắt lọc từ Prep Listening Chuyên Sâu & Ebook Listening IELTS Nguyễn Huyền.
 */
(function (global) {
  "use strict";

  global.LP_LISTENING_TOOLKIT = {
    title: "Cẩm nang Chiến thuật IELTS Listening",
    subtitle: "Dự đoán trước khi nghe, né 7 bẫy tự sửa (Distractors), định vị Map & khóa chặt chính tả",
    badge: "4 Nhóm Bí Kíp",
    accentIcon: "listening",
    tabs: [
      {
        id: "parts",
        label: "4 Parts & Dự Đoán",
        summary: "IELTS Listening chỉ cho nghe MỘT LẦN DUY NHẤT. Bí quyết đạt 7.5–9.0 nằm ở 30 giây chuẩn bị trước khi băng chạy: bạn đoán được trước 70% dạng đáp án cần bắt.",
        cards: [
          {
            title: "Tận dụng 30 giây vàng đọc đề (Trước khi nghe)",
            badge: "Quy trình",
            items: [
              { label: "1. Khoá giới hạn từ", text: "Gạch chân đậm 'ONE WORD AND/OR A NUMBER' hay 'TWO WORDS' ngay lập tức để không viết thừa từ lúc vội." },
              { label: "2. Xác định loại đáp án", text: "Nhìn chữ đứng trước/sau chỗ trống để đoán: Tên riêng (viết hoa), Số tiền/Năm, Danh từ số nhiều, Tính từ, hay V-ing." },
              { label: "3. Gạch từ khóa mỏ neo", text: "Ưu tiên tên riêng, ngày tháng, địa danh làm cột mốc thời gian để biết băng đang chạy tới câu số mấy nếu lỡ sẩy nhịp." },
              { label: "4. Mất 1 câu → bỏ ngay", text: "Không bao giờ dừng lại ngẫm nghĩ quá 3 giây khi trôi qua 1 câu; chuyển mắt ngay xuống từ khóa mỏ neo của câu kế tiếp để tránh hỏng cả dây." }
            ]
          },
          {
            title: "Đặc thù độ khó & chiến thuật 4 Parts",
            badge: "Part 1 → 4",
            items: [
              { label: "Part 1 (Đời sống)", text: "Hội thoại 2 người đặt phòng/đăng ký dịch vụ. Dễ mất điểm vì bẫy đánh vần tên, số điện thoại, giá tiền đổi lại & ngày tháng." },
              { label: "Part 2 (Độc thoại)", text: "Thường có Map/Plan Labelling hoặc Matching/MCQ. Tập trung cao độ xác định 'điểm bắt đầu' trên bản đồ trước khi băng vào ý chính." },
              { label: "Part 3 (Thảo luận)", text: "2–3 sinh viên & giảng viên bàn đồ án. Bẫy nặng nhất là người A đề xuất ý, nhưng người B phản đối hoặc cả hai đổi quyết định cuối câu." },
              { label: "Part 4 (Bài giảng)", text: "Đọc liền 10 câu (31–40) không có quãng nghỉ giữa chừng! Bắt buộc bám theo Signposting Words và từ khóa bao quát để giữ nhịp." }
            ]
          }
        ]
      },
      {
        id: "distractors",
        label: "Bẫy Distractors & Tín Hiệu",
        summary: "Người ra đề cố tình đọc đáp án giả (nhiễu) trước rồi mới sửa lại ở vế sau. Nhận diện đúng tín hiệu chuyển hướng là chìa khóa tránh mất điểm oan.",
        table: {
          title: "7 bẫy tự sửa (Distractors) kinh điển trong bài nghe IELTS",
          headers: ["Loại bẫy", "Cụm từ 'quay xe' thường nghe", "Ví dụ thực chiến (Nghe → Chốt)"],
          rows: [
            ["Đổi ý trực tiếp", "Sorry, I meant... / Wait, no... / Actually... / Oh, hold on", "\"It's $45 — oh sorry, that was last month's fee, it's $52 now.\" → Chọn 52."],
            ["Quá khứ vs. Hiện tại", "Used to / Originally / Previously / At first ... but now", "\"Originally it was held in Room 12, however we moved to Hall B.\" → Chọn Hall B."],
            ["Phủ định ẩn", "Hardly / Rarely / Scarcely / Instead of / Rather than / Avoid", "\"Rather than taking the train, students prefer cycling.\" → Chọn cycling."],
            ["Bẫy Part 3 chưa chốt", "Sounds good, but... / I'm not sure... / Let's leave that out", "Sinh viên A khen idea X, B bảo thiếu thời gian → X bị loại! Chỉ chọn phương án cả 2 đồng thuận."],
            ["Sửa chính tả tên/số", "That's S-M-Y-T-H — no wait, with an 'I' / No, not thirteen...", "Phải chờ đến hết nhịp đánh vần hoặc nhắc lại lần 2 mới chốt đáp án."],
            ["Điều kiện chưa xảy ra", "Unless / Supposed to / Was planning to / Hopefully next year", "Việc 'dự kiến năm sau mới mở' không phải tiện ích hiện đang có của khu du lịch."],
            ["Đồng nghĩa bẫy MCQ", "Nghe nguyên văn 1 từ trong Option A, nhưng nghĩa lại sai hoàn toàn", "Audio đọc y hệt từ của Option A ở ngữ cảnh phủ định, còn đáp án đúng Option C được paraphrase hoàn toàn."]
          ]
        },
        cards: [
          {
            title: "Signposting Words giữ nhịp Part 4 (Academic Monologue)",
            badge: "Cột mốc âm thanh",
            items: [
              { label: "Mở ý mới", text: "First of all / Let's turn now to... / Moving on to the next aspect... / Another key factor is..." },
              { label: "Nhấn mạnh đáp án", text: "Crucially / Most importantly / What really matters is... / It's worth noting that..." },
              { label: "Chuyển ý tương phản", text: "Having said that / Nevertheless / On the flip side / In sharp contrast to earlier findings..." }
            ]
          }
        ]
      },
      {
        id: "maps",
        label: "Bản Đồ (Map) & La Bàn",
        summary: "Dạng Map/Plan Labelling (Part 2) thực chất là bài 'lấy điểm chắc chắn' nếu bạn chuẩn bị trước từ vựng 8 hướng la bàn và không để bị lạc vị trí đang đứng.",
        cards: [
          {
            title: "Quy trình 3 bước giải Map không bị loạn hướng",
            badge: "Unit 6 Listening",
            items: [
              { label: "Bước 1: Chốt điểm xuất phát", text: "Tìm chữ 'You are here', 'Main Entrance', 'Reception' hoặc 'Bridge/River' trên hình trước khi băng chạy." },
              { label: "Bước 2: Nhìn hình & Tên sẵn", text: "Đọc lướt tên các con đường (Oak Street, Main Path) và các công trình đã ghi tên sẵn để làm vật mốc trung gian." },
              { label: "Bước 3: Di chuyển con trỏ liên tục", text: "Vừa nghe vừa đặt đầu ngón tay/con trỏ đi theo từng bước rẽ ('go past the lake, take the second turning on the right')." }
            ]
          },
          {
            title: "Từ vựng định vị không gian & chuyển động hay dùng nhất",
            badge: "Cần thuộc lòng",
            items: [
              { label: "8 Hướng la bàn", text: "North (trên) · South (dưới) · East (phải) · West (trái) · North-East / North-West / South-East / South-West." },
              { label: "Vị trí tương đối", text: "opposite / across from (đối diện) · adjacent to / next to (kề bên) · at the far end (cuối cùng phía xa) · in the top-left corner." },
              { label: "Chuyển động", text: "go straight ahead · cross the footbridge · head towards · bend round to the left · just past · branch off." },
              { label: "Sơ đồ quy trình", text: "clockwise / anticlockwise (theo/ngược chiều kim đồng hồ) · at the base of · outer rim · inner chamber." }
            ]
          }
        ]
      },
      {
        id: "spelling",
        label: "Chính Tả, Số & Đuôi -s",
        summary: "Rất nhiều thí sinh nghe hiểu đúng ý nhưng vẫn mất 2–4 câu/đề vì thiếu âm cuối số nhiều -s, nhầm -teen/-ty hoặc viết dư đơn vị đã có sẵn trên đề.",
        table: {
          title: "Cẩm nang rà soát lỗi chính tả, số & chữ cái",
          headers: ["Nhóm lỗi hay sai", "Chi tiết dễ bẫy", "Cách viết an toàn 100%"],
          rows: [
            ["Số -teen vs. -ty", "13 vs 30 · 14 vs 40 · 15 vs 50 · 16 vs 60 · 17 vs 70 · 18 vs 80 · 19 vs 90", "Nghe trọng âm: -TEEN nhấn âm cuối, chữ 't' rõ; -TY nhấn âm đầu, 't' đọc lướt nhanh như /d/ (Mỹ)."],
            ["Đánh vần & Số ĐT", "'double L', 'triple 5', 'oh' (=0), B/P, G/J, A/E/I, C/S, M/N", "Chú ý nối âm đọc 'H' (/eɪtʃ/), 'W' (double-u), 'Y' (/waɪ/). Không chèn dấu cách thừa."],
            ["Ngày tháng & Giờ", "'the fourteenth of July', 'quarter to eight', 'half past six'", "Viết gọn '14 July' hoặc 'July 14' (tính là 1 số + 1 từ), '7.45' hoặc '7:45' đều hợp lệ."],
            ["Danh từ số nhiều (-s/-es)", "Âm /s/, /z/ ở cuối danh từ đứng sau 'many, several, types of, various'", "Nếu âm cuối bị nuốt lúc nghe → kiểm tra lại NGỮ PHÁP trong đề (không có mạo từ a/an trước danh từ đếm được)."],
            ["Đơn vị & Từ ghép", "Đã in sẵn '$', '%', 'km', 'am/pm' ngay sau ô trống trên đề thi", "KHÔNG viết lặp lại đơn vị nếu ngoài ô trống đã có sẵn; chú ý từ ghép có gạch nối được tính là 1 từ (e.g. well-known)."]
          ]
        },
        checklist: [
          "Rà toàn bộ 40 câu trong 2 phút cuối (trên máy tính kiểm tra từng ô đang gõ) để bắt lỗi gõ nhầm phím (accommodation 2c-2m, environment, government, February, Wednesday).",
          "Kiểm tra chắc chắn không viết dư chữ vượt quá WORD LIMIT ở bất kỳ câu nào.",
          "Soát ngữ pháp các ô điền danh từ: đã có -s/-es ở số nhiều hoặc mạo từ/số ít đúng chưa?",
          "Đảm bảo mọi câu Trắc nghiệm / Matching chưa chắc chắn đều đã chọn 1 phương án (không bỏ trống)."
        ]
      }
    ]
  };
})(window);

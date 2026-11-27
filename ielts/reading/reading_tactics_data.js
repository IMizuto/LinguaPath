/**
 * LinguaPath — IELTS Reading Strategy & Pitfalls Toolkit (Sidecar)
 * Chắt lọc từ Prep Reading Chuyên Sâu, IELTS Nguyễn Huyền (V02–V15) & Bí kíp Reading.
 */
(function (global) {
  "use strict";

  global.LP_READING_TOOLKIT = {
    title: "Cẩm nang Chiến thuật IELTS Reading",
    subtitle: "Quy trình 60 phút, phân biệt bẫy T/F/NG vs Y/N/NG & kỹ thuật đoán nghĩa không cần từ điển",
    badge: "4 Nhóm Bí Kíp",
    accentIcon: "reading",
    tabs: [
      {
        id: "pacing",
        label: "60 Phút & 3 Passages",
        summary: "Mục tiêu sống còn: kiểm soát 19 phút/Passage (+1 phút rà soát), đọc câu hỏi trước để nhớ từ khóa mỏ neo và phối hợp thứ tự giải đề thông minh.",
        cards: [
          {
            title: "Quy trình 4 bước giải 1 Passage (19 phút)",
            badge: "Cốt lõi",
            items: [
              { label: "Bước 1", text: "Đọc lướt tiêu đề bài đọc (5 giây) để nắm chủ đề lớn, sau đó đọc hết các câu hỏi của nhóm dễ trước (Gap-fill, Short Answer, T/F/NG)." },
              { label: "Bước 2", text: "Gạch từ khóa 2 tầng: (a) Từ không đổi (tên riêng, năm, số liệu, thuật ngữ trong ngoặc) và (b) Từ khóa nội dung có thể bị paraphrase." },
              { label: "Bước 3", text: "Scan từ trên xuống để khoanh vùng đúng đoạn chứa đáp án rồi đọc kỹ ±2 câu xung quanh để đối chiếu ngữ nghĩa (hiểu >50% logic câu là đủ chọn)." },
              { label: "Bước 4", text: "Không kẹt quá 90 giây ở 1 câu khó: đánh dấu lại, làm hết câu dễ trước để ăn trọn điểm chắc tay rồi quay lại sau." }
            ]
          },
          {
            title: "Chiến thuật phối hợp theo Passage 1 → 3 (Prep Chuyên Sâu)",
            badge: "Tổ hợp dạng bài",
            items: [
              { label: "Passage 1 (15–17')", text: "Thường là T/F/NG + Completion (Note/Table/Short Answer). Các câu hỏi đi theo thứ tự từ trên xuống dưới — làm song song 2 nhóm cùng lúc cực nhanh." },
              { label: "Passage 2 (19–20')", text: "Thường trộn Matching Information (xáo trộn đoạn) + MCQ/Summary. Hãy làm Completion/MCQ trước để nắm khung bài, đồng thời tick nháp ý từng đoạn cho Matching Info." },
              { label: "Passage 3 (22–24')", text: "Văn bản học thuật dài, thường có Matching Headings + Y/N/NG + Matching Features. Với Matching Headings, đọc câu chủ đề + câu cuối mỗi đoạn, gạch bỏ phương án chắc chắn trước." }
            ]
          }
        ],
        table: {
          title: "Thang quy đổi câu đúng → Band điểm Reading Academic (Tham khảo quy tắc 3-2-2)",
          headers: ["Số câu đúng / 40", "Band điểm ước tính", "Mức phân bổ khuyến nghị (P1 + P2 + P3)"],
          rows: [
            ["23 – 26 câu", "Band 6.0", "11 + 8 + 6 (Chắc tay Passage 1, ăn điểm Completion ở P2–P3)"],
            ["27 – 29 câu", "Band 6.5", "12 + 9 + 7 (Giảm sai sót oan ở dạng điền từ & T/F/NG)"],
            ["30 – 32 câu", "Band 7.0", "12 + 10 + 9 (Làm chủ Matching Information & Paraphrase)"],
            ["33 – 34 câu", "Band 7.5", "13 + 11 + 10 (Vững tâm lý trước các bẫy Y/N/NG & Headings)"],
            ["35 – 36 câu", "Band 8.0", "13 + 12 + 11 (Nhận diện nhanh sắc thái phủ định / so sánh)"],
            ["37 – 40 câu", "Band 8.5 – 9.0", "13 + 13 + 12+ (Kiểm soát tuyệt đối thời gian & từ vựng C1/C2)"]
          ]
        }
      },
      {
        id: "traps",
        label: "Bẫy 10 Dạng & T/F/NG",
        summary: "Sai lầm lớn nhất của thí sinh Band 5.5–6.5 là suy diễn kiến thức cá nhân hoặc đánh đồng 'không nhắc tới' (NOT GIVEN) với 'trái ngược' (FALSE/NO).",
        table: {
          title: "Phân biệt chuẩn xác TRUE/YES — FALSE/NO — NOT GIVEN",
          headers: ["Đáp án", "Dấu hiệu nhận diện trong bài đọc", "Bẫy thường gặp cần tránh"],
          rows: [
            ["TRUE / YES", "Thông tin khớp 100% về ý nghĩa (thường được paraphrase bằng từ đồng nghĩa, bị động/chủ động hoặc đổi từ loại).", "Thấy từ ngữ khác mặt chữ nên tưởng sai, thực chất nghĩa hoàn toàn tương đương."],
            ["FALSE / NO", "Bài đọc khẳng định điều TRÁI NGƯỢC trực tiếp với câu hỏi (đảo ngược nguyên nhân/kết quả, sai số lượng, phủ định lẫn nhau).", "Đọc lướt thấy từ khóa khớp nhau nhưng bỏ sót từ phủ định ẩn (rarely, fail to, lack of, misconception, myth)."],
            ["NOT GIVEN", "Có nhắc tới đối tượng/chủ đề trong câu hỏi nhưng KHÔNG hề xác nhận hay phủ nhận mối quan hệ cụ thể được hỏi.", "Thấy từ so sánh ('more than', 'the first', 'always', 'only') trong câu hỏi mà bài đọc chỉ nêu đơn lẻ → vội chọn FALSE."]
          ]
        },
        cards: [
          {
            title: "Cảnh giác 5 nhóm từ 'báo động đỏ' trong câu hỏi",
            badge: "Bẫy T/F/NG & MCQ",
            items: [
              { label: "Từ tuyệt đối", text: "all, always, never, only, sole, completely, impossible — chỉ cần bài có 'some/often/most' là dễ thành FALSE." },
              { label: "So sánh & Thứ tự", text: "more than, faster, the most, the first/oldest — kiểm tra kỹ bài có thực sự so sánh 2 vế này với nhau không." },
              { label: "Mức độ chắc chắn", text: "prove, confirm, widely accepted vs. claim, suggest, debate, controversial — bẫy đánh tráo giả thuyết thành sự thật." }
            ]
          },
          {
            title: "Mẹo nhanh các dạng Matching & Completion",
            badge: "Tránh bẫy",
            items: [
              { label: "Matching Headings", text: "Phân biệt Ý CHÍNH toàn đoạn vs. VÍ DỤ minh họa (bẫy hay lấy 1 cụm từ xuất hiện ở giữa đoạn làm tiêu đề nhiễu)." },
              { label: "Matching Info (Which para)", text: "Luôn tìm các từ chỉ phạm trù rộng như 'reasons for', 'an example of', 'contrast between', 'a reference to', chú ý NB dùng chữ cái >1 lần." },
              { label: "Matching Features", text: "Khoanh hết tên các nhà khoa học/nhân vật trên bài đọc trước, sau đó đọc lời phát biểu quanh từng tên để đối chiếu." },
              { label: "Summary Completion", text: "Xác định từ loại & ngữ pháp chỗ trống (số ít/nhiều, V-ing/V3) trước khi scan; đáp án điền từ giữ nguyên 100% chính tả trong bài." }
            ]
          }
        ]
      },
      {
        id: "vocab",
        label: "Đoán nghĩa & Paraphrase",
        summary: "Bạn không cần hiểu 100% từ vựng C2 để đạt 7.5–8.0 Reading. Hãy dùng 4 quy luật biến đổi từ khóa và 3 kỹ thuật đoán nghĩa từ mới trực tiếp ngay trên ngữ cảnh câu.",
        cards: [
          {
            title: "4 kiểu Paraphrase kinh điển trong đề thi IELTS",
            badge: "Tìm từ khóa",
            items: [
              { label: "1. Đồng nghĩa / Tỉ lệ", text: "enough → sufficient • 10 years → a decade • 30% → about a third • 50% → half • a myth → are not true." },
              { label: "2. Chủ động ↔ Bị động", text: "Câu hỏi: 'The government should fund schools' ↔ Bài đọc: 'Schools ought to be financed by authorities'." },
              { label: "3. Chuyển đổi Từ loại", text: "V/Adj → Noun hoặc ngược lại: 'decided to visit' ↔ 'made a decision to pay a visit'; 'grow slowly' ↔ 'slow growth'." },
              { label: "4. Đảo trật tự & Ý bao hàm", text: "Câu hỏi nêu khái niệm khái quát ('a serious threat') ↔ Bài đọc nêu trường hợp cụ thể ('poisoned drinking water')." }
            ]
          },
          {
            title: "3 phương pháp đoán nghĩa từ mới khi không có từ điển",
            badge: "V03 — Nguyễn Huyền",
            items: [
              { label: "PP1: Nhìn Dấu câu & Giải thích", text: "Dấu phẩy (... , a colorless drug, ...), ngoặc đơn (... (a narrow valley) ...), gạch ngang (... — knowledge about memory — ...), hoặc 'is/means/refers to'." },
              { label: "PP2: Cấu trúc Tương phản / Tương đồng", text: "Gặp 'while, whereas, however, on the other hand' → đoán nghĩa trái ngược vế kia; gặp 'similarly, likewise, such as' → đoán nghĩa cùng nhóm." },
              { label: "PP3: Tách Tiền tố & Hậu tố", text: "anti- (chống lại), de- (giảm), mis- (sai), over-/under- (quá/kém), multi- (đa), -less (không có), -able/-ible (có thể), -ism (học thuyết)." }
            ]
          }
        ]
      },
      {
        id: "checklist",
        label: "Checklist Chống Mất Điểm",
        summary: "Đánh dấu tự rà soát lại các lỗi kỹ thuật trước khi nhấn Nộp bài trong Phòng thi CBT (mất 1 câu vì lỗi chính tả hay giới hạn từ cực kỳ đáng tiếc).",
        checklist: [
          "Đọc lại yêu cầu giới hạn từ của TỪNG cụm câu hỏi (ONE WORD ONLY khác với NO MORE THAN TWO WORDS AND/OR A NUMBER).",
          "Kiểm tra danh từ số ít / số nhiều (-s/-es) xem đã khớp với mạo từ (a/an/are/many) đứng trước ô trống chưa.",
          "Với dạng Gap-fill, từ điền vào phải chép ĐÚNG NGUYÊN DẠNG chính tả từ bài đọc (không tự đổi dạng từ nếu đề nói 'FROM THE PASSAGE').",
          "Với Matching Headings / Features / Information: đọc kỹ dòng ghi chú 'NB You may use any letter more than once'.",
          "Tách biệt rạch ròi TRUE/FALSE/NOT GIVEN (sự thật khách quan trong bài) và YES/NO/NOT GIVEN (quan điểm của tác giả).",
          "Không để ô trống nào chưa điền trước khi hết giờ — các câu Matching/TFNG/MCQ bỏ ngỏ luôn có xác suất đúng nếu loại trừ hợp lý."
        ]
      }
    ]
  };
})(window);

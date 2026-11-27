/* LinguaPath TOEIC Grammar — Phần 2: Chặng 3 (tg_27..tg_40, 550–750) & Chặng 4 (tg_41..tg_50, 750–990)
 * 24 chuyên đề ngữ pháp chuẩn ETS × 6 câu trắc nghiệm Part 5–6 = 144 câu có giải thích tiếng Việt chi tiết.
 */
(function () {
  "use strict";
  var DATA = [
  {
    "id": "tg_27",
    "order": 27,
    "level": 3,
    "unitTitle": "Chặng 3 • MĐQH rút gọn, Phân từ, Điều kiện & Từ nối (550–750)",
    "category": "Mệnh đề quan hệ",
    "partTag": "Part 5–6",
    "title": "Trạng từ quan hệ (where/when/why) & Giới từ + which/whom",
    "speedTip": "Mẹo 5 giây: Kiểm tra mệnh đề SAU chỗ trống — nếu đã ĐỦ S-V-O (hoặc bị động đầy đủ) thì chọn where/when/why hoặc Giới từ + which; nếu THIẾU S hoặc O thì phải chọn which/that!",
    "formula": "N(nơi chốn) + where (= in/at/on which) + S + V (đủ) | N(thời gian) + when + S + V (đủ) | Prep + which (vật) / whom (người)",
    "summary": "Chuyên đề giải quyết bẫy phân biệt Đại từ quan hệ (which/whom) với Trạng từ quan hệ (where/when/why) — dạng câu hỏi phân hóa mạnh ở mức 600–750 TOEIC. Người học nắm chắc quy tắc đếm thành phần đầy đủ của mệnh đề phụ và quy tắc cấm dùng that/who ngay sau giới từ.",
    "theorySections": [
      {
        "heading": "1. Quy tắc ĐỦ vs THIẾU khi chọn where/when hay which",
        "bullets": [
          "where (= in/at/on which): thay thế trạng ngữ chỉ nơi chốn; mệnh đề phía sau đã ĐẦY ĐỦ thành phần (ví dụ: the warehouse where goods are stored).",
          "which/that: thay thế chủ ngữ hoặc tân ngữ; mệnh đề phía sau còn THIẾU S hoặc O (ví dụ: the warehouse which stores electronic goods — thiếu chủ ngữ; the warehouse which we rented — thiếu tân ngữ của rented).",
          "when (= on/in/at which) dùng cho mốc thời gian (day, date, month, period); why (= for which) đứng ngay sau the reason."
        ]
      },
      {
        "heading": "2. Cấu trúc Giới từ + which / whom chuẩn công sở ETS",
        "bullets": [
          "Sau giới từ (in, on, at, by, for, with, to, through, during, under) CHỈ được dùng which (cho vật) hoặc whom (cho người).",
          "TUYỆT ĐỐI KHÔNG dùng Giới từ + that và KHÔNG dùng Giới từ + who trong văn phong học thuật/thương mại TOEIC.",
          "Cụm hay ra thi: the process by which (quy trình nhờ đó), the terms under which (điều khoản theo đó), the client to whom (khách hàng mà tới người đó), the period during which (giai đoạn trong đó)."
        ]
      },
      {
        "heading": "3. Lượng từ + of + which / whom",
        "bullets": [
          "Sau dấu phẩy để nối hai mệnh đề có cụm lượng từ: most of whom, several of which, half of which, none of whom.",
          "Lưu ý: Nếu giữa 2 mệnh đề chỉ có dấu phẩy mà KHÔNG có liên từ (and/but), bắt buộc dùng đại từ quan hệ (many of which), KHÔNG dùng đại từ nhân xưng (many of them)."
        ]
      }
    ],
    "examples": [
      {
        "en": "The new logistics hub <b>where</b> international orders are processed will open next Monday.",
        "vi": "Trung tâm hậu cần mới nơi các đơn hàng quốc tế được xử lý sẽ khai trương vào thứ Hai tới.",
        "note": "Mệnh đề sau 'international orders are processed' ở thể bị động đã đủ nghĩa → chọn 'where' (= at which)."
      },
      {
        "en": "Please review the revised policy <b>under which</b> employees can request remote workdays.",
        "vi": "Vui lòng xem lại chính sách sửa đổi mà theo đó nhân viên có thể đăng ký ngày làm việc từ xa.",
        "note": "Giới từ 'under' + 'which' thay cho 'under the revised policy'; không được dùng 'under that'."
      },
      {
        "en": "The committee interviewed twelve finalists, three of <b>whom</b> have over ten years of auditing experience.",
        "vi": "Hội đồng đã phỏng vấn mười hai ứng viên vòng cuối, ba người trong số họ có hơn mười năm kinh nghiệm kiểm toán.",
        "note": "Sau dấu phẩy không có 'and' và chỉ người → dùng 'three of whom', không dùng 'three of them'."
      }
    ],
    "pitfalls": [
      {
        "wrong": "We visited the manufacturing plant where produces solar panels.",
        "right": "We visited the manufacturing plant <b>which</b> produces solar panels.",
        "exp": "Sau chỗ trống là động từ 'produces' (thiếu chủ ngữ), nên dù 'plant' là nơi chốn vẫn phải dùng 'which/that', không dùng 'where'."
      },
      {
        "wrong": "The supplier with who we signed the agreement offered a bulk discount.",
        "right": "The supplier with <b>whom</b> we signed the agreement offered a bulk discount.",
        "exp": "Ngay sau giới từ 'with' chỉ người bắt buộc dùng 'whom', không bao giờ dùng 'who' hay 'that'."
      }
    ],
    "quiz": [
      {
        "q": "The conference hall _____ the annual shareholders' meeting will be held can accommodate 500 guests.",
        "opts": [
          "which",
          "where",
          "what",
          "who"
        ],
        "ans": 1,
        "exp": "Mệnh đề sau chỗ trống 'the annual shareholders' meeting will be held' là câu bị động đã đầy đủ thành phần, bổ nghĩa cho địa điểm 'conference hall' → chọn trạng từ quan hệ 'where' (= in which). Loại 'which' (chỉ dùng khi thiếu S/O), 'what' (không đứng sau danh từ), 'who' (chỉ người)."
      },
      {
        "q": "Ms. Takahashi is looking for a reliable vendor _____ can supply eco-friendly packaging materials.",
        "opts": [
          "where",
          "whom",
          "whose",
          "which"
        ],
        "ans": 3,
        "exp": "Sau chỗ trống là động từ 'can supply' đang thiếu chủ ngữ, và 'vendor' (nhà cung cấp/đơn vị bán) trong ngữ cảnh công ty dùng được 'which' làm chủ ngữ. Loại 'where' (phải có S+V đủ), 'whom' (chỉ làm tân ngữ), 'whose' (cần danh từ đi liền sau)."
      },
      {
        "q": "The financial report outlines the criteria _____ bonuses will be distributed this quarter.",
        "opts": [
          "by which",
          "by that",
          "which",
          "in what"
        ],
        "ans": 0,
        "exp": "Cụm cố định 'the criteria by which + S + V' (các tiêu chí dựa vào đó...). Loại 'by that' (cấm dùng that sau giới từ), 'which' (thiếu giới từ 'by' vì mệnh đề sau bị động đã đủ), 'in what' (sai cấu trúc mệnh đề quan hệ)."
      },
      {
        "q": "October 15 is the final date _____ all departmental budget proposals must be submitted.",
        "opts": [
          "who",
          "which",
          "when",
          "what"
        ],
        "ans": 2,
        "exp": "'October 15 / the final date' chỉ thời gian và mệnh đề sau 'all departmental budget proposals must be submitted' đã hoàn chỉnh → chọn 'when' (= on which). Loại 'which' (thiếu giới từ 'on'), 'who' (chỉ người), 'what' (không có tiền ngữ)."
      },
      {
        "q": "The regional director to _____ you addressed the inquiry is currently attending a summit in Seoul.",
        "opts": [
          "who",
          "whose",
          "that",
          "whom"
        ],
        "ans": 3,
        "exp": "Đứng ngay sau giới từ 'to' và thay cho danh từ chỉ người 'regional director' nên bắt buộc chọn 'whom'. Loại 'who' và 'that' (không đứng ngay sau giới từ), 'whose' (cần danh từ theo sau)."
      },
      {
        "q": "Our research division patented fourteen prototypes last year, most of _____ are now in commercial production.",
        "opts": [
          "them",
          "which",
          "that",
          "what"
        ],
        "ans": 1,
        "exp": "Hai mệnh đề nối nhau chỉ bằng dấu phẩy (không có liên từ 'and') và thay cho vật 'fourteen prototypes' → dùng đại từ quan hệ 'most of which'. Loại 'them' (gây lỗi comma splice), 'that' (không đứng sau giới từ 'of'), 'what' (sai ngữ pháp)."
      }
    ]
  },
  {
    "id": "tg_28",
    "order": 28,
    "level": 3,
    "unitTitle": "Chặng 3 • MĐQH rút gọn, Phân từ, Điều kiện & Từ nối (550–750)",
    "category": "Phân từ & Rút gọn",
    "partTag": "Part 5–6",
    "title": "Rút gọn Mệnh đề Quan hệ Chủ động (V-ing) & Bị động (V-ed)",
    "speedTip": "Mẹo 5 giây: Thấy câu đã có 1 động từ chính chia thì và danh từ đứng ngay trước chỗ trống → loại động từ chia thì; nhìn SAU chỗ trống có Tân ngữ (N) thì chọn V-ing, có Giới từ/Trạng từ/hết câu thì chọn V-ed!",
    "formula": "N + V-ing (+ O) [Chủ động]  |  N + V3/ed (+ prep / by + N) [Bị động]  |  the first/only/so sánh nhất + N + to-V",
    "summary": "Một trong những điểm ngữ pháp xuất hiện nhiều nhất ở TOEIC Part 5–6 mức 550–750. Việc nhận diện nhanh động từ chính của câu giúp bạn loại ngay các đáp án chia thì sai và quyết định chính xác giữa phân từ chủ động V-ing và bị động V-ed.",
    "theorySections": [
      {
        "heading": "1. Quy tắc 1 câu đơn = 1 động từ chính chia thì",
        "bullets": [
          "Trước khi chọn đáp án, hãy quét toàn câu xem đã có động từ chính (is, are, will be, announced, requires...) hay chưa.",
          "Nếu câu đã có động từ chính và KHÔNG có liên từ (and/but/that/which), chỗ trống bổ nghĩa cho danh từ đứng trước chắc chắn là MĐQH rút gọn (V-ing, V3/ed hoặc to-V)."
        ]
      },
      {
        "heading": "2. Phân biệt Chủ động (V-ing) và Bị động (V3/ed)",
        "bullets": [
          "Chủ động (V-ing): Danh từ tự thực hiện hành động; thường có Tân ngữ đứng ngay sau chỗ trống (ví dụ: employees seeking reimbursement, a document detailing the procedure).",
          "Bị động (V3/ed): Danh từ chịu tác động; thường có giới từ (by, in, at, for, to, on) hoặc động từ chính của câu đứng ngay sau chỗ trống (ví dụ: orders placed after 5 P.M. will be shipped tomorrow).",
          "Chú ý các nội động từ không có dạng bị động nên luôn rút gọn thành V-ing: consisting of, resulting from, belonging to, remaining, existing, occurring."
        ]
      },
      {
        "heading": "3. Rút gọn bằng To-V",
        "bullets": [
          "Dùng to-V (hoặc to be V3 nếu bị động) khi danh từ có từ chỉ thứ tự hoặc cực trị đứng trước: the first, the second, the last, the only, so sánh nhất (the largest company to adopt...)."
        ]
      }
    ],
    "examples": [
      {
        "en": "All expenses <b>incurred</b> during the business trip must be documented with original receipts.",
        "vi": "Mọi chi phí phát sinh trong chuyến công tác phải được chứng minh bằng hóa đơn gốc.",
        "note": "Động từ chính là 'must be documented'; 'expenses' bị/được phát sinh + sau chỗ trống là giới từ 'during' → rút gọn bị động 'incurred'."
      },
      {
        "en": "Candidates <b>possessing</b> fluency in two Asian languages will receive priority consideration.",
        "vi": "Các ứng viên sở hữu khả năng thông thạo hai ngôn ngữ châu Á sẽ được ưu tiên xem xét.",
        "note": "Động từ chính là 'will receive'; sau chỗ trống có tân ngữ 'fluency' → rút gọn chủ động 'possessing'."
      },
      {
        "en": "A team <b>consisting</b> of engineers from three branches designed the new battery.",
        "vi": "Một nhóm gồm các kỹ sư từ ba chi nhánh đã thiết kế loại pin mới.",
        "note": "'Consist of' là nội động từ không chia bị động → luôn dùng 'consisting'."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The invoice was sent to the accounting office needs immediate verification.",
        "right": "The invoice <b>sent</b> to the accounting office needs immediate verification.",
        "exp": "Câu đã có động từ chính 'needs'; nếu dùng 'was sent' sẽ thừa 1 động từ chia thì (thiếu 'which'). Phải rút gọn thành 'sent'."
      },
      {
        "wrong": "The package consisted of fragile lab equipment arrived intact.",
        "right": "The package <b>consisting</b> of fragile lab equipment arrived intact.",
        "exp": "'Consist of' (bao gồm) là nội động từ, không bao giờ dùng phân từ bị động 'consisted of'."
      }
    ],
    "quiz": [
      {
        "q": "All warranty claims _____ after the thirty-day grace period will be reviewed on a case-by-case basis.",
        "opts": [
          "submit",
          "submitting",
          "submitted",
          "are submitted"
        ],
        "ans": 2,
        "exp": "Câu đã có động từ chính 'will be reviewed', loại 'submit' và 'are submitted' (động từ chia thì). 'Warranty claims' (yêu cầu bảo hành) được nộp (bị động) và sau chỗ trống là giới từ 'after' → chọn 'submitted'."
      },
      {
        "q": "The software update addresses several security flaws _____ the mobile banking application.",
        "opts": [
          "affecting",
          "affected",
          "affects",
          "affect"
        ],
        "ans": 0,
        "exp": "Động từ chính của câu là 'addresses', nên loại 'affects' và 'affect'. Sau chỗ trống có cụm tân ngữ trực tiếp 'the mobile banking application' (các lỗi ảnh hưởng đến ứng dụng — chủ động) → chọn 'affecting'."
      },
      {
        "q": "A committee _____ of five senior managers will oversee the office relocation project.",
        "opts": [
          "consists",
          "consisted",
          "to consist",
          "consisting"
        ],
        "ans": 3,
        "exp": "Động từ chính là 'will oversee', loại 'consists'. 'Consist of' là nội động từ nên không có dạng bị động 'consisted' → luôn rút gọn chủ động thành 'consisting'."
      },
      {
        "q": "NexGen Logistics became the first regional carrier _____ zero-emission electric vans across its fleet.",
        "opts": [
          "deployed",
          "to deploy",
          "deploying",
          "deploys"
        ],
        "ans": 1,
        "exp": "Cấu trúc 'the first + N + to-V' để rút gọn mệnh đề quan hệ sau số thứ tự. Do đó chọn 'to deploy', loại 'deployed', 'deploying' và động từ chia thì 'deploys'."
      },
      {
        "q": "Passengers _____ to upgrade their seats should speak with a gate agent before boarding begins.",
        "opts": [
          "wishing",
          "wish",
          "wished",
          "are wishing"
        ],
        "ans": 0,
        "exp": "Câu đã có động từ chính 'should speak', loại 'wish' và 'are wishing'. 'Passengers' chủ động mong muốn nâng hạng ghế ('who wish to upgrade') → rút gọn chủ động 'wishing'."
      },
      {
        "q": "The revised blueprint _____ by the chief architect reflects all safety recommendations from the city council.",
        "opts": [
          "approving",
          "approves",
          "approved",
          "was approved"
        ],
        "ans": 2,
        "exp": "Động từ chính là 'reflects', loại 'approves' và 'was approved'. Sau chỗ trống có 'by the chief architect' báo hiệu rõ bị động ('bản thiết kế được phê duyệt bởi...') → chọn 'approved'."
      }
    ]
  },
  {
    "id": "tg_29",
    "order": 29,
    "level": 3,
    "unitTitle": "Chặng 3 • MĐQH rút gọn, Phân từ, Điều kiện & Từ nối (550–750)",
    "category": "Phân từ & Rút gọn",
    "partTag": "Part 5–6",
    "title": "Mệnh đề Phân từ đầu câu (V-ing / V-ed, S + V & Having V3)",
    "speedTip": "Mẹo 5 giây: Gặp chỗ trống ở ĐẦU câu kèm dấu phẩy ở giữa → nhảy thẳng tới Chủ ngữ SAU dấu phẩy! S tự làm → V-ing / Having V3; S bị tác động → V3/ed / Having been V3.",
    "formula": "V-ing / Having V3, S + V (S chủ động)  |  V3/ed / Having been V3, S + V (S bị động)  |  Not + V-ing/V3, S + V",
    "summary": "Mệnh đề phân từ đầu câu (Participle Clauses) dùng để rút gọn hai mệnh đề có CÙNG chủ ngữ nhằm tăng tính súc tích trong email, thông cáo báo chí và báo cáo doanh nghiệp TOEIC. Bẫy kinh điển nhất là đặt sai chủ ngữ hoặc nhầm giữa chủ động và bị động.",
    "theorySections": [
      {
        "heading": "1. Quy tắc đối chiếu Chủ ngữ chính sau dấu phẩy",
        "bullets": [
          "Điều kiện bắt buộc để rút gọn mệnh đề đầu câu thành phân từ: chủ ngữ của hành động ở vế đầu PHẢI trùng với chủ ngữ (S) ngay sau dấu phẩy.",
          "Ví dụ đúng: Founded in 1998, the firm now operates in 14 countries ('the firm' được thành lập → V-ed).",
          "Ví dụ chủ động: Recognizing the surge in demand, management expanded production ('management' nhận ra → V-ing)."
        ]
      },
      {
        "heading": "2. Phân biệt V-ing với Having + V3 (Phân từ hoàn thành)",
        "bullets": [
          "V-ing / V3-ed: diễn tả hai hành động xảy ra đồng thời, liên tiếp hoặc chỉ nguyên nhân–kết quả trực tiếp.",
          "Having + V3 (chủ động) / Having been + V3 (bị động): nhấn mạnh hành động ở vế đầu đã HOÀN TẤT TRƯỚC hành động ở mệnh đề chính (ví dụ: Having completed the audit, the accountant submitted her summary)."
        ]
      },
      {
        "heading": "3. Thể phủ định & Bẫy động từ chia thì",
        "bullets": [
          "Đặt 'Not' đứng ngay trước phân từ: Not knowing the password, he contacted IT support.",
          "Tuyệt đối không chọn V chia thì (chẳng hạn 'Completed' đi kèm S ẩn mà không có liên từ, hay 'Received' khi thực tế là 'Having received + O') làm sai logic chủ–bị động."
        ]
      }
    ],
    "examples": [
      {
        "en": "<b>Located</b> just two blocks from the central station, the hotel attracts many corporate travelers.",
        "vi": "Tọa lạc chỉ cách ga trung tâm hai dãy nhà, khách sạn thu hút nhiều khách công tác doanh nghiệp.",
        "note": "Chủ ngữ sau dấu phẩy là 'the hotel' được đặt vị trí (be located) → dùng quá khứ phân từ 'Located'."
      },
      {
        "en": "<b>Having reviewed</b> all vendor bids carefully, the procurement team selected Apex Industrial.",
        "vi": "Sau khi đã xem xét kỹ mọi hồ sơ chào giá của nhà cung cấp, đội mua hàng đã chọn Apex Industrial.",
        "note": "'The procurement team' chủ động xem xét trước khi chọn, có tân ngữ 'all vendor bids' → dùng 'Having reviewed'."
      },
      {
        "en": "<b>Not wishing</b> to delay the product launch, the director approved overtime pay for the testing group.",
        "vi": "Không muốn làm chậm ngày ra mắt sản phẩm, giám đốc đã duyệt tiền tăng ca cho nhóm kiểm thử.",
        "note": "Phủ định của mệnh đề phân từ chủ động đặt 'Not' ngay trước 'V-ing'."
      }
    ],
    "pitfalls": [
      {
        "wrong": "Designing for heavy industrial use, the new drill lasts twice as long as older models.",
        "right": "<b>Designed</b> for heavy industrial use, the new drill lasts twice as long as older models.",
        "exp": "Chủ ngữ sau dấu phẩy là 'the new drill' (chiếc máy khoan) ĐƯỢC thiết kế (bị động), không thể tự thiết kế → phải dùng 'Designed'."
      },
      {
        "wrong": "Finished the quarterly presentation, Ms. Park answered questions from investors.",
        "right": "<b>Having finished</b> the quarterly presentation, Ms. Park answered questions from investors.",
        "exp": "Sau chỗ trống có tân ngữ 'the quarterly presentation' và 'Ms. Park' chủ động hoàn thành trước đó → phải dùng chủ động 'Having finished' (không dùng bị động 'Finished')."
      }
    ],
    "quiz": [
      {
        "q": "_____ in downtown Chicago in 1985, Mercer Consulting now advises Fortune 500 corporations worldwide.",
        "opts": [
          "Founding",
          "Having founded",
          "To found",
          "Founded"
        ],
        "ans": 3,
        "exp": "Chủ ngữ sau dấu phẩy là 'Mercer Consulting' (công ty) ĐƯỢC thành lập vào năm 1985 (bị động) → chọn quá khứ phân từ 'Founded'. Loại 'Founding' và 'Having founded' (chủ động, đòi hỏi tân ngữ sau nó), 'To found' (chỉ mục đích)."
      },
      {
        "q": "_____ the rising cost of raw materials, the manufacturer decided to renegotiate its supplier contracts.",
        "opts": [
          "Faced",
          "Facing",
          "To be faced",
          "Face"
        ],
        "ans": 1,
        "exp": "Sau chỗ trống có tân ngữ trực tiếp 'the rising cost of raw materials' và chủ ngữ 'the manufacturer' chủ động đối mặt (face sth) → chọn 'Facing'. Nếu muốn dùng bị động phải có 'with' ('Faced with...'). Loại 'Face' (động từ nguyên thể không tạo mệnh đề phân từ)."
      },
      {
        "q": "_____ the mandatory safety orientation, new hires are permitted to enter the assembly floor.",
        "opts": [
          "Completed",
          "Completing",
          "Having completed",
          "Being completed"
        ],
        "ans": 2,
        "exp": "Nhân viên mới phải HOÀN THÀNH xong buổi định hướng TRƯỚC khi được phép vào khu lắp ráp, lại có tân ngữ 'the mandatory safety orientation' (chủ động) → chọn phân từ hoàn thành 'Having completed'. Loại 'Completed' và 'Being completed' (bị động)."
      },
      {
        "q": "_____ with a tighter marketing budget this year, the agency focused primarily on digital campaigns.",
        "opts": [
          "Confronted",
          "Confronting",
          "To confront",
          "Confronts"
        ],
        "ans": 0,
        "exp": "Cấu trúc 'be confronted with + N' (đối mặt với) rút gọn thành quá khứ phân từ bị động 'Confronted with...'. Sau chỗ trống có giới từ 'with' (không có tân ngữ trực tiếp) → chọn 'Confronted'."
      },
      {
        "q": "_____ enough feedback from beta testers, the engineering lead postponed the public software release.",
        "opts": [
          "Not received",
          "Not having received",
          "Did not receive",
          "Having not been received"
        ],
        "ans": 1,
        "exp": "'The engineering lead' chủ động không nhận đủ phản hồi (có tân ngữ 'enough feedback') trước khi hoãn lịch → chọn 'Not having received'. Loại 'Not received' và 'Having not been received' (bị động), 'Did not receive' (thiếu chủ ngữ và liên từ)."
      },
      {
        "q": "_____ carefully according to the manufacturer's instructions, the espresso machine will operate smoothly for years.",
        "opts": [
          "Maintaining",
          "Having maintained",
          "To maintain",
          "Maintained"
        ],
        "ans": 3,
        "exp": "Chủ ngữ sau dấu phẩy là 'the espresso machine' (máy pha cà phê) ĐƯỢC bảo dưỡng (bị động: 'If it is maintained carefully...') → chọn 'Maintained'. Ba phương án còn lại đều mang nghĩa chủ động hoặc mục đích sai chủ ngữ."
      }
    ]
  },
  {
    "id": "tg_30",
    "order": 30,
    "level": 3,
    "unitTitle": "Chặng 3 • MĐQH rút gọn, Phân từ, Điều kiện & Từ nối (550–750)",
    "category": "Mệnh đề danh ngữ",
    "partTag": "Part 5–6",
    "title": "Mệnh đề Danh ngữ (that / what / whether / whoever)",
    "speedTip": "Mẹo 5 giây: Mệnh đề danh ngữ làm Chủ ngữ luôn đi với Động từ SỐ ÍT; chọn 'that' khi mệnh đề sau ĐỦ, chọn 'what' khi THIẾU S/O, chọn 'whether' khi có 'or not' hoặc đứng đầu câu/sau giới từ!",
    "formula": "That + S + V(đủ) + V(số ít)  |  What + (S) + V(thiếu S/O)  |  Whether + S + V (+ or not)  |  Whoever/Whatever + V",
    "summary": "Mệnh đề danh ngữ (Noun Clauses) hoạt động hệt như một danh từ số ít: làm chủ ngữ, tân ngữ sau động từ tường thuật/nhận thức hoặc tân ngữ sau giới từ. TOEIC kiểm tra dày đặc 4 cặp dễ nhầm: that vs what, whether vs if, whoever vs whomever, và hòa hợp động từ số ít.",
    "theorySections": [
      {
        "heading": "1. Phân biệt 'that' và 'what' trong 3 giây",
        "bullets": [
          "that + mệnh đề ĐẦY ĐỦ (không thiếu S hay O): Management announced that the merger had been finalized.",
          "what (= the thing that) + mệnh đề THIẾU S hoặc O: Please clarify what caused the shipping delay (thiếu S) / Tell us what the client requested (thiếu O).",
          "Lưu ý vàng: 'what' KHÔNG BAO GIỜ đứng sau danh từ làm đại từ quan hệ (sai: 'the policy what...')."
        ]
      },
      {
        "heading": "2. Khi nào BẮT BUỘC dùng 'whether' thay vì 'if'",
        "bullets": [
          "Đứng đầu câu làm chủ ngữ: Whether the branch stays open depends on quarterly sales (KHÔNG dùng If).",
          "Đứng ngay sau giới từ: They are debating about whether the discount applies to bulk orders.",
          "Đứng trước 'or not' viết liền nhau (whether or not) hoặc trước 'to-V' (decide whether to lease or buy)."
        ]
      },
      {
        "heading": "3. Đại từ quan hệ ghép: whoever / whatever / whichever",
        "bullets": [
          "whoever (= anyone who) làm chủ ngữ cho động từ theo sau: Whoever finishes the inventory check first should lock the storage room.",
          "whichever + (N): chọn từ một nhóm phương án giới hạn/có sẵn (choose whichever schedule suits your team); whatever: bất cứ thứ gì không giới hạn."
        ]
      }
    ],
    "examples": [
      {
        "en": "<b>Whether</b> the proposed renovation fits within this year's budget remains uncertain.",
        "vi": "Liệu đợt cải tạo được đề xuất có nằm trong ngân sách năm nay hay không vẫn chưa chắc chắn.",
        "note": "Mệnh đề danh ngữ đứng đầu câu làm chủ ngữ → bắt buộc dùng 'Whether' (không dùng 'If') và chia động từ số ít 'remains'."
      },
      {
        "en": "The survey reveals <b>what</b> customers value most when selecting a cloud storage provider.",
        "vi": "Cuộc khảo sát tiết lộ điều mà khách hàng coi trọng nhất khi chọn nhà cung cấp lưu trữ đám mây.",
        "note": "Động từ 'value' đang thiếu tân ngữ (value what?) và không có danh từ đứng trước → chọn 'what'."
      },
      {
        "en": "<b>Whoever</b> is appointed to lead the Tokyo office will relocate in September.",
        "vi": "Bất kỳ ai được bổ nhiệm dẫn dắt văn phòng Tokyo sẽ chuyển công tác vào tháng Chín.",
        "note": "Chỗ trống làm chủ ngữ của động từ 'is appointed' (chỉ người bất kỳ) → chọn 'Whoever'."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The HR department confirmed what the new health plan takes effect next month.",
        "right": "The HR department confirmed <b>that</b> the new health plan takes effect next month.",
        "exp": "Mệnh đề 'the new health plan takes effect next month' đã đầy đủ S-V-O, không thiếu thành phần nào → phải dùng 'that', không dùng 'what'."
      },
      {
        "wrong": "If the contract will be renewed or not has not been decided yet.",
        "right": "<b>Whether</b> the contract will be renewed or not has not been decided yet.",
        "exp": "Không được dùng 'If' mở đầu mệnh đề danh ngữ làm chủ ngữ ở đầu câu → phải dùng 'Whether'."
      }
    ],
    "quiz": [
      {
        "q": "The operations team has not yet determined _____ the new automated conveyor system will arrive on schedule.",
        "opts": [
          "whether",
          "what",
          "whoever",
          "which"
        ],
        "ans": 0,
        "exp": "Động từ 'determined' (xác định xem liệu...) kết hợp với mệnh đề đầy đủ 'the new automated conveyor system will arrive on schedule' mang nghĩa phân vân có hay không → chọn 'whether'. Loại 'what' (phải thiếu S/O), 'whoever' (chỉ người), 'which' (chọn lựa trong nhóm)."
      },
      {
        "q": "_____ impressed the panel of judges most was the candidate's clear strategy for reducing logistics costs.",
        "opts": [
          "That",
          "Which",
          "What",
          "Whether"
        ],
        "ans": 2,
        "exp": "Đứng ngay trước động từ 'impressed' (thiếu chủ ngữ) để tạo thành cụm danh ngữ 'Điều gây ấn tượng nhất với ban giám khảo là...' → chọn 'What'. Loại 'That' và 'Whether' (cần S+V đầy đủ), 'Which' (không có tiền ngữ hay lựa chọn sẵn)."
      },
      {
        "q": "Please forward the revised press release to _____ is currently handling media inquiries at headquarters.",
        "opts": [
          "whomever",
          "whoever",
          "whose",
          "whatever"
        ],
        "ans": 1,
        "exp": "Dù đứng sau giới từ 'to', cả mệnh đề danh ngữ mới là tân ngữ của 'to', còn bên trong mệnh đề chỗ trống làm CHỦ NGỮ của động từ 'is currently handling' → bắt buộc chọn 'whoever' (không phải 'whomever'). Loại 'whatever' (chỉ vật) và 'whose' (sở hữu)."
      },
      {
        "q": "That all regional branches exceeded their quarterly revenue targets _____ a remarkable achievement.",
        "opts": [
          "are",
          "were",
          "have been",
          "is"
        ],
        "ans": 3,
        "exp": "Chủ ngữ là cả mệnh đề danh ngữ 'That all regional branches exceeded their quarterly revenue targets' → luôn chia động từ SỐ ÍT → chọn 'is'. Các đáp án 'are', 'were', 'have been' đều là động từ số nhiều (bẫy nhìn vào danh từ số nhiều 'targets' ngay trước chỗ trống)."
      },
      {
        "q": "Board members discussed the proposal at length before deciding _____ to expand into the European market.",
        "opts": [
          "if",
          "that",
          "whether",
          "what"
        ],
        "ans": 2,
        "exp": "Trước cụm nguyên mẫu 'to-V' ('to expand') để chỉ sự cân nhắc nên làm hay không, chỉ dùng được 'whether to-V', KHÔNG dùng 'if to-V' hay 'that to-V'. Loại 'what' vì 'expand' không thiếu tân ngữ."
      },
      {
        "q": "The client requested _____ our accounting department send an itemized breakdown of the consulting fees.",
        "opts": [
          "that",
          "what",
          "which",
          "whom"
        ],
        "ans": 0,
        "exp": "Mệnh đề sau chỗ trống 'our accounting department send an itemized breakdown...' đã đủ S-V-O (kết hợp thức giả định 'send'), bổ ngữ cho động từ 'requested' → chọn 'that'. Loại 'what', 'which', 'whom' vì mệnh đề không thiếu chủ hay tân ngữ."
      }
    ]
  },
  {
    "id": "tg_31",
    "order": 31,
    "level": 3,
    "unitTitle": "Chặng 3 • MĐQH rút gọn, Phân từ, Điều kiện & Từ nối (550–750)",
    "category": "Câu điều kiện",
    "partTag": "Part 5–6",
    "title": "Câu Điều kiện Loại 1–2–3 Thương mại",
    "speedTip": "Mẹo 5 giây: Nhìn vế CÒN LẠI để khớp cặp thì: will/can/V-bare (mệnh lệnh) ↔ HTĐ (Loại 1); would + V ↔ QKĐ/were (Loại 2); would have V3 ↔ had V3 (Loại 3). Cấm dùng will/would trong vế If!",
    "formula": "Loại 1: If + HTĐ, S + will/can/should + V  |  Loại 2: If + QKĐ(were), S + would/could + V  |  Loại 3: If + had V3, S + would/could have V3",
    "summary": "Câu điều kiện trong TOEIC luôn gắn với bối cảnh đàm phán, chính sách hoàn tiền, lịch giao hàng và rút kinh nghiệm dự án quá khứ. Chỉ cần nhận diện đúng động từ ở vế đã cho là bạn giải được câu điều kiện trong dưới 5 giây.",
    "theorySections": [
      {
        "heading": "1. Điều kiện Loại 0 & Loại 1 (Quy định & Khả năng thực tế)",
        "bullets": [
          "Loại 0 (chính sách luôn đúng): If + HTĐ, S + HTĐ (If an order exceeds $500, shipping is free).",
          "Loại 1 (có thể xảy ra ở hiện tại/tương lai): If + HTĐ, S + will/can/may/should + V-bare — hoặc mệnh đề chính ở dạng câu mệnh lệnh (please contact our help desk).",
          "Bẫy lớn nhất: Tuyệt đối KHÔNG chia 'will' trong mệnh đề chứa 'If' (sai: 'If the client will approve...')."
        ]
      },
      {
        "heading": "2. Điều kiện Loại 2 (Giả định trái hiện tại / Đề xuất lịch sự)",
        "bullets": [
          "Cấu trúc: If + S + V2/ed (động từ 'to be' ưu tiên dùng 'were' cho mọi ngôi), S + would/could/might + V-bare.",
          "Dùng khi giả định tình huống chưa có thật lúc này (ví dụ: If our warehouse were closer to the port, transportation costs would drop significantly)."
        ]
      },
      {
        "heading": "3. Điều kiện Loại 3 & Điều kiện Hỗn hợp (Tiếc nuối quá khứ)",
        "bullets": [
          "Loại 3 (trái sự thật quá khứ): If + S + had + V3/ed, S + would/could/might + have + V3/ed (ví dụ: If we had inspected the batch earlier, we would have avoided the recall).",
          "Điều kiện hỗn hợp (Mixed): If + had V3 (quá khứ), S + would + V-bare + now/today (kết quả ở hiện tại)."
        ]
      }
    ],
    "examples": [
      {
        "en": "If the shipment <b>arrives</b> after 4:00 P.M., please notify the night-shift supervisor immediately.",
        "vi": "Nếu lô hàng đến sau 4 giờ chiều, vui lòng thông báo ngay cho giám sát ca đêm.",
        "note": "Mệnh đề chính là câu mệnh lệnh 'please notify' → Điều kiện loại 1, vế If chia hiện tại đơn 'arrives'."
      },
      {
        "en": "If the company <b>had invested</b> in cloud backups earlier, it would have prevented last week's data outage.",
        "vi": "Nếu công ty đầu tư vào sao lưu đám mây sớm hơn, họ đã ngăn chặn được sự cố mất dữ liệu tuần trước.",
        "note": "Vế chính có 'would have prevented' → Điều kiện loại 3, vế If chia quá khứ hoàn thành 'had invested'."
      },
      {
        "en": "We <b>would expand</b> our customer support hours if we had sufficient staff on the evening shift.",
        "vi": "Chúng tôi sẽ mở rộng giờ hỗ trợ khách hàng nếu có đủ nhân sự cho ca tối.",
        "note": "Vế If có quá khứ đơn 'had' (trái hiện tại) → Điều kiện loại 2, vế chính dùng 'would expand'."
      }
    ],
    "pitfalls": [
      {
        "wrong": "If you will register before May 10, you will receive a twenty-percent early-bird discount.",
        "right": "If you <b>register</b> before May 10, you will receive a twenty-percent early-bird discount.",
        "exp": "Không dùng 'will' trong mệnh đề điều kiện bắt đầu bằng 'If'; phải chia hiện tại đơn 'register'."
      },
      {
        "wrong": "If the technician would have replaced the valve yesterday, the pipeline would not have leaked.",
        "right": "If the technician <b>had replaced</b> the valve yesterday, the pipeline would not have leaked.",
        "exp": "Mệnh đề If loại 3 dùng 'had + V3/ed', tuyệt đối không dùng 'would have + V3' trong mệnh đề If."
      }
    ],
    "quiz": [
      {
        "q": "If the client _____ the revised contract by noon, the legal team can finalize the paperwork today.",
        "opts": [
          "will sign",
          "signs",
          "signed",
          "had signed"
        ],
        "ans": 1,
        "exp": "Mệnh đề chính dùng 'can finalize ... today' (Điều kiện loại 1 có thật ở hiện tại/tương lai) → mệnh đề If chia hiện tại đơn 'signs'. Loại 'will sign' (không dùng will sau If), 'signed' (loại 2), 'had signed' (loại 3)."
      },
      {
        "q": "If the printing vendor had notified us of the paper shortage sooner, we _____ an alternative supplier.",
        "opts": [
          "will contact",
          "would contact",
          "had contacted",
          "would have contacted"
        ],
        "ans": 3,
        "exp": "Mệnh đề If chia quá khứ hoàn thành 'had notified' (Điều kiện loại 3 trái quá khứ) → mệnh đề chính phải là 'would have + V3/ed' → chọn 'would have contacted'."
      },
      {
        "q": "If Ms. Alvarez _____ more time before the trade show, she would redesign all the product brochures.",
        "opts": [
          "had",
          "has",
          "will have",
          "had had"
        ],
        "ans": 0,
        "exp": "Mệnh đề chính dùng 'would redesign' (Điều kiện loại 2 giả định hiện tại) → mệnh đề If chia quá khứ đơn 'had'. Loại 'has' (loại 1), 'will have' (sai sau If), 'had had' (loại 3)."
      },
      {
        "q": "If you experience any technical issues during the webinar, _____ the support desk via live chat.",
        "opts": [
          "contacting",
          "contacted",
          "contact",
          "will contact"
        ],
        "ans": 2,
        "exp": "Mệnh đề chính không có chủ ngữ riêng và mệnh đề If ở hiện tại đơn ('experience') → đây là câu điều kiện loại 1 kết hợp câu mệnh lệnh lịch sự → chọn động từ nguyên mẫu 'contact'."
      },
      {
        "q": "Had we known about the flight cancellation, we would have rescheduled — or, if the train _____ still running, we could take it now.",
        "opts": [
          "had been",
          "was being",
          "will be",
          "were"
        ],
        "ans": 3,
        "exp": "Vế sau là điều kiện loại 2 giả định ngay lúc này ('could take it now') → với động từ 'to be' trong mệnh đề If loại 2 chuẩn văn viết ETS, chọn 'were'."
      },
      {
        "q": "Our logistics expenses would have been significantly lower if the parcels _____ by standard ground shipping.",
        "opts": [
          "sent",
          "had been sent",
          "were sent",
          "would be sent"
        ],
        "ans": 1,
        "exp": "Vế chính có 'would have been' (Điều kiện loại 3) và 'the parcels' (bưu kiện) ở thể bị động (được gửi) → mệnh đề If phải dùng quá khứ hoàn thành bị động 'had been sent'."
      }
    ]
  },
  {
    "id": "tg_32",
    "order": 32,
    "level": 3,
    "unitTitle": "Chặng 3 • MĐQH rút gọn, Phân từ, Điều kiện & Từ nối (550–750)",
    "category": "Câu điều kiện",
    "partTag": "Part 5–6",
    "title": "Từ thay thế If (unless / provided that / as long as / in case / otherwise)",
    "speedTip": "Mẹo 5 giây: Phân biệt theo NGHĨA & CẤU TRÚC — 'unless' = nếu không (+ khẳng định); 'provided that / as long as' = miễn là; 'in case' (+ S+V) vs 'in case of' (+ N); 'otherwise' đứng sau dấu chấm/chấm phẩy!",
    "formula": "Unless / Provided (that) / As long as / In case + S + V  |  In case of / In the event of + N  |  S+V; otherwise, S+will/would+V",
    "summary": "ETS rất thích thay 'If' bằng các liên từ điều kiện thương mại trang trọng để kiểm tra đồng thời vốn từ ngữ cảnh và cấu trúc theo sau (mệnh đề vs cụm danh từ). Đây là nhóm điểm dễ ăn chắc 100% nếu thuộc bộ 5 công thức chuẩn.",
    "theorySections": [
      {
        "heading": "1. Nhóm 'Miễn là / Với điều kiện là' (= If)",
        "bullets": [
          "Provided (that) / Providing (that) / As long as / So long as / On condition that + S + V: dùng trong điều khoản hợp đồng, bảo hành, hoàn tiền.",
          "Ví dụ: Full refunds are issued provided that items are returned unopened within 14 days."
        ]
      },
      {
        "heading": "2. 'Unless' (Trừ khi = If ... not) & Bẫy phủ định kép",
        "bullets": [
          "Unless mang sẵn nghĩa phủ định nên mệnh đề sau nó thường ở thể khẳng định (Unless otherwise stated = trừ khi có quy định khác).",
          "Kiểm tra nhanh: thay 'unless' bằng 'nếu không' xem câu có hợp lý với bối cảnh không."
        ]
      },
      {
        "heading": "3. 'In case' vs 'In case of' & Trạng từ 'Otherwise'",
        "bullets": [
          "In case / In the event that + S + V (phòng khi / trong trường hợp) ≠ In case of / In the event of + Cụm danh từ (In case of fire / In the event of a power outage).",
          "Otherwise (nếu không thì): là TRẠNG TỪ LIÊN KẾT, đứng đầu câu mới hoặc sau dấu chấm phẩy/dấu phẩy đi kèm 'or', không làm liên từ nối trực tiếp hai mệnh đề ở đầu câu."
        ]
      }
    ],
    "examples": [
      {
        "en": "The warranty remains valid for two years <b>provided that</b> the device is serviced only by authorized technicians.",
        "vi": "Chế độ bảo hành vẫn còn hiệu lực trong hai năm miễn là thiết bị chỉ được bảo trì bởi kỹ thuật viên ủy quyền.",
        "note": "'Provided that' (= miễn là) nối điều kiện tích cực với mệnh đề S+V."
      },
      {
        "en": "No visitors may enter the laboratory <b>unless</b> they are accompanied by a staff member.",
        "vi": "Không khách tham quan nào được vào phòng thí nghiệm trừ khi họ có nhân viên đi cùng.",
        "note": "'Unless' (= nếu không) phù hợp logic cấm đoán ở mệnh đề chính."
      },
      {
        "en": "Please submit your travel voucher by Friday; <b>otherwise</b>, reimbursement will be postponed until next month.",
        "vi": "Vui lòng nộp chứng từ công tác trước thứ Sáu; nếu không thì khoản hoàn ứng sẽ bị hoãn đến tháng sau.",
        "note": "Sau dấu chấm phẩy và trước dấu phẩy chỉ hệ quả ngược lại → chọn trạng từ liên kết 'otherwise'."
      }
    ],
    "pitfalls": [
      {
        "wrong": "In case of the train is delayed, please call the reception desk.",
        "right": "<b>In case</b> the train is delayed, please call the reception desk.",
        "exp": "Sau chỗ trống là mệnh đề S+V ('the train is delayed'), phải dùng liên từ 'In case' hoặc 'In the event that', không dùng giới từ 'In case of'."
      },
      {
        "wrong": "The outdoor gala will proceed as scheduled unless it does not rain.",
        "right": "The outdoor gala will proceed as scheduled <b>unless</b> it rains.",
        "exp": "'Unless' đã mang nghĩa 'nếu không', thêm 'does not' sẽ gây lỗi phủ định kép làm ngược nghĩa câu."
      }
    ],
    "quiz": [
      {
        "q": "Employees may carry over up to five unused vacation days _____ they obtain written approval from their supervisor.",
        "opts": [
          "unless",
          "otherwise",
          "provided that",
          "in case of"
        ],
        "ans": 2,
        "exp": "Bối cảnh điều kiện tích cực: 'miễn là họ có phê duyệt bằng văn bản' + theo sau là mệnh đề S+V → chọn 'provided that'. Loại 'unless' (ngược nghĩa), 'otherwise' (không làm liên từ nối), 'in case of' (cần cụm danh từ)."
      },
      {
        "q": "Access to the executive lounge is restricted _____ you hold a gold-tier membership card.",
        "opts": [
          "unless",
          "as long as",
          "in the event of",
          "otherwise"
        ],
        "ans": 0,
        "exp": "Mệnh đề chính nói quyền vào phòng chờ 'bị hạn chế' (restricted) → logic đúng là 'trừ khi bạn có thẻ hội viên hạng vàng' → chọn 'unless'. Loại 'as long as' (ngược nghĩa), 'in the event of' (+ N), 'otherwise' (trạng từ)."
      },
      {
        "q": "_____ a severe weather emergency, all regional distribution centers will follow the evacuation protocol.",
        "opts": [
          "In case",
          "Unless",
          "Provided that",
          "In the event of"
        ],
        "ans": 3,
        "exp": "Sau chỗ trống là cụm danh từ 'a severe weather emergency' (không có động từ chia thì) → bắt buộc chọn cụm giới từ 'In the event of'. Ba đáp án còn lại đều là liên từ đòi hỏi S+V."
      },
      {
        "q": "All participants must confirm their attendance by Tuesday; _____, their seats will be reassigned to the waitlist.",
        "opts": [
          "unless",
          "otherwise",
          "provided",
          "in case"
        ],
        "ans": 1,
        "exp": "Đứng giữa dấu chấm phẩy (;) và dấu phẩy (,) diễn tả hệ quả nếu không làm vế trước → chọn trạng từ liên kết 'otherwise' (nếu không thì). Ba phương án còn lại là liên từ không đứng độc lập trước dấu phẩy kiểu này."
      },
      {
        "q": "Keep a printed copy of the boarding pass in your briefcase _____ the airport scanner fails to read your phone.",
        "opts": [
          "in case",
          "in case of",
          "otherwise",
          "unless"
        ],
        "ans": 0,
        "exp": "Nghĩa câu là 'phòng khi máy quét sân bay không đọc được điện thoại' + theo sau là mệnh đề S+V → chọn 'in case'. Loại 'in case of' (+ N), 'otherwise' (trạng từ), 'unless' (sai nghĩa)."
      },
      {
        "q": "The vendor agreed to maintain current wholesale prices _____ we commit to a minimum quarterly order of 2,000 units.",
        "opts": [
          "unless",
          "otherwise",
          "as long as",
          "in the event of"
        ],
        "ans": 2,
        "exp": "Điều kiện để nhà cung cấp giữ nguyên giá sỉ là 'miễn là chúng ta cam kết đặt tối thiểu 2.000 sản phẩm mỗi quý' + mệnh đề S+V → chọn 'as long as'. Loại 'unless' (ngược nghĩa), 'otherwise' (sai vị trí cú pháp), 'in the event of' (+ N)."
      }
    ]
  },
  {
    "id": "tg_33",
    "order": 33,
    "level": 3,
    "unitTitle": "Chặng 3 • MĐQH rút gọn, Phân từ, Điều kiện & Từ nối (550–750)",
    "category": "Liên từ & Giới từ",
    "partTag": "Part 5–6",
    "title": "Trạng từ liên kết Part 5–6 (however / therefore / nevertheless / furthermore / meanwhile)",
    "speedTip": "Mẹo 5 giây: Thấy dấu chấm (.) hoặc chấm phẩy (;) rồi đến CHỖ TRỐNG + DẤU PHẨY (,) → 95% là Trạng từ liên kết (LOẠI ngay liên từ although/because/but và giới từ despite/due to), sau đó chốt nghĩa 2 câu!",
    "formula": "Câu 1. [Trạng từ nối], Câu 2.  |  Mệnh đề 1; [Trạng từ nối], Mệnh đề 2.  |  S, [Trạng từ nối], V...",
    "summary": "Trạng từ liên kết (Conjunctive Adverbs) là mạch máu của TOEIC Part 6 và cũng xuất hiện đều đặn trong Part 5. Chìa khóa đạt điểm tối đa là phân biệt rạch ròi dấu câu của Trạng từ nối với Liên từ/Giới từ và nắm chắc 5 nhóm quan hệ logic.",
    "theorySections": [
      {
        "heading": "1. Dấu hiệu cú pháp để loại nhanh Liên từ & Giới từ",
        "bullets": [
          "Trạng từ liên kết đứng tách biệt bằng dấu phẩy ở đầu câu mới (However, ...), sau dấu chấm phẩy (; therefore, ...), hoặc kẹp giữa chủ ngữ và động từ (The plan, however, was delayed).",
          "KHÔNG BAO GIỜ dùng dấu phẩy đơn để nối 2 mệnh đề bằng trạng từ liên kết (sai: 'Sales rose, however profits fell' → phải đổi thành '; however,' hoặc dùng 'but').",
          "Ngược lại, liên từ phụ thuộc (although, because) KHÔNG đứng một mình trước dấu phẩy (sai: 'Although, sales rose')."
        ]
      },
      {
        "heading": "2. Bốn nhóm nghĩa trọng tâm trong Email & Thông báo ETS",
        "bullets": [
          "Tương phản / Nhượng bộ: however (tuy nhiên), nevertheless / nonetheless (tuy thế mà vẫn), instead (thay vào đó), conversely (ngược lại).",
          "Kết quả / Hệ quả: therefore / consequently / thus / accordingly / as a result (do đó, vì vậy).",
          "Bổ sung ý cùng chiều: furthermore / moreover / in addition / additionally (hơn nữa, ngoài ra).",
          "Thời gian song song / Trình tự: meanwhile (trong lúc đó), subsequently / afterward (sau đó)."
        ]
      },
      {
        "heading": "3. Bẫy phân biệt 'however' vs 'therefore' vs 'instead' trong Part 6",
        "bullets": [
          "Đọc nhanh câu đứng TRƯỚC và câu đứng SAU chỗ trống: cùng chiều tích cực/tiêu cực → furthermore/moreover; nguyên nhân → kết quả → therefore/consequently; trái chiều mong đợi → however/nevertheless; hủy phương án A làm phương án B → instead."
        ]
      }
    ],
    "examples": [
      {
        "en": "The software upgrade was expected to take two hours; <b>however</b>, technicians completed it in just forty minutes.",
        "vi": "Bản nâng cấp phần mềm dự kiến mất hai giờ; tuy nhiên, các kỹ thuật viên đã hoàn tất chỉ trong bốn mươi phút.",
        "note": "Sau dấu chấm phẩy, trước dấu phẩy và hai vế đối lập thời gian → chọn 'however'."
      },
      {
        "en": "Demand for electric bicycles rose sharply in Q2. <b>Consequently</b>, the factory added a third assembly shift.",
        "vi": "Nhu cầu xe đạp điện tăng mạnh trong quý 2. Do đó, nhà máy đã bổ sung thêm ca lắp ráp thứ ba.",
        "note": "Câu 1 là nguyên nhân (nhu cầu tăng), câu 2 là kết quả (tăng ca) → chọn 'Consequently'."
      },
      {
        "en": "The marketing team is finalizing the ad campaign. <b>Meanwhile</b>, the IT group is testing the new checkout page.",
        "vi": "Đội tiếp thị đang hoàn thiện chiến dịch quảng cáo. Trong lúc đó, nhóm CNTT đang kiểm thử trang thanh toán mới.",
        "note": "Hai hoạt động diễn ra đồng thời song song → chọn 'Meanwhile'."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The supplier missed the delivery deadline, therefore, we incurred a penalty fee.",
        "right": "The supplier missed the delivery deadline; <b>therefore</b>, we incurred a penalty fee.",
        "exp": "'Therefore' là trạng từ liên kết, không nối được hai mệnh đề chỉ bằng dấu phẩy; phải dùng dấu chấm phẩy (;) hoặc tách thành câu mới."
      },
      {
        "wrong": "Despite, the outdoor concert was postponed due to high winds.",
        "right": "<b>Consequently</b>, the outdoor concert was postponed due to high winds.",
        "exp": "'Despite' là giới từ (phải có cụm danh từ ngay sau), không thể đứng độc lập trước dấu phẩy như trạng từ liên kết."
      }
    ],
    "quiz": [
      {
        "q": "The keynote speaker's flight was delayed by three hours; _____, the conference organizers rearranged the morning schedule.",
        "opts": [
          "however",
          "despite",
          "although",
          "therefore"
        ],
        "ans": 3,
        "exp": "Sau dấu chấm phẩy và trước dấu phẩy phải là trạng từ liên kết → loại liên từ 'although' và giới từ 'despite'. Chuyến bay bị hoãn (nguyên nhân) dẫn đến việc sắp xếp lại lịch (kết quả) → chọn 'therefore'."
      },
      {
        "q": "The new ergonomic chairs cost more than standard office models. _____, they come with a ten-year warranty and reduce employee fatigue.",
        "opts": [
          "Because",
          "Nevertheless",
          "Even though",
          "Unless"
        ],
        "ans": 1,
        "exp": "Đứng đầu câu trước dấu phẩy cần trạng từ liên kết → loại ngay 'Because', 'Even though', 'Unless'. Vế trước nêu nhược điểm (giá cao), vế sau nêu ưu điểm bù đắp → chọn 'Nevertheless' (tuy nhiên/dù vậy)."
      },
      {
        "q": "The renovated flagship store features an expanded showroom. _____, it includes a dedicated repair counter for express service.",
        "opts": [
          "Otherwise",
          "Instead",
          "Furthermore",
          "Conversely"
        ],
        "ans": 2,
        "exp": "Cả hai câu đều bổ sung tiện ích cùng chiều cho cửa hàng mới cải tạo → chọn trạng từ bổ sung 'Furthermore' (hơn nữa). Loại 'Otherwise' (nếu không thì), 'Instead' (thay vào đó), 'Conversely' (ngược lại)."
      },
      {
        "q": "The main elevator will be closed for inspection until 3:00 P.M. _____, please use the freight lift at the east corridor.",
        "opts": [
          "Meanwhile",
          "Consequently",
          "Moreover",
          "Although"
        ],
        "ans": 0,
        "exp": "Ngữ cảnh chỉ việc làm tạm thời 'trong lúc thang máy chính đang bảo trì' → chọn 'Meanwhile' (trong lúc đó). Loại 'Although' (liên từ không đứng trước dấu phẩy), 'Moreover' (bổ sung), 'Consequently' (kém sát mốc thời gian song song hơn 'Meanwhile')."
      },
      {
        "q": "The board decided not to open a second branch in Osaka. _____, it will invest those funds in strengthening online distribution.",
        "opts": [
          "Besides",
          "Instead",
          "Since",
          "While"
        ],
        "ans": 1,
        "exp": "Câu 1 phủ định phương án A (không mở chi nhánh thứ hai), câu 2 đưa ra phương án B thay thế (đầu tư phân phối trực tuyến) → chọn 'Instead' (thay vào đó). Loại liên từ 'Since', 'While' và 'Besides' (bổ sung)."
      },
      {
        "q": "Several trainees struggled with the accounting module; the overall pass rate, _____, reached an all-time high of 94 percent.",
        "opts": [
          "therefore",
          "thus",
          "moreover",
          "however"
        ],
        "ans": 3,
        "exp": "Kẹp giữa hai dấu phẩy để nối hai vế đối lập (nhiều học viên gặp khó khăn >< tỷ lệ đỗ đạt mức cao kỷ lục 94%) → chọn 'however'. Loại 'therefore/thus' (kết quả) và 'moreover' (bổ sung)."
      }
    ]
  },
  {
    "id": "tg_34",
    "order": 34,
    "level": 3,
    "unitTitle": "Chặng 3 • MĐQH rút gọn, Phân từ, Điều kiện & Từ nối (550–750)",
    "category": "Cấu trúc câu",
    "partTag": "Part 5–6",
    "title": "Cấu trúc Song song (Parallelism)",
    "speedTip": "Mẹo 5 giây: Thấy and / or / but / both...and / not only...but also / rather than → soi ngay từ loại/dạng thức ở vế ĐÃ CHO (V-ing, to-V, V-ed, N, Adj, Adv) và chọn đáp án GIỐNG HỆT dạng đó!",
    "formula": "A and/or/but B (cùng từ loại)  |  A, B, and C  |  not only A but also B  |  both A and B  |  A rather than B",
    "summary": "Cấu trúc song song là quy tắc thẩm mỹ và ngữ pháp chuẩn mực trong văn bản doanh nghiệp (mô tả công việc, bản tin sản phẩm, báo cáo). Nắm chắc quy tắc đối xứng giúp bạn giải nhanh hàng loạt câu từ loại và dạng động từ mà không cần dịch toàn câu.",
    "theorySections": [
      {
        "heading": "1. Song song với Liên từ kết hợp (and, or, but) & Chuỗi liệt kê",
        "bullets": [
          "Tất cả các phần tử trong chuỗi A, B, and C phải đồng nhất dạng ngữ pháp: Danh từ với Danh từ, Tính từ với Tính từ, V-ing với V-ing, Động từ cùng thì với Động từ cùng thì.",
          "Ví dụ: The assistant is responsible for scheduling meetings, preparing budgets, and coordinating travel (3 cụm V-ing)."
        ]
      },
      {
        "heading": "2. Song song với Liên từ tương quan & Cấu trúc thay thế",
        "bullets": [
          "both A and B | either A or B | neither A nor B | not only A but also B: hai vế A và B phải ngang hàng tuyệt đối.",
          "rather than / as well as / instead of: ví dụ 'prefer to train existing staff rather than hire outside consultants' (V-bare ↔ V-bare)."
        ]
      },
      {
        "heading": "3. Bẫy động từ chia chung Trợ động từ & 'to' ẩn",
        "bullets": [
          "Khi dùng chung 'will / should / must / to', vế sau 'and' thường lược bỏ trợ động từ/to nhưng vẫn giữ nguyên V-bare: The app lets users track invoices and (to) generate tax summaries.",
          "Cẩn thận bẫy đổi chủ thể: chỉ được song song những thành phần thực sự cùng cấp trong câu."
        ]
      }
    ],
    "examples": [
      {
        "en": "The ideal candidate must be detail-oriented, proactive, and <b>adaptable</b> to changing priorities.",
        "vi": "Ứng viên lý tưởng phải chú trọng tiểu tiết, chủ động và dễ thích nghi với các ưu tiên thay đổi.",
        "note": "Chuỗi 3 tính từ sau 'must be': detail-oriented (Adj), proactive (Adj), and adaptable (Adj)."
      },
      {
        "en": "Our logistics upgrade aims to reduce delivery times and <b>lower</b> operational expenses.",
        "vi": "Đợt nâng cấp hậu cần của chúng tôi nhằm giảm thời gian giao hàng và hạ thấp chi phí vận hành.",
        "note": "Dùng chung 'to': aims to [reduce ... and lower ...] (hai động từ nguyên mẫu song song)."
      },
      {
        "en": "Customers can pay either by corporate credit card or <b>through</b> direct bank transfer.",
        "vi": "Khách hàng có thể thanh toán bằng thẻ tín dụng doanh nghiệp hoặc thông qua chuyển khoản ngân hàng trực tiếp.",
        "note": "Song song 2 cụm giới từ sau 'either ... or': by corporate credit card ↔ through direct bank transfer."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The workshop covers contract negotiation, risk assessment, and how to resolve disputes.",
        "right": "The workshop covers contract negotiation, risk assessment, and <b>dispute resolution</b>.",
        "exp": "Hai mục đầu là cụm danh từ ('contract negotiation', 'risk assessment') nên mục thứ ba cũng phải là cụm danh từ để bảo đảm tính song song."
      },
      {
        "wrong": "Ms. Cho reviewed the quarterly ledger and preparing a summary for the board.",
        "right": "Ms. Cho reviewed the quarterly ledger and <b>prepared</b> a summary for the board.",
        "exp": "Vế trước là động từ quá khứ đơn 'reviewed' nên sau 'and' phải chia cùng thì 'prepared', không chuyển sang 'preparing'."
      }
    ],
    "quiz": [
      {
        "q": "The newly hired coordinator will be in charge of onboarding interns, updating the database, and _____ weekly status reports.",
        "opts": [
          "compiling",
          "compiled",
          "compile",
          "compilation"
        ],
        "ans": 0,
        "exp": "Sau giới từ 'of' là chuỗi 3 cụm V-ing song song: 'onboarding ..., updating ..., and compiling ...'. Loại 'compile' (V-bare), 'compiled' (V-ed), 'compilation' (N)."
      },
      {
        "q": "Our accounting software was designed to be fast, intuitive, and _____ for small business owners.",
        "opts": [
          "afford",
          "affordably",
          "affordable",
          "affordability"
        ],
        "ans": 2,
        "exp": "Sau 'to be' là chuỗi 3 tính từ: 'fast, intuitive, and affordable'. Loại 'afford' (V), 'affordably' (Adv), 'affordability' (N)."
      },
      {
        "q": "The facility upgrade will not only improve air circulation but also _____ annual energy consumption by 18 percent.",
        "opts": [
          "reduces",
          "reduce",
          "reducing",
          "reduced"
        ],
        "ans": 1,
        "exp": "'will not only [improve] but also [reduce]' dùng chung trợ động từ khuyết thiếu 'will' nên sau 'but also' phải là động từ nguyên mẫu 'reduce'."
      },
      {
        "q": "Technicians inspected the cooling unit thoroughly and _____ two worn valves before restarting the server.",
        "opts": [
          "replace",
          "replacement",
          "replacing",
          "replaced"
        ],
        "ans": 3,
        "exp": "Chủ ngữ 'Technicians' thực hiện hai hành động liên tiếp trong quá khứ nối bằng 'and': 'inspected ... and replaced ...'. Chọn 'replaced'."
      },
      {
        "q": "Management prefers to promote qualified employees from within rather than _____ external executives.",
        "opts": [
          "recruited",
          "recruiting",
          "recruit",
          "recruitment"
        ],
        "ans": 2,
        "exp": "Cấu trúc 'prefer to V1 rather than V2' yêu cầu động từ nguyên mẫu song song với 'promote' → chọn 'recruit'."
      },
      {
        "q": "During the audit, inspectors checked the accuracy of payroll records as well as the _____ of tax filings.",
        "opts": [
          "completeness",
          "completely",
          "complete",
          "completed"
        ],
        "ans": 0,
        "exp": "Sau 'as well as' có cấu trúc 'the _____ of tax filings' song song tuyệt đối với 'the accuracy of payroll records' → cần danh từ 'completeness' (tính đầy đủ)."
      }
    ]
  },
  {
    "id": "tg_35",
    "order": 35,
    "level": 3,
    "unitTitle": "Chặng 3 • MĐQH rút gọn, Phân từ, Điều kiện & Từ nối (550–750)",
    "category": "Động từ",
    "partTag": "Part 5–6",
    "title": "Động từ gây khiến & 5 thành phần (make/keep/find + O + Adj, have/get sth done)",
    "speedTip": "Mẹo 5 giây: Thấy make/keep/find/consider/leave + O + _____ → 90% chọn TÍNH TỪ (không chọn Adv!); thấy have/get + VẬT + _____ → chọn V3/ed (bị động sai khiến)!",
    "formula": "make/keep/find/consider/leave + O + Adj  |  have/make/let + sb + V-bare  |  get + sb + to-V  |  have/get + sth + V3/ed",
    "summary": "Hai cấu trúc động từ 5 thành phần (S-V-O-OC) và thể sai khiến (Causative) là 'mỏ điểm' kinh điển ở Part 5. Người học hay bị bẫy dịch nghĩa tiếng Việt nên chọn nhầm trạng từ đuôi -ly thay vì tính từ bổ ngữ tân ngữ.",
    "theorySections": [
      {
        "heading": "1. Động từ 5 thành phần: V + O + Tính từ (Object Complement)",
        "bullets": [
          "Các động từ kinh điển trong TOEIC: make (làm cho), keep (giữ cho), find (nhận thấy), consider/deem (coi là), leave (để lại tình trạng), render (khiến cho).",
          "Bổ ngữ đứng sau Tân ngữ mô tả trạng thái của chính Tân ngữ đó → PHẢI dùng TÍNH TỪ (Adj), không dùng Trạng từ (Adv). Ví dụ: keep the lobby clean, find the manual helpful.",
          "Trường hợp đặc biệt: keep + sb + informed / updated (V-ed đóng vai trò tính từ bị động)."
        ]
      },
      {
        "heading": "2. Thể sai khiến Chủ động (Nhờ / Bắt / Cho phép AI làm gì)",
        "bullets": [
          "have / make / let + someone + V-bare (nguyên mẫu không 'to'): The manager had an intern verify the invoices.",
          "get + someone + to-V (CÓ 'to'): We got a certified translator to review the agreement.",
          "help + someone + (to) V-bare: chấp nhận cả V-bare lẫn to-V."
        ]
      },
      {
        "heading": "3. Thể sai khiến Bị động (Nhờ CÁI GÌ ĐƯỢC làm)",
        "bullets": [
          "have / get + something + V3/ed: dùng cho cả 'have' lẫn 'get' khi tân ngữ là vật/việc chịu tác động.",
          "Ví dụ: Please have the projector repaired before the board meeting; We need to get our logo trademarked."
        ]
      }
    ],
    "examples": [
      {
        "en": "The new scheduling tool makes daily shift planning much more <b>efficient</b> for store managers.",
        "vi": "Công cụ xếp lịch mới giúp việc lập ca hằng ngày hiệu quả hơn nhiều đối với quản lý cửa hàng.",
        "note": "Cấu trúc 'make + O (daily shift planning) + Adj (efficient)' — không dùng trạng từ 'efficiently'."
      },
      {
        "en": "Please keep our regional sales director <b>informed</b> of any changes to the shipment timetable.",
        "vi": "Vui lòng giữ cho giám đốc kinh doanh khu vực luôn được cập nhật về mọi thay đổi trong lịch giao hàng.",
        "note": "'keep + sb + informed' (phân từ tính từ bị động rất hay ra trong email TOEIC)."
      },
      {
        "en": "Before launching the website, the team will have all product descriptions <b>proofread</b> by a native editor.",
        "vi": "Trước khi ra mắt trang web, nhóm sẽ cho hiệu đính toàn bộ mô tả sản phẩm bởi biên tập viên bản ngữ.",
        "note": "Sai khiến bị động: have + something (all product descriptions) + V3/ed (proofread)."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The clear navigation menu makes the portal easily for first-time visitors.",
        "right": "The clear navigation menu makes the portal <b>accessible</b> for first-time visitors.",
        "exp": "Sau 'make + O' cần tính từ bổ nghĩa cho tân ngữ ('portal'), không dùng trạng từ đuôi -ly ('easily')."
      },
      {
        "wrong": "Ms. Lin got the contractor inspect the ventilation ducts this morning.",
        "right": "Ms. Lin got the contractor <b>to inspect</b> the ventilation ducts this morning.",
        "exp": "Khác với 'have + sb + V-bare', cấu trúc chủ động với 'get' bắt buộc phải có 'to': 'get + sb + to-V'."
      }
    ],
    "quiz": [
      {
        "q": "Most attendees found the keynote speaker's presentation on renewable energy highly _____.",
        "opts": [
          "inform",
          "informative",
          "information",
          "informatively"
        ],
        "ans": 1,
        "exp": "Cấu trúc 'find + O (the presentation) + Adj' (nhận thấy cái gì như thế nào). Trạng từ 'highly' đứng trước bổ nghĩa cho tính từ cần điền → chọn 'informative'. Loại 'informatively' (Adv), 'information' (N), 'inform' (V)."
      },
      {
        "q": "The legal department strongly recommends that the firm have all supplier agreements _____ annually.",
        "opts": [
          "review",
          "to review",
          "reviewing",
          "reviewed"
        ],
        "ans": 3,
        "exp": "Thể sai khiến bị động 'have + something (all supplier agreements) + V3/ed' (cho rà soát các hợp đồng). Tân ngữ là vật chịu tác động → chọn 'reviewed'."
      },
      {
        "q": "To ensure safety, warehouse personnel must keep all emergency exits _____ at all times.",
        "opts": [
          "clear",
          "clearly",
          "clarity",
          "clearing"
        ],
        "ans": 0,
        "exp": "Cấu trúc 'keep + O (all emergency exits) + Adj' (giữ lối thoát hiểm thông thoáng) → chọn tính từ 'clear'. Loại 'clearly' (Adv), 'clarity' (N), 'clearing' (V-ing/N)."
      },
      {
        "q": "The facility director had the maintenance crew _____ the backup generator ahead of the storm season.",
        "opts": [
          "testing",
          "tested",
          "test",
          "to test"
        ],
        "ans": 2,
        "exp": "Thể sai khiến chủ động 'have + someone (the maintenance crew) + V-bare' (nhờ đội bảo trì kiểm tra máy phát điện) → chọn động từ nguyên mẫu 'test'."
      },
      {
        "q": "After several rounds of negotiation, the purchasing agent finally got the vendor _____ the minimum order quantity.",
        "opts": [
          "lower",
          "lowering",
          "lowered",
          "to lower"
        ],
        "ans": 3,
        "exp": "Thể sai khiến chủ động với 'get': 'get + someone (the vendor) + to-V' (thuyết phục nhà cung cấp giảm số lượng đặt tối thiểu) → chọn 'to lower'."
      },
      {
        "q": "Industry analysts consider the company's rapid recovery after the recall truly _____.",
        "opts": [
          "remark",
          "remarkable",
          "remarkably",
          "remarked"
        ],
        "ans": 1,
        "exp": "Cấu trúc 'consider + O (the company's rapid recovery) + Adj' (coi việc gì là đáng kinh ngạc). 'truly' là trạng từ nhấn mạnh cho tính từ đứng sau → chọn 'remarkable'."
      }
    ]
  },
  {
    "id": "tg_36",
    "order": 36,
    "level": 3,
    "unitTitle": "Chặng 3 • MĐQH rút gọn, Phân từ, Điều kiện & Từ nối (550–750)",
    "category": "Đại từ & Lượng từ",
    "partTag": "Part 5–6",
    "title": "Phân biệt other / another / the other / others / the others",
    "speedTip": "Mẹo 5 giây: Có Danh từ sau chỗ trống → loại ngay others & the others! Nếu N số ít → another (bất kỳ) / the other (cái còn lại trong 2); nếu N số nhiều/không đếm được → other!",
    "formula": "another + N(số ít)  |  other + N(số nhiều/KĐĐ)  |  the other + N(số ít/nhiều xác định)  |  others / the others (KHÔNG + N)",
    "summary": "Bộ 5 từ họ 'other' xuất hiện cực kỳ đều đặn trong TOEIC Part 5 và Part 6 nhờ cơ chế phân biệt rạch ròi giữa vai trò Tính từ hạn định (đứng trước danh từ) và Đại từ độc lập (thay thế danh từ).",
    "theorySections": [
      {
        "heading": "1. Nhóm đứng TRƯỚC Danh từ (Hạn định từ)",
        "bullets": [
          "another + N đếm được SỐ ÍT: thêm một cái khác bất kỳ (need another printer, schedule another meeting). Ngoại lệ: another + số đếm + N số nhiều (another two weeks = thêm 2 tuần nữa).",
          "other + N SỐ NHIỀU hoặc N KHÔNG ĐẾM ĐƯỢC: các cái khác nói chung (other departments, other equipment).",
          "the other + N số ít (cái còn lại duy nhất trong cặp 2 cái) HOẶC the other + N số nhiều (tất cả những cái còn lại trong nhóm đã xác định)."
        ]
      },
      {
        "heading": "2. Nhóm đứng ĐỘC LẬP làm Đại từ (KHÔNG có N theo sau)",
        "bullets": [
          "others (= other + N số nhiều): những người/vật khác nói chung (Some delegates arrived early, while others came after lunch).",
          "the others (= the other + N số nhiều): tất cả những người/vật còn lại trong nhóm đã biết tổng số (Three invoices are paid, and the others are pending).",
          "another / the other cũng có thể đứng một mình làm đại từ số ít khi thay cho danh từ số ít vừa nhắc."
        ]
      },
      {
        "heading": "3. Cụm cố định hay gặp trong đề ETS",
        "bullets": [
          "other than (= except for / besides): ngoại trừ (No one other than authorized staff may enter).",
          "each other / one another: lẫn nhau (collaborate with one another).",
          "every other + N số ít: cách một ... một lần (every other Friday = thứ Sáu cách tuần)."
        ]
      }
    ],
    "examples": [
      {
        "en": "If this conference room is fully booked, we can reserve <b>another</b> space on the fourth floor.",
        "vi": "Nếu phòng họp này đã kín lịch, chúng ta có thể đặt một không gian khác ở tầng bốn.",
        "note": "Sau chỗ trống là danh từ đếm được số ít 'space' (một phòng bất kỳ khác) → dùng 'another'."
      },
      {
        "en": "Some participants preferred virtual sessions, whereas <b>others</b> favored in-person networking.",
        "vi": "Một số người tham dự thích các phiên trực tuyến, trong khi những người khác lại ưa kết nối trực tiếp.",
        "note": "Không có danh từ theo sau, chỉ một bộ phận khác chưa xác định hết → dùng đại từ 'others'."
      },
      {
        "en": "Of the two proposals submitted yesterday, one focuses on branding and <b>the other</b> prioritizes supply-chain speed.",
        "vi": "Trong hai đề xuất nộp hôm qua, một bản tập trung vào thương hiệu và bản còn lại ưu tiên tốc độ chuỗi cung ứng.",
        "note": "Nhóm có đúng 2 đối tượng ('two proposals'): một là 'one', cái còn lại duy nhất là 'the other'."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The warranty does not cover damages caused by others accessories.",
        "right": "The warranty does not cover damages caused by <b>other</b> accessories.",
        "exp": "Đã có danh từ số nhiều 'accessories' phía sau nên không được dùng đại từ 'others'; phải dùng hạn định từ 'other'."
      },
      {
        "wrong": "We need other technician to assist with the network installation.",
        "right": "We need <b>another</b> technician to assist with the network installation.",
        "exp": "'technician' là danh từ đếm được số ít mang nghĩa 'thêm một người nữa' → phải dùng 'another', không dùng 'other'."
      }
    ],
    "quiz": [
      {
        "q": "The regional manager asked for _____ week to evaluate the updated marketing metrics before signing off.",
        "opts": [
          "other",
          "others",
          "another",
          "the others"
        ],
        "ans": 2,
        "exp": "Sau chỗ trống là danh từ đếm được số ít 'week' mang nghĩa 'thêm một tuần nữa' → chọn 'another'. Loại 'other' (+ N số nhiều/KĐĐ), 'others' và 'the others' (không đi trước danh từ)."
      },
      {
        "q": "Aside from the Tokyo flagship, all _____ retail outlets in the region reported higher foot traffic last month.",
        "opts": [
          "other",
          "another",
          "others",
          "one another"
        ],
        "ans": 0,
        "exp": "Trước chỗ trống có 'all' và sau chỗ trống là danh từ số nhiều 'retail outlets' → chọn 'other' ('all other + N số nhiều'). Loại 'another' (số ít), 'others' và 'one another' (đại từ không đứng trước danh từ)."
      },
      {
        "q": "Two of the five delivery trucks are currently undergoing maintenance, while _____ are operating on standard routes.",
        "opts": [
          "other",
          "another",
          "each other",
          "the others"
        ],
        "ans": 3,
        "exp": "Tổng số xác định là 5 xe ('five delivery trucks'); trừ 2 xe đang bảo trì thì 3 xe CÒN LẠI xác định và không có danh từ sau chỗ trống → chọn đại từ 'the others'."
      },
      {
        "q": "No personnel _____ than certified lab specialists are allowed to handle the chemical samples.",
        "opts": [
          "another",
          "other",
          "others",
          "the other"
        ],
        "ans": 1,
        "exp": "Cụm giới từ cố định 'other than' (= ngoại trừ, ngoài... ra). Do đó chọn 'other'."
      },
      {
        "q": "The HR portal allows mentors and newly hired engineers to exchange feedback with _____ directly.",
        "opts": [
          "one another",
          "other",
          "another",
          "the others"
        ],
        "ans": 0,
        "exp": "Diễn tả hành động tương tác 'lẫn nhau' giữa các thành viên sau giới từ 'with' → chọn đại từ tương hỗ 'one another'."
      },
      {
        "q": "Because the software license expires soon, the IT team must either renew it or migrate to _____ platform.",
        "opts": [
          "other",
          "others",
          "another",
          "the others"
        ],
        "ans": 2,
        "exp": "Sau chỗ trống là danh từ đếm được số ít 'platform' (chuyển sang một nền tảng khác) → chọn 'another'. Loại 'other' (không đi với N đếm được số ít thiếu mạo từ), 'others' và 'the others' (đại từ)."
      }
    ]
  },
  {
    "id": "tg_37",
    "order": 37,
    "level": 3,
    "unitTitle": "Chặng 3 • MĐQH rút gọn, Phân từ, Điều kiện & Từ nối (550–750)",
    "category": "Liên từ & Giới từ",
    "partTag": "Part 5–6",
    "title": "Cặp Giới từ & Liên từ dễ nhầm (during/while, until/by, between/among)",
    "speedTip": "Mẹo 5 giây: during + N ≠ while + S+V/V-ing; until = kéo dài liên tục ĐẾN lúc ≠ by = hoàn thành CHẬM NHẤT trước lúc; between = 2 đối tượng ≠ among = từ 3 đối tượng / tập thể!",
    "formula": "during + N  |  while + S+V / V-ing  |  for + số + thời gian  |  by (hạn chót) vs until (kéo dài)  |  between (2) vs among (3+)",
    "summary": "Các cặp từ tiếng Việt dịch na ná nhau ('trong khi', 'đến lúc', 'giữa') lại khác hẳn nhau về ngữ pháp và sắc thái hành động trong tiếng Anh. Đây là nhóm câu hỏi bẫy kinh điển ở Part 5 đòi hỏi phản xạ phân tách cực nhanh.",
    "theorySections": [
      {
        "heading": "1. Bộ ba chỉ thời gian diễn tiến: during / while / for",
        "bullets": [
          "during + Cụm danh từ chỉ sự kiện/giai đoạn (during the briefing, during peak season) — KHÔNG cộng S+V và KHÔNG cộng số lượng thời gian (sai: 'during three days').",
          "while + S + V (hoặc rút gọn while V-ing/V-ed): diễn tả hành động diễn ra song song (while waiting for approval).",
          "for + khoảng thời gian có số đếm/lượng từ (for two weeks, for several months)."
        ]
      },
      {
        "heading": "2. Phân biệt hạn chót 'by' với kéo dài 'until'",
        "bullets": [
          "by + mốc thời gian: dùng với hành động KẾT THÚC 1 LẦN trước hạn chót (submit, finish, arrive, pay, return, complete by Friday).",
          "until + mốc thời gian: dùng với trạng thái/hành động DUY TRÌ LIÊN TỤC cho tới mốc đó rồi dừng (remain open, stay, wait, continue, be available until 6 P.M.)."
        ]
      },
      {
        "heading": "3. 'between' vs 'among' & 'within' vs 'throughout'",
        "bullets": [
          "between: giữa 2 đối tượng (between March and May, between the buyer and the seller) hoặc mối quan hệ từng cặp rõ ràng.",
          "among: trong số từ 3 đối tượng trở lên hoặc trong nội bộ một nhóm/tập thể (popular among consumers, distributed among staff members).",
          "within + khoảng thời gian/khoảng cách (trong vòng: within 24 hours); throughout + giai đoạn/địa bàn (xuyên suốt: throughout the year / throughout Europe)."
        ]
      }
    ],
    "examples": [
      {
        "en": "All expense reports must be submitted to accounting <b>by</b> 5:00 P.M. this Thursday.",
        "vi": "Mọi báo cáo chi phí phải được nộp cho phòng kế toán chậm nhất là 5 giờ chiều thứ Năm này.",
        "note": "Động từ 'submit' là hành động hoàn tất trước hạn chót → chọn 'by' (không dùng 'until')."
      },
      {
        "en": "The exhibition booth will remain open <b>until</b> Sunday evening to accommodate weekend visitors.",
        "vi": "Gian hàng triển lãm sẽ tiếp tục mở cửa cho đến tối Chủ nhật để đón khách cuối tuần.",
        "note": "Cụm 'remain open' diễn tả trạng thái duy trì liên tục tới mốc dừng → chọn 'until'."
      },
      {
        "en": "The new wellness benefit has proven highly popular <b>among</b> employees across all seven branches.",
        "vi": "Phúc lợi chăm sóc sức khỏe mới đã chứng tỏ rất được ưa chuộng trong số nhân viên ở cả bảy chi nhánh.",
        "note": "Nhóm tập thể đông người ('employees across all seven branches') → chọn 'among'."
      }
    ],
    "pitfalls": [
      {
        "wrong": "Please turn off mobile notifications during you are attending the client briefing.",
        "right": "Please turn off mobile notifications <b>while</b> you are attending the client briefing.",
        "exp": "Sau chỗ trống là mệnh đề S+V ('you are attending'), không thể dùng giới từ 'during'; phải dùng liên từ 'while'."
      },
      {
        "wrong": "Candidates must return the signed offer letter until May 20.",
        "right": "Candidates must return the signed offer letter <b>by</b> May 20.",
        "exp": "'Return the letter' là hành động nộp 1 lần trước hạn chót (deadline), không phải hành động kéo dài liên tục → phải dùng 'by'."
      }
    ],
    "quiz": [
      {
        "q": "Please refrain from entering the recording studio _____ the red warning light is illuminated.",
        "opts": [
          "during",
          "within",
          "for",
          "while"
        ],
        "ans": 3,
        "exp": "Sau chỗ trống là mệnh đề đầy đủ S+V ('the red warning light is illuminated') → bắt buộc chọn liên từ 'while'. Các phương án 'during', 'for', 'within' đều là giới từ chỉ đi với cụm danh từ."
      },
      {
        "q": "Contractors must complete all exterior painting _____ the end of next week so the store can reopen on schedule.",
        "opts": [
          "until",
          "by",
          "during",
          "while"
        ],
        "ans": 1,
        "exp": "Động từ 'complete' diễn tả hạn chót phải xong trước thời điểm cuối tuần sau → chọn 'by'. Loại 'until' (dùng cho hành động kéo dài liên tục), 'during' (trong suốt), 'while' (liên từ)."
      },
      {
        "q": "The customer service hotline will stay operational _____ midnight to assist travelers affected by the storm.",
        "opts": [
          "by",
          "within",
          "until",
          "during"
        ],
        "ans": 2,
        "exp": "'Stay operational' (duy trì hoạt động liên tục cho đến nửa đêm rồi mới dừng) → chọn 'until'. Loại 'by' (hạn chót hoàn thành), 'within' (+ khoảng thời gian), 'during' (+ sự kiện)."
      },
      {
        "q": "The bonus pool will be divided equally _____ all twelve members of the product engineering squad.",
        "opts": [
          "among",
          "between",
          "within",
          "during"
        ],
        "ans": 0,
        "exp": "Chia thưởng cho một tập thể 12 thành viên (từ 3 đối tượng trở lên) → chọn 'among'. Loại 'between' (2 đối tượng), 'within' (trong phạm vi), 'during' (thời gian)."
      },
      {
        "q": "The pharmacy experienced a sharp rise in flu vaccine appointments _____ the final two weeks of October.",
        "opts": [
          "while",
          "during",
          "for",
          "until"
        ],
        "ans": 1,
        "exp": "Sau chỗ trống là cụm danh từ xác định một giai đoạn cụ thể ('the final two weeks of October') → chọn 'during'. Loại 'while' (+ S+V), 'for' (không đi với 'the final... of October' chỉ mốc cụ thể trong bối cảnh sự kiện tăng đột biến), 'until' (sai nghĩa)."
      },
      {
        "q": "Any damaged merchandise returned _____ thirty days of purchase is eligible for a full store credit.",
        "opts": [
          "throughout",
          "until",
          "among",
          "within"
        ],
        "ans": 3,
        "exp": "Diễn tả giới hạn thời gian 'trong vòng 30 ngày kể từ ngày mua' → chọn 'within'. Loại 'throughout' (xuyên suốt), 'until' (+ mốc), 'among' (giữa nhóm)."
      }
    ]
  },
  {
    "id": "tg_38",
    "order": 38,
    "level": 3,
    "unitTitle": "Chặng 3 • MĐQH rút gọn, Phân từ, Điều kiện & Từ nối (550–750)",
    "category": "Liên từ & Giới từ",
    "partTag": "Part 5–6",
    "title": "Giới từ phức ETS (in accordance with / prior to / regardless of / on behalf of)",
    "speedTip": "Mẹo 5 giây: Tất cả Giới từ phức đều kết thúc bằng giới từ (with/to/of) nên SAU CHỖ TRỐNG là Cụm danh từ hoặc V-ing — đặc biệt chú ý bẫy 'prior to + V-ing' và 'in addition to + N'!",
    "formula": "in accordance with / prior to / regardless of / on behalf of / in addition to / subject to / pursuant to + N / V-ing",
    "summary": "Giới từ phức (Compound Prepositions) là đặc sản nhận diện văn phong trang trọng của TOEIC Business English (hợp đồng, thông báo nhân sự, hướng dẫn an toàn). Học thuộc 10 cụm cốt lõi giúp bạn xử lý gọn gàng cả câu ngữ pháp lẫn câu từ vựng Part 5–6.",
    "theorySections": [
      {
        "heading": "1. Nhóm Quy định & Thời gian: in accordance with / prior to / subject to",
        "bullets": [
          "in accordance with / in compliance with / pursuant to + N: tuân thủ theo (luật định, hướng dẫn, tiêu chuẩn an toàn).",
          "prior to + N / V-ing: trước khi (= before). Bẫy ETS kinh điển: 'to' ở đây là giới từ nên đi với V-ing (prior to signing the lease), KHÔNG đi với V-bare!",
          "subject to + N: chịu sự điều chỉnh của / tùy thuộc vào (subject to approval / availability)."
        ]
      },
      {
        "heading": "2. Nhóm Đại diện, Bất kể & Bổ sung: on behalf of / regardless of / in addition to",
        "bullets": [
          "on behalf of + N: thay mặt cho ai/tổ chức nào (thường gặp trong email cảm ơn, lễ trao giải).",
          "regardless of + N / whether-clause: bất kể, không phân biệt (regardless of seniority / weather conditions).",
          "in addition to + N / V-ing (ngoài... ra) ≠ in addition, S + V (trạng từ nối đứng độc lập)."
        ]
      },
      {
        "heading": "3. Nhóm Chủ đề & Nguyên nhân: regarding / in light of / owing to",
        "bullets": [
          "with regard to / regarding / concerning + N: liên quan đến, về vấn đề.",
          "in light of + N: xét đến, căn cứ vào (tình hình/dữ liệu mới).",
          "owing to / due to / as a result of + N: do, bởi vì; contrary to + N: trái ngược với."
        ]
      }
    ],
    "examples": [
      {
        "en": "All medical devices are tested <b>in accordance with</b> international quality standards before shipment.",
        "vi": "Mọi thiết bị y tế đều được kiểm định tuân thủ theo các tiêu chuẩn chất lượng quốc tế trước khi xuất xưởng.",
        "note": "'In accordance with + N' đi cặp kinh điển với standards, regulations, guidelines, policies."
      },
      {
        "en": "<b>Prior to</b> finalizing the merger, both corporations conducted thorough financial audits.",
        "vi": "Trước khi hoàn tất thương vụ sáp nhập, cả hai tập đoàn đều tiến hành kiểm toán tài chính kỹ lưỡng.",
        "note": "Sau 'Prior to' là danh động từ 'finalizing' (KHÔNG phải 'finalize')."
      },
      {
        "en": "<b>On behalf of</b> the entire board of directors, I would like to thank Ms. Okafor for twenty years of service.",
        "vi": "Thay mặt toàn thể hội đồng quản trị, tôi xin gửi lời cảm ơn bà Okafor vì hai mươi năm cống hiến.",
        "note": "'On behalf of' dùng khi người nói đại diện cho một tập thể/cá nhân."
      }
    ],
    "pitfalls": [
      {
        "wrong": "Passengers must check in online prior to board the shuttle bus.",
        "right": "Passengers must check in online <b>prior to boarding</b> the shuttle bus.",
        "exp": "'to' trong 'prior to' là giới từ, không phải dấu hiệu to-V; do đó phải cộng V-ing ('boarding')."
      },
      {
        "wrong": "In addition the base salary, sales representatives earn quarterly commissions.",
        "right": "<b>In addition to</b> the base salary, sales representatives earn quarterly commissions.",
        "exp": "Khi có cụm danh từ đi liền sau ('the base salary') phải dùng đủ cụm giới từ 'In addition to' (không lược 'to')."
      }
    ],
    "quiz": [
      {
        "q": "Every employee must wear a protective badge inside the plant _____ company security regulations.",
        "opts": [
          "in accordance with",
          "on behalf of",
          "regardless of",
          "in addition to"
        ],
        "ans": 0,
        "exp": "Đi với 'company security regulations' (quy định an ninh công ty) cần nghĩa 'tuân thủ theo' → chọn 'in accordance with'. Loại 'on behalf of' (thay mặt), 'regardless of' (bất kể), 'in addition to' (ngoài ra)."
      },
      {
        "q": "All guests are kindly requested to present a valid photo ID _____ entering the research wing.",
        "opts": [
          "in spite of",
          "because of",
          "prior to",
          "owing to"
        ],
        "ans": 2,
        "exp": "Hành động xuất trình giấy tờ diễn ra TRƯỚC KHI vào khu nghiên cứu + sau chỗ trống là V-ing ('entering') → chọn 'prior to'."
      },
      {
        "q": "The annual leadership seminar is open to all staff members _____ their department or job title.",
        "opts": [
          "pursuant to",
          "regardless of",
          "on behalf of",
          "as a result of"
        ],
        "ans": 1,
        "exp": "Nghĩa câu: hội thảo mở cho toàn bộ nhân viên 'bất kể phòng ban hay chức danh' → chọn 'regardless of'."
      },
      {
        "q": "_____ the recent drop in shipping costs, the board voted to lower retail prices on twelve flagship models.",
        "opts": [
          "Prior to",
          "Contrary to",
          "On behalf of",
          "In light of"
        ],
        "ans": 3,
        "exp": "'Xét đến / Căn cứ vào sự sụt giảm chi phí vận chuyển gần đây', hội đồng quyết định giảm giá bán lẻ → chọn 'In light of'. Loại 'Contrary to' (trái ngược), 'On behalf of' (thay mặt), 'Prior to' (trước khi)."
      },
      {
        "q": "_____ expanding our warehouse capacity, the capital grant will fund three automated sorting lines.",
        "opts": [
          "In addition",
          "Furthermore",
          "In addition to",
          "Moreover"
        ],
        "ans": 2,
        "exp": "Sau chỗ trống là cụm V-ing ('expanding our warehouse capacity') nên bắt buộc chọn cụm giới từ 'In addition to'. Ba đáp án còn lại đều là trạng từ nối (phải có dấu phẩy và mệnh đề S+V)."
      },
      {
        "q": "All promotional room rates advertised on our website are _____ availability during holiday weekends.",
        "opts": [
          "subject to",
          "regardless of",
          "in compliance with",
          "on behalf of"
        ],
        "ans": 0,
        "exp": "Cụm thương mại cố định 'be subject to availability' (tùy thuộc vào tình trạng phòng còn trống). Do đó chọn 'subject to'."
      }
    ]
  },
  {
    "id": "tg_39",
    "order": 39,
    "level": 3,
    "unitTitle": "Chặng 3 • MĐQH rút gọn, Phân từ, Điều kiện & Từ nối (550–750)",
    "category": "Thì & Bị động",
    "partTag": "Part 5–6",
    "title": "Phối hợp Thì & Tương lai hoàn thành (by + mốc tương lai)",
    "speedTip": "Mẹo 5 giây: Thấy 'By + mốc tương lai' hoặc 'By the time + S + HTĐ' → chốt ngay Tương lai hoàn thành (will have V3)! Thấy 'when/once/as soon as/before/until' chỉ tương lai → CẤM chọn 'will', chọn HTĐ!",
    "formula": "By + mốc TL / By the time + HTĐ, S + will have + V3/ed  |  By the time + QKĐ, S + had + V3/ed  |  When/Once/Before + HTĐ, S + will + V",
    "summary": "Ở mức 600–750, TOEIC không chỉ hỏi từng thì đơn lẻ mà kiểm tra sự phối hợp thì giữa hai mệnh đề trong cùng một câu. Trọng tâm lớn nhất là Tương lai hoàn thành (Future Perfect) và quy tắc cấm dùng 'will' trong mệnh đề trạng ngữ chỉ thời gian.",
    "theorySections": [
      {
        "heading": "1. Tương lai hoàn thành (will have + V3/ed) — Dấu hiệu vàng 'By'",
        "bullets": [
          "Diễn tả hành động sẽ HOÀN TẤT TRƯỚC một mốc thời gian trong tương lai.",
          "Dấu hiệu nhận diện gần như 100%: by next month, by the end of this fiscal year, by 2028, by the time + S + V(HTĐ).",
          "Thể bị động: will have been + V3/ed (By Friday, all workstations will have been upgraded)."
        ]
      },
      {
        "heading": "2. Quy tắc CẤM 'will' trong Mệnh đề Thời gian tương lai",
        "bullets": [
          "Sau when, once, as soon as, before, after, until, by the time: dù nghĩa ở tương lai, động từ PHẢI chia Hiện tại đơn (hoặc Hiện tại hoàn thành để nhấn mạnh hoàn tất trước).",
          "Ví dụ đúng: Once the inspector approves (KHÔNG dùng will approve) the blueprint, construction will begin."
        ]
      },
      {
        "heading": "3. Phối hợp Quá khứ (By the time + QKĐ ↔ QKHT) & Since",
        "bullets": [
          "By the time + S + QKĐ, S + had + V3/ed: một việc đã xong trước mốc quá khứ (By the time the courier arrived, the office had closed).",
          "Since + mốc QK / S + QKĐ, S + have/has + V3/ed: kéo dài từ quá khứ đến hiện tại (Ever since the firm relocated, sales have doubled)."
        ]
      }
    ],
    "examples": [
      {
        "en": "By the end of this fiscal quarter, the sales division <b>will have exceeded</b> its annual revenue target.",
        "vi": "Tính đến cuối quý tài chính này, bộ phận kinh doanh sẽ đã vượt mục tiêu doanh thu cả năm.",
        "note": "Cụm 'By the end of this fiscal quarter' (mốc tương lai) → Tương lai hoàn thành 'will have exceeded'."
      },
      {
        "en": "As soon as the customs office <b>clears</b> the cargo, our carrier will deliver it to your warehouse.",
        "vi": "Ngay khi cơ quan hải quan thông quan lô hàng, đơn vị vận tải của chúng tôi sẽ giao hàng tới kho của bạn.",
        "note": "Mệnh đề chính chia 'will deliver', nhưng trong mệnh đề thời gian 'As soon as' bắt buộc chia hiện tại đơn 'clears'."
      },
      {
        "en": "Since Mr. Ito <b>became</b> chief financial officer three years ago, operating margins have improved steadily.",
        "vi": "Kể từ khi ông Ito trở thành giám đốc tài chính ba năm trước, biên lợi nhuận hoạt động đã cải thiện đều đặn.",
        "note": "Cấu trúc 'Since + QKĐ, HTHT': sau 'Since' chia quá khứ đơn 'became', mệnh đề chính chia 'have improved'."
      }
    ],
    "pitfalls": [
      {
        "wrong": "Before the keynote speaker will arrive, please test all wireless microphones.",
        "right": "Before the keynote speaker <b>arrives</b>, please test all wireless microphones.",
        "exp": "Tuyệt đối không chia thì tương lai 'will' trong mệnh đề thời gian bắt đầu bằng 'before/when/once/as soon as'."
      },
      {
        "wrong": "By next June, Dr. Patel worked at our research institute for exactly twenty years.",
        "right": "By next June, Dr. Patel <b>will have worked</b> at our research institute for exactly twenty years.",
        "exp": "'By next June' là mốc thời gian tương lai kết hợp 'for twenty years' → phải dùng Tương lai hoàn thành 'will have worked'."
      }
    ],
    "quiz": [
      {
        "q": "By the time the trade expo opens in November, the design studio _____ all promotional displays.",
        "opts": [
          "completes",
          "will have completed",
          "completed",
          "has completed"
        ],
        "ans": 1,
        "exp": "Cấu trúc 'By the time + S + HTĐ (opens in November)' báo hiệu hành động sẽ hoàn tất trước một mốc tương lai → chọn Tương lai hoàn thành 'will have completed'."
      },
      {
        "q": "Once the pharmacy _____ your doctor's digital prescription, you will receive an automated text alert.",
        "opts": [
          "will verify",
          "had verified",
          "verified",
          "verifies"
        ],
        "ans": 3,
        "exp": "Trong mệnh đề trạng ngữ chỉ thời gian bắt đầu bằng 'Once' đi với mệnh đề chính tương lai ('will receive'), không dùng 'will' mà phải chia hiện tại đơn → chọn 'verifies'."
      },
      {
        "q": "By the time the emergency repair crew reached the substation, the backup battery _____ power to the building.",
        "opts": [
          "had already restored",
          "will restore",
          "restores",
          "has restored"
        ],
        "ans": 0,
        "exp": "Vế 'By the time' chia quá khứ đơn ('reached') → hành động xảy ra và hoàn tất TRƯỚC mốc quá khứ đó phải chia Quá khứ hoàn thành → chọn 'had already restored'."
      },
      {
        "q": "Ever since Horizon Air _____ its nonstop route to Zurich last spring, business-class bookings have risen by 25 percent.",
        "opts": [
          "launches",
          "has launched",
          "launched",
          "will launch"
        ],
        "ans": 2,
        "exp": "Mệnh đề chính đã chia Hiện tại hoàn thành ('have risen') và có dấu hiệu 'last spring' sau 'Ever since' → mệnh đề sau 'since' bắt buộc chia Quá khứ đơn 'launched'."
      },
      {
        "q": "By the end of next year, more than 400 charging stations _____ along the coastal highway.",
        "opts": [
          "will install",
          "were installed",
          "have been installed",
          "will have been installed"
        ],
        "ans": 3,
        "exp": "'By the end of next year' (mốc tương lai) + chủ ngữ '400 charging stations' ở thể bị động (được lắp đặt) → chọn Tương lai hoàn thành bị động 'will have been installed'."
      },
      {
        "q": "Please do not distribute the preliminary draft until the legal counsel _____ the confidentiality clause.",
        "opts": [
          "will approve",
          "approves",
          "approved",
          "had approved"
        ],
        "ans": 1,
        "exp": "Mệnh đề thời gian sau 'until' mang nghĩa tương lai (đi với câu mệnh lệnh hiện tại 'Please do not distribute') → chia hiện tại đơn 'approves', tuyệt đối không dùng 'will approve'."
      }
    ]
  },
  {
    "id": "tg_40",
    "order": 40,
    "level": 3,
    "unitTitle": "Chặng 3 • MĐQH rút gọn, Phân từ, Điều kiện & Từ nối (550–750)",
    "category": "Kỹ thuật Part 6",
    "partTag": "Part 5–6",
    "title": "Mạch liên kết & Kỹ thuật điền câu hoàn chỉnh Part 6",
    "speedTip": "Mẹo 5 giây: Khi gặp câu điền CẢ CÂU trong Part 6, khóa chặt 3 dấu neo giữa câu TRƯỚC và câu SAU chỗ trống: (1) Từ chỉ định this/these/such/it/they, (2) Mạch nguyên nhân–giải pháp, (3) Thì động từ nhất quán!",
    "formula": "Câu trước (Giới thiệu N / Vấn đề) → [Câu cần điền: this/these + giải thích/hệ quả] → Câu sau (Bước tiếp theo / Chi tiết khớp đại từ)",
    "summary": "Part 6 gồm 4 đoạn văn (16 câu), trong đó có 4 câu chọn cả câu hoàn chỉnh (Sentence Insertion) quyết định việc bứt phá qua mốc 700+. Thay vì đọc lan man, áp dụng kỹ thuật 3 dấu neo liên kết giúp bạn chọn đúng nhanh và chắc chắn.",
    "theorySections": [
      {
        "heading": "1. Dấu neo #1: Đại từ thay thế & Từ chỉ định (Reference Anchors)",
        "bullets": [
          "Chú ý các từ 'this/these/that/such + N', 'it/they/them', 'the + N' ở câu cần điền HOẶC ở câu đứng ngay sau chỗ trống.",
          "Ví dụ: Nếu câu ngay sau chỗ trống viết 'This upgrade will reduce wait times...', thì câu cần điền chắc chắn phải nhắc đến một sự nâng cấp (upgrade/new system/renovation)!"
        ]
      },
      {
        "heading": "2. Dấu neo #2: Cấu trúc chuẩn của Email / Thông báo thương mại",
        "bullets": [
          "Đầu đoạn: Nêu mục đích thông báo / giới thiệu sự kiện hoặc vấn đề phát sinh.",
          "Giữa đoạn: Giải thích nguyên nhân → Đưa ra hướng xử lý / phương án thay thế / lời xin lỗi.",
          "Cuối đoạn: Kêu gọi hành động (Call to action: liên hệ, đăng ký, phản hồi trước hạn chót) hoặc lời cảm ơn."
        ]
      },
      {
        "heading": "3. Dấu neo #3: Nhất quán Thì & Loại đáp án lạc đề",
        "bullets": [
          "Nếu đoạn văn đang kể sự kiện sắp diễn ra tuần tới (tương lai), loại ngay câu có mốc quá khứ mâu thuẫn ('Last year's event was canceled').",
          "Đáp án đúng luôn đóng vai trò 'cầu nối' ăn khớp với CẢ câu đứng trước LẪN câu đứng sau, không chỉ hợp với 1 phía."
        ]
      }
    ],
    "examples": [
      {
        "en": "The west parking garage will be repaved from June 3 to June 5. <b>During this period, employees may park free of charge at the Pine Street lot.</b> Shuttle vans will run between that lot and headquarters every ten minutes.",
        "vi": "Bãi đỗ xe phía tây sẽ được trải nhựa lại từ ngày 3 đến ngày 5 tháng 6. Trong thời gian này, nhân viên có thể đỗ xe miễn phí tại bãi phố Pine. Xe trung chuyển sẽ chạy giữa bãi đó và trụ sở mỗi mười phút.",
        "note": "'During this period' nối khớp với 'June 3 to June 5' ở câu trước, còn 'the Pine Street lot' làm tiền ngữ cho 'that lot' ở câu sau!"
      },
      {
        "en": "Thank you for subscribing to FinTrack Weekly. <b>Your first digital issue will arrive in your inbox this Friday morning.</b> You can update your delivery preferences anytime in your account dashboard.",
        "vi": "Cảm ơn bạn đã đăng ký FinTrack Weekly. Số báo kỹ thuật số đầu tiên sẽ gửi tới hộp thư của bạn vào sáng thứ Sáu này. Bạn có thể cập nhật tùy chọn nhận báo bất cứ lúc nào trong trang tài khoản.",
        "note": "Mạch logic chuẩn email xác nhận đăng ký: Cảm ơn đăng ký → Thông báo thời điểm nhận số đầu → Hướng dẫn tùy chỉnh giao nhận."
      }
    ],
    "pitfalls": [
      {
        "wrong": "Chỉ đọc câu đứng TRƯỚC chỗ trống rồi chọn ngay câu nghe có vẻ hợp lý mà bỏ qua câu đứng SAU.",
        "right": "Luôn đọc cả <b>câu liền trước VÀ câu liền sau</b> để kiểm tra xem từ 'this/that/they' ở câu sau có bị hụt tiền ngữ không.",
        "exp": "ETS thường đặt bẫy có tới 2 phương án hợp với câu trước, nhưng chỉ 1 phương án tạo cầu nối chính xác cho câu sau."
      }
    ],
    "quiz": [
      {
        "q": "[Email nội bộ] Our cafeteria kitchen is undergoing electrical repairs this Wednesday morning. _____. Regular hot lunch service will resume at 12:30 P.M.",
        "opts": [
          "Please submit your annual cafeteria satisfaction survey by Friday.",
          "The head chef won a regional culinary award three years ago.",
          "As a result, only cold beverages and prepackaged snacks will be available until noon.",
          "All electrical invoices were already approved by the accounting director."
        ],
        "ans": 2,
        "exp": "Câu trước nêu sự cố sửa điện sáng thứ Tư, câu sau nói bữa trưa nóng trở lại lúc 12:30 → cầu nối duy nhất khớp mạch nguyên nhân–tạm thời là câu 'As a result, only cold beverages and prepackaged snacks will be available until noon.' (Do đó, chỉ có đồ uống lạnh và đồ ăn nhẹ đóng gói sẵn phục vụ đến trưa). Ba câu còn lại đều lạc mạch chủ đề hoặc mốc thời gian."
      },
      {
        "q": "[Thông báo khách hàng] We are pleased to introduce our new mobile check-in feature for all hotel guests. _____. Simply tap the link in your confirmation email twenty-four hours before arrival.",
        "opts": [
          "This convenient option allows you to bypass the front-desk queue completely.",
          "Parking rates at the downtown garage have recently increased.",
          "Guests who checked out yesterday should keep their paper receipts.",
          "Our rooftop restaurant will remain closed for a private banquet."
        ],
        "ans": 0,
        "exp": "'This convenient option' nối trực tiếp với 'our new mobile check-in feature' ở câu trước, và giới thiệu lợi ích ngay trước câu hướng dẫn thao tác 'Simply tap the link...'. Các đáp án khác chuyển sang chủ đề không liên quan (đỗ xe, trả phòng hôm qua, nhà hàng)."
      },
      {
        "q": "[Thư mời hội thảo] Registration for the Autumn Supply-Chain Forum is filling up rapidly. _____. After that deadline, standard walk-in pricing will apply to all attendees.",
        "opts": [
          "Last autumn's forum attracted speakers from fourteen countries.",
          "Refreshments will be served in the atrium following the closing panel.",
          "The keynote presentation will focus on maritime freight regulations.",
          "To secure the reduced early-bird rate, please complete your enrollment by September 15."
        ],
        "ans": 3,
        "exp": "Câu liền sau có neo chỉ định cực mạnh 'After that deadline' và 'standard walk-in pricing' → câu cần điền BẮT BUỘC phải nêu một mốc hạn chót (September 15) và mức giá ưu đãi (early-bird rate) → chọn câu 'To secure the reduced early-bird rate, please complete your enrollment by September 15.'"
      },
      {
        "q": "[Phản hồi đơn hàng] We sincerely apologize that two glass vases in your recent order arrived damaged. _____. You do not need to return the broken items.",
        "opts": [
          "Glassware should always be washed gently with warm water.",
          "Replacement units have already been dispatched via express courier at no additional charge.",
          "Our seasonal home-decor catalog will be published next spring.",
          "The original payment method must be verified before placing a new order."
        ],
        "ans": 1,
        "exp": "Mạch thư xin lỗi khách hàng: Xin lỗi hàng vỡ → Đưa ngay giải pháp gửi hàng thay thế miễn phí → Chốt thêm 'không cần gửi trả hàng vỡ'. Ba phương án còn lại lệch hẳn mạch giải quyết khiếu nại."
      },
      {
        "q": "[Thông báo nhân sự] Starting next Monday, all staff must scan their ID cards when entering the printing room. _____. Anyone who has misplaced their badge should visit the security desk today.",
        "opts": [
          "The new policy helps management track paper usage and reduce unnecessary waste.",
          "Color laser printers typically consume more toner than monochrome models.",
          "The security desk was relocated to the lobby two years ago.",
          "All department heads attended a budgeting workshop last Tuesday."
        ],
        "ans": 0,
        "exp": "'The new policy' liên kết chặt chẽ với quy định mới vừa nêu ở câu trước (quét thẻ khi vào phòng in) và giải thích mục đích trước khi nhắc người mất thẻ đi làm lại. Ba lựa chọn kia không kết nối mạch thông báo quy định mới."
      },
      {
        "q": "[Bản tin nội bộ] The R&D division successfully tested its prototype solar charger under extreme temperatures last week. _____, the manufacturing team is preparing the production line for a summer launch.",
        "opts": [
          "Nevertheless",
          "On the contrary",
          "Encouraged by these results",
          "Despite the malfunction"
        ],
        "ans": 2,
        "exp": "Câu trước báo tin tích cực (thử nghiệm thành công), câu sau nêu bước tiến tiếp theo (chuẩn bị dây chuyền sản xuất) → cần cụm liên kết cùng chiều có từ chỉ định 'these results' → chọn 'Encouraged by these results'. Loại 'Nevertheless', 'On the contrary' và 'Despite the malfunction' (đều mang nghĩa trái ngược/sự cố)."
      }
    ]
  },
  {
    "id": "tg_41",
    "order": 41,
    "level": 4,
    "unitTitle": "Chặng 4 • Đảo ngữ, Giả định cách & Bẫy 850–990 (750–990)",
    "category": "Đảo ngữ",
    "partTag": "Part 5–6",
    "title": "Đảo ngữ Câu Điều kiện (Should / Were / Had)",
    "speedTip": "Mẹo 5 giây: Thấy CHỖ TRỐNG ĐẦU CÂU + S + V(bare/to-V/V3) mà KHÔNG có 'If' và KHÔNG có dấu chấm hỏi cuối câu → chốt ngay Đảo ngữ Điều kiện: Should (+ V-bare) | Were (+ to-V/Adj/N) | Had (+ V3/ed)!",
    "formula": "Should + S + (not) + V-bare, ...  |  Were + S + (not) + to-V/Adj/N, S + would V  |  Had + S + (not) + V3/ed, S + would have V3",
    "summary": "Đảo ngữ câu điều kiện là dấu hiệu đặc trưng của văn phong email và hợp đồng trang trọng trong TOEIC 750–990. Chỉ cần bỏ 'If' và đưa đúng trợ động từ (Should / Were / Had) lên đầu câu là bạn vừa ăn chắc điểm Part 5 vừa đọc hiểu nhanh thông báo Part 7.",
    "theorySections": [
      {
        "heading": "1. Đảo ngữ Điều kiện Loại 1: Should + S + V-bare",
        "bullets": [
          "Thay cho 'If + S + (should) + V': diễn tả giả thiết lịch sự hoặc cảnh báo trong thông báo khách hàng.",
          "Ví dụ cực phổ biến ở TOEIC: Should you have any questions regarding your invoice, please call our billing desk.",
          "Chú ý: Dù chủ ngữ là số ít ('the client', 'any item'), động từ sau S vẫn luôn là NGUYÊN MẪU KHÔNG 's/es' (Should the package arrive damaged...)."
        ]
      },
      {
        "heading": "2. Đảo ngữ Điều kiện Loại 2: Were + S + (to-V / Adj / N)",
        "bullets": [
          "Với 'to be': Were I in charge of procurement, I would audit every vendor.",
          "Với động từ thường: thêm 'to' trước động từ gốc → Were the company to relocate its headquarters, operating costs would fall.",
          "Mệnh đề chính luôn chứa 'would / could / might + V-bare'."
        ]
      },
      {
        "heading": "3. Đảo ngữ Điều kiện Loại 3: Had + S + V3/ed & Quy tắc Phủ định",
        "bullets": [
          "Thay cho 'If + S + had + V3/ed': Had the technicians inspected the valve earlier, the outage would have been avoided.",
          "Quy tắc phủ định BẮT BUỘC: đặt 'not' SAU chủ ngữ (Had we not secured backup funding..., Should the payment not clear...). TUYỆT ĐỐI KHÔNG viết dạng rút gọn 'Hadn't / Shouldn't / Weren't' ở đầu câu đảo ngữ!"
        ]
      }
    ],
    "examples": [
      {
        "en": "<b>Should</b> you require additional copies of the training manual, please notify the HR coordinator.",
        "vi": "Nếu bạn cần thêm bản sao của sổ tay đào tạo, vui lòng thông báo cho điều phối viên nhân sự.",
        "note": "Đảo ngữ Loại 1: 'Should' + S ('you') + V-bare ('require'), vế sau là câu mệnh lệnh 'please notify'."
      },
      {
        "en": "<b>Had</b> the freight carrier arrived on time, the exhibition booth would have been assembled before noon.",
        "vi": "Giá mà đơn vị vận tải đến đúng giờ, gian hàng triển lãm hẳn đã được lắp ráp xong trước trưa.",
        "note": "Vế chính có 'would have been assembled' (Loại 3) + vế đầu có V3 'arrived' → đảo 'Had' lên đầu."
      },
      {
        "en": "<b>Were</b> the firm to launch the new software prematurely, customer trust would suffer.",
        "vi": "Nếu công ty tung ra phần mềm mới quá sớm, niềm tin của khách hàng sẽ bị ảnh hưởng.",
        "note": "Cấu trúc 'Were + S + to-V, S + would + V' là đảo ngữ Loại 2 trang trọng."
      }
    ],
    "pitfalls": [
      {
        "wrong": "If should the shipment be delayed, our logistics desk will email an updated tracking number.",
        "right": "<b>Should</b> the shipment be delayed, our logistics desk will email an updated tracking number.",
        "exp": "Đã đảo 'Should' lên đầu câu thì phải BỎ 'If' (không bao giờ viết cùng lúc 'If should')."
      },
      {
        "wrong": "Hadn't the manager checked the figures twice, the error would have gone unnoticed.",
        "right": "<b>Had</b> the manager <b>not</b> checked the figures twice, the error would have gone unnoticed.",
        "exp": "Trong đảo ngữ điều kiện phủ định, không viết rút gọn 'Hadn't' ở đầu câu; phải đặt 'not' sau chủ ngữ."
      }
    ],
    "quiz": [
      {
        "q": "_____ any attendee need special dietary accommodations for the banquet, please inform the catering desk by Wednesday.",
        "opts": [
          "If",
          "Had",
          "Were",
          "Should"
        ],
        "ans": 3,
        "exp": "Chủ ngữ số ít 'any attendee' đi với động từ nguyên mẫu 'need' (không chia 'needs') và mệnh đề chính là câu mệnh lệnh 'please inform' → đây chính là đảo ngữ Điều kiện Loại 1: 'Should + S + V-bare'. Loại 'If' (vì 'any attendee' đòi hỏi 'needs'), 'Were' (+ to-V), 'Had' (+ V3)."
      },
      {
        "q": "_____ the contractor followed the updated wiring diagram, the inspection would have passed on the first attempt.",
        "opts": [
          "Should",
          "Had",
          "Were",
          "If"
        ],
        "ans": 1,
        "exp": "Mệnh đề chính dùng 'would have passed' (Điều kiện loại 3) và sau chủ ngữ là phân từ 'followed' → đảo ngữ Loại 3 chọn 'Had'. Loại 'If' (vì thiếu 'had' sau 'the contractor'), 'Should' (Loại 1), 'Were' (Loại 2)."
      },
      {
        "q": "_____ the board to approve the acquisition next week, our market share in Southeast Asia would double.",
        "opts": [
          "Had",
          "Should",
          "Were",
          "Unless"
        ],
        "ans": 2,
        "exp": "Thấy cấu trúc '_____ + S (the board) + to-V (to approve)' đi với mệnh đề chính 'would double' → chính là đảo ngữ Điều kiện Loại 2 'Were + S + to-V'. Chọn 'Were'."
      },
      {
        "q": "Had the regional office _____ earlier for the trade permit, the exhibition samples would not have been held at customs.",
        "opts": [
          "applied",
          "apply",
          "applying",
          "to apply"
        ],
        "ans": 0,
        "exp": "Đảo ngữ Điều kiện Loại 3: 'Had + S + V3/ed'. Do đó sau chủ ngữ 'the regional office' cần quá khứ phân từ 'applied'."
      },
      {
        "q": "Should the courier _____ to locate the recipient at the front desk, the parcel must be returned to the depot.",
        "opts": [
          "fails",
          "fail",
          "failed",
          "failing"
        ],
        "ans": 1,
        "exp": "Trong đảo ngữ Loại 1 'Should + S + V-bare', động từ luôn ở dạng nguyên mẫu bất kể chủ ngữ số ít ('the courier') → chọn 'fail'."
      },
      {
        "q": "_____ we not installed surge protectors last month, last night's lightning storm would have damaged all server racks.",
        "opts": [
          "Should",
          "Hadn't",
          "Were",
          "Had"
        ],
        "ans": 3,
        "exp": "Mệnh đề chính dùng 'would have damaged' (Loại 3) và sau chủ ngữ 'we' đã có 'not installed' → chọn 'Had' (tuyệt đối không dùng 'Hadn't' vừa sai phủ định kép vừa sai chuẩn đảo ngữ)."
      }
    ]
  },
  {
    "id": "tg_42",
    "order": 42,
    "level": 4,
    "unitTitle": "Chặng 4 • Đảo ngữ, Giả định cách & Bẫy 850–990 (750–990)",
    "category": "Đảo ngữ",
    "partTag": "Part 5–6",
    "title": "Đảo ngữ với Trạng từ Phủ định & Only (Never / Not only / Only after)",
    "speedTip": "Mẹo 5 giây: Thấy từ phủ định (Never / Rarely / Seldom / Not only / Under no circumstances / Little) ở ĐẦU câu → đảo ngay Trợ động từ lên TRƯỚC Chủ ngữ (do/does/did/have/has/can/will + S + V)! Với Only after/when/if/Not until → đảo ở MỆNH ĐỀ CHÍNH!",
    "formula": "[Trạng từ phủ định] + Trợ ĐT + S + V  |  Only after/when/by/if + [vế 1], Trợ ĐT + S + V (mệnh đề chính)",
    "summary": "Đảo ngữ với yếu tố phủ định và cụm 'Only' là điểm phân loại kinh điển ở nhóm câu khó nhất Part 5 (mức 800–990). Hiểu đúng nguyên tắc 'đảo như câu hỏi' và biết vị trí đảo ngữ của cụm 'Only' giúp bạn né bẫy mất điểm đáng tiếc.",
    "theorySections": [
      {
        "heading": "1. Đảo ngữ ngay lập tức sau Trạng từ Phủ định / Giới hạn",
        "bullets": [
          "Nhóm tần suất & phủ định: Never, Rarely, Seldom, Little, Hardly/Scarcely (... when), No sooner (... than).",
          "Nhóm cụm giới từ phủ định: Under no circumstances, In no way, On no account, At no time, By no means.",
          "Nhóm song hành: Not only + Trợ ĐT + S + V ... but also (Not only did sales climb, but customer retention also improved)."
        ]
      },
      {
        "heading": "2. Cặp tương quan Hardly...when & No sooner...than",
        "bullets": [
          "Hardly / Scarcely + had + S + V3 + WHEN + S + V2/ed (Vừa mới... thì...).",
          "No sooner + had + S + V3 + THAN + S + V2/ed (Chú ý cặp đi liền: No sooner đi với THAN, Hardly đi với WHEN!)."
        ]
      },
      {
        "heading": "3. Bẫy chí mạng với 'Only after / Only when / Only if / Only by / Not until'",
        "bullets": [
          "KHÔNG đảo ngữ trong mệnh đề phụ đi ngay sau 'Only after/when/if' hoặc 'Not until'!",
          "CHỈ đảo ngữ ở MỆNH ĐỀ CHÍNH phía sau: Only after the audit was completed DID the CEO sign the report; Not until Friday WILL the committee announce the winner."
        ]
      }
    ],
    "examples": [
      {
        "en": "<b>Under no circumstances</b> should confidential client records be stored on personal flash drives.",
        "vi": "Trong bất kỳ trường hợp nào cũng không được lưu trữ hồ sơ khách hàng bảo mật trên USB cá nhân.",
        "note": "Cụm phủ định 'Under no circumstances' đứng đầu câu → đảo trợ động từ 'should' lên trước chủ ngữ 'confidential client records'."
      },
      {
        "en": "<b>Not only did</b> the new logistics app cut transit times, but it also reduced fuel usage by 14 percent.",
        "vi": "Ứng dụng hậu cần mới không chỉ rút ngắn thời gian vận chuyển mà còn giảm lượng tiêu thụ nhiên liệu 14 phần trăm.",
        "note": "'Not only' đứng đầu câu + thì quá khứ đơn → đảo trợ động từ 'did' lên trước chủ ngữ và giữ động từ nguyên mẫu 'cut'."
      },
      {
        "en": "<b>Only after</b> all safety checks had been verified <b>did</b> the plant resume full production.",
        "vi": "Chỉ sau khi mọi khâu kiểm tra an toàn được xác minh thì nhà máy mới khôi phục toàn bộ sản xuất.",
        "note": "Mệnh đề phụ sau 'Only after' giữ trật tự bình thường; đảo ngữ 'did the plant resume' diễn ra ở mệnh đề chính."
      }
    ],
    "pitfalls": [
      {
        "wrong": "Seldom the company has experienced such rapid growth in overseas orders.",
        "right": "Seldom <b>has the company</b> experienced such rapid growth in overseas orders.",
        "exp": "Khi trạng từ phủ định 'Seldom' đặt ở đầu câu, bắt buộc đảo trợ động từ 'has' lên trước chủ ngữ 'the company'."
      },
      {
        "wrong": "No sooner had the keynote ended when attendees rushed to the demo booths.",
        "right": "No sooner had the keynote ended <b>than</b> attendees rushed to the demo booths.",
        "exp": "'No sooner' là dạng so sánh hơn nên luôn đi cặp với 'than', không đi với 'when' ('when' đi với Hardly/Scarcely)."
      }
    ],
    "quiz": [
      {
        "q": "Rarely _____ such unanimous support from both shareholders and union representatives.",
        "opts": [
          "has a restructuring plan received",
          "a restructuring plan has received",
          "received a restructuring plan",
          "a restructuring plan received"
        ],
        "ans": 0,
        "exp": "Trạng từ mang nghĩa phủ định 'Rarely' đứng đầu câu → bắt buộc đảo ngữ: 'Trợ động từ (has) + S (a restructuring plan) + V3 (received)' → chọn 'has a restructuring plan received'."
      },
      {
        "q": "Not only _____ the prototype ahead of schedule, but the lab also kept expenses twelve percent under budget.",
        "opts": [
          "the engineers completed",
          "completed the engineers",
          "did the engineers complete",
          "were the engineers complete"
        ],
        "ans": 2,
        "exp": "'Not only' đứng đầu câu kết hợp động từ thường ở thì quá khứ (khớp với 'kept' ở vế sau) → đảo trợ động từ 'did' + S + V-bare → chọn 'did the engineers complete'."
      },
      {
        "q": "Only by streamlining the approval workflow _____ able to meet the aggressive Q4 launch date.",
        "opts": [
          "the team will be",
          "will the team be",
          "the team was",
          "be the team will"
        ],
        "ans": 1,
        "exp": "Cụm giới hạn 'Only by + V-ing' đứng đầu câu → đảo trợ động từ lên trước chủ ngữ ở mệnh đề chính: 'will the team be'. Loại ba phương án sai trật tự từ."
      },
      {
        "q": "Under no circumstances _____ permitted to share administrative passwords with external contractors.",
        "opts": [
          "employees are",
          "employees should be",
          "do employees",
          "are employees"
        ],
        "ans": 3,
        "exp": "Cụm giới từ phủ định 'Under no circumstances' đứng đầu câu → đảo trợ động từ 'are' lên trước chủ ngữ 'employees' để ghép với phân từ bị động 'permitted' → chọn 'are employees'. Loại 'employees are' và 'employees should be' (không đảo ngữ), 'do employees' (không đi với 'permitted')."
      },
      {
        "q": "No sooner had the airline opened its promotional fare sale _____ all seats on the Tokyo route sold out.",
        "opts": [
          "when",
          "before",
          "than",
          "that"
        ],
        "ans": 2,
        "exp": "Cặp cấu trúc cố định: 'No sooner + had + S + V3 + THAN + S + V2/ed' (Vừa mới... thì...). Chọn 'than', loại 'when' (dùng cho Hardly/Scarcely)."
      },
      {
        "q": "Not until the independent laboratory published its findings _____ the full scope of the battery defect.",
        "opts": [
          "did management realize",
          "management realized",
          "had management realize",
          "realized management"
        ],
        "ans": 0,
        "exp": "Với 'Not until + mệnh đề thời gian' ở đầu câu, giữ nguyên trật tự mệnh đề phụ ('the independent laboratory published') và ĐẢO NGỮ ở mệnh đề chính → 'did management realize'. Loại 'had management realize' (sai vì 'had' phải đi với V3)."
      }
    ]
  },
  {
    "id": "tg_43",
    "order": 43,
    "level": 4,
    "unitTitle": "Chặng 4 • Đảo ngữ, Giả định cách & Bẫy 850–990 (750–990)",
    "category": "Giả định cách",
    "partTag": "Part 5–6",
    "title": "Thức Giả định (Subjunctive: suggest / insist / mandatory that + S + V-bare)",
    "speedTip": "Mẹo 5 giây: Thấy Động từ / Tính từ / Danh từ mang nghĩa YÊU CẦU–ĐỀ XUẤT + 'that' + Chủ ngữ (kể cả số ít/quá khứ!) → NHẮM MẮT chọn V-bare (hoặc 'be + V3' nếu bị động, 'not + V-bare' nếu phủ định)! Cấm chia -s/-es hay is/was!",
    "formula": "suggest/recommend/insist/require/demand/propose + that + S + (not) + V-bare / be V3  |  It is mandatory/essential/imperative + that + S + V-bare",
    "summary": "Thức Giả định (Mandative Subjunctive) là một trong những 'đặc sản' bẫy điểm cao kinh điển nhất của ETS TOEIC. Người học hay bị bản năng chia động từ số ít (-s/is) đánh lừa khi thấy chủ ngữ số ít đứng sau 'that'.",
    "theorySections": [
      {
        "heading": "1. Bộ từ kích hoạt Thức Giả định cần thuộc lòng",
        "bullets": [
          "Động từ (V): suggest, recommend, advise, propose, request, require, demand, insist, urge, ask, stipulate, order.",
          "Tính từ (Adj — trong 'It is + Adj + that'): mandatory, essential, imperative, vital, crucial, necessary, urgent, advisable, recommended, important.",
          "Danh từ (N): recommendation, suggestion, requirement, proposal, demand, request (The requirement that every applicant submit a portfolio...)."
        ]
      },
      {
        "heading": "2. Ba dạng động từ CHUẨN trong mệnh đề 'that'",
        "bullets": [
          "Chủ động khẳng định: V-bare (KHÔNG thêm -s/-es, KHÔNG chia quá khứ dù động từ chính ở quá khứ! Ví dụ: The auditor insisted that the branch revise its ledger).",
          "Bị động: be + V3/ed (KHÔNG dùng is/are/was/were! Ví dụ: Management requested that the invoice be verified immediately).",
          "Phủ định: not + V-bare / not be + V3 (KHÔNG mượn do/does/did! Ví dụ: Counsel advised that the firm not disclose pricing details)."
        ]
      },
      {
        "heading": "3. Bẫy phân biệt với nghĩa kể sự thật (Không dùng giả định)",
        "bullets": [
          "Động từ 'insist / suggest' chỉ dùng giả định khi mang nghĩa 'khăng khăng yêu cầu / đề xuất LÀM GÌ'. Nếu chỉ mang nghĩa 'khẳng định một sự thật đã xảy ra / gợi ý rằng' (The study suggests that traffic rose 10%), động từ chia thì bình thường."
        ]
      }
    ],
    "examples": [
      {
        "en": "The compliance officer recommended that every department head <b>review</b> the updated privacy handbook.",
        "vi": "Cán bộ tuân thủ khuyến nghị rằng mọi trưởng phòng nên xem lại sổ tay bảo mật cập nhật.",
        "note": "Sau 'recommended that' + chủ ngữ số ít 'every department head' vẫn bắt buộc dùng nguyên mẫu 'review' (không 'reviews' hay 'reviewed')."
      },
      {
        "en": "It is imperative that all hazardous materials <b>be stored</b> in temperature-controlled cabinets.",
        "vi": "Điều cấp thiết là tất cả vật liệu nguy hại phải được lưu trữ trong tủ kiểm soát nhiệt độ.",
        "note": "Bị động của thức giả định sau 'It is imperative that': dùng 'be stored' (không dùng 'are stored')."
      },
      {
        "en": "The legal team advised that the spokesperson <b>not comment</b> on the pending litigation.",
        "vi": "Đội ngũ pháp lý khuyên rằng người phát ngôn không bình luận về vụ kiện đang chờ xử lý.",
        "note": "Phủ định thức giả định đặt trực tiếp 'not' trước V-bare ('not comment'), không dùng 'does not comment'."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The director insisted that Ms. Chen submits the quarterly audit before Friday.",
        "right": "The director insisted that Ms. Chen <b>submit</b> the quarterly audit before Friday.",
        "exp": "Sau 'insisted that' yêu cầu làm gì phải dùng thức giả định nguyên mẫu 'submit', không chia '-s' theo ngôi ba số ít."
      },
      {
        "wrong": "It is mandatory that each visitor is escorted by an employee inside the laboratory.",
        "right": "It is mandatory that each visitor <b>be escorted</b> by an employee inside the laboratory.",
        "exp": "Thể bị động trong mệnh đề giả định phải là 'be + V3/ed' ('be escorted'), tuyệt đối không chia 'is escorted'."
      }
    ],
    "quiz": [
      {
        "q": "The city fire inspector demanded that the warehouse _____ an additional sprinkler line within thirty days.",
        "opts": [
          "installs",
          "install",
          "installed",
          "installing"
        ],
        "ans": 1,
        "exp": "Động từ kích hoạt giả định 'demanded that' + chủ ngữ số ít 'the warehouse' → bắt buộc chọn động từ nguyên mẫu 'install' (ngầm ẩn 'should'). Loại 'installs' (chia số ít), 'installed' (quá khứ), 'installing' (V-ing)."
      },
      {
        "q": "It is essential that every incoming shipment _____ for moisture damage prior to entering storage.",
        "opts": [
          "is inspected",
          "was inspected",
          "inspects",
          "be inspected"
        ],
        "ans": 3,
        "exp": "Cấu trúc giả định 'It is essential that + S + be + V3/ed' (mọi lô hàng đến phải được kiểm tra — thể bị động) → chọn 'be inspected'. Loại 'is inspected' và 'was inspected' (sai thức giả định), 'inspects' (chủ động)."
      },
      {
        "q": "Our financial advisor suggested that the startup _____ its cash reserves until the second funding round closes.",
        "opts": [
          "not deplete",
          "does not deplete",
          "did not deplete",
          "not depleting"
        ],
        "ans": 0,
        "exp": "Thể phủ định của thức giả định sau 'suggested that' đặt 'not' ngay trước V-bare, KHÔNG mượn trợ động từ does/did → chọn 'not deplete'."
      },
      {
        "q": "The board upheld its longstanding requirement that a senior partner _____ all international contracts exceeding $500,000.",
        "opts": [
          "countersigns",
          "countersigned",
          "countersign",
          "to countersign"
        ],
        "ans": 2,
        "exp": "Danh từ kích hoạt giả định 'requirement that' + chủ ngữ số ít 'a senior partner' → chọn nguyên mẫu 'countersign' (đồng ký xác nhận). Loại 'countersigns', 'countersigned', 'to countersign'."
      },
      {
        "q": "Human Resources strongly urges that any employee experiencing payroll discrepancies _____ the accounting portal promptly.",
        "opts": [
          "notifies",
          "notifying",
          "notified",
          "notify"
        ],
        "ans": 3,
        "exp": "Động từ 'urges that' kích hoạt thức giả định; cụm 'experiencing payroll discrepancies' chỉ là MĐQH rút gọn bổ nghĩa cho 'any employee' → động từ chính của mệnh đề 'that' phải ở nguyên mẫu 'notify'."
      },
      {
        "q": "The committee's proposal that the branch _____ open on Saturday mornings received overwhelming approval from local clients.",
        "opts": [
          "remains",
          "remain",
          "remained",
          "remaining"
        ],
        "ans": 1,
        "exp": "Danh từ 'proposal that' yêu cầu thức giả định → chọn nguyên mẫu 'remain' (không chia 'remains' hay 'remained')."
      }
    ]
  },
  {
    "id": "tg_44",
    "order": 44,
    "level": 4,
    "unitTitle": "Chặng 4 • Đảo ngữ, Giả định cách & Bẫy 850–990 (750–990)",
    "category": "Phân từ & Rút gọn",
    "partTag": "Part 5–6",
    "title": "Rút gọn Mệnh đề Trạng ngữ (While V-ing, Once V-ed, If necessary)",
    "speedTip": "Mẹo 5 giây: Thấy Liên từ (while/when/once/until/although/unless/if) + CHỖ TRỐNG (không có Chủ ngữ riêng) → nhìn Chủ ngữ SAU dấu phẩy! S chủ động → V-ing; S bị động → V3/ed; cụm cố định → Adj (if necessary/possible)!",
    "formula": "While/When/Before/After + V-ing (chủ động)  |  Once/When/Unless/Although/If + V3/ed (bị động)  |  If/When + Adj (necessary/available)",
    "summary": "Rút gọn mệnh đề trạng ngữ (Reduced Adverb Clauses) xuất hiện dày đặc trong hướng dẫn sử dụng, quy chế công ty và email TOEIC. Đây là bẫy nặng với những bạn chỉ thuộc vẹt 'sau liên từ phải có S+V' mà quên mất dạng rút gọn lược 'S + be'.",
    "theorySections": [
      {
        "heading": "1. Điều kiện & Cách rút gọn Mệnh đề Trạng ngữ",
        "bullets": [
          "Điều kiện: Hai mệnh đề có CÙNG chủ ngữ (hoặc chủ ngữ giả 'it is' với tính từ như 'if it is necessary').",
          "Cách làm: GIỮ LẠI liên từ (while, when, once, until, although, though, if, unless, before, after) và LƯỢC BỎ 'S + be' (hoặc đổi V chủ động sang V-ing).",
          "Chú ý: KHÔNG rút gọn kiểu này sau 'because / since / as (bởi vì)' — muốn đi với cụm ngắn phải đổi sang 'because of / due to + N/V-ing'."
        ]
      },
      {
        "heading": "2. Phân biệt V-ing (Chủ động) vs V3/ed (Bị động) sau Liên từ",
        "bullets": [
          "Chủ động: While reviewing the lease, Mr. Gomez spotted an error (= While he was reviewing...).",
          "Bị động: Once approved by finance, the voucher will be paid (= Once it is approved...).",
          "Cụm hay gặp nhất đề ETS: unless otherwise noted/specified (trừ khi có ghi chú khác), when properly maintained (khi được bảo trì đúng cách), once finalized (một khi được chốt)."
        ]
      },
      {
        "heading": "3. Cụm Liên từ + Tính từ rút gọn cố định (Siêu ăn điểm)",
        "bullets": [
          "if necessary (nếu cần), if possible (nếu có thể), if applicable (nếu áp dụng), when available (khi sẵn có), whenever appropriate (bất cứ khi nào phù hợp), though brief (dù ngắn gọn)."
        ]
      }
    ],
    "examples": [
      {
        "en": "<b>Once finalized</b> by the editorial team, the annual sustainability report will be published online.",
        "vi": "Một khi được đội biên tập hoàn thiện, báo cáo phát triển bền vững thường niên sẽ được đăng trực tuyến.",
        "note": "Rút gọn từ 'Once the report is finalized' → giữ liên từ 'Once' + quá khứ phân từ bị động 'finalized'."
      },
      {
        "en": "<b>While traveling</b> on official company business, employees may claim up to $75 per day for meals.",
        "vi": "Trong khi đi công tác chính thức cho công ty, nhân viên có thể kê khai tối đa 75 đô la mỗi ngày tiền ăn.",
        "note": "Rút gọn từ 'While employees are traveling' → chủ ngữ 'employees' chủ động đi công tác → 'While traveling'."
      },
      {
        "en": "Please attach copies of prior tax returns, <b>if applicable</b>, to expedite your loan assessment.",
        "vi": "Vui lòng đính kèm bản sao tờ khai thuế trước đây, nếu có áp dụng, để đẩy nhanh quá trình thẩm định khoản vay.",
        "note": "Rút gọn chủ ngữ giả 'if it is applicable' → 'if applicable'."
      }
    ],
    "pitfalls": [
      {
        "wrong": "During waiting for the connecting flight, Ms. Kim drafted her presentation slides.",
        "right": "<b>While waiting</b> for the connecting flight, Ms. Kim drafted her presentation slides.",
        "exp": "'During' là giới từ chỉ đi với danh từ, KHÔNG đi với động từ rút gọn V-ing; phải dùng liên từ 'While' + V-ing."
      },
      {
        "wrong": "When assembling properly, the modular shelving unit supports up to 200 kilograms.",
        "right": "When <b>assembled</b> properly, the modular shelving unit supports up to 200 kilograms.",
        "exp": "Chủ ngữ sau dấu phẩy là 'the modular shelving unit' (kệ lắp ghép) ĐƯỢC lắp ráp (bị động) → phải dùng 'assembled', không dùng 'assembling'."
      }
    ],
    "quiz": [
      {
        "q": "Once _____ by the quality assurance inspector, the electronics batch will be cleared for international shipping.",
        "opts": [
          "certifying",
          "certifies",
          "certified",
          "to certify"
        ],
        "ans": 2,
        "exp": "Chủ ngữ sau dấu phẩy là 'the electronics batch' (lô hàng điện tử) ĐƯỢC chứng nhận bởi thanh tra ('by the quality assurance inspector') → rút gọn bị động sau 'Once' chọn 'certified'."
      },
      {
        "q": "Please double-check all invoice numbers before _____ the payment batch to the commercial bank.",
        "opts": [
          "transmitting",
          "transmitted",
          "transmit",
          "transmission"
        ],
        "ans": 0,
        "exp": "Sau giới từ/liên từ 'before' có tân ngữ trực tiếp 'the payment batch' (hành động chủ động truyền lệnh thanh toán) → chọn 'transmitting'. Loại 'transmission' (N không nhận trực tiếp tân ngữ phía sau mà thiếu 'of')."
      },
      {
        "q": "Although _____ less than half the price of competing models, the compact laser printer delivers crisp output.",
        "opts": [
          "cost",
          "costs",
          "costed",
          "costing"
        ],
        "ans": 3,
        "exp": "Động từ 'cost' (có giá là) mang nghĩa chủ động, không chia bị động ('Although it costs less...'), nên khi rút gọn sau 'Although' ta dùng hiện tại phân từ 'costing'."
      },
      {
        "q": "All promotional vouchers expire on December 31 unless otherwise _____ on the back of the card.",
        "opts": [
          "stating",
          "stated",
          "state",
          "to state"
        ],
        "ans": 1,
        "exp": "Cụm rút gọn cố định trong điều khoản thương mại TOEIC: 'unless otherwise stated/noted/specified' (= trừ khi có quy định khác — bị động của 'unless it is otherwise stated'). Chọn 'stated'."
      },
      {
        "q": "_____ negotiating with overseas distributors, our sales directors always consult the regional tariff guide.",
        "opts": [
          "While",
          "During",
          "Despite",
          "Because of"
        ],
        "ans": 0,
        "exp": "Sau chỗ trống là phân từ rút gọn 'negotiating' mang nghĩa 'trong khi đàm phán' → chỉ có liên từ 'While' kết hợp được với V-ing trong mệnh đề trạng ngữ rút gọn. Loại 'During' (chỉ + N), 'Despite' và 'Because of' (sai nghĩa)."
      },
      {
        "q": "Our technical crew can schedule an overnight server migration, if _____, to avoid disrupting daytime operations.",
        "opts": [
          "necessity",
          "necessarily",
          "necessary",
          "necessitate"
        ],
        "ans": 2,
        "exp": "Cụm rút gọn cố định 'if necessary' (= if it is necessary: nếu cần thiết). Do đó chọn tính từ 'necessary', loại danh từ 'necessity', trạng từ 'necessarily' và động từ 'necessitate'."
      }
    ]
  },
  {
    "id": "tg_45",
    "order": 45,
    "level": 4,
    "unitTitle": "Chặng 4 • Đảo ngữ, Giả định cách & Bẫy 850–990 (750–990)",
    "category": "Bẫy Từ loại & Từ vựng",
    "partTag": "Part 5–6",
    "title": "Bẫy Tính từ–Danh từ đặc biệt (economic/economical, considerable/considerate, đuôi -al/-ive)",
    "speedTip": "Mẹo 5 giây: Khi 4 đáp án có CÙNG TỪ LOẠI (2 tính từ gần giống nhau hoặc danh từ giả tính từ đuôi -al/-ive) → ĐỪNG chỉ nhìn hậu tố! Soi nhanh sắc thái nghĩa thương mại và phân biệt rõ từ gốc!",
    "formula": "economic (kinh tế) ≠ economical (tiết kiệm) | considerable (đáng kể) ≠ considerate (chu đáo) | reliable (đáng tin) ≠ reliant on (phụ thuộc) | N đuôi -al/-ive",
    "summary": "Ở vùng điểm 750–990, ETS đặt bẫy cực tinh vi bằng hai nhóm từ: (1) cặp tính từ cùng gốc nhưng khác nghĩa hoàn toàn, và (2) những danh từ mang hậu tố trông như tính từ (-al, -ive) khiến thí sinh loại nhầm ngay từ vòng quét hậu tố.",
    "theorySections": [
      {
        "heading": "1. Sáu cặp Tính từ cùng gốc dễ sập bẫy nhất ETS",
        "bullets": [
          "economic (thuộc nền kinh tế: economic growth/policy) ≠ economical (tiết kiệm chi phí/nhiên liệu: an economical vehicle).",
          "considerable (đáng kể, lớn lao: considerable progress/expense) ≠ considerate (chu đáo, biết nghĩ cho người khác: a considerate manager).",
          "reliable (đáng tin cậy: reliable supplier) ≠ reliant (on) (phụ thuộc vào: heavily reliant on imports).",
          "confident (tự tin: confident in our team) ≠ confidential (tuyệt mật: confidential records).",
          "respective (tương ứng riêng từng cái: their respective departments) ≠ respectful (lễ phép, tôn trọng) ≠ respectable (đáng kính trọng).",
          "industrial (thuộc công nghiệp) ≠ industrious (siêng năng); comparable (có thể sánh ngang) ≠ comparative (tương đối)."
        ]
      },
      {
        "heading": "2. Danh từ 'đội lốt' Tính từ đuôi -al & -ive cực hay ra thi",
        "bullets": [
          "Đuôi -al là DANH TỪ đếm được/không đếm được: proposal (đề xuất), approval (phê duyệt), renewal (gia hạn), arrival (sự đến), removal (di dời), dismissal (sa thải), manual (sổ tay), potential (tiềm năng), individual (cá nhân), professional (chuyên gia).",
          "Đuôi -ive là DANH TỪ chỉ người/vật: executive (giám đốc điều hành), representative (người đại diện), initiative (sáng kiến), objective (mục tiêu), alternative (phương án thay thế), incentive (chính sách khuyến khích), directive (chỉ thị)."
        ]
      },
      {
        "heading": "3. Bẫy cặp Tính từ & Danh từ gần mặt chữ khác",
        "bullets": [
          "beneficial (Adj: có lợi) ≠ beneficiary (N: người thụ hưởng bảo hiểm/quỹ).",
          "collaborative (Adj: mang tính hợp tác) ≠ collaborator (N: cộng tác viên).",
          "explanatory (Adj: có tính giải thích) ≠ explanation (N: lời giải thích)."
        ]
      }
    ],
    "examples": [
      {
        "en": "Hybrid delivery vans have proven far more <b>economical</b> to operate on urban routes than diesel trucks.",
        "vi": "Xe tải giao hàng hybrid đã chứng tỏ tiết kiệm chi phí vận hành trên tuyến đô thị hơn nhiều so với xe tải dầu diesel.",
        "note": "Nghĩa 'tiết kiệm chi phí/nhiên liệu' dùng 'economical', KHÔNG dùng 'economic' (thuộc kinh tế vĩ mô)."
      },
      {
        "en": "Because the factory is heavily <b>reliant</b> on imported microchips, management is diversifying its supplier base.",
        "vi": "Vì nhà máy phụ thuộc nặng nề vào vi mạch nhập khẩu, ban lãnh đạo đang đa dạng hóa nguồn cung ứng.",
        "note": "Đi với giới từ 'on' mang nghĩa 'phụ thuộc vào' → dùng 'reliant', không dùng 'reliable' (đáng tin cậy)."
      },
      {
        "en": "Following the merger briefing, department leads returned to their <b>respective</b> offices to update staff.",
        "vi": "Sau cuộc họp thông báo sáp nhập, các trưởng phòng quay về văn phòng riêng tương ứng của họ để cập nhật cho nhân viên.",
        "note": "Sau tính từ sở hữu số nhiều 'their' chỉ 'tương ứng của từng người' → dùng 'respective'."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The engineering firm invested a considerate amount of capital into solar battery research.",
        "right": "The engineering firm invested a <b>considerable</b> amount of capital into solar battery research.",
        "exp": "'Considerate' nghĩa là 'chu đáo/tâm lý' (dùng cho người/hành vi); muốn nói số tiền/lượng 'đáng kể, lớn' phải dùng 'considerable'."
      },
      {
        "wrong": "All employee medical files are kept strictly confident inside the encrypted HR system.",
        "right": "All employee medical files are kept strictly <b>confidential</b> inside the encrypted HR system.",
        "exp": "'Confident' là 'tự tin'; hồ sơ mật/bảo mật bắt buộc phải dùng 'confidential'."
      }
    ],
    "quiz": [
      {
        "q": "Switching to LED warehouse lighting proved to be the most _____ solution for lowering monthly utility bills.",
        "opts": [
          "economic",
          "economize",
          "economy",
          "economical"
        ],
        "ans": 3,
        "exp": "Sau 'the most' trước danh từ 'solution' cần tính từ mang nghĩa 'tiết kiệm chi phí' → chọn 'economical'. Loại 'economic' (thuộc về nền kinh tế), 'economy' (N), 'economize' (V)."
      },
      {
        "q": "The R&D department has made _____ progress in reducing the charging time of its lithium-ion batteries.",
        "opts": [
          "considerate",
          "considerable",
          "considering",
          "consideration"
        ],
        "ans": 1,
        "exp": "Trước danh từ 'progress' (tiến bộ) cần tính từ mang nghĩa 'đáng kể, rõ rệt' → chọn 'considerable'. Loại 'considerate' (chu đáo — chỉ tính cách), 'considering' (giới từ/V-ing), 'consideration' (N)."
      },
      {
        "q": "Smaller retail chains often remain overly _____ on seasonal holiday sales to meet their annual revenue goals.",
        "opts": [
          "reliable",
          "reliability",
          "reliant",
          "relying"
        ],
        "ans": 2,
        "exp": "Đứng sau 'remain overly' (liên động từ + trạng từ) và đi trước giới từ 'on' mang nghĩa 'phụ thuộc vào' → chọn tính từ 'reliant'. Loại 'reliable' (đáng tin cậy, không đi với 'on'), 'reliability' (N), 'relying' (không kết hợp với 'overly' sau 'remain')."
      },
      {
        "q": "All finalists must sign a nondisclosure form before viewing the client's _____ product specifications.",
        "opts": [
          "confidential",
          "confident",
          "confidence",
          "confidentially"
        ],
        "ans": 0,
        "exp": "Trước cụm danh từ 'product specifications' cần tính từ mang nghĩa 'bảo mật, tuyệt mật' (khớp với 'nondisclosure form' — thỏa thuận bảo mật) → chọn 'confidential'. Loại 'confident' (tự tin), 'confidence' (N), 'confidentially' (Adv)."
      },
      {
        "q": "The board approved a new green-commuting _____ that offers transit subsidies to employees who travel by rail.",
        "opts": [
          "initiate",
          "initiative",
          "initial",
          "initially"
        ],
        "ans": 1,
        "exp": "Sau 'a new green-commuting' cần một DANH TỪ số ít đóng vai trò làm tân ngữ của 'approved' và tiền ngữ của 'that offers...' → chọn danh từ đuôi '-ive' 'initiative' (sáng kiến/chương trình). Loại 'initiate' (V), 'initial' (Adj), 'initially' (Adv)."
      },
      {
        "q": "After the orientation seminar, new hires were escorted to their _____ divisions to meet their team supervisors.",
        "opts": [
          "respectful",
          "respectable",
          "respectively",
          "respective"
        ],
        "ans": 3,
        "exp": "Sau 'their' và trước danh từ 'divisions' cần tính từ mang nghĩa 'tương ứng riêng của từng người' → chọn 'respective'. Loại 'respectful' (lễ phép), 'respectable' (đáng kính), 'respectively' (Adv)."
      }
    ]
  },
  {
    "id": "tg_46",
    "order": 46,
    "level": 4,
    "unitTitle": "Chặng 4 • Đảo ngữ, Giả định cách & Bẫy 850–990 (750–990)",
    "category": "Bẫy Từ loại & Từ vựng",
    "partTag": "Part 5–6",
    "title": "Bẫy Trạng từ dễ nhầm (hard/hardly, late/lately, high/highly, near/nearly, most/almost)",
    "speedTip": "Mẹo 5 giây: KHÔNG phải cứ thêm -ly là giữ nguyên nghĩa gốc! Thuộc nằm lòng 6 cặp 'đổi nghĩa hoàn toàn': hard≠hardly (hầu như không), late≠lately (gần đây + HTHT), high≠highly (rất), near≠nearly (gần như), close≠closely (chặt chẽ), most (+N) ≠ almost (+all/every/số)!",
    "formula": "hardly (hầu như không) | lately (= recently + HTHT) | highly (+ Adj/V-ed) | nearly/almost (+ all/every/số) | closely (+ V: monitor/work)",
    "summary": "Đây là nhóm bẫy trạng từ 'kinh điển' mà ETS dùng để đánh rớt thí sinh máy móc chọn đại từ có đuôi -ly ở vị trí trạng từ. Mỗi cặp từ khác biệt hoàn toàn cả về nghĩa lẫn vị trí kết hợp từ (collocation).",
    "theorySections": [
      {
        "heading": "1. Bộ 4 cặp Trạng từ đổi nghĩa hoàn toàn khi thêm -ly",
        "bullets": [
          "hard (Adj/Adv: chăm chỉ, mạnh: work hard) ≠ hardly (Adv phủ định: hầu như không — hardly ever, hardly any; KHÔNG dùng chung với 'not'!).",
          "late (Adj/Adv: trễ, muộn: arrive late) ≠ lately (= recently: gần đây — dấu hiệu vàng của Hiện tại hoàn thành!).",
          "high (Adj/Adv: cao về vật lý: climb high) ≠ highly (Adv chỉ mức độ: rất, cực kỳ — highly qualified, highly recommended, think highly of).",
          "near (Prep/Adv: gần địa điểm: near the station) ≠ nearly (= almost: gần như — nearly 200 delegates, nearly finished)."
        ]
      },
      {
        "heading": "2. Cặp 'close / closely' & 'free / freely'",
        "bullets": [
          "close (gần về khoảng cách: sit close to the stage) ≠ closely (kỹ lưỡng, sát sao, chặt chẽ: work closely with, monitor closely, examine closely).",
          "free (miễn phí: enter free of charge) ≠ freely (tự do, thoải mái: speak freely, move freely)."
        ]
      },
      {
        "heading": "3. Bẫy chết người giữa 'most' và 'almost'",
        "bullets": [
          "most (Lượng từ): đứng trực tiếp trước danh từ số nhiều/KĐĐ (most employees) hoặc 'most of the + N' (most of the budget).",
          "almost (Trạng từ): KHÔNG BAO GIỜ đứng ngay trước danh từ! Phải đứng trước lượng từ/con số/tính từ: almost all employees, almost every branch, almost 80%, almost complete."
        ]
      }
    ],
    "examples": [
      {
        "en": "Our engineering division works <b>closely</b> with overseas suppliers to maintain strict quality control.",
        "vi": "Bộ phận kỹ thuật của chúng tôi làm việc chặt chẽ với các nhà cung cấp nước ngoài để duy trì kiểm soát chất lượng nghiêm ngặt.",
        "note": "Cụm cố định TOEIC 'work closely with' (phối hợp sát sao), không dùng 'close'."
      },
      {
        "en": "Sales of portable solar generators have increased noticeably <b>lately</b> due to seasonal camping demand.",
        "vi": "Doanh số máy phát điện năng lượng mặt trời di động gần đây đã tăng rõ rệt nhờ nhu cầu cắm trại theo mùa.",
        "note": "Thì hiện tại hoàn thành 'have increased' khớp với trạng từ 'lately' (= gần đây), không phải 'late' (muộn)."
      },
      {
        "en": "<b>Almost</b> all of the seats for the keynote workshop were reserved within two hours of opening.",
        "vi": "Gần như tất cả chỗ ngồi cho hội thảo chính đã được đặt kín trong vòng hai giờ sau khi mở đăng ký.",
        "note": "Trước lượng từ 'all of the seats' phải dùng trạng từ 'Almost' (không viết 'Most all')."
      }
    ],
    "pitfalls": [
      {
        "wrong": "Almost employees at the branch commute via the regional light-rail line.",
        "right": "<b>Most</b> employees (hoặc <b>Almost all</b> employees) at the branch commute via the regional light-rail line.",
        "exp": "'Almost' là trạng từ nên không đứng trực tiếp trước danh từ 'employees'; phải dùng 'Most' hoặc 'Almost all'."
      },
      {
        "wrong": "Because of the storm, the afternoon express train arrived lately by forty minutes.",
        "right": "Because of the storm, the afternoon express train arrived <b>late</b> by forty minutes.",
        "exp": "Muốn diễn tả 'đến muộn/trễ giờ' phải dùng trạng từ 'late', không dùng 'lately' (nghĩa là 'gần đây')."
      }
    ],
    "quiz": [
      {
        "q": "The newly launched accounting platform has received _____ favorable reviews from independent software analysts.",
        "opts": [
          "highly",
          "high",
          "height",
          "higher"
        ],
        "ans": 0,
        "exp": "Trước tính từ 'favorable' cần trạng từ chỉ mức độ mang nghĩa 'rất, cực kỳ' → chọn 'highly'. Loại 'high' (độ cao vật lý), 'height' (N), 'higher' (so sánh hơn)."
      },
      {
        "q": "Because the conference venue is so spacious, there was _____ any crowding even during the opening keynote.",
        "opts": [
          "hard",
          "harder",
          "hardly",
          "hardness"
        ],
        "ans": 2,
        "exp": "Đi với 'any' ('hardly any' = hầu như không có) phù hợp với bối cảnh hội trường rất rộng rãi → chọn 'hardly'. Loại 'hard' (chăm chỉ/cứng), 'harder', 'hardness'."
      },
      {
        "q": "_____ every retail outlet in the network has transitioned to the contactless payment terminal.",
        "opts": [
          "Most",
          "Almost",
          "Mostly",
          "Near"
        ],
        "ans": 1,
        "exp": "Đứng ngay trước hạn định từ 'every' để diễn tả 'gần như mọi cửa hàng' → bắt buộc chọn trạng từ 'Almost' ('almost every'). Loại 'Most' (không viết 'most every'), 'Mostly' (chủ yếu), 'Near' (gần vị trí)."
      },
      {
        "q": "The compliance unit will monitor transaction logs _____ throughout the transition to the new banking server.",
        "opts": [
          "close",
          "closing",
          "closer",
          "closely"
        ],
        "ans": 3,
        "exp": "Cụm kết hợp chuẩn TOEIC 'monitor + O + closely' (theo dõi sát sao, chặt chẽ) → chọn 'closely'. Loại 'close' (khoảng cách gần), 'closer', 'closing'."
      },
      {
        "q": "Several regional airlines have adjusted their baggage fee policies _____ in response to rising fuel prices.",
        "opts": [
          "late",
          "later",
          "lately",
          "latest"
        ],
        "ans": 2,
        "exp": "Động từ chia Hiện tại hoàn thành ('have adjusted') kết hợp nghĩa 'gần đây' → chọn 'lately' (= recently). Loại 'late' (muộn), 'later' (sau này), 'latest' (mới nhất — tính từ)."
      },
      {
        "q": "The charitable auction raised _____ $45,000 for local vocational scholarships—surpassing last year's record.",
        "opts": [
          "nearly",
          "near",
          "most",
          "hardly"
        ],
        "ans": 0,
        "exp": "Đứng trước con số '$45,000' với nghĩa tích cực 'gần đạt mức 45.000 đô la' (khớp vế sau 'vượt kỷ lục năm ngoái') → chọn 'nearly'. Loại 'near' (vị trí), 'most' (không đi trước số tiền), 'hardly' (hầu như không — mâu thuẫn vế sau)."
      }
    ]
  },
  {
    "id": "tg_47",
    "order": 47,
    "level": 4,
    "unitTitle": "Chặng 4 • Đảo ngữ, Giả định cách & Bẫy 850–990 (750–990)",
    "category": "Cấu trúc câu",
    "partTag": "Part 5–6",
    "title": "Câu chẻ (It is...that), No matter how/what & However + Adj",
    "speedTip": "Mẹo 5 giây: Thấy 'It is/was + [N/Cụm giới từ] + _____' → chốt ngay 'that' (hoặc 'who' nếu nhấn người)! Thấy '_____ + Adj/Adv + S + V, S + V' (không dấu phẩy ngay sau chỗ trống!) → chọn 'However' (= No matter how)!",
    "formula": "It is/was + X + that/who + ...  |  However + Adj/Adv + S + V, ... (= No matter how)  |  No matter what/who/where/when + S + V, ...",
    "summary": "Câu chẻ nhấn mạnh và mệnh đề nhượng bộ cấu trúc 'However + Adj' / 'No matter + Wh-' là những cấu trúc nâng cao giúp bài viết thương mại nhấn mạnh trọng tâm hoặc lập luận chặt chẽ, thường xuất hiện ở 5 câu cuối Part 5.",
    "theorySections": [
      {
        "heading": "1. Câu chẻ nhấn mạnh (Cleft Sentences: It is/was ... that)",
        "bullets": [
          "Cấu trúc: It is/was + [Chủ ngữ / Tân ngữ / Trạng ngữ cần nhấn mạnh] + that + phần còn lại của câu.",
          "Khi nhấn mạnh NGƯỜI, có thể dùng 'who' hoặc 'that' (It was Ms. Ortega who redesigned the workflow); khi nhấn mạnh VẬT, THỜI GIAN, NƠI CHỐN hoặc CỤM GIỚI TỪ, BẮT BUỘC dùng 'that' (KHÔNG dùng when/where/which trong câu chẻ chuẩn!).",
          "Biến thể nhấn mạnh thời điểm: It was not until + mốc/mệnh đề + THAT + S + V (Mãi đến tận khi... thì mới...)."
        ]
      },
      {
        "heading": "2. Phân biệt 'However + Adj/Adv' (Liên từ) vs 'However,' (Trạng từ nối)",
        "bullets": [
          "However + Adj/Adv + S + V, S + V (= Dù ... đến mức nào đi nữa): KHÔNG có dấu phẩy ngay sau However; bắt buộc kéo Tính từ hoặc Trạng từ lên đứng ngay sát sau However (However busy the season becomes, ...).",
          "However, S + V (Tuy nhiên): trạng từ liên kết tách bằng dấu phẩy, không nối 2 mệnh đề bằng dấu phẩy đơn."
        ]
      },
      {
        "heading": "3. Cấu trúc 'No matter + Wh-' & Nhóm '-ever' tương đương",
        "bullets": [
          "No matter how + Adj/Adv = However + Adj/Adv.",
          "No matter what/who/which/where/when + S + V = Whatever / Whoever / Whichever / Wherever / Whenever + S + V (khi làm mệnh đề trạng ngữ nhượng bộ: No matter how small the order is, we guarantee tracking)."
        ]
      }
    ],
    "examples": [
      {
        "en": "It was the logistics coordinator <b>who</b> first noticed the discrepancy on the customs manifest.",
        "vi": "Chính điều phối viên hậu cần là người đầu tiên phát hiện ra sự chênh lệch trên bản kê khai hải quan.",
        "note": "Câu chẻ nhấn mạnh chủ ngữ chỉ người 'the logistics coordinator' → dùng 'who' (hoặc 'that')."
      },
      {
        "en": "It was not until Tuesday afternoon <b>that</b> the accounting team received the corrected invoice.",
        "vi": "Mãi cho đến chiều thứ Ba, đội kế toán mới nhận được hóa đơn đã chỉnh sửa.",
        "note": "Cấu trúc cố định 'It was not until + [thời gian] + that + S + V' (KHÔNG dùng 'when' hay 'until' ở chỗ trống thứ hai!)."
      },
      {
        "en": "<b>However</b> tight the production deadline may be, safety inspections are never skipped.",
        "vi": "Dù thời hạn sản xuất có gấp rút đến mức nào đi nữa, các khâu kiểm tra an toàn không bao giờ bị bỏ qua.",
        "note": "'However' + tính từ 'tight' + S + V tạo mệnh đề nhượng bộ nối với mệnh đề chính qua dấu phẩy."
      }
    ],
    "pitfalls": [
      {
        "wrong": "It was during the autumn trade fair when we signed our largest European distributor.",
        "right": "It was during the autumn trade fair <b>that</b> we signed our largest European distributor.",
        "exp": "Trong câu chẻ nhấn mạnh cụm trạng ngữ thời gian/nơi chốn ('It was during...'), bắt buộc dùng 'that', không dùng 'when' hay 'where'."
      },
      {
        "wrong": "No matter what rapidly technology evolves, clear customer communication remains vital.",
        "right": "<b>No matter how</b> rapidly technology evolves, clear customer communication remains vital.",
        "exp": "Đi trước trạng từ 'rapidly' (hay tính từ) phải dùng 'No matter how' (hoặc 'However'), không dùng 'No matter what'."
      }
    ],
    "quiz": [
      {
        "q": "It was not until the final round of testing _____ engineers identified the source of the battery drain.",
        "opts": [
          "when",
          "that",
          "which",
          "what"
        ],
        "ans": 1,
        "exp": "Cấu trúc câu chẻ nhấn mạnh thời điểm cố định: 'It was not until + [mốc thời gian] + THAT + S + V'. Không dùng 'when', 'which', hay 'what'."
      },
      {
        "q": "_____ complex the tax regulations may appear, our payroll software calculates all deductions automatically.",
        "opts": [
          "Whatever",
          "Despite",
          "Although",
          "However"
        ],
        "ans": 3,
        "exp": "Ngay sau chỗ trống là tính từ 'complex' đứng trước S+V ('the tax regulations may appear') tạo mệnh đề nhượng bộ 'Dù phức tạp đến mức nào' → chọn 'However' (= No matter how). Loại 'Whatever' (+ N/S+V), 'Although' (+ S+V bình thường), 'Despite' (+ N)."
      },
      {
        "q": "No matter _____ route the regional shuttle takes, morning traffic near the bridge remains heavy.",
        "opts": [
          "which",
          "how",
          "who",
          "when"
        ],
        "ans": 0,
        "exp": "Sau chỗ trống là danh từ 'route' (tuyến đường — chọn trong các tuyến có sẵn) → 'No matter which + N' (= Dù chọn tuyến đường nào đi nữa). Loại 'how' (+ Adj/Adv), 'who' (người), 'when' (thời gian)."
      },
      {
        "q": "It is through continuous employee training _____ Vertex Manufacturing maintains its industry-leading safety record.",
        "opts": [
          "which",
          "where",
          "that",
          "what"
        ],
        "ans": 2,
        "exp": "Câu chẻ nhấn mạnh cụm giới từ chỉ phương thức 'through continuous employee training' → cấu trúc 'It is + [cụm giới từ] + THAT + S + V' → chọn 'that'."
      },
      {
        "q": "_____ hard the sales representatives worked to negotiate an extension, the client opted for an earlier launch date.",
        "opts": [
          "Regardless of",
          "No matter what",
          "Even though",
          "No matter how"
        ],
        "ans": 3,
        "exp": "Sau chỗ trống là trạng từ 'hard' đặt trước S+V ('the sales representatives worked') → cấu trúc nhượng bộ 'No matter how + Adv + S + V'. Loại 'No matter what' (không đi với Adv), 'Even though' (phải viết 'Even though the sales representatives worked hard'), 'Regardless of' (+ N)."
      },
      {
        "q": "_____ department you transfer to within the group, your accumulated pension benefits remain fully intact.",
        "opts": [
          "However",
          "Whichever",
          "Whoever",
          "Whenever"
        ],
        "ans": 1,
        "exp": "Trước danh từ 'department' (phòng ban trong nhóm giới hạn các phòng ban của tập đoàn) mang nghĩa 'Bất kỳ phòng ban nào bạn chuyển tới' → chọn 'Whichever'. Loại 'However' (+ Adj/Adv), 'Whoever' (người), 'Whenever' (thời gian)."
      }
    ]
  },
  {
    "id": "tg_48",
    "order": 48,
    "level": 4,
    "unitTitle": "Chặng 4 • Đảo ngữ, Giả định cách & Bẫy 850–990 (750–990)",
    "category": "Động từ",
    "partTag": "Part 5–6",
    "title": "Ngoại động từ KHÔNG dùng giới từ (discuss / attend / mention / contact / approach)",
    "speedTip": "Mẹo 5 giây: Cảnh giác bẫy dịch từng chữ tiếng Việt! Thấy 'discuss / attend / mention / contact / approach / enter / await / address / comprise / accompany' → nhận TÂN NGỮ TRỰC TIẾP, tuyệt đối LOẠI các đáp án chèn giới từ thừa (about/with/to/for)!",
    "formula": "discuss / mention / address / approach / contact / attend / enter / await / accompany / comprise + O (0 giới từ!)",
    "summary": "Người học Việt Nam rất dễ mất điểm oan ở câu hỏi ngoại động từ vì dịch theo thói quen tiếng Việt ('thảo luận về' → discuss about, 'liên hệ với' → contact with). Chuyên đề hệ thống hóa 12 ngoại động từ ETS hay bẫy nhất và các cặp nội/ngoại động từ song song.",
    "theorySections": [
      {
        "heading": "1. 12 Ngoại động từ KHÔNG kèm giới từ hay ra nhất TOEIC",
        "bullets": [
          "discuss sth (thảo luận về — KHÔNG 'discuss about') | mention sth (đề cập đến — KHÔNG 'mention about').",
          "contact / reach sb (liên hệ với — KHÔNG 'contact with') | attend an event (tham dự — KHÔNG 'attend to/at'; chú ý: 'attend to' = giải quyết/chăm sóc!).",
          "approach a deadline/problem (tiếp cận — KHÔNG 'approach to') | enter a building/market (bước vào — KHÔNG 'enter into' cho không gian vật lý; chỉ dùng 'enter into a contract').",
          "await sth (= wait for: chờ đợi) | comprise sth (= consist of: bao gồm) | accompany sb (đi cùng ai) | address an issue (giải quyết vấn đề) | exceed a target (vượt mục tiêu) | oppose a plan (phản đối)."
        ]
      },
      {
        "heading": "2. Bẫy đảo chiều: Động từ BẮT BUỘC đi với giới từ cố định",
        "bullets": [
          "explain sth TO sb (giải thích cái gì cho ai — KHÔNG viết 'explain me the policy'!).",
          "inform / notify / remind sb OF/ABOUT sth (thông báo/nhắc ai về việc gì).",
          "provide / supply / equip sb WITH sth = provide sth FOR/TO sb.",
          "comply WITH, adhere TO, participate IN, apologize FOR, account FOR, refrain FROM."
        ]
      },
      {
        "heading": "3. Phân biệt nhanh khi cùng nghĩa: Ngoại động từ vs Nội động từ + Giới từ",
        "bullets": [
          "await + N  ↔  wait FOR + N  |  comprise + N  ↔  consist OF + N.",
          "attend + N (tham dự)  ↔  participate IN + N  |  reach + N (đến nơi)  ↔  arrive AT/IN + N.",
          "Nếu SAU chỗ trống ĐÃ CÓ sẵn giới từ (ví dụ: _____ for approval / _____ in the seminar), phải chọn nội động từ (wait / participate), KHÔNG chọn ngoại động từ (await / attend)!"
        ]
      }
    ],
    "examples": [
      {
        "en": "The steering committee will <b>discuss</b> the revised expansion budget during Friday's executive session.",
        "vi": "Ban chỉ đạo sẽ thảo luận về ngân sách mở rộng sửa đổi trong phiên họp điều hành thứ Sáu.",
        "note": "'Discuss' là ngoại động từ nhận trực tiếp 'the revised expansion budget', không thêm 'about'."
      },
      {
        "en": "Should you encounter billing errors, please <b>contact</b> our customer care center immediately.",
        "vi": "Nếu bạn gặp sai sót hóa đơn, vui lòng liên hệ ngay trung tâm chăm sóc khách hàng của chúng tôi.",
        "note": "'Contact' (động từ) không đi với 'with'; chỉ khi là danh từ mới dùng 'be in contact with'."
      },
      {
        "en": "The regional warehouse is still <b>awaiting</b> final customs clearance for the autumn apparel shipment.",
        "vi": "Kho khu vực vẫn đang chờ thông quan hải quan cuối cùng cho lô hàng trang phục mùa thu.",
        "note": "'Await' (= wait for) không có giới từ 'for' đi kèm; nếu có sẵn 'for' phía sau thì mới chọn 'waiting'."
      }
    ],
    "pitfalls": [
      {
        "wrong": "Over three hundred delegates will attend to the International Logistics Forum next month.",
        "right": "Over three hundred delegates will <b>attend</b> the International Logistics Forum next month.",
        "exp": "'Attend' (tham dự sự kiện) là ngoại động từ không dùng giới từ 'to' ('attend to' nghĩa là xử lý/chú tâm chăm sóc)."
      },
      {
        "wrong": "The instructor clearly explained the trainees how to calibrate the laser scanner.",
        "right": "The instructor clearly <b>explained to</b> the trainees how to calibrate the laser scanner.",
        "exp": "'Explain' không nhận trực tiếp tân ngữ chỉ người ngay sau nó; phải dùng 'explain to + người'."
      }
    ],
    "quiz": [
      {
        "q": "All department supervisors are required to _____ the mandatory cybersecurity briefing on Thursday morning.",
        "opts": [
          "participate",
          "arrive",
          "attend",
          "listen"
        ],
        "ans": 2,
        "exp": "Sau chỗ trống là cụm tân ngữ trực tiếp 'the mandatory cybersecurity briefing' (KHÔNG có giới từ 'in/at/to') → bắt buộc chọn ngoại động từ 'attend'. Loại 'participate' (thiếu 'in'), 'arrive' (thiếu 'at'), 'listen' (thiếu 'to')."
      },
      {
        "q": "Management is currently _____ final written confirmation from the municipal zoning board before signing the lease.",
        "opts": [
          "awaiting",
          "waiting",
          "looking",
          "depending"
        ],
        "ans": 0,
        "exp": "Sau chỗ trống là tân ngữ trực tiếp 'final written confirmation' (không có 'for' hay 'on') → chọn ngoại động từ 'awaiting' (= waiting for). Loại 'waiting' (thiếu 'for'), 'looking' (thiếu 'for'), 'depending' (thiếu 'on')."
      },
      {
        "q": "Please _____ the human resources office directly if you need to update your emergency contact information.",
        "opts": [
          "speak",
          "contact with",
          "communicate",
          "contact"
        ],
        "ans": 3,
        "exp": "Sau chỗ trống là tân ngữ trực tiếp 'the human resources office' → chọn ngoại động từ 'contact' (không dùng 'contact with'). Loại 'communicate' và 'speak' vì thiếu giới từ 'with/to'."
      },
      {
        "q": "The newly assembled task force _____ twelve senior engineers representing six European subsidiaries.",
        "opts": [
          "consists",
          "comprises",
          "contains of",
          "makes up of"
        ],
        "ans": 1,
        "exp": "'Comprise' (= consist of) là ngoại động từ đi thẳng với tân ngữ 'twelve senior engineers' không cần 'of'. Loại 'consists' (thiếu 'of'), 'contains of' (sai vì 'contain' không có 'of'), 'makes up of' (sai thể chủ động)."
      },
      {
        "q": "The keynote speaker spent twenty minutes _____ the logistical challenges of zero-waste packaging.",
        "opts": [
          "addressing",
          "mentioning about",
          "discussing about",
          "talking"
        ],
        "ans": 0,
        "exp": "Cấu trúc 'spend + time + V-ing' + tân ngữ trực tiếp 'the logistical challenges' → chọn ngoại động từ 'addressing' (giải quyết/bàn về vấn đề). Loại 'discussing about' và 'mentioning about' (thừa 'about'), 'talking' (thiếu 'about')."
      },
      {
        "q": "Before the contract renewal date _____, our account manager will schedule a comprehensive service review.",
        "opts": [
          "arrives to",
          "approaches to",
          "approaches",
          "reaches at"
        ],
        "ans": 2,
        "exp": "'Approach' vừa làm ngoại động từ không giới từ vừa làm nội động từ mang nghĩa 'đến gần' ('the renewal date approaches'). Ba phương án còn lại đều gắn sai giới từ thừa ('approaches to', 'arrives to', 'reaches at')."
      }
    ]
  },
  {
    "id": "tg_49",
    "order": 49,
    "level": 4,
    "unitTitle": "Chặng 4 • Đảo ngữ, Giả định cách & Bẫy 850–990 (750–990)",
    "category": "Danh từ đặc biệt",
    "partTag": "Part 5–6",
    "title": "Danh từ Không đếm được & Luôn số nhiều thương mại (equipment / premises / belongings)",
    "speedTip": "Mẹo 5 giây: Thấy equipment / furniture / luggage / merchandise / machinery / software / information / feedback / access / funding → CẤM 'a/an', CẤM thêm '-s', chia ĐT SỐ ÍT! Thấy premises / belongings / earnings / proceeds / savings / goods → chia ĐT SỐ NHIỀU!",
    "formula": "Không đếm được (0 a/an, 0 -s, V số ít): equipment, furniture, merchandise, information, access  |  Luôn số nhiều (V số nhiều): premises, belongings, earnings, proceeds",
    "summary": "Bẫy danh từ đếm được/không đếm được và danh từ luôn số nhiều là lỗi kinh điển ngay cả ở thí sinh trình độ 750+. Nắm chắc danh sách từ vựng thương mại cốt lõi giúp bạn xử lý tức thì câu hỏi mạo từ, lượng từ và hòa hợp chủ–vị.",
    "theorySections": [
      {
        "heading": "1. Danh từ Không đếm được kinh điển trong đề ETS (Chia SỐ ÍT)",
        "bullets": [
          "Nhóm vật tư & hàng hóa: equipment (thiết bị), furniture (nội thất), machinery (máy móc), merchandise (hàng hóa), luggage/baggage (hành lý), stationery (văn phòng phẩm), clothing (quần áo), software/hardware.",
          "Nhóm thông tin & tài chính: information, advice, feedback, news, research, evidence, access, funding, progress, legislation, correspondence (thư từ giao dịch).",
          "Quy tắc sắt: KHÔNG đi với 'a/an', KHÔNG thêm '-s', đi với 'much / little / a great deal of / an amount of / some / any', dùng đơn vị 'a piece of / an item of' khi cần đếm."
        ]
      },
      {
        "heading": "2. Danh từ Luôn ở dạng Số nhiều thương mại (Chia SỐ NHIỀU)",
        "bullets": [
          "premises (khuôn viên, cơ sở kinh doanh — on the premises), belongings (đồ đạc cá nhân), surroundings (môi trường xung quanh).",
          "earnings (lợi nhuận, thu nhập), proceeds (tiền thu được từ sự kiện/bán đấu giá), savings (khoản tiết kiệm), funds (nguồn quỹ), goods (hàng hóa), customs (cơ quan hải quan), congratulations, regards.",
          "Đi kèm động từ số nhiều ('The proceeds from the gala ARE donated...') và hạn định từ số nhiều ('these premises', 'personal belongings')."
        ]
      },
      {
        "heading": "3. Bẫy Danh từ tận cùng bằng '-s' nhưng lại là SỐ ÍT",
        "bullets": [
          "news (tin tức), economics (kinh tế học), logistics (hậu cần), electronics (ngành điện tử), mathematics, statistics (ngành thống kê), physics → chia động từ SỐ ÍT khi chỉ môn học/lĩnh vực!",
          "Cẩn thận: 'series', 'means', 'species', 'headquarters' giữ nguyên chữ '-s' cho cả số ít lẫn số nhiều (a new series of workshops IS... / two series ARE...)."
        ]
      }
    ],
    "examples": [
      {
        "en": "All newly purchased laboratory <b>equipment has</b> been calibrated according to ISO standards.",
        "vi": "Toàn bộ thiết bị phòng thí nghiệm mới mua đã được hiệu chuẩn theo tiêu chuẩn ISO.",
        "note": "'Equipment' không đếm được → không viết 'equipments' và chia động từ số ít 'has'."
      },
      {
        "en": "All <b>proceeds</b> from Saturday's charity auction <b>are</b> earmarked for community literacy programs.",
        "vi": "Toàn bộ tiền thu được từ buổi đấu giá từ thiện thứ Bảy được dành riêng cho các chương trình xóa mù chữ cộng đồng.",
        "note": "'Proceeds' luôn ở dạng số nhiều → chia động từ số nhiều 'are'."
      },
      {
        "en": "Visitors are kindly reminded not to leave personal <b>belongings</b> unattended on the company <b>premises</b>.",
        "vi": "Khách tham quan được nhắc nhở không để tư trang cá nhân không có người trông coi trong khuôn viên công ty.",
        "note": "Cả 'belongings' và 'premises' đều là danh từ luôn có '-s' cực phổ biến trong thông báo TOEIC."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The hotel provided many useful informations about local shuttle services.",
        "right": "The hotel provided <b>much useful information</b> (hoặc a great deal of useful information) about local shuttle services.",
        "exp": "'Information' là danh từ không đếm được: không thêm '-s' và không dùng với 'many' (chỉ dùng 'much / some / a lot of')."
      },
      {
        "wrong": "Smoking is strictly prohibited anywhere on the factory premise.",
        "right": "Smoking is strictly prohibited anywhere on the factory <b>premises</b>.",
        "exp": "Nghĩa 'khuôn viên/mặt bằng cơ sở' luôn ở dạng số nhiều 'premises' (còn 'premise' số ít nghĩa là 'tiền đề lập luận')."
      }
    ],
    "quiz": [
      {
        "q": "The renovated flagship store displays seasonal _____ from more than thirty independent European designers.",
        "opts": [
          "merchandises",
          "a merchandise",
          "many merchandise",
          "merchandise"
        ],
        "ans": 3,
        "exp": "'Merchandise' (hàng hóa) là danh từ không đếm được: không thêm '-s', không dùng mạo từ 'a' và không đi với 'many' → chọn 'merchandise'."
      },
      {
        "q": "All net _____ from the annual corporate marathon will be donated to the regional children's hospital.",
        "opts": [
          "proceed",
          "proceeds",
          "proceeding",
          "a proceed"
        ],
        "ans": 1,
        "exp": "Danh từ thương mại mang nghĩa 'tiền thu được từ hoạt động/sự kiện' luôn ở dạng số nhiều 'proceeds' → chọn 'proceeds'."
      },
      {
        "q": "Before the relocation begins, the facilities team must verify that every piece of medical _____ properly packaged.",
        "opts": [
          "equipments are",
          "equipment are",
          "equipment is",
          "equipments is"
        ],
        "ans": 2,
        "exp": "'Equipment' không đếm được (loại 'equipments') và chủ ngữ 'every piece of medical equipment' chia động từ SỐ ÍT → chọn 'equipment is'."
      },
      {
        "q": "Security badges must be visibly worn at all times while employees are on company _____.",
        "opts": [
          "premises",
          "premise",
          "a premise",
          "premising"
        ],
        "ans": 0,
        "exp": "Cụm cố định TOEIC 'on (company) premises' (trong khuôn viên cơ sở công ty) luôn dùng danh từ số nhiều 'premises'."
      },
      {
        "q": "Because the startup received _____ constructive feedback from early adopters, it redesigned the mobile dashboard.",
        "opts": [
          "many",
          "a great deal of",
          "several",
          "a few"
        ],
        "ans": 1,
        "exp": "'Feedback' (phản hồi) là danh từ không đếm được nên chỉ đi với lượng từ dành cho N không đếm được → chọn 'a great deal of'. Loại 'many', 'several', 'a few' (chỉ đi với N đếm được số nhiều)."
      },
      {
        "q": "Quarterly _____ for the telecommunications giant exceeded analysts' projections by nearly nine percent.",
        "opts": [
          "earning",
          "an earning",
          "earned",
          "earnings"
        ],
        "ans": 3,
        "exp": "Trong báo cáo tài chính TOEIC, danh từ mang nghĩa 'lợi nhuận / thu nhập doanh nghiệp' luôn dùng dạng số nhiều 'earnings' ('quarterly earnings'). Chọn 'earnings'."
      }
    ]
  },
  {
    "id": "tg_50",
    "order": 50,
    "level": 4,
    "unitTitle": "Chặng 4 • Đảo ngữ, Giả định cách & Bẫy 850–990 (750–990)",
    "category": "Tổng ôn 850–990",
    "partTag": "Part 5–6",
    "title": "Tổng ôn 15 Bẫy Kinh điển Part 5–6 mức 850–990",
    "speedTip": "Mẹo 5 giây 900+: Trước khi khoanh bất kỳ câu khó nào, chạy nhanh bộ lọc 4 bước: (1) Đếm Động từ chính chia thì, (2) Soi Chủ–Bị động & Giới từ sau chỗ trống, (3) Quét dấu hiệu Đảo ngữ/Giả định, (4) Chốt bẫy nghĩa từ đồng gốc!",
    "formula": "Bộ lọc 4 bước: [1. Đếm ĐT chính] → [2. Soi O/Prep & S-V] → [3. Đảo ngữ/Giả định] → [4. Bẫy từ loại -al/-ive & Trạng từ -ly]",
    "summary": "Chuyên đề chốt hạ toàn bộ lộ trình 50 bài ngữ pháp TOEIC, cô đọng 15 cạm bẫy phân hóa điểm 850–990 phổ biến nhất của đề ETS thực chiến. Hoàn thành 100% bài kiểm tra tổng hợp này xác nhận bạn đã đủ phản xạ ngữ pháp cho mục tiêu 900+.",
    "theorySections": [
      {
        "heading": "1. Top 5 Bẫy Cấu trúc Câu (Đảo ngữ, Giả định, Mệnh đề)",
        "bullets": [
          "Bẫy #1 — Đảo ngữ điều kiện mất 'If': Should + S + V-bare | Were + S + to-V | Had + S + V3 (phủ định đặt 'not' sau S).",
          "Bẫy #2 — Đảo ngữ phủ định & Only: Never/Rarely/Not only + Trợ ĐT + S + V; Only after/when + mệnh đề phụ, Trợ ĐT + S + V (đảo vế chính).",
          "Bẫy #3 — Thức Giả định (Subjunctive): suggest/insist/require/mandatory + that + S + (not) + V-bare / be V3 (cấm chia -s/is!).",
          "Bẫy #4 — Mệnh đề Danh ngữ làm chủ ngữ & 'whoever': That + S+V + V(số ít); to + whoever + V (làm chủ ngữ của vế sau).",
          "Bẫy #5 — Câu chẻ nhấn mạnh: It is/was + [N/Cụm giới từ/not until...] + THAT + S + V (không dùng when/where)."
        ]
      },
      {
        "heading": "2. Top 5 Bẫy Động từ & Phân từ",
        "bullets": [
          "Bẫy #6 — 1 câu đơn = 1 động từ chính: còn lại bổ nghĩa cho N phải rút gọn V-ing (có O/nội ĐT) hoặc V3/ed (bị động).",
          "Bẫy #7 — Phân từ đầu câu & Mệnh đề trạng ngữ rút gọn: luôn chiếu Chủ ngữ SAU dấu phẩy (Designed for..., Once approved...).",
          "Bẫy #8 — Ngoại động từ 0 giới từ: discuss, attend, mention, contact, approach, await, comprise, address + O trực tiếp.",
          "Bẫy #9 — Động từ 5 thành phần & Sai khiến: make/keep/find/consider + O + Adj; have/get + sth + V3/ed; get + sb + to-V.",
          "Bẫy #10 — Cấm 'will' trong mệnh đề thời gian/điều kiện (when/once/if/before/until + HTĐ) & Tương lai hoàn thành với 'by + mốc TL'."
        ]
      },
      {
        "heading": "3. Top 5 Bẫy Từ loại, Giới từ & Từ vựng đồng gốc",
        "bullets": [
          "Bẫy #11 — Giới từ vs Liên từ vs Trạng từ nối: despite/due to/prior to (+ N/V-ing) ≠ although/because (+ S+V) ≠ however/therefore (sau dấu . / ; trước dấu ,).",
          "Bẫy #12 — Danh từ đuôi -al/-ive giả tính từ: proposal, renewal, approval, manual, initiative, representative, objective, alternative.",
          "Bẫy #13 — Tính từ đồng gốc dễ nhầm: economic/economical, considerable/considerate, reliable/reliant, confident/confidential, respective/respectful.",
          "Bẫy #14 — Trạng từ đổi nghĩa khi thêm -ly: hard/hardly, late/lately, high/highly, near/nearly, close/closely, most/almost.",
          "Bẫy #15 — Danh từ không đếm được (equipment, merchandise, information, feedback) & luôn số nhiều (premises, proceeds, earnings, belongings)."
        ]
      }
    ],
    "examples": [
      {
        "en": "<b>Had</b> the procurement office notified suppliers earlier, the revised <b>proposal</b> would have received unanimous <b>approval</b>.",
        "vi": "Giá mà phòng mua sắm thông báo sớm hơn cho các nhà cung cấp, bản đề xuất sửa đổi hẳn đã nhận được sự phê duyệt nhất trí.",
        "note": "Kết hợp Đảo ngữ Loại 3 ('Had...') với 2 danh từ đuôi '-al' ('proposal', 'approval')."
      },
      {
        "en": "The auditor insisted that every regional branch <b>retain</b> original receipts, <b>however</b> minor the expense may appear.",
        "vi": "Kiểm toán viên yêu cầu mọi chi nhánh khu vực phải lưu giữ hóa đơn gốc, dù khoản chi phí có vẻ nhỏ đến đâu.",
        "note": "Kết hợp Thức Giả định ('insisted that ... retain') và mệnh đề nhượng bộ ('however + Adj + S + V')."
      }
    ],
    "pitfalls": [
      {
        "wrong": "Thấy từ quen mắt ở đáp án A liền chọn ngay mà không kiểm tra động từ chính hay dấu câu phía sau.",
        "right": "Luôn dành 2 giây cuối rà soát <b>động từ chia thì, giới từ đi kèm và chủ ngữ sau dấu phẩy</b> trước khi chốt đáp án.",
        "exp": "Ở mức 850–990, phần lớn câu sai không phải do thiếu kiến thức mà do sập bẫy phản xạ vội ở 1 chi tiết nhỏ (thiếu 'to', thừa 'about', quên chia nguyên mẫu giả định)."
      }
    ],
    "quiz": [
      {
        "q": "_____ the quality-control engineers conducted one additional stress test, the faulty seal would have been detected before shipment.",
        "opts": [
          "Had",
          "Were",
          "Should",
          "If"
        ],
        "ans": 0,
        "exp": "Bẫy #1 (Đảo ngữ Điều kiện Loại 3): Mệnh đề chính có 'would have been detected' và sau chủ ngữ là phân từ 'conducted' → chọn 'Had' (= If the quality-control engineers had conducted...)."
      },
      {
        "q": "The regulatory agency mandated that all newly manufactured medical scanners _____ rigorous radiation screening prior to sale.",
        "opts": [
          "undergoes",
          "underwent",
          "undergo",
          "undergoing"
        ],
        "ans": 2,
        "exp": "Bẫy #3 (Thức Giả định): Động từ 'mandated that' (yêu cầu bắt buộc) kích hoạt thức giả định → chọn nguyên mẫu 'undergo' bất kể động từ chính ở thì quá khứ."
      },
      {
        "q": "All customer inquiries submitted through the portal are routed automatically to _____ is on duty in the corresponding time zone.",
        "opts": [
          "whomever",
          "whoever",
          "whose",
          "whatever"
        ],
        "ans": 1,
        "exp": "Bẫy #4 (Mệnh đề danh ngữ sau giới từ): Cả mệnh đề là tân ngữ của 'to', còn bên trong mệnh đề chỗ trống làm CHỦ NGỮ cho động từ 'is on duty' → chọn 'whoever' (không phải 'whomever')."
      },
      {
        "q": "Only after the independent audit confirmed full regulatory compliance _____ to release the final installment of the grant.",
        "opts": [
          "the foundation agreed",
          "agreed the foundation",
          "has the foundation agreed",
          "did the foundation agree"
        ],
        "ans": 3,
        "exp": "Bẫy #2 (Đảo ngữ với 'Only after'): Mệnh đề phụ sau 'Only after' giữ nguyên trật tự ('confirmed' — quá khứ đơn), và MỆNH ĐỀ CHÍNH phải đảo trợ động từ quá khứ → chọn 'did the foundation agree'."
      },
      {
        "q": "Because the flagship store's lease expires next quarter, executives are reviewing several viable _____ in the financial district.",
        "opts": [
          "alternate",
          "alternatively",
          "alternatives",
          "alternating"
        ],
        "ans": 2,
        "exp": "Bẫy #12 (Danh từ đuôi '-ive'): Sau 'several viable' (lượng từ số nhiều + tính từ) cần một danh từ số nhiều mang nghĩa 'các phương án/địa điểm thay thế khả thi' → chọn 'alternatives'."
      },
      {
        "q": "Despite working _____ with three external logistics consultants, the retailer still found the new customs rules difficult to navigate.",
        "opts": [
          "closely",
          "close",
          "nearly",
          "hardly"
        ],
        "ans": 0,
        "exp": "Bẫy #14 (Trạng từ dễ nhầm): Cụm kết hợp 'work closely with' (phối hợp chặt chẽ với) + chú ý câu kết hợp sẵn cấu trúc 'find + O + Adj' ('found the new customs rules difficult') → chọn 'closely'."
      }
    ]
  }
];
  if (typeof window !== "undefined") window.__LP_TOEIC_GRAMMAR_P2 = DATA;
  if (typeof module !== "undefined" && module.exports) module.exports = DATA;
})();

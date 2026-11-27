/* LinguaPath TOEIC Grammar — Phần 1: Chặng 1 (tg_01..tg_12, 0–350) & Chặng 2 (tg_13..tg_26, 350–550)
 * 26 chuyên đề ngữ pháp chuẩn ETS × 6 câu trắc nghiệm Part 5–6 = 156 câu có giải thích tiếng Việt chi tiết.
 */
(function () {
  "use strict";
  var DATA = [
  {
    "id": "tg_01",
    "order": 1,
    "level": 1,
    "unitTitle": "Chặng 1 • Lấy gốc Từ loại & 6 Thì cơ bản (0–350)",
    "category": "Từ loại",
    "partTag": "Part 5",
    "title": "Cấu trúc câu cơ bản S–V–O & 5 mẫu câu",
    "speedTip": "Mẹo 5 giây: Mỗi mệnh đề chỉ có ĐÚNG 1 động từ chính chia thì. Thấy câu thiếu động từ chính thì loại ngay V-ing đứng lẻ và To-V.",
    "formula": "S + V | S + V + O | S + V(linking) + C | S + V + IO + DO | S + V + O + OC",
    "summary": "Mọi câu tiếng Anh chuẩn TOEIC đều xoay quanh khung Chủ ngữ (S) và Động từ chính (V). Nắm vững 5 mẫu câu cơ bản giúp bạn xác định nhanh vị trí chỗ trống cần điền Danh từ, Động từ hay Tính từ trong Part 5.",
    "theorySections": [
      {
        "heading": "1. Quy tắc xương sống của một câu đơn TOEIC",
        "bullets": [
          "Một câu hoàn chỉnh bắt buộc có ít nhất 1 Chủ ngữ (S) và 1 Động từ chính đã chia thì (V).",
          "Các cụm giới từ (in the office, for the client, of the company) chỉ là thành phần phụ, KHÔNG bao giờ làm Chủ ngữ hay Động từ chính.",
          "Dạng V-ing (working), To-V (to work) hoặc V-ed phân từ đứng một mình không thể làm động từ chính của câu."
        ]
      },
      {
        "heading": "2. 5 mẫu câu cốt lõi thường gặp trong Part 5",
        "bullets": [
          "Mẫu 1 (S + Vi): Động từ tự đủ nghĩa, không cần tân ngữ (The train arrived on time).",
          "Mẫu 2 (S + V-linking + Adj/N): Sau be, become, remain, seem, appear, stay cần Tính từ hoặc Danh từ bổ nghĩa cho Chủ ngữ.",
          "Mẫu 3 (S + Vt + O): Ngoại động từ bắt buộc có Tân ngữ (Danh từ/Đại từ) theo sau (Ms. Park reviewed the contract).",
          "Mẫu 4 (S + V + IO + DO): Động từ trao tặng có 2 tân ngữ (give/send/offer/provide someone something).",
          "Mẫu 5 (S + V + O + OC): Các động từ make, keep, find, consider, leave + Tân ngữ + Tính từ/Danh từ (keep the workspace clean)."
        ]
      }
    ],
    "examples": [
      {
        "en": "The accounting department <b>submitted</b> the quarterly budget yesterday.",
        "vi": "Phòng kế toán đã nộp ngân sách quý vào hôm qua.",
        "note": "Mẫu 3 (S + Vt + O): submitted là động từ chính chia thì quá khứ đơn, tân ngữ là the quarterly budget."
      },
      {
        "en": "The new software update makes daily data entry much <b>faster</b>.",
        "vi": "Bản cập nhật phần mềm mới giúp việc nhập liệu hằng ngày nhanh hơn nhiều.",
        "note": "Mẫu 5 (make + O + Adj): sau tân ngữ daily data entry dùng tính từ (faster), không dùng trạng từ."
      },
      {
        "en": "Our supplier offered all corporate clients a substantial <b>discount</b>.",
        "vi": "Nhà cung cấp của chúng tôi đã đề xuất mức chiết khấu đáng kể cho mọi khách hàng doanh nghiệp.",
        "note": "Mẫu 4 (offer + IO + DO): all corporate clients là tân ngữ gián tiếp, a substantial discount là tân ngữ trực tiếp."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The marketing team launching a new campaign next week.",
        "right": "The marketing team <b>is launching</b> a new campaign next week.",
        "exp": "V-ing (launching) không thể làm động từ chính nếu thiếu trợ động từ be."
      },
      {
        "wrong": "The manager considers the proposal very usefully.",
        "right": "The manager considers the proposal very <b>useful</b>.",
        "exp": "Theo Mẫu 5 (consider + O + Adj), bổ ngữ cho tân ngữ phải là Tính từ (useful), không phải Trạng từ (usefully)."
      }
    ],
    "quiz": [
      {
        "q": "The regional director _____ the updated safety guidelines during Monday's briefing.",
        "opts": [
          "explaining",
          "to explain",
          "explained",
          "explanation"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (explained). Câu đã có chủ ngữ (The regional director) và tân ngữ (the updated safety guidelines) nhưng thiếu động từ chính chia thì. Loại A (V-ing) và B (To-V) vì không làm động từ chính; loại D (explanation) là danh từ."
      },
      {
        "q": "The redesigned mobile application keeps customer checkout _____ and effortless.",
        "opts": [
          "simple",
          "simply",
          "simplify",
          "simplicity"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (simple). Cấu trúc Mẫu 5: keep + O (customer checkout) + Adj, song song với tính từ effortless phía sau. Loại B (trạng từ), C (động từ) và D (danh từ)."
      },
      {
        "q": "All newly hired technicians _____ a mandatory orientation session before starting work.",
        "opts": [
          "attending",
          "attend",
          "attendance",
          "to attend"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (attend). Chủ ngữ số nhiều All newly hired technicians cần động từ chính nguyên mẫu ở hiện tại đơn. Loại A (V-ing) và D (To-V) vì thiếu trợ động từ; loại C (danh từ)."
      },
      {
        "q": "Despite minor delays in shipping, the warehouse staff remained _____ throughout the holiday rush.",
        "opts": [
          "calmly",
          "calmness",
          "calmed",
          "calm"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (calm). Remain là động từ nối (Mẫu 2: S + remain + Adj) diễn tả trạng thái duy trì. Loại A (trạng từ), B (danh từ) và C (quá khứ phân từ không dùng để chỉ trạng thái bình tĩnh tự nhiên ở đây)."
      },
      {
        "q": "Apex Logistics sent every registered vendor _____ regarding the revised delivery schedule.",
        "opts": [
          "a formal notice",
          "formally notify",
          "formal noticeable",
          "notifying formally"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (a formal notice). Cấu trúc Mẫu 4: send + IO (every registered vendor) + DO (cụm danh từ a formal notice). Loại B (cụm động từ), C (sai trật tự từ loại) và D (cụm V-ing)."
      },
      {
        "q": "Most participants found the financial planning workshop extremely _____ for their careers.",
        "opts": [
          "benefit",
          "beneficially",
          "beneficial",
          "benefiting"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (beneficial). Cấu trúc Mẫu 5: find + O (the financial planning workshop) + Adj (beneficial) có nghĩa là nhận thấy điều gì hữu ích. Loại A (danh/động từ), B (trạng từ) và D (V-ing)."
      }
    ]
  },
  {
    "id": "tg_02",
    "order": 2,
    "level": 1,
    "unitTitle": "Chặng 1 • Lấy gốc Từ loại & 6 Thì cơ bản (0–350)",
    "category": "Từ loại",
    "partTag": "Part 5",
    "title": "Danh từ: Vị trí, hậu tố & Đếm được / Không đếm được",
    "speedTip": "Mẹo 5 giây: Thấy mạo từ (a/an/the), tính từ sở hữu (my/our/their) hoặc giới từ (in/of/for/with) phía trước, mà phía sau không có danh từ khác thì chọn ngay Danh từ.",
    "formula": "a/an/the/my/this + (Adj) + N  |  Prep + N  |  Đuôi N: -tion, -ment, -ity, -ness, -ance/-ence",
    "summary": "Danh từ là dạng câu hỏi xuất hiện dày đặc nhất trong TOEIC Part 5. Bạn cần nhận diện nhanh vị trí danh từ, thuộc lòng hậu tố đặc trưng và nhớ các danh từ không đếm được kinh điển hay bị gài bẫy.",
    "theorySections": [
      {
        "heading": "1. 4 vị trí vàng của Danh từ trong câu",
        "bullets": [
          "Làm Chủ ngữ đứng trước động từ chính (Approval from the board is required).",
          "Đứng sau mạo từ (a, an, the), từ chỉ định (this, that, these, those), tính từ sở hữu (his, our, their) và tính từ bổ nghĩa.",
          "Làm Tân ngữ ngay sau ngoại động từ (review the proposal) hoặc sau giới từ (for confirmation, with accuracy).",
          "Lưu ý: Nếu sau chỗ trống ĐÃ có danh từ chính rồi, chỗ trống có thể cần Tính từ hoặc Danh từ ghép bổ nghĩa."
        ]
      },
      {
        "heading": "2. Hậu tố Danh từ chuẩn ETS & Danh từ không đếm được",
        "bullets": [
          "Hậu tố chỉ vật/khái niệm: -tion/-sion (production, decision), -ment (agreement), -ity (productivity), -ance/-ence (maintenance, compliance), -ship (leadership), -al (approval, renewal, proposal).",
          "Bẫy lớn TOEIC: Danh từ đếm được số ít KHÔNG BAO GIỜ đứng trơ trọi mà phải có a/an/the/sở hữu phía trước hoặc thêm -s/-es.",
          "Danh từ không đếm được cực hay thi (không thêm -s, không dùng a/an): information, equipment, furniture, advice, luggage, baggage, feedback, access, merchandise, research, staff."
        ]
      }
    ],
    "examples": [
      {
        "en": "The committee reached a final <b>agreement</b> after two hours of negotiation.",
        "vi": "Ủy ban đã đạt được thỏa thuận cuối cùng sau hai giờ đàm phán.",
        "note": "Sau mạo từ a + tính từ final là vị trí của danh từ số ít (agreement, đuôi -ment)."
      },
      {
        "en": "Please inspect all laboratory <b>equipment</b> prior to the annual safety audit.",
        "vi": "Vui lòng kiểm tra toàn bộ thiết bị phòng thí nghiệm trước đợt kiểm toán an toàn thường niên.",
        "note": "Equipment là danh từ không đếm được, không bao giờ viết equipments dù đứng sau all."
      },
      {
        "en": "Final <b>approval</b> from the finance director is needed for purchases over $5,000.",
        "vi": "Cần có sự phê duyệt cuối cùng từ giám đốc tài chính cho các giao dịch mua trên 5.000 đô la.",
        "note": "Approval là danh từ có đuôi -al đặc biệt hay gặp trong TOEIC (tương tự proposal, renewal, arrival)."
      }
    ],
    "pitfalls": [
      {
        "wrong": "We ordered new office equipments for the branch in Busan.",
        "right": "We ordered new office <b>equipment</b> for the branch in Busan.",
        "exp": "Equipment là danh từ không đếm được nên tuyệt đối không thêm -s."
      },
      {
        "wrong": "Thank you for your apply to the senior analyst position.",
        "right": "Thank you for your <b>application</b> to the senior analyst position.",
        "exp": "Sau tính từ sở hữu your phải là Danh từ (application), không dùng động từ apply."
      }
    ],
    "quiz": [
      {
        "q": "The operations manager requested immediate _____ of the revised shipping schedule.",
        "opts": [
          "confirm",
          "confirmation",
          "confirmed",
          "confirming"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (confirmation). Sau tính từ immediate và trước giới từ of cần một danh từ làm tân ngữ cho requested. Loại A (động từ nguyên mẫu), C (V-ed) và D (V-ing)."
      },
      {
        "q": "Before launching the product, the research team gathered extensive _____ from early testers.",
        "opts": [
          "feedbacks",
          "feed back",
          "a feedback",
          "feedback"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (feedback). Feedback là danh từ không đếm được chuẩn TOEIC nên không thêm -s và không đi với a/an. Loại A (thêm -s sai), C (dùng a sai) và B (cụm động từ)."
      },
      {
        "q": "The board's timely _____ allowed the construction project to begin ahead of schedule.",
        "opts": [
          "approval",
          "approving",
          "approve",
          "approved"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (approval). Sau sở hữu cách (The board's) và tính từ (timely) cần một danh từ làm chủ ngữ. Approval là danh từ đuôi -al quen thuộc trong TOEIC. Loại C, B, D vì đều là dạng động từ."
      },
      {
        "q": "Employees must ensure full _____ with the updated data privacy regulations.",
        "opts": [
          "comply",
          "compliant",
          "compliance",
          "compliantly"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (compliance). Sau tính từ full và trước giới từ with cần danh từ (full compliance with: sự tuân thủ hoàn toàn). Loại A (động từ), B (tính từ) và D (trạng từ)."
      },
      {
        "q": "The interior designer selected modern _____ to brighten the main reception lobby.",
        "opts": [
          "furnitures",
          "furniture",
          "a furniture",
          "furnish"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (furniture). Furniture (đồ nội thất) là danh từ không đếm được nên không thêm -s và không dùng với a. Loại A, C (sai ngữ pháp danh từ không đếm được) và D (động từ)."
      },
      {
        "q": "Ms. Rivera praised the logistics team for their remarkable _____ during the peak season.",
        "opts": [
          "efficient",
          "efficiently",
          "efficiencies",
          "efficiency"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (efficiency). Sau tính từ sở hữu their và tính từ remarkable cần danh từ không đếm được chỉ tính hiệu quả (efficiency). Loại A (tính từ), B (trạng từ) và C (dạng số nhiều không phù hợp ngữ cảnh chỉ năng lực chung)."
      }
    ]
  },
  {
    "id": "tg_03",
    "order": 3,
    "level": 1,
    "unitTitle": "Chặng 1 • Lấy gốc Từ loại & 6 Thì cơ bản (0–350)",
    "category": "Từ loại",
    "partTag": "Part 5",
    "title": "Danh từ ghép & Phân biệt Danh từ chỉ người vs vật",
    "speedTip": "Mẹo 5 giây: Nếu 4 đáp án có cả 2 danh từ (1 chỉ người, 1 chỉ vật), hãy dịch nhanh động từ chính xem chủ thể thực hiện là Người hay Vật; với Danh từ ghép, danh từ đứng trước luôn để dạng số ít.",
    "formula": "N1 (số ít, bổ nghĩa) + N2 (chính)  |  Người: -er/-or/-ee/-ist/-ant  vs  Vật: -tion/-ment/-ity",
    "summary": "Đề ETS thường đánh đố thí sinh bằng hai bẫy danh từ: chọn đúng danh từ chỉ người hay chỉ sự vật/hoạt động (applicant vs application) và nắm quy tắc ghép hai danh từ liền kề trong tiếng Anh công sở.",
    "theorySections": [
      {
        "heading": "1. Quy tắc Danh từ ghép (Compound Nouns) chuẩn công sở",
        "bullets": [
          "Trong cụm N1 + N2, danh từ N1 đóng vai trò bổ nghĩa cho N2 (customer satisfaction, safety regulations, sales report, budget review).",
          "N1 gần như luôn ở dạng số ít, kể cả khi N2 là số nhiều (employee benefits, NOT employees benefits; five-year warranty, NOT five-years warranty).",
          "Một số cụm cố định N1 giữ đuôi -s tự nhiên: sales department, customs officer, communications director, operations manager, savings account."
        ]
      },
      {
        "heading": "2. Phân biệt Danh từ chỉ Người vs Danh từ chỉ Vật / Khái niệm",
        "bullets": [
          "Đuôi chỉ NGƯỜI: -er/-or (supervisor, contractor), -ee (employee, trainee, attendee), -ist (specialist, receptionist), -ant/-ent (applicant, consultant, representative).",
          "Cặp cực hay ra thi: applicant (ứng viên) vs application (đơn xin việc); attendee (người tham dự) vs attendance (sự có mặt); representative (người đại diện) vs representation (sự đại diện); critic (nhà phê bình) vs criticism (lời phê bình).",
          "Nhận diện nhanh: Nếu không có mạo từ a/an/the và không có -s phía sau, KHÔNG thể chọn danh từ chỉ người đếm được số ít!"
        ]
      }
    ],
    "examples": [
      {
        "en": "Every qualified <b>applicant</b> will receive an interview invitation by Friday.",
        "vi": "Mỗi ứng viên đủ điều kiện sẽ nhận được thư mời phỏng vấn trước thứ Sáu.",
        "note": "Hành động receive an interview invitation thuộc về người -> chọn applicant, không chọn application."
      },
      {
        "en": "The firm launched a comprehensive <b>customer</b> loyalty program last quarter.",
        "vi": "Công ty đã triển khai một chương trình khách hàng thân thiết toàn diện vào quý trước.",
        "note": "Danh từ ghép customer loyalty program: customer đứng trước ở dạng số ít bổ nghĩa cho loyalty program."
      },
      {
        "en": "The newly appointed <b>operations</b> director will oversee all regional warehouses.",
        "vi": "Giám đốc vận hành mới được bổ nhiệm sẽ giám sát toàn bộ các kho khu vực.",
        "note": "Operations là ngoại lệ quen thuộc luôn giữ -s trong danh từ ghép (operations director/manager)."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The hotel guarantees high customer satisfactory during every stay.",
        "right": "The hotel guarantees high customer <b>satisfaction</b> during every stay.",
        "exp": "Cụm danh từ ghép đúng là customer satisfaction (sự hài lòng của khách hàng), không dùng tính từ satisfactory làm danh từ chính."
      },
      {
        "wrong": "Over 200 attendances registered for the annual technology summit.",
        "right": "Over 200 <b>attendees</b> registered for the annual technology summit.",
        "exp": "Chủ ngữ thực hiện hành động registered (đăng ký) phải là danh từ chỉ người số nhiều (attendees)."
      }
    ],
    "quiz": [
      {
        "q": "Each _____ must submit a valid photo ID at the security desk upon arrival.",
        "opts": [
          "visitor",
          "visit",
          "visiting",
          "visitation"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (visitor). Sau Each cần danh từ đếm được số ít, và chủ thể xuất trình giấy tờ tùy thân phải là người (visitor: khách đến thăm). Loại B (động/danh từ chuyến thăm), C (V-ing) và D (danh từ chỉ sự viếng thăm)."
      },
      {
        "q": "The human resources department is reviewing all _____ submitted for the marketing role.",
        "opts": [
          "applicants",
          "applicable",
          "applications",
          "apply"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (applications). Từ khóa submitted (được nộp) cho thấy đối tượng được xem xét là các bộ hồ sơ (applications), không phải bản thân ứng viên bị nộp. Loại A (người nộp đơn), B (tính từ) và D (động từ)."
      },
      {
        "q": "Harborview Corp. provides generous _____ benefits to retain experienced engineers.",
        "opts": [
          "employing",
          "employees",
          "employ",
          "employee"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (employee). Trong danh từ ghép employee benefits (phúc lợi nhân viên), danh từ bổ nghĩa đứng trước để dạng số ít. Loại B (số nhiều sai quy tắc danh từ ghép), C (động từ) và A (V-ing)."
      },
      {
        "q": "A senior sales _____ will contact you within 24 hours to finalize your bulk order.",
        "opts": [
          "represent",
          "representative",
          "representation",
          "representing"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (representative). Chủ thể thực hiện hành động will contact you (sẽ liên hệ với bạn) phải là người (sales representative: nhân viên đại diện kinh doanh). Loại A (động từ), C (sự đại diện - vật) và D (V-ing)."
      },
      {
        "q": "Strict _____ inspections are conducted monthly across all manufacturing plants.",
        "opts": [
          "safe",
          "safely",
          "safety",
          "safeties"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (safety). Danh từ ghép cố định TOEIC là safety inspections (các cuộc kiểm tra an toàn). Loại A (tính từ safe không đi với inspections thành cụm chuyên ngành chuẩn), B (trạng từ) và D (số nhiều sai)."
      },
      {
        "q": "The board hired an external _____ to evaluate the company's supply chain costs.",
        "opts": [
          "consultant",
          "consultation",
          "consultative",
          "consult"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (consultant). Động từ hired (thuê) và mạo từ an yêu cầu một danh từ chỉ người số ít (consultant: chuyên gia tư vấn). Loại D (động từ), B (buổi tư vấn - vật) và C (tính từ)."
      }
    ]
  },
  {
    "id": "tg_04",
    "order": 4,
    "level": 1,
    "unitTitle": "Chặng 1 • Lấy gốc Từ loại & 6 Thì cơ bản (0–350)",
    "category": "Động từ",
    "partTag": "Part 5",
    "title": "Động từ: Ngoại động từ, Nội động từ & Vị trí",
    "speedTip": "Mẹo 5 giây: Sau chỗ trống là Tân ngữ (N) thì dùng Ngoại động từ (không thêm giới từ thừa); sau chỗ trống là Giới từ/Trạng từ/dấu chấm thì kiểm tra Nội động từ hoặc Thể bị động.",
    "formula": "S + Vt + O (không giới từ)  |  S + Vi + (Prep + N / Adv)",
    "summary": "Phân biệt Ngoại động từ (cần tân ngữ) và Nội động từ (không cần tân ngữ) là chìa khóa xử lý cả câu hỏi Từ loại, Giới từ thừa và Thể bị động trong TOEIC Part 5.",
    "theorySections": [
      {
        "heading": "1. Ngoại động từ (Transitive Verbs) hay bị gài bẫy giới từ",
        "bullets": [
          "Ngoại động từ đi THẲNG với tân ngữ, TUYỆT ĐỐI không chèn giới từ giữa động từ và tân ngữ.",
          "Nhóm bẫy kinh điển ETS: discuss + N (KHÔNG discuss about), attend + N (KHÔNG attend to/at sự kiện), mention + N (KHÔNG mention about), reach + N (KHÔNG reach to), contact + N (KHÔNG contact with), approach + N, enter + N."
        ]
      },
      {
        "heading": "2. Nội động từ (Intransitive Verbs) quan trọng trong TOEIC",
        "bullets": [
          "Nội động từ tự đứng cuối mệnh đề hoặc đi kèm giới từ (arrive at/in, comply with, respond to, apologize for, collaborate with, specialize in, participate in).",
          "Lưu ý cực quan trọng: Nội động từ KHÔNG BAO GIỜ chia ở thể bị động (happen, occur, arrive, rise, exist, consist of, remain, last).",
          "Cặp dễ nhầm: rise (nội động từ: tự tăng) vs raise (ngoại động từ: tăng cái gì); lie (nằm) vs lay (đặt để cái gì)."
        ]
      }
    ],
    "examples": [
      {
        "en": "The management team will <b>discuss</b> the expansion budget during Friday's meeting.",
        "vi": "Ban lãnh đạo sẽ thảo luận về ngân sách mở rộng trong cuộc họp thứ Sáu.",
        "note": "Discuss là ngoại động từ, đi thẳng với the expansion budget (không có about)."
      },
      {
        "en": "All third-party suppliers must <b>comply</b> with our environmental quality standards.",
        "vi": "Mọi nhà cung cấp bên thứ ba phải tuân thủ các tiêu chuẩn chất lượng môi trường của chúng tôi.",
        "note": "Comply là nội động từ, bắt buộc đi với giới từ with trước danh từ."
      },
      {
        "en": "Raw material costs <b>rose</b> sharply in the second half of the year.",
        "vi": "Chi phí nguyên vật liệu đã tăng mạnh trong nửa cuối năm.",
        "note": "Rose (quá khứ của rise) là nội động từ nên theo sau là trạng từ sharply, không có tân ngữ."
      }
    ],
    "pitfalls": [
      {
        "wrong": "Please contact with our customer support desk if your shipment is delayed.",
        "right": "Please <b>contact</b> our customer support desk if your shipment is delayed.",
        "exp": "Contact là ngoại động từ khi làm động từ chính nên đi trực tiếp với tân ngữ, không dùng with."
      },
      {
        "wrong": "The scheduled power outage was occurred around midnight.",
        "right": "The scheduled power outage <b>occurred</b> around midnight.",
        "exp": "Occur (xảy ra) là nội động từ nên không bao giờ dùng ở dạng bị động was occurred."
      }
    ],
    "quiz": [
      {
        "q": "Board members met yesterday to _____ the proposed merger in detail.",
        "opts": [
          "discussed",
          "discuss about",
          "discussion",
          "discuss"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (discuss). Sau to chỉ mục đích cần động từ nguyên mẫu, và discuss là ngoại động từ đi thẳng với tân ngữ the proposed merger. Loại B (thừa giới từ about), C (danh từ) và A (quá khứ)."
      },
      {
        "q": "The regional warehouse plans to _____ its storage capacity by twenty percent next year.",
        "opts": [
          "rise",
          "raise",
          "arise",
          "risen"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (raise). Phía sau chỗ trống có tân ngữ its storage capacity nên bắt buộc chọn ngoại động từ raise (nâng cao/tăng cái gì). Loại A (rise - nội động từ), C (arise - phát sinh, nội động từ) và D (V3)."
      },
      {
        "q": "Over 150 industry leaders _____ the international renewable energy conference in Seoul.",
        "opts": [
          "participated",
          "attended to",
          "attended",
          "arrived"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (attended). Attend là ngoại động từ đi thẳng với tên sự kiện (the conference). Loại B (thừa to), A (participate cần giới từ in) và D (arrive cần giới từ at/in)."
      },
      {
        "q": "An unexpected technical glitch _____ shortly after the new billing portal went live.",
        "opts": [
          "occurred",
          "was occurred",
          "occurring",
          "occurrence"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (occurred). Occur là nội động từ nên không chia thể bị động, chỉ dùng dạng chủ động quá khứ đơn occurred. Loại B (sai bị động với nội động từ), C (V-ing thiếu trợ động từ) và D (danh từ)."
      },
      {
        "q": "All contracted vendors are expected to _____ with the revised packaging guidelines.",
        "opts": [
          "follow",
          "obey",
          "meet",
          "comply"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (comply). Ngay sau chỗ trống có giới từ with -> chỉ có nội động từ comply đi theo cụm comply with (tuân thủ). Loại A, B, C vì follow/obey/meet đều là ngoại động từ đi thẳng với tân ngữ."
      },
      {
        "q": "The customer service team usually _____ to urgent warranty inquiries within two hours.",
        "opts": [
          "answers",
          "responds",
          "addresses",
          "resolves"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (responds). Ngay sau chỗ trống có giới từ to -> chọn nội động từ respond to (phản hồi). Loại A, C, D vì answer/address/resolve là ngoại động từ không đi với to."
      }
    ]
  },
  {
    "id": "tg_05",
    "order": 5,
    "level": 1,
    "unitTitle": "Chặng 1 • Lấy gốc Từ loại & 6 Thì cơ bản (0–350)",
    "category": "Từ loại",
    "partTag": "Part 5",
    "title": "Tính từ: Vị trí, Động từ nối & Hậu tố nhận diện",
    "speedTip": "Mẹo 5 giây: Thấy [a/an/the + _____ + Danh từ] hoặc [be / become / remain / seem / make + O + _____] thì ưu tiên chọn ngay Tính từ.",
    "formula": "Det + (Adv) + Adj + N  |  S + Linking Verb + Adj  |  make/keep/find + O + Adj",
    "summary": "Tính từ bổ nghĩa cho danh từ và mô tả trạng thái chủ ngữ/tân ngữ. Nhận diện đúng vị trí và thuộc bộ hậu tố tính từ giúp bạn ăn trọn điểm Part 5 chỉ trong vài giây.",
    "theorySections": [
      {
        "heading": "1. 3 vị trí cốt lõi của Tính từ trong đề TOEIC",
        "bullets": [
          "Đứng trực tiếp trước Danh từ để bổ nghĩa (a reliable supplier, comprehensive training).",
          "Đứng sau động từ nối (Linking Verbs): be, become, remain, seem, appear, stay, grow, prove, look, feel (The results proved accurate).",
          "Đứng sau Tân ngữ trong cấu trúc Mẫu 5: make / keep / find / consider / render + O + Adj (keep records confidential)."
        ]
      },
      {
        "heading": "2. Hậu tố Tính từ hay gặp & Các cặp tính từ dễ nhầm",
        "bullets": [
          "Hậu tố chuẩn: -ive (productive, competitive), -able/-ible (reliable, accessible), -al (financial, operational), -ous (generous, continuous), -ful (successful), -ic (economic), -ent/-ant (efficient, relevant).",
          "Cẩn thận tính từ đuôi -ly (KHÔNG phải trạng từ): timely (kịp thời), costly (tốn kém), friendly (thân thiện), likely (có khả năng), monthly/quarterly/yearly.",
          "Phân biệt cặp nghĩa: economic (thuộc kinh tế) vs economical (tiết kiệm); considerable (đáng kể) vs considerate (chu đáo); reliable (đáng tin cậy) vs reliant (phụ thuộc)."
        ]
      }
    ],
    "examples": [
      {
        "en": "The firm introduced a <b>competitive</b> salary package to attract senior developers.",
        "vi": "Công ty đã đưa ra gói lương cạnh tranh để thu hút các lập trình viên cao cấp.",
        "note": "Đứng giữa mạo từ a và cụm danh từ salary package -> dùng tính từ competitive."
      },
      {
        "en": "Upgrading the entire server infrastructure proved far more <b>costly</b> than expected.",
        "vi": "Việc nâng cấp toàn bộ hạ tầng máy chủ hóa ra tốn kém hơn nhiều so với dự kiến.",
        "note": "Proved là động từ nối; costly có đuôi -ly nhưng là tính từ (tốn kém)."
      },
      {
        "en": "All client medical records must remain strictly <b>confidential</b> at all times.",
        "vi": "Mọi hồ sơ y tế của khách hàng phải luôn được giữ bảo mật nghiêm ngặt.",
        "note": "Remain + trạng từ (strictly) + tính từ (confidential)."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The newly launched printer is very economic because it uses less ink.",
        "right": "The newly launched printer is very <b>economical</b> because it uses less ink.",
        "exp": "Economical có nghĩa là tiết kiệm chi phí/nhiên liệu; còn economic có nghĩa là thuộc về nền kinh tế."
      },
      {
        "wrong": "Mr. Choi thanked the staff for their timelyly submission of the report.",
        "right": "Mr. Choi thanked the staff for their <b>timely</b> submission of the report.",
        "exp": "Timely vốn đã là tính từ bổ nghĩa cho danh từ submission (nộp đúng lúc/kịp thời)."
      }
    ],
    "quiz": [
      {
        "q": "The logistics firm is seeking a _____ partner to handle overnight freight across Europe.",
        "opts": [
          "rely",
          "reliably",
          "reliable",
          "reliability"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (reliable). Chỗ trống nằm giữa mạo từ a và danh từ partner nên cần một tính từ bổ nghĩa. Loại A (động từ), B (trạng từ) và D (danh từ)."
      },
      {
        "q": "After reviewing the third-quarter figures, the auditors found the expense reports completely _____.",
        "opts": [
          "accurate",
          "accuracy",
          "accurately",
          "accuracies"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (accurate). Cấu trúc find + O (the expense reports) + (Adv) + Adj. Trạng từ completely chỉ bổ nghĩa cho tính từ đứng sau nó. Loại B, D (danh từ) và C (trạng từ)."
      },
      {
        "q": "Our new electric delivery vans are far more _____ to operate than older diesel models.",
        "opts": [
          "economy",
          "economical",
          "economic",
          "economize"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (economical). Sau more cần tính từ mang nghĩa tiết kiệm chi phí vận hành (economical). Loại C (economic chỉ nghĩa thuộc lĩnh vực kinh tế), A (danh từ) và D (động từ)."
      },
      {
        "q": "Thank you for your _____ response to our inquiry regarding the warehouse lease.",
        "opts": [
          "prompted",
          "promptly",
          "promptness",
          "prompt"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (prompt). Giữa tính từ sở hữu your và danh từ response cần tính từ prompt (nhanh chóng/kịp thời). Loại B (trạng từ), C (danh từ) và A (quá khứ động từ)."
      },
      {
        "q": "The maintenance crew worked overnight to ensure that all assembly lines remained _____.",
        "opts": [
          "operational",
          "operation",
          "operationally",
          "operate"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (operational). Remain là động từ nối đi với tính từ (operational: sẵn sàng vận hành). Loại D (động từ), B (danh từ) và C (trạng từ)."
      },
      {
        "q": "The board made a _____ investment in automated quality-control scanners last spring.",
        "opts": [
          "consider",
          "considerate",
          "considerable",
          "considerably"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (considerable). Trước danh từ investment cần tính từ chỉ mức độ đáng kể (considerable). Loại B (considerate nghĩa là chu đáo - dùng cho người), A (động từ) và D (trạng từ)."
      }
    ]
  },
  {
    "id": "tg_06",
    "order": 6,
    "level": 1,
    "unitTitle": "Chặng 1 • Lấy gốc Từ loại & 6 Thì cơ bản (0–350)",
    "category": "Từ loại",
    "partTag": "Part 5",
    "title": "Trạng từ: 4 vị trí vàng & Bẫy đuôi -ly",
    "speedTip": "Mẹo 5 giây: Nếu bỏ chỗ trống đi mà câu VẪN ĐỦ CẤU TRÚC hoàn chỉnh (S + V + O), hoặc chỗ trống đứng giữa trợ động từ và động từ chính (have _____ finished / is _____ available), chọn ngay Trạng từ.",
    "formula": "Adv + Adj  |  Aux + Adv + V  |  S + V + (O) + Adv  |  Adv, S + V",
    "summary": "Trạng từ bổ nghĩa cho động từ, tính từ, trạng từ khác hoặc cả câu. Ngoài việc nhận diện 4 vị trí vàng, bạn cần thuộc các cặp trạng từ bẫy nghĩa khác nhau như hard vs hardly, late vs lately, close vs closely.",
    "theorySections": [
      {
        "heading": "1. 4 vị trí vàng của Trạng từ trong TOEIC Part 5",
        "bullets": [
          "Đứng trước Tính từ hoặc Phân từ để tăng/giảm mức độ (highly qualified, strictly prohibited, remarkably efficient).",
          "Đứng giữa Trợ động từ (be / have / will / can / must) và Động từ chính (has recently announced, is currently reviewing).",
          "Đứng trước hoặc sau Động từ thường / sau Tân ngữ khi câu đã đủ thành phần (completed the audit accurately).",
          "Đứng đầu câu trước dấu phẩy để bổ nghĩa cho cả mệnh đề (Unfortunately, the keynote speaker was delayed)."
        ]
      },
      {
        "heading": "2. Bẫy nghĩa Trạng từ đuôi -ly cực hay gặp",
        "bullets": [
          "hard (chăm chỉ/mạnh) vs hardly (hầu như không - mang nghĩa phủ định).",
          "late (trễ/muộn) vs lately (gần đây, thường đi với thì Hiện tại hoàn thành).",
          "near (gần về khoảng cách) vs nearly (gần như/xấp xỉ, đứng trước con số: nearly 500 guests).",
          "high (cao về độ cao) vs highly (rất/cực kỳ: highly recommended, highly skilled).",
          "close (gần) vs closely (chặt chẽ/kỹ lưỡng: work closely with, monitor closely)."
        ]
      }
    ],
    "examples": [
      {
        "en": "The software engineering team has <b>recently</b> resolved the payment gateway issue.",
        "vi": "Đội kỹ sư phần mềm gần đây đã khắc phục sự cố cổng thanh toán.",
        "note": "Vị trí giữa trợ động từ has và phân từ resolved -> điền trạng từ recently."
      },
      {
        "en": "The legal department works <b>closely</b> with external auditors during tax season.",
        "vi": "Phòng pháp chế phối hợp chặt chẽ với kiểm toán viên bên ngoài trong mùa thuế.",
        "note": "Cụm cố định TOEIC: work closely with (hợp tác chặt chẽ với)."
      },
      {
        "en": "<b>Nearly</b> 400 subscribers attended the live financial webinar on Thursday.",
        "vi": "Gần 400 người đăng ký đã tham dự hội thảo trực tuyến về tài chính vào thứ Năm.",
        "note": "Trước số liệu (400 subscribers) dùng trạng từ nearly (xấp xỉ/gần như), không dùng near."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The sales representative worked hardly to exceed her quarterly quota.",
        "right": "The sales representative worked <b>hard</b> to exceed her quarterly quota.",
        "exp": "Work hard là làm việc chăm chỉ; còn hardly mang nghĩa hầu như không (trái ngược hoàn toàn nghĩa câu)."
      },
      {
        "wrong": "Ms. Sato is high qualified for the chief operating officer role.",
        "right": "Ms. Sato is <b>highly</b> qualified for the chief operating officer role.",
        "exp": "Bổ nghĩa cho tính từ qualified phải dùng trạng từ highly (rất/cực kỳ), không dùng high."
      }
    ],
    "quiz": [
      {
        "q": "The newly appointed safety inspector checked every emergency exit _____ before signing the permit.",
        "opts": [
          "thorough",
          "thoroughly",
          "thoroughness",
          "more thorough"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (thoroughly). Câu đã đủ S + V + O (checked every emergency exit), cần trạng từ bổ nghĩa cho động từ checked. Loại A, D (tính từ) và C (danh từ)."
      },
      {
        "q": "All conference rooms on the fourth floor are _____ booked for the rest of the week.",
        "opts": [
          "complete",
          "completed",
          "completion",
          "completely"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (completely). Chỗ trống nằm giữa động từ be (are) và phân từ tính từ (booked), cần trạng từ bổ nghĩa (completely booked: đã đặt kín hoàn toàn). Loại A (tính/động từ), B (V-ed) và C (danh từ)."
      },
      {
        "q": "Veridian Motors has been expanding its electric vehicle lineup rapidly _____.",
        "opts": [
          "lately",
          "later",
          "late",
          "latest"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (lately). Thì hiện tại hoàn thành tiếp diễn (has been expanding) đi với trạng từ lately (gần đây). Loại C (muộn), B (sau này) và D (mới nhất)."
      },
      {
        "q": "The revised employee handbook is _____ recommended for all newly promoted supervisors.",
        "opts": [
          "high",
          "height",
          "highly",
          "higher"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (highly). Cụm cố định TOEIC là highly recommended (được khuyên dùng cao độ), trạng từ highly bổ nghĩa cho recommended. Loại A, D (tính từ) và B (danh từ)."
      },
      {
        "q": "Because of the severe snowstorm, _____ anyone was able to commute to the downtown office.",
        "opts": [
          "hard",
          "hardly",
          "harder",
          "hardness"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (hardly). Hardly anyone nghĩa là hầu như không ai (phù hợp nguyên nhân trận bão tuyết lớn). Loại A, C (chăm chỉ/khó hơn) và D (danh từ)."
      },
      {
        "q": "_____ thirty percent of the annual IT budget has been allocated to cybersecurity upgrades.",
        "opts": [
          "Near",
          "Nearby",
          "Nearing",
          "Nearly"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (Nearly). Đứng trước con số/tỷ lệ phần trăm (thirty percent) phải dùng trạng từ nearly (gần như/xấp xỉ). Loại A, B (chỉ khoảng cách gần) và C (V-ing)."
      }
    ]
  },
  {
    "id": "tg_07",
    "order": 7,
    "level": 1,
    "unitTitle": "Chặng 1 • Lấy gốc Từ loại & 6 Thì cơ bản (0–350)",
    "category": "Đại từ & Mạo từ",
    "partTag": "Part 5",
    "title": "Đại từ 5 cột: Nhân xưng, Tân ngữ, Sở hữu & Phản thân",
    "speedTip": "Mẹo 5 giây: Trước V chọn cột 1 (he/they); sau V/Giới từ chọn cột 2 (him/them); trước N chọn cột 3 (his/their); thay cho cả cụm [Sở hữu + N] chọn cột 4 (his/theirs); Chủ ngữ = Tân ngữ hoặc đi sau by chọn cột 5 (himself/themselves).",
    "formula": "Cột 1 (S) | Cột 2 (O) | Cột 3 (Adj sở hữu + N) | Cột 4 (Đại từ sở hữu) | Cột 5 (Phản thân)",
    "summary": "Câu hỏi Đại từ 5 cột là dạng 'cho điểm' trong TOEIC Part 5 nếu bạn xác định đúng chức năng ngữ pháp tại chỗ trống và đối chiếu đúng giống/số (số ít hay số nhiều) với danh từ được thay thế.",
    "theorySections": [
      {
        "heading": "1. Bảng quy chiếu 5 cột Đại từ bắt buộc thuộc lòng",
        "bullets": [
          "Cột 1 (Chủ ngữ - đứng trước V): I, you, he, she, it, we, they.",
          "Cột 2 (Tân ngữ - đứng sau Vt hoặc Giới từ): me, you, him, her, it, us, them.",
          "Cột 3 (Tính từ sở hữu - BẮT BUỘC có Danh từ theo sau): my, your, his, her, its, our, their.",
          "Cột 4 (Đại từ sở hữu = Cột 3 + N, đứng ĐỘC LẬP không kèm N): mine, yours, his, hers, ours, theirs.",
          "Cột 5 (Đại từ phản thân): myself, yourself/yourselves, himself, herself, itself, ourselves, themselves."
        ]
      },
      {
        "heading": "2. 2 cách dùng Đại từ phản thân cực hay thi TOEIC",
        "bullets": [
          "Chức năng Tân ngữ: khi Chủ ngữ và Tân ngữ là CÙNG MỘT ĐỐI TƯỢNG (Ms. Gomez introduced herself to the board).",
          "Chức năng Nhấn mạnh hoặc đi trong cụm by + oneself (= tự mình/một mình): The director reviewed the contract himself / Mr. Lee assembled the display by himself.",
          "Lưu ý bẫy: Đại từ phản thân KHÔNG BAO GIỜ đứng một mình làm Chủ ngữ (KHÔNG viết Himself approved the budget)."
        ]
      }
    ],
    "examples": [
      {
        "en": "Please forward the signed lease agreement directly to <b>us</b> before 4:00 P.M.",
        "vi": "Vui lòng chuyển thẳng hợp đồng thuê đã ký cho chúng tôi trước 4 giờ chiều.",
        "note": "Sau giới từ to (và không có danh từ theo sau) dùng Đại từ tân ngữ cột 2 (us)."
      },
      {
        "en": "Our warranty covers manufacturing defects for three years, whereas <b>theirs</b> covers only one.",
        "vi": "Chính sách bảo hành của chúng tôi bảo vệ lỗi sản xuất trong ba năm, trong khi của họ chỉ có một năm.",
        "note": "Theirs (cột 4) thay thế cho cụm their warranty nên đứng độc lập làm chủ ngữ mệnh đề sau."
      },
      {
        "en": "Dr. Patel prepared the entire keynote presentation by <b>himself</b> over the weekend.",
        "vi": "Tiến sĩ Patel đã tự mình chuẩn bị toàn bộ bài thuyết trình chính vào cuối tuần.",
        "note": "Cụm by himself = alone / without help (tự mình làm)."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The company recently upgraded it's inventory tracking software.",
        "right": "The company recently upgraded <b>its</b> inventory tracking software.",
        "exp": "Its (không dấu nháy) mới là tính từ sở hữu cột 3; còn it's là viết tắt của it is / it has."
      },
      {
        "wrong": "Himself approved the annual marketing budget without consulting the committee.",
        "right": "<b>He</b> approved the annual marketing budget <b>himself</b> without consulting the committee.",
        "exp": "Đại từ phản thân (himself) không thể đứng một mình làm Chủ ngữ; phải dùng đại từ nhân xưng cột 1 (He) làm chủ ngữ và đặt himself để nhấn mạnh."
      }
    ],
    "quiz": [
      {
        "q": "The graphic designers completed the product packaging revisions ahead of _____ original deadline.",
        "opts": [
          "their",
          "them",
          "they",
          "theirs"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (their). Sau chỗ trống có cụm danh từ original deadline nên cần tính từ sở hữu cột 3 (their). Loại C (chủ ngữ), B (tân ngữ) và D (đại từ sở hữu không đi trước danh từ)."
      },
      {
        "q": "Mr. Alvarez asked the receptionist to transfer all urgent international calls directly to _____.",
        "opts": [
          "he",
          "his",
          "him",
          "himself"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (him). Sau giới từ to cần tân ngữ cột 2 (him). Lưu ý chủ ngữ của hành động transfer là the receptionist (khác Mr. Alvarez) nên không dùng đại từ phản thân D (himself); loại A (chủ ngữ) và B (sở hữu)."
      },
      {
        "q": "Because the IT specialist was out sick, Ms. Lindqvist resolved the network issue by _____.",
        "opts": [
          "she",
          "her",
          "hers",
          "herself"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (herself). Cấu trúc by + đại từ phản thân (by herself = tự mình) khớp với chủ ngữ Ms. Lindqvist. Loại A (chủ ngữ), B (tân ngữ/tính từ sở hữu) và C (đại từ sở hữu)."
      },
      {
        "q": "Although our logistics proposal was slightly more expensive, the client preferred _____ over the competitor's offer.",
        "opts": [
          "we",
          "ours",
          "our",
          "us"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (ours). Chỗ trống thay thế cho cụm our logistics proposal (tính từ sở hữu + danh từ) nên phải chọn đại từ sở hữu cột 4 (ours). Loại A (chủ ngữ), D (chỉ con người chứ không phải bản đề xuất) và C (cần danh từ phía sau)."
      },
      {
        "q": "Crestline Hotel has earned a stellar reputation for _____ attentive concierge service.",
        "opts": [
          "it",
          "it's",
          "its",
          "itself"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (its). Trước cụm danh từ attentive concierge service cần tính từ sở hữu của danh từ số ít chỉ vật (Crestline Hotel) là its. Loại A (đại từ chủ/tân ngữ), B (it's = it is) và D (phản thân)."
      },
      {
        "q": "The regional managers _____ will greet the overseas investors at the airport terminal.",
        "opts": [
          "themselves",
          "them",
          "their",
          "they"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (themselves). Đại từ phản thân đứng ngay sau chủ ngữ số nhiều (The regional managers) để nhấn mạnh (chính các giám đốc khu vực sẽ ra đón). Loại D, B, C vì không phù hợp chức năng nhấn mạnh."
      }
    ]
  },
  {
    "id": "tg_08",
    "order": 8,
    "level": 1,
    "unitTitle": "Chặng 1 • Lấy gốc Từ loại & 6 Thì cơ bản (0–350)",
    "category": "Thì & Bị động",
    "partTag": "Part 5–6",
    "title": "Hiện tại đơn & Hiện tại tiếp diễn (Part 1 & Lịch trình)",
    "speedTip": "Mẹo 5 giây: Thấy tần suất lặp lại (every, regularly, annually) hoặc lịch trình cố định (chuyến bay/tàu/hội thảo) -> Hiện tại đơn; thấy currently, at the moment, right now, this week (tạm thời) -> Hiện tại tiếp diễn.",
    "formula": "HTĐ: S + V(s/es)  |  HTTD: S + am/is/are + V-ing  |  Part 1: is/are + V-ing vs is/are + being + V-ed",
    "summary": "Hiện tại đơn và Hiện tại tiếp diễn là 2 thì cốt lõi nhất cho cả Listening Part 1 (tả hành động trong tranh) lẫn Reading Part 5–6 (quy trình công ty, lịch trình tàu xe và dự án đang triển khai).",
    "theorySections": [
      {
        "heading": "1. Khi nào dùng Hiện tại đơn (Present Simple)?",
        "bullets": [
          "Diễn tả chính sách, quy trình định kỳ, sự thật hiển nhiên của công ty (every week, routinely, regularly, annually, always, typically).",
          "Diễn tả lịch trình/thời gian biểu cố định trong tương lai của phương tiện, sự kiện (The express train departs at 7:15 A.M. tomorrow).",
          "QUY TẮC VÀNG TOEIC: Trong mệnh đề thời gian & điều kiện (when, before, after, until, as soon as, if) nói về tương lai, dùng HIỆN TẠI ĐƠN thay cho will."
        ]
      },
      {
        "heading": "2. Khi nào dùng Hiện tại tiếp diễn (Present Continuous) & Ứng dụng Part 1?",
        "bullets": [
          "Hành động đang diễn ra tại thời điểm nói hoặc dự án tạm thời đang tiến hành (currently, right now, at present, at the moment, this quarter).",
          "Trong Listening Part 1: dùng S + is/are + V-ing cho hành động người đang làm (A worker is inspecting a machine) và cẩn thận bẫy is/are + being + V-ed (chỉ đúng khi có người đang thực hiện trong tranh).",
          "Động từ trạng thái (belong, consist, own, know, prefer, contain, include) KHÔNG chia tiếp diễn."
        ]
      }
    ],
    "examples": [
      {
        "en": "The shuttle bus to the industrial park <b>departs</b> every twenty minutes from the main gate.",
        "vi": "Xe buýt trung chuyển đến khu công nghiệp khởi hành 20 phút một chuyến từ cổng chính.",
        "note": "Lịch trình lặp lại (every twenty minutes) -> chia hiện tại đơn số ít departs."
      },
      {
        "en": "Our engineering team <b>is currently testing</b> a prototype of the waterproof smart lock.",
        "vi": "Đội kỹ sư của chúng tôi hiện đang thử nghiệm nguyên mẫu khóa thông minh chống nước.",
        "note": "Dấu hiệu currently diễn tả dự án đang tiến hành -> is currently testing."
      },
      {
        "en": "Please notify the reception desk as soon as the visiting delegates <b>arrive</b>.",
        "vi": "Vui lòng báo cho quầy lễ tân ngay khi phái đoàn khách mời đến nơi.",
        "note": "Sau liên từ thời gian as soon as nói về tương lai, chia hiện tại đơn (arrive), không dùng will arrive."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The package is containing all the signed warranty certificates.",
        "right": "The package <b>contains</b> all the signed warranty certificates.",
        "exp": "Contain là động từ chỉ trạng thái (chứa đựng), không chia ở thì tiếp diễn."
      },
      {
        "wrong": "We will release the press statement once the CEO will sign the agreement.",
        "right": "We will release the press statement once the CEO <b>signs</b> the agreement.",
        "exp": "Mệnh đề phụ chỉ thời gian (once/when/until/as soon as) không dùng will mà chia hiện tại đơn."
      }
    ],
    "quiz": [
      {
        "q": "Our logistics division _____ over 2,000 international parcels through the Frankfurt hub every week.",
        "opts": [
          "process",
          "processed",
          "is processing",
          "processes"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (processes). Dấu hiệu every week chỉ tần suất lặp lại đều đặn -> chia hiện tại đơn; chủ ngữ số ít Our logistics division cần thêm -es. Loại A (thiếu -es), C (tiếp diễn) và B (quá khứ)."
      },
      {
        "q": "The human resources team is _____ interviewing candidates for the regional sales director opening.",
        "opts": [
          "yesterday",
          "currently",
          "ago",
          "soon"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (currently). Thì hiện tại tiếp diễn (is ... interviewing) đi cặp kinh điển với trạng từ currently (hiện đang). Loại A, C (quá khứ đơn) và D (tương lai)."
      },
      {
        "q": "According to the revised itinerary, the morning flight to Osaka _____ at 8:40 A.M. tomorrow.",
        "opts": [
          "depart",
          "departed",
          "departs",
          "has departed"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (departs). Lịch trình cố định của chuyến bay/tàu xe chia ở thì hiện tại đơn dù có từ tomorrow; chủ ngữ số ít the morning flight đi với departs. Loại A (sai chủ ngữ số ít), B và D (quá khứ/hoàn thành)."
      },
      {
        "q": "Please wait in the conference lounge until the technical crew _____ setting up the projector.",
        "opts": [
          "finishes",
          "finished",
          "will finish",
          "finishing"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (finishes). Trong mệnh đề thời gian bắt đầu bằng until mang nghĩa tương lai, bắt buộc chia hiện tại đơn (finishes cho chủ ngữ số ít the technical crew). Loại C (không dùng will sau until), B (quá khứ) và D (V-ing)."
      },
      {
        "q": "The newly released training kit _____ three reference manuals and an access card.",
        "opts": [
          "is consisting of",
          "consisting of",
          "consist of",
          "consists of"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (consists of). Consist of (bao gồm) là động từ trạng thái nên không chia tiếp diễn; chủ ngữ số ít training kit đi với consists of. Loại A (sai tiếp diễn), C (sai hòa hợp số ít) và B (V-ing)."
      },
      {
        "q": "Because the downtown headquarters is undergoing renovation, several departments _____ temporarily from the west annex.",
        "opts": [
          "operate",
          "are operating",
          "operated",
          "will have operated"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (are operating). Từ khóa temporarily (tạm thời) và vế đầu is undergoing renovation diễn tả hoạt động tạm thời đang diễn ra -> hiện tại tiếp diễn are operating. Loại A (thói quen lâu dài), C (quá khứ) và D (tương lai hoàn thành)."
      }
    ]
  },
  {
    "id": "tg_09",
    "order": 9,
    "level": 1,
    "unitTitle": "Chặng 1 • Lấy gốc Từ loại & 6 Thì cơ bản (0–350)",
    "category": "Thì & Bị động",
    "partTag": "Part 5–6",
    "title": "Quá khứ đơn & Tương lai đơn",
    "speedTip": "Mẹo 5 giây: Thấy mốc thời gian đã chấm dứt (yesterday, last week/year, ... ago, in 2022, previously) -> Quá khứ đơn (V-ed/V2); thấy mốc sắp tới (next month, tomorrow, soon, starting Monday, upcoming) -> Tương lai đơn (will + V-bare).",
    "formula": "QKĐ: S + V2/V-ed  |  TLĐ: S + will + V-bare (hoặc S + be going to + V-bare)",
    "summary": "Quá khứ đơn và Tương lai đơn chiếm tỷ trọng lớn trong Email công việc và Thông báo TOEIC Part 5–6. Chỉ cần xác định đúng trạng từ chỉ thời gian và quy tắc động từ nguyên mẫu sau will là bạn chốt đáp án cực nhanh.",
    "theorySections": [
      {
        "heading": "1. Quá khứ đơn (Past Simple): Chốt mốc đã hoàn toàn chấm dứt",
        "bullets": [
          "Dấu hiệu nhận diện chắc chắn: yesterday, last night/week/month/quarter/year, two days ago, in 2021, formerly, previously, earlier this morning.",
          "Khi trong câu có sự kiện lịch sử của công ty đã khép lại (founded in 1998, acquired last spring), luôn chọn Quá khứ đơn (KHÔNG dùng Hiện tại hoàn thành với mốc quá khứ cụ thể).",
          "Lưu ý bất quy tắc hay gặp trong TOEIC: begin -> began, hold -> held, rise -> rose, lead -> led, choose -> chose, pay -> paid, send -> sent, draw -> drew."
        ]
      },
      {
        "heading": "2. Tương lai đơn (Future Simple): Kế hoạch, thông báo & cam kết công sở",
        "bullets": [
          "Dấu hiệu nhận diện chắc chắn: tomorrow, next week/quarter/year, in the near future, soon, shortly, starting next Monday, effective May 1, upcoming.",
          "Cấu trúc chủ động: will + V-bare (nguyên mẫu không to); bị động: will be + V3/V-ed.",
          "Thường xuất hiện trong thông báo chính sách mới (The new policy will take effect on July 1) và cam kết dịch vụ (A technician will contact you shortly)."
        ]
      }
    ],
    "examples": [
      {
        "en": "Meridian Electronics <b>opened</b> its first European distribution center in Rotterdam in 2019.",
        "vi": "Meridian Electronics đã mở trung tâm phân phối đầu tiên tại châu Âu ở Rotterdam vào năm 2019.",
        "note": "Có mốc năm cụ thể trong quá khứ (in 2019) -> dùng Quá khứ đơn opened."
      },
      {
        "en": "Effective next Monday, all parking passes <b>will require</b> electronic verification at the gate.",
        "vi": "Có hiệu lực từ thứ Hai tới, tất cả thẻ đỗ xe sẽ yêu cầu xác thực điện tử tại cổng.",
        "note": "Dấu hiệu tương lai Effective next Monday -> dùng will + V-bare (will require)."
      },
      {
        "en": "Ms. Cho <b>led</b> the product redesign initiative before transferring to the Tokyo branch.",
        "vi": "Cô Cho đã dẫn dắt sáng kiến thiết kế lại sản phẩm trước khi chuyển sang chi nhánh Tokyo.",
        "note": "Quá khứ đơn của động từ bất quy tắc lead là led (không phải leaded)."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The accounting team has finalized the tax audit last Friday.",
        "right": "The accounting team <b>finalized</b> the tax audit last Friday.",
        "exp": "Khi có mốc quá khứ cụ thể (last Friday), tuyệt đối không dùng Hiện tại hoàn thành mà phải dùng Quá khứ đơn."
      },
      {
        "wrong": "The courier will delivers the replacement parts before noon tomorrow.",
        "right": "The courier <b>will deliver</b> the replacement parts before noon tomorrow.",
        "exp": "Sau trợ động từ will luôn là động từ nguyên mẫu không chia -s/-es (deliver)."
      }
    ],
    "quiz": [
      {
        "q": "Northstar Textiles _____ its annual shareholder meeting at the Grand Pavilion last Tuesday.",
        "opts": [
          "holds",
          "will hold",
          "held",
          "has held"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (held). Mốc thời gian quá khứ cụ thể last Tuesday bắt buộc dùng Quá khứ đơn (quá khứ của hold là held). Loại A (hiện tại), B (tương lai) và D (hiện tại hoàn thành không đi với mốc last Tuesday)."
      },
      {
        "q": "Starting next quarter, our customer care line _____ extended support hours on weekends.",
        "opts": [
          "will offer",
          "offered",
          "has offered",
          "offering"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (will offer). Cụm Starting next quarter (bắt đầu từ quý tới) chỉ thời điểm tương lai -> chọn Tương lai đơn will offer. Loại B (quá khứ), C (hiện tại hoàn thành) và D (V-ing)."
      },
      {
        "q": "Several independent agencies _____ the new pharmaceutical compound three years ago.",
        "opts": [
          "evaluate",
          "evaluated",
          "will evaluate",
          "have evaluated"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (evaluated). Dấu hiệu three years ago là mốc quá khứ đã chấm dứt -> chọn Quá khứ đơn evaluated. Loại A (hiện tại), C (tương lai) và D (hiện tại hoàn thành)."
      },
      {
        "q": "A certified technician _____ to your office tomorrow morning to inspect the ventilation unit.",
        "opts": [
          "comes",
          "came",
          "has come",
          "will come"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (will come). Dấu hiệu tomorrow morning chỉ một lịch hẹn dịch vụ sắp diễn ra -> dùng Tương lai đơn will come. Loại A (thói quen hiện tại), B (quá khứ) và C (hiện tại hoàn thành)."
      },
      {
        "q": "Prior to joining Silverline Bank, Mr. Davis _____ as a senior risk analyst in Toronto.",
        "opts": [
          "worked",
          "will work",
          "is working",
          "works"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (worked). Cụm Prior to joining Silverline Bank (trước khi gia nhập ngân hàng) chỉ công việc đã kết thúc trong quá khứ -> dùng Quá khứ đơn worked. Loại B, C, D vì sai mốc thời gian."
      },
      {
        "q": "The construction contractor assured the city council that the pedestrian bridge _____ open on schedule next spring.",
        "opts": [
          "was",
          "is",
          "will",
          "had"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (will). Phía sau chỗ trống là động từ nguyên mẫu open kết hợp mốc next spring -> cần trợ động từ will để tạo thì Tương lai đơn (will open). Loại A, B (be không đi trước V-bare open chủ động) và D (had cần V3)."
      }
    ]
  },
  {
    "id": "tg_10",
    "order": 10,
    "level": 1,
    "unitTitle": "Chặng 1 • Lấy gốc Từ loại & 6 Thì cơ bản (0–350)",
    "category": "Thì & Bị động",
    "partTag": "Part 5–6",
    "title": "Hiện tại hoàn thành & Quá khứ hoàn thành",
    "speedTip": "Mẹo 5 giây: Thấy since + mốc quá khứ, for + khoảng thời gian, over the past/last + số năm, recently, already, yet -> Hiện tại hoàn thành (have/has + V3); thấy 2 hành động quá khứ có by the time / before / after -> hành động xảy ra TRƯỚC chia Quá khứ hoàn thành (had + V3).",
    "formula": "HTHT: S + have/has + V3/V-ed  |  QKHT: S + had + V3/V-ed (trước QKĐ)",
    "summary": "Hiện tại hoàn thành kết nối quá khứ với hiện tại, còn Quá khứ hoàn thành dùng để chốt rõ thứ tự 'xảy ra trước' giữa hai sự kiện quá khứ. Đây là cặp thì ra thi liên tục trong cả Part 5 và Part 6.",
    "theorySections": [
      {
        "heading": "1. Hiện tại hoàn thành (Present Perfect): Từ khóa nhận diện tức thì",
        "bullets": [
          "Dấu hiệu số 1: since + mốc thời gian (since 2018 / since it opened), for + khoảng thời gian (for five years).",
          "Cụm bẫy cực hay thi ETS: over the past five years / in the last decade / during the past few months -> CHIA HIỆN TẠI HOÀN THÀNH (KHÔNG phải Quá khứ đơn!).",
          "Các trạng từ đi kèm phổ biến: recently, lately, already, yet (câu phủ định/nghi vấn), so far, up to now, ever, never."
        ]
      },
      {
        "heading": "2. Quá khứ hoàn thành (Past Perfect): Quá khứ của quá khứ",
        "bullets": [
          "Dùng cho hành động xảy ra và hoàn tất TRƯỚC một hành động hoặc mốc thời gian khác trong quá khứ.",
          "Công thức vàng: By the time + S + V(QKĐ), S + had + V3/V-ed (hoặc Before + S + V(QKĐ), S + had + V3/V-ed).",
          "Lưu ý: Không dùng Quá khứ hoàn thành trơ trọi trong câu đơn nếu không có mốc hoặc hành động quá khứ thứ hai làm chuẩn so sánh."
        ]
      }
    ],
    "examples": [
      {
        "en": "Online subscription revenue <b>has grown</b> steadily over the past three years.",
        "vi": "Doanh thu đăng ký trực tuyến đã tăng trưởng ổn định trong suốt ba năm qua.",
        "note": "Cụm over the past three years tính đến tận hiện tại -> chia Hiện tại hoàn thành has grown."
      },
      {
        "en": "The firm <b>has operated</b> three logistics hubs in Asia since 2016.",
        "vi": "Công ty đã vận hành ba trung tâm hậu cần tại châu Á kể từ năm 2016.",
        "note": "Có since 2016 -> bắt buộc dùng Hiện tại hoàn thành has operated."
      },
      {
        "en": "By the time the external auditors arrived, the finance team <b>had already prepared</b> all ledger files.",
        "vi": "Vào lúc các kiểm toán viên bên ngoài đến nơi, đội tài chính đã chuẩn bị xong toàn bộ sổ cái từ trước đó.",
        "note": "Hành động chuẩn bị xong trước lúc auditors arrived (QKĐ) -> chia Quá khứ hoàn thành had already prepared."
      }
    ],
    "pitfalls": [
      {
        "wrong": "Over the last five years, customer satisfaction improved dramatically.",
        "right": "Over the last five years, customer satisfaction <b>has improved</b> dramatically.",
        "exp": "Đừng bị chữ last đánh lừa! Over/In the last + khoảng thời gian có nghĩa là trong suốt ... vừa qua (đến hiện tại) nên phải dùng Hiện tại hoàn thành."
      },
      {
        "wrong": "Before Mr. Han retired in May, he worked at the plant since 1995.",
        "right": "Before Mr. Han retired in May, he <b>had worked</b> at the plant since 1995.",
        "exp": "Khoảng thời gian kéo dài đến một mốc đã chấm dứt trong quá khứ (retired in May) phải dùng Quá khứ hoàn thành (had worked)."
      }
    ],
    "quiz": [
      {
        "q": "Sales of our eco-friendly kitchen appliances _____ by nearly forty percent over the past two years.",
        "opts": [
          "increase",
          "have increased",
          "increased",
          "will increase"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (have increased). Cụm over the past two years (trong hai năm vừa qua tính đến nay) là dấu hiệu kinh điển của thì Hiện tại hoàn thành; chủ ngữ số nhiều Sales đi với have increased. Loại A (hiện tại đơn), C (quá khứ đơn) và D (tương lai)."
      },
      {
        "q": "Ever since the new warehouse management system was installed, order errors _____ significantly.",
        "opts": [
          "declined",
          "are declining",
          "will decline",
          "have declined"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (have declined). Cấu trúc chuẩn ETS: Ever since + S + V(QKĐ), S + have/has + V3. Chủ ngữ số nhiều order errors đi với have declined. Loại A, C, B vì sai quy tắc phối thì với since."
      },
      {
        "q": "By the time Ms. Kapoor reached the airport terminal, the shuttle bus to the hotel _____.",
        "opts": [
          "had already departed",
          "has already departed",
          "already departs",
          "will already depart"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (had already departed). Mệnh đề By the time + reached chia quá khứ đơn, nên hành động xe buýt đã rời đi từ trước đó phải chia Quá khứ hoàn thành (had + V3). Loại C (hiện tại), B (hiện tại hoàn thành) và D (tương lai)."
      },
      {
        "q": "The architectural firm _____ several prestigious urban design awards since its founding in 2010.",
        "opts": [
          "wins",
          "won",
          "has won",
          "had won"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (has won). Dấu hiệu since its founding in 2010 kéo dài đến hiện tại -> Hiện tại hoàn thành has won (chủ ngữ số ít firm). Loại A (hiện tại đơn), B (quá khứ đơn) và D (quá khứ hoàn thành không có mốc quá khứ thứ 2)."
      },
      {
        "q": "Before the merger took effect last April, both companies _____ separate payroll platforms.",
        "opts": [
          "maintain",
          "had maintained",
          "have maintained",
          "will maintain"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (had maintained). Việc duy trì nền tảng riêng diễn ra và kết thúc trước sự kiện quá khứ the merger took effect last April -> chọn Quá khứ hoàn thành had maintained. Loại A, C, D vì lệch thời gian."
      },
      {
        "q": "Although the marketing department finalized the brochure layout yesterday, the print shop has not delivered the copies _____.",
        "opts": [
          "already",
          "ago",
          "still",
          "yet"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (yet). Trong câu phủ định của thì Hiện tại hoàn thành (has not delivered), trạng từ đứng cuối câu mang nghĩa vẫn chưa là yet. Loại A (dùng câu khẳng định), C (still đứng trước hasn't) và B (quá khứ đơn)."
      }
    ]
  },
  {
    "id": "tg_11",
    "order": 11,
    "level": 1,
    "unitTitle": "Chặng 1 • Lấy gốc Từ loại & 6 Thì cơ bản (0–350)",
    "category": "Đại từ & Mạo từ",
    "partTag": "Part 5",
    "title": "Mạo từ (a/an/the) & Lượng từ (each/every/most/many/much)",
    "speedTip": "Mẹo 5 giây: Nhìn ngay danh từ đứng sau chỗ trống! Danh từ đếm được SỐ ÍT -> chọn a/an/each/every/another; SỐ NHIỀU -> many/several/few/most/other; KHÔNG ĐẾM ĐƯỢC -> much/little/a great deal of.",
    "formula": "each/every/another + N(số ít)  |  many/few/several + N(số nhiều)  |  much/little + N(KĐĐ)  |  most + N vs most of the + N",
    "summary": "Bẫy Lượng từ và Mạo từ trong TOEIC Part 5 cực kỳ logic: chỉ cần kiểm tra danh từ theo sau là số ít, số nhiều hay không đếm được, và để ý xem có giới từ 'of' đứng sau lượng từ hay không.",
    "theorySections": [
      {
        "heading": "1. Mạo từ a / an / the chuẩn phát âm & ngữ cảnh",
        "bullets": [
          "Dùng an trước âm nguyên âm (KHÔNG chỉ nhìn chữ cái!): an hour, an honest mistake, an MBA degree; nhưng a university, a uniform, a European branch, a one-year contract (đọc âm /j/ hoặc /w/).",
          "Dùng the cho danh từ đã xác định, duy nhất, so sánh nhất (the largest branch) hoặc có cụm giới từ bổ nghĩa phía sau (the quality of the materials).",
          "Không dùng mạo từ trước danh từ không đếm được hoặc danh từ số nhiều nói chung chung (Information is valuable)."
        ]
      },
      {
        "heading": "2. Lượng từ hay ra thi & Bẫy có/không có 'of'",
        "bullets": [
          "Đi với Danh từ số ít: each, every, another (Lưu ý: each of + the + N số nhiều + V số ít; KHÔNG có every of!).",
          "Đi với Danh từ số nhiều: many, several, a few (vài - tích cực), few (rất ít - tiêu cực), a number of, both.",
          "Đi với Danh từ không đếm được: much, a little (một chút), little (rất ít), a great deal of.",
          "Bẫy kinh điển MOST vs ALMOST: most + N số nhiều/KĐĐ (most employees) hoặc most of the + N (most of the employees). Almost là TRẠNG TỪ, KHÔNG đứng trực tiếp trước danh từ (phải là almost all employees / almost every day)."
        ]
      }
    ],
    "examples": [
      {
        "en": "The firm signed <b>a</b> one-year maintenance agreement with an authorized local dealer.",
        "vi": "Công ty đã ký một hợp đồng bảo trì một năm với đại lý được ủy quyền tại địa phương.",
        "note": "One phát âm bắt đầu bằng phụ âm /w/ -> dùng a one-year, còn authorized bắt đầu bằng nguyên âm -> dùng an."
      },
      {
        "en": "<b>Most</b> employees prefer flexible morning hours during the winter months.",
        "vi": "Hầu hết nhân viên thích khung giờ buổi sáng linh hoạt trong những tháng mùa đông.",
        "note": "Most đi trực tiếp trước danh từ số nhiều không có mạo từ; nếu có the phải viết Most of the employees."
      },
      {
        "en": "<b>Each</b> of the regional branches must submit its monthly inventory audit by the 5th.",
        "vi": "Mỗi chi nhánh khu vực phải nộp báo cáo kiểm kê hàng tháng trước ngày mùng 5.",
        "note": "Cấu trúc Each of the + N số nhiều (branches) + động từ số ít (must submit / its)."
      }
    ],
    "pitfalls": [
      {
        "wrong": "Almost staff members attended the cybersecurity seminar yesterday.",
        "right": "<b>Almost all</b> staff members (hoặc <b>Most</b> staff members) attended the cybersecurity seminar yesterday.",
        "exp": "Almost là trạng từ nên không đứng trực tiếp trước danh từ; phải đi với all/every/no/số từ, hoặc đổi sang Most."
      },
      {
        "wrong": "Every of the applicants received a written confirmation e-mail.",
        "right": "<b>Each of</b> the applicants (hoặc <b>Every one of</b> the applicants) received a written confirmation e-mail.",
        "exp": "Every không bao giờ đi trực tiếp với of; phải dùng each of hoặc every one of."
      }
    ],
    "quiz": [
      {
        "q": "All full-time associates are eligible for _____ annual health screening covered by the company.",
        "opts": [
          "an",
          "a",
          "many",
          "few"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (an). Danh từ đếm được số ít annual health screening bắt đầu bằng âm nguyên âm /æ/ của từ annual -> dùng mạo từ an. Loại B (sai âm nguyên âm), C và D (chỉ đi với danh từ số nhiều)."
      },
      {
        "q": "_____ of the newly hired interns has been assigned an experienced mentor for the summer.",
        "opts": [
          "Every",
          "Many",
          "Each",
          "Both"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (Each). Ngay sau chỗ trống có giới từ of và động từ chia số ít (has been assigned) -> chỉ có Each of đáp ứng cả hai điều kiện. Loại A (không có Every of), B và D (đi với động từ số nhiều)."
      },
      {
        "q": "The logistics survey revealed that _____ respondents were satisfied with the overnight courier speed.",
        "opts": [
          "almost",
          "every",
          "much",
          "most"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (most). Trước danh từ đếm được số nhiều không có mạo từ (respondents) dùng most (hầu hết). Loại A (almost là trạng từ, không đứng trực tiếp trước danh từ), C (much chỉ đi với N không đếm được) và B (every đi với N số ít)."
      },
      {
        "q": "Because the factory experienced _____ equipment downtime this quarter, production targets were easily exceeded.",
        "opts": [
          "few",
          "little",
          "many",
          "several"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (little). Equipment downtime (thời gian máy ngừng hoạt động) là danh từ không đếm được, và ngữ cảnh vượt mục tiêu sản xuất cần nghĩa rất ít (little). Loại A, C, D vì đều chỉ đi với danh từ đếm được số nhiều."
      },
      {
        "q": "The purchasing officer requested _____ quote from a second printing vendor to compare unit costs.",
        "opts": [
          "other",
          "others",
          "another",
          "many"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (another). Danh từ quote ở dạng đếm được số ít -> dùng another + N số ít (một bảng báo giá khác). Loại A (other đi với N số nhiều/KĐĐ), B (others là đại từ không kèm N) và D (many đi với N số nhiều)."
      },
      {
        "q": "_____ the participants who completed the online feedback form received a ten-dollar voucher.",
        "opts": [
          "Most of",
          "Every",
          "Almost",
          "Much of"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (Most of). Phía sau có mạo từ the + danh từ số nhiều (the participants) -> bắt buộc dùng Most of the + N số nhiều. Loại C (thiếu all), B (every không đứng trước the + N số nhiều) và D (much chỉ dùng cho danh từ không đếm được)."
      }
    ]
  },
  {
    "id": "tg_12",
    "order": 12,
    "level": 1,
    "unitTitle": "Chặng 1 • Lấy gốc Từ loại & 6 Thì cơ bản (0–350)",
    "category": "Liên từ & Giới từ",
    "partTag": "Part 5–6",
    "title": "Giới từ Thời gian & Địa điểm (in/on/at/by/until/within)",
    "speedTip": "Mẹo 5 giây: Hạn chót nộp/gửi (submit/return/complete) chọn BY; hành động kéo dài liên tục (remain/stay/last/continue) chọn UNTIL; khoảng thời gian đếm số (5 business days / 24 hours) chọn WITHIN.",
    "formula": "at (giờ/điểm cụ thể) | on (ngày/thứ) | in (tháng/năm/mùa) | by (trước hạn) vs until (cho đến khi) | within (trong vòng)",
    "summary": "Giới từ là nhóm câu hỏi cực dễ mất điểm oan nếu dịch theo thói quen tiếng Việt. Nắm chắc sự khác biệt giữa by vs until, within vs during, và bộ ba in/on/at giúp bạn xử lý gọn gàng cả Part 5 lẫn Part 6.",
    "theorySections": [
      {
        "heading": "1. Bộ ba Thời gian & Địa điểm: AT – ON – IN",
        "bullets": [
          "AT: Giờ cụ thể (at 9:00 A.M., at noon) và địa điểm/điểm chốt cụ thể (at the reception desk, at 420 Oak Street, at the entrance).",
          "ON: Thứ, ngày cụ thể, ngày lễ có chữ Day (on Monday, on October 15, on weekdays) và bề mặt/tầng lầu (on the third floor, on the website).",
          "IN: Tháng, quý, năm, mùa, buổi (in March, in the third quarter, in 2026, in the morning) và không gian bao quanh/thành phố/quốc gia (in Seattle, in the conference room)."
        ]
      },
      {
        "heading": "2. 3 cặp Giới từ thời gian hay gài bẫy nhất ETS TOEIC",
        "bullets": [
          "BY (trước hoặc chậm nhất vào hạn chót — dùng với hành động chấm dứt một lần: submit, pay, reply, register) vs UNTIL (kéo dài liên tục đến mốc đó — dùng với stay, remain, last, be open, continue).",
          "WITHIN + khoảng thời gian đếm số (within 7 days, within two weeks: trong vòng...) vs DURING + danh từ chỉ sự kiện/giai đoạn (during the meeting, during peak season — KHÔNG dùng during + số đếm như during 3 days!).",
          "FOR + khoảng thời gian đếm số (for three hours) vs SINCE + mốc thời gian bắt đầu (since last Monday)."
        ]
      }
    ],
    "examples": [
      {
        "en": "All expense reimbursement forms must be submitted <b>by</b> 5:00 P.M. on Friday.",
        "vi": "Tất cả mẫu đơn hoàn trả chi phí phải được nộp chậm nhất vào 5 giờ chiều thứ Sáu.",
        "note": "Submitted là hành động hoàn thành trước hạn chót -> dùng by; thứ Sáu cụ thể -> dùng on."
      },
      {
        "en": "The underground parking garage will remain closed for resurfacing <b>until</b> Wednesday morning.",
        "vi": "Bãi đỗ xe tầng hầm sẽ duy trì đóng cửa để trải lại mặt sàn cho đến sáng thứ Tư.",
        "note": "Remain closed là trạng thái kéo dài liên tục -> bắt buộc dùng until, không dùng by."
      },
      {
        "en": "Refunds for returned merchandise are typically processed <b>within</b> five business days.",
        "vi": "Tiền hoàn lại cho hàng hóa bị trả thường được xử lý trong vòng năm ngày làm việc.",
        "note": "Trong vòng + số ngày cụ thể (five business days) -> dùng within."
      }
    ],
    "pitfalls": [
      {
        "wrong": "Please return the signed contract until May 20.",
        "right": "Please return the signed contract <b>by</b> May 20.",
        "exp": "Return (gửi trả) là hành động diễn ra trước hạn chót, không phải trạng thái kéo dài -> dùng by."
      },
      {
        "wrong": "Our technician will resolve the issue during 48 hours.",
        "right": "Our technician will resolve the issue <b>within</b> 48 hours.",
        "exp": "During đi với tên sự kiện/giai đoạn (during the workshop), không đi với mốc số lượng thời gian giới hạn (within 48 hours)."
      }
    ],
    "quiz": [
      {
        "q": "Applicants interested in the overseas fellowship must upload their portfolios _____ November 30.",
        "opts": [
          "until",
          "among",
          "during",
          "by"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (by). Upload (tải lên) là hành động có hạn chót -> chọn by (chậm nhất vào ngày 30/11). Loại A (until dùng cho trạng thái kéo dài), C (during + sự kiện) và B (among + danh từ số nhiều)."
      },
      {
        "q": "The museum's special architecture exhibit will stay open to the public _____ the end of August.",
        "opts": [
          "by",
          "until",
          "within",
          "at"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (until). Cụm stay open (duy trì mở cửa) chỉ trạng thái kéo dài liên tục đến một mốc thời gian -> chọn until. Loại A (by chỉ hạn chót một lần), C (within + khoảng thời gian) và D (at không diễn tả sự kéo dài)."
      },
      {
        "q": "Any damaged items may be exchanged for a full replacement _____ thirty days of the purchase date.",
        "opts": [
          "during",
          "until",
          "within",
          "since"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (within). Đứng trước khoảng thời gian giới hạn (thirty days of the purchase date) chọn within (trong vòng 30 ngày). Loại A (during không đi với số ngày), B (until) và D (since + mốc quá khứ)."
      },
      {
        "q": "The keynote luncheon for regional franchisees will take place _____ the fourth floor of the Regent Hotel.",
        "opts": [
          "on",
          "at",
          "in",
          "to"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (on). Tầng lầu của tòa nhà luôn đi với giới từ on (on the fourth floor). Loại C, B, D vì sai quy tắc giới từ địa điểm."
      },
      {
        "q": "No unauthorized personnel are allowed to enter the cleanroom _____ laboratory inspections.",
        "opts": [
          "within",
          "until",
          "while",
          "during"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (during). Laboratory inspections là cụm danh từ chỉ sự kiện/giai đoạn -> chọn giới từ during (trong suốt quá trình kiểm tra). Loại A (within + khoảng thời gian), C (while là liên từ cần mệnh đề S+V hoặc V-ing) và B (sai nghĩa)."
      },
      {
        "q": "The revised employee wellness policy is scheduled to take effect _____ January 1.",
        "opts": [
          "in",
          "on",
          "at",
          "by"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (on). Khi có ngày cụ thể đi kèm tháng (January 1), bắt buộc dùng giới từ on (khác với chỉ có tháng in January). Loại A (chỉ dùng cho tháng đơn lẻ), C (dùng cho giờ) và D (sai sắc thái ngày có hiệu lực chính xác)."
      }
    ]
  },
  {
    "id": "tg_13",
    "order": 13,
    "level": 2,
    "unitTitle": "Chặng 2 • Bị động, Hòa hợp S–V, To-V/V-ing & Liên từ (350–550)",
    "category": "Thì & Bị động",
    "partTag": "Part 5–6",
    "title": "Thể Bị động & Mẹo nhìn sau chỗ trống",
    "speedTip": "Mẹo 5 giây: Nhìn NGAY SAU chỗ trống! Nếu KHÔNG có tân ngữ (chỉ có giới từ in/by/to/for, trạng từ, to-V hoặc dấu chấm) -> 90% là BỊ ĐỘNG (be + V3/V-ed). Nếu CÓ tân ngữ (cụm danh từ trực tiếp) -> chọn CHỦ ĐỘNG (trừ nhóm Mẫu 4 & Mẫu 5).",
    "formula": "S + be (chia theo thì) + V3/V-ed (+ Prep / Adv / To-V / by + tác nhân)",
    "summary": "Thể Bị động là chuyên đề trọng tâm số 1 của Chặng 2 (350–550). Áp dụng kỹ thuật 'soi sau chỗ trống' kết hợp kiểm tra ngoại lệ động từ 2 tân ngữ giúp bạn giải chính xác trên 95% câu hỏi Chia động từ trong Part 5–6.",
    "theorySections": [
      {
        "heading": "1. Công thức Bị động theo 6 thì & Modal cốt lõi TOEIC",
        "bullets": [
          "Hiện tại đơn / Quá khứ đơn: am/is/are + V3  |  was/were + V3.",
          "Tiếp diễn: am/is/are/was/were + being + V3 (nhấn mạnh đang được làm).",
          "Hoàn thành: have/has/had + been + V3 (đã được làm xong).",
          "Modal & Tương lai: will / must / should / can / may + be + V3 (The invoice must be paid within 15 days)."
        ]
      },
      {
        "heading": "2. Kỹ thuật nhìn sau chỗ trống & 2 ngoại lệ bắt buộc nhớ",
        "bullets": [
          "Với ngoại động từ thông thường: Sau chỗ trống có Danh từ làm tân ngữ -> Chủ động; sau chỗ trống là Giới từ / Trạng từ / Dấu chấm -> Bị động.",
          "Ngoại lệ 1 (Động từ 2 tân ngữ — Mẫu 4): give, offer, award, grant, send, inform, notify, remind. Khi chia Bị động, sau V3 VẪN CÒN 1 tân ngữ giữ lại (Ms. Patel was awarded a lifetime achievement prize).",
          "Ngoại lệ 2 (Cụm bị động không dùng by): be satisfied with, be equipped with, be located in/at, be involved in, be covered with, be pleased with, be dedicated to."
        ]
      }
    ],
    "examples": [
      {
        "en": "All incoming shipments <b>are inspected</b> thoroughly at the port before customs clearance.",
        "vi": "Mọi lô hàng nhập về đều được kiểm tra kỹ lưỡng tại cảng trước khi thông quan.",
        "note": "Sau chỗ trống là trạng từ thoroughly + giới từ at (không có tân ngữ) -> chọn bị động hiện tại đơn are inspected."
      },
      {
        "en": "The downtown branch <b>has been renovated</b> to accommodate thirty additional workstations.",
        "vi": "Chi nhánh trung tâm đã được cải tạo để bố trí thêm ba mươi vị trí làm việc.",
        "note": "Sau chỗ trống là to-V chỉ mục đích (to accommodate), không có tân ngữ trực tiếp -> bị động hiện tại hoàn thành has been renovated."
      },
      {
        "en": "Mr. Okafor <b>was offered</b> a leadership role at the company's Singapore subsidiary.",
        "vi": "Ông Okafor đã được đề nghị một vị trí lãnh đạo tại công ty con ở Singapore.",
        "note": "Ngoại lệ Mẫu 4 (offer someone something): sau bị động was offered vẫn giữ lại tân ngữ trực tiếp a leadership role."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The quarterly financial report will review by the audit committee tomorrow.",
        "right": "The quarterly financial report <b>will be reviewed</b> by the audit committee tomorrow.",
        "exp": "Chủ ngữ là vật (report) và phía sau có by the audit committee -> bắt buộc dùng bị động will be reviewed."
      },
      {
        "wrong": "The conference center is equipping with high-speed fiber internet.",
        "right": "The conference center <b>is equipped</b> with high-speed fiber internet.",
        "exp": "Cụm bị động trạng thái cố định TOEIC là be equipped with (được trang bị với), không dùng V-ing chủ động."
      }
    ],
    "quiz": [
      {
        "q": "The revised employee handbook _____ to all regional offices via courier last Wednesday.",
        "opts": [
          "dispatched",
          "has dispatched",
          "was dispatched",
          "dispatching"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (was dispatched). Sau chỗ trống là giới từ to (không có tân ngữ) kết hợp mốc quá khứ last Wednesday -> chọn bị động quá khứ đơn was dispatched. Loại A, B (chủ động) và D (V-ing)."
      },
      {
        "q": "Because the main elevator _____ this morning, visitors are asked to use the east stairwell.",
        "opts": [
          "is being serviced",
          "services",
          "is servicing",
          "has serviced"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (is being serviced). Chủ ngữ vật (the main elevator) đang được bảo trì ngay sáng nay và phía sau không có tân ngữ -> chọn bị động hiện tại tiếp diễn is being serviced. Loại C, B, D vì đều là dạng chủ động."
      },
      {
        "q": "All confidential legal files must _____ in locked cabinets at the end of each workday.",
        "opts": [
          "store",
          "be stored",
          "been stored",
          "storing"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (be stored). Sau động từ khuyết thiếu must và trước giới từ in (không có tân ngữ) cần cấu trúc bị động Modal: must + be + V3 (be stored). Loại A (chủ động), C (been không đi ngay sau must) và D (V-ing)."
      },
      {
        "q": "Dr. Fernandez _____ a prestigious research grant for her pioneering work in battery technology.",
        "opts": [
          "awarded",
          "awarding",
          "has awarding",
          "was awarded"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (was awarded). Award thuộc nhóm động từ 2 tân ngữ (award someone a grant). Dù sau chỗ trống còn a prestigious research grant, về nghĩa Dr. Fernandez là người ĐƯỢC trao giải -> chọn bị động was awarded. Loại A (nghĩa là bà ấy tự trao), C (sai ngữ pháp) và B (V-ing)."
      },
      {
        "q": "The executive board _____ the updated safety protocol at the annual assembly next month.",
        "opts": [
          "will ratify",
          "will be ratified",
          "was ratified",
          "has been ratified"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (will ratify). Phía sau chỗ trống CÓ tân ngữ trực tiếp (the updated safety protocol) kết hợp mốc tương lai next month -> chọn CHỦ ĐỘNG tương lai đơn will ratify. Loại B, C, D vì đều là thể bị động."
      },
      {
        "q": "Every seminar room in the convention center is _____ with dual projectors and surround sound.",
        "opts": [
          "equip",
          "equipping",
          "equipped",
          "equipment"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (equipped). Cụm bị động cố định TOEIC: be equipped with (được trang bị với). Loại A (động từ nguyên mẫu), B (chủ động V-ing) và D (danh từ)."
      }
    ]
  },
  {
    "id": "tg_14",
    "order": 14,
    "level": 2,
    "unitTitle": "Chặng 2 • Bị động, Hòa hợp S–V, To-V/V-ing & Liên từ (350–550)",
    "category": "Động từ",
    "partTag": "Part 5",
    "title": "Hòa hợp Chủ–Vị P1: Cụm of, along with & Chủ ngữ phức",
    "speedTip": "Mẹo 5 giây: Gạch bỏ ngay mọi cụm giới từ (of..., in..., for..., along with..., as well as...) chen giữa Chủ ngữ và Động từ — động từ LUÔN chia theo Danh từ chính đứng TRƯỚC giới từ đầu tiên!",
    "formula": "N1 + Prep + N2 -> V chia theo N1  |  S1, along with/as well as + S2 -> V chia theo S1  |  V-ing / To-V / Mệnh đề (S) -> V số ít",
    "summary": "ETS rất thích kéo dài chủ ngữ bằng cụm giới từ (of/in/with) hoặc cụm phụ (along with, together with) để đánh lạc hướng thí sinh. Chỉ cần tìm đúng danh từ hạt nhân đứng đầu là bạn chia động từ chuẩn 100%.",
    "theorySections": [
      {
        "heading": "1. Quy tắc cắt cụm giới từ & Cụm bổ sung (along with / as well as)",
        "bullets": [
          "Cấu trúc [N1 + of/in/at/for/with + N2]: Động từ chia theo N1 (The quality of the imported components IS outstanding — chia theo quality, không theo components).",
          "Các cụm nối phụ: along with, together with, as well as, in addition to, accompanied by KHÔNG làm chủ ngữ thành số nhiều — động từ luôn chia theo S1 đứng trước.",
          "Ngoại lệ PHẦN TRĂM / PHÂN SỐ / ALL / SOME / MOST + of + N: Động từ chia theo danh từ đứng SAU of (Half of the budget IS spent; Half of the employees ARE absent)."
        ]
      },
      {
        "heading": "2. Chủ ngữ là V-ing, To-V, Mệnh đề danh ngữ hoặc Tên tổ chức",
        "bullets": [
          "Chủ ngữ là Danh động từ (Managing multiple overseas accounts), To-V hoặc Mệnh đề That/What -> LUÔN chia Động từ SỐ ÍT (requires, is, has).",
          "Tên công ty, tổ chức, báo cáo, môn học/lĩnh vực tận cùng bằng -s (Economics, Logistics, Electronics, News, Global Dynamics) -> chia Động từ SỐ ÍT.",
          "Với cấu trúc There is/are + N: động từ chia theo danh từ đứng NGAY SAU chỗ trống (There are several openings)."
        ]
      }
    ],
    "examples": [
      {
        "en": "The director of marketing, along with two regional coordinators, <b>is</b> attending the trade expo in Milan.",
        "vi": "Giám đốc tiếp thị cùng với hai điều phối viên khu vực đang tham dự hội chợ thương mại tại Milan.",
        "note": "Cụm along with two regional coordinators chỉ là thành phần phụ -> chia số ít is theo The director."
      },
      {
        "en": "Implementing automated barcode scanners across all warehouses <b>reduces</b> sorting errors by half.",
        "vi": "Việc triển khai máy quét mã vạch tự động trên toàn bộ các kho giúp giảm một nửa lỗi phân loại.",
        "note": "Chủ ngữ là cụm danh động từ (Implementing...) -> luôn chia động từ số ít reduces (không chia theo warehouses)."
      },
      {
        "en": "Forty percent of the annual maintenance budget <b>has</b> already been allocated to elevator repairs.",
        "vi": "Bốn mươi phần trăm ngân sách bảo trì thường niên đã được phân bổ cho việc sửa chữa thang máy.",
        "note": "Sau phần trăm + of là danh từ không đếm được/số ít (budget) -> chia số ít has."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The list of approved travel reimbursements are posted on the intranet.",
        "right": "The list of approved travel reimbursements <b>is</b> posted on the intranet.",
        "exp": "Danh từ chính là The list (số ít), còn of approved travel reimbursements chỉ là cụm giới từ bổ nghĩa."
      },
      {
        "wrong": "Reviewing all client contracts thoroughly take considerable time.",
        "right": "Reviewing all client contracts thoroughly <b>takes</b> considerable time.",
        "exp": "Chủ ngữ là hành động V-ing (Reviewing...) nên động từ chính phải chia số ít (takes), không chia theo contracts."
      }
    ],
    "quiz": [
      {
        "q": "The cost of upgrading all factory cooling systems _____ far higher than the initial estimate.",
        "opts": [
          "were",
          "was",
          "are",
          "have been"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (was). Chủ ngữ hạt nhân đứng trước giới từ of là The cost (số ít) -> cần động từ số ít was (khớp ngữ cảnh đánh giá ban đầu). Loại A, C, D vì đều chia số nhiều."
      },
      {
        "q": "Ms. Bennett, together with three senior auditors from the London branch, _____ scheduled to arrive on Tuesday.",
        "opts": [
          "have been",
          "are",
          "were",
          "is"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (is). Cụm together with three senior auditors không làm chủ ngữ thành số nhiều; động từ chia theo S1 (Ms. Bennett - số ít) -> is. Loại B, C, A vì đều là số nhiều."
      },
      {
        "q": "Coordinating shipping schedules across twelve regional depots _____ strong organizational skills.",
        "opts": [
          "requires",
          "require",
          "are requiring",
          "have required"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (requires). Chủ ngữ là cụm danh động từ (Coordinating...) nên luôn đi với động từ số ít (requires). Đừng bị danh từ số nhiều depots đánh lừa! Loại B, C, D vì đều chia số nhiều."
      },
      {
        "q": "Nearly two-thirds of the survey respondents _____ expressed interest in the expanded remote-work policy.",
        "opts": [
          "has",
          "is",
          "have",
          "was"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (have). Với phân số + of + N (two-thirds of the survey respondents), động từ chia theo danh từ sau of (respondents - số nhiều) -> have expressed. Loại A, B, D vì đều chia số ít."
      },
      {
        "q": "According to the latest memo, there _____ several vacant parking spaces reserved for visiting clients in Lot B.",
        "opts": [
          "is",
          "are",
          "was",
          "has been"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (are). Trong cấu trúc There + be + N, động từ chia theo danh từ đứng sau là several vacant parking spaces (số nhiều) -> are. Loại A, C, D vì đều chia số ít."
      },
      {
        "q": "Horizon Logistics _____ announced plans to construct a cold-storage facility near the northern port.",
        "opts": [
          "have",
          "are",
          "were",
          "has"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (has). Horizon Logistics là tên riêng của MỘT công ty (dù từ Logistics có đuôi -s) -> luôn chia động từ số ít (has announced). Loại A, B, C vì đều chia số nhiều."
      }
    ]
  },
  {
    "id": "tg_15",
    "order": 15,
    "level": 2,
    "unitTitle": "Chặng 2 • Bị động, Hòa hợp S–V, To-V/V-ing & Liên từ (350–550)",
    "category": "Động từ",
    "partTag": "Part 5",
    "title": "Hòa hợp Chủ–Vị P2: either/neither, the/a number of & Đại từ bất định",
    "speedTip": "Mẹo 5 giây: A number of + N(nhiều) = Nhiều -> V SỐ NHIỀU; The number of + N(nhiều) = Con số -> V SỐ ÍT! Với either...or / neither...nor / not only...but also, chia động từ theo chủ ngữ GẦN ĐỘNG TỪ NHẤT (S2).",
    "formula": "Either S1 or S2 + V(theo S2)  |  A number of + N(s) + V(nhiều)  |  The number of + N(s) + V(ít)  |  Everyone/Each/Every + V(ít)",
    "summary": "Đây là 3 nhóm công thức hòa hợp Chủ–Vị có tần suất ra thi cao nhất ở mức 450–650 điểm TOEIC. Thuộc lòng mẹo phân biệt A/The number of, quy tắc gần nhất (S2) và nhóm đại từ bất định giúp bạn không bao giờ mắc bẫy.",
    "theorySections": [
      {
        "heading": "1. Quy tắc chia theo S2 (Chủ ngữ gần động từ nhất)",
        "bullets": [
          "Áp dụng cho: Either S1 or S2, Neither S1 nor S2, Not only S1 but also S2, S1 or S2.",
          "Ví dụ: Neither the manager nor the technicians WERE notified (chia số nhiều theo technicians). Ngược lại: Neither the technicians nor the manager WAS notified (chia số ít theo manager).",
          "Lưu ý: Both S1 and S2 LUÔN chia động từ SỐ NHIỀU."
        ]
      },
      {
        "heading": "2. A number of vs The number of & Đại từ bất định",
        "bullets": [
          "A number of + N số nhiều (= nhiều...) -> Động từ SỐ NHIỀU (A number of flights WERE delayed).",
          "The number of + N số nhiều (= số lượng của...) -> Động từ SỐ ÍT (The number of applicants HAS doubled).",
          "Đại từ bất định (-one, -body, -thing: everyone, anyone, someone, nobody, everything, nothing) và Each / Every / One of the + N(s) -> LUÔN chia Động từ SỐ ÍT.",
          "Cẩn thận: Several, Both, Many, Few, Others -> luôn chia Số nhiều."
        ]
      }
    ],
    "examples": [
      {
        "en": "<b>The number of</b> online registrations for the autumn seminar <b>has</b> exceeded all projections.",
        "vi": "Số lượng lượt đăng ký trực tuyến cho hội thảo mùa thu đã vượt mọi dự báo.",
        "note": "The number of + N số nhiều (registrations) -> chủ ngữ chính là The number -> chia số ít has."
      },
      {
        "en": "<b>A number of</b> local retailers <b>have</b> agreed to sponsor the downtown charity run.",
        "vi": "Nhiều nhà bán lẻ địa phương đã đồng ý tài trợ cho giải chạy từ thiện khu trung tâm.",
        "note": "A number of (= many) + N số nhiều (retailers) -> chia số nhiều have."
      },
      {
        "en": "Neither the branch supervisors nor the regional vice president <b>was</b> informed of the server outage.",
        "vi": "Cả các giám sát chi nhánh lẫn phó chủ tịch khu vực đều không được thông báo về sự cố máy chủ.",
        "note": "Neither...nor chia theo S2 gần động từ nhất: the regional vice president (số ít) -> was."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The number of full-time employees at the Seattle plant have risen by 15 percent.",
        "right": "The number of full-time employees at the Seattle plant <b>has</b> risen by 15 percent.",
        "exp": "The number of nhấn mạnh vào 'con số' (số ít), nên bắt buộc dùng has thay vì have."
      },
      {
        "wrong": "Everyone in the engineering and design divisions are required to attend the briefing.",
        "right": "Everyone in the engineering and design divisions <b>is</b> required to attend the briefing.",
        "exp": "Đại từ bất định Everyone luôn là chủ ngữ số ít bất kể cụm giới từ phía sau có bao nhiêu bộ phận."
      }
    ],
    "quiz": [
      {
        "q": "The number of international visitors attending our annual trade show _____ grown steadily since 2021.",
        "opts": [
          "has",
          "have",
          "are",
          "were"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (has). Cấu trúc The number of + N số nhiều luôn chia động từ số ít; kết hợp dấu hiệu since 2021 -> Hiện tại hoàn thành số ít has grown. Loại B, C, D vì đều chia số nhiều."
      },
      {
        "q": "A number of experienced technicians _____ volunteered to work overtime to finish the installation.",
        "opts": [
          "has",
          "is",
          "have",
          "was"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (have). Cấu trúc A number of + N số nhiều (nhiều kỹ thuật viên) luôn đi với động từ số nhiều -> have volunteered. Loại A, B, D vì đều chia số ít."
      },
      {
        "q": "Neither the marketing proposal nor the revised budget charts _____ ready for today's board review.",
        "opts": [
          "is",
          "was",
          "has been",
          "are"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (are). Với Neither S1 nor S2, động từ chia theo S2 gần nhất là the revised budget charts (số nhiều) kết hợp today -> are. Loại A, B, C vì đều chia số ít."
      },
      {
        "q": "Either the regional warehouse or the downtown distribution office _____ responsible for processing warranty returns.",
        "opts": [
          "are",
          "is",
          "were",
          "have been"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (is). Với Either S1 or S2, động từ chia theo S2 (the downtown distribution office - số ít) -> is. Loại A, C, D vì chia số nhiều."
      },
      {
        "q": "Everything inside the newly delivered shipping crates _____ inspected by customs officials earlier today.",
        "opts": [
          "were",
          "are",
          "was",
          "have been"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (was). Đại từ bất định Everything luôn chia động từ số ít, kết hợp earlier today -> bị động quá khứ đơn số ít was inspected. Loại A, B, D vì đều chia số nhiều."
      },
      {
        "q": "One of the main advantages of switching to cloud accounting _____ real-time expense visibility.",
        "opts": [
          "is",
          "are",
          "were",
          "have been"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (is). Cấu trúc One of the + N số nhiều (advantages) luôn có chủ ngữ chính là One (một trong những) -> động từ số ít is. Loại B, C, D vì đều chia số nhiều."
      }
    ]
  },
  {
    "id": "tg_16",
    "order": 16,
    "level": 2,
    "unitTitle": "Chặng 2 • Bị động, Hòa hợp S–V, To-V/V-ing & Liên từ (350–550)",
    "category": "Động từ",
    "partTag": "Part 5–6",
    "title": "Động từ khuyết thiếu (must/should/may/can) & Bị động Modal",
    "speedTip": "Mẹo 5 giây: Sau Modal (must, should, may, might, can, could, will, would) LUÔN là V-nguyên mẫu (không to, không -s, không -ing). Nếu sau chỗ trống không có tân ngữ -> chọn ngay Bị động Modal: Modal + be + V3.",
    "formula": "Chủ động: S + Modal + (Adv) + V-bare  |  Bị động: S + Modal + (Adv) + be + V3/V-ed",
    "summary": "Động từ khuyết thiếu xuất hiện dày đặc trong nội quy công ty, thư nhắc nhở và hướng dẫn sử dụng TOEIC. Bạn cần nắm vững 2 dạng chủ động/bị động sau Modal và sắc thái nghĩa lịch sự hay bắt buộc của từng từ.",
    "theorySections": [
      {
        "heading": "1. Quy tắc cấu trúc bất biến sau Động từ khuyết thiếu",
        "bullets": [
          "Chủ động: Modal + V-bare (KHÔNG chia theo chủ ngữ số ít, KHÔNG thêm to: He must submit, KHÔNG viết must submits hay must to submit).",
          "Bị động: Modal + be + V3/V-ed (All badges must be worn visibly; Receipts should be attached).",
          "Nếu có trạng từ xen giữa, trạng từ đặt ngay sau Modal: must strictly follow / should immediately be reported."
        ]
      },
      {
        "heading": "2. Sắc thái nghĩa chuẩn công sở TOEIC (Part 5–6)",
        "bullets": [
          "must / have to: Nghĩa vụ bắt buộc theo quy định (must not = bị cấm; don't have to = không cần thiết).",
          "should / ought to: Lời khuyên, khuyến nghị hợp lý (Applicants should arrive 15 minutes early).",
          "may / might / could: Sự cho phép trang trọng (Visitors may park in Lot C) hoặc khả năng có thể xảy ra (Shipments may be delayed due to weather).",
          "should have + V3 (nên đã làm nhưng thực tế chưa làm) vs must have + V3 (chắc hẳn đã xảy ra trong quá khứ)."
        ]
      }
    ],
    "examples": [
      {
        "en": "All reimbursement claims <b>must be accompanied</b> by itemized receipts from the vendor.",
        "vi": "Tất cả yêu cầu hoàn trả chi phí phải được đính kèm hóa đơn chi tiết từ nhà cung cấp.",
        "note": "Bị động với động từ khuyết thiếu: must + be + V3 (accompanied), theo sau là giới từ by."
      },
      {
        "en": "Registered guests <b>may</b> use the executive business center free of charge until 10:00 P.M.",
        "vi": "Khách đã đăng ký được phép sử dụng trung tâm thương mại cao cấp miễn phí cho đến 10 giờ tối.",
        "note": "May diễn tả sự cho phép trang trọng trong thông báo khách sạn/văn phòng; theo sau là V-bare use."
      },
      {
        "en": "Because the server migration is complex, minor interruptions <b>might occur</b> overnight.",
        "vi": "Vì quá trình chuyển đổi máy chủ khá phức tạp, các gián đoạn nhỏ có thể xảy ra qua đêm.",
        "note": "Occur là nội động từ (không chia bị động) -> đi dạng chủ động might occur."
      }
    ],
    "pitfalls": [
      {
        "wrong": "Visitors must to sign in at the front security counter before entering.",
        "right": "Visitors <b>must sign in</b> at the front security counter before entering.",
        "exp": "Sau must đi thẳng với động từ nguyên mẫu không to (sign in), không dùng must to."
      },
      {
        "wrong": "Any defective merchandise can return to the nearest retail outlet within 14 days.",
        "right": "Any defective merchandise <b>can be returned</b> to the nearest retail outlet within 14 days.",
        "exp": "Hàng hóa bị lỗi phải 'được trả lại' (và sau chỗ trống là giới từ to, không có tân ngữ) -> bị động can be returned."
      }
    ],
    "quiz": [
      {
        "q": "Requests for paid vacation leave must _____ at least two weeks prior to the intended departure date.",
        "opts": [
          "submit",
          "submitting",
          "have submitted",
          "be submitted"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (be submitted). Chủ ngữ Requests (các đơn xin nghỉ) là vật và phía sau không có tân ngữ -> dùng bị động Modal: must + be + V3 (be submitted). Loại A, B, C vì đều là dạng chủ động."
      },
      {
        "q": "Employees who lose their security access cards should immediately _____ the facilities office.",
        "opts": [
          "notifies",
          "notify",
          "to notify",
          "notifying"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (notify). Sau should (+ trạng từ immediately) và có tân ngữ phía sau (the facilities office) -> cần động từ nguyên mẫu chủ động notify. Loại A (chia -s), C (thừa to) và D (V-ing)."
      },
      {
        "q": "Guests staying on the executive floor _____ request complimentary airport shuttle service at the concierge desk.",
        "opts": [
          "ought",
          "must to",
          "may",
          "have"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (may). May diễn tả quyền lợi/sự cho phép lịch sự và đi trực tiếp với động từ nguyên mẫu request. Loại B (sai cấu trúc must to), A và D (ought và have đều thiếu to)."
      },
      {
        "q": "Due to severe coastal winds, several ferry departures along the northern route _____ be rescheduled.",
        "opts": [
          "might",
          "are",
          "have",
          "were"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (might). Phía sau chỗ trống là be rescheduled (nguyên mẫu be + V3) -> bắt buộc điền một động từ khuyết thiếu (might: có thể). Loại B, D (are/were không đứng trước be nguyên mẫu) và C (have đi với been)."
      },
      {
        "q": "Confidential client spreadsheets _____ never be downloaded onto personal unencrypted flash drives.",
        "opts": [
          "have",
          "need to be",
          "ought",
          "must"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (must). Phía sau có never + be downloaded -> chỉ có modal verb must ghép thành must never be downloaded (tuyệt đối không được tải xuống). Loại A, C (thiếu to) và B (thừa be)."
      },
      {
        "q": "The courier company _____ have misplaced the original parcel, because the tracking log shows no scan since Monday.",
        "opts": [
          "ought",
          "must",
          "should to",
          "has"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (must). Cấu trúc must have + V3 diễn tả sự suy đoán có cơ sở chắc chắn về sự việc trong quá khứ (chắc hẳn đã làm thất lạc). Loại A (ought cần to), C (sai ngữ pháp should to) và D (has không đứng trước have nguyên mẫu)."
      }
    ]
  },
  {
    "id": "tg_17",
    "order": 17,
    "level": 2,
    "unitTitle": "Chặng 2 • Bị động, Hòa hợp S–V, To-V/V-ing & Liên từ (350–550)",
    "category": "Động từ",
    "partTag": "Part 5",
    "title": "Động từ nguyên mẫu To-V trong tiếng Anh thương mại",
    "speedTip": "Mẹo 5 giây: Thấy nhóm động từ kế hoạch/quyết định (plan, decide, agree, promise, refuse, fail, attempt, afford, aim, seek) hoặc cấu trúc [encourage / ask / remind / advise / require / enable + O + _____] -> chọn ngay To-V!",
    "formula": "V + to-V  |  V + O + to-V  |  (In order) to + V (chỉ mục đích)  |  Adj + to-V (eager/eligible/unable to V)",
    "summary": "Động từ nguyên mẫu có 'to' (To-V) xuất hiện cực nhiều trong văn bản thương mại TOEIC: diễn tả mục đích hành động, đi sau động từ yêu cầu/kế hoạch và theo sau các tính từ/danh từ quen thuộc.",
    "theorySections": [
      {
        "heading": "1. Nhóm động từ thương mại đi trực tiếp với To-V",
        "bullets": [
          "V + to-V (không tân ngữ): agree, aim, attempt, decide, expect, fail, intend, manage, offer, plan, promise, refuse, seek, strive, tend, afford, hesitate.",
          "V + O + to-V (yêu cầu/khuyến khích ai làm gì): advise, allow, ask, authorize, enable, encourage, expect, invite, permit, persuade, remind, require, urge.",
          "Khi nhóm V + O + to-V chuyển sang Bị động, vẫn giữ nguyên to-V phía sau: Staff are required to wear badges / Guests are encouraged to register online."
        ]
      },
      {
        "heading": "2. To-V chỉ mục đích, sau Tính từ & sau Danh từ",
        "bullets": [
          "To-V / In order to V / So as to V đầu câu hoặc cuối câu mang nghĩa 'để làm gì' (To reduce energy costs, the plant installed LED lights).",
          "Tính từ + to-V cực hay thi: be eligible to V (đủ điều kiện), be able/unable to V, be pleased/delighted to V, be eager to V, be reluctant to V, be likely to V.",
          "Danh từ + to-V cố định: ability to V, opportunity to V, decision to V, effort to V, right to V, attempt to V."
        ]
      }
    ],
    "examples": [
      {
        "en": "<b>To minimize</b> disruption during office hours, the IT upgrade will begin at 11:00 P.M.",
        "vi": "Để giảm thiểu gián đoạn trong giờ làm việc, việc nâng cấp CNTT sẽ bắt đầu lúc 11 giờ đêm.",
        "note": "To-V đứng đầu câu trước dấu phẩy chỉ mục đích (= In order to minimize)."
      },
      {
        "en": "The updated policy enables remote associates <b>to access</b> client files securely from home.",
        "vi": "Chính sách mới cho phép nhân viên làm việc từ xa truy cập hồ sơ khách hàng an toàn tại nhà.",
        "note": "Cấu trúc cố định: enable + O (remote associates) + to-V (to access)."
      },
      {
        "en": "Full-time employees are eligible <b>to enroll</b> in the company's tuition assistance program.",
        "vi": "Nhân viên toàn thời gian đủ điều kiện đăng ký chương trình hỗ trợ học phí của công ty.",
        "note": "Tính từ eligible luôn đi với to-V (eligible to V) hoặc giới từ for + N (eligible for N)."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The supervisor reminded all technicians checking the pressure gauges before noon.",
        "right": "The supervisor reminded all technicians <b>to check</b> the pressure gauges before noon.",
        "exp": "Remind + O luôn đi với to-V (nhắc nhở ai làm gì), không đi với V-ing."
      },
      {
        "wrong": "For improve customer retention, the store launched a digital loyalty card.",
        "right": "<b>To improve</b> (hoặc <b>In order to improve</b>) customer retention, the store launched a digital loyalty card.",
        "exp": "Không dùng For + V nguyên mẫu để chỉ mục đích; phải dùng To-V (hoặc For + N / For + V-ing khi mô tả công dụng vật)."
      }
    ],
    "quiz": [
      {
        "q": "_____ the growing demand for organic snacks, Sunbelt Foods has acquired a second packaging facility.",
        "opts": [
          "Meet",
          "Meeting",
          "To meet",
          "Met"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (To meet). Đầu câu cần cụm động từ nguyên mẫu chỉ mục đích (Để đáp ứng nhu cầu ngày càng tăng...). Loại A (động từ nguyên mẫu không to đứng đầu câu sai), B (V-ing chỉ sự việc đồng thời không hợp nghĩa mục đích ở đây) và D (V-ed bị động sai vì có tân ngữ the growing demand)."
      },
      {
        "q": "The regional director encouraged every branch manager _____ innovative cost-saving measures.",
        "opts": [
          "to propose",
          "proposing",
          "propose",
          "proposed"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (to propose). Cấu trúc chuẩn ETS: encourage + O (every branch manager) + to-V. Loại C (thiếu to), B (V-ing) và D (V-ed)."
      },
      {
        "q": "After reviewing the technical specifications, the contractor agreed _____ the lobby lighting at no extra charge.",
        "opts": [
          "replacing",
          "to replace",
          "replaced",
          "replacement"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (to replace). Động từ agree luôn đi trực tiếp với to-V (agree to V: đồng ý làm gì). Loại A (V-ing), C (quá khứ) và D (danh từ)."
      },
      {
        "q": "Members who renew their annual subscriptions before Friday are eligible _____ a complimentary consultation.",
        "opts": [
          "receive",
          "receiving",
          "received",
          "to receive"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (to receive). Cấu trúc cố định: be eligible to + V-bare (đủ điều kiện để làm gì). Loại A (thiếu to), B (V-ing) và C (V-ed)."
      },
      {
        "q": "The new cloud dashboard allows project leads _____ inventory levels across all stores in real time.",
        "opts": [
          "to monitor",
          "monitoring",
          "monitor",
          "monitored"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (to monitor). Cấu trúc allow + O (project leads) + to-V (cho phép ai làm gì). Loại C (thiếu to), B (allow + V-ing chỉ dùng khi KHÔNG có tân ngữ người) và D (V-ed)."
      },
      {
        "q": "Despite tight deadlines, the legal team managed _____ the international licensing contract ahead of schedule.",
        "opts": [
          "finalize",
          "finalizing",
          "to finalize",
          "finalization"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (to finalize). Manage + to-V mang nghĩa xoay xở/thành công làm được việc khó khăn gì. Loại A (thiếu to), B (V-ing) và D (danh từ)."
      }
    ]
  },
  {
    "id": "tg_18",
    "order": 18,
    "level": 2,
    "unitTitle": "Chặng 2 • Bị động, Hòa hợp S–V, To-V/V-ing & Liên từ (350–550)",
    "category": "Động từ",
    "partTag": "Part 5",
    "title": "Danh động từ V-ing & Cụm bẫy to + V-ing",
    "speedTip": "Mẹo 5 giây: Ngay sau MỌI giới từ (by, of, in, for, without, prior to, instead of) + có tân ngữ phía sau -> chọn V-ing! Đặc biệt thuộc 5 cụm bẫy có chữ 'to' nhưng là GIỚI TỪ nên theo sau PHẢI LÀ V-ing: look forward to, be dedicated/committed to, object to, be accustomed/used to, contribute to.",
    "formula": "Prep + V-ing + O  |  V(avoid/consider/postpone/recommend/suggest/finish) + V-ing  |  look forward to / committed to + V-ing",
    "summary": "Bẫy V-ing vs Danh từ và bẫy 'giới từ to + V-ing' là món tủ của ra đề ETS. Nắm chắc sự khác biệt giữa V-ing (giữ tân ngữ phía sau) với Danh từ thuần (không kéo tân ngữ trực tiếp) và bộ động từ bắt buộc theo sau bởi V-ing.",
    "theorySections": [
      {
        "heading": "1. Nhóm động từ thương mại BẮT BUỘC đi với V-ing",
        "bullets": [
          "Bộ 12 động từ vàng TOEIC + V-ing: avoid, consider, delay, postpone, discontinue, enjoy, finish, keep, mind, recommend, suggest, involve.",
          "Ví dụ: The committee is considering relocating the headquarters (KHÔNG viết considering to relocate).",
          "Lưu ý cặp đặc biệt: remember/forget + to-V (nhớ/quên PHẢI làm) vs + V-ing (nhớ/quên ĐÃ làm); stop + to-V (dừng lại ĐỂ làm) vs + V-ing (ngừng hẳn việc đang làm)."
        ]
      },
      {
        "heading": "2. Cụm bẫy 'to + V-ing' & Mẹo phân biệt V-ing vs Danh từ sau Giới từ",
        "bullets": [
          "Các cụm 'to' là GIỚI TỪ nên đi với V-ing / N: look forward to, be dedicated to, be committed to, be devoted to, object to, be accustomed/used to, contribute to, prior to, in addition to, with a view to.",
          "Cụm đặc biệt + V-ing: have difficulty/trouble (in) + V-ing, spend time/money + V-ing, be worth + V-ing, be busy + V-ing.",
          "MẸO SO SÁNH [Prep + V-ing + O] vs [Prep + N + Prep]: Nếu SAU chỗ trống có tân ngữ trực tiếp (by _____ the costs) -> chọn V-ing (reducing), KHÔNG chọn danh từ (reduction) vì danh từ không kéo tân ngữ trực tiếp!"
        ]
      }
    ],
    "examples": [
      {
        "en": "We look forward to <b>welcoming</b> all regional partners to our annual summit in Osaka.",
        "vi": "Chúng tôi mong chờ được chào đón tất cả đối tác khu vực đến hội nghị thường niên tại Osaka.",
        "note": "To trong look forward to là giới từ -> bắt buộc theo sau bằng V-ing (welcoming), không dùng welcome."
      },
      {
        "en": "The board is seriously considering <b>expanding</b> its delivery network into neighboring provinces.",
        "vi": "Hội đồng quản trị đang cân nhắc nghiêm túc việc mở rộng mạng lưới giao hàng sang các tỉnh lân cận.",
        "note": "Consider luôn đi với danh động từ V-ing (expanding)."
      },
      {
        "en": "The plant lowered operating expenses by <b>upgrading</b> its outdated ventilation equipment.",
        "vi": "Nhà máy đã giảm chi phí vận hành bằng cách nâng cấp hệ thống thông gió cũ kỹ.",
        "note": "Sau giới từ by và trước tân ngữ trực tiếp its outdated ventilation equipment -> phải chọn V-ing (upgrading), không chọn danh từ upgrade."
      }
    ],
    "pitfalls": [
      {
        "wrong": "Our firm is committed to deliver eco-friendly packaging solutions.",
        "right": "Our firm is committed to <b>delivering</b> eco-friendly packaging solutions.",
        "exp": "Be committed to + V-ing (cam kết làm gì) vì to ở đây là giới từ."
      },
      {
        "wrong": "The contractor recommended to postpone the roof inspection until Friday.",
        "right": "The contractor recommended <b>postponing</b> the roof inspection until Friday.",
        "exp": "Recommend + V-ing (khi không có tân ngữ người hoặc mệnh đề that), không dùng recommend + to-V."
      }
    ],
    "quiz": [
      {
        "q": "The hospitality group is dedicated to _____ personalized travel experiences for corporate clients.",
        "opts": [
          "provide",
          "providing",
          "provided",
          "provision"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (providing). Cụm bẫy kinh điển: be dedicated to + V-ing (tận tâm làm gì), hơn nữa sau chỗ trống có tân ngữ trực tiếp personalized travel experiences nên phải dùng V-ing chứ không dùng danh từ D (provision). Loại A (V-bare) và C (V-ed)."
      },
      {
        "q": "Due to supply shortages, the manufacturer decided to postpone _____ the new smartwatch until October.",
        "opts": [
          "release",
          "to release",
          "released",
          "releasing"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (releasing). Động từ postpone (trì hoãn) bắt buộc đi với danh động từ V-ing (postpone releasing). Loại A (nguyên mẫu), B (to-V) và C (V-ed)."
      },
      {
        "q": "The accounting team improved quarterly accuracy by _____ all vendor invoices digitally.",
        "opts": [
          "archiving",
          "archive",
          "archives",
          "archival"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (archiving). Sau giới từ by và trước tân ngữ trực tiếp all vendor invoices cần danh động từ V-ing (archiving) để giữ được tân ngữ. Loại B (động từ nguyên mẫu), C (danh từ số nhiều) và D (tính từ)."
      },
      {
        "q": "Ms. Al-Mansoor looks forward to _____ with your engineering staff on the upcoming bridge project.",
        "opts": [
          "collaborate",
          "collaborated",
          "collaborating",
          "collaboration"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (collaborating). Cụm cố định look forward to + V-ing (mong đợi làm việc cùng ai). Loại A (bẫy V-bare sau to), B (V-ed) và D (collaboration đi với with vẫn kém tự nhiên bằng V-ing chỉ hành động sắp hợp tác cùng đội kỹ sư trong ngữ cảnh ETS)."
      },
      {
        "q": "Several neighborhood residents objected to _____ a twenty-four-hour freight terminal near the park.",
        "opts": [
          "build",
          "building",
          "to build",
          "built"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (building). Cụm bẫy object to + V-ing (phản đối việc làm gì) vì to là giới từ. Loại A, C, D vì sai dạng động từ sau giới từ to."
      },
      {
        "q": "To avoid _____ duplicate payments, please verify each purchase order number before authorizing the wire transfer.",
        "opts": [
          "issue",
          "to issue",
          "issued",
          "issuing"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (issuing). Động từ avoid (tránh) luôn đi trực tiếp với V-ing (avoid issuing). Loại A (nguyên mẫu), B (to-V) và C (V-ed)."
      }
    ]
  },
  {
    "id": "tg_19",
    "order": 19,
    "level": 2,
    "unitTitle": "Chặng 2 • Bị động, Hòa hợp S–V, To-V/V-ing & Liên từ (350–550)",
    "category": "Từ loại",
    "partTag": "Part 5",
    "title": "Phân từ tính từ: V-ing (chủ động) vs V-ed (bị động)",
    "speedTip": "Mẹo 5 giây: Xét danh từ được bổ nghĩa! Nếu danh từ TỰ GÂY RA cảm xúc / hành động chủ động -> chọn V-ing (a growing market, an encouraging report). Nếu danh từ BỊ TÁC ĐỘNG / CẢM NHẬN cảm xúc -> chọn V-ed (a revised schedule, satisfied customers).",
    "formula": "V-ing (gây ra / đang diễn ra / chủ động) + N  |  V-ed (bị tác động / đã hoàn tất / cảm xúc của người) + N",
    "summary": "Phân từ tính từ (V-ing vs V-ed) xuất hiện đều đặn 2–3 câu mỗi đề TOEIC Part 5. Chỉ cần phân biệt đúng mối quan hệ chủ động/bị động giữa phân từ và danh từ đi kèm — kèm một số cặp cực hay thi — là bạn chốt điểm dễ dàng.",
    "theorySections": [
      {
        "heading": "1. Quy tắc 2 nhóm Phân từ tính từ chuẩn ETS",
        "bullets": [
          "Nhóm Cảm xúc (interest, satisfy, please, disappoint, excite, confuse, impress, exhaust): Dùng V-ed cho NGƯỜI cảm nhận (satisfied clients, impressed investors) và V-ing cho VẬT/SỰ VIỆC gây ra cảm xúc (an impressive presentation, disappointing figures).",
          "Nhóm Trạng thái/Hành động trước Danh từ: Dùng V-ing khi danh từ mang nghĩa chủ động/đang diễn ra (growing demand, rising costs, upcoming conference, remaining balance, existing clients).",
          "Dùng V-ed khi danh từ mang nghĩa bị động/đã được xử lý (revised contract, attached file, damaged goods, qualified applicant, designated area, completed form)."
        ]
      },
      {
        "heading": "2. Bẫy kinh điển: Tính từ phân từ đứng sau Linking Verb & Danh từ",
        "bullets": [
          "Be pleased/satisfied/impressed/disappointed + with/by + N (chỉ cảm xúc của người: The clients were pleased with the speed).",
          "Phân biệt cực hay thi: enclosed/attached document (tài liệu được đính kèm), proposed budget (ngân sách được đề xuất), detailed report (báo cáo chi tiết) vs challenging task (nhiệm vụ đầy thách thức), promising results (kết quả đầy hứa hẹn)."
        ]
      }
    ],
    "examples": [
      {
        "en": "Please review the <b>attached</b> invoice and confirm that all billing details are accurate.",
        "vi": "Vui lòng xem lại hóa đơn được đính kèm và xác nhận mọi chi tiết thanh toán đều chính xác.",
        "note": "Hóa đơn 'được đính kèm' (bị động) -> dùng quá khứ phân từ attached, không dùng attaching."
      },
      {
        "en": "The firm hired additional software engineers to keep up with <b>growing</b> demand in Asia.",
        "vi": "Công ty đã tuyển thêm kỹ sư phần mềm để theo kịp nhu cầu đang tăng trưởng tại châu Á.",
        "note": "Nhu cầu 'tự tăng lên' (chủ động/đang tiếp diễn) -> dùng hiện tại phân từ growing."
      },
      {
        "en": "Most attendees were deeply <b>impressed</b> by the keynote speaker's practical case studies.",
        "vi": "Hầu hết người tham dự đều hết sức ấn tượng trước các tình huống thực tế của diễn giả chính.",
        "note": "Attendees là người chịu tác động cảm xúc (bị ấn tượng bởi...) -> chọn V-ed impressed."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The revising policy on remote work will take effect next Monday.",
        "right": "The <b>revised</b> policy on remote work will take effect next Monday.",
        "exp": "Chính sách 'được chỉnh sửa' (bị động) nên phải dùng V-ed revised, không dùng revising."
      },
      {
        "wrong": "The quarterly sales report contained several encouraged trends.",
        "right": "The quarterly sales report contained several <b>encouraging</b> trends.",
        "exp": "Các xu hướng 'mang tính khích lệ/đáng mừng' (tự gây cảm xúc tích cực) nên dùng V-ing encouraging."
      }
    ],
    "quiz": [
      {
        "q": "All visitors must park their vehicles in the _____ spaces near the west entrance.",
        "opts": [
          "designated",
          "designating",
          "designate",
          "designation"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (designated). Chỗ đỗ xe 'được chỉ định' (bị động) -> chọn quá khứ phân từ tính từ designated (designated spaces). Loại C (động từ), B (V-ing chủ động) và D (danh từ)."
      },
      {
        "q": "Shareholders were pleased with the _____ quarterly earnings announced by the chief financial officer.",
        "opts": [
          "encourage",
          "encouraged",
          "encouraging",
          "encouragement"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (encouraging). Doanh thu quý 'mang lại sự khích lệ/đáng mừng' (gây cảm xúc) -> dùng V-ing encouraging. Loại B (encouraged dùng cho người được khích lệ), A (động từ) và D (danh từ)."
      },
      {
        "q": "Please sign the _____ agreement and return a scanned copy to the legal office by Thursday.",
        "opts": [
          "enclose",
          "enclosing",
          "enclosure",
          "enclosed"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (enclosed). Bản hợp đồng 'được gửi kèm theo' (bị động) -> dùng V-ed enclosed (the enclosed agreement). Loại A (động từ), B (V-ing) và C (danh từ)."
      },
      {
        "q": "Rapidly _____ fuel prices have forced many regional carriers to adjust their freight surcharges.",
        "opts": [
          "rise",
          "rising",
          "risen",
          "rose"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (rising). Rise là nội động từ nên khi dùng làm tính từ chỉ giá cả 'đang tăng lên' luôn dùng V-ing rising (rising fuel prices). Loại A (V-bare), C (V3) và D (V2)."
      },
      {
        "q": "The board was visibly _____ with the contractor's inability to resolve the acoustic defects.",
        "opts": [
          "disappoint",
          "disappointing",
          "disappointed",
          "disappointment"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (disappointed). The board (hội đồng gồm con người) là chủ thể cảm nhận cảm xúc 'bị thất vọng về...' -> dùng V-ed disappointed + with. Loại B (dùng cho vật gây thất vọng), A (động từ) và D (danh từ)."
      },
      {
        "q": "All _____ balances on corporate travel accounts must be settled before the fiscal year closes.",
        "opts": [
          "remaining",
          "remain",
          "remained",
          "remainder"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (remaining). Remain là nội động từ nên tính từ mang nghĩa 'còn lại' luôn dùng V-ing remaining (remaining balances: số dư còn lại). Loại B (động từ), C (sai vì remain không dùng V-ed tính từ) và D (danh từ)."
      }
    ]
  },
  {
    "id": "tg_20",
    "order": 20,
    "level": 2,
    "unitTitle": "Chặng 2 • Bị động, Hòa hợp S–V, To-V/V-ing & Liên từ (350–550)",
    "category": "So sánh",
    "partTag": "Part 5",
    "title": "So sánh Bằng, So sánh Hơn & Từ nhấn mạnh (much/far/even)",
    "speedTip": "Mẹo 5 giây: Thấy THAN phía sau -> chọn So sánh Hơn (-er / more + Adj/Adv); thấy AS ... AS -> chọn dạng nguyên thể (không -er, không more). Đặc biệt: đứng TRƯỚC so sánh hơn chỉ được dùng much / far / even / still / a lot / slightly — TUYỆT ĐỐI loại VERY và SO!",
    "formula": "Bằng: as + Adj/Adv + as  |  Hơn: Adj-er / more + Adj/Adv + than  |  Nhấn mạnh: much / far / even / significantly + So sánh hơn",
    "summary": "Câu hỏi So sánh Bằng và So sánh Hơn trong TOEIC Part 5 cực kỳ đều đặn. Điểm ăn tiền nằm ở việc phân biệt chọn Tính từ hay Trạng từ giữa cặp as...as và nhớ bộ trạng từ nhấn mạnh trước so sánh hơn (loại bẫy very/too/more).",
    "theorySections": [
      {
        "heading": "1. So sánh Bằng (as ... as) & Bẫy chọn Tính từ vs Trạng từ",
        "bullets": [
          "Cấu trúc khẳng định: as + Adj/Adv + as; phủ định: not as/so + Adj/Adv + as.",
          "Mẹo chọn Adj hay Adv giữa as...as: Che hai chữ as đi và nhìn động từ phía trước! Sau be/seem/remain/become -> Tính từ (as reliable as); sau động từ thường (work, operate, respond) -> Trạng từ (as efficiently as).",
          "Cụm cố định: as soon as possible, twice as much/many as, as many as + số lượng."
        ]
      },
      {
        "heading": "2. So sánh Hơn & Bộ 6 từ nhấn mạnh 'vàng' (tránh bẫy VERY)",
        "bullets": [
          "Tính từ/Trạng từ ngắn (1 âm tiết hoặc 2 âm tiết đuôi -y): thêm -er (faster, lower, easier); từ dài: more/less + Adj/Adv (more affordable, more accurately).",
          "Bất quy tắc: good/well -> better; bad/badly -> worse; many/much -> more; little -> less; far -> farther/further (further information = thông tin thêm).",
          "Từ nhấn mạnh ĐƯỢC DÙNG trước So sánh hơn: much, far, even, still, a lot, slightly, significantly, considerably (much more efficient, far lower). TUYỆT ĐỐI KHÔNG dùng very, so, too, quite trước dạng so sánh hơn!"
        ]
      }
    ],
    "examples": [
      {
        "en": "The upgraded laser printer operates <b>far more quietly</b> than the previous office model.",
        "vi": "Máy in laser nâng cấp vận hành êm ái hơn nhiều so với mẫu văn phòng trước đây.",
        "note": "Bổ nghĩa cho động từ thường operates -> trạng từ more quietly; nhấn mạnh trước so sánh hơn dùng far (không dùng very)."
      },
      {
        "en": "Please submit the customs declaration <b>as promptly as</b> possible to avoid port fees.",
        "vi": "Vui lòng nộp tờ khai hải quan nhanh chóng nhất có thể để tránh phí cảng.",
        "note": "Động từ thường submit cần trạng từ promptly đặt giữa cặp as ... as."
      },
      {
        "en": "Maintenance costs for the new hybrid fleet are <b>significantly lower</b> than originally projected.",
        "vi": "Chi phí bảo trì cho đội xe hybrid mới thấp hơn đáng kể so với dự tính ban đầu.",
        "note": "Sau be (are) dùng tính từ so sánh hơn lower, được nhấn mạnh bằng trạng từ significantly."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The new warehouse is very larger than our old downtown storage unit.",
        "right": "The new warehouse is <b>much larger</b> (hoặc <b>far larger</b>) than our old downtown storage unit.",
        "exp": "Không bao giờ dùng very để nhấn mạnh cho so sánh hơn; phải thay bằng much, far, even hoặc significantly."
      },
      {
        "wrong": "The trainee completed the audit as accurate as the senior accountant.",
        "right": "The trainee completed the audit <b>as accurately as</b> the senior accountant.",
        "exp": "Che as...as đi, ta thấy bổ nghĩa cho động từ thường completed -> phải dùng trạng từ accurately, không dùng tính từ accurate."
      }
    ],
    "quiz": [
      {
        "q": "The redesigned customer portal loads _____ faster than the version launched two years ago.",
        "opts": [
          "very",
          "more",
          "so",
          "much"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (much). Phía sau chỗ trống đã có so sánh hơn faster nên chỉ chọn trạng từ nhấn mạnh so sánh hơn là much. Loại A, C (very/so không đứng trước so sánh hơn) và B (thừa more với faster)."
      },
      {
        "q": "All regional branches are expected to process warranty claims as _____ as the headquarters team.",
        "opts": [
          "efficient",
          "efficiently",
          "efficiency",
          "more efficiently"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (efficiently). Che cặp as...as đi, từ cần điền bổ nghĩa cho động từ thường process -> dùng trạng từ dạng nguyên thể efficiently. Loại A (tính từ), C (danh từ) và D (không dùng more trong cấu trúc as...as)."
      },
      {
        "q": "This year's energy conservation program achieved _____ greater savings than the committee had anticipated.",
        "opts": [
          "too",
          "very",
          "even",
          "most"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (even). Trước tính từ so sánh hơn greater cần trạng từ nhấn mạnh (even greater: thậm chí còn lớn hơn). Loại B, A (không đi với so sánh hơn) và D (most dùng cho so sánh nhất)."
      },
      {
        "q": "Because the supplier offers bulk discounts, ordering directly from the factory is _____ than buying through distributors.",
        "opts": [
          "more economical",
          "economical",
          "most economical",
          "as economical"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (more economical). Có dấu hiệu than phía sau và tính từ dài economical (sau động từ nối is) -> chọn so sánh hơn more economical. Loại B (nguyên thể), C (so sánh nhất) và D (as...as không đi với than)."
      },
      {
        "q": "If you require _____ details regarding the internship stipend, please contact the human resources office.",
        "opts": [
          "far",
          "more far",
          "furthest",
          "further"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (further). Cụm cố định TOEIC là further details / further information (thông tin thêm/chi tiết thêm). Loại A (nguyên thể), C (so sánh nhất) và B (sai dạng so sánh của far)."
      },
      {
        "q": "The newly hired graphic designer proved to be just as _____ as the agency's senior creative directors.",
        "opts": [
          "resourcefully",
          "resourceful",
          "resourcefulness",
          "more resourceful"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (resourceful). Sau động từ nối be (proved to be) và giữa cặp as...as cần tính từ dạng nguyên thể resourceful (tháo vát/nhiều ý tưởng). Loại A (trạng từ), C (danh từ) và D (không dùng more trong so sánh bằng)."
      }
    ]
  },
  {
    "id": "tg_21",
    "order": 21,
    "level": 2,
    "unitTitle": "Chặng 2 • Bị động, Hòa hợp S–V, To-V/V-ing & Liên từ (350–550)",
    "category": "So sánh",
    "partTag": "Part 5",
    "title": "So sánh Nhất & So sánh Kép",
    "speedTip": "Mẹo 5 giây: Thấy [the + _____] hoặc [sở hữu cách/tính từ sở hữu + _____] kèm phạm vi (in the region, of all, ever, in the company's history) -> chọn So sánh Nhất (-est / most); thấy [The + so sánh hơn..., the + so sánh hơn...] -> So sánh Kép.",
    "formula": "Nhất: the / one of the / our + Adj-est / most Adj (+ in/of/ever)  |  Kép: The + So sánh hơn + S1 + V1, the + So sánh hơn + S2 + V2",
    "summary": "So sánh Nhất (cực đại trong một tập hợp) và So sánh Kép (càng... càng...) là hai cấu trúc chốt điểm nhanh trong TOEIC Part 5. Chú ý đặc biệt ngoại lệ bỏ 'the' khi đã có tính từ sở hữu đứng trước so sánh nhất.",
    "theorySections": [
      {
        "heading": "1. So sánh Nhất (Superlatives) & Dấu hiệu nhận diện 5 giây",
        "bullets": [
          "Cấu trúc: the + Adj/Adv-est (từ ngắn) hoặc the + most/least + Adj/Adv (từ dài). Ví dụ: the fastest delivery, the most cost-effective solution.",
          "Dấu hiệu phạm vi cực hay gặp: in the industry, in the company's history, of all the candidates, among all branches, ever recorded, one of the + so sánh nhất + N số nhiều.",
          "Bẫy lược bỏ THE: Khi trước so sánh nhất ĐÃ CÓ tính từ sở hữu (our, its, their) hoặc sở hữu cách (the firm's), KHÔNG thêm the (our highest revenue, KHÔNG viết our the highest revenue)."
        ]
      },
      {
        "heading": "2. So sánh Kép (Double Comparatives) & Cụm nhấn mạnh so sánh nhất",
        "bullets": [
          "So sánh kép đồng tiến (Càng... càng...): The + so sánh hơn + S + V, the + so sánh hơn + S + V (The earlier you register, the lower the tuition fee will be).",
          "So sánh lũy tiến (Càng ngày càng...): Adj-er and Adj-er / more and more + Adj (Demand is becoming more and more competitive).",
          "Nhấn mạnh trước So sánh nhất: by far / easily / clearly + the + so sánh nhất (by far the most reliable supplier)."
        ]
      }
    ],
    "examples": [
      {
        "en": "The Solaris X5 is by far <b>the most durable</b> commercial coffee brewer in our catalog.",
        "vi": "Solaris X5 chắc chắn là máy pha cà phê thương mại bền bỉ nhất trong danh mục của chúng tôi.",
        "note": "Phạm vi in our catalog + nhấn mạnh by far -> dùng so sánh nhất the most durable."
      },
      {
        "en": "Last quarter marked the automaker's <b>strongest</b> export performance since 2015.",
        "vi": "Quý trước đánh dấu kết quả xuất khẩu mạnh mẽ nhất của hãng xe kể từ năm 2015.",
        "note": "Đã có sở hữu cách the automaker's phía trước nên không dùng the trước strongest."
      },
      {
        "en": "<b>The sooner</b> the warehouse confirms inventory counts, <b>the faster</b> we can dispatch client orders.",
        "vi": "Kho xác nhận số lượng tồn kho càng sớm, chúng tôi có thể giao đơn hàng cho khách càng nhanh.",
        "note": "Cấu trúc so sánh kép: The + sooner ..., the + faster ... (càng sớm... càng nhanh)."
      }
    ],
    "pitfalls": [
      {
        "wrong": "This is one of the most popular training seminar offered by our institute.",
        "right": "This is one of <b>the most popular training seminars</b> offered by our institute.",
        "exp": "Sau cấu trúc one of the + so sánh nhất, danh từ đếm được bắt buộc phải ở dạng số nhiều (seminars)."
      },
      {
        "wrong": "The company reported its the highest quarterly profit in ten years.",
        "right": "The company reported <b>its highest</b> quarterly profit in ten years.",
        "exp": "Không dùng đồng thời tính từ sở hữu (its) và mạo từ the trước dạng so sánh nhất."
      }
    ],
    "quiz": [
      {
        "q": "Among all the logistics proposals submitted this month, Apex Freight offered the _____ delivery rate.",
        "opts": [
          "competitive",
          "more competitive",
          "most competitive",
          "competitively"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (most competitive). Cụm phạm vi Among all the logistics proposals và mạo từ the phía trước báo hiệu So sánh nhất -> most competitive. Loại A (nguyên thể), B (so sánh hơn) và D (trạng từ)."
      },
      {
        "q": "The _____ employees complete the online compliance modules, the sooner the branch receives its annual certification.",
        "opts": [
          "earlier",
          "early",
          "earliest",
          "more early"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (earlier). Đây là cấu trúc So sánh kép (The + so sánh hơn ..., the sooner ...), nên vế đầu cần so sánh hơn của early là earlier. Loại B (nguyên thể), C (so sánh nhất) và D (sai cấu tạo từ)."
      },
      {
        "q": "Harborview Tower is widely recognized as one of the _____ office complexes in the metropolitan area.",
        "opts": [
          "innovative",
          "most innovative",
          "more innovative",
          "innovation"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (most innovative). Cấu trúc kinh điển one of the + so sánh nhất + N số nhiều (office complexes) + in the metropolitan area. Loại A (nguyên thể), C (so sánh hơn) và D (danh từ)."
      },
      {
        "q": "Last month's product launch generated the company's _____ single-day online revenue on record.",
        "opts": [
          "high",
          "higher",
          "the highest",
          "highest"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (highest). Cụm on record (từng ghi nhận) chỉ so sánh nhất; vì đã có sở hữu cách the company's đứng ngay trước chỗ trống nên KHÔNG lặp lại mạo từ the -> chọn highest. Loại C (thừa the), A và B (không phải so sánh nhất)."
      },
      {
        "q": "Customer demand for rechargeable cordless tools has grown _____ over the last several quarters.",
        "opts": [
          "stronger and stronger",
          "more and more strong",
          "strongest and strongest",
          "the stronger"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (stronger and stronger). Tính từ ngắn strong dùng cấu trúc so sánh lũy tiến Adj-er and Adj-er (ngày càng mạnh hơn). Loại B (strong không dùng more), C (không dùng so sánh nhất lặp) và D (sai cấu trúc)."
      },
      {
        "q": "Of the four regional retail hubs, the Nagoya flagship store recorded _____ the lowest staff turnover rate.",
        "opts": [
          "much more",
          "very",
          "by far",
          "too"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (by far). Trước so sánh nhất (the lowest) dùng cụm nhấn mạnh by far (vượt trội hẳn). Loại B, D (very/too không nhấn mạnh so sánh nhất) và A (much more thừa so sánh hơn)."
      }
    ]
  },
  {
    "id": "tg_22",
    "order": 22,
    "level": 2,
    "unitTitle": "Chặng 2 • Bị động, Hòa hợp S–V, To-V/V-ing & Liên từ (350–550)",
    "category": "Liên từ & Giới từ",
    "partTag": "Part 5–6",
    "title": "Liên từ kết hợp (FANBOYS) & Tương quan (both...and, not only...but also)",
    "speedTip": "Mẹo 5 giây: Thấy một nửa cặp liên từ tương quan xuất hiện trong câu (and -> chọn both; or -> chọn either; nor -> chọn neither; but also -> chọn not only) là chốt đáp án trong 3 giây! Luôn kiểm tra cấu trúc song song hai vế (N với N, V với V, Adj với Adj).",
    "formula": "FANBOYS: for, and, nor, but, or, yet, so  |  Cặp: both A and B | either A or B | neither A nor B | not only A but (also) B | whether A or B",
    "summary": "Liên từ kết hợp và Liên từ tương quan theo cặp là nhóm câu hỏi cực dễ ăn điểm trọn vẹn trong TOEIC Part 5–6. Chỉ cần thuộc đúng 5 cặp tương quan cố định và nguyên tắc đồng dạng song song giữa vế A và vế B.",
    "theorySections": [
      {
        "heading": "1. 5 cặp Liên từ Tương quan bắt buộc thuộc lòng (Chốt cặp 3 giây)",
        "bullets": [
          "both A and B (cả A lẫn B) — luôn đi cặp với and.",
          "either A or B (hoặc A hoặc B) — luôn đi cặp với or.",
          "neither A nor B (không A cũng không B) — luôn đi cặp với nor.",
          "not only A but (also) B (không những A mà còn B) — lưu ý also có thể lược bỏ hoặc đặt sau chủ ngữ/trợ động từ.",
          "whether A or B (liệu A hay B / dù là A hay B) — KHÔNG dùng if...or not ở đầu câu làm chủ ngữ, dùng whether."
        ]
      },
      {
        "heading": "2. Liên từ kết hợp FANBOYS & Quy tắc Song song (Parallelism)",
        "bullets": [
          "7 từ FANBOYS nối hai thành phần cùng chức năng hoặc hai mệnh đề độc lập (trước dấu phẩy): For (vì), And (và), Nor (cũng không), But (nhưng), Or (hoặc), Yet (tuy nhiên/nhưng), So (vì vậy).",
          "Quy tắc song song: Hai vế nối bởi and / but / or / cặp tương quan PHẢI CÙNG TỪ LOẠI (to review and to sign; accurate, timely, and concise; not only reduces costs but also improves speed).",
          "Phân biệt YET (liên từ nối mệnh đề đối lập tương đương but) với trạng từ yet (vẫn chưa)."
        ]
      }
    ],
    "examples": [
      {
        "en": "The redesigned mobile wallet is <b>both</b> faster to load <b>and</b> more secure than previous versions.",
        "vi": "Ví di động thiết kế lại vừa tải nhanh hơn vừa bảo mật hơn so với các phiên bản trước.",
        "note": "Cặp tương quan cố định both...and nối hai cụm tính từ so sánh hơn song song (faster to load / more secure)."
      },
      {
        "en": "Guests may submit their room service orders <b>either</b> by phone <b>or</b> through the bedside tablet.",
        "vi": "Khách có thể gửi yêu cầu phục vụ phòng qua điện thoại hoặc thông qua máy tính bảng đầu giường.",
        "note": "Cặp either...or nối hai cụm giới từ song song (by phone / through the bedside tablet)."
      },
      {
        "en": "The new printing press operates at twice the speed, <b>yet</b> it consumes twenty percent less electricity.",
        "vi": "Máy in mới vận hành với tốc độ gấp đôi, nhưng lại tiêu thụ ít hơn hai mươi phần trăm điện năng.",
        "note": "Yet đứng sau dấu phẩy nối hai mệnh đề mang nghĩa tương phản (= but)."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The supplier offered neither a partial refund or a free replacement.",
        "right": "The supplier offered <b>neither</b> a partial refund <b>nor</b> a free replacement.",
        "exp": "Neither luôn đi cặp với nor (không dùng với or)."
      },
      {
        "wrong": "The orientation workshop covers workplace safety, data privacy, and how to report incidents quickly.",
        "right": "The orientation workshop covers workplace safety, data privacy, and <b>rapid incident reporting</b>.",
        "exp": "Quy tắc song song: các mục liệt kê sau covers nên đồng dạng cùng là cụm danh từ (safety, privacy, reporting)."
      }
    ],
    "quiz": [
      {
        "q": "All seasonal associates receive _____ a comprehensive health plan and discounted commuter rail passes.",
        "opts": [
          "either",
          "both",
          "neither",
          "whether"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (both). Phía sau có từ khóa cặp là and -> chốt ngay cặp tương quan both A and B. Loại A (đi với or), C (đi với nor) và D (đi với or)."
      },
      {
        "q": "Customers may settle their quarterly invoices _____ by direct bank transfer or through our online billing portal.",
        "opts": [
          "both",
          "neither",
          "not only",
          "either"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (either). Có từ khóa or phía sau và ngữ cảnh đưa ra 2 lựa chọn thanh toán -> cặp either A or B. Loại A (đi với and), B (đi với nor) và C (đi với but also)."
      },
      {
        "q": "The regional manager checked the backup generators, _____ neither the primary unit nor the auxiliary system showed any fault.",
        "opts": [
          "and",
          "yet",
          "or",
          "for"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (and). Hai vế bổ sung thông tin tuần tự (kiểm tra máy phát dự phòng VÀ cả hai hệ thống đều không có lỗi) -> dùng liên từ and. Loại C (or chỉ lựa chọn), B (yet chỉ tương phản) và D (for chỉ nguyên nhân)."
      },
      {
        "q": "Installing motion-sensor LED panels will not only lower monthly utility bills _____ extend bulb lifespan significantly.",
        "opts": [
          "and also",
          "or else",
          "but also",
          "as well"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (but also). Nửa đầu câu có not only -> chốt cặp cố định not only ... but also nối hai động từ nguyên mẫu song song (lower / extend). Loại A, B, D vì sai cặp tương quan."
      },
      {
        "q": "The logistics coordinator could find _____ the original bill of lading nor the signed customs receipt in the archive.",
        "opts": [
          "either",
          "neither",
          "both",
          "whether"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (neither). Thấy nor phía sau -> chọn ngay cặp neither A nor B (không có cả A lẫn B). Loại A (đi với or), C (đi với and) và D (đi với or)."
      },
      {
        "q": "The executive committee praised the procurement team for negotiating lower rates, reducing waste, and _____ vendor onboarding.",
        "opts": [
          "streamlined",
          "to streamline",
          "streamline",
          "streamlining"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (streamlining). Theo quy tắc song song sau giới từ for (negotiating ..., reducing ..., and _____), động từ thứ 3 bắt buộc cùng dạng V-ing -> streamlining. Loại A (V-ed), B (to-V) và C (V-bare)."
      }
    ]
  },
  {
    "id": "tg_23",
    "order": 23,
    "level": 2,
    "unitTitle": "Chặng 2 • Bị động, Hòa hợp S–V, To-V/V-ing & Liên từ (350–550)",
    "category": "Liên từ & Giới từ",
    "partTag": "Part 5–6",
    "title": "Liên từ & Giới từ Nguyên nhân (because/since vs because of/due to)",
    "speedTip": "Mẹo 5 giây: Nhìn ngay thành phần ĐỨNG SAU chỗ trống! Có đầy đủ Mệnh đề (S + V chia thì) -> chọn Liên từ (because / since / as / now that). Chỉ là Cụm danh từ / V-ing (KHÔNG có động từ chia thì) -> chọn Giới từ (because of / due to / owing to / thanks to / as a result of).",
    "formula": "Liên từ + S + V: because / since / as / now that  |  Giới từ + N/V-ing: because of / due to / owing to / thanks to / on account of",
    "summary": "Phân biệt Liên từ nguyên nhân và Giới từ nguyên nhân là dạng câu hỏi 'kinh điển' xuất hiện gần như 100% ở mọi đề thi TOEIC thật. Chỉ cần kiểm tra sau chỗ trống có Động từ chia thì hay không là bạn loại ngay được ít nhất 2 phương án sai.",
    "theorySections": [
      {
        "heading": "1. Nhóm Liên từ Nguyên nhân (Theo sau PHẢI là S + V chia thì)",
        "bullets": [
          "because (bởi vì): phổ biến nhất, đặt đầu câu hoặc giữa câu.",
          "since / as (vì/bởi vì): thường đứng đầu câu để nêu lý do đã biết trong thư từ công sở (Since the auditorium is fully booked, we moved the lecture).",
          "now that (bởi vì giờ đây): nhấn mạnh lý do mới xuất hiện ở hiện tại (Now that the merger is complete, both teams share one portal).",
          "Lưu ý: Bẫy 'because' vs 'so' — KHÔNG BAO GIỜ dùng cả because và so trong cùng một câu!"
        ]
      },
      {
        "heading": "2. Nhóm Giới từ Nguyên nhân (Theo sau là Cụm Danh từ / V-ing)",
        "bullets": [
          "because of, due to, owing to, on account of, as a result of: mang nghĩa trung tính hoặc nêu lý do sự cố (due to heavy rainfall, owing to unexpected demand).",
          "thanks to: mang sắc thái TÍCH CỰC (nhờ vào sự nỗ lực/hỗ trợ: thanks to the team's dedication).",
          "Mẹo tránh bẫy V-ed/V-ing trong Cụm danh từ: Trong cụm 'due to the revised schedule', chữ revised là tính từ bổ nghĩa cho schedule chứ KHÔNG phải động từ chia thì -> vẫn là Cụm danh từ nên dùng Giới từ!"
        ]
      }
    ],
    "examples": [
      {
        "en": "Several regional flights were rerouted <b>due to</b> dense fog near the coastal runway.",
        "vi": "Một số chuyến bay khu vực đã phải chuyển hướng do sương mù dày đặc gần đường băng ven biển.",
        "note": "Dense fog near the coastal runway là cụm danh từ (không có động từ chia thì) -> chọn giới từ due to."
      },
      {
        "en": "<b>Since</b> the senior accountant is on medical leave, Ms. Ortega will approve all payroll vouchers this week.",
        "vi": "Vì kế toán trưởng đang nghỉ ốm, cô Ortega sẽ phê duyệt toàn bộ chứng từ lương tuần này.",
        "note": "Sau chỗ trống có đầy đủ mệnh đề (S = the senior accountant, V = is) -> chọn liên từ Since."
      },
      {
        "en": "<b>Thanks to</b> our engineers' rapid troubleshooting, online checkout resumed in under ten minutes.",
        "vi": "Nhờ sự xử lý sự cố nhanh chóng của các kỹ sư, thanh toán trực tuyến đã hoạt động trở lại trong chưa đầy mười phút.",
        "note": "Cụm danh từ mang sắc thái kết quả tích cực -> dùng giới từ Thanks to."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The outdoor gala was moved indoors because the sudden thunderstorm.",
        "right": "The outdoor gala was moved indoors <b>because of</b> (hoặc <b>due to</b>) the sudden thunderstorm.",
        "exp": "The sudden thunderstorm là cụm danh từ (không có V), nên không được dùng liên từ because mà phải dùng giới từ because of / due to."
      },
      {
        "wrong": "Due to the freight train arrived late, the factory delayed its morning shift.",
        "right": "<b>Because</b> (hoặc <b>Since</b>) the freight train arrived late, the factory delayed its morning shift.",
        "exp": "The freight train arrived late là một mệnh đề hoàn chỉnh (có động từ arrived), nên phải dùng liên từ Because/Since."
      }
    ],
    "quiz": [
      {
        "q": "All morning ferry crossings have been suspended _____ unusually high waves in the harbor.",
        "opts": [
          "due to",
          "since",
          "because",
          "now that"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (due to). Phía sau chỗ trống là cụm danh từ unusually high waves in the harbor (không có động từ chia thì) -> phải dùng giới từ due to. Loại C, B, D vì đều là liên từ cần mệnh đề S + V."
      },
      {
        "q": "_____ the downtown branch has doubled its client base, management plans to hire six additional advisors.",
        "opts": [
          "Because of",
          "Due to",
          "Now that",
          "Owing to"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (Now that). Sau chỗ trống có đầy đủ mệnh đề (S = the downtown branch, V = has doubled) -> bắt buộc dùng liên từ Now that (bởi vì giờ đây). Loại A, B, D vì đều là giới từ chỉ đi với cụm danh từ."
      },
      {
        "q": "The warehouse achieved zero workplace accidents this quarter _____ the supervisors' rigorous daily inspections.",
        "opts": [
          "because",
          "as",
          "since",
          "thanks to"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (thanks to). Phía sau là cụm danh từ mang nghĩa nguyên nhân tích cực (sự kiểm tra nghiêm ngặt hằng ngày) -> chọn giới từ thanks to. Loại A, C, B vì đều là liên từ cần S + V."
      },
      {
        "q": "Customers are advised to order holiday gift baskets early _____ shipping carriers experience peak volumes in December.",
        "opts": [
          "because of",
          "as",
          "owing to",
          "due to"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (as). Sau chỗ trống có mệnh đề hoàn chỉnh (S = shipping carriers, V = experience) -> dùng liên từ nguyên nhân as (= because). Loại A, C, D vì đều là giới từ."
      },
      {
        "q": "The board postponed the factory expansion _____ rising steel prices and stricter import tariffs.",
        "opts": [
          "since",
          "because",
          "on account of",
          "now that"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (on account of). Phía sau là cụm danh từ ghép (rising steel prices and stricter import tariffs — không có động từ chính) -> chọn giới từ nguyên nhân on account of (= because of). Loại B, A, D vì đều là liên từ."
      },
      {
        "q": "_____ the updated inventory software automates reorder alerts, store managers spend far less time on manual counts.",
        "opts": [
          "Since",
          "Thanks to",
          "Because of",
          "Due to"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (Since). Sau chỗ trống có mệnh đề hoàn chỉnh (S = the updated inventory software, V = automates) -> chọn liên từ Since. Loại D, B, C vì đều là giới từ không đứng trước mệnh đề S + V."
      }
    ]
  },
  {
    "id": "tg_24",
    "order": 24,
    "level": 2,
    "unitTitle": "Chặng 2 • Bị động, Hòa hợp S–V, To-V/V-ing & Liên từ (350–550)",
    "category": "Liên từ & Giới từ",
    "partTag": "Part 5–6",
    "title": "Liên từ & Giới từ Nhượng bộ (although/while vs despite/in spite of)",
    "speedTip": "Mẹo 5 giây: Thấy hai vế trái nghĩa/tương phản -> kiểm tra sau chỗ trống: có Mệnh đề (S + V) chọn although / though / even though / while / whereas; chỉ có Cụm danh từ / V-ing chọn despite / in spite of / notwithstanding. Đặc biệt KHÔNG BAO GIỜ chọn 'despite of'!",
    "formula": "Liên từ + S + V: although / though / even though / while / whereas  |  Giới từ + N/V-ing: despite / in spite of / notwithstanding",
    "summary": "Cặp bẫy Nhượng bộ (Although vs Despite) luôn đi song hành với cặp Nguyên nhân trong TOEIC Part 5–6. Ngoài phân biệt mệnh đề và cụm danh từ, bạn cần phân biệt rõ Trạng từ nối (However, Nevertheless) đứng tách bằng dấu chấm/chấm phẩy.",
    "theorySections": [
      {
        "heading": "1. Liên từ Nhượng bộ & Tương phản (+ Mệnh đề S + V)",
        "bullets": [
          "although / though / even though (mặc dù): nối mệnh đề chính và mệnh đề phụ trái nghĩa; KHÔNG dùng thêm but ở mệnh đề còn lại.",
          "while / whereas (trong khi — tương phản hai đối tượng): Sales in Europe rose sharply, whereas domestic orders remained flat.",
          "even if (ngay cả khi — mang sắc thái giả định tương lai): Even if the shipment arrives tonight, inspection starts tomorrow."
        ]
      },
      {
        "heading": "2. Giới từ Nhượng bộ (+ N/V-ing) & Phân biệt Trạng từ nối However",
        "bullets": [
          "despite / in spite of / notwithstanding (mặc dù/bất chấp) + Cụm danh từ hoặc V-ing (Despite heavy competition, the brand grew; In spite of facing delays...).",
          "Cạm bẫy kinh điển: despite KHÔNG đi với of (chỉ có in spite of hoặc despite the fact that + S + V).",
          "Phân biệt với Trạng từ nối However / Nevertheless / Nonetheless: đứng đầu câu mới (hoặc sau dấu chấm phẩy ;) và LUÔN có dấu phẩy ngay sau nó, KHÔNG dùng để nối hai mệnh đề chỉ ngăn cách bởi một dấu phẩy!"
        ]
      }
    ],
    "examples": [
      {
        "en": "<b>Despite</b> initial concerns over raw material costs, the new factory opened right on schedule.",
        "vi": "Mặc dù có những lo ngại ban đầu về chi phí nguyên liệu, nhà máy mới vẫn khai trương đúng tiến độ.",
        "note": "Initial concerns over raw material costs là cụm danh từ -> chọn giới từ Despite."
      },
      {
        "en": "<b>Even though</b> the candidate had limited management experience, her technical portfolio impressed the hiring panel.",
        "vi": "Mặc dù ứng viên có ít kinh nghiệm quản lý, hồ sơ chuyên môn của cô đã gây ấn tượng với hội đồng tuyển dụng.",
        "note": "Có đầy đủ chủ ngữ (the candidate) và động từ (had) -> chọn liên từ Even though."
      },
      {
        "en": "The west wing offices will undergo rewiring on Saturday; <b>however</b>, the main reception desk will remain open.",
        "vi": "Các văn phòng khu tây sẽ được đi lại dây điện vào thứ Bảy; tuy nhiên, quầy lễ tân chính vẫn mở cửa.",
        "note": "Nằm giữa dấu chấm phẩy (;) và dấu phẩy (,) -> vị trí chuẩn của trạng từ nối however."
      }
    ],
    "pitfalls": [
      {
        "wrong": "Despite of the severe snowstorm, all regional couriers completed their routes.",
        "right": "<b>Despite</b> (hoặc <b>In spite of</b>) the severe snowstorm, all regional couriers completed their routes.",
        "exp": "Tuyệt đối không viết 'despite of' — chỉ dùng despite + N hoặc in spite of + N."
      },
      {
        "wrong": "Although the marketing budget was cut, but quarterly sales still increased.",
        "right": "<b>Although</b> the marketing budget was cut, quarterly sales still increased.",
        "exp": "Trong tiếng Anh, khi đã dùng Although ở vế trước thì không được thêm but ở vế sau."
      }
    ],
    "quiz": [
      {
        "q": "_____ the tight renovation schedule, the interior contractors finished refurbishing all twenty guest suites on time.",
        "opts": [
          "Although",
          "Even though",
          "However",
          "Despite"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (Despite). Phía sau chỗ trống là cụm danh từ the tight renovation schedule (không có động từ chia thì) -> chọn giới từ nhượng bộ Despite. Loại A, B (liên từ cần S + V) và C (trạng từ nối cần dấu phẩy ngay sau)."
      },
      {
        "q": "_____ our flagship store in Zurich posted record holiday sales, online purchases declined slightly in the same period.",
        "opts": [
          "Despite",
          "While",
          "In spite of",
          "Due to"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (While). Hai mệnh đề nêu sự tương phản (cửa hàng tăng kỷ lục vs trực tuyến giảm nhẹ) và sau chỗ trống có S + V (posted) -> chọn liên từ tương phản While. Loại A, C, D vì đều là giới từ."
      },
      {
        "q": "The software patch resolved most display errors; _____, a few older tablets still require a manual restart.",
        "opts": [
          "although",
          "despite",
          "however",
          "whereas"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (however). Chỗ trống đứng ngay sau dấu chấm phẩy (;) và trước dấu phẩy (,) nối ý tương phản giữa hai mệnh đề độc lập -> vị trí độc quyền của trạng từ nối however. Loại A, D (liên từ phụ thuộc) và B (giới từ)."
      },
      {
        "q": "_____ the frequent upgrades to the billing system, several corporate clients continued to experience invoice delays.",
        "opts": [
          "In spite of",
          "Even though",
          "Although",
          "Nevertheless"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (In spite of). The frequent upgrades to the billing system là cụm danh từ không có động từ chính -> chọn giới từ In spite of. Loại B, C (liên từ cần S + V) và D (trạng từ nối)."
      },
      {
        "q": "Ms. Nakamura accepted the interim director position _____ it required relocating to Osaka for six months.",
        "opts": [
          "despite",
          "in spite of",
          "however",
          "even though"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (even though). Phía sau có mệnh đề đầy đủ (S = it, V = required) mang nghĩa nhượng bộ -> chọn liên từ even though. Loại A, B (giới từ) và C (trạng từ nối không nối liền hai mệnh đề không có dấu chấm phẩy)."
      },
      {
        "q": "_____ having fewer retail branches than its largest rival, Greenleaf Pharmacy leads the region in customer satisfaction.",
        "opts": [
          "Although",
          "Despite",
          "Whereas",
          "However"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (Despite). Phía sau chỗ trống là cụm danh động từ V-ing (having fewer retail branches...) -> chọn giới từ Despite + V-ing. Loại A, C (liên từ không đi trực tiếp trước V-ing dạng sở hữu/trạng thái ở cấu trúc này như giới từ) và D (trạng từ nối)."
      }
    ]
  },
  {
    "id": "tg_25",
    "order": 25,
    "level": 2,
    "unitTitle": "Chặng 2 • Bị động, Hòa hợp S–V, To-V/V-ing & Liên từ (350–550)",
    "category": "Liên từ & Giới từ",
    "partTag": "Part 5–6",
    "title": "Liên từ Thời gian & Điều kiện cơ bản (as soon as/once/before/until)",
    "speedTip": "Mẹo 5 giây: Phân biệt 2 cụm cực hay gặp trong TOEIC: ONCE (= ngay khi / một khi + S + V) và UNLESS (= trừ khi = if...not). Nhớ quy tắc phối thì: sau liên từ thời gian & điều kiện nói về tương lai, chia HIỆN TẠI ĐƠN (tuyệt đối không dùng will).",
    "formula": "Thời gian: once / as soon as / when / before / after / until / by the time + S + V  |  Điều kiện: if / unless / provided that / as long as + S + V",
    "summary": "Các liên từ thời gian và điều kiện xuất hiện dày đặc trong quy trình công việc, hướng dẫn đặt hàng và chính sách bảo hành TOEIC. Nắm vững nghĩa chính xác của once, until, unless và provided that giúp bạn giải quyết ngọt ngào cả Part 5 lẫn Part 6.",
    "theorySections": [
      {
        "heading": "1. Liên từ Thời gian trọng yếu trong TOEIC (Đi với S + V)",
        "bullets": [
          "once / as soon as (ngay khi / một khi): Once payment is confirmed, your ticket will be e-mailed.",
          "before (trước khi) vs after (sau khi); until (cho đến khi — hành động ở vế chính dừng hoặc bắt đầu đúng mốc đó).",
          "by the time (vào lúc mà): hay đi với Hoàn thành ở mệnh đề chính (By the time you arrive, we will have started).",
          "Lưu ý: before, after, until vừa là LIÊN TỪ (+ S + V) vừa là GIỚI TỪ (+ N/V-ing), còn when, while, once, as soon as là LIÊN TỪ."
        ]
      },
      {
        "heading": "2. Liên từ Điều kiện cơ bản (Đi với S + V)",
        "bullets": [
          "if (nếu) vs unless (trừ khi = if ... not -> sau unless KHÔNG dùng động từ phủ định!).",
          "provided (that) / providing (that) / as long as (miễn là / với điều kiện là): mang nghĩa tương đương if nhưng nhấn mạnh điều kiện bắt buộc trong hợp đồng.",
          "in case (phòng khi): mang nghĩa chuẩn bị dự phòng (Keep your receipt in case you need a refund)."
        ]
      }
    ],
    "examples": [
      {
        "en": "<b>Once</b> the quality-control team approves the final batch, shipping labels will be printed immediately.",
        "vi": "Ngay khi đội kiểm soát chất lượng phê duyệt lô hàng cuối cùng, nhãn vận chuyển sẽ được in ngay lập tức.",
        "note": "Once đóng vai trò liên từ (= as soon as) + mệnh đề hiện tại đơn (approves), vế chính dùng tương lai đơn (will be printed)."
      },
      {
        "en": "The conference room reservation will be canceled automatically <b>unless</b> you confirm attendance by noon.",
        "vi": "Lịch đặt phòng họp sẽ tự động bị hủy trừ khi bạn xác nhận tham dự trước buổi trưa.",
        "note": "Unless = if you do not (trừ khi bạn xác nhận), động từ sau unless để dạng khẳng định confirm."
      },
      {
        "en": "Full refunds are issued promptly <b>as long as</b> the merchandise remains unopened in its original box.",
        "vi": "Tiền hoàn lại đầy đủ được giải quyết nhanh chóng miễn là hàng hóa vẫn còn nguyên hộp chưa mở.",
        "note": "As long as (= provided that) nêu điều kiện áp dụng chính sách hoàn tiền."
      }
    ],
    "pitfalls": [
      {
        "wrong": "Unless you do not submit the form today, your request will be delayed.",
        "right": "<b>Unless</b> you <b>submit</b> the form today, your request will be delayed.",
        "exp": "Unless đã mang nghĩa phủ định (if...not), nên không dùng thêm do not ở mệnh đề sau unless."
      },
      {
        "wrong": "Please keep your luggage tag until you will exit the customs area.",
        "right": "Please keep your luggage tag <b>until</b> you <b>exit</b> the customs area.",
        "exp": "Trong mệnh đề thời gian bắt đầu bằng until/once/as soon as nói về tương lai, luôn chia Hiện tại đơn thay vì will."
      }
    ],
    "quiz": [
      {
        "q": "_____ the warehouse inventory audit is completed, all pending distributor orders will be released for delivery.",
        "opts": [
          "During",
          "Despite",
          "Once",
          "Until of"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (Once). Sau chỗ trống có mệnh đề (S = the warehouse inventory audit, V = is completed) mang nghĩa ngay khi hoàn tất kiểm kê thì đơn hàng sẽ được xuất kho -> chọn liên từ Once (= as soon as). Loại A, B (giới từ) và D (sai ngữ pháp)."
      },
      {
        "q": "Your corporate gym membership will automatically renew for another year _____ you submit a written cancellation request by May 15.",
        "opts": [
          "unless",
          "if",
          "once",
          "as soon as"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (unless). Về nghĩa: thẻ hội viên sẽ tự động gia hạn TRỪ KHI bạn gửi yêu cầu hủy bằng văn bản trước 15/5 -> chọn unless (= if...not). Loại B, C, D vì làm ngược nghĩa hoàn toàn."
      },
      {
        "q": "Employees may claim reimbursement for client meals _____ they attach original itemized receipts to the expense form.",
        "opts": [
          "unless",
          "provided that",
          "despite",
          "during"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (provided that). Mệnh đề sau nêu điều kiện bắt buộc (miễn là họ đính kèm hóa đơn chi tiết gốc) -> chọn liên từ điều kiện provided that. Loại A (ngược nghĩa trừ khi), C và D (giới từ)."
      },
      {
        "q": "Please do not unplug the network router _____ the green status light stops flashing.",
        "opts": [
          "since",
          "during",
          "while",
          "until"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (until). Cấu trúc phủ định not ... until (đừng rút phích cắm cho đến khi đèn xanh ngừng nhấp nháy). Loại B (giới từ), C (trong khi - sai nghĩa hướng dẫn) và A (kể từ khi/vì - sai nghĩa)."
      },
      {
        "q": "Ms. Kowalski printed three extra copies of the financial summary _____ additional board members join the meeting unexpectedly.",
        "opts": [
          "in case",
          "unless",
          "until",
          "as soon as"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (in case). Hành động in thêm 3 bản dự phòng mang nghĩa 'phòng khi' có thêm thành viên hội đồng tham gia đột xuất -> chọn in case. Loại B (trừ khi), C (cho đến khi) và D (ngay khi)."
      },
      {
        "q": "_____ the technical support representative receives your diagnostic log, she will call you with troubleshooting steps.",
        "opts": [
          "Prior to",
          "Because of",
          "As soon as",
          "Within"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (As soon as). Phía sau là mệnh đề hoàn chỉnh (S = the technical support representative, V = receives) diễn tả trình tự hành động nối tiếp ngay lập tức -> chọn liên từ As soon as. Loại B, A, D vì đều là giới từ."
      }
    ]
  },
  {
    "id": "tg_26",
    "order": 26,
    "level": 2,
    "unitTitle": "Chặng 2 • Bị động, Hòa hợp S–V, To-V/V-ing & Liên từ (350–550)",
    "category": "Đại từ & Mạo từ",
    "partTag": "Part 5–6",
    "title": "Đại từ quan hệ cơ bản (who/whom/which/that/whose)",
    "speedTip": "Mẹo 5 giây: Nhìn TRƯỚC chỗ trống xem là NGƯỜI hay VẬT, rồi nhìn NGAY SAU chỗ trống: [_____ + V] -> who/which/that; [_____ + N + V (sở hữu 'của')] -> WHOSE; sau dấu phẩy (,) hoặc sau giới từ (in/for/to + _____) -> TUYỆT ĐỐI LOẠI 'that'!",
    "formula": "Người: who (+ V) / whom (+ S+V)  |  Vật: which (+ V / S+V)  |  Sở hữu (Người & Vật): whose + N  |  Không dùng 'that' sau (,) hoặc Giới từ",
    "summary": "Đại từ quan hệ (Relative Pronouns) là cầu nối rút gọn hai câu thành một câu phức chuẩn học thuật, xuất hiện đều đặn 2–3 câu trong mỗi đề TOEIC Part 5–6. Chỉ cần áp dụng quy tắc 2 bước nhìn Trước & Sau chỗ trống là bạn chọn đúng tuyệt đối.",
    "theorySections": [
      {
        "heading": "1. Quy tắc 2 bước chọn đúng who / whom / which / that / whose",
        "bullets": [
          "Bước 1 (Nhìn danh từ đứng TRƯỚC): Chỉ NGƯỜI dùng who/whom/that; chỉ VẬT/CÔNG TY/TỔ CHỨC dùng which/that.",
          "Bước 2 (Nhìn ngay SAU chỗ trống): Nếu sau là ĐỘNG TỪ (thiếu chủ ngữ) -> who / which / that (KHÔNG dùng whom!). Nếu sau là S + V (thiếu tân ngữ) -> whom / who / which / that.",
          "Dấu hiệu WHOSE (của ai / của cái gì): Ngay sau chỗ trống là một DANH TỪ không có mạo từ (whose proposal, whose headquarters, whose contract) tạo thành mối quan hệ sở hữu với danh từ phía trước (dùng cho CẢ NGƯỜI LẪN VẬT!)."
        ]
      },
      {
        "heading": "2. 2 bẫy kinh điển ETS về dấu phẩy (,) & Giới từ + Đại từ quan hệ",
        "bullets": [
          "Bẫy 1 (Mệnh đề quan hệ không xác định — có dấu phẩy): KHÔNG BAO GIỜ dùng THAT sau dấu phẩy (Mr. Patel, who leads the division,...; The merger, which took effect in May,...).",
          "Bẫy 2 (Giới từ + Đại từ quan hệ): Ngay sau giới từ (in, on, at, for, with, to, by) CHỈ dùng whom (cho người) hoặc which (cho vật) — TUYỆT ĐỐI KHÔNG dùng that hay who (the committee to which he belongs; the vendor with whom we partnered)."
        ]
      }
    ],
    "examples": [
      {
        "en": "Applicants <b>who</b> possess bilingual fluency in Japanese and English will be given priority.",
        "vi": "Những ứng viên có khả năng sử dụng thành thạo song ngữ Nhật – Anh sẽ được ưu tiên.",
        "note": "Trước là người (Applicants), ngay sau là động từ (possess) -> chọn đại từ chủ ngữ who."
      },
      {
        "en": "We partnered with a local packaging firm <b>whose</b> eco-friendly cartons reduced our shipping weight by 15 percent.",
        "vi": "Chúng tôi hợp tác với một công ty bao bì địa phương mà thùng carton thân thiện môi trường của họ đã giúp giảm 15% trọng lượng vận chuyển.",
        "note": "Whose + N (eco-friendly cartons = thùng carton của công ty đó); whose dùng được cho cả danh từ chỉ vật/tổ chức."
      },
      {
        "en": "The regional training manual, <b>which</b> was revised last month, is now available on the staff portal.",
        "vi": "Sổ tay đào tạo khu vực, vốn đã được chỉnh sửa tháng trước, hiện đã có sẵn trên cổng nhân viên.",
        "note": "Có dấu phẩy phía trước (mệnh đề không xác định) chỉ vật -> bắt buộc dùng which, tuyệt đối không dùng that."
      }
    ],
    "pitfalls": [
      {
        "wrong": "The new Osaka distribution hub, that opens next month, will employ 120 staff.",
        "right": "The new Osaka distribution hub, <b>which</b> opens next month, will employ 120 staff.",
        "exp": "Không bao giờ dùng đại từ quan hệ that ngay sau dấu phẩy; phải dùng which cho danh từ chỉ vật/địa điểm."
      },
      {
        "wrong": "The client who's shipment was delayed received a full freight waiver.",
        "right": "The client <b>whose</b> shipment was delayed received a full freight waiver.",
        "exp": "Whose là đại từ quan hệ sở hữu (lô hàng của khách hàng); còn who's là viết tắt của who is / who has."
      }
    ],
    "quiz": [
      {
        "q": "Any associate _____ wishes to enroll in the leadership seminar should submit a registration form by Wednesday.",
        "opts": [
          "which",
          "who",
          "whom",
          "whose"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (who). Danh từ phía trước chỉ người (Any associate) và ngay sau chỗ trống là động từ chia thì (wishes) -> cần đại từ quan hệ làm chủ ngữ cho người là who. Loại A (chỉ vật), C (whom chỉ làm tân ngữ, không đứng trước V) và D (whose cần danh từ phía sau)."
      },
      {
        "q": "Meridian Bank is looking for an architectural firm _____ previous portfolio includes sustainable commercial towers.",
        "opts": [
          "who",
          "which",
          "whom",
          "whose"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (whose). Sau chỗ trống là cụm danh từ previous portfolio (hồ sơ năng lực trước đây CỦA công ty kiến trúc) -> cần đại từ quan hệ sở hữu whose. Loại A, C (chỉ người) và B (which không biểu thị sở hữu)."
      },
      {
        "q": "The redesigned ergonomic chair, _____ earned top durability ratings in independent tests, will launch in September.",
        "opts": [
          "which",
          "that",
          "who",
          "what"
        ],
        "ans": 0,
        "exp": "Đáp án đúng là A (which). Danh từ phía trước là vật (chair) và ngay trước chỗ trống có dấu phẩy (mệnh đề không xác định) -> bắt buộc dùng which. Loại B (cấm dùng that sau dấu phẩy), C (chỉ người) và D (what không làm đại từ quan hệ sau danh từ)."
      },
      {
        "q": "The logistics consultants with _____ we collaborated last autumn have been invited back for phase two.",
        "opts": [
          "who",
          "that",
          "whom",
          "which"
        ],
        "ans": 2,
        "exp": "Đáp án đúng là C (whom). Trước chỗ trống có giới từ with thay thế cho danh từ chỉ người (The logistics consultants) -> sau giới từ chỉ người BẮT BUỘC dùng whom. Loại A, B (không dùng who/that ngay sau giới từ) và D (chỉ vật)."
      },
      {
        "q": "Please review the quarterly sales targets _____ the regional vice president shared during this morning's call.",
        "opts": [
          "who",
          "which",
          "whom",
          "whose"
        ],
        "ans": 1,
        "exp": "Đáp án đúng là B (which). Danh từ phía trước chỉ vật (the quarterly sales targets) và sau chỗ trống là mệnh đề S + V thiếu tân ngữ (the regional vice president shared) -> dùng which. Loại A, C (chỉ người) và D (sở hữu)."
      },
      {
        "q": "The municipal council awarded the bridge maintenance contract to the bidder _____ technical plan met every safety benchmark.",
        "opts": [
          "whom",
          "which",
          "who",
          "whose"
        ],
        "ans": 3,
        "exp": "Đáp án đúng là D (whose). Phía trước là người/nhà thầu (the bidder), ngay sau là danh từ technical plan (kế hoạch kỹ thuật của nhà thầu đó) -> dùng đại từ quan hệ sở hữu whose. Loại A, C, B vì không mang nghĩa sở hữu trước danh từ."
      }
    ]
  }
];
  if (typeof window !== "undefined") window.__LP_TOEIC_GRAMMAR_P1 = DATA;
  if (typeof module !== "undefined" && module.exports) module.exports = DATA;
})();

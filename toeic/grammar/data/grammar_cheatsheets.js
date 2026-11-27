/* LinguaPath TOEIC Grammar — Cheat Sheet Mind Map 5 Tab (4 Sơ đồ Công thức + 20 Bẫy Part 5–6)
 * Dữ liệu siêu nhẹ phục vụ Modal tra cứu nhanh 5 giây trong toeic/grammar/index.html.
 */
(function () {
  "use strict";

  var CHEATSHEETS = {
    tabs: [
      {
        id: "wordforms",
        label: "Từ loại 5 giây",
        level: 1,
        summary: "Phản xạ nhận diện Danh – Động – Tính – Trạng từ theo vị trí trước/sau chỗ trống và hậu tố ETS chuẩn mục tiêu 0–350.",
        cards: [
          {
            title: "Danh từ (Noun) — 4 Vị trí Vàng",
            badge: "Chặng 1 • 0–350",
            formula: "a/an/the + [N] | Tính từ sở hữu + [N] | Giới từ + [N] | Ngoại ĐT + [N]",
            points: [
              "Hậu tố chỉ VẬT/SỰ VIỆC: <b>-tion, -sion, -ment, -ance, -ence, -ity, -ness, -ship, -age, -ure</b>.",
              "Hậu tố chỉ NGƯỜI: <b>-er, -or, -ist, -ant, -ent, -ee</b> (employee, trainee, applicant, consultant).",
              "Chú ý Danh từ ghép (Compound Noun): <b>N1 + N2</b> (safety regulations, customer satisfaction) — N1 thường ở dạng số ít."
            ],
            example: "The <b>approval</b> of the revised <b>budget</b> requires executive authorization."
          },
          {
            title: "Tính từ (Adjective) — 3 Vị trí Vàng",
            badge: "Part 5 Tần suất cao",
            formula: "a/an/the + [Adj] + N | be / become / remain / seem + [Adj] | make/keep/find/consider + O + [Adj]",
            points: [
              "Hậu tố phổ biến: <b>-able, -ible, -al, -ful, -less, -ive, -ous, -ic, -ant, -ent, -ary, -ory</b>.",
              "Phân từ tính từ: <b>V-ing</b> (chỉ tính chất vật/gây cảm xúc: challenging task) vs <b>V-ed</b> (chỉ cảm xúc người/bị tác động: satisfied clients).",
              "Bẫy 5 thành phần: sau <b>make/keep/find/consider + O</b> PHẢI chọn Tính từ, không chọn Trạng từ."
            ],
            example: "Customers found the redesigned mobile checkout <b>intuitive</b> and <b>reliable</b>."
          },
          {
            title: "Trạng từ (Adverb) — 4 Vị trí Vàng",
            badge: "Nhìn 2 giây",
            formula: "[Adv] + Adj | [Adv] + V-ed/V-ing | Trợ ĐT + [Adv] + V | V + (O) + [Adv]",
            points: [
              "Công thức chuẩn: <b>Adj + -ly = Adv</b> (significantly, promptly, efficiently, thoroughly).",
              "Chỗ trống nằm ở câu đã ĐỦ S – V – O (bỏ chỗ trống câu vẫn đúng ngữ pháp) → 95% chọn <b>Trạng từ</b>.",
              "Trạng từ còn bổ nghĩa cho cả câu ở đầu câu trước dấu phẩy: <b>Fortunately, / Recently, / Specifically, ...</b>"
            ],
            example: "The warehouse crew <b>promptly</b> shipped all backordered items."
          },
          {
            title: "Bẫy Đuôi -al, -ive, -ly Giả Mạo",
            badge: "Bẫy Kinh điển",
            formula: "Danh từ đuôi -al / -ive | Tính từ đuôi -ly (KHÔNG phải Trạng từ!)",
            points: [
              "<b>Danh từ đuôi -al</b>: proposal, approval, renewal, arrival, removal, dismissal, manual, potential, individual.",
              "<b>Danh từ đuôi -ive</b>: executive, representative, initiative, objective, alternative, incentive, directive.",
              "<b>Tính từ đuôi -ly</b> (N + ly): timely, costly, friendly, weekly, monthly, quarterly, yearly, orderly, likely."
            ],
            example: "We appreciate your <b>timely</b> (Adj) <b>renewal</b> (N) of the annual service contract."
          },
          {
            title: "Động từ (Verb) & Quy tắc 1 Câu Đơn",
            badge: "Xương sống câu",
            formula: "S + [V chia thì] + (O) | Modal (will/must/should/can) + [V-bare]",
            points: [
              "Hậu tố động từ thường gặp: <b>-ize, -ise, -ate, -ify, -en</b> (finalize, evaluate, clarify, strengthen).",
              "Mỗi mệnh đề chỉ có ĐÚNG 1 động từ chính chia thì; <b>V-ing</b> và <b>to-V</b> đứng lẻ KHÔNG làm động từ chính.",
              "Sau <b>will, would, can, could, may, might, must, should</b> luôn dùng động từ nguyên mẫu không 'to'."
            ],
            example: "All regional branches must <b>implement</b> the updated security protocol by Monday."
          },
          {
            title: "Đại từ 5 Cột & Mạo từ – Lượng từ",
            badge: "Ăn điểm chắc",
            formula: "S (they) | O (them) | Sở hữu + N (their) | ĐT sở hữu (theirs) | Phản thân (themselves)",
            points: [
              "<b>Đại từ phản thân</b> (-self/-selves): khi S = O, hoặc nhấn mạnh ngay sau S/cuối câu, hoặc cụm <b>by + oneself</b> (= tự mình).",
              "<b>each / every</b> + N đếm được SỐ ÍT + V số ít; <b>each of the</b> + N số nhiều + V số ít.",
              "<b>many / several / a few</b> + N đếm được số nhiều ≠ <b>much / a little / a great deal of</b> + N không đếm được."
            ],
            example: "Ms. Sato organized the entire international exhibition <b>herself</b>."
          }
        ]
      },
      {
        id: "tenses",
        label: "Thì & Bị động",
        level: 2,
        summary: "Nhận diện nhanh 6 thì cốt lõi, mẹo phân biệt Chủ động – Bị động sau chỗ trống, Hòa hợp Chủ–Vị và To-V / V-ing mức 350–550.",
        cards: [
          {
            title: "Dấu hiệu 6 Thì Cốt lõi Part 5–6",
            badge: "Chặng 2 • 350–550",
            formula: "HTĐ (always/quarterly) | QKĐ (last/ago/in 2022) | HTHT (since/for/recently) | TLHT (by + mốc TL)",
            points: [
              "<b>Hiện tại đơn</b>: sự thật, chính sách, lịch trình (every, annually, regularly, currently).",
              "<b>Quá khứ đơn</b>: mốc quá khứ đã chấm dứt (yesterday, last quarter, two weeks ago, in 2023).",
              "<b>Hiện tại hoàn thành (have/has V3)</b>: since + mốc QK, for + khoảng TG, over the past + TG, recently, lately, yet, already.",
              "<b>Tương lai hoàn thành (will have V3)</b>: <b>by + mốc tương lai</b> (by next Friday, by the end of the year)."
            ],
            example: "Over the past five years, our online division <b>has expanded</b> into twelve markets."
          },
          {
            title: "Mẹo 5 Giây Chủ động vs Bị động",
            badge: "Mẹo siêu tốc",
            formula: "Chỗ trống + Tân ngữ (N) → CHỦ ĐỘNG | Chỗ trống + Giới từ / Adv / dấu câu → BỊ ĐỘNG (be + V3)",
            points: [
              "Nhìn ngay <b>SAU chỗ trống</b>: nếu có cụm danh từ trực tiếp làm tân ngữ → chọn Chủ động; nếu là giới từ (by, in, at, for, to, on) hoặc hết câu → 90% chọn <b>Bị động (be + V3/ed)</b>.",
              "Ngoại lệ 1 — <b>Nội động từ 0 bị động</b>: happen, occur, appear, rise, remain, arrive, expire, consist of, last.",
              "Ngoại lệ 2 — <b>Động từ 2 tân ngữ</b> (give, offer, award, grant, send, notify): vẫn còn 1 tân ngữ phía sau khi chia bị động (was awarded a prize)."
            ],
            example: "All warranty claims must <b>be submitted</b> (bị động + giới từ) <b>within</b> thirty days."
          },
          {
            title: "Hòa hợp Chủ – Vị (Subject–Verb Agreement)",
            badge: "Bẫy hay ra",
            formula: "N1 + of/with/in/along with + N2 → chia theo N1 | A number of + V(nhiều) ≠ The number of + V(ít)",
            points: [
              "Gạch bỏ cụm giới từ xen giữa (<b>of, in, on, for, with, along with, as well as</b>) để tìm đúng Chủ ngữ chính N1.",
              "<b>V-ing / To-V / Mệnh đề That</b> làm chủ ngữ → luôn chia động từ <b>SỐ ÍT</b>.",
              "<b>either A or B / neither A nor B / not only A but also B</b> → chia động từ theo chủ ngữ <b>B (gần động từ nhất)</b>.",
              "<b>Everyone / Anybody / Nothing / Each / Every</b> → luôn chia động từ <b>SỐ ÍT</b>."
            ],
            example: "<b>The number of</b> overseas subscribers <b>has risen</b> steadily since January."
          },
          {
            title: "Động từ đi với To-V vs V-ing & Bẫy 'to + V-ing'",
            badge: "Collocation ETS",
            formula: "want/plan/agree/decide/refuse/fail + to-V | enjoy/avoid/postpone/consider/recommend + V-ing",
            points: [
              "<b>Nhóm + To-V</b>: expect, intend, manage, offer, promise, afford, strive, hesitate, ask/require/encourage + O + to-V.",
              "<b>Nhóm + V-ing</b>: finish, suggest, delay, quit, mind, involve, discontinue, worth + V-ing, spend time + V-ing.",
              "<b>Bẫy 'to' là GIỚI TỪ (+ V-ing / N)</b>: look forward to, be committed/dedicated to, object to, be accustomed/used to, contribute to, lead to, prior to, in addition to."
            ],
            example: "We look forward <b>to welcoming</b> all delegates to the autumn summit."
          },
          {
            title: "So sánh Hơn – Nhất – Kép & Từ Nhấn mạnh",
            badge: "Part 5 Dễ ăn",
            formula: "much/far/even/still/significantly + Adj-er/more Adj + than | by far + the most/Adj-est",
            points: [
              "<b>Từ nhấn mạnh So sánh hơn</b>: much, far, even, a lot, still, considerably (CẤM dùng 'very' trước so sánh hơn!).",
              "<b>So sánh bằng</b>: as + Adj/Adv (nguyên gốc) + as (khẳng định/phủ định).",
              "<b>So sánh kép</b>: The + so sánh hơn + S + V, the + so sánh hơn + S + V (Càng... càng...)."
            ],
            example: "The upgraded scanner processes documents <b>far more quickly than</b> the previous model."
          },
          {
            title: "Phối hợp Thì & Quy tắc Cấm 'Will'",
            badge: "Bẫy Thời gian",
            formula: "When / Once / As soon as / Before / Until / If + HTĐ, S + will + V",
            points: [
              "Trong mệnh đề thời gian & điều kiện chỉ tương lai, TUYỆT ĐỐI KHÔNG dùng <b>will</b> — phải chia <b>Hiện tại đơn</b>.",
              "<b>By the time + HTĐ</b> ↔ <b>will have V3</b>; <b>By the time + QKĐ</b> ↔ <b>had V3</b>.",
              "<b>Since + mốc QK / S + QKĐ</b> ↔ Mệnh đề chính chia <b>Hiện tại hoàn thành (have/has V3)</b>."
            ],
            example: "Once the director <b>signs</b> the lease, the renovation crew will start immediately."
          }
        ]
      },
      {
        id: "connectors",
        label: "Giới từ & Liên từ",
        level: 3,
        summary: "Bảng đối chiếu Giới từ – Liên từ – Trạng từ liên kết, Rút gọn MĐQH/Phân từ, Câu điều kiện và nhóm Other mức 550–750.",
        cards: [
          {
            title: "Bảng 3 Cột: Liên từ vs Giới từ vs Trạng từ nối",
            badge: "Xương sống P5–6",
            formula: "Liên từ + S+V | Giới từ + N/V-ing | Dấu (. / ;) + Trạng từ nối + dấu (,)",
            points: [
              "<b>Nguyên nhân</b>: because/since/as (+ S+V) | because of/due to/owing to (+ N) | therefore/consequently (, S+V).",
              "<b>Nhượng bộ</b>: although/though/even though/while (+ S+V) | despite/in spite of (+ N) | however/nevertheless (, S+V).",
              "<b>Bổ sung</b>: besides/in addition to (+ N/V-ing) | furthermore/moreover/in addition (, S+V).",
              "<b>Thời gian</b>: while (+ S+V/V-ing) | during (+ N sự kiện) | for (+ con số thời gian) | meanwhile (, S+V)."
            ],
            example: "<b>Despite</b> the heavy snow (N), all flights departed on time; <b>however</b>, baggage delivery was slow."
          },
          {
            title: "MĐQH: where/when vs which & Rút gọn V-ing/V-ed",
            badge: "Chặng 3 • 550–750",
            formula: "where/when/Prep+which + MĐ ĐỦ | which/who + MĐ THIẾU | N + V-ing (O) / V3 (bị động)",
            points: [
              "Sau giới từ CHỈ dùng <b>which</b> (vật) / <b>whom</b> (người) — CẤM <b>Prep + that / Prep + who</b>.",
              "Rút gọn MĐQH: câu đã có 1 V chính → chọn <b>V-ing</b> (chủ động/có O/nội ĐT: consisting of, resulting from) hoặc <b>V3/ed</b> (bị động/theo sau là Prep).",
              "Phân từ đầu câu (<b>V-ing / V3 / Having V3, S + V</b>): luôn chiếu vào <b>Chủ ngữ SAU dấu phẩy</b> để quyết định chủ hay bị động."
            ],
            example: "<b>Founded</b> in 1998, the firm now owns the warehouse <b>where</b> all solar units are assembled."
          },
          {
            title: "Mệnh đề Danh ngữ: that / what / whether / whoever",
            badge: "Dễ mất điểm",
            formula: "that + MĐ ĐỦ | what + MĐ THIẾU S/O | whether (+ or not / to-V / đầu câu / sau Prep)",
            points: [
              "Mệnh đề danh ngữ làm Chủ ngữ luôn chia động từ <b>SỐ ÍT</b> (That sales grew 20% <b>is</b> impressive).",
              "<b>what</b> không bao giờ có danh từ tiền ngữ đứng trước; bên trong mệnh đề 'what' luôn thiếu S hoặc O.",
              "Sau giới từ + V chia thì phía sau: <b>to whoever + V</b> (whoever làm chủ ngữ của vế sau, KHÔNG dùng whomever)."
            ],
            example: "Please forward all invoices to <b>whoever</b> manages vendor accounts this week."
          },
          {
            title: "Câu Điều kiện & 5 Từ Thay thế 'If'",
            badge: "Chuẩn thương mại",
            formula: "Loại 1: HTĐ ↔ will/V-bare | Loại 2: QKĐ(were) ↔ would V | Loại 3: had V3 ↔ would have V3",
            points: [
              "<b>Provided (that) / As long as / On condition that</b> + S+V = miễn là, với điều kiện là.",
              "<b>Unless</b> + S+V (khẳng định) = trừ khi (= If ... not); tránh phủ định kép.",
              "<b>In case / In the event that</b> (+ S+V) ≠ <b>In case of / In the event of</b> (+ N).",
              "<b>Otherwise</b> = nếu không thì (trạng từ nối sau dấu chấm / chấm phẩy)."
            ],
            example: "Refunds are issued <b>provided that</b> receipts are presented within 14 days; <b>otherwise</b>, store credit applies."
          },
          {
            title: "Bộ 5 'Other' & Cặp Giới từ Hay Nhầm",
            badge: "Phản xạ nhanh",
            formula: "another + N(ít) | other + N(nhiều/KĐĐ) | others / the others (0 + N)",
            points: [
              "Có Danh từ sau chỗ trống → <b>LOẠI NGAY others & the others</b>! Chỉ giữ another / other / the other.",
              "<b>by</b> (hạn chót hoàn thành: submit by Friday) ≠ <b>until</b> (kéo dài liên tục: stay open until 8 P.M.).",
              "<b>between</b> (2 đối tượng) ≠ <b>among</b> (từ 3 đối tượng / tập thể); <b>within</b> (trong vòng) ≠ <b>throughout</b> (xuyên suốt)."
            ],
            example: "Please submit your report <b>by</b> noon so <b>other</b> managers can review it before the meeting."
          },
          {
            title: "Giới từ Phức ETS & Cấu trúc Song song",
            badge: "Văn phong 700+",
            formula: "in accordance with / prior to / regardless of / on behalf of / in light of / subject to + N / V-ing",
            points: [
              "<b>prior to + N/V-ing</b> (trước khi — CẤM 'prior to + V-bare'!); <b>in addition to + N/V-ing</b> ≠ <b>in addition, S+V</b>.",
              "<b>Parallelism</b>: trước & sau <b>and / or / but / both...and / not only...but also / rather than</b> phải ĐỒNG DẠNG (V-ing ↔ V-ing, Adj ↔ Adj, N ↔ N).",
              "<b>Part 6 Điền câu</b>: khóa 3 neo — Từ chỉ định (this/these/such), Mạch logic (vấn đề → giải pháp), và Thì nhất quán giữa câu trước & câu sau."
            ],
            example: "<b>Prior to signing</b> the lease, inspect the premises <b>in accordance with</b> safety rules."
          }
        ]
      },
      {
        id: "advanced",
        label: "Đảo ngữ & 850+",
        level: 4,
        summary: "Toàn bộ vũ khí phân hóa vùng điểm 750–990: Đảo ngữ Điều kiện & Phủ định, Thức Giả định, Ngoại động từ 0 giới từ và Bẫy từ vựng nâng cao.",
        cards: [
          {
            title: "Đảo ngữ Câu Điều kiện (Bỏ 'If')",
            badge: "Chặng 4 • 850+",
            formula: "Should + S + V-bare | Were + S + (to-V/Adj) | Had + S + V3/ed",
            points: [
              "<b>Loại 1</b>: <b>Should</b> + S + V-bare (kể cả S số ít vẫn dùng V-bare: Should the client need...).",
              "<b>Loại 2</b>: <b>Were</b> + S + to-V / Adj / N, S + would/could + V-bare.",
              "<b>Loại 3</b>: <b>Had</b> + S + V3/ed, S + would/could + have + V3/ed.",
              "<b>Phủ định</b>: đặt <b>not</b> SAU chủ ngữ (Had we <b>not</b> checked...); CẤM viết 'Hadn't / Shouldn't' ở đầu câu!"
            ],
            example: "<b>Should</b> you have questions regarding the invoice, please contact our billing office."
          },
          {
            title: "Đảo ngữ Phủ định & Cụm 'Only'",
            badge: "Bẫy 900+",
            formula: "Never/Rarely/Seldom/Not only/Under no circumstances + Trợ ĐT + S + V",
            points: [
              "Cặp cố định: <b>No sooner + had + S + V3 + THAN</b> ≠ <b>Hardly/Scarcely + had + S + V3 + WHEN</b>.",
              "<b>Only after / Only when / Only if / Only by / Not until</b>: KHÔNG đảo ở vế phụ ngay sau nó — CHỈ đảo Trợ ĐT + S + V ở <b>MỆNH ĐỀ CHÍNH</b>!",
              "Nhóm cụm giới từ phủ định hay ra: <b>Under no circumstances, At no time, In no way, Little did...</b>"
            ],
            example: "<b>Only after</b> the audit ended <b>did</b> management publish the annual earnings."
          },
          {
            title: "Thức Giả định (Mandative Subjunctive)",
            badge: "Ăn điểm 5 giây",
            formula: "suggest/recommend/insist/require/demand/mandatory/essential + that + S + (not) + V-bare / be V3",
            points: [
              "Bất kể chủ ngữ là <b>số ít</b> hay động từ chính ở <b>quá khứ</b>, động từ trong mệnh đề 'that' LUÔN là <b>V-bare</b> (không -s/-es, không -ed).",
              "Thể bị động dùng <b>be + V3/ed</b> (KHÔNG dùng is/are/was/were).",
              "Thể phủ định đặt trực tiếp <b>not + V-bare</b> (KHÔNG mượn do/does/did)."
            ],
            example: "It is mandatory that every visitor <b>be escorted</b> and <b>not photograph</b> lab equipment."
          },
          {
            title: "Rút gọn MĐ Trạng ngữ & Câu Chẻ / Nhượng bộ",
            badge: "Văn viết ETS",
            formula: "While/Once/When/Unless/If + V-ing / V3 / Adj | It is/was X THAT... | However + Adj + S + V",
            points: [
              "Giữ liên từ + bỏ 'S + be': <b>While reviewing</b> (chủ động), <b>Once approved</b> (bị động), <b>if necessary / unless otherwise noted</b>.",
              "<b>Câu chẻ</b>: <b>It is/was + [X] + that + ...</b> (nhấn thời gian/nơi chốn/cụm giới từ vẫn dùng <b>that</b>, KHÔNG dùng when/where!).",
              "<b>However + Adj/Adv + S + V</b> = <b>No matter how + Adj/Adv + S + V</b> (dù ... đến mức nào)."
            ],
            example: "It was not until Friday <b>that</b> the board approved the plan, <b>however</b> urgent the deadline seemed."
          },
          {
            title: "Ngoại động từ KHÔNG dùng Giới từ",
            badge: "Bẫy Dịch Việt",
            formula: "discuss / attend / mention / contact / approach / enter / await / comprise / address + O (0 Prep!)",
            points: [
              "Cấm chèn giới từ thừa: <b>discuss sth</b> (0 about), <b>contact sb</b> (0 with), <b>attend an event</b> (0 to/at), <b>approach sth</b> (0 to), <b>mention sth</b> (0 about).",
              "Cặp đồng nghĩa cần soi giới từ sau chỗ trống: <b>await + N</b> ↔ <b>wait for + N</b>; <b>comprise + N</b> ↔ <b>consist of + N</b>; <b>attend + N</b> ↔ <b>participate in + N</b>.",
              "Ngược lại: <b>explain sth TO sb</b> (KHÔNG viết 'explain sb sth'), <b>inform/notify sb OF sth</b>."
            ],
            example: "All supervisors must <b>attend</b> the safety briefing and <b>discuss</b> the new compliance targets."
          },
          {
            title: "Bẫy Tính từ – Trạng từ Đồng gốc & Danh từ Đặc biệt",
            badge: "Phân hóa 900+",
            formula: "economic≠economical | hard≠hardly | most≠almost | KĐĐ (equipment) vs Luôn nhiều (premises)",
            points: [
              "<b>Tính từ bẫy</b>: economic (kinh tế) ≠ economical (tiết kiệm); considerable (đáng kể) ≠ considerate (chu đáo); reliable (đáng tin) ≠ reliant on (phụ thuộc); confident (tự tin) ≠ confidential (bảo mật).",
              "<b>Trạng từ bẫy</b>: hardly (hầu như không), lately (gần đây + HTHT), highly (rất), nearly/almost (+ số/all/every — KHÔNG + N trực tiếp!), closely (chặt chẽ).",
              "<b>Danh từ KĐĐ (0 a/an, 0 -s, V ít)</b>: equipment, furniture, merchandise, information, feedback, luggage, access. <b>Luôn số nhiều (V nhiều)</b>: premises, proceeds, earnings, belongings."
            ],
            example: "All lab <b>equipment is</b> insured, and net <b>proceeds are</b> audited <b>closely</b>."
          }
        ]
      }
    ],
    pitfalls: [
      {
        id: "pf_01",
        tag: "Từ loại • Đuôi -al",
        wrong: "The board gave its final approve to the merger.",
        right: "The board gave its final <b>approval</b> to the merger.",
        tip: "Đừng tưởng đuôi -al luôn là tính từ! proposal, approval, renewal, arrival, removal, manual đều là DANH TỪ tần suất siêu cao."
      },
      {
        id: "pf_02",
        tag: "Từ loại • Đuôi -ly",
        wrong: "We guarantee a time delivery for all priority parcels.",
        right: "We guarantee a <b>timely</b> delivery for all priority parcels.",
        tip: "timely, costly, friendly, weekly, monthly, quarterly là TÍNH TỪ đuôi -ly (N + ly), đứng trước danh từ hoàn toàn chuẩn."
      },
      {
        id: "pf_03",
        tag: "5 Thành phần",
        wrong: "The new software makes invoicing much more easily.",
        right: "The new software makes invoicing much more <b>efficient / easy</b>.",
        tip: "Sau make / keep / find / consider / leave + Tân ngữ PHẢI dùng TÍNH TỪ bổ ngữ tân ngữ, không dùng trạng từ."
      },
      {
        id: "pf_04",
        tag: "Bẫy 'to + V-ing'",
        wrong: "We look forward to receive your revised quotation.",
        right: "We look forward to <b>receiving</b> your revised quotation.",
        tip: "Nhóm 'to' là giới từ (+ V-ing/N): look forward to, be committed/dedicated to, object to, prior to, in addition to, contribute to."
      },
      {
        id: "pf_05",
        tag: "Hòa hợp S–V",
        wrong: "The number of online complaints have declined this quarter.",
        right: "The number of online complaints <b>has declined</b> this quarter.",
        tip: "'The number of + N nhiều' (con số) chia V SỐ ÍT; 'A number of + N nhiều' (= nhiều) mới chia V SỐ NHIỀU."
      },
      {
        id: "pf_06",
        tag: "Bị động • Nội ĐT",
        wrong: "The system outage was occurred during peak hours.",
        right: "The system outage <b>occurred</b> during peak hours.",
        tip: "Nội động từ (occur, happen, appear, remain, arrive, expire, rise, consist of) TUYỆT ĐỐI không chia bị động."
      },
      {
        id: "pf_07",
        tag: "Giới từ vs Liên từ",
        wrong: "Despite the weather was severe, the expo opened on time.",
        right: "<b>Although</b> the weather was severe (hoặc <b>Despite</b> the severe weather), the expo opened on time.",
        tip: "despite / in spite of / because of / due to / during + Cụm N; although / because / while + S + V."
      },
      {
        id: "pf_08",
        tag: "Trạng từ liên kết",
        wrong: "Sales rose sharply, however, net profit remained flat.",
        right: "Sales rose sharply<b>; however,</b> net profit remained flat.",
        tip: "however / therefore / nevertheless / furthermore / otherwise KHÔNG nối được 2 mệnh đề bằng dấu phẩy đơn — phải có dấu chấm (.) hoặc chấm phẩy (;)."
      },
      {
        id: "pf_09",
        tag: "MĐQH • Prep+which",
        wrong: "This is the policy under that staff may request leave.",
        right: "This is the policy <b>under which</b> staff may request leave.",
        tip: "CẤM dùng 'that' và 'who' ngay sau giới từ! Chỉ dùng 'Prep + which' (vật) hoặc 'Prep + whom' (người)."
      },
      {
        id: "pf_10",
        tag: "Rút gọn MĐQH",
        wrong: "The invoice was sent yesterday needs immediate approval.",
        right: "The invoice <b>sent</b> yesterday needs immediate approval.",
        tip: "Câu đã có động từ chính ('needs') → không chia thì thêm ở vế bổ nghĩa; rút gọn bị động thành V3/ed ('sent')."
      },
      {
        id: "pf_11",
        tag: "Phân từ đầu câu",
        wrong: "Designing for heavy duty, the printer lasts ten years.",
        right: "<b>Designed</b> for heavy duty, the printer lasts ten years.",
        tip: "Luôn chiếu chủ ngữ SAU dấu phẩy ('the printer' được thiết kế → bị động V3/ed, không dùng V-ing)."
      },
      {
        id: "pf_12",
        tag: "Mệnh đề Danh ngữ",
        wrong: "If the branch stays open or not depends on Q4 sales.",
        right: "<b>Whether</b> the branch stays open or not depends on Q4 sales.",
        tip: "Đầu câu làm chủ ngữ, sau giới từ, trước 'or not' viết liền và trước 'to-V' → chỉ dùng 'whether', KHÔNG dùng 'if'."
      },
      {
        id: "pf_13",
        tag: "Cấm 'Will' Thời gian",
        wrong: "Once the shipment will arrive, we will inspect every crate.",
        right: "Once the shipment <b>arrives</b>, we will inspect every crate.",
        tip: "Trong mệnh đề thời gian & điều kiện (when/once/as soon as/before/until/if) chỉ tương lai, chia Hiện tại đơn, cấm 'will'."
      },
      {
        id: "pf_14",
        tag: "Hạn chót by vs until",
        wrong: "All travel vouchers must be filed until Friday at 5 P.M.",
        right: "All travel vouchers must be filed <b>by</b> Friday at 5 P.M.",
        tip: "'by' = hoàn tất chậm nhất trước hạn chót (submit/finish/pay); 'until' = duy trì liên tục đến mốc dừng (remain open/wait)."
      },
      {
        id: "pf_15",
        tag: "Nhóm Other",
        wrong: "Warranty coverage excludes damages from others brands.",
        right: "Warranty coverage excludes damages from <b>other</b> brands.",
        tip: "Thấy danh từ ngay sau chỗ trống → loại ngay 'others / the others'; dùng 'other + N nhiều' hoặc 'another + N ít'."
      },
      {
        id: "pf_16",
        tag: "Đảo ngữ Điều kiện",
        wrong: "Hadn't we backed up the server, all client data would be lost.",
        right: "<b>Had we not</b> backed up the server, all client data would have been lost.",
        tip: "Đảo ngữ điều kiện bỏ 'If' (Should/Were/Had) và khi phủ định PHẢI đặt 'not' sau chủ ngữ — cấm rút gọn Hadn't/Shouldn't ở đầu câu."
      },
      {
        id: "pf_17",
        tag: "Thức Giả định",
        wrong: "The auditor insisted that every branch submits original receipts.",
        right: "The auditor insisted that every branch <b>submit</b> original receipts.",
        tip: "Sau suggest/recommend/insist/require/mandatory/essential + that + S → luôn dùng V-bare (hoặc 'be + V3'), cấm chia -s/is/was."
      },
      {
        id: "pf_18",
        tag: "Ngoại ĐT 0 Giới từ",
        wrong: "We will discuss about the budget and contact with the vendor.",
        right: "We will <b>discuss</b> the budget and <b>contact</b> the vendor.",
        tip: "discuss, attend, mention, contact, approach, await, comprise, address đi thẳng với Tân ngữ — không thêm about/with/to/for."
      },
      {
        id: "pf_19",
        tag: "Bẫy Most vs Almost",
        wrong: "Almost employees attended the annual cybersecurity workshop.",
        right: "<b>Most</b> employees (hoặc <b>Almost all</b> employees) attended the annual cybersecurity workshop.",
        tip: "'almost' là trạng từ nên KHÔNG đứng trực tiếp trước danh từ — phải đi kèm 'all / every / con số' (almost all, almost 90%)."
      },
      {
        id: "pf_20",
        tag: "Danh từ KĐĐ & Số nhiều",
        wrong: "Several new office equipments were installed on the premise.",
        right: "Several pieces of new office <b>equipment</b> were installed on the <b>premises</b>.",
        tip: "equipment/furniture/merchandise/information/feedback không đếm được (0 -s, V ít); premises/proceeds/earnings/belongings luôn số nhiều."
      }
    ]
  };

  if (typeof window !== "undefined") window.LP_TOEIC_GRAMMAR_CHEATSHEETS = CHEATSHEETS;
  if (typeof module !== "undefined" && module.exports) module.exports = CHEATSHEETS;
})();

/**
 * LinguaPath IELTS Writing Practice Zone Toolkit (v1.0)
 * 100% nội dung học thuật gốc:
 * - Ngân hàng Ý tưởng Task 2 (18 chủ đề lớn: 2 chiều For/Against + Ví dụ + Collocations)
 * - Cẩm nang Paraphrase & Cấu trúc Task 1 (Line/Bar/Pie/Table, Map, Process, Mixed)
 * - Khung dàn ý 5 dạng câu hỏi Task 2
 * - Checklist soát lỗi 4 tiêu chí TR/TA, CC, LR, GRA
 */
(function (global) {
  'use strict';

  var LP_WRITING_TOOLKIT = {
    version: '1.0',

    // =========================================================================
    // 1. CẨM NANG PARAPHRASE & CẤU TRÚC TASK 1 THEO ĐÚNG DẠNG
    // =========================================================================
    task1Paraphrase: {
      line_bar_table: {
        id: 'line_bar_table',
        label: 'Line Graph / Bar Chart / Table / Pie Chart',
        keywords: ['line', 'bar', 'pie', 'table', 'graph', 'chart', 'percentage', 'proportion', 'number', 'amount', 'expenditure', 'sales', 'income', 'population', 'survey', 'figure'],
        introVerbs: [
          'illustrates / depicts / delineates (minh họa / mô tả)',
          'compares ... in terms of ... (so sánh ... xét về mặt ...)',
          'provides a breakdown of ... across ... (cung cấp bảng phân bổ của ... qua ...)',
          'tracks changes in ... over a [X]-year period from ... to ... (theo dõi sự thay đổi ... trong giai đoạn X năm)'
        ],
        overviewFrames: [
          'Overall, it is immediately apparent that [A] experienced an upward trajectory, whereas [B] followed the opposite pattern.',
          'Looking from an overall perspective, [Category X] consistently accounted for the lion’s share of [Metric], while [Category Y] remained the least significant.',
          'In general, the most striking feature is the widening/narrowing gap between [Group A] and [Group B] over the surveyed period.'
        ],
        bodyPhrases: [
          'Tăng mạnh: surged dramatically / climbed steeply / witnessed a pronounced upswing / rose twofold (gấp đôi)',
          'Giảm dần / Rơi sâu: declined steadily / plummeted sharply / suffered a marked contraction / bottomed out at...',
          'Ổn định / Dao động: plateaued at / remained relatively static / fluctuated moderately around...',
          'So sánh & Tỷ trọng: outnumbered ... by a wide margin / stood at roughly a third (33%) / eclipsed ... / was marginally higher than...',
          'Mốc thời gian: By [Year], ... had overtaken ... / Following a brief dip in [Year], figures rebounded to...'
        ],
        band8Structures: [
          'There was a [adj] [noun] in [X], rising from [A] to [B] before levelling off at [C].',
          '[X] saw/experienced a [adj] [noun], with figures climbing by [Y]% over the decade.',
          'While [A] recorded the highest figure at [X], [B] trailed far behind at merely [Y].',
          'Respectively: [A] and [B] accounted for 42% and 28% of total spending, respectively.'
        ],
        commonTraps: [
          'Không suy đoán nguyên nhân ngoài biểu đồ (tránh "because of economic crisis").',
          'Nhất quán đơn vị (%, million, per capita) và thì động từ (quá khứ cho năm đã qua, hiện tại cho bảng tĩnh, "is projected to" cho tương lai).',
          'Overview tuyệt đối không liệt kê số liệu chi tiết; chỉ nêu 2–3 xu hướng/đặc điểm nổi bật nhất.'
        ]
      },

      map: {
        id: 'map',
        label: 'Map / Floor Plan (Bản đồ & Quy hoạch)',
        keywords: ['map', 'plan', 'town', 'city', 'village', 'island', 'school', 'library', 'hospital', 'park', 'redevelopment', 'layout', 'floor', 'site', 'harbour', 'campus'],
        introVerbs: [
          'illustrates the layout of [Place] in [Year 1] and its subsequent transformation by [Year 2]',
          'depicts the current configuration of [Place] alongside proposed redevelopment plans',
          'compares the spatial changes that took place in [Place] over a [X]-year timeframe'
        ],
        overviewFrames: [
          'Overall, [Place] underwent substantial modernisation and urbanisation, shifting from a predominantly rural/residential area into a commercial/recreational hub.',
          'In general, the most notable alterations involved the replacement of green spaces with infrastructure, while [Landmark X] remained virtually unchanged.',
          'Broadly speaking, the proposed renovations aim to enhance accessibility and expand visitor amenities at the expense of [Old Feature].'
        ],
        bodyPhrases: [
          'Phá bỏ / Thay thế: was demolished / knocked down / cleared to make way for ... / was converted into ... / gave way to ...',
          'Xây mới / Mở rộng: was erected / constructed / introduced / underwent significant expansion / was extended eastward',
          'Di dời / Giữ nguyên: was relocated from ... to ... / remained intact / stayed unaltered in the north-west corner',
          'Định vị không gian: to the north-east of / adjacent to / directly opposite / flanked by / running along the southern perimeter / in close proximity to'
        ],
        band8Structures: [
          'Where [Old Feature] once stood, a brand-new [New Feature] has been constructed.',
          'The [Feature] in the northern section was demolished, making room for an expanded [New Feature].',
          'Running horizontally across the centre of the town, the main road was pedestrianised to improve safety.',
          'Dùng thì Hiện tại Hoàn thành (has been replaced) nếu so sánh Quá khứ → Hiện tại; dùng "is slated to / is set to be built" cho bản đồ tương lai.'
        ],
        commonTraps: [
          'Nhóm mô tả theo khu vực địa lý (Bắc–Nam hoặc Trong–Ngoài) thay vì liệt kê rời rạc từng công trình.',
          'Luôn dùng bị động (was built, has been transformed) vì chủ thể xây dựng không quan trọng.',
          'Không nhầm lẫn "to the north of" (nằm bên ngoài phía bắc) và "in the north of" (nằm bên trong phía bắc).'
        ]
      },

      process: {
        id: 'process',
        label: 'Process / Diagram / Life Cycle (Quy trình & Chu trình)',
        keywords: ['process', 'diagram', 'cycle', 'life cycle', 'stages', 'manufactur', 'produc', 'recycl', 'how ', 'system', 'machine', 'flow chart', 'geothermal', 'electricity', 'water', 'brick', 'cement', 'glass', 'paper'],
        introVerbs: [
          'illustrates the sequential stages involved in the production/manufacturing of [Product]',
          'depicts the natural life cycle of [Species], spanning from [Stage 1] to [Final Stage]',
          'outlines how [System/Device] operates to generate/convert [Input] into [Output]'
        ],
        overviewFrames: [
          'Overall, the linear/cyclical process comprises [N] distinct stages, commencing with [First Step] and culminating in [Final Step].',
          'In general, this man-made procedure requires both mechanical processing and thermal treatment before the final product is ready for distribution.',
          'Looking at the diagram as a whole, the biological cycle takes approximately [Duration] to complete and involves [N] major developmental phases.'
        ],
        bodyPhrases: [
          'Khởi đầu: At the initial stage, / The procedure commences when / Initially, raw [X] is extracted/harvested...',
          'Chuyển tiếp: Subsequently, / Once this step is complete, / Following this, / Next, the mixture is transferred via a conveyor belt to...',
          'Song song & Điều kiện: Simultaneously, / While [A] is being heated, [B] is filtered / Prior to packaging, ...',
          'Kết thúc & Lặp lại: Finally, / The process culminates in ... / Ultimately, the cycle repeats itself as...'
        ],
        band8Structures: [
          'Having been thoroughly washed and sorted, the raw materials are fed into a high-temperature furnace.',
          'Once cooled to ambient temperature, the molten glass is moulded into bottles of uniform size.',
          'Quy trình nhân tạo (man-made): ưu tiên Hiện tại đơn bị động (is crushed, are sorted).',
          'Chu trình tự nhiên (natural cycle): ưu tiên Hiện tại đơn chủ động (hatches, migrates, develops into).'
        ],
        commonTraps: [
          'Không bỏ sót bất kỳ mũi tên hay nhãn phụ (nhiệt độ, thời gian, kích thước) nào trên sơ đồ.',
          'Tránh lặp đi lặp lại "Then... Then... Next..." — đa dạng bằng mệnh đề phân từ (Once + V3, Before + V-ing).',
          'Đếm chính xác số bước hoặc phân chia rõ 2 nửa quy trình (ví dụ: Thu hoạch & Sơ chế ở Body 1; Tinh chế & Đóng gói ở Body 2).'
        ]
      },

      mixed: {
        id: 'mixed',
        label: 'Mixed Charts / Multiple Graphs (Biểu đồ kết hợp)',
        keywords: ['mixed', 'multiple', 'two charts', 'two graphs', 'first chart', 'second chart', 'charts below', 'graphs below', 'tables below', 'pie chart and', 'bar chart and', 'line graph and'],
        introVerbs: [
          'The [first chart] illustrates ..., while the [second chart] provides information about ...',
          'The two visuals compare [Metric A] alongside [Metric B] during [Period/Context]'
        ],
        overviewFrames: [
          'Overall, [Main Trend of Chart 1], whereas [Main Trend of Chart 2]. Notably, there appears to be a direct/inverse correlation between the two datasets.',
          'In general, while [Chart 1] highlights a steady increase in [X], [Chart 2] reveals that [Y] constituted the primary driver behind this shift.'
        ],
        bodyPhrases: [
          'Mở Body 1: Turning first to the [first visual], ... / With regard to [Chart 1], ...',
          'Mở Body 2: Shifting focus to the [second visual], ... / As for the accompanying [table/pie chart], ...',
          'Liên kết 2 biểu đồ: This pattern closely mirrors ... / Correspondingly, ... / In stark contrast to the first chart, ...'
        ],
        band8Structures: [
          'Dedicated 1 body paragraph per chart to maintain crystal-clear Cohesion & Coherence (CC).',
          'Link both visuals in the Overview or a brief closing comparison if they share a common subject or country.'
        ],
        commonTraps: [
          'Không cố nhồi nhét tất cả số liệu của cả 2 biểu đồ; chọn lọc 3–4 con số tiêu biểu nhất mỗi biểu đồ.',
          'Đảm bảo Overview bao quát ĐỦ CẢ HAI biểu đồ — nếu thiếu 1 biểu đồ, Task Achievement bị chặn ở Band 5–6.'
        ]
      }
    },

    // =========================================================================
    // 2. KHUNG DÀN Ý 5 DẠNG CÂU HỎI TASK 2
    // =========================================================================
    task2Frameworks: {
      opinion: {
        id: 'opinion',
        label: 'Opinion (Agree / Disagree · Positive / Negative)',
        keywords: ['agree', 'disagree', 'to what extent', 'positive or negative', 'opinion', 'do you think', 'good thing', 'bad thing'],
        blueprint: [
          'Introduction (2 câu): Paraphrase bối cảnh đề bài + Nêu rõ lập trường dứt khoát (strongly agree / largely disagree / partially agree with clear conditions).',
          'Body 1 (1 luận điểm trụ cột): Topic sentence nêu lý do 1 → Giải thích cơ chế (Why/How) → Ví dụ cụ thể → Chốt liên hệ lại đề.',
          'Body 2 (Luận điểm 2 hoặc Nhượng bộ + Phản biện): Nếu nghiêng hẳn 1 phía: nêu lý do 2 sâu hơn. Nếu cân bằng: "Admittedly, [ý đối lập]... Nevertheless, [phản biện sắc bén]".',
          'Conclusion (2 câu): Khẳng định lại lập trường bằng từ ngữ mới + Tóm gọn 2 lý do chính (không thêm ý mới).'
        ],
        signposts: [
          'I firmly contend that ... / While I acknowledge that ..., I remain convinced that ...',
          'A compelling justification for this stance is that ...',
          'Granted, critics may point out that ...; however, this overlooks the fact that ...',
          'In conclusion, for the reasons outlined above, the benefits/drawbacks clearly outweigh...'
        ]
      },
      discussion: {
        id: 'discussion',
        label: 'Discuss Both Views & Give Your Opinion',
        keywords: ['discuss both', 'both views', 'both sides', 'some people think', 'others believe', 'others argue', 'discussion'],
        blueprint: [
          'Introduction (2 câu): Paraphrase 2 luồng quan điểm đối lập + Khẳng định bài viết sẽ phân tích cả hai và nêu rõ nghiêng về phía nào.',
          'Body 1 (Quan điểm bạn KHÔNG/ÍT ủng hộ hơn): Phân tích công bằng, khách quan lý do người ta tin vào phía A (dùng "Proponents of the former view argue that...").',
          'Body 2 (Quan điểm bạn ỦNG HỘ): Dùng cấu trúc chuyển mạnh ("Despite these arguments, I side with those who maintain that...") + 2 lý lẽ thuyết phục kèm ví dụ.',
          'Conclusion (2 câu): Tóm tắt giá trị của cả 2 phía và tái khẳng định quan điểm cá nhân.'
        ],
        signposts: [
          'Advocates of [View A] often cite ... as a primary rationale.',
          'On the other hand, I am more inclined to support the view that ...',
          'Although [View A] holds merit in certain contexts, [View B] offers a more sustainable long-term outcome.'
        ]
      },
      adv_disadv: {
        id: 'adv_disadv',
        label: 'Advantages & Disadvantages (Outweigh)',
        keywords: ['advantage', 'disadvantage', 'outweigh', 'benefit', 'drawback', 'merit', 'demerit'],
        blueprint: [
          'Introduction: Paraphrase xu hướng + Trả lời thẳng câu hỏi "outweigh" (nếu có) ngay từ mở bài.',
          'Body 1 (Phía yếu thế hơn): Phân tích 1–2 lợi ích hoặc hạn chế đáng chú ý nhưng có tính cục bộ/ngắn hạn.',
          'Body 2 (Phía chiếm ưu thế): Phân tích 2 yếu tố cốt lõi có tác động sâu rộng/dài hạn hơn để chứng minh vì sao chúng vượt trội.',
          'Conclusion: Cân đối lại và khẳng định phía nào lớn hơn.'
        ],
        signposts: [
          'Admittedly, this trend brings about several tangible drawbacks/benefits, foremost among which is...',
          'Nevertheless, these concerns are eclipsed by the far-reaching advantages of...',
          'Weighing both sides, the long-term gains demonstrably surpass the initial setbacks.'
        ]
      },
      problem_solution: {
        id: 'problem_solution',
        label: 'Problems / Causes & Solutions',
        keywords: ['cause', 'reason', 'problem', 'issue', 'solution', 'measure', 'tackle', 'solve', 'what can be done'],
        blueprint: [
          'Introduction: Paraphrase thực trạng đáng lo ngại + Nêu ngắn gọn bài viết sẽ mổ xẻ nguyên nhân/hệ quả và đề xuất giải pháp khả thi.',
          'Body 1 (Causes hoặc Problems — 2 ý sắc nét): Tránh liệt kê lan man 4–5 ý; chọn 2 nguyên nhân/hệ quả gốc rễ và đào sâu cơ chế.',
          'Body 2 (Solutions — tương ứng trực tiếp với Body 1): Gắn rõ chủ thể hành động (Chính phủ: luật/thuế/hạ tầng; Cá nhân/Doanh nghiệp: nhận thức/thói quen).',
          'Conclusion: Nhấn mạnh cần sự phối hợp đồng bộ giữa các bên để giải quyết tận gốc.'
        ],
        signposts: [
          'This alarming phenomenon stems primarily from two interconnected factors: ...',
          'To mitigate these repercussions, a multi-pronged approach is required.',
          'First and foremost, policymakers should enact stringent regulations / subsidise ...',
          'Complementing state intervention, public awareness campaigns can encourage citizens to...'
        ]
      },
      two_part: {
        id: 'two_part',
        label: 'Two-Part / Direct Questions',
        keywords: ['why is this', 'what effect', 'how does', 'two-part', 'multi'],
        blueprint: [
          'Introduction: Paraphrase bối cảnh + Trả lời sơ lược CẢ HAI câu hỏi trong Thesis Statement.',
          'Body 1: Trả lời trọn vẹn Câu hỏi 1 (2 ý rõ ràng + giải thích + ví dụ).',
          'Body 2: Trả lời trọn vẹn Câu hỏi 2 (đảm bảo cân xứng dung lượng với Body 1).',
          'Conclusion: Tóm tắt câu trả lời cho cả hai vế hỏi.'
        ],
        signposts: [
          'Regarding the first question, the underlying catalyst for this shift is...',
          'Turning to the second issue, this development carries profound implications for...'
        ]
      }
    },

    // =========================================================================
    // 3. NGÂN HÀNG Ý TƯỞNG TASK 2 (18 CHỦ ĐỀ LỚN — 2 CHIỀU + VÍ DỤ + COLLOCATIONS)
    // =========================================================================
    task2Ideas: [
      {
        id: 'education',
        label: 'Education & Schooling (Giáo dục & Học đường)',
        keywords: ['school', 'educat', 'student', 'teacher', 'universit', 'college', 'curriculum', 'exam', 'homework', 'tuition', 'degree', 'learn', 'study', 'academic', 'literacy', 'foreign language'],
        forArgs: [
          'Phát triển tư duy phản biện, năng lực giải quyết vấn đề và khả năng thích ứng dài hạn thay vì học vẹt ngắn hạn.',
          'Giáo dục công lập/miễn phí thu hẹp khoảng cách giàu nghèo, tạo cơ hội dịch chuyển xã hội (upward social mobility) cho học sinh vùng khó khăn.',
          'Ứng dụng công nghệ và học trực tuyến cá nhân hóa tốc độ học, mở rộng tiếp cận tri thức toàn cầu với chi phí thấp.'
        ],
        againstArgs: [
          'Áp lực thi cử chuẩn hóa quá mức dễ triệt tiêu sáng tạo, gây kiệt sức tinh thần ở tuổi vị thành niên.',
          'Học hoàn toàn trực tuyến thiếu tương tác trực diện, làm suy giảm kỹ năng giao tiếp, kỷ luật tự giác và sự kèm cặp sát sao từ giáo viên.',
          'Miễn học phí đại học đại trà có thể tạo gánh nặng ngân sách và làm giảm giá trị bằng cấp nếu đầu vào không được kiểm soát.'
        ],
        examples: [
          'Hệ thống giáo dục Phần Lan giảm bài tập về nhà và thi chuẩn hóa nhưng vẫn đứng nhóm đầu PISA nhờ chú trọng học theo dự án.',
          'Các khóa học MOOCs (Coursera, edX) giúp sinh viên ở các nước đang phát triển tiếp cận bài giảng từ MIT hay Oxford với chi phí rất thấp.'
        ],
        collocations: [
          { en: 'holistic development', vi: 'phát triển toàn diện' },
          { en: 'rote memorisation', vi: 'học vẹt máy móc' },
          { en: 'upward social mobility', vi: 'dịch chuyển xã hội đi lên' },
          { en: 'vocational training', vi: 'đào tạo nghề thực tiễn' },
          { en: 'standardised testing', vi: 'thi cử chuẩn hóa' },
          { en: 'lifelong learning mindset', vi: 'tư duy học tập suốt đời' },
          { en: 'bridging the educational divide', vi: 'thu hẹp khoảng cách giáo dục' }
        ]
      },
      {
        id: 'environment',
        label: 'Environment & Climate Change (Môi trường & Khí hậu)',
        keywords: ['environment', 'climate', 'pollut', 'emission', 'carbon', 'waste', 'plastic', 'recycl', 'renewable', 'fossil', 'global warming', 'deforest', 'green', 'energy', 'eco'],
        forArgs: [
          'Chuyển dịch sang năng lượng tái tạo và đánh thuế carbon tạo đòn bẩy kinh tế buộc doanh nghiệp cắt giảm phát thải nhà kính.',
          'Bảo vệ hệ sinh thái giúp giảm thiểu thiên tai cực đoan, bảo đảm an ninh lương thực và sức khỏe cộng đồng về dài hạn.',
          'Trách nhiệm cá nhân (giảm nhựa dùng một lần, đi phương tiện công cộng) tạo hiệu ứng cộng hưởng và áp lực thị trường lên nhà sản xuất.'
        ],
        againstArgs: [
          'Chính sách môi trường quá khắt khe trong ngắn hạn có thể làm tăng chi phí sản xuất, gây mất việc làm ở các ngành công nghiệp truyền thống.',
          'Các quốc gia đang phát triển cần nguồn năng lượng giá rẻ để xóa đói giảm nghèo nên khó đạt mục tiêu phát thải ròng bằng 0 cùng tốc độ với nước giàu.',
          'Chỉ trông chờ vào ý thức cá nhân là chưa đủ nếu thiếu khung pháp lý mạnh mẽ kiểm soát các tập đoàn phát thải lớn.'
        ],
        examples: [
          'Đan Mạch đầu tư mạnh vào điện gió ngoài khơi và hiện tạo ra hơn một nửa sản lượng điện từ năng lượng gió.',
          'Chính sách thu phí túi ni-lông tại Anh và Ireland đã giúp giảm hơn 80% lượng túi nhựa sử dụng một lần chỉ trong vài năm.'
        ],
        collocations: [
          { en: 'mitigate climate change', vi: 'giảm thiểu biến đổi khí hậu' },
          { en: 'carbon footprint', vi: 'dấu chân carbon' },
          { en: 'stringent environmental regulations', vi: 'quy định môi trường nghiêm ngặt' },
          { en: 'non-biodegradable waste', vi: 'rác thải khó phân hủy sinh học' },
          { en: 'transition to renewable energy', vi: 'chuyển dịch sang năng lượng tái tạo' },
          { en: 'irreversible ecological damage', vi: 'tổn hại sinh thái không thể đảo ngược' },
          { en: 'circular economy', vi: 'kinh tế tuần hoàn' }
        ]
      },
      {
        id: 'technology',
        label: 'Technology, AI & Digital Life (Công nghệ & AI)',
        keywords: ['technolog', 'internet', 'computer', 'smartphone', 'phone', 'artificial intelligence', 'robot', 'automat', 'digital', 'screen', 'online', 'cyber', 'data', 'privacy', 'device'],
        forArgs: [
          'Tự động hóa và AI giải phóng con người khỏi công việc lặp lại nguy hiểm, tăng năng suất lao động và hỗ trợ chẩn đoán y khoa chính xác hơn.',
          'Internet xóa nhòa rào cản địa lý, giúp làm việc từ xa, kết nối gia đình xuyên biên giới và phổ cập tri thức tức thì.',
          'Thương mại điện tử và ngân hàng số thúc đẩy tăng trưởng kinh tế và tối ưu hóa chuỗi cung ứng.'
        ],
        againstArgs: [
          'Nguy cơ thay thế hàng loạt việc làm trình độ thấp và trung bình, làm trầm trọng thêm bất bình đẳng thu nhập nếu không kịp đào tạo lại.',
          'Lệ thuộc màn hình gây lối sống ít vận động, rối loạn giấc ngủ, suy giảm khả năng tập trung sâu và cô lập xã hội.',
          'Rủi ro rò rỉ dữ liệu cá nhân, lừa đảo trực tuyến và lan truyền tin giả (misinformation) khó kiểm soát.'
        ],
        examples: [
          'Hệ thống AI hỗ trợ đọc ảnh X-quang tại nhiều bệnh viện lớn giúp bác sĩ phát hiện sớm khối u với độ chính xác cao và rút ngắn thời gian chờ.',
          'Nhiều trường học tại Pháp và Hà Lan đã hạn chế điện thoại thông minh trong lớp để cải thiện khả năng tập trung của học sinh.'
        ],
        collocations: [
          { en: 'technological displacement', vi: 'sự thay thế lao động do công nghệ' },
          { en: 'digital literacy', vi: 'năng lực số' },
          { en: 'data privacy breaches', vi: 'rò rỉ quyền riêng tư dữ liệu' },
          { en: 'ubiquitous connectivity', vi: 'kết nối phổ khắp mọi nơi' },
          { en: 'reskill the workforce', vi: 'đào tạo lại lực lượng lao động' },
          { en: 'algorithmic echo chambers', vi: 'buồng vang thuật toán' },
          { en: 'sedentary digital habits', vi: 'thói quen số ít vận động' }
        ]
      },
      {
        id: 'health',
        label: 'Health, Diet & Lifestyle (Sức khỏe & Lối sống)',
        keywords: ['health', 'hospital', 'doctor', 'medic', 'disease', 'diet', 'fast food', 'obesity', 'exercis', 'fitness', 'mental', 'stress', 'sleep', 'smoking', 'sugar', 'public health'],
        forArgs: [
          'Đầu tư y tế dự phòng (tiêm chủng, giáo dục dinh dưỡng, công viên công cộng) tiết kiệm chi phí điều trị khổng lồ cho ngân sách về lâu dài.',
          'Đánh thuế đồ uống nhiều đường và dán nhãn dinh dưỡng rõ ràng giúp người tiêu dùng điều chỉnh hành vi ăn uống lành mạnh hơn.',
          'Khuyến khích thể thao cộng đồng đồng thời cải thiện sức khỏe thể chất lẫn giảm tỷ lệ trầm cảm, lo âu.'
        ],
        againstArgs: [
          'Thuế thực phẩm không lành mạnh có thể tác động nặng hơn lên nhóm thu nhập thấp vốn ít lựa chọn thực phẩm tươi giá rẻ.',
          'Thay đổi thói quen cá nhân đòi hỏi động lực nội tại; các lệnh cấm cứng nhắc từ nhà nước dễ gây phản ứng ngược về quyền tự do lựa chọn.',
          'Chi phí y tế hiện đại tăng nhanh do già hóa dân số nên cần kết hợp bảo hiểm công và khu vực tư nhân.'
        ],
        examples: [
          'Thuế đường (Sugar Tax) áp dụng tại Anh từ năm 2018 đã thúc đẩy nhiều hãng nước giải khát chủ động giảm hàm lượng đường trong công thức.',
          'Mô hình đi bộ và đạp xe hằng ngày kết hợp chế độ ăn ít thực phẩm chế biến sẵn giúp Nhật Bản duy trì tuổi thọ trung bình cao hàng đầu thế giới.'
        ],
        collocations: [
          { en: 'preventive healthcare', vi: 'y tế dự phòng' },
          { en: 'sedentary lifestyle', vi: 'lối sống ít vận động' },
          { en: 'chronic non-communicable diseases', vi: 'bệnh mạn tính không lây' },
          { en: 'nutritional awareness', vi: 'nhận thức dinh dưỡng' },
          { en: 'strain on public healthcare systems', vi: 'áp lực lên hệ thống y tế công' },
          { en: 'mental well-being', vi: 'sức khỏe tinh thần' },
          { en: 'ultra-processed foods', vi: 'thực phẩm siêu chế biến' }
        ]
      },
      {
        id: 'work',
        label: 'Work, Careers & Economy (Công việc & Kinh tế)',
        keywords: ['work', 'job', 'career', 'employ', 'unemploy', 'salary', 'wage', 'income', 'company', 'business', 'retire', 'remote', 'work-life', 'economy', 'economic', 'money', 'wealth'],
        forArgs: [
          'Làm việc linh hoạt (hybrid/remote) cắt giảm thời gian di chuyển, nâng cao cân bằng công việc–cuộc sống và mở rộng nguồn nhân lực toàn cầu.',
          'Chuyển đổi nghề nghiệp hoặc khởi nghiệp giúp người lao động thích nghi với biến động thị trường và phát huy đam mê.',
          'Mức lương công bằng và phúc lợi tốt giúp tăng lòng trung thành nhân viên, giảm tỷ lệ nghỉ việc và nâng cao năng suất doanh nghiệp.'
        ],
        againstArgs: [
          'Làm việc từ xa kéo dài làm mờ ranh giới giờ nghỉ, giảm sự gắn kết văn hóa đội nhóm và gây khó khăn cho nhân sự mới cần kèm cặp.',
          'Theo đuổi mức lương cao bằng mọi giá dễ dẫn đến kiệt sức nghề nghiệp (burnout) và đánh đổi thời gian cho gia đình.',
          'Tăng lương tối thiểu đột ngột không đi kèm tăng năng suất có thể khiến doanh nghiệp nhỏ thu hẹp tuyển dụng.'
        ],
        examples: [
          'Thử nghiệm tuần làm việc 4 ngày tại Anh cho thấy phần lớn doanh nghiệp tham gia duy trì doanh thu ổn định trong khi tỷ lệ nhân viên căng thẳng giảm mạnh.',
          'Nhiều tập đoàn công nghệ áp dụng mô hình hybrid (3 ngày văn phòng, 2 ngày tại nhà) để cân bằng hiệu suất hợp tác và sự linh hoạt.'
        ],
        collocations: [
          { en: 'work-life equilibrium', vi: 'cân bằng công việc và cuộc sống' },
          { en: 'occupational burnout', vi: 'kiệt sức nghề nghiệp' },
          { en: 'job satisfaction', vi: 'sự hài lòng trong công việc' },
          { en: 'remote working arrangements', vi: 'hình thức làm việc từ xa' },
          { en: 'competitive remuneration', vi: 'chế độ đãi ngộ cạnh tranh' },
          { en: 'career progression', vi: 'thăng tiến sự nghiệp' },
          { en: 'labour market volatility', vi: 'biến động thị trường lao động' }
        ]
      },
      {
        id: 'government',
        label: 'Government & Public Spending (Chính phủ & Ngân sách công)',
        keywords: ['government', 'tax', 'public spending', 'fund', 'subsid', 'budget', 'state', 'policy', 'authority', 'welfare', 'charity', 'aid', 'foreign aid'],
        forArgs: [
          'Ưu tiên ngân sách cho hạ tầng thiết yếu (y tế, giáo dục, giao thông công cộng) mang lại lợi ích trực tiếp và công bằng nhất cho toàn dân.',
          'Đầu tư công vào nghiên cứu khoa học cơ bản và nghệ thuật nuôi dưỡng bản sắc văn hóa và tạo đột phá mà khu vực tư nhân ngại mạo hiểm.',
          'Viện trợ quốc tế giúp ổn định khu vực, kiểm soát dịch bệnh xuyên biên giới và xây dựng quan hệ ngoại giao bền vững.'
        ],
        againstArgs: [
          'Ngân sách nhà nước hữu hạn; chi tiêu dàn trải cho các dự án biểu tượng làm giảm nguồn lực cho an sinh xã hội cấp bách.',
          'Tăng thuế quá cao để mở rộng chi tiêu công có thể làm giảm động lực đầu tư tư nhân và gây chảy máu vốn.',
          'Trợ cấp thiếu giám sát dễ phát sinh lãng phí, quan liêu và tâm lý ỷ lại.'
        ],
        examples: [
          'Singapore đầu tư mạnh ngân sách công vào nhà ở xã hội (HDB) và hệ thống tàu điện MRT, giúp đa số người dân có chỗ ở ổn định.',
          'Việc chính phủ Mỹ tài trợ nghiên cứu nền tảng từ thập niên 1960–1980 đã đặt nền móng cho Internet và GPS ngày nay.'
        ],
        collocations: [
          { en: 'allocate public funds', vi: 'phân bổ ngân sách công' },
          { en: 'fiscal responsibility', vi: 'trách nhiệm tài khóa' },
          { en: 'essential public infrastructure', vi: 'hạ tầng công cộng thiết yếu' },
          { en: 'taxpayers’ money', vi: 'tiền thuế của người dân' },
          { en: 'social safety net', vi: 'mạng lưới an sinh xã hội' },
          { en: 'public-private partnership', vi: 'hợp tác công - tư' }
        ]
      },
      {
        id: 'transport',
        label: 'Transport & Urbanisation (Giao thông & Đô thị hóa)',
        keywords: ['traffic', 'transport', 'car', 'vehicle', 'road', 'congestion', 'public transport', 'city', 'urban', 'rural', 'commut', 'bicycle', 'train', 'flight', 'aviation'],
        forArgs: [
          'Mở rộng tàu điện, xe buýt nhanh và làn xe đạp giúp giảm ùn tắc giao thông, cắt giảm bụi mịn và tiết kiệm thời gian đi lại.',
          'Thu phí tắc nghẽn (congestion charge) ở khu trung tâm vừa hạn chế xe cá nhân vừa tạo nguồn thu tái đầu tư vào giao thông công cộng.',
          'Đô thị hóa tập trung thúc đẩy tăng trưởng kinh tế, cung cấp dịch vụ y tế–giáo dục chất lượng cao và cơ hội việc làm đa dạng.'
        ],
        againstArgs: [
          'Tăng giá nhiên liệu hoặc cấm xe cá nhân khi hạ tầng công cộng chưa phủ kín gây bất tiện lớn cho người dân vùng ngoại ô.',
          'Đô thị hóa quá nhanh tạo áp lực nặng nề lên giá nhà ở, nguồn nước sạch, không gian xanh và rác thải đô thị.',
          'Phát triển vùng nông thôn và thành phố vệ tinh là giải pháp bền vững hơn so với chỉ mở rộng đường trong nội đô.'
        ],
        examples: [
          'London áp dụng phí tắc nghẽn trung tâm (Congestion Charge) giúp giảm rõ rệt lưu lượng xe cá nhân và tăng nguồn ngân sách cho mạng lưới xe buýt.',
          'Hà Lan xây dựng hệ thống đường xe đạp tách biệt an toàn khiến xe đạp trở thành phương tiện đi làm hằng ngày phổ biến nhất.'
        ],
        collocations: [
          { en: 'alleviate traffic congestion', vi: 'giảm thiểu ùn tắc giao thông' },
          { en: 'public transit network', vi: 'mạng lưới giao thông công cộng' },
          { en: 'rapid urbanisation', vi: 'đô thị hóa nhanh chóng' },
          { en: 'rural-to-urban migration', vi: 'di cư từ nông thôn ra thành thị' },
          { en: 'sustainable urban planning', vi: 'quy hoạch đô thị bền vững' },
          { en: 'commuting bottlenecks', vi: 'điểm nghẽn giao thông giờ cao điểm' }
        ]
      },
      {
        id: 'crime',
        label: 'Crime, Law & Justice (Tội phạm & Pháp luật)',
        keywords: ['crime', 'criminal', 'prison', 'jail', 'police', 'punish', 'law', 'court', 'illegal', 'offend', 'juvenile', 'rehabilitat', 'sentence', 'cctv', 'surveillance'],
        forArgs: [
          'Hình phạt nghiêm khắc đóng vai trò răn đe (deterrence), bảo vệ cộng đồng khỏi tội phạm nguy hiểm và duy trì trật tự pháp quyền.',
          'Cải tạo, giáo dục nghề và hỗ trợ tâm lý trong trại giam giúp giảm mạnh tỷ lệ tái phạm (recidivism) sau khi mãn hạn tù.',
          'Giải quyết gốc rễ tội phạm (nghèo đói, thất nghiệp, bỏ học) hiệu quả và nhân văn hơn việc chỉ tăng án tù.'
        ],
        againstArgs: [
          'Án tù dài hạn tốn kém ngân sách khổng lồ và có thể biến người phạm tội nhẹ thành tội phạm chuyên nghiệp trong môi trường nhà tù.',
          'Giám sát bằng camera (CCTV) dày đặc giúp phá án nhanh hơn nhưng làm dấy lên lo ngại xâm phạm quyền riêng tư công dân.',
          'Bỏ qua trách nhiệm cá nhân khi quá nhấn mạnh hoàn cảnh xã hội có thể làm suy giảm tính công bằng của pháp luật.'
        ],
        examples: [
          'Na Uy tập trung vào mô hình nhà tù phục hồi kết hợp đào tạo nghề và ghi nhận tỷ lệ tái phạm thuộc nhóm thấp nhất thế giới (~20%).',
          'Các chương trình lao động công ích (community service) giúp người phạm tội lần đầu bồi đắp cho xã hội thay vì mất việc và tách khỏi gia đình.'
        ],
        collocations: [
          { en: 'act as a strong deterrent', vi: 'đóng vai trò răn đe mạnh mẽ' },
          { en: 'curb recidivism rates', vi: 'kéo giảm tỷ lệ tái phạm' },
          { en: 'rehabilitation programmes', vi: 'chương trình cải tạo hòa nhập' },
          { en: 'root causes of delinquency', vi: 'nguyên nhân gốc rễ của phạm pháp' },
          { en: 'law-abiding citizens', vi: 'công dân tuân thủ pháp luật' },
          { en: 'juvenile offenders', vi: 'người phạm tội vị thành niên' }
        ]
      },
      {
        id: 'media',
        label: 'Media, News & Advertising (Truyền thông & Quảng cáo)',
        keywords: ['media', 'news', 'newspaper', 'television', 'tv', 'advertis', 'commercial', 'social media', 'celebrity', 'influencer', 'journalis', 'fake news', 'broadcast'],
        forArgs: [
          'Quảng cáo giúp người tiêu dùng biết tới sản phẩm mới, thúc đẩy cạnh tranh lành mạnh giữa doanh nghiệp và tài trợ cho nội dung miễn phí.',
          'Truyền thông số và mạng xã hội dân chủ hóa thông tin, giúp tin tức khẩn cấp lan truyền tức thời và tạo diễn đàn cho cộng đồng.',
          'Báo chí điều tra uy tín giữ vai trò giám sát xã hội, phanh phui sai phạm và nâng cao dân trí.'
        ],
        againstArgs: [
          'Quảng cáo nhắm vào trẻ em hoặc thổi phồng công dụng thúc đẩy chủ nghĩa tiêu dùng quá mức và thói quen ăn uống kém lành mạnh.',
          'Mạng xã hội ưu tiên nội dung giật gân gây lan truyền tin giả, phân cực dư luận và áp lực ngoại hình ở giới trẻ.',
          'Văn hóa thần tượng người nổi tiếng quá đà có thể truyền tải giá trị vật chất lệch lạc cho thanh thiếu niên.'
        ],
        examples: [
          'Nhiều quốc gia châu Âu cấm quảng cáo đồ ăn nhanh và nước ngọt trong khung giờ chương trình thiếu nhi để hạn chế béo phì trẻ em.',
          'Các hãng tin lâu đời như BBC hay Reuters áp dụng quy trình kiểm chứng chéo nhiều nguồn để đối phó với tin giả trực tuyến.'
        ],
        collocations: [
          { en: 'consumerist culture', vi: 'văn hóa tiêu dùng' },
          { en: 'sensationalised headlines', vi: 'tiêu đề giật gân câu khách' },
          { en: 'misinformation and disinformation', vi: 'thông tin sai lệch và xuyên tạc' },
          { en: 'targeted advertising', vi: 'quảng cáo nhắm mục tiêu' },
          { en: 'media literacy', vi: 'năng lực đọc hiểu truyền thông' },
          { en: 'editorial integrity', vi: 'tính liêm chính báo chí' }
        ]
      },
      {
        id: 'family',
        label: 'Family, Children & Generations (Gia đình & Thế hệ)',
        keywords: ['parent', 'child', 'kid', 'teen', 'youth', 'young people', 'family', 'elderly', 'older people', 'ageing', 'aging', 'generation', 'childcare', 'upbringing'],
        forArgs: [
          'Gia đình hạt nhân và việc sinh con muộn giúp cha mẹ chuẩn bị tài chính vững vàng hơn và có sự trưởng thành tâm lý khi nuôi dạy con.',
          'Đầu tư chăm sóc người cao tuổi và tôn vinh kinh nghiệm sống của thế hệ đi trước tạo nên xã hội gắn kết và nhân văn.',
          'Trao cho trẻ em sự tự lập có định hướng giúp phát triển kỹ năng giải quyết vấn đề và sự tự tin sớm.'
        ],
        againstArgs: [
          'Nhịp sống bận rộn làm giảm thời gian quây quần gia đình, dễ tạo khoảng cách thế hệ và khiến trẻ lệ thuộc thiết bị điện tử.',
          'Già hóa dân số nhanh gây áp lực lên quỹ hưu trí, dịch vụ y tế và thiếu hụt lực lượng lao động trẻ.',
          'Nuôi dạy quá bao bọc (helicopter parenting) cản trở trẻ rèn luyện bản lĩnh trước thất bại.'
        ],
        examples: [
          'Chính sách nghỉ thai sản có lương cho cả cha và mẹ tại Thụy Điển khuyến khích sự san sẻ trách nhiệm nuôi con bình đẳng.',
          'Tại Nhật Bản, nhiều trung tâm cộng đồng kết hợp nhà trẻ và câu lạc bộ người cao tuổi giúp giảm cô đơn ở người già và nuôi dưỡng sự đồng cảm cho trẻ nhỏ.'
        ],
        collocations: [
          { en: 'intergenerational bond', vi: 'sự gắn kết giữa các thế hệ' },
          { en: 'ageing population', vi: 'dân số già hóa' },
          { en: 'parental guidance', vi: 'sự định hướng của cha mẹ' },
          { en: 'nuclear vs extended family', vi: 'gia đình hạt nhân và gia đình đa thế hệ' },
          { en: 'formative years', vi: 'những năm tháng định hình nhân cách' },
          { en: 'filial responsibility', vi: 'trách nhiệm hiếu thảo' }
        ]
      },
      {
        id: 'culture',
        label: 'Culture, Art, Language & Heritage (Văn hóa, Nghệ thuật & Ngôn ngữ)',
        keywords: ['cultur', 'art', 'artist', 'museum', 'music', 'heritage', 'tradition', 'historic', 'history', 'language', 'die out', 'custom', 'festival', 'film', 'book', 'literature'],
        forArgs: [
          'Bảo tồn di sản, bảo tàng và ngôn ngữ thiểu số gìn giữ ký ức lịch sử, bản sắc cộng đồng và kho tàng tri thức bản địa độc đáo.',
          'Nghệ thuật và âm nhạc nuôi dưỡng trí tưởng tượng, sức khỏe cảm xúc và tạo động lực cho ngành công nghiệp sáng tạo (du lịch văn hóa).',
          'Ngôn ngữ chung toàn cầu (như tiếng Anh) giúp tăng tốc hợp tác khoa học, thương mại và hiểu biết xuyên biên giới.'
        ],
        againstArgs: [
          'Trong bối cảnh ngân sách eo hẹp, trợ cấp quá lớn cho nghệ thuật hàn lâm có thể bị xem là kém cấp thiết hơn y tế và giáo dục cơ bản.',
          'Sự thống trị của một vài ngôn ngữ lớn và văn hóa đại chúng toàn cầu có nguy cơ gây đồng hóa văn hóa (cultural homogenisation).',
          'Bảo tồn công trình cổ bằng mọi giá đôi khi cản trở việc xây dựng nhà ở hiện đại và nâng cấp hạ tầng đô thị.'
        ],
        examples: [
          'Bảo tàng Anh (British Museum) mở cửa miễn phí giúp hàng triệu người dân và du khách tiếp cận di sản nhân loại mà không rào cản tài chính.',
          'Nỗ lực phục hồi tiếng Wales qua hệ thống trường song ngữ đã giúp ngôn ngữ này thoát khỏi nguy cơ mai một.'
        ],
        collocations: [
          { en: 'cultural heritage preservation', vi: 'bảo tồn di sản văn hóa' },
          { en: 'linguistic diversity', vi: 'đa dạng ngôn ngữ' },
          { en: 'cultural homogenisation', vi: 'sự đồng hóa văn hóa' },
          { en: 'sense of collective identity', vi: 'ý thức bản sắc cộng đồng' },
          { en: 'creative industries', vi: 'các ngành công nghiệp sáng tạo' },
          { en: 'indigenous traditions', vi: 'truyền thống bản địa' }
        ]
      },
      {
        id: 'society',
        label: 'Society, Inequality & Community (Xã hội & Cộng đồng)',
        keywords: ['society', 'social', 'community', 'gap', 'inequal', 'poverty', 'rich', 'poor', 'volunteer', 'community service', 'shopping', 'consumer', 'fashion', 'gender', 'equal'],
        forArgs: [
          'Hoạt động tình nguyện và phục vụ cộng đồng rèn luyện lòng trắc ẩn, tinh thần công dân và gắn kết các nhóm xã hội.',
          'Thu hẹp bất bình đẳng qua thuế lũy tiến và giáo dục công giúp ổn định xã hội và kích thích tiêu dùng bền vững.',
          'Bình đẳng giới trong lãnh đạo và lao động khai thác trọn vẹn tiềm năng nhân lực của quốc gia.'
        ],
        againstArgs: [
          'Chủ nghĩa cá nhân cực đoan và văn hóa mua sắm nhanh làm xói mòn tình làng nghĩa xóm và tạo gánh nặng rác thải.',
          'Ép buộc hoạt động cộng đồng không trả lương đôi khi mang tính hình thức nếu người tham gia thiếu động lực thực sự.',
          'Khoảng cách giàu nghèo kéo dài dễ dẫn tới bất ổn xã hội và gia tăng tỷ lệ tội phạm.'
        ],
        examples: [
          'Các chương trình học bổng và hỗ trợ bữa ăn học đường tại nhiều quốc gia giúp trẻ em gia đình thu nhập thấp duy trì tỷ lệ đến trường.',
          'Trào lưu thời trang bền vững và cửa hàng đồ cũ đang góp phần giảm lãng phí tiêu dùng ở giới trẻ thành thị.'
        ],
        collocations: [
          { en: 'social cohesion', vi: 'sự gắn kết xã hội' },
          { en: 'socio-economic disparity', vi: 'chênh lệch kinh tế - xã hội' },
          { en: 'civic engagement', vi: 'sự tham gia đóng góp cộng đồng' },
          { en: 'grassroots initiatives', vi: 'sáng kiến từ cơ sở cộng đồng' },
          { en: 'materialistic mindset', vi: 'tư duy nặng vật chất' },
          { en: 'equal opportunities', vi: 'cơ hội bình đẳng' }
        ]
      },
      {
        id: 'globalisation',
        label: 'Globalisation & Tourism (Toàn cầu hóa & Du lịch)',
        keywords: ['global', 'international', 'touris', 'travel', 'holiday', 'vacation', 'multinational', 'import', 'export', 'foreign', 'abroad', 'migrat'],
        forArgs: [
          'Du lịch quốc tế tạo nguồn thu ngoại tệ, việc làm địa phương và thúc đẩy sự thấu hiểu đa văn hóa giữa các dân tộc.',
          'Toàn cầu hóa mở rộng thị trường xuất khẩu, thu hút đầu tư công nghệ và hạ giá hàng hóa cho người tiêu dùng.',
          'Du học và trao đổi nhân lực quốc tế đẩy nhanh tiến bộ khoa học và đổi mới sáng tạo.'
        ],
        againstArgs: [
          'Du lịch quá tải (overtourism) gây hủy hoại cảnh quan tự nhiên, đội giá sinh hoạt của người dân bản địa và thương mại hóa văn hóa.',
          'Tập đoàn đa quốc gia có thể lấn át doanh nghiệp nhỏ địa phương và tạo ra sự phụ thuộc vào chuỗi cung ứng nước ngoài.',
          'Hàng không giá rẻ làm gia tăng nhanh lượng khí thải carbon toàn cầu.'
        ],
        examples: [
          'Thành phố Venice (Ý) đã triển khai thu phí vào cửa ngày cao điểm và hạn chế tàu du lịch cỡ lớn nhằm bảo vệ di sản khỏi tình trạng quá tải.',
          'Du lịch sinh thái (ecotourism) tại Costa Rica gắn nguồn thu du khách trực tiếp với quỹ bảo vệ rừng mưa nhiệt đới.'
        ],
        collocations: [
          { en: 'overtourism and environmental strain', vi: 'du lịch quá tải và áp lực môi trường' },
          { en: 'cross-cultural understanding', vi: 'thấu hiểu liên văn hóa' },
          { en: 'sustainable ecotourism', vi: 'du lịch sinh thái bền vững' },
          { en: 'economic interdependence', vi: 'sự phụ thuộc kinh tế lẫn nhau' },
          { en: 'local small-scale enterprises', vi: 'doanh nghiệp nhỏ địa phương' },
          { en: 'brain drain', vi: 'chảy máu chất xám' }
        ]
      },
      {
        id: 'animals',
        label: 'Animals & Wildlife Conservation (Động vật & Bảo tồn)',
        keywords: ['animal', 'wildlife', 'species', 'endangered', 'zoo', 'pet', 'extinct', 'biodiversity', 'experiment', 'testing', 'vegetar', 'meat'],
        forArgs: [
          'Bảo tồn loài nguy cấp duy trì cân bằng hệ sinh thái, chuỗi thức ăn và nguồn gen quý giá cho y học tương lai.',
          'Các sở thú hiện đại đạt chuẩn tham gia nhân giống bảo tồn, cứu hộ động vật hoang dã và giáo dục thế hệ trẻ về thiên nhiên.',
          'Phát triển mô hình thử nghiệm thay thế (mô phỏng máy tính, nuôi cấy tế bào) giúp giảm dần việc thử nghiệm trên động vật.'
        ],
        againstArgs: [
          'Nuôi nhốt động vật hoang dã trong không gian chật hẹp chỉ nhằm mục đích giải trí vi phạm phúc lợi động vật và làm mất bản năng tự nhiên.',
          'Một số ý kiến cho rằng nguồn lực tài chính nên ưu tiên xóa đói giảm nghèo cho con người thay vì chi tiêu quá lớn cho một số loài đơn lẻ.',
          'Trong nghiên cứu dược phẩm đặc thù, một số giai đoạn kiểm nghiệm sinh học vẫn chưa có phương pháp thay thế hoàn toàn.'
        ],
        examples: [
          'Chương trình bảo tồn gấu trúc lớn tại Trung Quốc kết hợp khôi phục rừng tre đã giúp loài này thoát khỏi danh sách "Nguy cấp" xuống "Sắp nguy cấp".',
          'Liên minh châu Âu đã cấm thử nghiệm mỹ phẩm trên động vật từ năm 2013, thúc đẩy các phương pháp kiểm nghiệm in-vitro.'
        ],
        collocations: [
          { en: 'biodiversity conservation', vi: 'bảo tồn đa dạng sinh học' },
          { en: 'ecological equilibrium', vi: 'cân bằng sinh thái' },
          { en: 'habitat destruction', vi: 'phá hủy môi trường sống' },
          { en: 'captive breeding programmes', vi: 'chương trình nhân giống bảo tồn' },
          { en: 'animal welfare standards', vi: 'tiêu chuẩn phúc lợi động vật' },
          { en: 'on the brink of extinction', vi: 'bên bờ vực tuyệt chủng' }
        ]
      },
      {
        id: 'housing',
        label: 'Housing, Architecture & Space (Nhà ở & Kiến trúc)',
        keywords: ['house', 'housing', 'building', 'architect', 'home', 'apartment', 'flat', 'skyscraper', 'rent', 'accommodation', 'design', 'historic building'],
        forArgs: [
          'Kiến trúc công trình cần ưu tiên công năng, tiết kiệm năng lượng và không gian sống thoải mái cho cư dân.',
          'Nhà cao tầng và chung cư tối ưu hóa quỹ đất đô thị, giảm chi phí hạ tầng và cho phép nhiều người sống gần nơi làm việc.',
          'Bảo tồn kiến trúc cổ giữ lại nét thẩm mỹ độc đáo và thu hút du lịch văn hóa.'
        ],
        againstArgs: [
          'Xây dựng công trình chỉ chạy theo chi phí rẻ tạo ra đô thị đơn điệu, thiếu bản sắc và ảnh hưởng tiêu cực đến tâm trạng cư dân.',
          'Giá bất động sản tăng vượt xa thu nhập khiến người trẻ khó sở hữu nhà ở nếu thiếu chính sách nhà ở xã hội.',
          'Giữ lại những tòa nhà xuống cấp nghiêm trọng tốn chi phí bảo trì cao và tiềm ẩn rủi ro an toàn.'
        ],
        examples: [
          'Các công trình kiến trúc xanh tại Singapore tích hợp vườn đứng và thông gió tự nhiên giúp giảm đáng kể điện năng điều hòa.',
          'Viên (Áo) duy trì tỷ lệ nhà ở xã hội chất lượng cao giúp kiểm soát giá thuê nhà ổn định cho người lao động.'
        ],
        collocations: [
          { en: 'affordable housing crisis', vi: 'khủng hoảng nhà ở giá phải chăng' },
          { en: 'aesthetic appeal vs functionality', vi: 'tính thẩm mỹ so với công năng' },
          { en: 'energy-efficient architecture', vi: 'kiến trúc tiết kiệm năng lượng' },
          { en: 'high-density residential blocks', vi: 'khu chung cư mật độ cao' },
          { en: 'urban sprawl', vi: 'sự mở rộng đô thị thiếu kiểm soát' }
        ]
      },
      {
        id: 'food',
        label: 'Food, Agriculture & Water (Thực phẩm & Nông nghiệp)',
        keywords: ['food', 'agricult', 'farm', 'crop', 'organic', 'import', 'hunger', 'water', 'waste', 'supermarket', 'cook', 'meal'],
        forArgs: [
          'Nông nghiệp công nghệ cao và giống cây trồng cải tiến giúp tăng năng suất, đảm bảo an ninh lương thực trước biến đổi khí hậu.',
          'Ưu tiên thực phẩm địa phương theo mùa cắt giảm khí thải vận chuyển (food miles) và hỗ trợ trực tiếp nông dân trong nước.',
          'Giảm lãng phí thực phẩm tại siêu thị và hộ gia đình là cách nhanh nhất để tiết kiệm tài nguyên đất và nước.'
        ],
        againstArgs: [
          'Lạm dụng phân bón hóa học và thuốc trừ sâu làm suy thoái đất, ô nhiễm nguồn nước ngầm và ảnh hưởng sức khỏe người tiêu dùng.',
          'Thực phẩm hữu cơ có giá thành cao nên khó tiếp cận với đại đa số hộ gia đình thu nhập trung bình và thấp.',
          'Cấm nhập khẩu thực phẩm hoàn toàn làm giảm sự đa dạng dinh dưỡng quanh năm ở các vùng khí hậu khắc nghiệt.'
        ],
        examples: [
          'Pháp ban hành luật cấm siêu thị lớn tiêu hủy thực phẩm chưa bán hết còn hạn sử dụng, yêu cầu quyên góp cho ngân hàng thực phẩm.',
          'Hà Lan ứng dụng nhà kính thông minh tiết kiệm nước, trở thành một trong những nước xuất khẩu nông sản lớn nhất thế giới dù diện tích nhỏ.'
        ],
        collocations: [
          { en: 'global food security', vi: 'an ninh lương thực toàn cầu' },
          { en: 'reduce food miles', vi: 'giảm quãng đường vận chuyển thực phẩm' },
          { en: 'sustainable farming practices', vi: 'canh tác nông nghiệp bền vững' },
          { en: 'curb food wastage', vi: 'hạn chế lãng phí thực phẩm' },
          { en: 'locally sourced produce', vi: 'nông sản có nguồn gốc địa phương' }
        ]
      },
      {
        id: 'sports',
        label: 'Sports, Leisure & Competitions (Thể thao & Giải trí)',
        keywords: ['sport', 'athlete', 'olympic', 'football', 'game', 'leisure', 'hobby', 'recreation', 'competition', 'team', 'extreme sport', 'stadium'],
        forArgs: [
          'Thể thao rèn luyện thể lực, tinh thần đồng đội, kỷ luật bản thân và khả năng vượt qua áp lực thất bại.',
          'Các giải đấu quốc tế như Olympic hay World Cup thúc đẩy ngoại giao nhân dân, niềm tự hào dân tộc và đầu tư hạ tầng thể thao.',
          'Hoạt động giải trí lành mạnh giúp tái tạo năng lượng tinh thần và giảm căng thẳng học tập, công việc.'
        ],
        againstArgs: [
          'Chi phí tổ chức các sự kiện thể thao khổng lồ thường vượt dự toán, để lại nhiều sân vận động bỏ hoang (white elephants) sau giải đấu.',
          'Thương mại hóa quá mức và chênh lệch thu nhập khổng lồ của vận động viên đỉnh cao so với giáo viên hay bác sĩ gây tranh cãi về giá trị xã hội.',
          'Thể thao mạo hiểm tiềm ẩn nguy cơ chấn thương nghiêm trọng và chi phí cứu hộ cao.'
        ],
        examples: [
          'Thế vận hội London 2012 được quy hoạch để chuyển đổi nhiều công trình thành khu dân cư và công viên cộng đồng sau sự kiện.',
          'Các giải chạy bộ cộng đồng miễn phí như Parkrun giúp hàng trăm nghìn người duy trì thói quen vận động cuối tuần.'
        ],
        collocations: [
          { en: 'foster teamwork and sportsmanship', vi: 'nuôi dưỡng tinh thần đồng đội và thượng võ' },
          { en: 'international sporting events', vi: 'sự kiện thể thao quốc tế' },
          { en: 'grassroots sports facilities', vi: 'cơ sở thể thao phong trào' },
          { en: 'commercialisation of sport', vi: 'thương mại hóa thể thao' },
          { en: 'productive leisure pursuits', vi: 'hoạt động giải trí bổ ích' }
        ]
      },
      {
        id: 'space',
        label: 'Science & Space Exploration (Khoa học & Vũ trụ)',
        keywords: ['space', 'planet', 'mars', 'universe', 'astronaut', 'science', 'scientific', 'research', 'discover', 'experiment', 'satellite'],
        forArgs: [
          'Nghiên cứu không gian tạo ra hàng loạt công nghệ ứng dụng thiết thực trên Trái Đất như vệ tinh thời tiết, GPS, vật liệu nhẹ và lọc nước.',
          'Khám phá vũ trụ mở rộng hiểu biết khoa học, truyền cảm hứng học tập ngành STEM cho thế hệ trẻ và chuẩn bị phương án dài hạn cho nhân loại.',
          'Hợp tác không gian quốc tế thúc đẩy hòa bình và chia sẻ tri thức khoa học toàn cầu.'
        ],
        againstArgs: [
          'Ngân sách hàng tỷ đô la cho các sứ mệnh sao Hỏa có thể tạo tác động tức thì hơn nếu dùng để giải quyết đói nghèo, nước sạch và biến đổi khí hậu trên Trái Đất.',
          'Rác thải vũ trụ (space debris) ngày càng dày đặc đe dọa an toàn của các vệ tinh viễn thông thiết yếu.',
          'Lợi ích từ du lịch vũ trụ hiện chỉ phục vụ nhóm siêu giàu nhưng lại thải ra lượng khí nhà kính lớn.'
        ],
        examples: [
          'Công nghệ vệ tinh quan sát Trái Đất của NASA và ESA giúp dự báo bão sớm, theo dõi nạn phá rừng và băng tan chính xác theo thời gian thực.',
          'Trạm Vũ trụ Quốc tế (ISS) là minh chứng cho hợp tác khoa học bền bỉ giữa nhiều quốc gia bất chấp khác biệt địa chính trị.'
        ],
        collocations: [
          { en: 'scientific breakthroughs', vi: 'đột phá khoa học' },
          { en: 'spin-off technologies', vi: 'công nghệ ứng dụng phái sinh' },
          { en: 'pressing terrestrial challenges', vi: 'thách thức cấp bách trên Trái Đất' },
          { en: 'orbital space debris', vi: 'rác thải không gian trên quỹ đạo' },
          { en: 'inspire STEM careers', vi: 'truyền cảm hứng theo đuổi ngành STEM' }
        ]
      }
    ],

    // =========================================================================
    // 4. CHECKLIST SOÁT LỖI 4 TIÊU CHÍ (TR/TA · CC · LR · GRA)
    // =========================================================================
    checklist: {
      task1: [
        { code: 'TA', title: 'Task Achievement', items: [
          'Đã viết đủ tối thiểu 150 từ (lý tưởng 170–200 từ).',
          'Có đoạn Overview rõ ràng nêu 2–3 xu hướng/đặc điểm nổi bật nhất, KHÔNG nhồi số liệu chi tiết.',
          'Số liệu trích dẫn chính xác đơn vị (%, triệu, năm) và có so sánh giữa các nhóm/mốc thời gian.',
          'Tuyệt đối không suy diễn nguyên nhân ngoài biểu đồ hoặc đưa ý kiến cá nhân.'
        ]},
        { code: 'CC', title: 'Coherence & Cohesion', items: [
          'Chia đúng 4 đoạn mạch lạc: Intro → Overview → Body 1 → Body 2.',
          'Nhóm thông tin logic (theo xu hướng tăng/giảm, nhóm cao/thấp, hoặc nửa đầu/nửa sau quy trình).',
          'Dùng từ nối đa dạng (Whereas, By contrast, Subsequently, Turning to...) không lạm dụng đầu mọi câu.'
        ]},
        { code: 'LR', title: 'Lexical Resource', items: [
          'Đã paraphrase đề bài ở Introduction, không chép nguyên văn câu đề.',
          'Đa dạng động từ/danh từ mô tả xu hướng & tỷ trọng (surged, accounted for, outstripped...).',
          'Không sai chính tả từ khóa trọng tâm và đơn vị đo lường.'
        ]},
        { code: 'GRA', title: 'Grammatical Range & Accuracy', items: [
          'Dùng đúng thì động từ (Quá khứ đơn cho năm cũ, Hiện tại đơn cho quy trình/bảng tĩnh, Tương lai dự báo cho năm sau).',
          'Kết hợp câu phức (While/Whereas, mệnh đề quan hệ, cụm phân từ, cấu trúc with + N + V-ing).',
          'Kiểm tra kỹ hòa hợp chủ–vị (The number of + V số ít vs A number of + V số nhiều) và mạo từ (the).'
        ]}
      ],
      task2: [
        { code: 'TR', title: 'Task Response', items: [
          'Đã viết đủ tối thiểu 250 từ (lý tưởng 270–310 từ).',
          'Trả lời ĐẦY ĐỦ tất cả các vế của đề bài (không bỏ sót vế "give your own opinion" hoặc vế hỏi thứ 2).',
          'Lập trường xuyên suốt, nhất quán từ Mở bài đến Kết luận (không tự mâu thuẫn).',
          'Mỗi đoạn Body có Topic Sentence rõ ràng + Giải thích sâu (Why/How) + Ví dụ cụ thể.'
        ]},
        { code: 'CC', title: 'Coherence & Cohesion', items: [
          'Bố cục chuẩn 4 đoạn (Intro – Body 1 – Body 2 – Conclusion), mỗi Body tập trung 1 trục ý rõ ràng.',
          'Sử dụng phép quy chiếu tự nhiên (this trend, such measures, the former/the latter) để câu liền mạch.',
          'Tránh nhồi máy móc "Firstly, Secondly, Moreover, Furthermore" ở đầu mọi câu.'
        ]},
        { code: 'LR', title: 'Lexical Resource', items: [
          'Dùng collocations đúng ngữ cảnh chủ đề, ưu tiên chính xác hơn từ hoa mỹ gượng ép.',
          'Giữ văn phong học thuật trang trọng (tránh viết tắt don’t/can’t, tránh từ lóng kids/stuff/a lot of).',
          'Paraphrase linh hoạt từ khóa chủ đề xuyên suốt bài để tránh lặp từ.'
        ]},
        { code: 'GRA', title: 'Grammatical Range & Accuracy', items: [
          'Đa dạng cấu trúc câu phức: nhượng bộ (Although/While), điều kiện (If/Were...to), mệnh đề quan hệ, bị động.',
          'Không mắc lỗi câu chạy (run-on sentence), nối 2 mệnh đề bằng dấu phẩy (comma splice) hay thiếu động từ chính.',
          'Soát kỹ số ít/số nhiều, chia động từ, giới từ và dấu câu ở 3 phút cuối.'
        ]}
      ]
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LP_WRITING_TOOLKIT;
  } else {
    global.LP_WRITING_TOOLKIT = LP_WRITING_TOOLKIT;
  }
})(typeof window !== 'undefined' ? window : this);

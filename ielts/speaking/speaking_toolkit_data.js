/**
 * LinguaPath IELTS Speaking Formula Toolkit (v1.0)
 * 100% nội dung học thuật gốc:
 * - Bộ Discourse Markers & Cấu trúc nâng Band 7.0–8.5
 * - 12 Công thức trả lời nhanh Part 1
 * - 7 Khung chuyện lõi tái sử dụng Cue Card Part 2
 * - 8 Khung trả lời Part 3 & Tư duy Phản biện (Critical Thinking)
 * - Mini-drill 25 từ tiếng Anh người Việt hay phát âm sai nhất (kèm IPA & TTS)
 */
(function (global) {
  'use strict';

  var LP_SPEAKING_TOOLKIT = {
    version: '2.0',

    // =========================================================================
    // 1. BỘ DISCOURSE MARKERS & CẤU TRÚC NÂNG BAND (FC + LR + GRA)
    // =========================================================================
    discourseMarkers: [
      {
        id: 'buying_time',
        title: '1. Câu giờ tự nhiên (Buying Time without "Umm/Ahh")',
        target: 'Part 1 & Part 3 · Fluency & Coherence',
        items: [
          { phrase: 'That’s an interesting question — I haven’t really thought about it before, but...', vi: 'Câu hỏi thú vị đấy — mình chưa nghĩ kỹ bao giờ nhưng...' },
          { phrase: 'Off the top of my head, I’d say...', vi: 'Nghĩ nhanh trong đầu lúc này thì mình cho rằng...' },
          { phrase: 'Well, to put it simply...', vi: 'Nói một cách ngắn gọn thì...' },
          { phrase: 'Let me see... if I had to narrow it down, I’d go with...', vi: 'Để mình xem... nếu phải chọn ra một thứ thì mình chọn...' },
          { phrase: 'Come to think of it, ...', vi: 'Nghĩ lại thì...' }
        ]
      },
      {
        id: 'nuanced_opinion',
        title: '2. Nêu quan điểm tinh tế (Nuanced Opinion)',
        target: 'Part 3 · Band 7.5–8.5',
        items: [
          { phrase: 'From my perspective, it’s largely a matter of...', vi: 'Theo góc nhìn của mình, phần lớn đây là vấn đề về...' },
          { phrase: 'I’m inclined to believe that..., though it’s not entirely black and white.', vi: 'Mình nghiêng về quan điểm..., dù mọi thứ không hoàn toàn trắng đen.' },
          { phrase: 'To a certain extent, yes — however, ...', vi: 'Ở một mức độ nào đó thì đúng — tuy nhiên...' },
          { phrase: 'I wouldn’t go so far as to say that..., but...', vi: 'Mình không đi xa đến mức nói rằng..., nhưng...' },
          { phrase: 'It really hinges on the context / individual.', vi: 'Điều đó thực sự phụ thuộc vào bối cảnh / từng cá nhân.' }
        ]
      },
      {
        id: 'contrast_concession',
        title: '3. Nhượng bộ & Đối lập (Concession & Contrast)',
        target: 'Part 1, 2 & 3 · GRA + CC',
        items: [
          { phrase: 'Admittedly, [A] has its drawbacks; having said that, [B]...', vi: 'Phải thừa nhận A có hạn chế; nói vậy nhưng B...' },
          { phrase: 'While I appreciate that..., I still lean towards...', vi: 'Dù mình hiểu rằng..., mình vẫn nghiêng về...' },
          { phrase: 'On the flip side, ...', vi: 'Ở mặt trái / khía cạnh ngược lại thì...' },
          { phrase: 'In stark contrast to [the past], nowadays...', vi: 'Trái ngược hoàn toàn với trước đây, ngày nay...' },
          { phrase: 'Much as I enjoy [X], I rarely have time for it.', vi: 'Dù mình rất thích X, mình hiếm khi có thời gian.' }
        ]
      },
      {
        id: 'speculation',
        title: '4. Giả định & Dự đoán tương lai (Speculating)',
        target: 'Part 3 · Grammatical Range Band 8.0',
        items: [
          { phrase: 'In the foreseeable future, it’s highly likely that...', vi: 'Trong tương lai gần, rất có khả năng là...' },
          { phrase: 'If current trends continue, we might well see...', vi: 'Nếu xu hướng hiện tại tiếp diễn, chúng ta có thể sẽ thấy...' },
          { phrase: 'Had I not [done X], I probably wouldn’t have [Y].', vi: 'Nếu mình không làm X, có lẽ mình đã chẳng có Y (đảo ngữ điều kiện loại 3).' },
          { phrase: 'It’s hard to predict with certainty, yet I’d hazard a guess that...', vi: 'Khó đoán chắc chắn, nhưng mình đoán rằng...' },
          { phrase: 'Were governments to invest more in..., the outcome would be...', vi: 'Nếu chính phủ đầu tư nhiều hơn vào..., kết quả sẽ là...' }
        ]
      },
      {
        id: 'extending',
        title: '5. Mở rộng & Minh họa (Extending & Exemplifying)',
        target: 'Part 2 & Part 3 · Fluency',
        items: [
          { phrase: 'To give you a concrete example, just last month...', vi: 'Để đưa ra một ví dụ cụ thể, ngay tháng trước...' },
          { phrase: 'What really stands out to me is...', vi: 'Điều thực sự nổi bật với mình là...' },
          { phrase: 'Not only does it [A], but it also [B].', vi: 'Nó không chỉ A mà còn B (đảo ngữ ghi điểm GRA).' },
          { phrase: 'On top of that, ... / Another factor worth mentioning is...', vi: 'Hơn nữa / Một yếu tố nữa đáng nhắc đến là...' },
          { phrase: 'That basically explains why...', vi: 'Điều đó về cơ bản giải thích lý do tại sao...' }
        ]
      },
      {
        id: 'self_repair',
        title: '6. Tự sửa lỗi mượt mà (Graceful Self-Correction)',
        target: 'All Parts · Fluency Recovery',
        items: [
          { phrase: 'Or rather, what I meant to say is...', vi: 'Hay đúng hơn, ý mình muốn nói là...' },
          { phrase: 'Sorry, let me rephrase that more clearly...', vi: 'Xin lỗi, để mình diễn đạt lại rõ hơn...' },
          { phrase: 'To be more precise, ...', vi: 'Chính xác hơn thì...' },
          { phrase: 'What’s the word I’m looking for... right, [Word]!', vi: 'Từ mình đang tìm là gì nhỉ... à đúng rồi, [Từ]!' }
        ]
      }
    ],

    // =========================================================================
    // 2. 12 CÔNG THỨC TRẢ LỜI NHANH PART 1 (20–30 GIÂY / CÂU)
    // =========================================================================
    part1Formulas: [
      {
        id: 'p1_f1',
        name: '1. Trực tiếp + Lý do + Ví dụ nhỏ (AREA)',
        when: 'Câu hỏi sở thích, thói quen chung (Do you like...?)',
        skeleton: 'Direct answer → Reason → Mini-example',
        sampleQ: 'Do you enjoy cooking at home?',
        sampleA: 'Definitely, I’m quite into home cooking. It lets me control what goes into my meals and unwind after a hectic day. For instance, I usually whip up a quick stir-fry on weekday evenings.',
        highlights: ['quite into', 'unwind after a hectic day', 'whip up']
      },
      {
        id: 'p1_f2',
        name: '2. So sánh Quá khứ vs Hiện tại (Past → Now)',
        when: 'Câu hỏi về thay đổi thói quen, tuổi thơ, công nghệ',
        skeleton: 'Used to [Past] → Nowadays [Present] → Reason for shift',
        sampleQ: 'Do you often read paper books?',
        sampleA: 'I used to devour printed novels when I was a teenager, but these days I’ve mostly switched to e-books and audiobooks. They’re simply far more convenient during my daily commute.',
        highlights: ['used to devour', 'these days', 'switched to']
      },
      {
        id: 'p1_f3',
        name: '3. Chia 2 trường hợp (It Depends Split)',
        when: 'Câu hỏi không thể trả lời 100% Có hoặc Không',
        skeleton: 'It depends on [Factor] → Case A → Case B',
        sampleQ: 'Do you prefer spending weekends alone or with friends?',
        sampleA: 'Honestly, it really depends on my energy levels. If I’ve had a draining week at work, I’d rather recharge on my own with a movie; otherwise, I love catching up with close friends over coffee.',
        highlights: ['depends on my energy levels', 'recharge on my own', 'catching up with']
      },
      {
        id: 'p1_f4',
        name: '4. Tần suất + Ngoại lệ (Frequency + Exception)',
        when: 'Câu hỏi "How often do you...?"',
        skeleton: 'Typical frequency → Routine context → Occasional exception',
        sampleQ: 'How often do you use public transport?',
        sampleA: 'Not all that often, to be honest — maybe once or twice a month. I normally commute by motorbike because it’s quicker, though I do take the metro whenever I’m heading downtown during rush hour.',
        highlights: ['Not all that often', 'though I do take', 'during rush hour']
      },
      {
        id: 'p1_f5',
        name: '5. Ưu tiên + Đánh đổi (Preference + Trade-off)',
        when: 'Câu hỏi chọn lựa "Do you prefer A or B?"',
        skeleton: 'Lean towards A → Acknowledge B’s merit → Why A wins',
        sampleQ: 'Do you prefer morning or evening?',
        sampleA: 'I’m definitely more of a morning person. While evenings are great for socialising, my mind is sharpest right after waking up, so I get the bulk of my deep work done before noon.',
        highlights: ['more of a morning person', 'get the bulk of', 'sharpest']
      },
      {
        id: 'p1_f6',
        name: '6. Cảm xúc + Chi tiết giác quan (Emotion + Sensory)',
        when: 'Câu hỏi về thời tiết, âm nhạc, địa điểm, món ăn',
        skeleton: 'Emotional reaction → Vivid sensory detail → Personal tie',
        sampleQ: 'What kind of weather do you like best?',
        sampleA: 'I’m a huge fan of crisp autumn mornings. There’s something refreshing about that cool breeze and golden sunlight — it instantly puts me in a productive mood.',
        highlights: ['crisp autumn mornings', 'cool breeze', 'puts me in a productive mood']
      },
      {
        id: 'p1_f7',
        name: '7. Nhượng bộ + Ý chính (Concession + Main Point)',
        when: 'Câu hỏi về thứ bạn vừa thích vừa hơi ngại',
        skeleton: 'Admittedly [Con] → Nevertheless [Pro]',
        sampleQ: 'Do you like living in a big city?',
        sampleA: 'Admittedly, the traffic noise and pollution can get on my nerves at times. Having said that, the sheer convenience and vibrant food scene make it hard for me to imagine living anywhere else.',
        highlights: ['get on my nerves', 'Having said that', 'sheer convenience']
      },
      {
        id: 'p1_f8',
        name: '8. Thừa nhận thật + Xoay trục (Honest Admission + Pivot)',
        when: 'Gặp chủ đề bạn KHÔNG thích hoặc KHÔNG rành (hoa, bảo tàng, chim...)',
        skeleton: 'Candid admission → Brief reason → Pivot to related thing you DO know',
        sampleQ: 'Do you know much about wild birds?',
        sampleA: 'To be completely honest, I’m no expert on wildlife at all, since I’ve grown up in a densely populated city. That said, I do enjoy watching nature documentaries whenever I want to unwind.',
        highlights: ['To be completely honest', 'no expert on', 'That said']
      },
      {
        id: 'p1_f9',
        name: '9. Tương lai & Dự định (Future Aspiration)',
        when: 'Câu hỏi "Would you like to... in the future?"',
        skeleton: 'Enthusiastic yes/no → Specific goal → Concrete benefit',
        sampleQ: 'Would you like to learn another language?',
        sampleA: 'I’d love to pick up Japanese in the next couple of years. Not only am I fascinated by its culture, but being able to read original manga and travel independently would be amazing.',
        highlights: ['pick up', 'Not only am I fascinated', 'travel independently']
      },
      {
        id: 'p1_f10',
        name: '10. Xu hướng chung → Bản thân (General → Personal)',
        when: 'Câu hỏi về thói quen phổ biến ở nước bạn',
        skeleton: 'What most people do → Where I fit in',
        sampleQ: 'Is coffee popular in your country?',
        sampleA: 'Oh, massively so — café culture is practically woven into daily life in Vietnam. Speaking for myself, I can’t really kick-start my workday without a cup of iced milk coffee.',
        highlights: ['massively so', 'woven into daily life', 'kick-start my workday']
      },
      {
        id: 'p1_f11',
        name: '11. Giả định ước muốn (Hypothetical Wish)',
        when: 'Câu hỏi về điều bạn chưa có điều kiện làm hiện tại',
        skeleton: 'Current reality → Conditional 2 (If I had..., I would...)',
        sampleQ: 'Do you have a garden at home?',
        sampleA: 'Unfortunately not, as I live in a compact apartment with just a tiny balcony. If I ever owned a house with a backyard, I’d definitely grow fresh herbs and a few fruit trees.',
        highlights: ['compact apartment', 'If I ever owned', 'fresh herbs']
      },
      {
        id: 'p1_f12',
        name: '12. Góc độ xã hội + Lợi ích (Social Context + Benefit)',
        when: 'Câu hỏi về kỹ năng, thói quen cộng đồng, quà tặng',
        skeleton: 'Direct answer → How it connects people → Personal takeaway',
        sampleQ: 'Do you enjoy giving gifts to others?',
        sampleA: 'Yes, I actually find it more rewarding than receiving them. Picking out something thoughtful shows people you’ve been paying attention, and it really strengthens relationships.',
        highlights: ['more rewarding than', 'Picking out something thoughtful', 'strengthens relationships']
      }
    ],

    // =========================================================================
    // 3. 7 KHUNG CHUYỆN LÕI TÁI SỬ DỤNG CHO CUE CARD PART 2 (2 PHÚT)
    // =========================================================================
    part2CoreStories: [
      {
        id: 'story_person',
        category: '1. Nhân vật lõi (Core Person)',
        archetype: 'Người thầy / Cố vấn / Người ông giàu trải nghiệm',
        adaptsTo: 'Người bạn ngưỡng mộ • Người dạy bạn kỹ năng • Người lớn tuổi thú vị • Người truyền cảm hứng • Người sáng tạo • Người giúp đỡ người khác',
        structure: [
          'Hook (15s): Giới thiệu tên, mối quan hệ và ấn tượng đầu tiên ("If there’s one person who truly shaped my outlook, it’s...").',
          'Background (30s): Hoàn cảnh gặp gỡ, ngoại hình/phong thái đặc trưng và chuyên môn của họ.',
          'Core Anecdote (45s): Kể 1 kỷ niệm cụ thể khi bạn bế tắc và họ kiên nhẫn chỉ dẫn bằng phương pháp thông minh.',
          'Reflection (30s): Bài học bạn rút ra đến tận hôm nay và lý do bạn vẫn giữ liên lạc/biết ơn.'
        ],
        vocab: ['down-to-earth (giản dị)', 'wealth of wisdom (kho tàng trí tuệ)', 'lead by example (làm gương)', 'patient mentor', 'lasting impression']
      },
      {
        id: 'story_place',
        category: '2. Địa điểm lõi (Core Place)',
        archetype: 'Quán cà phê sách yên tĩnh bên hồ / Thành phố Đà Lạt (hoặc Hội An)',
        adaptsTo: 'Nơi yên tĩnh • Nơi thích đến cùng bạn • Thành phố muốn quay lại • Nơi có không gian xanh • Kiến trúc đẹp • Nơi học tập lý tưởng',
        structure: [
          'Hook (15s): Nêu tên địa điểm, vị trí và lần đầu tình cờ phát hiện ra.',
          'Sensory Details (35s): Mô tả 3 giác quan — ánh sáng/cảnh vật, âm thanh nhẹ nhàng, mùi hương đặc trưng.',
          'Activities (40s): Bạn thường làm gì ở đó (đọc sách, lên kế hoạch tuần, trò chuyện sâu cùng bạn thân).',
          'Reflection (30s): Ý nghĩa tinh thần của nơi đó — "sanctuary" giúp bạn tạm rời nhịp sống đô thị ồn ào.'
        ],
        vocab: ['hidden gem (viên ngọc ẩn giấu)', 'tranquil atmosphere (không khí yên bình)', 'tucked away in...', 'recharge my batteries', 'architectural charm']
      },
      {
        id: 'story_event',
        category: '3. Sự kiện / Trải nghiệm lõi (Core Event)',
        archetype: 'Chuyến đi tự túc cùng bạn bè gặp sự cố thời tiết nhưng hóa kỷ niệm đẹp',
        adaptsTo: 'Chuyến đi đáng nhớ • Lần kế hoạch thay đổi đột ngột • Lần nhận được sự giúp đỡ từ người lạ • Ngày không dùng điện thoại • Trải nghiệm ngoài trời',
        structure: [
          'Hook (15s): Thời điểm, điểm đến và kỳ vọng ban đầu của cả nhóm.',
          'Twist / Problem (35s): Sự cố bất ngờ (mưa lớn, lạc đường hoặc hỏng xe) khiến cả nhóm lúng túng.',
          'Resolution (40s): Cách cả nhóm bình tĩnh xoay xở và nhận được sự hiếu khách ấm áp từ người dân địa phương.',
          'Reflection (30s): Điều đáng nhớ nhất không phải lịch trình hoàn hảo mà là sự gắn kết và khả năng ứng biến.'
        ],
        vocab: ['took an unexpected turn', 'blessing in disguise (trong cái rủi có cái may)', 'hospitality (lòng hiếu khách)', 'think on our feet (ứng biến nhanh)', 'vivid memory']
      },
      {
        id: 'story_object',
        category: '4. Đồ vật / Công nghệ lõi (Core Object / Tech)',
        archetype: 'Chiếc máy đọc sách E-reader (hoặc Tai nghe chống ồn / Đồng hồ cũ của gia đình)',
        adaptsTo: 'Món đồ không thể thiếu • Món quà ý nghĩa • Thiết bị công nghệ hữu ích • Món đồ tiết kiệm tiền mua • Thứ dùng hằng ngày',
        structure: [
          'Hook (15s): Tên món đồ, nguồn gốc (tự mua sau dự án đầu tiên hoặc được tặng).',
          'Features (30s): Thiết kế gọn nhẹ, tính năng cốt lõi giúp ích trực tiếp cho học tập/công việc.',
          'Daily Impact (45s): Nó đã thay đổi thói quen hằng ngày của bạn ra sao (ví dụ: đọc 20 phút mỗi tối thay vì lướt mạng).',
          'Reflection (30s): Vì sao bạn vẫn giữ gìn nó dù có nhiều mẫu mới hơn.'
        ],
        vocab: ['game-changer (bước ngoặt)', 'sleek and portable', 'worth every penny (đáng từng đồng)', 'cut down on screen fatigue', 'sentimental value']
      },
      {
        id: 'story_media',
        category: '5. Sách / Phim / Podcast lõi (Core Media)',
        archetype: 'Cuốn sách "Atomic Habits" hoặc Bộ phim tài liệu thiên nhiên / Phim truyền cảm hứng',
        adaptsTo: 'Cuốn sách hay • Bộ phim ấn tượng • Chương trình học được điều mới • Bài báo/Podcast thú vị • Câu chuyện thay đổi suy nghĩ',
        structure: [
          'Hook (15s): Tên tác phẩm, tác giả/đạo diễn và dịp bạn biết tới nó.',
          'Core Message (35s): Tóm tắt ngắn gọn thông điệp trung tâm (tránh kể lể cốt truyện dài dòng).',
          'Personal Application (40s): Một ý tưởng bạn áp dụng ngay vào đời sống và thấy kết quả thực tế.',
          'Reflection (30s): Lý do bạn hay giới thiệu tác phẩm này cho bạn bè.'
        ],
        vocab: ['eye-opening (mở mang tầm mắt)', 'thought-provoking (gợi suy ngẫm)', 'actionable takeaways', 'struck a chord with me (chạm đến cảm xúc)', 'shifted my perspective']
      },
      {
        id: 'story_skill',
        category: '6. Kỹ năng / Hoạt động lõi (Core Skill / Activity)',
        archetype: 'Tự học thuyết trình tiếng Anh / Chạy bộ 5km / Nấu một món ăn truyền thống',
        adaptsTo: 'Kỹ năng khó học • Thói quen tốt mới rèn • Hoạt động rèn sức khỏe • Việc làm cùng gia đình • Mục tiêu muốn đạt năm nay',
        structure: [
          'Hook (15s): Kỹ năng là gì và động lực khiến bạn bắt đầu.',
          'Initial Struggle (35s): Khó khăn ban đầu (lúng túng, dễ nản trong 2 tuần đầu).',
          'Breakthrough (40s): Cách bạn chia nhỏ mục tiêu, luyện đều đặn 15–20 phút mỗi ngày và thấy tiến bộ rõ rệt.',
          'Reflection (30s): Sự tự tin lan tỏa sang các khía cạnh khác của cuộc sống.'
        ],
        vocab: ['steep learning curve (đường cong học tập dốc)', 'consistency over intensity', 'step out of my comfort zone', 'sense of accomplishment', 'paid off']
      },
      {
        id: 'story_achievement',
        category: '7. Thành tựu / Thử thách lõi (Core Challenge)',
        archetype: 'Hoàn thành dự án nhóm / Cuộc thi học thuật sát hạn chót',
        adaptsTo: 'Thành tích tự hào • Lần làm việc nhóm hiệu quả • Quyết định khó khăn • Lần vượt qua áp lực thời gian • Dự án sáng tạo',
        structure: [
          'Hook (15s): Bối cảnh dự án/thử thách và vai trò của bạn trong nhóm.',
          'Obstacle (35s): Mâu thuẫn ý tưởng hoặc áp lực deadline sát nút.',
          'Action (40s): Cách bạn lắng nghe, phân chia đầu việc rõ ràng và giải quyết điểm nghẽn.',
          'Reflection (30s): Kết quả đạt được và bài học quý giá về quản trị thời gian & giao tiếp.'
        ],
        vocab: ['tight deadline (hạn chót gấp)', 'pull together as a team', 'iron out differences (hóa giải bất đồng)', 'against all odds', 'defining moment']
      }
    ],

    // =========================================================================
    // 3B. 8 KHUNG TRẢ LỜI PART 3 & TƯ DUY PHẢN BIỆN (BAND 7.5–9.0)
    // =========================================================================
    part3Formulas: [
      {
        id: 'p3_two_sided_stance',
        name: '1. Cân bằng 2 chiều & Lập trường tinh tế (Nuanced Concession)',
        when: 'Câu hỏi "Do you agree...?", "Is X a positive or negative trend?" hoặc đánh giá hiện tượng xã hội có 2 mặt.',
        skeleton: 'Mở khung khái quát ("Well, it’s not entirely black and white...") -> Nhượng bộ vế đối lập ("Admittedly, ...") -> Bẻ lái khẳng định quan điểm chính ("Having said that, I’m inclined to believe...") -> Ví dụ vĩ mô.',
        sampleQ: 'Do you think technology has made people more isolated today?',
        sampleA: 'Well, it’s not entirely black and white. Admittedly, people spend hours glued to their screens instead of mingling face-to-face. Having said that, digital platforms play an indispensable part in bridging geographical gaps, especially for families living apart.',
        highlights: ['not entirely black and white', 'Admittedly, ...', 'Having said that, ...', 'play an indispensable part']
      },
      {
        id: 'p3_past_present',
        name: '2. So sánh Quá khứ vs. Hiện tại (Temporal Shift)',
        when: 'Câu hỏi về sự thay đổi lối sống, giáo dục, thói quen tiêu dùng hoặc giá trị truyền thống qua các thế hệ.',
        skeleton: 'Chốt trục thời gian ("In stark contrast to decades ago...") -> Đặc trưng quá khứ ("Back then, people used to...") -> Chuyển sang thực tại ("Nowadays, however, ...") -> Hệ quả xã hội.',
        sampleQ: 'How have shopping habits changed compared to the past?',
        sampleA: 'In stark contrast to a couple of decades ago, when consumers mostly frequented local markets for daily essentials, modern shopping has become vastly convenience-driven. Nowadays, next-day delivery is all the rage, though it also encourages impulse buying.',
        highlights: ['In stark contrast to...', 'Back then / used to', 'all the rage (rất phổ biến)', 'impulse buying']
      },
      {
        id: 'p3_root_causes_effects',
        name: '3. Chuỗi Nguyên nhân gốc -> Hệ quả dây chuyền (Causal Chain)',
        when: 'Câu hỏi "Why do many people...?" hoặc "What are the effects of...?" — cần độ sâu phân tích thay vì liệt kê rời rạc.',
        skeleton: 'Nguyên nhân cốt lõi 1 ("The primary catalyst behind this is...") -> Hệ quả kéo theo ("As a direct consequence, ...") -> Nhân tố thứ 2 ("On top of that, ...") -> Chốt tác động dài hạn.',
        sampleQ: 'Why do so many young graduates want to move to major cities?',
        sampleA: 'The primary catalyst behind this migration is the sheer concentration of career prospects and competitive salaries in urban hubs. On top of that, metropolises offer vibrant cultural amenities, which is of paramount importance to young professionals seeking to broaden their horizons.',
        highlights: ['The primary catalyst', 'On top of that', 'of paramount importance', 'broaden their horizons']
      },
      {
        id: 'p3_societal_split',
        name: '4. Phân tầng Đối tượng / Thế hệ (Demographic Contrast)',
        when: 'Khi một câu hỏi chung chung ("Do people in your country prefer X?") thực tế phụ thuộc vào tuổi tác, thu nhập hay vùng miền.',
        skeleton: 'Tách nhóm khéo léo ("It really hinges on which demographic you look at...") -> Nhóm A ("For the older generation, ...") -> Nhóm B ("Conversely, younger people tend to...")',
        sampleQ: 'Do people in your country prefer reading printed books or e-books?',
        sampleA: 'It really hinges on the age bracket. Older readers are quite big on the tactile feel of paperbacks and consider reading a way to unwind away from screens. Conversely, commuters and university students lean towards e-readers because they are portable and budget-friendly.',
        highlights: ['It really hinges on...', 'quite big on (rất mê)', 'Conversely', 'budget-friendly']
      },
      {
        id: 'p3_speculation_future',
        name: '5. Giả định & Dự đoán Tương lai (Speculative Conditional)',
        when: 'Câu hỏi "How will X change in 20 years?", "What would happen if...?" — cơ hội vàng ghi điểm GRA câu điều kiện & modal.',
        skeleton: 'Mức độ chắc chắn ("In the foreseeable future, it’s highly likely that...") -> Kịch bản tích cực -> Rào đón điều kiện ("Unless governments intervene, ... could prove detrimental to...")',
        sampleQ: 'How might AI change the job market in the coming decades?',
        sampleA: 'In the foreseeable future, automation is bound to replace repetitive clerical roles, which could be detrimental to low-skilled workers unless retraining programmes are rolled out. Having said that, roles demanding empathy and creative leadership will still thrive.',
        highlights: ['In the foreseeable future', 'is bound to', 'detrimental to', 'unless + Present Simple']
      },
      {
        id: 'p3_policy_solutions',
        name: '6. Giải pháp Đa tầng: Nhà nước vs. Cá nhân (Multi-Level Policy)',
        when: 'Câu hỏi "What should be done to solve X?", "Who is responsible for Y?" (môi trường, giao thông, sức khỏe, giáo dục).',
        skeleton: 'Khẳng định trách nhiệm kép ("Tackling this issue calls for a coordinated effort...") -> Vai trò Chính phủ (luật, hạ tầng, thuế) -> Vai trò Cá nhân/Doanh nghiệp (nhận thức, thói quen).',
        sampleQ: 'Who should take responsibility for reducing plastic waste?',
        sampleA: 'Tackling plastic pollution calls for a joint effort. At the macro level, authorities should enforce stricter regulations and subsidise eco-friendly packaging. On an individual level, citizens can make a difference simply by ditching single-use plastics in their daily routines.',
        highlights: ['calls for a joint effort', 'At the macro level', 'subsidise', 'On an individual level']
      },
      {
        id: 'p3_short_vs_long_term',
        name: '7. Cân đo Ngắn hạn vs. Dài hạn (Cost–Benefit Horizon)',
        when: 'Câu hỏi về đầu tư công (vũ trụ, nghệ thuật, thể thao, bảo tồn di sản) hoặc lựa chọn nghề nghiệp/học tập.',
        skeleton: 'Thừa nhận chi phí trước mắt ("In the short run, it may seem pricey or prohibitive...") -> Giá trị bền vững ("Yet in the long haul, it does wonders for...") -> Kết luận cân bằng.',
        sampleQ: 'Should governments spend money on preserving historic buildings rather than modern housing?',
        sampleA: 'In the short run, restoring heritage sites can be financially prohibitive when cities face housing shortages. Yet in the long haul, preserving cultural landmarks strengthens national identity and generates sustainable tourism revenue that benefits the wider economy.',
        highlights: ['In the short run', 'prohibitive (đắt đỏ quá mức)', 'in the long haul', 'does wonders for']
      },
      {
        id: 'p3_sacred_upgrades',
        name: '8. Sacred Structures — Bộ Mẫu Câu Tự Nhiên Đắt Giá',
        when: 'Bỏ túi các cụm từ vựng tự nhiên giúp câu trả lời Part 1–3 thoát khỏi lối nói sách giáo khoa khô cứng.',
        skeleton: 'Yêu/Không thích: "quite big on / not my cup of tea" • Lợi/Hại: "does wonders for / detrimental to" • Quan trọng: "of paramount importance / indispensable part" • Đắt/Rẻ: "prohibitive / reasonably priced" • Bận: "up to my ears in / hectic schedule".',
        sampleQ: 'Why do many people still travel abroad despite rising costs?',
        sampleA: 'Even though airfares can be quite steep or even prohibitive during peak seasons, travelling does wonders for mental health and lets us blow off some steam. More importantly, immersing ourselves in unfamiliar cultures helps broaden our horizons in ways no textbook can match.',
        highlights: ['does wonders for', 'blow off some steam', 'broaden our horizons', 'of paramount importance']
      }
    ],

    // =========================================================================
    // 4. MINI-DRILL 25 TỪ TIẾNG ANH NGƯỜI VIỆT HAY PHÁT ÂM SAI NHẤT
    // =========================================================================
    pronunciationDrill: [
      { word: 'comfortable', ipa: '/ˈkʌm.fə.tə.bəl/', mistake: 'Đọc 4 âm tiết "com-for-ta-ble"', tip: 'Nuốt âm "or", chỉ còn 3 nhịp nhẹ: KUMF-tə-bəl.', example: 'I feel genuinely comfortable speaking in small groups.' },
      { word: 'vegetable', ipa: '/ˈvedʒ.tə.bəl/', mistake: 'Đọc 4 âm tiết "ve-ge-ta-ble"', tip: 'Chỉ 3 âm tiết: VEJ-tə-bəl, trọng âm rơi vào âm 1.', example: 'Fresh vegetables are a staple of my daily diet.' },
      { word: 'determine', ipa: '/dɪˈtɜː.mɪn/', mistake: 'Đọc đuôi "-mine" thành /maɪn/', tip: 'Đuôi đọc ngắn /mɪn/, nhấn âm 2: di-TUR-min.', example: 'Our daily habits largely determine our long-term success.' },
      { word: 'examine', ipa: '/ɪɡˈzæm.ɪn/', mistake: 'Đọc đuôi thành /maɪn/', tip: 'Đuôi đọc ngắn /ɪn/: ig-ZAM-in.', example: 'Scientists need to examine the environmental impact carefully.' },
      { word: 'colleague', ipa: '/ˈkɒl.iːɡ/', mistake: 'Nhầm với "college" (/ˈkɒl.ɪdʒ/)', tip: 'Âm cuối là /iːɡ/ (chữ g rõ), nhấn âm 1: KOL-eeg.', example: 'I often grab lunch with a close colleague from my team.' },
      { word: 'development', ipa: '/dɪˈvel.əp.mənt/', mistake: 'Nhấn sai âm 1 "DE-ve-lop"', tip: 'Nhấn mạnh âm 2 "VEL": di-VEL-əp-mənt.', example: 'Urban development should go hand in hand with green spaces.' },
      { word: 'environment', ipa: '/ɪnˈvaɪ.rən.mənt/', mistake: 'Quên âm /r/ hoặc đọc sai trọng âm', tip: 'Nhấn âm 2 /vaɪ/: in-VAI-rən-mənt.', example: 'Protecting the natural environment is a shared responsibility.' },
      { word: 'technology', ipa: '/tekˈnɒl.ə.dʒi/', mistake: 'Nhấn âm 1 "TEK-no-lo-gy"', tip: 'Nhấn âm 2 "NOL": tek-NOL-ə-jee.', example: 'Modern technology has transformed how people communicate.' },
      { word: 'photography', ipa: '/fəˈtɒɡ.rə.fi/', mistake: 'Đọc giống "photo" (nhấn âm 1)', tip: 'Đổi trọng âm sang âm 2 "TOG": fə-TOG-rə-fee.', example: 'Street photography is a creative hobby I picked up recently.' },
      { word: 'entrepreneur', ipa: '/ˌɒn.trə.prəˈnɜːr/', mistake: 'Đọc theo mặt chữ "en-tre-pre-neur"', tip: 'Âm đầu là /ɒn/ (on), nhấn mạnh âm cuối /nɜːr/.', example: 'Many young graduates dream of becoming a tech entrepreneur.' },
      { word: 'schedule', ipa: '/ˈʃedʒ.uːl/ · /ˈskedʒ.uːl/', mistake: 'Đọc "sờ-ke-đu"', tip: 'UK đọc SHED-yool, US đọc SKED-jool — đều chuẩn, giữ âm /dʒ/.', example: 'I try to stick to a realistic study schedule every week.' },
      { word: 'focus', ipa: '/ˈfəʊ.kəs/', mistake: 'Đọc thành âm /ʌ/ rất dễ gây hiểu nhầm', tip: 'Tròn môi rõ nguyên âm đôi /əʊ/ (FOH-kəs).', example: 'Soft instrumental music helps me focus during revision.' },
      { word: 'clothes', ipa: '/kləʊðz/ · /kləʊz/', mistake: 'Đọc 2 âm tiết "cờ-lô-dơ-s"', tip: 'Chỉ 1 âm tiết duy nhất, gần giống "close" (động từ đóng).', example: 'I prefer buying durable clothes rather than fast fashion.' },
      { word: 'queue', ipa: '/kjuː/', mistake: 'Đọc thành "que-ue" hoặc "kiu-i"', tip: 'Phát âm y hệt chữ cái Q (/kjuː/).', example: 'There was a surprisingly long queue outside the museum.' },
      { word: 'recipe', ipa: '/ˈres.ə.pi/', mistake: 'Nhầm với "receipt" (/rɪˈsiːt/)', tip: '3 âm tiết RES-ə-pee; còn hóa đơn "receipt" âm p câm.', example: 'My grandmother passed down a traditional soup recipe.' },
      { word: 'receipt', ipa: '/rɪˈsiːt/', mistake: 'Đọc lộ âm /p/ ở cuối', tip: 'Chữ "p" hoàn toàn câm, nhấn âm 2: ri-SEET.', example: 'Always keep the receipt in case you need to exchange an item.' },
      { word: 'island', ipa: '/ˈaɪ.lənd/', mistake: 'Đọc lộ âm /s/ "ai-sờ-lần"', tip: 'Chữ "s" câm hoàn toàn: AI-lənd.', example: 'Phu Quoc is a scenic island known for its clear beaches.' },
      { word: 'architecture', ipa: '/ˈɑː.kɪ.tek.tʃər/', mistake: 'Đọc "ch" thành /tʃ/ ở âm đầu', tip: 'Âm "ch" đầu đọc là /k/ (AR-ki-tek-chər).', example: 'Hoi An is famous for its well-preserved historic architecture.' },
      { word: 'chaos', ipa: '/ˈkeɪ.ɒs/', mistake: 'Đọc "chao-s"', tip: 'Bắt đầu bằng /k/ + /eɪ/: KAY-os.', example: 'Heavy rain during rush hour often turns traffic into total chaos.' },
      { word: 'archive', ipa: '/ˈɑː.kaɪv/', mistake: 'Đọc "a-chai-vơ"', tip: 'Chữ "ch" đọc /k/, nhấn âm 1: AR-kive.', example: 'The city library maintains a rich digital archive of old maps.' },
      { word: 'subtle', ipa: '/ˈsʌt.əl/', mistake: 'Đọc lộ âm /b/ "sắp-bồ"', tip: 'Chữ "b" câm hoàn toàn: SUT-əl.', example: 'There is a subtle difference between these two expressions.' },
      { word: 'debt', ipa: '/det/', mistake: 'Đọc lộ âm /b/', tip: 'Chữ "b" câm, chỉ còn 1 âm sắc gọn: DET.', example: 'High tuition fees can leave students burdened with debt.' },
      { word: 'variety', ipa: '/vəˈraɪ.ə.ti/', mistake: 'Đọc "va-ri-e-ty" nhấn âm 1', tip: 'Nhấn âm 2 /raɪ/: və-RAI-ə-tee.', example: 'A wide variety of street food is available right around the corner.' },
      { word: 'hierarchy', ipa: '/ˈhaɪə.rɑː.ki/', mistake: 'Đọc "hi-e-ra-chi"', tip: 'Âm đầu /haɪə/, đuôi "-chy" đọc /ki/: HI-ə-rar-kee.', example: 'Startups tend to have a flatter hierarchy than large corporations.' },
      { word: 'phenomenon', ipa: '/fəˈnɒm.ɪ.nən/', mistake: 'Nhấn sai âm 1 hoặc 3', tip: 'Nhấn mạnh âm 2 "NOM": fə-NOM-i-nən (số nhiều: phenomena).', example: 'Remote work has become a global phenomenon since 2020.' }
    ]
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LP_SPEAKING_TOOLKIT;
  } else {
    global.LP_SPEAKING_TOOLKIT = LP_SPEAKING_TOOLKIT;
  }
})(typeof window !== 'undefined' ? window : this);

/* LinguaPath — Mốc 0: Nhập môn Tiếng Anh (Pre-IELTS A0 → A2)
 * 4 cụm tình huống sinh tồn + 64 từ vựng cốt lõi SRS + 1 bài kiểm tra cuối Mốc 0.
 * Dữ liệu gọn nhẹ (~24 KB), nạp nhanh tức thì, hoàn toàn tự chủ offline.
 */
(function (root) {
  "use strict";

  var CLUSTERS = [
    {
      id: "m0_c1",
      order: 1,
      code: "Cụm 1",
      title: "Chào hỏi & Tự giới thiệu",
      subtitle: "Đại từ nhân xưng, động từ to be và câu hỏi tên, quê quán",
      goal: "Nghe hiểu 2 người chào hỏi nhau rồi tự giới thiệu bản thân trọn vẹn bằng 3 câu đơn.",
      grammarTitle: "Mẫu câu cốt lõi: Đại từ + to be (am / is / are)",
      grammarPoints: [
        {
          pattern: "I am ... / My name is ...",
          vi: "Tôi là ... / Tên tôi là ...",
          note: "Dùng 'am' với I; 'is' với he / she / it / tên riêng; 'are' với you / we / they.",
          examples: [
            { en: "Hello! My name is Lan.", vi: "Xin chào! Tên tôi là Lan." },
            { en: "I am from Vietnam.", vi: "Tôi đến từ Việt Nam." },
            { en: "She is a student.", vi: "Cô ấy là sinh viên." }
          ]
        },
        {
          pattern: "What is your name? / Where are you from?",
          vi: "Bạn tên là gì? / Bạn đến từ đâu?",
          note: "Trong giao tiếp thường viết tắt: What's your name? — I'm Minh.",
          examples: [
            { en: "What's your name?", vi: "Bạn tên là gì?" },
            { en: "Nice to meet you!", vi: "Rất vui được gặp bạn!" }
          ]
        }
      ],
      dialogueTitle: "Hội thoại: Làm quen ngày đầu lớp học",
      dialogue: [
        { spk: "Nam", en: "Good morning! My name is Nam. What is your name?", vi: "Chào buổi sáng! Tên mình là Nam. Tên bạn là gì?" },
        { spk: "Anna", en: "Hi Nam! I am Anna. Nice to meet you.", vi: "Chào Nam! Mình là Anna. Rất vui được gặp bạn." },
        { spk: "Nam", en: "Nice to meet you too. Where are you from?", vi: "Mình cũng rất vui được gặp bạn. Bạn đến từ đâu?" },
        { spk: "Anna", en: "I am from England. Are you a student here?", vi: "Mình đến từ nước Anh. Bạn là sinh viên ở đây à?" },
        { spk: "Nam", en: "Yes, I am a first-year student. I live in Hanoi.", vi: "Đúng rồi, mình là sinh viên năm nhất. Mình sống ở Hà Nội." },
        { spk: "Anna", en: "Great! Thank you for your help, Nam.", vi: "Tuyệt quá! Cảm ơn bạn đã giúp đỡ nhé, Nam." }
      ],
      vocab: [
        { id: "f0_01", word: "hello", ipa: "/həˈləʊ/", pos: "(excl)", vi: "xin chào", ex: "Hello, my name is Minh." },
        { id: "f0_02", word: "name", ipa: "/neɪm/", pos: "(n)", vi: "tên", ex: "What is your name?" },
        { id: "f0_03", word: "from", ipa: "/frɒm/", pos: "(prep)", vi: "từ, đến từ", ex: "I am from Vietnam." },
        { id: "f0_04", word: "student", ipa: "/ˈstjuː.dənt/", pos: "(n)", vi: "học sinh, sinh viên", ex: "I am a student." },
        { id: "f0_05", word: "teacher", ipa: "/ˈtiː.tʃər/", pos: "(n)", vi: "giáo viên", ex: "My teacher is very kind." },
        { id: "f0_06", word: "country", ipa: "/ˈkʌn.tri/", pos: "(n)", vi: "đất nước", ex: "Vietnam is a beautiful country." },
        { id: "f0_07", word: "live", ipa: "/lɪv/", pos: "(v)", vi: "sống, sinh sống", ex: "I live in Da Nang." },
        { id: "f0_08", word: "nice", ipa: "/naɪs/", pos: "(adj)", vi: "tốt, dễ thương, vui", ex: "Nice to meet you." },
        { id: "f0_09", word: "meet", ipa: "/miːt/", pos: "(v)", vi: "gặp gỡ", ex: "Let's meet tomorrow." },
        { id: "f0_10", word: "morning", ipa: "/ˈmɔː.nɪŋ/", pos: "(n)", vi: "buổi sáng", ex: "Good morning, everyone!" },
        { id: "f0_11", word: "evening", ipa: "/ˈiːv.nɪŋ/", pos: "(n)", vi: "buổi tối", ex: "Good evening, sir." },
        { id: "f0_12", word: "goodbye", ipa: "/ɡʊdˈbaɪ/", pos: "(excl)", vi: "tạm biệt", ex: "Goodbye! See you soon." },
        { id: "f0_13", word: "please", ipa: "/pliːz/", pos: "(excl)", vi: "làm ơn, vui lòng", ex: "Please say that again." },
        { id: "f0_14", word: "thank you", ipa: "/ˈθæŋk juː/", pos: "(excl)", vi: "cảm ơn bạn", ex: "Thank you very much." },
        { id: "f0_15", word: "sorry", ipa: "/ˈsɒr.i/", pos: "(adj)", vi: "xin lỗi", ex: "Sorry, I am late." },
        { id: "f0_16", word: "friend", ipa: "/frend/", pos: "(n)", vi: "bạn bè", ex: "Anna is my new friend." }
      ],
      practice: [
        { q: "Chọn động từ to be đúng: “I ___ from Vietnam.”", opts: ["is", "am", "are"], ans: 1, exp: "Chủ ngữ 'I' luôn đi với 'am'." },
        { q: "Hỏi tên người đối diện một cách tự nhiên:", opts: ["What is your name?", "Where is your name?", "How are your name?"], ans: 0, exp: "Dùng 'What is your name?' để hỏi tên." },
        { q: "Chọn đáp án đúng: “She ___ an English teacher.”", opts: ["am", "are", "is"], ans: 2, exp: "Chủ ngữ số ít 'She' đi với 'is'." },
        { q: "Câu đáp lại lịch sự cho “Nice to meet you.” là:", opts: ["Goodbye!", "Nice to meet you too.", "I am sorry."], ans: 1, exp: "Thêm 'too' (cũng vậy) để đáp lại lời chào làm quen." }
      ],
      production: {
        title: "Nhiệm vụ cuối Cụm 1: Tự giới thiệu bằng 3 câu",
        instruction: "Viết 3 câu tiếng Anh giới thiệu tên, quê quán/nơi sống và nghề nghiệp của bạn, sau đó bấm 'Nghe thử bài viết' và đọc to lại 2 lần.",
        template: "Hello! My name is [Tên]. I am from [Thành phố/Quốc gia]. I am a [student/worker].",
        sample: "Hello! My name is Hoang. I am from Hanoi, Vietnam. I am a university student.",
        minSentences: 3,
        minWords: 12,
        hints: ["name / I am", "from / live in", "student / work / teacher"]
      },
      bridgeLinks: [
        { label: "Luyện nghe Chữ cái & Số (Listening Unit 2)", url: "../listening/index.html?id=listening_u2_5&from=roadmap" },
        { label: "Làm quen Nguyên âm cơ bản (IPA Bài 1)", url: "../speaking/index.html?id=sp_pr_5994&from=roadmap" }
      ]
    },
    {
      id: "m0_c2",
      order: 2,
      code: "Cụm 2",
      title: "Người, Gia đình & Đồ vật",
      subtitle: "Mạo từ a/an, số ít–số nhiều, sở hữu và There is / There are",
      goal: "Đọc hiểu hồ sơ ngắn về gia đình và mô tả người hoặc 3 đồ vật quen thuộc xung quanh.",
      grammarTitle: "Mẫu câu cốt lõi: a/an, số nhiều (-s/-es) & There is / There are",
      grammarPoints: [
        {
          pattern: "a book / an apple / two books",
          vi: "một quyển sách / một quả táo / hai quyển sách",
          note: "Dùng 'an' trước âm nguyên âm (a, e, i, o, u); thêm '-s' hoặc '-es' khi có từ 2 vật trở lên.",
          examples: [
            { en: "I have a small phone and two books.", vi: "Tôi có một chiếc điện thoại nhỏ và hai quyển sách." },
            { en: "There is an apple on the table.", vi: "Có một quả táo trên bàn." }
          ]
        },
        {
          pattern: "There is + số ít / There are + số nhiều",
          vi: "Có (một)... / Có (nhiều)...",
          note: "Dùng để giới thiệu số thành viên gia đình hoặc mô tả đồ vật trong phòng.",
          examples: [
            { en: "There are four people in my family.", vi: "Có 4 người trong gia đình tôi." },
            { en: "This is my mother. Her name is Hoa.", vi: "Đây là mẹ tôi. Tên bà ấy là Hoa." }
          ]
        }
      ],
      dialogueTitle: "Hồ sơ ngắn: Gia đình và góc học tập của Minh",
      dialogue: [
        { spk: "Minh", en: "Look at this photo. This is my family.", vi: "Nhìn bức ảnh này nhé. Đây là gia đình mình." },
        { spk: "Lisa", en: "How many people are there in your family?", vi: "Gia đình bạn có bao nhiêu người?" },
        { spk: "Minh", en: "There are four people: my father, my mother, my sister and me.", vi: "Có 4 người: bố, mẹ, em gái và mình." },
        { spk: "Lisa", en: "Is your house big?", vi: "Nhà bạn có rộng không?" },
        { spk: "Minh", en: "It is small, but it is very clean. There is a big table and two chairs in my room.", vi: "Nhà nhỏ thôi, nhưng rất sạch. Trong phòng mình có một cái bàn lớn và hai cái ghế." },
        { spk: "Lisa", en: "I see your bag and three English books on the table!", vi: "Mình thấy cặp sách và ba quyển sách tiếng Anh của bạn trên bàn kìa!" }
      ],
      vocab: [
        { id: "f0_17", word: "family", ipa: "/ˈfæm.əl.i/", pos: "(n)", vi: "gia đình", ex: "I love my family." },
        { id: "f0_18", word: "mother", ipa: "/ˈmʌð.ər/", pos: "(n)", vi: "mẹ", ex: "My mother cooks very well." },
        { id: "f0_19", word: "father", ipa: "/ˈfɑː.ðər/", pos: "(n)", vi: "bố, cha", ex: "My father is a driver." },
        { id: "f0_20", word: "brother", ipa: "/ˈbrʌð.ər/", pos: "(n)", vi: "anh/em trai", ex: "I have one younger brother." },
        { id: "f0_21", word: "sister", ipa: "/ˈsɪs.tər/", pos: "(n)", vi: "chị/em gái", ex: "Her sister is twelve years old." },
        { id: "f0_22", word: "people", ipa: "/ˈpiː.pəl/", pos: "(n)", vi: "người, mọi người (số nhiều)", ex: "There are five people here." },
        { id: "f0_23", word: "house", ipa: "/haʊs/", pos: "(n)", vi: "ngôi nhà", ex: "We live in a small house." },
        { id: "f0_24", word: "room", ipa: "/ruːm/", pos: "(n)", vi: "căn phòng", ex: "My room is quiet." },
        { id: "f0_25", word: "book", ipa: "/bʊk/", pos: "(n)", vi: "quyển sách", ex: "This book is easy to read." },
        { id: "f0_26", word: "phone", ipa: "/fəʊn/", pos: "(n)", vi: "điện thoại", ex: "Where is my phone?" },
        { id: "f0_27", word: "bag", ipa: "/bæɡ/", pos: "(n)", vi: "túi xách, cặp sách", ex: "My pen is in the bag." },
        { id: "f0_28", word: "water", ipa: "/ˈwɔː.tər/", pos: "(n)", vi: "nước uống", ex: "There is a bottle of water." },
        { id: "f0_29", word: "table", ipa: "/ˈteɪ.bəl/", pos: "(n)", vi: "cái bàn", ex: "Put the cup on the table." },
        { id: "f0_30", word: "chair", ipa: "/tʃeər/", pos: "(n)", vi: "cái ghế", ex: "There are four chairs." },
        { id: "f0_31", word: "big", ipa: "/bɪɡ/", pos: "(adj)", vi: "to, lớn", ex: "It is a big window." },
        { id: "f0_32", word: "small", ipa: "/smɔːl/", pos: "(adj)", vi: "nhỏ, bé", ex: "I have a small desk." }
      ],
      practice: [
        { q: "Chọn câu đúng ngữ pháp:", opts: ["There is four people in my family.", "There are four people in my family.", "There am four people in my family."], ans: 1, exp: "'four people' là số nhiều nên dùng 'There are'." },
        { q: "Chọn mạo từ đúng: “There is ___ apple and ___ book on the desk.”", opts: ["a / an", "an / a", "an / an"], ans: 1, exp: "'apple' bắt đầu bằng âm nguyên âm nên dùng 'an'; 'book' bắt đầu bằng phụ âm dùng 'a'." },
        { q: "Số nhiều đúng của 'chair' là:", opts: ["chairs", "chaires", "chair"], ans: 0, exp: "Danh từ thường chỉ cần thêm '-s' để tạo số nhiều." },
        { q: "Hoàn thành câu: “This is my sister. ___ name is Mai.”", opts: ["His", "Her", "She"], ans: 1, exp: "Tính từ sở hữu của 'she' (cô ấy) là 'Her'." }
      ],
      production: {
        title: "Nhiệm vụ cuối Cụm 2: Mô tả gia đình hoặc bàn học",
        instruction: "Viết 3 câu mô tả số người trong gia đình bạn và 2 đồ vật đang có trên bàn/trong phòng bạn.",
        template: "There are [số] people in my family. In my room, there is a [đồ vật]. There are [số] [đồ vật số nhiều] on my table.",
        sample: "There are four people in my family: my parents, my brother and me. In my room, there is a small table and a chair. There are two books and my phone on the table.",
        minSentences: 3,
        minWords: 15,
        hints: ["There is / There are", "family / room", "a / an / số nhiều"]
      },
      bridgeLinks: [
        { label: "Luyện nghe Địa chỉ & Thông tin (Listening Unit 2)", url: "../listening/index.html?id=listening_u2_7&from=roadmap" },
        { label: "Ôn bài Danh từ cơ bản (Grammar Bài 2)", url: "../grammar/index.html?id=item_2&from=roadmap" }
      ]
    },
    {
      id: "m0_c3",
      order: 3,
      code: "Cụm 3",
      title: "Thời gian & Ngày thường",
      subtitle: "Nói giờ, thứ trong tuần, động từ sinh hoạt và Thì Hiện tại đơn",
      goal: "Nghe hiểu một lịch hẹn ngắn rồi tự nói và viết 4 câu kể về sinh hoạt hằng ngày của bạn.",
      grammarTitle: "Mẫu câu cốt lõi: Hiện tại đơn (Thói quen hằng ngày) & Giới từ thời gian",
      grammarPoints: [
        {
          pattern: "I / You / We / They + V nguyên mẫu  |  He / She + V-s/es",
          vi: "Diễn tả thói quen lặp đi lặp lại mỗi ngày",
          note: "Phủ định dùng don't / doesn't + V nguyên mẫu. Ví dụ: I don't drink coffee at night.",
          examples: [
            { en: "I wake up at 6:30 every day.", vi: "Tôi thức dậy lúc 6 giờ 30 mỗi ngày." },
            { en: "He works from Monday to Friday.", vi: "Anh ấy làm việc từ thứ Hai đến thứ Sáu." }
          ]
        },
        {
          pattern: "at + giờ (at 7:00)  |  on + thứ/ngày (on Monday)  |  in + buổi (in the morning)",
          vi: "3 giới từ chỉ thời gian dùng hằng ngày",
          note: "Ghi nhớ nhanh: AT đi với giờ cụ thể, ON đi với thứ, IN đi với buổi trong ngày.",
          examples: [
            { en: "I study English in the evening.", vi: "Tôi học tiếng Anh vào buổi tối." },
            { en: "We have a meeting on Tuesday at 9 a.m.", vi: "Chúng tôi có cuộc họp vào thứ Ba lúc 9 giờ sáng." }
          ]
        }
      ],
      dialogueTitle: "Hội thoại: Hẹn lịch học nhóm cuối tuần",
      dialogue: [
        { spk: "Mai", en: "What time do you usually wake up, Tom?", vi: "Tom ơi, bạn thường thức dậy lúc mấy giờ?" },
        { spk: "Tom", en: "I usually wake up at 6:30 in the morning. Then I eat breakfast and go to work.", vi: "Mình thường dậy lúc 6:30 sáng. Sau đó mình ăn sáng và đi làm." },
        { spk: "Mai", en: "When do you study English?", vi: "Bạn học tiếng Anh vào lúc nào?" },
        { spk: "Tom", en: "I study for one hour every evening, from 8:00 to 9:00.", vi: "Mình học một tiếng mỗi tối, từ 8 giờ đến 9 giờ." },
        { spk: "Mai", en: "Are you free on Saturday morning at 9 o'clock?", vi: "Sáng thứ Bảy lúc 9 giờ bạn có rảnh không?" },
        { spk: "Tom", en: "Yes! Let's meet at the coffee shop at 9:00 on Saturday.", vi: "Có chứ! Mình gặp nhau ở quán cà phê lúc 9 giờ thứ Bảy nhé." }
      ],
      vocab: [
        { id: "f0_33", word: "day", ipa: "/deɪ/", pos: "(n)", vi: "ngày", ex: "Have a nice day!" },
        { id: "f0_34", word: "today", ipa: "/təˈdeɪ/", pos: "(adv)", vi: "hôm nay", ex: "I am busy today." },
        { id: "f0_35", word: "tomorrow", ipa: "/təˈmɒr.əʊ/", pos: "(adv)", vi: "ngày mai", ex: "See you tomorrow." },
        { id: "f0_36", word: "week", ipa: "/wiːk/", pos: "(n)", vi: "tuần lễ", ex: "There are seven days in a week." },
        { id: "f0_37", word: "hour", ipa: "/aʊər/", pos: "(n)", vi: "giờ, tiếng đồng hồ", ex: "I study for one hour." },
        { id: "f0_38", word: "clock", ipa: "/klɒk/", pos: "(n)", vi: "đồng hồ", ex: "It is seven o'clock." },
        { id: "f0_39", word: "wake up", ipa: "/weɪk ʌp/", pos: "(v)", vi: "thức dậy", ex: "I wake up early." },
        { id: "f0_40", word: "eat", ipa: "/iːt/", pos: "(v)", vi: "ăn", ex: "We eat dinner at 7 p.m." },
        { id: "f0_41", word: "drink", ipa: "/drɪŋk/", pos: "(v)", vi: "uống", ex: "I drink warm water." },
        { id: "f0_42", word: "go", ipa: "/ɡəʊ/", pos: "(v)", vi: "đi", ex: "I go to school by bus." },
        { id: "f0_43", word: "work", ipa: "/wɜːk/", pos: "(v)", vi: "làm việc", ex: "She works in an office." },
        { id: "f0_44", word: "study", ipa: "/ˈstʌd.i/", pos: "(v)", vi: "học tập", ex: "I study English every evening." },
        { id: "f0_45", word: "sleep", ipa: "/sliːp/", pos: "(v)", vi: "ngủ", ex: "I sleep at 11 o'clock." },
        { id: "f0_46", word: "usually", ipa: "/ˈjuː.ʒu.ə.li/", pos: "(adv)", vi: "thường xuyên", ex: "I usually read before bed." },
        { id: "f0_47", word: "always", ipa: "/ˈɔːl.weɪz/", pos: "(adv)", vi: "luôn luôn", ex: "He always arrives on time." },
        { id: "f0_48", word: "every day", ipa: "/ˈev.ri deɪ/", pos: "(adv)", vi: "mỗi ngày", ex: "Practice a little every day." }
      ],
      practice: [
        { q: "Chọn giới từ đúng: “I wake up ___ 6:30 ___ the morning.”", opts: ["in / at", "at / in", "on / at"], ans: 1, exp: "Giờ cụ thể dùng 'at', buổi trong ngày dùng 'in'." },
        { q: "Chia động từ đúng: “My brother ___ in a hospital.”", opts: ["work", "working", "works"], ans: 2, exp: "Chủ ngữ số ít 'My brother' (he) ở hiện tại đơn phải thêm '-s' → 'works'." },
        { q: "Đặt câu hỏi thói quen đúng:", opts: ["What time do you go to bed?", "What time are you go to bed?", "What time does you go to bed?"], ans: 0, exp: "Với động từ thường 'go' và chủ ngữ 'you', dùng trợ động từ 'do'." },
        { q: "Chọn giới từ cho thứ trong tuần: “Let's meet ___ Sunday.”", opts: ["at", "in", "on"], ans: 2, exp: "Thứ và ngày cụ thể luôn dùng giới từ 'on'." }
      ],
      production: {
        title: "Nhiệm vụ cuối Cụm 3: Kể về một ngày của bạn (4 câu)",
        instruction: "Viết 4 câu kể giờ bạn thức dậy, làm việc/học tập, ăn tối và đi ngủ. Chú ý dùng đúng at / in / on.",
        template: "I usually wake up at [giờ]. In the morning, I [go to work / study]. In the evening, I [eat dinner / study English]. I go to sleep at [giờ].",
        sample: "I usually wake up at 6:30 in the morning. I eat breakfast and go to work at 8 o'clock. In the evening, I study English for one hour. I go to sleep at 11 p.m.",
        minSentences: 4,
        minWords: 20,
        hints: ["wake up at", "in the morning / evening", "study / work", "sleep at"]
      },
      bridgeLinks: [
        { label: "Luyện nghe Ngày tháng & Thời gian (Listening Unit 2)", url: "../listening/index.html?id=listening_u2_8&from=roadmap" },
        { label: "Học Thì Hiện tại đơn đầy đủ (Grammar Bài 31)", url: "../grammar/index.html?id=item_31&from=roadmap" }
      ]
    },
    {
      id: "m0_c4",
      order: 4,
      code: "Cụm 4",
      title: "Giá cả, Địa điểm & Tình huống thực tế",
      subtitle: "Hỏi giá (How much), hỏi đường (Where is) và đề nghị lịch sự (Can I have / I'd like)",
      goal: "Hỏi mua một món đồ, nghe hiểu giá tiền, hỏi đường cơ bản và phản hồi bằng câu hoàn chỉnh.",
      grammarTitle: "Mẫu câu cốt lõi: Hỏi mua hàng & Hỏi đường lịch sự",
      grammarPoints: [
        {
          pattern: "Excuse me, how much is this ...? / I would like ...",
          vi: "Xin lỗi cho hỏi cái này giá bao nhiêu? / Tôi muốn gọi (mua)...",
          note: "Dùng 'How much is + số ít' và 'How much are + số nhiều'. 'I would like' (I'd like) lịch sự hơn 'I want'.",
          examples: [
            { en: "Excuse me, how much is this iced coffee?", vi: "Xin lỗi, ly cà phê đá này bao nhiêu tiền ạ?" },
            { en: "I would like a bottle of water, please.", vi: "Cho tôi một chai nước lọc nhé." }
          ]
        },
        {
          pattern: "Where is the ...? — Go straight / Turn left / It is next to ...",
          vi: "... ở đâu? — Đi thẳng / Rẽ trái / Nó ở ngay cạnh ...",
          note: "Thêm 'Excuse me' ở đầu câu để hỏi người lạ lịch sự.",
          examples: [
            { en: "Excuse me, where is the bus station?", vi: "Xin lỗi, trạm xe buýt ở đâu vậy ạ?" },
            { en: "Turn right. It is near the bookshop.", vi: "Rẽ phải. Nó ở gần hiệu sách." }
          ]
        }
      ],
      dialogueTitle: "Hội thoại: Mua đồ uống & hỏi đường ra trạm xe buýt",
      dialogue: [
        { spk: "Clerk", en: "Hello! Can I help you?", vi: "Xin chào! Tôi có thể giúp gì cho bạn?" },
        { spk: "Huy", en: "Hi! How much is a cup of milk coffee?", vi: "Chào bạn! Một ly cà phê sữa giá bao nhiêu vậy?" },
        { spk: "Clerk", en: "It is two dollars. Would you like a small or a big cup?", vi: "Giá hai đô la ạ. Bạn muốn ly nhỏ hay ly lớn?" },
        { spk: "Huy", en: "I would like one small cup, please. Here is the money.", vi: "Cho mình một ly nhỏ nhé. Tiền đây ạ." },
        { spk: "Huy", en: "Excuse me, where is the nearest bus station?", vi: "Xin lỗi, trạm xe buýt gần nhất ở đâu vậy?" },
        { spk: "Clerk", en: "Go straight along this street and turn left. It is right next to the shop.", vi: "Bạn đi thẳng con đường này rồi rẽ trái. Nó ở ngay cạnh cửa hàng." }
      ],
      vocab: [
        { id: "f0_49", word: "buy", ipa: "/baɪ/", pos: "(v)", vi: "mua", ex: "I want to buy a notebook." },
        { id: "f0_50", word: "sell", ipa: "/sel/", pos: "(v)", vi: "bán", ex: "They sell fresh fruit here." },
        { id: "f0_51", word: "price", ipa: "/praɪs/", pos: "(n)", vi: "giá cả", ex: "What is the price of this bag?" },
        { id: "f0_52", word: "money", ipa: "/ˈmʌn.i/", pos: "(n)", vi: "tiền bạc", ex: "I don't have enough money." },
        { id: "f0_53", word: "cheap", ipa: "/tʃiːp/", pos: "(adj)", vi: "rẻ", ex: "The food here is cheap and good." },
        { id: "f0_54", word: "expensive", ipa: "/ɪkˈspen.sɪv/", pos: "(adj)", vi: "đắt tiền", ex: "That phone is too expensive." },
        { id: "f0_55", word: "shop", ipa: "/ʃɒp/", pos: "(n)", vi: "cửa hàng", ex: "The shop opens at 8 a.m." },
        { id: "f0_56", word: "coffee", ipa: "/ˈkɒf.i/", pos: "(n)", vi: "cà phê", ex: "I would like a cup of coffee." },
        { id: "f0_57", word: "food", ipa: "/fuːd/", pos: "(n)", vi: "đồ ăn, thực phẩm", ex: "Vietnamese food is delicious." },
        { id: "f0_58", word: "street", ipa: "/striːt/", pos: "(n)", vi: "con đường, phố", ex: "Walk down this street." },
        { id: "f0_59", word: "station", ipa: "/ˈsteɪ.ʃən/", pos: "(n)", vi: "nhà ga, trạm xe", ex: "The bus station is near here." },
        { id: "f0_60", word: "near", ipa: "/nɪər/", pos: "(prep)", vi: "gần", ex: "My school is near the park." },
        { id: "f0_61", word: "left", ipa: "/left/", pos: "(n/adj)", vi: "bên trái", ex: "Turn left at the corner." },
        { id: "f0_62", word: "right", ipa: "/raɪt/", pos: "(n/adj)", vi: "bên phải / đúng", ex: "The bank is on your right." },
        { id: "f0_63", word: "help", ipa: "/help/", pos: "(v/n)", vi: "giúp đỡ", ex: "Can you help me, please?" },
        { id: "f0_64", word: "want", ipa: "/wɒnt/", pos: "(v)", vi: "muốn", ex: "I want to learn English well." }
      ],
      practice: [
        { q: "Hỏi giá của 1 chiếc túi xách:", opts: ["How many is this bag?", "How much is this bag?", "How much are this bag?"], ans: 1, exp: "Hỏi giá dùng 'How much'; 'this bag' số ít đi với 'is'." },
        { q: "Cách gọi đồ uống lịch sự tại quán:", opts: ["Give me coffee.", "I would like a cup of coffee, please.", "You sell coffee me."], ans: 1, exp: "'I would like ... please' là mẫu đề nghị chuẩn và lịch sự nhất." },
        { q: "Trái nghĩa của 'expensive' (đắt) là:", opts: ["big", "near", "cheap"], ans: 2, exp: "'cheap' có nghĩa là rẻ." },
        { q: "Hỏi đường ra trạm xe buýt:", opts: ["Where is the bus station?", "Who is the bus station?", "When is the bus station?"], ans: 0, exp: "Hỏi vị trí địa điểm luôn dùng 'Where is...'." }
      ],
      production: {
        title: "Nhiệm vụ cuối Cụm 4: Đặt mua hàng & Hỏi đường",
        instruction: "Viết 3 câu gồm: (1) lời chào & hỏi giá một món đồ, (2) đặt mua lịch sự bằng 'I would like...', (3) cảm ơn hoặc hỏi vị trí 1 địa điểm.",
        template: "Excuse me, how much is [món đồ]? I would like [số lượng + món đồ], please. Thank you! Where is the [địa điểm]?",
        sample: "Excuse me, how much is this bottle of water? That is cheap, so I would like two bottles, please. Thank you very much! Where is the nearest bus station?",
        minSentences: 3,
        minWords: 16,
        hints: ["How much", "would like / buy", "please / thank you / where is"]
      },
      bridgeLinks: [
        { label: "Luyện nghe Tiền tệ & Giá cả (Listening Unit 2)", url: "../listening/index.html?id=listening_u2_6&from=roadmap" },
        { label: "Luyện nghe Chỉ đường Bản đồ (Listening Unit 2)", url: "../listening/index.html?id=listening_u2_15&from=roadmap" }
      ]
    }
  ];

  var READINESS_CHECK = {
    id: "m0_check",
    completionId: "m0_check_v2",
    title: "Kiểm tra cuối Mốc 0",
    subtitle: "6 câu nghe, đọc và ghép câu, một đoạn tự viết và một nhiệm vụ nói ngắn.",
    passCorrectMin: 5,
    questions: [
      {
        id: "rc1", skill: "listening", clusterId: "m0_c1",
        audioEn: "Hello! My name is David. I am from Canada, and I am an English teacher in Ho Chi Minh City.",
        prompt: "[Nghe chậm] David làm nghề gì?",
        opts: ["Sinh viên", "Giáo viên tiếng Anh", "Tài xế xe buýt"],
        ans: 1, exp: "Audio nói: 'I am an English teacher in Ho Chi Minh City.'"
      },
      {
        id: "rc2", skill: "listening", clusterId: "m0_c4",
        audioEn: "Good afternoon! The green tea is three dollars, and the coffee is two dollars. The shop is next to the station.",
        prompt: "[Nghe chậm] Ly cà phê có giá bao nhiêu?",
        opts: ["2 đô la", "3 đô la", "5 đô la"],
        ans: 0, exp: "Audio nói: 'the coffee is two dollars.'"
      },
      {
        id: "rc3", skill: "reading", clusterId: "m0_c2",
        passage: "My name is Linh. There are three people in my family: my mother, my brother and me. Our house is small, but my room has a big window and many books.",
        prompt: "[Đọc ngắn] Điều nào ĐÚNG về Linh?",
        opts: ["Gia đình Linh có 4 người", "Phòng của Linh có cửa sổ lớn và nhiều sách", "Nhà của Linh rất to"],
        ans: 1, exp: "Đoạn văn ghi: 'my room has a big window and many books.'"
      },
      {
        id: "rc4", skill: "reading", clusterId: "m0_c3",
        passage: "Phong usually wakes up at 6:00 a.m. He works from Monday to Friday. On Saturday morning, he studies English at a quiet coffee shop near his house.",
        prompt: "[Đọc ngắn] Phong học tiếng Anh ở quán cà phê vào lúc nào?",
        opts: ["Sáng thứ Hai", "Tối thứ Sáu", "Sáng thứ Bảy"],
        ans: 2, exp: "Đoạn văn ghi: 'On Saturday morning, he studies English at a quiet coffee shop'."
      },
      {
        id: "rc5", skill: "grammar", clusterId: "m0_c3",
        prompt: "[Ghép câu] Chọn câu hoàn chỉnh đúng ngữ pháp:",
        opts: ["She go to work at 8 o'clock on Monday.", "She goes to work at 8 o'clock on Monday.", "She goes to work in 8 o'clock at Monday."],
        ans: 1, exp: "'She' đi với 'goes'; giờ dùng 'at', thứ dùng 'on'."
      },
      {
        id: "rc6", skill: "grammar", clusterId: "m0_c4",
        prompt: "[Ghép câu] Muốn mua 1 quyển sách lịch sự và hỏi giá, chọn cặp câu đúng:",
        opts: ["How much is this book? I would like to buy it, please.", "How many is this book? I want buy it.", "Where much is this book? Give me it."],
        ans: 0, exp: "Dùng 'How much is...' để hỏi giá và 'I would like to...' để đề nghị lịch sự."
      }
    ],
    writingTask: {
      prompt: "Viết một đoạn giới thiệu ngắn (4–5 câu, tối thiểu 25 từ) gồm: tên & nơi sống, gia đình, thói quen buổi sáng/tối và lý do bạn học tiếng Anh.",
      sample: "Hello! My name is Tuan and I live in Hanoi. There are four people in my family. I usually wake up at 6:30 and go to work at 8 o'clock. In the evening, I study English for one hour because I want to get a better job."
    }
  };

  var data = {
    DONE_KEY: "lp_ielts_foundation_done_v1",
    SRS_KEY: "lp_ielts_foundation_srs_v1",
    CLUSTERS: CLUSTERS,
    READINESS_CHECK: READINESS_CHECK
  };

  if (typeof window !== "undefined") window.LP_IELTS_FOUNDATION_DATA = data;
  if (typeof module !== "undefined" && module.exports) module.exports = data;
})(typeof window !== "undefined" ? window : globalThis);

/**
 * LinguaPath IELTS Writing Engine & Multi-Mode Parser (v2.0)
 * Bóc tách và chuẩn hóa 259 bài học IELTS Writing (+3 đề Practice Zone):
 * - 42 bài lý thuyết & video bài giảng
 * - 80 bài thực hành Task 1 (6 chế độ: Sample song ngữ, Từ vựng, Ngữ pháp, Liên kết, Chép câu, Viết câu)
 * - 136 bài thực hành Task 2 (6 chế độ tương tự)
 * - Các bộ đề thi thử Practice Zone Full Exam chuẩn thi thật Cambridge (Task 1 + Task 2)
 */

(function (global) {
  'use strict';

  // 1. Phân loại dạng biểu đồ Task 1
  function detectChartType(text) {
    const t = (text || '').toLowerCase();
    if (t.includes('line graph') || t.includes('line chart')) return 'Line Graph';
    if (t.includes('bar chart') || t.includes('bar graph')) return 'Bar Chart';
    if (t.includes('pie chart')) return 'Pie Chart';
    if (t.includes('table')) return 'Table';
    if (t.includes('map') || t.includes('plan')) return 'Map';
    if (t.includes('process') || t.includes('diagram') || t.includes('flow chart') || t.includes('cycle') || t.includes('stages') || t.includes('life cycle')) return 'Process';
    if (t.includes('chart')) return 'Bar/Line Chart';
    return 'Mixed/Other';
  }

  // 2. Phân loại dạng câu hỏi Task 2
  function detectTask2Type(title, text) {
    const full = ((title || '') + ' ' + (text || '')).toLowerCase();
    if (full.includes('discuss both') || full.includes('both sides') || full.includes('both views')) {
      return 'Discuss Both Views';
    }
    if (full.includes('cause') || full.includes('reason') || full.includes('solution') || full.includes('problem')) {
      return 'Problems & Solutions';
    }
    if (full.includes('advantage') || full.includes('disadvantage') || full.includes('outweigh') || full.includes('drawback') || full.includes('benefit')) {
      return 'Advantages & Disadvantages';
    }
    if (full.includes('agree') || full.includes('disagree') || full.includes('opinion')) {
      return 'Agree / Disagree';
    }
    return 'Two-part Question';
  }

  // 3. Phân loại Chủ đề Task 2
  function classifyTask2Topic(title, text) {
    const full = ((title || '') + ' ' + (text || '')).toLowerCase();
    if (/wildlife|wild animal|animal|endangered|nature|species|zoo/i.test(full)) return 'Animals & Wildlife';
    if (/pollut|environment|climate|waste|energy|rubbish|recycle|warming/i.test(full)) return 'Environment & Climate';
    if (/school|educat|teach|student|universit|curriculum|homework/i.test(full)) return 'Education & Schooling';
    if (/internet|computer|software|screen|social media|technolog|phone/i.test(full)) return 'Technology & Digital Life';
    if (/health|hospital|diseas|diet|exercis|sport|fitness|illness/i.test(full)) return 'Health, Sports & Fitness';
    if (/museum|art |artist|cultur|tradition|heritage/i.test(full)) return 'Art, Culture & Heritage';
    if (/job|career|employ|work|salary|retire|unemploy/i.test(full)) return 'Work, Jobs & Careers';
    if (/traffic|transport|car|vehicle|congestion|road|train/i.test(full)) return 'Transport & Urban Life';
    if (/crime|prison|police|punish|law|court|illegal/i.test(full)) return 'Crime, Law & Justice';
    if (/parent|child|young people|teen|youth|famil/i.test(full)) return 'Family, Youth & Children';
    if (/government|fund|tax|public spending|subsidy/i.test(full)) return 'Government & Public Spending';
    if (/media|television|news|advertis|broadcast/i.test(full)) return 'Media & News';
    return 'Society & Modern Life';
  }

  // 4. Trích xuất dàn ý gợi ý
  function generateOutline(category, sampleText) {
    if (category === 'Task 1') {
      return [
        { section: 'Introduction', guide: 'Paraphrase lại đề bài: Biểu đồ thể hiện thông tin gì, ở đâu, giai đoạn nào.' },
        { section: 'Overview', guide: '2-3 xu hướng chính nổi bật nhất (tăng/giảm tổng thể, đỉnh cao nhất, đáy thấp nhất).' },
        { section: 'Body Paragraph 1', guide: 'Phân tích chi tiết nhóm số liệu chính thứ nhất kèm mốc thời gian và so sánh.' },
        { section: 'Body Paragraph 2', guide: 'Phân tích nhóm số liệu còn lại và các điểm tương phản đáng chú ý.' }
      ];
    }
    return [
      { section: 'Introduction', guide: 'Mở bài (2 câu): Dẫn dắt vấn đề (Background) + Nêu rõ quan điểm của bạn (Thesis Statement).' },
      { section: 'Body Paragraph 1', guide: 'Thân bài 1: Phát triển luận điểm thứ nhất với lập luận logic (Topic Sentence → Explain → Example).' },
      { section: 'Body Paragraph 2', guide: 'Thân bài 2: Phát triển luận điểm thứ hai hoặc phân tích khía cạnh đối lập sâu sắc.' },
      { section: 'Conclusion', guide: 'Kết luận (1-2 câu): Tóm tắt lại các ý chính và khẳng định dứt khoát lập trường của bạn.' }
    ];
  }

  // 5. Đếm số từ chuẩn
  function countWords(str) {
    if (!str) return 0;
    const clean = str.replace(/<[^>]*>/g, ' ').replace(/[^\w\s'-]/g, ' ').trim();
    if (!clean) return 0;
    return clean.split(/\s+/).filter(Boolean).length;
  }

  // 6. Danh sách 3 Bộ đề thi thử Practice Zone Full Exam chuẩn Cambridge
  const PRACTICE_ZONE_TESTS = [
    {
      testId: 'pz_test_1',
      testTitle: 'IELTS Academic Writing Test 1 (Standard Cambridge)',
      durationMinutes: 60,
      task1: {
        title: 'Task 1: Sales of Fairtrade Coffee and Bananas [Table]',
        chartType: 'Table',
        images: ['https://study4.com/media/ielts_essay/images/image41.png'],
        prompt: 'The tables below give information about sales of Fairtrade*-labelled coffee and bananas in 1999 and 2004 in five European countries.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\nWrite at least 150 words.',
        timeMinutes: 20,
        minWords: 150,
        sampleText: `The tables show the amount of money spent on Fairtrade coffee and bananas in two separate years in the UK, Switzerland, Denmark, Belgium and Sweden.\n\nIt is clear that sales of Fairtrade coffee rose in all five European countries from 1999 to 2004, but sales of Fairtrade bananas only went up in three out of the five countries. Overall, the UK saw by far the highest levels of spending on the two products.\n\nIn 1999, Switzerland had the highest sales of Fairtrade coffee, at €3 million, while revenue from Fairtrade bananas was highest in the UK, at €15 million. By 2004, however, sales of Fairtrade coffee in the UK had risen to €20 million, and this was over three times higher than Switzerland’s sales figure for Fairtrade coffee in that year. The year 2004 also saw dramatic increases in the money spent on Fairtrade bananas in the UK and Switzerland, with revenues rising by €32 million and €4.5 million respectively.\n\nSales of the two Fairtrade products were far lower in Denmark, Belgium and Sweden. Small increases in sales of Fairtrade coffee can be seen, but revenue remained at €2 million or below in all three countries in both years. Finally, it is noticeable that the money spent on Fairtrade bananas actually fell in Belgium and Sweden.`
      },
      task2: {
        title: 'Task 2: Protecting Wild Animals vs Human Needs',
        questionType: 'Agree / Disagree',
        topic: 'Animals & Wildlife',
        prompt: 'Many people feel it is a waste of money to try to save endangered animal species, for example the tiger or the blue whale. To what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\nWrite at least 250 words.',
        timeMinutes: 40,
        minWords: 250,
        sampleText: `It is true that considerable amounts of public money are currently devoted to protecting endangered animal species around the world. While some critics argue that such expenditure is wasteful and should instead be allocated to addressing human issues, I completely disagree with this viewpoint.\n\nIn my opinion, funding wildlife conservation projects is vital for maintaining ecological balance and protecting our planet's biodiversity. Every species plays a distinctive role in its natural ecosystem. If key species such as apex predators or marine mammals disappear, this triggers a catastrophic trophic cascade that disrupts food webs, degrades natural habitats, and ultimately harms humans who rely on healthy ecosystems for clean water, oxygen, and fertile soils. Furthermore, preserving biodiversity ensures a rich reservoir of genetic resources that may yield future medicines, agricultural crops, and technological innovations.\n\nOn the other hand, prioritising human concerns exclusively reflects a short-sighted approach to governance and development. Many of the global crises humanity faces today, including zoonotic disease outbreaks and climate instability, are direct consequences of habitat destruction and excessive human encroachment on nature. By investing in the preservation of wild animal habitats, governments simultaneously safeguard vast tracts of rainforests, peatlands, and oceans, which are essential carbon sinks that moderate global warming. Therefore, spending resources on wildlife protection is not a waste, but rather an essential investment in the long-term survival and prosperity of humanity.\n\nIn conclusion, protecting endangered wildlife is indispensable for planetary health and human survival. Financial resources invested in conservation efforts are entirely justified.`
      }
    },
    {
      testId: 'pz_test_2',
      testTitle: 'IELTS Academic Writing Test 2 (Urban Life & Society)',
      durationMinutes: 60,
      task1: {
        title: 'Task 1: Underground Railway Systems in Six Cities [Table]',
        chartType: 'Table',
        images: ['https://study4.com/media/ielts_essay/images/image42.png'],
        prompt: 'The table below gives information about the underground railway systems in six cities.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\nWrite at least 150 words.',
        timeMinutes: 20,
        minWords: 150,
        sampleText: `The table compares six underground railway networks in terms of their age, route length and annual passenger numbers.\n\nIt is clear that the railway system in London is the oldest and possesses the longest route network, while the Tokyo subway carries by far the highest number of passengers each year.\n\nThe London underground was opened first in 1863, and its route covers a distance of 394 kilometres. This is considerably larger than the network in Paris, which opened in 1900 and has 199 kilometres of track, and the Tokyo subway, which was established in 1927 with 155 kilometres. By contrast, the systems in Washington DC, Kyoto and Los Angeles are much newer, dating from 1976, 1981 and 2001 respectively, and all have track lengths of under 130 kilometres.\n\nIn terms of passenger numbers, Tokyo serves 1,927 million people each year, making it the most heavily used system. Paris follows with 1,191 million passengers, while London carries 775 million passengers annually. The three newer networks carry far fewer passengers, with Washington DC serving 144 million people per year, Kyoto handling 45 million, and Los Angeles carrying only 50 million.`
      },
      task2: {
        title: 'Task 2: Economic Growth vs Environmental Damage',
        questionType: 'Discuss Both Views',
        topic: 'Environment & Climate',
        prompt: 'Some people believe that economic development will lead to the solution of global environmental problems, while others argue that economic growth is the cause of environmental damage.\n\nDiscuss both views and give your own opinion.\nWrite at least 250 words.',
        timeMinutes: 40,
        minWords: 250,
        sampleText: `Human economic activities have expanded dramatically over recent decades, raising intense debates regarding the relationship between economic growth and environmental sustainability. While some individuals believe that continued economic development is the key to solving environmental issues, others argue that it is the fundamental cause of ecological degradation. In this essay, I will explore both views and explain why I believe economic progress, when steered towards green technologies, is indispensable for global environmental recovery.\n\nOn the one hand, critics correctly point out that conventional economic growth has historically been achieved at catastrophic environmental costs. Industrial expansion relies heavily on fossil fuel combustion, leading to greenhouse gas emissions and global warming. Moreover, consumerist economies generate massive quantities of non-biodegradable waste and accelerate the depletion of non-renewable natural resources, including rainforests and mineral reserves. The relentless pursuit of short-term Gross Domestic Product growth without strict ecological boundaries has demonstrably caused habitat destruction, species extinction, and dangerous air and water pollution in developing and developed nations alike.\n\nOn the other hand, proponents argue that wealth generation and technological advancement are prerequisite conditions for genuine environmental solutions. Poor nations struggling with poverty rarely have the financial latitude to invest in expensive renewable energy infrastructure, advanced sewage treatment plants, or carbon-capture facilities. Only through economic prosperity can societies fund research and development into solar energy, wind farms, and sustainable transportation. Furthermore, advanced economies typically experience an ecological transition: as public wealth and education levels rise, societal demand for clean air and strict environmental legislation increases, prompting industries to adopt circular and eco-friendly practices.\n\nIn conclusion, while reckless economic growth has undeniably degraded ecosystems, I believe that sustainable, green-oriented economic development provides the necessary capital and technological innovations to reverse environmental harm and ensure long-term ecological balance.`
      }
    },
    {
      testId: 'pz_test_3',
      testTitle: 'IELTS Academic Writing Test 3 (Education & Technology)',
      durationMinutes: 60,
      task1: {
        title: 'Task 1: Consumer Spending on Different Items in 2002 [Table]',
        chartType: 'Table',
        images: ['https://study4.com/media/ielts_essay/images/image43.png'],
        prompt: 'The table below shows the percentage of national consumer expenditure on three categories of items in five countries in 2002.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\nWrite at least 150 words.',
        timeMinutes: 20,
        minWords: 150,
        sampleText: `The table compares the proportions of national consumer spending on three categories of goods and services across five countries in 2002.\n\nOverall, food, drinks and tobacco accounted for the largest percentage of consumer expenditure in all five nations, while expenditure on leisure and education was consistently the lowest. Among the five countries, Turkey and Ireland spent the most on food and drinks, whereas Italy spent the highest proportion on clothing and footwear.\n\nIn terms of food, drinks and tobacco, Turkey recorded the highest proportion of spending, at 32.14%, followed closely by Ireland at 28.91%. In contrast, consumers in Spain, Italy and Sweden spent considerably lower shares on this category, with figures standing at 18.80%, 16.36% and 15.77% respectively.\n\nRegarding the other two categories, Italian citizens spent 9.00% of their total expenditure on clothing and footwear, which was the highest among all surveyed nations. This was followed by Italy's counterparts in Spain (6.51%), Sweden (5.40%) and Ireland (6.43%). Finally, spending on leisure and education remained below 5% in almost every nation, ranging from only 1.98% in Spain to a peak of 4.35% in Turkey and 3.22% in Sweden.`
      },
      task2: {
        title: 'Task 2: Traditional Classrooms vs Online Education',
        questionType: 'Discuss Both Views',
        topic: 'Education & Schooling',
        prompt: 'Computers and the internet have revolutionized modern education. Some people believe that online learning will eventually replace traditional classroom teaching, while others believe that physical schools will always be essential.\n\nDiscuss both views and give your own opinion.\nWrite at least 250 words.',
        timeMinutes: 40,
        minWords: 250,
        sampleText: `The rapid proliferation of digital communication and internet technologies has profoundly transformed the global educational landscape. While an increasing number of people envision a future where virtual learning replaces traditional brick-and-mortar schools, others argue that physical classrooms remain irreplaceable. In my view, although online platforms provide invaluable complementary resources, physical schools provide essential social and psychological dimensions that technology alone cannot replicate.\n\nOn the one hand, advocates of online education highlight its unprecedented flexibility and cost-effectiveness. Web-based platforms democratise knowledge by allowing students worldwide to access lectures, course materials, and credentials from top global universities without relocating or incurring prohibitive accommodation fees. Furthermore, asynchronous learning empowers students to study at their individual pace, pause complex explanations, and revisit recordings at will. For adult learners, working professionals, and individuals residing in remote geographic areas, distance learning eliminates logistical barriers and creates lifelong educational opportunities that physical institutions cannot match.\n\nOn the other hand, the physical classroom offers irreplaceable educational benefits that extend far beyond the mere transmission of academic knowledge. Real-time, face-to-face interactions with educators cultivate spontaneous intellectual discussions, critical thinking, and immediate feedback on student comprehension. More importantly, schools serve as vital societal institutions where children learn essential interpersonal skills, emotional intelligence, teamwork, and conflict resolution through collaborative playground activities and group projects. Excessive reliance on virtual learning risks fostering social isolation, reduced attention spans, and sedentary lifestyle habits among young learners.\n\nIn conclusion, while online education is an extraordinarily powerful supplementary tool that enhances accessibility, it can never entirely replace physical classrooms. A blended model that integrates the convenience of digital technology with the indispensable human touch of traditional schooling represents the ideal future of education.`
      }
    }
  ];

  // =========================================================================
  // OBJECT PARSER CHÍNH
  // =========================================================================
  const WritingParser = {
    cache: null,

    init(rawData) {
      const src = rawData || (typeof window !== 'undefined' ? window.STUDY4_WRITING_DATA : null);
      if (!src || !src.units) {
        console.warn('[WritingParser] Chưa tìm thấy STUDY4_WRITING_DATA!');
        return null;
      }

      const allLessons = [];
      const stats = {
        total: 0,
        theory: 0,
        task1: 0,
        task2: 0,
        practiceZone: PRACTICE_ZONE_TESTS.length,
        pzStudy4Bank: 1183,
        pzTask1: 497,
        pzTask2: 686,
        byUnit: {}
      };

      src.units.forEach((unit, uIdx) => {
        const uId = unit.unitId || `u_${uIdx + 1}`;
        const uName = unit.unitName || `Unit ${uIdx + 1}`;

        // Bỏ qua Unit 6 rỗng mặc định, thay bằng PRACTICE_ZONE_TESTS chất lượng cao
        if (uId === 'u_6') return;

        stats.byUnit[uId] = { id: uId, name: uName, count: (unit.items || []).length };

        (unit.items || []).forEach((item, itemIdx) => {
          stats.total++;
          const prob = item.problem || null;

          let lessonType = 'theory';
          let category = 'Theory';
          let chartType = '';
          let questionType = '';
          let topic = '';

          // 1. Phân loại bài học
          if (uId === 'u_1') {
            category = 'Task 1';
            stats.theory++;
          } else if (uId === 'u_2') {
            category = 'Task 2';
            stats.theory++;
          } else if (uId === 'u_3') {
            lessonType = 'practice_task1';
            category = 'Task 1';
            stats.task1++;
          } else if (uId === 'u_4' || uId === 'u_5') {
            lessonType = 'practice_task2';
            category = 'Task 2';
            stats.task2++;
          }

          // 2. Làm sạch tiêu đề bài học
          let cleanTitle = (item.title || item.actTitle || `Bài ${itemIdx + 1}`).replace(/^Luyện tập:\s*/i, '').trim();

          // 3. Trích xuất đề bài & hình ảnh
          let prompt = (prob && prob.prompt) ? prob.prompt.trim() : '';
          let images = (prob && prob.images) ? prob.images : (item.slideImages || []);

          // 4. Bóc tách câu bài mẫu song ngữ & từ vựng kèm nghĩa tiếng Việt (ĐÃ KHỬ TRÙNG & GÁN VAI TRÒ CÂU)
          const rawSentences = (prob && prob.sampleSentences) ? prob.sampleSentences : [];
          const cleanSentences = [];
          const vocabMap = new Map();

          // Thuật toán khử trùng lặp câu (deduplicate)
          rawSentences.forEach((s) => {
            if (!s || !s.en) return;
            const normText = s.en.replace(/\s+/g, ' ').trim();
            if (normText.length < 5) return;

            const last = cleanSentences[cleanSentences.length - 1];
            if (last) {
              const lastNorm = last.en.replace(/\s+/g, ' ').trim();
              if (lastNorm === normText || lastNorm.includes(normText)) {
                if (s.vocabWords && Array.isArray(s.vocabWords)) {
                  s.vocabWords.forEach(vw => {
                    if (vw && vw.word && !last.vocabWords.some(x => x.word.toLowerCase() === vw.word.toLowerCase())) {
                      last.vocabWords.push(vw);
                    }
                  });
                }
                return;
              }
              if (normText.includes(lastNorm) && normText.length > lastNorm.length) {
                last.en = s.en;
                if (s.vocabWords && Array.isArray(s.vocabWords)) {
                  s.vocabWords.forEach(vw => {
                    if (vw && vw.word && !last.vocabWords.some(x => x.word.toLowerCase() === vw.word.toLowerCase())) {
                      last.vocabWords.push(vw);
                    }
                  });
                }
                return;
              }
            }

            cleanSentences.push({
              en: s.en,
              vocabWords: Array.isArray(s.vocabWords) ? [...s.vocabWords] : []
            });
          });

          // Gán vai trò câu học thuật (Sentence Roles) chuẩn IELTS
          const totalS = cleanSentences.length;
          cleanSentences.forEach((s, sIdx) => {
            let role = 'detail';
            let roleLabel = 'Chi tiết (Body Detail)';
            if (sIdx === 0) {
              role = 'opening';
              roleLabel = 'Mở bài (Introduction)';
            } else if (sIdx === 1 || (totalS >= 6 && sIdx === 2 && s.en.toLowerCase().includes('overall'))) {
              role = 'overview';
              roleLabel = 'Tổng quan (Overview)';
            } else if (sIdx < Math.ceil((totalS + 2) / 2)) {
              role = 'body1';
              roleLabel = 'Thân bài 1 (Body 1)';
            } else if (category === 'Task 2' && sIdx === totalS - 1) {
              role = 'conclusion';
              roleLabel = 'Kết luận (Conclusion)';
            } else {
              role = 'body2';
              roleLabel = 'Thân bài 2 (Body 2)';
            }
            s.role = role;
            s.roleLabel = roleLabel;

            if (s.vocabWords && Array.isArray(s.vocabWords)) {
              s.vocabWords.forEach(vw => {
                if (vw.word && !vocabMap.has(vw.word.toLowerCase())) {
                  vocabMap.set(vw.word.toLowerCase(), {
                    word: vw.word,
                    meaning: vw.meaning || ''
                  });
                }
              });
            }
          });

          const sampleSentences = cleanSentences;
          const sampleText = sampleSentences.map(s => s.en).join('\n\n');
          const sampleWordCount = countWords(sampleText);
          const vocabList = [...vocabMap.values()];

          // 5. Bóc tách bài tập luyện viết câu (Word unscramble)
          const writeExercises = (prob && prob.writeExercises) ? prob.writeExercises : [];

          // 6. Bóc tách các tab bài tập thô (Vocab, Grammar, Cohesion, Structure)
          const exerciseTabs = (prob && prob.exerciseTabs) ? prob.exerciseTabs : null;
          const grammarHtml = (prob && prob.exerciseTabs && prob.exerciseTabs.grammarHtml) ? prob.exerciseTabs.grammarHtml : '';

          // 7. Nhận diện Dạng biểu đồ hoặc Dạng câu hỏi
          if (category === 'Task 1') {
            chartType = detectChartType(cleanTitle + ' ' + prompt);
            if (!cleanTitle.includes('[') && chartType) {
              cleanTitle = `${cleanTitle} [${chartType}]`;
            }
          } else if (category === 'Task 2') {
            questionType = detectTask2Type(cleanTitle, prompt);
            topic = classifyTask2Topic(cleanTitle, prompt);
          }

          // Dàn ý gợi ý
          const outline = generateOutline(category, sampleText);

          allLessons.push({
            id: item.id || `writing_${uId}_${itemIdx + 1}`,
            unitId: uId,
            unitName: uName,
            type: lessonType,
            category,
            title: cleanTitle,
            actTitle: item.actTitle || cleanTitle,
            url: item.url || '',
            youtubeId: item.youtubeId || '',
            htmlContent: item.htmlContent || '',
            images,
            chartType,
            questionType,
            topic,
            prompt,
            sampleText,
            sampleSentences,
            sampleWordCount,
            vocabList,
            writeExercises,
            exerciseTabs,
            grammarHtml,
            outline
          });
        });
      });

      // 8. Đưa các bộ đề thi thử Practice Zone vào danh sách
      PRACTICE_ZONE_TESTS.forEach((pz, pzIdx) => {
        stats.total++;
        allLessons.push({
          id: `writing_pz_${pzIdx + 1}`,
          unitId: 'u_6',
          unitName: 'PRACTICE ZONE',
          type: 'practice_full',
          category: 'Full Test',
          title: pz.testTitle,
          actTitle: pz.testTitle,
          url: '',
          youtubeId: '',
          htmlContent: '',
          images: pz.task1.images || [],
          chartType: pz.task1.chartType,
          questionType: pz.task2.questionType,
          topic: pz.task2.topic,
          prompt: `Bài thi thử chuẩn IELTS 60 phút gồm Task 1 và Task 2.`,
          sampleText: '',
          sampleSentences: [],
          sampleWordCount: 0,
          vocabList: [],
          writeExercises: [],
          exerciseTabs: null,
          outline: [],
          fullTestSpec: pz
        });
      });

      stats.byUnit['u_6'] = { id: 'u_6', name: 'PRACTICE ZONE', count: PRACTICE_ZONE_TESTS.length };

      this.cache = {
        stats,
        lessons: allLessons
      };

      return this.cache;
    },

    getStudy4PzCatalog() {
      const root = (typeof window !== 'undefined') ? window : globalThis;
      return (root && Array.isArray(root.__STUDY4_WRITING_PZ)) ? root.__STUDY4_WRITING_PZ : [];
    },

    _findCourseSample(sampleId) {
      if (!sampleId) return '';
      if (!this.cache) this.init();
      if (!this.cache || !Array.isArray(this.cache.lessons)) return '';
      const found = this.cache.lessons.find(l => l.id === sampleId);
      return (found && found.sampleText) ? found.sampleText : '';
    },

    _toPzTaskSpec(part, roleKey) {
      const isT1 = roleKey === 'task1';
      return {
        taskId: roleKey,
        pzPartId: String(part.id),
        title: part.title,
        chartType: isT1 ? (part.subType || 'Chart') : '',
        questionType: !isT1 ? (part.subType || 'Academic Essay') : '',
        topic: !isT1 ? (part.seriesLabel || 'IELTS Practice') : '',
        minWords: isT1 ? 150 : 250,
        suggestedTime: isT1 ? '20 minutes' : '40 minutes',
        prompt: part.prompt || '',
        promptHtml: part.promptHtml || '',
        images: Array.isArray(part.images) ? part.images : [],
        sampleId: part.sampleId || '',
        sampleText: this._findCourseSample(part.sampleId)
      };
    },

    buildPzPairLesson(t1Id, t2Id, customTitle) {
      const cat = this.getStudy4PzCatalog();
      if (!cat.length) return null;
      const t1 = cat.find(p => String(p.id) === String(t1Id)) || cat.find(p => p.tag === 'Task 1');
      const t2 = cat.find(p => String(p.id) === String(t2Id)) || cat.find(p => p.tag === 'Task 2');
      if (!t1 || !t2) return null;

      const pairId = `writing_pz_pair_${t1.id}_${t2.id}`;
      const labelTitle = customTitle || `Study4 Full Exam #${t1.id}-${t2.id}`;
      return {
        id: pairId,
        unitId: 'u_6',
        unitName: 'PRACTICE ZONE',
        type: 'practice_full',
        category: 'Full Test',
        preferredMode: 'both',
        pzSource: 'study4',
        title: labelTitle,
        actTitle: labelTitle,
        chartType: t1.subType || 'Task 1',
        questionType: t2.subType || 'Task 2',
        topic: `${t1.seriesLabel || 'Study4'} • ${t2.seriesLabel || 'Study4'}`,
        prompt: 'Bài thi thử chuẩn IELTS 60 phút ghép từ kho Practice Zone Study4.',
        promptHtml: '',
        images: t1.images || [],
        sampleText: '',
        sampleSentences: [],
        sampleWordCount: 0,
        vocabList: [],
        writeExercises: [],
        exerciseTabs: null,
        outline: [],
        fullTestSpec: {
          testId: pairId,
          testTitle: labelTitle,
          task1: this._toPzTaskSpec(t1, 'task1'),
          task2: this._toPzTaskSpec(t2, 'task2')
        }
      };
    },

    buildPzLessonFromPart(partId) {
      const cat = this.getStudy4PzCatalog();
      if (!cat.length) return null;
      const idx = cat.findIndex(p => String(p.id) === String(partId));
      if (idx === -1) return null;
      const part = cat[idx];
      const isT1 = part.tag === 'Task 1';
      const oppositeTag = isT1 ? 'Task 2' : 'Task 1';

      let partner = part.partnerId ? cat.find(p => String(p.id) === String(part.partnerId)) : null;
      if (!partner) {
        const oppList = cat.filter(p => p.tag === oppositeTag);
        if (oppList.length > 0) {
          partner = oppList[idx % oppList.length];
        }
      }

      const t1Part = isT1 ? part : partner;
      const t2Part = isT1 ? partner : part;
      const lessonId = `writing_pz_part_${part.id}`;

      return {
        id: lessonId,
        unitId: 'u_6',
        unitName: 'PRACTICE ZONE',
        type: 'practice_full',
        category: part.tag,
        preferredMode: isT1 ? 'task1' : 'task2',
        pzSource: 'study4',
        pzPartId: String(part.id),
        pzSeries: part.series,
        pzSeriesLabel: part.seriesLabel,
        hasNaturalPartner: Boolean(part.partnerId),
        title: part.title,
        actTitle: part.title,
        chartType: isT1 ? (part.subType || 'Task 1') : (t1Part ? (t1Part.subType || 'Task 1') : 'Task 1'),
        questionType: !isT1 ? (part.subType || 'Task 2') : (t2Part ? (t2Part.subType || 'Task 2') : 'Task 2'),
        topic: part.seriesLabel || 'Study4 Practice Zone',
        prompt: part.prompt || '',
        promptHtml: part.promptHtml || '',
        images: part.images || [],
        sampleText: this._findCourseSample(part.sampleId),
        sampleSentences: [],
        sampleWordCount: countWords(this._findCourseSample(part.sampleId)),
        vocabList: [],
        writeExercises: [],
        exerciseTabs: null,
        outline: [],
        fullTestSpec: {
          testId: lessonId,
          testTitle: part.title,
          task1: t1Part ? this._toPzTaskSpec(t1Part, 'task1') : { taskId: 'task1', title: 'Task 1', minWords: 150, prompt: '', images: [], sampleText: '' },
          task2: t2Part ? this._toPzTaskSpec(t2Part, 'task2') : { taskId: 'task2', title: 'Task 2', minWords: 250, prompt: '', images: [], sampleText: '' }
        }
      };
    },

    getAllLessons() {
      if (!this.cache) this.init();
      return (this.cache && this.cache.lessons) ? this.cache.lessons : [];
    },

    getLessonById(id) {
      const lessons = this.getAllLessons();
      const direct = lessons.find(l => l.id === id);
      if (direct) return direct;
      const sid = String(id || '');
      if (sid.startsWith('writing_pz_part_')) {
        return this.buildPzLessonFromPart(sid.slice('writing_pz_part_'.length));
      }
      if (sid.startsWith('writing_pz_pair_')) {
        const parts = sid.slice('writing_pz_pair_'.length).split('_');
        if (parts.length >= 2) {
          return this.buildPzPairLesson(parts[0], parts[1]);
        }
      }
      return null;
    },

    getStats() {
      if (!this.cache) this.init();
      const s = (this.cache && this.cache.stats) ? this.cache.stats : null;
      if (s) {
        const cat = this.getStudy4PzCatalog();
        if (cat.length > 0) {
          s.pzStudy4Bank = cat.length;
          s.pzTask1 = cat.filter(p => p.tag === 'Task 1').length;
          s.pzTask2 = cat.filter(p => p.tag === 'Task 2').length;
        }
      }
      return s;
    },

    getFilters() {
      const lessons = this.getAllLessons();
      const chartTypes = new Set();
      const questionTypes = new Set();
      const topics = new Set();

      lessons.forEach(l => {
        if (l.chartType) chartTypes.add(l.chartType);
        if (l.questionType) questionTypes.add(l.questionType);
        if (l.topic) topics.add(l.topic);
      });

      return {
        chartTypes: [...chartTypes].sort(),
        questionTypes: [...questionTypes].sort(),
        topics: [...topics].sort()
      };
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = WritingParser;
  } else {
    global.WritingParser = WritingParser;
  }
})(typeof window !== 'undefined' ? window : this);

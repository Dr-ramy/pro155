/**
 * تطبيق «بصمة خضراء» - الإصدار الأول
 * تجربة تفاعلية مصغّرة في الجغرافيا البيئية لطلاب المرحلة المتوسطة في العراق
 * يخدم متغيري البحث العلمي:
 *   1. مهارات حل المشكلات البيئية (تقييم من 10 درجات)
 *   2. الحس الجمالي (تقييم مستقل من 0 إلى 2 درجة)
 */

// ============================================================================
// 1. نموذج البيانات الموحد للسيناريوهات الثلاثة (SCENARIOS DATA MODEL)
// ============================================================================
const SCENARIOS = {
  river: {
    id: "river",
    numberLabel: "السيناريو الأول",
    title: "حارس النهر",
    issueSubtitle: "تلوث المياه وتدهور المشهد النهري",
    locationBadge: "بيئات الأنهار وضفافها في العراق (دجلة والفرات)",
    icon: "bi-water",
    themeColor: "#0284c7",
    context: "«لاحظت أن جزءًا من ضفة النهر يحتوي على مخلفات، وأن بعض المياه تبدو متدهورة الجودة. طُلب منك اقتراح خطة تساعد على تحسين البيئة وحماية جمال المكان. ما أول ما ينبغي أن تفعله؟»",
    geoNote: "مشهد تعليمي مستوحى من بيئات الأنهار في العراق، يربط بين جودة المياه والغطاء النباتي النهري وجمال الضفاف.",
    
    // المهارة 1: تحديد المشكلة (2 درجة)
    problemQuestion: {
      options: [
        {
          id: "p_correct",
          text: "تلوث مياه النهر وتدهور نظافة الضفاف نتيجة مصادر ملوثة ومخلفات تؤثر في النظام البيئي وجمال المشهد النهري.",
          points: 2,
          feedback: "تحديد دقيق وشامل! جمعت بين تدهور جودة المياه وتراكم المخلفات على الضفة وأثرهما في المشهد النهري."
        },
        {
          id: "p_partial",
          text: "وجود بعض الأكياس البلاستيكية على ضفة النهر فقط مع سلامة المياه تمامًا.",
          points: 1,
          feedback: "تحديد جزئي؛ رصدت مظهر المخلفات على الضفة لكنك أغفلت تدهور جودة المياه نفسها ومصادر تلوثها."
        },
        {
          id: "p_wrong",
          text: "تغير لون الماء بسبب انعكاس أشعة الشمس وحركة القوارب الطبيعية في النهر.",
          points: 0,
          feedback: "غير دقيق؛ المعطيات تشير بوضوح إلى تدهور جودة المياه ووجود مخلفات وليس مجرد ظاهرة ضوئية طبيعية."
        }
      ]
    },

    // ملاحظة عناصر المشهد الجغرافي (تمهيد الحس الجمالي)
    observationChips: [
      { id: "obs1", text: "تغير لون الماء وعكورته قرب أنبوب التصريف" },
      { id: "obs2", text: "تراكم النفايات البلاستيكية على ضفة النهر" },
      { id: "obs3", text: "تراجع نضارة القصب والنباتات النهرية" },
      { id: "obs4", text: "اختلال التناسق البصري بين الماء والضفة" }
    ],

    // المهارة 2: تحليل الأسباب (2 درجة) - مطابق لجدول الوثيقة
    causesPrompt: "أي العوامل التالية قد يسهم في المشكلة؟ (اختر الأسباب المحتملة المباشرة والعوامل المؤثرة)",
    causes: [
      {
        id: "sewage_discharge",
        title: "تصريف مياه الصرف دون معالجة",
        classification: "سبب محتمل مباشر",
        badgeClass: "bg-danger-subtle text-danger-emphasis",
        isDirectCause: true,
        isContributingFactor: false,
        explanation: "يُعد من أخطر المصادر المباشرة التي تدهور جودة مياه النهر كيميائيًا وحيويًا وتغير لونها ورائحتها."
      },
      {
        id: "throwing_waste",
        title: "إلقاء النفايات في النهر وعلى ضفافه",
        classification: "سبب محتمل مباشر",
        badgeClass: "bg-danger-subtle text-danger-emphasis",
        isDirectCause: true,
        isContributingFactor: false,
        explanation: "يؤدي مباشرة إلى تراكم المخلفات الصلبه والبلاستيكية على الضفاف ويشوه المشهد النهري ويضر الكائنات المائية."
      },
      {
        id: "sun_reflection",
        title: "انعكاس أشعة الشمس على سطح الماء",
        classification: "ليس سببًا للتلوث بذاته",
        badgeClass: "bg-secondary-subtle text-secondary",
        isDirectCause: false,
        isContributingFactor: false,
        explanation: "ظاهرة طبيعية بصرية تمنح النهر بريقًا جماليًا عندما يكون نقيًا، وليست سببًا لتدهور جودة المياه."
      },
      {
        id: "drought_low_water",
        title: "انخفاض مستوى المياه في موسم الجفاف",
        classification: "عامل قد يزيد بعض المشكلات، لكنه لا يثبت وجود التلوث وحده",
        badgeClass: "bg-warning-subtle text-warning-emphasis",
        isDirectCause: false,
        isContributingFactor: true,
        explanation: "انخفاض المنسوب يقلل قدرة النهر على تخفيف تركيز الملوثات، لكنه عامل مساعد وليس المصدر الأصلي للمخلفات والصرف."
      }
    ],

    // المهارة 3: خيارات الحل (3 درجات) - مطابق لبطاقات الوثيقة
    solutions: [
      {
        id: "clean_banks",
        title: "تنظيف ضفاف النهر",
        category: "تحسين مباشر",
        categoryClass: "bg-info-subtle text-info-emphasis",
        icon: "bi-trash3-fill",
        benefit: "يزيل المخلفات المرئية فورًا ويحسن النظافة البصرية للضفة.",
        constraint: "لا يعالج وحده التلوث الناتج عن مياه الصرف، وقد تعود النفايات إن غابت الوقاية.",
        visualEffectText: "تقل المخلفات المرئية على ضفة النهر.",
        targetsRootCause: false,
        targetsImmediateClean: true,
        targetsPrevention: false,
        targetsAestheticEco: false
      },
      {
        id: "treat_sewage",
        title: "معالجة مياه الصرف قبل تصريفها",
        category: "معالجة المصدر",
        categoryClass: "bg-emerald-soft text-emerald-dark",
        icon: "bi-funnel-fill",
        benefit: "تستهدف مصدرًا رئيسيًا للتلوث وتوقف تدفق الملوثات إلى مجرى النهر.",
        constraint: "تتطلب تكلفة فنية ومتابعة مستمرة، ولا تزيل المخلفات الصلبة المتراكمة سابقًا على الضفة.",
        visualEffectText: "يتحسن مؤشر جودة المياه ونقاوتها في المحاكاة التعليمية.",
        targetsRootCause: true,
        targetsImmediateClean: false,
        targetsPrevention: false,
        targetsAestheticEco: false
      },
      {
        id: "community_awareness",
        title: "توعية المجتمع ومنع إلقاء المخلفات",
        category: "وقاية",
        categoryClass: "bg-warning-subtle text-warning-emphasis",
        icon: "bi-megaphone-fill",
        benefit: "تدعم الوقاية واستمرار التحسن وتمنع تكرار رمي النفايات.",
        constraint: "تحتاج إلى إجراءات عملية مرافقة (تنظيف ومعالجة) ولا تغير لون الماء فورًا بمفردها.",
        visualEffectText: "يظهر مؤشر الوقاية واستدامة التحسن ولوحات إرشادية لحماية النهر.",
        targetsRootCause: false,
        targetsImmediateClean: false,
        targetsPrevention: true,
        targetsAestheticEco: false
      },
      {
        id: "plant_native_riparian",
        title: "زراعة نباتات محلية مناسبة على الضفاف",
        category: "تحسين بيئي وجمالي",
        categoryClass: "bg-success-subtle text-success-emphasis",
        icon: "bi-flower1",
        benefit: "تدعم التنوع الحيوي وتماسك تربة الضفاف وتزيد التناسق والجمال البيئي.",
        constraint: "ليست علاجًا مباشرًا لكل أنواع التلوث الكيميائي إذا استمر تدفق الصرف غير المعالج.",
        visualEffectText: "تزداد كثافة الغطاء النباتي النهري (القصب والأشجار المحلية) في المواضع الملائمة.",
        targetsRootCause: false,
        targetsImmediateClean: false,
        targetsPrevention: false,
        targetsAestheticEco: true
      }
    ],

    // المهارة 4: تبرير القرار ومراعاة القيود (2 درجة)
    justificationQuestion: {
      prompt: "لماذا لا نكتفي بـ «تنظيف ضفاف النهر» وحده بوصفه خطة كاملة لحل المشكلة؟",
      options: [
        {
          id: "j_correct",
          text: "لأن تنظيف الضفة يحسن النظافة البصرية الظاهرة فقط، بينما حماية النهر تتطلب معالجة مصدر التلوث (مياه الصرف) والوقاية المجتمعية لمنع تكرار المشكلة.",
          points: 2
        },
        {
          id: "j_partial",
          text: "لأن تنظيف الضفاف يحتاج إلى وقت طويل وعمال كثر فقط، لكنه كافٍ لتنقية المياه كيميائيًا.",
          points: 1
        },
        {
          id: "j_wrong",
          text: "لأن تنظيف الضفاف يضر بالنباتات النهرية ويزيد من تلوث المياه.",
          points: 0
        }
      ]
    },

    // المهارة 5: توقع النتائج ومراجعة الخطة (1 درجة)
    predictionQuestion: {
      prompt: "ماذا تتوقع أن يحدث للمشهد النهري بعد شهرين إذا اخترنا «تنظيف الضفة وزراعة النباتات» دون «معالجة مياه الصرف والتوعية»؟",
      options: [
        {
          id: "pred_correct",
          text: "يبقى الماء ملوثًا بسبب استمرار تدفق الصرف، وقد تعود النفايات للتراكم ويتأثر الغطاء النباتي سلبًا.",
          points: 1
        },
        {
          id: "pred_wrong1",
          text: "يصبح ماء النهر نقيًا تمامًا بفضل تنظيف الضفة وحده دون الحاجة لمعالجة الصرف.",
          points: 0
        },
        {
          id: "pred_wrong2",
          text: "تختفي المشكلة نهائيًا لأن المظهر الجمالي للضفة يكفي لإنهاء التلوث المائي.",
          points: 0
        }
      ]
    },

    // المتغير الثاني: تقييم الحس الجمالي (0 - 2 درجة) مستقل تمامًا
    aestheticPrompt: "تأمل المشهد النهري: ما العلاقة بين نقاء الماء وتنوع النباتات على الضفة وتناسق المشهد؟ ولماذا لا يقتصر الجمال البيئي للنهر على مظهر الضفة وحده؟",
    aestheticOptions: [
      {
        id: "aes_2",
        score: 2,
        levelTitle: "تقدير جمالي وتفسيري متقدم (درجتان)",
        text: "يتحقق جمال النهر بتكامل نقاء الماء ونظافة الضفة وخضرة النباتات المحلية؛ فالتلوث يخل بتناسق الألوان والحياة المائية، والمحافظة على النهر تحمي قيمته الجمالية والحيوية معًا."
      },
      {
        id: "aes_1",
        score: 1,
        levelTitle: "ملاحظة جمالية بسيطة (درجة واحدة)",
        text: "ألاحظ أن وجود الأشجار الخضراء وإزالة النفايات يجعل منظر ضفة النهر أجمل وأنظف للناظرين."
      },
      {
        id: "aes_0",
        score: 0,
        levelTitle: "ملاحظة غير مرتبطة بالتناسق الجمالي (0 درجة)",
        text: "المهم فقط استخدام مياه النهر، ولا توجد أهمية لمظهر الضفاف أو تناسق النباتات والماء."
      }
    ],

    modelFeedbackSummary: "«خطة جيدة إذا جمعت بين معالجة مصدر التلوث وتقليل المخلفات والوقاية من تكرار المشكلة. تحسين مظهر الضفة مهم، لكن حماية النهر تتطلب أيضًا الاهتمام بجودة المياه ومصادر التلوث.»",
    aestheticIndicatorNote: "يدرك الطالب العلاقة بين نظافة الماء، وتنوع النباتات، وتناسق المشهد، مع إدراك أن الجمال البيئي لا يقتصر على المظهر وحده."
  },

  // ==========================================================================
  // السيناريو الثاني: أنقذ أرضنا (التصحر وتدهور الأراضي)
  // ==========================================================================
  desertification: {
    id: "desertification",
    numberLabel: "السيناريو الثاني",
    title: "أنقذ أرضنا",
    issueSubtitle: "التصحر وتدهور الأراضي الزراعية",
    locationBadge: "الأراضي الجافة والزراعية في العراق",
    icon: "bi-sun-fill",
    themeColor: "#d97706",
    context: "«لاحظت أن مساحة من الأراضي الزراعية أصبحت أكثر جفافًا، وأن الغطاء النباتي تراجع. يريد المجتمع المحلي معرفة كيف يمكن الحد من تدهور الأرض والمحافظة على جمالها وقدرتها على الإنتاج.»",
    geoNote: "سياق الأراضي الجافة وشبه الجافة في العراق، حيث تتفاعل العوامل المناخية مع إدارة المياه والرعي والغطاء النباتي.",

    // المهارة 1: تحديد المشكلة (2 درجة)
    problemQuestion: {
      options: [
        {
          id: "p_correct",
          text: "تصحر الأراضي وتدهور التربة وتراجع الغطاء النباتي مما يضعف قدرة الأرض الإنتاجية ويفقد المشهد الطبيعي توازنه وجماله.",
          points: 2,
          feedback: "أحسنت! حددت جوهر مشكلة التصحر باعتبارها تدهورًا في التربة والغطاء النباتي والقدرة الإنتاجية والجمالية."
        },
        {
          id: "p_partial",
          text: "قلة الأشجار الطويلة في المكان فقط دون وجود مشكلة في التربة أو المياه.",
          points: 1,
          feedback: "تحديد ناقص؛ المشكلة تشمل جفاف التربة وتدهورها وتراجع الغطاء النباتي وليست مجرد غياب أشجار طويلة."
        },
        {
          id: "p_wrong",
          text: "زيادة خصوبة التربة أكثر من اللازم بسبب كثرة الأمطار الموسمية.",
          points: 0,
          feedback: "إجابة تتعارض مع معطيات الموقف الذي يوضح زيادة الجفاف وتراجع الغطاء النباتي."
        }
      ]
    },

    observationChips: [
      { id: "obs1", text: "تشقق التربة المكشوفة وجفافها" },
      { id: "obs2", text: "تراجع كثافة الغطاء النباتي واصفراره" },
      { id: "obs3", text: "غلبة اللون المغبر والجاف على المشهد" },
      { id: "obs4", text: "هدر المياه في قنوات ري تقليدية غير منظمة" }
    ],

    // المهارة 2: تحليل الأسباب (2 درجة) - مطابق لجدول الوثيقة
    causesPrompt: "ما العوامل التي قد تسهم في تدهور الأرض؟ (تذكر أن التصحر ينتج عن تفاعل عوامل طبيعية وبشرية وإدارية)",
    causes: [
      {
        id: "climate_drought",
        title: "قلة الأمطار وارتفاع الحرارة وزيادة التبخر",
        classification: "عوامل مناخية محتملة",
        badgeClass: "bg-warning-subtle text-warning-emphasis",
        isDirectCause: true,
        isContributingFactor: false,
        explanation: "عوامل مناخية طبيعية تزيد من جفاف التربة وتقلل الرطوبة المتاحة لنمو النباتات في البيئات العراقية الجافة."
      },
      {
        id: "overgrazing",
        title: "الرعي الجائر وإزالة الغطاء النباتي",
        classification: "عوامل بشرية محتملة",
        badgeClass: "bg-danger-subtle text-danger-emphasis",
        isDirectCause: true,
        isContributingFactor: false,
        explanation: "يؤدي إلى تجريد التربة من غطائها النباتي الواقي وتركها عرضة للانجراف الريحى والتدهور."
      },
      {
        id: "poor_irrigation",
        title: "ممارسات الري غير المناسبة وسوء إدارة التربة",
        classification: "عوامل إدارية وزراعية محتملة",
        badgeClass: "bg-danger-subtle text-danger-emphasis",
        isDirectCause: true,
        isContributingFactor: false,
        explanation: "الهدر المائي والري السيئ يفاقمان شح المياه وقد يؤديان إلى تملح التربة وتدهور إنتاجيتها."
      },
      {
        id: "healthy_biodiversity",
        title: "وجود تنوع نباتي محلي صحي",
        classification: "ليس سببًا للتصحر؛ قد يدعم استقرار النظام البيئي",
        badgeClass: "bg-success-subtle text-success-emphasis",
        isDirectCause: false,
        isContributingFactor: false,
        explanation: "التنوع النباتي المحلي عنصر إيجابي يثبت التربة ويحفظ توازن النظام البيئي وجماله، وليس من أسباب التصحر."
      }
    ],

    // المهارة 3: خيارات الحل (3 درجات) - مطابق للوثيقة
    solutions: [
      {
        id: "plant_drought_tolerant",
        title: "زراعة نباتات محلية ملائمة للجفاف",
        category: "استعادة الغطاء النباتي",
        categoryClass: "bg-success-subtle text-success-emphasis",
        icon: "bi-tree-fill",
        benefit: "تساعد على دعم استقرار التربة وتماسكها عندما تكون الأنواع والمواقع مناسبة لبيئة العراق.",
        constraint: "نجاحها يعتمد على توافر حد أدنى من إدارة المياه وحمايتها من الرعي الجائر.",
        visualEffectText: "زيادة تدريجية واقعية في الغطاء النباتي المحلي الملائم للجفاف.",
        targetsRootCause: true,
        targetsWaterManagement: false,
        targetsVegetationProtection: true,
        targetsOnlySurfaceClean: false
      },
      {
        id: "improve_irrigation",
        title: "تحسين إدارة مياه الري",
        category: "إدارة الموارد",
        categoryClass: "bg-info-subtle text-info-emphasis",
        icon: "bi-droplet-half",
        benefit: "يساعد على الحد من الهدر ومشكلات التربة المرتبطة بممارسات الري غير المناسبة.",
        constraint: "يوفر الرطوبة اللازمة لكنه يحتاج إلى غطاء نباتي وتنظيم للرعي لاستعادة الأرض.",
        visualEffectText: "ظهور منظومة ري مرشدة وتحسن رطوبة التربة وتراجع التشققات.",
        targetsRootCause: true,
        targetsWaterManagement: true,
        targetsVegetationProtection: false,
        targetsOnlySurfaceClean: false
      },
      {
        id: "regulate_grazing",
        title: "تنظيم الرعي وحماية المناطق المتدهورة",
        category: "وقاية واستعادة",
        categoryClass: "bg-emerald-soft text-emerald-dark",
        icon: "bi-shield-check",
        benefit: "يمنح الغطاء النباتي فرصة للتجدد الطبيعي ويحد من الضغط المستمر على الأرض.",
        constraint: "يتطلب تعاون المجتمع المحلي وتوفير بدائل منظمة للرعي.",
        visualEffectText: "تسييج حمائي للمنطقة المتدهورة واستعادة تدريجية للأعشاب الطبيعية.",
        targetsRootCause: true,
        targetsWaterManagement: false,
        targetsVegetationProtection: true,
        targetsOnlySurfaceClean: false
      },
      {
        id: "clean_site_waste",
        title: "تنظيف الموقع من المخلفات",
        category: "تحسين النظافة",
        categoryClass: "bg-secondary-subtle text-secondary",
        icon: "bi-broom",
        benefit: "يحسن نظافة المشهد البصري ويزيل العوائق السطحية.",
        constraint: "لا يكفي وحده لعلاج التصحر أو استعادة رطوبة التربة وغطائها النباتي.",
        visualEffectText: "إزالة المخلفات السطحية فقط دون تحول الأرض الجافة إلى أرض خضراء.",
        targetsRootCause: false,
        targetsWaterManagement: false,
        targetsVegetationProtection: false,
        targetsOnlySurfaceClean: true
      }
    ],

    // المهارة 4: تبرير القرار ومراعاة القيود (2 درجة)
    justificationQuestion: {
      prompt: "وفق قواعد التقييم البيئي، لماذا لا يكفي زراعة أي نباتات عشوائيًا أو الاكتفاء بتنظيف الأرض لعلاج التصحر؟",
      options: [
        {
          id: "j_correct",
          text: "لأن استعادة الأرض تتطلب مراعاة محدودية المياه واختيار نباتات محلية تتحمل الجفاف مع تنظيم الرعي، والتمييز بين مجرد تحسين المظهر واستعادة وظائف التربة.",
          points: 2
        },
        {
          id: "j_partial",
          text: "لأن زراعة النباتات الكثيفة المستهلكة للماء تحول الصحراء فورًا إلى غابة خضراء دون الحاجة لإدارة الري.",
          points: 1
        },
        {
          id: "j_wrong",
          text: "لأن تنظيف الموقع من المخلفات كافٍ وحده لزيادة الأمطار وإعادة خصوبة التربة.",
          points: 0
        }
      ]
    },

    // المهارة 5: توقع النتائج ومراجعة الخطة (1 درجة)
    predictionQuestion: {
      prompt: "لماذا تظهر المحاكاة زيادة تدريجية ومعتدلة في الغطاء النباتي بعد تطبيق الخطة السليمة بدل تحول الأرض إلى اللون الأخضر الكثيف فورًا؟",
      options: [
        {
          id: "pred_correct",
          text: "لأن استعادة الأراضي المتدهورة في البيئات الجافة عملية تدريجية تحتاج إلى وقت وتكامل بين إدارة المياه وحماية التربة، ولا يقتصر جمالها على اللون الأخضر الكثيف فقط.",
          points: 1
        },
        {
          id: "pred_wrong1",
          text: "لأن النباتات المحلية لا تنمو أبدًا حتى مع تحسين الري وحماية التربة.",
          points: 0
        },
        {
          id: "pred_wrong2",
          text: "لأن قرارًا واحدًا كفيل بتحويل الأرض الجافة إلى غابة استوائية في يوم واحد.",
          points: 0
        }
      ]
    },

    // المتغير الثاني: تقييم الحس الجمالي (0 - 2 درجة)
    aestheticPrompt: "كيف تصف القيمة الجمالية للأرض الزراعية والطبيعية بعد بدء استعادتها؟ ولماذا لا نختزل جمال البيئات العراقية في اللون الأخضر الكثيف فقط؟",
    aestheticOptions: [
      {
        id: "aes_2",
        score: 2,
        levelTitle: "تقدير جمالي وتفسيري متقدم (درجتان)",
        text: "يكمن الجمال البيئي هنا في تناسق التربة المحمية مع تنوع النباتات المحلية المتكيفة مع الجفاف وانتظام الري؛ فالجمال يرتبط بحيوية الأرض وتوازنها الطبيعي وإنتاجيتها وليس بمجرد كثافة اللون الأخضر."
      },
      {
        id: "aes_1",
        score: 1,
        levelTitle: "ملاحظة جمالية بسيطة (درجة واحدة)",
        text: "ألاحظ أن ظهور النباتات الخضراء وتقليل الجفاف جعل منظر الأرض أجمل من التربة المتشققة."
      },
      {
        id: "aes_0",
        score: 0,
        levelTitle: "ملاحظة غير مرتبطة بالتناسق الجمالي (0 درجة)",
        text: "الأرض الجافة أو المزروعة لا تختلف في جمالها ولا تهمنا سوى مساحة الأرض."
      }
    ],

    modelFeedbackSummary: "«تتحسن خطتك عندما تجمع بين حماية التربة وإدارة المياه واستعادة الغطاء النباتي. أما تنظيف المخلفات وحده فيحسن مظهر المكان، لكنه لا يعالج جميع العوامل التي تؤدي إلى التصحر.»",
    aestheticIndicatorNote: "قدرة الطالب على ملاحظة تنوع الغطاء النباتي، وتناسق عناصر المشهد، وقيمة الأرض الطبيعية والزراعية، دون اختزال الجمال في اللون الأخضر فقط."
  },

  // ==========================================================================
  // السيناريو الثالث: مدينتنا أجمل (تراكم النفايات وتدهور المشهد الحضري)
  // ==========================================================================
  urban_waste: {
    id: "urban_waste",
    numberLabel: "السيناريو الثالث",
    title: "مدينتنا أجمل",
    issueSubtitle: "تراكم النفايات وتدهور المشهد الحضري",
    locationBadge: "حي أو مساحة عامة في مدينة عراقية",
    icon: "bi-buildings-fill",
    themeColor: "#059669",
    context: "«أصبحت إحدى المساحات العامة أقل نظافة وجاذبية بسبب تراكم النفايات. طُلب منك إعداد خطة تحافظ على صحة السكان وتحسن مظهر المكان، وتمنع عودة المشكلة بعد فترة قصيرة.»",
    geoNote: "سياق الجغرافيا الحضرية في المدن العراقية، حيث يتطلب جمال المتنزهات والمساحات العامة تكامل الخدمات البلدية والسلوك المجتمعي والتشجير الملائم.",

    // المهارة 1: تحديد المشكلة (2 درجة)
    problemQuestion: {
      options: [
        {
          id: "p_correct",
          text: "تدهور البيئة الحضرية وجاذبية المساحة العامة وصحة السكان نتيجة تراكم النفايات وضعف إدارتها المستدامة.",
          points: 2,
          feedback: "تحديد ممتاز! ربطت بين تراكم النفايات وأثره الصحي والبيئي وتدهور الجاذبية الجمالية للمساحة العامة."
        },
        {
          id: "p_partial",
          text: "قلة المقاعد الخشبية في المتنزه فقط دون وجود مشكلة في النظافة أو إدارة المخلفات.",
          points: 1,
          feedback: "تحديد غير مكتمل؛ المشكلة الأساسية في الموقف هي تراكم النفايات وتراجع نظافة وجاذبية المساحة العامة."
        },
        {
          id: "p_wrong",
          text: "كثرة الأشجار والظلال في المساحة العامة مما يقلل من جمال المدينة.",
          points: 0,
          feedback: "غير صحيح؛ الأشجار والظلال تدعم جمال المكان وليست هي المشكلة البيئية المطروحة."
        }
      ]
    },

    observationChips: [
      { id: "obs1", text: "تكدس النفايات المبعثرة حول الممرات" },
      { id: "obs2", text: "غياب حاويات الجمع والفرز المنظمة" },
      { id: "obs3", text: "تراجع جاذبية المكان العام وتشوه تناسقه البصري" },
      { id: "obs4", text: "إهمال المساحات المخصصة للتشجير والزهور" }
    ],

    // المهارة 2: تحليل الأسباب (2 درجة) - مطابق لجدول الوثيقة
    causesPrompt: "ما العوامل التي أسهمت في تراكم النفايات وتدهور المساحة العامة؟",
    causes: [
      {
        id: "random_littering",
        title: "الرمي العشوائي للنفايات",
        classification: "سلوك يسهم في المشكلة",
        badgeClass: "bg-danger-subtle text-danger-emphasis",
        isDirectCause: true,
        isContributingFactor: false,
        explanation: "سلوك غير مسؤول يؤدي مباشرة إلى انتشار المخلفات في الممرات والمساحات الخضراء وتشويه المكان."
      },
      {
        id: "insufficient_collection",
        title: "عدم كفاية خدمات جمع النفايات",
        classification: "عامل خدمي محتمل",
        badgeClass: "bg-danger-subtle text-danger-emphasis",
        isDirectCause: true,
        isContributingFactor: false,
        explanation: "نقص الحاويات أو تأخر رفعها يجعل النفايات تتراكم حتى لو رغب السكان في التخلص السليم منها."
      },
      {
        id: "weak_sorting_recycling",
        title: "ضعف الفرز وإعادة الاستخدام والتدوير",
        classification: "عامل يزيد كمية المخلفات التي تحتاج إلى التخلص منها",
        badgeClass: "bg-warning-subtle text-warning-emphasis",
        isDirectCause: true,
        isContributingFactor: true,
        explanation: "غياب الفرز يضاعف حجم النفايات المتراكمة ويهدر مواد كان يمكن إعادة تدويرها."
      },
      {
        id: "trees_and_shade",
        title: "وجود أشجار وظلال ومساحات خضراء",
        classification: "عنصر قد يدعم جمال المكان، وليس سببًا لتراكم النفايات",
        badgeClass: "bg-success-subtle text-success-emphasis",
        isDirectCause: false,
        isContributingFactor: false,
        explanation: "الأشجار والظلال عنصر جمالي وبيئي يلطف مناخ المدينة ويجذب السكان، وليس سببًا لمشكلة النفايات."
      }
    ],

    // المهارة 3: خيارات الحل (3 درجات) - مطابق للوثيقة
    solutions: [
      {
        id: "clean_public_space",
        title: "تنظيف المساحة العامة",
        category: "حل فوري",
        categoryClass: "bg-info-subtle text-info-emphasis",
        icon: "bi-stars",
        benefit: "يزيل المخلفات الظاهرة فورًا ويعيد النظافة الأولية للمكان.",
        constraint: "حل مؤقت إذا طُبق وحده؛ يحتاج إلى إجراءات خدمية ووقائية تمنع تراكمها مجددًا.",
        visualEffectText: "تقل النفايات الظاهرة على الأرض وفي الممرات.",
        targetsImmediateClean: true,
        targetsServiceSorting: false,
        targetsPrevention: false,
        targetsAestheticRehab: false
      },
      {
        id: "provide_sorting_bins",
        title: "توفير نقاط جمع وفرز مناسبة",
        category: "حل خدمي",
        categoryClass: "bg-emerald-soft text-emerald-dark",
        icon: "bi-recycle",
        benefit: "يسهل التخلص السليم من النفايات وفرز ما يمكن تدويره في نقاط واضحة ومنظمة.",
        constraint: "يتطلب وعيًا مجتمعيًا لاستخدام الحاويات بانتظام بالإضافة إلى إزالة النفايات المتراكمة سابقًا.",
        visualEffectText: "ظهور حاويات جمع وفرز ملونة ومنظمة تحسن تنظيم المكان.",
        targetsImmediateClean: false,
        targetsServiceSorting: true,
        targetsPrevention: false,
        targetsAestheticRehab: false
      },
      {
        id: "community_participation",
        title: "التوعية والمشاركة المجتمعية",
        category: "وقاية",
        categoryClass: "bg-warning-subtle text-warning-emphasis",
        icon: "bi-people-fill",
        benefit: "تدعم تغيير السلوك عندما تتوافر خدمات مناسبة ويشارك المجتمع في الحفاظ على المكان.",
        constraint: "ترفع مؤشر استدامة الحل، لكنها لا تعني اختفاء النفايات المتراكمة تلقائيًا دون تنظيف وخدمات.",
        visualEffectText: "يرتفع مؤشر استدامة الحل وتظهر مبادرات ولوحات المشاركة المجتمعية.",
        targetsImmediateClean: false,
        targetsServiceSorting: false,
        targetsPrevention: true,
        targetsAestheticRehab: false
      },
      {
        id: "rehabilitate_plants",
        title: "إعادة تأهيل المساحة بالنباتات الملائمة",
        category: "تحسين جمالي",
        categoryClass: "bg-success-subtle text-success-emphasis",
        icon: "bi-flower2",
        benefit: "يعزز جودة المكان وبهجته البصرية بعد معالجة النظافة والصيانة وتوفير احتياجات النباتات.",
        constraint: "لا يحقق هدفه الجمالي إذا بقي المكان ملوثًا بالنفايات أو غابت عنه الصيانة.",
        visualEffectText: "تُضاف نباتات وأزهار وعناصر جمالية متناسقة إلى المشهد بعد تنظيفه.",
        targetsImmediateClean: false,
        targetsServiceSorting: false,
        targetsPrevention: false,
        targetsAestheticRehab: true
      }
    ],

    // المهارة 4: تبرير القرار ومراعاة القيود (2 درجة)
    justificationQuestion: {
      prompt: "كيف نبني خطة تمنع عودة تراكم النفايات في المساحة العامة بعد فترة قصيرة؟",
      options: [
        {
          id: "j_correct",
          text: "بالجمع بين الحل الفوري (التنظيف) والحل الخدمي المستدام (نقاط الجمع والفرز) والوقاية (المشاركة المجتمعية) مع إعادة التأهيل الجمالي.",
          points: 2
        },
        {
          id: "j_partial",
          text: "بالاكتفاء بحملة تنظيف واحدة كل عام دون الحاجة لتوفير حاويات فرز أو توعية السكان.",
          points: 1
        },
        {
          id: "j_wrong",
          text: "بإغلاق المساحة العامة أمام السكان نهائيًا وإزالة الأشجار منها.",
          points: 0
        }
      ]
    },

    // المهارة 5: توقع النتائج ومراجعة الخطة (1 درجة)
    predictionQuestion: {
      prompt: "ماذا يحدث في المحاكاة إذا اخترنا «التوعية والمشاركة المجتمعية» وحدها دون «تنظيف المساحة» أو «توفير نقاط الجمع»؟",
      options: [
        {
          id: "pred_correct",
          text: "يرتفع مؤشر الوعي والاستدامة، لكن النفايات المتراكمة سابقًا لا تختفي تلقائيًا ويظل السكان بحاجة إلى نقاط جمع عملية.",
          points: 1
        },
        {
          id: "pred_wrong1",
          text: "تختفي جميع النفايات تلقائيًا بمجرد تعليق لوحات التوعية دون تنظيف.",
          points: 0
        },
        {
          id: "pred_wrong2",
          text: "ليس للتوعية أي دور في استمرار نظافة المكان على المدى الطويل.",
          points: 0
        }
      ]
    },

    // المتغير الثاني: تقييم الحس الجمالي (0 - 2 درجة)
    aestheticPrompt: "ما أثر النظافة وتنظيم نقاط الفرز والتشجير المناسب في جاذبية المساحة العامة؟ ولماذا تستحق الأماكن العامة في مدننا الحماية والصيانة المشتركة؟",
    aestheticOptions: [
      {
        id: "aes_2",
        score: 2,
        levelTitle: "تقدير جمالي وتفسيري متقدم (درجتان)",
        text: "تتكامل نظافة الممرات مع انتظام حاويات الفرز وتناسق الأشجار والزهور لتخلق فضاءً حضريًا مريحًا للنفس؛ وحماية المساحات العامة واجب لأنها متنفس طبيعي وجمالي مشترك يعكس رقي المجتمع وصحته."
      },
      {
        id: "aes_1",
        score: 1,
        levelTitle: "ملاحظة جمالية بسيطة (درجة واحدة)",
        text: "ألاحظ أن إزالة النفايات ووجود الأزهار يجعل المتنزه يبدو نظيفًا وجميل المنظر."
      },
      {
        id: "aes_0",
        score: 0,
        levelTitle: "ملاحظة غير مرتبطة بالتناسق الجمالي (0 درجة)",
        text: "لا يهم شكل المساحة العامة أو تناسق عناصرها طالما توجد شوارع محيطة بها."
      }
    ],

    modelFeedbackSummary: "«التنظيف خطوة مهمة، لكن نجاح الخطة على المدى الطويل يتطلب معالجة أسباب تراكم النفايات. الجمع بين خدمات مناسبة، وسلوك مسؤول، وصيانة للمكان يجعل التحسن أكثر استدامة ويحافظ على جمال المساحة العامة.»",
    aestheticIndicatorNote: "قدرة الطالب على ملاحظة أثر النظافة والتناسق والتشجير المناسب في جاذبية المكان، وتفسير سبب استحقاق المساحات العامة للحماية والصيانة."
  }
};

// ============================================================================
// 2. حالة التطبيق وحالة الطالب (APPLICATION STATE)
// ============================================================================
const appState = {
  currentScenarioId: "river",
  currentStep: 1,
  sceneViewMode: "simulated", // 'before' | 'simulated' | 'split'
  splitSliderValue: 50,
  studentProfile: {
    name: "محقق بيئي: غير مسجل",
    grade: "الثاني المتوسط",
    group: "المجموعة التجريبية"
  },
  aiConfig: {
    mode: "local_smart",
    proxyUrl: ""
  },
  // Holds state per scenario so student can switch and compare
  responses: {
    river: createBlankScenarioResponse(),
    desertification: createBlankScenarioResponse(),
    urban_waste: createBlankScenarioResponse()
  }
};

function createBlankScenarioResponse() {
  return {
    problemOptionId: null,
    observations: [],
    selectedCauses: [],
    causesVerified: false,
    selectedSolutions: [],
    justificationOptionId: null,
    predictionOptionId: null,
    aestheticOptionId: null,
    aestheticFreeText: "",
    completed: false,
    lastEvaluation: null
  };
}

// ============================================================================
// 3. التهيئة الأولية والوظائف الأساسية (INITIALIZATION & CORE FUNCTIONS)
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  loadPersistedProfileAndConfig();
  renderScenarioTabs();
  loadScenario("river");
  updateRecordsBadgeCount();
});

/**
 * الوظيفة الأساسية 1: loadScenario(id)
 * تحميل بيانات السيناريو المختار وعرضها في الواجهة الموحدة
 */
function loadScenario(id) {
  if (!SCENARIOS[id]) return;
  appState.currentScenarioId = id;
  const scenario = SCENARIOS[id];
  const resp = appState.responses[id];

  // Update Scenario Tabs active state
  renderScenarioTabs();

  // Update Visual Panel Header
  document.getElementById("sceneLocationBadge").textContent = scenario.locationBadge;
  document.getElementById("sceneTitleDisplay").textContent = `${scenario.numberLabel}: ${scenario.title} — ${scenario.issueSubtitle}`;

  // Populate Step 1: Context & Problem Identification
  document.getElementById("contextGeoHeader").textContent = `السياق الجغرافي: ${scenario.locationBadge}`;
  document.getElementById("contextStoryText").textContent = scenario.context;
  document.getElementById("contextGoalHint").innerHTML = `<i class="bi bi-info-circle me-1"></i>${scenario.geoNote}`;

  renderProblemIdentification(scenario, resp);
  renderInitialObservations(scenario, resp);

  // Populate Step 2: Causes Analyzer
  renderCauses();

  // Populate Step 3: Solutions Lab & Justification
  renderSolutions();
  renderJustificationQuestion(scenario, resp);

  // Populate Step 4: Prediction & Aesthetic Sense Prompt
  renderPredictionQuestion(scenario, resp);
  renderAestheticAssessment(scenario, resp);

  // Update Visual Scene & Indicators
  const currentResult = evaluatePlan();
  updateScene(currentResult);

  // Navigate to Step 1 (or keep current step if already completed)
  goToStep(resp.completed ? 5 : 1);
  if (resp.completed) {
    generateFeedback(currentResult);
  }
  updateAIPayloadPreview();
}

function renderScenarioTabs() {
  const container = document.getElementById("scenarioTabsContainer");
  container.innerHTML = "";

  Object.values(SCENARIOS).forEach((sc) => {
    const isActive = sc.id === appState.currentScenarioId;
    const resp = appState.responses[sc.id];
    const col = document.createElement("div");
    col.className = "col-md-4";

    let statusBadge = `<span class="badge bg-light text-secondary border scenario-completed-pill">لم يكتمل بعد</span>`;
    if (resp.completed && resp.lastEvaluation) {
      statusBadge = `<span class="badge bg-emerald-soft text-emerald-dark scenario-completed-pill">
        <i class="bi bi-check2-circle me-1"></i>حل المشكلات: ${resp.lastEvaluation.problemSolvingTotal}/10 | الجمال: ${resp.lastEvaluation.aestheticScore}/2
      </span>`;
    }

    col.innerHTML = `
      <div class="scenario-tab-card ${isActive ? "active" : ""}" onclick="loadScenario('${sc.id}')">
        <div class="d-flex align-items-center justify-content-between gap-2">
          <div class="d-flex align-items-center gap-3">
            <div class="scenario-tab-icon" style="background-color: ${sc.themeColor}18; color: ${sc.themeColor};">
              <i class="bi ${sc.icon}"></i>
            </div>
            <div>
              <div class="d-flex align-items-center gap-2">
                <span class="text-muted" style="font-size: 0.72rem; font-weight:600;">${sc.numberLabel}</span>
                ${statusBadge}
              </div>
              <h3 class="h6 fw-bold mb-0 mt-1">${sc.title}: ${sc.issueSubtitle}</h3>
            </div>
          </div>
          <i class="bi ${isActive ? "bi-record-circle-fill text-emerald" : "bi-circle text-muted"}"></i>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

// ============================================================================
// 4. عرض المراحل التفاعلية (STEP 1, STEP 2, STEP 3, STEP 4 RENDERERS)
// ============================================================================

function renderProblemIdentification(scenario, resp) {
  const container = document.getElementById("problemIdentificationOptions");
  const feedbackBox = document.getElementById("problemIdFeedback");
  container.innerHTML = "";
  feedbackBox.className = "instant-feedback-box mt-2 d-none";

  scenario.problemQuestion.options.forEach((opt) => {
    const isSelected = resp.problemOptionId === opt.id;
    const item = document.createElement("div");
    item.className = `choice-option-item ${isSelected ? "selected" : ""}`;
    item.onclick = () => {
      resp.problemOptionId = opt.id;
      renderProblemIdentification(scenario, resp);
    };

    item.innerHTML = `
      <div class="mt-1">
        <i class="bi ${isSelected ? "bi-check-circle-fill text-emerald" : "bi-circle text-muted"}"></i>
      </div>
      <div class="small fw-medium">${opt.text}</div>
    `;
    container.appendChild(item);

    if (isSelected) {
      feedbackBox.classList.remove("d-none");
      if (opt.points === 2) {
        feedbackBox.classList.add("bg-emerald-soft", "text-emerald-dark");
        feedbackBox.innerHTML = `<i class="bi bi-check-circle-fill me-1"></i>${opt.feedback}`;
      } else if (opt.points === 1) {
        feedbackBox.classList.add("bg-warning-subtle", "text-warning-emphasis");
        feedbackBox.innerHTML = `<i class="bi bi-exclamation-circle-fill me-1"></i>${opt.feedback}`;
      } else {
        feedbackBox.classList.add("bg-danger-subtle", "text-danger-emphasis");
        feedbackBox.innerHTML = `<i class="bi bi-x-circle-fill me-1"></i>${opt.feedback}`;
      }
    }
  });
}

function renderInitialObservations(scenario, resp) {
  const container = document.getElementById("initialObservationChips");
  container.innerHTML = "";

  scenario.observationChips.forEach((chip) => {
    const isActive = resp.observations.includes(chip.id);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `obs-chip ${isActive ? "active" : ""}`;
    btn.innerHTML = `<i class="bi ${isActive ? "bi-eye-fill" : "bi-eye"} me-1"></i>${chip.text}`;
    btn.onclick = () => {
      if (isActive) {
        resp.observations = resp.observations.filter((x) => x !== chip.id);
      } else {
        resp.observations.push(chip.id);
      }
      renderInitialObservations(scenario, resp);
    };
    container.appendChild(btn);
  });
}

/**
 * الوظيفة الأساسية 2: renderCauses()
 * عرض أسباب المشكلة وتسجيل اختيارات الطالب وتصنيفها العلمي
 */
function renderCauses() {
  const scenario = SCENARIOS[appState.currentScenarioId];
  const resp = appState.responses[appState.currentScenarioId];
  document.getElementById("causesQuestionPrompt").textContent = scenario.causesPrompt;

  const container = document.getElementById("causesContainer");
  container.innerHTML = "";

  scenario.causes.forEach((cause) => {
    const isSelected = resp.selectedCauses.includes(cause.id);
    const div = document.createElement("div");
    div.className = `choice-option-item ${isSelected ? "selected" : ""}`;
    div.onclick = () => {
      if (isSelected) {
        resp.selectedCauses = resp.selectedCauses.filter((id) => id !== cause.id);
      } else {
        resp.selectedCauses.push(cause.id);
      }
      renderCauses();
      if (resp.causesVerified) verifyCausesAnalysis();
      updateAIPayloadPreview();
    };

    div.innerHTML = `
      <div class="mt-1">
        <i class="bi ${isSelected ? "bi-check-square-fill text-emerald" : "bi-square text-muted"} fs-5"></i>
      </div>
      <div class="flex-grow-1">
        <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <span class="fw-bold small">${cause.title}</span>
          ${resp.causesVerified ? `<span class="badge ${cause.badgeClass}">${cause.classification}</span>` : ""}
        </div>
        ${resp.causesVerified ? `<p class="small text-muted mb-0 mt-1">${cause.explanation}</p>` : ""}
      </div>
    `;
    container.appendChild(div);
  });
}

function verifyCausesAnalysis() {
  const scenario = SCENARIOS[appState.currentScenarioId];
  const resp = appState.responses[appState.currentScenarioId];
  resp.causesVerified = true;
  renderCauses();

  const feedbackPanel = document.getElementById("causesAnalysisFeedback");
  feedbackPanel.classList.remove("d-none");

  const directIds = scenario.causes.filter((c) => c.isDirectCause).map((c) => c.id);
  const nonCauseIds = scenario.causes.filter((c) => !c.isDirectCause && !c.isContributingFactor).map((c) => c.id);

  const chosenDirect = resp.selectedCauses.filter((id) => directIds.includes(id));
  const chosenWrong = resp.selectedCauses.filter((id) => nonCauseIds.includes(id));

  if (chosenDirect.length === directIds.length && chosenWrong.length === 0) {
    feedbackPanel.className = "causes-feedback-panel p-3 rounded-3 mb-3 alert-emerald-soft small";
    feedbackPanel.innerHTML = `<i class="bi bi-check-circle-fill text-emerald me-1"></i><strong>تحليل علمي دقيق!</strong> ميزت بنجاح بين الأسباب المحتملة المباشرة للمشكلة وبين الظواهر أو العناصر الإيجابية التي لا تسبب التدهور البيئي.`;
  } else if (chosenWrong.length > 0) {
    feedbackPanel.className = "causes-feedback-panel p-3 rounded-3 mb-3 bg-warning-subtle text-warning-emphasis small";
    feedbackPanel.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-1"></i><strong>تنبيه تحليلي:</strong> اخترت عنصرًا لا يُعد سببًا للمشكلة (راجع التصنيف الموضح أمام كل خيار أعلاه)؛ فالتفكير الجغرافي يتطلب التمييز بين السبب الحقيقي والظاهرة الطبيعية أو العنصر الإيجابي.`;
  } else {
    feedbackPanel.className = "causes-feedback-panel p-3 rounded-3 mb-3 bg-light border small";
    feedbackPanel.innerHTML = `<i class="bi bi-info-circle-fill text-emerald me-1"></i>تم إظهار التصنيف التعليمي لكل عامل. تأكد من استيعاب جميع الأسباب المباشرة المؤثرة في الموقف قبل تصميم خطة الحل.`;
  }
}

/**
 * الوظيفة الأساسية 3: renderSolutions()
 * عرض الحلول الممكنة وفوائدها وقيودها وتحديث تحليل الخطة والمشهد لحظيًا
 */
function renderSolutions() {
  const scenario = SCENARIOS[appState.currentScenarioId];
  const resp = appState.responses[appState.currentScenarioId];
  const container = document.getElementById("solutionsContainer");
  container.innerHTML = "";

  scenario.solutions.forEach((sol) => {
    const isSelected = resp.selectedSolutions.includes(sol.id);
    const col = document.createElement("div");
    col.className = "col-md-6";

    col.innerHTML = `
      <div class="solution-card ${isSelected ? "selected" : ""}" onclick="toggleSolution('${sol.id}')">
        <div>
          <div class="d-flex align-items-center justify-content-between gap-2 mb-2">
            <span class="badge ${sol.categoryClass}">${sol.category}</span>
            <i class="bi ${isSelected ? "bi-check-circle-fill text-emerald fs-5" : "bi-plus-circle text-muted fs-5"}"></i>
          </div>
          <h5 class="h6 fw-bold mb-2">
            <i class="bi ${sol.icon} text-emerald me-1"></i>${sol.title}
          </h5>
          <p class="small text-secondary mb-2"><strong>الفائدة:</strong> ${sol.benefit}</p>
        </div>
        <div class="pt-2 border-top mt-1" style="font-size: 0.74rem;">
          <div class="text-muted"><i class="bi bi-exclamation-circle me-1 text-warning"></i><strong>القيود والحدود:</strong> ${sol.constraint}</div>
        </div>
      </div>
    `;
    container.appendChild(col);
  });

  renderLivePlanCharacteristics(scenario, resp);
}

function toggleSolution(solId) {
  const resp = appState.responses[appState.currentScenarioId];
  if (resp.selectedSolutions.includes(solId)) {
    resp.selectedSolutions = resp.selectedSolutions.filter((id) => id !== solId);
  } else {
    resp.selectedSolutions.push(solId);
  }
  // Automatically switch view mode to simulated so student immediately sees the visual change
  appState.sceneViewMode = "simulated";
  renderSolutions();
  const result = evaluatePlan();
  updateScene(result);
  updateAIPayloadPreview();
}

function renderLivePlanCharacteristics(scenario, resp) {
  const countBadge = document.getElementById("selectedSolutionsCountBadge");
  countBadge.textContent = `${resp.selectedSolutions.length} إجراءات مختارة`;

  const checklist = document.getElementById("planCriteriaChecklist");
  const chosenObjs = scenario.solutions.filter((s) => resp.selectedSolutions.includes(s.id));

  let criteriaItems = [];
  if (scenario.id === "river") {
    const hasSource = chosenObjs.some((s) => s.targetsRootCause);
    const hasClean = chosenObjs.some((s) => s.targetsImmediateClean);
    const hasPrev = chosenObjs.some((s) => s.targetsPrevention);
    const hasEco = chosenObjs.some((s) => s.targetsAestheticEco);

    criteriaItems = [
      { ok: hasSource, text: "تتضمن الخطة إجراءً يستهدف مصدرًا محتملًا للتلوث (معالجة الصرف)" },
      { ok: hasClean, text: "تتضمن الخطة تحسينًا مباشرًا لنظافة الضفاف" },
      { ok: hasPrev, text: "تتضمن الخطة إجراءً وقائيًا لمنع تكرار إلقاء المخلفات" },
      { ok: hasEco, text: "تتضمن الخطة دعمًا للغطاء النباتي والجمال البيئي على الضفة" }
    ];
  } else if (scenario.id === "desertification") {
    const hasCause = chosenObjs.some((s) => s.targetsRootCause);
    const hasWater = chosenObjs.some((s) => s.targetsWaterManagement);
    const hasVeg = chosenObjs.some((s) => s.targetsVegetationProtection);
    const notOnlyClean = !(chosenObjs.length === 1 && chosenObjs[0].targetsOnlySurfaceClean);

    criteriaItems = [
      { ok: hasCause, text: "تضمنت إجراءً يعالج سببًا حقيقيًا من أسباب تدهور التربة" },
      { ok: hasWater, text: "راعت محدودية الموارد المائية وترشيد الري" },
      { ok: hasVeg, text: "تضمنت حماية الغطاء النباتي أو استعادته بنباتات محلية ملائمة" },
      { ok: hasCause && notOnlyClean, text: "ميزت بين تحسين منظر الأرض واستعادة وظائفها البيئية" }
    ];
  } else {
    const hasClean = chosenObjs.some((s) => s.targetsImmediateClean);
    const hasService = chosenObjs.some((s) => s.targetsServiceSorting);
    const hasPrev = chosenObjs.some((s) => s.targetsPrevention);
    const hasRehab = chosenObjs.some((s) => s.targetsAestheticRehab);

    criteriaItems = [
      { ok: hasClean, text: "تتضمن إزالة فورية للنفايات المتراكمة في المساحة العامة" },
      { ok: hasService, text: "تتضمن حلًا خدميًا منظمًا (توفير نقاط جمع وفرز)" },
      { ok: hasPrev, text: "تدعم الوقاية وتغيير السلوك عبر المشاركة المجتمعية" },
      { ok: hasRehab, text: "تعزز القيمة الجمالية بالتشجير الملائم بعد التنظيف" }
    ];
  }

  checklist.innerHTML = criteriaItems
    .map(
      (item) => `
      <div class="col-md-6">
        <div class="d-flex align-items-center gap-2 small p-2 rounded-3 ${item.ok ? "bg-emerald-soft text-emerald-dark fw-medium" : "bg-white text-muted border"}">
          <i class="bi ${item.ok ? "bi-check-circle-fill text-emerald" : "bi-dash-circle"}"></i>
          <span>${item.text}</span>
        </div>
      </div>
    `
    )
    .join("");
}

function renderJustificationQuestion(scenario, resp) {
  document.getElementById("justificationQuestionPrompt").textContent = scenario.justificationQuestion.prompt;
  const container = document.getElementById("justificationOptionsContainer");
  container.innerHTML = "";

  scenario.justificationQuestion.options.forEach((opt) => {
    const isSelected = resp.justificationOptionId === opt.id;
    const div = document.createElement("div");
    div.className = `choice-option-item py-2 ${isSelected ? "selected" : ""}`;
    div.onclick = () => {
      resp.justificationOptionId = opt.id;
      renderJustificationQuestion(scenario, resp);
    };
    div.innerHTML = `
      <div class="mt-1"><i class="bi ${isSelected ? "bi-record-circle-fill text-emerald" : "bi-circle text-muted"}"></i></div>
      <div class="small">${opt.text}</div>
    `;
    container.appendChild(div);
  });
}

function renderPredictionQuestion(scenario, resp) {
  document.getElementById("predictionQuestionPrompt").textContent = scenario.predictionQuestion.prompt;
  const container = document.getElementById("predictionOptionsContainer");
  container.innerHTML = "";

  scenario.predictionQuestion.options.forEach((opt) => {
    const isSelected = resp.predictionOptionId === opt.id;
    const div = document.createElement("div");
    div.className = `choice-option-item py-2 ${isSelected ? "selected" : ""}`;
    div.onclick = () => {
      resp.predictionOptionId = opt.id;
      renderPredictionQuestion(scenario, resp);
    };
    div.innerHTML = `
      <div class="mt-1"><i class="bi ${isSelected ? "bi-record-circle-fill text-emerald" : "bi-circle text-muted"}"></i></div>
      <div class="small">${opt.text}</div>
    `;
    container.appendChild(div);
  });
}

function renderAestheticAssessment(scenario, resp) {
  document.getElementById("aestheticPromptText").textContent = scenario.aestheticPrompt;
  const container = document.getElementById("aestheticChoicesContainer");
  container.innerHTML = "";

  scenario.aestheticOptions.forEach((opt) => {
    const isSelected = resp.aestheticOptionId === opt.id;
    const div = document.createElement("div");
    div.className = `choice-option-item py-2 ${isSelected ? "selected" : ""}`;
    div.onclick = () => {
      resp.aestheticOptionId = opt.id;
      renderAestheticAssessment(scenario, resp);
    };
    div.innerHTML = `
      <div class="mt-1"><i class="bi ${isSelected ? "bi-check-circle-fill text-emerald" : "bi-circle text-muted"}"></i></div>
      <div class="small">${opt.text}</div>
    `;
    container.appendChild(div);
  });

  const textarea = document.getElementById("aestheticFreeText");
  textarea.value = resp.aestheticFreeText || "";
  textarea.oninput = (e) => {
    resp.aestheticFreeText = e.target.value;
  };
}

// ============================================================================
// 5. تقييم الخطة وفق القواعد التربوية (evaluatePlan)
// ============================================================================

/**
 * الوظيفة الأساسية 4: evaluatePlan()
 * تقييم أداء الطالب وفصل درجات حل المشكلات البيئية (10 درجات) عن الحس الجمالي (0-2 درجة)
 */
function evaluatePlan() {
  const scenario = SCENARIOS[appState.currentScenarioId];
  const resp = appState.responses[appState.currentScenarioId];

  // 1. مهارة تحديد المشكلة (2 درجة)
  let problemIdScore = 0;
  const chosenProb = scenario.problemQuestion.options.find((o) => o.id === resp.problemOptionId);
  if (chosenProb) problemIdScore = chosenProb.points;

  // 2. مهارة تحليل الأسباب (2 درجة)
  let causesScore = 0;
  const directCauseIds = scenario.causes.filter((c) => c.isDirectCause).map((c) => c.id);
  const nonCauseIds = scenario.causes.filter((c) => !c.isDirectCause && !c.isContributingFactor).map((c) => c.id);
  const selectedDirectCount = resp.selectedCauses.filter((id) => directCauseIds.includes(id)).length;
  const selectedWrongCount = resp.selectedCauses.filter((id) => nonCauseIds.includes(id)).length;

  if (selectedDirectCount === directCauseIds.length && selectedWrongCount === 0) {
    causesScore = 2;
  } else if (selectedDirectCount >= 1 && selectedWrongCount === 0) {
    causesScore = 1.5;
  } else if (selectedDirectCount >= 1 && selectedWrongCount > 0) {
    causesScore = 1;
  } else {
    causesScore = 0;
  }

  // 3. مهارة اقتراح واختيار الحلول (3 درجات) - تُقيّم وفق الملاءمة النوعية لا العدد فقط
  let solutionsScore = 0;
  const sols = resp.selectedSolutions;

  if (scenario.id === "river") {
    const hasTreat = sols.includes("treat_sewage");
    const hasClean = sols.includes("clean_banks");
    const hasAware = sols.includes("community_awareness");
    const hasPlant = sols.includes("plant_native_riparian");

    if (hasTreat && hasClean && (hasAware || hasPlant)) {
      solutionsScore = 3;
    } else if (hasTreat && (hasClean || hasAware || hasPlant)) {
      solutionsScore = 2.5;
    } else if (!hasTreat && hasClean && (hasAware || hasPlant)) {
      // Surface improvement without source treatment
      solutionsScore = 1.5;
    } else if (sols.length >= 1) {
      solutionsScore = 1;
    }
  } else if (scenario.id === "desertification") {
    const hasPlant = sols.includes("plant_drought_tolerant");
    const hasWater = sols.includes("improve_irrigation");
    const hasGraze = sols.includes("regulate_grazing");
    const hasClean = sols.includes("clean_site_waste");

    // 4 criteria in descraption.txt: root cause, water limit, vegetation protection, functional vs appearance
    const coreCount = [hasPlant, hasWater, hasGraze].filter(Boolean).length;
    if (coreCount === 3) {
      solutionsScore = 3;
    } else if (hasWater && (hasPlant || hasGraze)) {
      solutionsScore = 2.5;
    } else if (coreCount >= 1) {
      solutionsScore = 1.5;
    } else if (hasClean) {
      solutionsScore = 0.5; // Cleaning waste alone does not cure desertification
    }
  } else if (scenario.id === "urban_waste") {
    const hasClean = sols.includes("clean_public_space");
    const hasBins = sols.includes("provide_sorting_bins");
    const hasComm = sols.includes("community_participation");
    const hasRehab = sols.includes("rehabilitate_plants");

    if (hasClean && hasBins && hasComm) {
      solutionsScore = 3;
    } else if ((hasClean && hasBins) || (hasBins && hasComm)) {
      solutionsScore = 2.5;
    } else if (hasClean && (hasComm || hasRehab)) {
      solutionsScore = 2;
    } else if (sols.length >= 1) {
      solutionsScore = 1;
    }
  }

  // 4. مهارة تبرير القرار ومراعاة القيود (2 درجة)
  let justificationScore = 0;
  const chosenJust = scenario.justificationQuestion.options.find((o) => o.id === resp.justificationOptionId);
  if (chosenJust) justificationScore = chosenJust.points;

  // 5. مهارة توقع النتائج ومراجعة الخطة (1 درجة)
  let predictionScore = 0;
  const chosenPred = scenario.predictionQuestion.options.find((o) => o.id === resp.predictionOptionId);
  if (chosenPred) predictionScore = chosenPred.points;

  const problemSolvingTotal = Number(
    (problemIdScore + causesScore + solutionsScore + justificationScore + predictionScore).toFixed(1)
  );

  // المتغير الثاني المستقل: تقييم الحس الجمالي (0 - 2 درجة)
  let aestheticScore = 0;
  let aestheticLevelTitle = "لم يتم تحديد إجابة";
  const chosenAes = scenario.aestheticOptions.find((o) => o.id === resp.aestheticOptionId);
  if (chosenAes) {
    aestheticScore = chosenAes.score;
    aestheticLevelTitle = chosenAes.levelTitle;
  }
  // If student wrote a rich free reflection (>25 chars) and had 1 pt, boost or acknowledge
  const freeTextClean = (resp.aestheticFreeText || "").trim();

  // Visual Flags for Scene Simulation
  const visualState = computeVisualState(scenario.id, resp.selectedSolutions);

  return {
    scenarioId: scenario.id,
    problemIdScore,
    causesScore,
    solutionsScore,
    justificationScore,
    predictionScore,
    problemSolvingTotal,
    aestheticScore,
    aestheticLevelTitle,
    freeTextClean,
    visualState,
    selectedSolutions: [...resp.selectedSolutions],
    selectedCauses: [...resp.selectedCauses]
  };
}

function computeVisualState(scenarioId, selectedSolutions) {
  if (scenarioId === "river") {
    const banksCleaned = selectedSolutions.includes("clean_banks");
    const sewageTreated = selectedSolutions.includes("treat_sewage");
    const awarenessActive = selectedSolutions.includes("community_awareness");
    const plantsAdded = selectedSolutions.includes("plant_native_riparian");

    return {
      banksCleaned,
      sewageTreated,
      awarenessActive,
      plantsAdded,
      indicators: [
        {
          label: "مؤشر جودة ونقاء المياه",
          value: sewageTreated ? (awarenessActive ? 92 : 82) : 25,
          color: sewageTreated ? "bg-info" : "bg-danger"
        },
        {
          label: "نظافة ضفاف النهر",
          value: banksCleaned ? (awarenessActive ? 95 : 80) : 20,
          color: banksCleaned ? "bg-emerald" : "bg-warning"
        },
        {
          label: "كثافة الغطاء النباتي النهري",
          value: plantsAdded ? (sewageTreated ? 90 : 65) : 30,
          color: plantsAdded ? "bg-success" : "bg-secondary"
        },
        {
          label: "استدامة الوقاية والتناسق الجمالي",
          value: Math.min(100, 20 + (sewageTreated ? 25 : 0) + (banksCleaned ? 20 : 0) + (awarenessActive ? 20 : 0) + (plantsAdded ? 15 : 0)),
          color: "bg-primary"
        }
      ]
    };
  } else if (scenarioId === "desertification") {
    const plantsAdded = selectedSolutions.includes("plant_drought_tolerant");
    const irrigationImproved = selectedSolutions.includes("improve_irrigation");
    const grazingRegulated = selectedSolutions.includes("regulate_grazing");
    const wasteCleaned = selectedSolutions.includes("clean_site_waste");

    // Note from descraption.txt: Planting only succeeds well when water & protection are considered; gradual greening, not instant lush forest
    const soilMoisture = irrigationImproved ? (grazingRegulated ? 82 : 70) : 22;
    const vegCover = plantsAdded
      ? irrigationImproved && grazingRegulated
        ? 78
        : irrigationImproved || grazingRegulated
        ? 58
        : 40
      : grazingRegulated
      ? 45
      : 18;

    return {
      plantsAdded,
      irrigationImproved,
      grazingRegulated,
      wasteCleaned,
      indicators: [
        {
          label: "كفاءة إدارة مياه الري ورطوبة التربة",
          value: soilMoisture,
          color: irrigationImproved ? "bg-info" : "bg-danger"
        },
        {
          label: "استعادة الغطاء النباتي (تدريجي واقعي)",
          value: vegCover,
          color: vegCover >= 55 ? "bg-success" : "bg-warning"
        },
        {
          label: "حماية التربة وتنظيم الرعي",
          value: grazingRegulated ? 88 : 25,
          color: grazingRegulated ? "bg-emerald" : "bg-secondary"
        },
        {
          label: "التناسق البيئي والجمالي للأرض",
          value: Math.min(95, 20 + (irrigationImproved ? 25 : 0) + (plantsAdded ? 22 : 0) + (grazingRegulated ? 20 : 0) + (wasteCleaned ? 8 : 0)),
          color: "bg-primary"
        }
      ]
    };
  } else {
    const spaceCleaned = selectedSolutions.includes("clean_public_space");
    const binsProvided = selectedSolutions.includes("provide_sorting_bins");
    const communityActive = selectedSolutions.includes("community_participation");
    const plantsRehab = selectedSolutions.includes("rehabilitate_plants");

    return {
      spaceCleaned,
      binsProvided,
      communityActive,
      plantsRehab,
      indicators: [
        {
          label: "النظافة البصرية وإزالة النفايات",
          value: spaceCleaned ? (binsProvided ? 95 : 75) : 20,
          color: spaceCleaned ? "bg-emerald" : "bg-danger"
        },
        {
          label: "تنظيم خدمات الجمع والفرز",
          value: binsProvided ? 90 : 15,
          color: binsProvided ? "bg-info" : "bg-warning"
        },
        {
          label: "مؤشر استدامة النظافة والوعي",
          value: communityActive ? (binsProvided ? 92 : 60) : binsProvided ? 50 : 15,
          color: communityActive ? "bg-primary" : "bg-secondary"
        },
        {
          label: "جاذبية المشهد الحضري والتشجير",
          value: plantsRehab ? (spaceCleaned ? 94 : 50) : spaceCleaned ? 65 : 22,
          color: "bg-success"
        }
      ]
    };
  }
}

// ============================================================================
// 6. محرك المشهد البصري التفاعلي (updateScene & SVG Generator)
// ============================================================================

/**
 * الوظيفة الأساسية 5: updateScene(result)
 * تحديث العناصر البصرية في المشهد الجغرافي وفق قرارات الطالب بدقة دون مبالغة
 */
function updateScene(result) {
  const scenario = SCENARIOS[appState.currentScenarioId];
  const container = document.getElementById("svgSceneContainer");
  const modeLabel = document.getElementById("sceneModeLabel");
  const splitOverlay = document.getElementById("splitCompareOverlay");

  const isBeforeMode = appState.sceneViewMode === "before";
  const isSplitMode = appState.sceneViewMode === "split";

  // Update Mode Buttons
  document.getElementById("btnViewBefore").classList.toggle("active", isBeforeMode);
  document.getElementById("btnViewSimulated").classList.toggle("active", appState.sceneViewMode === "simulated");
  document.getElementById("btnViewSplit").classList.toggle("active", isSplitMode);

  const baselineState = computeVisualState(scenario.id, []);
  const activeState = isBeforeMode ? baselineState : result.visualState;

  if (isBeforeMode) {
    modeLabel.innerHTML = `<i class="bi bi-exclamation-triangle-fill text-warning me-1"></i>المشهد قبل التدخل (الوضع البيئي المتدهور)`;
    splitOverlay.classList.add("d-none");
    container.innerHTML = buildScenarioSVG(scenario.id, baselineState);
  } else if (isSplitMode) {
    modeLabel.innerHTML = `<i class="bi bi-layout-split text-emerald me-1"></i>مقارنة تفاعلية: اسحب المؤشر لمقارنة المشهد قبل خطتك وبعدها`;
    splitOverlay.classList.remove("d-none");
    const beforeSVG = buildScenarioSVG(scenario.id, baselineState);
    const afterSVG = buildScenarioSVG(scenario.id, result.visualState);
    container.innerHTML = `
      <div class="position-relative w-100 h-100">
        <div class="w-100 h-100 position-absolute top-0 start-0">${afterSVG}</div>
        <div id="splitBeforeClipLayer" class="w-100 h-100 position-absolute top-0 start-0" style="clip-path: inset(0 0 0 ${100 - appState.splitSliderValue}%); border-left: 3px solid #fff;">
          ${beforeSVG}
        </div>
      </div>
    `;
  } else {
    splitOverlay.classList.add("d-none");
    if (result.selectedSolutions.length === 0) {
      modeLabel.innerHTML = `<i class="bi bi-eye-fill me-1"></i>المشهد الحالي: لم يتم اختيار تدخلات بعد (الوضع الأولي)`;
    } else {
      modeLabel.innerHTML = `<i class="bi bi-magic text-emerald me-1"></i>محاكاة الأثر بعد تطبيق (${result.selectedSolutions.length}) إجراءات`;
    }
    container.innerHTML = buildScenarioSVG(scenario.id, activeState);
  }

  // Render active visual layer badges
  renderVisualChangeBadges(scenario, result);

  // Render 4 Indicators Progress Bars
  renderSceneIndicators(activeState.indicators, result.selectedSolutions.length);

  // Also update Step 4 Visual Summary Box
  renderStep4VisualExplanation(scenario, result);
}

function setSceneViewMode(mode) {
  appState.sceneViewMode = mode;
  updateScene(evaluatePlan());
}

function updateSplitSlider(val) {
  appState.splitSliderValue = Number(val);
  const clipLayer = document.getElementById("splitBeforeClipLayer");
  if (clipLayer) {
    clipLayer.style.clipPath = `inset(0 0 0 ${100 - appState.splitSliderValue}%)`;
  }
}

function renderVisualChangeBadges(scenario, result) {
  const bar = document.getElementById("visualChangesBadges");
  if (result.selectedSolutions.length === 0) {
    bar.innerHTML = `<span class="badge bg-secondary-subtle text-secondary">اختر الحلول من مختبر الحلول لمشاهدة التغير البصري المباشر</span>`;
    return;
  }

  const chosenSols = scenario.solutions.filter((s) => result.selectedSolutions.includes(s.id));
  bar.innerHTML = chosenSols
    .map(
      (s) =>
        `<span class="badge bg-emerald-soft text-emerald-dark border border-success-subtle"><i class="bi bi-check2 me-1"></i>${s.visualEffectText}</span>`
    )
    .join("");
}

function renderSceneIndicators(indicators, selectedCount) {
  const container = document.getElementById("sceneIndicatorsContainer");
  const summaryBadge = document.getElementById("planEffectSummaryBadge");

  summaryBadge.textContent =
    selectedCount === 0
      ? "مؤشرات خط الأساس قبل التدخل"
      : `تحديث المؤشرات بناءً على (${selectedCount}) تدخلات مختارة`;

  container.innerHTML = indicators
    .map(
      (ind) => `
      <div class="col-6">
        <div class="indicator-mini-card">
          <div class="d-flex justify-content-between align-items-center mb-1" style="font-size: 0.74rem;">
            <span class="fw-medium text-truncate">${ind.label}</span>
            <span class="fw-bold">${ind.value}%</span>
          </div>
          <div class="progress" style="height: 6px;">
            <div class="progress-bar ${ind.color}" role="progressbar" style="width: ${ind.value}%"></div>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

function renderStep4VisualExplanation(scenario, result) {
  const box = document.getElementById("step4VisualSummary");
  if (!box) return;

  if (result.selectedSolutions.length === 0) {
    box.className = "visual-explanation-card p-3 rounded-3 mb-3 bg-warning-subtle text-warning-emphasis small";
    box.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-1"></i>لم تختر أي إجراءات في مختبر الحلول بعد! عد إلى المرحلة 3 لاختيار إجراءات وملاحظة أثرها البصري.`;
    return;
  }

  let itemsHtml = "";
  scenario.solutions.forEach((sol) => {
    const isChosen = result.selectedSolutions.includes(sol.id);
    itemsHtml += `
      <div class="d-flex align-items-start gap-2 mb-1">
        <i class="bi ${isChosen ? "bi-check-circle-fill text-emerald" : "bi-x-circle text-muted"} mt-1"></i>
        <div>
          <strong>${sol.title}:</strong>
          ${
            isChosen
              ? `<span class="text-emerald-dark">${sol.visualEffectText}</span>`
              : `<span class="text-muted">لم يُختر — لذلك بقي الأثر المرتبط به دون معالجة (${sol.constraint})</span>`
          }
        </div>
      </div>
    `;
  });

  box.className = "visual-explanation-card p-3 rounded-3 mb-3 bg-light border small";
  box.innerHTML = `
    <div class="fw-bold mb-2 text-emerald-dark"><i class="bi bi-eye-fill me-1"></i>تفسير المحاكاة البصرية لقراراتك (لماذا تغير المشهد بهذا الشكل؟):</div>
    ${itemsHtml}
  `;
}

/**
 * بناء مشاهد SVG تفاعلية غنية بالتفاصيل العراقية تتغير طبقاتها بدقة وفق كل قرار
 */
function buildScenarioSVG(scenarioId, state) {
  if (scenarioId === "river") {
    // 1. River Scene (حارس النهر):
    // Water color depends ONLY on sewageTreated
    const waterColorTop = state.sewageTreated ? "#0ea5e9" : "#576843";
    const waterColorBottom = state.sewageTreated ? "#0369a1" : "#3f4a32";
    const skyColorTop = state.sewageTreated && state.banksCleaned ? "#bae6fd" : "#cbd5e1";

    return `
      <svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="skyGradRiver" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${skyColorTop}" />
            <stop offset="100%" stop-color="#f8fafc" />
          </linearGradient>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${waterColorTop}" />
            <stop offset="100%" stop-color="${waterColorBottom}" />
          </linearGradient>
          <linearGradient id="bankGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${state.plantsAdded ? "#86efac" : "#d6d3d1"}" />
            <stop offset="100%" stop-color="${state.plantsAdded ? "#4ade80" : "#a8a29e"}" />
          </linearGradient>
        </defs>

        <!-- Sky & Sun -->
        <rect width="800" height="200" fill="url(#skyGradRiver)" />
        <circle cx="680" cy="65" r="32" fill="#fde047" opacity="0.9" />

        <!-- Distant Iraqi Palm Silhouette & Horizon -->
        <path d="M0 175 Q 200 155 450 172 T 800 165 L 800 210 L 0 210 Z" fill="#e2e8f0" />
        
        <!-- Far Bank Palms -->
        <g opacity="0.75">
          <rect x="140" y="125" width="6" height="50" fill="#78350f" />
          <path d="M143 125 Q 120 115 115 130 M143 125 Q 165 115 170 130 M143 125 Q 143 105 130 110" stroke="#15803d" stroke-width="4" fill="none" />
          <rect x="520" y="130" width="6" height="45" fill="#78350f" />
          <path d="M523 130 Q 500 120 495 135 M523 130 Q 545 120 550 135" stroke="#15803d" stroke-width="4" fill="none" />
        </g>

        <!-- River Water Body -->
        <rect x="0" y="175" width="800" height="185" fill="url(#waterGrad)" />

        <!-- Water Waves / Reflections -->
        <g class="svg-water-wave" opacity="${state.sewageTreated ? "0.65" : "0.25"}">
          <path d="M 80 210 Q 130 202 180 210 T 280 210" stroke="#ffffff" stroke-width="2.5" fill="none" />
          <path d="M 420 235 Q 480 227 540 235 T 660 235" stroke="#ffffff" stroke-width="2" fill="none" />
          <path d="M 200 260 Q 260 254 320 260" stroke="#ffffff" stroke-width="2" fill="none" />
        </g>

        <!-- Fish / Aquatic Life (Appears when water is treated) -->
        ${
          state.sewageTreated
            ? `
          <g fill="#f97316" opacity="0.9">
            <ellipse cx="480" cy="250" rx="12" ry="5" />
            <polygon points="468,250 460,244 460,256" />
            <ellipse cx="550" cy="225" rx="10" ry="4" />
            <polygon points="540,225 533,220 533,230" />
          </g>
          <!-- White River Birds -->
          <path d="M 300 85 Q 310 75 320 85 Q 330 75 340 85" stroke="#334155" stroke-width="2" fill="none" />
          <path d="M 355 70 Q 363 62 371 70 Q 379 62 387 70" stroke="#334155" stroke-width="2" fill="none" />
        `
            : `
          <!-- Polluted Sludge patches when untreated -->
          <ellipse cx="210" cy="225" rx="75" ry="18" fill="#365314" opacity="0.65" />
          <ellipse cx="340" cy="248" rx="60" ry="14" fill="#3f6212" opacity="0.55" />
          <circle cx="250" cy="230" r="5" fill="#a3e635" opacity="0.5" />
          <circle cx="275" cy="220" r="4" fill="#a3e635" opacity="0.5" />
        `
        }

        <!-- Sewage Pipe on Left Bank -->
        <g>
          <rect x="20" y="160" width="95" height="28" rx="4" fill="#64748b" stroke="#334155" stroke-width="2" />
          <circle cx="115" cy="174" r="14" fill="#334155" />
          ${
            state.sewageTreated
              ? `
            <!-- Filtration Unit Installed -->
            <rect x="35" y="130" width="55" height="35" rx="6" fill="#059669" stroke="#ffffff" stroke-width="2" />
            <text x="62" y="152" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">وحدة معالجة</text>
            <path d="M 118 174 Q 145 182 155 215" stroke="#bae6fd" stroke-width="8" fill="none" opacity="0.7" />
          `
              : `
            <!-- Raw Sewage Gushing -->
            <path d="M 115 174 Q 160 185 195 225" stroke="#4d5d2b" stroke-width="16" fill="none" opacity="0.85" />
            <text x="68" y="152" fill="#dc2626" font-size="11" font-weight="bold" text-anchor="middle">صرف غير معالج!</text>
          `
          }
        </g>

        <!-- Foreground River Bank -->
        <path d="M 0 265 Q 260 245 520 275 T 800 260 L 800 360 L 0 360 Z" fill="url(#bankGrad)" />

        <!-- Native Riparian Vegetation (Reeds & Shrubs - depends on plantsAdded) -->
        ${
          state.plantsAdded
            ? `
          <g>
            <!-- Lush Iraqi Reeds (القصب والبردي) -->
            <path d="M 85 285 Q 75 220 65 190 M 92 285 Q 92 215 98 185 M 100 285 Q 112 225 120 195" stroke="#15803d" stroke-width="4" fill="none" />
            <ellipse cx="65" cy="190" rx="4" ry="12" fill="#78350f" />
            <ellipse cx="98" cy="185" rx="4" ry="12" fill="#78350f" />
            <path d="M 620 285 Q 610 220 600 190 M 628 285 Q 630 215 636 185 M 636 285 Q 648 225 655 195" stroke="#15803d" stroke-width="4" fill="none" />
            <ellipse cx="600" cy="190" rx="4" ry="12" fill="#78350f" />
            <ellipse cx="636" cy="185" rx="4" ry="12" fill="#78350f" />
            <!-- Bank Euphrates Poplar / Shrubs -->
            <circle cx="430" cy="275" r="24" fill="#16a34a" />
            <circle cx="455" cy="280" r="18" fill="#22c55e" />
            <circle cx="720" cy="270" r="26" fill="#15803d" />
            <circle cx="745" cy="276" r="20" fill="#22c55e" />
          </g>
        `
            : `
          <!-- Sparse Dry Reeds -->
          <g opacity="0.6">
            <path d="M 85 285 L 78 245 M 95 285 L 98 250" stroke="#a16207" stroke-width="3" />
            <path d="M 620 285 L 615 250 M 630 285 L 635 248" stroke="#a16207" stroke-width="3" />
          </g>
        `
        }

        <!-- Bank Waste Layer (Depends ONLY on banksCleaned) -->
        ${
          !state.banksCleaned
            ? `
          <g id="riverBankWasteLayer">
            <!-- Plastic bottles, bags, cans scattered on bank -->
            <rect x="180" y="295" width="26" height="16" rx="3" fill="#ef4444" transform="rotate(-15 180 295)" />
            <polygon points="240,310 265,300 270,322 235,325" fill="#3b82f6" opacity="0.9" />
            <circle cx="315" cy="305" r="10" fill="#eab308" />
            <rect x="370" y="315" width="30" height="15" rx="4" fill="#64748b" transform="rotate(12 370 315)" />
            <polygon points="500,302 528,295 532,318 495,318" fill="#f97316" />
            <rect x="565" y="312" width="22" height="12" rx="2" fill="#ec4899" />
            <text x="335" y="345" fill="#7f1d1d" font-size="12" font-weight="bold" text-anchor="middle">مخلفات متراكمة على الضفة</text>
          </g>
        `
            : `
          <!-- Clean Bank Path -->
          <text x="335" y="342" fill="#065f46" font-size="12" font-weight="bold" text-anchor="middle">ضفة نظيفة خالية من المخلفات</text>
        `
        }

        <!-- Community Awareness Sign & Preventive Fence (Depends on awarenessActive) -->
        ${
          state.awarenessActive
            ? `
          <g transform="translate(260, 232)">
            <rect x="38" y="35" width="6" height="38" fill="#78350f" />
            <rect x="0" y="5" width="84" height="34" rx="6" fill="#ffffff" stroke="#059669" stroke-width="2.5" />
            <text x="42" y="21" fill="#065f46" font-size="9.5" font-weight="bold" text-anchor="middle">نهرنا حياة وجمال</text>
            <text x="42" y="33" fill="#047857" font-size="8" text-anchor="middle">معًا لمنع رمي النفايات</text>
          </g>
        `
            : ""
        }
      </svg>
    `;
  } else if (scenarioId === "desertification") {
    // 2. Desertification Scene (أنقذ أرضنا)
    const hasWater = state.irrigationImproved;
    const hasPlants = state.plantsAdded;
    const hasGrazingProt = state.grazingRegulated;
    const hasClean = state.wasteCleaned;

    const soilColorTop = hasWater ? (hasPlants ? "#b48a60" : "#c29b70") : "#e7cba9";
    const soilColorBottom = hasWater ? "#8c6239" : "#d4a373";

    return `
      <svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="desertSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${hasWater && hasPlants ? "#bae6fd" : "#fef3c7"}" />
            <stop offset="100%" stop-color="#fffbeb" />
          </linearGradient>
          <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${soilColorTop}" />
            <stop offset="100%" stop-color="${soilColorBottom}" />
          </linearGradient>
        </defs>

        <!-- Sky & Hot Sun -->
        <rect width="800" height="185" fill="url(#desertSky)" />
        <circle cx="670" cy="65" r="${hasWater && hasPlants ? "30" : "40"}" fill="${hasWater && hasPlants ? "#facc15" : "#f97316"}" opacity="0.85" />

        <!-- Distant Sand Dunes / Hills -->
        <path d="M 0 180 Q 180 140 380 175 T 800 160 L 800 200 L 0 200 Z" fill="#fde68a" opacity="0.7" />

        <!-- Main Agricultural / Dry Land -->
        <rect x="0" y="175" width="800" height="185" fill="url(#soilGrad)" />

        <!-- Soil Cracks (Disappear when irrigationImproved is active) -->
        ${
          !hasWater
            ? `
          <g stroke="#78350f" stroke-width="2" opacity="0.55" fill="none">
            <path d="M 120 230 L 145 245 L 130 265 M 145 245 L 175 240" />
            <path d="M 380 250 L 410 265 L 395 290 M 410 265 L 440 260" />
            <path d="M 590 225 L 620 240 L 645 230 M 620 240 L 615 265" />
            <path d="M 250 305 L 285 318 L 310 308" />
          </g>
        `
            : `
          <!-- Modern Drip Irrigation Lines (تحسين إدارة مياه الري) -->
          <g>
            <path d="M 60 235 L 740 235" stroke="#0284c7" stroke-width="4" stroke-dasharray="10,4" />
            <path d="M 40 290 L 760 290" stroke="#0284c7" stroke-width="4" stroke-dasharray="10,4" />
            <!-- Water droplets -->
            <circle cx="160" cy="242" r="5" fill="#38bdf8" />
            <circle cx="320" cy="242" r="5" fill="#38bdf8" />
            <circle cx="480" cy="242" r="5" fill="#38bdf8" />
            <circle cx="640" cy="242" r="5" fill="#38bdf8" />
            <circle cx="220" cy="297" r="5" fill="#38bdf8" />
            <circle cx="420" cy="297" r="5" fill="#38bdf8" />
            <circle cx="580" cy="297" r="5" fill="#38bdf8" />
            <rect x="20" y="215" width="48" height="35" rx="5" fill="#0369a1" />
            <text x="44" y="236" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle">ري مرشّد</text>
          </g>
        `
        }

        <!-- Grazing Regulation Fence & Sign (تنظيم الرعي وحماية المناطق المتدهورة) -->
        ${
          hasGrazingProt
            ? `
          <g>
            <!-- Wooden protective fence along horizon -->
            <line x1="90" y1="185" x2="710" y2="185" stroke="#78350f" stroke-width="3" />
            <line x1="90" y1="198" x2="710" y2="198" stroke="#78350f" stroke-width="3" />
            <rect x="100" y="172" width="6" height="35" fill="#78350f" />
            <rect x="250" y="172" width="6" height="35" fill="#78350f" />
            <rect x="400" y="172" width="6" height="35" fill="#78350f" />
            <rect x="550" y="172" width="6" height="35" fill="#78350f" />
            <rect x="700" y="172" width="6" height="35" fill="#78350f" />
            <!-- Natural grass recovery patches -->
            <ellipse cx="280" cy="215" rx="45" ry="10" fill="#65a30d" opacity="0.5" />
            <ellipse cx="520" cy="215" rx="50" ry="10" fill="#65a30d" opacity="0.5" />
            <rect x="345" y="150" width="110" height="24" rx="5" fill="#065f46" />
            <text x="400" y="166" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">منطقة رعي منظم ومحمية</text>
          </g>
        `
            : `
          <!-- Unregulated overgrazing indicator -->
          <text x="400" y="170" fill="#9a3412" font-size="11" font-weight="bold" text-anchor="middle">أرض مكشوفة معرضة للرعي الجائر والانجراف</text>
        `
        }

        <!-- Drought-Tolerant Native Plants (زراعة نباتات محلية ملائمة للجفاف) -->
        ${
          hasPlants
            ? `
          <g>
            <!-- Gradual realistic native vegetation (Sider, Tamarisk, Olive/Palm saplings) -->
            <g transform="translate(160, 210)">
              <rect x="-4" y="12" width="8" height="20" fill="#78350f" />
              <circle cx="0" cy="6" r="${hasWater ? "22" : "15"}" fill="${hasWater ? "#15803d" : "#65a30d"}" />
              <circle cx="-12" cy="12" r="${hasWater ? "15" : "10"}" fill="${hasWater ? "#16a34a" : "#84cc16"}" />
              <circle cx="12" cy="12" r="${hasWater ? "15" : "10"}" fill="${hasWater ? "#16a34a" : "#84cc16"}" />
            </g>
            <g transform="translate(320, 212)">
              <rect x="-4" y="12" width="8" height="20" fill="#78350f" />
              <circle cx="0" cy="6" r="${hasWater ? "20" : "14"}" fill="${hasWater ? "#16a34a" : "#65a30d"}" />
            </g>
            <g transform="translate(480, 210)">
              <rect x="-4" y="12" width="8" height="20" fill="#78350f" />
              <circle cx="0" cy="6" r="${hasWater ? "23" : "15"}" fill="${hasWater ? "#15803d" : "#65a30d"}" />
              <circle cx="14" cy="10" r="${hasWater ? "16" : "10"}" fill="${hasWater ? "#22c55e" : "#84cc16"}" />
            </g>
            <g transform="translate(640, 212)">
              <rect x="-4" y="12" width="8" height="20" fill="#78350f" />
              <circle cx="0" cy="6" r="${hasWater ? "20" : "14"}" fill="${hasWater ? "#15803d" : "#65a30d"}" />
            </g>
            <!-- Second row shrubs -->
            <ellipse cx="220" cy="292" rx="${hasWater ? "26" : "16"}" ry="${hasWater ? "14" : "9"}" fill="#16a34a" />
            <ellipse cx="420" cy="292" rx="${hasWater ? "28" : "16"}" ry="${hasWater ? "15" : "9"}" fill="#15803d" />
            <ellipse cx="580" cy="292" rx="${hasWater ? "26" : "16"}" ry="${hasWater ? "14" : "9"}" fill="#16a34a" />
          </g>
        `
            : `
          <!-- Two tiny withered shrubs -->
          <circle cx="210" cy="235" r="8" fill="#a16207" opacity="0.6" />
          <circle cx="540" cy="275" r="9" fill="#a16207" opacity="0.6" />
        `
        }

        <!-- Surface Waste Layer (تنظيف الموقع من المخلفات) -->
        ${
          !hasClean
            ? `
          <g>
            <rect x="110" y="320" width="24" height="14" rx="2" fill="#64748b" />
            <polygon points="490,325 515,318 520,335 485,335" fill="#ef4444" opacity="0.85" />
            <circle cx="680" cy="325" r="9" fill="#475569" />
          </g>
        `
            : ""
        }
      </svg>
    `;
  } else {
    // 3. Urban Public Space Scene (مدينتنا أجمل)
    const isClean = state.spaceCleaned;
    const hasBins = state.binsProvided;
    const hasComm = state.communityActive;
    const hasRehab = state.plantsRehab;

    const grassColor = hasRehab && isClean ? "#4ade80" : isClean ? "#bbf7d0" : "#d6d3d1";

    return `
      <svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="citySky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${isClean ? "#bae6fd" : "#cbd5e1"}" />
            <stop offset="100%" stop-color="#f8fafc" />
          </linearGradient>
        </defs>

        <!-- Sky -->
        <rect width="800" height="185" fill="url(#citySky)" />

        <!-- Iraqi City Skyline Silhouette -->
        <g fill="#94a3b8" opacity="0.45">
          <rect x="40" y="95" width="75" height="90" />
          <rect x="130" y="115" width="60" height="70" />
          <rect x="610" y="85" width="85" height="100" />
          <rect x="705" y="110" width="65" height="75" />
          <!-- Dome / Arch motif -->
          <path d="M 350 185 L 350 130 Q 385 95 420 130 L 420 185 Z" />
        </g>

        <!-- Park Ground -->
        <rect x="0" y="185" width="800" height="175" fill="${grassColor}" />

        <!-- Paved Walkway in Center -->
        <polygon points="290,185 510,185 640,360 160,360" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="3" />

        <!-- Existing Park Bench & Lamp Post -->
        <g transform="translate(210, 215)">
          <rect x="0" y="20" width="75" height="8" rx="2" fill="#92400e" />
          <rect x="5" y="10" width="65" height="8" rx="2" fill="#b45309" />
          <rect x="10" y="28" width="6" height="14" fill="#334155" />
          <rect x="58" y="28" width="6" height="14" fill="#334155" />
        </g>
        <g transform="translate(185, 130)">
          <rect x="8" y="20" width="5" height="95" fill="#334155" />
          <circle cx="10.5" cy="18" r="10" fill="#fef08a" stroke="#ca8a04" stroke-width="2" />
        </g>

        <!-- Rehabilitated Trees & Flowerbeds (إعادة تأهيل المساحة بالنباتات الملائمة) -->
        ${
          hasRehab
            ? `
          <g>
            <!-- Left Lush Tree & Flowerbed -->
            <rect x="85" y="175" width="12" height="55" fill="#78350f" />
            <circle cx="91" cy="155" r="36" fill="#15803d" />
            <circle cx="70" cy="168" r="24" fill="#22c55e" />
            <circle cx="112" cy="168" r="24" fill="#16a34a" />
            <!-- Flowerbeds along path -->
            <ellipse cx="120" cy="295" rx="55" ry="18" fill="#166534" />
            <circle cx="95" cy="292" r="6" fill="#f43f5e" />
            <circle cx="115" cy="298" r="6" fill="#facc15" />
            <circle cx="135" cy="290" r="6" fill="#a855f7" />
            <circle cx="150" cy="296" r="6" fill="#f43f5e" />

            <!-- Right Lush Tree & Flowerbed -->
            <rect x="685" y="175" width="12" height="55" fill="#78350f" />
            <circle cx="691" cy="155" r="36" fill="#15803d" />
            <circle cx="670" cy="168" r="24" fill="#22c55e" />
            <circle cx="712" cy="168" r="24" fill="#16a34a" />
            <ellipse cx="680" cy="295" rx="55" ry="18" fill="#166534" />
            <circle cx="655" cy="292" r="6" fill="#facc15" />
            <circle cx="675" cy="298" r="6" fill="#f43f5e" />
            <circle cx="695" cy="290" r="6" fill="#38bdf8" />
            <circle cx="710" cy="296" r="6" fill="#facc15" />
          </g>
        `
            : `
          <!-- Unmaintained dry tree trunks -->
          <g opacity="0.65">
            <rect x="85" y="180" width="10" height="50" fill="#78350f" />
            <circle cx="90" cy="168" r="20" fill="#a3a3a3" />
            <rect x="685" y="180" width="10" height="50" fill="#78350f" />
            <circle cx="690" cy="168" r="20" fill="#a3a3a3" />
          </g>
        `
        }

        <!-- Sorting & Collection Bins (توفير نقاط جمع وفرز مناسبة) -->
        ${
          hasBins
            ? `
          <g transform="translate(525, 200)">
            <!-- 3 Recycling & Sorting Bins -->
            <rect x="0" y="12" width="28" height="38" rx="4" fill="#0284c7" stroke="#fff" stroke-width="1.5" />
            <text x="14" y="34" fill="#fff" font-size="7" font-weight="bold" text-anchor="middle">بلاستيك</text>
            <rect x="34" y="12" width="28" height="38" rx="4" fill="#16a34a" stroke="#fff" stroke-width="1.5" />
            <text x="48" y="34" fill="#fff" font-size="7" font-weight="bold" text-anchor="middle">ورق</text>
            <rect x="68" y="12" width="28" height="38" rx="4" fill="#ea580c" stroke="#fff" stroke-width="1.5" />
            <text x="82" y="34" fill="#fff" font-size="7" font-weight="bold" text-anchor="middle">عضوي</text>
            <rect x="-4" y="0" width="104" height="10" rx="3" fill="#334155" />
          </g>
        `
            : ""
        }

        <!-- Community Awareness Banner (التوعية والمشاركة المجتمعية) -->
        ${
          hasComm
            ? `
          <g transform="translate(310, 145)">
            <rect x="10" y="25" width="5" height="30" fill="#475569" />
            <rect x="165" y="25" width="5" height="30" fill="#475569" />
            <rect x="0" y="0" width="180" height="28" rx="6" fill="#059669" stroke="#ffffff" stroke-width="2" />
            <text x="90" y="18" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">مدينتنا أجمل بوعينا ومشاركتنا</text>
          </g>
        `
            : ""
        }

        <!-- Accumulated Waste Layer (تنظيف المساحة العامة) -->
        ${
          !isClean
            ? `
          <g id="urbanWasteLayer">
            <!-- Trash piles along walkway and grass -->
            <ellipse cx="380" cy="275" rx="42" ry="16" fill="#475569" opacity="0.8" />
            <polygon points="355,270 375,255 395,272" fill="#ef4444" />
            <circle cx="400" cy="270" r="9" fill="#eab308" />
            <rect x="290" y="305" width="28" height="16" rx="3" fill="#3b82f6" transform="rotate(-12 290 305)" />
            <polygon points="455,310 485,300 490,322 450,322" fill="#f97316" />
            <circle cx="235" cy="280" r="11" fill="#64748b" />
            <rect x="530" y="285" width="25" height="14" fill="#ec4899" />
            <text x="400" y="345" fill="#991b1b" font-size="12" font-weight="bold" text-anchor="middle">نفايات متراكمة تشوه المساحة العامة</text>
          </g>
        `
            : `
          <text x="400" y="345" fill="#065f46" font-size="12" font-weight="bold" text-anchor="middle">ممرات نظيفة ومساحة عامة منظمة</text>
        `
        }
      </svg>
    `;
  }
}

// ============================================================================
// 7. توليد التغذية الراجعة التفسيرية وتوثيق التقييم (generateFeedback & recordAssessment)
// ============================================================================

/**
 * الوظيفة الأساسية 6: generateFeedback(result)
 * توليد تغذية راجعة تربوية تشرح نقاط القوة والقصور والخطوة التالية ومؤشر الحس الجمالي
 */
function generateFeedback(result) {
  const scenario = SCENARIOS[appState.currentScenarioId];

  // Update Score Badges & Progress Bars
  document.getElementById("totalProblemScoreBadge").textContent = `${result.problemSolvingTotal} / 10`;
  document.getElementById("problemScoreProgressBar").style.width = `${(result.problemSolvingTotal / 10) * 100}%`;

  document.getElementById("totalAestheticScoreBadge").textContent = `${result.aestheticScore} / 2`;
  document.getElementById("aestheticScoreProgressBar").style.width = `${(result.aestheticScore / 2) * 100}%`;
  document.getElementById("aestheticLevelTitle").textContent = result.aestheticLevelTitle;
  document.getElementById("aestheticLevelDescription").textContent = scenario.aestheticIndicatorNote;

  // Detailed 5-Skill Breakdown List (2 + 2 + 3 + 2 + 1 = 10)
  const breakdownContainer = document.getElementById("skillBreakdownList");
  const skills = [
    { name: "1. تحديد المشكلة البيئية", score: result.problemIdScore, max: 2 },
    { name: "2. تحليل الأسباب والعوامل المؤثرة", score: result.causesScore, max: 2 },
    { name: "3. اقتراح واختيار الحلول المتوازنة", score: result.solutionsScore, max: 3 },
    { name: "4. تبرير القرار ومراعاة القيود", score: result.justificationScore, max: 2 },
    { name: "5. توقع النتائج ومراجعة الخطة", score: result.predictionScore, max: 1 }
  ];

  breakdownContainer.innerHTML = skills
    .map(
      (s) => `
      <div class="d-flex justify-content-between align-items-center py-1 border-bottom">
        <span>${s.name}</span>
        <span class="fw-bold ${s.score === s.max ? "text-emerald-dark" : "text-secondary"}">${s.score} / ${s.max}</span>
      </div>
    `
    )
    .join("");

  // Build Strengths, Limitations, and Next Step based on student's exact choices
  const strengths = [];
  const limitations = [];
  let nextStepSuggestion = "";

  const sols = result.selectedSolutions;
  if (scenario.id === "river") {
    if (sols.includes("treat_sewage")) {
      strengths.push("استهدفت المصدر الرئيسي لتلوث المياه عبر اختيار (معالجة مياه الصرف قبل تصريفها).");
    } else {
      limitations.push("لم تتضمن خطتك (معالجة مياه الصرف)؛ لذا بقيت جودة مياه النهر متدهورة رغم أي تحسين شكلي على الضفة.");
    }
    if (sols.includes("clean_banks")) {
      strengths.push("اهتممت بالتحسين المباشر لنظافة الضفة وإزالة المخلفات المرئية.");
    } else {
      limitations.push("أغفلت (تنظيف ضفاف النهر)؛ فبقيت المخلفات الصلبة المتراكمة تشوه الضفة.");
    }
    if (sols.includes("community_awareness")) {
      strengths.push("أدرجت (توعية المجتمع) لضمان الوقاية ومنع عودة المخلفات مستقبلاً.");
    } else {
      limitations.push("غياب (التوعية المجتمعية) قد يجعل المخلفات تتراكم مرة أخرى بعد تنظيفها.");
    }
    if (sols.includes("plant_native_riparian")) {
      strengths.push("عززت التنوع الحيوي والجمال الطبيعي للضفة بزراعة النباتات المحلية.");
    }
    nextStepSuggestion =
      sols.includes("treat_sewage") && sols.includes("clean_banks")
        ? "خطتك متوازنة! الخطوة التالية هي مراقبة جودة المياه دوريًا وإشراك طلاب المدرسة في حملات حماية ضفاف النهر."
        : "جرب الضغط على (إعادة التفكير وتعديل الخطة) للجمع بين معالجة مصدر التلوث وتنظيف الضفة والوقاية.";
  } else if (scenario.id === "desertification") {
    if (sols.includes("improve_irrigation")) {
      strengths.push("راعيت محدودية الموارد المائية في العراق عبر (تحسين إدارة مياه الري).");
    } else {
      limitations.push("لم تعالج مشكلة هدر المياه؛ فزراعة النباتات دون تحسين الري تضعف فرص نجاحها في الأراضي الجافة.");
    }
    if (sols.includes("plant_drought_tolerant")) {
      strengths.push("اخترت (زراعة نباتات محلية ملائمة للجفاف) لدعم استقرار التربة واستعادة الغطاء النباتي.");
    } else {
      limitations.push("خلت خطتك من استعادة الغطاء النباتي المحلي الضروري لتثبيت التربة.");
    }
    if (sols.includes("regulate_grazing")) {
      strengths.push("وفرت الحماية للغطاء النباتي عبر (تنظيم الرعي وحماية المناطق المتدهورة).");
    } else {
      limitations.push("ترك المنطقة دون تنظيم للرعي يعرض النباتات الجديدة للتدهور السريع.");
    }
    if (sols.length === 1 && sols.includes("clean_site_waste")) {
      limitations.push("اعتمدت على (تنظيف الموقع من المخلفات) وحده، وهو يحسن المظهر السطحي لكنه لا يعالج أسباب التصحر.");
    }
    nextStepSuggestion =
      sols.includes("improve_irrigation") && sols.includes("plant_drought_tolerant") && sols.includes("regulate_grazing")
        ? "خطة متكاملة تراعي ظروف البيئة الجافة! الخطوة التالية هي متابعة نمو النباتات المحلية موسميًا."
        : "أعد مراجعة خطتك بحيث تجمع بين ترشيد مياه الري، وتنظيم الرعي، وزراعة النباتات الملائمة للجفاف.";
  } else {
    if (sols.includes("clean_public_space")) {
      strengths.push("بدأت بحل فوري ضروري وهو (تنظيف المساحة العامة) لإزالة النفايات المتراكمة.");
    } else {
      limitations.push("لم تختر (تنظيف المساحة العامة)؛ فالوعي والحاويات لا يزيلان النفايات المتكدسة سابقًا بصورة تلقائية.");
    }
    if (sols.includes("provide_sorting_bins")) {
      strengths.push("عالجت الجانب الخدمي بتوفير (نقاط جمع وفرز مناسبة) لتسهيل التخلص السليم والتدوير.");
    } else {
      limitations.push("غياب نقاط الجمع والفرز يجعل السكان يفتقرون لوسيلة منظمة للتخلص من النفايات.");
    }
    if (sols.includes("community_participation")) {
      strengths.push("دعمت استدامة النظافة من خلال (التوعية والمشاركة المجتمعية).");
    } else {
      limitations.push("إغفال المشاركة المجتمعية يقلل من استدامة نظافة المكان على المدى الطويل.");
    }
    if (sols.includes("rehabilitate_plants")) {
      strengths.push("أكملت تحسين المشهد الحضري بإعادة تأهيل المساحة بالنباتات الملائمة.");
    }
    nextStepSuggestion =
      sols.includes("clean_public_space") && sols.includes("provide_sorting_bins") && sols.includes("community_participation")
        ? "خطة حضرية مستدامة! الخطوة التالية هي تنظيم مبادرة مدرسية لفرز النفايات القابلة للتدوير."
        : "حسّن خطتك بالجمع بين التنظيف الفوري، وتوفير نقاط الفرز، والتوعية المجتمعية.";
  }

  const feedbackContainer = document.getElementById("pedagogicalFeedbackContent");
  feedbackContainer.innerHTML = `
    <div class="p-2 rounded-3 bg-white border mb-2">
      <div class="fw-bold text-emerald-dark mb-1"><i class="bi bi-quote me-1"></i>القاعدة التربوية للسيناريو:</div>
      <p class="mb-0">${scenario.modelFeedbackSummary}</p>
    </div>
    <div class="row g-2 mb-2">
      <div class="col-md-6">
        <div class="p-2 rounded-3 bg-emerald-soft h-100">
          <div class="fw-bold text-emerald-dark mb-1"><i class="bi bi-check2-all me-1"></i>نقاط القوة في قرارك:</div>
          <ul class="mb-0 ps-3">
            ${
              strengths.length > 0
                ? strengths.map((s) => `<li>${s}</li>`).join("")
                : "<li>لم يتم اختيار إجراءات كافية بعد لبناء نقاط قوة.</li>"
            }
          </ul>
        </div>
      </div>
      <div class="col-md-6">
        <div class="p-2 rounded-3 bg-warning-subtle h-100">
          <div class="fw-bold text-warning-emphasis mb-1"><i class="bi bi-exclamation-diamond me-1"></i>جوانب القصور والحدود:</div>
          <ul class="mb-0 ps-3">
            ${
              limitations.length > 0
                ? limitations.map((l) => `<li>${l}</li>`).join("")
                : "<li>خطتك غطت جميع الجوانب الأساسية للمشكلة ومصادرها والوقاية منها!</li>"
            }
          </ul>
        </div>
      </div>
    </div>
    <div class="p-2 rounded-3 bg-light border">
      <strong><i class="bi bi-Compass text-emerald me-1"></i>الخطوة التالية المقترحة:</strong> ${nextStepSuggestion}
    </div>
  `;
}

/**
 * الوظيفة الأساسية 7: recordAssessment(result)
 * تسجيل درجات مهارات حل المشكلات والحس الجمالي بصورة منفصلة في السجل المحلي
 */
function recordAssessment(result) {
  const scenario = SCENARIOS[result.scenarioId];
  const records = getSavedRecords();

  const recordEntry = {
    timestamp: new Date().toLocaleString("ar-IQ"),
    studentName: appState.studentProfile.name,
    studentGrade: appState.studentProfile.grade,
    studentGroup: appState.studentProfile.group,
    scenarioId: scenario.id,
    scenarioTitle: scenario.title,
    problemIdScore: result.problemIdScore,
    causesScore: result.causesScore,
    solutionsScore: result.solutionsScore,
    justificationScore: result.justificationScore,
    predictionScore: result.predictionScore,
    problemSolvingTotal: result.problemSolvingTotal, // Out of 10
    aestheticScore: result.aestheticScore, // Out of 2 (Independent variable)
    aestheticFreeText: result.freeTextClean || "",
    selectedCauses: result.selectedCauses,
    selectedSolutions: result.selectedSolutions
  };

  records.push(recordEntry);
  localStorage.setItem("green_footprint_records_v1", JSON.stringify(records));
  updateRecordsBadgeCount();
  return recordEntry;
}

// ============================================================================
// 8. التنقل بين المراحل وإجراءات المستخدم (NAVIGATION & WORKFLOW)
// ============================================================================

function goToStep(stepNumber) {
  appState.currentStep = stepNumber;

  // Update Stepper Header UI
  const stepButtons = document.querySelectorAll("#stepperWrapper .step-item");
  stepButtons.forEach((btn) => {
    const s = Number(btn.getAttribute("data-step"));
    btn.classList.toggle("active", s === stepNumber);
    btn.classList.toggle("completed", s < stepNumber);
  });

  // Show active Step Pane
  for (let i = 1; i <= 5; i++) {
    const pane = document.getElementById(`stepPane${i}`);
    if (pane) {
      pane.classList.toggle("d-none", i !== stepNumber);
      pane.classList.toggle("active", i === stepNumber);
    }
  }

  // Always refresh visual scene & evaluation when entering Step 4 or Step 5
  const result = evaluatePlan();
  updateScene(result);
  if (stepNumber === 5) {
    generateFeedback(result);
  }
}

function applyPlanAndGoToStep4() {
  const resp = appState.responses[appState.currentScenarioId];
  if (resp.selectedSolutions.length === 0) {
    showToast("يرجى اختيار إجراء واحد على الأقل (ويفضل إجراءان أو أكثر) من مختبر الحلول لتجربة الأثر.");
    return;
  }
  appState.sceneViewMode = "simulated";
  goToStep(4);
}

function completeAndEvaluateScenario() {
  const resp = appState.responses[appState.currentScenarioId];
  const result = evaluatePlan();
  resp.completed = true;
  resp.lastEvaluation = result;

  renderScenarioTabs();
  goToStep(5);
  recordAssessment(result);
  showToast("تم إصدار التقييم التربوي وحفظ النتيجة في سجل الأداء بنجاح!");
}

function resetCurrentScenario() {
  appState.responses[appState.currentScenarioId] = createBlankScenarioResponse();
  appState.sceneViewMode = "simulated";
  document.getElementById("aiMentorResponseBox").classList.add("d-none");
  loadScenario(appState.currentScenarioId);
  showToast("تمت إعادة تعيين السيناريو الحالي للبدء من جديد.");
}

function loadNextScenario() {
  const order = ["river", "desertification", "urban_waste"];
  const idx = order.indexOf(appState.currentScenarioId);
  const nextId = order[(idx + 1) % order.length];
  loadScenario(nextId);
}

// ============================================================================
// 9. طبقة الذكاء الاصطناعي المستقلة (STAGE 1 & STAGE 2 AI MENTOR LAYER)
// ============================================================================

function toggleAIModeConfig() {
  const mode = document.getElementById("aiModeSelect").value;
  document.getElementById("remoteProxyConfigBox").classList.toggle("d-none", mode !== "remote_proxy");
}

function saveAIConfig() {
  appState.aiConfig.mode = document.getElementById("aiModeSelect").value;
  appState.aiConfig.proxyUrl = document.getElementById("aiProxyUrlInput").value.trim();
  localStorage.setItem("green_footprint_ai_config", JSON.stringify(appState.aiConfig));
  showToast("تم حفظ إعدادات الموجّه الذكي.");
}

function updateAIPayloadPreview() {
  const preview = document.getElementById("aiPayloadPreview");
  if (!preview) return;
  const result = evaluatePlan();
  const safePayload = {
    scenarioId: result.scenarioId,
    causes: result.selectedCauses,
    solutions: result.selectedSolutions,
    scores: {
      problemSolving: result.problemSolvingTotal,
      aestheticSense: result.aestheticScore
    }
  };
  preview.textContent = JSON.stringify(safePayload);
}

async function requestAIMentorFeedback() {
  const box = document.getElementById("aiMentorResponseBox");
  const btn = document.getElementById("btnGenerateAIMentor");
  const result = evaluatePlan();
  const scenario = SCENARIOS[result.scenarioId];

  box.classList.remove("d-none");
  btn.disabled = true;
  box.innerHTML = `<div class="d-flex align-items-center gap-2"><div class="spinner-border spinner-border-sm text-warning"></div><span>يقوم الموجّه الذكي بتحليل قراراتك وتأملك الجمالي...</span></div>`;

  // If remote proxy is configured in Phase 2, send privacy-safe structured payload
  if (appState.aiConfig.mode === "remote_proxy" && appState.aiConfig.proxyUrl) {
    try {
      const response = await fetch(appState.aiConfig.proxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario.id,
          scenarioTitle: scenario.title,
          selectedCauses: result.selectedCauses,
          selectedSolutions: result.selectedSolutions,
          problemSolvingScore: result.problemSolvingTotal,
          aestheticScore: result.aestheticScore,
          studentReflection: result.freeTextClean
        })
      });
      if (!response.ok) throw new Error("Proxy HTTP Error");
      const data = await response.json();
      box.innerHTML = `
        <div class="fw-bold mb-1"><i class="bi bi-stars me-1"></i>رسالة الموجّه الذكي المخصصة (عبر الخادم الوسيط - المرحلة 2):</div>
        <p class="mb-0">${data.feedback || data.message}</p>
      `;
      btn.disabled = false;
      return;
    } catch (err) {
      // Fallback gracefully to local smart pedagogical synthesizer
    }
  }

  // Local Pedagogical Smart Synthesizer (Stage 1 + Personalized Diagnostic Prompting)
  setTimeout(() => {
    const chosenSolutionTitles = scenario.solutions
      .filter((s) => result.selectedSolutions.includes(s.id))
      .map((s) => `«${s.title}»`)
      .join(" و");

    let customDiagnostic = "";
    if (result.problemSolvingTotal >= 8.5 && result.aestheticScore === 2) {
      customDiagnostic = `أحسنت يا محققنا البيئي! جمعت في سيناريو (${scenario.title}) بين التفكير السببي العميق واختيار حزمة متوازنة (${chosenSolutionTitles || "متكاملة"})، كما أظهرت حسًا جماليًا عاليًا يدرك أن جمال البيئة العراقية ينبع من توازن عناصرها ونقائها وليس من المظهر السطحي فقط.`;
    } else if (result.problemSolvingTotal >= 7 && result.aestheticScore < 2) {
      customDiagnostic = `خطتك العلمية لحل المشكلة (${chosenSolutionTitles}) قوية وتستهدف جذور المشكلة، لكننا ندعوك لتأمل المشهد الجغرافي بعمق أكبر: كيف ينعكس تحسن البيئة على التناسق البصري والتنوع الطبيعي؟ تذكر أن حماية البيئة تحفظ وظيفتها وجمالها معًا.`;
    } else if (result.problemSolvingTotal < 7 && result.aestheticScore === 2) {
      customDiagnostic = `تمتلك تذوقًا جماليًا رائعًا لمكونات المشهد الجغرافي! ولتحويل هذا الحس الجمالي إلى أثر مستدام على أرض الواقع، تحتاج خطتك (${chosenSolutionTitles || "الحالية"}) إلى استهداف الأسباب الجذرية للمشكلة (مثل معالجة المصدر وإدارة الموارد) وعدم الاكتفاء بتحسين المظهر المباشر.`;
    } else {
      customDiagnostic = `بداية طيبة في التحقيق البيئي! لاحظتَ جزءًا من المشكلة واخترت (${chosenSolutionTitles || "بعض الإجراءات"})، ولتحقيق بصمة خضراء مستدامة في بيئة العراق، فكّر: هل عالجت خطتك السبب الرئيسي للمشكلة أم اكتفت بإزالة المظهر السطحي؟`;
    }

    const socraticQuestion =
      scenario.id === "river"
        ? "سؤال تأملي من الموجّه الذكي: لو كنت مسؤولًا عن نهر في مدينتك بميزانية محدودة، كيف ترتب أولوياتك بين معالجة الصرف وتنظيف الضفة وتشجيرها؟"
        : scenario.id === "desertification"
        ? "سؤال تأملي من الموجّه الذكي: لماذا تُعد النباتات المحلية العراقية (كالسدر والأثل) أجمل وأكثر استدامة في أراضينا الجافة من النباتات المستوردة كثيفة الاستهلاك للماء؟"
        : "سؤال تأملي من الموجّه الذكي: كيف يمكن لتصميم حاويات الفرز والتشجير أن يجعل السكان يشعرون بأن المتنزه العام جزء من بيتهم فيحافظون على نظافته تلقائيًا؟";

    box.innerHTML = `
      <div class="fw-bold mb-1"><i class="bi bi-stars me-1"></i>تحليل الموجّه الذكي المخصص لاختياراتك:</div>
      <p class="mb-2">${customDiagnostic}</p>
      <div class="p-2 rounded bg-white bg-opacity-75 border border-warning-subtle">
        <strong><i class="bi bi-chat-quote-fill text-warning me-1"></i>للتفكير الناقد:</strong> ${socraticQuestion}
      </div>
    `;
    btn.disabled = false;
  }, 450);
}

// ============================================================================
// 10. إدارة بيانات الطالب وسجل الأداء والتصدير البحثي (R8 — RECORDS & EXPORT)
// ============================================================================

function loadPersistedProfileAndConfig() {
  try {
    const savedProfile = localStorage.getItem("green_footprint_student_profile");
    if (savedProfile) {
      appState.studentProfile = JSON.parse(savedProfile);
      document.getElementById("studentNameDisplay").textContent = `محقق بيئي: ${appState.studentProfile.name} (${appState.studentProfile.grade})`;
      document.getElementById("studentNameInput").value = appState.studentProfile.name;
      document.getElementById("studentGradeInput").value = appState.studentProfile.grade;
      document.getElementById("studentGroupInput").value = appState.studentProfile.group;
    }
    const savedAI = localStorage.getItem("green_footprint_ai_config");
    if (savedAI) {
      appState.aiConfig = JSON.parse(savedAI);
      document.getElementById("aiModeSelect").value = appState.aiConfig.mode;
      document.getElementById("aiProxyUrlInput").value = appState.aiConfig.proxyUrl || "";
      toggleAIModeConfig();
    }
  } catch (e) {
    console.warn(e);
  }
}

function saveStudentProfile() {
  const name = document.getElementById("studentNameInput").value.trim() || "طالب غير محدد";
  const grade = document.getElementById("studentGradeInput").value;
  const group = document.getElementById("studentGroupInput").value;

  appState.studentProfile = { name, grade, group };
  localStorage.setItem("green_footprint_student_profile", JSON.stringify(appState.studentProfile));
  document.getElementById("studentNameDisplay").textContent = `محقق بيئي: ${name} (${grade})`;
  showToast(`مرحبًا بك يا ${name}! تم حفظ بياناتك.`);
}

function getSavedRecords() {
  try {
    const raw = localStorage.getItem("green_footprint_records_v1");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function updateRecordsBadgeCount() {
  const records = getSavedRecords();
  const badge = document.getElementById("recordsCountBadge");
  if (badge) badge.textContent = records.length;
}

function saveCurrentAttemptToRecords() {
  const result = evaluatePlan();
  recordAssessment(result);
  showToast("تمت إضافة هذه المحاولة إلى سجل الأداء المحلي.");
}

function renderSavedRecords() {
  const wrapper = document.getElementById("savedRecordsTableWrapper");
  const records = getSavedRecords();

  if (records.length === 0) {
    wrapper.innerHTML = `
      <div class="text-center py-4 text-muted">
        <i class="bi bi-inbox fs-1 d-block mb-2"></i>
        لا توجد محاولات مسجلة بعد. أكمل أحد السيناريوهات الثلاثة ليتم توثيق الدرجات تلقائيًا.
      </div>
    `;
    return;
  }

  wrapper.innerHTML = `
    <div class="table-responsive">
      <table class="table table-sm table-hover table-bordered align-middle small text-center">
        <thead class="table-light">
          <tr>
            <th>#</th>
            <th>التاريخ والوقت</th>
            <th>الطالب / الرمز</th>
            <th>السيناريو</th>
            <th>تحديد المشكلة (2)</th>
            <th>تحليل الأسباب (2)</th>
            <th>اختيار الحلول (3)</th>
            <th>تبرير القرار (2)</th>
            <th>توقع النتائج (1)</th>
            <th class="table-success">مجموع حل المشكلات (10)</th>
            <th class="table-warning">الحس الجمالي المستقل (2)</th>
          </tr>
        </thead>
        <tbody>
          ${records
            .map(
              (r, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${r.timestamp}</td>
              <td class="fw-medium">${r.studentName}<br><span class="text-muted" style="font-size:0.7rem;">${r.studentGrade}</span></td>
              <td class="fw-bold text-emerald-dark">${r.scenarioTitle}</td>
              <td>${r.problemIdScore}</td>
              <td>${r.causesScore}</td>
              <td>${r.solutionsScore}</td>
              <td>${r.justificationScore}</td>
              <td>${r.predictionScore}</td>
              <td class="table-success fw-bold">${r.problemSolvingTotal} / 10</td>
              <td class="table-warning fw-bold">${r.aestheticScore} / 2</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function clearAllSavedRecords() {
  localStorage.removeItem("green_footprint_records_v1");
  updateRecordsBadgeCount();
  renderSavedRecords();
  showToast("تم مسح السجل المحلي.");
}

function exportRecordsJSON() {
  const records = getSavedRecords();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
  downloadDataUri(dataStr, `green_footprint_records_${Date.now()}.json`);
}

function exportSingleReportJSON() {
  const result = evaluatePlan();
  const report = {
    student: appState.studentProfile,
    evaluation: result,
    exportedAt: new Date().toISOString()
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
  downloadDataUri(dataStr, `green_footprint_${result.scenarioId}_report.json`);
}

function exportRecordsCSV() {
  const records = getSavedRecords();
  if (records.length === 0) {
    showToast("لا توجد سجلات لتصديرها.");
    return;
  }

  const headers = [
    "التاريخ",
    "الطالب",
    "الصف",
    "المجموعة",
    "السيناريو",
    "تحديد_المشكلة_2",
    "تحليل_الأسباب_2",
    "اختيار_الحلول_3",
    "تبرير_القرار_2",
    "توقع_النتائج_1",
    "مجموع_حل_المشكلات_10",
    "الحس_الجمالي_2",
    "التأمل_الجمالي_النصي"
  ];

  const rows = records.map((r) => [
    `"${r.timestamp}"`,
    `"${r.studentName}"`,
    `"${r.studentGrade}"`,
    `"${r.studentGroup}"`,
    `"${r.scenarioTitle}"`,
    r.problemIdScore,
    r.causesScore,
    r.solutionsScore,
    r.justificationScore,
    r.predictionScore,
    r.problemSolvingTotal,
    r.aestheticScore,
    `"${(r.aestheticFreeText || "").replace(/"/g, '""')}"`
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  downloadDataUri(url, `green_footprint_research_data_${Date.now()}.csv`);
}

function downloadDataUri(uri, filename) {
  const link = document.createElement("a");
  link.setAttribute("href", uri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function showToast(message) {
  const toastEl = document.getElementById("appToast");
  const toastBody = document.getElementById("appToastBody");
  if (!toastEl || !toastBody) return;
  toastBody.textContent = message;
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3000 });
  toast.show();
}

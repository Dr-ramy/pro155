/**
 * scoring-engine.js
 * محرك قياس وتحليل مهارات الأمن الفكري والوعي بالأحداث الجارية
 * يحلل أداء الطالب عبر أبعاد نموذج درايفر ومحاور البحث العلمي
 */

const ScoringEngine = {
  /**
   * توليد تقرير الجلسة التحليلي الشامل
   */
  generateSessionReport() {
    const isScores = AppState.scores.intellectualSecurity;
    const ceScores = AppState.scores.currentEvents;

    const isAvg = AppState.getIntellectualSecurityAverage();
    const ceAvg = AppState.getCurrentEventsAverage();
    const overallAvg = Math.round((isAvg + ceAvg) / 2);

    // تحديد أعلى وأقل مهارة
    const allMetrics = [
      { name: "التحقق من المعلومات", val: isScores.verification, cat: "الأمن الفكري", icon: "bi-search" },
      { name: "التمييز بين الحقيقة والرأي", val: isScores.factDistinction, cat: "الأمن الفكري", icon: "bi-tags" },
      { name: "التفكير النقدي في الأدلة", val: isScores.criticalThinking, cat: "الأمن الفكري", icon: "bi-clipboard2-check" },
      { name: "مقاومة الشائعات والتضليل", val: isScores.rumorResistance, cat: "الأمن الفكري", icon: "bi-shield-check" },
      { name: "الموضوعية وتعدد وجهات النظر", val: isScores.objectivity, cat: "الأمن الفكري", icon: "bi-arrow-left-right" },
      { name: "الحكم المستند للأدلة", val: isScores.evidenceJudgment, cat: "الأمن الفكري", icon: "bi-award" },
      { name: "الوعي المكاني", val: ceScores.spatial, cat: "الوعي بالأحداث", icon: "bi-geo-alt" },
      { name: "الوعي الزمني", val: ceScores.temporal, cat: "الوعي بالأحداث", icon: "bi-clock-history" },
      { name: "الوعي السببي", val: ceScores.causal, cat: "الوعي بالأحداث", icon: "bi-diagram-3" },
      { name: "الوعي بالنتائج والتداعيات", val: ceScores.impact, cat: "الوعي بالأحداث", icon: "bi-graph-up" }
    ];

    allMetrics.sort((a, b) => b.val - a.val);
    const strongestSkill = allMetrics[0];
    const needPracticeSkill = allMetrics[allMetrics.length - 1];

    // تحديد اللقب المعرفي المستحق
    let masteryTitle = "باحث جغرافي مفكر";
    if (overallAvg >= 90) masteryTitle = "خبير استقصائي ومحقق فكري متميز";
    else if (overallAvg >= 80) masteryTitle = "محلل جغرافي واعٍ ومحصن فكرياً";
    else if (overallAvg >= 70) masteryTitle = "باحث ناشئ في الجغرافيا والأحداث";

    return {
      isAvg,
      ceAvg,
      overallAvg,
      masteryTitle,
      strongestSkill,
      needPracticeSkill,
      isScores,
      ceScores,
      badges: AppState.badgesEarned.length > 0 ? AppState.badgesEarned : [
        { id: "default-explorer", name: "مستكشف الأدلة الجغرافية", icon: "bi-compass-fill" },
        { id: "default-thinker", name: "مفكر ناقد واعٍ", icon: "bi-patch-check-fill" }
      ]
    };
  }
};

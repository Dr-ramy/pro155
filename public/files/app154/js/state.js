/**
 * state.js
 * إدارة حالة التطبيق وجلسة التعلم التفاعلية (AppState)
 * بدون قاعدة بيانات - تعتمد على ذاكرة الجلسة (Session Storage & JavaScript Memory)
 */

const AppState = {
  // بيانات المسار الحالي
  currentUnitId: "unit-1",
  currentLessonId: "water-crisis",
  currentLessonData: null,
  currentStage: 1, // 1 to 5 (Driver Model)

  // مدخلات الطالب وتطور التفكير
  initialOpinion: null, // 1 to 5
  initialExplanation: null,
  
  // الاستكشاف ومختبر الأدلة
  evidenceViewed: [],
  evidenceClassifications: {},
  verificationLensChecks: {},
  verificationScore: 0,
  timelineOrder: [],
  classificationAnswers: {},
  hotspotsExplored: [],

  // الصراع المعرفي وإعادة البناء
  cognitiveConflictChoice: null, // 'keep' | 'modify' | 'need_more'
  bonusEvidenceUnlocked: false,
  claimEvidenceMatches: {},
  causeEffectAnswers: {},

  // غرفة القرار والتطبيق
  decisionRoomChoices: [],
  finalClaim: null,
  finalEvidence: null,

  // مرآة التفكير
  finalOpinion: null,
  thinkingShiftReasons: [],

  // لوحة القياس المعرفي والأداء
  scores: {
    intellectualSecurity: {
      verification: 85,       // التحقق من المعلومات
      factDistinction: 80,    // التمييز بين الحقيقة والرأي
      criticalThinking: 75,   // التفكير النقدي في الأدلة
      rumorResistance: 90,    // مقاومة الشائعات والتضليل
      objectivity: 80,        // الموضوعية وتعدد وجهات النظر
      evidenceJudgment: 85    // إصدار الحكم المستند للأدلة
    },
    currentEvents: {
      spatial: 90,            // الوعي المكاني
      temporal: 85,           // الوعي الزمني
      causal: 80,             // الوعي السببي
      actors: 75,             // الوعي بالأطراف
      impact: 85,             // الوعي بالتداعيات
      context: 80             // الوعي بالسياق العام
    }
  },

  badgesEarned: [],

  /**
   * تهيئة الحالة من الجلسة أو بدء جلسة جديدة
   */
  init(lessonData) {
    this.currentLessonData = lessonData;
    this.currentLessonId = lessonData ? lessonData.id : "water-crisis";
    this.currentUnitId = lessonData ? lessonData.unitId : "unit-1";

    const saved = sessionStorage.getItem(`app154_state_${this.currentLessonId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.assign(this, parsed);
        this.currentLessonData = lessonData; // ضمان وجود الكائن الكامل
      } catch (e) {
        console.error("Error restoring session state", e);
      }
    } else {
      this.reset();
      this.currentLessonData = lessonData;
      this.save();
    }
  },

  /**
   * حفظ الحالة الحالية في sessionStorage
   */
  save() {
    try {
      const copy = { ...this };
      delete copy.currentLessonData; // لا نحفظ المحتوى الضخم لتفادي حدود الحجم
      sessionStorage.setItem(`app154_state_${this.currentLessonId}`, JSON.stringify(copy));
    } catch (e) {
      console.warn("Could not save to sessionStorage", e);
    }
  },

  /**
   * إعادة ضبط الجلسة للنشاط الحالي
   */
  reset() {
    this.currentStage = 1;
    this.initialOpinion = null;
    this.initialExplanation = null;
    this.evidenceViewed = [];
    this.evidenceClassifications = {};
    this.verificationLensChecks = {};
    this.verificationScore = 0;
    this.timelineOrder = [];
    this.classificationAnswers = {};
    this.hotspotsExplored = [];
    this.cognitiveConflictChoice = null;
    this.bonusEvidenceUnlocked = false;
    this.claimEvidenceMatches = {};
    this.causeEffectAnswers = {};
    this.decisionRoomChoices = [];
    this.finalClaim = null;
    this.finalEvidence = null;
    this.finalOpinion = null;
    this.thinkingShiftReasons = [];
    this.badgesEarned = [];
  },

  /**
   * تسجيل رأي أولي
   */
  setInitialOpinion(val) {
    this.initialOpinion = parseInt(val, 10);
    this.save();
  },

  /**
   * تسجيل فتح دليل في مختبر الأدلة
   */
  markEvidenceViewed(evId) {
    if (!this.evidenceViewed.includes(evId)) {
      this.evidenceViewed.push(evId);
      this.updateScore("intellectualSecurity", "criticalThinking", 5);
      this.save();
    }
  },

  /**
   * تسجيل استكشاف نقطة في الخريطة التفاعلية
   */
  markHotspotExplored(spotId) {
    if (!this.hotspotsExplored.includes(spotId)) {
      this.hotspotsExplored.push(spotId);
      this.updateScore("currentEvents", "spatial", 8);
      this.save();
    }
  },

  /**
   * تحديث فحص في عدسة التحقق
   */
  toggleVerificationCheck(checkId, isChecked) {
    this.verificationLensChecks[checkId] = isChecked;
    const totalChecks = Object.keys(this.verificationLensChecks).length;
    const checkedCount = Object.values(this.verificationLensChecks).filter(Boolean).length;
    this.verificationScore = Math.round((checkedCount / (totalChecks || 5)) * 100);
    this.updateScore("intellectualSecurity", "verification", isChecked ? 6 : -4);
    this.save();
  },

  /**
   * تحديث مقاييس النقاط مع حدود 0 - 100
   */
  updateScore(category, metric, delta) {
    if (this.scores[category] && typeof this.scores[category][metric] !== 'undefined') {
      let val = this.scores[category][metric] + delta;
      val = Math.max(20, Math.min(100, val));
      this.scores[category][metric] = val;
    }
  },

  /**
   * منح وسام جديد
   */
  addBadge(badge) {
    if (!this.badgesEarned.some(b => b.id === badge.id)) {
      this.badgesEarned.push(badge);
      this.save();
    }
  },

  /**
   * حساب متوسط الأمن الفكري
   */
  getIntellectualSecurityAverage() {
    const vals = Object.values(this.scores.intellectualSecurity);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  },

  /**
   * حساب متوسط الوعي بالأحداث الجارية
   */
  getCurrentEventsAverage() {
    const vals = Object.values(this.scores.currentEvents);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }
};

/**
 * driver-engine.js
 * محرك نموذج درايفر للتعلم البنائي (Driver's Model Engine)
 * يدير مراحل الرحلة الخمس، شريط التقدم، والانتقال السلس بين المراحل
 */

const DriverEngine = {
  stagesConfig: [
    { id: 1, name: "استثارة الأفكار", en: "Elicitation", icon: "bi-lightbulb", badge: "badge-elicitation" },
    { id: 2, name: "استكشاف الأدلة", en: "Exploration", icon: "bi-search", badge: "badge-exploration" },
    { id: 3, name: "إعادة البناء", en: "Restructuring", icon: "bi-diagram-3", badge: "badge-restructuring" },
    { id: 4, name: "تطبيق الفهم", en: "Application", icon: "bi-cpu", badge: "badge-application" },
    { id: 5, name: "مرآة التفكير", en: "Review", icon: "bi-arrow-left-right", badge: "badge-review" }
  ],

  currentStage: 1,
  lessonData: null,

  init(lessonData) {
    this.lessonData = lessonData;
    this.currentStage = AppState.currentStage || 1;
    this.renderStepper();
    this.loadStage(this.currentStage);
  },

  renderStepper() {
    const stepperContainer = document.getElementById("driverStepper");
    if (!stepperContainer) return;

    let html = `
      <div class="driver-stepper-progress" id="stepperProgressBar" style="width: ${((this.currentStage - 1) / 4) * 100}%;"></div>
    `;

    this.stagesConfig.forEach((stage) => {
      const isCompleted = stage.id < this.currentStage;
      const isActive = stage.id === this.currentStage;
      const stateClass = isCompleted ? "completed" : isActive ? "active" : "";

      html += `
        <button class="step-node ${stateClass}" onclick="DriverEngine.goToStage(${stage.id})" title="${stage.name}">
          <div class="step-circle">
            ${isCompleted ? '<i class="bi bi-check-lg"></i>' : `<i class="bi ${stage.icon}"></i>`}
          </div>
          <span class="step-label">${stage.id}. ${stage.name}</span>
        </button>
      `;
    });

    stepperContainer.innerHTML = html;
  },

  updateStepper() {
    const progressFill = document.getElementById("stepperProgressBar");
    if (progressFill) {
      progressFill.style.width = `${((this.currentStage - 1) / 4) * 100}%`;
    }

    const stepNodes = document.querySelectorAll(".step-node");
    stepNodes.forEach((node, index) => {
      const stageId = index + 1;
      node.classList.remove("active", "completed");
      if (stageId < this.currentStage) {
        node.classList.add("completed");
        node.querySelector(".step-circle").innerHTML = '<i class="bi bi-check-lg"></i>';
      } else if (stageId === this.currentStage) {
        node.classList.add("active");
        node.querySelector(".step-circle").innerHTML = `<i class="bi ${this.stagesConfig[index].icon}"></i>`;
      } else {
        node.querySelector(".step-circle").innerHTML = `<i class="bi ${this.stagesConfig[index].icon}"></i>`;
      }
    });
  },

  goToStage(stageNumber) {
    if (stageNumber < 1 || stageNumber > 5) return;
    
    // منع القفز المباشر للأمام بدون المرور بالأنشطة السابقة إذا لم تكتمل
    if (stageNumber > this.currentStage + 1) {
      alert("يرجى إكمال المرحلة الحالية أولاً قبل الانتقال للمراحل اللاحقة.");
      return;
    }

    this.currentStage = stageNumber;
    AppState.currentStage = stageNumber;
    AppState.save();
    this.updateStepper();
    this.loadStage(this.currentStage);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  nextStage() {
    if (this.currentStage < 5) {
      this.goToStage(this.currentStage + 1);
    } else {
      // الانتقال للنتائج النهائية
      window.location.href = `results.html?lesson=${AppState.currentLessonId}`;
    }
  },

  prevStage() {
    if (this.currentStage > 1) {
      this.goToStage(this.currentStage - 1);
    }
  },

  loadStage(stageNumber) {
    const stageContent = document.getElementById("stageContainer");
    if (!stageContent || !this.lessonData) return;

    stageContent.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted">جاري تحميل المرحلة ${stageNumber}...</p>
      </div>
    `;

    setTimeout(() => {
      switch (stageNumber) {
        case 1:
          ActivityEngine.renderStage1(this.lessonData.stage1);
          break;
        case 2:
          ActivityEngine.renderStage2(this.lessonData.stage2);
          break;
        case 3:
          ActivityEngine.renderStage3(this.lessonData.stage3);
          break;
        case 4:
          ActivityEngine.renderStage4(this.lessonData.stage4);
          break;
        case 5:
          ActivityEngine.renderStage5(this.lessonData.stage5);
          break;
        default:
          break;
      }
    }, 150);
  }
};

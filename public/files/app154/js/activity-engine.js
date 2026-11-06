/**
 * activity-engine.js
 * محرك الأنشطة التفاعلية (Interactive Activities Engine)
 * مسؤول عن تقديم الأنشطة، التفاعل مع الطالب، التحقق، والتغذية الراجعة
 */

const ActivityEngine = {
  // حالة مختارة مؤقتة للأنشطة القائمة على اللمس
  selectedTapItem: null,

  /**
   * ------------------------------------------------------------------------
   * المرحلة 1: التهيئة واستثارة الأفكار السابقة
   * ------------------------------------------------------------------------
   */
  renderStage1(data) {
    const container = document.getElementById("stageContainer");
    if (!container) return;

    const savedOpinion = AppState.initialOpinion || 3;

    let html = `
      <div class="app-card animate-fade-in">
        <div class="app-card-header">
          <div>
            <span class="stage-badge ${data.badgeClass}"><i class="bi ${data.icon}"></i> المرحلة الأولى: ${data.stageName}</span>
            <h3 class="mt-2 mb-1 fw-bold">${data.scenario.headline}</h3>
          </div>
          <span class="text-muted small"><i class="bi bi-clock"></i> 5-7 دقائق</span>
        </div>

        <!-- الموقف المحفز -->
        <div class="mb-4">
          ${data.scenario.mediaContent}
          <div class="p-3 bg-light rounded-3 border mt-3">
            <h6 class="fw-bold text-dark"><i class="bi bi-question-circle-fill text-primary"></i> ${data.scenario.prompt}</h6>
            <p class="text-muted small mb-3">حدد أول تساؤل تشعر بالحاجة لاستكشافه:</p>
            <div class="row g-2">
              ${data.scenario.initialQuestions.map(q => `
                <div class="col-md-6">
                  <div class="p-2 border rounded bg-white d-flex align-items-center gap-2">
                    <input class="form-check-input" type="radio" name="initQuestion" id="${q.id}" ${q.id === 'q1' ? 'checked' : ''}>
                    <label class="form-check-label small fw-semibold" for="${q.id}">${q.text}</label>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- مقياس الموقف الأولي -->
        <div class="opinion-scale-wrapper">
          <h5 class="fw-bold text-dark text-center mb-1"><i class="bi bi-sliders text-primary"></i> ${data.opinionScale.question}</h5>
          <p class="text-muted small text-center">لا توجد إجابة صحيحة أو خاطئة هنا؛ نحن نسجل تقديرك الأولي فقط لنقارنه لاحقاً.</p>

          <div class="opinion-scale-points">
            ${data.opinionScale.options.map(opt => `
              <button type="button" class="opinion-btn ${savedOpinion === opt.value ? 'selected' : ''}" onclick="ActivityEngine.selectOpinion(${opt.value})">
                <div class="opinion-circle">${opt.value}</div>
                <span class="opinion-label">${opt.label}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- التفسير الأولي -->
        <div class="mb-4">
          <h6 class="fw-bold text-dark mb-2"><i class="bi bi-chat-dots-fill text-primary"></i> ${data.initialExplanation.question}</h6>
          <div class="list-group">
            ${data.initialExplanation.options.map((opt, idx) => `
              <label class="list-group-item list-group-item-action d-flex align-items-center gap-3 p-3">
                <input class="form-check-input flex-shrink-0" type="radio" name="initialExplanation" value="${opt.id}" ${idx === 0 ? 'checked' : ''} onchange="AppState.initialExplanation = '${opt.id}'; AppState.save();">
                <span class="small fw-semibold text-slate">${opt.text}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center pt-3 border-top">
          <span class="text-muted small"><i class="bi bi-info-circle"></i> سيتم حفظ تقديرك الأولي لمقارنته في مرآة التفكير.</span>
          <button class="btn btn-app-primary" onclick="ActivityEngine.submitStage1()">
            <span>ابدأ الاستكشاف وفحص الأدلة</span>
            <i class="bi bi-arrow-left"></i>
          </button>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  selectOpinion(val) {
    AppState.setInitialOpinion(val);
    const buttons = document.querySelectorAll(".opinion-btn");
    buttons.forEach((btn, idx) => {
      btn.classList.toggle("selected", idx + 1 === val);
    });
  },

  submitStage1() {
    if (!AppState.initialOpinion) {
      AppState.setInitialOpinion(3);
    }
    DriverEngine.nextStage();
  },

  /**
   * ------------------------------------------------------------------------
   * المرحلة 2: استكشاف الأفكار والأدلة
   * ------------------------------------------------------------------------
   */
  renderStage2(data) {
    const container = document.getElementById("stageContainer");
    if (!container) return;

    let html = `
      <div class="app-card animate-fade-in">
        <div class="app-card-header">
          <div>
            <span class="stage-badge ${data.badgeClass}"><i class="bi ${data.icon}"></i> المرحلة الثانية: ${data.stageName}</span>
            <h3 class="mt-2 mb-1 fw-bold">مختبر الأدلة وأدوات الاستقصاء الجغرافي</h3>
          </div>
          <button class="btn btn-sm btn-outline-warning fw-bold d-flex align-items-center gap-1" onclick="ActivityEngine.openVerificationLensModal()">
            <i class="bi bi-search"></i>
            <span>عدسة التحقق (${AppState.verificationScore}%)</span>
          </button>
        </div>

        <p class="text-muted small mb-4">${data.instruction}</p>

        <!-- تبويبات أدوات الاستكشاف -->
        <ul class="nav nav-pills nav-fill mb-4 bg-light p-1 rounded-3" id="explorationTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active fw-bold small" id="tab-evidence-btn" data-bs-toggle="pill" data-bs-target="#tab-evidence" type="button" role="tab">
              <i class="bi bi-folder-check"></i> 1. مختبر الأدلة (${AppState.evidenceViewed.length}/${data.evidenceItems.length})
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link fw-bold small" id="tab-map-btn" data-bs-toggle="pill" data-bs-target="#tab-map" type="button" role="tab">
              <i class="bi bi-map"></i> 2. خريطة الحدث
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link fw-bold small" id="tab-timeline-btn" data-bs-toggle="pill" data-bs-target="#tab-timeline" type="button" role="tab">
              <i class="bi bi-clock-history"></i> 3. خط الزمن
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link fw-bold small" id="tab-classify-btn" data-bs-toggle="pill" data-bs-target="#tab-classify" type="button" role="tab">
              <i class="bi bi-tags"></i> 4. تصنيف المعلومات
            </button>
          </li>
        </ul>

        <div class="tab-content" id="explorationTabsContent">
          <!-- 1. مختبر الأدلة -->
          <div class="tab-pane fade show active" id="tab-evidence" role="tabpanel">
            <h5 class="fw-bold text-dark mb-2"><i class="bi bi-collection-fill text-primary"></i> بطاقات الأدلة المتوفرة</h5>
            <p class="text-muted small mb-3">اضغط على كل بطاقة لقراءة الدليل، تصنيفه، وفحص مصدره:</p>

            <div class="evidence-grid">
              ${data.evidenceItems.map(ev => {
                const isViewed = AppState.evidenceViewed.includes(ev.id);
                const typeClass = ev.type === 'official' ? 'type-official' :
                                  ev.type === 'satellite' ? 'type-satellite' :
                                  ev.type === 'statistic' ? 'type-statistic' : 'type-social';
                return `
                  <div class="evidence-card ${isViewed ? 'inspected' : ''}" onclick="ActivityEngine.openEvidenceModal('${ev.id}')">
                    <div>
                      <span class="evidence-type-badge ${typeClass}"><i class="bi ${ev.icon}"></i> ${ev.typeName}</span>
                      <h6 class="evidence-title">${ev.title}</h6>
                      <p class="text-muted small">${ev.preview}</p>
                    </div>
                    <div class="evidence-status-pill">
                      ${isViewed ? '<i class="bi bi-check-circle-fill text-success"></i> تم الفحص والتحليل' : '<i class="bi bi-eye"></i> اضغط للفحص'}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 2. خريطة الحدث التفاعلية -->
          <div class="tab-pane fade" id="tab-map" role="tabpanel">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="fw-bold text-dark mb-0"><i class="bi bi-geo-alt-fill text-danger"></i> ${data.eventMap.title}</h5>
              <span class="badge bg-secondary small">${data.eventMap.subtitle}</span>
            </div>
            
            <div class="map-container">
              <div class="map-svg-wrapper" id="iraqMapWrapper">
                <!-- رسم خريطة العراق التفاعلية SVG -->
                <svg viewBox="0 0 800 650" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <!-- خلفية تضاريس العراق المبسطة -->
                  <defs>
                    <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#38bdf8"/>
                      <stop offset="100%" stop-color="#0284c7"/>
                    </linearGradient>
                    <linearGradient id="marshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#34d399"/>
                      <stop offset="100%" stop-color="#059669"/>
                    </linearGradient>
                  </defs>

                  <!-- حدود تقريبية للعراق -->
                  <path d="M 220 70 L 450 60 L 520 130 L 620 220 L 670 340 L 690 470 L 670 540 L 580 570 L 500 520 L 380 530 L 250 490 L 160 360 L 150 220 Z" 
                        fill="#f8fafc" stroke="#cbd5e1" stroke-width="3" />

                  <!-- مسار نهر دجلة -->
                  <path d="M 330 65 Q 400 130 430 180 T 480 320 T 540 430 T 630 520" 
                        fill="none" stroke="url(#riverGrad)" stroke-width="5" stroke-linecap="round"/>
                  <text x="350" y="110" font-size="12" fill="#0284c7" font-weight="bold">نهر دجلة</text>

                  <!-- مسار نهر الفرات -->
                  <path d="M 180 200 Q 280 260 350 340 T 460 440 T 570 515 T 630 520" 
                        fill="none" stroke="url(#riverGrad)" stroke-width="4.5" stroke-linecap="round"/>
                  <text x="210" y="240" font-size="12" fill="#0284c7" font-weight="bold">نهر الفرات</text>

                  <!-- منطقة الأهوار وشط العرب -->
                  <ellipse cx="610" cy="510" rx="45" ry="25" fill="url(#marshGrad)" opacity="0.6"/>
                  <text x="580" y="515" font-size="11" fill="#065f46" font-weight="bold">الأهوار العراقية</text>

                  <!-- مسار شط العرب والخليج -->
                  <path d="M 630 520 L 665 560" stroke="#0369a1" stroke-width="6" stroke-linecap="round"/>
                  <text x="645" y="580" font-size="11" fill="#0369a1" font-weight="bold">شط العرب / الخليج</text>

                  <!-- نقاط Hotspots التفاعلية -->
                  ${data.eventMap.hotspots.map((spot, idx) => {
                    const coordsMap = {
                      'spot-marshes': { cx: 610, cy: 505 },
                      'spot-mosul-dam': { cx: 370, cy: 130 },
                      'spot-haditha-dam': { cx: 310, cy: 280 },
                      'spot-shatt-alarab': { cx: 650, cy: 545 },
                      'spot-baghdad': { cx: 485, cy: 340 },
                      'spot-faw': { cx: 670, cy: 565 },
                      'spot-nasiriyah-samawa': { cx: 560, cy: 470 },
                      'spot-baghdad-hub': { cx: 485, cy: 340 },
                      'spot-mosul-hub': { cx: 380, cy: 150 },
                      'spot-fishkhabur': { cx: 320, cy: 80 }
                    };
                    const coord = coordsMap[spot.id] || { cx: 480, cy: 330 };
                    const cx = coord.cx;
                    const cy = coord.cy;

                    return `
                      <g class="map-hotspot" onclick="ActivityEngine.showHotspotDetails('${spot.id}')">
                        <circle cx="${cx}" cy="${cy}" r="16" fill="rgba(239, 68, 68, 0.25)" class="map-pin-pulse"/>
                        <circle cx="${cx}" cy="${cy}" r="9" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
                        <text x="${cx + 12}" y="${cy + 4}" font-size="12" font-weight="bold" fill="#1e293b">${spot.name.split(' ')[0]}</text>
                      </g>
                    `;
                  }).join('')}
                </svg>
              </div>

              <!-- بطاقة تفاصيل النقطة المحددة -->
              <div class="map-details-card" id="mapDetailsCard">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 class="fw-bold text-primary mb-1" id="spotTitle"><i class="bi bi-geo-alt"></i> اضغط على إحدى النقاط الحمراء على الخريطة</h6>
                    <p class="small text-muted mb-0" id="spotText">استكشف الأبعاد المكانية وتأثير الجغرافيا على الحدث الجاري.</p>
                  </div>
                  <span class="badge bg-primary" id="spotProvince">جغرافيا العراق</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. خط الزمن التفاعلي -->
          <div class="tab-pane fade" id="tab-timeline" role="tabpanel">
            <h5 class="fw-bold text-dark mb-1"><i class="bi bi-clock-history text-primary"></i> ترتيب التسلسل الزمني للأحداث</h5>
            <p class="text-muted small mb-3">${data.timeline.instruction}</p>

            <div class="timeline-track" id="timelineTrack">
              ${data.timeline.items.map((item, idx) => `
                <div class="timeline-card" id="tl-${item.id}" data-id="${item.id}" data-order="${item.order}">
                  <div class="timeline-order-badge">${idx + 1}</div>
                  <div class="flex-grow-1">
                    <p class="mb-0 fw-semibold text-slate small">${item.title}</p>
                  </div>
                  <div class="d-flex flex-column gap-1">
                    <button class="btn btn-sm btn-light border py-0 px-2" onclick="ActivityEngine.moveTimelineItem('${item.id}', -1)" title="تحريك لأعلى"><i class="bi bi-chevron-up"></i></button>
                    <button class="btn btn-sm btn-light border py-0 px-2" onclick="ActivityEngine.moveTimelineItem('${item.id}', 1)" title="تحريك لأسفل"><i class="bi bi-chevron-down"></i></button>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="text-center mt-3">
              <button class="btn btn-app-primary btn-sm" onclick="ActivityEngine.checkTimelineOrder()">
                <i class="bi bi-check2-circle"></i> تحقق من الترتيب الزمني
              </button>
              <div id="timelineFeedback"></div>
            </div>
          </div>

          <!-- 4. تصنيف المعلومات (حقيقة / رأي / ادعاء) -->
          <div class="tab-pane fade" id="tab-classify" role="tabpanel">
            <h5 class="fw-bold text-dark mb-1"><i class="bi bi-tags-fill text-primary"></i> التمييز بين الحقيقة والرأي والادعاء</h5>
            <p class="text-muted small mb-3">${data.classificationActivity.instruction}</p>

            <div class="classification-pool" id="classificationPool">
              ${data.classificationActivity.items.map(item => `
                <div class="draggable-item" id="${item.id}" data-target="${item.target}" onclick="ActivityEngine.handleTapItem('${item.id}')">
                  <i class="bi bi-grip-vertical text-muted"></i>
                  <span>${item.text}</span>
                </div>
              `).join('')}
            </div>

            <div class="drop-zones-grid">
              ${data.classificationActivity.categories.map(cat => `
                <div class="drop-zone ${cat.id}" id="zone-${cat.id}" data-category="${cat.id}" onclick="ActivityEngine.handleTapZone('${cat.id}')">
                  <div class="drop-zone-header">
                    <span class="badge ${cat.badge} p-1"><i class="bi bi-check-circle"></i></span>
                    <span>${cat.label}</span>
                  </div>
                  <div class="drop-zone-items" id="items-${cat.id}"></div>
                </div>
              `).join('')}
            </div>

            <div class="text-center mt-3">
              <button class="btn btn-app-success btn-sm" onclick="ActivityEngine.checkClassification()">
                <i class="bi bi-check-all"></i> تقييم التصنيف
              </button>
              <div id="classifyFeedback"></div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center pt-4 border-top mt-4">
          <button class="btn btn-app-outline" onclick="DriverEngine.prevStage()">
            <i class="bi bi-arrow-right"></i> السابق
          </button>
          <button class="btn btn-app-primary" onclick="DriverEngine.nextStage()">
            <span>الانتقال للمرحلة الثالثة: الصراع المعرفي</span>
            <i class="bi bi-arrow-left"></i>
          </button>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  showHotspotDetails(spotId) {
    const lesson = AppState.currentLessonData;
    if (!lesson || !lesson.stage2.eventMap) return;

    const spot = lesson.stage2.eventMap.hotspots.find(s => s.id === spotId);
    if (!spot) return;

    AppState.markHotspotExplored(spotId);

    const titleEl = document.getElementById("spotTitle");
    const textEl = document.getElementById("spotText");
    const provEl = document.getElementById("spotProvince");

    if (titleEl && textEl && provEl) {
      titleEl.innerHTML = `<i class="bi bi-geo-alt-fill text-danger"></i> ${spot.name}`;
      textEl.innerHTML = `<strong>الحدث:</strong> ${spot.event}<br><strong>الدليل:</strong> ${spot.evidence}<br><strong>الأهمية الجغرافية:</strong> ${spot.importance}`;
      provEl.innerText = spot.province;
    }
  },

  openEvidenceModal(evId) {
    const lesson = AppState.currentLessonData;
    if (!lesson) return;

    const ev = lesson.stage2.evidenceItems.find(e => e.id === evId);
    if (!ev) return;

    AppState.markEvidenceViewed(evId);

    const modalHtml = `
      <div class="modal fade" id="evidenceModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h6 class="modal-title fw-bold"><i class="bi ${ev.icon}"></i> ${ev.title}</h6>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
              <span class="badge bg-light text-dark border mb-2">${ev.typeName}</span>
              ${ev.fullContent}
              
              <div class="p-3 bg-primary-soft rounded-3 border mt-3">
                <h6 class="fw-bold text-primary mb-1"><i class="bi bi-chat-square-text"></i> وقفة تفكير نقدي:</h6>
                <p class="small text-slate mb-2">${ev.reflectionPrompt}</p>
                <div class="d-flex gap-2 flex-wrap">
                  <button class="btn btn-sm btn-outline-success" onclick="ActivityEngine.classifyEvidence('${ev.id}', 'fact')">أصنفه: حقيقة مؤكدة</button>
                  <button class="btn btn-sm btn-outline-warning" onclick="ActivityEngine.classifyEvidence('${ev.id}', 'opinion')">أصنفه: رأي شخصي</button>
                  <button class="btn btn-sm btn-outline-danger" onclick="ActivityEngine.classifyEvidence('${ev.id}', 'claim')">أصنفه: ادعاء يحتاج تثبت</button>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-app-primary btn-sm" data-bs-dismiss="modal">تم الفحص والمتابعة</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // إزالة أي مودال سابق وإضافة الجديد
    const existing = document.getElementById("evidenceModal");
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('evidenceModal'));
    modal.show();

    // تحديث بطاقة الدليل بصرياً
    DriverEngine.loadStage(2);
  },

  classifyEvidence(evId, type) {
    AppState.evidenceClassifications[evId] = type;
    AppState.updateScore("intellectualSecurity", "factDistinction", 5);
    AppState.save();
    alert("تم تسجيل تصنيفك لهذا الدليل بنجاح!");
  },

  openVerificationLensModal() {
    const lesson = AppState.currentLessonData;
    if (!lesson) return;

    const lens = lesson.stage2.verificationLens;

    const modalHtml = `
      <div class="modal fade" id="verificationLensModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content lens-modal-content">
            <div class="modal-header bg-dark text-white">
              <h6 class="modal-title fw-bold"><i class="bi bi-search text-warning"></i> ${lens.headline}</h6>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
              <div class="lens-gauge-box">
                <div class="gauge-percentage" id="modalLensGauge">${AppState.verificationScore}%</div>
                <div class="gauge-label">مؤشر التحقق من الخبر الميداني</div>
              </div>

              <div class="p-3 bg-light rounded-3 mb-3 border">
                <span class="badge bg-danger mb-1">المادة المفحوصة</span>
                <p class="small fw-bold mb-0 text-slate">${lens.targetTitle}</p>
              </div>

              <ul class="verification-checklist">
                ${lens.checklist.map(item => {
                  const isChecked = !!AppState.verificationLensChecks[item.id];
                  return `
                    <li class="verification-item ${isChecked ? 'checked' : ''}" onclick="ActivityEngine.toggleLensItem('${item.id}')">
                      <input type="checkbox" id="chk-${item.id}" ${isChecked ? 'checked' : ''}>
                      <label for="chk-${item.id}" class="small fw-semibold mb-0 cursor-pointer">${item.label}</label>
                    </li>
                  `;
                }).join('')}
              </ul>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-app-success btn-sm" data-bs-dismiss="modal">حفظ نتيجة التحقق</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const existing = document.getElementById("verificationLensModal");
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('verificationLensModal'));
    modal.show();
  },

  toggleLensItem(checkId) {
    const current = !!AppState.verificationLensChecks[checkId];
    AppState.toggleVerificationCheck(checkId, !current);

    const gaugeEl = document.getElementById("modalLensGauge");
    if (gaugeEl) gaugeEl.innerText = `${AppState.verificationScore}%`;

    const itemEl = document.querySelector(`#chk-${checkId}`)?.closest('.verification-item');
    if (itemEl) {
      itemEl.classList.toggle('checked', !current);
      const chk = itemEl.querySelector('input');
      if (chk) chk.checked = !current;
    }
  },

  moveTimelineItem(itemId, direction) {
    const track = document.getElementById("timelineTrack");
    if (!track) return;

    const cards = Array.from(track.querySelectorAll(".timeline-card"));
    const currentIndex = cards.findIndex(c => c.dataset.id === itemId);
    const targetIndex = currentIndex + direction;

    if (targetIndex >= 0 && targetIndex < cards.length) {
      if (direction > 0) {
        track.insertBefore(cards[targetIndex], cards[currentIndex]);
      } else {
        track.insertBefore(cards[currentIndex], cards[targetIndex]);
      }

      // تحديث شارات الترقيم
      const updatedCards = track.querySelectorAll(".timeline-card");
      updatedCards.forEach((c, idx) => {
        c.querySelector(".timeline-order-badge").innerText = idx + 1;
      });
    }
  },

  checkTimelineOrder() {
    const track = document.getElementById("timelineTrack");
    if (!track) return;

    const cards = Array.from(track.querySelectorAll(".timeline-card"));
    let isCorrect = true;

    cards.forEach((card, index) => {
      const correctOrder = parseInt(card.dataset.order, 10);
      if (correctOrder === index + 1) {
        card.classList.add("correct");
      } else {
        card.classList.remove("correct");
        isCorrect = false;
      }
    });

    const fb = document.getElementById("timelineFeedback");
    if (isCorrect) {
      AppState.updateScore("currentEvents", "temporal", 15);
      AppState.addBadge({ id: "chronology-master", name: "محقق التسلسل الزمني", icon: "bi-clock-fill" });
      fb.innerHTML = `
        <div class="feedback-box success mt-2">
          <i class="bi bi-check-circle-fill feedback-icon"></i>
          <div>
            <strong>أحسنت ترتيب التسلسل الزمني!</strong>
            <p class="mb-0 small">فهمك لتتابع الأحداث من انحباس الأمطار وصولاً إلى الردود الرسمية يعكس وعياً زمنياً رصيناً.</p>
          </div>
        </div>
      `;
    } else {
      fb.innerHTML = `
        <div class="feedback-box hint mt-2">
          <i class="bi bi-lightbulb-fill feedback-icon"></i>
          <div>
            <strong>راجع الترتيب الزمني:</strong>
            <p class="mb-0 small">تذكر أن العامل المناخي الطبيعي (قلة الأمطار) يسبق دائماً انخفاض المناسيب والشائعات المتداولة.</p>
          </div>
        </div>
      `;
    }
  },

  handleTapItem(itemId) {
    const el = document.getElementById(itemId);
    if (!el) return;

    document.querySelectorAll(".draggable-item").forEach(i => i.classList.remove("selected-tap"));
    el.classList.add("selected-tap");
    this.selectedTapItem = itemId;
  },

  handleTapZone(zoneId) {
    if (!this.selectedTapItem) return;

    const itemEl = document.getElementById(this.selectedTapItem);
    const targetZone = document.getElementById(`items-${zoneId}`);
    if (itemEl && targetZone) {
      targetZone.appendChild(itemEl);
      itemEl.classList.remove("selected-tap");
      this.selectedTapItem = null;
    }
  },

  checkClassification() {
    const lesson = AppState.currentLessonData;
    if (!lesson) return;

    let correctCount = 0;
    const total = lesson.stage2.classificationActivity.items.length;

    lesson.stage2.classificationActivity.items.forEach(item => {
      const el = document.getElementById(item.id);
      if (el && el.parentElement.id === `items-${item.target}`) {
        correctCount++;
        el.style.borderColor = "#10b981";
        el.style.background = "#ecfdf5";
      } else if (el) {
        el.style.borderColor = "#ef4444";
      }
    });

    const fb = document.getElementById("classifyFeedback");
    if (correctCount === total) {
      AppState.updateScore("intellectualSecurity", "factDistinction", 15);
      AppState.addBadge({ id: "fact-checker", name: "كاشف الادعاءات", icon: "bi-patch-check-fill" });
      fb.innerHTML = `
        <div class="feedback-box success mt-2">
          <i class="bi bi-check-circle-fill feedback-icon"></i>
          <div>
            <strong>تصنيف دقيق ومكتمل (${correctCount}/${total})!</strong>
            <p class="mb-0 small">استطعت التمييز بين الحقائق المثبتة، والآراء الذاتية، والادعاءات غير الموثقة بنجاح باهر.</p>
          </div>
        </div>
      `;
    } else {
      fb.innerHTML = `
        <div class="feedback-box hint mt-2">
          <i class="bi bi-info-circle-fill feedback-icon"></i>
          <div>
            <strong>حصلت على (${correctCount}/${total}) بطاقة صحيحة:</strong>
            <p class="mb-0 small">راجع البطاقات المحددة بالأحمر: هل تتضمن دليلاً يمكن قياسه أم تعبر عن انطباع شخصي؟</p>
          </div>
        </div>
      `;
    }
  },

  /**
   * ------------------------------------------------------------------------
   * المرحلة 3: إعادة بناء الأفكار والصراع المعرفي
   * ------------------------------------------------------------------------
   */
  renderStage3(data) {
    const container = document.getElementById("stageContainer");
    if (!container) return;

    const initialOp = AppState.initialOpinion || 3;
    const opText = initialOp >= 4 ? "كنت تميل لتصديق المنشور المتداول" :
                   initialOp <= 2 ? "كنت تشكك في صحة المنشور" : "كنت متردداً وغير متأكد";

    let html = `
      <div class="app-card animate-fade-in">
        <div class="app-card-header">
          <div>
            <span class="stage-badge ${data.badgeClass}"><i class="bi ${data.icon}"></i> المرحلة الثالثة: ${data.stageName}</span>
            <h3 class="mt-2 mb-1 fw-bold">الصراع المعرفي وإعادة بناء الفهم</h3>
          </div>
        </div>

        <!-- شاشة الصراع المعرفي المباشر -->
        <div class="conflict-split-view">
          <div class="conflict-card initial-belief">
            <h6 class="fw-bold text-warning-emphasis mb-2"><i class="bi bi-clock-history"></i> فكرتك الأولى المسجلة:</h6>
            <div class="d-flex align-items-center gap-3 mb-2">
              <span class="badge bg-warning text-dark fs-5">${initialOp} / 5</span>
              <span class="fw-bold text-dark">${opText}</span>
            </div>
            <p class="small text-muted mb-0">سجلت هذا الموقف قبل أن تطلع على التحاليل المختبرية والبيانات الجغرافية لوزارة الموارد المائية وصور الأقمار الصناعية.</p>
          </div>

          <div class="conflict-card evidence-findings">
            <h6 class="fw-bold text-primary mb-2"><i class="bi bi-clipboard2-check"></i> ما أثبتته الأدلة العلمية:</h6>
            <ul class="small text-slate mb-0 ps-3">
              <li>المياه خالية تماماً من أي سموم كيميائية وفق تحاليل جامعات الجنوب.</li>
              <li>انخفاض المناسيب ناتج عن شح الأمطار والحر الشديد والتبخر الإقليمي.</li>
              <li>الفيديو المتداول قديم ويعود لدولة أخرى وتم اجتزاؤه لإثارة الهلع.</li>
            </ul>
          </div>
        </div>

        <div class="p-3 bg-light rounded-3 border text-center my-3">
          <h5 class="fw-bold text-dark mb-2"><i class="bi bi-question-diamond-fill text-danger"></i> ${data.conflictPrompt.title}</h5>
          <p class="text-muted small mb-3">${data.conflictPrompt.leadText}</p>

          <div class="conflict-actions-bar">
            ${data.conflictPrompt.options.map(opt => `
              <button class="btn ${opt.isBonusTrigger ? 'btn-outline-primary' : opt.isConstructive ? 'btn-app-success' : 'btn-app-outline'}" 
                      onclick="ActivityEngine.handleConflictChoice('${opt.id}')">
                ${opt.label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- الدليل الإضافي عند الطلب -->
        <div id="bonusEvidenceContainer" style="${AppState.bonusEvidenceUnlocked ? 'display: block;' : 'display: none;'}">
          ${data.bonusEvidence ? data.bonusEvidence.content : ''}
        </div>

        <!-- ربط الادعاء بالدليل -->
        <div class="mt-4 pt-3 border-top">
          <h5 class="fw-bold text-dark mb-2"><i class="bi bi-link-45deg text-primary"></i> ${data.claimEvidenceMatcher.instruction}</h5>
          <div class="row g-3">
            ${data.claimEvidenceMatcher.pairs.map((p, idx) => `
              <div class="col-12">
                <div class="p-3 border rounded-3 bg-white shadow-sm">
                  <div class="row align-items-center">
                    <div class="col-md-5">
                      <span class="badge bg-danger mb-1">الادعاء الشائع</span>
                      <p class="small fw-bold text-dark mb-0">${p.claim}</p>
                    </div>
                    <div class="col-md-2 text-center text-muted my-2 my-md-0">
                      <i class="bi bi-arrow-left-right fs-4"></i>
                    </div>
                    <div class="col-md-5">
                      <span class="badge bg-success mb-1">الدليل العلمي المفند</span>
                      <p class="small text-slate mb-0">${p.evidence}</p>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center pt-4 border-top mt-4">
          <button class="btn btn-app-outline" onclick="DriverEngine.prevStage()">
            <i class="bi bi-arrow-right"></i> السابق
          </button>
          <button class="btn btn-app-primary" onclick="DriverEngine.nextStage()">
            <span>الانتقال للمرحلة الرابعة: غرفة القرار</span>
            <i class="bi bi-arrow-left"></i>
          </button>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  handleConflictChoice(choiceId) {
    AppState.cognitiveConflictChoice = choiceId;
    if (choiceId.includes('need_more')) {
      AppState.bonusEvidenceUnlocked = true;
      AppState.updateScore("intellectualSecurity", "criticalThinking", 10);
      const bCont = document.getElementById("bonusEvidenceContainer");
      if (bCont) bCont.style.display = "block";
      alert("تم فتح دليل التحدي الإضافي! تفحص تقرير التحقق بالأسفل.");
    } else if (choiceId.includes('modify')) {
      AppState.updateScore("intellectualSecurity", "objectivity", 15);
      AppState.updateScore("intellectualSecurity", "evidenceJudgment", 10);
      AppState.addBadge({ id: "flexible-mind", name: "مفكر موضوعي مرن", icon: "bi-arrow-repeat" });
      alert("رائع! المرونة الفكرية وتعديل الموقف وفق الأدلة هي قمة التفكير العلمي.");
    }
    AppState.save();
  },

  /**
   * ------------------------------------------------------------------------
   * المرحلة 4: تطبيق الفهم في موقف جديد (غرفة القرار)
   * ------------------------------------------------------------------------
   */
  renderStage4(data) {
    const container = document.getElementById("stageContainer");
    if (!container) return;

    const step = data.decisionRoom.steps[0];

    let html = `
      <div class="app-card animate-fade-in">
        <div class="app-card-header">
          <div>
            <span class="stage-badge ${data.badgeClass}"><i class="bi ${data.icon}"></i> المرحلة الرابعة: ${data.stageName}</span>
            <h3 class="mt-2 mb-1 fw-bold">غرفة القرار: اختبار الموقف الواقعي</h3>
          </div>
          <span class="badge bg-danger"><i class="bi bi-broadcast"></i> سيناريو مباشر</span>
        </div>

        <!-- محطة غرفة القرار -->
        <div class="decision-room-terminal mb-4">
          <div class="terminal-header">
            <h5 class="fw-bold text-white mb-0"><i class="bi bi-shield-lock-fill text-warning"></i> ${data.decisionRoom.title}</h5>
            <span class="badge bg-dark border text-light"><i class="bi bi-geo-alt"></i> العراق - الموقف الميداني</span>
          </div>

          <div class="situation-prompt">
            ${data.decisionRoom.situation}
          </div>

          <div class="mb-3">
            <h6 class="fw-bold text-info"><i class="bi bi-question-octagon-fill"></i> ${step.prompt}</h6>
          </div>

          <div class="decision-options-list">
            ${step.choices.map(c => `
              <button class="decision-btn" onclick="ActivityEngine.chooseDecision('${c.id}')">
                <i class="bi bi-check2-circle text-info fs-5"></i>
                <span>${c.text}</span>
              </button>
            `).join('')}
          </div>

          <div id="decisionConsequenceBox" style="display: none;"></div>
        </div>

        <!-- صياغة الحكم النهائي المدعوم بالأدلة -->
        <div class="p-3 bg-light rounded-3 border">
          <h5 class="fw-bold text-dark mb-2"><i class="bi bi-award-fill text-primary"></i> ${data.finalJudgmentForm.prompt}</h5>
          
          <div class="mb-3">
            <label class="form-label small fw-bold text-slate">${data.finalJudgmentForm.claimQuestion}</label>
            <select class="form-select" id="finalClaimSelect" onchange="AppState.finalClaim = this.value; AppState.save();">
              ${data.finalJudgmentForm.claimOptions.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold text-slate">${data.finalJudgmentForm.evidenceQuestion}</label>
            <select class="form-select" id="finalEvidenceSelect" onchange="AppState.finalEvidence = this.value; AppState.save();">
              ${data.finalJudgmentForm.evidenceOptions.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center pt-4 border-top mt-4">
          <button class="btn btn-app-outline" onclick="DriverEngine.prevStage()">
            <i class="bi bi-arrow-right"></i> السابق
          </button>
          <button class="btn btn-app-primary" onclick="DriverEngine.nextStage()">
            <span>الانتقال للمرحلة الخامسة: مرآة التفكير</span>
            <i class="bi bi-arrow-left"></i>
          </button>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  chooseDecision(choiceId) {
    const lesson = AppState.currentLessonData;
    if (!lesson) return;

    const step = lesson.stage4.decisionRoom.steps[0];
    const choice = step.choices.find(c => c.id === choiceId);
    if (!choice) return;

    AppState.decisionRoomChoices.push(choice);
    AppState.updateScore("intellectualSecurity", "rumorResistance", choice.scoreIntellectual * 5);
    AppState.updateScore("currentEvents", "context", choice.scoreAwareness * 5);
    AppState.save();

    const box = document.getElementById("decisionConsequenceBox");
    if (box) {
      box.style.display = "block";
      const isPositive = choice.scoreIntellectual > 0;
      box.className = `decision-consequence-box border-2 ${isPositive ? 'border-success' : 'border-danger'}`;
      box.innerHTML = `
        <h6 class="fw-bold ${isPositive ? 'text-success' : 'text-danger'} mb-1">
          <i class="bi ${isPositive ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}"></i> نتيجة قرارك الميداني:
        </h6>
        <p class="small mb-0 text-light">${choice.consequence}</p>
      `;
    }
  },

  /**
   * ------------------------------------------------------------------------
   * المرحلة 5: مراجعة التغير في الأفكار (مرآة التفكير)
   * ------------------------------------------------------------------------
   */
  renderStage5(data) {
    const container = document.getElementById("stageContainer");
    if (!container) return;

    const initialOp = AppState.initialOpinion || 3;
    const finalClaim = AppState.finalClaim || "فهم علمي قائم على الأدلة وفحص المصادر الرسمية وتفنيد الشائعات.";

    let html = `
      <div class="app-card animate-fade-in">
        <div class="app-card-header">
          <div>
            <span class="stage-badge ${data.badgeClass}"><i class="bi ${data.icon}"></i> المرحلة الخامسة: ${data.stageName}</span>
            <h3 class="mt-2 mb-1 fw-bold">${data.mirror.headline}</h3>
          </div>
          <span class="badge bg-purple text-dark"><i class="bi bi-gem"></i> ختام رحلة درايفر</span>
        </div>

        <div class="thinking-mirror-box">
          <div class="mirror-columns">
            <!-- العمود الأول: قبل -->
            <div class="mirror-card border-warning">
              <h6 class="mirror-title text-warning-emphasis">
                <i class="bi bi-hourglass-top"></i> ${data.mirror.beforeCardTitle}
              </h6>
              <div class="p-3 bg-light rounded-3 mb-2">
                <span class="badge bg-secondary mb-1">تقديرك الأولي لموثوقية المنشور</span>
                <h4 class="fw-bold text-dark">${initialOp} من 5</h4>
                <p class="small text-muted mb-0">كنت تتخذ موقفاً مبنياً على الانطباع الأول وسماع الآراء المتداولة.</p>
              </div>
            </div>

            <!-- العمود الثاني: بعد -->
            <div class="mirror-card border-success">
              <h6 class="mirror-title text-success">
                <i class="bi bi-check-all"></i> ${data.mirror.afterCardTitle}
              </h6>
              <div class="p-3 bg-success-soft rounded-3 mb-2">
                <span class="badge bg-success mb-1">حكمك النهائي المستند للأدلة</span>
                <p class="small fw-bold text-dark mb-0">${finalClaim}</p>
                <div class="mt-2">
                  <span class="badge bg-primary">مفكر جغرافي ناقد</span>
                </div>
              </div>
            </div>
          </div>

          <!-- أسباب التغير المعرفي -->
          <div class="mt-4 pt-3 border-top">
            <h6 class="fw-bold text-dark mb-2"><i class="bi bi-check-square-fill text-primary"></i> ${data.mirror.reasonsQuestion}</h6>
            <div class="mirror-reasons-grid">
              ${data.mirror.reasonsList.map(r => `
                <label class="mirror-reason-checkbox">
                  <input type="checkbox" class="form-check-input" checked onchange="ActivityEngine.toggleShiftReason('${r.id}')">
                  <span>${r.label}</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="text-center pt-4">
          <button class="btn btn-app-success btn-lg px-5 shadow-lg" onclick="DriverEngine.nextStage()">
            <i class="bi bi-award-fill"></i>
            <span>إتمام المهمة وعرض لوحة المهارات التحليلية</span>
            <i class="bi bi-arrow-left"></i>
          </button>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  toggleShiftReason(reasonId) {
    if (!AppState.thinkingShiftReasons.includes(reasonId)) {
      AppState.thinkingShiftReasons.push(reasonId);
    } else {
      AppState.thinkingShiftReasons = AppState.thinkingShiftReasons.filter(r => r !== reasonId);
    }
    AppState.save();
  }
};

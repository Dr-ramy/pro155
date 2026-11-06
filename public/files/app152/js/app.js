// js/app.js
let score = 0;
let emotionScore = 20;
let currentSceneIndex = 0;
let currentHotspot = null;
let sceneStates = []; // Keep track of completed hotspots per scene

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize State
    lessonData.scenes.forEach(s => {
        sceneStates.push({
            completedHotspots: new Set()
        });
    });

    // 2. Initialize UI with Data
    document.getElementById('lesson-title').innerText = lessonData.title;
    document.getElementById('lesson-desc').innerText = lessonData.description;
    
    buildTimeline();
    loadScene(currentSceneIndex);
    updateEmotionUI();
    
    // 3. Start Button
    document.getElementById('btn-start').addEventListener('click', () => {
        document.getElementById('start-overlay').classList.add('d-none');
    });

    // 4. Continue Button
    document.getElementById('btn-continue').addEventListener('click', hideInteractionPanel);

    // 5. Navigation Buttons
    document.getElementById('btn-next-scene').addEventListener('click', nextScene);
    document.getElementById('btn-prev-scene').addEventListener('click', prevScene);
});

function buildTimeline() {
    const container = document.getElementById('timeline-nodes');
    container.innerHTML = '';
    
    lessonData.scenes.forEach((scene, index) => {
        const node = document.createElement('div');
        node.className = 'timeline-node';
        node.title = scene.title;
        node.id = `timeline-node-${index}`;
        
        node.addEventListener('click', () => {
            loadScene(index);
        });
        
        container.appendChild(node);
    });
    updateTimelineUI();
}

function updateTimelineUI() {
    lessonData.scenes.forEach((scene, index) => {
        const node = document.getElementById(`timeline-node-${index}`);
        node.classList.remove('active', 'completed');
        
        if (index === currentSceneIndex) {
            node.classList.add('active');
        } else if (sceneStates[index].completedHotspots.size === scene.hotspots.length) {
            node.classList.add('completed');
        }
    });

    document.getElementById('scene-progress').innerText = `المحطة ${currentSceneIndex + 1} من ${lessonData.scenes.length}`;
}

function loadScene(index) {
    if (index < 0 || index >= lessonData.scenes.length) return;
    
    hideInteractionPanel();
    currentSceneIndex = index;
    const scene = lessonData.scenes[currentSceneIndex];
    
    // Set Background
    const bg = document.getElementById('scene-bg');
    bg.src = scene.background;

    // Clear previous elements
    const container = document.getElementById('scene-container');
    const existing = container.querySelectorAll('.hotspot, .scene-element');
    existing.forEach(el => el.remove());

    // Add Hotspots
    scene.hotspots.forEach(hs => {
        const el = document.createElement('div');
        el.className = 'hotspot';
        el.id = hs.id;
        el.style.left = hs.x + '%';
        el.style.top = hs.y + '%';
        el.style.zIndex = hs.z;

        // Check if already completed
        if (sceneStates[currentSceneIndex].completedHotspots.has(hs.id)) {
            el.classList.add('completed');
        }

        el.addEventListener('click', () => handleHotspotClick(hs, el));
        container.appendChild(el);
    });

    updateTimelineUI();
    
    // Show/Hide Arrows
    document.getElementById('btn-prev-scene').style.display = currentSceneIndex > 0 ? 'block' : 'none';
    document.getElementById('btn-next-scene').style.display = currentSceneIndex < lessonData.scenes.length - 1 ? 'block' : 'none';
}

function nextScene() {
    loadScene(currentSceneIndex + 1);
}

function prevScene() {
    loadScene(currentSceneIndex - 1);
}

function handleHotspotClick(hotspotData, element) {
    // If already completed, just return or show feedback again (we'll just return for now)
    if (sceneStates[currentSceneIndex].completedHotspots.has(hotspotData.id)) {
        return;
    }

    currentHotspot = { data: hotspotData, element: element };
    
    const panel = document.getElementById('interaction-panel');
    panel.classList.remove('d-none');
    
    const feedback = document.getElementById('feedback-alert');
    feedback.classList.add('d-none');
    feedback.className = 'alert d-none fw-bold py-2 mb-2';
    document.getElementById('btn-continue').classList.add('d-none');

    document.getElementById('question-text').innerText = hotspotData.question;
    
    const optsContainer = document.getElementById('options-container');
    optsContainer.innerHTML = '';
    
    hotspotData.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline-primary btn-lg rounded-pill px-4';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index, btn);
        optsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, btnElement) {
    const data = currentHotspot.data;
    const isCorrect = selectedIndex === data.correct;
    
    const btns = document.getElementById('options-container').querySelectorAll('button');
    btns.forEach(b => b.disabled = true);

    const feedback = document.getElementById('feedback-alert');
    feedback.classList.remove('d-none');
    document.getElementById('btn-continue').classList.remove('d-none');

    if (isCorrect) {
        btnElement.classList.replace('btn-outline-primary', 'btn-success');
        feedback.classList.add('alert-success');
        feedback.innerHTML = `<i class="bi bi-check-circle-fill"></i> إجابة صحيحة! ${data.feedback}`;
        
        currentHotspot.element.classList.add('completed');
        sceneStates[currentSceneIndex].completedHotspots.add(data.id);
        
        score += 10;
        emotionScore = Math.min(100, emotionScore + 15);
        document.getElementById('score-display').innerText = score;
        updateTimelineUI();
        updateEmotionUI();
        
        checkCompletion();
    } else {
        btnElement.classList.replace('btn-outline-primary', 'btn-danger');
        btns[data.correct].classList.replace('btn-outline-primary', 'btn-success');
        
        feedback.classList.add('alert-danger');
        feedback.innerHTML = `<i class="bi bi-x-circle-fill"></i> إجابة خاطئة. الإجابة الصحيحة هي: ${data.options[data.correct]}`;
        
        emotionScore = Math.max(0, emotionScore - 10);
        updateEmotionUI();
    }
}

function updateEmotionUI() {
    const bar = document.getElementById('emotion-bar');
    const emoji = document.getElementById('emotion-emoji');
    
    if (!bar || !emoji) return;
    
    bar.style.width = emotionScore + '%';
    
    // Change color based on score
    bar.className = 'progress-bar transition-all ';
    if (emotionScore < 30) {
        bar.classList.add('bg-danger');
        emoji.innerText = '🤔'; // Thinking/Curious
    } else if (emotionScore < 60) {
        bar.classList.add('bg-warning');
        emoji.innerText = '🙂'; // Starting to get excited
    } else if (emotionScore < 85) {
        bar.classList.add('bg-info');
        emoji.innerText = '😃'; // Excited
    } else {
        bar.classList.add('bg-success');
        emoji.innerText = '🤩'; // Passionate/Starstruck
    }
    
    // Add a little bounce animation
    emoji.style.transform = 'scale(1.4)';
    setTimeout(() => emoji.style.transform = 'scale(1)', 300);
}

function hideInteractionPanel() {
    document.getElementById('interaction-panel').classList.add('d-none');
    currentHotspot = null;
}

function checkCompletion() {
    let allCompleted = true;
    for(let i=0; i<sceneStates.length; i++) {
        if(sceneStates[i].completedHotspots.size < lessonData.scenes[i].hotspots.length) {
            allCompleted = false;
            break;
        }
    }
    
    if(allCompleted) {
        setTimeout(() => {
            document.getElementById('final-score').innerText = score;
            document.getElementById('end-overlay').classList.remove('d-none');
        }, 1000);
    }
}

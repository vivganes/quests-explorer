let currentScenario;
let currentStep = 0;

const contextEl = document.getElementById('context');
const currentDateEl = document.getElementById('currentDate');
const whatHappenedNowEl = document.getElementById('whatHappenedNow');
const additionalHintsEl = document.getElementById('additionalHints');
const peekBtn = document.getElementById('peekBtn');
const hideHintsBtn = document.getElementById('hideHintsBtn');
const resetBtn = document.getElementById('resetBtn');
const stageFilter = document.getElementById('stageFilter');
const replayBtn = document.getElementById('replayBtn');
const scenarioIdInput = document.getElementById('scenarioIdInput');
const searchBtn = document.getElementById('searchBtn');
const instructionBanner = document.getElementById('instructionBanner');

function getRandomScenario(stage = '') {
    const filteredScenarios = stage
        ? scenarios.filter(s => s.stage === stage)
        : scenarios;
    return filteredScenarios[Math.floor(Math.random() * filteredScenarios.length)];
}

function findScenarioById(id) {
    return scenarios.find(scenario => scenario.id === id);
}

function resetScenario(specificScenario = null) {
    if (specificScenario) {
        currentScenario = specificScenario;
    } else {
        currentScenario = getRandomScenario(stageFilter.value);
    }
    currentStep = 0;
    contextEl.innerHTML = '';
    currentDateEl.innerHTML = '';
    whatHappenedNowEl.innerHTML = '';
    additionalHintsEl.innerHTML = '';
    peekBtn.classList.add('hidden');
    hideHintsBtn.classList.add('hidden');
    instructionBanner.style.display = 'block';
}

function scrollToBottom() {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
    });
}

function showNextStep() {
    const contextSentences = currentScenario.context.split('. ');
    const whatHappenedNowSentences = currentScenario.whatHappenedNow.split('. ');
    const additionalHintsSentences = currentScenario.additionalHints.split('. ');

    if (currentStep === 0) {
        contextEl.innerHTML = `<h2>Scenario ID</h2><p>${currentScenario.id}</p><h2>Context</h2><ul></ul>`;
        currentStep++;
        scrollToBottom();
    } else if (currentStep <= contextSentences.length) {
        const contextList = contextEl.querySelector('ul');
        const listItem = document.createElement('li');
        listItem.textContent = contextSentences[currentStep - 1].trim() + '.';
        contextList.appendChild(listItem);
        scrollToBottom();
    } else if (currentStep === contextSentences.length + 1) {
        currentDateEl.innerHTML = `<h2>Current Stage</h2>${currentScenario.stage}`;
        scrollToBottom();
    } else if (currentStep === contextSentences.length + 2) {
        currentDateEl.innerHTML += `<h2>Today's Date</h2>${currentScenario.currentDate}`;
        scrollToBottom();
    } else if (currentStep === contextSentences.length + 3) {
        whatHappenedNowEl.innerHTML = '<h2>What Happened Now?</h2><ul></ul>';
        const whatHappenedNowList = whatHappenedNowEl.querySelector('ul');
        const listItem = document.createElement('li');
        listItem.textContent = whatHappenedNowSentences[0].trim() + '.';
        whatHappenedNowList.appendChild(listItem);
        scrollToBottom();
    } else if (currentStep < contextSentences.length + 3 + whatHappenedNowSentences.length) {
        const whatHappenedNowIndex = currentStep - contextSentences.length - 3;
        const whatHappenedNowList = whatHappenedNowEl.querySelector('ul');
        const listItem = document.createElement('li');
        listItem.textContent = whatHappenedNowSentences[whatHappenedNowIndex].trim() + '.';
        whatHappenedNowList.appendChild(listItem);
        scrollToBottom();
    } else if (currentStep === contextSentences.length + 3 + whatHappenedNowSentences.length) {
        peekBtn.classList.remove('hidden');
        scrollToBottom();
    } else if (currentStep > contextSentences.length + 3 + whatHappenedNowSentences.length) {
        if (peekBtn.classList.contains('hidden')) {
            if (additionalHintsEl.innerHTML === '') {
                additionalHintsEl.innerHTML = '<h2>Additional Hints</h2><ul></ul>';
            }
            const additionalHintsIndex = currentStep - contextSentences.length - 4 - whatHappenedNowSentences.length;
            
            if (additionalHintsIndex < additionalHintsSentences.length) {
                const additionalHintsList = additionalHintsEl.querySelector('ul');
                const listItem = document.createElement('li');
                listItem.textContent = additionalHintsSentences[additionalHintsIndex].trim() + '.';
                additionalHintsList.appendChild(listItem);
                scrollToBottom();
                
                if (additionalHintsIndex === additionalHintsSentences.length - 1) {
                    hideHintsBtn.classList.remove('hidden');
                    scrollToBottom();
                }
            }
        }
    }

    currentStep++;
    instructionBanner.style.display = 'none';
}

function hideAdditionalHints() {
    additionalHintsEl.classList.add('hidden');
    hideHintsBtn.classList.add('hidden');
    peekBtn.classList.remove('hidden');
}

function replayScenario() {
    currentStep = 0;
    contextEl.innerHTML = '';
    currentDateEl.innerHTML = '';
    whatHappenedNowEl.innerHTML = '';
    additionalHintsEl.innerHTML = '';
    peekBtn.classList.add('hidden');
    hideHintsBtn.classList.add('hidden');
    instructionBanner.style.display = 'block';
    showNextStep();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        showNextStep();
    }
});

searchBtn.addEventListener('click', () => {
    const searchId = parseInt(scenarioIdInput.value);
    const foundScenario = findScenarioById(searchId);
    if (foundScenario) {
        resetScenario(foundScenario);
        showNextStep();
    } else {
        alert('Scenario not found. Please enter a valid ID.');
    }
});

resetBtn.addEventListener('click', () => {
    scenarioIdInput.value = ''; // Clear the search input
    resetScenario();
    showNextStep();
});

peekBtn.addEventListener('click', () => {
    peekBtn.classList.add('hidden');
    additionalHintsEl.classList.remove('hidden');
    additionalHintsEl.innerHTML = '<h2>Additional Hints</h2><ul></ul>';
    const additionalHintsList = additionalHintsEl.querySelector('ul');
    const additionalHintsSentences = currentScenario.additionalHints.split('. ');
    additionalHintsSentences.forEach(hint => {
        const listItem = document.createElement('li');
        listItem.textContent = hint.trim() + '.';
        additionalHintsList.appendChild(listItem);
    });
    hideHintsBtn.classList.remove('hidden');
    scrollToBottom();
});

hideHintsBtn.addEventListener('click', hideAdditionalHints);

replayBtn.addEventListener('click', replayScenario);

function populateStageFilter() {
    const stages = [...new Set(scenarios.map(scenario => scenario.stage))];
    const stageFilter = document.getElementById('stageFilter');
    
    // Clear existing options (except the "No filter" option)
    stageFilter.innerHTML = '<option value="">No filter</option>';
    
    // Add new options
    stages.forEach(stage => {
        const option = document.createElement('option');
        option.value = stage;
        option.textContent = `Only ${stage} scenarios`;
        stageFilter.appendChild(option);
    });
}

populateStageFilter();

resetScenario();
showNextStep();
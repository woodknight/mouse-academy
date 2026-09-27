const DEFAULT_DURATION = 30_000;

let audioContext;

const modes = {
    steady: { targetSize: 76, minimumSize: 57, moveDelay: 1_000, score: 100 },
    swift: { targetSize: 65, minimumSize: 45, moveDelay: 720, score: 130 },
    blitz: { targetSize: 53, minimumSize: 34, moveDelay: 490, score: 165 },
};

const translations = {
    "zh-CN": {
        title: "鼠标学院 | 点击练习", description: "鼠标学院：节奏紧凑的鼠标点击练习小游戏。", brand: "鼠标学院", brandHome: "鼠标学院主页", sessionLabel: "点击反应训练", bestScore: "个人最佳", gameArea: "点击练习游戏", focusDrill: "01 / 专注训练", headline: "瞄准", headlineEmphasis: "这一刻。", introCopy: "在设定时间内点击出现的靶心。目标会越来越快，保持节奏，别点空。", difficultyGroup: "选择难度", difficulty: "训练强度", steady: "稳定", swift: "迅捷", blitz: "极限", durationGroup: "选择训练时长", duration: "训练时长", duration30: "30 秒", duration60: "60 秒", duration120: "120 秒", unlimited: "无限", languageGroup: "选择界面语言", language: "界面语言", start: "开始训练", end: "结束训练", arena: "游戏区域", ready: "准备好了吗？", readyHint: "选择设置后开始训练", targetPrompt: "点击目标", scoreboard: "本局数据", timeRemaining: "剩余时间", trainingTime: "训练时间", seconds: "秒", hits: "命中", misses: "失误", accuracy: "准确率", streak: "连击", currentScore: "当前得分", trainingComplete: "训练完成", resultTitle: "训练结束", finalScore: "最终得分", playAgain: "再来一局", waiting: "等待开始", training: "训练中", adjustPace: "调整节奏", hot: "状态正热", focused: "保持专注", finished: "训练完成", unlimitedTraining: "不限时训练", selectedDuration: "已选 {seconds} 秒", targetLabel: "点击{name}", warmup: "已经完成第一轮热身，专注每一次出现。", steadySummary: "稳定的发挥，下一局可以再提一点速度。", excellentSummary: "手眼配合非常出色，节奏干净利落。",
    },
    "en-US": {
        title: "Mouse Academy | Click Practice", description: "Mouse Academy: a fast-paced mouse clicking practice game.", brand: "Mouse Academy", brandHome: "Mouse Academy home", sessionLabel: "Click reaction training", bestScore: "PERSONAL BEST", gameArea: "Click practice game", focusDrill: "01 / FOCUS DRILL", headline: "Aim for", headlineEmphasis: "this moment.", introCopy: "Click the targets before time runs out. They get faster as you go, so keep the rhythm and avoid misses.", difficultyGroup: "Choose difficulty", difficulty: "Training intensity", steady: "Steady", swift: "Swift", blitz: "Blitz", durationGroup: "Choose duration", duration: "Training duration", duration30: "30 sec", duration60: "60 sec", duration120: "120 sec", unlimited: "Unlimited", languageGroup: "Choose interface language", language: "Interface language", start: "Start training", end: "End training", arena: "Game area", ready: "Ready?", readyHint: "Choose your settings and start training", targetPrompt: "Click target", scoreboard: "Session stats", timeRemaining: "Time remaining", trainingTime: "Training time", seconds: "sec", hits: "Hits", misses: "Misses", accuracy: "Accuracy", streak: "Streak", currentScore: "Current score", trainingComplete: "TRAINING COMPLETE", resultTitle: "Training complete", finalScore: "Final score", playAgain: "Play again", waiting: "Waiting to start", training: "Training", adjustPace: "Reset your rhythm", hot: "You're on a roll", focused: "Stay focused", finished: "Training complete", unlimitedTraining: "Unlimited training", selectedDuration: "{seconds} seconds selected", targetLabel: "Click {name}", warmup: "Your first round is complete. Focus on each new target.", steadySummary: "A steady run. Raise the pace a little next time.", excellentSummary: "Excellent hand-eye coordination and a clean rhythm.",
    },
};

const targetGroups = [
    {
        tint: "#ffe1b6",
        entries: [
            ["🐱", "小猫", "cat"], ["🐶", "小狗", "dog"], ["🐰", "小兔", "rabbit"], ["🦊", "小狐狸", "fox"], ["🐸", "小青蛙", "frog"], ["🐧", "小企鹅", "penguin"], ["🐨", "小考拉", "koala"], ["🐭", "小老鼠", "mouse"], ["🐹", "小仓鼠", "hamster"], ["🐼", "小熊猫", "panda"], ["🐻", "小熊", "bear"], ["🦁", "小狮子", "lion"], ["🐯", "小老虎", "tiger"], ["🐵", "小猴子", "monkey"], ["🐮", "小奶牛", "cow"], ["🐷", "小猪", "pig"], ["🦆", "小鸭子", "duck"], ["🦉", "小猫头鹰", "owl"], ["🐘", "小象", "elephant"], ["🦒", "小长颈鹿", "giraffe"], ["🦓", "小斑马", "zebra"], ["🐑", "小绵羊", "sheep"], ["🐐", "小山羊", "goat"], ["🐴", "小马", "horse"], ["🐔", "小鸡", "chicken"], ["🐓", "小公鸡", "rooster"], ["🦃", "小火鸡", "turkey"], ["🦚", "小孔雀", "peacock"], ["🦜", "小鹦鹉", "parrot"], ["🦅", "小鹰", "eagle"], ["🦇", "小蝙蝠", "bat"], ["🐬", "小海豚", "dolphin"], ["🐋", "小鲸鱼", "whale"], ["🦈", "小鲨鱼", "shark"], ["🐙", "小章鱼", "octopus"], ["🦀", "小螃蟹", "crab"], ["🦞", "小龙虾", "lobster"], ["🐢", "小乌龟", "turtle"], ["🐍", "小蛇", "snake"], ["🦎", "小蜥蜴", "lizard"], ["🐝", "小蜜蜂", "bee"], ["🦋", "小蝴蝶", "butterfly"], ["🐌", "小蜗牛", "snail"],
        ],
    },
    {
        tint: "#cae4f2",
        entries: [
            ["🚗", "汽车", "car"], ["🚕", "出租车", "taxi"], ["🚌", "公交车", "bus"], ["🚎", "无轨电车", "trolleybus"], ["🚐", "面包车", "minibus"], ["🚑", "救护车", "ambulance"], ["🚒", "消防车", "fire engine"], ["🚓", "警车", "police car"], ["🚚", "货车", "truck"], ["🚛", "送货车", "delivery truck"], ["🛻", "皮卡车", "pickup truck"], ["🚜", "拖拉机", "tractor"], ["🏎️", "赛车", "racing car"], ["🏍️", "摩托车", "motorcycle"], ["🛵", "小摩托", "scooter"], ["🚲", "自行车", "bicycle"], ["🛴", "滑板车", "kick scooter"], ["🛹", "滑板", "skateboard"], ["🛼", "轮滑鞋", "roller skate"], ["🚂", "火车", "train"], ["🚄", "高铁", "high speed train"], ["🚋", "有轨电车", "tram"], ["🚇", "地铁", "metro"], ["🚝", "单轨列车", "monorail"], ["🚁", "直升机", "helicopter"], ["✈️", "飞机", "airplane"], ["🚀", "火箭", "rocket"], ["🛰️", "卫星", "satellite"], ["🚢", "轮船", "ship"], ["⛴️", "渡轮", "ferry"], ["🚤", "快艇", "speedboat"], ["⛵", "帆船", "sailboat"], ["🛶", "独木舟", "canoe"], ["🚠", "缆车", "cable car"],
        ],
    },
    {
        tint: "#dff0b2",
        entries: [
            ["🌱", "小树苗", "seedling"], ["🌿", "香草", "herb"], ["☘️", "三叶草", "shamrock"], ["🍀", "幸运草", "clover"], ["🌲", "常青树", "evergreen tree"], ["🌳", "落叶树", "deciduous tree"], ["🌴", "棕榈树", "palm tree"], ["🌵", "仙人掌", "cactus"], ["🍄", "蘑菇", "mushroom"], ["🍃", "叶子", "leaf"], ["🍁", "枫叶", "maple leaf"], ["🍂", "落叶", "fallen leaf"], ["🪴", "盆栽", "potted plant"], ["🌹", "玫瑰", "rose"], ["🌺", "扶桑花", "hibiscus"], ["🌻", "向日葵", "sunflower"], ["🌸", "樱花", "blossom"], ["🌷", "郁金香", "tulip"], ["🪻", "风信子", "hyacinth"], ["🪷", "莲花", "lotus"], ["💐", "花束", "bouquet"], ["🍇", "葡萄", "grapes"], ["🍈", "甜瓜", "melon"], ["🍉", "西瓜", "watermelon"], ["🍊", "橘子", "tangerine"], ["🍋", "柠檬", "lemon"], ["🍌", "香蕉", "banana"], ["🍍", "菠萝", "pineapple"], ["🥭", "芒果", "mango"], ["🍎", "红苹果", "apple"], ["🍏", "青苹果", "green apple"], ["🍐", "梨", "pear"], ["🍑", "桃子", "peach"], ["🍒", "樱桃", "cherries"], ["🍓", "草莓", "strawberry"], ["🫐", "蓝莓", "blueberries"], ["🥝", "猕猴桃", "kiwi"], ["🍅", "番茄", "tomato"], ["🫒", "橄榄", "olive"], ["🥥", "椰子", "coconut"], ["🥑", "牛油果", "avocado"], ["🌰", "栗子", "chestnut"], ["🥜", "花生", "peanuts"], ["🌽", "玉米", "corn"], ["🥕", "胡萝卜", "carrot"], ["🥬", "绿叶菜", "leafy green"], ["🥦", "西兰花", "broccoli"], ["🧄", "大蒜", "garlic"], ["🧅", "洋葱", "onion"], ["🥔", "土豆", "potato"], ["🫛", "豌豆", "peas"], ["🫚", "姜", "ginger"],
        ],
    },
];

const targets = targetGroups.flatMap(({ tint, entries }) => entries.map(([icon, name, word]) => ({ icon, name, tint, word })));

const elements = {
    accuracy: document.querySelector("#accuracy"),
    arena: document.querySelector("#arena"),
    bestScore: document.querySelector("#best-score"),
    burstLayer: document.querySelector("#burst-layer"),
    durationButtons: document.querySelectorAll(".duration-button"),
    end: document.querySelector("#end-button"),
    finalAccuracy: document.querySelector("#final-accuracy"),
    finalHits: document.querySelector("#final-hits"),
    finalScore: document.querySelector("#final-score"),
    hitCount: document.querySelector("#hit-count"),
    idleMessage: document.querySelector("#idle-message"),
    languageButtons: document.querySelectorAll(".language-button"),
    missCount: document.querySelector("#miss-count"),
    modeButtons: document.querySelectorAll(".mode-button"),
    playAgain: document.querySelector("#play-again-button"),
    resultModal: document.querySelector("#result-modal"),
    resultSummary: document.querySelector("#result-summary"),
    score: document.querySelector("#score"),
    scoreStatus: document.querySelector("#score-status"),
    sessionHint: document.querySelector("#session-hint"),
    start: document.querySelector("#start-button"),
    streak: document.querySelector("#streak-count"),
    target: document.querySelector("#target"),
    targetAnimal: document.querySelector("#target-animal"),
    timeProgress: document.querySelector("#time-progress"),
    timeLabel: document.querySelector("#time-label"),
    timeRemaining: document.querySelector("#time-remaining"),
    timeUnit: document.querySelector("#time-unit"),
};

const game = {
    active: false,
    currentTarget: null,
    duration: DEFAULT_DURATION,
    hits: 0,
    language: "zh-CN",
    misses: 0,
    mode: "steady",
    previousTargetIndex: -1,
    score: 0,
    startedAt: 0,
    streak: 0,
    timerFrame: 0,
    status: "waiting",
};

function text(key) {
    return translations[game.language][key];
}

function formatText(key, values) {
    return text(key).replace(/\{(\w+)\}/g, (_, name) => values[name]);
}

function renderStatus() {
    elements.scoreStatus.textContent = text(game.status);
}

function renderTargetLabel() {
    if (!game.currentTarget) return;
    const name = game.language === "zh-CN" ? game.currentTarget.name : game.currentTarget.word;
    elements.target.setAttribute("aria-label", formatText("targetLabel", { name }));
}

function renderLanguage() {
    const description = document.querySelector('meta[name="description"]');
    document.documentElement.lang = game.language;
    document.title = text("title");
    description.content = text("description");
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        element.textContent = text(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
        element.setAttribute("aria-label", text(element.dataset.i18nAriaLabel));
    });
    renderStatus();
    renderTargetLabel();
}

function getBestScore() {
    return Number(localStorage.getItem("mouse-academy-best") || 0);
}

function renderBestScore() {
    const bestScore = getBestScore();
    elements.bestScore.textContent = bestScore ? bestScore.toString().padStart(4, "0") : "----";
}

function playSound(startFrequency, endFrequency, duration, waveform, volume, delay = 0) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    audioContext ??= new AudioContext();
    if (audioContext.state === "suspended") audioContext.resume();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime + delay;
    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(startFrequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
}

function speakTargetWord(target) {
    if (!("speechSynthesis" in window) || !window.SpeechSynthesisUtterance) return;
    const isChinese = game.language === "zh-CN";
    const utterance = new SpeechSynthesisUtterance(isChinese ? target.name : target.word);
    utterance.lang = game.language;
    utterance.rate = isChinese ? 0.92 : 0.88;
    utterance.pitch = 1.08;
    utterance.volume = 0.82;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

function playMissSound() {
    playSound(180, 95, 0.16, "triangle", 0.07);
}

function getAccuracy() {
    const attempts = game.hits + game.misses;
    return attempts ? Math.round((game.hits / attempts) * 100) : 0;
}

function updateScoreboard() {
    elements.hitCount.textContent = game.hits;
    elements.missCount.textContent = game.misses;
    elements.streak.textContent = game.streak;
    elements.accuracy.textContent = game.hits + game.misses ? `${getAccuracy()}%` : "--";
    elements.score.textContent = game.score.toString().padStart(4, "0");
}

function setMode(mode) {
    if (game.active) return;
    game.mode = mode;
    elements.modeButtons.forEach((button) => {
        button.classList.toggle("is-selected", button.dataset.mode === mode);
    });
}

function setDuration(duration) {
    if (game.active) return;
    game.duration = duration;
    elements.durationButtons.forEach((button) => {
        button.classList.toggle("is-selected", button.dataset.duration === (duration === Infinity ? "infinite" : String(duration)));
    });
    elements.sessionHint.textContent = duration === Infinity ? text("unlimitedTraining") : formatText("selectedDuration", { seconds: duration / 1000 });
    elements.timeLabel.textContent = text("timeRemaining");
    elements.timeRemaining.textContent = duration === Infinity ? "∞" : (duration / 1000).toFixed(1);
    elements.timeUnit.textContent = duration === Infinity ? text("unlimited") : text("seconds");
    elements.timeProgress.style.width = "100%";
}

function setLanguage(language) {
    game.language = language;
    elements.languageButtons.forEach((button) => {
        button.classList.toggle("is-selected", button.dataset.language === language);
    });
    renderLanguage();
    if (!game.active) setDuration(game.duration);
}

function targetSize() {
    const config = modes[game.mode];
    const elapsedRatio = game.duration === Infinity ? 0 : Math.min((performance.now() - game.startedAt) / game.duration, 1);
    return config.targetSize - (config.targetSize - config.minimumSize) * elapsedRatio;
}

function chooseTarget() {
    let index = Math.floor(Math.random() * targets.length);
    if (targets.length > 1 && index === game.previousTargetIndex) {
        index = (index + 1) % targets.length;
    }
    game.previousTargetIndex = index;
    return targets[index];
}

function spawnTarget() {
    if (!game.active) return;

    const arenaBounds = elements.arena.getBoundingClientRect();
    const size = targetSize();
    const padding = Math.max(size / 2 + 11, 38);
    const maxX = Math.max(padding, arenaBounds.width - padding);
    const maxY = Math.max(padding, arenaBounds.height - padding);
    const x = padding + Math.random() * (maxX - padding);
    const y = padding + Math.random() * (maxY - padding);
    const nextTarget = chooseTarget();

    elements.target.style.setProperty("--target-size", `${size}px`);
    elements.target.style.setProperty("--animal-font-size", `${Math.max(26, size * 0.68)}px`);
    elements.target.style.setProperty("--animal-tint", nextTarget.tint);
    elements.target.style.left = `${x - size / 2}px`;
    elements.target.style.top = `${y - size / 2}px`;
    elements.targetAnimal.textContent = nextTarget.icon;
    game.currentTarget = nextTarget;
    renderTargetLabel();
    elements.target.hidden = false;
}

function addBurst(event) {
    const arenaBounds = elements.arena.getBoundingClientRect();
    const burstOriginX = event.clientX - arenaBounds.left;
    const burstOriginY = event.clientY - arenaBounds.top;

    for (let index = 0; index < 8; index += 1) {
        const particle = document.createElement("i");
        const angle = (Math.PI * 2 * index) / 8;
        const distance = 27 + Math.random() * 22;
        particle.className = "burst";
        particle.style.left = `${burstOriginX - 4}px`;
        particle.style.top = `${burstOriginY - 4}px`;
        particle.style.setProperty("--burst-x", `${Math.cos(angle) * distance}px`);
        particle.style.setProperty("--burst-y", `${Math.sin(angle) * distance}px`);
        elements.burstLayer.append(particle);
        particle.addEventListener("animationend", () => particle.remove(), { once: true });
    }
}

function addMissMarker(event) {
    const arenaBounds = elements.arena.getBoundingClientRect();
    const marker = document.createElement("i");
    marker.className = "miss-marker";
    marker.textContent = "×";
    marker.style.left = `${event.clientX - arenaBounds.left}px`;
    marker.style.top = `${event.clientY - arenaBounds.top}px`;
    elements.burstLayer.append(marker);
    marker.addEventListener("animationend", () => marker.remove(), { once: true });

    elements.arena.classList.remove("is-miss");
    void elements.arena.offsetWidth;
    elements.arena.classList.add("is-miss");
}

function registerMiss(event) {
    if (!game.active) return;
    playMissSound();
    addMissMarker(event);
    game.misses += 1;
    game.streak = 0;
    game.status = "adjustPace";
    renderStatus();
    updateScoreboard();
}

function registerHit(event) {
    if (!game.active) return;
    event.stopPropagation();
    speakTargetWord(game.currentTarget);
    game.hits += 1;
    game.streak += 1;
    game.score += modes[game.mode].score + Math.max(0, game.streak - 1) * 15;
    game.status = game.streak >= 8 ? "hot" : "focused";
    renderStatus();
    addBurst(event);
    updateScoreboard();
    spawnTarget();
}

function renderTimer() {
    if (!game.active) return;
    const elapsed = performance.now() - game.startedAt;
    if (game.duration === Infinity) {
        elements.timeLabel.textContent = text("trainingTime");
        elements.timeRemaining.textContent = "∞";
        elements.timeUnit.textContent = text("unlimited");
        elements.timeProgress.style.width = "100%";
        game.timerFrame = requestAnimationFrame(renderTimer);
        return;
    }

    const remaining = Math.max(0, game.duration - elapsed);
    const progress = (remaining / game.duration) * 100;
    elements.timeRemaining.textContent = (remaining / 1000).toFixed(1);
    elements.timeUnit.textContent = text("seconds");
    elements.timeProgress.style.width = `${progress}%`;
    elements.timeProgress.style.background = remaining < 7_000 ? "var(--orange)" : "var(--green)";

    if (remaining <= 0) {
        finishGame();
        return;
    }
    game.timerFrame = requestAnimationFrame(renderTimer);
}

function summaryForScore() {
    if (game.score >= 3_600) return text("excellentSummary");
    if (game.score >= 2_000) return text("steadySummary");
    return text("warmup");
}

function finishGame(showResults = true) {
    game.active = false;
    cancelAnimationFrame(game.timerFrame);
    elements.target.hidden = true;
    elements.arena.classList.remove("is-playing");
    elements.timeRemaining.textContent = "0.0";
    elements.timeLabel.textContent = text("timeRemaining");
    elements.timeUnit.textContent = text("seconds");
    elements.timeProgress.style.width = "0%";
    game.status = "finished";
    renderStatus();

    if (game.score > getBestScore()) {
        localStorage.setItem("mouse-academy-best", game.score);
    }
    renderBestScore();
    if (showResults) {
        elements.finalScore.textContent = game.score.toString().padStart(4, "0");
        elements.finalHits.textContent = game.hits;
        elements.finalAccuracy.textContent = `${getAccuracy()}%`;
        elements.resultSummary.textContent = summaryForScore();
        elements.resultModal.hidden = false;
    }
    elements.end.hidden = true;
    elements.start.hidden = false;
}

function startGame() {
    game.active = true;
    game.hits = 0;
    game.misses = 0;
    game.score = 0;
    game.streak = 0;
    game.startedAt = performance.now();
    elements.resultModal.hidden = true;
    elements.start.hidden = true;
    elements.end.hidden = false;
    elements.idleMessage.hidden = true;
    elements.arena.classList.add("is-playing");
    game.status = "training";
    renderStatus();
    updateScoreboard();
    elements.arena.focus({ preventScroll: true });
    spawnTarget();
    renderTimer();
}

elements.modeButtons.forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
elements.durationButtons.forEach((button) => button.addEventListener("click", () => setDuration(button.dataset.duration === "infinite" ? Infinity : Number(button.dataset.duration))));
elements.languageButtons.forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.language)));
elements.start.addEventListener("click", startGame);
elements.end.addEventListener("click", () => finishGame(false));
elements.playAgain.addEventListener("click", startGame);
elements.target.addEventListener("click", registerHit);
elements.arena.addEventListener("click", (event) => {
    if (game.active && event.target === elements.arena) registerMiss(event);
});
elements.arena.addEventListener("keydown", (event) => {
    if (game.active && event.key === "Escape") finishGame();
});

renderBestScore();
setDuration(DEFAULT_DURATION);
setLanguage(game.language);
updateScoreboard();
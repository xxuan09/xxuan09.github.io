// 心情数据映射
const moodData = {
    happy: {
        name: '开心',
        emoji: '😸',
        color: '#FFD700',
        messages: [
            '今天有个人在想你，很开心你也很开心。',
            '嘿，有人今天特别想念你的笑容。',
            '你的快乐感染了某个人，他们也在为你开心。'
        ]
    },
    sad: {
        name: '难过',
        emoji: '😿',
        color: '#87CEEB',
        messages: [
            '有人默默地在想你，希望你很快就能开心。',
            '嘿，别难过，有人一直陪着你。',
            '今天有人在想，如何才能让你笑起来。'
        ]
    },
    tired: {
        name: '疲惫',
        emoji: '😸',
        color: '#A9A9A9',
        messages: [
            '有人在想你，希望你能好好休息。',
            '嘿，有人今天一直在想，你有没有好好照顾自己。',
            '有个人累的时候也在想你呢。'
        ]
    },
    excited: {
        name: '兴奋',
        emoji: '😻',
        color: '#FF6347',
        messages: [
            '有人被你的热情感染了，也在兴奋地想你。',
            '嘿，有人为了能见到你而期待着。',
            '今天有个人的快乐秘密是——想你。'
        ]
    },
    calm: {
        name: '平静',
        emoji: '😺',
        color: '#98FB98',
        messages: [
            '有人在安静的时刻想起了你。',
            '嘿，有人用宁静的心在想你。',
            '今天有个人在平静的夜晚默默想着你。'
        ]
    },
    anxious: {
        name: '焦虑',
        emoji: '😾',
        color: '#DDA0DD',
        messages: [
            '有人在焦虑的时刻想到了你，你会让他们安心。',
            '嘿，有人想，要是能见到你就好了。',
            '今天有个人在紧张时想起你就放松了。'
        ]
    }
};

// 当前选中的心情
let currentMood = null;
let counter = 0;
let moodHistory = {}; // 心情历史记录

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initMoodSelector();
    initUpdateButton();
    loadData();
    renderMoodCalendar();
    checkDailyReset();
});

// 初始化心情选择器
function initMoodSelector() {
    const moodOptions = document.querySelectorAll('.mood-option');
    
    moodOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 移除所有激活状态
            moodOptions.forEach(opt => opt.classList.remove('active'));
            
            // 添加激活状态
            this.classList.add('active');
            
            // 更新当前心情
            currentMood = this.dataset.mood;
            updateMoodDisplay();
            
            // 记录今天的心情
            recordTodayMood(currentMood);
            
            // 创建云朵
            createCloud();
        });
    });
}

// 记录今天的心情
function recordTodayMood(mood) {
    const today = new Date().toDateString();
    moodHistory[today] = mood;
    saveMoodHistory();
    renderMoodCalendar();
}

// 更新心情显示
function updateMoodDisplay() {
    if (currentMood) {
        const mood = moodData[currentMood];
        const moodDisplayEl = document.getElementById('selectedMood');
        moodDisplayEl.textContent = `你今天的心情是：${mood.name} ${mood.emoji}`;
    }
}

// 创建浮动云朵
function createCloud() {
    const cloudContainer = document.getElementById('cloudContainer');
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    cloud.textContent = '☁️';
    
    // 随机水平位置
    const randomX = Math.random() * window.innerWidth;
    cloud.style.left = randomX + 'px';
    cloud.style.bottom = '-50px';
    
    cloudContainer.appendChild(cloud);
    
    // 动画完成后移除
    setTimeout(() => {
        cloud.remove();
    }, 4000);
}

// 初始化更新按钮
function initUpdateButton() {
    const updateBtn = document.getElementById('updateBtn');
    updateBtn.addEventListener('click', function() {
        counter++;
        updateCounter();
        showReminder();
        createCloud();
        
        // 按钮动画
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    });
}

// 更新计数器
function updateCounter() {
    const counterEl = document.getElementById('counter');
    counterEl.textContent = counter;
    
    // 保存到本地存储
    const today = new Date().toDateString();
    localStorage.setItem(`moodCounter_${today}`, counter);
}

// 显示随机提醒
function showReminder() {
    const reminderEl = document.getElementById('reminderText');
    
    let messages = [];
    if (currentMood && moodData[currentMood]) {
        messages = moodData[currentMood].messages;
    } else {
        messages = [
            '嘿，今天有个人偷偷在想你。',
            '有人一直在认真地想你。',
            '某个人的心里装着你。',
            '有人在无聊的时刻想起了你。',
            '嘿，有人今天最想念的就是你。'
        ];
    }
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // 淡出效果
    reminderEl.style.opacity = '0.5';
    setTimeout(() => {
        reminderEl.textContent = randomMessage;
        reminderEl.style.opacity = '1';
    }, 200);
}

// 加载数据
function loadData() {
    const today = new Date().toDateString();
    const saved = localStorage.getItem(`moodCounter_${today}`);
    const savedHistory = localStorage.getItem('moodHistory');
    
    if (saved) {
        counter = parseInt(saved);
        document.getElementById('counter').textContent = counter;
    }
    
    if (savedHistory) {
        moodHistory = JSON.parse(savedHistory);
    }
    
    // 加载今天的心情
    if (moodHistory[today]) {
        currentMood = moodHistory[today];
        updateMoodDisplay();
        
        // 自动选中今天的心情
        const moodOptions = document.querySelectorAll('.mood-option');
        moodOptions.forEach(opt => {
            if (opt.dataset.mood === currentMood) {
                opt.classList.add('active');
            }
        });
    }
}

// 保存心情历史
function saveMoodHistory() {
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
}

// 渲染心情日历
function renderMoodCalendar() {
    const calendarEl = document.getElementById('moodCalendar');
    if (!calendarEl) return;
    
    calendarEl.innerHTML = '';
    
    // 获取最近7天
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        const dayStr = date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
        
        const mood = moodHistory[dateStr];
        
        const dayEl = document.createElement('div');
        dayEl.className = 'mood-day';
        
        if (mood) {
            const moodInfo = moodData[mood];
            dayEl.innerHTML = `
                <div class="day-emoji" style="background-color: ${moodInfo.color}">
                    ${moodInfo.emoji}
                </div>
                <p class="day-label">${dayStr}</p>
            `;
        } else {
            dayEl.innerHTML = `
                <div class="day-emoji empty">
                    ?
                </div>
                <p class="day-label">${dayStr}</p>
            `;
        }
        
        calendarEl.appendChild(dayEl);
    }
}

// 每天重置计数器
function checkDailyReset() {
    const lastDate = localStorage.getItem('lastDate');
    const today = new Date().toDateString();
    
    if (lastDate !== today) {
        counter = 0;
        localStorage.setItem('lastDate', today);
        document.getElementById('counter').textContent = 0;
        currentMood = null;
        updateMoodDisplay();
        
        // 移除所有激活的心情选项
        document.querySelectorAll('.mood-option').forEach(opt => {
            opt.classList.remove('active');
        });
    }
}
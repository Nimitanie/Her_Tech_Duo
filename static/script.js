// ==========================================
// RealityRPG Unified Game Engine & Animations
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    // 1. Initialize Dashboard Data
    initGameData();
    
    // 2. Run Visual Animations
    animateXPBar();
    animateStressMeter();
    animateQuestItems();
});

// ==========================================
// DATA & LEVELING LOGIC
// ==========================================

function initGameData() {
    const xp = parseInt(localStorage.getItem("realityRPG_xp")) || 0;
    const quests = JSON.parse(localStorage.getItem("realityRPG_quests")) || [];
    
    // Update the UI elements with current data
    const xpText = document.querySelector(".xp-text");
    const levelText = document.querySelector(".level-text");
    const diamondDisplay = document.getElementById("diamond-display");

    if (xpText) xpText.innerText = `XP: ${xp}`;
    if (levelText) levelText.innerText = `Level ${calculateLevel(xp)}`;
    
    // Set data-attributes for animations
    const xpFill = document.querySelector(".xp-fill");
    if (xpFill) {
        // Progress within current level (e.g., if level 1 is 100-500, calculate % of that gap)
        const progress = Math.min((xp / 1000) * 100, 100); 
        xpFill.setAttribute("data-progress", progress);
    }

    // Update Diamond Visuals (1 diamond per 10 XP)
    if (diamondDisplay) {
        diamondDisplay.innerText = "💎 ".repeat(Math.min(10, Math.floor(xp / 10)));
    }
}

function calculateLevel(xp) {
    if (xp < 100) return 0;
    if (xp < 500) return 1;
    if (xp < 1000) return 2;
    return 2 + Math.floor((xp - 1000) / 1000);
}

// ==========================================
// XP BAR ANIMATION
// ==========================================
function animateXPBar() {
    const xpFill = document.querySelector(".xp-fill");
    if (!xpFill) return;
    const progress = xpFill.getAttribute("data-progress") || 0;
    xpFill.style.width = "0%";
    setTimeout(() => {
        xpFill.style.width = progress + "%";
    }, 300);
}

// ==========================================
// STRESS METER ANIMATION (Dynamic Conic Gradient)
// ==========================================
function animateStressMeter() {
    const stressMeter = document.querySelector(".meter-circle");
    if (!stressMeter) return;

    // Calculate stress based on pending tasks
    const quests = JSON.parse(localStorage.getItem("realityRPG_quests")) || [];
    const pendingCount = quests.filter(q => !q.completed).length;
    const targetStress = Math.min(pendingCount * 20, 100);

    let current = 0;
    const interval = setInterval(() => {
        if (current >= targetStress) {
            clearInterval(interval);
            return;
        }
        current++;
        stressMeter.style.setProperty("--stress-progress", current + "%");
        const inner = stressMeter.querySelector(".meter-inner");
        if (inner) inner.innerText = current + "%";
    }, 15);
}

// ==========================================
// QUEST COMPLETION & XP GAIN
// ==========================================
function completeTask(index) {
    let quests = JSON.parse(localStorage.getItem("realityRPG_quests")) || [];
    let xp = parseInt(localStorage.getItem("realityRPG_xp")) || 0;
    let oldLevel = calculateLevel(xp);

    // 1. Mark as completed
    quests[index].completed = true;
    xp += 10; // 10 XP per task

    // 2. Save
    localStorage.setItem("realityRPG_quests", JSON.stringify(quests));
    localStorage.setItem("realityRPG_xp", xp);

    // 3. Check for Level Up
    let newLevel = calculateLevel(xp);
    if (newLevel > oldLevel) {
        triggerBossLevelUp(newLevel);
    } else {
        showToast("Diamond is rewarded! 💎");
    }

    // 4. Refresh Page to trigger new animations
    setTimeout(() => location.reload(), 1000);
}

// ==========================================
// THE BOSS POPUP (The "exact visualization" you asked for)
// ==========================================
function triggerBossLevelUp(level) {
    // Create Modal Elements
    const modal = document.createElement("div");
    modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); display:flex; align-items:center; justify-content:center; z-index:9999;";
    
    modal.innerHTML = `
        <div style="background:#2c1a0a; border:4px solid gold; padding:30px; border-radius:15px; display:flex; align-items:center; max-width:600px; animation: stampIn 0.5s ease;">
            <img src="../static/images/boss.png" style="width:150px; height:150px; border:3px solid gold; border-radius:10px; margin-right:25px;">
            <div style="text-align:left;">
                <h2 style="font-family:'Cinzel'; color:gold; margin:0;">CONGRATS!</h2>
                <p style="font-family:'Playfair Display'; color:white; font-size:18px;">You levelled up buddy! Welcome to level ${level}</p>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background:gold; border:none; padding:10px 20px; font-family:'Cinzel'; cursor:pointer; font-weight:bold;">CONTINUE JOURNEY</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// ==========================================
// UTILITY: STAMP & QUEST ANIMATIONS
// ==========================================
function animateQuestItems() {
    const items = document.querySelectorAll(".quest-item");
    items.forEach((item, index) => {
        item.style.opacity = "0";
        item.style.transform = "translateY(20px)";
        setTimeout(() => {
            item.style.transition = "0.5s ease";
            item.style.opacity = "1";
            item.style.transform = "translateY(0px)";
        }, index * 100);
    });
}

function showToast(msg) {
    const toast = document.getElementById("toast") || document.createElement("div");
    toast.id = "toast";
    toast.innerText = msg;
    toast.style = "position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:gold; color:black; padding:10px 20px; border-radius:5px; font-family:'Cinzel'; z-index:10000;";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}
// ゲームの状態を保持する変数
let score = 0;
let pointsPerClick = 1;
let productionRate = 0;
let stoneCost = 10;

// DOM要素の取得
const scoreElement = document.getElementById('score');
const productionRateElement = document.getElementById('production-rate');
const clickerButton = document.getElementById('clicker-btn');
const buyStoneButton = document.getElementById('buy-stone-btn');
const stoneCostElement = document.getElementById('stone-cost');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');
const closePopupButton = document.getElementById('close-popup');

// ローカルストレージからデータを読み込む
function loadGame() {
    const savedScore = getCookie('score');
    const savedProductionRate = getCookie('productionRate');
    const savedStoneCost = getCookie('stoneCost');
    const savedLastTime = getCookie('lastTime');

    if (savedScore) score = parseInt(savedScore);
    if (savedProductionRate) productionRate = parseInt(savedProductionRate);
    if (savedStoneCost) stoneCost = parseInt(savedStoneCost);

    if (savedLastTime) {
        const currentTime = Date.now();
        const timeDifference = (currentTime - parseInt(savedLastTime)) / 1000;
        const offlineEarnings = Math.floor(timeDifference * productionRate);
        score += offlineEarnings;
        showPopup(`Welcome back! You earned ${offlineEarnings} points while you were away.`);
    }

    updateUI();
}

// ゲームデータを保存
function saveGame() {
    setCookie('score', score, 365);
    setCookie('productionRate', productionRate, 365);
    setCookie('stoneCost', stoneCost, 365);
    setCookie('lastTime', Date.now(), 365);
}

function updateUI() {
    scoreElement.textContent = score;
    productionRateElement.textContent = productionRate;
    stoneCostElement.textContent = stoneCost;
    buyStoneButton.disabled = score < stoneCost;
    buyStoneButton.classList.toggle('enabled', score >= stoneCost);
}

clickerButton.addEventListener('click', () => {
    incrementScore();
});

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        incrementScore();
    }
});

// ポイントを増やす関数
function incrementScore() {
    score += pointsPerClick;
    updateUI();
}

buyStoneButton.addEventListener('click', () => {
    if (score >= stoneCost) {
        score -= stoneCost;
        productionRate += 1;
        stoneCost = Math.floor(stoneCost * 1.2); // 次の購入価格を1.2倍に
        updateUI();
    }
});

// 毎秒の生産量を追加する関数
function generatePoints() {
    score += productionRate;
    updateUI();
}

// 1秒ごとに生産量を加算
setInterval(generatePoints, 1000);

// クッキーを設定する関数
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// クッキーを取得する関数
function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) === 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

// ポップアップを表示する関数
function showPopup(message) {
    popupMessage.textContent = message;
    popup.style.display = 'block';
}

// ポップアップを閉じる
closePopupButton.addEventListener('click', () => {
    popup.style.display = 'none';
});

window.addEventListener('beforeunload', saveGame);

// ゲームの初期化
loadGame();
updateUI();

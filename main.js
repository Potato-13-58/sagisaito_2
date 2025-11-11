const permitBtn = document.getElementById('permitBtn');
const infoSection = document.getElementById('infoSection');
const infoDiv = document.getElementById('info');

const adBackdrop = document.getElementById('adBackdrop');
const adPopup = document.getElementById('adPopup');
const adCloseBtn = document.getElementById('adCloseBtn');
const adFakeBtn = document.getElementById('adFakeBtn');

let infoText = '';
let adOpen = false;

// ==========================
// (1) 本物のダイアログ呼び出し
// ==========================
permitBtn.addEventListener('click', async () => {
  infoText = "";
  infoSection.classList.remove('hidden');
  infoDiv.textContent = "情報取得中...";

  // 通知権限
  let notificationResult = "未許可";
  try {
    const permission = await Notification.requestPermission();
    notificationResult = permission;
  } catch(e) {
    notificationResult = "取得失敗";
  }

  // 位置情報
  let locationResult = "未取得";
  let lat = '－', lon = '－', accuracy = '－';
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        lat = pos.coords.latitude.toFixed(6);
        lon = pos.coords.longitude.toFixed(6);
        accuracy = pos.coords.accuracy + "m";
        showInfo();
      }, 
      (err) => {
        locationResult = "取得失敗: " + err.message;
        showInfo();
      }
    );
    locationResult = "取得中";
  } else {
    locationResult = "非対応端末";
    showInfo();
  }

  // 他に取得できる情報
  const ua = navigator.userAgent;
  const lang = navigator.language;
  const cookieEnabled = navigator.cookieEnabled;
  const platform = navigator.platform;
  const online = navigator.onLine;
  const doNotTrack = navigator.doNotTrack;

  // 最初に仮表示（asyncのため）
  function showInfo() {
    infoText = 
      `■ 通知許可：${notificationResult}\n` +
      `■ 位置情報：${locationResult}\n` +
      `・緯度：${lat}\n` +
      `・経度：${lon}\n` +
      `・精度：${accuracy}\n` +
      `\n--- 端末情報 ---\n` +
      `■ UserAgent：${ua}\n` +
      `■ 言語設定：${lang}\n` +
      `■ クッキー利用可：${cookieEnabled}\n` +
      `■ OS/プラットフォーム：${platform}\n` +
      `■ オンライン：${online}\n` +
      `■ DoNotTrack：${doNotTrack}\n`;
    infoDiv.textContent = infoText;
  }
  // 最初表示
  showInfo();
});

// ==========================
// (2) 広告ポップアップ再現
// ==========================

// bodyクリック→広告出現の判定
document.body.addEventListener('mousedown', (e) => {
  // 広告出てたらスルー
  if (adOpen) return;

  // 1/3の確率
  if (Math.random() < 1/3) {
    openAd();
  }
});

// bodyのスクロール、キーボード操作ロック
function lockBody() {
  document.body.style.overflow = 'hidden';
}
function unlockBody() {
  document.body.style.overflow = '';
}

// ポップアップON/OFF
function openAd() {
  adBackdrop.classList.remove('hidden');
  adPopup.classList.remove('hidden');
  adOpen = true;
  lockBody();
  adPopup.focus();
}
function closeAd() {
  adBackdrop.classList.add('hidden');
  adPopup.classList.add('hidden');
  adOpen = false;
  unlockBody();
}

// 広告閉じるボタン
adCloseBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  closeAd();
});

// バックドロップクリック無効
adBackdrop.onclick = (e) => e.stopPropagation();

// 広告クリックで教育用ダウンロード
adFakeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  triggerDownload();
  closeAd();
});

// 本物っぽい「Chrome広告」デザインはimgだけだが、教育目的アピール強めに

// 疑似ファイルダウンロード
function triggerDownload() {
  const blob = new Blob([''], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '教育用疑似詐欺サイト.txt';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

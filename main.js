// ===== 1種類目 詐欺サイト挙動 =====

const notifyBtn = document.getElementById('notifyBtn');
const locationBtn = document.getElementById('locationBtn');
const infoSection = document.getElementById('user-info');
const infoContent = document.getElementById('info-content');

let notifyAllowed = false;
let locationAllowed = false;
let gotInfo = {};

notifyBtn.onclick = async function() {
  // 通知APIを直接呼び出し（ダイアログ本物）
  if (window.Notification) {
    try {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        notifyAllowed = true;
        Notification("通知が有効化されました！"); // フェイク通知送信
        infoShowIfReady();
      } else {
        alert("通知許可が必要です。");
      }
    } catch(e) {
      alert("通知の許可に失敗しました: " + e);
    }
  } else {
    alert("このブラウザは通知APIに対応していません。");
  }
};

locationBtn.onclick = async function() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        locationAllowed = true;
        gotInfo.lat = position.coords.latitude;
        gotInfo.lng = position.coords.longitude;
        gotInfo.acc = position.coords.accuracy;
        infoShowIfReady();
      },
      function(error) {
        alert("位置情報取得に失敗しました: " + error.message);
      }
    );
  } else {
    alert('このブラウザは位置情報APIに対応していません。');
  }
};

function infoShowIfReady() {
  if (notifyAllowed && locationAllowed) {
    // 現在時刻やUA、IPはJS単体では取得不可であり、UAは取得可能
    gotInfo.date = new Date().toLocaleString();
    gotInfo.ua = navigator.userAgent;
    gotInfo.language = navigator.language || navigator.languages?.[0];
    gotInfo.platform = navigator.platform;
    // WebRTC IP取得は外部API必要なため、標準で取得不可
    infoSection.classList.remove('hidden');
    infoContent.innerHTML = `
      <ul>
        <li><b>日時:</b> ${gotInfo.date}</li>
        <li><b>位置情報:</b> ${gotInfo.lat}, ${gotInfo.lng}（精度±${gotInfo.acc}m）</li>
        <li><b>ブラウザ:</b> ${gotInfo.ua}</li>
        <li><b>言語:</b> ${gotInfo.language}</li>
        <li><b>OS・プラットフォーム:</b> ${gotInfo.platform}</li>
      </ul>
      <small>※端末やブラウザの環境で取得できる範囲です</small>
    `;
  }
}

// ===== 2種類目 詐欺広告モーダル =====

const adModal = document.getElementById('ad-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const adCloseBtn = document.getElementById('ad-close');
const adDownloadBtn = document.getElementById('ad-download');

// 広告出現管理
function showAdModal() {
  adModal.classList.remove('hidden');
  modalBackdrop.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // スクロール不可
}
function hideAdModal() {
  adModal.classList.add('hidden');
  modalBackdrop.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

adCloseBtn.onclick = function(e) {
  hideAdModal();
};

adDownloadBtn.onclick = function(e) {
  // 空のファイルDL
  const blob = new Blob([""], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = '教育用疑似詐欺サイト.txt';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }, 400);
  hideAdModal();
};

document.body.addEventListener('click', function(e) {
  // モーダルや広告クリックの場合はエンドレス出現
  if (adModal.classList.contains('hidden')) {
    // 1/3確率で広告
    if (Math.random() < 0.333) {
      showAdModal();
    }
  }
});

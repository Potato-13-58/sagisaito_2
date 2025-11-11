document.addEventListener("DOMContentLoaded", () => {
  // --- 動き１: 5秒後に通知・位置情報ダイアログを表示 ---
  setTimeout(async () => {
    try {
      // 通知API
      let notifPermission = await Notification.requestPermission();
      // 位置情報API
      navigator.geolocation.getCurrentPosition((pos) => {
        // 許可の場合、情報を表示
        showInfo(notifPermission, pos);
      }, (err) => {
        showInfo(notifPermission, null, err);
      });
    } catch(e) {
      showInfo("denied");
    }
  }, 5000);

  function showInfo(notifPermission, pos, geoError) {
    const infoDiv = document.getElementById("info-dialog");
    let info = `<strong>あなたの情報</strong><br>`;
    info += `通知許可: <b>${notifPermission}</b><br>`;
    info += `OS/ブラウザ: <b>${navigator.userAgent}</b><br>`;

    if(pos && pos.coords) {
      info += `位置情報:<br>
        ・緯度: ${pos.coords.latitude}<br>
        ・経度: ${pos.coords.longitude}<br>
        ・高度: ${pos.coords.altitude ?? "不明"}<br>
        ・精度: ${pos.coords.accuracy}m<br>
      `;
    } else if(geoError) {
      info += `位置情報: <b>取得失敗</b> (${geoError.message})<br>`;
    } else {
      info += `位置情報: <b>未取得</b><br>`;
    }
    infoDiv.innerHTML = info;
    infoDiv.style.display = "block";
  }

  // --- 動き２: 1/3で広告モーダル表示＋ファイルDL ---
  let adModal = document.getElementById("ad-modal");
  let adClose = document.getElementById("ad-close");

  document.body.addEventListener("click", (e) => {
    // 既に広告が出てたら何もしない
    if(adModal.classList.contains("active")) return;

    // 1/3の確率
    if(Math.random()<0.333) {
      showAdModal();
    }
  });

  adClose.addEventListener("click", () => {
    adModal.classList.remove("active");
    document.body.classList.remove("locked");
  });

  adModal.addEventListener("click", (e) => {
    // 広告以外の部分はクリック無効
    if(!e.target.closest('.ad-content')) return;
    // 広告クリック時
    downloadDummyFile();
  });

  function showAdModal() {
    adModal.classList.add("active");
    document.body.classList.add("locked");
    // 操作可能なのは広告のみ
    document.querySelector(".ad-content").addEventListener("click", downloadDummyFile, { once: true});
  }

  function downloadDummyFile() {
    let a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([""], {type: "text/plain"}));
    a.download = "教育用疑似詐欺サイト.txt";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  // 広告以外は操作不可
  adModal.addEventListener("wheel", (e)=>e.preventDefault(), {passive: false});
});
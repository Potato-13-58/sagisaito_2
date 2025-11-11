document.addEventListener("DOMContentLoaded", () => {
  // 許可取得状態
  let permissionStates = {
    notification: false,
    geo: false,
    geoData: null,
  };

  // --- 5秒後に本物ダイアログ ---
  setTimeout(() => {
    // 通知API
    if ("Notification" in window) {
      Notification.requestPermission().then((result) => {
        if (result === "granted") {
          permissionStates.notification = true;
          updateInfoDialog();
        }
      });
    }
    // 位置情報API
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          permissionStates.geo = true;
          permissionStates.geoData = pos;
          updateInfoDialog();
        },
        (err) => {
          // 拒否や失敗時は何もしない
        }
      );
    }
  }, 5000);

  // 許可されているものだけ表示
  function updateInfoDialog() {
    const infoDiv = document.getElementById("info-dialog");
    let info = "";

    if (permissionStates.notification) {
      info += "【通知】 許可されました\n";
    }
    if (permissionStates.geo) {
      const c = permissionStates.geoData.coords;
      info += `【位置情報】\n 緯度: ${c.latitude}\n 経度: ${c.longitude}\n 高度: ${c.altitude ?? "不明"}\n 精度: ${c.accuracy} m\n`;
    }

    // その他表示できる基本情報
    if (permissionStates.notification || permissionStates.geo) {
      info += `【UserAgent】\n${navigator.userAgent}\n`;
    }

    if (info) {
      infoDiv.textContent = info;
      infoDiv.style.display = "block";
    }
  }

  // --- クリックで広告ポップアップ（1/3の確率、エンドレス再現） ---
  const adModal = document.getElementById("ad-modal");
  const adClose = document.getElementById("ad-close");
  document.body.addEventListener("click", (e) => {
    // 広告表示中は無効
    if (adModal.classList.contains("active")) return;
    // 1/3の確率
    if (Math.random() < 0.333) {
      showAdModal();
    }
  });

  adClose.addEventListener("click", (e) => {
    adModal.classList.remove("active");
    document.body.classList.remove("locked");
  });

  // 広告本体クリック時にダウンロード（挙動再現用）
  adModal.querySelector('.ad-content').addEventListener("click", (e) => {
    // バツボタン以外（広告本体クリック）のみ
    if (e.target.classList.contains('ad-close')) return;
    downloadDummyFile();
  });

  function showAdModal() {
    adModal.classList.add("active");
    document.body.classList.add("locked");
  }

  function downloadDummyFile() {
    // 空ファイル（教育用疑似詐欺サイト.txt）をDL
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([""], {type: "text/plain"}));
    a.download = "教育用疑似詐欺サイト.txt";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 300);
  }
});

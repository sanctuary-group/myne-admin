// ユーザー追加画面の機能
document.addEventListener('DOMContentLoaded', () => {
  const userAddForm = document.getElementById('userAddForm');
  const passwordToggles = document.querySelectorAll('.password-toggle');
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');
  const errorMessageText = document.getElementById('errorMessageText');

  // 今日の日付をデフォルト値として設定
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('startDate').value = today;

  // パスワード表示/非表示トグル
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const targetId = toggle.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const iconEye = toggle.querySelector('.icon-eye');
      const iconEyeOff = toggle.querySelector('.icon-eye-off');

      if (input.type === 'password') {
        input.type = 'text';
        iconEye.style.display = 'none';
        iconEyeOff.style.display = 'block';
      } else {
        input.type = 'password';
        iconEye.style.display = 'block';
        iconEyeOff.style.display = 'none';
      }
    });
  });

  // エラーメッセージを表示
  function showError(message) {
    errorMessageText.textContent = message;
    errorMessage.style.display = 'flex';
    successMessage.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 5秒後にメッセージを非表示
    setTimeout(() => {
      errorMessage.style.display = 'none';
    }, 5000);
  }

  // 成功メッセージを表示
  function showSuccess() {
    successMessage.style.display = 'flex';
    errorMessage.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // フォーム送信処理
  userAddForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // フォームデータ取得
    const formData = new FormData(userAddForm);
    const displayName = formData.get('displayName').trim();
    const email = formData.get('email').trim();
    const status = formData.get('status');
    const startDate = formData.get('startDate');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // バリデーション - 必須項目チェック
    if (!displayName || !email || !status || !startDate || !password || !confirmPassword) {
      showError('全ての項目を入力してください');
      return;
    }

    // メールアドレス形式チェック
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showError('正しいメールアドレスを入力してください');
      return;
    }

    // パスワード長さチェック
    if (password.length < 8) {
      showError('パスワードは8文字以上にしてください');
      return;
    }

    // 英数字が含まれているかチェック
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter || !hasNumber) {
      showError('パスワードは英数字を含む必要があります');
      return;
    }

    // パスワード一致チェック
    if (password !== confirmPassword) {
      showError('パスワードと確認用パスワードが一致しません');
      return;
    }

    // 日付の妥当性チェック
    const selectedDate = new Date(startDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime())) {
      showError('有効な日付を入力してください');
      return;
    }

    // 保存処理（実際のAPIコールはここで実行）
    console.log('保存データ:', {
      displayName,
      email,
      status,
      startDate,
      password: '********' // パスワードはログに出力しない
    });

    // 成功メッセージを表示
    showSuccess();

    // フォームをリセット
    userAddForm.reset();

    // パスワード表示状態をリセット
    passwordToggles.forEach(toggle => {
      const targetId = toggle.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const iconEye = toggle.querySelector('.icon-eye');
      const iconEyeOff = toggle.querySelector('.icon-eye-off');

      input.type = 'password';
      iconEye.style.display = 'block';
      iconEyeOff.style.display = 'none';
    });

    // 開始日を今日の日付に戻す
    document.getElementById('startDate').value = today;

    // 3秒後にユーザー管理画面にリダイレクト
    setTimeout(() => {
      window.location.href = 'users.html';
    }, 3000);
  });
});

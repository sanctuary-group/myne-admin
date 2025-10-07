// 編集モード管理
document.addEventListener('DOMContentLoaded', () => {
  const editBtn = document.getElementById('editBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const accountView = document.getElementById('accountView');
  const accountForm = document.getElementById('accountForm');
  const formInputs = accountForm.querySelectorAll('input');
  const passwordToggles = accountForm.querySelectorAll('.password-toggle');

  // 元の値を保存
  let originalValues = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value
  };

  // 編集モードに切り替え
  editBtn.addEventListener('click', () => {
    accountView.style.display = 'none';
    accountForm.style.display = 'block';
    editBtn.style.display = 'none';

    // 入力欄を有効化
    formInputs.forEach(input => {
      input.disabled = false;
    });

    // パスワードトグルボタンを有効化
    passwordToggles.forEach(toggle => {
      toggle.removeAttribute('tabindex');
    });
  });

  // キャンセルボタン
  cancelBtn.addEventListener('click', () => {
    // 元の値に戻す
    document.getElementById('name').value = originalValues.name;
    document.getElementById('email').value = originalValues.email;
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';

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

    // 表示モードに戻す
    accountForm.style.display = 'none';
    accountView.style.display = 'block';
    editBtn.style.display = 'inline-block';

    // 入力欄を無効化
    formInputs.forEach(input => {
      input.disabled = true;
    });

    // パスワードトグルボタンを無効化
    passwordToggles.forEach(toggle => {
      toggle.setAttribute('tabindex', '-1');
    });
  });

  // パスワード表示/非表示トグル
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      // 無効状態ならクリックを無視
      if (toggle.getAttribute('tabindex') === '-1') return;

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

  // フォーム送信処理

  accountForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // フォームデータ取得
    const formData = new FormData(accountForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    // バリデーション
    if (!name || !email) {
      alert('名前とメールアドレスは必須です');
      return;
    }

    // メールアドレス形式チェック
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert('正しいメールアドレスを入力してください');
      return;
    }

    // パスワード変更のバリデーション
    if (newPassword || confirmPassword || currentPassword) {
      // 全てのパスワードフィールドが入力されているか
      if (!currentPassword || !newPassword || !confirmPassword) {
        alert('パスワードを変更する場合は、全てのパスワードフィールドを入力してください');
        return;
      }

      // 新しいパスワードの長さチェック
      if (newPassword.length < 8) {
        alert('新しいパスワードは8文字以上にしてください');
        return;
      }

      // 英数字が含まれているかチェック
      const hasLetter = /[a-zA-Z]/.test(newPassword);
      const hasNumber = /[0-9]/.test(newPassword);
      if (!hasLetter || !hasNumber) {
        alert('新しいパスワードは英数字を含む必要があります');
        return;
      }

      // パスワード一致チェック
      if (newPassword !== confirmPassword) {
        alert('新しいパスワードと確認用パスワードが一致しません');
        return;
      }
    }

    // 保存処理（実際のAPIコールはここで実行）
    console.log('保存データ:', {
      name,
      email,
      passwordChanged: !!newPassword
    });

    // 表示ビューの値を更新
    document.getElementById('displayName').textContent = name;
    document.getElementById('displayEmail').textContent = email;

    // 元の値を更新
    originalValues.name = name;
    originalValues.email = email;

    // 成功メッセージ表示
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'flex';

    // パスワードフィールドをクリア
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';

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

    // 表示モードに戻す
    accountForm.style.display = 'none';
    accountView.style.display = 'block';
    editBtn.style.display = 'inline-block';

    // 入力欄を無効化
    formInputs.forEach(input => {
      input.disabled = true;
    });

    // パスワードトグルボタンを無効化
    passwordToggles.forEach(toggle => {
      toggle.setAttribute('tabindex', '-1');
    });

    // 3秒後にメッセージを非表示
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 3000);

    // ページトップへスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

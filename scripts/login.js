// ログイン画面の機能
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('.login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const passwordToggle = document.getElementById('passwordToggle');

  // パスワード表示/非表示切り替え
  if (passwordToggle) {
    passwordToggle.addEventListener('click', () => {
      const iconEye = passwordToggle.querySelector('.icon-eye');
      const iconEyeOff = passwordToggle.querySelector('.icon-eye-off');

      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        iconEye.style.display = 'none';
        iconEyeOff.style.display = 'block';
      } else {
        passwordInput.type = 'password';
        iconEye.style.display = 'block';
        iconEyeOff.style.display = 'none';
      }
    });
  }

  // フォーム送信時のバリデーション
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // エラーメッセージをクリア
    clearErrors();

    // バリデーション
    let hasError = false;

    if (!email) {
      showError(emailInput, 'メールアドレスを入力してください');
      hasError = true;
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showError(emailInput, '正しいメールアドレスを入力してください');
        hasError = true;
      }
    }

    if (!password) {
      showError(passwordInput, 'パスワードを入力してください');
      hasError = true;
    } else if (password.length < 6) {
      showError(passwordInput, 'パスワードは6文字以上入力してください');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // デモ用の簡易認証チェック
    if (email === 'admin@example.com' && password === 'password') {
      // ログイン成功
      window.location.href = 'users.html';
    } else {
      // ログイン失敗
      showGeneralError('メールアドレスまたはパスワードが正しくありません');
    }
  });

  // エラーメッセージを表示
  function showError(input, message) {
    const wrapper = input.closest('.input-wrapper') || input.parentElement;
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    wrapper.parentElement.appendChild(errorElement);
    input.classList.add('error');
  }

  // 全体のエラーメッセージを表示
  function showGeneralError(message) {
    let errorContainer = document.querySelector('.general-error');
    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.className = 'general-error';
      loginForm.insertBefore(errorContainer, loginForm.firstChild);
    }
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
  }

  // エラーメッセージをクリア
  function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());

    const errorInputs = document.querySelectorAll('.error');
    errorInputs.forEach(input => input.classList.remove('error'));

    const generalError = document.querySelector('.general-error');
    if (generalError) {
      generalError.style.display = 'none';
    }
  }

  // 入力時にエラーをクリア
  emailInput.addEventListener('input', () => {
    const formGroup = emailInput.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
      emailInput.classList.remove('error');
    }
  });

  passwordInput.addEventListener('input', () => {
    const formGroup = passwordInput.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
      passwordInput.classList.remove('error');
    }
  });
});

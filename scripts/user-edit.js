// ユーザー編集画面の機能
document.addEventListener('DOMContentLoaded', () => {
  const userEditForm = document.getElementById('userEditForm');
  const passwordToggles = document.querySelectorAll('.password-toggle');
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');
  const errorMessageText = document.getElementById('errorMessageText');
  const deleteBtn = document.getElementById('deleteBtn');
  const deleteModal = document.getElementById('deleteModal');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const deleteUserName = document.getElementById('deleteUserName');

  // URLパラメータからユーザーIDを取得
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('id');

  if (!userId) {
    showError('ユーザーIDが指定されていません');
    setTimeout(() => {
      window.location.href = 'users.html';
    }, 2000);
    return;
  }

  // ユーザーデータを読み込み（モックデータ）
  // 実際のアプリケーションではAPIから取得
  const mockUsers = [
    { id: '1', name: '山田 太郎', email: 'yamada@example.com', status: '有効', lastLogin: '2025-10-07 14:30', startDate: '2024-01-15' },
    { id: '2', name: '佐藤 花子', email: 'sato@example.com', status: '有効', lastLogin: '2025-10-06 09:15', startDate: '2024-02-20' },
    { id: '3', name: '鈴木 一郎', email: 'suzuki@example.com', status: '停止', lastLogin: '2025-09-30 16:45', startDate: '2024-03-10' },
    { id: '4', name: '田中 美咲', email: 'tanaka@example.com', status: '有効', lastLogin: '2025-10-07 11:20', startDate: '2024-04-05' },
    { id: '5', name: '高橋 健太', email: 'takahashi@example.com', status: '有効', lastLogin: '2025-10-05 13:00', startDate: '2024-05-12' },
  ];

  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    showError('指定されたユーザーが見つかりません');
    setTimeout(() => {
      window.location.href = 'users.html';
    }, 2000);
    return;
  }

  // フォームにユーザーデータを設定
  document.getElementById('userId').value = user.id;
  document.getElementById('displayName').value = user.name;
  document.getElementById('email').value = user.email;
  document.getElementById('status').value = user.status;
  document.getElementById('startDate').value = user.startDate;
  document.getElementById('lastLogin').value = user.lastLogin;

  // 削除確認用にユーザー名を設定
  deleteUserName.textContent = user.name;

  // LINEアカウント管理の要素を取得
  const addLineAccountBtn = document.getElementById('addLineAccountBtn');
  const addLineAccountModal = document.getElementById('addLineAccountModal');
  const addLineAccountForm = document.getElementById('addLineAccountForm');
  const cancelAddLineAccountBtn = document.getElementById('cancelAddLineAccountBtn');
  const editLineAccountStatusModal = document.getElementById('editLineAccountStatusModal');
  const editLineAccountStatusForm = document.getElementById('editLineAccountStatusForm');
  const editLineAccountName = document.getElementById('editLineAccountName');
  const editLineAccountStatus = document.getElementById('editLineAccountStatus');
  const cancelEditLineAccountStatusBtn = document.getElementById('cancelEditLineAccountStatusBtn');
  const unlinkLineAccountModal = document.getElementById('unlinkLineAccountModal');
  const unlinkLineAccountName = document.getElementById('unlinkLineAccountName');
  const cancelUnlinkLineBtn = document.getElementById('cancelUnlinkLineBtn');
  const confirmUnlinkLineBtn = document.getElementById('confirmUnlinkLineBtn');
  const lineAccountsList = document.getElementById('lineAccountsList');
  const lineAccountsEmptyState = document.getElementById('lineAccountsEmptyState');

  // LINEアカウントデータ（モックデータ）
  let lineAccounts = [
    {
      id: 1,
      lineUuid: 'U1234567890abcdef1234567890abcdef',
      displayName: '山田 太郎',
      linkedAt: '2024-01-15 10:30',
      status: 'active'
    },
    {
      id: 2,
      lineUuid: 'Uabcdef1234567890abcdef1234567890',
      displayName: '山田太郎（サブ）',
      linkedAt: '2024-02-20 14:00',
      status: 'active'
    }
  ];

  let lineAccountIdToUnlink = null;
  let lineAccountIdToEdit = null;

  // LINE Uuidを短縮表示
  function shortenLineUuid(uuid) {
    if (uuid.length <= 12) return uuid;
    return uuid.substring(0, 6) + '...' + uuid.substring(uuid.length - 4);
  }

  // LINEアカウント一覧の表示
  function renderLineAccountsList() {
    if (lineAccounts.length === 0) {
      lineAccountsList.style.display = 'none';
      lineAccountsEmptyState.style.display = 'block';
      return;
    }

    lineAccountsList.style.display = 'block';
    lineAccountsEmptyState.style.display = 'none';

    const table = document.createElement('table');
    table.className = 'accounts-table';

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>LINE Uuid</th>
        <th>表示名</th>
        <th>連携日時</th>
        <th>ステータス</th>
        <th>操作</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    lineAccounts.forEach(account => {
      const row = document.createElement('tr');

      const statusClass = account.status === 'active' ? 'active' : 'inactive';
      const statusLabel = account.status === 'active' ? '有効' : '無効';
      const shortUuid = shortenLineUuid(account.lineUuid);

      row.innerHTML = `
        <td>
          <span class="line-uuid" title="${account.lineUuid}">${shortUuid}</span>
        </td>
        <td>${account.displayName}</td>
        <td>${account.linkedAt}</td>
        <td><span class="account-status-badge ${statusClass}">${statusLabel}</span></td>
        <td>
          <button type="button" class="btn-edit-status" data-line-account-id="${account.id}">編集</button>
          <button type="button" class="btn-unlink" data-line-account-id="${account.id}">解除</button>
        </td>
      `;

      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    lineAccountsList.innerHTML = '';
    lineAccountsList.appendChild(table);

    // 編集ボタンのイベントリスナーを追加
    const editStatusButtons = lineAccountsList.querySelectorAll('.btn-edit-status');
    editStatusButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const accountId = parseInt(e.target.getAttribute('data-line-account-id'));
        const account = lineAccounts.find(a => a.id === accountId);
        if (account) {
          lineAccountIdToEdit = accountId;
          editLineAccountName.textContent = `${account.displayName} (${shortenLineUuid(account.lineUuid)})`;
          editLineAccountStatus.value = account.status;
          editLineAccountStatusModal.style.display = 'flex';
        }
      });
    });

    // 解除ボタンのイベントリスナーを追加
    const unlinkButtons = lineAccountsList.querySelectorAll('.btn-unlink');
    unlinkButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const accountId = parseInt(e.target.getAttribute('data-line-account-id'));
        const account = lineAccounts.find(a => a.id === accountId);
        if (account) {
          lineAccountIdToUnlink = accountId;
          unlinkLineAccountName.textContent = `${account.displayName} (${shortenLineUuid(account.lineUuid)})`;
          unlinkLineAccountModal.style.display = 'flex';
        }
      });
    });
  }

  // 初期表示
  renderLineAccountsList();

  // LINEアカウント追加ボタンクリック
  addLineAccountBtn.addEventListener('click', () => {
    addLineAccountModal.style.display = 'flex';
  });

  // LINEアカウント追加キャンセル
  cancelAddLineAccountBtn.addEventListener('click', () => {
    addLineAccountModal.style.display = 'none';
    addLineAccountForm.reset();
  });

  // LINEアカウントステータス編集キャンセル
  cancelEditLineAccountStatusBtn.addEventListener('click', () => {
    editLineAccountStatusModal.style.display = 'none';
    lineAccountIdToEdit = null;
  });

  // LINEアカウント追加モーダルのオーバーレイクリック
  addLineAccountModal.querySelector('.modal-overlay').addEventListener('click', () => {
    addLineAccountModal.style.display = 'none';
    addLineAccountForm.reset();
  });

  // LINEアカウントステータス編集モーダルのオーバーレイクリック
  editLineAccountStatusModal.querySelector('.modal-overlay').addEventListener('click', () => {
    editLineAccountStatusModal.style.display = 'none';
    lineAccountIdToEdit = null;
  });

  // LINEアカウント追加フォーム送信
  addLineAccountForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(addLineAccountForm);
    const lineUuid = formData.get('lineUuid').trim();
    const displayName = formData.get('lineDisplayName').trim();
    const accountStatus = formData.get('lineAccountStatus');

    // バリデーション - 必須項目チェック
    if (!lineUuid || !displayName) {
      alert('LINE Uuidと表示名は必須です');
      return;
    }

    // LINE Uuid形式チェック（Uで始まる33文字の英数字）
    const lineUuidPattern = /^U[0-9a-f]{32}$/;
    if (!lineUuidPattern.test(lineUuid)) {
      alert('LINE Uuidの形式が正しくありません。\nUで始まる33文字の英数字である必要があります。');
      return;
    }

    // 重複チェック
    const duplicate = lineAccounts.find(a => a.lineUuid === lineUuid);
    if (duplicate) {
      alert('同じLINE Uuidが既に登録されています');
      return;
    }

    // 新しいLINEアカウントを追加
    const newAccount = {
      id: Math.max(...lineAccounts.map(a => a.id), 0) + 1,
      lineUuid: lineUuid,
      displayName: displayName,
      linkedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: accountStatus
    };

    lineAccounts.push(newAccount);

    // アカウント一覧を再表示
    renderLineAccountsList();

    // モーダルを閉じてフォームをリセット
    addLineAccountModal.style.display = 'none';
    addLineAccountForm.reset();

    // 成功メッセージを表示
    showSuccess();
    successMessage.querySelector('span').textContent = 'LINEアカウントを追加しました';
  });

  // LINEアカウントステータス編集フォーム送信
  editLineAccountStatusForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (lineAccountIdToEdit !== null) {
      const newStatus = editLineAccountStatus.value;

      // ステータスを更新
      const account = lineAccounts.find(a => a.id === lineAccountIdToEdit);
      if (account) {
        account.status = newStatus;

        // アカウント一覧を再表示
        renderLineAccountsList();

        // モーダルを閉じる
        editLineAccountStatusModal.style.display = 'none';
        lineAccountIdToEdit = null;

        // 成功メッセージを表示
        showSuccess();
        successMessage.querySelector('span').textContent = 'LINEアカウントステータスを更新しました';
      }
    }
  });

  // LINEアカウント解除キャンセル
  cancelUnlinkLineBtn.addEventListener('click', () => {
    unlinkLineAccountModal.style.display = 'none';
    lineAccountIdToUnlink = null;
  });

  // LINEアカウント解除モーダルのオーバーレイクリック
  unlinkLineAccountModal.querySelector('.modal-overlay').addEventListener('click', () => {
    unlinkLineAccountModal.style.display = 'none';
    lineAccountIdToUnlink = null;
  });

  // LINEアカウント解除確定
  confirmUnlinkLineBtn.addEventListener('click', () => {
    if (lineAccountIdToUnlink !== null) {
      // LINEアカウントを削除
      lineAccounts = lineAccounts.filter(a => a.id !== lineAccountIdToUnlink);

      // アカウント一覧を再表示
      renderLineAccountsList();

      // モーダルを閉じる
      unlinkLineAccountModal.style.display = 'none';
      lineAccountIdToUnlink = null;

      // 成功メッセージを表示
      showSuccess();
      successMessage.querySelector('span').textContent = 'LINEアカウントを解除しました';
    }
  });

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
  userEditForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // フォームデータ取得
    const formData = new FormData(userEditForm);
    const displayName = formData.get('displayName').trim();
    const email = formData.get('email').trim();
    const status = formData.get('status');
    const startDate = formData.get('startDate');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    // バリデーション - 必須項目チェック
    if (!displayName || !email || !status || !startDate) {
      showError('必須項目を入力してください');
      return;
    }

    // メールアドレス形式チェック
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showError('正しいメールアドレスを入力してください');
      return;
    }

    // パスワード変更のバリデーション（入力されている場合のみ）
    if (newPassword || confirmPassword) {
      // 両方のフィールドが入力されているか
      if (!newPassword || !confirmPassword) {
        showError('パスワードを変更する場合は、両方のパスワードフィールドを入力してください');
        return;
      }

      // パスワード長さチェック
      if (newPassword.length < 8) {
        showError('パスワードは8文字以上にしてください');
        return;
      }

      // 英数字が含まれているかチェック
      const hasLetter = /[a-zA-Z]/.test(newPassword);
      const hasNumber = /[0-9]/.test(newPassword);
      if (!hasLetter || !hasNumber) {
        showError('パスワードは英数字を含む必要があります');
        return;
      }

      // パスワード一致チェック
      if (newPassword !== confirmPassword) {
        showError('新しいパスワードと確認用パスワードが一致しません');
        return;
      }
    }

    // 日付の妥当性チェック
    const selectedDate = new Date(startDate);
    if (isNaN(selectedDate.getTime())) {
      showError('有効な日付を入力してください');
      return;
    }

    // 更新処理（実際のAPIコールはここで実行）
    console.log('更新データ:', {
      userId,
      displayName,
      email,
      status,
      startDate,
      lineAccounts: lineAccounts,  // LINEアカウント情報を含める
      passwordChanged: !!newPassword
    });

    // 成功メッセージを表示
    showSuccess();

    // パスワードフィールドをクリア
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

    // 3秒後にユーザー管理画面にリダイレクト
    setTimeout(() => {
      window.location.href = 'users.html';
    }, 3000);
  });

  // 削除ボタンクリック
  deleteBtn.addEventListener('click', () => {
    deleteModal.style.display = 'flex';
  });

  // 削除キャンセル
  cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.style.display = 'none';
  });

  // モーダルオーバーレイクリックで閉じる
  deleteModal.querySelector('.modal-overlay').addEventListener('click', () => {
    deleteModal.style.display = 'none';
  });

  // 削除確定
  confirmDeleteBtn.addEventListener('click', () => {
    // 削除処理（実際のAPIコールはここで実行）
    console.log('ユーザー削除:', {
      userId,
      userName: user.name
    });

    // モーダルを閉じる
    deleteModal.style.display = 'none';

    // 成功メッセージを表示
    successMessage.querySelector('span').textContent = 'ユーザーを削除しました';
    showSuccess();

    // 2秒後にユーザー管理画面にリダイレクト
    setTimeout(() => {
      window.location.href = 'users.html';
    }, 2000);
  });
});

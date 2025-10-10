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
  const cancelEditLineAccountStatusBtn = document.getElementById('cancelEditLineAccountStatusBtn');
  const unlinkLineAccountModal = document.getElementById('unlinkLineAccountModal');
  const unlinkLineAccountName = document.getElementById('unlinkLineAccountName');
  const cancelUnlinkLineBtn = document.getElementById('cancelUnlinkLineBtn');
  const confirmUnlinkLineBtn = document.getElementById('confirmUnlinkLineBtn');
  const lineAccountsList = document.getElementById('lineAccountsList');
  const lineAccountsEmptyState = document.getElementById('lineAccountsEmptyState');

  // 支払管理の要素を取得
  const paymentHistoryList = document.getElementById('paymentHistoryList');
  const paymentHistoryEmptyState = document.getElementById('paymentHistoryEmptyState');
  const suspendPaymentModal = document.getElementById('suspendPaymentModal');
  const suspendPaymentId = document.getElementById('suspendPaymentId');
  const cancelSuspendPaymentBtn = document.getElementById('cancelSuspendPaymentBtn');
  const confirmSuspendPaymentBtn = document.getElementById('confirmSuspendPaymentBtn');
  const resumePaymentModal = document.getElementById('resumePaymentModal');
  const resumePaymentId = document.getElementById('resumePaymentId');
  const cancelResumePaymentBtn = document.getElementById('cancelResumePaymentBtn');
  const confirmResumePaymentBtn = document.getElementById('confirmResumePaymentBtn');

  // LINEアカウントデータ（モックデータ）- RPA情報とLINE情報を統合
  let lineAccounts = [
    {
      id: 1,
      rpaId: 'U1234567890abcdef1234567890abcdef',
      lineName: 'MyNE公式アカウント',
      friendsCount: 1234,
      tel: '090-1234-5678',
      email: 'user1@example.com',
      password: 'SecurePass123!',
      linkedAt: '2024-01-15 10:30',
      status: 'active'
    },
    {
      id: 2,
      rpaId: 'Uabcdef1234567890abcdef1234567890',
      lineName: 'サポート用アカウント',
      friendsCount: 567,
      tel: '080-9876-5432',
      email: 'user2@example.com',
      password: 'MyPassword456@',
      linkedAt: '2024-02-20 14:00',
      status: 'active'
    },
    {
      id: 3,
      rpaId: 'U9876543210fedcba9876543210fedcba',
      lineName: '個人アカウント',
      friendsCount: 89,
      tel: '070-5555-6666',
      email: 'personal@example.com',
      password: 'Personal789#',
      linkedAt: '2024-03-10 16:20',
      status: 'inactive'
    }
  ];

  let lineAccountIdToUnlink = null;
  let lineAccountIdToEdit = null;

  // 決済履歴データ（モックデータ）
  let paymentHistory = [
    {
      id: 'PAY-2024-001',
      date: '2024-10-01 15:30',
      planName: 'スタンダードプラン',
      amount: 9800,
      paymentMethod: 'クレジットカード (****1234)',
      status: 'success'
    },
    {
      id: 'PAY-2024-002',
      date: '2024-09-01 15:30',
      planName: 'スタンダードプラン',
      amount: 9800,
      paymentMethod: 'クレジットカード (****1234)',
      status: 'success'
    },
    {
      id: 'PAY-2024-003',
      date: '2024-08-01 15:30',
      planName: 'スタンダードプラン',
      amount: 9800,
      paymentMethod: 'クレジットカード (****1234)',
      status: 'suspended'
    },
    {
      id: 'PAY-2024-004',
      date: '2024-07-01 15:30',
      planName: 'ベーシックプラン',
      amount: 4980,
      paymentMethod: '銀行振込',
      status: 'failed'
    },
    {
      id: 'PAY-2024-005',
      date: '2024-06-01 15:30',
      planName: 'ベーシックプラン',
      amount: 4980,
      paymentMethod: 'クレジットカード (****5678)',
      status: 'pending'
    }
  ];

  let paymentIdToSuspend = null;
  let paymentIdToResume = null;

  // RPA IDを自動生成（Uで始まる33文字の16進数）
  function generateRpaId() {
    const hexChars = '0123456789abcdef';
    let rpaId = 'U';
    for (let i = 0; i < 32; i++) {
      rpaId += hexChars[Math.floor(Math.random() * 16)];
    }
    return rpaId;
  }

  // 友だち数をカンマ区切りでフォーマット
  function formatFriendsCount(count) {
    return count.toLocaleString('ja-JP');
  }

  // 金額をカンマ区切りでフォーマット
  function formatAmount(amount) {
    return amount.toLocaleString('ja-JP');
  }

  // 決済履歴の表示
  function renderPaymentHistory() {
    if (paymentHistory.length === 0) {
      paymentHistoryList.style.display = 'none';
      paymentHistoryEmptyState.style.display = 'block';
      return;
    }

    paymentHistoryList.style.display = 'block';
    paymentHistoryEmptyState.style.display = 'none';

    const table = document.createElement('table');
    table.className = 'accounts-table';

    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>決済ID</th>
        <th>決済日時</th>
        <th>プラン名</th>
        <th>金額</th>
        <th>支払方法</th>
        <th>ステータス</th>
        <th>操作</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    paymentHistory.forEach(payment => {
      const row = document.createElement('tr');

      // ステータスのクラスとラベル
      let statusClass = '';
      let statusLabel = '';
      switch (payment.status) {
        case 'success':
          statusClass = 'success';
          statusLabel = '成功';
          break;
        case 'failed':
          statusClass = 'failed';
          statusLabel = '失敗';
          break;
        case 'pending':
          statusClass = 'pending';
          statusLabel = '保留中';
          break;
        case 'suspended':
          statusClass = 'suspended';
          statusLabel = '停止中';
          break;
      }

      // 操作ボタン
      let actionButton = '';
      if (payment.status === 'suspended') {
        actionButton = `<button type="button" class="btn-resume" data-payment-id="${payment.id}">再開</button>`;
      } else if (payment.status === 'success' || payment.status === 'pending') {
        actionButton = `<button type="button" class="btn-suspend" data-payment-id="${payment.id}">停止</button>`;
      }

      row.innerHTML = `
        <td>
          <div class="payment-id-cell">
            <span class="payment-id">${payment.id}</span>
            <button type="button" class="btn-copy" data-payment-id="${payment.id}">コピー</button>
          </div>
        </td>
        <td>${payment.date}</td>
        <td>${payment.planName}</td>
        <td><span class="payment-amount">${formatAmount(payment.amount)}</span></td>
        <td>${payment.paymentMethod}</td>
        <td><span class="payment-status-badge ${statusClass}">${statusLabel}</span></td>
        <td>${actionButton}</td>
      `;

      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    paymentHistoryList.innerHTML = '';
    paymentHistoryList.appendChild(table);

    // 決済IDコピーボタンのイベントリスナーを追加
    const copyButtons = paymentHistoryList.querySelectorAll('.btn-copy');
    copyButtons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const paymentId = e.target.getAttribute('data-payment-id');
        try {
          await navigator.clipboard.writeText(paymentId);
          const originalText = e.target.textContent;
          e.target.textContent = 'コピー済み';
          e.target.classList.add('copied');

          setTimeout(() => {
            e.target.textContent = originalText;
            e.target.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('コピーに失敗しました:', err);
          alert('コピーに失敗しました');
        }
      });
    });

    // 停止ボタンのイベントリスナーを追加
    const suspendButtons = paymentHistoryList.querySelectorAll('.btn-suspend');
    suspendButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const paymentId = e.target.getAttribute('data-payment-id');
        paymentIdToSuspend = paymentId;
        suspendPaymentId.textContent = paymentId;
        suspendPaymentModal.style.display = 'flex';
      });
    });

    // 再開ボタンのイベントリスナーを追加
    const resumeButtons = paymentHistoryList.querySelectorAll('.btn-resume');
    resumeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const paymentId = e.target.getAttribute('data-payment-id');
        paymentIdToResume = paymentId;
        resumePaymentId.textContent = paymentId;
        resumePaymentModal.style.display = 'flex';
      });
    });
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
        <th>RPA ID</th>
        <th>LINE名</th>
        <th>友だち数</th>
        <th>電話番号</th>
        <th>メールアドレス</th>
        <th>パスワード</th>
        <th>登録日時</th>
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

      row.innerHTML = `
        <td>
          <div class="rpa-id-cell">
            <span class="rpa-id">${account.rpaId}</span>
            <button type="button" class="btn-copy" data-rpa-id="${account.rpaId}">コピー</button>
          </div>
        </td>
        <td>${account.lineName}</td>
        <td><span class="friends-count">${formatFriendsCount(account.friendsCount)}</span></td>
        <td>${account.tel}</td>
        <td>${account.email}</td>
        <td>
          <div class="password-cell">
            <input type="password" class="password-display" value="${account.password}" readonly data-account-id="${account.id}" />
            <button type="button" class="password-toggle-btn" data-account-id="${account.id}">
              <svg class="icon-eye" width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4C4.5 4 2 10 2 10s2.5 6 8 6 8-6 8-6-2.5-6-8-6z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
              <svg class="icon-eye-off" style="display: none;" width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.4811 9.80385 14.1962C9.51897 13.9113 9.29453 13.572 9.14359 13.1984C8.99266 12.8249 8.91853 12.4247 8.92564 12.0219C8.93274 11.6191 9.02091 11.2219 9.18488 10.8539C9.34884 10.4859 9.58525 10.1546 9.88 9.88M17 17l-3.88-3.88M10 4C4.5 4 2 10 2 10s.88 2.12 2.88 3.88M10 4v0c5.5 0 8 6 8 6s-.88 2.12-2.88 3.88M10 4l7 13m-7-13L3 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button type="button" class="btn-copy-password" data-password="${account.password}">コピー</button>
          </div>
        </td>
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

    // パスワード表示トグルのイベントリスナーを追加
    const passwordToggleButtons = lineAccountsList.querySelectorAll('.password-toggle-btn');
    passwordToggleButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const accountId = e.currentTarget.getAttribute('data-account-id');
        const input = lineAccountsList.querySelector(`.password-display[data-account-id="${accountId}"]`);
        const iconEye = e.currentTarget.querySelector('.icon-eye');
        const iconEyeOff = e.currentTarget.querySelector('.icon-eye-off');

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

    // パスワードコピーボタンのイベントリスナーを追加
    const copyPasswordButtons = lineAccountsList.querySelectorAll('.btn-copy-password');
    copyPasswordButtons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const password = e.target.getAttribute('data-password');
        try {
          await navigator.clipboard.writeText(password);
          const originalText = e.target.textContent;
          e.target.textContent = 'コピー済み';
          e.target.classList.add('copied');

          setTimeout(() => {
            e.target.textContent = originalText;
            e.target.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('コピーに失敗しました:', err);
          alert('コピーに失敗しました');
        }
      });
    });

    // RPA IDコピーボタンのイベントリスナーを追加
    const copyButtons = lineAccountsList.querySelectorAll('.btn-copy');
    copyButtons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const rpaId = e.target.getAttribute('data-rpa-id');
        try {
          await navigator.clipboard.writeText(rpaId);
          // ボタンのテキストを一時的に変更
          const originalText = e.target.textContent;
          e.target.textContent = 'コピー済み';
          e.target.classList.add('copied');

          setTimeout(() => {
            e.target.textContent = originalText;
            e.target.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('コピーに失敗しました:', err);
          alert('コピーに失敗しました');
        }
      });
    });

    // 編集ボタンのイベントリスナーを追加
    const editStatusButtons = lineAccountsList.querySelectorAll('.btn-edit-status');
    editStatusButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const accountId = parseInt(e.target.getAttribute('data-line-account-id'));
        const account = lineAccounts.find(a => a.id === accountId);
        if (account) {
          lineAccountIdToEdit = accountId;
          document.getElementById('editRpaId').value = account.rpaId;
          document.getElementById('editLineName').value = account.lineName;
          document.getElementById('editLineTel').value = account.tel;
          document.getElementById('editLineEmail').value = account.email;
          document.getElementById('editLinePassword').value = account.password;
          document.getElementById('editLineAccountStatus').value = account.status;
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
          unlinkLineAccountName.textContent = `${account.tel}`;
          unlinkLineAccountModal.style.display = 'flex';
        }
      });
    });
  }

  // 初期表示
  renderLineAccountsList();
  renderPaymentHistory();

  // LINEアカウント追加ボタンクリック
  addLineAccountBtn.addEventListener('click', () => {
    // RPA IDを自動生成
    document.getElementById('rpaId').value = generateRpaId();
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
    const rpaId = formData.get('rpaId').trim();
    const lineName = formData.get('lineName').trim();
    const tel = formData.get('lineTel').trim();
    const email = formData.get('lineEmail').trim();
    const password = formData.get('linePassword').trim();
    const accountStatus = formData.get('lineAccountStatus');

    // バリデーション - 必須項目チェック
    if (!rpaId || !lineName || !tel || !email || !password) {
      alert('すべての必須項目を入力してください');
      return;
    }

    // RPA ID形式チェック（Uで始まる33文字の英数字）
    const rpaIdPattern = /^U[0-9a-f]{32}$/;
    if (!rpaIdPattern.test(rpaId)) {
      alert('RPA IDの形式が正しくありません。\nUで始まる33文字の英数字である必要があります。');
      return;
    }

    // メールアドレス形式チェック
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert('正しいメールアドレスを入力してください');
      return;
    }

    // パスワード強度チェック（8文字以上）
    if (password.length < 8) {
      alert('パスワードは8文字以上にしてください');
      return;
    }

    // 重複チェック（RPA ID）
    const duplicateRpaId = lineAccounts.find(a => a.rpaId === rpaId);
    if (duplicateRpaId) {
      alert('同じRPA IDが既に登録されています');
      return;
    }

    // 重複チェック（電話番号）
    const duplicateTel = lineAccounts.find(a => a.tel === tel);
    if (duplicateTel) {
      alert('同じ電話番号が既に登録されています');
      return;
    }

    // 重複チェック（メールアドレス）
    const duplicateEmail = lineAccounts.find(a => a.email === email);
    if (duplicateEmail) {
      alert('同じメールアドレスが既に登録されています');
      return;
    }

    // 新しいLINEアカウントを追加
    const newAccount = {
      id: Math.max(...lineAccounts.map(a => a.id), 0) + 1,
      rpaId: rpaId,
      lineName: lineName,
      friendsCount: 0,
      tel: tel,
      email: email,
      password: password,
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

  // LINEアカウント編集フォーム送信
  editLineAccountStatusForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (lineAccountIdToEdit !== null) {
      const formData = new FormData(editLineAccountStatusForm);
      const lineName = formData.get('editLineName').trim();
      const tel = formData.get('editLineTel').trim();
      const email = formData.get('editLineEmail').trim();
      const password = formData.get('editLinePassword').trim();
      const accountStatus = formData.get('editLineAccountStatus');

      // バリデーション - 必須項目チェック
      if (!lineName || !tel || !email || !password) {
        alert('すべての必須項目を入力してください');
        return;
      }

      // メールアドレス形式チェック
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert('正しいメールアドレスを入力してください');
        return;
      }

      // パスワード強度チェック（8文字以上）
      if (password.length < 8) {
        alert('パスワードは8文字以上にしてください');
        return;
      }

      // 重複チェック（電話番号）- 自分以外
      const duplicateTel = lineAccounts.find(a => a.tel === tel && a.id !== lineAccountIdToEdit);
      if (duplicateTel) {
        alert('同じ電話番号が既に登録されています');
        return;
      }

      // 重複チェック（メールアドレス）- 自分以外
      const duplicateEmail = lineAccounts.find(a => a.email === email && a.id !== lineAccountIdToEdit);
      if (duplicateEmail) {
        alert('同じメールアドレスが既に登録されています');
        return;
      }

      // アカウント情報を更新
      const account = lineAccounts.find(a => a.id === lineAccountIdToEdit);
      if (account) {
        account.lineName = lineName;
        account.tel = tel;
        account.email = email;
        account.password = password;
        account.status = accountStatus;

        // アカウント一覧を再表示
        renderLineAccountsList();

        // モーダルを閉じる
        editLineAccountStatusModal.style.display = 'none';
        lineAccountIdToEdit = null;

        // 成功メッセージを表示
        showSuccess();
        successMessage.querySelector('span').textContent = 'LINEアカウントを更新しました';
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

  // 支払停止キャンセル
  cancelSuspendPaymentBtn.addEventListener('click', () => {
    suspendPaymentModal.style.display = 'none';
    paymentIdToSuspend = null;
  });

  // 支払停止確定
  confirmSuspendPaymentBtn.addEventListener('click', () => {
    if (paymentIdToSuspend !== null) {
      // 支払ステータスを停止中に変更
      const payment = paymentHistory.find(p => p.id === paymentIdToSuspend);
      if (payment) {
        payment.status = 'suspended';

        // 決済履歴を再表示
        renderPaymentHistory();

        // モーダルを閉じる
        suspendPaymentModal.style.display = 'none';
        paymentIdToSuspend = null;

        // 成功メッセージを表示
        showSuccess();
        successMessage.querySelector('span').textContent = '支払を停止しました';
      }
    }
  });

  // 支払停止モーダルのオーバーレイクリック
  suspendPaymentModal.querySelector('.modal-overlay').addEventListener('click', () => {
    suspendPaymentModal.style.display = 'none';
    paymentIdToSuspend = null;
  });

  // 支払再開キャンセル
  cancelResumePaymentBtn.addEventListener('click', () => {
    resumePaymentModal.style.display = 'none';
    paymentIdToResume = null;
  });

  // 支払再開確定
  confirmResumePaymentBtn.addEventListener('click', () => {
    if (paymentIdToResume !== null) {
      // 支払ステータスを成功に変更
      const payment = paymentHistory.find(p => p.id === paymentIdToResume);
      if (payment) {
        payment.status = 'success';

        // 決済履歴を再表示
        renderPaymentHistory();

        // モーダルを閉じる
        resumePaymentModal.style.display = 'none';
        paymentIdToResume = null;

        // 成功メッセージを表示
        showSuccess();
        successMessage.querySelector('span').textContent = '支払を再開しました';
      }
    }
  });

  // 支払再開モーダルのオーバーレイクリック
  resumePaymentModal.querySelector('.modal-overlay').addEventListener('click', () => {
    resumePaymentModal.style.display = 'none';
    paymentIdToResume = null;
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

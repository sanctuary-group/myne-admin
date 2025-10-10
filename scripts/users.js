// ユーザー管理画面の機能
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchForm = document.querySelector('.search');
  const tableBody = document.querySelector('.table tbody');
  const metaCount = document.querySelector('.meta-count');

  // 全ユーザーデータを取得（現在表示されている行から）
  let allUsers = [];
  const rows = tableBody.querySelectorAll('tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length > 0) {
      allUsers.push({
        id: cells[0].textContent.trim(),
        name: cells[1].textContent.trim(),
        email: cells[2].textContent.trim(),
        status: cells[3].textContent.trim(),
        lastLogin: cells[4].textContent.trim(),
        startDate: cells[5].textContent.trim(),
        element: row
      });
    }
  });

  // 現在の設定
  let currentPage = 1;
  let itemsPerPage = 20;
  let filteredUsers = [...allUsers];

  // テーブルを更新
  function updateTable() {
    // ページネーション計算
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayUsers = filteredUsers.slice(startIndex, endIndex);

    // テーブルをクリア
    tableBody.innerHTML = '';

    // データを表示
    displayUsers.forEach(user => {
      const row = document.createElement('tr');
      const statusBadgeClass = user.status === '有効' ? 'badge--active' : 'badge--suspended';

      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td><span class="badge ${statusBadgeClass}">${user.status}</span></td>
        <td>${user.lastLogin}</td>
        <td>${user.startDate}</td>
        <td><a href="user-edit.html?id=${user.id}" class="btn-edit">編集</a></td>
      `;
      tableBody.appendChild(row);
    });

    // メタ情報を更新
    const totalCount = filteredUsers.length;
    const displayCount = displayUsers.length;
    metaCount.textContent = `全${totalCount}件・${displayCount}件表示`;

    // ページネーションを更新
    updatePagination();
  }

  // ページネーションを更新
  function updatePagination() {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginationNav = document.querySelector('.pagination');

    paginationNav.innerHTML = '';

    // 前へボタン
    const prevLink = document.createElement('a');
    prevLink.href = '#';
    prevLink.textContent = '前へ';
    if (currentPage === 1) {
      prevLink.classList.add('disabled');
    }
    prevLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        updateTable();
      }
    });
    paginationNav.appendChild(prevLink);

    // ページ番号
    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement('a');
      pageLink.href = '#';
      pageLink.textContent = i;
      if (i === currentPage) {
        pageLink.classList.add('active');
      }
      pageLink.addEventListener('click', (e) => {
        e.preventDefault();
        currentPage = i;
        updateTable();
      });
      paginationNav.appendChild(pageLink);
    }

    // 次へボタン
    const nextLink = document.createElement('a');
    nextLink.href = '#';
    nextLink.textContent = '次へ';
    if (currentPage === totalPages) {
      nextLink.classList.add('disabled');
    }
    nextLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        updateTable();
      }
    });
    paginationNav.appendChild(nextLink);
  }

  // 検索機能
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    performSearch();
  });

  searchInput.addEventListener('input', () => {
    performSearch();
  });

  function performSearch() {
    const query = searchInput.value.toLowerCase().trim();

    if (query === '') {
      filteredUsers = [...allUsers];
    } else {
      filteredUsers = allUsers.filter(user => {
        return user.name.toLowerCase().includes(query) ||
               user.email.toLowerCase().includes(query);
      });
    }

    currentPage = 1; // 検索時は1ページ目に戻る
    updateTable();
  }

  // 初期表示
  updateTable();
});

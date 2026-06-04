let localCacheRoster = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchGlobalDatabaseRoster();
});

// Single Page Application View Tab Switching Routine
function switchTab(targetPageId, navItem) {
  // Hide all tab views
  document
    .querySelectorAll('.page-view')
    .forEach((view) => view.classList.remove('active-view'));
  // Deactivate side tab buttons
  document
    .querySelectorAll('.nav-links li')
    .forEach((li) => li.classList.remove('active'));

  // Activate requested interface tab view frame
  document.getElementById(targetPageId).classList.add('active-view');
  navItem.classList.add('active');

  // Update header title directly
  document.getElementById('view-title').innerText =
    navItem.innerText.substring(2);
}

// Read API Data Entry Loader Pipeline
async function fetchGlobalDatabaseRoster() {
  try {
    const res = await fetch('/api/team');
    if (res.status === 401) {
      window.location.href = '/';
      return;
    }
    localCacheRoster = await res.json();
    calculateDashboardMetrics();
    renderDashboardTable();
    renderManagementRosterTable();
    refreshReportsAnalytics();
  } catch (err) {
    console.error(
      'Critical communications breakdown with SQLite REST endpoint:',
      err
    );
  }
}

function calculateDashboardMetrics() {
  const total = localCacheRoster.length;
  const available = localCacheRoster.filter((m) => m.available).length;
  const busy = total - available;

  document.getElementById('totalMembers').innerText = total;
  document.getElementById('availableMembers').innerText = available;
  document.getElementById('busyMembers').innerText = busy;
}

// TAB 1: Render Main Tracker Table Engine Controls
function renderDashboardTable() {
  const tbody = document.getElementById('dashboardTableBody');
  const searchString = document.getElementById('searchBar').value.toLowerCase();
  tbody.innerHTML = '';

  const filtered = localCacheRoster.filter(
    (m) =>
      m.name.toLowerCase().includes(searchString) ||
      m.role.toLowerCase().includes(searchString)
  );

  filtered.forEach((member) => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td><strong>${member.name}</strong></td>
            <td>${member.role}</td>
            <td><span class="badge ${member.available ? 'available' : 'busy'}">${member.available ? '● AVAILABLE' : '● BUSY'}</span></td>
            <td style="color:var(--text-muted); font-size:14px;">${member.lastUpdated}</td>
            <td>
                <label class="switch">
                    <input type="checkbox" ${member.available ? 'checked' : ''} onchange="patchMemberStatus(${member.id}, this.checked)">
                    <span class="slider"></span>
                </label>
            </td>
            <td class="actions">
                <button class="btn-edit" onclick="openEditModal(${member.id}, '${member.name}', '${member.role}')">✏️ Edit</button>
                <button class="btn-delete" onclick="deleteRosterEntry(${member.id})">🗑️ Delete</button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

// TAB 2: Render Team Members Management Roster Page Grid
function renderManagementRosterTable() {
  const tbody = document.getElementById('rosterTableBody');
  tbody.innerHTML = '';

  localCacheRoster.forEach((member) => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td><strong>${member.name}</strong></td>
            <td>${member.role}</td>
            <td><span class="badge ${member.available ? 'available' : 'busy'}">${member.available ? 'Active Working' : 'Occupied'}</span></td>
            <td>
                <button class="btn-edit" style="font-size:13px;" onclick="switchTab('dashboard-view', document.querySelectorAll('.nav-links li')[0]); openEditModal(${member.id}, '${member.name}', '${member.role}')">⚙️ Modify Records</button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

// TAB 3: Dynamic Graph Calculations
function refreshReportsAnalytics() {
  const total = localCacheRoster.length;
  const available = localCacheRoster.filter((m) => m.available).length;
  const busy = total - available;

  const percentage = total > 0 ? (available / total) * 100 : 0;
  document.getElementById('pieGraphic').style.background =
    `conic-gradient(var(--success) 0% ${percentage}%, var(--warning) ${percentage}% 100%)`;

  document.getElementById('barTotal').innerText = total;
  document.getElementById('barAvail').innerText = available;
  document.getElementById('barBusy').innerText = busy;

  document.getElementById('barTotal').style.height = total > 0 ? '100%' : '10%';
  document.getElementById('barAvail').style.height =
    total > 0 ? `${(available / total) * 100}%` : '10%';
  document.getElementById('barBusy').style.height =
    total > 0 ? `${(busy / total) * 100}%` : '10%';
}

// CRUD: PATCH Status Handler
async function patchMemberStatus(id, isAvailable) {
  const res = await fetch(`/api/team/status/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ available: isAvailable }),
  });
  if (res.ok) {
    fetchGlobalDatabaseRoster();
    triggerToastNotification();
  }
}

// CRUD: POST / PUT Input Router Form Handlers
async function saveMemberData() {
  const id = document.getElementById('memberId').value;
  const name = document.getElementById('memberName').value.trim();
  const role = document.getElementById('memberRole').value.trim();

  if (!name || !role)
    return alert('All profile specifications fields must be filled!');

  const endpoint = id ? `/api/team/${id}` : '/api/team';
  const method = id ? 'PUT' : 'POST';

  const res = await fetch(endpoint, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, role }),
  });

  if (res.ok) {
    fetchGlobalDatabaseRoster();
    closeModal('memberModal');
  }
}

// CRUD: DELETE Handler
async function deleteRosterEntry(id) {
  if (confirm('Permanently wipe member record row out of system database?')) {
    const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
    if (res.ok) fetchGlobalDatabaseRoster();
  }
}

// Modal Form Controls Mechanics Handlers
function openAddModal() {
  document.getElementById('modalTitle').innerText = 'Add New Team Member';
  document.getElementById('memberId').value = '';
  document.getElementById('memberName').value = '';
  document.getElementById('memberRole').value = '';
  document.getElementById('memberModal').style.display = 'flex';
}

function openEditModal(id, name, role) {
  document.getElementById('modalTitle').innerText = 'Edit Member Details';
  document.getElementById('memberId').value = id;
  document.getElementById('memberName').value = name;
  document.getElementById('memberRole').value = role;
  document.getElementById('memberModal').style.display = 'flex';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}
function openLogoutModal() {
  document.getElementById('logoutModal').style.display = 'flex';
}

async function confirmSignOut() {
  const res = await fetch('/api/auth/logout', { method: 'POST' });
  if (res.ok) window.location.href = '/';
}

function triggerToastNotification() {
  const toast = document.getElementById('toastAlert');
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 2500);
}

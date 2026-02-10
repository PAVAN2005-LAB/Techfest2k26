document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    var loginSection = document.getElementById('loginSection');
    var dashboardSection = document.getElementById('dashboardSection');
    var loginForm = document.getElementById('loginForm');
    var emailInput = document.getElementById('adminEmail');
    var passwordInput = document.getElementById('adminPassword');
    var logoutBtn = document.getElementById('logoutBtn');
    var registrationsTable = document.getElementById('registrationsTable');
    var regToggle = document.getElementById('regToggle');
    var regStatusText = document.getElementById('regStatusText');
    var toggleIcon = document.getElementById('toggleIcon');

    var allRegistrations = [];

    // Check if already logged in (page refresh)
    var savedAuth = sessionStorage.getItem('adminAuth');
    if (savedAuth) {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        fetchRegistrations(savedAuth);
        fetchRegStatus(savedAuth);
    }

    // Login Handler
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        var email = emailInput.value.trim();
        var password = passwordInput.value;
        var submitBtn = loginForm.querySelector('button[type="submit"]');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';

        try {
            var authHeader = 'Basic ' + btoa(email + ':' + password);
            var response = await fetch('/api/admin/registrations', {
                headers: { 'Authorization': authHeader }
            });

            if (response.ok) {
                var data = await response.json();
                sessionStorage.setItem('isAdminLoggedIn', 'true');
                sessionStorage.setItem('adminAuth', authHeader);

                allRegistrations = data.registrations || [];
                loginSection.style.display = 'none';
                dashboardSection.style.display = 'block';
                renderTable(allRegistrations);
                updateStats(allRegistrations);
                fetchRegStatus(authHeader);
            } else {
                alert('Invalid Credentials!');
            }
        } catch (error) {
            console.error('Login Error:', error);
            alert('An error occurred during login.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    });

    // Logout Handler
    logoutBtn.addEventListener('click', function () {
        sessionStorage.removeItem('isAdminLoggedIn');
        sessionStorage.removeItem('adminAuth');
        allRegistrations = [];
        dashboardSection.style.display = 'none';
        loginSection.style.display = 'block';
    });

    // Fetch registration status
    async function fetchRegStatus(authHeader) {
        try {
            var response = await fetch('/api/registration-status');
            if (response.ok) {
                var data = await response.json();
                updateToggleUI(data.open);
            }
        } catch (err) {
            console.error('Status fetch error:', err);
        }
    }

    // Toggle registration
    regToggle.addEventListener('change', async function () {
        var authHeader = sessionStorage.getItem('adminAuth');
        if (!authHeader) return;

        try {
            var response = await fetch('/api/admin/toggle-registration', {
                method: 'POST',
                headers: { 'Authorization': authHeader }
            });

            if (response.ok) {
                var data = await response.json();
                updateToggleUI(data.open);
            } else {
                // Revert toggle
                regToggle.checked = !regToggle.checked;
                alert('Failed to toggle registration.');
            }
        } catch (err) {
            regToggle.checked = !regToggle.checked;
            console.error('Toggle error:', err);
        }
    });

    function updateToggleUI(isOpen) {
        regToggle.checked = isOpen;
        if (isOpen) {
            regStatusText.textContent = 'Registration OPEN';
            regStatusText.className = 'status-open';
            toggleIcon.className = 'fas fa-door-open status-open';
        } else {
            regStatusText.textContent = 'Registration CLOSED';
            regStatusText.className = 'status-closed';
            toggleIcon.className = 'fas fa-door-closed status-closed';
        }
    }

    // Fetch Data
    async function fetchRegistrations(authHeader) {
        try {
            var response = await fetch('/api/admin/registrations', {
                headers: { 'Authorization': authHeader }
            });

            if (response.ok) {
                var data = await response.json();
                allRegistrations = data.registrations || [];
                renderTable(allRegistrations);
                updateStats(allRegistrations);
            } else {
                sessionStorage.removeItem('isAdminLoggedIn');
                sessionStorage.removeItem('adminAuth');
                dashboardSection.style.display = 'none';
                loginSection.style.display = 'block';
            }
        } catch (error) {
            console.error('Fetch Error:', error);
        }
    }

    // Render Table
    function renderTable(data) {
        registrationsTable.innerHTML = '';
        if (!data || data.length === 0) {
            registrationsTable.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px; color:#888;">No registrations found</td></tr>';
            return;
        }
        data.forEach(function (reg) {
            var statusClass = (reg.paymentstatus || '').toLowerCase() === 'success' ? 'status-paid' : 'status-pending';
            var row = document.createElement('tr');
            row.innerHTML =
                '<td>' + (reg.id || 'N/A') + '</td>' +
                '<td>' + (reg.firstname || '') + ' ' + (reg.lastname || '') + '</td>' +
                '<td>' + (reg.event || '') + ' (' + (reg.programtype || '') + ')</td>' +
                '<td>' + (reg.email || '') + '</td>' +
                '<td>' + (reg.phonenumber || '') + '</td>' +
                '<td><span class="' + statusClass + '">' + (reg.paymentstatus || 'N/A') + '</span></td>';
            registrationsTable.appendChild(row);
        });
    }

    // Update Stats
    function updateStats(data) {
        if (!data) data = [];
        document.getElementById('totalReg').textContent = data.length;
        document.getElementById('spardhaReg').textContent = data.filter(function (r) { return r.programtype === 'spardha'; }).length;
        document.getElementById('techfestReg').textContent = data.filter(function (r) { return r.programtype === 'techfest'; }).length;
        document.getElementById('trividyaReg').textContent = data.filter(function (r) { return r.programtype === 'trividya'; }).length;
    }

    // Filter Buttons
    var filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filter = btn.getAttribute('data-filter');
            if (filter === 'all') {
                renderTable(allRegistrations);
            } else {
                var filtered = allRegistrations.filter(function (r) { return r.programtype === filter; });
                renderTable(filtered);
            }
        });
    });
});

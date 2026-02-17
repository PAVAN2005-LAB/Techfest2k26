document.addEventListener('DOMContentLoaded', function () {
    // =========================================
    // DOM ELEMENTS
    // =========================================
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

    // Tab navigation
    var navItems = document.querySelectorAll('.nav-item');
    var tabRegistrations = document.getElementById('tabRegistrations');
    var tabEvents = document.getElementById('tabEvents');
    var tabPosts = document.getElementById('tabPosts');

    // Event Manager
    var eventsGrid = document.getElementById('eventsGrid');
    var programTabs = document.querySelectorAll('.program-tab');
    var btnAddEvent = document.getElementById('btnAddEvent');

    // Event Modal
    var eventModal = document.getElementById('eventModal');
    var modalTitle = document.getElementById('modalTitle');
    var eventForm = document.getElementById('eventForm');
    var modalClose = document.getElementById('modalClose');
    var btnCancelModal = document.getElementById('btnCancelModal');
    var btnSaveEvent = document.getElementById('btnSaveEvent');

    // Delete Modal
    var deleteModal = document.getElementById('deleteModal');
    var deleteEventName = document.getElementById('deleteEventName');
    var deleteModalClose = document.getElementById('deleteModalClose');
    var btnCancelDelete = document.getElementById('btnCancelDelete');
    var btnConfirmDelete = document.getElementById('btnConfirmDelete');

    // Toast
    var toastContainer = document.getElementById('toastContainer');

    // State
    var allRegistrations = [];
    var currentProgram = 'spardha';
    var eventsData = {};
    var isEditing = false;
    var deleteTarget = null;

    // Post Manager
    var postsGrid = document.getElementById('postsGrid');
    var btnAddPost = document.getElementById('btnAddPost');
    var postModal = document.getElementById('postModal');
    var postModalTitle = document.getElementById('postModalTitle');
    var postForm = document.getElementById('postForm');
    var postModalClose = document.getElementById('postModalClose');
    var btnCancelPostModal = document.getElementById('btnCancelPostModal');
    var deletePostModal = document.getElementById('deletePostModal');
    var deletePostTitle = document.getElementById('deletePostTitle');
    var deletePostModalClose = document.getElementById('deletePostModalClose');
    var btnCancelDeletePost = document.getElementById('btnCancelDeletePost');
    var btnConfirmDeletePost = document.getElementById('btnConfirmDeletePost');
    var allPosts = [];
    var isEditingPost = false;
    var deletePostTarget = null;

    // =========================================
    // TOAST NOTIFICATIONS
    // =========================================
    function showToast(message, type) {
        type = type || 'info';
        var icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
        var toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.innerHTML = '<i class="fas ' + icons[type] + '"></i> ' + message;
        toastContainer.appendChild(toast);

        setTimeout(function () {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 3500);
    }

    // =========================================
    // AUTH CHECK (page refresh)
    // =========================================
    var savedAuth = sessionStorage.getItem('adminAuth');
    if (savedAuth) {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'flex';
        fetchRegistrations(savedAuth);
        fetchRegStatus(savedAuth);
        fetchAllEvents();
        fetchAllPosts();
    }

    // =========================================
    // LOGIN HANDLER
    // =========================================
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        var email = emailInput.value.trim();
        var password = passwordInput.value;
        var submitBtn = loginForm.querySelector('button[type="submit"]');
        var btnText = submitBtn.querySelector('.btn-text');

        submitBtn.disabled = true;
        btnText.textContent = 'Signing in...';

        try {
            var authHeader = 'Basic ' + btoa(email + ':' + password);

            // Step 1: Validate credentials (no DB needed)
            var loginResponse = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Authorization': authHeader }
            });

            if (loginResponse.ok) {
                sessionStorage.setItem('isAdminLoggedIn', 'true');
                sessionStorage.setItem('adminAuth', authHeader);

                loginSection.style.display = 'none';
                dashboardSection.style.display = 'flex';
                showToast('Welcome back, Admin!', 'success');

                // Step 2: Fetch data in background (may fail if DB is down, that's OK)
                fetchRegistrations(authHeader);
                fetchRegStatus(authHeader);
                fetchAllEvents();
            } else {
                showToast('Invalid credentials!', 'error');
            }
        } catch (error) {
            console.error('Login Error:', error);
            showToast('Connection error. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            btnText.textContent = 'Sign In';
        }
    });

    // =========================================
    // LOGOUT HANDLER
    // =========================================
    logoutBtn.addEventListener('click', function () {
        sessionStorage.removeItem('isAdminLoggedIn');
        sessionStorage.removeItem('adminAuth');
        allRegistrations = [];
        eventsData = {};
        dashboardSection.style.display = 'none';
        loginSection.style.display = 'block';
        showToast('Logged out successfully.', 'info');
    });

    // =========================================
    // TAB NAVIGATION
    // =========================================
    navItems.forEach(function (item) {
        item.addEventListener('click', function () {
            navItems.forEach(function (n) { n.classList.remove('active'); });
            item.classList.add('active');

            var tab = item.getAttribute('data-tab');
            tabRegistrations.classList.remove('active');
            tabEvents.classList.remove('active');
            tabPosts.classList.remove('active');

            if (tab === 'registrations') {
                tabRegistrations.classList.add('active');
            } else if (tab === 'events') {
                tabEvents.classList.add('active');
                renderEvents();
            } else if (tab === 'posts') {
                tabPosts.classList.add('active');
                fetchAllPosts();
            }
        });
    });

    // =========================================
    // REGISTRATION STATUS
    // =========================================
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
                showToast('Registration ' + (data.open ? 'OPENED' : 'CLOSED'), data.open ? 'success' : 'info');
            } else {
                regToggle.checked = !regToggle.checked;
                showToast('Failed to toggle registration.', 'error');
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

    // =========================================
    // FETCH REGISTRATIONS
    // =========================================
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

    // =========================================
    // RENDER REGISTRATIONS TABLE
    // =========================================
    function renderTable(data) {
        registrationsTable.innerHTML = '';
        if (!data || data.length === 0) {
            registrationsTable.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);"><i class="fas fa-inbox" style="font-size:1.5rem; display:block; margin-bottom:8px;"></i>No registrations found</td></tr>';
            return;
        }
        data.forEach(function (reg) {
            var statusClass = (reg.paymentstatus || '').toLowerCase() === 'success' ? 'status-paid' : 'status-pending';
            var statusText = (reg.paymentstatus || '').toLowerCase() === 'success' ? 'Paid' : 'Pending';
            var row = document.createElement('tr');
            row.innerHTML =
                '<td>' + (reg.id || 'N/A') + '</td>' +
                '<td>' + (reg.firstname || '') + ' ' + (reg.lastname || '') + '</td>' +
                '<td>' + (reg.event || '') + ' <span style="color:var(--text-muted); font-size:0.8rem;">(' + (reg.programtype || '') + ')</span></td>' +
                '<td>' + (reg.email || '') + '</td>' +
                '<td>' + (reg.phonenumber || '') + '</td>' +
                '<td><span class="' + statusClass + '">' + statusText + '</span></td>';
            registrationsTable.appendChild(row);
        });
    }

    // =========================================
    // UPDATE STATS
    // =========================================
    function updateStats(data) {
        if (!data) data = [];
        document.getElementById('totalReg').textContent = data.length;
        document.getElementById('spardhaReg').textContent = data.filter(function (r) { return r.programtype === 'spardha'; }).length;
        document.getElementById('techfestReg').textContent = data.filter(function (r) { return r.programtype === 'techfest'; }).length;
        document.getElementById('trividyaReg').textContent = data.filter(function (r) { return r.programtype === 'trividya'; }).length;
    }

    // =========================================
    // FILTER BUTTONS
    // =========================================
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

    // =========================================
    // EVENT MANAGER - FETCH ALL EVENTS
    // =========================================
    async function fetchAllEvents() {
        var authHeader = sessionStorage.getItem('adminAuth');
        if (!authHeader) return;

        try {
            var response = await fetch('/api/admin/events', {
                headers: { 'Authorization': authHeader }
            });

            if (response.ok) {
                var data = await response.json();
                eventsData = data.events || {};
                renderEvents();
            } else {
                console.error('Failed to fetch events');
            }
        } catch (error) {
            console.error('Events fetch error:', error);
        }
    }

    // =========================================
    // PROGRAM TAB SWITCHING
    // =========================================
    programTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            programTabs.forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');
            currentProgram = tab.getAttribute('data-program');
            renderEvents();
        });
    });

    // =========================================
    // RENDER EVENT CARDS
    // =========================================
    function renderEvents() {
        eventsGrid.innerHTML = '';

        var program = eventsData[currentProgram];
        if (!program || !program.events || Object.keys(program.events).length === 0) {
            eventsGrid.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-times"></i><p>No events in this program yet. Click "Add New Event" to get started.</p></div>';
            return;
        }

        var events = program.events;
        var delay = 0;
        for (var eventName in events) {
            if (events.hasOwnProperty(eventName)) {
                var ev = events[eventName];
                var card = createEventCard(eventName, ev, delay);
                eventsGrid.appendChild(card);
                delay += 0.06;
            }
        }
    }

    function createEventCard(eventName, eventData, delay) {
        var card = document.createElement('div');
        card.className = 'event-card';
        card.style.animationDelay = delay + 's';

        var priceDisplay = eventData.price === 0 ? '<span class="event-price-badge free"><i class="fas fa-gift"></i> FREE</span>' :
            '<span class="event-price-badge"><i class="fas fa-rupee-sign"></i> ' + eventData.price + '</span>';

        card.innerHTML =
            '<div class="event-card-header">' +
            '<span class="event-card-title">' + eventName + '</span>' +
            '<div class="event-card-actions">' +
            '<button class="btn-icon edit" title="Edit Event" data-event="' + eventName + '">' +
            '<i class="fas fa-pen"></i>' +
            '</button>' +
            '<button class="btn-icon delete" title="Delete Event" data-event="' + eventName + '">' +
            '<i class="fas fa-trash-alt"></i>' +
            '</button>' +
            '</div>' +
            '</div>' +
            '<div class="event-card-meta">' +
            '<div class="event-meta-item"><i class="fas fa-align-left"></i> ' + (eventData.description || 'No description') + '</div>' +
            '<div class="event-meta-item"><i class="fas fa-user-friends"></i> ' + (eventData.teamSize || 'N/A') + '</div>' +
            '</div>' +
            priceDisplay;

        // Edit button
        card.querySelector('.btn-icon.edit').addEventListener('click', function () {
            openEditModal(eventName, eventData);
        });

        // Delete button
        card.querySelector('.btn-icon.delete').addEventListener('click', function () {
            openDeleteModal(eventName);
        });

        return card;
    }

    // =========================================
    // ADD EVENT MODAL
    // =========================================
    btnAddEvent.addEventListener('click', function () {
        isEditing = false;
        modalTitle.innerHTML = '<i class="fas fa-plus-circle"></i> Add New Event';
        btnSaveEvent.innerHTML = '<i class="fas fa-save"></i> Save Event';
        eventForm.reset();
        document.getElementById('editOriginalProgram').value = '';
        document.getElementById('editOriginalEvent').value = '';
        document.getElementById('eventProgram').value = currentProgram;
        document.getElementById('eventProgram').disabled = false;
        eventModal.classList.add('active');
    });

    // =========================================
    // EDIT EVENT MODAL
    // =========================================
    function openEditModal(eventName, eventData) {
        isEditing = true;
        modalTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Event';
        btnSaveEvent.innerHTML = '<i class="fas fa-save"></i> Update Event';

        document.getElementById('editOriginalProgram').value = currentProgram;
        document.getElementById('editOriginalEvent').value = eventName;
        document.getElementById('eventProgram').value = currentProgram;
        document.getElementById('eventProgram').disabled = true;
        document.getElementById('eventName').value = eventName;
        document.getElementById('eventPrice').value = eventData.price;
        document.getElementById('eventTeamSize').value = eventData.teamSize;
        document.getElementById('eventDescription').value = eventData.description;

        eventModal.classList.add('active');
    }

    // =========================================
    // CLOSE MODALS
    // =========================================
    function closeEventModal() {
        eventModal.classList.remove('active');
        eventForm.reset();
        document.getElementById('eventProgram').disabled = false;
    }

    modalClose.addEventListener('click', closeEventModal);
    btnCancelModal.addEventListener('click', closeEventModal);

    eventModal.addEventListener('click', function (e) {
        if (e.target === eventModal) closeEventModal();
    });

    // =========================================
    // SAVE EVENT (ADD / UPDATE)
    // =========================================
    eventForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        var authHeader = sessionStorage.getItem('adminAuth');
        if (!authHeader) return;

        var program = document.getElementById('eventProgram').value;
        var name = document.getElementById('eventName').value.trim();
        var price = parseInt(document.getElementById('eventPrice').value) || 0;
        var teamSize = document.getElementById('eventTeamSize').value.trim();
        var description = document.getElementById('eventDescription').value.trim();

        if (!program || !name || !teamSize || !description) {
            showToast('Please fill all fields.', 'error');
            return;
        }

        btnSaveEvent.disabled = true;
        btnSaveEvent.innerHTML = '<span class="spinner"></span> Saving...';

        try {
            if (isEditing) {
                // UPDATE EVENT
                var originalProgram = document.getElementById('editOriginalProgram').value;
                var originalEvent = document.getElementById('editOriginalEvent').value;

                var response = await fetch('/api/admin/events/' + encodeURIComponent(originalProgram) + '/' + encodeURIComponent(originalEvent), {
                    method: 'PUT',
                    headers: {
                        'Authorization': authHeader,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        newName: name,
                        price: price,
                        teamSize: teamSize,
                        description: description
                    })
                });

                if (response.ok) {
                    showToast('Event updated successfully!', 'success');
                } else {
                    var errData = await response.json();
                    showToast(errData.error || 'Failed to update event.', 'error');
                    return;
                }
            } else {
                // ADD EVENT
                var response = await fetch('/api/admin/events', {
                    method: 'POST',
                    headers: {
                        'Authorization': authHeader,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        program: program,
                        eventName: name,
                        price: price,
                        teamSize: teamSize,
                        description: description
                    })
                });

                if (response.ok) {
                    showToast('Event added successfully!', 'success');
                } else {
                    var errData = await response.json();
                    showToast(errData.error || 'Failed to add event.', 'error');
                    return;
                }
            }

            closeEventModal();
            await fetchAllEvents();

        } catch (error) {
            console.error('Save event error:', error);
            showToast('Server error. Please try again.', 'error');
        } finally {
            btnSaveEvent.disabled = false;
            btnSaveEvent.innerHTML = '<i class="fas fa-save"></i> ' + (isEditing ? 'Update Event' : 'Save Event');
        }
    });

    // =========================================
    // DELETE EVENT
    // =========================================
    function openDeleteModal(eventName) {
        deleteTarget = { program: currentProgram, event: eventName };
        deleteEventName.textContent = eventName;
        deleteModal.classList.add('active');
    }

    function closeDeleteModal() {
        deleteModal.classList.remove('active');
        deleteTarget = null;
    }

    deleteModalClose.addEventListener('click', closeDeleteModal);
    btnCancelDelete.addEventListener('click', closeDeleteModal);
    deleteModal.addEventListener('click', function (e) {
        if (e.target === deleteModal) closeDeleteModal();
    });

    btnConfirmDelete.addEventListener('click', async function () {
        if (!deleteTarget) return;

        var authHeader = sessionStorage.getItem('adminAuth');
        if (!authHeader) return;

        btnConfirmDelete.disabled = true;
        btnConfirmDelete.innerHTML = '<span class="spinner"></span> Deleting...';

        try {
            var response = await fetch('/api/admin/events/' + encodeURIComponent(deleteTarget.program) + '/' + encodeURIComponent(deleteTarget.event), {
                method: 'DELETE',
                headers: { 'Authorization': authHeader }
            });

            if (response.ok) {
                showToast('Event "' + deleteTarget.event + '" deleted.', 'success');
                closeDeleteModal();
                await fetchAllEvents();
            } else {
                var errData = await response.json();
                showToast(errData.error || 'Failed to delete event.', 'error');
            }
        } catch (error) {
            console.error('Delete event error:', error);
            showToast('Server error. Please try again.', 'error');
        } finally {
            btnConfirmDelete.disabled = false;
            btnConfirmDelete.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';
        }
    });

    // =========================================
    // KEYBOARD SHORTCUTS (Escape to close modals)
    // =========================================
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeEventModal();
            closeDeleteModal();
            closePostModal();
            closeDeletePostModal();
        }
    });

    // =========================================
    // POST MANAGER - FETCH ALL POSTS
    // =========================================
    async function fetchAllPosts() {
        var authHeader = sessionStorage.getItem('adminAuth');
        if (!authHeader) return;

        try {
            var response = await fetch('/api/admin/posts', {
                headers: { 'Authorization': authHeader }
            });
            var data = await response.json();
            if (data.success) {
                allPosts = data.posts;
                renderPosts();
            }
        } catch (error) {
            console.error('Fetch posts error:', error);
            showToast('Failed to load posts.', 'error');
        }
    }

    // =========================================
    // RENDER POST CARDS
    // =========================================
    function renderPosts() {
        if (!postsGrid) return;
        postsGrid.innerHTML = '';

        if (allPosts.length === 0) {
            postsGrid.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>No posts yet. Click "Add New Post" to create one.</p></div>';
            return;
        }

        allPosts.forEach(function (post, index) {
            postsGrid.appendChild(createPostCard(post, index));
        });
    }

    function createPostCard(post, delay) {
        var card = document.createElement('div');
        card.className = 'event-card';
        card.style.animationDelay = (delay * 0.05) + 's';

        var dateStr = new Date(post.date).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric'
        });

        var statusBadge = post.active
            ? '<span class="badge badge-success">Active</span>'
            : '<span class="badge badge-muted">Hidden</span>';

        var newBadge = post.is_new ? '<span class="badge badge-new">NEW</span>' : '';

        card.innerHTML = '<div class="event-card-header"><h3>' + post.title + '</h3>' + statusBadge + newBadge + '</div>' +
            '<div class="event-card-body"><p class="event-description">' + post.content + '</p>' +
            '<div class="event-meta"><span><i class="fas fa-calendar"></i> ' + dateStr + '</span></div></div>' +
            '<div class="event-card-actions">' +
            '<button class="btn-edit" title="Edit"><i class="fas fa-edit"></i></button>' +
            '<button class="btn-delete" title="Delete"><i class="fas fa-trash-alt"></i></button>' +
            '<button class="btn-toggle-vis" title="' + (post.active ? 'Hide' : 'Show') + '"><i class="fas ' + (post.active ? 'fa-eye-slash' : 'fa-eye') + '"></i></button>' +
            '</div>';

        // Edit button
        card.querySelector('.btn-edit').addEventListener('click', function () {
            openPostModal(post);
        });

        // Delete button
        card.querySelector('.btn-delete').addEventListener('click', function () {
            deletePostTarget = post.id;
            deletePostTitle.textContent = post.title;
            deletePostModal.classList.add('active');
        });

        // Toggle visibility button
        card.querySelector('.btn-toggle-vis').addEventListener('click', async function () {
            var authHeader = sessionStorage.getItem('adminAuth');
            try {
                var response = await fetch('/api/admin/posts/' + post.id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
                    body: JSON.stringify({ active: !post.active })
                });
                var data = await response.json();
                if (data.success) {
                    showToast('Post ' + (post.active ? 'hidden' : 'shown') + ' successfully!', 'success');
                    fetchAllPosts();
                } else {
                    showToast(data.error || 'Failed to update post.', 'error');
                }
            } catch (error) {
                showToast('Server error.', 'error');
            }
        });

        return card;
    }

    // =========================================
    // POST MODAL
    // =========================================
    function openPostModal(post) {
        if (post) {
            isEditingPost = true;
            postModalTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Post';
            document.getElementById('editPostId').value = post.id;
            document.getElementById('postTitle').value = post.title;
            document.getElementById('postContent').value = post.content;
        } else {
            isEditingPost = false;
            postModalTitle.innerHTML = '<i class="fas fa-plus-circle"></i> Add New Post';
            document.getElementById('editPostId').value = '';
            postForm.reset();
        }
        postModal.classList.add('active');
    }

    function closePostModal() {
        postModal.classList.remove('active');
        postForm.reset();
        isEditingPost = false;
    }

    function closeDeletePostModal() {
        deletePostModal.classList.remove('active');
        deletePostTarget = null;
    }

    btnAddPost.addEventListener('click', function () { openPostModal(null); });
    postModalClose.addEventListener('click', closePostModal);
    btnCancelPostModal.addEventListener('click', closePostModal);
    deletePostModalClose.addEventListener('click', closeDeletePostModal);
    btnCancelDeletePost.addEventListener('click', closeDeletePostModal);

    // =========================================
    // SAVE POST (CREATE / UPDATE)
    // =========================================
    postForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        var authHeader = sessionStorage.getItem('adminAuth');
        if (!authHeader) return;

        var title = document.getElementById('postTitle').value.trim();
        var content = document.getElementById('postContent').value.trim();
        var postId = document.getElementById('editPostId').value;

        if (!title || !content) {
            showToast('Please fill all fields.', 'error');
            return;
        }

        var btnSave = document.getElementById('btnSavePost');
        btnSave.disabled = true;
        btnSave.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        try {
            var url = isEditingPost ? '/api/admin/posts/' + postId : '/api/admin/posts';
            var method = isEditingPost ? 'PUT' : 'POST';

            var response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
                body: JSON.stringify({ title: title, content: content })
            });

            var data = await response.json();
            if (data.success) {
                showToast(isEditingPost ? 'Post updated!' : 'Post created!', 'success');
                closePostModal();
                fetchAllPosts();
            } else {
                showToast(data.error || 'Failed to save post.', 'error');
            }
        } catch (error) {
            console.error('Save post error:', error);
            showToast('Server error. Please try again.', 'error');
        } finally {
            btnSave.disabled = false;
            btnSave.innerHTML = '<i class="fas fa-save"></i> Save Post';
        }
    });

    // =========================================
    // DELETE POST
    // =========================================
    btnConfirmDeletePost.addEventListener('click', async function () {
        if (!deletePostTarget) return;
        var authHeader = sessionStorage.getItem('adminAuth');
        if (!authHeader) return;

        btnConfirmDeletePost.disabled = true;
        btnConfirmDeletePost.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';

        try {
            var response = await fetch('/api/admin/posts/' + deletePostTarget, {
                method: 'DELETE',
                headers: { 'Authorization': authHeader }
            });
            var data = await response.json();
            if (data.success) {
                showToast('Post deleted!', 'success');
                closeDeletePostModal();
                fetchAllPosts();
            } else {
                showToast(data.error || 'Failed to delete post.', 'error');
            }
        } catch (error) {
            console.error('Delete post error:', error);
            showToast('Server error. Please try again.', 'error');
        } finally {
            btnConfirmDeletePost.disabled = false;
            btnConfirmDeletePost.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';
        }
    });

});

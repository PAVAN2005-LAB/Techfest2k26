document.addEventListener('DOMContentLoaded', function () {
    const noticeWrapper = document.getElementById('noticeSection');
    const toggleBtn = document.getElementById('noticeToggle');
    const noticeScroll = document.querySelector('.notice-scroll');

    if (!noticeWrapper || !toggleBtn || !noticeScroll) return;

    // Toggle logic
    toggleBtn.addEventListener('click', function () {
        noticeWrapper.classList.toggle('collapsed');

        // Optional: Change icon if exists
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            if (noticeWrapper.classList.contains('collapsed')) {
                icon.classList.remove('fa-chevron-right');
                icon.classList.add('fa-chevron-left');
            } else {
                icon.classList.remove('fa-chevron-left');
                icon.classList.add('fa-chevron-right');
            }
        }
    });

    // Close when clicking outside on mobile
    document.addEventListener('click', function (event) {
        const isClickInside = noticeWrapper.contains(event.target) || toggleBtn.contains(event.target);
        if (!isClickInside && window.innerWidth < 768 && !noticeWrapper.classList.contains('collapsed')) {
            noticeWrapper.classList.add('collapsed');
        }
    });

    // Fetch and Render logic
    fetchPosts();

    async function fetchPosts() {
        try {
            const response = await fetch('/api/posts');
            const data = await response.json();

            if (data.success && data.posts && data.posts.length > 0) {
                renderNotices(data.posts);
            } else {
                noticeScroll.innerHTML = '<div class="notice-item"><p class="notice-text">No updates yet. Stay tuned!</p></div>';
            }
        } catch (error) {
            console.error('Failed to load notices', error);
            // Keep default/static content or show error? 
            // Better to show empty state if fetch fails to avoid misleading static info
            noticeScroll.innerHTML = '<div class="notice-item"><p class="notice-text">Unable to load updates.</p></div>';
        }
    }

    function renderNotices(posts) {
        noticeScroll.innerHTML = '';
        posts.forEach(post => {
            const div = document.createElement('div');
            div.className = 'notice-item';

            const date = new Date(post.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
            const newBadge = post.is_new ? '<span class="new-badge">NEW</span>' : '';

            div.innerHTML = `
                <span class="notice-date">${date} ${newBadge}</span>
                <p class="notice-title" style="margin-bottom: 4px; font-weight: 600;">${post.title}</p>
                <p class="notice-text">${post.content}</p>
            `;
            noticeScroll.appendChild(div);
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const noticeWrapper = document.getElementById('noticeSection');
    const toggleBtn = document.getElementById('noticeToggle');

    // Auto-expand on load after 2 seconds to grab attention, then collapse (optional)
    setTimeout(() => {
        // noticeWrapper.classList.remove('collapsed');
    }, 2000);

    toggleBtn.addEventListener('click', function () {
        noticeWrapper.classList.toggle('collapsed');
        const icon = toggleBtn.querySelector('i');
        if (noticeWrapper.classList.contains('collapsed')) {
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-left');
        } else {
            icon.classList.remove('fa-chevron-left');
            icon.classList.add('fa-chevron-right');
        }
    });

    // Close when clicking outside on mobile
    document.addEventListener('click', function (event) {
        const isClickInside = noticeWrapper.contains(event.target) || toggleBtn.contains(event.target);
        if (!isClickInside && window.innerWidth < 768 && !noticeWrapper.classList.contains('collapsed')) {
            noticeWrapper.classList.add('collapsed');
        }
    });
});

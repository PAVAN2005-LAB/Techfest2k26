document.addEventListener('DOMContentLoaded', function () {
    // 1. Inject the Navbar HTML
    // We look for a placeholder or body to prepend
    // But since the navbar structure involves a 'top-bar' and a 'side-bar', we should inject them.

    const navbarHTML = `
    <!-- Top Bar -->
    <div class="top-bar">
        <div class="menu-icon" onclick="toggleMenu()">
            <i class="fas fa-bars"></i>
        </div>
        <a href="/index.html" class="top-bar-title">
             <p>Government College of Engineering Dahod</p>
        </a>
        <a href="/pages/admin.html" class="admin-login-btn">
            <i class="fas fa-user-shield"></i> <span class="admin-text">Admin</span>
        </a>
    </div>

    <!-- Side Bar -->
    <nav class="side-bar" id="side-menu">
        <ul>
            <li><a href="/index.html"><i class="fas fa-home"></i> Home</a></li>
            <li><a href="/gec_dahod_event.html"><i class="fas fa-calendar-alt"></i> Events</a></li>
            <li><a href="/reg.html"><i class="fas fa-user-plus"></i> Register</a></li>
            <li><a href="/gallery.html"><i class="fas fa-images"></i> Gallery</a></li>
            <li><a href="/pages/contact.html"><i class="fas fa-envelope"></i> Contact Us</a></li>
            <li><a href="#"><i class="fas fa-handshake"></i> Sponsors</a></li>
        </ul>
    </nav>
    `;

    // Remove existing hardcoded navbars if present to avoid duplicates
    const existingTopBar = document.querySelector('.top-bar');
    if (existingTopBar) existingTopBar.remove();

    const existingSideBar = document.querySelector('.side-bar');
    if (existingSideBar) existingSideBar.remove();

    // Insert new navbar at the beginning of the body
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
});

// 2. Toggle Function for the Hamburger Menu
function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    sideMenu.classList.toggle('active');

    // Also toggle a class on body to shift content if needed
    document.body.classList.toggle('menu-open');
}

// 3. Close menu when clicking outside (on the overlay)
document.addEventListener('click', function (event) {
    const sideMenu = document.getElementById('side-menu');
    const menuIcon = document.querySelector('.menu-icon');

    // If menu is open and click is OUTSIDE sidebar and NOT on the menu icon
    if (document.body.classList.contains('menu-open') &&
        !sideMenu.contains(event.target) &&
        !menuIcon.contains(event.target)) {

        sideMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

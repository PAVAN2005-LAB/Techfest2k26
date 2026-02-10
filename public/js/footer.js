document.addEventListener('DOMContentLoaded', function () {
    // Find the footer placeholder or insert before closing body if not present
    let footerElement = document.querySelector('footer.footer');

    // If a static footer already exists, let's replace its content or skip
    // But since we want to clear it and inject dynamic content:
    if (!footerElement) {
        footerElement = document.createElement('footer');
        footerElement.className = 'footer';
        document.body.appendChild(footerElement);
    }

    footerElement.innerHTML = `
    <div class="footer-container">
      <div class="footer-row">
        <div class="footer-col">
          <img src="/images/gec_dahod_logo.jpg" alt="gec_dahod_logo" class="footer-logo" />
        </div>

        <div class="footer-col">
          <h4>Address</h4>
          <p>Government College of Engineering Dahod</p>
          <p>Jhalod Road, Dahod, Gujarat</p>
          <p>Pin-389151</p>
          <p><a href="https://www.gecdahod.ac.in/" class="gcoea-website">www.gecdahod.ac.in</a></p>
        </div>

        <div class="footer-col">
          <h4>Help</h4>
          <ul>
            <li><a href="#">FAQs</a></li>
            <li><a href="/index.html">Home</a></li>
            <li><a href="/pages/contact.html">Contact Us</a></li>
            <li><a href="/reg.html">Register</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Follow Us</h4>
          <div class="social-links">
            <a href="#"><i class="fa-brands fa-facebook"></i></a>
            <a href="#"><i class="fa-brands fa-instagram"></i></a>
            <a href="#"><i class="fa-brands fa-twitter"></i></a>
            <a href="#"><i class="fa-brands fa-youtube"></i></a>
          </div>
        </div>

        <div class="footer-col">
          <img src="/images/TRIVIDYA2K26_LOGO.png" alt="trividya2k26_logo" class="footer-logo" />
        </div>
      </div>
    </div>
    `;
});

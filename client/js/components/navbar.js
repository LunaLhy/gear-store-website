const $ = (selector, parent = document) => parent.querySelector(selector);
const user = JSON.parse(localStorage.getItem("user") || "null");
const isAdmin = !!(user && (user.role === "admin" || user.isAdmin === true || user.isAdmin === "true"));

function renderNavbar() {
  const target = $('[data-navbar]');
  if (!target) return;

  target.outerHTML = `
    <header class="header">
      <a href="index.html" class="main-logo"><img src="../assets/logo.png" alt="GearStore Logo" /><span>Gear Store</span></a>
      <div class="search-box"><input type="text" id="searchInput" placeholder="Search products..." /><button id="searchBtn"><i class="fa-solid fa-magnifying-glass"></i></button></div>
      <nav class="nav">
        <a href="cart.html" class="cart-link"><i class="fa-solid fa-cart-shopping"></i></a>
        <a href="login.html" id="loginLink" class="login-btn"><i class="fa-regular fa-circle-user"></i><span>Log in</span></a>
        <div id="userBox" class="user-box" style="display:none;">
          <button id="accountBtn" class="account-btn"><i class="fa-solid fa-user"></i><span id="userName"></span><span id="adminBadge" class="admin-badge" style="display:none;">ADMIN</span><i class="fa-solid fa-chevron-down"></i></button>
          <div id="accountDropdown" class="account-dropdown"><a href="managerProducts.html" class="admin-only">Manager Products</a><button id="logoutBtn">Logout</button></div>
        </div>
      </nav>
    </header>`;
}

function renderFooter() {
  const target = $('[data-footer]');
  if (!target) return;

  target.outerHTML = `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-box"><h2>About Us</h2><p>GearStore is a modern gaming gear website for students and gamers. We provide keyboards, mice, headphones, microphones and accessories with a clean and simple shopping experience.</p></div>
        <div class="footer-box"><h2>Contact Us</h2><div class="footer-contact">
          <div class="contact-item"><div class="contact-icon"><i class="fa-solid fa-envelope"></i></div><span>gearstore@gmail.com</span></div>
          <div class="contact-item"><div class="contact-icon"><i class="fa-solid fa-phone"></i></div><span>+84 123 456 789</span></div>
          <div class="contact-item"><div class="contact-icon"><i class="fa-solid fa-location-dot"></i></div><span>Hanoi, Vietnam</span></div>
        </div></div>
        <div class="footer-box"><h2>Follow Us</h2><div class="footer-social">
          <a href="#"><div class="social-icon"><i class="fa-brands fa-facebook-f"></i></div><span>Facebook</span></a>
          <a href="#"><div class="social-icon"><i class="fa-brands fa-instagram"></i></div><span>Instagram</span></a>
          <a href="#"><div class="social-icon"><i class="fa-brands fa-tiktok"></i></div><span>TikTok</span></a>
          <a href="#"><div class="social-icon"><i class="fa-brands fa-youtube"></i></div><span>YouTube</span></a>
        </div></div>
      </div>
    <div class="footer-bottom">© 2026 GearStore Website | Designed by Hieu - Truong - Long</div>
    </footer>`;
}

function initAccountMenu() {
  const loginLink = $('#loginLink');
  const userBox = $('#userBox');
  const userName = $('#userName');
  const adminBadge = $('#adminBadge');
  const accountBtn = $('#accountBtn');
  const accountDropdown = $('#accountDropdown');
  const logoutBtn = $('#logoutBtn');
  const adminOnlyLinks = document.querySelectorAll('.admin-only');

  if (!user) {
    if (userBox) userBox.style.display = 'none';
    adminOnlyLinks.forEach(link => link.style.display = 'none');
    return;
  }

  if (loginLink) loginLink.style.display = 'none';
  if (userBox) userBox.style.display = 'block';
  if (userName) userName.innerText = `Hi, ${user.name}`;
  if (adminBadge) adminBadge.style.display = isAdmin ? 'inline-block' : 'none';
  if (accountBtn) accountBtn.classList.toggle('admin-account', isAdmin);
  adminOnlyLinks.forEach(link => link.style.display = isAdmin ? 'block' : 'none');

  accountBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    accountDropdown?.classList.toggle('show');
  });

  document.addEventListener('click', () => accountDropdown?.classList.remove('show'));
  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  });
}

renderNavbar();
renderFooter();
initAccountMenu();

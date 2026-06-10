document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  if (!searchBtn || !searchInput) return;

  const search = () => {
    const keyword = searchInput.value.trim();
    window.location.href = keyword
      ? `products.html?keyword=${encodeURIComponent(keyword)}`
      : 'products.html';
  };

  searchBtn.addEventListener('click', search);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') search();
  });
});

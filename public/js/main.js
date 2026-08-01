// HelloDigitalCyber - small progressive enhancements
document.addEventListener('DOMContentLoaded', () => {
  // Auto-dismiss alerts after a few seconds
  document.querySelectorAll('.alert').forEach((el) => {
    setTimeout(() => {
      el.style.transition = 'opacity 0.4s ease';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 400);
    }, 5000);
  });
});

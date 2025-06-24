document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('togglePassword');
  const pwd    = document.getElementById('password');
  toggle.addEventListener('click', () => {
    const isPwd = pwd.type === 'password';
    pwd.type           = isPwd ? 'text' : 'password';
    toggle.textContent = isPwd ? '🙈' : '👁️';
  });
});
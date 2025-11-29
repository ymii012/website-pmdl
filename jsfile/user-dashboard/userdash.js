// transition home sidebar
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

// SETTINGS internal section switch
function showSettingsSection(sectionId) {
  const sections = document.querySelectorAll('.settings-section');
  const links = document.querySelectorAll('.set-choices a');

  sections.forEach(sec => sec.classList.remove('active'));
  links.forEach(link => link.classList.remove('active'));

  const activeSection = document.getElementById(sectionId);
  const activeLink = Array.from(links).find(link => link.textContent.toLowerCase().includes(sectionId));

  if (activeSection) activeSection.classList.add('active');
  if (activeLink) activeLink.classList.add('active');
}
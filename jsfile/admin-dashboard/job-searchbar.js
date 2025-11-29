// job-searchbar.js
// Search + Status Filter for job table (robust: handles inconsistent filter labels)

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search01");
  const table = document.getElementById("jobTable");
  const rows = table.getElementsByTagName("tr");
  const filterButtons = document.querySelectorAll(".filter-btn");

  // Normalize strings: lowercase + collapse whitespace
  const normalize = str => String(str || "").toLowerCase().replace(/\s+/g, ' ').trim();

  // Optional alias map for button values that don't match table text
  const filterAlias = {
    'pending approval': 'pending',
    'pending': 'pending',
    'active': 'active',
    'closed': 'closed',
    'all': 'all'
  };

  function applyFilters() {
    const searchValue = normalize(searchInput.value);
    const activeBtn = document.querySelector('.filter-btn.active');
    const activeFilterRaw = activeBtn ? activeBtn.dataset.filter : 'all';
    const activeFilter = filterAlias[normalize(activeFilterRaw)] || normalize(activeFilterRaw);

    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName("td");
      if (!cells.length) continue; // skip non-data rows

      // Status is in column 5 (0-based index). Adjust if your table column order changes.
      const statusCellText = normalize(cells[5].innerText);

      // STATUS MATCH
      let statusMatch = activeFilter === 'all' || statusCellText.includes(activeFilter);

      // SEARCH MATCH across all columns
      let searchMatch = false;
      for (let j = 0; j < cells.length; j++) {
        if (normalize(cells[j].innerText).includes(searchValue)) {
          searchMatch = true;
          break;
        }
      }

      rows[i].style.display = (statusMatch && searchMatch) ? '' : 'none';
    }
  }

  // Wire up events
  searchInput.addEventListener('input', applyFilters); // input gives smoother UX than keyup

  filterButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const currentActive = document.querySelector('.filter-btn.active');
      if (currentActive) currentActive.classList.remove('active');
      this.classList.add('active');
      applyFilters();
    });
  });

  // Initial filter pass (in case table was pre-filtered)
  applyFilters();
});

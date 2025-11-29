// ofw-searchbar.js
// Search + Status Filter for OFW table

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const table = document.getElementById("ofwTable");
  const rows = table.getElementsByTagName("tr");
  const filterButtons = document.querySelectorAll(".filter-btn");

  // Normalize text (lowercase + trim + collapse spaces)
  const normalize = str =>
    String(str || "").toLowerCase().replace(/\s+/g, " ").trim();

  // Map button filter values to actual table status text
  const filterAlias = {
    "complete": "complete",
    "completed": "complete",

    "pending": "pending",

    "incomplete": "incomplete",
    "not complete": "incomplete",
    "missing": "incomplete",

    "all": "all"
  };

  function applyFilters() {
    const searchValue = normalize(searchInput.value);

    const activeBtn = document.querySelector(".filter-btn.active");
    const activeFilterRaw = activeBtn ? activeBtn.dataset.filter : "all";

    const activeFilter =
      filterAlias[normalize(activeFilterRaw)] ||
      normalize(activeFilterRaw);

    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName("td");
      if (!cells.length) continue; // skip header or empty rows

      // STATUS is column index 3
      const statusText = normalize(cells[3].innerText);

      // 🔥 EXACT MATCH (not includes) to avoid "complete" matching "incomplete"
      const statusMatch =
        activeFilter === "all" || statusText === activeFilter;

      // SEARCH MATCH (across all columns)
      let searchMatch = false;
      for (let j = 0; j < cells.length; j++) {
        if (normalize(cells[j].innerText).includes(searchValue)) {
          searchMatch = true;
          break;
        }
      }

      rows[i].style.display = statusMatch && searchMatch ? "" : "none";
    }
  }

  // Search event
  searchInput.addEventListener("input", applyFilters);

  // Filter button event
  filterButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".filter-btn")
        .forEach(b => b.classList.remove("active"));

      this.classList.add("active");
      applyFilters();
    });
  });

  // Initial run
  applyFilters();
});

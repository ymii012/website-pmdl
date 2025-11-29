const filterBtns = document.querySelectorAll(".filter-btn");
const rows = document.querySelectorAll("#recordTable tr");
const searchInput = document.getElementById("search");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    rows.forEach((row) => {
      if (filter === "all" || row.dataset.status.includes(filter)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
});

searchInput.addEventListener("keyup", () => {
  const query = searchInput.value.toLowerCase();
  rows.forEach((row) => {
    const name = row.cells[0].textContent.toLowerCase();
    row.style.display = name.includes(query) ? "" : "none";
  });
});

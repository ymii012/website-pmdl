function searchJobs() {
    const searchValue = document.getElementById("jobSearch").value.toLowerCase().trim();
    const jobCards = document.querySelectorAll(".job-card");

    jobCards.forEach(card => {

        // Get all text content inside each job card
        const cardText = card.innerText.toLowerCase();

        // Check if the card contains the search value
        if (cardText.includes(searchValue)) {
            card.style.display = "block";  // Show
        } else {
            card.style.display = "none";   // Hide
        }
    });
}

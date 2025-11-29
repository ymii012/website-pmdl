// view-applicant.js

// When the table is clicked
document.getElementById("applicantRecord").addEventListener("click", function (e) {

    // If the clicked element is the view button
    if (e.target.classList.contains("viewBtnApp")) {

        const appId = e.target.getAttribute("data-id");
        console.log("Selected Applicant ID:", appId);

        // Open the modal
        document.getElementById("selectedApplicant").style.display = "flex";

        // OPTIONAL: Load applicant details via AJAX
        loadApplicantDetails(appId);
    }
});


// CLOSE MODAL
document.getElementById("closeModalchoosenApp").addEventListener("click", () => {
    document.getElementById("selectedApplicant").style.display = "none";
});
document.getElementById("backApplicant").addEventListener("click", () => {
    document.getElementById("selectedApplicant").style.display = "none";
});


// OPTIONAL: Fetch applicant details
function loadApplicantDetails(appId) {

    fetch(`php/admin/get_applicant_details.php?id=${appId}`)
        .then(res => res.json())
        .then(data => {

            document.getElementById("ApplicantName").textContent = data.name ?? "—";
            document.getElementById("ApplicantGender").textContent = data.gender ?? "—";
            document.getElementById("applicantStatus").textContent = data.status ?? "—";

            document.getElementById("appNum").textContent = data.phone ?? "—";
            document.getElementById("appMail").textContent = data.email ?? "—";
            document.getElementById("appLoc").textContent = data.address ?? "—";
            document.getElementById("appDate").textContent = data.applied_date ?? "—";

        })
        .catch(err => console.error("Error loading applicant:", err));
}

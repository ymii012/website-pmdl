document.getElementById("ViewApplicants").addEventListener("click", function () {

    if (!window.currentJobId) {
        alert("No job selected.");
        return;
    }

    const modal = document.getElementById("viewapplicant");
    const tbody = document.getElementById("applicantRecord");

    const jobData = window.currentJobData;

    document.getElementById("joborder-id").textContent =
    "JOB ORDER: " + window.currentJobData.JobOrder_Id;
    
    document.getElementById("positionApplicant").textContent =
        jobData.position_title || "—";

    document.getElementById("viewEmployer").textContent =
        jobData.employer_company || "—";

    document.getElementById("viewLocation").textContent =
        jobData.country || "—";

    document.getElementById("viewPostedDate").textContent =
        "Posted: " + (jobData.posted_date || "—");

    document.getElementById("viewDeadline").textContent =
        "Deadline: " + (jobData.application_deadline || "—");


    tbody.innerHTML = `<tr><td colspan="5">Loading...</td></tr>`;

    fetch(`php/admin/joborder_get_applicants.php?job_id=${window.currentJobId}`)
        .then(res => res.json())
        .then(data => {

            tbody.innerHTML = "";

            if (!data || data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5">No applicants found</td></tr>`;
                modal.style.display = "flex";
                return;
            }

            data.forEach(applicant => {

                const tr = document.createElement("tr");

                tr.innerHTML = `
        <td>${applicant.applicant_name || "—"}</td>
        <td>${applicant.status_text || "—"}</td>
        <td>${applicant.formatted_date || "—"}</td>
        <td></td>
        <td>
            <button class="btn btn-sm btn-primary viewBtnApp" data-id="${applicant.application_id}">View Details</button>
        </td>
    `;

                tbody.appendChild(tr);
            });


            modal.style.display = "flex";
        });
});


// CLOSE MODAL
document.getElementById("closeViewApplicant").addEventListener("click", () => {
    document.getElementById("viewapplicant").style.display = "none";
});

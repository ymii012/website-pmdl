// view-card-job.js
// ===============================
// helpers: convertStatus, parseListField, renderListToElement
// ===============================
function convertStatus(statusInt) {
    switch (parseInt(statusInt)) {
        case 1: return "Active";
        case 2: return "Pending";
        case 3: return "Closed";
        default: return "Unknown";
    }
}

function parseListField(value) {
    if (!value && value !== 0) return [];

    if (Array.isArray(value)) {
        return value.map(v => String(v).trim()).filter(Boolean);
    }

    try {
        const maybeArr = JSON.parse(value);
        if (Array.isArray(maybeArr)) {
            return maybeArr.map(v => String(v).trim()).filter(Boolean);
        }
    } catch (e) { }

    let str = String(value);

    if (str.includes("\n")) {
        return str.split("\n").map(v => v.trim()).filter(Boolean);
    }
    if (str.includes("||")) {
        return str.split("||").map(v => v.trim()).filter(Boolean);
    }
    if (str.includes(",")) {
        return str.split(",").map(v => v.trim()).filter(Boolean);
    }

    return [str.trim()].filter(Boolean);
}

function renderListToElement(arr, el, fallbackText = "—") {
    if (!el) return;

    el.innerHTML = "";

    if (!arr || arr.length === 0) {
        el.textContent = fallbackText;
        return;
    }

    const ul = document.createElement("ul");
    arr.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
    });
    el.appendChild(ul);
}

// ===============================
// Select modal + close button
// ===============================
const modal = document.getElementById("view-jobcard");
const closeModal = document.getElementById("closeModalcard");
const applyBtn = document.getElementById("apply-job");

// store currently viewed job id here
window.currentSelectedJobId = null;

// ===============================
// When clicking any "View Details" button
// (delegated event listener — works for dynamically created cards)
// ===============================
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("view-details-btn")) {

        const jobId = e.target.dataset.id;
        if (!jobId) {
            alert("No job id found.");
            return;
        }

        window.currentSelectedJobId = jobId; // store globally for Apply

        modal.style.display = "flex";

        fetch("php/view-details-jobcard.php?id=" + encodeURIComponent(jobId))
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert("Error loading job details.");
                    return;
                }

                // ===== BASIC TEXT FIELDS =====
                document.getElementById("modalPositionTitle").textContent = data.position_title || "-";
                document.getElementById("job-status").textContent = convertStatus(data.status);
                document.getElementById("modalEmployer").textContent = data.employer_company || "-";
                document.getElementById("modalLocation").textContent = data.country || "-";
                document.getElementById("modalDeadline").textContent = data.application_deadline || "-";
                document.getElementById("jobPostedDate").textContent = data.time_created || "-";

                document.getElementById("number-vacancies").textContent = data.no_vacancies || "-";
                document.getElementById("job-salary").textContent = data.salary || "Not specified";

                document.getElementById("jobDescription").textContent = data.job_description || "-";

                // ===== REQUIREMENTS LIST =====
                const reqArr = parseListField(data.requirements);
                renderListToElement(reqArr, document.getElementById("jobRequirements"), "No requirements listed.");

                // ===== BENEFITS LIST =====
                const benArr = parseListField(data.benefits);
                renderListToElement(benArr, document.getElementById("jobBenefits"), "No benefits listed.");

                // ===== CONTACT INFO =====
                document.getElementById("modalContactPerson").textContent = data.contact_person || "-";
                document.getElementById("modalContactEmail").textContent = data.contact_email || "-";
                document.getElementById("modalContactPhone").textContent = data.contact_phone || "-";
            })
            .catch(error => {
                console.error("AJAX Error:", error);
                alert("Failed to fetch job details.");
            });
    }
});

// ===============================
// Close modal (X button)
// ===============================
if (closeModal) {
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });
}

// ===============================
// Close modal when clicking outside
// ===============================
window.addEventListener("click", function (e) {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// ===============================
// Apply button - redirect to application form with job id
// ===============================
if (applyBtn) {
    applyBtn.addEventListener("click", function () {
        const jobId = window.currentSelectedJobId;
        if (!jobId) {
            alert("Error: No job selected.");
            return;
        }
        // redirect to application form and pass job id
        window.location.href = "applicationf.php?jobid=" + encodeURIComponent(jobId);
    });
}

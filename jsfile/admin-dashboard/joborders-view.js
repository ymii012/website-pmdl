
// ===============================
// OPEN MODAL WITH DATA
// ===============================
function parseListField(value) {
    if (!value && value !== 0) return [];
    if (Array.isArray(value)) return value.map(v => String(v).trim()).filter(Boolean);

    try {
        const maybeArr = JSON.parse(value);
        if (Array.isArray(maybeArr)) return maybeArr.map(v => String(v).trim()).filter(Boolean);
    } catch (e) { }

    let str = String(value);
    if (str.indexOf("\n") !== -1)
        return str.split("\n").map(s => s.trim()).filter(Boolean);
    if (str.indexOf("||") !== -1)
        return str.split("||").map(s => s.trim()).filter(Boolean);
    if (str.indexOf(",") !== -1)
        return str.split(",").map(s => s.trim()).filter(Boolean);

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

window.currentJobData = null;

function viewJob(jobData) {
    const modal = document.getElementById("jobModal");
    if (!modal) return;

    fetch(`php/admin/joborder_get_details.php?id=${jobData.id}`)
        .then(response => response.json())
        .then(data => {
            if (!data || data.error) {
                console.error("View job error:", data);
                return;
            }

            window.currentJobData = data;
            window.currentJobId = data.JobOrder_Id; 

            const safeText = (v) => (v === null || v === undefined || v === "") ? "—" : v;


            document.getElementById("modalPositionTitle").textContent = safeText(data.position_title);
            document.getElementById("modalEmployer").textContent = safeText(data.employer_company);
            document.getElementById("modalLocation").textContent = safeText(data.country);
            document.getElementById("modalDeadline").textContent = safeText("Deadline: " + (data.application_deadline || "—"));

            // FIXED: show posted date
            const postedEl = document.getElementById("jobPostedDate");
            if (postedEl) {
                postedEl.textContent = safeText("Posted: " + (data.posted_date || "—"));
            }

            document.getElementById("number-vacancies").textContent = safeText(data.no_vacancies);
            document.getElementById("job-salary").textContent = safeText(data.salary);
            document.getElementById("jobDescription").textContent = safeText(data.job_description);

            renderListToElement(parseListField(data.requirements), document.getElementById("jobRequirements"), "No requirements listed.");
            renderListToElement(parseListField(data.benefits), document.getElementById("jobBenefits"), "No benefits listed.");

            document.getElementById("modalContactPerson").textContent = safeText(data.contact_person);
            document.getElementById("modalContactEmail").textContent = safeText(data.contact_email);
            document.getElementById("modalContactPhone").textContent = safeText(data.contact_phone);

            const statusEl = document.getElementById("job-status");
            if (statusEl) statusEl.textContent = data.status_text;

            const badge = document.getElementById("modalStatusBadge");
            badge.textContent = data.status_text;
            badge.className = "badge";
            if (Number(data.status) === 1) badge.classList.add("active-status");
            if (Number(data.status) === 2) badge.classList.add("pending-status");
            if (Number(data.status) === 3) badge.classList.add("closed-status");

            modal.style.display = "flex";
        });
}

(function attachViewModalCloseHandlers() {
    const closeBtn = document.getElementById("closeModaljob");
    if (closeBtn) closeBtn.addEventListener("click", () => {
        document.getElementById("jobModal").style.display = "none";
    });

    window.addEventListener("click", (event) => {
        const m = document.getElementById("jobModal");
        if (m && event.target === m) m.style.display = "none";
    });
})();

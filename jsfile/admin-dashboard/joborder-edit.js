document.getElementById("editJobBtn").addEventListener("click", () => {

    if (!currentJobData) return;

    const modal = document.getElementById("editJobModal");
    modal.style.display = "flex";

    // BASIC FIELDS
    document.getElementById("edit_position_title").value = currentJobData.position_title;
    document.getElementById("edit_employer_company").value = currentJobData.employer_company;
    document.getElementById("edit_country").value = currentJobData.country;
    document.getElementById("edit_salary").value = currentJobData.salary;
    document.getElementById("edit_no_vacancies").value = currentJobData.no_vacancies;
    document.getElementById("edit_application_deadline").value = currentJobData.application_deadline;
    document.getElementById("edit_status").value = currentJobData.status_text;

    // DESCRIPTION
    document.querySelector("#editJobModal textarea[name='job_description']").value =
        currentJobData.job_description;


    // ===================================================
    // REQUIREMENTS (fixed)
    // ===================================================
    const reqWrapper = document.getElementById("requirementsWrapperEdit");
    reqWrapper.innerHTML = "";

    const reqList = parseListField(currentJobData.requirements);
    reqList.forEach(req => createField(reqWrapper, "requirements[]", req));


    // ===================================================
    // BENEFITS (fixed)
    // ===================================================
    const benWrapper = document.getElementById("benefitsWrapperEdit");
    benWrapper.innerHTML = "";

    const benList = parseListField(currentJobData.benefits);
    benList.forEach(ben => createField(benWrapper, "benefits[]", ben));


    // Add new fields buttons
    document.getElementById("addRequirement-edit").onclick = () => {
        createField(reqWrapper, "requirements[]", "");
    };

    document.getElementById("addBenefit-edit").onclick = () => {
        createField(benWrapper, "benefits[]", "");
    };


    // CONTACT INFORMATION
    document.querySelector("#editJobModal input[name='contact_person']").value =
        currentJobData.contact_person;

    document.querySelector("#editJobModal input[name='contact_email']").value =
        currentJobData.contact_email;

    document.querySelector("#editJobModal input[name='contact_phone']").value =
        currentJobData.contact_phone;


    // HIDDEN ID FIELD
    if (!document.getElementById("edit_job_id")) {
        const hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.id = "edit_job_id";
        hidden.name = "JobOrder_Id";
        document.getElementById("editJobForm").appendChild(hidden);
    }

    document.getElementById("edit_job_id").value = currentJobData.JobOrder_Id;
});


// =======================================================
// CREATE FIELD
// =======================================================
function createField(wrapper, name, value = "") {
    const container = document.createElement("div");
    container.className = "req-ben-row";
    container.style.display = "flex";
    container.style.gap = "6px";
    container.style.marginBottom = "6px";

    const input = document.createElement("input");
    input.type = "text";
    input.name = name;
    input.className = "topbox-input flex-1";
    input.value = value;

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.textContent = "×";
    delBtn.className = "delete-req-ben";
    delBtn.style.background = "#cc0000";
    delBtn.style.color = "white";
    delBtn.style.border = "none";
    delBtn.style.fontWeight = "bold";
    delBtn.style.padding = "4px 10px";
    delBtn.style.borderRadius = "4px";
    delBtn.style.cursor = "pointer";

    delBtn.addEventListener("click", () => container.remove());

    container.appendChild(input);
    container.appendChild(delBtn);
    wrapper.appendChild(container);
}


// Close modal
document.getElementById("closeEditJob").onclick = () => {
    document.getElementById("editJobModal").style.display = "none";
};

document.getElementById("close-editjob-modal").onclick = () => {
    document.getElementById("editJobModal").style.display = "none";
};

document.getElementById("editJobForm").addEventListener("submit", function (e) {
    e.preventDefault(); // STOP normal form submission

    const formData = new FormData(this);

    fetch("php/admin/joborder_edit.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Job updated successfully!");

            // Close modal
            document.getElementById("editJobModal").style.display = "none";

            // Optional: refresh job table
            if (typeof loadJobOrders === "function") {
                loadJobOrders();
            }

        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(err => {
        console.error(err);
        alert("Something went wrong.");
    });
});

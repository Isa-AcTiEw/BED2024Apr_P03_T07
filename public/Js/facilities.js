document.addEventListener('DOMContentLoaded', async () => {
    async function fetchFacilities() {
        try {
            const response = await fetch("/Facilities");
            if (!response.ok) {
                throw new Error('Failed to fetch facilities');
            }
            
            const data = await response.json();
            console.log(data)
            if(data != null){
                const facList = document.getElementById("fac-list");

                facList.innerHTML = '';
    
                data.forEach((fac, index) => {
                    const facItem = document.createElement("div");
                    console.log(fac)
    
                    facItem.classList.add("col-12", "mb-4");
                    facItem.innerHTML = `
                        <div class="card>
                            <div class="card-body">
                                <div class="d-flex align-items-center justify-content-between">
                                    <h5 class="card-title" id="facility_title_${index}">${fac.FacName}</h5>
                                    <div>
                                        <button type="button" class="btn btn-dark shadow-none btn-sm me-2" data-bs-toggle="modal" data-bs-target="#updateFac_${index}">
                                            <i class="bi bi-pencil-square"></i> Edit
                                        </button>
                                        <button type="button" class="btn btn-danger shadow-none btn-sm" data-bs-toggle="modal" data-bs-target="#deleteFac_${index}">
                                            <i class="bi bi-trash"></i> Delete
                                        </button>
                                    </div>
                                </div>
                                <p class="card-text" id="facility_desc_${index}">${fac.FacDesc}</p>
                            </div>
                        </div>`;
                    facList.appendChild(facItem);
                    
                    // Create modal for Update
                    const updateModal = document.createElement("div");
                    updateModal.classList.add("modal", "fade");
                    updateModal.id = `updateFac_${index}`;
                    updateModal.setAttribute("data-bs-backdrop", "static");
                    updateModal.setAttribute("data-bs-keyboard", "true");
                    updateModal.setAttribute("tabindex", "-1");
                    updateModal.setAttribute("aria-labelledby", `staticBackdropLabel_${index}`);
                    updateModal.setAttribute("aria-hidden", "true");
    
                    updateModal.innerHTML = `
                        <div class="modal-dialog">
                            <form id="updateForm_${index}" data-id="${fac.FacID}">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="staticBackdropLabel_${index}">Edit Facility</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="mb-3">
                                            <label class="updateTitle">Facility Title</label>
                                            <input type="text" name="facility_title" class="form-control shadow-none" value="${fac.FacName}" id="updateTitle_${index}">
                                        </div>
                                        <div class="mb-3">
                                            <label class="updateDesc">Description</label>
                                            <textarea name="facility_desc" class="form-control shadow-none" rows="6" id="updateDesc_${index}">${fac.FacDesc}</textarea>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                        <button type="button" class="btn btn-primary" id="submitBtn_${index}">Save changes</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    `;
    
                    document.body.appendChild(updateModal);
    
                    // Create modal for Delete confirmation
                    const deleteModal = document.createElement("div");
                    deleteModal.classList.add("modal", "fade");
                    deleteModal.id = `deleteFac_${index}`;
                    deleteModal.setAttribute("data-bs-backdrop", "static");
                    deleteModal.setAttribute("data-bs-keyboard", "true");
                    deleteModal.setAttribute("tabindex", "-1");
                    deleteModal.setAttribute("aria-labelledby", `deleteModalLabel_${index}`);
                    deleteModal.setAttribute("aria-hidden", "true");
    
                    deleteModal.innerHTML = `
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="deleteModalLabel_${index}">Confirm Delete</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    Are you sure you want to delete this facility?
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                    <button type="button" class="btn btn-danger" id="deleteBtn_${index}">Delete</button>
                                </div>
                            </div>
                        </div>
                    `;
    
                    document.body.appendChild(deleteModal);
    
                    // add Event Listener for Update
                    document.getElementById(`submitBtn_${index}`).addEventListener("click", async (e) => {
                        e.preventDefault();
                        const title = document.getElementById(`updateTitle_${index}`).value;
                        const desc = document.getElementById(`updateDesc_${index}`).value;
                    
                        await fetch(`/facilities/${fac.FacID}`, {
                            method: 'PUT',
                            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
                            body: JSON.stringify({ FacName: title, FacDesc: desc })
                        });
                    
                        // update the facilities on the page
                        document.getElementById(`facility_title_${index}`).textContent = title;
                        document.getElementById(`facility_desc_${index}`).textContent = desc;
                        document.getElementById(`updateForm_${index}`)
                        // close modal
                        const modalInstance = bootstrap.Modal.getInstance(document.getElementById(`updateFac_${index}`));
                        modalInstance.hide();
                    });
    
                    // add Event Listener for Delete
                    document.getElementById(`deleteBtn_${index}`).addEventListener("click", async () => {
                        try {
                            const deleteResponse = await fetch(`/facilities/${fac.FacID}`, {
                                method: 'DELETE'
                            });
    
                            if (deleteResponse.ok) {
                                // Remove the facility from the page
                                facItem.remove();
                                // Close the modal
                                const modalElement = document.getElementById(`deleteFac_${index}`);
                                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                                modalInstance.hide();
                            } else {
                                throw new Error('Failed to delete facility');
                            }
                        } catch (error) {
                            console.error(error);
                            alert('Error deleting facilities. Please try again later.');
                        }
                    });
                });
            }
            else{
                console.log("No")
            }
           
        } catch (error) {
            console.error(error);
            alert('Failed to load facilities. Please try again later.');
        }
    }
    const token = localStorage.getItem('token');
    const addForm = document.getElementById("addFacilityForm");
    addForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const response = await fetch("/facilitiesId", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        let facid = await response.json();
        const id = parseInt(facid.value.slice(3,7)) + 1;
        let idtype = "FAC";
        if (id.toString().length < 3) {
            idtype += "0".repeat(3 - id.toString().length)
        }
        facid = idtype + id

        const title = document.getElementById("addFacilityTitle").value;
        const desc = document.getElementById("addFacilityDesc").value;

        await fetch("/facilities", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ FacID: facid, FacName: title, FacDesc: desc })
        });

        await fetchFacilities();
        const modalElement = document.getElementById(`addFacilityModal`);
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
    });
    await fetchFacilities();
});
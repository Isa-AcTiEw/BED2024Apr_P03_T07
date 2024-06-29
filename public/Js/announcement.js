document.addEventListener('DOMContentLoaded', async () => {
    async function fetchAnnouncements() {
        try {
            const response = await fetch("/Announcements");
            if (!response.ok) {
                throw new Error('Failed to fetch announcements');
            }
            const data = await response.json();
            const annList = document.getElementById("ann-list");
            annList.innerHTML = ''; // Clear previous content

            data.forEach((ann, index) => {
                // Create card
                const annItem = document.createElement("div");
                annItem.classList.add("col-12", "mb-4");

                annItem.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-title" id="announcement_title_${index}">${ann.AnnName}</h5>
                                <div>
                                    <button type="button" class="btn btn-dark shadow-none btn-sm me-2" data-bs-toggle="modal" data-bs-target="#updateAnn_${index}">
                                        <i class="bi bi-pencil-square"></i> Edit
                                    </button>
                                    <button type="button" class="btn btn-danger shadow-none btn-sm" data-bs-toggle="modal" data-bs-target="#deleteAnn_${index}">
                                        <i class="bi bi-trash"></i> Delete
                                    </button>
                                </div>
                            </div>
                            <p class="card-text" id="announcement_desc_${index}">${ann.AnnDesc}</p>
                        </div>
                    </div>
                `;

                annList.appendChild(annItem);

                document.getElementById('addAnnouncementBtn').addEventListener('click', async (e) => {
                    e.preventDefault();
                    const AnnName = document.getElementById('addTitle').value;
                    const AnnDesc = document.getElementById('addDesc').value;
            
                    const response = await fetch('/announcements', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ AnnName, AnnDesc })
                    });
            
                    if (response.ok) {
                        alert('Announcement created successfully!');
                        fetchAnnouncements(); 
                    } else {
                        alert('Error creating announcement');
                    }
                });

                // Create modal for Update
                const updateModal = document.createElement("div");
                updateModal.classList.add("modal", "fade");
                updateModal.id = `updateAnn_${index}`;
                updateModal.setAttribute("data-bs-backdrop", "static");
                updateModal.setAttribute("data-bs-keyboard", "true");
                updateModal.setAttribute("tabindex", "-1");
                updateModal.setAttribute("aria-labelledby", `staticBackdropLabel_${index}`);
                updateModal.setAttribute("aria-hidden", "true");

                updateModal.innerHTML = `
                    <div class="modal-dialog">
                        <form id="updateForm_${index}" data-id="${ann.AnnID}">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="staticBackdropLabel_${index}">Edit Announcement</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="mb-3">
                                        <label class="updateTitle">Announcement Title</label>
                                        <input type="text" name="announcement_title" class="form-control shadow-none" value="${ann.AnnName}" id="updateTitle_${index}">
                                    </div>
                                    <div class="mb-3">
                                        <label class="updateDesc">Description</label>
                                        <textarea name="announcement_desc" class="form-control shadow-none" rows="6" id="updateDesc_${index}">${ann.AnnDesc}</textarea>
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
                deleteModal.id = `deleteAnn_${index}`;
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
                                Are you sure you want to delete this announcement?
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-danger" id="deleteBtn_${index}">Delete</button>
                            </div>
                        </div>
                    </div>
                `;

                document.body.appendChild(deleteModal);

                // Add Event Listeners
                document.getElementById(`submitBtn_${index}`).addEventListener("click", async (e) => {
                    e.preventDefault();
                    const title = document.getElementById(`updateTitle_${index}`).value;
                    const desc = document.getElementById(`updateDesc_${index}`).value;
                
                    await fetch(`/announcements/${ann.AnnID}`, {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ AnnName: title, AnnDesc: desc })
                    });
                
                    // Update the announcement on the page
                    document.getElementById(`announcement_title_${index}`).textContent = title;
                    document.getElementById(`announcement_desc_${index}`).textContent = desc;

                    // Close the modal
                    const modalElement = document.getElementById(`updateAnn_${index}`);
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance.hide();

                    // Fetch announcements again after successful update
                    fetchAnnouncements();
                });
                

                document.getElementById(`deleteBtn_${index}`).addEventListener("click", async () => {
                    try {
                        const deleteResponse = await fetch(`/announcements/${ann.AnnID}`, {
                            method: 'DELETE'
                        });

                        if (deleteResponse.ok) {
                            // Remove the announcement from the page
                            annItem.remove();
                            // Close the modal
                            const modalElement = document.getElementById(`deleteAnn_${index}`);
                            const modalInstance = bootstrap.Modal.getInstance(modalElement);
                            modalInstance.hide();
                        } else {
                            throw new Error('Failed to delete announcement');
                        }
                    } catch (error) {
                        console.error(error);
                        alert('Error deleting announcement. Please try again later.');
                    }
                });
            });
        } catch (error) {
            console.error(error);
            alert('Failed to load announcements. Please try again later.');
        }
    }

    await fetchAnnouncements();
});

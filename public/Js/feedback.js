document.addEventListener('DOMContentLoaded', async () => {
    async function fetchFeedbacks() {
        try {
            const response = await fetch("/Feedbacks");
            if (!response.ok) {
                throw new Error('Failed to fetch feedbacks');
            }
            const data = await response.json();
            const fbkList = document.getElementById("feedbacks-data");
            fbkList.innerHTML = ''; 

            document.getElementById

            data.forEach((fbk, index) => {
                // Create row
                const row = document.createElement("tr");
                row.innerHTML = `
                    <th scope="row">${index + 1}</th>
                    <td>${fbk.FbkName}</td>
                    <td>${fbk.FbkQuality}</td>
                    <td>${fbk.FbkDateTime}</td>
                    <td>${fbk.FbkDesc}</td>
                    <td class="actions-column">
                        <div class="d-flex flex-column align-items-center justify-content-between">
                            <button type="button" class="btn btn-dark shadow-none btn-sm me-2" data-bs-toggle="modal" data-bs-target="#updateAnn_${index}">
                                <i class="bi bi-check2-circle"></i> Mark as resolve
                            </button>
                            <button type="button" style="margin-top: 2px" class="btn btn-danger shadow-none btn-sm" data-bs-toggle="modal" data-bs-target="#deleteAnn_${index}">
                                <i class="bi bi-trash"></i> Delete
                            </button>
                        </div>
                    </td>
                `;

                // Append row to tbody
                fbkList.appendChild(row);
            });

            // delete modal

            // Create modal for Delete confirmation
            const deleteModal = document.createElement("div");
            deleteModal.classList.add("modal", "fade");
            deleteModal.id = `deletefbk_${index}`;
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
                            Are you sure you want to delete this feedback?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-danger" id="deleteBtn_${index}">Delete</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(deleteModal);



            // add Event Listener for Delete
            document.getElementById(`deleteBtn_${index}`).addEventListener("click", async () => {
                try {
                    const deleteResponse = await fetch(`/feedback/${fbk.FbkID}`, {
                        method: 'DELETE'
                    });

                    if (deleteResponse.ok) {
                        // Remove the announcement from the page
                        annItem.remove();
                        // Close the modal
                        const modalElement = document.getElementById(`deleteFbk_${index}`);
                        const modalInstance = bootstrap.Modal.getInstance(modalElement);
                        modalInstance.hide();
                    } else {
                        throw new Error('Failed to delete feedback');
                    }
                } catch (error) {
                    console.error(error);
                    alert('Error deleting feedback. Please try again later.');
                }
            });

        } catch (error) {
            console.error(error);
            throw error; // Rethrow error for handling at higher level
        }
    }
    await fetchFeedbacks();

});

/* document.querySelector(".submit-button").addEventListener("click", function(event) {
    event.preventDefault();
    const post = document.querySelector(".post");
    const widget = document.querySelector(".star-widget");
    const formTitle = document.querySelector(".form-title");

    widget.style.display = "none";
    post.style.display = "block";
    formTitle.style.display = "none";
});

document.getElementById("btn-edit").addEventListener("click", function() {
    const post = document.querySelector(".post");
    const widget = document.querySelector(".star-widget");

    widget.style.display = "block";
    post.style.display = "none";
});

document.querySelector(".btn-close").addEventListener("click", function() {
    location.reload();
});

document.addEventListener("DOMContentLoaded", function () {
    fetch('http://localhost:3000/User/Feedback/userFeedback.html') // Adjust the URL based on your setup
        .then(response => response.json())
        .then(feedbacks => {
            const tableBody = document.getElementById('feedback-table-body');
            feedbacks.forEach((feedback, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <th scope="row">${index + 1}</th>
                    <td>${feedback.FbkName}</td>
                    <td>${feedback.FbkQuality}</td>
                    <td>${feedback.FbkDesc}</td>
                    <td>${new Date(feedback.FbkDateTime).toLocaleString()}</td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-feedback" data-id="${feedback.FbkID}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            document.querySelectorAll('.delete-feedback').forEach(button => {
                button.addEventListener('click', function () {
                    const feedbackId = this.getAttribute('data-id');
                    fetch(`http://localhost:3000/api/feedbacks/${feedbackId}`, {
                        method: 'DELETE',
                    })
                        .then(response => response.json())
                        .then(data => {
                            // Optionally, remove the row from the table
                            this.closest('tr').remove();
                        })
                        .catch(error => console.error('Error:', error));
                });
            });
        })
        .catch(error => console.error('Error:', error));
});

document.getElementById('newFeedback').addEventListener('click', function () {
    window.location.href = 'userFeedback.html';
});

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


                // add Event Listener for Update
                document.getElementById(`submitBtn_${index}`).addEventListener("click", async (e) => {
                    e.preventDefault();
                    const title = document.getElementById(`updateTitle_${index}`).value;
                    const desc = document.getElementById(`updateDesc_${index}`).value;
                
                    await fetch(`/announcements/${ann.AnnID}`, {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ AnnName: title, AnnDesc: desc })
                    });
                
                    // update the announcement on the page
                    document.getElementById(`announcement_title_${index}`).textContent = title;
                    document.getElementById(`announcement_desc_${index}`).textContent = desc;
                    document.getElementById(`updateForm_${index}`)
                    // close modal
                    const modalInstance = bootstrap.Modal.getInstance(document.getElementById(`updateAnn_${index}`));
                    modalInstance.hide();
                });

                // add Event Listener for Delete
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

    const addForm = document.getElementById("addAnnouncementForm");
    addForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("addAnnouncementTitle").value;
        const desc = document.getElementById("addAnnouncementDesc").value;
        await fetch("/announcements", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ AnnName: title, AnnDesc: desc })
        });

        await fetchAnnouncements();
        const modalElement = document.getElementById(`addAnnouncementModal`);
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
    });

    await fetchAnnouncements();
});
 */
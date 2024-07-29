document.addEventListener('DOMContentLoaded', async () => {
    async function fetchFeedbacks() {
        try {
            const response = await fetch("/feedbacks");
            if (!response.ok) {
                throw new Error('Failed to fetch feedbacks');
            }
            const data = await response.json();
            const fbkList = document.getElementById("feedbacks-data");
            

            data.forEach((fbk, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <th scope="row">${index + 1}</th>
                    <td>${fbk.FbkName}</td>
                    <td>${fbk.FbkQuality}</td>
                    <td>${new Date(fbk.FbkDateTime).toLocaleString()}</td>
                    <td>${fbk.FbkDesc}</td>
                    <td class="actions-column">
                        <div class="d-flex flex-column align-items-center justify-content-between">
                            <button type="button" class="btn btn-dark shadow-none btn-sm me-2" data-bs-toggle="modal" data-bs-target="#updateFbk_${index}">
                                <i class="bi bi-check2-circle"></i> Mark as resolve
                            </button>
                            <button type="button" style="margin-top: 2px" class="btn btn-danger shadow-none btn-sm" data-bs-toggle="modal" data-bs-target="#deleteFbk_${index}">
                                <i class="bi bi-trash"></i> Delete
                            </button>
                        </div>
                    </td>
                `;

                fbkList.appendChild(row);

                // Create modal for Delete confirmation
                const deleteModal = document.createElement("div");
                deleteModal.classList.add("modal", "fade");
                deleteModal.id = `deleteFbk_${index}`;
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
                        const deleteResponse = await fetch(`/feedbacks/${fbk.FbkID}`, {
                            method: 'DELETE'
                        });

                        if (deleteResponse.ok) {
                            // Remove row from user feedbacks
                            row.remove();
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
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    await fetchFeedbacks();
});

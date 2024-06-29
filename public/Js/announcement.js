document.addEventListener('DOMContentLoaded', async () => {
    async function fetchAnnouncements() {
        try {
            const response = await fetch("/Announcements");
            if (!response.ok) {
                throw new Error('Failed to fetch announcements');
            }
            const data = await response.json();
            const annList = document.getElementById("ann-list");

            data.forEach((ann, index) => {
                // Create card
                const annItem = document.createElement("div");
                annItem.classList.add("col-12", "mb-4");

                annItem.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-title" id="announcement_title_${index}">${ann.AnnName}</h5>
                                <button type="button" class="btn btn-dark shadow-none btn-sm" data-bs-toggle="modal" data-bs-target="#updateAnn_${index}">
                                    <i class="bi bi-pencil-square"></i> Edit
                                </button>
                            </div>
                            <p class="card-text" id="announcement_desc_${index}">${ann.AnnDesc}</p>
                        </div>
                    </div>
                `;

                annList.appendChild(annItem);

                // Create modal
                const modal = document.createElement("div");
                modal.classList.add("modal", "fade");
                modal.id = `updateAnn_${index}`;
                modal.setAttribute("data-bs-backdrop", "static");
                modal.setAttribute("data-bs-keyboard", "true");
                modal.setAttribute("tabindex", "-1");
                modal.setAttribute("aria-labelledby", `staticBackdropLabel_${index}`);
                modal.setAttribute("aria-hidden", "true");

                modal.innerHTML = `
                    <div class="modal-dialog">
                        <form id="updateForm_${index}" data-id="${ann.AnnID}">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="staticBackdropLabel_${index}">Announcement</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="mb-3">
                                        <label class="updateTitle">Announcement Title</label>
                                        <input type="text" name="announcement_title" class="form-control shadow-none" value="${ann.AnnName}" id="updateTitle_${index}">
                                    </div>
                                    <div class="col-md-12 p-0 mb-3">
                                        <label class="updateDesc">Description</label>
                                        <textarea name="announcement_desc" class="form-control shadow-none" rows="6" id="updateDesc_${index}">${ann.AnnDesc}</textarea>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn text-secondary shadow-none" data-bs-dismiss="modal">CANCEL</button>
                                    <button type="button" class="btn custom-bg text-white shadow-none" id="submitBtn_${index}">SUBMIT</button>
                                </div>
                            </div>
                        </form>
                    </div>
                `;

                document.body.appendChild(modal);

                document.getElementById(`submitBtn_${index}`).addEventListener('click', async (e) => {
                    e.preventDefault();
                    const form = document.getElementById(`updateForm_${index}`);
                    const AnnID = form.getAttribute('data-id');
                    const AnnName = document.getElementById(`updateTitle_${index}`).value;
                    const AnnDesc = document.getElementById(`updateDesc_${index}`).value;

                    try {
                        const response = await fetch(`/Announcements/${AnnID}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ AnnName, AnnDesc })
                        });

                        if (response.ok) {
                            alert('Announcement updated successfully!');
                            fetchAnnouncements(); // Refresh the Announcement list
                        } else {
                            alert('Error updating announcement');
                        }
                    } catch (error) {
                        console.error('Error updating announcement:', error);
                        alert('Failed to update announcement');
                    }
                });
            });
        } catch (error) {
            console.error('Error fetching announcements:', error);
            alert('Failed to fetch announcements');
        }
    }

    await fetchAnnouncements();
});

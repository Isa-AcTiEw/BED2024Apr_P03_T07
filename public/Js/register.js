function setActive () {
    const register_form = document.getElementById('register-form');

    register_form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', register_form.elements['name'].value)
        data.append('email', register_form.elements['email'].value)
        data.append('phonenum', register_form.elements['phonenum'].value)
        data.append('address', register_form.elements['address'].value)
        data.append('postalcode', register_form.elements['postalcode'].value)
        data.append('dob', register_form.elements['dob'].value)
        data.append('pass', register_form.elements['pass'].value)
        data.append('cfmpass', register_form.elements['cfmpass'].value)
        data.append('profile', register_form.elements['profile'].file[0])
        data.append('register','');

        const myModal = document.getElementById('registerModal');
        const modal = bootstrap.Modal.getInstance(myModal);
        modal.hide();

        const userRes = document.getElementById("addAnnouncementForm");
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


    });
    })
}

setActive();
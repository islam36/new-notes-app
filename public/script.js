const newNoteModal = document.querySelector('.modal.newNote');
const form = newNoteModal.querySelector('form');
const url = 'http://localhost:8000/';
const showNoteModal = document.querySelector('.modal.showNote');
const changeNoteForm = showNoteModal.querySelector('form');

/**
 * toggles addNote modal
 */
function toggleModal(modal) {
    modal.classList.toggle('active');
}


/**
 * shows an alert with message='msg' and color='color'
 */
function showAlert(msg, color) {
    let Alert = document.createElement('div');
    Alert.className = 'alert alert-' + color;
    Alert.innerHTML = msg;

    let header = document.querySelector('header');
    header.appendChild(Alert);

    setTimeout(() => {
        Alert.remove();
    }, 3000);
}


//Toggle addNote modal when the user clicks outside the modal
window.addEventListener('click', (event) => {
    if(event.target == newNoteModal){
        toggleModal(newNoteModal);
    }
});


window.addEventListener('click', (event) => {
    if(event.target == showNoteModal){
        toggleModal(showNoteModal);
    }
})

//When page is loaded, fetch notes from '/notes' and display them or display an error message
document.addEventListener('DOMContentLoaded', () => {
    fetch(url + 'notes')
    .then( (response) => {
        if(response.ok){
            return response.json();
        }
        else {
            let err = new Error('Failed to fetch data from the server!');
            throw err;
        }
    })
    .then( (notes) => {
        const row = document.querySelector('#notes');
        if( notes != [] ) {
            for(let i = 0; i < notes.length; i++) {
                let note = document.createElement('div');
                note.className = "col-12 col-sm-4";
                note.innerHTML = `
                <div class="card mb-5 bg-warning id-${notes[i].id}" >
                    <div class="card-header">
                        ${notes[i].title}
                    </div>
                    <div class="card-body">
                        ${notes[i].note}
                    </div> 
                </div>`;

                row.appendChild(note);
            }
            
            const cards = document.querySelectorAll('#notes .card');

            //when the user clicks on a card, toggle showNote modal with the note informations
            cards.forEach((card) => {
                card.addEventListener('click', () => {
                    let showNoteModal = document.querySelector('.modal.showNote');
                    let id = parseInt( card.classList.item(3).slice(3) );
                    let title = notes[id].title;
                    let note = notes[id].note;
                    toggleModal(showNoteModal);

                    showNoteModal.querySelector('#id').value = id;
                    showNoteModal.querySelector('#title').value = title;
                    showNoteModal.querySelector('#note').value = note;
                });
            })
        }
        else {
            row.innerHTML = 'You have no notes :(';
        }       
    })
    .catch( (err) => {
        showAlert('Failed to fetch data from the server!', 'danger');
        console.log(err);
    });
});


//handle the event of submiting a new note
form.addEventListener('submit', (event) => {
    event.preventDefault();
    toggleModal(newNoteModal);
    let titleBox = newNoteModal.querySelector('#title');
    let noteBox = newNoteModal.querySelector('#note');

    let data = {
        title: titleBox.value,
        note: noteBox.value
    }

    titleBox.value = "";
    noteBox.value = "";

    fetch(url + 'notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((response) => {
        if(response.ok) {
            return response.json();
        }
        else {
            let err = new Error('Failed to add the new note!');
            throw err;
        }
    })
    .then((note) => {
        const row = document.querySelector('#notes');
        let newNote = document.createElement('div');
        newNote.className = "col-12 col-sm-4";
        newNote.innerHTML = `
            <div class="card mb-5 bg-warning id-${note.id}" >
                <div class="card-header">
                    ${note.title}
                </div>
                <div class="card-body">
                    ${note.note}
                </div> 
            </div>`;

        row.appendChild(newNote);
        showAlert('Note added successfully!', 'success');
    })
    .catch((err) => {
        console.log(err);
        showAlert('Failed to add the new note!', 'danger');
    });
});



changeNoteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    toggleModal(showNoteModal);

    let id = showNoteModal.querySelector('#id').value;
    let title = showNoteModal.querySelector('#title').value;
    let note = showNoteModal.querySelector('#note').value;

    let data = {
        id: id,
        title: title,
        note: note
    };

    fetch(url + 'notes/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((response) => {
        if(response.ok)
            return response.json();
        else {
            let err = new Error('Failed to update the note!');
            throw err;
        }
    })
    .then((note) => {
        let noteCard = document.querySelector('#notes .card.id-' + note.id);
        noteCard.querySelector('.card-header').innerHTML = note.title;
        noteCard.querySelector('.card-body').innerHTML = note.note;

        showAlert('Note updated successfully!', 'success');
    })
    .catch((err) => {
        console.log(err);
        showAlert('Failed to update the note!', 'danger');
    });
});


/**
 * delete a note
 */
function deleteNote(){
    let noteId = parseInt( showNoteModal.querySelector('#id').value );
    let data = { id: noteId };
    toggleModal(showNoteModal);

    fetch(url + 'notes', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((response) => {
        if(response.ok)
            return response.json();
        else {
            let err = new Error('Failed to update the note!');
            throw err;
        }
    })
    .then((noteId) => {
        let NoteToDelete = document.querySelector('#notes .card.id-' + noteId.id).parentElement;
        NoteToDelete.remove();

        let cards = document.querySelectorAll('#notes .card');
        let i = 0;
        cards.forEach((card) => {
            card.className = "card mb-5 bg-warning id-" + i;
            i++;
        })
        showAlert('Note deleted successfully!', 'success');
    })
    .catch((err) => {
        console.log(err);
        showAlert('Failed to delete the note!', 'danger');
    });
}
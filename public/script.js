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



/**
 * create a card element
 */
function createCard(note) {
    let col = document.createElement('div');
    col.className = "col-12 col-sm-4";
    col.innerHTML = `
        <div class="card mb-5 bg-warning id-${note.id}" >
            <div class="card-header">
                ${note.title}
            </div>
            <div class="card-body">
                ${note.note}
            </div> 
        </div>`;
    
    col.querySelector('.card').addEventListener('click', () => {
        showNoteModal.querySelector('#id').value = note.id;
        showNoteModal.querySelector('#title').value = note.title;
        showNoteModal.querySelector('#note').value = note.note;

        toggleModal(showNoteModal);
    });

    return col;
}

/**
 * Filter notes when the user search for something
 */
function search() {
    let input = document.querySelector('#search').value;
    if (input != "") {
        input = input.toUpperCase();
    }

    let notes = document.querySelectorAll('#notes .card');
    notes.forEach((note) => {
        let text = note.querySelector('.card-header').innerText || note.querySelector('.card-header').textContent;
        text += " " + note.querySelector('.card-body').innerText || note.querySelector('card-body').textContent;
        if (text.toUpperCase().indexOf(input) < 0){
            note.parentElement.style.display = "none";
        }
        else {
            note.parentElement.style.display = "";
        }
    })
}

//Toggle newNoteModal when the user clicks outside the modal
window.addEventListener('click', (event) => {
    if(event.target == newNoteModal){
        toggleModal(newNoteModal);
    }
});

//Toggle showNoteModal when the user clicks outside the modal
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
            notes.forEach((note) => {
                row.appendChild(createCard(note));
            });
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
        row.appendChild(createCard(note));
        showAlert('Note added successfully!', 'success');
    })
    .catch((err) => {
        console.log(err);
        showAlert('Failed to add the new note!', 'danger');
    });
});


//handle the event of changing the content of a note
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
    let noteId = showNoteModal.querySelector('#id').value;
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
        showAlert('Note deleted successfully!', 'success');
    })
    .catch((err) => {
        console.log(err);
        showAlert('Failed to delete the note!', 'danger');
    });
}
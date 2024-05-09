import notesData from "./notesData.js";
import NotesContainer from "./custom/container.js";
import NotesItem from "./custom/item.js";
import Form from "./custom/form.js";
import Footer from "./custom/footer.js";

function isStorageExist(){
    if (typeof(Storage) !== undefined){
        return true;
    } else {
        alert('Browser kamu tidak mendukung Web Storage. Silahkan gunakan browser yang mendukung.');
        return false;
    }
}

function popUp(text){
    document.getElementById('pop-up').style.display = 'flex';
    document.getElementById('overlay').style.display = 'block';
    document.querySelector('#pop-up p').innerText = text;
    document.getElementById('refresh').addEventListener('click', function(){
        window.location.reload();
        document.getElementById('pop-up').style.display = 'none';
    });
}

function saveData(text){
    if (isStorageExist()){
        const parsed = JSON.stringify(notesData);
        localStorage.setItem('NOTES_KEY', parsed);
        popUp(text);
    }
}

function findNoteIndex(noteId) {
    for (const index in notesData) {
        if (notesData[index].id === noteId) {
            return index;
        }
    }
    return -1;
}

function submitForm(){
    const titleNote = document.getElementById('title-note');
    const bodyNote = document.getElementById('body-note');

    document.querySelector('form').addEventListener('submit', (event) => {
        const tempObject = {
            id : `notes-${+new Date()}`,
            title: titleNote.value,
            body: bodyNote.value,
            createdAt: new Date(),
            archived: false
        }
        notesData.push(tempObject);
        event.preventDefault();
        saveData('Catatan berhasil ditambahkan');
    });

    function customValidationHandler(event){
        event.target.setCustomValidity('');
        if (event.target.validity.valueMissing){
            event.target.setCustomValidity('Wajib diisi');
            return;
        };
        return;
    };

    titleNote.addEventListener('change', customValidationHandler);
    titleNote.addEventListener('invalid', customValidationHandler);
    titleNote.addEventListener('blur', (event) => {validation(event)});

    bodyNote.addEventListener('change', customValidationHandler)
    bodyNote.addEventListener('invalid', customValidationHandler)
    bodyNote.addEventListener('blur', (event) => {validation(event)});

    const validation = (event) => {
        const errorMessage = event.target.validationMessage;
        const connectedValidationId = event.target.getAttribute('aria-describedby');
        const connectedValidationEl = connectedValidationId ? document.getElementById(connectedValidationId):null;

        if (customValidationHandler && errorMessage){
            connectedValidationEl.innerText = 'Wajib diisi';
        } else {
            connectedValidationEl.innerText = '';
        }
    }
};

document.addEventListener('DOMContentLoaded', function(){
    if (localStorage.getItem('NOTES_KEY')==null){
        localStorage.setItem('NOTES_KEY', JSON.stringify(notesData));
    } else {
        notesData.length = 0;
        const serializedData = localStorage.getItem('NOTES_KEY');
        let data = JSON.parse(serializedData);
      
        if (data !== null) {
            for (const dataItem of data) {
                notesData.push(dataItem);
            }
        } 
    }

    // Custom element
    customElements.define('notes-container', NotesContainer);
    customElements.define('notes-item', NotesItem);
    customElements.define('form-card', Form);
    customElements.define('footer-web', Footer);

    submitForm();

    document.querySelectorAll('.button-delete').forEach(item => {
        item.addEventListener('click', function(){
            const noteId = item.parentElement.parentElement.getAttribute('id');
            const noteTarget = findNoteIndex(noteId);
            notesData.splice(noteTarget,1);
            saveData('Catatan berhasil dihapus');
        })
    })

    const mode = document.getElementById('mode');
    mode.addEventListener('click', function(){
        document.querySelector('form').reset();
        if (mode.textContent=='Mode Baca Catatan'){
            mode.innerText = 'Mode Tambah Catatan';
            document.querySelector('form-card').setAttribute('display', 'none');
        } else {
            mode.innerText = 'Mode Baca Catatan';
            document.querySelector('form-card').setAttribute('display', 'block');
        }
        submitForm();
    });
});
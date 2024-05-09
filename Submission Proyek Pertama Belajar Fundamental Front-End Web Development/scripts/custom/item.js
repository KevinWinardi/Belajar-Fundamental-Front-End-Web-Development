import notesData from "../notesData.js";

let counter = 0;
class NotesItem extends HTMLElement{
    constructor(){
        super();
        this.render();
    }
    render(){
        const {id, title, body, createdAt, archived} = notesData[counter];
        this.setAttribute('id', id);
        this.innerHTML = `
            <h3>${title}</h3>
            <p>${body}</p>
            <div>
                <p>${new Date(createdAt).toISOString()}</p>
                <button class="button button-delete">Hapus</button>
            </div>
        `;
        counter++;
    };


};

export default NotesItem;
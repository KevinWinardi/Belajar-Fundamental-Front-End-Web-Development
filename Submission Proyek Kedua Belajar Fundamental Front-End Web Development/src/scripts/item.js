import { notesDataAr, notesDataUn } from "../index.js";

let counter = 0;
class NotesItem extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    const { id, title, body, createdAt, archived } = [
      ...notesDataAr,
      ...notesDataUn,
    ][counter];
    this.setAttribute("id", id);
    this.innerHTML = `
            <h3>${title}</h3>
            <p>${body}</p>
            <div>
                <p>${new Date(createdAt).toISOString()}</p>
                <div>
                    <button class="button button-delete">Delete</button>
                    <button class="button button-move">${archived ? "Unarchive" : "Archive"}</button>
                </div>
            </div>
        `;
    if (!archived) {
      document.getElementById("unarchive").append(this);
    } else {
      document.getElementById("archived").append(this);
    }
    counter++;
  }
}

export default NotesItem;

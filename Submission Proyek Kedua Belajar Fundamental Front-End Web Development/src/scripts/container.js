import { notesDataAr, notesDataUn } from "../index.js";

class NotesContainer extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    this.innerHTML = `
            <div id="unarchive" class="grid"></div>
            <h2>Archive Notes <i id="expand" class="fa fa-angle-double-down"></i></h2>
            <div id="archived" class="none"></div>
        `;
    for (let i = 0; i < notesDataUn.length; i++) {
      document.getElementById("unarchive").innerHTML +=
        "<notes-item></notes-item>";
    }

    for (let i = 0; i < notesDataAr.length; i++) {
      document.getElementById("archived").innerHTML +=
        "<notes-item></notes-item>";
    }
  }
}
export default NotesContainer;

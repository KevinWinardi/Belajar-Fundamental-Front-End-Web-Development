import notesData from "../notesData.js";

class NotesContainer extends HTMLElement{
    constructor(){
        super();
        this.render();
    }
    render(){
        for (let i=0; i<notesData.length; i++){
            this.append( document.createElement('notes-item'));
        }
    }
}
export default NotesContainer;
import "./style/style.css";
import anime from "animejs/lib/anime.es.js";
import NotesContainer from "./scripts/container.js";
import NotesItem from "./scripts/item.js";
import Form from "./scripts/form.js";
import Footer from "./scripts/footer.js";
import notesDataDummy from "./scripts/dummy.js";
export const notesDataUn = [];
export const notesDataAr = [];
let dataLocal = [];

function isStorageExist() {
  if (typeof Storage !== undefined) {
    return true;
  } else {
    alert(
      "Browser kamu tidak mendukung Web Storage. Silahkan gunakan browser yang mendukung.",
    );
    return false;
  }
}

function popUp(text) {
  document.getElementById("pop-up").style.display = "flex";
  document.getElementById("pop-up").style.animation = "popup 3s";
  document.getElementById("overlay").style.display = "block";
  document.querySelector("#pop-up p").innerText = text;
  document.addEventListener("keydown", function (event) {
    if (event.key == "Enter" || event.key == " ") {
      event.preventDefault();
      window.location.reload();
    }
  });
  document.getElementById("refresh").addEventListener("click", function () {
    window.location.reload();
  });
}

function saveData(text, localBool) {
  if (isStorageExist()) {
    if (localBool) {
      const parsed = JSON.stringify(dataLocal);
      localStorage.setItem("NOTES_KEY", parsed);
    }
    popUp(text);
  }
}

function findNote(noteId) {
  for (const noteItem of [...notesDataAr, ...notesDataUn]) {
    if (noteItem.id === noteId) {
      return noteItem;
    }
  }
  return null;
}

function findNoteIndex(noteId) {
  for (const index in dataLocal) {
    if (dataLocal[index].id === noteId) {
      return index;
    }
  }
  return -1;
}

function submitForm() {
  const titleNote = document.getElementById("title-note");
  const bodyNote = document.getElementById("body-note");
  document.querySelector("form").addEventListener("submit", (event) => {
    const note = {
      title: titleNote.value,
      body: bodyNote.value,
    };
    insertNote(note);
    event.preventDefault();
  });

  function customValidationHandler(event) {
    event.target.setCustomValidity("");
    if (event.target.validity.valueMissing) {
      event.target.setCustomValidity("Required");
      return;
    }
    return;
  }

  titleNote.addEventListener("change", customValidationHandler);
  titleNote.addEventListener("invalid", customValidationHandler);
  titleNote.addEventListener("blur", (event) => {
    validation(event);
  });

  bodyNote.addEventListener("change", customValidationHandler);
  bodyNote.addEventListener("invalid", customValidationHandler);
  bodyNote.addEventListener("blur", (event) => {
    validation(event);
  });

  const validation = (event) => {
    const errorMessage = event.target.validationMessage;
    const connectedValidationId = event.target.getAttribute("aria-describedby");
    const connectedValidationEl = connectedValidationId
      ? document.getElementById(connectedValidationId)
      : null;

    if (customValidationHandler && errorMessage) {
      connectedValidationEl.innerText = "Required";
    } else {
      connectedValidationEl.innerText = "";
    }
  };
}

function render() {
  customElements.define("notes-container", NotesContainer);
  customElements.define("notes-item", NotesItem);
  document.querySelectorAll(".button-delete").forEach((item) => {
    item.addEventListener("click", function () {
      let localBool = false;
      const noteId =
        item.parentElement.parentElement.parentElement.getAttribute("id");

      // Remove data if from dataLocal (dummy)
      for (const data of dataLocal) {
        if (data.id == noteId) {
          localBool = true;
          dataLocal.splice(findNoteIndex(noteId), 1);
          saveData("Note deleted", localBool);
          break;
        }
      }

      // Remove data if from data fetch
      removeNote(noteId);
    });
  });

  document.querySelectorAll(".button-move").forEach((item) => {
    item.addEventListener("click", function () {
      let localBool = false;
      let text = "";
      const noteId = findNote(
        item.parentElement.parentElement.parentElement.getAttribute("id"),
      ).id;

      // Remove data if from dataLocal (dummy)
      for (const data of dataLocal) {
        if (data.id == noteId) {
          localBool = true;
          if (data.archived) {
            data.archived = false;
            text = "Note unarchived";
          } else {
            data.archived = true;
            text = "Note archived";
          }
          saveData(text, localBool);
          break;
        }
      }

      // Remove data if from data fetch
      if (!localBool) {
        updateNote(noteId);
      }
    });
  });

  const expand = document.getElementById("expand");
  expand.addEventListener("click", function () {
    const archivedContainer = document.getElementById("archived");
    if (archivedContainer.className == "none") {
      expand.setAttribute("class", "fa fa-angle-double-up");
      archivedContainer.classList.replace("none", "grid");
    } else {
      expand.setAttribute("class", "fa fa-angle-double-down");
      archivedContainer.classList.replace("grid", "none");
    }
  });
}

const updateNote = async (noteId) => {
  try {
    const response = await fetch(`${base_url}/notes/${noteId}`);
    const responseJson = await response.json();

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(responseJson),
    };

    let archiv = responseJson.data.archived;
    archiv = archiv ? (archiv = "unarchive") : (archiv = "archive");
    const response2 = await fetch(
      `${base_url}/notes/${responseJson.data.id}/${archiv}`,
      options,
    );
    const responseJson2 = await response2.json();
    saveData(responseJson2.message);
  } catch (error) {
    saveData(error);
  }
};

const base_url = "https://notes-api.dicoding.dev/v2";
const getNote = async () => {
  try {
    document.getElementById("loading-indicator").style.display = "block";
    document.getElementById("overlay").style.display = "block";

    // Unarchive
    const response = await fetch(`${base_url}/notes`);
    const responseJson = await response.json();

    // Archive
    const response2 = await fetch(`${base_url}/notes/archived`);
    const responseJson2 = await response2.json();

    if (responseJson.error) {
      saveData(responseJson.message);
    } else {
      for (let i = 0; i < responseJson.data.length; i++) {
        notesDataUn.unshift(responseJson.data[i]);
      }
      for (let i = 0; i < responseJson2.data.length; i++) {
        notesDataAr.unshift(responseJson2.data[i]);
      }
      render();
    }
  } catch (error) {
    saveData(error);
  };
  document.getElementById("loading-indicator").style.display = "none";
  document.getElementById("overlay").style.display = "none";
};

const insertNote = async (note) => {
  try {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    };
    const response = await fetch(`${base_url}/notes`, options);
    const responseJson = await response.json();

    options.body = JSON.stringify(responseJson.data);
    const archiv = document.getElementById("checkbox").checked
      ? "archive"
      : "unarchive";

    const response2 = await fetch(
      `${base_url}/notes/${responseJson.data.id}/${archiv}`,
      options,
    );
    const responseJson2 = await response2.json();
    saveData(responseJson2.message);
  } catch (error) {
    saveData(error);
  }
};

const removeNote = async (noteId) => {
  try {
    const options = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    const response = await fetch(`${base_url}/notes/${noteId}`, options);
    const responseJson = await response.json();
    saveData(responseJson.message);
  } catch (error) {
    saveData(error);
  }
};

document.addEventListener("DOMContentLoaded", function () {
  // Insert dummy note to local storage
  if (localStorage.getItem("NOTES_KEY") == null) {
    localStorage.setItem("NOTES_KEY", JSON.stringify(notesDataDummy));
  };

  const serializedData = localStorage.getItem("NOTES_KEY");
  dataLocal = JSON.parse(serializedData);

  if (dataLocal !== null) {
    for (const data of dataLocal) {
      if (data.archived) {
        notesDataAr.push(data);
      } else {
        notesDataUn.push(data);
      }
    }
  };

  getNote();
  customElements.define("form-card", Form);
  customElements.define("footer-web", Footer);
  submitForm();

  const mode = document.getElementById("mode");
  mode.addEventListener("click", function () {
    document.querySelector("form").reset();
    if (mode.textContent == "Read Note Mode") {
      mode.innerText = "Add Note Mode";
      document.querySelector("form-card").setAttribute("display", "none");
    } else {
      mode.innerText = "Read Note Mode";
      document.querySelector("form-card").setAttribute("display", "block");
    }
    submitForm();
  });

  let lastScrollTop = 0;
  window.addEventListener("scroll", function () {
    const currentScrollTop = window.scrollY;
    if (currentScrollTop >= 600) {
      if (currentScrollTop >= lastScrollTop) {
        anime({
          targets: "notes-item",
          scale: [
            { value: 0.8, easing: "easeOutSine", duration: 300 },
            { value: 1, easing: "easeInOutQuad", duration: 500 },
          ],
          delay: anime.stagger(200, { grid: [14, 5], from: "center" }),
        });
      }
      lastScrollTop = currentScrollTop;
    }
  });
});

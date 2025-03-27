let db;

const request = indexedDB.open("NotesDB", 1);

request.onerror = () => {
  console.error("💥 Error opening IndexedDB");
};

request.onsuccess = (event) => {
  db = event.target.result;
  loadNotes();
};

request.onupgradeneeded = (event) => {
  db = event.target.result;
  db.createObjectStore("notes", { autoIncrement: true });
};

function saveNote() {
  const noteInput = document.getElementById("note");
  const tx = db.transaction("notes", "readwrite");
  const store = tx.objectStore("notes");
  store.add(noteInput.value);
  tx.oncomplete = () => {
    noteInput.value = "";
    loadNotes();
  };
}

function loadNotes() {
  const tx = db.transaction("notes", "readonly");
  const store = tx.objectStore("notes");
  const request = store.openCursor();
  const notesList = document.getElementById("notes");
  notesList.innerHTML = "";

  request.onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      const li = document.createElement("li");
      li.textContent = cursor.value;
      notesList.appendChild(li);
      cursor.continue();
    }
  };
}

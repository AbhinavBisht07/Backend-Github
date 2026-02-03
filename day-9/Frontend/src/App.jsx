import { useEffect, useState } from 'react'
import axios from "axios";


function App() {

  const [notes, setNotes] = useState([]); //state variable

  function fetchNotes() {
    axios.get('http://localhost:3000/api/notes')
      .then((res) => {
        // console.log(res.data.notes);
        setNotes(res.data.notes);
      })
  }

  useEffect(() => {
    fetchNotes();
  }, [])

  function handleSubmit(e) {
    e.preventDefault()

    // console.dir(e.target.elements);
    const { title, description } = e.target.elements;

    // console.log(title.value, description.value);

    axios.post("http://localhost:3000/api/notes", {
      title: title.value,
      description: description.value
    })
      .then(res => {
        console.log(res.data);
        fetchNotes(); //render new data
      })
  }

  function handleDeleteNote(noteId) {
    // console.log(noteId);
    axios.delete(`http://localhost:3000/api/notes/${noteId}`)
      .then(res => {
        console.log(res.data);
        fetchNotes()
      })
  }

  // function handleUpdateTitle(noteId) {
  //   // console.log(noteId);
  //   const newTitle = prompt("Enter new title");
  //   axios.patch(`http://localhost:3000/api/notes/${noteId}`, {
  //     title: newTitle
  //   })
  //     .then((res) => {
  //       console.log(res.data);
  //       fetchNotes()//refresh UI
  //     })
  // }
  function handleUpdateDescription(noteId) {
    // console.log(noteId)
    const newDescription = prompt("Enter new description");
    axios.patch(`http://localhost:3000/api/notes/${noteId}`, {
      description: newDescription
    })
      .then((res) => {
        console.log(res.data);
        fetchNotes()//refresh UI
      })
  }

  return (
    <>
      <form className="note-create-form" onSubmit={handleSubmit}>
        <input name='title' type="text" placeholder='Enter title' />
        <input name='description' type="text" placeholder='Enter description' />
        <button>Create Note</button>
      </form>

      <div className="notes">
        {
          notes.map(note => {
            return <div className="note">
              <h1>{note.title}</h1>
              <p>{note.description}</p>
              <button
                className='delete'
                onClick={() => {
                  handleDeleteNote(note._id);
                }}>
                Delete
              </button>

              {/* <button
                className='update'
                onClick={() => {
                  handleUpdateTitle(note._id);
                }}>
                Update Title
              </button> */}

              <button className='update'
                onClick={() => {
                  handleUpdateDescription(note._id);
                }}>
                Update Description
              </button>
            </div>
          })
        }
      </div>
    </>
  )
}

export default App

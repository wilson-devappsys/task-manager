import Header from "./components/Header";
import Tasks from './components/Tasks'
import { useState, useEffect } from 'react'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'
import { BrowserRouter as Router, Route } from "react-router-dom";


function App() {

  const BASE_URL = 'http://localhost:5000/'

  const [showAddTask, setShowAddTask] = useState(false)

  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()

  }, [])

  const fetchTasks = async () => {
    const res = await fetch(BASE_URL + 'tasks')
    const data = await res.json()
    console.log("fetchTasks : ", data);
    return data
  }

  const fetchTask = async (id) => {
    const res = await fetch(BASE_URL + `tasks/${id}`)
    const data = await res.json()
    console.log("fetchTask : ", data);
    return data
  }

  const deleteTask = async (id) => {

    await fetch(BASE_URL + `tasks/${id}`, {
      method: 'DELETE'
    })

    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleReminder = async (id) => {

    const taskToToggle = await fetchTask(id)
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder }


    const res = await fetch(BASE_URL + `tasks/${id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    })

    const data = await res.json()

    setTasks(tasks.map((task) =>
      task.id === id ? {
        ...task, reminder: data.reminder
      } :
        task
    ))
  }

  const addTask = async (task) => {
    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = { id, ...task }

    const res = await fetch(BASE_URL + 'tasks', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()

    setTasks([...tasks, data])

  }

  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
        {showAddTask && <AddTask onAdd={addTask} />}

        <Route
          path="/"
          exact
          render={(props) => (
            <>
              {
                tasks.length > 0 ?
                  (
                    <Tasks
                      tasks={tasks}
                      onDelete={deleteTask}
                      onToggle={toggleReminder}
                    />
                  ) :
                  (
                    'No Tasks To Show'
                  )
              }
            </>
          )}
        />
        <Route path="/about" component={About} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;

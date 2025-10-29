import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import empty_state_img from '../assets/images/empty_state-no-bg.png'
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Todo.css'



function TodoApp(){

    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api/todos'

    const [newTask, setNewTask] = useState("")
    const [tasks, setTask] = useState([]) // server todos: { _id, text, completed, order, ... }
    const [editIndex, setEditIndex] = useState(null)
    const [isBlocked, setIsBlocked] = useState('blocked-btn')

    // Fetch todos from server
    async function fetchTodos() {
        try {
            const res = await fetch(API_BASE)
            const data = await res.json()
            if(res.ok && data.success) {
                setTask(data.todos || [])
            } else {
                throw new Error(data.message || 'Failed to load todos')
            }
        } catch (err) {
            console.error(err)
            MySwal.fire({ icon: 'error', title: 'Unable to load todos', text: err.message || err })
        }
    }

    useEffect(() => {
        fetchTodos()
    }, [])

    function handleInputChange(event){
        setNewTask(event.target.value)
        const editText = editIndex !== null ? tasks[editIndex]?.text : null
        if(event.target.value.length === 0 || (editIndex !== null && editText === event.target.value)) {
            setIsBlocked('blocked-btn')
        }else{
            setIsBlocked('unblocked-btn')
        }
    }

    // Add or save (edit) using server endpoints
    async function addOrSaveTask(){
        if(newTask.trim() === "") return

        try {
            if(editIndex !== null){
                const todo = tasks[editIndex]
                if(!todo || !todo._id) throw new Error('Invalid todo selected')

                const res = await fetch(`${API_BASE}/${todo._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: newTask.trim() })
                })
                const data = await res.json()
                if(!res.ok || !data.success) throw new Error(data.message || 'Failed to update')

                setEditIndex(null)
                setNewTask("")
                setIsBlocked('blocked-btn')
                await fetchTodos()

                MySwal.fire({ toast: true, icon: 'success', position: 'top', showConfirmButton: false, timer: 1500, title: "Task updated successfully", background: "#1e1e1e", color: "#d3d3d3", timerProgressBar: true })
            }else{
                const res = await fetch(API_BASE, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: newTask.trim() })
                })
                const data = await res.json()
                if(!res.ok || !data.success) throw new Error(data.message || 'Failed to add')

                setNewTask("")
                setIsBlocked('blocked-btn')
                await fetchTodos()

                MySwal.fire({ toast: true, position: 'top', showConfirmButton: false, timer: 2000, timerProgressBar: true, icon: 'success', title: 'Task added successfully', background: '#1e1e1e', color: '#d3d3d3' })
            }
        } catch (err) {
            console.error(err)
            MySwal.fire({ icon: 'error', title: 'Error', text: err.message || err })
        }
    };

    // Delete via server
    function deleteTask(index) {
        const taskName = tasks[index]?.text || ''
        const id = tasks[index]?._id
        if(!id) {
            MySwal.fire({ icon: 'error', title: 'Error', text: 'Invalid task' })
            return
        }

        MySwal.fire({
            title: <p>Are you sure?</p>,
            html: <i>Do you want to delete <b>{taskName}</b>?</i>,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
            background: '#1e1e1e',
            color: '#d3d3d3',
            customClass: { popup: 'my-toast' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
                    const data = await res.json()
                    if(!res.ok || !data.success) throw new Error(data.message || 'Delete failed')
                    await fetchTodos()
                    MySwal.fire({ toast: true, icon: 'success', position: 'top', showConfirmButton: false, timer: 1500, title: `${taskName} deleted`, background: '#1e1e1e', color: '#d3d3d3' })
                } catch (err) {
                    console.error(err)
                    MySwal.fire({ icon: 'error', title: 'Delete failed', text: err.message || err })
                }
            }
        });
    }

    function editTask(index){
        const allTasks = [...tasks]
        setEditIndex(index)
        setNewTask(allTasks[index].text)

        setTimeout(() => {
            const input = document.querySelector('input')
            if(input){
                input.focus()
            }
        }, 0);
    }

    // Reorder todos on server




    // Move todo UP
        const moveUp = (index) => {
        if (index === 0) return; // already at top
        const newTasks = [...tasks];
        [newTasks[index - 1], newTasks[index]] = [newTasks[index], newTasks[index - 1]];
        setTask(newTasks);
        };

        // Move todo DOWN
        const moveDown = (index) => {
        if (index === tasks.length - 1) return; // already at bottom
        const newTasks = [...tasks];
        [newTasks[index + 1], newTasks[index]] = [newTasks[index], newTasks[index + 1]];
        setTask(newTasks);
        };


    // Toggle completion via server - server will adjust ordering and return todos
    async function handleTaskCompletion(index) {
        const todo = tasks[index]
        if(!todo || !todo._id) {
            MySwal.fire({ icon: 'error', title: 'Error', text: 'Invalid task' })
            return
        }
        try {
            const res = await fetch(`${API_BASE}/${todo._id}/completed`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !todo.completed })
            })
            const data = await res.json()
            if(!res.ok || !data.success) throw new Error(data.message || 'Failed to update completion')
            // server returns updated todo and todos list
            if(data.todos) setTask(data.todos)
            else await fetchTodos()
        } catch (err) {
            console.error(err)
            MySwal.fire({ icon: 'error', title: 'Error', text: err.message || err })
        }
    }


    return(
        <div className='container'>

        <h1>TODO LIST</h1>
        <div className="input-container">

            <input 
            type="text" 
            value={newTask}
            onChange={handleInputChange}
            placeholder='Enter Task...' 
            autoFocus={editIndex !== null}
            onKeyDown={(e)=>{
                if(e.key === 'Enter') addOrSaveTask()
                }}
            />

        {editIndex !== null ? 
            <div className="edit-save-btn">
                <button type="submit" onClick={addOrSaveTask} className={`submit ${isBlocked}`}>Save Task</button>
                <button className='cancel-edit' onClick={()=>{
                    setEditIndex(null)
                    setNewTask("")
                    }}>Cancel</button>
            </div>

        : <button type="submit" onClick={addOrSaveTask} className={`submit ${isBlocked}`}>Add Task</button> }
        </div>
        

        <div className="task-container">
            <h2>Tasks</h2>
            {tasks.length === 0 && (
                <div className="empty-tasks">
                    <img src={empty_state_img} alt="Empty Tasks" />
                </div>
            )}
            {tasks.length > 0 && (       
                <ol className="todos">
                    {tasks.map((task, index)=>(
                        <li key={task._id || (task.text + index)}>
                            <div className="task-content">
                                <input 
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => handleTaskCompletion(index)}
                                    className="task-checkbox"
                                />
                                <span className="text" style={{
                                    textDecoration: task.completed ? 'line-through' : 'none',
                                    color: task.completed ? '#666' : 'inherit'
                                }}>
                                    {task.text}
                                </span>
                            </div>

                            <div className="buttons">
                                <button onClick={()=>{deleteTask(index)}} className="delete">
                                    <i className="fa-solid fa-trash fa-lg" style={{color: "#ffffff"}}></i>
                                </button>

                                <button onClick={()=>{editTask(index)}} className="edit">
                                    <i className="fa-solid fa-edit fa-lg" style={{ color: "#ffffff" }}></i>
                                </button>

                                <div className="up-down-btn">
                                    <button onClick={()=>{moveUp(index)}} className="move-up">
                                    <i className="fa-solid fa-arrow-up" style={{color: "#ffffff"}}></i>
                                    </button>
                                    <button onClick={()=>{moveDown(index)}} className="move-down">
                                    <i className="fa-solid fa-arrow-down" style={{color: "#ffffff"}}></i>
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ol>
            )}
        </div>

        </div>
    )}

export default TodoApp
import { PlusCircle } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

import styles from './App.module.css'

import { Button } from './components/Button'
import { Header } from './components/Header'
import { Input } from './components/Input'
import { Empty } from './components/List/Empty'
import { Header as ListHeader } from './components/List/Header'
import { Item } from './components/List/Item'
import { api } from './libs/axios'

export interface ITask {
  id: number
  userId?: number
  todo: string
  completed: boolean
}

export function App() {
  const [tasks, setTasks] = useState<ITask[]>([])
  const [inputValue, setInputValue] = useState('')

  async function getTodos() {
    await api
      .get('/todos?limit=10')
      .then((response) => {
        setTasks(response.data.todos)
        console.log('[RESPONSE][GET TODOS] ', response)
      })
      .catch((error) => {
        setTasks([])
        console.log('[ERROR][GET TODOS] ', error)
      })
  }

  const checkedTasksCounter = tasks.reduce((prevValue, currentTask) => {
    if (currentTask.completed) {
      return prevValue + 1
    }

    return prevValue
  }, 0)

  function handleAddTask() {
    if (!inputValue) {
      return
    }

    const newTask: ITask = {
      id: new Date().getTime(),
      todo: inputValue,
      completed: false,
    }

    setTasks((state) => [...state, newTask])
    setInputValue('')
  }

  function handleRemoveTask(id: number) {
    const filteredTasks = tasks.filter((task) => task.id !== id)

    if (!confirm('Deseja mesmo apagar essa tarefa?')) {
      return
    }

    setTasks(filteredTasks)
  }

  function handleToggleTask({ id, value }: { id: number; value: boolean }) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: value }
      }

      return { ...task }
    })

    setTasks(updatedTasks)
  }

  useEffect(() => {
    getTodos()
  }, [])

  return (
    <main>
      <Header />

      <section className={styles.content}>
        <div className={styles.taskInfoContainer}>
          <Input
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
          />
          <Button onClick={handleAddTask}>
            Criar
            <PlusCircle size={16} color="#f2f2f2" weight="bold" />
          </Button>
        </div>

        <div className={styles.tasksList}>
          <ListHeader
            tasksCounter={tasks.length}
            checkedTasksCounter={checkedTasksCounter}
          />

          {tasks.length > 0 ? (
            <div>
              {tasks.map((task) => (
                <Item
                  key={task.id}
                  data={task}
                  removeTask={handleRemoveTask}
                  toggleTaskStatus={handleToggleTask}
                />
              ))}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      </section>
    </main>
  )
}

import { useState, useContext } from 'react';
import { AppProvider, AppContext } from './AppContext';
import './index.css';

function TaskFlow() {
  const { theme, toggleTheme, actionCount, addAction } = useContext(AppContext);
  // список задач
  const [tasks, setTasks] = useState([]);
  // формa
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('low');
  const [status, setStatus] = useState('new');
  // id задачи
  const [taskID, setTaskID] = useState(null);
  // фильтры
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  // состояние для предыдущего поиска
  const [prevSearch, setPrevSearch] = useState('');
  function handleSearch(value) {
    setPrevSearch(search); 
    setSearch(value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (title.trim() === '') {
      alert('название не может быть пустым');
      return;
    }
    if (taskID !== null) {
      const newTasks = tasks.map((t) =>
        t.id === taskID
          ? {...t, title,description,priority, status}
          : t
      );
      setTasks(newTasks);
      setTaskID(null);
    } else {
      const newTask = {
        id: Date.now(),
        title,
        description,
        priority,
        status,
      };
      setTasks([...tasks,newTask]);
    }
    setTitle('');
    setDescription('');
    setPriority('low');
    setStatus('new');
    addAction();
  }
  function handleDelete(id) {
    setTasks(tasks.filter((t) => t.id !== id));
    addAction();
  }
  function handleEdit(task) {
    setTaskID(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setStatus(task.status);
    addAction();
  }
  function handleStatusChange(id, newStatus) {
    const newTasks = tasks.map((t) =>
      t.id === id ? {...t,status:newStatus} : t
    );
    setTasks(newTasks);
    addAction();
  }
  function resetFilters() {
    setSearch('');
    setFilterStatus('all');
    setFilterPriority('all');
  }
  const filteredTasks = tasks.filter((t) => {
    const bySearch = t.title.toLowerCase().includes(search.toLowerCase());
    const byStatus = filterStatus === 'all' || t.status === filterStatus;
    const byPriority = filterPriority === 'all' || t.priority === filterPriority;
    return bySearch && byStatus && byPriority;
  });
  // статистика
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  return (
    <div className={theme === 'dark' ? 'app dark' : 'app'}>
      <div className="header">
        <h2>task-flow</h2>
        <div>
          <span>действия пользователя: {actionCount}</span>
          <button onClick={toggleTheme}>
            {theme === 'light' ? 'темная тема' : 'светлая тема'}
          </button>
        </div>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <h3>{taskID ? 'редактировать' : 'новая задача'}</h3>
        <input
          type="text"
          placeholder="название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="row">
          <label>
            приоритет:{' '}
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">низкий</option>
              <option value="medium">средний</option>
              <option value="high">высокий</option>
            </select>
          </label>
          <label>
            статус:{' '}
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="new">новый</option>
              <option value="in-progress">в процессе</option>
              <option value="done">завершен</option>
            </select>
          </label>
        </div>
        <div className="row">
          <button type="submit">{'сохранить'}</button>
          {taskID && (
            <button
              type="button"
              onClick={() => {
                setTaskID(null);
                setTitle('');
                setDescription('');
              }}
            >
              отменить
            </button>
          )}
        </div>
      </form>
      <div className="stats">
        <div>всего: {total}</div>
        <div>завершено: {done}</div>
        <div>в процессе: {inProgress}</div>
      </div>
      <div className="filters">
        <input
          type="text"
          placeholder="поиск по названию"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">все статусы</option>
          <option value="new">новый</option>
          <option value="in-progress">в процессе</option>
          <option value="done">завершен</option>
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="all">все приоритеты</option>
          <option value="low">низкий</option>
          <option value="medium">средний</option>
          <option value="high">высокий</option>
        </select>
        <button onClick={resetFilters}>сбросить</button>
      </div>
      {prevSearch && (
        <p>предыдущий поиск: «{prevSearch}»</p>
      )}
      <div className="list">
        {filteredTasks.length === 0 ? (
          <p>задач нет</p>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className={`task ${task.priority}`}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>
                приоритет: {task.priority === 'low' ? 'низкий' : task.priority === 'medium' ? 'средний' : 'высокий'} | статус: {task.status === 'new' ? 'новая' : task.status === 'in-progress' ? 'в процессе' : 'завершена'}
              </p>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
              >
                <option value="new">новая</option>
                <option value="in-progress">в процессе</option>
                <option value="done">завершена</option>
              </select>
              <button onClick={() => handleEdit(task)}>редактировать</button>
              <button onClick={() => handleDelete(task.id)}>удалить</button>
            </div>
          ))
        )}
      </div>
      <img src="https://images.restream-media.net/images/c6tnfvrir4sslltrm9tg.jpg" width={'630px'} height={'400px'}/>
    </div>
  );
}
export default function App() {
  return (
    <AppProvider>
      <TaskFlow />
    </AppProvider>
  );
}
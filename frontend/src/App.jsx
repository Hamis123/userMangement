import { useState, useEffect } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(res => res.json())
      .then(setUsers);

    fetch('http://localhost:3000/tasks')
      .then(res => res.json())
      .then(setTasks);
  }, []);

  const addUser = () => {
    if (!name) return alert('Nom requis');
    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
      .then(res => res.json())
      .then(user => {
        setUsers([...users, user]);
        setName('');
      });
  };

  const addTask = () => {
    if (!selectedUserId) return alert('Sélectionner un utilisateur');
    if (!title) return alert('Titre requis');
    fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: Number(selectedUserId), title }),
    })
      .then(res => res.json())
      .then(task => {
        setTasks([...tasks, task]);
        setTitle('');
      });
  };

  const toggleDone = (taskId) => {
    fetch(`http://localhost:3000/tasks/${taskId}/done`, { method: 'PUT' })
      .then(res => res.json())
      .then(updatedTask => {
        setTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));
      });
  };

  const deleteTask = (taskId) => {
    fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTasks(tasks.filter(t => t.id !== taskId));
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Gestion des utilisateurs et taches
        </h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Ajouter un utilisateur</h2>
          <div className="flex gap-2">
            <input
              className="border border-gray-300 rounded px-4 py-2 flex-1"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nom de l'utilisateur"
            />
            <button
              onClick={addUser}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Ajouter
            </button>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Ajouter une tâche</h2>
          <div className="flex flex-col md:flex-row gap-2">
            <select
              value={selectedUserId}
              onChange={e => setSelectedUserId(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2"
            >
              <option value="">Sélectionner un utilisateur</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            <input
              className="border border-gray-300 rounded px-4 py-2 flex-1"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Titre de la tâche"
            />
            <button
              onClick={addTask}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Ajouter
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Liste des tâches</h2>
          <ul className="space-y-3">
            {tasks.map(task => (
              <li
                key={task.id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded border"
              >
                <span>
                  <b className="text-blue-600">{users.find(u => u.id === task.userId)?.name}</b> — {task.title}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleDone(task.id)}
                    className={`px-3 py-1 rounded text-white ${
                      task.done ? 'bg-green-500' : 'bg-yellow-500 hover:bg-yellow-600'
                    }`}
                  >
                    {task.done ? 'Terminé' : 'En cours'}
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default App;

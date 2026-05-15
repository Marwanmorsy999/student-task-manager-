import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useTasks } from '../hooks/useTasks';
import Modal from '../components/ui/Modal';
import TaskForm from '../components/tasks/TaskForm';
import Button from '../components/ui/Button';

export default function CalendarPage() {
  const { tasks, addTask, editTask } = useTasks();
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const events = tasks.map(task => ({
    id: task._id,
    title: task.title,
    start: task.dueDate,
    backgroundColor: task.priority === 'high' ? '#ff3b30' : task.priority === 'medium' ? '#ff9500' : '#34c759',
    borderColor: task.priority === 'high' ? '#ff3b30' : task.priority === 'medium' ? '#ff9500' : '#34c759',
    textColor: '#ffffff',
    extendedProps: { task }
  }));

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setShowAdd(true);
  };

  const handleAdd = async (data) => {
    setAddLoading(true);
    try {
      await addTask({ ...data, dueDate: selectedDate });
      setShowAdd(false);
      setSelectedDate(null);
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[var(--text)] tracking-tight">Calendar</h1>
        <p className="text-sm text-[var(--text-2)] mt-1">View and manage your tasks by date.</p>
      </div>

      <div className="card p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          height="auto"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
          }}
          eventClick={(info) => {
            // Could open edit modal
            console.log('Event clicked:', info.event.extendedProps.task);
          }}
        />
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={`Add Task for ${selectedDate}`}>
        <TaskForm
          onSubmit={handleAdd}
          onCancel={() => setShowAdd(false)}
          loading={addLoading}
          initialData={{ dueDate: selectedDate }}
        />
      </Modal>
    </div>
  );
}
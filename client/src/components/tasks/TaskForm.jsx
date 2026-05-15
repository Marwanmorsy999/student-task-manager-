import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const CATEGORIES = ['General', 'Math', 'Science', 'Programming', 'Literature', 'Other'];

export default function TaskForm({ initial = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    title:       initial.title       || '',
    description: initial.description || '',
    priority:    initial.priority    || 'medium',
    status:      initial.status      || 'pending',
    dueDate:     initial.dueDate     ? initial.dueDate.slice(0, 10) : '',
    category:    initial.category    || 'General',
  });
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) return setError('Title is required');
    if (!form.dueDate)       return setError('Due date is required');
    try {
      await onSubmit({ ...form, dueDate: new Date(form.dueDate).toISOString() });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Task title"
        placeholder="e.g. Finish chapter 5 exercises"
        value={form.title}
        onChange={(e) => set('title', e.target.value)}
        error={error && !form.title ? error : ''}
        autoFocus
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[var(--text-2)]">Description</label>
        <textarea
          className="input-base resize-none h-20"
          placeholder="Optional notes…"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[var(--text-2)]">Due date</label>
          <input
            type="date"
            className="input-base"
            value={form.dueDate}
            onChange={(e) => set('dueDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[var(--text-2)]">Priority</label>
          <select value={form.priority} onChange={(e) => set('priority', e.target.value)} className="input-base">
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[var(--text-2)]">Status</label>
          <select value={form.status} onChange={(e) => set('status', e.target.value)} className="input-base">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[var(--text-2)]">Category</label>
          <select value={form.category} onChange={(e) => set('category', e.target.value)} className="input-base">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-[var(--high)] font-medium">{error}</p>}

      <div className="flex gap-3 justify-end pt-1">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={loading}>
          {initial._id ? 'Save changes' : 'Add Task'}
        </Button>
      </div>
    </form>
  );
}

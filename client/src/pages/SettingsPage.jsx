import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updatePassword, deleteAccount } from '../api/auth';
import { Key, UserX, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete account state
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    const validatePassword = (pass) => {
      const minLength = pass.length >= 8;
      const hasDigit = /\d/.test(pass);
      const hasLower = /[a-z]/.test(pass);
      const hasUpper = /[A-Z]/.test(pass);
      const hasSpecial = /[!@#$%^&*]/.test(pass);
      
      return { minLength, hasDigit, hasLower, hasUpper, hasSpecial };
    };

    const v = validatePassword(newPassword);
    if (!v.minLength) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    if (!v.hasDigit) {
      setPasswordError('New password must contain at least one digit');
      return;
    }
    if (!v.hasLower) {
      setPasswordError('New password must contain at least one lowercase letter');
      return;
    }
    if (!v.hasUpper) {
      setPasswordError('New password must contain at least one uppercase letter');
      return;
    }
    if (!v.hasSpecial) {
      setPasswordError('New password must contain at least one special character (!@#$%^&*)');
      return;
    }

    try {
      setIsUpdating(true);
      await updatePassword({ currentPassword, newPassword });
      setPasswordSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError('');
    
    const confirmMessage = 'Are you absolutely sure you want to delete your account? This action cannot be undone, and ALL your tasks will be permanently deleted.';
    
    if (window.confirm(confirmMessage)) {
      try {
        setIsDeleting(true);
        await deleteAccount();
        logout();
        navigate('/login');
      } catch (err) {
        setDeleteError(err.response?.data?.message || 'Failed to delete account');
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text)] tracking-tight flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-[var(--accent)]" />
          Account Settings
        </h1>
        <p className="text-[var(--text-2)] mt-2">
          Manage your account security and data
        </p>
      </div>

      <div className="space-y-8">
        {/* Change Password Section */}
        <div className="card p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Key className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-[var(--text)]">Change Password</h2>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-2)] mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input-base w-full"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[var(--text-2)] mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-base w-full"
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-2)] mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-base w-full"
                required
                minLength={8}
              />
            </div>

            {passwordError && (
              <p className="text-sm font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                {passwordError}
              </p>
            )}
            
            {passwordSuccess && (
              <p className="text-sm font-semibold text-green-500 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                {passwordSuccess}
              </p>
            )}

            <button
              type="submit"
              disabled={isUpdating}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
            >
              {isUpdating ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Delete Account Section */}
        <div className="card p-6 md:p-8 border border-red-200 dark:border-red-900/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 dark:bg-red-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="flex items-center gap-2 mb-4">
            <UserX className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Danger Zone</h2>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="max-w-md">
              <h3 className="text-lg font-semibold text-[var(--text)]">Delete Account</h3>
              <p className="text-sm text-[var(--text-2)] mt-1 leading-relaxed">
                Permanently delete your account and all associated tasks. This action is irreversible. All your data will be immediately wiped from our servers.
              </p>
              
              {deleteError && (
                <p className="text-sm font-semibold text-red-500 mt-3">
                  {deleteError}
                </p>
              )}
            </div>

            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="px-5 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 font-bold rounded-xl transition-colors shrink-0 flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

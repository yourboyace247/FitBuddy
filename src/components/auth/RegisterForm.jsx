import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function RegisterForm({ onSwitchToLogin }) {
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const { signup } = useAuth();

    const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }
    
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    
    return errors;
    };

    function SuccessMessage({ onSwitchToLogin }) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
          <p className="font-medium">Registration successful!</p>
          <p>Please check your email to verify your account.</p>
        </div>
        <div className="text-center">
          <button
            onClick={onSwitchToLogin}
            className="text-cyan-600 hover:text-cyan-500 text-sm"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

    if (success) {
        return <SuccessMessage onSwitchToLogin={onSwitchToLogin} />;
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (email !== confirmEmail) {
    setError('Emails do not match');
    setLoading(false);
    return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
        setError(passwordErrors.join(", "));
        setLoading(false);
        return;
    }

    if (!agreeTerms) {
      setError('You must agree to the terms & conditions');
      setLoading(false);
      return;
    }

    try {
      await signup(email, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Choose a username"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="your@email.com"
          required
        />
      </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Email</label>
            <input
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="your@email.com"
            required
            />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="At least 6 characters"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Type your password again"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          className="h-4 w-4 text-cyan-600 focus:ring-cyan-500"
        />
        <label className="ml-2 text-sm text-gray-700">
          I agree to the{' '}
          <Link to="/terms" className="text-cyan-600 hover:underline">
            Terms & Conditions
          </Link>
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
      >
        {loading ? 'Creating account...' : 'Register'}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-cyan-600 hover:text-cyan-500 text-sm"
        >
          Already have an account? Login
        </button>
      </div>
    </form>
  );
}
import React, { useState } from 'react';
import { supabase } from './lib/supabase';
import { Mail, CheckCircle2, ArrowRight, Timer, Heart, Globe } from 'lucide-react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') {
          setStatus('success');
        } else {
          throw error;
        }
      } else {
        setStatus('success');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="page">
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />

      <main className="hero">
        <div className="character-wrapper">
          <div className="character-glow" />
          <img src="/doughby-character.png" alt="Doughby" className="character" />
        </div>

        <div className="card">
          <div className="card-blob card-blob-1" />
          <div className="card-blob card-blob-2" />

          <div className="card-content">
            <h1 className="title">
              Your sourdough starter<br />is <span className="title-accent">alive.</span>
            </h1>
            <p className="subtitle">
              Doughby helps you keep it that way. A cozy companion for feeding
              schedules, starter health, and exploring your sourdough's family tree.
            </p>

            <div className="features">
              <div className="feature">
                <div className="feature-icon"><Timer size={20} /></div>
                <div>
                  <div className="feature-title">Track Feedings</div>
                  <div className="feature-desc">Log every feed and watch your starter thrive</div>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon"><Heart size={20} /></div>
                <div>
                  <div className="feature-title">Monitor Health</div>
                  <div className="feature-desc">Know exactly when your starter needs attention</div>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon"><Globe size={20} /></div>
                <div>
                  <div className="feature-title">Map Your Lineage</div>
                  <div className="feature-desc">Trace your starter's family tree in the Doughverse</div>
                </div>
              </div>
            </div>

            {status === 'success' ? (
              <div className="success-state">
                <CheckCircle2 size={44} />
                <h2>You're on the list!</h2>
                <p>We'll let you know when Doughby is ready to rise.</p>
              </div>
            ) : (
              <div className="form-section">
                <form onSubmit={handleSubmit} className="form">
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      className="input"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={status === 'loading'}
                    />
                  </div>
                  <button type="submit" className="button" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Joining...' : 'Join the Waitlist'}
                    {status !== 'loading' && <ArrowRight size={18} />}
                  </button>
                </form>
                {status === 'error' && (
                  <p className="error-message">{errorMessage}</p>
                )}
                <p className="form-fine-print">
                  Free to join. We'll only email you when it's ready.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} AIpplied Labs</p>
      </footer>
    </div>
  );
}

export default App;

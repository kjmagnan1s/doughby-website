import React, { useState } from 'react';
import { supabase } from './lib/supabase';
import { Mail, CheckCircle2, ArrowRight, Thermometer, Heart, Globe } from 'lucide-react';
import './index.css';

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

  const features = [
    { icon: <Thermometer size={28} />, title: 'Track Feedings', desc: 'Log every feed and watch your starter thrive' },
    { icon: <Heart size={28} />, title: 'Monitor Health', desc: 'Know exactly when your starter needs attention' },
    { icon: <Globe size={28} />, title: 'Map Your Lineage', desc: "Explore the Doughverse and trace your starter's family tree" },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', minHeight: '100vh' }}>
      
      <main style={{
        maxWidth: '520px',
        width: '100%',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Doughby Character */}
        <div style={{ marginBottom: '-20px', position: 'relative', zIndex: 2 }}>
          <img 
            src="/doughby-character.png" 
            alt="Doughby" 
            style={{ 
              width: '160px', 
              height: '160px', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 24px rgba(124, 154, 139, 0.3))',
              animation: 'float 3s ease-in-out infinite',
            }} 
          />
        </div>

        {/* Main Card */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          padding: '48px 32px 40px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative blobs */}
          <div style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '160px', height: '160px',
            backgroundColor: 'var(--color-secondary)', borderRadius: '50%',
            opacity: 0.15, zIndex: 0
          }} />
          <div style={{
            position: 'absolute', bottom: '-40px', left: '-40px',
            width: '120px', height: '120px',
            backgroundColor: 'var(--color-primary)', borderRadius: '50%',
            opacity: 0.08, zIndex: 0
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '12px', color: 'var(--color-primary)', lineHeight: 1.2 }}>
              Your sourdough starter is alive.
            </h1>
            <p style={{ fontSize: '1.15rem', marginBottom: '32px', lineHeight: 1.6 }}>
              Doughby helps you keep it that way. A cozy companion app for feeding schedules, starter health, and exploring your sourdough's family tree.
            </p>

            {/* Features */}
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              marginBottom: '32px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              {features.map((f, i) => (
                <div key={i} style={{
                  flex: '1 1 130px',
                  maxWidth: '150px',
                  padding: '16px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-background)',
                }}>
                  <div style={{ color: 'var(--color-primary)', marginBottom: '8px' }}>{f.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px', color: 'var(--color-text-primary)' }}>{f.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{f.desc}</div>
                </div>
              ))}
            </div>

            {/* Waitlist Form */}
            {status === 'success' ? (
              <div style={{
                backgroundColor: 'var(--color-background)',
                padding: '24px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                <CheckCircle2 size={48} color="var(--color-success)" />
                <h2 style={{ fontSize: '1.4rem', color: 'var(--color-success)' }}>You're on the list!</h2>
                <p style={{ fontSize: '0.95rem' }}>We'll let you know when Doughby is ready.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <Mail size={20} color="var(--color-text-secondary)" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    className="input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === 'loading'}
                    style={{ paddingLeft: '52px' }}
                  />
                </div>

                {status === 'error' && (
                  <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', textAlign: 'left', paddingLeft: '16px' }}>
                    {errorMessage}
                  </p>
                )}

                <button 
                  type="submit" 
                  className="button" 
                  disabled={status === 'loading'}
                  style={{ width: '100%' }}
                >
                  {status === 'loading' ? 'Joining...' : 'Join the Waitlist'}
                  {status !== 'loading' && <ArrowRight size={20} />}
                </button>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  Free to join. We'll only email you when it's ready.
                </p>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer style={{ marginTop: '48px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
        <p>&copy; {new Date().getFullYear()} AIpplied Labs</p>
      </footer>
    </div>
  );
}

export default App;

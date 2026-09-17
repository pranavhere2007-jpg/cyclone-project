import React, { useState } from 'react';
import { helplinesData } from '../data/mockData';

export default function Helplines() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="dropdown-container"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      style={{ position: 'relative', display: 'inline-block', zIndex: 1000 }}
    >
      <button 
        style={{ 
          padding: '0.6rem 1.2rem', 
          borderRadius: '8px', 
          background: 'var(--danger-light)', 
          color: '#b91c1c', 
          fontWeight: '700', 
          border: '1px solid #fecaca',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>🆘</span> Emergency Helplines
      </button>
      
      {isOpen && (
        <div 
          className="card" 
          style={{ 
            position: 'absolute', 
            top: '100%', 
            left: 0, /* FIXED: Changed from right: 0 to left: 0 to prevent screen clipping */
            marginTop: '0.5rem', 
            width: '320px', 
            padding: '1.25rem',
            animation: 'fadeIn 0.2s ease-out',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <h4 style={{ 
            fontSize: '0.85rem', 
            fontWeight: 800, 
            marginBottom: '1rem', 
            color: 'var(--text-muted)', 
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            paddingBottom: '0.5rem'
          }}>
            Contact Directory
          </h4>
          
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {helplinesData && helplinesData.length > 0 ? (
              helplinesData.map((helpline, index) => (
                <li key={helpline.id || index} style={{ 
                  marginBottom: '1rem', 
                  paddingBottom: '1rem', 
                  borderBottom: index !== helplinesData.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: '1.3' }}>
                      {helpline.name}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: 500 }}>
                        📍 {helpline.region}
                      </div>
                    </div>
                    {helpline.type && (
                      <span style={{ 
                        fontSize: '0.7rem', 
                        padding: '0.2rem 0.5rem', 
                        background: '#f1f5f9', 
                        color: '#475569', 
                        borderRadius: '4px',
                        fontWeight: 700 
                      }}>
                        {helpline.type}
                      </span>
                    )}
                  </div>
                  
                  <a 
                    href={`tel:${helpline.phone}`} 
                    style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 800, 
                      color: 'var(--danger)', 
                      textDecoration: 'none',
                      display: 'inline-block',
                      marginTop: '0.5rem'
                    }}
                  >
                    📞 {helpline.phone}
                  </a>
                </li>
              ))
            ) : (
              <li style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No helplines currently available.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
import React from 'react';

export default function Flag({ code, className = "" }: { code: string; className?: string }) {
  if (!code) return null;
  
  // On s'assure que le code est en minuscule
  const isoCode = code.toLowerCase();
  
  return (
    <span 
      className={`fi fi-${isoCode} ${className}`} 
      style={{ borderRadius: '4px', display: 'inline-block' }}
    />
  );
}
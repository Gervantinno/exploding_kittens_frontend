// widgets/NamePrompt.tsx
import React, { useState } from 'react';
import { setUserName } from '../../shared/utils/userName';

const AuthPage = () => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      setUserName(name);
    }
  };

  return (
    <div>
      <h1>Enter your name</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      <button onClick={handleSubmit}>Continue</button>
    </div>
  );
};

export default AuthPage;

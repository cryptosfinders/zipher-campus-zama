'use client';
import React, {useState} from 'react';
import { encryptAndSubmitCourse } from '../lib/zamaClient';

export default function CreateEncryptedCourse(){
  const [title,setTitle]=useState('');
  const [status,setStatus]=useState('');
  async function handleCreate(e){
    e.preventDefault();
    setStatus('Encrypting metadata in browser...');
    // metadata example
    const metadata = { title, createdAt: Date.now() };
    try{
      const tx = await encryptAndSubmitCourse(metadata);
      setStatus('Submitted: ' + tx.txHash);
    }catch(e){
      console.error(e);
      setStatus('Error: ' + e.message);
    }
  }
  return (
    <div className="card">
      <h2 className="text-xl font-bold">Register Encrypted Course</h2>
      <form onSubmit={handleCreate}>
        <input className="w-full mt-3 p-3 rounded-md" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Course title (plaintext hidden)" />
        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button className="btn" type="submit">Encrypt & Register</button>
        </div>
        <div style={{marginTop:8}} className="small">{status}</div>
      </form>
    </div>
  );
}

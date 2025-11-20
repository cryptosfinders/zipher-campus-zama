'use client';
import React from 'react';
import Header from '../components/Header';
import CreateEncryptedCourse from '../components/CreateEncryptedCourse';
import SubmissionsPanel from '../components/SubmissionsPanel';

export default function Page(){
  return (
    <div className="max-w-5xl mx-auto">
      <Header />
      <div style={{display:'grid', gridTemplateColumns:'1fr 360px', gap:20, marginTop:20}}>
        <div>
          <CreateEncryptedCourse />
        </div>
        <div>
          <div className="card">
            <h3 className="text-xl font-bold">Relayer / KMS</h3>
            <p className="mt-2 text-sm">Demo relayer posts encrypted results after processing.</p>
          </div>
          <div style={{height:12}}></div>
          <SubmissionsPanel />
        </div>
      </div>
    </div>
  );
}

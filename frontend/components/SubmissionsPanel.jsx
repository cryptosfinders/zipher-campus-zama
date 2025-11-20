'use client';
import React, {useState,useEffect} from 'react';
import axios from 'axios';

export default function SubmissionsPanel(){
  const [subs,setSubs]=useState([]);
  useEffect(()=>{ load(); },[]);
  async function load(){ const r = await axios.get(process.env.NEXT_PUBLIC_RELAYER_URL+'/api/submissions'); setSubs(r.data); }
  return (
    <div className="card">
      <h3 className="text-lg font-bold">Recent Submissions</h3>
      <div style={{marginTop:12}}>{subs.length===0 ? <div className="small">No submissions yet</div> : subs.map(s=>(
        <div key={s.id} style={{padding:'6px 0',borderTop:'1px solid rgba(0,0,0,0.04)'}}>
          <div className="text-sm">#{s.id} • {s.author}</div>
          <div className="small">{new Date(s.ts).toLocaleString()}</div>
        </div>
      ))}</div>
    </div>
  );
}

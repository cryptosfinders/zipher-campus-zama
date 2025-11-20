'use client';
export default function Header(){ return (
  <div className="card" style={{display:'flex',gap:12,alignItems:'center'}}>
    <div style={{width:64,height:64,background:'linear-gradient(135deg,#FFE680,#FFB900)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800}}>Z</div>
    <div>
      <h1 className="text-2xl font-bold">Zipher Campus — Zama Edition</h1>
      <div className="text-sm">Encrypted classrooms, assignments & confidential ML inference.</div>
    </div>
  </div>
); }

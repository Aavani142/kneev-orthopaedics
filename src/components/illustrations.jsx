/*
 * Simplified front-view knee diagrams drawn for this page (not to scale).
 * Should be reviewed by the treating doctor before publication.
 */

const FEMUR =
  'M125 0 L125 95 C125 120 92 128 84 152 C76 176 84 200 106 204 C124 207 134 196 146 186 C152 181 168 181 174 186 C186 196 196 207 214 204 C236 200 244 176 236 152 C228 128 195 120 195 95 L195 0 Z';
const CONDYLE_EDGE =
  'M86 160 C80 180 88 199 106 203 C124 206 134 195 146 185 C152 180 168 180 174 185 C186 195 196 206 214 203 C232 199 240 180 234 160';

const tibiaPath = (top) =>
  `M80 ${top + 8} C80 ${top} 96 ${top - 4} 160 ${top - 4} C224 ${top - 4} 240 ${top} 240 ${top + 8} L240 ${top + 22} C240 ${top + 40} 206 ${top + 48} 200 ${top + 70} L200 372 L120 372 L120 ${top + 70} C114 ${top + 48} 80 ${top + 40} 80 ${top + 22} Z`;
const fibulaPath = (top) =>
  `M246 ${top + 36} C252 ${top + 34} 258 ${top + 38} 258 ${top + 46} L256 372 L242 372 L240 ${top + 48} C240 ${top + 42} 242 ${top + 37} 246 ${top + 36} Z`;

const textStyle = { fontFamily: 'var(--font-sans)' };

function Label({ x1, y1, x2, y2, tx, ty, anchor = 'start', children, color, strong, size = 15, className }) {
  return (
    <g className={className}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1" strokeDasharray="2 3" />
      <circle cx={x1} cy={y1} r="2.5" fill={color} />
      <text x={tx} y={ty} textAnchor={anchor} fontSize={size} fontWeight={strong ? 700 : 500} fill={color} style={textStyle}>
        {children}
      </text>
    </g>
  );
}

const LIGHT = { bone: '#F4EFE6', line: 'rgba(23,75,59,0.55)', label: '#3E4A44', cartilage: '#8FC0AA', worn: '#C79A6B', metal: '#93A19B' };

/* ---------------------- Healthy vs osteoarthritic knee --------------------- */

function KneeGroup({ variant }) {
  const oa = variant === 'oa';
  const top = oa ? 214 : 228; // OA: narrowed joint space
  const c = LIGHT;
  return (
    <g>
      <path d={FEMUR} fill={c.bone} stroke={c.line} strokeWidth="1.6" />
      <path d={tibiaPath(top)} fill={c.bone} stroke={c.line} strokeWidth="1.6" />
      <path d={fibulaPath(top)} fill={c.bone} stroke={c.line} strokeWidth="1.4" />
      {oa ? (
        <>
          {/* thinned, irregular cartilage */}
          <path d={CONDYLE_EDGE} fill="none" stroke={c.worn} strokeWidth="3" strokeDasharray="16 7 5 9" strokeLinecap="round" />
          <path d={`M92 ${top - 1} L140 ${top - 3}`} stroke={c.worn} strokeWidth="3" strokeDasharray="10 8" strokeLinecap="round" />
          <path d={`M180 ${top - 3} L230 ${top - 1}`} stroke={c.worn} strokeWidth="3" strokeDasharray="6 9" strokeLinecap="round" />
          {/* osteophytes (bone spurs) */}
          <path d="M80 170 L68 176 L80 182 Z" fill={c.bone} stroke={c.line} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M240 170 L252 176 L240 182 Z" fill={c.bone} stroke={c.line} strokeWidth="1.4" strokeLinejoin="round" />
          <path d={`M80 ${top + 10} L68 ${top + 6} L78 ${top + 18} Z`} fill={c.bone} stroke={c.line} strokeWidth="1.4" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <path d={CONDYLE_EDGE} fill="none" stroke={c.cartilage} strokeWidth="7" strokeLinecap="round" />
          <path d={`M88 ${top - 2} C120 ${top - 6} 200 ${top - 6} 232 ${top - 2}`} fill="none" stroke={c.cartilage} strokeWidth="7" strokeLinecap="round" />
        </>
      )}
    </g>
  );
}

export function KneeArthritisComparison({ className = '' }) {
  const c = LIGHT;
  return (
    <svg viewBox="0 0 760 430" className={className} role="img" aria-labelledby="oa-title oa-desc">
      <title id="oa-title">Healthy knee compared with a knee affected by osteoarthritis</title>
      <desc id="oa-desc">
        On the left, a healthy knee with smooth cartilage covering the bone ends and an even joint space. On the right, a
        knee with osteoarthritis showing worn, uneven cartilage, a narrowed joint space and small bone spurs at the edges.
      </desc>
      <g transform="translate(20 0) scale(0.95)">
        <KneeGroup variant="healthy" />
        <Label x1={226} y1={186} x2={276} y2={150} tx={262} ty={140} color={c.label} size={14} className="diagram-label-sm" strong>Smooth cartilage</Label>
        <Label x1={160} y1={214} x2={56} y2={262} tx={8} ty={280} color={c.label} size={14} className="diagram-label-sm">Even joint space</Label>
      </g>
      <g transform="translate(370 0) scale(0.95)">
        <KneeGroup variant="oa" />
        <Label x1={232} y1={186} x2={282} y2={150} tx={268} ty={140} color={c.label} size={14} className="diagram-label-sm" strong>Worn cartilage</Label>
        <Label x1={70} y1={176} x2={20} y2={120} tx={2} ty={110} color={c.label} size={14} className="diagram-label-sm">Bone spur</Label>
        <Label x1={160} y1={208} x2={56} y2={262} tx={8} ty={280} color={c.label} size={14} className="diagram-label-sm">Narrowed space</Label>
      </g>
      <text x="172" y="420" textAnchor="middle" fontSize="15" fontWeight="700" fill="#174B3B" style={textStyle}>Healthy knee</text>
      <text x="522" y="420" textAnchor="middle" fontSize="15" fontWeight="700" fill="#174B3B" style={textStyle}>Knee with osteoarthritis</text>
    </svg>
  );
}

/* ------------------------------ Knee replacement --------------------------- */

export function KneeReplacementIllustration({ className = '' }) {
  const c = LIGHT;
  return (
    <svg viewBox="-60 -6 440 382" className={className} role="img" aria-labelledby="tkr-title tkr-desc">
      <title id="tkr-title">Knee replacement components</title>
      <desc id="tkr-desc">
        Front view of a knee after total knee replacement: a metal component caps the end of the thigh bone, a metal tray
        with a short stem sits on the shin bone, and a plastic insert lies between them.
      </desc>
      <path d={FEMUR} fill={c.bone} stroke={c.line} strokeWidth="1.6" />
      <path d="M84 154 C78 178 86 200 106 204 C124 207 134 196 146 186 C152 181 168 181 174 186 C186 196 196 207 214 204 C234 200 242 178 236 154" fill="none" stroke={c.metal} strokeWidth="11" strokeLinecap="round" />
      <path d="M88 160 C84 180 92 196 108 199" fill="none" stroke="#D6DDDA" strokeWidth="3" strokeLinecap="round" />
      <rect x="86" y="209" width="148" height="10" rx="4" fill="#FFFFFF" stroke={c.line} />
      <rect x="84" y="219" width="152" height="8" rx="2" fill={c.metal} />
      <path d="M84 227 L236 227 L236 240 C236 262 206 272 200 298 L200 372 L120 372 L120 298 C114 272 84 262 84 240 Z" fill={c.bone} stroke={c.line} strokeWidth="1.6" />
      <rect x="151" y="227" width="18" height="43" rx="5" fill={c.metal} />
      <path d="M244 262 C251 260 257 265 257 273 L255 372 L241 372 L239 274 C239 268 240 263 244 262 Z" fill={c.bone} stroke={c.line} strokeWidth="1.4" />

      <Label x1={160} y1={60} x2={232} y2={60} tx={238} ty={64} color={c.label}>Femur (thigh bone)</Label>
      <Label x1={232} y1={170} x2={272} y2={170} tx={278} ty={166} color={c.label} strong>Femoral</Label>
      <text x="278" y="182" fontSize="15" fontWeight="700" fill={c.label} style={textStyle}>component</text>
      <Label x1={88} y1={214} x2={30} y2={214} tx={24} ty={218} anchor="end" color={c.label} strong>Insert</Label>
      <Label x1={160} y1={250} x2={40} y2={260} tx={34} ty={258} anchor="end" color={c.label} strong>Tibial</Label>
      <text x="34" y="274" textAnchor="end" fontSize="15" fontWeight="700" fill={c.label} style={textStyle}>component</text>
      <Label x1={180} y1={330} x2={262} y2={330} tx={268} ty={334} color={c.label}>Tibia (shin bone)</Label>
    </svg>
  );
}

/* ------------------------------- ACL anatomy ------------------------------- */

export function ACLIllustration({ className = '' }) {
  const bone = 'rgba(255,255,255,0.09)';
  const line = 'rgba(255,255,255,0.6)';
  const label = 'rgba(255,255,255,0.85)';
  const acl = '#E58A35';
  return (
    <svg viewBox="-60 -6 440 382" className={className} role="img" aria-labelledby="acl-title acl-desc">
      <title id="acl-title">Knee ligament anatomy</title>
      <desc id="acl-desc">
        Front view of the knee joint. The anterior cruciate ligament (ACL), highlighted, runs diagonally from the thigh
        bone to the front of the shin bone, crossing the posterior cruciate ligament (PCL). The menisci rest on the shin
        bone, and collateral ligaments run along the inner and outer sides of the knee.
      </desc>
      <path d={FEMUR} fill={bone} stroke={line} strokeWidth="1.6" />
      <path d={tibiaPath(236)} fill={bone} stroke={line} strokeWidth="1.6" />
      <path d={fibulaPath(236)} fill={bone} stroke={line} strokeWidth="1.4" />
      <path d="M86 240 C100 228 128 227 142 233 L142 238 C128 235 104 235 90 244 Z" fill="rgba(255,255,255,0.45)" />
      <path d="M234 240 C220 228 192 227 178 233 L178 238 C192 235 216 235 230 244 Z" fill="rgba(255,255,255,0.45)" />
      <path d="M84 168 C78 200 80 240 90 286" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="6" strokeLinecap="round" />
      <path d="M237 170 C246 200 250 236 252 278" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="6" strokeLinecap="round" />
      <path d="M150 190 L171 236" stroke="rgba(255,255,255,0.55)" strokeWidth="9" strokeLinecap="round" />
      <path d="M171 190 L149 234" stroke={acl} strokeWidth="11" strokeLinecap="round" />

      <Label x1={160} y1={60} x2={232} y2={60} tx={238} ty={64} color={label}>Femur (thigh bone)</Label>
      <Label x1={166} y1={200} x2={276} y2={200} tx={282} ty={196} color={acl} strong>ACL</Label>
      <text x="282" y="212" fontSize="11.5" fill={label} style={textStyle}>anterior cruciate</text>
      <Label x1={154} y1={198} x2={44} y2={198} tx={38} ty={202} anchor="end" color={label}>PCL</Label>
      <Label x1={100} y1={236} x2={44} y2={236} tx={38} ty={240} anchor="end" color={label}>Meniscus</Label>
      <Label x1={82} y1={200} x2={44} y2={160} tx={38} ty={156} anchor="end" color={label}>MCL</Label>
      <Label x1={180} y1={330} x2={262} y2={330} tx={268} ty={334} color={label}>Tibia (shin bone)</Label>
    </svg>
  );
}

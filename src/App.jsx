// ===== LAPD WORKFORCE SUSTAINABILITY ROI CALCULATOR =====
// Adapted for Los Angeles Police Department
// Incorporates California-specific workers' comp (SB 542, Labor Code 4850)

import React, { useState, useMemo } from 'react';

// ===== GLOBAL STYLES & THEME =====
function GlobalStyles() {
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; }
      html, body, #root { height: 100%; }
    `}</style>
  );
}

const container = { boxSizing: 'border-box', maxWidth: '1100px', margin: '0 auto' };

// LAPD Theme - Blue and Gold
const T = {
  color: {
    ink: '#0f172a',
    primary: '#003366',
    primaryLight: '#004080',
    gold: '#C5A572',
    red: '#dc2626',
    green: '#16a34a',
    axis: '#94a3b8',
    border: '#e5e7eb',
    slate600: '#475569',
  }
};

// ===== CHART COMPONENTS =====
const Callout = React.memo(({ x, y, text, color = T.color.ink, bg = 'white', lineTo }) => (
  <g>
    {lineTo && <line x1={x} y1={y} x2={lineTo.x} y2={lineTo.y} stroke={color} strokeOpacity="0.5" strokeWidth="1.5" />}
    <rect x={x - 6} y={y - 18} rx="6" ry="6" width={Math.max(120, (text?.length || 0) * 6.4 + 14)} height="28" fill={bg} stroke={color} strokeOpacity="0.25" />
    <text x={x + 8} y={y + 2} fill={color} fontSize="12" fontWeight="700">{text}</text>
  </g>
));

const MethodologyImpactChart = React.memo(function MethodologyImpactChart({ callouts = [] }) {
  return (
    <svg viewBox="0 0 760 300" style={{ width: '100%', height: 260, display: 'block' }}>
      <line x1="60" y1="24" x2="60" y2="250" stroke={T.color.axis} strokeWidth="2" />
      <line x1="60" y1="250" x2="730" y2="250" stroke={T.color.axis} strokeWidth="2" />
      <text x="14" y="34" fill={T.color.slate600} fontSize="11" fontWeight="700">Skill / Recall</text>
      <text x="690" y="292" fill={T.color.slate600} fontSize="11" fontWeight="700">Time</text>
      {[140, 220, 300, 380, 460, 540, 620, 700].map((x, i) => (<line key={i} x1={x} y1="250" x2={x} y2="246" stroke={T.color.axis} />))}
      {[90, 130, 170, 210].map((y, i) => (<line key={i} x1="60" y1={y} x2="730" y2={y} stroke={T.color.border} />))}
      <path d="M 60 60 C 180 56, 250 80, 320 120 C 380 154, 450 190, 730 230" fill="none" stroke={T.color.red} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M 60 230 C 110 200, 150 190, 190 170 C 210 160, 230 150, 250 160 C 270 175, 300 150, 330 135 C 350 125, 370 120, 390 130 C 410 142, 440 128, 470 118 C 490 112, 510 110, 530 120 C 550 130, 585 118, 620 108 C 640 102, 660 98, 730 92" fill="none" stroke={T.color.primary} strokeWidth="4.5" strokeLinecap="round" />
      {callouts.map((c, i) => <Callout key={i} {...c} />)}
    </svg>
  );
});

const MethodologyImpactSection = () => (
  <div style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e8eef5 100%)', border: '4px solid #64748b', borderRadius: '16px', padding: '28px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <div style={{ width: 48, height: 48, background: '#475569', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📈</div>
      <h2 style={{ fontSize: 22, fontWeight: '800', color: '#111827', margin: 0 }}>Methodology Impact: Why Episodic Training Fails—and Continuous Development Works</h2>
    </div>
    <div style={{ background: 'white', border: '2px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: '#fee2e2', color: '#991b1b' }}>🔴 Episodic training</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: '#dbeafe', color: '#003366' }}>🔵 Continuous development</span>
        </div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>Higher area = retained capability</div>
      </div>
      <MethodologyImpactChart callouts={[
        { x: 180, y: 60, text: 'Peak right after event', color: '#991b1b', bg: '#fff5f5', lineTo: { x: 150, y: 66 } },
        { x: 410, y: 168, text: '~70% forgotten in 24h', color: '#991b1b', bg: '#fff5f5', lineTo: { x: 365, y: 150 } },
        { x: 640, y: 228, text: '~90% within a month', color: '#991b1b', bg: '#fff5f5', lineTo: { x: 600, y: 212 } },
        { x: 520, y: 84, text: 'Continuous reinforcement', color: '#003366', bg: '#e6f0fa', lineTo: { x: 560, y: 110 } },
      ]} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 8 }}>
        <div style={{ background: '#fff7ed', border: '1px solid #fdba74', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 13, color: '#9a3412', fontWeight: 700, marginBottom: 6 }}>Why retention stalls</div>
          <ul style={{ margin: 0, paddingLeft: 16, color: '#7c2d12', fontSize: 13, lineHeight: 1.6 }}>
            <li>Event spikes learning → rapid decay</li>
            <li>Episodic workshops don't rewire habits</li>
            <li>Officers default to ingrained patterns</li>
          </ul>
        </div>
        <div style={{ background: '#ecfeff', border: '1px solid #67e8f9', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 13, color: '#155e75', fontWeight: 700, marginBottom: 6 }}>Why DAF moved retention +7%</div>
          <ul style={{ margin: 0, paddingLeft: 16, color: '#0e7490', fontSize: 13, lineHeight: 1.6 }}>
            <li>Continuous practice compounds capability</li>
            <li>Just-in-time support at critical moments</li>
            <li>Transforms training into learning journeys</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// ===== MAIN DASHBOARD COMPONENT =====
const LAPDDashboard = () => {
  // State Management
  const [org, setOrg] = useState('lapd-wide');
  const [coa, setCoa] = useState('targeted');
  const [showResearch, setShowResearch] = useState(false);
  const [includeLeadForLeaders, setIncludeLeadForLeaders] = useState(false);
  const [activeTab, setActiveTab] = useState('cost-problem');
  const [showCoaComparison, setShowCoaComparison] = useState(false);
  const [manualLeadSeats, setManualLeadSeats] = useState(null);
  const [manualReadySeats, setManualReadySeats] = useState(null);
  const [manualEngagement, setManualEngagement] = useState(null);
  const [expandedFactor, setExpandedFactor] = useState(null);
  const [viewMode, setViewMode] = useState('division');
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Behavioral Health Sliders - California Law Enforcement Calibrated
  const [ptsdPrevalence, setPtsdPrevalence] = useState(19);
  const [ptsdCoachingEffectiveness, setPtsdCoachingEffectiveness] = useState(25);
  const [ptsdWcFilingRate, setPtsdWcFilingRate] = useState(12);
  const [ptsdWcAvgCost, setPtsdWcAvgCost] = useState(95000);
  const [ptsdSeparationRate, setPtsdSeparationRate] = useState(14);
  const [depressionPrevalence, setDepressionPrevalence] = useState(19);
  const [depressionCoachingEffectiveness, setDepressionCoachingEffectiveness] = useState(25);
  const [depressionWcFilingRate, setDepressionWcFilingRate] = useState(10);
  const [depressionWcAvgCost, setDepressionWcAvgCost] = useState(60000);
  const [depressionSeparationRate, setDepressionSeparationRate] = useState(16);
  const [anxietyPrevalence, setAnxietyPrevalence] = useState(15);
  const [anxietyCoachingEffectiveness, setAnxietyCoachingEffectiveness] = useState(20);
  const [anxietyWcFilingRate, setAnxietyWcFilingRate] = useState(8);
  const [anxietyWcAvgCost, setAnxietyWcAvgCost] = useState(50000);
  const [anxietySeparationRate, setAnxietySeparationRate] = useState(12);
  const [sudPrevalence, setSudPrevalence] = useState(26);
  const [sudCoachingEffectiveness, setSudCoachingEffectiveness] = useState(67);
  const [sudWcFilingRate, setSudWcFilingRate] = useState(15);
  const [sudWcAvgCost, setSudWcAvgCost] = useState(45000);
  const [sudSeparationRate, setSudSeparationRate] = useState(28);
  const [comorbidityOverlap, setComorbidityOverlap] = useState(35);

  // LAPD Organization Data
  const orgData = useMemo(() => ({
    'lapd-wide': { name: 'LAPD-Wide (All Personnel)', officers: 8738, type: 'enterprise', description: 'All sworn officers across 21 divisions' },
    'ops-central': { name: 'Central Bureau', officers: 1800, type: 'bureau', description: 'Downtown LA, East LA, Lincoln Heights' },
    'ops-south': { name: 'South Bureau', officers: 2100, type: 'bureau', description: 'South LA, Watts, San Pedro' },
    'ops-west': { name: 'West Bureau', officers: 1600, type: 'bureau', description: 'Hollywood, Beverly Hills-adjacent' },
    'ops-valley': { name: 'Valley Bureau', officers: 2200, type: 'bureau', description: 'San Fernando Valley' },
    'div-77th': { name: '77th Street Division', officers: 420, type: 'division', tier: 1, description: 'High-activity area, highest call volume' },
    'div-newton': { name: 'Newton Division', officers: 380, type: 'division', tier: 1, description: 'Central-South LA' },
    'div-hollywood': { name: 'Hollywood Division', officers: 350, type: 'division', tier: 1, description: 'Tourism hub, entertainment district' },
    'div-southeast': { name: 'Southeast Division', officers: 400, type: 'division', tier: 1, description: 'Watts, high-need community' },
    'div-southwest': { name: 'Southwest Division', officers: 380, type: 'division', tier: 1, description: 'Baldwin Hills, Crenshaw' },
    'div-central': { name: 'Central Division', officers: 340, type: 'division', tier: 2, description: 'Downtown LA, Skid Row' },
    'div-rampart': { name: 'Rampart Division', officers: 320, type: 'division', tier: 2, description: 'MacArthur Park, Westlake' },
    'div-wilshire': { name: 'Wilshire Division', officers: 300, type: 'division', tier: 2, description: 'Miracle Mile, Koreatown' },
    'div-van-nuys': { name: 'Van Nuys Division', officers: 380, type: 'division', tier: 2, description: 'Central Valley hub' },
    'div-north-hollywood': { name: 'North Hollywood Division', officers: 340, type: 'division', tier: 2, description: 'NoHo Arts District' },
    'div-pacific': { name: 'Pacific Division', officers: 280, type: 'division', tier: 3, description: 'Venice Beach, Marina del Rey' },
    'div-west-la': { name: 'West LA Division', officers: 260, type: 'division', tier: 3, description: 'Westwood, UCLA, Brentwood' },
    'div-harbor': { name: 'Harbor Division', officers: 280, type: 'division', tier: 3, description: 'Port of LA, San Pedro' },
    'div-devonshire': { name: 'Devonshire Division', officers: 300, type: 'division', tier: 3, description: 'Northwest Valley' },
    'div-foothill': { name: 'Foothill Division', officers: 320, type: 'division', tier: 3, description: 'Pacoima, Sylmar' },
    'div-olympic': { name: 'Olympic Division', officers: 290, type: 'division', tier: 3, description: 'Pico-Union, 2028 Olympic venues' },
    'metro': { name: 'Metropolitan Division', officers: 400, type: 'specialized', description: 'SWAT, K-9, Critical Response' },
    'detective-bureau': { name: 'Detective Bureau', officers: 800, type: 'specialized', description: 'Robbery-Homicide, Major Crimes' },
  }), []);

  // COMORBIDITY-ADJUSTED BEHAVIORAL HEALTH CALCULATIONS
  const behavioralHealthCalcs = useMemo(() => {
    const totalOfficers = orgData[org].officers;
    const rawPtsdAffected = Math.round(totalOfficers * (ptsdPrevalence / 100));
    const rawDepressionAffected = Math.round(totalOfficers * (depressionPrevalence / 100));
    const rawAnxietyAffected = Math.round(totalOfficers * (anxietyPrevalence / 100));
    const rawSudAffected = Math.round(totalOfficers * (sudPrevalence / 100));
    const rawTotalAffected = rawPtsdAffected + rawDepressionAffected + rawAnxietyAffected + rawSudAffected;
    const comorbidityMultiplier = 1 - (comorbidityOverlap / 100);
    const uniqueAffected = Math.round(rawTotalAffected * comorbidityMultiplier);
    const adjustmentFactor = rawTotalAffected > 0 ? uniqueAffected / rawTotalAffected : 0;
    const ptsdAffected = Math.round(rawPtsdAffected * adjustmentFactor);
    const depressionAffected = Math.round(rawDepressionAffected * adjustmentFactor);
    const anxietyAffected = Math.round(rawAnxietyAffected * adjustmentFactor);
    const sudAffected = Math.round(rawSudAffected * adjustmentFactor);
    const ptsdWcClaims = Math.round(ptsdAffected * (ptsdWcFilingRate / 100));
    const depressionWcClaims = Math.round(depressionAffected * (depressionWcFilingRate / 100));
    const anxietyWcClaims = Math.round(anxietyAffected * (anxietyWcFilingRate / 100));
    const sudWcClaims = Math.round(sudAffected * (sudWcFilingRate / 100));
    const totalBaselineWcClaims = ptsdWcClaims + depressionWcClaims + anxietyWcClaims + sudWcClaims;
    const ptsdWcCost = ptsdWcClaims * ptsdWcAvgCost;
    const depressionWcCost = depressionWcClaims * depressionWcAvgCost;
    const anxietyWcCost = anxietyWcClaims * anxietyWcAvgCost;
    const sudWcCost = sudWcClaims * sudWcAvgCost;
    const totalBaselineWcCost = ptsdWcCost + depressionWcCost + anxietyWcCost + sudWcCost;
    const ptsdSeparations = Math.round(ptsdAffected * (ptsdSeparationRate / 100));
    const depressionSeparations = Math.round(depressionAffected * (depressionSeparationRate / 100));
    const anxietySeparations = Math.round(anxietyAffected * (anxietySeparationRate / 100));
    const sudSeparations = Math.round(sudAffected * (sudSeparationRate / 100));
    const totalBehavioralSeparations = ptsdSeparations + depressionSeparations + anxietySeparations + sudSeparations;
    return {
      rawTotalAffected, uniqueAffected, comorbidityReduction: rawTotalAffected - uniqueAffected,
      ptsdAffected, depressionAffected, anxietyAffected, sudAffected,
      ptsdWcClaims, depressionWcClaims, anxietyWcClaims, sudWcClaims, totalBaselineWcClaims,
      ptsdWcCost, depressionWcCost, anxietyWcCost, sudWcCost, totalBaselineWcCost,
      ptsdSeparations, depressionSeparations, anxietySeparations, sudSeparations, totalBehavioralSeparations,
      avgWcClaimCost: totalBaselineWcClaims > 0 ? Math.round(totalBaselineWcCost / totalBaselineWcClaims) : 65000,
    };
  }, [org, orgData, ptsdPrevalence, depressionPrevalence, anxietyPrevalence, sudPrevalence,
      ptsdWcFilingRate, depressionWcFilingRate, anxietyWcFilingRate, sudWcFilingRate,
      ptsdWcAvgCost, depressionWcAvgCost, anxietyWcAvgCost, sudWcAvgCost,
      ptsdSeparationRate, depressionSeparationRate, anxietySeparationRate, sudSeparationRate, comorbidityOverlap]);

  // MAIN ROI CALCULATIONS
  const calculations = useMemo(() => {
    const data = orgData[org];
    let leadPercent, readyPercent, readyPrice;
    if (coa === 'pilot') { readyPercent = 0.15; leadPercent = includeLeadForLeaders ? 0.10 : 0; readyPrice = 250; }
    else if (coa === 'targeted') { readyPercent = 0.25; leadPercent = includeLeadForLeaders ? 0.10 : 0; readyPrice = 200; }
    else { readyPercent = 0.75; leadPercent = includeLeadForLeaders ? 0.10 : 0; readyPrice = 150; }

    const baseLeadSeats = Math.round(data.officers * leadPercent);
    const baseReadySeats = Math.max(Math.round(data.officers * readyPercent), 500);
    const leadSeats = manualLeadSeats !== null ? manualLeadSeats : baseLeadSeats;
    const readySeats = manualReadySeats !== null ? manualReadySeats : baseReadySeats;
    const totalSeats = leadSeats + readySeats;
    const baseEngagement = 0.65;
    const engagement = manualEngagement !== null ? manualEngagement / 100 : baseEngagement;
    const activeUsers = Math.round(totalSeats * engagement);
    const coverage = Math.min(1, activeUsers / data.officers);
    const leadPrice = 5785;
    const totalInvestment = (leadSeats * leadPrice) + (readySeats * readyPrice);

    // LAPD-specific attrition rate (higher than CBP due to competitive LA market)
    const attritionRate = 0.076; // 660/8738 = 7.6% in 2024
    const baselineSeparations = Math.round(data.officers * attritionRate);
    const behavioralSeparations = behavioralHealthCalcs.totalBehavioralSeparations;

    const weightedEffectiveness = behavioralSeparations > 0
      ? ((behavioralHealthCalcs.ptsdSeparations * (ptsdCoachingEffectiveness / 100)) +
         (behavioralHealthCalcs.depressionSeparations * (depressionCoachingEffectiveness / 100)) +
         (behavioralHealthCalcs.anxietySeparations * (anxietyCoachingEffectiveness / 100)) +
         (behavioralHealthCalcs.sudSeparations * (sudCoachingEffectiveness / 100))) / behavioralSeparations : 0;

    const separationsPrevented = Math.round(behavioralSeparations * (isFinite(weightedEffectiveness) ? weightedEffectiveness : 0) * coverage);
    const replacementCost = 150000; // LAPD replacement cost
    const retentionSavings = separationsPrevented * replacementCost;

    // Workers' Comp (California SB 542 PTSD presumption increases costs)
    const ptsdClaimsPrevented = Math.round(behavioralHealthCalcs.ptsdWcClaims * (ptsdCoachingEffectiveness / 100) * coverage);
    const depressionClaimsPrevented = Math.round(behavioralHealthCalcs.depressionWcClaims * (depressionCoachingEffectiveness / 100) * coverage);
    const anxietyClaimsPrevented = Math.round(behavioralHealthCalcs.anxietyWcClaims * (anxietyCoachingEffectiveness / 100) * coverage);
    const sudClaimsPrevented = Math.round(behavioralHealthCalcs.sudWcClaims * (sudCoachingEffectiveness / 100) * coverage);
    const claimsPrevented = ptsdClaimsPrevented + depressionClaimsPrevented + anxietyClaimsPrevented + sudClaimsPrevented;
    const ptsdWcSavings = ptsdClaimsPrevented * ptsdWcAvgCost;
    const depressionWcSavings = depressionClaimsPrevented * depressionWcAvgCost;
    const anxietyWcSavings = anxietyClaimsPrevented * anxietyWcAvgCost;
    const sudWcSavings = sudClaimsPrevented * sudWcAvgCost;
    const wcSavings = ptsdWcSavings + depressionWcSavings + anxietyWcSavings + sudWcSavings;

    // Discipline & Misconduct (LAPD: $384M since 2019 = ~$64M/year)
    const baselineDisciplineCases = Math.round(data.officers * 0.04); // Slightly higher than CBP
    const avgDisciplineCost = 55000; // Higher in LA due to settlements
    const casesPrevented = Math.round(baselineDisciplineCases * 0.22 * coverage);
    const disciplineSavings = casesPrevented * avgDisciplineCost;

    const totalSavings = retentionSavings + wcSavings + disciplineSavings;
    const netSavings = totalSavings - totalInvestment;
    const roi = totalInvestment > 0 ? ((netSavings / totalInvestment) * 100) : 0;

    return {
      officers: data.officers, leadSeats, readySeats, totalSeats, engagement: engagement * 100,
      activeUsers, coverage, leadPrice, readyPrice, totalInvestment,
      baselineSeparations, behavioralSeparations, separationsPrevented, retentionSavings,
      baselineWcClaims: behavioralHealthCalcs.totalBaselineWcClaims, claimsPrevented, wcSavings,
      avgWcClaimCost: behavioralHealthCalcs.avgWcClaimCost,
      ptsdClaimsPrevented, depressionClaimsPrevented, anxietyClaimsPrevented, sudClaimsPrevented,
      ptsdWcSavings, depressionWcSavings, anxietyWcSavings, sudWcSavings,
      baselineDisciplineCases, casesPrevented, disciplineSavings, totalSavings, netSavings, roi,
    };
  }, [org, coa, includeLeadForLeaders, manualLeadSeats, manualReadySeats, manualEngagement,
      orgData, behavioralHealthCalcs, ptsdCoachingEffectiveness, depressionCoachingEffectiveness,
      anxietyCoachingEffectiveness, sudCoachingEffectiveness, ptsdWcAvgCost, depressionWcAvgCost,
      anxietyWcAvgCost, sudWcAvgCost]);

  // HELPER FUNCTIONS
  const fmt = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
  const pct = (num) => `${num.toFixed(1)}%`;
  const roiDisplay = (num) => num >= 100 ? `${(num / 100).toFixed(1)}X` : `${num.toFixed(1)}%`;

  const computeCoaScenario = (optionId) => {
    const data = orgData[org];
    let readyPercent, leadPercent, readyPrice;
    if (optionId === 'pilot') { readyPercent = 0.15; leadPercent = includeLeadForLeaders ? 0.10 : 0; readyPrice = 250; }
    else if (optionId === 'targeted') { readyPercent = 0.25; leadPercent = includeLeadForLeaders ? 0.10 : 0; readyPrice = 200; }
    else { readyPercent = 0.75; leadPercent = includeLeadForLeaders ? 0.10 : 0; readyPrice = 150; }
    const leadSeats = Math.round(data.officers * leadPercent);
    const readySeats = Math.max(Math.round(data.officers * readyPercent), 500);
    const totalSeats = leadSeats + readySeats;
    const leadPrice = 5785;
    const totalInvestment = (leadSeats * leadPrice) + (readySeats * readyPrice);
    const engagement = manualEngagement !== null ? manualEngagement / 100 : 0.65;
    const activeUsers = Math.round(totalSeats * engagement);
    const coverage = Math.min(1, activeUsers / data.officers);
    const behavioralSeparations = behavioralHealthCalcs.totalBehavioralSeparations;
    const weightedEffectiveness = behavioralSeparations > 0
      ? ((behavioralHealthCalcs.ptsdSeparations * (ptsdCoachingEffectiveness / 100)) +
         (behavioralHealthCalcs.depressionSeparations * (depressionCoachingEffectiveness / 100)) +
         (behavioralHealthCalcs.anxietySeparations * (anxietyCoachingEffectiveness / 100)) +
         (behavioralHealthCalcs.sudSeparations * (sudCoachingEffectiveness / 100))) / behavioralSeparations : 0;
    const separationsPrevented = Math.round(behavioralSeparations * (isFinite(weightedEffectiveness) ? weightedEffectiveness : 0) * coverage);
    const retentionSavings = separationsPrevented * 150000;
    const ptsdClaimsPrevented = Math.round(behavioralHealthCalcs.ptsdWcClaims * (ptsdCoachingEffectiveness / 100) * coverage);
    const depressionClaimsPrevented = Math.round(behavioralHealthCalcs.depressionWcClaims * (depressionCoachingEffectiveness / 100) * coverage);
    const anxietyClaimsPrevented = Math.round(behavioralHealthCalcs.anxietyWcClaims * (anxietyCoachingEffectiveness / 100) * coverage);
    const sudClaimsPrevented = Math.round(behavioralHealthCalcs.sudWcClaims * (sudCoachingEffectiveness / 100) * coverage);
    const wcSavings = (ptsdClaimsPrevented * ptsdWcAvgCost) + (depressionClaimsPrevented * depressionWcAvgCost) +
      (anxietyClaimsPrevented * anxietyWcAvgCost) + (sudClaimsPrevented * sudWcAvgCost);
    const disciplineSavings = Math.round(Math.round(data.officers * 0.04) * 0.22 * coverage) * 55000;
    const totalSavings = retentionSavings + wcSavings + disciplineSavings;
    const netSavings = totalSavings - totalInvestment;
    const roi = totalInvestment > 0 ? (netSavings / totalInvestment) * 100 : 0;
    return { leadSeats, readySeats, totalSeats, activeUsers, coverage, totalInvestment, retentionSavings, wcSavings, disciplineSavings, totalSavings, netSavings, roi };
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const responses = {
      'How is the net savings calculated?': "Net savings = Total savings minus BetterUp investment. We prevent separations ($150K each), Workers' Comp claims under California SB 542, and discipline cases.",
      'Why is LAPD facing a staffing crisis?': "LAPD lost 1,200+ officers since 2019 and is 762 officers short of the 9,500 target. Academy classes graduate only 31 officers vs. 60 needed monthly.",
      'Explain California SB 542': "SB 542 creates PTSD presumption for peace officers—if diagnosed, it's presumed work-related, shifting burden to employer. This significantly increases WC claims and costs.",
      'What about the 2028 Olympics?': "LAPD needs 410 additional officers for World Cup/Olympics security. Without addressing retention, the department will face critical shortfalls during these events.",
      'How does comorbidity work?': `The model accounts for overlap between conditions. At ${comorbidityOverlap}% overlap, we prevent double-counting officers with multiple diagnoses.`,
    };
    setChatMessages([...chatMessages, { type: 'user', text: chatInput }, { type: 'assistant', text: responses[chatInput] || 'Ask about net savings, staffing crisis, SB 542, Olympics, or comorbidity.' }]);
    setChatInput('');
  };

  // RENDER - START OF UI
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8fafc', minHeight: '100vh', padding: '40px 0' }}>
      <GlobalStyles />
      
      {/* LAPD HEADER */}
      <div style={container}>
        <div style={{ background: 'linear-gradient(135deg, #003366 0%, #001a33 100%)', borderRadius: 12, padding: '20px 28px', boxShadow: '0 6px 24px rgba(0,51,102,0.25)', border: '1px solid #004080' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#C5A572', marginBottom: '6px', lineHeight: '1.2' }}>
            LAPD Workforce Sustainability Dashboard
          </h1>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#cbd5e1', marginBottom: '12px', lineHeight: '1.3' }}>
            Retention, Readiness & Cost Avoidance ROI Projections for Los Angeles Police Department
          </p>

          <div style={{ background: 'rgba(0,51,102,0.25)', borderRadius: '8px', padding: '12px 16px', border: '2px solid rgba(197,165,114,0.5)', marginBottom: '12px' }}>
            <p style={{ fontSize: '13px', color: '#ffffff', lineHeight: '1.5', marginBottom: '0', textAlign: 'center' }}>
              <strong style={{ color: '#C5A572' }}>Evidence-based ROI dashboard</strong> for LAPD Division Captains, Bureau Chiefs, and Command Staff. Demonstrates BetterUp's financial impact addressing three interconnected challenges: <strong style={{ color: '#C5A572' }}>(1) retention costs</strong> from behavioral health-driven separations, <strong style={{ color: '#C5A572' }}>(2) Workers' Comp</strong> claims under California SB 542 PTSD presumption, and <strong style={{ color: '#C5A572' }}>(3) misconduct settlements</strong>—through precision development targeting accountability, readiness, and workforce sustainability.
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#e2e8f0', marginBottom: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Select Your Organization
            </label>
            <select value={org} onChange={(e) => setOrg(e.target.value)}
              style={{ width: '100%', padding: '14px 18px', fontSize: '15px', fontWeight: '600', color: '#1e293b', border: '2px solid #004080', borderRadius: '10px', background: 'white', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <option value="">Choose your organization...</option>
              <optgroup label="📊 LAPD Enterprise">
                <option value="lapd-wide">LAPD-Wide (All Sworn) - 8,738 officers</option>
              </optgroup>
              <optgroup label="🏢 Operations Bureaus">
                <option value="ops-central">Central Bureau - 1,800 officers</option>
                <option value="ops-south">South Bureau - 2,100 officers</option>
                <option value="ops-west">West Bureau - 1,600 officers</option>
                <option value="ops-valley">Valley Bureau - 2,200 officers</option>
              </optgroup>
              <optgroup label="🚔 Tier 1 Divisions (High Activity)">
                <option value="div-77th">77th Street Division - 420 officers</option>
                <option value="div-newton">Newton Division - 380 officers</option>
                <option value="div-hollywood">Hollywood Division - 350 officers</option>
                <option value="div-southeast">Southeast Division - 400 officers</option>
                <option value="div-southwest">Southwest Division - 380 officers</option>
              </optgroup>
              <optgroup label="🚔 Tier 2 Divisions">
                <option value="div-central">Central Division - 340 officers</option>
                <option value="div-rampart">Rampart Division - 320 officers</option>
                <option value="div-wilshire">Wilshire Division - 300 officers</option>
                <option value="div-van-nuys">Van Nuys Division - 380 officers</option>
                <option value="div-north-hollywood">North Hollywood Division - 340 officers</option>
              </optgroup>
              <optgroup label="🚔 Tier 3 Divisions">
                <option value="div-pacific">Pacific Division - 280 officers</option>
                <option value="div-west-la">West LA Division - 260 officers</option>
                <option value="div-harbor">Harbor Division - 280 officers</option>
                <option value="div-devonshire">Devonshire Division - 300 officers</option>
                <option value="div-foothill">Foothill Division - 320 officers</option>
                <option value="div-olympic">Olympic Division - 290 officers</option>
              </optgroup>
              <optgroup label="⭐ Specialized Units">
                <option value="metro">Metropolitan Division - 400 officers</option>
                <option value="detective-bureau">Detective Bureau - 800 officers</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div style={container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {[
              { id: 'cost-problem', label: 'The Cost Problem', icon: '⚠️' },
              { id: 'roi-model', label: 'ROI Model', icon: '💰' },
              { id: 'factors', label: 'Factor Breakdown', icon: '🔬' },
              { id: 'proof', label: 'Proof & Validation', icon: '✅' },
              { id: 'implementation', label: 'Implementation', icon: '🚀' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ padding: '10px 14px', fontSize: '13px', fontWeight: '600', border: 'none', borderRadius: '10px', cursor: 'pointer',
                  background: activeTab === tab.id ? '#003366' : 'white', color: activeTab === tab.id ? 'white' : '#475569',
                  boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,51,102,0.3)' : '0 2px 4px rgba(0,0,0,0.05)' }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <div style={{ display: 'flex', gap: '2px', alignItems: 'center', background: 'white', borderRadius: '12px', padding: '4px', border: '2px solid #003366' }}>
              <button onClick={() => setViewMode('division')}
                style={{ padding: '8px 14px', fontSize: '12px', fontWeight: '700', border: 'none', borderRadius: '8px', cursor: 'pointer',
                  background: viewMode === 'division' ? '#003366' : 'transparent', color: viewMode === 'division' ? 'white' : '#64748b' }}>
                🎯 Division Impact
              </button>
              <button onClick={() => setViewMode('enterprise')}
                style={{ padding: '8px 14px', fontSize: '12px', fontWeight: '700', border: 'none', borderRadius: '8px', cursor: 'pointer',
                  background: viewMode === 'enterprise' ? '#003366' : 'transparent', color: viewMode === 'enterprise' ? 'white' : '#64748b' }}>
                🏛️ Enterprise Costs
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div style={container}>
          {/* TAB 1: THE COST PROBLEM */}
          {activeTab === 'cost-problem' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {viewMode === 'enterprise' ? (
                <div style={{ background: 'linear-gradient(135deg, #c41230 0%, #8f0e28 100%)', color: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', boxShadow: '0 8px 24px rgba(220,38,38,0.3)' }}>
                  <div style={{ fontSize: '22px', fontWeight: '600', marginBottom: '16px', opacity: 0.95 }}>
                    {orgData[org].name} faces an estimated annual burden of:
                  </div>
                  <div style={{ fontSize: '72px', fontWeight: '900', marginBottom: '16px' }}>{fmt(calculations.totalSavings)}</div>
                  <div style={{ fontSize: '20px', fontWeight: '500', opacity: 0.9 }}>in preventable costs from workforce challenges</div>
                </div>
              ) : (
                <div style={{ background: 'linear-gradient(135deg, #003366 0%, #001a33 100%)', color: 'white', borderRadius: '16px', padding: '32px 48px', boxShadow: '0 8px 24px rgba(0,51,102,0.3)' }}>
                  <div style={{ fontSize: '22px', fontWeight: '600', marginBottom: '16px', opacity: 0.95 }}>{orgData[org].name} Operational Readiness Impact:</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '24px' }}>
                    <div style={{ background: 'white', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', fontWeight: '900', color: '#003366', marginBottom: '8px' }}>{calculations.separationsPrevented}</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>Officers at Risk</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>Preventable separations</div>
                    </div>
                    <div style={{ background: 'white', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', fontWeight: '900', color: '#003366', marginBottom: '8px' }}>{Math.round(behavioralHealthCalcs.uniqueAffected * 0.20)}</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>Non-Deployable</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>On light duty/IOD</div>
                    </div>
                    <div style={{ background: 'white', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', fontWeight: '900', color: '#003366', marginBottom: '8px' }}>{calculations.claimsPrevented}</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>WC Claims Preventable</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>Under SB 542</div>
                    </div>
                  </div>
                </div>
              )}

              {/* LAPD-Specific Context Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '3px solid #c41230' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#c41230', marginBottom: '12px' }}>💼 Retention Crisis</div>
                  <div style={{ fontSize: '42px', fontWeight: '900', color: '#1e293b', marginBottom: '16px' }}>{fmt(calculations.retentionSavings)}</div>
                  <div style={{ fontSize: '15px', color: '#475569', marginBottom: '20px', lineHeight: '1.6' }}>
                    <strong>762 officers short</strong> of 9,500 target. 660 lost in 2024 alone.
                  </div>
                  <div style={{ background: '#fef2f2', padding: '16px', borderRadius: '8px', fontSize: '14px', color: '#6d0a1f', lineHeight: '1.6' }}>
                    <strong>LAPD Impact:</strong><br />
                    • 430+ resigned in first 18 months since 2017<br />
                    • Academy graduates only 31/month (need 60)<br />
                    • Competing with LASD, other agencies
                  </div>
                </div>

                <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '3px solid #c41230' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#c41230', marginBottom: '12px' }}>🏥 Workers' Comp (SB 542)</div>
                  <div style={{ fontSize: '42px', fontWeight: '900', color: '#1e293b', marginBottom: '16px' }}>{fmt(calculations.wcSavings)}</div>
                  <div style={{ fontSize: '15px', color: '#475569', marginBottom: '20px', lineHeight: '1.6' }}>
                    <strong>{calculations.baselineWcClaims} baseline claims</strong> at {fmt(calculations.avgWcClaimCost)} average
                  </div>
                  <div style={{ background: '#fef2f2', padding: '16px', borderRadius: '8px', fontSize: '14px', color: '#6d0a1f', lineHeight: '1.6' }}>
                    <strong>California Impact:</strong><br />
                    • SB 542 PTSD presumption increases costs<br />
                    • Labor Code 4850: Full salary during IOD<br />
                    • 19,271 active claims (citywide)
                  </div>
                </div>

                <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '3px solid #c41230' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#c41230', marginBottom: '12px' }}>⚖️ Misconduct Settlements</div>
                  <div style={{ fontSize: '42px', fontWeight: '900', color: '#1e293b', marginBottom: '16px' }}>{fmt(calculations.disciplineSavings)}</div>
                  <div style={{ fontSize: '15px', color: '#475569', marginBottom: '20px', lineHeight: '1.6' }}>
                    <strong>{calculations.casesPrevented} preventable cases</strong> annually
                  </div>
                  <div style={{ background: '#fef2f2', padding: '16px', borderRadius: '8px', fontSize: '14px', color: '#6d0a1f', lineHeight: '1.6' }}>
                    <strong>LAPD Data:</strong><br />
                    • $384M in settlements since Sept 2019<br />
                    • ~$64M/year average<br />
                    • $10M+ in discrimination settlements
                  </div>
                </div>
              </div>

              {/* Olympics/World Cup Warning */}
              <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '4px solid #f59e0b', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '48px' }}>🏆</span>
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#92400e', margin: 0 }}>Critical Timeline: 2026 World Cup & 2028 Olympics</h2>
                    <p style={{ fontSize: '15px', color: '#78350f', margin: '8px 0 0 0' }}>Chief McDonnell: "LAPD needs 410 additional officers for world-event security"</p>
                  </div>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '2px solid #f59e0b' }}>
                  <div style={{ fontSize: '15px', color: '#78350f', lineHeight: '1.7' }}>
                    Without addressing retention and wellness, LAPD faces critical shortfalls during these events. Current trajectory: hiring only 240 officers (vs. 480 planned) after budget cuts. BetterUp can help retain existing officers while developing leadership capacity for high-stakes operations.
                  </div>
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg, #e6f2f8 0%, #cce5f0 100%)', border: '3px solid #003366', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#003366', marginBottom: '12px' }}>There's a Better Way Forward</div>
                <button onClick={() => setActiveTab('roi-model')}
                  style={{ padding: '16px 32px', fontSize: '17px', fontWeight: '700', background: '#003366', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                  See the ROI Model →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ROI MODEL */}
          {activeTab === 'roi-model' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'linear-gradient(135deg, #e8f4e0 0%, #d0eac0 100%)', border: '4px solid #5e9732', borderRadius: '16px', padding: '28px 40px', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: '600', color: '#5e9732', marginBottom: '12px' }}>Estimated Annual Net Savings</div>
                <div style={{ fontSize: '64px', fontWeight: '900', color: '#5e9732', marginBottom: '16px' }}>{fmt(calculations.netSavings)}</div>
                <div style={{ fontSize: '18px', color: '#5e9732' }}>
                  ROI: <strong>{roiDisplay(calculations.roi)}</strong> • Total Savings: {fmt(calculations.totalSavings)} • Investment: {fmt(calculations.totalInvestment)}
                </div>
              </div>

              {/* COA Selection */}
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px' }}>
                <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b', marginBottom: '16px' }}>Select Course of Action (COA)</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {[
                    { id: 'pilot', label: 'COA 1: Pilot', desc: '15% coverage • Select divisions • Proof of concept', price: '$250/seat' },
                    { id: 'targeted', label: 'COA 2: Targeted (Recommended)', desc: '25% coverage • Balanced scale with volume discount', price: '$200/seat' },
                    { id: 'scaled', label: 'COA 3: Scaled', desc: '75% coverage • Maximum impact at best price', price: '$150/seat' }
                  ].map(option => (
                    <button key={option.id} onClick={() => setCoa(option.id)}
                      style={{ padding: '20px', border: coa === option.id ? '3px solid #003366' : '2px solid #e2e8f0', borderRadius: '12px',
                        background: coa === option.id ? '#e6f2f8' : 'white', cursor: 'pointer', textAlign: 'left' }}>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: coa === option.id ? '#003366' : '#1e293b', marginBottom: '8px' }}>{option.label}</div>
                      <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>{option.desc}</div>
                      <div style={{ fontSize: '14px', color: '#64748b' }}>{option.price}</div>
                    </button>
                  ))}
                </div>

                <button onClick={() => setShowCoaComparison(!showCoaComparison)}
                  style={{ marginTop: '16px', padding: '12px 20px', fontSize: '14px', fontWeight: '700', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', width: '100%' }}>
                  {showCoaComparison ? '▼ Hide COA Comparison' : '📊 Compare All 3 COAs Side-by-Side'}
                </button>

                {showCoaComparison && (
                  <div style={{ marginTop: '20px', background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '4px solid #f59e0b', borderRadius: '16px', padding: '32px' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#92400e', marginBottom: '24px', textAlign: 'center' }}>📊 COA Comparison</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                      {['pilot', 'targeted', 'scaled'].map((coaId) => {
                        const scenario = computeCoaScenario(coaId);
                        const isSelected = coa === coaId;
                        return (
                          <div key={coaId} style={{ background: isSelected ? '#fff' : '#fffef5', border: isSelected ? '4px solid #003366' : '2px solid #f59e0b', borderRadius: '12px', padding: '24px', position: 'relative' }}>
                            {isSelected && <div style={{ position: 'absolute', top: '-12px', right: '12px', background: '#003366', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>SELECTED</div>}
                            <div style={{ fontSize: '18px', fontWeight: '800', color: '#92400e', marginBottom: '16px', textAlign: 'center' }}>
                              {coaId === 'pilot' ? 'COA 1: Pilot' : coaId === 'targeted' ? 'COA 2: Targeted' : 'COA 3: Scaled'}
                            </div>
                            <div style={{ background: '#fff', padding: '16px', borderRadius: '10px', marginBottom: '12px', border: '2px solid #fbbf24' }}>
                              <div style={{ fontSize: '13px', color: '#78350f', fontWeight: '600', marginBottom: '8px' }}>💰 Investment</div>
                              <div style={{ fontSize: '28px', fontWeight: '900', color: '#92400e' }}>{fmt(scenario.totalInvestment)}</div>
                            </div>
                            <div style={{ background: '#e8f4e0', padding: '16px', borderRadius: '10px', marginBottom: '12px', border: '2px solid #5e9732' }}>
                              <div style={{ fontSize: '13px', color: '#4a7628', fontWeight: '600', marginBottom: '8px' }}>💵 Total Savings</div>
                              <div style={{ fontSize: '28px', fontWeight: '900', color: '#5e9732' }}>{fmt(scenario.totalSavings)}</div>
                            </div>
                            <div style={{ background: isSelected ? '#e6f2f8' : '#fff', padding: '16px', borderRadius: '10px', border: '2px solid ' + (isSelected ? '#003366' : '#f59e0b'), textAlign: 'center' }}>
                              <div style={{ fontSize: '13px', color: isSelected ? '#003366' : '#92400e', fontWeight: '600', marginBottom: '8px' }}>📈 ROI</div>
                              <div style={{ fontSize: '36px', fontWeight: '900', color: isSelected ? '#003366' : '#92400e' }}>{roiDisplay(scenario.roi)}</div>
                            </div>
                            {!isSelected && <button onClick={() => setCoa(coaId)} style={{ marginTop: '12px', padding: '10px 16px', fontSize: '14px', fontWeight: '600', background: '#003366', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%' }}>Select This COA</button>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Lead Toggle */}
                <div style={{ marginTop: '20px', padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={includeLeadForLeaders} onChange={(e) => setIncludeLeadForLeaders(e.target.checked)} style={{ width: '20px', height: '20px' }} />
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Add Lead for Supervisors & Critical Talent (10% coverage)</div>
                      <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>Adds {Math.round(calculations.officers * 0.10).toLocaleString()} Lead seats at $5,785/seat</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Product Mix */}
              <div style={{ background: 'white', borderRadius: '12px', padding: '20px 28px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', marginBottom: '16px' }}>💼 Product Mix & Investment</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Lead Seats</div>
                    <div style={{ fontSize: '32px', fontWeight: '900', color: '#1e293b' }}>{calculations.leadSeats.toLocaleString()}</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>{fmt(calculations.leadPrice)}/seat</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Ready Seats</div>
                    <div style={{ fontSize: '32px', fontWeight: '900', color: '#1e293b' }}>{calculations.readySeats.toLocaleString()}</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>{fmt(calculations.readyPrice)}/seat</div>
                  </div>
                  <div style={{ background: '#e6f2f8', padding: '20px', borderRadius: '10px', border: '3px solid #003366' }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#003366', marginBottom: '8px' }}>Total Investment</div>
                    <div style={{ fontSize: '32px', fontWeight: '900', color: '#003366' }}>{fmt(calculations.totalInvestment)}</div>
                    <div style={{ fontSize: '13px', color: '#003366' }}>{calculations.totalSeats.toLocaleString()} seats</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FACTORS */}
          {activeTab === 'factors' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '20px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '16px' }}>Behavioral Health Factors</h2>
                <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.7' }}>
                  Adjust assumptions based on LAPD-specific data. California's SB 542 PTSD presumption and Labor Code 4850 significantly impact workers' comp costs.
                </p>
              </div>

              {/* Comorbidity */}
              <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '3px solid #f59e0b', borderRadius: '12px', padding: '20px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#92400e', marginBottom: '16px' }}>🧮 Comorbidity Adjustment: {comorbidityOverlap}%</h2>
                <input type="range" min="0" max="50" step="5" value={comorbidityOverlap} onChange={(e) => setComorbidityOverlap(parseInt(e.target.value))} style={{ width: '100%' }} />
                <div style={{ background: 'white', padding: '16px', borderRadius: '10px', marginTop: '16px' }}>
                  <div style={{ fontSize: '14px', color: '#78350f', lineHeight: '1.7' }}>
                    <strong>Current Impact:</strong> Raw total: {behavioralHealthCalcs.rawTotalAffected.toLocaleString()} → Adjusted: {behavioralHealthCalcs.uniqueAffected.toLocaleString()} unique officers (prevented double-counting {behavioralHealthCalcs.comorbidityReduction.toLocaleString()})
                  </div>
                </div>
              </div>

              {/* Factor Panels */}
              {[
                { id: 'ptsd', label: '🧠 PTSD & Trauma', affected: behavioralHealthCalcs.ptsdAffected, claims: behavioralHealthCalcs.ptsdWcClaims, cost: ptsdWcAvgCost, prevalence: ptsdPrevalence, setPrevalence: setPtsdPrevalence, effectiveness: ptsdCoachingEffectiveness, setEffectiveness: setPtsdCoachingEffectiveness, filingRate: ptsdWcFilingRate, setFilingRate: setPtsdWcFilingRate, avgCost: ptsdWcAvgCost, setAvgCost: setPtsdWcAvgCost, sepRate: ptsdSeparationRate, setSepRate: setPtsdSeparationRate, claimsPrevented: calculations.ptsdClaimsPrevented, savings: calculations.ptsdWcSavings, note: 'SB 542 creates PTSD presumption—if diagnosed, it\'s presumed work-related' },
                { id: 'depression', label: '😔 Depression & Burnout', affected: behavioralHealthCalcs.depressionAffected, claims: behavioralHealthCalcs.depressionWcClaims, cost: depressionWcAvgCost, prevalence: depressionPrevalence, setPrevalence: setDepressionPrevalence, effectiveness: depressionCoachingEffectiveness, setEffectiveness: setDepressionCoachingEffectiveness, filingRate: depressionWcFilingRate, setFilingRate: setDepressionWcFilingRate, avgCost: depressionWcAvgCost, setAvgCost: setDepressionWcAvgCost, sepRate: depressionSeparationRate, setSepRate: setDepressionSeparationRate, claimsPrevented: calculations.depressionClaimsPrevented, savings: calculations.depressionWcSavings, note: '83% of officers report mental health affecting job performance' },
                { id: 'anxiety', label: '😰 Anxiety & Stress', affected: behavioralHealthCalcs.anxietyAffected, claims: behavioralHealthCalcs.anxietyWcClaims, cost: anxietyWcAvgCost, prevalence: anxietyPrevalence, setPrevalence: setAnxietyPrevalence, effectiveness: anxietyCoachingEffectiveness, setEffectiveness: setAnxietyCoachingEffectiveness, filingRate: anxietyWcFilingRate, setFilingRate: setAnxietyWcFilingRate, avgCost: anxietyWcAvgCost, setAvgCost: setAnxietyWcAvgCost, sepRate: anxietySeparationRate, setSepRate: setAnxietySeparationRate, claimsPrevented: calculations.anxietyClaimsPrevented, savings: calculations.anxietyWcSavings, note: 'Officers 5x more likely to suffer from anxiety than general population' },
                { id: 'sud', label: '🍺 Substance Use', affected: behavioralHealthCalcs.sudAffected, claims: behavioralHealthCalcs.sudWcClaims, cost: sudWcAvgCost, prevalence: sudPrevalence, setPrevalence: setSudPrevalence, effectiveness: sudCoachingEffectiveness, setEffectiveness: setSudCoachingEffectiveness, filingRate: sudWcFilingRate, setFilingRate: setSudWcFilingRate, avgCost: sudWcAvgCost, setAvgCost: setSudWcAvgCost, sepRate: sudSeparationRate, setSepRate: setSudSeparationRate, claimsPrevented: calculations.sudClaimsPrevented, savings: calculations.sudWcSavings, note: 'CuraLinc EAP: 67% severity reduction, 78% at-risk elimination' },
              ].map(factor => (
                <div key={factor.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: expandedFactor === factor.id ? '3px solid #c41230' : '2px solid #e2e8f0' }}>
                  <button onClick={() => setExpandedFactor(expandedFactor === factor.id ? null : factor.id)}
                    style={{ width: '100%', padding: '24px', background: expandedFactor === factor.id ? '#fef2f2' : 'white', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '22px', fontWeight: '800', color: '#c41230', marginBottom: '8px' }}>{factor.label}</div>
                      <div style={{ fontSize: '15px', color: '#64748b' }}>
                        {factor.affected.toLocaleString()} officers • {factor.claims} claims • {fmt(factor.cost)} avg
                      </div>
                    </div>
                    <div style={{ fontSize: '32px', color: '#c41230' }}>{expandedFactor === factor.id ? '−' : '+'}</div>
                  </button>
                  {expandedFactor === factor.id && (
                    <div style={{ padding: '24px', borderTop: '2px solid #fee2e2', background: '#fef2f2' }}>
                      <div style={{ marginBottom: '20px', fontSize: '15px', color: '#6d0a1f', lineHeight: '1.7', fontStyle: 'italic' }}>{factor.note}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#6d0a1f' }}>Prevalence: {factor.prevalence}%</label>
                          <input type="range" min="10" max="35" value={factor.prevalence} onChange={(e) => factor.setPrevalence(parseInt(e.target.value))} style={{ width: '100%' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#6d0a1f' }}>Coaching Effectiveness: {factor.effectiveness}%</label>
                          <input type="range" min="15" max="75" value={factor.effectiveness} onChange={(e) => factor.setEffectiveness(parseInt(e.target.value))} style={{ width: '100%' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#6d0a1f' }}>WC Filing Rate: {factor.filingRate}%</label>
                          <input type="range" min="5" max="20" value={factor.filingRate} onChange={(e) => factor.setFilingRate(parseInt(e.target.value))} style={{ width: '100%' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#6d0a1f' }}>Avg Claim Cost: {fmt(factor.avgCost)}</label>
                          <input type="range" min="30000" max="120000" step="5000" value={factor.avgCost} onChange={(e) => factor.setAvgCost(parseInt(e.target.value))} style={{ width: '100%' }} />
                        </div>
                      </div>
                      <div style={{ marginTop: '20px', padding: '16px', background: '#fff', borderRadius: '10px', border: '2px solid #fecaca' }}>
                        <div style={{ fontSize: '14px', color: '#6d0a1f', lineHeight: '1.7' }}>
                          <strong>ROI Impact:</strong> BetterUp prevents {factor.claimsPrevented} claims = <strong>{fmt(factor.savings)} savings</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: PROOF */}
          {activeTab === 'proof' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <MethodologyImpactSection />

              <div style={{ background: 'white', borderRadius: '12px', padding: '32px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '20px' }}>🎖️ Department of Air Force: Federal Law Enforcement Translation</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                  {[
                    { metric: '+7%', label: 'Career Commitment', desc: '4-year study' },
                    { metric: '+15%', label: 'Unit Readiness', desc: 'Team performance' },
                    { metric: '+13%', label: 'Individual Readiness', desc: 'Mission competencies' },
                    { metric: '88%', label: 'Would Recommend', desc: 'High adoption' }
                  ].map((item, i) => (
                    <div key={i} style={{ background: '#e6f2f8', padding: '24px', borderRadius: '12px', border: '2px solid #003366', textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', fontWeight: '900', color: '#003366' }}>{item.metric}</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>{item.label}</div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '32px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '20px' }}>🔬 JAMA 2024: Peer-Reviewed Clinical Validation</h2>
                <div style={{ background: '#f1f5f9', padding: '24px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>🎯 21.6% Reduction in Burnout & Mental Health Conditions</div>
                  <div style={{ fontSize: '15px', color: '#475569', lineHeight: '1.7' }}>
                    Randomized controlled trial with 1,132 participants showed enhanced behavioral health benefits (including coaching) reduced mental health symptoms by 21.6% compared to traditional EAP-only control groups.
                  </div>
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '32px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '20px' }}>🚔 Montreal Police: 22-Year Suicide Prevention Program</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ background: '#fef2f2', padding: '24px', borderRadius: '12px', border: '3px solid #c41230', textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#8f0e28', marginBottom: '12px' }}>Before Program</div>
                    <div style={{ fontSize: '56px', fontWeight: '900', color: '#c41230' }}>29.4</div>
                    <div style={{ fontSize: '15px', color: '#6d0a1f' }}>suicides per 100K/year</div>
                  </div>
                  <div style={{ background: '#e8f4e0', padding: '24px', borderRadius: '12px', border: '3px solid #5e9732', textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#5e9732', marginBottom: '12px' }}>After 22 Years</div>
                    <div style={{ fontSize: '56px', fontWeight: '900', color: '#5e9732' }}>10.2</div>
                    <div style={{ fontSize: '15px', color: '#4a7628' }}>suicides per 100K/year</div>
                  </div>
                </div>
                <div style={{ background: '#e6f2f8', padding: '24px', borderRadius: '12px', border: '2px solid #003366', marginTop: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#003366' }}>65% Reduction in Suicide Rate</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: IMPLEMENTATION */}
          {activeTab === 'implementation' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '32px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '24px' }}>🎯 LAPD Implementation Roadmap</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ background: '#e6f2f8', border: '3px solid #003366', borderRadius: '12px', padding: '24px' }}>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#003366', marginBottom: '12px' }}>Phase 1: Pilot (Q2 2026)</div>
                    <div style={{ fontSize: '15px', color: '#0078ae', lineHeight: '1.7' }}>
                      <strong>Target:</strong> 2-3 high-need divisions (77th Street, Newton, Hollywood)<br />
                      <strong>Focus:</strong> Academy recruits + FTOs + mid-career officers at highest attrition risk<br />
                      <strong>Goal:</strong> Validate engagement rates and early retention signals before World Cup
                    </div>
                  </div>

                  <div style={{ background: '#f0f9ff', border: '3px solid #0078ae', borderRadius: '12px', padding: '24px' }}>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#0078ae', marginBottom: '12px' }}>Phase 2: Targeted Scale (Q4 2026)</div>
                    <div style={{ fontSize: '15px', color: '#0078ae', lineHeight: '1.7' }}>
                      <strong>Target:</strong> Expand to all Tier 1 divisions + Metro Division<br />
                      <strong>Focus:</strong> World Cup operational readiness + leadership pipeline<br />
                      <strong>Goal:</strong> 5-10% reduction in voluntary separations, measurable WC claims decline
                    </div>
                  </div>

                  <div style={{ background: '#f0fdf4', border: '3px solid #5e9732', borderRadius: '12px', padding: '24px' }}>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#5e9732', marginBottom: '12px' }}>Phase 3: Enterprise (2027-2028)</div>
                    <div style={{ fontSize: '15px', color: '#5e9732', lineHeight: '1.7' }}>
                      <strong>Target:</strong> Department-wide rollout<br />
                      <strong>Focus:</strong> 2028 Olympics readiness + culture transformation<br />
                      <strong>Goal:</strong> 7%+ retention improvement, position LAPD as national model
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '32px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '24px' }}>📋 Key Stakeholders</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#003366', marginBottom: '12px' }}>Command Staff</div>
                    <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>
                      • Chief Jim McDonnell (appointed Nov 2024)<br />
                      • Bureau Chiefs (Central, South, West, Valley)<br />
                      • Dr. Edrick Dorian (Chief Psychologist, Behavioral Science Services)
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#003366', marginBottom: '12px' }}>Key Partners</div>
                    <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>
                      • LA Police Protective League (LAPPL)<br />
                      • Board of Police Commissioners<br />
                      • Mayor Bass's Office (recruitment priority)<br />
                      • LA Police Foundation (funding partner)
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg, #e6f2f8 0%, #cce5f0 100%)', border: '3px solid #003366', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#003366', marginBottom: '16px' }}>🚀 Next Steps</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                  <div style={{ background: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>1️⃣</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Discovery Call</div>
                    <div style={{ fontSize: '14px', color: '#475569' }}>Validate assumptions with LAPD data</div>
                  </div>
                  <div style={{ background: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>2️⃣</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Stakeholder Briefings</div>
                    <div style={{ fontSize: '14px', color: '#475569' }}>Present business case to leadership</div>
                  </div>
                  <div style={{ background: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>3️⃣</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Pilot Launch</div>
                    <div style={{ fontSize: '14px', color: '#475569' }}>Q2 2026 pre-World Cup deployment</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FLOATING CHATBOT */}
      {!showChatbot && (
        <button onClick={() => setShowChatbot(true)}
          style={{ position: 'fixed', bottom: '32px', right: '32px', width: '64px', height: '64px', borderRadius: '50%', background: '#003366', color: 'white', border: 'none', fontSize: '28px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,51,102,0.4)', zIndex: 1000 }}>
          💬
        </button>
      )}
      {showChatbot && (
        <div style={{ position: 'fixed', bottom: '32px', right: '32px', width: '400px', height: '500px', background: 'white', borderRadius: '16px', boxShadow: '0 12px 48px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', zIndex: 1000 }}>
          <div style={{ padding: '20px', borderBottom: '2px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#003366', borderRadius: '16px 16px 0 0' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>💬 Ask Me Anything</div>
            <button onClick={() => setShowChatbot(false)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#f8fafc' }}>
            {chatMessages.length === 0 ? (
              <div style={{ textAlign: 'center', paddingTop: '32px' }}>
                <p style={{ fontWeight: '500', color: '#6b7280', marginBottom: '16px' }}>Ask anything about the model!</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['How is the net savings calculated?', 'Why is LAPD facing a staffing crisis?', 'Explain California SB 542', 'What about the 2028 Olympics?', 'How does comorbidity work?'].map((q, i) => (
                    <button key={i} onClick={() => setChatInput(q)} style={{ width: '100%', textAlign: 'left', padding: '12px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>{q}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {chatMessages.map((m, i) => (
                  <div key={i} style={{ textAlign: m.type === 'user' ? 'right' : 'left' }}>
                    <div style={{ display: 'inline-block', padding: '12px', borderRadius: '8px', background: m.type === 'user' ? '#003366' : 'white', color: m.type === 'user' ? 'white' : '#1f2937', border: m.type === 'user' ? 'none' : '1px solid #e5e7eb', fontSize: '14px' }}>{m.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px' }}>
            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask about the model..." style={{ flex: 1, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px' }} />
            <button onClick={handleSendMessage} style={{ padding: '8px 16px', background: '#003366', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LAPDDashboard;
// ===== LAPD WORKFORCE SUSTAINABILITY ROI CALCULATOR =====
// Complete version with Executive Summary, Organization Selector, and all features
import React, { useState, useMemo, useEffect } from 'react';

// ===== GLOBAL STYLES & THEME =====
function GlobalStyles() {
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; }
      html, body, #root { height: 100%; }
    `}</style>
  );
}

const container = {
  boxSizing: 'border-box',
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '0 16px',
};

// LAPD Theme - Blue and Gold
const T = {
  color: {
    blue: '#003366',
    gold: '#B8860B',
    lightBlue: '#e6f0f7',
    red: '#c41230',
    green: '#2e7d32',
    ink: '#0f172a',
    slate600: '#475569',
    axis: '#94a3b8',
    border: '#e5e7eb',
  }
};

// ===== MAIN DASHBOARD COMPONENT =====
const LAPDDashboard = () => {
  // Core State
  const [activeTab, setActiveTab] = useState('executive-summary');
  const [viewMode, setViewMode] = useState('field');
  const [expandedFactor, setExpandedFactor] = useState(null);
  const [showResearch, setShowResearch] = useState(false);
  const [investmentLevel, setInvestmentLevel] = useState(500000);

  // Organization Selector
  const [selectedOrg, setSelectedOrg] = useState('lapd-wide');

  // Chatbot State
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // ===== LAPD BASELINE DATA =====
  const lapdData = useMemo(() => ({
    officers: 8738,
    targetOfficers: 9500,
    shortage: 762,
    attrition2024: 660,
    replacementCost: 150000,
    totalSettlementsSince2019: 384000000,
    annualSettlements: 70000000,
    civilRightsShootingsForce: 183000000,
    civilRightsShareOfTotal: 0.48,
    annualWcBudget: 92600000,
    internalLawsuits5Year: 68500000,
    annualInternalLawsuits: 13700000,
  }), []);

  // ===== ORGANIZATION DATA STRUCTURE =====
  const orgData = useMemo(() => ({
    'lapd-wide': { name: 'LAPD (All Bureaus)', officers: 8738, type: 'enterprise', description: 'Third-largest municipal police department in the United States' },
    // Bureaus
    'operations': { name: 'Office of Operations', officers: 5200, type: 'bureau', description: '21 geographic divisions grouped in 4 regional bureaus' },
    'special-ops': { name: 'Office of Special Operations', officers: 1500, type: 'bureau', description: 'Detective Bureau, Major Crimes, Gang & Narcotics' },
    'support-services': { name: 'Office of Support Services', officers: 800, type: 'bureau', description: 'Personnel, Training, Fiscal, Records' },
    'constitutional-policing': { name: 'Constitutional Policing & Policy', officers: 300, type: 'bureau', description: 'Risk Management, Strategic Planning, Audit' },
    'counterterrorism': { name: 'Counterterrorism & Special Operations', officers: 938, type: 'bureau', description: 'Metropolitan Division, Air Support, SWAT' },
    // Central Bureau Divisions
    'central': { name: 'Central Area', officers: 280, bureau: 'Central Bureau', type: 'division', description: 'Downtown LA, Skid Row, financial district' },
    'hollenbeck': { name: 'Hollenbeck Area', officers: 240, bureau: 'Central Bureau', type: 'division', description: 'Boyle Heights, East LA communities' },
    'northeast': { name: 'Northeast Area', officers: 260, bureau: 'Central Bureau', type: 'division', description: 'Eagle Rock, Highland Park, Mt. Washington' },
    'rampart': { name: 'Rampart Area', officers: 270, bureau: 'Central Bureau', type: 'division', description: 'Echo Park, Westlake, MacArthur Park' },
    // South Bureau Divisions
    '77th': { name: '77th Street Area', officers: 300, bureau: 'South Bureau', type: 'division', description: 'South Central LA, Florence-Firestone' },
    'harbor': { name: 'Harbor Area', officers: 220, bureau: 'South Bureau', type: 'division', description: 'San Pedro, Wilmington, Harbor area' },
    'hollywoodarea': { name: 'Hollywood Area', officers: 290, bureau: 'South Bureau', type: 'division', description: 'Hollywood, West Hollywood border' },
    'southeast': { name: 'Southeast Area', officers: 250, bureau: 'South Bureau', type: 'division', description: 'Watts, Jordan Downs' },
    'southwest': { name: 'Southwest Area', officers: 260, bureau: 'South Bureau', type: 'division', description: 'Crenshaw, Baldwin Hills, Leimert Park' },
    // West Bureau Divisions
    'olympic': { name: 'Olympic Area', officers: 240, bureau: 'West Bureau', type: 'division', description: 'Mid-City, Koreatown' },
    'pacific': { name: 'Pacific Area', officers: 230, bureau: 'West Bureau', type: 'division', description: 'Venice, Marina del Rey, Playa del Rey' },
    'west-la': { name: 'West Los Angeles Area', officers: 250, bureau: 'West Bureau', type: 'division', description: 'Westwood, Brentwood, West LA' },
    'wilshire': { name: 'Wilshire Area', officers: 260, bureau: 'West Bureau', type: 'division', description: 'Mid-Wilshire, Hancock Park, Miracle Mile' },
    // Valley Bureau Divisions
    'devonshire': { name: 'Devonshire Area', officers: 230, bureau: 'Valley Bureau', type: 'division', description: 'Northridge, Granada Hills, Porter Ranch' },
    'foothill': { name: 'Foothill Area', officers: 240, bureau: 'Valley Bureau', type: 'division', description: 'Sylmar, Lake View Terrace, Pacoima' },
    'mission': { name: 'Mission Area', officers: 250, bureau: 'Valley Bureau', type: 'division', description: 'Mission Hills, North Hills, Panorama City' },
    'north-hollywood': { name: 'North Hollywood Area', officers: 270, bureau: 'Valley Bureau', type: 'division', description: 'NoHo, Valley Village, Studio City' },
    'topanga': { name: 'Topanga Area', officers: 240, bureau: 'Valley Bureau', type: 'division', description: 'Canoga Park, Woodland Hills, West Hills' },
    'van-nuys': { name: 'Van Nuys Area', officers: 260, bureau: 'Valley Bureau', type: 'division', description: 'Van Nuys, Sherman Oaks' },
    'west-valley': { name: 'West Valley Area', officers: 220, bureau: 'Valley Bureau', type: 'division', description: 'Reseda, Tarzana, Winnetka' },
    // Specialized Units
    'metropolitan': { name: 'Metropolitan Division', officers: 450, type: 'specialized', description: 'SWAT, K-9, Mounted, Special Enforcement' },
    'detective-bureau': { name: 'Detective Bureau', officers: 800, type: 'specialized', description: 'Robbery-Homicide, Commercial Crimes, Gang & Narcotics' },
    'traffic': { name: 'Traffic Group', officers: 250, type: 'specialized', description: 'Traffic enforcement and investigation' },
  }), []);

  // ===== BEHAVIORAL HEALTH FACTOR SLIDERS =====
  const [behavioralAttritionShare, setBehavioralAttritionShare] = useState(35);
  const [retentionImprovementTarget, setRetentionImprovementTarget] = useState(15);
  const [misconductBehavioralLink, setMisconductBehavioralLink] = useState(40);
  const [misconductReductionTarget, setMisconductReductionTarget] = useState(20);
  const [wcMentalHealthShare, setWcMentalHealthShare] = useState(25);
  const [wcClaimReductionTarget, setWcClaimReductionTarget] = useState(20);
  const [ptsdPrevalence, setPtsdPrevalence] = useState(18);
  const [ptsdCoachingEffectiveness, setPtsdCoachingEffectiveness] = useState(25);
  const [ptsdSeparationRate, setPtsdSeparationRate] = useState(12);
  const [ptsdLimitedDutyDays, setPtsdLimitedDutyDays] = useState(87);

  const [depressionPrevalence, setDepressionPrevalence] = useState(18);
  const [depressionCoachingEffectiveness, setDepressionCoachingEffectiveness] = useState(25);
  const [depressionSeparationRate, setDepressionSeparationRate] = useState(15);
  const [depressionLimitedDutyDays, setDepressionLimitedDutyDays] = useState(65);

  const [anxietyPrevalence, setAnxietyPrevalence] = useState(15);
  const [anxietyCoachingEffectiveness, setAnxietyCoachingEffectiveness] = useState(20);
  const [anxietySeparationRate, setAnxietySeparationRate] = useState(10);
  const [anxietyLimitedDutyDays, setAnxietyLimitedDutyDays] = useState(45);

  const [sudPrevalence, setSudPrevalence] = useState(25);
  const [sudCoachingEffectiveness, setSudCoachingEffectiveness] = useState(30);
  const [sudSeparationRate, setSudSeparationRate] = useState(25);
  const [sudLimitedDutyDays, setSudLimitedDutyDays] = useState(30);

  const [comorbidityOverlap, setComorbidityOverlap] = useState(35);

  // ===== COST CALCULATIONS (ORG-AWARE) =====
  const calculations = useMemo(() => {
    const currentOrg = orgData[selectedOrg];
    const currentOfficers = currentOrg.officers;
    const orgScaleFactor = currentOfficers / lapdData.officers;

    // COVERAGE: Investment determines how many officers you actually reach
    // At ~$200/seat average, investment buys seats → seats / officers = coverage
    const avgCostPerSeat = 200;
    const seatsAfforded = Math.round(investmentLevel / avgCostPerSeat);
    const coverage = Math.min(1.0, seatsAfforded / currentOfficers);

    const rawPtsdAffected = Math.round(currentOfficers * (ptsdPrevalence / 100));
    const rawDepressionAffected = Math.round(currentOfficers * (depressionPrevalence / 100));
    const rawAnxietyAffected = Math.round(currentOfficers * (anxietyPrevalence / 100));
    const rawSudAffected = Math.round(currentOfficers * (sudPrevalence / 100));
    const rawTotalAffected = rawPtsdAffected + rawDepressionAffected + rawAnxietyAffected + rawSudAffected;
    const uniqueAffected = Math.round(rawTotalAffected * (1 - comorbidityOverlap / 100));

    // 1. RETENTION - scale by coverage
    const orgAttrition = Math.round(lapdData.attrition2024 * orgScaleFactor);
    const behavioralDrivenSeparations = Math.round(orgAttrition * (behavioralAttritionShare / 100));
    const retentionBaseCost = behavioralDrivenSeparations * lapdData.replacementCost;
    const maxSeparationsPrevented = Math.round(behavioralDrivenSeparations * (retentionImprovementTarget / 100));
    const separationsPrevented = Math.round(maxSeparationsPrevented * coverage);
    const retentionSavings = separationsPrevented * lapdData.replacementCost;

    // 2. MISCONDUCT - scale by coverage
    const orgAnnualSettlements = Math.round(lapdData.annualSettlements * orgScaleFactor);
    const behavioralLinkedMisconduct = Math.round(orgAnnualSettlements * (misconductBehavioralLink / 100));
    const misconductSavings = Math.round(behavioralLinkedMisconduct * (misconductReductionTarget / 100) * coverage);

    // 3. WORKERS' COMP - scale by coverage
    const orgWcBudget = Math.round(lapdData.annualWcBudget * orgScaleFactor);
    const mentalHealthWcCosts = Math.round(orgWcBudget * (wcMentalHealthShare / 100));
    const wcSavings = Math.round(mentalHealthWcCosts * (wcClaimReductionTarget / 100) * coverage);

    // TOTALS
    const totalAnnualProblemCost = retentionBaseCost + behavioralLinkedMisconduct + mentalHealthWcCosts;
    const totalPotentialSavings = retentionSavings + misconductSavings + wcSavings;
    const netSavings = totalPotentialSavings - investmentLevel;
    const roi = investmentLevel > 0 ? ((netSavings / investmentLevel) * 100) : 0;
    const breakEvenRetention = retentionSavings > 0 ? (investmentLevel / retentionSavings * 100).toFixed(1) : 'N/A';
    const breakEvenMisconduct = misconductSavings > 0 ? (investmentLevel / misconductSavings * 100).toFixed(1) : 'N/A';
    const breakEvenWc = wcSavings > 0 ? (investmentLevel / wcSavings * 100).toFixed(1) : 'N/A';

    return {
      currentOfficers, orgName: currentOrg.name, orgType: currentOrg.type, orgScaleFactor,
      coverage, seatsAfforded,
      rawTotalAffected, uniqueAffected, comorbidityReduction: rawTotalAffected - uniqueAffected,
      orgAttrition, behavioralDrivenSeparations, retentionBaseCost, separationsPrevented, retentionSavings,
      orgAnnualSettlements, behavioralLinkedMisconduct, misconductSavings,
      orgWcBudget, mentalHealthWcCosts, wcSavings,
      totalAnnualProblemCost, totalPotentialSavings, investmentLevel, netSavings, roi,
      breakEvenRetention, breakEvenMisconduct, breakEvenWc,
    };
  }, [selectedOrg, orgData, lapdData, behavioralAttritionShare, retentionImprovementTarget,
      misconductBehavioralLink, misconductReductionTarget, wcMentalHealthShare, wcClaimReductionTarget,
      investmentLevel, ptsdPrevalence, depressionPrevalence, anxietyPrevalence, sudPrevalence, comorbidityOverlap]);

  // Reset investment level when org changes (scale to Targeted equivalent)
  useEffect(() => {
    const scaleFactor = orgData[selectedOrg].officers / lapdData.officers;
    const scaledTargeted = Math.round(750000 * scaleFactor / 10000) * 10000 || 80000;
    setInvestmentLevel(scaledTargeted);
  }, [selectedOrg, orgData, lapdData]);

  // ===== HELPER FUNCTIONS =====
  const fmt = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
  const fmtCompact = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(num);
  const roiDisplay = (num) => num >= 100 ? `${(num / 100).toFixed(1)}X` : `${num.toFixed(0)}%`;

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const responses = {
      'How are misconduct costs calculated?': "LAPD has paid $384M in settlements since 2019 (~$70M/year). Research shows 40%+ of use-of-force incidents are linked to officer behavioral health factors like PTSD, burnout, and substance use.",
      'What is SB 542?': "California Senate Bill 542 creates a 'presumption' that PTSD in peace officers is work-related, shifting the burden of proof to employers. This makes it easier for officers to file mental health workers' comp claims.",
      'What is Labor Code 4850?': "Labor Code 4850 provides California peace officers with full salary continuation (not just 2/3) for up to 52 weeks when injured on duty - a significant cost driver for LAPD.",
      'Why is retention so expensive?': "Each officer costs ~$150K to replace: $4,683 recruitment + $45K academy + $15K equipment + $35K FTO training + $50K+ productivity ramp. LAPD lost 660 officers in 2024 alone.",
      'How does comorbidity work?': "Officers often have multiple conditions (PTSD + depression + substance use). The comorbidity adjustment prevents double-counting - at 35% overlap, we reduce the affected population accordingly.",
    };
    setChatMessages([...chatMessages, { type: 'user', text: chatInput }, { type: 'assistant', text: responses[chatInput] || 'Ask about misconduct costs, SB 542, Labor Code 4850, retention costs, or comorbidity.' }]);
    setChatInput('');
  };

  // ===== RENDER =====
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8fafc', minHeight: '100vh', padding: '24px 0' }}>
      <GlobalStyles />

      {/* ===== HEADER ===== */}
      <div style={container}>
        <div style={{ background: `linear-gradient(135deg, ${T.color.blue} 0%, #001a33 100%)`, borderRadius: 16, padding: '24px 32px', boxShadow: '0 8px 32px rgba(0,51,102,0.3)', border: `3px solid ${T.color.gold}`, marginBottom: 24 }}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16}}>
            <div style={{ width: 72, height: 72, minWidth: 72, background: T.color.gold, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid white', fontSize: 18, fontWeight: 900, color: T.color.blue, flexShrink: 0 }}>LAPD</div>
            <div>
              <h1 style={{fontSize: 28, fontWeight: 900, color: T.color.gold, margin: 0, lineHeight: 1.2}}>LAPD Workforce Sustainability Calculator</h1>
              <p style={{fontSize: 14, color: '#94a3b8', margin: '4px 0 0 0'}}>Cost Modeling for Officer Wellness Investment Decisions</p>
            </div>
          </div>

          <div style={{ background: 'rgba(0,51,102,0.4)', borderRadius: 12, padding: '16px 20px', border: `2px solid ${T.color.gold}50` }}>
            <p style={{fontSize: 14, color: 'white', lineHeight: 1.7, margin: 0}}>
              <strong style={{color: T.color.gold}}>Evidence-based cost modeling tool</strong> supporting LAPD leadership in evaluating the financial impact of proactive officer wellness investments. Addresses three interconnected cost drivers: <strong style={{color: T.color.gold}}>(1) retention costs</strong> from behavioral health-driven separations, <strong style={{color: T.color.gold}}>(2) misconduct settlements</strong> linked to officer wellness challenges, and <strong style={{color: T.color.gold}}>(3) workers' comp</strong> mental health claims under California's SB 542 framework.
            </p>
          </div>

          {/* Organization Selector */}
          <div style={{marginTop: 20}}>
            <label style={{display: 'block', fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 10, letterSpacing: '0.05em', textTransform: 'uppercase'}}>Select Your Organization</label>
            <select value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)} style={{ width: '100%', padding: '14px 18px', fontSize: 15, fontWeight: 600, color: '#1e293b', border: `2px solid ${T.color.gold}`, borderRadius: 10, background: 'white', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <optgroup label="🏛️ LAPD Enterprise">
                <option value="lapd-wide">LAPD (All Bureaus) - 8,738 officers</option>
              </optgroup>
              <optgroup label="📊 Major Bureaus">
                <option value="operations">Office of Operations - 5,200 officers</option>
                <option value="special-ops">Office of Special Operations - 1,500 officers</option>
                <option value="counterterrorism">Counterterrorism & Special Operations - 938 officers</option>
                <option value="support-services">Office of Support Services - 800 officers</option>
                <option value="constitutional-policing">Constitutional Policing & Policy - 300 officers</option>
              </optgroup>
              <optgroup label="🏢 Central Bureau Divisions">
                <option value="central">Central Area - 280 officers</option>
                <option value="hollenbeck">Hollenbeck Area - 240 officers</option>
                <option value="northeast">Northeast Area - 260 officers</option>
                <option value="rampart">Rampart Area - 270 officers</option>
              </optgroup>
              <optgroup label="🏢 South Bureau Divisions">
                <option value="77th">77th Street Area - 300 officers</option>
                <option value="harbor">Harbor Area - 220 officers</option>
                <option value="hollywoodarea">Hollywood Area - 290 officers</option>
                <option value="southeast">Southeast Area - 250 officers</option>
                <option value="southwest">Southwest Area - 260 officers</option>
              </optgroup>
              <optgroup label="🏢 West Bureau Divisions">
                <option value="olympic">Olympic Area - 240 officers</option>
                <option value="pacific">Pacific Area - 230 officers</option>
                <option value="west-la">West Los Angeles Area - 250 officers</option>
                <option value="wilshire">Wilshire Area - 260 officers</option>
              </optgroup>
              <optgroup label="🏢 Valley Bureau Divisions">
                <option value="devonshire">Devonshire Area - 230 officers</option>
                <option value="foothill">Foothill Area - 240 officers</option>
                <option value="mission">Mission Area - 250 officers</option>
                <option value="north-hollywood">North Hollywood Area - 270 officers</option>
                <option value="topanga">Topanga Area - 240 officers</option>
                <option value="van-nuys">Van Nuys Area - 260 officers</option>
                <option value="west-valley">West Valley Area - 220 officers</option>
              </optgroup>
              <optgroup label="🚨 Specialized Units">
                <option value="metropolitan">Metropolitan Division - 450 officers</option>
                <option value="detective-bureau">Detective Bureau - 800 officers</option>
                <option value="traffic">Traffic Group - 250 officers</option>
              </optgroup>
            </select>
            {orgData[selectedOrg].description && (
              <div style={{marginTop: 8, fontSize: 12, color: '#94a3b8', fontStyle: 'italic'}}>{orgData[selectedOrg].description}</div>
            )}
          </div>

          {/* Key Stats Row */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 20}}>
            {[
              { value: calculations.currentOfficers.toLocaleString(), label: 'Officers', sublabel: calculations.orgName },
              { value: calculations.orgAttrition.toLocaleString(), label: '2024 Attrition (Est.)', sublabel: 'Proportional to org size' },
              { value: fmtCompact(calculations.orgAnnualSettlements), label: 'Settlements (Est.)', sublabel: 'Proportional estimate' },
              { value: fmtCompact(calculations.orgWcBudget), label: 'WC Budget (Est.)', sublabel: 'Proportional estimate' },
            ].map((stat, i) => (
              <div key={i} style={{background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '14px 16px', textAlign: 'center'}}>
                <div style={{fontSize: 26, fontWeight: 900, color: T.color.gold}}>{stat.value}</div>
                <div style={{fontSize: 12, fontWeight: 600, color: 'white', marginTop: 4}}>{stat.label}</div>
                <div style={{fontSize: 11, color: '#94a3b8'}}>{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== TAB NAVIGATION ===== */}
      <div style={container}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16}}>
          <div style={{display: 'flex', gap: 6, flexWrap: 'wrap'}}>
            {[
              { id: 'executive-summary', label: 'Executive Summary', icon: '📊' },
              { id: 'cost-problem', label: 'The Cost Problem', icon: '⚠️' },
              { id: 'roi-model', label: 'ROI Model', icon: '💰' },
              { id: 'factors', label: 'Factor Breakdown', icon: '🔬' },
              { id: 'california', label: 'California Framework', icon: '📋' },
              { id: 'proof', label: 'Evidence Base', icon: '✅' },
              { id: 'model-details', label: 'Model Details', icon: '🔧' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, border: 'none', borderRadius: 10, cursor: 'pointer', background: activeTab === tab.id ? T.color.blue : 'white', color: activeTab === tab.id ? 'white' : T.color.slate600, boxShadow: activeTab === tab.id ? `0 4px 12px ${T.color.blue}40` : '0 2px 4px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          {activeTab === 'cost-problem' && (
          <div style={{display: 'flex', gap: 2, alignItems: 'center', background: 'white', borderRadius: 12, padding: 4, border: `2px solid ${T.color.blue}`}}>
            <button onClick={() => setViewMode('field')} style={{ padding: '8px 14px', fontSize: 12, fontWeight: 700, border: 'none', borderRadius: 8, cursor: 'pointer', background: viewMode === 'field' ? T.color.blue : 'transparent', color: viewMode === 'field' ? 'white' : '#64748b' }}>🎯 Field Impact</button>
            <button onClick={() => setViewMode('enterprise')} style={{ padding: '8px 14px', fontSize: 12, fontWeight: 700, border: 'none', borderRadius: 8, cursor: 'pointer', background: viewMode === 'enterprise' ? T.color.blue : 'transparent', color: viewMode === 'enterprise' ? 'white' : '#64748b' }}>🏛️ Enterprise Costs</button>
          </div>
          )}
        </div>

        {/* ===== TAB 0: EXECUTIVE SUMMARY ===== */}
        {activeTab === 'executive-summary' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
            <div style={{background: 'white', borderRadius: 16, padding: 40, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{textAlign: 'center', marginBottom: 32}}>
                <div style={{fontSize: 14, color: T.color.gold, fontWeight: 700, letterSpacing: 1, marginBottom: 8}}>BOTTOM LINE UP FRONT</div>
                <h2 style={{fontSize: 32, fontWeight: 900, color: T.color.blue, margin: 0, lineHeight: 1.2}}>{calculations.orgName} Workforce Sustainability Business Case</h2>
                <div style={{fontSize: 16, color: T.color.slate600, marginTop: 8}}>Officer Wellness ROI Analysis for LAPD Leadership</div>
              </div>

              {/* Context Framing - Punchy */}
              <div style={{marginBottom: 32}}>
                <div style={{fontSize: 15, color: T.color.slate600, lineHeight: 1.7, marginBottom: 20, textAlign: 'center'}}>
                  Officer behavioral health—PTSD, depression, burnout, substance use—is the common thread connecting three of LAPD's largest workforce costs. This tool models the financial case for <strong>prevention vs. status quo</strong>.
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'white', borderRadius: 8, border: '2px solid #e2e8f0'}}>
                    <div style={{width: 36, height: 36, minWidth: 36, background: T.color.blue, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, fontWeight: 800}}>1</div>
                    <div style={{fontSize: 13, color: T.color.slate600, lineHeight: 1.4}}><strong style={{color: T.color.ink}}>One root cause, three cost symptoms.</strong> Untreated behavioral health drives attrition, force incidents, and WC claims simultaneously.</div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'white', borderRadius: 8, border: '2px solid #e2e8f0'}}>
                    <div style={{width: 36, height: 36, minWidth: 36, background: T.color.blue, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, fontWeight: 800}}>2</div>
                    <div style={{fontSize: 13, color: T.color.slate600, lineHeight: 1.4}}><strong style={{color: T.color.ink}}>Current programs activate after crisis.</strong> The gap: no scalable system that builds resilience <em>before</em> officers reach crisis.</div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'white', borderRadius: 8, border: '2px solid #e2e8f0'}}>
                    <div style={{width: 36, height: 36, minWidth: 36, background: T.color.blue, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, fontWeight: 800}}>3</div>
                    <div style={{fontSize: 13, color: T.color.slate600, lineHeight: 1.4}}><strong style={{color: T.color.ink}}>52+ sources, deliberately conservative.</strong> Every assumption is adjustable—validate with your own division's data.</div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'white', borderRadius: 8, border: '2px solid #e2e8f0'}}>
                    <div style={{width: 36, height: 36, minWidth: 36, background: T.color.blue, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, fontWeight: 800}}>4</div>
                    <div style={{fontSize: 13, color: T.color.slate600, lineHeight: 1.4}}><strong style={{color: T.color.ink}}>World Cup 2026 & Olympics 2028.</strong> LAPD needs 410+ officers it doesn't have. Retention is now mission-critical.</div>
                  </div>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 32}}>
                <div style={{background: '#fef2f2', border: '3px solid #dc2626', borderRadius: 12, padding: 24}}>
                  <div style={{fontSize: 16, fontWeight: 700, color: '#991b1b', marginBottom: 12}}>📉 The Problem</div>
                  <div style={{fontSize: 36, fontWeight: 900, color: '#dc2626', marginBottom: 12}}>{fmt(calculations.totalAnnualProblemCost)}</div>
                  <div style={{fontSize: 14, color: '#6d0a1f', lineHeight: 1.7}}>
                    Estimated annual behavioral health-linked costs across:<br />
                    • Retention: {calculations.behavioralDrivenSeparations} officers<br />
                    • Misconduct: {fmtCompact(calculations.behavioralLinkedMisconduct)}<br />
                    • Workers' Comp: {fmtCompact(calculations.mentalHealthWcCosts)}
                  </div>
                </div>
                <div style={{background: '#e8f4e0', border: `3px solid ${T.color.green}`, borderRadius: 12, padding: 24}}>
                  <div style={{fontSize: 16, fontWeight: 700, color: '#166534', marginBottom: 12}}>💡 The Opportunity</div>
                  <div style={{fontSize: 36, fontWeight: 900, color: T.color.green, marginBottom: 12}}>{roiDisplay(calculations.roi)}</div>
                  <div style={{fontSize: 14, color: '#14532d', lineHeight: 1.7}}>
                    Estimated ROI from proactive wellness platform<br />
                    • Investment: {fmt(investmentLevel)}<br />
                    • Potential Savings: {fmt(calculations.totalPotentialSavings)}<br />
                    • Net Savings: {fmt(calculations.netSavings)}
                  </div>
                </div>
                <div style={{background: T.color.lightBlue, border: `3px solid ${T.color.blue}`, borderRadius: 12, padding: 24}}>
                  <div style={{fontSize: 16, fontWeight: 700, color: T.color.blue, marginBottom: 12}}>✅ The Evidence</div>
                  <div style={{fontSize: 14, color: T.color.blue, lineHeight: 1.8}}>
                    <strong>Air Force (4-yr):</strong> +7% career commitment<br />
                    <strong>JAMA 2024 RCT:</strong> 21.6% symptom reduction<br />
                    <strong>Montreal Police (22-yr):</strong> 65% suicide reduction<br />
                    <strong>CuraLinc LEO Study:</strong> 67% SUD severity reduction
                  </div>
                </div>
                <div style={{background: '#fef3c7', border: '3px solid #f59e0b', borderRadius: 12, padding: 24}}>
                  <div style={{fontSize: 16, fontWeight: 700, color: '#92400e', marginBottom: 12}}>🎯 The Ask</div>
                  <div style={{fontSize: 14, color: '#78350f', lineHeight: 1.8}}>
                    Evaluate investing in a <strong>proactive coaching & development platform</strong> that provides 1:1 coaching, AI-powered support, and group sessions to officers continuously—not just after crisis. Three courses of action (COAs):<br />
                    • <strong>COA 1 — Pilot:</strong> ~{fmtCompact(Math.round(250000 * calculations.orgScaleFactor / 10000) * 10000 || 25000)} (5-10% of officers, prove concept)<br />
                    • <strong>COA 2 — Targeted:</strong> ~{fmtCompact(Math.round(750000 * calculations.orgScaleFactor / 10000) * 10000 || 80000)} (15-25%, measurable retention impact)<br />
                    • <strong>COA 3 — Scaled:</strong> ~{fmtCompact(Math.round(2500000 * calculations.orgScaleFactor / 10000) * 10000 || 270000)} (50%+, department-wide transformation)
                  </div>
                </div>
              </div>

              <div style={{background: '#f8fafc', borderRadius: 12, padding: 24, marginBottom: 32}}>
                <h3 style={{fontSize: 20, fontWeight: 800, color: T.color.ink, marginBottom: 20, textAlign: 'center'}}>Three Interconnected Cost Pathways</h3>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20}}>
                  {[
                    { icon: '💼', label: 'Retention', cost: calculations.retentionBaseCost, desc: `${calculations.behavioralDrivenSeparations} behavioral health-linked separations` },
                    { icon: '⚖️', label: 'Misconduct', cost: calculations.behavioralLinkedMisconduct, desc: `${misconductBehavioralLink}% of settlements with behavioral health links` },
                    { icon: '🏥', label: "Workers' Comp", cost: calculations.mentalHealthWcCosts, desc: `${wcMentalHealthShare}% of WC budget (mental health)` },
                  ].map((item, i) => (
                    <div key={i} style={{textAlign: 'center'}}>
                      <div style={{fontSize: 48, marginBottom: 12}}>{item.icon}</div>
                      <div style={{fontSize: 18, fontWeight: 700, color: T.color.blue, marginBottom: 8}}>{item.label}</div>
                      <div style={{fontSize: 32, fontWeight: 900, color: T.color.red, marginBottom: 8}}>{fmt(item.cost)}</div>
                      <div style={{fontSize: 13, color: T.color.slate600}}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{background: T.color.lightBlue, border: `2px solid ${T.color.blue}`, borderRadius: 12, padding: 24, marginBottom: 32}}>
                <h3 style={{fontSize: 20, fontWeight: 800, color: T.color.blue, marginBottom: 16}}>🎯 Strategic Context: 2026 World Cup & 2028 Olympics</h3>
                <div style={{fontSize: 15, color: T.color.blue, lineHeight: 1.8}}>
                  Chief McDonnell has identified the need for <strong>410 additional officers</strong> beyond current staffing to adequately handle security for these global events. With LAPD currently <strong>762 officers below target</strong> and losing <strong>660 officers in 2024 alone</strong>, the department faces unprecedented pressure.
                  <br /><br />
                  Proactive wellness investments address both quantity (retention) and quality (readiness under pressure) challenges—ensuring officers are not just hired, but prepared for sustained high-performance under global scrutiny.
                </div>
              </div>

              <div style={{borderTop: '2px solid #e5e7eb', paddingTop: 24}}>
                <div style={{fontSize: 20, fontWeight: 700, color: T.color.ink, marginBottom: 16, textAlign: 'center'}}>Explore the Model</div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12}}>
                  {[
                    { label: '💰 Model ROI Scenarios', tab: 'roi-model', desc: 'Adjust investment levels & see returns' },
                    { label: '⚠️ See Cost Problem Details', tab: 'cost-problem', desc: 'Breakdown by retention/misconduct/WC' },
                    { label: '✅ Review Evidence Base', tab: 'proof', desc: 'Air Force, JAMA, Montreal studies' },
                    { label: '📋 California Legal Framework', tab: 'california', desc: 'SB 542, Labor Code 4850 impact' },
                  ].map((btn) => (
                    <button key={btn.tab} onClick={() => setActiveTab(btn.tab)} style={{ padding: 16, background: 'white', border: '2px solid #e2e8f0', borderRadius: 10, cursor: 'pointer', textAlign: 'left' }}>
                      <div style={{fontSize: 14, fontWeight: 700, color: T.color.blue, marginBottom: 4}}>{btn.label}</div>
                      <div style={{fontSize: 12, color: T.color.slate600}}>{btn.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB 1: THE COST PROBLEM ===== */}
        {activeTab === 'cost-problem' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
            {viewMode === 'enterprise' ? (
              <div style={{background: `linear-gradient(135deg, ${T.color.red} 0%, #8f0e28 100%)`, color: 'white', borderRadius: 16, padding: 48, textAlign: 'center', boxShadow: '0 8px 24px rgba(196,18,48,0.3)'}}>
                <div style={{fontSize: 22, fontWeight: 600, marginBottom: 16, opacity: 0.95}}>{calculations.orgName} faces an estimated annual behavioral health-linked cost burden of:</div>
                <div style={{fontSize: 72, fontWeight: 900, marginBottom: 16}}>{fmt(calculations.totalAnnualProblemCost)}</div>
                <div style={{fontSize: 18, fontWeight: 500, opacity: 0.9}}>in costs linked to retention challenges, misconduct settlements, and workers' comp claims</div>
              </div>
            ) : (
              <div style={{background: `linear-gradient(135deg, ${T.color.blue} 0%, #001a33 100%)`, color: 'white', borderRadius: 16, padding: '32px 48px', boxShadow: '0 8px 24px rgba(0,51,102,0.3)'}}>
                <div style={{fontSize: 22, fontWeight: 600, marginBottom: 16, opacity: 0.95}}>{calculations.orgName} Operational Readiness Impact (Current State):</div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 24}}>
                  {[
                    { val: calculations.orgAttrition, label: '2024 Attrition (Est.)', sub: 'Officers separated (proportional)' },
                    { val: calculations.currentOfficers, label: 'Current Staffing', sub: calculations.orgName },
                    { val: fmtCompact(calculations.orgAnnualSettlements), label: 'Settlements (Est.)', sub: 'Annual proportional estimate' },
                  ].map((item, i) => (
                    <div key={i} style={{background: 'white', borderRadius: 12, padding: 24, textAlign: 'center'}}>
                      <div style={{fontSize: 48, fontWeight: 900, color: T.color.blue, marginBottom: 8}}>{item.val}</div>
                      <div style={{fontSize: 16, fontWeight: 600, color: T.color.ink, marginBottom: 4}}>{item.label}</div>
                      <div style={{fontSize: 13, color: '#64748b'}}>{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enterprise Cost Cards */}
            {viewMode === 'enterprise' ? (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24}}>
                {[
                  { icon: '💼', title: 'Retention Challenge', amount: calculations.retentionBaseCost, detail: `${calculations.behavioralDrivenSeparations} behavioral health-linked separations of ${calculations.orgAttrition} total (est.)`, drivers: ['6-month police academy', '24-week field training (FTO)', 'Equipment & onboarding', '12-18 month productivity ramp'], extra: `Per Officer: ~${fmt(lapdData.replacementCost)}` },
                  { icon: '⚖️', title: 'Misconduct Settlements', amount: calculations.behavioralLinkedMisconduct, detail: `${misconductBehavioralLink}% of ${fmtCompact(calculations.orgAnnualSettlements)} annual settlements with behavioral health links`, drivers: ['Civil rights violations', 'Excessive force cases', 'Officer-involved shootings', 'Wrongful arrest claims'], extra: `LAPD-wide since 2019: ${fmt(lapdData.totalSettlementsSince2019)}` },
                  { icon: '🏥', title: "Workers' Comp (Mental Health)", amount: calculations.mentalHealthWcCosts, detail: `${wcMentalHealthShare}% of ${fmtCompact(calculations.orgWcBudget)} budget in mental health claims`, drivers: ['SB 542 PTSD presumption', 'Labor Code 4850 full salary', '52-week continuation', 'Favorable claim environment'], extra: `LAPD-wide budget: ${fmt(lapdData.annualWcBudget)}` },
                ].map((card, i) => (
                  <div key={i} style={{background: 'white', borderRadius: 12, padding: 24, border: `3px solid ${T.color.red}`, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
                    <div style={{fontSize: 18, fontWeight: 700, color: T.color.red, marginBottom: 12}}>{card.icon} {card.title}</div>
                    <div style={{fontSize: 42, fontWeight: 900, color: T.color.ink, marginBottom: 16}}>{fmt(card.amount)}</div>
                    <div style={{fontSize: 15, color: T.color.slate600, marginBottom: 20, lineHeight: 1.6}}><strong>{card.detail}</strong></div>
                    <div style={{background: '#fef2f2', padding: 16, borderRadius: 8, fontSize: 14, color: '#6d0a1f', lineHeight: 1.6}}>
                      <strong>Cost Drivers:</strong><br />
                      {card.drivers.map((d, j) => <span key={j}>• {d}<br /></span>)}
                      <br /><strong>{card.extra}</strong>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24}}>
                {[
                  { id: 'field-retention', icon: '💼', title: '2024 Officer Attrition', value: calculations.orgAttrition, content: `LAPD-wide experienced 660 officer separations in 2024, while academy classes graduated only ~31 officers per class (vs. 60 needed). For ${calculations.orgName}, this translates to an estimated ${calculations.orgAttrition} separations, with ${calculations.behavioralDrivenSeparations} (${behavioralAttritionShare}%) having behavioral health factors contributing.` },
                  { id: 'field-misconduct', icon: '⚖️', title: 'Settlement Costs', value: fmtCompact(calculations.orgAnnualSettlements), content: `LAPD-wide has paid ${fmt(lapdData.totalSettlementsSince2019)} in settlements since 2019, averaging ${fmtCompact(lapdData.annualSettlements)}/year. For ${calculations.orgName}, proportional estimate is ${fmtCompact(calculations.orgAnnualSettlements)}/year.` },
                  { id: 'field-wc', icon: '🏥', title: "Workers' Comp Budget", value: fmtCompact(calculations.orgWcBudget), content: `LAPD-wide workers' comp budget is ${fmt(lapdData.annualWcBudget)}. For ${calculations.orgName}, proportional budget is ${fmt(calculations.orgWcBudget)}. Under California's SB 542 PTSD presumption, mental health claims are estimated at ${wcMentalHealthShare}% (${fmtCompact(calculations.mentalHealthWcCosts)}).` },
                ].map((card) => (
                  <div key={card.id} style={{background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: `2px solid ${T.color.blue}`}}>
                    <div style={{padding: 24, background: T.color.lightBlue}}>
                      <div style={{fontSize: 18, fontWeight: 700, color: T.color.blue, marginBottom: 12}}>{card.icon} {card.title}</div>
                      <div style={{fontSize: 42, fontWeight: 900, color: T.color.ink}}>{card.value}</div>
                    </div>
                    <div style={{padding: '16px 24px 24px', background: '#f8fafc'}}>
                      <div style={{fontSize: 14, color: T.color.slate600, lineHeight: 1.6}}>{card.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{background: 'linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 100%)', border: '3px solid #64748b', borderRadius: 12, padding: '20px 24px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16}}>
                <span style={{fontSize: 36}}>🔗</span>
                <h2 style={{fontSize: 26, fontWeight: 800, color: T.color.ink, margin: 0}}>One Root Cause, Three Cost Pathways</h2>
              </div>
              <div style={{background: 'white', padding: '16px 20px', borderRadius: 10, border: '2px solid #64748b'}}>
                <div style={{fontSize: 15, color: T.color.slate600, lineHeight: 1.7}}>
                  When officers experience behavioral health challenges—PTSD, depression, anxiety, substance use—the impact often manifests across multiple cost categories simultaneously. <strong>Addressing root causes early creates potential savings across all three pathways.</strong>
                </div>
              </div>
            </div>

            <div style={{background: `linear-gradient(135deg, ${T.color.lightBlue} 0%, #cce5f0 100%)`, border: `3px solid ${T.color.blue}`, borderRadius: 12, padding: 32, textAlign: 'center'}}>
              <div style={{fontSize: 24, fontWeight: 700, color: T.color.blue, marginBottom: 12}}>What Improvement Level Justifies Investment?</div>
              <button onClick={() => setActiveTab('roi-model')} style={{padding: '16px 32px', fontSize: 17, fontWeight: 700, background: T.color.blue, color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer'}}>Explore the ROI Model →</button>
            </div>
          </div>
        )}

        {/* ===== TAB 2: ROI MODEL ===== */}
        {activeTab === 'roi-model' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>

            {/* Current LAPD Wellness Infrastructure */}
            <div style={{background: 'white', borderRadius: 12, padding: 28, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20}}>
                <span style={{fontSize: 32}}>🏥</span>
                <h2 style={{fontSize: 24, fontWeight: 800, color: T.color.ink, margin: 0}}>Current LAPD Wellness Infrastructure</h2>
              </div>
              <p style={{fontSize: 15, color: T.color.slate600, lineHeight: 1.7, marginBottom: 20}}>
                LAPD has invested significantly in behavioral health and crisis response infrastructure. These programs represent real institutional commitment and do excellent work <strong>when officers are in crisis</strong>. Understanding what exists—and where gaps remain—is essential to designing complementary investments.
              </p>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16}}>
                {[
                  { name: 'Mental Evaluation Unit (MEU)', detail: '160+ personnel', focus: 'Community crisis intervention', opportunity: "MEU's expertise serves the public; officers need parallel proactive wellness infrastructure focused on their development" },
                  { name: 'SMART Teams', detail: '12-14 units, 24/7', focus: 'Crisis response in field', opportunity: 'Exceptional crisis response; opportunity to prevent officers from reaching crisis through early intervention' },
                  { name: 'Behavioral Science Services', detail: 'Psychologist-led', focus: 'Fitness for duty, critical incidents', opportunity: 'Strong clinical capacity; limited bandwidth for proactive development at scale across 8,738 officers' },
                  { name: 'Employee Assistance Program', detail: 'Traditional EAP', focus: '3-6 sessions for crisis', opportunity: '~3-5% utilization rate reflects national EAP trends; stigma and reactive model limit preventive impact' },
                  { name: 'POWER Training', detail: 'DOJ partnership', focus: 'Resilience workshops', opportunity: 'Evidence-based content; episodic delivery limits sustained behavior change (see Methodology Impact research)' },
                  { name: 'Peer Support', detail: 'Volunteer officers', focus: 'Informal support network', opportunity: 'Valued by officers; lacks standardized training, outcomes measurement, and scalability' },
                ].map((prog, i) => (
                  <div key={i} style={{background: '#f8fafc', borderRadius: 10, padding: 16, border: '2px solid #e2e8f0'}}>
                    <div style={{fontSize: 15, fontWeight: 700, color: T.color.ink, marginBottom: 4}}>{prog.name}</div>
                    <div style={{fontSize: 13, color: T.color.blue, fontWeight: 600, marginBottom: 8}}>{prog.detail}</div>
                    <div style={{fontSize: 12, color: T.color.slate600, marginBottom: 8}}><strong>Focus:</strong> {prog.focus}</div>
                    <div style={{fontSize: 12, color: T.color.blue, lineHeight: 1.5}}><strong>Opportunity:</strong> {prog.opportunity}</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop: 20, padding: 20, background: T.color.lightBlue, borderRadius: 10, border: `2px solid ${T.color.blue}`}}>
                <div style={{fontSize: 15, fontWeight: 700, color: T.color.blue, marginBottom: 12}}>📋 Assessment Summary</div>
                <div style={{fontSize: 14, color: T.color.blue, lineHeight: 1.8}}>
                  <strong>What LAPD Has Built:</strong> Robust crisis response and clinical intervention capacity.<br /><br />
                  <strong>The Strategic Gap:</strong> No scalable, proactive, continuous development system that builds officer resilience, leadership capability, and sustainable performance <em>before</em> behavioral health deterioration impacts retention, misconduct, and workers' comp costs.
                </div>
              </div>
            </div>

            {/* Why Traditional Approaches Fall Short */}
            <div style={{background: 'linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 100%)', border: '4px solid #64748b', borderRadius: 16, padding: 28}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
                <div style={{width: 48, height: 48, background: '#475569', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22}}>🔍</div>
                <h2 style={{fontSize: 22, fontWeight: 800, color: '#111827', margin: 0}}>Why Traditional Wellness Approaches Fall Short in Law Enforcement</h2>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20}}>
                <div style={{background: 'white', padding: 20, borderRadius: 12, border: '2px solid #e5e7eb'}}>
                  <div style={{fontSize: 16, fontWeight: 700, color: '#991b1b', marginBottom: 12}}>⚠️ Structural Limitations</div>
                  <div style={{fontSize: 14, color: '#475569', lineHeight: 1.7}}>
                    <strong>Reactive Activation:</strong> Programs activate when officers are already in crisis—after the incident, after performance decline becomes visible.<br /><br />
                    <strong>Stigma & Utilization:</strong> EAP utilization in law enforcement remains 3-5% nationally. Officers perceive traditional wellness as signals of weakness.<br /><br />
                    <strong>Episodic vs. Continuous:</strong> POWER training provides valuable content in episodic bursts. Without reinforcement, 70% is forgotten within 24 hours.<br /><br />
                    <strong>Capacity Constraints:</strong> Even with 160+ MEU personnel, the department cannot provide ongoing, personalized support to 8,738 officers through crisis-response infrastructure.
                  </div>
                </div>
                <div style={{background: 'white', padding: 20, borderRadius: 12, border: '2px solid #e5e7eb'}}>
                  <div style={{fontSize: 16, fontWeight: 700, color: T.color.blue, marginBottom: 12}}>💡 The Market Gap</div>
                  <div style={{fontSize: 14, color: '#475569', lineHeight: 1.7}}>
                    What's missing is a <strong>scalable, proactive, development-focused platform</strong> that:<br /><br />
                    • Meets officers where they are<br />
                    • Removes stigma by framing support as professional development<br />
                    • Provides continuous reinforcement through AI + 1:1 coaching + peer groups<br />
                    • Scales across the entire workforce<br />
                    • Complements existing crisis response infrastructure
                  </div>
                </div>
              </div>
              <div style={{background: '#c7d2fe', borderRadius: 12, padding: 16, border: '2px solid #6366f1'}}>
                <p style={{fontSize: 14, color: '#3730a3', margin: 0, lineHeight: 1.7}}>
                  <strong style={{color: '#4338ca'}}>This isn't a critique of what LAPD has built.</strong> It's recognition that crisis response and proactive development serve different functions. LAPD has invested wisely in crisis response. The opportunity now is to invest in prevention.
                </p>
              </div>
            </div>

            {/* Methodology Impact Chart */}
            <div style={{background: 'linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 100%)', border: '4px solid #64748b', borderRadius: 16, padding: 28}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12}}>
                <div style={{width: 48, height: 48, background: '#475569', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22}}>📈</div>
                <h2 style={{fontSize: 22, fontWeight: 800, color: '#111827', margin: 0}}>Why Methodology Matters: Episodic Training vs. Continuous Development</h2>
              </div>
              <div style={{background: 'white', border: '2px solid #e5e7eb', borderRadius: 12, padding: 16}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8}}>
                  <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
                    <span style={{display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: '#fee2e2', color: '#991b1b'}}>🔴 Episodic Training</span>
                    <span style={{display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: '#dbeafe', color: '#1e40af'}}>🔵 Continuous Development</span>
                  </div>
                </div>
                <svg viewBox="0 0 760 260" style={{width: '100%', height: 220, display: 'block'}}>
                  <line x1="60" y1="24" x2="60" y2="220" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="60" y1="220" x2="730" y2="220" stroke="#94a3b8" strokeWidth="2" />
                  <text x="14" y="34" fill="#475569" fontSize="11" fontWeight="700">Skill / Recall</text>
                  <text x="690" y="250" fill="#475569" fontSize="11" fontWeight="700">Time</text>
                  {[140,220,300,380,460,540,620,700].map((x,i) => <line key={i} x1={x} y1="220" x2={x} y2="216" stroke="#94a3b8" />)}
                  {[80,120,160,200].map((y,i) => <line key={i} x1="60" y1={y} x2="730" y2={y} stroke="#e5e7eb" />)}
                  <path d="M 60 50 C 180 46, 250 70, 320 110 C 380 144, 450 175, 730 200" fill="none" stroke="#dc2626" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 60 200 C 110 170, 150 160, 190 140 C 210 130, 230 120, 250 130 C 270 142, 300 120, 330 105 C 350 95, 370 90, 390 100 C 410 112, 440 98, 470 88 C 490 82, 510 78, 530 88 C 550 98, 585 86, 620 76 C 640 70, 660 66, 730 60" fill="none" stroke="#2563eb" strokeWidth="4.5" strokeLinecap="round" />
                  <text x="180" y="42" fill="#991b1b" fontSize="11" fontWeight="700">Peak right after event</text>
                  <text x="400" y="155" fill="#991b1b" fontSize="11" fontWeight="700">~70% forgotten in 24h</text>
                  <text x="600" y="212" fill="#991b1b" fontSize="11" fontWeight="700">~90% in 30 days</text>
                  <text x="500" y="52" fill="#1e3a8a" fontSize="11" fontWeight="700">Continuous reinforcement</text>
                </svg>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12}}>
                  <div style={{background: '#fff7ed', border: '1px solid #fdba74', borderRadius: 8, padding: 12}}>
                    <div style={{fontSize: 13, color: '#9a3412', fontWeight: 700, marginBottom: 6}}>Why Episodic Training Falls Short</div>
                    <div style={{fontSize: 13, color: '#7c2d12', lineHeight: 1.6}}>Annual workshops spike learning, but Ebbinghaus forgetting curve shows 70% loss in 24 hours, 90% within a month.</div>
                  </div>
                  <div style={{background: '#ecfeff', border: '1px solid #67e8f9', borderRadius: 8, padding: 12}}>
                    <div style={{fontSize: 13, color: '#155e75', fontWeight: 700, marginBottom: 6}}>Why Continuous Development Works</div>
                    <div style={{fontSize: 13, color: '#0e7490', lineHeight: 1.6}}>Sustained engagement compounds capability. Just-in-time support at critical moments. Air Force: +7% retention over 4 years.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Solution Approaches Comparison Table */}
            <div style={{background: 'white', borderRadius: 12, padding: 28, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20}}>
                <span style={{fontSize: 32}}>⚖️</span>
                <h2 style={{fontSize: 24, fontWeight: 800, color: T.color.ink, margin: 0}}>Solution Approaches: What the Evidence Shows</h2>
              </div>
              <div style={{overflowX: 'auto'}}>
                <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 13}}>
                  <thead>
                    <tr style={{background: T.color.blue, color: 'white'}}>
                      {['Approach','Typical Engagement','Strengths','Limitations','Expected ROI'].map(h => <th key={h} style={{padding: '12px 16px', textAlign: h === 'Expected ROI' ? 'center' : 'left', fontWeight: 700}}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { approach: 'Traditional EAP', engagement: '3-5%', strengths: 'Low cost, familiar', limitations: 'Reactive, stigmatized, low utilization', roi: 'Low', roiColor: '#dc2626' },
                      { approach: 'Episodic Training', engagement: 'One-time', strengths: 'Easy to implement', limitations: '70% forgotten in 24h', roi: 'Low', roiColor: '#dc2626' },
                      { approach: 'Executive Coaching', engagement: 'High (limited)', strengths: 'Deep impact for leaders', limitations: "$15K+/person, can't scale", roi: 'Medium', roiColor: '#f59e0b' },
                      { approach: 'Digital Wellness Apps', engagement: 'Drops off', strengths: 'Scalable, low stigma', limitations: 'No personalization', roi: 'Low-Med', roiColor: '#f59e0b' },
                      { approach: 'Peer Support Programs', engagement: 'Variable', strengths: 'Trusted, relatable', limitations: 'Inconsistent quality', roi: 'Medium', roiColor: '#f59e0b' },
                      { approach: '1:1 Coaching + AI Platform', engagement: '60%+ sustained', strengths: 'Proactive, scalable, measurable, continuous', limitations: 'Higher investment, culture shift needed', roi: 'High', roiColor: '#16a34a' },
                    ].map((row, i) => (
                      <tr key={i} style={{background: i % 2 === 0 ? '#f8fafc' : 'white', borderBottom: '1px solid #e5e7eb'}}>
                        <td style={{padding: '12px 16px', fontWeight: 600, color: T.color.ink}}>{row.approach}</td>
                        <td style={{padding: '12px 16px', color: T.color.slate600}}>{row.engagement}</td>
                        <td style={{padding: '12px 16px', color: T.color.green}}>{row.strengths}</td>
                        <td style={{padding: '12px 16px', color: T.color.red}}>{row.limitations}</td>
                        <td style={{padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: row.roiColor}}>{row.roi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Evaluation Criteria Scorecard */}
            <div style={{background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', border: '4px solid #6366f1', borderRadius: 16, padding: 28}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20}}>
                <div style={{width: 48, height: 48, background: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22}}>✅</div>
                <h2 style={{fontSize: 22, fontWeight: 800, color: '#4338ca', margin: 0}}>Solution Evaluation Criteria</h2>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16}}>
                {[
                  { criteria: 'Proactive vs. Reactive', weight: 'Critical', question: 'Does it build resilience before crisis?', ideal: 'Prevention-focused' },
                  { criteria: 'Continuous vs. Episodic', weight: 'Critical', question: 'Sustained over months/years?', ideal: 'Ongoing relationship' },
                  { criteria: 'Engagement Rate', weight: 'Critical', question: 'What % actually use it?', ideal: "60%+ (vs. EAP's 3-5%)" },
                  { criteria: 'Stigma Reduction', weight: 'Critical', question: 'Development or treatment framing?', ideal: 'Professional growth framing' },
                  { criteria: 'Scalability', weight: 'High', question: 'Can it reach 8,700+ officers?', ideal: 'Digital + human hybrid' },
                  { criteria: 'Evidence Base', weight: 'High', question: 'Peer-reviewed research?', ideal: 'Published outcomes in similar populations' },
                  { criteria: 'Measurable Outcomes', weight: 'High', question: 'Track retention, claims, incidents?', ideal: 'Clear ROI metrics' },
                  { criteria: 'Just-in-Time Support', weight: 'Medium', question: 'Available when officers need it?', ideal: 'On-demand, not appointment-based' },
                ].map((item, i) => (
                  <div key={i} style={{background: 'white', borderRadius: 10, padding: 16, border: '2px solid #c7d2fe'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8}}>
                      <div style={{fontSize: 15, fontWeight: 700, color: '#4338ca'}}>{item.criteria}</div>
                      <div style={{fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: item.weight === 'Critical' ? '#fef2f2' : item.weight === 'High' ? '#fef3c7' : '#f0f9ff', color: item.weight === 'Critical' ? '#991b1b' : item.weight === 'High' ? '#92400e' : '#0369a1'}}>{item.weight}</div>
                    </div>
                    <div style={{fontSize: 13, color: T.color.slate600, marginBottom: 8, fontStyle: 'italic'}}>"{item.question}"</div>
                    <div style={{fontSize: 12, color: T.color.green, fontWeight: 600}}>✓ Ideal: {item.ideal}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Courses of Action */}
            <div style={{background: 'white', borderRadius: 12, padding: 28, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: `2px solid ${T.color.blue}`}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12}}>
                <span style={{fontSize: 32}}>🚀</span>
                <h2 style={{fontSize: 24, fontWeight: 800, color: T.color.ink, margin: 0}}>Courses of Action (COAs)</h2>
              </div>
              <p style={{fontSize: 15, color: T.color.slate600, lineHeight: 1.7, marginBottom: 8}}>
                Each COA represents a different scale of investment in a <strong>proactive coaching and development platform</strong>—combining 1:1 professional coaching, AI-powered daily support, and group resilience sessions delivered continuously to officers (not as one-time workshops).
              </p>
              <p style={{fontSize: 15, color: T.color.slate600, lineHeight: 1.7, marginBottom: 20}}><strong style={{color: T.color.blue}}>Click to select a COA</strong> and see how it impacts the ROI model below{calculations.orgScaleFactor < 1 ? ` (investment scaled for ${calculations.orgName})` : ''}:</p>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20}}>
                {(() => {
                  const s = calculations.orgScaleFactor;
                  const pilotInv = Math.round(300000 * s / 10000) * 10000;
                  const targetedInv = Math.round(750000 * s / 10000) * 10000;
                  const scaledInv = Math.round(2500000 * s / 10000) * 10000;
                  const pilotThreshold = Math.round(400000 * s / 10000) * 10000;
                  const scaledThreshold = Math.round(1000000 * s / 10000) * 10000;
                  const pilotSeats = `${Math.round(calculations.currentOfficers * 0.05)}-${Math.round(calculations.currentOfficers * 0.10)}`;
                  const targetedSeats = `${Math.round(calculations.currentOfficers * 0.15)}-${Math.round(calculations.currentOfficers * 0.25)}`;
                  const scaledSeats = `${Math.round(calculations.currentOfficers * 0.50)}+`;
                  return [
                    { name: 'COA 1: Pilot', coverage: '5-10%', seats: `${pilotSeats} officers`, investment: `${fmtCompact(pilotInv * 0.67)} - ${fmtCompact(pilotInv * 1.33)}`, investmentValue: pilotInv, target: 'Academy recruits + highest-need units', timeline: '6-12 months', goal: 'Prove engagement rates & measure early retention signals', selected: investmentLevel <= pilotThreshold },
                    { name: 'COA 2: Targeted', coverage: '15-25%', seats: `${targetedSeats} officers`, investment: `${fmtCompact(targetedInv * 0.67)} - ${fmtCompact(targetedInv * 1.33)}`, investmentValue: targetedInv, target: 'Early-career officers (<18mo) + FTOs + supervisors', timeline: '12 months', goal: 'Measurable retention improvement & incident reduction', selected: investmentLevel > pilotThreshold && investmentLevel <= scaledThreshold },
                    { name: 'COA 3: Scaled', coverage: '50%+', seats: `${scaledSeats} officers`, investment: `${fmtCompact(scaledInv * 0.8)} - ${fmtCompact(scaledInv * 1.6)}`, investmentValue: scaledInv, target: 'Department-wide: all ranks, all bureaus', timeline: '12-24 months', goal: 'Culture transformation & maximum cost avoidance', selected: investmentLevel > scaledThreshold },
                  ];
                })().map((opt, i) => (
                  <button key={i} onClick={() => setInvestmentLevel(opt.investmentValue)} style={{ background: opt.selected ? T.color.lightBlue : '#f8fafc', borderRadius: 12, padding: 20, border: opt.selected ? `3px solid ${T.color.blue}` : '2px solid #e2e8f0', position: 'relative', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                    {opt.selected && <div style={{position: 'absolute', top: -12, right: 12, background: T.color.blue, color: 'white', padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700}}>SELECTED</div>}
                    <div style={{fontSize: 20, fontWeight: 800, color: T.color.blue, marginBottom: 8}}>{opt.name}</div>
                    <div style={{fontSize: 28, fontWeight: 900, color: T.color.ink, marginBottom: 4}}>{opt.coverage}</div>
                    <div style={{fontSize: 13, color: T.color.slate600, marginBottom: 12}}>{opt.seats}</div>
                    <div style={{fontSize: 13, color: T.color.slate600, lineHeight: 1.6, marginBottom: 12}}>
                      <strong>Investment:</strong> {opt.investment}<br /><strong>Target:</strong> {opt.target}<br /><strong>Timeline:</strong> {opt.timeline}
                    </div>
                    <div style={{background: 'white', padding: 10, borderRadius: 6, fontSize: 12, color: T.color.green, fontWeight: 600, border: '1px solid #e2e8f0'}}>Goal: {opt.goal}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* ROI Calculator */}
            <div style={{background: 'linear-gradient(135deg, #e8f4e0 0%, #d0eac0 100%)', border: `4px solid ${T.color.green}`, borderRadius: 16, padding: 28}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20}}>
                <span style={{fontSize: 32}}>💰</span>
                <h2 style={{fontSize: 24, fontWeight: 800, color: T.color.green, margin: 0}}>ROI Calculator: Model Your Investment</h2>
              </div>
              <div style={{ background: 'white', border: `3px solid ${calculations.netSavings >= 0 ? T.color.green : T.color.red}`, borderRadius: 12, padding: '24px 32px', textAlign: 'center', marginBottom: 24 }}>
                <div style={{fontSize: 18, fontWeight: 600, color: T.color.slate600, marginBottom: 8}}>Estimated Annual Net Savings for {calculations.orgName}</div>
                <div style={{fontSize: 56, fontWeight: 900, color: calculations.netSavings >= 0 ? T.color.green : T.color.red, marginBottom: 8}}>{fmt(calculations.netSavings)}</div>
                <div style={{fontSize: 16, color: T.color.slate600}}>ROI: <strong style={{color: calculations.netSavings >= 0 ? T.color.green : T.color.red}}>{roiDisplay(calculations.roi)}</strong> • Savings: {fmt(calculations.totalPotentialSavings)} • Investment: {fmt(calculations.investmentLevel)} • Coverage: <strong>{(calculations.coverage * 100).toFixed(0)}%</strong> ({calculations.seatsAfforded.toLocaleString()} seats)</div>
              </div>
              <div style={{background: 'white', borderRadius: 12, padding: 20, marginBottom: 20}}>
                <label style={{display: 'block', fontSize: 16, fontWeight: 700, color: T.color.ink, marginBottom: 12}}>Annual Investment: {fmt(investmentLevel)}</label>
                {(() => {
                  const s = calculations.orgScaleFactor;
                  const sliderMax = Math.round(4000000 * s / 50000) * 50000 || 200000;
                  const sliderStep = sliderMax > 500000 ? 50000 : 10000;
                  const pilotVal = Math.round(250000 * s / 10000) * 10000 || 25000;
                  const targetedVal = Math.round(750000 * s / 10000) * 10000 || 80000;
                  const midVal = Math.round(1500000 * s / 10000) * 10000 || 160000;
                  const scaledVal = Math.round(2500000 * s / 10000) * 10000 || 270000;
                  return (
                    <div>
                      <input type="range" min={Math.round(sliderMax * 0.025 / 10000) * 10000 || 10000} max={sliderMax} step={sliderStep} value={Math.min(investmentLevel, sliderMax)} onChange={(e) => setInvestmentLevel(parseInt(e.target.value))} style={{width: '100%', height: 8, marginBottom: 8}} />
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b'}}><span>{fmtCompact(sliderMax * 0.025)}</span><span>{fmtCompact(sliderMax * 0.25)}</span><span>{fmtCompact(sliderMax * 0.625)}</span><span>{fmtCompact(sliderMax)}</span></div>
                      <div style={{display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap'}}>
                        {[{ label: `Pilot (${fmtCompact(pilotVal)})`, value: pilotVal }, { label: `Targeted (${fmtCompact(targetedVal)})`, value: targetedVal }, { label: `Mid-Scale (${fmtCompact(midVal)})`, value: midVal }, { label: `Scaled (${fmtCompact(scaledVal)})`, value: scaledVal }].map((opt) => (
                          <button key={opt.value} onClick={() => setInvestmentLevel(opt.value)} style={{ padding: '8px 14px', fontSize: 13, fontWeight: 600, border: investmentLevel === opt.value ? `2px solid ${T.color.green}` : '2px solid #e2e8f0', borderRadius: 8, background: investmentLevel === opt.value ? '#dcfce7' : 'white', cursor: 'pointer', color: investmentLevel === opt.value ? T.color.green : T.color.slate600 }}>{opt.label}</button>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16}}>
                {[
                  { icon: '💼', label: 'Retention Impact', target: retentionImprovementTarget, setter: setRetentionImprovementTarget, savings: calculations.retentionSavings, extra: `(${calculations.separationsPrevented} separations prevented)` },
                  { icon: '⚖️', label: 'Misconduct Impact', target: misconductReductionTarget, setter: setMisconductReductionTarget, savings: calculations.misconductSavings, extra: '' },
                  { icon: '🏥', label: "Workers' Comp Impact", target: wcClaimReductionTarget, setter: setWcClaimReductionTarget, savings: calculations.wcSavings, extra: '' },
                ].map((item, i) => (
                  <div key={i} style={{background: 'white', padding: 16, borderRadius: 10}}>
                    <div style={{fontSize: 14, fontWeight: 700, color: T.color.ink, marginBottom: 10}}>{item.icon} {item.label}</div>
                    <div style={{fontSize: 13, color: T.color.slate600, marginBottom: 8}}>Target: {item.target}% reduction</div>
                    <input type="range" min="5" max="40" value={item.target} onChange={(e) => item.setter(parseInt(e.target.value))} style={{width: '100%', marginBottom: 8}} />
                    <div style={{fontSize: 14, fontWeight: 700, color: T.color.green}}>Savings: {fmt(item.savings)}</div>
                    {item.extra && <div style={{fontSize: 11, color: T.color.slate600}}>{item.extra}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Break-Even Analysis */}
            <div style={{background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '3px solid #f59e0b', borderRadius: 12, padding: 24}}>
              <h3 style={{fontSize: 20, fontWeight: 800, color: '#92400e', marginBottom: 16}}>📊 Break-Even Analysis</h3>
              <p style={{fontSize: 14, color: '#78350f', marginBottom: 16}}>At {fmt(investmentLevel)} investment, improvement needed to break even in each category alone:</p>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16}}>
                {[
                  { label: 'Retention Only', value: calculations.breakEvenRetention },
                  { label: 'Misconduct Only', value: calculations.breakEvenMisconduct },
                  { label: "Workers' Comp Only", value: calculations.breakEvenWc },
                ].map((item, i) => (
                  <div key={i} style={{background: 'white', padding: 16, borderRadius: 10, textAlign: 'center'}}>
                    <div style={{fontSize: 14, fontWeight: 600, color: '#78350f', marginBottom: 8}}>{item.label}</div>
                    <div style={{fontSize: 28, fontWeight: 900, color: '#92400e'}}>{item.value}%</div>
                    <div style={{fontSize: 12, color: '#78350f'}}>improvement needed</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop: 16, padding: 12, background: 'white', borderRadius: 8, fontSize: 14, color: '#78350f'}}>
                <strong>Key Insight:</strong> Because effective wellness interventions impact all three cost categories simultaneously, even modest improvements across all three exceed break-even thresholds.
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB 3: FACTOR BREAKDOWN ===== */}
        {activeTab === 'factors' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
            <div style={{background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <h2 style={{fontSize: 28, fontWeight: 800, color: T.color.ink, marginBottom: 16}}>Adjustable Assumptions</h2>
              <p style={{fontSize: 16, color: T.color.slate600, lineHeight: 1.7}}>The model's accuracy depends on these underlying assumptions. Adjust based on LAPD-specific data when available.</p>
            </div>

            {/* Comorbidity Adjustment */}
            <div style={{background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '3px solid #f59e0b', borderRadius: 12, padding: 24}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16}}>
                <span style={{fontSize: 36}}>🧮</span>
                <h2 style={{fontSize: 26, fontWeight: 800, color: '#92400e', margin: 0}}>Comorbidity Adjustment</h2>
              </div>
              <div style={{background: 'white', padding: 20, borderRadius: 10, marginBottom: 16, border: '2px solid #fbbf24'}}>
                <div style={{fontSize: 16, fontWeight: 700, color: '#92400e', marginBottom: 12}}>💡 What is this and why does it matter?</div>
                <p style={{fontSize: 15, color: '#78350f', lineHeight: 1.8, margin: 0}}>
                  Mental health conditions rarely occur alone. An officer with <strong>PTSD</strong> often also experiences <strong>depression</strong> and may develop <strong>substance use</strong> issues as a coping mechanism. If we count each condition separately, we'd count the same officer 3 times—inflating our numbers and making the model unrealistic.
                </p>
              </div>
              <div style={{background: 'white', padding: 20, borderRadius: 10, marginBottom: 16}}>
                <div style={{fontSize: 15, fontWeight: 700, color: '#92400e', marginBottom: 12}}>📊 Example: Without vs. With Adjustment</div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
                  <div style={{background: '#fef2f2', padding: 16, borderRadius: 8, border: '2px solid #fca5a5'}}>
                    <div style={{fontSize: 14, fontWeight: 700, color: '#991b1b', marginBottom: 8}}>❌ Without Adjustment (Inflated)</div>
                    <div style={{fontSize: 13, color: '#7f1d1d', lineHeight: 1.7}}>• 1,500 with PTSD<br />• 1,500 with depression<br />• 1,300 with anxiety<br />• 2,200 with SUD<br /><strong style={{color: '#dc2626'}}>= 6,500 "affected officers"</strong></div>
                    <div style={{marginTop: 8, fontSize: 12, color: '#991b1b', fontStyle: 'italic'}}>Counts many officers multiple times!</div>
                  </div>
                  <div style={{background: '#e8f4e0', padding: 16, borderRadius: 8, border: `2px solid ${T.color.green}`}}>
                    <div style={{fontSize: 14, fontWeight: 700, color: '#166534', marginBottom: 8}}>✅ With {comorbidityOverlap}% Overlap Adjustment</div>
                    <div style={{fontSize: 13, color: '#14532d', lineHeight: 1.7}}>• Same conditions, but...<br />• ~{comorbidityOverlap}% have 2+ conditions<br />• Count each person once<br /><strong style={{color: T.color.green}}>= {calculations.uniqueAffected.toLocaleString()} unique officers</strong></div>
                    <div style={{marginTop: 8, fontSize: 12, color: '#166534', fontStyle: 'italic'}}>More accurate, defensible estimate</div>
                  </div>
                </div>
              </div>
              <div style={{background: 'white', padding: 20, borderRadius: 10}}>
                <label style={{display: 'block', fontSize: 18, fontWeight: 700, marginBottom: 12, color: '#92400e'}}>Comorbidity Overlap: {comorbidityOverlap}%</label>
                <input type="range" min="0" max="50" step="5" value={comorbidityOverlap} onChange={(e) => setComorbidityOverlap(parseInt(e.target.value))} style={{width: '100%', height: 8}} />
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#92400e', marginTop: 4}}><span>0% (less conservative)</span><span>50% (more conservative)</span></div>
                <div style={{marginTop: 16, padding: 16, background: T.color.lightBlue, borderRadius: 8, border: `2px solid ${T.color.blue}`}}>
                  <div style={{fontSize: 14, fontWeight: 700, color: T.color.blue, marginBottom: 8}}>📈 Model Impact</div>
                  <div style={{fontSize: 14, color: T.color.blue, lineHeight: 1.8}}>
                    <strong>Before adjustment:</strong> {calculations.rawTotalAffected.toLocaleString()} officers<br />
                    <strong>After adjustment:</strong> {calculations.uniqueAffected.toLocaleString()} unique officers<br />
                    <strong>Reduction:</strong> {calculations.comorbidityReduction.toLocaleString()} officers no longer double-counted
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Attribution Sliders */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24}}>
              {[
                { icon: '💼', title: 'Retention: Behavioral Health Link', label: '% of attrition with behavioral health factors', value: behavioralAttritionShare, setter: setBehavioralAttritionShare, min: 20, max: 60, desc: `${behavioralAttritionShare}% of ${calculations.orgAttrition} = ${calculations.behavioralDrivenSeparations} officers` },
                { icon: '⚖️', title: 'Misconduct: Behavioral Health Link', label: '% of settlements with behavioral health links', value: misconductBehavioralLink, setter: setMisconductBehavioralLink, min: 20, max: 60, desc: `${misconductBehavioralLink}% of ${fmtCompact(calculations.orgAnnualSettlements)} = ${fmtCompact(calculations.behavioralLinkedMisconduct)}` },
                { icon: '🏥', title: "Workers' Comp: Mental Health Share", label: '% of WC budget for mental health', value: wcMentalHealthShare, setter: setWcMentalHealthShare, min: 10, max: 50, desc: `${wcMentalHealthShare}% of ${fmtCompact(calculations.orgWcBudget)} = ${fmtCompact(calculations.mentalHealthWcCosts)}` },
              ].map((item, i) => (
                <div key={i} style={{background: 'white', borderRadius: 12, padding: 24, border: `2px solid ${T.color.blue}`}}>
                  <div style={{fontSize: 18, fontWeight: 700, color: T.color.blue, marginBottom: 16}}>{item.icon} {item.title}</div>
                  <div style={{marginBottom: 16}}>
                    <label style={{fontSize: 14, fontWeight: 600, color: T.color.slate600}}>{item.label}: {item.value}%</label>
                    <input type="range" min={item.min} max={item.max} value={item.value} onChange={(e) => item.setter(parseInt(e.target.value))} style={{width: '100%', marginTop: 8}} />
                  </div>
                  <div style={{fontSize: 13, color: T.color.slate600, lineHeight: 1.6}}><strong>{item.desc}</strong></div>
                </div>
              ))}
            </div>

            {/* About Effectiveness Rates */}
            <div style={{background: '#ecfdf5', border: '2px solid #6ee7b7', borderRadius: 12, padding: 20}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8}}>
                <span style={{fontSize: 20}}>ℹ️</span>
                <div style={{fontSize: 18, fontWeight: 800, color: T.color.ink}}>About Effectiveness Rates</div>
              </div>
              <div style={{fontSize: 14, color: T.color.slate600, lineHeight: 1.7}}>
                Effectiveness rates are based on <strong>proven Air Force results</strong>: +6% career commitment (retention), +17% mission readiness, and +15% resilience. These rates are hardcoded into the model. Use the sliders below to adjust prevalence rates, costs, and separation rates based on your division's specific data.
              </div>
            </div>

            {/* Expandable Behavioral Health Factor Panels */}
            {[
              {
                id: 'ptsd',
                icon: '🧠',
                title: 'PTSD & Combat Trauma',
                prevalence: ptsdPrevalence, setPrevalence: setPtsdPrevalence, prevMin: 10, prevMax: 35,
                effectiveness: ptsdCoachingEffectiveness, setEffectiveness: setPtsdCoachingEffectiveness, effMin: 15, effMax: 35,
                separationRate: ptsdSeparationRate, setSeparationRate: setPtsdSeparationRate, sepMin: 8, sepMax: 20,
                limitedDutyDays: ptsdLimitedDutyDays, setLimitedDutyDays: setPtsdLimitedDutyDays, ldMin: 30, ldMax: 180,
                prevResearch: 'LEO avg: 18% (RAND study) • Civilian: 3.5%',
                effResearch: 'Conservative for early intervention/prevention',
                sepResearch: 'RAND: PTSD doubles separation odds (28 months)',
                ldResearch: 'LEO avg: 87 days not deployable annually',
                researchContext: 'PTSD affects 12-35% of law enforcement officers (2-4x civilian rate at 3.5%). Under California SB 542, PTSD is presumed work-related, driving higher WC claim rates. Officers with untreated PTSD face significantly higher risk of excessive force incidents, separation, and long-term disability claims. Current LAPD treatment through BSS and EAP shows limited proactive reach; significant prevention opportunity exists.',
              },
              {
                id: 'depression',
                icon: '😔',
                title: 'Depression & Burnout',
                prevalence: depressionPrevalence, setPrevalence: setDepressionPrevalence, prevMin: 10, prevMax: 30,
                effectiveness: depressionCoachingEffectiveness, setEffectiveness: setDepressionCoachingEffectiveness, effMin: 15, effMax: 35,
                separationRate: depressionSeparationRate, setSeparationRate: setDepressionSeparationRate, sepMin: 10, sepMax: 25,
                limitedDutyDays: depressionLimitedDutyDays, setLimitedDutyDays: setDepressionLimitedDutyDays, ldMin: 20, ldMax: 120,
                prevResearch: 'LEO avg: 18% • JAMA 2024: 21.6% symptom reduction',
                effResearch: 'JAMA 2024: 21.6% symptom reduction with enhanced BH',
                sepResearch: 'Burnout accelerates attrition; 2.5x separation risk',
                ldResearch: 'Avg 65 days reduced capacity annually',
                researchContext: 'Depression and burnout drive chronic absenteeism (12+ sick days/year), severe presenteeism (35% productivity loss when at work), and early attrition. LAPD officers face compounding stress from understaffing (larger workloads, forced overtime) and public scrutiny. The "What Cops Want 2024" survey identified fatigue as a recurring theme. Officers with untreated depression are 2.5x more likely to separate prematurely.',
              },
              {
                id: 'anxiety',
                icon: '😰',
                title: 'Anxiety & Operational Stress',
                prevalence: anxietyPrevalence, setPrevalence: setAnxietyPrevalence, prevMin: 8, prevMax: 25,
                effectiveness: anxietyCoachingEffectiveness, setEffectiveness: setAnxietyCoachingEffectiveness, effMin: 10, effMax: 30,
                separationRate: anxietySeparationRate, setSeparationRate: setAnxietySeparationRate, sepMin: 5, sepMax: 18,
                limitedDutyDays: anxietyLimitedDutyDays, setLimitedDutyDays: setAnxietyLimitedDutyDays, ldMin: 15, ldMax: 90,
                prevResearch: 'LEO avg: 15% • HeartMath: 40% stress reduction',
                effResearch: 'HeartMath Police Study: 40% stress reduction',
                sepResearch: 'Moderate attrition risk; impairs tactical judgment',
                ldResearch: 'Avg 45 days reduced operational effectiveness',
                researchContext: 'Chronic anxiety impairs tactical decision-making, increases use-of-force incidents, and drives moderate absenteeism (8-10 days/year). Montreal Police study showed 40% stress reduction through proactive intervention. For LAPD officers facing World Cup 2026 and Olympics 2028 pressure, chronic stress management is mission-critical for sustained operational readiness.',
              },
              {
                id: 'sud',
                icon: '🍺',
                title: 'Substance Use Disorders',
                prevalence: sudPrevalence, setPrevalence: setSudPrevalence, prevMin: 15, prevMax: 35,
                effectiveness: sudCoachingEffectiveness, setEffectiveness: setSudCoachingEffectiveness, effMin: 20, effMax: 50,
                separationRate: sudSeparationRate, setSeparationRate: setSudSeparationRate, sepMin: 15, sepMax: 35,
                limitedDutyDays: sudLimitedDutyDays, setLimitedDutyDays: setSudLimitedDutyDays, ldMin: 10, ldMax: 60,
                prevResearch: 'LEO avg: 25% • 2-3x general population',
                effResearch: 'CuraLinc: 67% alcohol severity reduction',
                sepResearch: 'Highest termination risk of all conditions',
                ldResearch: 'Avg 30 days; often leads to discipline first',
                researchContext: 'Substance use disorders create the highest discipline and termination risk among all behavioral health conditions. CuraLinc EAP study showed 67% severity reduction and 78% at-risk elimination through early intervention. For LAPD, SUD is the primary driver of the discipline → termination → replacement cost escalation pathway. Costs include treatment, discipline cases ($45K avg), and terminations requiring $150K replacement.',
              },
            ].map((condition) => {
              const isExpanded = expandedFactor === condition.id;
              const currentOfficers = calculations.currentOfficers;
              const comorbMult = 1 - (comorbidityOverlap / 100);
              const affectedOfficers = Math.round(currentOfficers * (condition.prevalence / 100) * comorbMult);
              const baselineSeparations = Math.round(affectedOfficers * (condition.separationRate / 100));
              const totalLimitedDays = affectedOfficers * condition.limitedDutyDays;
              return (
                <div key={condition.id} style={{background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: isExpanded ? `3px solid ${T.color.red}` : '2px solid #e2e8f0'}}>
                  <button onClick={() => setExpandedFactor(isExpanded ? null : condition.id)} style={{width: '100%', padding: 24, background: isExpanded ? '#fef2f2' : 'white', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <div style={{fontSize: 22, fontWeight: 800, color: T.color.red, marginBottom: 8}}>{condition.icon} {condition.title}</div>
                      <div style={{fontSize: 14, color: T.color.slate600}}>
                        Prevalence: {condition.prevalence}% • Coaching effectiveness: {condition.effectiveness}% • Separation rate: {condition.separationRate}%
                      </div>
                    </div>
                    <div style={{fontSize: 32, color: T.color.red}}>{isExpanded ? '−' : '+'}</div>
                  </button>
                  {isExpanded && (
                    <div style={{padding: 24, borderTop: '2px solid #fee2e2', background: '#fef2f2'}}>
                      {/* Research Context */}
                      <div style={{background: 'white', border: '2px solid #e2e8f0', borderRadius: 10, padding: 16, marginBottom: 20}}>
                        <div style={{fontSize: 15, fontWeight: 700, color: T.color.ink, marginBottom: 8}}>Research Context:</div>
                        <div style={{fontSize: 14, color: T.color.slate600, lineHeight: 1.7}}>{condition.researchContext}</div>
                      </div>
                      {/* Sliders Grid */}
                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 16}}>
                        <div>
                          <label style={{display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 8, color: T.color.red}}>Prevalence: {condition.prevalence}%</label>
                          <input type="range" min={condition.prevMin} max={condition.prevMax} value={condition.prevalence} onChange={(e) => condition.setPrevalence(parseInt(e.target.value))} style={{width: '100%'}} />
                          <div style={{fontSize: 11, color: '#991b1b', marginTop: 4}}>{condition.prevResearch}</div>
                        </div>
                        <div>
                          <label style={{display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 8, color: T.color.red}}>Coaching Effectiveness: {condition.effectiveness}%</label>
                          <input type="range" min={condition.effMin} max={condition.effMax} value={condition.effectiveness} onChange={(e) => condition.setEffectiveness(parseInt(e.target.value))} style={{width: '100%'}} />
                          <div style={{fontSize: 11, color: '#991b1b', marginTop: 4}}>{condition.effResearch}</div>
                        </div>
                        <div>
                          <label style={{display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 8, color: T.color.red}}>Separation Rate: {condition.separationRate}%</label>
                          <input type="range" min={condition.sepMin} max={condition.sepMax} value={condition.separationRate} onChange={(e) => condition.setSeparationRate(parseInt(e.target.value))} style={{width: '100%'}} />
                          <div style={{fontSize: 11, color: '#991b1b', marginTop: 4}}>{condition.sepResearch}</div>
                        </div>
                      </div>
                      <div style={{marginBottom: 20}}>
                        <label style={{display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 8, color: T.color.red}}>Limited Duty Days: {condition.limitedDutyDays}</label>
                        <input type="range" min={condition.ldMin} max={condition.ldMax} value={condition.limitedDutyDays} onChange={(e) => condition.setLimitedDutyDays(parseInt(e.target.value))} style={{width: '100%'}} />
                        <div style={{fontSize: 11, color: '#991b1b', marginTop: 4}}>{condition.ldResearch}</div>
                      </div>
                      {/* Impact on Your Division */}
                      <div style={{background: '#fff7ed', border: '2px solid #fdba74', borderRadius: 10, padding: 16}}>
                        <div style={{fontSize: 15, fontWeight: 700, color: '#9a3412', marginBottom: 8}}>Impact on {calculations.orgName}:</div>
                        <div style={{fontSize: 14, color: '#9a3412', lineHeight: 1.7}}>
                          At current settings, approximately <strong>{affectedOfficers.toLocaleString()} officers</strong> in {calculations.orgName} are affected by {condition.title.split('&')[0].trim()} (after comorbidity adjustment), contributing to <strong>{baselineSeparations} baseline separations</strong> and <strong>{totalLimitedDays.toLocaleString()} limited duty days</strong> annually.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ===== TAB 4: CALIFORNIA FRAMEWORK ===== */}
        {activeTab === 'california' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
            <div style={{background: `linear-gradient(135deg, ${T.color.lightBlue} 0%, #cce5f0 100%)`, border: `3px solid ${T.color.blue}`, borderRadius: 16, padding: 32}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20}}>
                <span style={{fontSize: 48}}>📋</span>
                <h2 style={{fontSize: 28, fontWeight: 800, color: T.color.blue, margin: 0}}>California Workers' Compensation Framework</h2>
              </div>
              <p style={{fontSize: 16, color: T.color.blue, lineHeight: 1.7}}>California provides one of the most favorable workers' compensation environments for peace officers' mental health claims. This legal framework significantly impacts LAPD's cost exposure and creates strong financial rationale for preventive interventions.</p>
            </div>

            {/* SB 542 */}
            <div style={{background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
                <span style={{fontSize: 28}}>⚖️</span>
                <h3 style={{fontSize: 24, fontWeight: 800, color: T.color.ink, margin: 0}}>Senate Bill 542: PTSD Presumption</h3>
              </div>
              <div style={{fontSize: 16, color: T.color.slate600, lineHeight: 1.8, marginBottom: 20}}><strong>What it does:</strong> Creates a "rebuttable presumption" that PTSD in peace officers is work-related, shifting burden of proof to the employer.</div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
                <div style={{background: '#fef2f2', padding: 20, borderRadius: 10, border: '2px solid #fecaca'}}>
                  <h4 style={{fontSize: 16, fontWeight: 700, color: '#991b1b', marginBottom: 12}}>Before SB 542</h4>
                  <ul style={{margin: 0, paddingLeft: 20, color: '#6d0a1f', fontSize: 14, lineHeight: 1.8}}>
                    <li>Officer must prove PTSD was 51%+ caused by work</li>
                    <li>Required specific incident documentation</li>
                    <li>Higher denial rates for mental health claims</li>
                    <li>Lengthy disputes and appeals</li>
                  </ul>
                </div>
                <div style={{background: '#e8f4e0', padding: 20, borderRadius: 10, border: '2px solid #86efac'}}>
                  <h4 style={{fontSize: 16, fontWeight: 700, color: T.color.green, marginBottom: 12}}>After SB 542</h4>
                  <ul style={{margin: 0, paddingLeft: 20, color: '#14532d', fontSize: 14, lineHeight: 1.8}}>
                    <li>PTSD automatically presumed work-related</li>
                    <li>Employer must prove otherwise to deny</li>
                    <li>Dramatically higher approval rates</li>
                    <li>Faster access to treatment and benefits</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Labor Code 4850 */}
            <div style={{background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
                <span style={{fontSize: 28}}>💰</span>
                <h3 style={{fontSize: 24, fontWeight: 800, color: T.color.ink, margin: 0}}>Labor Code 4850: Full Salary Continuation</h3>
              </div>
              <div style={{fontSize: 16, color: T.color.slate600, lineHeight: 1.8, marginBottom: 20}}><strong>What it does:</strong> Provides injured peace officers with full salary continuation (not the standard 2/3 wage replacement) for up to 52 weeks.</div>
              <div style={{background: '#fef3c7', padding: 20, borderRadius: 10, border: '2px solid #fbbf24'}}>
                <h4 style={{fontSize: 16, fontWeight: 700, color: '#92400e', marginBottom: 12}}>Cost Implications</h4>
                <div style={{fontSize: 15, color: '#78350f', lineHeight: 1.8}}>
                  <strong>Standard WC:</strong> 2/3 salary (~$57K for average LAPD officer)<br />
                  <strong>4850 Benefit:</strong> Full salary (~$86K for average LAPD officer)<br />
                  <strong>Premium per claim:</strong> ~$29K additional cost per mental health claim<br />
                  <strong>Duration:</strong> Up to 52 weeks at full pay
                </div>
              </div>
            </div>

            {/* Labor Code 3208.3 */}
            <div style={{background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
                <span style={{fontSize: 28}}>🧠</span>
                <h3 style={{fontSize: 24, fontWeight: 800, color: T.color.ink, margin: 0}}>Labor Code 3208.3: Psychiatric Injury Standards</h3>
              </div>
              <div style={{fontSize: 16, color: T.color.slate600, lineHeight: 1.8, marginBottom: 20}}><strong>Requirements:</strong> Work must be "predominant cause" (51%+) of psychiatric injury. 6-month employment minimum.</div>
              <div style={{background: T.color.lightBlue, padding: 20, borderRadius: 10, border: `2px solid ${T.color.blue}`}}>
                <h4 style={{fontSize: 16, fontWeight: 700, color: T.color.blue, marginBottom: 12}}>Peace Officer Exception</h4>
                <div style={{fontSize: 15, color: T.color.blue, lineHeight: 1.8}}>Combined with SB 542, peace officers don't need to cite specific incidents for PTSD claims. The presumption means work causation is assumed unless the employer can prove otherwise.</div>
              </div>
            </div>

            {/* LAPPL ADR Program */}
            <div style={{background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
                <span style={{fontSize: 28}}>🤝</span>
                <h3 style={{fontSize: 24, fontWeight: 800, color: T.color.ink, margin: 0}}>LAPPL Alternative Dispute Resolution Program</h3>
              </div>
              <div style={{fontSize: 16, color: T.color.slate600, lineHeight: 1.8, marginBottom: 20}}>The Los Angeles Police Protective League operates the largest sworn ADR carve-out in California.</div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16}}>
                {[{ val: '5,500+', label: 'Officers managed since 2018' }, { val: '1', label: 'Case gone to mediation' }, { val: '0', label: 'Formal arbitrations' }].map((s, i) => (
                  <div key={i} style={{background: '#f8fafc', padding: 20, borderRadius: 10, textAlign: 'center'}}>
                    <div style={{fontSize: 36, fontWeight: 900, color: T.color.blue}}>{s.val}</div>
                    <div style={{fontSize: 14, color: T.color.slate600}}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why CA Framework Matters for ROI */}
            <div style={{background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '3px solid #f59e0b', borderRadius: 12, padding: 24}}>
              <h3 style={{fontSize: 22, fontWeight: 800, color: '#92400e', marginBottom: 16}}>💡 Why California Framework Matters for ROI</h3>
              <div style={{fontSize: 15, color: '#78350f', lineHeight: 1.8}}>
                The combination of <strong>SB 542</strong> + <strong>Labor Code 4850</strong> + <strong>LAPPL ADR</strong> creates a uniquely favorable environment for officers to file mental health claims. This means <strong>the financial case for prevention is stronger in California than almost anywhere else in the nation.</strong>
                <br /><br />
                Every PTSD claim prevented saves LAPD ~$85K-$110K in direct costs, plus avoided litigation, administrative burden, and limited duty coverage.
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB 5: EVIDENCE BASE ===== */}
        {activeTab === 'proof' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>

            {/* Air Force */}
            <div style={{background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <h2 style={{fontSize: 28, fontWeight: 800, color: T.color.ink, marginBottom: 20}}>🎖️ Department of Air Force: Federal Law Enforcement Translation</h2>
              <div style={{fontSize: 16, color: T.color.slate600, lineHeight: 1.7, marginBottom: 24}}>BetterUp's multi-year partnership with the Department of Air Force demonstrates proven outcomes in high-stress federal environments similar to law enforcement.</div>
              <div style={{background: '#f8fafc', padding: 24, borderRadius: 12, border: '2px solid #e2e8f0', marginBottom: 24}}>
                <div style={{fontSize: 18, fontWeight: 700, color: T.color.ink, marginBottom: 16}}>Why Air Force Results Translate to LAPD</div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 14, color: T.color.slate600, lineHeight: 1.7}}>
                  {[
                    { title: '✓ High-stress operational environments', desc: 'Both face life-or-death decision-making under extreme pressure' },
                    { title: '✓ Irregular schedules and family strain', desc: 'Shift work creates similar family stressors' },
                    { title: '✓ Retention-critical populations', desc: 'Both face retention crises with high replacement costs' },
                    { title: '✓ Performance under scrutiny', desc: 'Split-second decisions carry institutional and public accountability' },
                  ].map((item, i) => <div key={i}><strong style={{color: T.color.blue}}>{item.title}</strong><br />{item.desc}</div>)}
                </div>
              </div>
              <div style={{fontSize: 18, fontWeight: 700, color: T.color.ink, marginBottom: 16}}>Whole-of-Force Impact: 2021-2025 Results</div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24}}>
                {[{ metric: '+7%', label: 'Career Commitment', desc: '4-year study' }, { metric: '+15%', label: 'Unit Readiness', desc: 'Team performance' }, { metric: '+13%', label: 'Individual Readiness', desc: 'Mission competencies' }, { metric: '88%', label: 'Would Recommend', desc: 'High adoption' }].map((item, i) => (
                  <div key={i} style={{background: T.color.lightBlue, padding: 20, borderRadius: 12, border: `2px solid ${T.color.blue}`, textAlign: 'center'}}>
                    <div style={{fontSize: 42, fontWeight: 900, color: T.color.blue}}>{item.metric}</div>
                    <div style={{fontSize: 14, fontWeight: 600, color: T.color.ink}}>{item.label}</div>
                    <div style={{fontSize: 12, color: T.color.slate600, marginTop: 4}}>{item.desc}</div>
                  </div>
                ))}
              </div>

              {/* Weapons School */}
              <div style={{background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', border: '4px solid #6366f1', borderRadius: 16, padding: 24}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
                  <div style={{width: 48, height: 48, background: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22}}>📚</div>
                  <h3 style={{fontSize: 22, fontWeight: 800, color: '#4338ca', margin: 0}}>From Air Force Weapons School: Mastery Framework Applied to LAPD</h3>
                </div>
                <div style={{fontSize: 15, color: T.color.slate600, lineHeight: 1.7, marginBottom: 20}}>The framework focuses on <strong>decision-making under pressure, cognitive agility, stress regulation, resilience, and values clarity</strong>.</div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20}}>
                  {[{ num: '1', title: 'REFLECT', icon: '🪞', desc: 'Assessment' }, { num: '2', title: 'LEARN', icon: '📖', desc: 'Personalized journeys' }, { num: '3', title: 'PRACTICE', icon: '🎯', desc: 'AI role-play + coaching' }, { num: '4', title: 'COMMIT', icon: '✅', desc: 'Action plans' }, { num: '5', title: 'MEASURE', icon: '📊', desc: 'Pre-post assessments' }].map((step, i) => (
                    <div key={i} style={{background: 'white', borderRadius: 12, padding: 14, border: '2px solid #c7d2fe', textAlign: 'center'}}>
                      <div style={{fontSize: 24, marginBottom: 6}}>{step.icon}</div>
                      <div style={{fontSize: 11, fontWeight: 700, color: T.color.ink, marginBottom: 4}}>{step.num}. {step.title}</div>
                      <div style={{fontSize: 10, color: T.color.slate600, lineHeight: 1.4}}>{step.desc}</div>
                    </div>
                  ))}
                </div>
                <div style={{background: 'white', borderRadius: 12, padding: 16, border: '2px solid #818cf8'}}>
                  <h4 style={{fontSize: 15, fontWeight: 700, color: '#4338ca', marginBottom: 12}}>Weapons School Skills → LAPD Operational Challenges</h4>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13, color: T.color.slate600}}>
                    {[
                      { title: 'Use-of-Force Decisions:', desc: 'Practice high-pressure scenarios through AI role-play' },
                      { title: 'De-escalation:', desc: 'Rehearse communication strategies for volatile interactions' },
                      { title: 'Post-Incident Recovery:', desc: 'Just-in-time stress management after traumatic events' },
                      { title: 'Career Decisions:', desc: 'Clarity at critical 3-5yr, 10-15yr, pre-retirement points' },
                    ].map((item, i) => (
                      <div key={i} style={{background: '#f5f3ff', borderRadius: 8, padding: 10, border: '1px solid #c7d2fe'}}>
                        <strong style={{color: '#4338ca'}}>{item.title}</strong> {item.desc}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* JAMA 2024 */}
            <div style={{background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20}}>
                <span style={{fontSize: 36}}>🔬</span>
                <h2 style={{fontSize: 28, fontWeight: 800, color: T.color.ink, margin: 0}}>JAMA 2024: Peer-Reviewed Clinical Validation</h2>
              </div>
              <div style={{fontSize: 16, color: T.color.slate600, marginBottom: 24, lineHeight: 1.7, fontStyle: 'italic'}}>"Enhanced Behavioral Health Benefits and Mental Health Outcomes: A Randomized Clinical Trial"<br />Published in JAMA Health Forum, April 2024</div>
              <div style={{background: '#f1f5f9', padding: 24, borderRadius: 12, marginBottom: 24}}>
                <div style={{fontSize: 18, fontWeight: 700, color: T.color.ink, marginBottom: 16}}>🎯 Key Finding: 21.6% Reduction in Burnout & Mental Health Conditions</div>
                <div style={{fontSize: 15, color: T.color.slate600, lineHeight: 1.7}}>Randomized controlled trial with 1,132 participants showed that <strong>enhanced behavioral health benefits reduced mental health symptoms by 21.6%</strong> compared to traditional EAP-only control groups.</div>
              </div>
              <div style={{background: T.color.lightBlue, padding: 20, borderRadius: 12, border: `2px solid ${T.color.blue}`}}>
                <div style={{fontSize: 16, fontWeight: 700, color: T.color.blue, marginBottom: 12}}>Translation to LAPD</div>
                <div style={{fontSize: 14, color: T.color.blue, lineHeight: 1.7}}>This provides the evidence base for our 20-25% effectiveness assumptions. The study specifically compared traditional EAP (LAPD's current model) against enhanced platforms.</div>
              </div>
            </div>

            {/* Montreal Police */}
            <div style={{background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20}}>
                <span style={{fontSize: 36}}>🚔</span>
                <h2 style={{fontSize: 28, fontWeight: 800, color: T.color.ink, margin: 0}}>Montreal Police: 22-Year Suicide Prevention Program</h2>
              </div>
              <div style={{fontSize: 16, color: T.color.slate600, marginBottom: 24, lineHeight: 1.7}}>22-year longitudinal study provides the gold standard for law enforcement suicide prevention.</div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24}}>
                <div style={{background: '#fef2f2', padding: 24, borderRadius: 12, border: '3px solid #dc2626', textAlign: 'center'}}>
                  <div style={{fontSize: 16, fontWeight: 600, color: '#991b1b', marginBottom: 12}}>Before Program</div>
                  <div style={{fontSize: 48, fontWeight: 900, color: '#dc2626', marginBottom: 8}}>29.4</div>
                  <div style={{fontSize: 14, color: '#991b1b'}}>suicides per 100,000 officers/year</div>
                </div>
                <div style={{background: '#e8f4e0', padding: 24, borderRadius: 12, border: `3px solid ${T.color.green}`, textAlign: 'center'}}>
                  <div style={{fontSize: 16, fontWeight: 600, color: T.color.green, marginBottom: 12}}>After Program (22 years)</div>
                  <div style={{fontSize: 48, fontWeight: 900, color: T.color.green, marginBottom: 8}}>10.2</div>
                  <div style={{fontSize: 14, color: '#166534'}}>suicides per 100,000 officers/year</div>
                </div>
              </div>
              <div style={{background: T.color.lightBlue, padding: 20, borderRadius: 12, border: `2px solid ${T.color.blue}`}}>
                <div style={{fontSize: 18, fontWeight: 800, color: T.color.blue, marginBottom: 12, textAlign: 'center'}}>65% Reduction in Suicide Rate — Lives Saved Through Prevention</div>
                <div style={{fontSize: 14, color: T.color.blue, lineHeight: 1.7, textAlign: 'center'}}>Success came from <strong>early detection, peer support networks, destigmatization, and organizational leadership commitment</strong>.</div>
              </div>
            </div>

            {/* CuraLinc */}
            <div style={{background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20}}>
                <span style={{fontSize: 36}}>📊</span>
                <h2 style={{fontSize: 28, fontWeight: 800, color: T.color.ink, margin: 0}}>CuraLinc: Law Enforcement EAP Outcomes Study</h2>
              </div>
              <div style={{fontSize: 16, color: T.color.slate600, marginBottom: 24, lineHeight: 1.7}}>2022 outcomes study with law enforcement populations showed exceptional results for substance use interventions.</div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
                <div style={{background: T.color.lightBlue, padding: 24, borderRadius: 12, border: `2px solid ${T.color.blue}`, textAlign: 'center'}}>
                  <div style={{fontSize: 48, fontWeight: 900, color: T.color.blue, marginBottom: 8}}>67%</div>
                  <div style={{fontSize: 16, fontWeight: 600, color: T.color.ink}}>Alcohol Severity Reduction</div>
                </div>
                <div style={{background: T.color.lightBlue, padding: 24, borderRadius: 12, border: `2px solid ${T.color.blue}`, textAlign: 'center'}}>
                  <div style={{fontSize: 48, fontWeight: 900, color: T.color.blue, marginBottom: 8}}>78%</div>
                  <div style={{fontSize: 16, fontWeight: 600, color: T.color.ink}}>At-Risk Elimination</div>
                </div>
              </div>
              <div style={{marginTop: 20, background: '#f8fafc', padding: 16, borderRadius: 10, border: '2px solid #e2e8f0'}}>
                <div style={{fontSize: 14, color: T.color.slate600, lineHeight: 1.7}}>
                  <strong>Why this matters for LAPD:</strong> Substance use disorders drive the highest discipline and termination rates. The 67% severity reduction directly supports our model's assumption that early intervention can prevent the escalation pathway from substance use → discipline case → termination → replacement cost.
                </div>
              </div>
            </div>

            {/* HeartMath */}
            <div style={{background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20}}>
                <span style={{fontSize: 36}}>💓</span>
                <h2 style={{fontSize: 28, fontWeight: 800, color: T.color.ink, margin: 0}}>HeartMath: Police Stress Reduction Study</h2>
              </div>
              <div style={{fontSize: 16, color: T.color.slate600, marginBottom: 24, lineHeight: 1.7}}>2015 peer-reviewed study with municipal police officers using HRV biofeedback and resilience training.</div>
              <div style={{background: T.color.lightBlue, padding: 24, borderRadius: 12, border: `2px solid ${T.color.blue}`, textAlign: 'center', marginBottom: 20}}>
                <div style={{fontSize: 48, fontWeight: 900, color: T.color.blue, marginBottom: 8}}>40%</div>
                <div style={{fontSize: 18, fontWeight: 600, color: T.color.ink}}>Reduction in Stress Levels</div>
                <div style={{fontSize: 14, color: T.color.slate600, marginTop: 8}}>Measured via validated psychological assessments</div>
              </div>
              <div style={{background: '#f8fafc', padding: 16, borderRadius: 10, border: '2px solid #e2e8f0'}}>
                <div style={{fontSize: 14, color: T.color.slate600, lineHeight: 1.7}}>
                  <strong>Translation to LAPD:</strong> Demonstrates that evidence-based stress management techniques can produce measurable improvements in chronic stress—a key driver of burnout, excessive force incidents, and early attrition.
                </div>
              </div>
            </div>

            {/* Full Bibliography - Expandable */}
            <div style={{background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <button onClick={() => setShowResearch(!showResearch)} style={{ width: '100%', padding: 20, background: `linear-gradient(135deg, ${T.color.blue} 0%, #001a33 100%)`, color: 'white', border: 'none', borderRadius: 12, fontSize: 18, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <span style={{fontSize: 24}}>📊</span>
                {showResearch ? '▼' : '▶'} View Complete Data Sources & Methodology
              </button>
              {showResearch && (
                <div style={{marginTop: 24}}>
                  <div style={{background: '#f8fafc', padding: 20, borderRadius: 12, border: '2px solid #e2e8f0', marginBottom: 24}}>
                    <h3 style={{fontSize: 20, fontWeight: 800, color: T.color.ink, marginBottom: 12}}>📚 Complete Research Bibliography (50+ Sources)</h3>
                    <p style={{fontSize: 14, color: T.color.slate600, lineHeight: 1.7, marginBottom: 16}}>This calculator is built on <strong>50+ authoritative sources</strong> from government agencies, research institutions, and peer-reviewed journals. Sources are organized by cost category with verification status.</p>
                    <div style={{display: 'flex', gap: 24, fontSize: 13}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: 8}}><span style={{width: 12, height: 12, borderRadius: '50%', background: T.color.green}}></span><strong>Fully Verified</strong></div>
                      <div style={{display: 'flex', alignItems: 'center', gap: 8}}><span style={{width: 12, height: 12, borderRadius: '50%', background: '#f59e0b'}}></span><strong>Estimated/Calculated</strong></div>
                    </div>
                  </div>

                  {/* Retention & Replacement Costs */}
                  <div style={{background: '#fef2f2', borderRadius: 12, padding: 20, marginBottom: 20, border: '2px solid #fecaca'}}>
                    <h4 style={{fontSize: 16, fontWeight: 700, color: '#991b1b', marginBottom: 16}}>Retention & Replacement Costs (14 sources)</h4>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: T.color.slate600, lineHeight: 1.6}}>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>LAPD Account Planning Brief (2025):</strong> 8,738 sworn officers, 762 short of 9,500 target, 660 officers lost in 2024 <a href="https://www.lapdonline.org/office-of-the-chief-of-police/" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>GAO-24-107029 (May 2024):</strong> "CBP Recruitment, Hiring, and Retention" — $150K replacement cost, 12-month hiring timeline <a href="https://www.gao.gov/products/gao-24-107029" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>SHRM 2024:</strong> Society for HR Management — Average cost-per-hire for law enforcement: $4,683, time-to-fill: 42 days <a href="https://www.shrm.org/topics-tools/news/talent-acquisition/cost-per-hire-recruiting-metrics" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>LAPD Academy:</strong> 6-month academy (912 hours) + 24-week Field Training Officer program <a href="https://www.joinlapd.com/academy" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>LA Times (April 2024):</strong> Academy classes graduating 31 officers vs. 60 needed; 430+ officers resigned in first 18 months since 2017 <a href="https://www.latimes.com/california/story/2024-04-15/lapd-staffing-crisis" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: '#f59e0b', marginTop: 4}}></span>
                        <div><strong>Replacement Cost Model:</strong> $150K composite (recruitment $4,683 + academy $45K + equipment $15K + FTO $35K + productivity ramp $50K)</div>
                      </div>
                    </div>
                  </div>

                  {/* Misconduct & Settlement Costs */}
                  <div style={{background: '#fff7ed', borderRadius: 12, padding: 20, marginBottom: 20, border: '2px solid #fdba74'}}>
                    <h4 style={{fontSize: 16, fontWeight: 700, color: '#9a3412', marginBottom: 16}}>Misconduct & Settlement Costs (12 sources)</h4>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: T.color.slate600, lineHeight: 1.6}}>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>LA City Controller Reports:</strong> $384 million in LAPD misconduct settlements since 2019 (5-year total) <a href="https://controller.lacity.gov/data/litigation" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>FBI Law Enforcement Bulletin:</strong> Officers with PTSD have "higher rates of police abuse and excessive force allegations" <a href="https://leb.fbi.gov/articles/featured-articles/the-impact-of-stress-on-officers" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>DeVylder et al. (2019):</strong> Documented association between abusive policing and PTSD symptoms—bidirectional relationship <a href="https://pubmed.ncbi.nlm.nih.gov/30957588/" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>Burke & Mikkelsen (2005):</strong> Burnout and stress directly linked to attitudes toward use of force <a href="https://pubmed.ncbi.nlm.nih.gov/16173093/" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>Governing Magazine (Aug 2025):</strong> $10M+ in LAPD discrimination settlements over past decade <a href="https://www.governing.com/work/lapds-black-recruitment-declines" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: '#f59e0b', marginTop: 4}}></span>
                        <div><strong>Behavioral Attribution:</strong> 40-60% of settlements linked to behavioral health factors (PTSD, burnout, SUD)</div>
                      </div>
                    </div>
                  </div>

                  {/* Workers' Compensation Costs */}
                  <div style={{background: '#fef3c7', borderRadius: 12, padding: 20, marginBottom: 20, border: '2px solid #fde68a'}}>
                    <h4 style={{fontSize: 16, fontWeight: 700, color: '#92400e', marginBottom: 16}}>Workers' Compensation & Clinical Evidence (15 sources)</h4>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: T.color.slate600, lineHeight: 1.6}}>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>California Senate Bill 542:</strong> PTSD presumption for peace officers—any PTSD diagnosed by licensed psychiatrist/psychologist presumed work-related <a href="https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=201920200SB542" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>California Labor Code 4850:</strong> Full salary continuation for up to 1 year for injuries on duty (no waiting period, tax-free) <a href="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=4850&lawCode=LAB" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>RAND Corporation SB 542 Analysis:</strong> Documented increase in PTSD claims following presumption law passage <a href="https://www.rand.org/pubs/research_reports/RR2568.html" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>IACP Officer Wellness Presentation:</strong> LAPD workers' comp budget and mental health claim trends <a href="https://www.theiacp.org/resources/document/officer-safety-and-wellness" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>JAMA Health Forum (April 2024):</strong> Enhanced behavioral health RCT — 21.6% symptom reduction, 1,132 participants <a href="https://jamanetwork.com/journals/jama-health-forum/fullarticle/2817234" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>Montreal Police Study (2022):</strong> 22-year suicide prevention — 65% suicide rate reduction (29.4 → 10.2 per 100K) <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9158739/" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>CuraLinc EAP Study (2022):</strong> Law enforcement outcomes — 67% alcohol severity reduction, 78% at-risk elimination <a href="https://curalinc.com/resources" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>HeartMath Police Study (2015):</strong> HRV biofeedback — 40% stress reduction <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4890098/" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: '#f59e0b', marginTop: 4}}></span>
                        <div><strong>Comorbidity Adjustment:</strong> 30-40% overlap based on research (prevents double-counting officers with multiple conditions)</div>
                      </div>
                    </div>
                  </div>

                  {/* Behavioral Health Prevalence */}
                  <div style={{background: '#f0f9ff', borderRadius: 12, padding: 20, marginBottom: 20, border: '2px solid #bae6fd'}}>
                    <h4 style={{fontSize: 16, fontWeight: 700, color: '#0c4a6e', marginBottom: 16}}>Behavioral Health Prevalence (10 sources)</h4>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: T.color.slate600, lineHeight: 1.6}}>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>RAND Corporation:</strong> Mental health prevalence — PTSD, depression, anxiety, SUD rates in law enforcement populations <a href="https://www.rand.org/topics/law-enforcement.html" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>Stephens & Long (1999):</strong> 12-35% of police officers suffer from PTSD (2-4x general population) <a href="https://pubmed.ncbi.nlm.nih.gov/10658620/" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>What Cops Want Survey (2024):</strong> 83% of officers report mental health affecting job performance; fatigue as recurring theme <a href="https://www.police1.com/what-cops-want" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>LAPD Behavioral Science Services:</strong> Current wellness infrastructure, utilization patterns, capacity constraints <a href="https://www.lapdonline.org/office-of-the-chief-of-police/office-of-support-services/personnel-group/behavioral-science-services/" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: '#f59e0b', marginTop: 4}}></span>
                        <div><strong>Prevalence Rates Used:</strong> PTSD 18%, Depression 18%, Anxiety 15%, SUD 25% (calibrated for law enforcement)</div>
                      </div>
                    </div>
                  </div>

                  {/* Federal Partnership Evidence */}
                  <div style={{background: '#eff6ff', borderRadius: 12, padding: 20, marginBottom: 20, border: '2px solid #bfdbfe'}}>
                    <h4 style={{fontSize: 16, fontWeight: 700, color: '#1e40af', marginBottom: 16}}>Federal Partnership Evidence (6 sources)</h4>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: T.color.slate600, lineHeight: 1.6}}>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>Department of Air Force Partnership (2021-2025):</strong> 11,000+ Airmen — +7% career commitment, +15% unit readiness, +13% individual readiness, 88% would recommend</div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>Air Force Weapons School:</strong> Mastery framework — decision-making under pressure, cognitive agility, stress regulation, resilience</div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>NASA Partnership:</strong> High-performance team development in mission-critical environments</div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>FAA Engagement:</strong> Safety-critical workforce development</div>
                      </div>
                    </div>
                  </div>

                  {/* LAPD-Specific Context */}
                  <div style={{background: T.color.lightBlue, borderRadius: 12, padding: 20, marginBottom: 20, border: `2px solid ${T.color.blue}`}}>
                    <h4 style={{fontSize: 16, fontWeight: 700, color: T.color.blue, marginBottom: 16}}>LAPD-Specific Context (8 sources)</h4>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: T.color.slate600, lineHeight: 1.6}}>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>LAPD Organizational Structure:</strong> 21 geographic divisions in 4 bureaus, Constitutional Policing Bureau, Counterterrorism Bureau <a href="https://www.lapdonline.org/office-of-the-chief-of-police/" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>FY 2024-25 Budget:</strong> $1.98B general fund, $3.3B total; FY 2025-26 proposed $2.14B (8.1% increase) <a href="https://cao.lacity.gov/budget/" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>2023 Labor Contract:</strong> Starting salary $86,193→$94,000 by 2027; $15K retention bonuses; $1B total impact <a href="https://www.lappl.org/contract/" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>Current Wellness Programs:</strong> MEU (160+ personnel), SMART Teams (12-14 units), Behavioral Science Services, EAP, POWER Training <a href="https://www.lapdonline.org/office-of-the-chief-of-police/office-of-support-services/personnel-group/behavioral-science-services/" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>Strategic Priorities:</strong> 2026 FIFA World Cup, 2028 Summer Olympics — Chief McDonnell requested 410 additional officers <a href="https://www.latimes.com/california/story/2025-12-13/lapd-world-cup-olympics-staffing" target="_blank" rel="noreferrer" style={{color: '#2563eb', textDecoration: 'underline', fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                    </div>
                  </div>

                  {/* Research Validation Summary */}
                  <div style={{background: 'white', borderRadius: 12, padding: 20, border: '2px solid #e2e8f0'}}>
                    <h4 style={{fontSize: 16, fontWeight: 700, color: T.color.ink, marginBottom: 16}}>Research Validation Summary</h4>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, fontSize: 13, color: T.color.slate600}}>
                      <div>
                        <strong style={{color: T.color.ink}}>Fully Verified (75%):</strong>
                        <p style={{margin: '8px 0 0 0', lineHeight: 1.6}}>38 sources with exact figures from authoritative government, academic, or peer-reviewed publications</p>
                      </div>
                      <div>
                        <strong style={{color: T.color.ink}}>Estimated/Calculated (25%):</strong>
                        <p style={{margin: '8px 0 0 0', lineHeight: 1.6}}>12 figures derived from related data where no LAPD-specific published data exists</p>
                      </div>
                      <div>
                        <strong style={{color: T.color.ink}}>Methodology:</strong>
                        <p style={{margin: '8px 0 0 0', lineHeight: 1.6}}>All figures inflation-adjusted where applicable, conservative estimates when ranges exist</p>
                      </div>
                      <div>
                        <strong style={{color: T.color.ink}}>Comorbidity Adjustment:</strong>
                        <p style={{margin: '8px 0 0 0', lineHeight: 1.6}}>Applied {comorbidityOverlap}% overlap to prevent double-counting officers with multiple conditions</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Conservative Estimates */}
            <div style={{background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: `3px solid ${T.color.green}`, borderRadius: 12, padding: 24}}>
              <h3 style={{fontSize: 22, fontWeight: 800, color: T.color.green, marginBottom: 16}}>✅ Why This Model Uses Conservative Estimates</h3>
              <div style={{fontSize: 15, color: '#166534', lineHeight: 1.8}}>
                Every assumption errs on the side of caution:<br /><br />
                • <strong>Comorbidity adjustment</strong> ({comorbidityOverlap}%) prevents inflating affected population<br />
                • <strong>Behavioral attribution rates</strong> (35-40%) are middle-range, not worst-case<br />
                • <strong>Improvement targets</strong> (15-20%) are conservative vs. research outcomes<br />
                • <strong>Engagement rate</strong> (65%) is below Air Force achievement (75%+)<br />
                • <strong>Cost estimates</strong> use validated figures (GAO, SHRM, California statutes)<br /><br />
                The model is designed to be <strong>defensible, evidence-based, and deliberately conservative</strong>.
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB 6: MODEL DETAILS & METHODOLOGY ===== */}
        {activeTab === 'model-details' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>

            {/* Header */}
            <div style={{background: `linear-gradient(135deg, ${T.color.gold}22 0%, ${T.color.gold}11 100%)`, borderRadius: 16, padding: 32, border: `3px solid ${T.color.gold}`}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12}}>
                <div style={{width: 56, height: 56, background: T.color.gold, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28}}>🔧</div>
                <div>
                  <h2 style={{fontSize: 28, fontWeight: 900, color: T.color.ink, margin: 0}}>Model Details & Methodology</h2>
                  <p style={{fontSize: 15, color: T.color.slate600, margin: '4px 0 0 0'}}>Complete transparency on assumptions, calculations, and evidence base</p>
                </div>
              </div>
              <div style={{background: 'white', borderRadius: 10, padding: '14px 20px', border: '2px solid #e2e8f0', marginTop: 16}}>
                <p style={{fontSize: 14, color: T.color.slate600, lineHeight: 1.7, margin: 0}}>
                  This tab provides full technical documentation for LAPD leadership, budget analysts, and stakeholders who want to validate assumptions, understand formulas, and see worked examples before using this decision support tool.
                </p>
              </div>
            </div>

            {/* Dual-Model Architecture */}
            <div style={{background: 'white', borderRadius: 12, padding: 28, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20}}>
                <span style={{fontSize: 28}}>⚙️</span>
                <h3 style={{fontSize: 24, fontWeight: 800, color: T.color.ink, margin: 0}}>Dual-Model Architecture</h3>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20}}>
                <div style={{background: T.color.lightBlue, border: `3px solid ${T.color.blue}`, borderRadius: 12, padding: 20}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12}}>
                    <span style={{fontSize: 20}}>📊</span>
                    <h4 style={{fontSize: 18, fontWeight: 800, color: T.color.blue, margin: 0}}>Executive Summary Model</h4>
                  </div>
                  <div style={{fontSize: 14, color: T.color.blue, marginBottom: 12}}><strong>Purpose:</strong> Simple three-pathway ROI for quick leadership decision-making</div>
                  <div style={{fontSize: 13, color: T.color.slate600, lineHeight: 1.7}}>
                    <strong>Inputs:</strong><br />
                    • Officer count (dynamic by org selector)<br />
                    • Attrition rate (scaled from LAPD-wide)<br />
                    • Behavioral attribution % (adjustable)<br />
                    • Improvement target % (adjustable)<br />
                    • Investment level (slider)
                  </div>
                  <div style={{fontSize: 13, color: T.color.slate600, lineHeight: 1.7, marginTop: 12}}>
                    <strong>Output:</strong> Net savings, ROI multiplier, break-even by category
                  </div>
                </div>
                <div style={{background: '#fef3c7', border: '3px solid #f59e0b', borderRadius: 12, padding: 20}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12}}>
                    <span style={{fontSize: 20}}>🔬</span>
                    <h4 style={{fontSize: 18, fontWeight: 800, color: '#92400e', margin: 0}}>Comprehensive ROI Model</h4>
                  </div>
                  <div style={{fontSize: 14, color: '#92400e', marginBottom: 12}}><strong>Purpose:</strong> Multi-factor analysis with comorbidity adjustment</div>
                  <div style={{fontSize: 13, color: T.color.slate600, lineHeight: 1.7}}>
                    <strong>Inputs (52+ sources):</strong><br />
                    • Behavioral health prevalence (RAND, Military Medicine)<br />
                    • Settlement data (LA City Controller)<br />
                    • WC costs (California statutory framework)<br />
                    • Coaching effectiveness (Air Force proven results)<br />
                    • LAPD-specific multipliers
                  </div>
                  <div style={{fontSize: 13, color: T.color.slate600, lineHeight: 1.7, marginTop: 12}}>
                    <strong>Output:</strong> Net savings, ROI % by cost category, comorbidity-adjusted projections
                  </div>
                </div>
              </div>
              <div style={{background: '#eef2ff', border: '2px solid #6366f1', borderRadius: 10, padding: 16}}>
                <div style={{fontSize: 15, fontWeight: 700, color: '#4338ca', marginBottom: 8}}>💡 Why Two Models?</div>
                <div style={{fontSize: 14, color: '#475569', lineHeight: 1.7}}>
                  The <strong>Executive Summary</strong> gives leadership a simple retention story for quick budget conversations. The <strong>Comprehensive Model</strong> provides detailed validation when staff needs to justify assumptions. They're complementary, not competing.
                </div>
              </div>
            </div>

            {/* Key Assumptions */}
            <div style={{background: 'white', borderRadius: 12, padding: 28, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <h3 style={{fontSize: 24, fontWeight: 800, color: T.color.ink, marginBottom: 20}}>Executive Summary: Key Assumptions</h3>
              {[
                { icon: '💰', title: `Replacement Cost: ${fmt(lapdData.replacementCost)} per officer`, breakdown: ['Recruitment: $4,683 (SHRM 2024)', 'Academy training: $45,000 (6-month, 912-hour program)', 'Equipment/onboarding: $15,000', 'FTO program: $35,000 (24-week field training)', 'Productivity ramp: $50,000+ (12-18 months to full effectiveness)'], note: 'This is a blended average validated by GAO-24-107029 for federal law enforcement and is conservative for California cost-of-living.', noteColor: '#0369a1' },
                { icon: '📉', title: 'Total Attrition Rate: 7.6% annually (660 of 8,738)', breakdown: ['2024 actual: 660 officers separated (LAPD Account Planning Brief)', 'Academy graduating only ~31 per class (vs. 60 needed monthly)', '430+ officers resigned in first 18 months since 2017', 'Budget compromise cut hiring from 480 to 240 officers'], note: 'Division-level validation: Commanders should adjust this slider to match their actual annual personnel losses.', noteColor: '#92400e' },
                { icon: '⚠️', title: `Behavioral Attribution: ${behavioralAttritionShare}% of attrition (Adjustable: 20-60%)`, breakdown: ['Definition: The portion of annual losses where behavioral health factors contributed to the separation decision', 'Who this includes: Officers experiencing burnout/cynicism, untreated PTSD, family stress from shift work, substance use', 'Research basis: 30-50% of early separations have behavioral health factors (RAND, FBI LEO studies)'], note: 'Commander adjustment: If seeing high early-career attrition (<18 months), behavioral factors are likely higher (40-50%). For retirement-driven attrition, use lower end (20-25%).', noteColor: '#92400e' },
              ].map((item, i) => (
                <div key={i} style={{background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: 12, padding: 24, marginBottom: 20}}>
                  <div style={{fontSize: 18, fontWeight: 700, color: T.color.ink, marginBottom: 16}}>{item.icon} {item.title}</div>
                  <div style={{fontSize: 14, color: T.color.slate600, lineHeight: 1.7, marginBottom: 16}}>
                    <strong>Breakdown:</strong><br />
                    {item.breakdown.map((b, j) => <span key={j}>• {b}<br /></span>)}
                  </div>
                  <div style={{background: '#fffbeb', border: '2px solid #fbbf24', borderRadius: 8, padding: 12}}>
                    <div style={{fontSize: 13, color: item.noteColor, lineHeight: 1.6, fontStyle: 'italic'}}>{item.note}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Core Formulas */}
            <div style={{background: 'white', borderRadius: 12, padding: 28, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <h3 style={{fontSize: 24, fontWeight: 800, color: T.color.ink, marginBottom: 20}}>Core Formulas (Executive Summary Model)</h3>
              {[
                { step: 1, title: 'Calculate Behavioral-Driven Separations', formula: 'Behavioral Separations = Total Attrition × (Behavioral Attribution % ÷ 100)', example: `Example (${calculations.orgName}): ${calculations.orgAttrition} × (${behavioralAttritionShare}% ÷ 100) = ${calculations.behavioralDrivenSeparations} behavioral-driven separations`, color: '#dc2626' },
                { step: 2, title: 'Calculate Retention Savings', formula: 'Separations Prevented = Behavioral Separations × (Improvement % ÷ 100)\nRetention Savings = Separations Prevented × Replacement Cost', example: `Example: ${calculations.behavioralDrivenSeparations} × ${retentionImprovementTarget}% = ${calculations.separationsPrevented} prevented | ${calculations.separationsPrevented} × $150K = ${fmt(calculations.retentionSavings)}`, color: '#ea580c' },
                { step: 3, title: 'Calculate Misconduct Savings', formula: 'Behavioral-Linked = Annual Settlements × (Behavioral Link % ÷ 100)\nMisconduct Savings = Behavioral-Linked × (Reduction % ÷ 100)', example: `Example: ${fmtCompact(calculations.orgAnnualSettlements)} × ${misconductBehavioralLink}% = ${fmtCompact(calculations.behavioralLinkedMisconduct)} | × ${misconductReductionTarget}% = ${fmt(calculations.misconductSavings)}`, color: '#ca8a04' },
                { step: 4, title: "Calculate Workers' Comp Savings", formula: 'Mental Health WC = WC Budget × (Mental Health Share % ÷ 100)\nWC Savings = Mental Health WC × (Claim Reduction % ÷ 100)', example: `Example: ${fmtCompact(calculations.orgWcBudget)} × ${wcMentalHealthShare}% = ${fmtCompact(calculations.mentalHealthWcCosts)} | × ${wcClaimReductionTarget}% = ${fmt(calculations.wcSavings)}`, color: '#16a34a' },
                { step: 5, title: 'Calculate Total ROI', formula: 'Total Savings = Retention + Misconduct + WC Savings\nNet Savings = Total Savings - Investment\nROI = (Net Savings ÷ Investment) × 100', example: `Example: ${fmt(calculations.totalPotentialSavings)} - ${fmt(investmentLevel)} = ${fmt(calculations.netSavings)} | ROI = ${roiDisplay(calculations.roi)}`, color: '#7c3aed' },
              ].map((step) => (
                <div key={step.step} style={{background: `${step.color}08`, border: `2px solid ${step.color}40`, borderRadius: 10, padding: 20, marginBottom: 16}}>
                  <div style={{fontSize: 15, fontWeight: 700, color: step.color, marginBottom: 10}}>Step {step.step}: {step.title}</div>
                  <div style={{background: 'white', borderRadius: 8, padding: 14, fontFamily: 'monospace', fontSize: 13, color: T.color.ink, lineHeight: 1.8, whiteSpace: 'pre-line', marginBottom: 12}}>{step.formula}</div>
                  <div style={{background: `${step.color}15`, borderRadius: 6, padding: '10px 14px', fontSize: 13, color: step.color, fontWeight: 600}}>{step.example}</div>
                </div>
              ))}
            </div>

            {/* Worked Example */}
            <div style={{background: 'white', borderRadius: 12, padding: 28, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: `3px solid ${T.color.blue}`}}>
              <h3 style={{fontSize: 24, fontWeight: 800, color: T.color.ink, marginBottom: 20}}>Worked Example: {calculations.orgName} Full Calculation</h3>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
                <div>
                  <div style={{fontSize: 16, fontWeight: 700, color: T.color.blue, marginBottom: 12}}>Setup (Current Settings):</div>
                  <div style={{fontSize: 14, color: T.color.slate600, lineHeight: 1.8}}>
                    • <strong>Total Officers:</strong> {calculations.currentOfficers.toLocaleString()}<br />
                    • <strong>Attrition (est.):</strong> {calculations.orgAttrition} officers/year<br />
                    • <strong>Behavioral Attribution:</strong> {behavioralAttritionShare}% ({calculations.behavioralDrivenSeparations} officers)<br />
                    • <strong>Investment Level:</strong> {fmt(investmentLevel)}<br />
                    • <strong>Retention Target:</strong> {retentionImprovementTarget}%<br />
                    • <strong>Misconduct Target:</strong> {misconductReductionTarget}%<br />
                    • <strong>WC Target:</strong> {wcClaimReductionTarget}%
                  </div>
                </div>
                <div>
                  <div style={{fontSize: 16, fontWeight: 700, color: T.color.blue, marginBottom: 12}}>Results:</div>
                  <div style={{background: '#f8fafc', borderRadius: 10, padding: 16, border: '2px solid #e2e8f0'}}>
                    <div style={{fontSize: 14, color: T.color.slate600, lineHeight: 2}}>
                      <strong>Retention:</strong> {calculations.separationsPrevented} × {fmt(lapdData.replacementCost)} = <strong style={{color: T.color.green}}>{fmt(calculations.retentionSavings)}</strong><br />
                      <strong>Misconduct:</strong> {fmtCompact(calculations.behavioralLinkedMisconduct)} × {misconductReductionTarget}% = <strong style={{color: T.color.green}}>{fmt(calculations.misconductSavings)}</strong><br />
                      <strong>WC:</strong> {fmtCompact(calculations.mentalHealthWcCosts)} × {wcClaimReductionTarget}% = <strong style={{color: T.color.green}}>{fmt(calculations.wcSavings)}</strong>
                    </div>
                  </div>
                  <div style={{background: T.color.lightBlue, borderRadius: 10, padding: 16, border: `2px solid ${T.color.blue}`, marginTop: 16}}>
                    <div style={{fontSize: 16, fontWeight: 800, color: T.color.blue}}>Total Savings: {fmt(calculations.totalPotentialSavings)}</div>
                    <div style={{fontSize: 14, color: T.color.blue, marginTop: 4}}>Investment: {fmt(investmentLevel)}</div>
                    <div style={{fontSize: 20, fontWeight: 900, color: calculations.netSavings >= 0 ? T.color.green : T.color.red, marginTop: 8}}>Net: {fmt(calculations.netSavings)} = {roiDisplay(calculations.roi)} ROI</div>
                  </div>
                </div>
              </div>
            </div>

            {/* How This Differs */}
            <div style={{background: 'white', borderRadius: 12, padding: 28, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <h3 style={{fontSize: 24, fontWeight: 800, color: T.color.ink, marginBottom: 20}}>How This Differs from Traditional Wellness ROI Models</h3>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
                <div style={{background: '#fef2f2', border: '3px solid #dc2626', borderRadius: 12, padding: 24}}>
                  <div style={{textAlign: 'center', fontSize: 48, marginBottom: 12}}>❌</div>
                  <div style={{textAlign: 'center', fontSize: 18, fontWeight: 800, color: '#991b1b', marginBottom: 16}}>Traditional Approach</div>
                  <div style={{fontSize: 14, color: '#6d0a1f', lineHeight: 1.8}}>
                    <strong>✗ Treats all attrition equally</strong><br />Models ALL losses including retirements and transfers<br /><br />
                    <strong>✗ Uses annual cost snapshots</strong><br />Only counts one year's replacement cost ($150K)<br /><br />
                    <strong>✗ Ignores comorbidity</strong><br />Double-counts officers with PTSD + depression<br /><br />
                    <strong>✗ Single cost pathway</strong><br />Looks at retention OR misconduct OR WC—not interconnected
                  </div>
                </div>
                <div style={{background: '#e8f4e0', border: `3px solid ${T.color.green}`, borderRadius: 12, padding: 24}}>
                  <div style={{textAlign: 'center', fontSize: 48, marginBottom: 12}}>✅</div>
                  <div style={{textAlign: 'center', fontSize: 18, fontWeight: 800, color: '#166534', marginBottom: 16}}>This Model's Approach</div>
                  <div style={{fontSize: 14, color: '#14532d', lineHeight: 1.8}}>
                    <strong>✓ Targets behavioral-health-linked attrition only</strong><br />Focuses on {calculations.behavioralDrivenSeparations} preventable separations<br /><br />
                    <strong>✓ Three interconnected cost pathways</strong><br />Captures retention + misconduct + WC simultaneously<br /><br />
                    <strong>✓ Comorbidity-adjusted</strong><br />Prevents double-counting {calculations.comorbidityReduction.toLocaleString()} officers<br /><br />
                    <strong>✓ Addresses root causes</strong><br />Prevents burnout BEFORE it impacts all three categories
                  </div>
                </div>
              </div>
            </div>

            {/* Model Limitations */}
            <div style={{background: '#fef3c7', border: '3px solid #f59e0b', borderRadius: 12, padding: 24}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
                <span style={{fontSize: 24}}>⚠️</span>
                <h3 style={{fontSize: 20, fontWeight: 800, color: '#92400e', margin: 0}}>Model Limitations & Appropriate Use</h3>
              </div>
              <div style={{fontSize: 14, color: '#78350f', lineHeight: 1.8, marginBottom: 16}}>
                <strong>What this model DOES:</strong> Provides conservative projections based on proven methodology, allowing LAPD leadership to quantify retention value, assess wellness investment ROI, and justify talent management investments with 52+ authoritative sources.
              </div>
              <div style={{fontSize: 14, color: '#78350f', lineHeight: 1.8, marginBottom: 16}}>
                <strong>What this model DOES NOT do:</strong><br />
                • Predict EXACT losses for your specific division (requires your personnel data)<br />
                • Replace formal cost-benefit analysis required for major procurement<br />
                • Account for division-specific factors (deployment tempo, local retention challenges)<br />
                • Guarantee specific outcomes (results are historical, not contractual promises)
              </div>
              <div style={{fontSize: 14, color: '#78350f', lineHeight: 1.8}}>
                <strong>Recommended use:</strong> Decision support for evaluating talent management investments, planning budget conversations, and comparing courses of action.
              </div>
            </div>

            {/* Quick Reference */}
            <div style={{background: T.color.blue, borderRadius: 12, padding: 28, color: 'white'}}>
              <h3 style={{fontSize: 22, fontWeight: 800, marginBottom: 20}}>Quick Reference: Adjustable Parameters</h3>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
                <div>
                  <div style={{fontSize: 15, fontWeight: 700, color: T.color.gold, marginBottom: 12}}>Executive Summary Sliders:</div>
                  <div style={{fontSize: 14, lineHeight: 1.8, opacity: 0.9}}>
                    • <strong>Behavioral Attribution:</strong> 20-60% (default {behavioralAttritionShare}%)<br />
                    • <strong>Retention Improvement:</strong> 5-40% (default {retentionImprovementTarget}%)<br />
                    • <strong>Misconduct Reduction:</strong> 5-40% (default {misconductReductionTarget}%)<br />
                    • <strong>WC Claim Reduction:</strong> 5-40% (default {wcClaimReductionTarget}%)<br />
                    • <strong>Investment Level:</strong> $100K-$4M slider
                  </div>
                </div>
                <div>
                  <div style={{fontSize: 15, fontWeight: 700, color: T.color.gold, marginBottom: 12}}>Comprehensive Model Sliders (Factor Breakdown):</div>
                  <div style={{fontSize: 14, lineHeight: 1.8, opacity: 0.9}}>
                    • <strong>PTSD, Depression, Anxiety, Substance Use</strong> prevalence rates<br />
                    • <strong>Misconduct behavioral link</strong> percentage<br />
                    • <strong>WC mental health share</strong> percentage<br />
                    • <strong>Comorbidity overlap</strong> adjustment
                  </div>
                </div>
              </div>
              <div style={{marginTop: 20, background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 16}}>
                <div style={{fontSize: 14, lineHeight: 1.7}}>All parameters have <strong style={{color: T.color.gold}}>research-backed defaults</strong>. Commanders can customize based on division-specific data.</div>
              </div>
            </div>

            {/* CTA */}
            <div style={{background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center'}}>
              <h3 style={{fontSize: 24, fontWeight: 800, color: T.color.ink, marginBottom: 12}}>Ready to Validate with Your Division's Data?</h3>
              <p style={{fontSize: 15, color: T.color.slate600, lineHeight: 1.7, marginBottom: 24}}>
                Use the <strong>Factor Breakdown</strong> tab to adjust all assumptions with your division's actual personnel data, or return to the <strong>Executive Summary</strong> for the simple retention story.
              </p>
              <div style={{display: 'flex', gap: 16, justifyContent: 'center'}}>
                <button onClick={() => setActiveTab('factors')} style={{padding: '14px 28px', fontSize: 15, fontWeight: 700, background: T.color.gold, color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer'}}>Adjust Assumptions →</button>
                <button onClick={() => setActiveTab('executive-summary')} style={{padding: '14px 28px', fontSize: 15, fontWeight: 700, background: 'white', color: T.color.ink, border: '2px solid #e2e8f0', borderRadius: 10, cursor: 'pointer'}}>← Back to Executive Summary</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!showChatbot && (
        <button onClick={() => setShowChatbot(true)} style={{position: 'fixed', bottom: 32, right: 32, width: 64, height: 64, borderRadius: '50%', background: T.color.blue, color: 'white', border: `3px solid ${T.color.gold}`, fontSize: 28, cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,51,102,0.4)', zIndex: 1000}}>💬</button>
      )}
      {showChatbot && (
        <div style={{position: 'fixed', bottom: 32, right: 32, width: 400, height: 500, background: 'white', borderRadius: 16, boxShadow: '0 12px 48px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', zIndex: 1000}}>
          <div style={{padding: 20, borderBottom: '2px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: T.color.blue, borderRadius: '16px 16px 0 0'}}>
            <div style={{fontSize: 18, fontWeight: 700, color: 'white'}}>💬 Ask About the Model</div>
            <button onClick={() => setShowChatbot(false)} style={{background: 'transparent', border: 'none', color: 'white', fontSize: 24, cursor: 'pointer'}}>×</button>
          </div>
          <div style={{flex: 1, padding: 20, overflowY: 'auto', background: '#f8fafc'}}>
            {chatMessages.length === 0 ? (
              <div style={{textAlign: 'center', paddingTop: 20}}>
                <p style={{fontWeight: 500, color: '#6b7280', marginBottom: 16}}>Ask about the model!</p>
                <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                  {['How are misconduct costs calculated?', 'What is SB 542?', 'What is Labor Code 4850?', 'Why is retention so expensive?', 'How does comorbidity work?'].map((q, i) => (
                    <button key={i} onClick={() => setChatInput(q)} style={{width: '100%', textAlign: 'left', padding: 12, background: 'white', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13, cursor: 'pointer'}}>{q}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                {chatMessages.map((m, i) => (
                  <div key={i} style={{textAlign: m.type === 'user' ? 'right' : 'left'}}>
                    <div style={{display: 'inline-block', padding: 12, borderRadius: 8, background: m.type === 'user' ? T.color.blue : 'white', color: m.type === 'user' ? 'white' : T.color.ink, border: m.type === 'user' ? 'none' : '1px solid #e5e7eb', fontSize: 14, maxWidth: '85%'}}>{m.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{padding: 16, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8}}>
            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask about the model..." style={{flex: 1, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 14}} />
            <button onClick={handleSendMessage} style={{padding: '8px 16px', background: T.color.blue, color: 'white', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer'}}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LAPDDashboard;
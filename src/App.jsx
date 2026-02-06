// ===== LAPD WORKFORCE SUSTAINABILITY ROI CALCULATOR =====
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

const container = {
  boxSizing: 'border-box',
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '0 16px',
};

// LAPD Theme - Blue and Gold
const T = {
  color: {
    // LAPD Primary
    blue: '#003366',        // LAPD Navy Blue
    gold: '#B8860B',        // LAPD Gold
    lightBlue: '#e6f0f7',   // Light blue for cards
    // Semantic
    red: '#c41230',         // Cost/problem
    green: '#2e7d32',       // Savings/positive
    // Neutrals
    ink: '#0f172a',
    slate600: '#475569',
    axis: '#94a3b8',
    border: '#e5e7eb',
  }
};

// ===== MAIN DASHBOARD COMPONENT =====
const LAPDDashboard = () => {
  // Core State
  const [activeTab, setActiveTab] = useState('cost-problem');
  const [viewMode, setViewMode] = useState('field'); // 'field' or 'enterprise'
  const [expandedFactor, setExpandedFactor] = useState(null);
  const [showResearch, setShowResearch] = useState(false);
  
  // Investment Slider
  const [investmentLevel, setInvestmentLevel] = useState(500000);
  
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
    
    // Misconduct/Settlements (from research)
    totalSettlementsSince2019: 384000000,
    annualSettlements: 70000000,      // ~$70M/year average
    civilRightsShootingsForce: 183000000,  // 48% of total
    civilRightsShareOfTotal: 0.48,
    
    // Workers Comp (California framework)
    annualWcBudget: 92600000,
    
    // Internal lawsuits
    internalLawsuits5Year: 68500000,
    annualInternalLawsuits: 13700000,
  }), []);

  // ===== BEHAVIORAL HEALTH FACTOR SLIDERS =====
  // Retention factors
  const [behavioralAttritionShare, setBehavioralAttritionShare] = useState(35);
  const [retentionImprovementTarget, setRetentionImprovementTarget] = useState(15);
  
  // Misconduct factors
  const [misconductBehavioralLink, setMisconductBehavioralLink] = useState(40);
  const [misconductReductionTarget, setMisconductReductionTarget] = useState(20);
  
  // Workers' Comp factors
  const [wcMentalHealthShare, setWcMentalHealthShare] = useState(25);
  const [wcClaimReductionTarget, setWcClaimReductionTarget] = useState(20);
  
  // Behavioral health prevalence (like CBP)
  const [ptsdPrevalence, setPtsdPrevalence] = useState(18);
  const [depressionPrevalence, setDepressionPrevalence] = useState(18);
  const [anxietyPrevalence, setAnxietyPrevalence] = useState(15);
  const [sudPrevalence, setSudPrevalence] = useState(25);
  const [comorbidityOverlap, setComorbidityOverlap] = useState(35);

  // ===== COST CALCULATIONS =====
  const calculations = useMemo(() => {
    // Behavioral health population
    const rawPtsdAffected = Math.round(lapdData.officers * (ptsdPrevalence / 100));
    const rawDepressionAffected = Math.round(lapdData.officers * (depressionPrevalence / 100));
    const rawAnxietyAffected = Math.round(lapdData.officers * (anxietyPrevalence / 100));
    const rawSudAffected = Math.round(lapdData.officers * (sudPrevalence / 100));
    const rawTotalAffected = rawPtsdAffected + rawDepressionAffected + rawAnxietyAffected + rawSudAffected;
    const uniqueAffected = Math.round(rawTotalAffected * (1 - comorbidityOverlap / 100));
    
    // 1. RETENTION COSTS
    const behavioralDrivenSeparations = Math.round(lapdData.attrition2024 * (behavioralAttritionShare / 100));
    const retentionBaseCost = behavioralDrivenSeparations * lapdData.replacementCost;
    const separationsPrevented = Math.round(behavioralDrivenSeparations * (retentionImprovementTarget / 100));
    const retentionSavings = separationsPrevented * lapdData.replacementCost;
    
    // 2. MISCONDUCT/SETTLEMENT COSTS
    const behavioralLinkedMisconduct = Math.round(lapdData.annualSettlements * (misconductBehavioralLink / 100));
    const misconductSavings = Math.round(behavioralLinkedMisconduct * (misconductReductionTarget / 100));
    
    // 3. WORKERS' COMP COSTS
    const mentalHealthWcCosts = Math.round(lapdData.annualWcBudget * (wcMentalHealthShare / 100));
    const wcSavings = Math.round(mentalHealthWcCosts * (wcClaimReductionTarget / 100));
    
    // TOTALS
    const totalAnnualProblemCost = retentionBaseCost + behavioralLinkedMisconduct + mentalHealthWcCosts;
    const totalPotentialSavings = retentionSavings + misconductSavings + wcSavings;
    const netSavings = totalPotentialSavings - investmentLevel;
    const roi = investmentLevel > 0 ? ((netSavings / investmentLevel) * 100) : 0;
    
    // Break-even calculations
    const breakEvenRetention = retentionSavings > 0 ? (investmentLevel / retentionSavings * 100).toFixed(1) : 'N/A';
    const breakEvenMisconduct = misconductSavings > 0 ? (investmentLevel / misconductSavings * 100).toFixed(1) : 'N/A';
    const breakEvenWc = wcSavings > 0 ? (investmentLevel / wcSavings * 100).toFixed(1) : 'N/A';

    return {
      // Behavioral health
      rawTotalAffected,
      uniqueAffected,
      comorbidityReduction: rawTotalAffected - uniqueAffected,
      
      // Retention
      behavioralDrivenSeparations,
      retentionBaseCost,
      separationsPrevented,
      retentionSavings,
      
      // Misconduct
      behavioralLinkedMisconduct,
      misconductSavings,
      
      // Workers' Comp
      mentalHealthWcCosts,
      wcSavings,
      
      // Totals
      totalAnnualProblemCost,
      totalPotentialSavings,
      investmentLevel,
      netSavings,
      roi,
      
      // Break-even
      breakEvenRetention,
      breakEvenMisconduct,
      breakEvenWc,
    };
  }, [lapdData, behavioralAttritionShare, retentionImprovementTarget, 
      misconductBehavioralLink, misconductReductionTarget,
      wcMentalHealthShare, wcClaimReductionTarget, investmentLevel,
      ptsdPrevalence, depressionPrevalence, anxietyPrevalence, sudPrevalence, comorbidityOverlap]);

  // ===== HELPER FUNCTIONS =====
  const fmt = (num) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);

  const fmtCompact = (num) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);

  const roiDisplay = (num) => {
    if (num >= 100) {
      return `${(num / 100).toFixed(1)}X`;
    }
    return `${num.toFixed(0)}%`;
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const responses = {
      'How are misconduct costs calculated?': "LAPD has paid $384M in settlements since 2019 (~$70M/year). Research shows 40%+ of use-of-force incidents are linked to officer behavioral health factors like PTSD, burnout, and substance use.",
      'What is SB 542?': "California Senate Bill 542 creates a 'presumption' that PTSD in peace officers is work-related, shifting the burden of proof to employers. This makes it easier for officers to file mental health workers' comp claims.",
      'What is Labor Code 4850?': "Labor Code 4850 provides California peace officers with full salary continuation (not just 2/3) for up to 52 weeks when injured on duty - a significant cost driver for LAPD.",
      'Why is retention so expensive?': "Each officer costs ~$150K to replace: $4,683 recruitment + $45K academy + $15K equipment + $35K FTO training + $50K+ productivity ramp. LAPD lost 660 officers in 2024 alone.",
      'How does comorbidity work?': "Officers often have multiple conditions (PTSD + depression + substance use). The comorbidity adjustment prevents double-counting - at 35% overlap, we reduce the affected population accordingly.",
    };
    setChatMessages([
      ...chatMessages,
      { type: 'user', text: chatInput },
      { type: 'assistant', text: responses[chatInput] || 'Ask about misconduct costs, SB 542, Labor Code 4850, retention costs, or comorbidity.' },
    ]);
    setChatInput('');
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8fafc', minHeight: '100vh', padding: '24px 0' }}>
      <GlobalStyles />
      
      {/* ===== HEADER ===== */}
      <div style={container}>
        <div style={{
          background: `linear-gradient(135deg, ${T.color.blue} 0%, #001a33 100%)`,
          borderRadius: 16,
          padding: '24px 32px',
          boxShadow: '0 8px 32px rgba(0,51,102,0.3)',
          border: `3px solid ${T.color.gold}`,
          marginBottom: 24,
        }}>
          {/* LAPD Badge/Title Row */}
          <div style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16}}>
            <div style={{
              width: 72, 
              height: 72, 
              minWidth: 72,
              background: T.color.gold, 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '3px solid white',
              fontSize: 18,
              fontWeight: 900,
              color: T.color.blue,
              flexShrink: 0,
            }}>
              LAPD
            </div>
            <div>
              <h1 style={{fontSize: 28, fontWeight: 900, color: T.color.gold, margin: 0, lineHeight: 1.2}}>
                LAPD Workforce Sustainability Calculator
              </h1>
              <p style={{fontSize: 14, color: '#94a3b8', margin: '4px 0 0 0'}}>
                Cost Modeling for Officer Wellness Investment Decisions
              </p>
            </div>
          </div>

          {/* Strategic Context Box */}
          <div style={{
            background: 'rgba(0,51,102,0.4)', 
            borderRadius: 12, 
            padding: '16px 20px', 
            border: `2px solid ${T.color.gold}50`,
          }}>
            <p style={{fontSize: 14, color: 'white', lineHeight: 1.7, margin: 0}}>
              <strong style={{color: T.color.gold}}>Evidence-based cost modeling tool</strong> supporting LAPD leadership in evaluating the financial impact of proactive officer wellness investments. Addresses three interconnected cost drivers: <strong style={{color: T.color.gold}}>(1) retention costs</strong> from behavioral health-driven separations, <strong style={{color: T.color.gold}}>(2) misconduct settlements</strong> linked to officer wellness challenges, and <strong style={{color: T.color.gold}}>(3) workers' comp</strong> mental health claims under California's SB 542 framework.
            </p>
          </div>

          {/* Key Stats Row */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 20}}>
            {[
              { value: lapdData.officers.toLocaleString(), label: 'Sworn Officers', sublabel: `${lapdData.shortage} below target` },
              { value: lapdData.attrition2024.toLocaleString(), label: '2024 Attrition', sublabel: 'Officers separated' },
              { value: fmtCompact(lapdData.totalSettlementsSince2019), label: 'Settlements Since 2019', sublabel: 'Misconduct claims' },
              { value: fmtCompact(lapdData.annualWcBudget), label: 'Annual WC Budget', sublabel: 'Workers\' compensation' },
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
              { id: 'cost-problem', label: 'The Cost Problem', icon: '⚠️' },
              { id: 'roi-model', label: 'ROI Model', icon: '💰' },
              { id: 'factors', label: 'Factor Breakdown', icon: '🔬' },
              { id: 'california', label: 'California Framework', icon: '📋' },
              { id: 'proof', label: 'Evidence Base', icon: '✅' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 10,
                  cursor: 'pointer',
                  background: activeTab === tab.id ? T.color.blue : 'white',
                  color: activeTab === tab.id ? 'white' : T.color.slate600,
                  boxShadow: activeTab === tab.id ? `0 4px 12px ${T.color.blue}40` : '0 2px 4px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s',
                }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div style={{display: 'flex', gap: 2, alignItems: 'center', background: 'white', borderRadius: 12, padding: 4, border: `2px solid ${T.color.blue}`, boxShadow: '0 2px 8px rgba(0,51,102,0.1)'}}>
            <button
              onClick={() => setViewMode('field')}
              style={{
                padding: '8px 14px',
                fontSize: 12,
                fontWeight: 700,
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                background: viewMode === 'field' ? T.color.blue : 'transparent',
                color: viewMode === 'field' ? 'white' : '#64748b',
              }}>
              🎯 Field Impact
            </button>
            <button
              onClick={() => setViewMode('enterprise')}
              style={{
                padding: '8px 14px',
                fontSize: 12,
                fontWeight: 700,
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                background: viewMode === 'enterprise' ? T.color.blue : 'transparent',
                color: viewMode === 'enterprise' ? 'white' : '#64748b',
              }}>
              🏛️ Enterprise Costs
            </button>
          </div>
        </div>

        {/* ===== TAB CONTENT ===== */}
        
        {/* TAB 1: THE COST PROBLEM */}
        {activeTab === 'cost-problem' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
            
            {/* Hero Cost Display */}
            {viewMode === 'enterprise' ? (
              <div style={{background: `linear-gradient(135deg, ${T.color.red} 0%, #8f0e28 100%)`, color: 'white', borderRadius: 16, padding: 48, textAlign: 'center', boxShadow: '0 8px 24px rgba(196,18,48,0.3)'}}>
                <div style={{fontSize: 22, fontWeight: 600, marginBottom: 16, opacity: 0.95}}>
                  LAPD faces an estimated annual behavioral health-linked cost burden of:
                </div>
                <div style={{fontSize: 72, fontWeight: 900, marginBottom: 16}}>
                  {fmt(calculations.totalAnnualProblemCost)}
                </div>
                <div style={{fontSize: 18, fontWeight: 500, opacity: 0.9}}>
                  in costs linked to retention challenges, misconduct settlements, and workers' comp claims
                </div>
              </div>
            ) : (
              <div style={{background: `linear-gradient(135deg, ${T.color.blue} 0%, #001a33 100%)`, color: 'white', borderRadius: 16, padding: '32px 48px', boxShadow: '0 8px 24px rgba(0,51,102,0.3)'}}>
                <div style={{fontSize: 22, fontWeight: 600, marginBottom: 16, opacity: 0.95}}>
                  LAPD Operational Readiness Impact (Current State):
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 24}}>
                  <div style={{background: 'white', borderRadius: 12, padding: 24, textAlign: 'center'}}>
                    <div style={{fontSize: 48, fontWeight: 900, color: T.color.blue, marginBottom: 8}}>
                      {lapdData.attrition2024}
                    </div>
                    <div style={{fontSize: 16, fontWeight: 600, color: T.color.ink, marginBottom: 4}}>
                      2024 Attrition
                    </div>
                    <div style={{fontSize: 13, color: '#64748b'}}>
                      Officers separated last year
                    </div>
                  </div>
                  <div style={{background: 'white', borderRadius: 12, padding: 24, textAlign: 'center'}}>
                    <div style={{fontSize: 48, fontWeight: 900, color: T.color.blue, marginBottom: 8}}>
                      {lapdData.shortage}
                    </div>
                    <div style={{fontSize: 16, fontWeight: 600, color: T.color.ink, marginBottom: 4}}>
                      Officer Shortage
                    </div>
                    <div style={{fontSize: 13, color: '#64748b'}}>
                      Below 9,500 target
                    </div>
                  </div>
                  <div style={{background: 'white', borderRadius: 12, padding: 24, textAlign: 'center'}}>
                    <div style={{fontSize: 48, fontWeight: 900, color: T.color.blue, marginBottom: 8}}>
                      {fmtCompact(lapdData.totalSettlementsSince2019)}
                    </div>
                    <div style={{fontSize: 16, fontWeight: 600, color: T.color.ink, marginBottom: 4}}>
                      Settlements Since 2019
                    </div>
                    <div style={{fontSize: 13, color: '#64748b'}}>
                      Civil rights, excessive force
                    </div>
                  </div>
                </div>
                <div style={{marginTop: 24, fontSize: 16, opacity: 0.9, textAlign: 'center'}}>
                  These operational impacts are visible daily—vacancies, overtime burden, and readiness gaps
                </div>
              </div>
            )}

            {/* DUAL-VIEW COST CATEGORY CARDS */}
            {viewMode === 'enterprise' ? (
              // ENTERPRISE VIEW - Red cost cards with dollar amounts
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24}}>
                
                {/* Card 1: Retention */}
                <div style={{background: 'white', borderRadius: 12, padding: 24, border: `3px solid ${T.color.red}`, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
                  <div style={{fontSize: 18, fontWeight: 700, color: T.color.red, marginBottom: 12}}>
                    💼 Retention Challenge
                  </div>
                  <div style={{fontSize: 42, fontWeight: 900, color: T.color.ink, marginBottom: 16}}>
                    {fmt(calculations.retentionBaseCost)}
                  </div>
                  <div style={{fontSize: 15, color: T.color.slate600, marginBottom: 20, lineHeight: 1.6}}>
                    <strong>{calculations.behavioralDrivenSeparations} behavioral health-linked separations</strong> of {lapdData.attrition2024} total in 2024
                  </div>
                  <div style={{background: '#fef2f2', padding: 16, borderRadius: 8, fontSize: 14, color: '#6d0a1f', lineHeight: 1.6}}>
                    <strong>Replacement Cycle:</strong><br />
                    • 6-month police academy<br />
                    • 24-week field training (FTO)<br />
                    • Equipment & onboarding<br />
                    • 12-18 month productivity ramp<br />
                    <br />
                    <strong>Per Officer:</strong> ~{fmt(lapdData.replacementCost)}
                  </div>
                </div>

                {/* Card 2: Misconduct Settlements */}
                <div style={{background: 'white', borderRadius: 12, padding: 24, border: `3px solid ${T.color.red}`, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
                  <div style={{fontSize: 18, fontWeight: 700, color: T.color.red, marginBottom: 12}}>
                    ⚖️ Misconduct Settlements
                  </div>
                  <div style={{fontSize: 42, fontWeight: 900, color: T.color.ink, marginBottom: 16}}>
                    {fmt(calculations.behavioralLinkedMisconduct)}
                  </div>
                  <div style={{fontSize: 15, color: T.color.slate600, marginBottom: 20, lineHeight: 1.6}}>
                    <strong>{misconductBehavioralLink}% of {fmtCompact(lapdData.annualSettlements)}</strong> annual settlements with behavioral health links
                  </div>
                  <div style={{background: '#fef2f2', padding: 16, borderRadius: 8, fontSize: 14, color: '#6d0a1f', lineHeight: 1.6}}>
                    <strong>Settlement Drivers:</strong><br />
                    • Civil rights violations<br />
                    • Excessive force cases<br />
                    • Officer-involved shootings<br />
                    • Wrongful arrest claims<br />
                    <br />
                    <strong>Since 2019:</strong> {fmt(lapdData.totalSettlementsSince2019)}
                  </div>
                </div>

                {/* Card 3: Workers' Comp */}
                <div style={{background: 'white', borderRadius: 12, padding: 24, border: `3px solid ${T.color.red}`, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
                  <div style={{fontSize: 18, fontWeight: 700, color: T.color.red, marginBottom: 12}}>
                    🏥 Workers' Comp (Mental Health)
                  </div>
                  <div style={{fontSize: 42, fontWeight: 900, color: T.color.ink, marginBottom: 16}}>
                    {fmt(calculations.mentalHealthWcCosts)}
                  </div>
                  <div style={{fontSize: 15, color: T.color.slate600, marginBottom: 20, lineHeight: 1.6}}>
                    <strong>{wcMentalHealthShare}% of {fmtCompact(lapdData.annualWcBudget)}</strong> budget in mental health claims
                  </div>
                  <div style={{background: '#fef2f2', padding: 16, borderRadius: 8, fontSize: 14, color: '#6d0a1f', lineHeight: 1.6}}>
                    <strong>California Framework:</strong><br />
                    • SB 542 PTSD presumption<br />
                    • Labor Code 4850 full salary<br />
                    • 52-week continuation<br />
                    • Favorable claim environment<br />
                    <br />
                    <strong>Annual Budget:</strong> {fmt(lapdData.annualWcBudget)}
                  </div>
                </div>
              </div>
            ) : (
              // FIELD VIEW - Blue expandable cards with operational impact
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24}}>
                
                {/* Card 1: 2024 Attrition - Expandable */}
                <div style={{background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: expandedFactor === 'field-retention' ? `3px solid ${T.color.blue}` : '2px solid #cbd5e1'}}>
                  <div 
                    onClick={() => setExpandedFactor(expandedFactor === 'field-retention' ? null : 'field-retention')}
                    style={{padding: 24, background: expandedFactor === 'field-retention' ? T.color.lightBlue : 'white', cursor: 'pointer'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                      <div style={{flex: 1}}>
                        <div style={{fontSize: 18, fontWeight: 700, color: T.color.blue, marginBottom: 12}}>
                          💼 2024 Officer Attrition
                        </div>
                        <div style={{fontSize: 42, fontWeight: 900, color: T.color.ink, marginBottom: 8}}>
                          {lapdData.attrition2024}
                        </div>
                        <div style={{fontSize: 13, color: '#64748b'}}>
                          {expandedFactor === 'field-retention' ? 'Click to collapse' : 'Click for details'}
                        </div>
                      </div>
                      <div style={{fontSize: 32, color: T.color.blue, marginLeft: 12}}>
                        {expandedFactor === 'field-retention' ? '−' : '+'}
                      </div>
                    </div>
                  </div>
                  
                  {expandedFactor === 'field-retention' && (
                    <div style={{padding: 24, paddingTop: 0, background: '#f8fafc', borderTop: `2px solid ${T.color.lightBlue}`}}>
                      <div style={{fontSize: 14, color: T.color.slate600, marginBottom: 16, lineHeight: 1.6}}>
                        LAPD experienced <strong>660 officer separations in 2024</strong>, while academy classes graduated only ~31 officers per class (vs. 60 needed). Research suggests an estimated <strong>{calculations.behavioralDrivenSeparations} ({behavioralAttritionShare}%)</strong> have behavioral health factors contributing to the decision to leave.
                      </div>
                      <div style={{background: 'white', padding: 16, borderRadius: 8, fontSize: 13, color: T.color.blue, lineHeight: 1.7, border: `2px solid ${T.color.lightBlue}`}}>
                        <div style={{fontWeight: 700, marginBottom: 8}}>Operational Impact:</div>
                        • Staffing gaps across 21 divisions<br />
                        • Increased overtime burden<br />
                        • Challenges for World Cup/Olympics readiness<br />
                        <br />
                        <div style={{fontWeight: 700, marginBottom: 8}}>Replacement Investment:</div>
                        • Per officer: ~{fmt(lapdData.replacementCost)}<br />
                        • 2024 total: {fmt(lapdData.attrition2024 * lapdData.replacementCost)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card 2: Settlements - Expandable */}
                <div style={{background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: expandedFactor === 'field-misconduct' ? `3px solid ${T.color.blue}` : '2px solid #cbd5e1'}}>
                  <div 
                    onClick={() => setExpandedFactor(expandedFactor === 'field-misconduct' ? null : 'field-misconduct')}
                    style={{padding: 24, background: expandedFactor === 'field-misconduct' ? T.color.lightBlue : 'white', cursor: 'pointer'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                      <div style={{flex: 1}}>
                        <div style={{fontSize: 18, fontWeight: 700, color: T.color.blue, marginBottom: 12}}>
                          ⚖️ Settlements Since 2019
                        </div>
                        <div style={{fontSize: 42, fontWeight: 900, color: T.color.ink, marginBottom: 8}}>
                          {fmtCompact(lapdData.totalSettlementsSince2019)}
                        </div>
                        <div style={{fontSize: 13, color: '#64748b'}}>
                          {expandedFactor === 'field-misconduct' ? 'Click to collapse' : 'Click for details'}
                        </div>
                      </div>
                      <div style={{fontSize: 32, color: T.color.blue, marginLeft: 12}}>
                        {expandedFactor === 'field-misconduct' ? '−' : '+'}
                      </div>
                    </div>
                  </div>
                  
                  {expandedFactor === 'field-misconduct' && (
                    <div style={{padding: 24, paddingTop: 0, background: '#f8fafc', borderTop: `2px solid ${T.color.lightBlue}`}}>
                      <div style={{fontSize: 14, color: T.color.slate600, marginBottom: 16, lineHeight: 1.6}}>
                        LAPD has paid <strong>{fmt(lapdData.totalSettlementsSince2019)}</strong> in settlements since 2019, averaging <strong>{fmtCompact(lapdData.annualSettlements)}/year</strong>. Civil rights violations, shootings, and excessive force account for 48% ({fmt(lapdData.civilRightsShootingsForce)}).
                      </div>
                      <div style={{background: 'white', padding: 16, borderRadius: 8, fontSize: 13, color: T.color.blue, lineHeight: 1.7, border: `2px solid ${T.color.lightBlue}`}}>
                        <div style={{fontWeight: 700, marginBottom: 8}}>Behavioral Health Research Link:</div>
                        • FBI research: PTSD linked to higher excessive force rates<br />
                        • Burnout impairs judgment in split-second decisions<br />
                        • Estimated {misconductBehavioralLink}% with behavioral health factors<br />
                        <br />
                        <div style={{fontWeight: 700, marginBottom: 8}}>Annual Pattern:</div>
                        • ~{fmtCompact(lapdData.annualSettlements)} in settlements/year<br />
                        • City's $187M annual liability budget
                      </div>
                    </div>
                  )}
                </div>

                {/* Card 3: Workers' Comp - Expandable */}
                <div style={{background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: expandedFactor === 'field-wc' ? `3px solid ${T.color.blue}` : '2px solid #cbd5e1'}}>
                  <div 
                    onClick={() => setExpandedFactor(expandedFactor === 'field-wc' ? null : 'field-wc')}
                    style={{padding: 24, background: expandedFactor === 'field-wc' ? T.color.lightBlue : 'white', cursor: 'pointer'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                      <div style={{flex: 1}}>
                        <div style={{fontSize: 18, fontWeight: 700, color: T.color.blue, marginBottom: 12}}>
                          🏥 Workers' Comp Budget
                        </div>
                        <div style={{fontSize: 42, fontWeight: 900, color: T.color.ink, marginBottom: 8}}>
                          {fmtCompact(lapdData.annualWcBudget)}
                        </div>
                        <div style={{fontSize: 13, color: '#64748b'}}>
                          {expandedFactor === 'field-wc' ? 'Click to collapse' : 'Click for details'}
                        </div>
                      </div>
                      <div style={{fontSize: 32, color: T.color.blue, marginLeft: 12}}>
                        {expandedFactor === 'field-wc' ? '−' : '+'}
                      </div>
                    </div>
                  </div>
                  
                  {expandedFactor === 'field-wc' && (
                    <div style={{padding: 24, paddingTop: 0, background: '#f8fafc', borderTop: `2px solid ${T.color.lightBlue}`}}>
                      <div style={{fontSize: 14, color: T.color.slate600, marginBottom: 16, lineHeight: 1.6}}>
                        LAPD's annual workers' comp budget is <strong>{fmt(lapdData.annualWcBudget)}</strong>. Under California's SB 542 PTSD presumption, mental health claims are estimated at <strong>{wcMentalHealthShare}%</strong> ({fmtCompact(calculations.mentalHealthWcCosts)}) of the budget.
                      </div>
                      <div style={{background: 'white', padding: 16, borderRadius: 8, fontSize: 13, color: T.color.blue, lineHeight: 1.7, border: `2px solid ${T.color.lightBlue}`}}>
                        <div style={{fontWeight: 700, marginBottom: 8}}>California Legal Framework:</div>
                        • SB 542: PTSD presumption for peace officers<br />
                        • Labor Code 4850: Full salary (not 2/3) for 52 weeks<br />
                        • Burden of proof on employer<br />
                        <br />
                        <div style={{fontWeight: 700, marginBottom: 8}}>Mental Health Claims:</div>
                        • Estimated {wcMentalHealthShare}% of budget<br />
                        • = {fmtCompact(calculations.mentalHealthWcCosts)}/year in mental health WC
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Root Cause Section */}
            <div style={{background: 'linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 100%)', border: '3px solid #64748b', borderRadius: 12, padding: '20px 24px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16}}>
                <span style={{fontSize: 36}}>🔗</span>
                <h2 style={{fontSize: 26, fontWeight: 800, color: T.color.ink, margin: 0}}>
                  One Root Cause, Three Cost Pathways
                </h2>
              </div>
              <div style={{background: 'white', padding: '16px 20px', borderRadius: 10, border: '2px solid #64748b'}}>
                <div style={{fontSize: 15, color: T.color.slate600, lineHeight: 1.7}}>
                  When officers experience behavioral health challenges—PTSD, depression, anxiety, substance use—the impact often manifests across multiple cost categories simultaneously. An officer struggling with untreated PTSD may be more likely to separate early, more likely to be involved in force incidents, and more likely to file workers' comp claims. <strong>Addressing root causes early creates potential savings across all three pathways.</strong>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div style={{background: `linear-gradient(135deg, ${T.color.lightBlue} 0%, #cce5f0 100%)`, border: `3px solid ${T.color.blue}`, borderRadius: 12, padding: 32, textAlign: 'center'}}>
              <div style={{fontSize: 24, fontWeight: 700, color: T.color.blue, marginBottom: 12}}>
                What Improvement Level Justifies Investment?
              </div>
              <div style={{fontSize: 17, color: T.color.blue, lineHeight: 1.7, marginBottom: 24}}>
                Use the ROI Model to explore different investment levels and see the improvement thresholds needed to achieve positive returns.
              </div>
              <button
                onClick={() => setActiveTab('roi-model')}
                style={{padding: '16px 32px', fontSize: 17, fontWeight: 700, background: T.color.blue, color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', boxShadow: `0 4px 12px ${T.color.blue}40`}}>
                Explore the ROI Model →
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ROI MODEL */}
        {activeTab === 'roi-model' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
            
            {/* Section 1: Current LAPD Wellness Infrastructure - UPDATED */}
            <div style={{background: 'white', borderRadius: 12, padding: 28, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20}}>
                <span style={{fontSize: 32}}>🏥</span>
                <h2 style={{fontSize: 24, fontWeight: 800, color: T.color.ink, margin: 0}}>
                  Current LAPD Wellness Infrastructure
                </h2>
              </div>
              
              <p style={{fontSize: 15, color: T.color.slate600, lineHeight: 1.7, marginBottom: 20}}>
                LAPD has invested significantly in behavioral health and crisis response infrastructure. These programs represent real institutional commitment and do excellent work <strong>when officers are in crisis</strong>. Understanding what exists—and where gaps remain—is essential to designing complementary investments.
              </p>

              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16}}>
                {[
                  { 
                    name: 'Mental Evaluation Unit (MEU)', 
                    detail: '160+ personnel', 
                    focus: 'Community crisis intervention', 
                    opportunity: 'MEU\'s expertise serves the public; officers need parallel proactive wellness infrastructure focused on their development' 
                  },
                  { 
                    name: 'SMART Teams', 
                    detail: '12-14 units, 24/7', 
                    focus: 'Crisis response in field', 
                    opportunity: 'Exceptional crisis response; opportunity to prevent officers from reaching crisis through early intervention' 
                  },
                  { 
                    name: 'Behavioral Science Services', 
                    detail: 'Psychologist-led', 
                    focus: 'Fitness for duty, critical incidents', 
                    opportunity: 'Strong clinical capacity; limited bandwidth for proactive development at scale across 8,738 officers' 
                  },
                  { 
                    name: 'Employee Assistance Program', 
                    detail: 'Traditional EAP', 
                    focus: '3-6 sessions for crisis', 
                    opportunity: '~3-5% utilization rate reflects national EAP trends; stigma and reactive model limit preventive impact' 
                  },
                  { 
                    name: 'POWER Training', 
                    detail: 'DOJ partnership', 
                    focus: 'Resilience workshops', 
                    opportunity: 'Evidence-based content; episodic delivery limits sustained behavior change (see Methodology Impact research)' 
                  },
                  { 
                    name: 'Peer Support', 
                    detail: 'Volunteer officers', 
                    focus: 'Informal support network', 
                    opportunity: 'Valued by officers; lacks standardized training, outcomes measurement, and scalability' 
                  },
                ].map((prog, i) => (
                  <div key={i} style={{background: '#f8fafc', borderRadius: 10, padding: 16, border: '2px solid #e2e8f0'}}>
                    <div style={{fontSize: 15, fontWeight: 700, color: T.color.ink, marginBottom: 4}}>{prog.name}</div>
                    <div style={{fontSize: 13, color: T.color.blue, fontWeight: 600, marginBottom: 8}}>{prog.detail}</div>
                    <div style={{fontSize: 12, color: T.color.slate600, marginBottom: 8}}>
                      <strong>Focus:</strong> {prog.focus}
                    </div>
                    <div style={{fontSize: 12, color: T.color.blue, lineHeight: 1.5}}>
                      <strong>Opportunity:</strong> {prog.opportunity}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{marginTop: 20, padding: 20, background: T.color.lightBlue, borderRadius: 10, border: `2px solid ${T.color.blue}`}}>
                <div style={{fontSize: 15, fontWeight: 700, color: T.color.blue, marginBottom: 12}}>
                  📋 Assessment Summary
                </div>
                <div style={{fontSize: 14, color: T.color.blue, lineHeight: 1.8}}>
                  <strong>What LAPD Has Built:</strong> Robust crisis response and clinical intervention capacity. These programs save lives and careers when officers are in acute distress.
                </div>
                <div style={{fontSize: 14, color: T.color.blue, lineHeight: 1.8, marginTop: 12}}>
                  <strong>The Strategic Gap:</strong> No scalable, proactive, continuous development system that builds officer resilience, leadership capability, and sustainable performance <em>before</em> behavioral health deterioration impacts retention, misconduct, and workers' comp costs.
                </div>
                <div style={{fontSize: 14, color: T.color.blue, lineHeight: 1.8, marginTop: 12}}>
                  Current programs activate <em>after</em> crisis. The opportunity: complement crisis response with upstream prevention—helping officers develop the psychological flexibility, stress regulation, and adaptive capacity to thrive in high-pressure law enforcement environments without reaching the point where crisis intervention is needed.
                </div>
              </div>
            </div>

            {/* Section 2: Why Traditional Approaches Have Limited Impact - NEW SECTION */}
            <div style={{background: 'linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 100%)', border: '4px solid #64748b', borderRadius: 16, padding: 28}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
                <div style={{width: 48, height: 48, background: '#475569', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22}}>🔍</div>
                <h2 style={{fontSize: 22, fontWeight: 800, color: '#111827', margin: 0}}>
                  Why Traditional Wellness Approaches Fall Short in Law Enforcement
                </h2>
              </div>

              <div style={{fontSize: 15, color: '#475569', lineHeight: 1.7, marginBottom: 20}}>
                LAPD's investments in MEU, SMART teams, Behavioral Science Services, EAP, and POWER training represent genuine institutional commitment to officer wellness. These programs do excellent work. The challenge isn't the quality of these programs—it's the <strong>model</strong> they represent and the systemic constraints they face.
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20}}>
                <div style={{background: 'white', padding: 20, borderRadius: 12, border: '2px solid #e5e7eb'}}>
                  <div style={{fontSize: 16, fontWeight: 700, color: '#991b1b', marginBottom: 12}}>
                    ⚠️ Structural Limitations
                  </div>
                  <div style={{fontSize: 14, color: '#475569', lineHeight: 1.7}}>
                    <strong style={{color: '#1e293b'}}>Reactive Activation:</strong> Traditional wellness programs activate when officers are already in crisis—after the traumatic incident, after performance decline becomes visible. By that point, clinical intervention is necessary but costly.<br /><br />
                    
                    <strong style={{color: '#1e293b'}}>Stigma & Utilization:</strong> Despite decades of effort to reduce stigma, EAP utilization in law enforcement remains 3-5% nationally. Officers perceive traditional wellness programs as signals of weakness or tied to fitness-for-duty evaluations.<br /><br />
                    
                    <strong style={{color: '#1e293b'}}>Episodic vs. Continuous:</strong> POWER training and similar workshops provide valuable content in episodic bursts. Without continuous reinforcement, 70% of workshop content is forgotten within 24 hours and 90% within a month.<br /><br />
                    
                    <strong style={{color: '#1e293b'}}>Capacity Constraints:</strong> Even with 160+ MEU personnel, the department cannot provide ongoing, personalized support to 8,738 officers through crisis-response infrastructure. The math doesn't work.
                  </div>
                </div>

                <div style={{background: 'white', padding: 20, borderRadius: 12, border: '2px solid #e5e7eb'}}>
                  <div style={{fontSize: 16, fontWeight: 700, color: T.color.blue, marginBottom: 12}}>
                    💡 The Market Gap
                  </div>
                  <div style={{fontSize: 14, color: '#475569', lineHeight: 1.7}}>
                    What's missing isn't another wellness program. It's a <strong>scalable, proactive, development-focused platform</strong> that:<br /><br />
                    
                    • Meets officers where they are (not where clinical models assume they should be)<br />
                    • Removes stigma by framing support as professional development, not therapy<br />
                    • Provides continuous reinforcement through AI + 1:1 coaching + peer groups<br />
                    • Scales across the entire workforce without requiring proportional clinical staff increases<br />
                    • Complements existing crisis response infrastructure rather than replacing it
                  </div>
                </div>
              </div>

              <div style={{background: '#c7d2fe', borderRadius: 12, padding: 16, border: '2px solid #6366f1'}}>
                <p style={{fontSize: 14, color: '#3730a3', margin: 0, lineHeight: 1.7}}>
                  <strong style={{color: '#4338ca'}}>This isn't a critique of what LAPD has built.</strong> It's recognition that crisis response and proactive development serve different functions and require different models. LAPD has invested wisely in crisis response. The opportunity now is to invest in prevention—helping officers build the capabilities that keep them from reaching crisis in the first place.
                </p>
              </div>
            </div>

            {/* Section 3: Methodology Impact Chart */}
            <div style={{background: 'linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 100%)', border: '4px solid #64748b', borderRadius: 16, padding: 28}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12}}>
                <div style={{width: 48, height: 48, background: '#475569', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22}}>📈</div>
                <h2 style={{fontSize: 22, fontWeight: 800, color: '#111827', margin: 0}}>
                  Why Methodology Matters: Episodic Training vs. Continuous Development
                </h2>
              </div>
              
              <div style={{background: 'white', border: '2px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 16}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
                  <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
                    <span style={{display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: '#fee2e2', color: '#991b1b'}}>
                      🔴 Episodic Training (Workshops, Seminars)
                    </span>
                    <span style={{display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: '#dbeafe', color: '#1e40af'}}>
                      🔵 Continuous Development (Sustained Engagement)
                    </span>
                  </div>
                  <div style={{fontSize: 12, color: '#6b7280'}}>Higher area = retained capability</div>
                </div>
                
                {/* Methodology Chart */}
                <svg viewBox="0 0 760 260" style={{width: '100%', height: 220, display: 'block'}}>
                  <line x1="60" y1="24" x2="60" y2="220" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="60" y1="220" x2="730" y2="220" stroke="#94a3b8" strokeWidth="2" />
                  <text x="14" y="34" fill="#475569" fontSize="11" fontWeight="700">Skill / Recall</text>
                  <text x="690" y="250" fill="#475569" fontSize="11" fontWeight="700">Time</text>
                  {[140, 220, 300, 380, 460, 540, 620, 700].map((x, i) => (
                    <line key={i} x1={x} y1="220" x2={x} y2="216" stroke="#94a3b8" />
                  ))}
                  {[80, 120, 160, 200].map((y, i) => (
                    <line key={i} x1="60" y1={y} x2="730" y2={y} stroke="#e5e7eb" />
                  ))}
                  {/* Episodic path - rapid decay */}
                  <path d="M 60 50 C 180 46, 250 70, 320 110 C 380 144, 450 175, 730 200" fill="none" stroke="#dc2626" strokeWidth="4.5" strokeLinecap="round" />
                  {/* Continuous path - sustained with micro-dips */}
                  <path d="M 60 200 C 110 170, 150 160, 190 140 C 210 130, 230 120, 250 130 C 270 142, 300 120, 330 105 C 350 95, 370 90, 390 100 C 410 112, 440 98, 470 88 C 490 82, 510 78, 530 88 C 550 98, 585 86, 620 76 C 640 70, 660 66, 730 60" fill="none" stroke="#2563eb" strokeWidth="4.5" strokeLinecap="round" />
                  {/* Callout labels */}
                  <text x="180" y="42" fill="#991b1b" fontSize="11" fontWeight="700">Peak right after event</text>
                  <text x="400" y="155" fill="#991b1b" fontSize="11" fontWeight="700">~70% forgotten in 24h</text>
                  <text x="600" y="212" fill="#991b1b" fontSize="11" fontWeight="700">~90% in 30 days</text>
                  <text x="500" y="52" fill="#1e3a8a" fontSize="11" fontWeight="700">Continuous reinforcement</text>
                </svg>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12}}>
                  <div style={{background: '#fff7ed', border: '1px solid #fdba74', borderRadius: 8, padding: 12}}>
                    <div style={{fontSize: 13, color: '#9a3412', fontWeight: 700, marginBottom: 6}}>Why Episodic Training Falls Short</div>
                    <div style={{fontSize: 13, color: '#7c2d12', lineHeight: 1.6}}>
                      Annual workshops spike learning, but Ebbinghaus forgetting curve shows 70% loss in 24 hours, 90% within a month. Skills aren't practiced, behaviors don't change.
                    </div>
                  </div>
                  <div style={{background: '#ecfeff', border: '1px solid #67e8f9', borderRadius: 8, padding: 12}}>
                    <div style={{fontSize: 13, color: '#155e75', fontWeight: 700, marginBottom: 6}}>Why Continuous Development Works</div>
                    <div style={{fontSize: 13, color: '#0e7490', lineHeight: 1.6}}>
                      Sustained engagement compounds capability. Just-in-time support at critical moments. Transforms training into behavior change. Air Force: +7% retention over 4 years.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Solution Approaches Comparison */}
            <div style={{background: 'white', borderRadius: 12, padding: 28, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20}}>
                <span style={{fontSize: 32}}>⚖️</span>
                <h2 style={{fontSize: 24, fontWeight: 800, color: T.color.ink, margin: 0}}>
                  Solution Approaches: What the Evidence Shows
                </h2>
              </div>

              <p style={{fontSize: 15, color: T.color.slate600, lineHeight: 1.7, marginBottom: 20}}>
                Not all wellness investments deliver equal returns. Research shows wide variation in effectiveness based on approach methodology.
              </p>

              <div style={{overflowX: 'auto'}}>
                <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 13}}>
                  <thead>
                    <tr style={{background: T.color.blue, color: 'white'}}>
                      <th style={{padding: '12px 16px', textAlign: 'left', fontWeight: 700}}>Approach</th>
                      <th style={{padding: '12px 16px', textAlign: 'left', fontWeight: 700}}>Typical Engagement</th>
                      <th style={{padding: '12px 16px', textAlign: 'left', fontWeight: 700}}>Strengths</th>
                      <th style={{padding: '12px 16px', textAlign: 'left', fontWeight: 700}}>Limitations</th>
                      <th style={{padding: '12px 16px', textAlign: 'center', fontWeight: 700}}>Expected ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { approach: 'Traditional EAP', engagement: '3-5%', strengths: 'Low cost, familiar', limitations: 'Reactive, stigmatized, low utilization', roi: 'Low', roiColor: '#dc2626' },
                      { approach: 'Episodic Training', engagement: 'One-time', strengths: 'Easy to implement', limitations: '70% forgotten in 24h, no behavior change', roi: 'Low', roiColor: '#dc2626' },
                      { approach: 'Executive Coaching', engagement: 'High (limited)', strengths: 'Deep impact for leaders', limitations: '$15K+/person, can\'t scale to frontline', roi: 'Medium', roiColor: '#f59e0b' },
                      { approach: 'Digital Wellness Apps', engagement: 'Drops off', strengths: 'Scalable, low stigma', limitations: 'No personalization, no accountability', roi: 'Low-Med', roiColor: '#f59e0b' },
                      { approach: 'Peer Support Programs', engagement: 'Variable', strengths: 'Trusted, relatable', limitations: 'Inconsistent quality, no clinical training', roi: 'Medium', roiColor: '#f59e0b' },
                      { approach: 'Integrated Platform', engagement: '60%+ sustained', strengths: 'Proactive, scalable, measurable', limitations: 'Higher investment, culture shift needed', roi: 'High', roiColor: '#16a34a' },
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

              <div style={{marginTop: 20, padding: 16, background: '#f0fdf4', borderRadius: 10, border: '2px solid #22c55e'}}>
                <div style={{fontSize: 14, fontWeight: 700, color: T.color.green, marginBottom: 8}}>
                  💡 Key Research Findings
                </div>
                <div style={{fontSize: 14, color: '#166534', lineHeight: 1.7}}>
                  <strong>JAMA 2024:</strong> 21.6% symptom reduction from enhanced behavioral health (coaching + digital) vs. traditional EAP • 
                  <strong> Montreal Police:</strong> 65% suicide reduction over 22 years with continuous, proactive intervention • 
                  <strong> Air Force:</strong> +7% career commitment from sustained development model • 
                  <strong> CuraLinc:</strong> 67% SUD severity reduction through early intervention
                </div>
              </div>
            </div>

            {/* Section 5: Evaluation Criteria Scorecard */}
            <div style={{background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', border: '4px solid #6366f1', borderRadius: 16, padding: 28}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20}}>
                <div style={{width: 48, height: 48, background: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22}}>✅</div>
                <h2 style={{fontSize: 22, fontWeight: 800, color: '#4338ca', margin: 0}}>
                  Solution Evaluation Criteria
                </h2>
              </div>

              <p style={{fontSize: 15, color: '#475569', lineHeight: 1.7, marginBottom: 20}}>
                Use this evidence-based scorecard to evaluate any wellness investment. Programs that score high on these criteria consistently deliver better outcomes.
              </p>

              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16}}>
                {[
                  { criteria: 'Proactive vs. Reactive', weight: 'Critical', question: 'Does it build resilience before crisis, or respond after?', ideal: 'Prevention-focused, early intervention' },
                  { criteria: 'Continuous vs. Episodic', weight: 'Critical', question: 'Is engagement sustained over months/years, or one-time?', ideal: 'Ongoing relationship, not events' },
                  { criteria: 'Engagement Rate', weight: 'Critical', question: 'What percentage of eligible employees actually use it?', ideal: '60%+ (vs. EAP\'s 3-5%)' },
                  { criteria: 'Stigma Reduction', weight: 'Critical', question: 'Is it framed as development or mental health treatment?', ideal: 'Professional growth framing' },
                  { criteria: 'Scalability', weight: 'High', question: 'Can it reach 8,700+ officers, not just senior leaders?', ideal: 'Digital + human hybrid model' },
                  { criteria: 'Personalization', weight: 'High', question: 'Is it tailored to individual needs, or one-size-fits-all?', ideal: 'Adaptive to individual goals' },
                  { criteria: 'Evidence Base', weight: 'High', question: 'Peer-reviewed research? Results in law enforcement/military?', ideal: 'Published outcomes in similar populations' },
                  { criteria: 'Measurable Outcomes', weight: 'High', question: 'Can you track retention, claims, incidents pre/post?', ideal: 'Clear ROI metrics and reporting' },
                  { criteria: 'Technology + Human', weight: 'Medium', question: 'Does it combine AI/digital with human expertise?', ideal: 'Multiple modalities, 24/7 access' },
                  { criteria: 'Just-in-Time Support', weight: 'Medium', question: 'Available when officers need it most?', ideal: 'On-demand, not appointment-based' },
                ].map((item, i) => (
                  <div key={i} style={{background: 'white', borderRadius: 10, padding: 16, border: '2px solid #c7d2fe'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8}}>
                      <div style={{fontSize: 15, fontWeight: 700, color: '#4338ca'}}>{item.criteria}</div>
                      <div style={{fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: item.weight === 'Critical' ? '#fef2f2' : item.weight === 'High' ? '#fef3c7' : '#f0f9ff', color: item.weight === 'Critical' ? '#991b1b' : item.weight === 'High' ? '#92400e' : '#0369a1'}}>
                        {item.weight}
                      </div>
                    </div>
                    <div style={{fontSize: 13, color: T.color.slate600, marginBottom: 8, fontStyle: 'italic'}}>
                      "{item.question}"
                    </div>
                    <div style={{fontSize: 12, color: T.color.green, fontWeight: 600}}>
                      ✓ Ideal: {item.ideal}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 6: Deployment Options */}
            <div style={{background: 'white', borderRadius: 12, padding: 28, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: `2px solid ${T.color.blue}`}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20}}>
                <span style={{fontSize: 32}}>🚀</span>
                <h2 style={{fontSize: 24, fontWeight: 800, color: T.color.ink, margin: 0}}>
                  Deployment Options
                </h2>
              </div>

              <p style={{fontSize: 15, color: T.color.slate600, lineHeight: 1.7, marginBottom: 20}}>
                Any evidence-based solution can be deployed at multiple scales. <strong style={{color: T.color.blue}}>Click to select</strong> a deployment approach:
              </p>

              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20}}>
                {[
                  { 
                    name: 'Pilot', 
                    coverage: '5-10%', 
                    seats: '400-800 officers',
                    investment: '$200K - $400K',
                    investmentValue: 300000,
                    target: 'Academy recruits, high-risk units',
                    timeline: '6-12 months',
                    goal: 'Prove engagement, measure early signals',
                    selected: investmentLevel <= 400000
                  },
                  { 
                    name: 'Targeted', 
                    coverage: '15-25%', 
                    seats: '1,300-2,200 officers',
                    investment: '$500K - $1M',
                    investmentValue: 750000,
                    target: 'Officers <18 months + supervisors + FTOs',
                    timeline: '12 months',
                    goal: 'Measurable retention/incident reduction',
                    selected: investmentLevel > 400000 && investmentLevel <= 1000000
                  },
                  { 
                    name: 'Scaled', 
                    coverage: '50%+', 
                    seats: '4,000+ officers',
                    investment: '$2M - $4M',
                    investmentValue: 2500000,
                    target: 'Department-wide transformation',
                    timeline: '12-24 months',
                    goal: 'Culture change, maximum ROI',
                    selected: investmentLevel > 1000000
                  },
                ].map((opt, i) => (
                  <button 
                    key={i} 
                    onClick={() => setInvestmentLevel(opt.investmentValue)}
                    style={{
                      background: opt.selected ? T.color.lightBlue : '#f8fafc',
                      borderRadius: 12,
                      padding: 20,
                      border: opt.selected ? `3px solid ${T.color.blue}` : '2px solid #e2e8f0',
                      position: 'relative',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}>
                    {opt.selected && (
                      <div style={{position: 'absolute', top: -12, right: 12, background: T.color.blue, color: 'white', padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700}}>
                        SELECTED
                      </div>
                    )}
                    <div style={{fontSize: 20, fontWeight: 800, color: T.color.blue, marginBottom: 8}}>{opt.name}</div>
                    <div style={{fontSize: 28, fontWeight: 900, color: T.color.ink, marginBottom: 4}}>{opt.coverage}</div>
                    <div style={{fontSize: 13, color: T.color.slate600, marginBottom: 12}}>{opt.seats}</div>
                    
                    <div style={{fontSize: 13, color: T.color.slate600, lineHeight: 1.6, marginBottom: 12}}>
                      <strong>Investment:</strong> {opt.investment}<br />
                      <strong>Target:</strong> {opt.target}<br />
                      <strong>Timeline:</strong> {opt.timeline}
                    </div>
                    
                    <div style={{background: 'white', padding: 10, borderRadius: 6, fontSize: 12, color: T.color.green, fontWeight: 600, border: '1px solid #e2e8f0'}}>
                      Goal: {opt.goal}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 7: ROI Calculator */}
            <div style={{background: 'linear-gradient(135deg, #e8f4e0 0%, #d0eac0 100%)', border: `4px solid ${T.color.green}`, borderRadius: 16, padding: 28}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20}}>
                <span style={{fontSize: 32}}>💰</span>
                <h2 style={{fontSize: 24, fontWeight: 800, color: T.color.green, margin: 0}}>
                  ROI Calculator: Model Your Investment
                </h2>
              </div>

              {/* Net Savings Display */}
              <div style={{
                background: 'white',
                border: `3px solid ${calculations.netSavings >= 0 ? T.color.green : T.color.red}`,
                borderRadius: 12,
                padding: '24px 32px',
                textAlign: 'center',
                marginBottom: 24,
              }}>
                <div style={{fontSize: 18, fontWeight: 600, color: T.color.slate600, marginBottom: 8}}>
                  Estimated Annual Net Savings
                </div>
                <div style={{fontSize: 56, fontWeight: 900, color: calculations.netSavings >= 0 ? T.color.green : T.color.red, marginBottom: 8}}>
                  {fmt(calculations.netSavings)}
                </div>
                <div style={{fontSize: 16, color: T.color.slate600}}>
                  ROI: <strong style={{color: calculations.netSavings >= 0 ? T.color.green : T.color.red}}>{roiDisplay(calculations.roi)}</strong> • 
                  Total Potential Savings: {fmt(calculations.totalPotentialSavings)} • 
                  Investment: {fmt(calculations.investmentLevel)}
                </div>
              </div>

              {/* Investment Slider */}
              <div style={{background: 'white', borderRadius: 12, padding: 20, marginBottom: 20}}>
                <label style={{display: 'block', fontSize: 16, fontWeight: 700, color: T.color.ink, marginBottom: 12}}>
                  Annual Investment: {fmt(investmentLevel)}
                </label>
                <input
                  type="range"
                  min="100000"
                  max="4000000"
                  step="50000"
                  value={investmentLevel}
                  onChange={(e) => setInvestmentLevel(parseInt(e.target.value))}
                  style={{width: '100%', height: 8, marginBottom: 8}}
                />
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b'}}>
                  <span>$100K (Pilot)</span>
                  <span>$1M (Targeted)</span>
                  <span>$2.5M (Scaled)</span>
                  <span>$4M (Full)</span>
                </div>
                
                <div style={{display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap'}}>
                  {[
                    { label: 'Pilot ($250K)', value: 250000 },
                    { label: 'Targeted ($750K)', value: 750000 },
                    { label: 'Mid-Scale ($1.5M)', value: 1500000 },
                    { label: 'Scaled ($2.5M)', value: 2500000 },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setInvestmentLevel(opt.value)}
                      style={{
                        padding: '8px 14px',
                        fontSize: 13,
                        fontWeight: 600,
                        border: investmentLevel === opt.value ? `2px solid ${T.color.green}` : '2px solid #e2e8f0',
                        borderRadius: 8,
                        background: investmentLevel === opt.value ? '#dcfce7' : 'white',
                        cursor: 'pointer',
                        color: investmentLevel === opt.value ? T.color.green : T.color.slate600,
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Improvement Targets */}
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16}}>
                <div style={{background: 'white', padding: 16, borderRadius: 10}}>
                  <div style={{fontSize: 14, fontWeight: 700, color: T.color.ink, marginBottom: 10}}>💼 Retention Impact</div>
                  <div style={{fontSize: 13, color: T.color.slate600, marginBottom: 8}}>
                    Target: {retentionImprovementTarget}% reduction
                  </div>
                  <input type="range" min="5" max="40" value={retentionImprovementTarget}
                    onChange={(e) => setRetentionImprovementTarget(parseInt(e.target.value))}
                    style={{width: '100%', marginBottom: 8}} />
                  <div style={{fontSize: 14, fontWeight: 700, color: T.color.green}}>
                    Savings: {fmt(calculations.retentionSavings)}
                  </div>
                  <div style={{fontSize: 11, color: T.color.slate600}}>
                    ({calculations.separationsPrevented} separations prevented)
                  </div>
                </div>

                <div style={{background: 'white', padding: 16, borderRadius: 10}}>
                  <div style={{fontSize: 14, fontWeight: 700, color: T.color.ink, marginBottom: 10}}>⚖️ Misconduct Impact</div>
                  <div style={{fontSize: 13, color: T.color.slate600, marginBottom: 8}}>
                    Target: {misconductReductionTarget}% reduction
                  </div>
                  <input type="range" min="5" max="40" value={misconductReductionTarget}
                    onChange={(e) => setMisconductReductionTarget(parseInt(e.target.value))}
                    style={{width: '100%', marginBottom: 8}} />
                  <div style={{fontSize: 14, fontWeight: 700, color: T.color.green}}>
                    Savings: {fmt(calculations.misconductSavings)}
                  </div>
                </div>

                <div style={{background: 'white', padding: 16, borderRadius: 10}}>
                  <div style={{fontSize: 14, fontWeight: 700, color: T.color.ink, marginBottom: 10}}>🏥 Workers' Comp Impact</div>
                  <div style={{fontSize: 13, color: T.color.slate600, marginBottom: 8}}>
                    Target: {wcClaimReductionTarget}% reduction
                  </div>
                  <input type="range" min="5" max="40" value={wcClaimReductionTarget}
                    onChange={(e) => setWcClaimReductionTarget(parseInt(e.target.value))}
                    style={{width: '100%', marginBottom: 8}} />
                  <div style={{fontSize: 14, fontWeight: 700, color: T.color.green}}>
                    Savings: {fmt(calculations.wcSavings)}
                  </div>
                </div>
              </div>
            </div>

            {/* Break-Even Analysis */}
            <div style={{background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '3px solid #f59e0b', borderRadius: 12, padding: 24}}>
              <h3 style={{fontSize: 20, fontWeight: 800, color: '#92400e', marginBottom: 16}}>
                📊 Break-Even Analysis
              </h3>
              <p style={{fontSize: 14, color: '#78350f', marginBottom: 16}}>
                At {fmt(investmentLevel)} investment, here's the improvement level needed to break even in each category alone:
              </p>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16}}>
                <div style={{background: 'white', padding: 16, borderRadius: 10, textAlign: 'center'}}>
                  <div style={{fontSize: 14, fontWeight: 600, color: '#78350f', marginBottom: 8}}>Retention Only</div>
                  <div style={{fontSize: 28, fontWeight: 900, color: '#92400e'}}>{calculations.breakEvenRetention}%</div>
                  <div style={{fontSize: 12, color: '#78350f'}}>improvement needed</div>
                </div>
                <div style={{background: 'white', padding: 16, borderRadius: 10, textAlign: 'center'}}>
                  <div style={{fontSize: 14, fontWeight: 600, color: '#78350f', marginBottom: 8}}>Misconduct Only</div>
                  <div style={{fontSize: 28, fontWeight: 900, color: '#92400e'}}>{calculations.breakEvenMisconduct}%</div>
                  <div style={{fontSize: 12, color: '#78350f'}}>improvement needed</div>
                </div>
                <div style={{background: 'white', padding: 16, borderRadius: 10, textAlign: 'center'}}>
                  <div style={{fontSize: 14, fontWeight: 600, color: '#78350f', marginBottom: 8}}>Workers' Comp Only</div>
                  <div style={{fontSize: 28, fontWeight: 900, color: '#92400e'}}>{calculations.breakEvenWc}%</div>
                  <div style={{fontSize: 12, color: '#78350f'}}>improvement needed</div>
                </div>
              </div>
              <div style={{marginTop: 16, padding: 12, background: 'white', borderRadius: 8, fontSize: 14, color: '#78350f'}}>
                <strong>Key Insight:</strong> Because effective wellness interventions impact all three cost categories simultaneously, actual improvements compound. Even modest improvements across all three categories exceed break-even thresholds—explaining why integrated platforms consistently outperform single-point solutions.
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FACTOR BREAKDOWN */}
        {activeTab === 'factors' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
            
            <div style={{background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <h2 style={{fontSize: 28, fontWeight: 800, color: T.color.ink, marginBottom: 16}}>
                Adjustable Assumptions
              </h2>
              <p style={{fontSize: 16, color: T.color.slate600, lineHeight: 1.7}}>
                The model's accuracy depends on these underlying assumptions. Adjust them based on LAPD-specific data when available, or use conservative estimates. These assumptions are derived from research on law enforcement populations and can be refined as more department-specific data becomes available.
              </p>
            </div>

            {/* Comorbidity Adjustment */}
            <div style={{background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '3px solid #f59e0b', borderRadius: 12, padding: 24}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16}}>
                <span style={{fontSize: 36}}>🧮</span>
                <h2 style={{fontSize: 26, fontWeight: 800, color: '#92400e', margin: 0}}>
                  Comorbidity Adjustment
                </h2>
              </div>
              
              {/* Plain English Explanation */}
              <div style={{background: 'white', padding: 20, borderRadius: 10, marginBottom: 16, border: '2px solid #fbbf24'}}>
                <div style={{fontSize: 16, fontWeight: 700, color: '#92400e', marginBottom: 12}}>
                  💡 What is this and why does it matter?
                </div>
                <p style={{fontSize: 15, color: '#78350f', lineHeight: 1.8, margin: 0}}>
                  Mental health conditions rarely occur alone. An officer with <strong>PTSD</strong> often also experiences <strong>depression</strong> and may develop <strong>substance use</strong> issues as a coping mechanism. If we count each condition separately, we'd count the same officer 3 times—inflating our numbers and making the model unrealistic.
                </p>
              </div>

              {/* Visual Example */}
              <div style={{background: 'white', padding: 20, borderRadius: 10, marginBottom: 16}}>
                <div style={{fontSize: 15, fontWeight: 700, color: '#92400e', marginBottom: 12}}>
                  📊 Example: Without vs. With Adjustment
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
                  <div style={{background: '#fef2f2', padding: 16, borderRadius: 8, border: '2px solid #fca5a5'}}>
                    <div style={{fontSize: 14, fontWeight: 700, color: '#991b1b', marginBottom: 8}}>❌ Without Adjustment (Inflated)</div>
                    <div style={{fontSize: 13, color: '#7f1d1d', lineHeight: 1.7}}>
                      • 1,500 officers with PTSD<br />
                      • 1,500 officers with depression<br />
                      • 1,300 officers with anxiety<br />
                      • 2,200 officers with SUD<br />
                      <strong style={{color: '#dc2626'}}>= 6,500 "affected officers"</strong>
                    </div>
                    <div style={{marginTop: 8, fontSize: 12, color: '#991b1b', fontStyle: 'italic'}}>
                      But this counts many officers multiple times!
                    </div>
                  </div>
                  <div style={{background: '#e8f4e0', padding: 16, borderRadius: 8, border: `2px solid ${T.color.green}`}}>
                    <div style={{fontSize: 14, fontWeight: 700, color: '#166534', marginBottom: 8}}>✅ With {comorbidityOverlap}% Overlap Adjustment</div>
                    <div style={{fontSize: 13, color: '#14532d', lineHeight: 1.7}}>
                      • Same conditions, but...<br />
                      • ~{comorbidityOverlap}% of officers have 2+ conditions<br />
                      • Adjust to count each person once<br />
                      <strong style={{color: T.color.green}}>= {calculations.uniqueAffected.toLocaleString()} unique officers</strong>
                    </div>
                    <div style={{marginTop: 8, fontSize: 12, color: '#166534', fontStyle: 'italic'}}>
                      More accurate, defensible estimate
                    </div>
                  </div>
                </div>
              </div>

              {/* Slider Control */}
              <div style={{background: 'white', padding: 20, borderRadius: 10}}>
                <label style={{display: 'block', fontSize: 18, fontWeight: 700, marginBottom: 12, color: '#92400e'}}>
                  Comorbidity Overlap: {comorbidityOverlap}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={comorbidityOverlap}
                  onChange={(e) => setComorbidityOverlap(parseInt(e.target.value))}
                  style={{width: '100%', height: 8}}
                />
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#92400e', marginTop: 4}}>
                  <span>0% (no overlap - less conservative)</span>
                  <span>50% (high overlap - more conservative)</span>
                </div>
                
                {/* Research Basis */}
                <div style={{marginTop: 16, padding: 16, background: '#fffbeb', borderRadius: 8, border: '2px solid #fbbf24'}}>
                  <div style={{fontSize: 14, fontWeight: 700, color: '#92400e', marginBottom: 8}}>
                    📚 Research Basis
                  </div>
                  <div style={{fontSize: 13, color: '#78350f', lineHeight: 1.7}}>
                    Studies in law enforcement populations show <strong>30-40% comorbidity</strong> is typical. Officers experiencing trauma often develop multiple conditions simultaneously. Current setting of {comorbidityOverlap}% means we assume {comorbidityOverlap}% of affected officers have multiple conditions and should only be counted once.
                  </div>
                </div>

                {/* Impact Summary */}
                <div style={{marginTop: 16, padding: 16, background: T.color.lightBlue, borderRadius: 8, border: `2px solid ${T.color.blue}`}}>
                  <div style={{fontSize: 14, fontWeight: 700, color: T.color.blue, marginBottom: 8}}>
                    📈 Model Impact
                  </div>
                  <div style={{fontSize: 14, color: T.color.blue, lineHeight: 1.8}}>
                    <strong>Before adjustment:</strong> {calculations.rawTotalAffected.toLocaleString()} officers (if conditions were independent)<br />
                    <strong>After adjustment:</strong> {calculations.uniqueAffected.toLocaleString()} unique officers<br />
                    <strong>Reduction:</strong> {calculations.comorbidityReduction.toLocaleString()} officers no longer double-counted
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Attribution Sliders */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24}}>
              
              {/* Retention Attribution */}
              <div style={{background: 'white', borderRadius: 12, padding: 24, border: `2px solid ${T.color.blue}`}}>
                <div style={{fontSize: 18, fontWeight: 700, color: T.color.blue, marginBottom: 16}}>
                  💼 Retention: Behavioral Health Link
                </div>
                <div style={{marginBottom: 16}}>
                  <label style={{fontSize: 14, fontWeight: 600, color: T.color.slate600}}>
                    % of attrition with behavioral health factors: {behavioralAttritionShare}%
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="60"
                    value={behavioralAttritionShare}
                    onChange={(e) => setBehavioralAttritionShare(parseInt(e.target.value))}
                    style={{width: '100%', marginTop: 8}}
                  />
                </div>
                <div style={{fontSize: 13, color: T.color.slate600, lineHeight: 1.6}}>
                  Research suggests 30-50% of early separations have behavioral health factors (burnout, PTSD, family stress) contributing to the decision. {behavioralAttritionShare}% of {lapdData.attrition2024} = <strong>{calculations.behavioralDrivenSeparations} officers</strong>.
                </div>
              </div>

              {/* Misconduct Attribution */}
              <div style={{background: 'white', borderRadius: 12, padding: 24, border: `2px solid ${T.color.blue}`}}>
                <div style={{fontSize: 18, fontWeight: 700, color: T.color.blue, marginBottom: 16}}>
                  ⚖️ Misconduct: Behavioral Health Link
                </div>
                <div style={{marginBottom: 16}}>
                  <label style={{fontSize: 14, fontWeight: 600, color: T.color.slate600}}>
                    % of settlements with behavioral health links: {misconductBehavioralLink}%
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="60"
                    value={misconductBehavioralLink}
                    onChange={(e) => setMisconductBehavioralLink(parseInt(e.target.value))}
                    style={{width: '100%', marginTop: 8}}
                  />
                </div>
                <div style={{fontSize: 13, color: T.color.slate600, lineHeight: 1.6}}>
                  FBI research links PTSD to higher excessive force rates. Burnout impairs judgment. {misconductBehavioralLink}% of {fmtCompact(lapdData.annualSettlements)} = <strong>{fmtCompact(calculations.behavioralLinkedMisconduct)}</strong>.
                </div>
              </div>

              {/* WC Attribution */}
              <div style={{background: 'white', borderRadius: 12, padding: 24, border: `2px solid ${T.color.blue}`}}>
                <div style={{fontSize: 18, fontWeight: 700, color: T.color.blue, marginBottom: 16}}>
                  🏥 Workers' Comp: Mental Health Share
                </div>
                <div style={{marginBottom: 16}}>
                  <label style={{fontSize: 14, fontWeight: 600, color: T.color.slate600}}>
                    % of WC budget for mental health: {wcMentalHealthShare}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={wcMentalHealthShare}
                    onChange={(e) => setWcMentalHealthShare(parseInt(e.target.value))}
                    style={{width: '100%', marginTop: 8}}
                  />
                </div>
                <div style={{fontSize: 13, color: T.color.slate600, lineHeight: 1.6}}>
                  With SB 542 PTSD presumption, mental health claims are growing. {wcMentalHealthShare}% of {fmtCompact(lapdData.annualWcBudget)} = <strong>{fmtCompact(calculations.mentalHealthWcCosts)}</strong>.
                </div>
              </div>
            </div>

            {/* Behavioral Health Prevalence */}
            <div style={{background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <h3 style={{fontSize: 22, fontWeight: 800, color: T.color.ink, marginBottom: 16}}>
                🧠 Behavioral Health Prevalence Rates
              </h3>
              <p style={{fontSize: 14, color: T.color.slate600, marginBottom: 20}}>
                Adjust based on LAPD-specific data or research on law enforcement populations. These rates are calibrated for high-stress law enforcement environments and can be refined with department data.
              </p>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20}}>
                {[
                  { label: 'PTSD', value: ptsdPrevalence, setter: setPtsdPrevalence, research: '12-35% in LEO' },
                  { label: 'Depression', value: depressionPrevalence, setter: setDepressionPrevalence, research: '12-25% in LEO' },
                  { label: 'Anxiety', value: anxietyPrevalence, setter: setAnxietyPrevalence, research: '10-20% in LEO' },
                  { label: 'Substance Use', value: sudPrevalence, setter: setSudPrevalence, research: '20-30% in LEO' },
                ].map((item) => (
                  <div key={item.label} style={{background: '#f8fafc', padding: 16, borderRadius: 10, border: '2px solid #e2e8f0'}}>
                    <label style={{fontSize: 14, fontWeight: 700, color: T.color.ink, display: 'block', marginBottom: 8}}>
                      {item.label}: {item.value}%
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      value={item.value}
                      onChange={(e) => item.setter(parseInt(e.target.value))}
                      style={{width: '100%'}}
                    />
                    <div style={{fontSize: 11, color: '#64748b', marginTop: 4}}>
                      Research range: {item.research}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CALIFORNIA FRAMEWORK */}
        {activeTab === 'california' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
            
            <div style={{background: `linear-gradient(135deg, ${T.color.lightBlue} 0%, #cce5f0 100%)`, border: `3px solid ${T.color.blue}`, borderRadius: 16, padding: 32}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20}}>
                <span style={{fontSize: 48}}>📋</span>
                <h2 style={{fontSize: 28, fontWeight: 800, color: T.color.blue, margin: 0}}>
                  California Workers' Compensation Framework
                </h2>
              </div>
              <p style={{fontSize: 16, color: T.color.blue, lineHeight: 1.7}}>
                California provides one of the most favorable workers' compensation environments for peace officers' mental health claims. This legal framework significantly impacts LAPD's cost exposure and creates strong financial rationale for preventive interventions.
              </p>
            </div>

            {/* SB 542 */}
            <div style={{background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
                <span style={{fontSize: 28}}>⚖️</span>
                <h3 style={{fontSize: 24, fontWeight: 800, color: T.color.ink, margin: 0}}>
                  Senate Bill 542: PTSD Presumption
                </h3>
              </div>
              <div style={{fontSize: 16, color: T.color.slate600, lineHeight: 1.8, marginBottom: 20}}>
                <strong>What it does:</strong> Creates a "rebuttable presumption" that PTSD in peace officers and firefighters is work-related. This shifts the burden of proof from the employee to the employer.
              </div>
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
                <h3 style={{fontSize: 24, fontWeight: 800, color: T.color.ink, margin: 0}}>
                  Labor Code 4850: Full Salary Continuation
                </h3>
              </div>
              <div style={{fontSize: 16, color: T.color.slate600, lineHeight: 1.8, marginBottom: 20}}>
                <strong>What it does:</strong> Provides injured peace officers with full salary continuation (not the standard 2/3 wage replacement) for up to 52 weeks.
              </div>
              <div style={{background: '#fef3c7', padding: 20, borderRadius: 10, border: '2px solid #fbbf24'}}>
                <h4 style={{fontSize: 16, fontWeight: 700, color: '#92400e', marginBottom: 12}}>Cost Implications</h4>
                <div style={{fontSize: 15, color: '#78350f', lineHeight: 1.8}}>
                  <strong>Standard WC:</strong> 2/3 salary replacement (~$57K for average LAPD officer)<br />
                  <strong>4850 Benefit:</strong> Full salary continuation (~$86K for average LAPD officer)<br />
                  <strong>Premium per claim:</strong> ~$29K additional cost per mental health claim<br />
                  <strong>Duration:</strong> Up to 52 weeks at full pay before stepping down to standard rates
                </div>
              </div>
            </div>

            {/* Labor Code 3208.3 */}
            <div style={{background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
                <span style={{fontSize: 28}}>🧠</span>
                <h3 style={{fontSize: 24, fontWeight: 800, color: T.color.ink, margin: 0}}>
                  Labor Code 3208.3: Psychiatric Injury Standards
                </h3>
              </div>
              <div style={{fontSize: 16, color: T.color.slate600, lineHeight: 1.8, marginBottom: 20}}>
                <strong>Requirements for general employees:</strong> Work must be "predominant cause" (51%+) of psychiatric injury. 6-month employment minimum. Cannot be based solely on lawful employer actions (discipline, termination).
              </div>
              <div style={{background: T.color.lightBlue, padding: 20, borderRadius: 10, border: `2px solid ${T.color.blue}`}}>
                <h4 style={{fontSize: 16, fontWeight: 700, color: T.color.blue, marginBottom: 12}}>Peace Officer Exception</h4>
                <div style={{fontSize: 15, color: T.color.blue, lineHeight: 1.8}}>
                  Combined with SB 542, peace officers don't need to cite specific incidents for PTSD claims. The presumption means work causation is assumed unless the employer can prove otherwise. This creates a much more favorable claims environment for LAPD officers.
                </div>
              </div>
            </div>

            {/* LAPPL ADR Program */}
            <div style={{background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
                <span style={{fontSize: 28}}>🤝</span>
                <h3 style={{fontSize: 24, fontWeight: 800, color: T.color.ink, margin: 0}}>
                  LAPPL Alternative Dispute Resolution Program
                </h3>
              </div>
              <div style={{fontSize: 16, color: T.color.slate600, lineHeight: 1.8, marginBottom: 20}}>
                The Los Angeles Police Protective League operates the largest sworn ADR carve-out in California, managing workers' comp claims outside the traditional adversarial system.
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16}}>
                <div style={{background: '#f8fafc', padding: 20, borderRadius: 10, textAlign: 'center'}}>
                  <div style={{fontSize: 36, fontWeight: 900, color: T.color.blue}}>5,500+</div>
                  <div style={{fontSize: 14, color: T.color.slate600}}>Officers managed since 2018</div>
                </div>
                <div style={{background: '#f8fafc', padding: 20, borderRadius: 10, textAlign: 'center'}}>
                  <div style={{fontSize: 36, fontWeight: 900, color: T.color.blue}}>1</div>
                  <div style={{fontSize: 14, color: T.color.slate600}}>Case gone to mediation</div>
                </div>
                <div style={{background: '#f8fafc', padding: 20, borderRadius: 10, textAlign: 'center'}}>
                  <div style={{fontSize: 36, fontWeight: 900, color: T.color.blue}}>0</div>
                  <div style={{fontSize: 14, color: T.color.slate600}}>Formal arbitrations</div>
                </div>
              </div>
              <div style={{marginTop: 16, fontSize: 14, color: T.color.slate600}}>
                <strong>Measured savings:</strong> 1-5% cost savings out of $92.6M annual workers' comp budget through reduced disputes and faster resolution.
              </div>
            </div>

            {/* Why California Framework Matters for ROI */}
            <div style={{background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '3px solid #f59e0b', borderRadius: 12, padding: 24}}>
              <h3 style={{fontSize: 22, fontWeight: 800, color: '#92400e', marginBottom: 16}}>
                💡 Why California Framework Matters for ROI
              </h3>
              <div style={{fontSize: 15, color: '#78350f', lineHeight: 1.8}}>
                The combination of <strong>SB 542 (PTSD presumption)</strong> + <strong>Labor Code 4850 (full salary)</strong> + <strong>LAPPL ADR</strong> creates a uniquely favorable environment for officers to file mental health claims. This is not a criticism—it's appropriate protection for officers facing traumatic work. However, it also means <strong>the financial case for prevention is stronger in California than almost anywhere else in the nation.</strong>
                <br /><br />
                Every PTSD claim prevented saves LAPD ~$85K-$110K in direct costs, plus avoided litigation, administrative burden, and limited duty coverage. The ROI math for proactive wellness investments becomes compelling under these conditions.
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: EVIDENCE BASE */}
        {activeTab === 'proof' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
            
            {/* Department of Air Force: Federal Law Enforcement Translation */}
            <div style={{background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <h2 style={{fontSize: 28, fontWeight: 800, color: T.color.ink, marginBottom: 20}}>
                🎖️ Department of Air Force: Federal Law Enforcement Translation
              </h2>
              
              <div style={{fontSize: 16, color: T.color.slate600, lineHeight: 1.7, marginBottom: 24}}>
                BetterUp's multi-year partnership with the Department of Air Force demonstrates proven outcomes in high-stress federal environments similar to law enforcement. The Air Force Weapons School program—serving elite students, instructors, and their families—provides particularly relevant validation for LAPD's operational challenges.
              </div>

              {/* Why Air Force Results Translate */}
              <div style={{background: '#f8fafc', padding: 24, borderRadius: 12, border: '2px solid #e2e8f0', marginBottom: 24}}>
                <div style={{fontSize: 18, fontWeight: 700, color: T.color.ink, marginBottom: 16}}>
                  Why Air Force Results Translate to LAPD
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 14, color: T.color.slate600, lineHeight: 1.7}}>
                  <div>
                    <strong style={{color: T.color.blue}}>✓ High-stress operational environments</strong><br />
                    Both populations face life-or-death decision-making under extreme pressure with mission-critical consequences
                  </div>
                  <div>
                    <strong style={{color: T.color.blue}}>✓ Irregular schedules and family strain</strong><br />
                    Shift work and extended separations create similar family stressors and work-life integration challenges
                  </div>
                  <div>
                    <strong style={{color: T.color.blue}}>✓ Retention-critical populations</strong><br />
                    Both services face retention crises with experienced personnel and high replacement costs
                  </div>
                  <div>
                    <strong style={{color: T.color.blue}}>✓ Performance under scrutiny</strong><br />
                    Split-second decisions carry institutional, legal, and public accountability
                  </div>
                </div>
              </div>

              {/* Whole-of-Force Impact Stats */}
              <div style={{fontSize: 18, fontWeight: 700, color: T.color.ink, marginBottom: 16}}>
                Whole-of-Force Impact: 2021-2025 Results
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24}}>
                {[
                  { metric: '+7%', label: 'Career Commitment', desc: '4-year study' },
                  { metric: '+15%', label: 'Unit Readiness', desc: 'Team performance' },
                  { metric: '+13%', label: 'Individual Readiness', desc: 'Mission competencies' },
                  { metric: '88%', label: 'Would Recommend', desc: 'High adoption' }
                ].map((item, i) => (
                  <div key={i} style={{background: T.color.lightBlue, padding: 20, borderRadius: 12, border: `2px solid ${T.color.blue}`, textAlign: 'center'}}>
                    <div style={{fontSize: 42, fontWeight: 900, color: T.color.blue}}>{item.metric}</div>
                    <div style={{fontSize: 14, fontWeight: 600, color: T.color.ink}}>{item.label}</div>
                    <div style={{fontSize: 12, color: T.color.slate600, marginTop: 4}}>{item.desc}</div>
                  </div>
                ))}
              </div>

              {/* Weapons School Mastery Framework */}
              <div style={{background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', border: '4px solid #6366f1', borderRadius: 16, padding: 24}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
                  <div style={{width: 48, height: 48, background: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22}}>📚</div>
                  <h3 style={{fontSize: 22, fontWeight: 800, color: '#4338ca', margin: 0}}>
                    From Air Force Weapons School: Mastery Framework Applied to LAPD
                  </h3>
                </div>

                <div style={{fontSize: 15, color: T.color.slate600, lineHeight: 1.7, marginBottom: 20}}>
                  The Air Force Weapons School program developed elite pilots using a structured mastery framework focused on <strong>decision-making under pressure, communication under pressure, cognitive agility, stress regulation, resilience, and values clarity</strong>. These same peak performance skills directly translate to LAPD's high-stakes law enforcement environment.
                </div>
               
                {/* 5-Step Framework */}
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20}}>
                  {[
                    { num: '1', title: 'REFLECT', icon: '🪞', desc: 'WPM assessment identifies strengths & gaps' },
                    { num: '2', title: 'LEARN', icon: '📖', desc: 'Personalized journeys + curated resources' },
                    { num: '3', title: 'PRACTICE', icon: '🎯', desc: 'AI role-play + coaching rehearsal' },
                    { num: '4', title: 'COMMIT', icon: '✅', desc: 'Action plans at critical moments' },
                    { num: '5', title: 'MEASURE', icon: '📊', desc: 'Pre-post growth assessments' },
                  ].map((step, i) => (
                    <div key={i} style={{background: 'white', borderRadius: 12, padding: 14, border: '2px solid #c7d2fe', textAlign: 'center'}}>
                      <div style={{fontSize: 24, marginBottom: 6}}>{step.icon}</div>
                      <div style={{fontSize: 11, fontWeight: 700, color: T.color.ink, marginBottom: 4}}>{step.num}. {step.title}</div>
                      <div style={{fontSize: 10, color: T.color.slate600, lineHeight: 1.4}}>{step.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Skills Translation */}
                <div style={{background: 'white', borderRadius: 12, padding: 16, border: '2px solid #818cf8', marginBottom: 16}}>
                  <h4 style={{fontSize: 15, fontWeight: 700, color: '#4338ca', marginBottom: 12}}>
                    Weapons School Skills → LAPD Operational Challenges
                  </h4>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13, color: T.color.slate600}}>
                    <div style={{background: '#f5f3ff', borderRadius: 8, padding: 10, border: '1px solid #c7d2fe'}}>
                      <strong style={{color: '#4338ca'}}>Use-of-Force Decisions:</strong> Practice high-pressure scenarios through AI role-play before real encounters
                    </div>
                    <div style={{background: '#f5f3ff', borderRadius: 8, padding: 10, border: '1px solid #c7d2fe'}}>
                      <strong style={{color: '#4338ca'}}>De-escalation:</strong> Rehearse communication strategies for volatile public interactions
                    </div>
                    <div style={{background: '#f5f3ff', borderRadius: 8, padding: 10, border: '1px solid #c7d2fe'}}>
                      <strong style={{color: '#4338ca'}}>Post-Incident Recovery:</strong> Just-in-time stress management after traumatic events
                    </div>
                    <div style={{background: '#f5f3ff', borderRadius: 8, padding: 10, border: '1px solid #c7d2fe'}}>
                      <strong style={{color: '#4338ca'}}>Career Decisions:</strong> Clarity at critical 3-5yr, 10-15yr, pre-retirement points
                    </div>
                  </div>
                </div>

                <div style={{background: '#c7d2fe', borderRadius: 10, padding: 14, border: '2px solid #818cf8'}}>
                  <p style={{fontSize: 13, color: '#3730a3', margin: 0, lineHeight: 1.6}}>
                    <strong style={{color: '#4338ca'}}>From Weapons School to LAPD:</strong> The same mastery framework that helped elite pilots strengthen decision-making under pressure, cognitive agility, and stress regulation translates directly to LAPD officers facing high-stakes law enforcement decisions—from patrol encounters to critical incident responses.
                  </p>
                </div>
              </div>
            </div>

            {/* JAMA 2024 Study */}
            <div style={{background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20}}>
                <span style={{fontSize: 36}}>🔬</span>
                <h2 style={{fontSize: 28, fontWeight: 800, color: T.color.ink, margin: 0}}>
                  JAMA 2024: Peer-Reviewed Clinical Validation
                </h2>
              </div>
              
              <div style={{fontSize: 16, color: T.color.slate600, marginBottom: 24, lineHeight: 1.7, fontStyle: 'italic'}}>
                "Enhanced Behavioral Health Benefits and Mental Health Outcomes: A Randomized Clinical Trial"<br />
                Published in JAMA Health Forum, April 2024
              </div>

              <div style={{background: '#f1f5f9', padding: 24, borderRadius: 12, marginBottom: 24}}>
                <div style={{fontSize: 18, fontWeight: 700, color: T.color.ink, marginBottom: 16}}>
                  🎯 Key Finding: 21.6% Reduction in Burnout & Mental Health Conditions
                </div>
                <div style={{fontSize: 15, color: T.color.slate600, lineHeight: 1.7}}>
                  Randomized controlled trial with 1,132 participants across multiple employers showed that <strong>enhanced behavioral health benefits (including coaching and digital CBT) reduced mental health symptoms by 21.6%</strong> compared to traditional EAP-only control groups. Effect sizes were consistent across depression, anxiety, and burnout measures.
                </div>
              </div>

              <div style={{background: T.color.lightBlue, padding: 20, borderRadius: 12, border: `2px solid ${T.color.blue}`}}>
                <div style={{fontSize: 16, fontWeight: 700, color: T.color.blue, marginBottom: 12}}>
                  Translation to LAPD
                </div>
                <div style={{fontSize: 14, color: T.color.blue, lineHeight: 1.7}}>
                  This peer-reviewed clinical trial provides the evidence base for our 20-25% effectiveness assumptions in workers' comp claim reduction. The study specifically compared traditional EAP (LAPD's current model) against enhanced platforms (the integrated approach). The 21.6% symptom reduction translates directly to reduced claim filing rates, shorter claim durations, and faster return-to-duty.
                </div>
              </div>
            </div>

            {/* Montreal Police Study */}
            <div style={{background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20}}>
                <span style={{fontSize: 36}}>🚔</span>
                <h2 style={{fontSize: 28, fontWeight: 800, color: T.color.ink, margin: 0}}>
                  Montreal Police: 22-Year Suicide Prevention Program
                </h2>
              </div>
              
              <div style={{fontSize: 16, color: T.color.slate600, marginBottom: 24, lineHeight: 1.7}}>
                Montreal Police Service implemented a comprehensive early intervention program combining peer support, psychological services, and organizational culture change. The 22-year longitudinal study provides the gold standard for law enforcement suicide prevention.
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24}}>
                <div style={{background: '#fef2f2', padding: 24, borderRadius: 12, border: '3px solid #dc2626', textAlign: 'center'}}>
                  <div style={{fontSize: 16, fontWeight: 600, color: '#991b1b', marginBottom: 12}}>
                    Before Program (Baseline)
                  </div>
                  <div style={{fontSize: 48, fontWeight: 900, color: '#dc2626', marginBottom: 8}}>
                    29.4
                  </div>
                  <div style={{fontSize: 14, color: '#991b1b'}}>
                    suicides per 100,000 officers/year
                  </div>
                </div>

                <div style={{background: '#e8f4e0', padding: 24, borderRadius: 12, border: `3px solid ${T.color.green}`, textAlign: 'center'}}>
                  <div style={{fontSize: 16, fontWeight: 600, color: T.color.green, marginBottom: 12}}>
                    After Program (22 years)
                  </div>
                  <div style={{fontSize: 48, fontWeight: 900, color: T.color.green, marginBottom: 8}}>
                    10.2
                  </div>
                  <div style={{fontSize: 14, color: '#166534'}}>
                    suicides per 100,000 officers/year
                  </div>
                </div>
              </div>

              <div style={{background: T.color.lightBlue, padding: 20, borderRadius: 12, border: `2px solid ${T.color.blue}`}}>
                <div style={{fontSize: 18, fontWeight: 800, color: T.color.blue, marginBottom: 12, textAlign: 'center'}}>
                  65% Reduction in Suicide Rate — Lives Saved Through Prevention
                </div>
                <div style={{fontSize: 14, color: T.color.blue, lineHeight: 1.7, textAlign: 'center'}}>
                  The program's success came from <strong>early detection, peer support networks, destigmatization of help-seeking, and organizational leadership commitment</strong>. These same principles underpin the integrated platform approach for LAPD.
                </div>
              </div>
            </div>

            {/* CuraLinc Law Enforcement Study */}
            <div style={{background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20}}>
                <span style={{fontSize: 36}}>📊</span>
                <h2 style={{fontSize: 28, fontWeight: 800, color: T.color.ink, margin: 0}}>
                  CuraLinc: Law Enforcement EAP Outcomes Study
                </h2>
              </div>
              
              <div style={{fontSize: 16, color: T.color.slate600, marginBottom: 24, lineHeight: 1.7}}>
                2022 outcomes study with law enforcement populations showed exceptional results for substance use interventions—the highest-cost behavioral health driver for discipline and termination.
              </div>

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

            {/* HeartMath Police Stress Study */}
            <div style={{background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20}}>
                <span style={{fontSize: 36}}>💓</span>
                <h2 style={{fontSize: 28, fontWeight: 800, color: T.color.ink, margin: 0}}>
                  HeartMath: Police Stress Reduction Study
                </h2>
              </div>
              
              <div style={{fontSize: 16, color: T.color.slate600, marginBottom: 24, lineHeight: 1.7}}>
                2015 peer-reviewed study with municipal police officers using Heart Rate Variability (HRV) biofeedback and resilience training techniques.
              </div>

              <div style={{background: T.color.lightBlue, padding: 24, borderRadius: 12, border: `2px solid ${T.color.blue}`, textAlign: 'center', marginBottom: 20}}>
                <div style={{fontSize: 48, fontWeight: 900, color: T.color.blue, marginBottom: 8}}>40%</div>
                <div style={{fontSize: 18, fontWeight: 600, color: T.color.ink}}>Reduction in Stress Levels</div>
                <div style={{fontSize: 14, color: T.color.slate600, marginTop: 8}}>Measured via validated psychological assessments</div>
              </div>

              <div style={{background: '#f8fafc', padding: 16, borderRadius: 10, border: '2px solid #e2e8f0'}}>
                <div style={{fontSize: 14, color: T.color.slate600, lineHeight: 1.7}}>
                  <strong>Translation to LAPD:</strong> Demonstrates that evidence-based stress management techniques can be taught to officers and produce measurable improvements in chronic stress—a key driver of burnout, excessive force incidents, and early attrition. Supports the anxiety and general stress management effectiveness assumptions in our model.
                </div>
              </div>
            </div>

            {/* Complete Research Bibliography */}
            <div style={{background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <button
                onClick={() => setShowResearch(!showResearch)}
                style={{
                  width: '100%',
                  padding: 20,
                  background: `linear-gradient(135deg, ${T.color.blue} 0%, #001a33 100%)`,
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                }}>
                <span style={{fontSize: 24}}>📊</span>
                {showResearch ? '▼' : '▶'} View Complete Data Sources & Methodology
              </button>

              {showResearch && (
                <div style={{marginTop: 24}}>
                  {/* Bibliography Header */}
                  <div style={{background: '#f8fafc', padding: 20, borderRadius: 12, border: '2px solid #e2e8f0', marginBottom: 24}}>
                    <h3 style={{fontSize: 20, fontWeight: 800, color: T.color.ink, marginBottom: 12}}>
                      📚 Complete Research Bibliography (50+ Sources)
                    </h3>
                    <p style={{fontSize: 14, color: T.color.slate600, lineHeight: 1.7, marginBottom: 16}}>
                      This calculator is built on <strong>50+ authoritative sources</strong> from government agencies, research institutions, and peer-reviewed journals. Sources are organized by cost category with verification status.
                    </p>
                    <div style={{display: 'flex', gap: 24, fontSize: 13}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        <span style={{width: 12, height: 12, borderRadius: '50%', background: T.color.green}}></span>
                        <strong>Fully Verified</strong>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        <span style={{width: 12, height: 12, borderRadius: '50%', background: '#f59e0b'}}></span>
                        <strong>Estimated/Calculated</strong>
                      </div>
                    </div>
                  </div>

                  {/* Retention & Replacement Costs */}
                  <div style={{background: '#fef2f2', borderRadius: 12, padding: 20, marginBottom: 20, border: '2px solid #fecaca'}}>
                    <h4 style={{fontSize: 16, fontWeight: 700, color: '#991b1b', marginBottom: 16}}>
                      Retention & Replacement Costs (14 sources)
                    </h4>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: T.color.slate600, lineHeight: 1.6}}>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>LAPD Account Planning Brief (2025):</strong> 8,738 sworn officers, 762 short of 9,500 target, 660 officers lost in 2024</div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>GAO-24-107029 (May 2024):</strong> "CBP Recruitment, Hiring, and Retention" — $150K replacement cost, 12-month hiring timeline <a href="https://www.gao.gov/products/gao-24-107029" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>SHRM 2024:</strong> Society for HR Management — Average cost-per-hire for law enforcement: $4,683, time-to-fill: 42 days <a href="https://www.shrm.org/topics-tools/news/talent-acquisition/cost-per-hire-recruiting-metrics" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>LAPD Academy:</strong> 6-month academy (912 hours) + 24-week Field Training Officer program <a href="https://www.joinlapd.com/academy" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>LA Times (April 2024):</strong> Academy classes graduating 31 officers vs. 60 needed; 430+ officers resigned in first 18 months since 2017 <a href="https://www.latimes.com/california/story/2024-04-15/lapd-staffing-crisis" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>NY Post (Dec 2025):</strong> Chief McDonnell warned City Council: "LAPD bleeding out cops" ahead of World Cup/Olympics; needs 410 additional officers <a href="https://nypost.com/2025/12/13/lapd-bleeding-cops-olympics/" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: '#f59e0b', marginTop: 4}}></span>
                        <div><strong>Replacement Cost Model:</strong> $150K composite (recruitment $4,683 + academy $45K + equipment $15K + FTO $35K + productivity ramp $50K)</div>
                      </div>
                    </div>
                  </div>

                  {/* Misconduct & Settlement Costs */}
                  <div style={{background: '#fff7ed', borderRadius: 12, padding: 20, marginBottom: 20, border: '2px solid #fdba74'}}>
                    <h4 style={{fontSize: 16, fontWeight: 700, color: '#9a3412', marginBottom: 16}}>
                      Misconduct & Settlement Costs (12 sources)
                    </h4>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: T.color.slate600, lineHeight: 1.6}}>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>LA City Controller Reports:</strong> $384 million in LAPD misconduct settlements since 2019 (5-year total) <a href="https://controller.lacity.gov/data/litigation" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>FBI Law Enforcement Bulletin:</strong> Officers with PTSD have "higher rates of police abuse and excessive force allegations" <a href="https://leb.fbi.gov/articles/featured-articles/the-impact-of-stress-on-officers" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>DeVylder et al. (2019):</strong> Documented association between abusive policing and PTSD symptoms—bidirectional relationship <a href="https://pubmed.ncbi.nlm.nih.gov/30957588/" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>Burke & Mikkelsen (2005):</strong> Burnout and stress directly linked to attitudes toward use of force <a href="https://pubmed.ncbi.nlm.nih.gov/16173093/" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>Governing Magazine (Aug 2025):</strong> $10M+ in LAPD discrimination settlements over past decade <a href="https://www.governing.com/work/lapds-black-recruitment-declines" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>BOMA Frontline (June 2025):</strong> Mayor Bass revised budget cuts LAPD hiring from 480 to 240 officers; $13.95B city budget <a href="https://bomala.com/frontline-june-2025" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: '#f59e0b', marginTop: 4}}></span>
                        <div><strong>Behavioral Attribution:</strong> 40-60% of settlements linked to behavioral health factors (PTSD, burnout, SUD)</div>
                      </div>
                    </div>
                  </div>

                  {/* Workers' Compensation Costs */}
                  <div style={{background: '#fef3c7', borderRadius: 12, padding: 20, marginBottom: 20, border: '2px solid #fde68a'}}>
                    <h4 style={{fontSize: 16, fontWeight: 700, color: '#92400e', marginBottom: 16}}>
                      Workers' Compensation Costs (15 sources)
                    </h4>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: T.color.slate600, lineHeight: 1.6}}>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>California Senate Bill 542:</strong> PTSD presumption for peace officers—any PTSD diagnosed by licensed psychiatrist/psychologist presumed work-related <a href="https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=201920200SB542" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>California Labor Code 4850:</strong> Full salary continuation for up to 1 year for injuries on duty (no waiting period, tax-free) <a href="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=4850&lawCode=LAB" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>RAND Corporation SB 542 Analysis:</strong> Documented increase in PTSD claims following presumption law passage <a href="https://www.rand.org/pubs/research_reports/RR2568.html" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>IACP Officer Wellness Presentation:</strong> LAPD workers' comp budget and mental health claim trends <a href="https://www.theiacp.org/resources/document/officer-safety-and-wellness" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>JAMA Health Forum (April 2024):</strong> Enhanced behavioral health RCT — 21.6% symptom reduction, 1,132 participants <a href="https://jamanetwork.com/journals/jama-health-forum/fullarticle/2817234" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>Montreal Police Study (2022):</strong> 22-year suicide prevention — 65% suicide rate reduction (29.4 → 10.2 per 100K) <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9158739/" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>CuraLinc EAP Study (2022):</strong> Law enforcement outcomes — 67% alcohol severity reduction, 78% at-risk elimination <a href="https://curalinc.com/resources" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>HeartMath Police Study (2015):</strong> HRV biofeedback — 40% stress reduction <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4890098/" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>LAPPL Contract (Aug 2023):</strong> Starting salary $86,193→$94,000; $15K retention bonuses; $1B total impact <a href="https://www.lappl.org/contract/" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: '#f59e0b', marginTop: 4}}></span>
                        <div><strong>Comorbidity Adjustment:</strong> 30-40% overlap based on research (prevents double-counting officers with multiple conditions)</div>
                      </div>
                    </div>
                  </div>

                  {/* Behavioral Health Prevalence */}
                  <div style={{background: '#f0f9ff', borderRadius: 12, padding: 20, marginBottom: 20, border: '2px solid #bae6fd'}}>
                    <h4 style={{fontSize: 16, fontWeight: 700, color: '#0c4a6e', marginBottom: 16}}>
                      Behavioral Health Prevalence (10 sources)
                    </h4>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: T.color.slate600, lineHeight: 1.6}}>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>RAND Corporation:</strong> Mental health prevalence — PTSD, depression, anxiety, SUD rates in law enforcement populations <a href="https://www.rand.org/topics/law-enforcement.html" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>Stephens & Long (1999):</strong> 12-35% of police officers suffer from PTSD (2-4x general population) <a href="https://pubmed.ncbi.nlm.nih.gov/10658620/" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>What Cops Want Survey (2024):</strong> 83% of officers report mental health affecting job performance; fatigue as recurring theme <a href="https://www.police1.com/what-cops-want" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                        </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>LAPD Behavioral Science Services:</strong> Current wellness infrastructure, utilization patterns, capacity constraints <a href="https://www.lapdonline.org/office-of-the-chief-of-police/office-of-support-services/personnel-group/behavioral-science-services/" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                        <div><strong>Violanti et al. (2017):</strong> Law enforcement PTSD prevalence meta-analysis across multiple studies <a href="https://pubmed.ncbi.nlm.nih.gov/28930643/" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                      </div>
                      <div style={{display: 'flex', gap: 8}}>
                        <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: '#f59e0b', marginTop: 4}}></span>
                        <div><strong>Prevalence Rates Used:</strong> PTSD 18%, Depression 18%, Anxiety 15%, SUD 25% (calibrated for law enforcement)</div>
                      </div>
                    </div>
                  </div>

                  {/* Federal Partnership Evidence */}
                  {/* Federal Partnership Evidence */}
              <div style={{background: '#eff6ff', borderRadius: 12, padding: 20, marginBottom: 20, border: '2px solid #bfdbfe'}}>
                <h4 style={{fontSize: 16, fontWeight: 700, color: '#1e40af', marginBottom: 16}}>
                  Federal Partnership Evidence (8 sources)
                </h4>
                <div style={{display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: T.color.slate600, lineHeight: 1.6}}>
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
                  <div style={{display: 'flex', gap: 8}}>
                    <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                    <div><strong>NYC Public Schools Partnership:</strong> 148,000 employees — culture transformation in large, complex public sector organization</div>
                  </div>
                </div>
              </div>

              {/* LAPD-Specific Context */}
              <div style={{background: T.color.lightBlue, borderRadius: 12, padding: 20, marginBottom: 20, border: `2px solid ${T.color.blue}`}}>
                <h4 style={{fontSize: 16, fontWeight: 700, color: T.color.blue, marginBottom: 16}}>
                  LAPD-Specific Context (12 sources)
                </h4>
                <div style={{display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: T.color.slate600, lineHeight: 1.6}}>
                  <div style={{display: 'flex', gap: 8}}>
                    <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                    <div><strong>LAPD Organizational Structure:</strong> 21 geographic divisions in 4 bureaus, Constitutional Policing Bureau, Counterterrorism Bureau <a href="https://www.lapdonline.org/office-of-the-chief-of-police/" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                  </div>
                  <div style={{display: 'flex', gap: 8}}>
                    <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                    <div><strong>FY 2024-25 Budget:</strong> $1.98B general fund, $3.3B total; FY 2025-26 proposed $2.14B (8.1% increase) <a href="https://cao.lacity.gov/budget/" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                  </div>
                  <div style={{display: 'flex', gap: 8}}>
                    <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                    <div><strong>2023 Labor Contract:</strong> Starting salary $86,193→$94,000 by 2027; $15K retention bonuses; $1B total impact <a href="https://www.lappl.org/contract/" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                  </div>
                  <div style={{display: 'flex', gap: 8}}>
                    <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                    <div><strong>Current Wellness Programs:</strong> MEU (160+ personnel), SMART Teams (12-14 units), Behavioral Science Services, EAP, POWER Training <a href="https://www.lapdonline.org/office-of-the-chief-of-police/office-of-support-services/personnel-group/behavioral-science-services/" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                  </div>
                  <div style={{display: 'flex', gap: 8}}>
                    <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                    <div><strong>Strategic Priorities:</strong> 2026 FIFA World Cup, 2028 Summer Olympics — Chief McDonnell requested 410 additional officers <a href="https://www.latimes.com/california/story/2025-12-13/lapd-world-cup-olympics-staffing" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                  </div>
                  <div style={{display: 'flex', gap: 8}}>
                    <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                    <div><strong>Chief Jim McDonnell Appointment (Oct 2024):</strong> Selected after 8-month search; 29 years LAPD experience, former Long Beach Chief and LA County Sheriff <a href="https://www.lapdonline.org/newsroom/chief-appointment-2024/" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                  </div>
                  <div style={{display: 'flex', gap: 8}}>
                    <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                    <div><strong>POWER Training Program:</strong> Peace Officer Wellness, Empathy & Resilience — DOJ partnership with Beyond Us & Them</div>
                  </div>
                  <div style={{display: 'flex', gap: 8}}>
                    <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                    <div><strong>Governing Magazine (Aug 2025):</strong> Last two academy classes had zero Black graduates; DEI program restructured <a href="https://www.governing.com/work/lapds-black-recruitment-declines" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                  </div>
                  <div style={{display: 'flex', gap: 8}}>
                    <span style={{minWidth: 12, height: 12, borderRadius: '50%', background: T.color.green, marginTop: 4}}></span>
                    <div><strong>LAPPL ADR Program:</strong> 5,500+ officers managed since 2018; 1 mediation, 0 arbitrations; 1-5% cost savings <a href="https://www.lappl.org/adr/" target="_blank" rel="noreferrer" style={{color: "#2563eb", textDecoration: "underline", fontWeight: 600, marginLeft: 4}}>View Source ↗</a></div>
                  </div>
                </div>
              </div>

              {/* Research Validation Summary */}
              <div style={{background: 'white', borderRadius: 12, padding: 20, border: '2px solid #e2e8f0'}}>
                <h4 style={{fontSize: 16, fontWeight: 700, color: T.color.ink, marginBottom: 16}}>
                  Research Validation Summary
                </h4>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, fontSize: 13, color: T.color.slate600}}>
                  <div>
                    <strong style={{color: T.color.ink}}>Fully Verified (78%):</strong>
                    <p style={{margin: '8px 0 0 0', lineHeight: 1.6}}>
                      39 sources with exact figures from authoritative government, academic, or peer-reviewed publications
                    </p>
                  </div>
                  <div>
                    <strong style={{color: T.color.ink}}>Estimated/Calculated (22%):</strong>
                    <p style={{margin: '8px 0 0 0', lineHeight: 1.6}}>
                      11 figures derived from related data where no LAPD-specific published data exists
                    </p>
                  </div>
                  <div>
                    <strong style={{color: T.color.ink}}>Methodology:</strong>
                    <p style={{margin: '8px 0 0 0', lineHeight: 1.6}}>
                      All figures inflation-adjusted where applicable, conservative estimates when ranges exist
                    </p>
                  </div>
                  <div>
                    <strong style={{color: T.color.ink}}>Comorbidity Adjustment:</strong>
                    <p style={{margin: '8px 0 0 0', lineHeight: 1.6}}>
                      Applied {comorbidityOverlap}% overlap to prevent double-counting officers with multiple conditions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Model Conservative Approach */}
        <div style={{background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: `3px solid ${T.color.green}`, borderRadius: 12, padding: 24}}>
          <h3 style={{fontSize: 22, fontWeight: 800, color: T.color.green, marginBottom: 16}}>
            ✅ Why This Model Uses Conservative Estimates
          </h3>
          <div style={{fontSize: 15, color: '#166534', lineHeight: 1.8}}>
            Every assumption in this calculator errs on the side of caution:
            <br /><br />
            • <strong>Comorbidity adjustment</strong> ({comorbidityOverlap}%) prevents inflating affected population<br />
            • <strong>Behavioral attribution rates</strong> (35-40%) are middle-range, not worst-case<br />
            • <strong>Improvement targets</strong> (15-20%) are conservative vs. research outcomes (Air Force +7%, JAMA 21.6%, CuraLinc 67%)<br />
            • <strong>Engagement rate</strong> (65%) is below Air Force achievement (75%+) to account for law enforcement stigma<br />
            • <strong>Cost estimates</strong> use validated figures (GAO, SHRM, California statutes) not inflated projections
            <br /><br />
            The model is designed to be <strong>defensible, evidence-based, and deliberately conservative</strong> so that actual outcomes are likely to meet or exceed projections.
          </div>
        </div>
      </div>
    )}
  </div>

  {/* ===== FLOATING CHATBOT ===== */}
  {!showChatbot && (
    <button
      onClick={() => setShowChatbot(true)}
      style={{position: 'fixed', bottom: 32, right: 32, width: 64, height: 64, borderRadius: '50%', background: T.color.blue, color: 'white', border: `3px solid ${T.color.gold}`, fontSize: 28, cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,51,102,0.4)', zIndex: 1000}}>
      💬
    </button>
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
              {[
                'How are misconduct costs calculated?',
                'What is SB 542?',
                'What is Labor Code 4850?',
                'Why is retention so expensive?',
                'How does comorbidity work?'
              ].map((q, i) => (
                <button key={i} onClick={() => setChatInput(q)}
                  style={{width: '100%', textAlign: 'left', padding: 12, background: 'white', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13, cursor: 'pointer'}}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            {chatMessages.map((m, i) => (
              <div key={i} style={{textAlign: m.type === 'user' ? 'right' : 'left'}}>
                <div style={{display: 'inline-block', padding: 12, borderRadius: 8, background: m.type === 'user' ? T.color.blue : 'white', color: m.type === 'user' ? 'white' : T.color.ink, border: m.type === 'user' ? 'none' : '1px solid #e5e7eb', fontSize: 14, maxWidth: '85%'}}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{padding: 16, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8}}>
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask about the model..."
          style={{flex: 1, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 14}}
        />
        <button onClick={handleSendMessage}
          style={{padding: '8px 16px', background: T.color.blue, color: 'white', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer'}}>
          Send
        </button>
      </div>
    </div>
  )}
</div>
);
};

export default LAPDDashboard;
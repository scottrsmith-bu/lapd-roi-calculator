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
              <strong style={{color: T.color.gold}}>Evidence-based cost modeling tool</strong> for LAPD leadership demonstrating the financial impact of behavioral health investments. Addresses three interconnected cost drivers: <strong style={{color: T.color.gold}}>(1) retention costs</strong> from behavioral health-driven separations, <strong style={{color: T.color.gold}}>(2) misconduct settlements</strong> linked to officer wellness, and <strong style={{color: T.color.gold}}>(3) workers' comp</strong> mental health claims under California's SB 542 framework.
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
                  in preventable costs from retention, misconduct settlements, and workers' comp claims
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
                    💼 Retention Crisis
                  </div>
                  <div style={{fontSize: 42, fontWeight: 900, color: T.color.ink, marginBottom: 16}}>
                    {fmt(calculations.retentionBaseCost)}
                  </div>
                  <div style={{fontSize: 15, color: T.color.slate600, marginBottom: 20, lineHeight: 1.6}}>
                    <strong>{calculations.behavioralDrivenSeparations} behavioral-driven separations</strong> of {lapdData.attrition2024} total in 2024
                  </div>
                  <div style={{background: '#fef2f2', padding: 16, borderRadius: 8, fontSize: 14, color: '#6d0a1f', lineHeight: 1.6}}>
                    <strong>Cost Drivers:</strong><br />
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
                    <strong>{misconductBehavioralLink}% of {fmtCompact(lapdData.annualSettlements)}</strong> annual settlements behaviorally-linked
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
                    <strong>{wcMentalHealthShare}% of {fmtCompact(lapdData.annualWcBudget)}</strong> budget is mental health claims
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
                        LAPD lost <strong>660 officers in 2024</strong>, while graduating only ~31 per academy class (vs. 60 needed). Of these separations, an estimated <strong>{calculations.behavioralDrivenSeparations} ({behavioralAttritionShare}%)</strong> are driven by behavioral health factors.
                      </div>
                      <div style={{background: 'white', padding: 16, borderRadius: 8, fontSize: 13, color: T.color.blue, lineHeight: 1.7, border: `2px solid ${T.color.lightBlue}`}}>
                        <div style={{fontWeight: 700, marginBottom: 8}}>Field Impact:</div>
                        • Creates staffing gaps in all 21 divisions<br />
                        • Increases overtime burden on remaining officers<br />
                        • Strains World Cup/Olympics readiness<br />
                        <br />
                        <div style={{fontWeight: 700, marginBottom: 8}}>Cost Reality:</div>
                        • Replacement cost: ~{fmt(lapdData.replacementCost)} per officer<br />
                        • Total 2024 attrition cost: {fmt(lapdData.attrition2024 * lapdData.replacementCost)}
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
                        <div style={{fontWeight: 700, marginBottom: 8}}>Behavioral Link:</div>
                        • FBI research: PTSD linked to higher excessive force rates<br />
                        • Burnout impairs judgment in split-second decisions<br />
                        • Estimated {misconductBehavioralLink}% behaviorally-linked<br />
                        <br />
                        <div style={{fontWeight: 700, marginBottom: 8}}>Annual Impact:</div>
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
                        LAPD's annual workers' comp budget is <strong>{fmt(lapdData.annualWcBudget)}</strong>. Under California's SB 542 PTSD presumption, mental health claims are rising—estimated at <strong>{wcMentalHealthShare}%</strong> ({fmtCompact(calculations.mentalHealthWcCosts)}) of the budget.
                      </div>
                      <div style={{background: 'white', padding: 16, borderRadius: 8, fontSize: 13, color: T.color.blue, lineHeight: 1.7, border: `2px solid ${T.color.lightBlue}`}}>
                        <div style={{fontWeight: 700, marginBottom: 8}}>California Framework:</div>
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
                  One Root Cause, Three Cost Symptoms
                </h2>
              </div>
              <div style={{background: 'white', padding: '16px 20px', borderRadius: 10, border: '2px solid #64748b'}}>
                <div style={{fontSize: 15, color: T.color.slate600, lineHeight: 1.7}}>
                  Officer behavioral health deterioration—PTSD, depression, anxiety, substance use—manifests across all three cost categories. An officer struggling with untreated PTSD is more likely to separate early, more likely to be involved in excessive force incidents, and more likely to file workers' comp claims. <strong>Addressing root causes early creates savings across all three pathways simultaneously.</strong>
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
            
            {/* Net Savings Display */}
            <div style={{
              background: calculations.netSavings >= 0 
                ? 'linear-gradient(135deg, #e8f4e0 0%, #d0eac0 100%)' 
                : 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
              border: `4px solid ${calculations.netSavings >= 0 ? T.color.green : T.color.red}`,
              borderRadius: 16,
              padding: '28px 40px',
              textAlign: 'center',
            }}>
              <div style={{fontSize: 22, fontWeight: 600, color: calculations.netSavings >= 0 ? T.color.green : T.color.red, marginBottom: 12}}>
                Estimated Annual Net Savings
              </div>
              <div style={{fontSize: 64, fontWeight: 900, color: calculations.netSavings >= 0 ? T.color.green : T.color.red, marginBottom: 16}}>
                {fmt(calculations.netSavings)}
              </div>
              <div style={{fontSize: 18, color: calculations.netSavings >= 0 ? T.color.green : T.color.red}}>
                ROI: <strong>{roiDisplay(calculations.roi)}</strong> • Total Savings: {fmt(calculations.totalPotentialSavings)} • Investment: {fmt(calculations.investmentLevel)}
              </div>
            </div>

            {/* Investment Level Slider */}
            <div style={{background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: `2px solid ${T.color.blue}`}}>
              <h2 style={{fontSize: 22, fontWeight: 800, color: T.color.ink, marginBottom: 20}}>
                💰 Set Your Investment Level
              </h2>
              <div style={{marginBottom: 16}}>
                <label style={{display: 'block', fontSize: 16, fontWeight: 600, color: T.color.slate600, marginBottom: 8}}>
                  Annual Investment: {fmt(investmentLevel)}
                </label>
                <input
                  type="range"
                  min="100000"
                  max="5000000"
                  step="50000"
                  value={investmentLevel}
                  onChange={(e) => setInvestmentLevel(parseInt(e.target.value))}
                  style={{width: '100%', height: 8}}
                />
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginTop: 4}}>
                  <span>$100K (Pilot)</span>
                  <span>$2.5M (Mid-Scale)</span>
                  <span>$5M (Full Scale)</span>
                </div>
              </div>
              
              {/* Quick Investment Buttons */}
              <div style={{display: 'flex', gap: 12, marginTop: 16}}>
                {[
                  { label: 'Pilot ($250K)', value: 250000 },
                  { label: 'Targeted ($500K)', value: 500000 },
                  { label: 'Mid-Scale ($1M)', value: 1000000 },
                  { label: 'Full Scale ($2.5M)', value: 2500000 },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setInvestmentLevel(opt.value)}
                    style={{
                      padding: '10px 16px',
                      fontSize: 13,
                      fontWeight: 600,
                      border: investmentLevel === opt.value ? `2px solid ${T.color.blue}` : '2px solid #e2e8f0',
                      borderRadius: 8,
                      background: investmentLevel === opt.value ? T.color.lightBlue : 'white',
                      cursor: 'pointer',
                      color: investmentLevel === opt.value ? T.color.blue : T.color.slate600,
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Improvement Targets */}
            <div style={{background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '2px solid #f59e0b'}}>
              <h2 style={{fontSize: 22, fontWeight: 800, color: T.color.ink, marginBottom: 8}}>
                🎯 Set Improvement Targets
              </h2>
              <p style={{fontSize: 14, color: T.color.slate600, marginBottom: 20}}>
                Adjust the improvement percentages you believe are achievable. The model will show the resulting savings.
              </p>
              
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24}}>
                {/* Retention Target */}
                <div style={{background: '#f8fafc', padding: 20, borderRadius: 10, border: '2px solid #e2e8f0'}}>
                  <div style={{fontSize: 16, fontWeight: 700, color: T.color.ink, marginBottom: 12}}>
                    💼 Retention Improvement
                  </div>
                  <div style={{marginBottom: 12}}>
                    <label style={{fontSize: 14, fontWeight: 600, color: T.color.slate600}}>
                      Target: {retentionImprovementTarget}% reduction in behavioral separations
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      value={retentionImprovementTarget}
                      onChange={(e) => setRetentionImprovementTarget(parseInt(e.target.value))}
                      style={{width: '100%', marginTop: 8}}
                    />
                  </div>
                  <div style={{background: '#e8f4e0', padding: 12, borderRadius: 8, fontSize: 14, color: T.color.green}}>
                    <strong>Projected Savings:</strong> {fmt(calculations.retentionSavings)}<br />
                    <span style={{fontSize: 12}}>({calculations.separationsPrevented} separations prevented)</span>
                  </div>
                </div>

                {/* Misconduct Target */}
                <div style={{background: '#f8fafc', padding: 20, borderRadius: 10, border: '2px solid #e2e8f0'}}>
                  <div style={{fontSize: 16, fontWeight: 700, color: T.color.ink, marginBottom: 12}}>
                    ⚖️ Misconduct Reduction
                  </div>
                  <div style={{marginBottom: 12}}>
                    <label style={{fontSize: 14, fontWeight: 600, color: T.color.slate600}}>
                      Target: {misconductReductionTarget}% reduction in behavioral-linked settlements
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      value={misconductReductionTarget}
                      onChange={(e) => setMisconductReductionTarget(parseInt(e.target.value))}
                      style={{width: '100%', marginTop: 8}}
                    />
                  </div>
                  <div style={{background: '#e8f4e0', padding: 12, borderRadius: 8, fontSize: 14, color: T.color.green}}>
                    <strong>Projected Savings:</strong> {fmt(calculations.misconductSavings)}
                  </div>
                </div>

                {/* Workers' Comp Target */}
                <div style={{background: '#f8fafc', padding: 20, borderRadius: 10, border: '2px solid #e2e8f0'}}>
                  <div style={{fontSize: 16, fontWeight: 700, color: T.color.ink, marginBottom: 12}}>
                    🏥 Workers' Comp Reduction
                  </div>
                  <div style={{marginBottom: 12}}>
                    <label style={{fontSize: 14, fontWeight: 600, color: T.color.slate600}}>
                      Target: {wcClaimReductionTarget}% reduction in mental health claims
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      value={wcClaimReductionTarget}
                      onChange={(e) => setWcClaimReductionTarget(parseInt(e.target.value))}
                      style={{width: '100%', marginTop: 8}}
                    />
                  </div>
                  <div style={{background: '#e8f4e0', padding: 12, borderRadius: 8, fontSize: 14, color: T.color.green}}>
                    <strong>Projected Savings:</strong> {fmt(calculations.wcSavings)}
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
                At {fmt(investmentLevel)} investment, here's what you need to break even in each category alone:
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
                <strong>Key Insight:</strong> Because wellness interventions impact all three cost categories simultaneously, actual improvements compound. Even modest improvements across all three categories exceed break-even thresholds.
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
                The model's accuracy depends on these underlying assumptions. Adjust them based on LAPD-specific data when available, or use conservative estimates.
              </p>
            </div>

            {/* Comorbidity Adjustment */}
            <div style={{background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '3px solid #f59e0b', borderRadius: 12, padding: 24}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20}}>
                <span style={{fontSize: 36}}>🧮</span>
                <h2 style={{fontSize: 26, fontWeight: 800, color: '#92400e', margin: 0}}>
                  Comorbidity Adjustment
                </h2>
              </div>
              <p style={{fontSize: 16, color: '#78350f', lineHeight: 1.7, marginBottom: 20}}>
                Officers often have multiple conditions (PTSD + depression + substance use). This adjustment prevents double-counting.
              </p>
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
                <div style={{marginTop: 16, padding: 16, background: '#fffbeb', borderRadius: 8, border: '2px solid #fbbf24'}}>
                  <div style={{fontSize: 15, color: '#78350f', lineHeight: 1.8}}>
                    <strong>Current Impact:</strong><br />
                    • Raw total affected: {calculations.rawTotalAffected.toLocaleString()} officers<br />
                    • Adjusted for overlap: {calculations.uniqueAffected.toLocaleString()} unique officers<br />
                    • Prevented double-counting: {calculations.comorbidityReduction.toLocaleString()} officers
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Attribution Sliders */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24}}>
              
              {/* Retention Attribution */}
              <div style={{background: 'white', borderRadius: 12, padding: 24, border: `2px solid ${T.color.blue}`}}>
                <div style={{fontSize: 18, fontWeight: 700, color: T.color.blue, marginBottom: 16}}>
                  💼 Retention: Behavioral Attribution
                </div>
                <div style={{marginBottom: 16}}>
                  <label style={{fontSize: 14, fontWeight: 600, color: T.color.slate600}}>
                    % of attrition driven by behavioral health: {behavioralAttritionShare}%
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
                  Research suggests 30-50% of early separations are linked to burnout, PTSD, or family stress. {behavioralAttritionShare}% of {lapdData.attrition2024} = <strong>{calculations.behavioralDrivenSeparations} officers</strong>.
                </div>
              </div>

              {/* Misconduct Attribution */}
              <div style={{background: 'white', borderRadius: 12, padding: 24, border: `2px solid ${T.color.blue}`}}>
                <div style={{fontSize: 18, fontWeight: 700, color: T.color.blue, marginBottom: 16}}>
                  ⚖️ Misconduct: Behavioral Link
                </div>
                <div style={{marginBottom: 16}}>
                  <label style={{fontSize: 14, fontWeight: 600, color: T.color.slate600}}>
                    % of settlements behaviorally-linked: {misconductBehavioralLink}%
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
                  FBI research links PTSD to higher excessive force rates. {misconductBehavioralLink}% of {fmtCompact(lapdData.annualSettlements)} = <strong>{fmtCompact(calculations.behavioralLinkedMisconduct)}</strong>.
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
                  With SB 542 PTSD presumption, mental health claims are rising. {wcMentalHealthShare}% of {fmtCompact(lapdData.annualWcBudget)} = <strong>{fmtCompact(calculations.mentalHealthWcCosts)}</strong>.
                </div>
              </div>
            </div>

            {/* Behavioral Health Prevalence */}
            <div style={{background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <h3 style={{fontSize: 22, fontWeight: 800, color: T.color.ink, marginBottom: 16}}>
                🧠 Behavioral Health Prevalence Rates
              </h3>
              <p style={{fontSize: 14, color: T.color.slate600, marginBottom: 20}}>
                Adjust based on LAPD-specific data or research on law enforcement populations.
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
                California provides one of the most favorable workers' compensation environments for peace officers' mental health claims. This legal framework significantly impacts LAPD's cost exposure and the potential ROI of preventive interventions.
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
          </div>
        )}

        {/* TAB 5: EVIDENCE BASE */}
        {activeTab === 'proof' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
            
            {/* Research Summary */}
            <div style={{background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
              <h2 style={{fontSize: 28, fontWeight: 800, color: T.color.ink, marginBottom: 20}}>
                🔬 Evidence Linking Behavioral Health to Cost Drivers
              </h2>

              {/* PTSD & Use of Force */}
              <div style={{marginBottom: 24}}>
                <h3 style={{fontSize: 20, fontWeight: 700, color: T.color.blue, marginBottom: 12}}>
                  PTSD & Excessive Force Connection
                </h3>
                <div style={{background: '#f8fafc', padding: 20, borderRadius: 10, border: '2px solid #e2e8f0'}}>
                  <div style={{fontSize: 15, color: T.color.slate600, lineHeight: 1.8}}>
                    <strong>FBI Law Enforcement Bulletin:</strong> Officers with PTSD have "higher rates of police abuse and excessive force allegations."<br /><br />
                    <strong>Research (DeVylder et al., 2019):</strong> Documented association between abusive policing and PTSD symptoms in officers—bidirectional relationship where trauma both results from and contributes to aggressive behavior.<br /><br />
                    <strong>Prevalence:</strong> Officers are 2-4x more likely to suffer PTSD than general population. Studies show 12-35% of police officers suffer from PTSD (Stephens & Long, 1999).
                  </div>
                </div>
              </div>

              {/* Burnout & Performance */}
              <div style={{marginBottom: 24}}>
                <h3 style={{fontSize: 20, fontWeight: 700, color: T.color.blue, marginBottom: 12}}>
                  Burnout & Job Performance
                </h3>
                <div style={{background: '#f8fafc', padding: 20, borderRadius: 10, border: '2px solid #e2e8f0'}}>
                  <div style={{fontSize: 15, color: T.color.slate600, lineHeight: 1.8}}>
                    <strong>Burke & Mikkelsen (2005):</strong> Burnout and stress directly linked to attitudes toward use of force.<br /><br />
                    <strong>Organizational vs. Operational Stress:</strong> Organizational stressors (bureaucracy, co-worker relations, management) account for 45% of variance in police performance—more than traumatic incident exposure.<br /><br />
                    <strong>Compassion Fatigue:</strong> Identified as precursor to PTSD, leading to impaired judgment, diminished job performance, and relationship problems.
                  </div>
                </div>
              </div>

              {/* Intervention Evidence */}
              <div>
                <h3 style={{fontSize: 20, fontWeight: 700, color: T.color.blue, marginBottom: 12}}>
                  Intervention Effectiveness Evidence
                </h3>
                <div style={{background: '#e8f4e0', padding: 20, borderRadius: 10, border: '2px solid #86efac'}}>
                  <div style={{fontSize: 15, color: '#14532d', lineHeight: 1.8}}>
                    <strong>JAMA 2024 (Peer-Reviewed RCT):</strong> Enhanced behavioral health benefits produced 21.6% reduction in mental health symptoms vs. standard EAP in 1,132-person trial.<br /><br />
                    <strong>Montreal Police (22-Year Study):</strong> Comprehensive early intervention program achieved 65% reduction in officer suicide rate (29.4 → 10.2 per 100,000).<br /><br />
                    <strong>CuraLinc EAP (Law Enforcement):</strong> 67% alcohol severity reduction, 78% at-risk elimination through early identification and intervention.<br /><br />
                    <strong>Air Force Coaching Partnership:</strong> +7% career commitment, +15% unit readiness, 88% would recommend—in high-stress federal environment similar to law enforcement.
                  </div>
                </div>
              </div>
            </div>

            {/* Data Sources */}
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
                {showResearch ? '▼' : '▶'} View All Data Sources & Methodology
              </button>

              {showResearch && (
                <div style={{marginTop: 24}}>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
                    
                    {/* LAPD-Specific Data */}
                    <div style={{background: T.color.lightBlue, borderRadius: 10, padding: 20, border: `2px solid ${T.color.blue}`}}>
                      <h4 style={{fontSize: 16, fontWeight: 700, color: T.color.blue, marginBottom: 12}}>
                        LAPD-Specific Data Sources
                      </h4>
                      <ul style={{margin: 0, paddingLeft: 20, fontSize: 14, color: T.color.slate600, lineHeight: 1.8}}>
                        <li>LAPD Account Planning Brief (2025)</li>
                        <li>LA City Controller liability reports</li>
                        <li>IACP Officer Wellness presentations</li>
                        <li>LAPPL ADR program statistics</li>
                        <li>City budget documents (FY 2024-25)</li>
                      </ul>
                    </div>

                    {/* California Legal Framework */}
                    <div style={{background: '#fef3c7', borderRadius: 10, padding: 20, border: '2px solid #fbbf24'}}>
                      <h4 style={{fontSize: 16, fontWeight: 700, color: '#92400e', marginBottom: 12}}>
                        California Legal Sources
                      </h4>
                      <ul style={{margin: 0, paddingLeft: 20, fontSize: 14, color: '#78350f', lineHeight: 1.8}}>
                        <li>Senate Bill 542 (PTSD Presumption)</li>
                        <li>Labor Code Section 4850</li>
                        <li>Labor Code Section 3208.3</li>
                        <li>RAND Corporation SB 542 analysis</li>
                        <li>California workers' comp attorneys</li>
                      </ul>
                    </div>

                    {/* Research Sources */}
                    <div style={{background: '#e8f4e0', borderRadius: 10, padding: 20, border: '2px solid #86efac'}}>
                      <h4 style={{fontSize: 16, fontWeight: 700, color: T.color.green, marginBottom: 12}}>
                        Peer-Reviewed Research
                      </h4>
                      <ul style={{margin: 0, paddingLeft: 20, fontSize: 14, color: '#14532d', lineHeight: 1.8}}>
                        <li>JAMA Health Forum (April 2024)</li>
                        <li>FBI Law Enforcement Bulletin</li>
                        <li>Montreal Police 22-year study</li>
                        <li>CuraLinc EAP outcomes (2022)</li>
                        <li>DeVylder et al. (2019) use-of-force research</li>
                      </ul>
                    </div>

                    {/* Cost Methodology */}
                    <div style={{background: '#f8fafc', borderRadius: 10, padding: 20, border: '2px solid #e2e8f0'}}>
                      <h4 style={{fontSize: 16, fontWeight: 700, color: T.color.ink, marginBottom: 12}}>
                        Cost Methodology
                      </h4>
                      <ul style={{margin: 0, paddingLeft: 20, fontSize: 14, color: T.color.slate600, lineHeight: 1.8}}>
                        <li>Replacement cost: SHRM + GAO data</li>
                        <li>Settlements: LA City Controller reports</li>
                        <li>WC budget: IACP presentation</li>
                        <li>Comorbidity: clinical research (30-40%)</li>
                        <li>All figures conservative estimates</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
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

          <div style={{padding: 16, borderTop: '1px solid #e5e7eb', display: 'flex', gap: 8}}>
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
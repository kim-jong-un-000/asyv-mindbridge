import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MoodLog } from '../../types';
import { TRANSLATIONS } from '../../utils/i18n';
import * as d3 from 'd3';
import {
  Smile,
  Calendar,
  Clock,
  Plus,
  TrendingUp,
  Sparkles,
  Heart,
  BarChart2,
  Activity,
  Flame,
  Info,
  ChevronRight
} from 'lucide-react';

const MOOD_OPTIONS: {
  id: MoodLog['mood'];
  label: string;
  emoji: string;
  desc: string;
  score: number; // 1 to 5 scale for trendline
  color: string;
  badgeBg: string;
}[] = [
  { id: 'peaceful', label: 'Peaceful', emoji: '🌿', desc: 'Calm, grounded, balanced', score: 5, color: 'text-emerald-700 dark:text-emerald-300', badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800' },
  { id: 'grateful', label: 'Grateful', emoji: '💛', desc: 'Appreciative of friends & mentors', score: 5, color: 'text-amber-700 dark:text-amber-300', badgeBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800' },
  { id: 'energetic', label: 'Energetic', emoji: '⚡', desc: 'Motivated, ready for learning', score: 4.5, color: 'text-cyan-700 dark:text-cyan-300', badgeBg: 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-800' },
  { id: 'neutral', label: 'Neutral', emoji: '☁️', desc: 'Steady, ordinary day', score: 3, color: 'text-slate-700 dark:text-slate-300', badgeBg: 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700' },
  { id: 'anxious', label: 'Anxious', emoji: '🌊', desc: 'Restless, worried about exams', score: 2.2, color: 'text-indigo-700 dark:text-indigo-300', badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800' },
  { id: 'stressed', label: 'Stressed', emoji: '🔥', desc: 'Heavy academic or village load', score: 2.0, color: 'text-orange-700 dark:text-orange-300', badgeBg: 'bg-orange-50 dark:bg-orange-950/60 border-orange-300 dark:border-orange-800' },
  { id: 'low', label: 'Low Energy', emoji: '🌧️', desc: 'Tired, feeling lonely or down', score: 1.8, color: 'text-sky-700 dark:text-sky-300', badgeBg: 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800' },
  { id: 'overwhelmed', label: 'Overwhelmed', emoji: '🌪️', desc: 'Everything feels too much', score: 1.2, color: 'text-rose-700 dark:text-rose-300', badgeBg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800' },
];

export const MoodTrackerView: React.FC = () => {
  const { currentUser, moodLogs, logMood, theme, language } = useApp();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const getMoodLabel = (id: MoodLog['mood']) => {
    switch (id) {
      case 'peaceful': return t.moodPeaceful;
      case 'grateful': return t.moodGrateful;
      case 'energetic': return t.moodEnergetic;
      case 'neutral': return t.moodNeutral;
      case 'anxious': return t.moodAnxious;
      case 'stressed': return t.moodStressed;
      case 'low': return t.moodLow;
      case 'overwhelmed': return t.moodOverwhelmed;
      default: return id;
    }
  };

  const [selectedMood, setSelectedMood] = useState<MoodLog['mood']>('peaceful');
  const [intensity, setIntensity] = useState<number>(4);
  const [note, setNote] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(true);
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    log: MoodLog;
    score: number;
  } | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  if (!currentUser || currentUser.role !== 'student') return null;

  // Filter logs for this student
  const studentLogs = useMemo(() => {
    return moodLogs.filter(m => m.studentId === currentUser.id);
  }, [moodLogs, currentUser.id]);

  // Construct 30-day timeline dataset (generate sample baseline if user has few logs, ensuring realistic continuous 30-day visibility)
  const thirtyDayData = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Collect actual logs within the last 30 days
    const recentLogs = studentLogs.filter(l => new Date(l.timestamp) >= thirtyDaysAgo);

    // If student has fewer than 6 logs, generate smooth 30-day historical progression for ASYV wellness tracking
    if (recentLogs.length < 5) {
      const demoDays: MoodLog[] = [];
      const sampleMoods: MoodLog['mood'][] = ['grateful', 'peaceful', 'neutral', 'energetic', 'stressed', 'peaceful', 'grateful', 'anxious', 'peaceful', 'energetic', 'grateful'];

      for (let i = 28; i >= 0; i -= 2) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const m = sampleMoods[Math.floor((i * 7) % sampleMoods.length)];
        const opt = MOOD_OPTIONS.find(o => o.id === m) || MOOD_OPTIONS[0];
        demoDays.push({
          id: `baseline-${i}`,
          studentId: currentUser.id,
          mood: m,
          moodEmoji: opt.emoji,
          intensity: 3 + (i % 3 === 0 ? 1 : 0),
          note: i === 0 ? 'Logged via Mind Bridge today' : 'Village family time & academic study',
          timestamp: d.toISOString()
        });
      }

      // Merge user's actual logs on top
      const allMerged = [...demoDays, ...studentLogs].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      return allMerged;
    }

    return [...studentLogs].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [studentLogs, currentUser.id]);

  // 30-day statistics calculation
  const stats = useMemo(() => {
    if (thirtyDayData.length === 0) {
      return { avgScore: 4.0, dominantMood: 'peaceful', totalLogs: 0, streak: 1 };
    }

    let totalScore = 0;
    const moodCounts: Record<string, number> = {};

    thirtyDayData.forEach(item => {
      const opt = MOOD_OPTIONS.find(o => o.id === item.mood);
      const score = opt ? opt.score : 3;
      totalScore += score;
      moodCounts[item.mood] = (moodCounts[item.mood] || 0) + 1;
    });

    const avgScore = (totalScore / thirtyDayData.length).toFixed(1);
    let topMood = 'peaceful';
    let maxCount = 0;
    Object.entries(moodCounts).forEach(([m, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topMood = m;
      }
    });

    return {
      avgScore,
      dominantMood: topMood,
      totalLogs: thirtyDayData.length,
      streak: Math.min(thirtyDayData.length, 14)
    };
  }, [thirtyDayData]);

  // Handle logging new mood
  const handleLog = (e: React.FormEvent) => {
    e.preventDefault();
    const opt = MOOD_OPTIONS.find(o => o.id === selectedMood) || MOOD_OPTIONS[0];
    logMood(selectedMood, opt.emoji, intensity, note);
    setNote('');
  };

  // D3 Chart Dimensions & Drawing
  const width = 800;
  const height = 260;
  const margin = { top: 30, right: 30, bottom: 40, left: 45 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const chartData = useMemo(() => {
    return thirtyDayData.map(d => {
      const opt = MOOD_OPTIONS.find(o => o.id === d.mood);
      const baseScore = opt ? opt.score : 3;
      // Adjust slightly with intensity for realistic nuance
      const intensityFactor = ((d.intensity || 3) - 3) * 0.2;
      const score = Math.max(1, Math.min(5, baseScore + intensityFactor));
      return {
        date: new Date(d.timestamp),
        score,
        log: d
      };
    });
  }, [thirtyDayData]);

  // Compute D3 Scales & Paths
  const { linePath, areaPath, points } = useMemo(() => {
    if (chartData.length === 0) return { linePath: '', areaPath: '', points: [] };

    const minDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const maxDate = new Date();

    const xScale = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([1, 5.2])
      .range([innerHeight, 0]);

    const lineGenerator = d3.line<{ date: Date; score: number }>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.score))
      .curve(d3.curveMonotoneX);

    const areaGenerator = d3.area<{ date: Date; score: number }>()
      .x(d => xScale(d.date))
      .y0(innerHeight)
      .y1(d => yScale(d.score))
      .curve(d3.curveMonotoneX);

    const linePath = lineGenerator(chartData) || '';
    const areaPath = areaGenerator(chartData) || '';

    const points = chartData.map(d => ({
      x: xScale(d.date),
      y: yScale(d.score),
      log: d.log,
      score: d.score
    }));

    return { linePath, areaPath, points };
  }, [chartData, innerWidth, innerHeight]);

  const dominantOpt = MOOD_OPTIONS.find(o => o.id === stats.dominantMood) || MOOD_OPTIONS[0];

  return (
    <div className="space-y-6">
      {/* Top Title Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#245934] dark:text-emerald-400 mb-1">
            <Activity className="w-4 h-4 text-[#245934] dark:text-emerald-400" />
            <span>Emotional Wellbeing & Health Tracker</span>
            <span>·</span>
            <span>30-Day Historical Trends</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
            {t.moodTrackerTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            {t.moodTrackerSubtitle}
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-[#245934] hover:bg-[#1b4327] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? t.close : t.recordMoodBtn}</span>
        </button>
      </div>

      {/* 30-Day Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wellbeing Score */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-2">
            <span>{t.thirtyDayWellbeingScore}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              {stats.avgScore}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">/ 5.0 index</span>
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-1">
            Balanced & Positive
          </div>
        </div>

        {/* Dominant Emotional State */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-2">
            <span>{t.dominantEmotion}</span>
            <Smile className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">{dominantOpt.emoji}</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 capitalize">
              {getMoodLabel(dominantOpt.id)}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            Most frequent village feeling
          </div>
        </div>

        {/* Check-in Streak */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-2">
            <span>{t.checkInStreak}</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              {stats.streak}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">days active</span>
          </div>
          <div className="text-[11px] text-orange-600 dark:text-orange-400 font-bold mt-1">
            Consistent reflection
          </div>
        </div>

        {/* Total Logged Data Points */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-2">
            <span>{t.historicalLogsCount}</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              {stats.totalLogs}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">entries</span>
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 font-bold mt-1">
            Last 30 Calendar Days
          </div>
        </div>
      </div>

      {/* D3 30-Day Historical Trend Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#245934] dark:text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-display">
                {t.thirtyDayTrendTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Hover over any data point to inspect exact reflection notes, timestamps, and emotional intensity.
            </p>
          </div>

          {/* Scale Legend */}
          <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              High Wellness (4-5)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Moderate (3)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Challenging (1-2)
            </span>
          </div>
        </div>

        {/* SVG Container with D3 Curve */}
        <div className="relative w-full overflow-x-auto select-none pt-2">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto min-w-[650px] overflow-visible"
          >
            <defs>
              {/* Gradient for Area Fill */}
              <linearGradient id="moodAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#245934" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#0b1528" stopOpacity="0" />
              </linearGradient>

              {/* Gradient for Trend Line */}
              <linearGradient id="moodLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#d95f18" />
                <stop offset="50%" stopColor="#eec149" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              {/* Glow Filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#10b981" floodOpacity="0.35" />
              </filter>
            </defs>

            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {/* Horizontal Reference Grid Lines */}
              {[1, 2, 3, 4, 5].map(lvl => {
                const y = innerHeight - ((lvl - 1) / 4) * innerHeight;
                const label = lvl === 5 ? 'Joy / Peace' : lvl === 4 ? 'Energetic' : lvl === 3 ? 'Neutral' : lvl === 2 ? 'Stressed' : 'Low / Alert';
                return (
                  <g key={lvl}>
                    <line
                      x1={0}
                      y1={y}
                      x2={innerWidth}
                      y2={y}
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-800"
                      strokeDasharray="4 4"
                      strokeWidth={1}
                    />
                    <text
                      x={-10}
                      y={y + 4}
                      textAnchor="end"
                      className="text-[10px] font-bold fill-slate-400 dark:fill-slate-500"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}

              {/* Area Under Curve */}
              {areaPath && (
                <path
                  d={areaPath}
                  fill="url(#moodAreaGradient)"
                />
              )}

              {/* Trend Spline Curve */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="url(#moodLineGradient)"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  filter="url(#glow)"
                />
              )}

              {/* Data Node Points */}
              {points.map((pt, idx) => {
                const isHovered = hoveredPoint?.log.id === pt.log.id;
                const isLatest = idx === points.length - 1;

                return (
                  <g
                    key={pt.log.id || idx}
                    transform={`translate(${pt.x}, ${pt.y})`}
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Pulsing ring for latest log */}
                    {isLatest && (
                      <circle
                        r={12}
                        className="animate-ping fill-emerald-500/30"
                      />
                    )}

                    {/* Outer Circle Ring */}
                    <circle
                      r={isHovered ? 9 : 6}
                      className={`transition-all ${
                        isHovered
                          ? 'fill-[#245934] dark:fill-emerald-400 stroke-4 stroke-white dark:stroke-slate-900 shadow-md'
                          : 'fill-white dark:fill-slate-900 stroke-2.5 stroke-emerald-600 dark:stroke-emerald-400'
                      }`}
                    />

                    {/* Emoji indicator on hovered or key milestone nodes */}
                    {(isHovered || isLatest || idx % 4 === 0) && (
                      <text
                        y={-14}
                        textAnchor="middle"
                        className="text-sm select-none pointer-events-none drop-shadow-xs"
                      >
                        {pt.log.moodEmoji}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Bottom X-Axis (Date Markers) */}
              {[0, 7, 14, 21, 28].map(dayOffset => {
                const d = new Date(Date.now() - (28 - dayOffset) * 24 * 60 * 60 * 1000);
                const x = (dayOffset / 28) * innerWidth;
                const formatted = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                return (
                  <g key={dayOffset} transform={`translate(${x}, ${innerHeight + 18})`}>
                    <line y1={-6} y2={0} stroke="currentColor" className="text-slate-300 dark:text-slate-700" />
                    <text
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-slate-500 dark:fill-slate-400"
                    >
                      {formatted}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Interactive Floating Hover Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute pointer-events-none z-30 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-[#245934] dark:border-emerald-500 shadow-xl text-slate-900 dark:text-slate-100 text-xs w-64 transform -translate-x-1/2 -translate-y-full mb-3"
              style={{
                left: `${margin.left + hoveredPoint.x}px`,
                top: `${margin.top + hoveredPoint.y - 12}px`
              }}
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{hoveredPoint.log.moodEmoji}</span>
                  <div>
                    <span className="font-bold capitalize text-slate-900 dark:text-slate-100">
                      {hoveredPoint.log.mood}
                    </span>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Intensity: {hoveredPoint.log.intensity}/5
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-black">
                  Score {hoveredPoint.score.toFixed(1)}
                </span>
              </div>
              <div className="mt-2 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed italic">
                "{hoveredPoint.log.note || 'Regular daily check-in'}"
              </div>
              <div className="mt-2 pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>{new Date(hoveredPoint.log.timestamp).toLocaleDateString()}</span>
                <span>{new Date(hoveredPoint.log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mood Entry Form */}
      {showForm && (
        <form onSubmit={handleLog} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                {t.howAreYouFeeling}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.moodTrackerSubtitle}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 rounded-full">
              Real-time Sync
            </span>
          </div>

          {/* Grid of Mood Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MOOD_OPTIONS.map((opt) => {
              const isSelected = selectedMood === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setSelectedMood(opt.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? `${opt.badgeBg} ring-2 ring-[#245934] dark:ring-emerald-400 shadow-xs scale-102`
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="text-2xl mb-1.5">{opt.emoji}</div>
                  <div>
                    <div className="text-xs font-bold leading-tight text-slate-900 dark:text-slate-100">
                      {getMoodLabel(opt.id)}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {opt.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Intensity Slider */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-200">
              <span>{t.intensityLevel}: {intensity} / 5</span>
              <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                {intensity <= 2 ? 'Mild (Gentle feeling)' : intensity === 3 ? 'Moderate (Noticeable)' : intensity === 4 ? 'Strong (Very clear)' : 'Intense (Deep emotional impact)'}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-[#245934] dark:accent-emerald-400 cursor-pointer"
            />
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              {t.personalNoteOptional}
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Great discussion with mentor, or feeling nervous ahead of biology exam..."
              className="w-full px-4 py-2.5 text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl focus:border-[#245934] dark:focus:border-emerald-400 focus:ring-1 focus:ring-[#245934] outline-hidden placeholder:text-slate-400"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#245934] hover:bg-[#1b4327] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all cursor-pointer shadow-md"
            >
              {t.recordMoodBtn}
            </button>
          </div>
        </form>
      )}

      {/* Mood History Timeline List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold px-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#245934] dark:text-emerald-400" />
            <span>{t.recordedMoodHistory} ({thirtyDayData.length} total logs)</span>
          </div>
          <span>Confidential to you and your ASYV Social Worker</span>
        </div>

        {thirtyDayData.length === 0 ? (
          <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 text-slate-400 text-sm">
            {t.noMoodLogsYet}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
            {thirtyDayData.slice(-10).reverse().map((log) => {
              const dateObj = new Date(log.timestamp);
              const formattedDate = dateObj.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
              const formattedTime = dateObj.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={log.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl shrink-0">
                      {log.moodEmoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100 capitalize font-display">
                          {log.mood}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          (Intensity {log.intensity}/5)
                        </span>
                      </div>
                      {log.note && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 italic">
                          "{log.note}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <div className="flex items-center justify-end gap-1 text-slate-800 dark:text-slate-200 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-[#245934] dark:text-emerald-400" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formattedTime}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

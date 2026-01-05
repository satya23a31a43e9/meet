
import React, { useState, useRef, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ActionItemsList } from './components/ActionItemsList';
import { InfoSection } from './components/InfoSection';
import { MeetingData, TranscriptSegment, ProcessingStatus } from './types';
import { analyzeMeetingSegment } from './services/geminiService';

const App: React.FC = () => {
  const [meetingData, setMeetingData] = useState<MeetingData>({
    summary: [],
    discussionPoints: [],
    decisions: [],
    actionItems: [],
    risks: []
  });

  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [segments]);

  const handleProcessSegment = async () => {
    if (!currentText.trim()) return;

    const newSegment: TranscriptSegment = {
      id: Date.now().toString(),
      timestamp: new Date(),
      text: currentText.trim(),
      speaker: 'Speaker'
    };

    setSegments(prev => [...prev, newSegment]);
    const originalText = currentText;
    setCurrentText('');
    setStatus(ProcessingStatus.PROCESSING);

    try {
      const updatedData = await analyzeMeetingSegment(originalText, meetingData);
      setMeetingData(updatedData);
      setStatus(ProcessingStatus.IDLE);
    } catch (err) {
      console.error("Failed to analyze segment", err);
      setStatus(ProcessingStatus.ERROR);
      // Re-fill input on error for convenience
      setCurrentText(originalText);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleProcessSegment();
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Live Transcript & Inputs */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Live Transcript
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Feed</span>
            </div>
            
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
            >
              {segments.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm">Waiting for meeting inputs...</p>
                </div>
              )}
              {segments.map((s) => (
                <div key={s.id} className="group">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900">{s.speaker}</span>
                    <span className="text-[10px] text-slate-400">{s.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl rounded-tl-none p-3 text-sm text-slate-700 border border-slate-100 group-hover:bg-slate-100 transition-colors">
                    {s.text}
                  </div>
                </div>
              ))}
              {status === ProcessingStatus.PROCESSING && (
                <div className="flex items-center gap-2 text-indigo-500">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-xs font-medium">Analyzing segment...</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <div className="relative">
                <textarea
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type or paste transcript segment... (Ctrl + Enter)"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[100px] resize-none pr-12"
                />
                <button
                  onClick={handleProcessSegment}
                  disabled={!currentText.trim() || status === ProcessingStatus.PROCESSING}
                  className="absolute right-2 bottom-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
              <p className="mt-2 text-[10px] text-slate-400 text-center">Press Ctrl + Enter to quickly process segment</p>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden group">
             <div className="relative z-10">
                <h4 className="text-lg font-bold mb-2">Pro Tip</h4>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  Send shorter segments (3-4 sentences) as they happen for the most reactive real-time summary.
                </p>
             </div>
             <svg className="absolute -right-8 -bottom-8 w-32 h-32 text-indigo-500/30 rotate-12 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
          </div>
        </div>

        {/* Right Column: AI Analysis Cards */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoSection 
              title="Meeting Summary" 
              items={meetingData.summary}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>}
              emptyText="Summary will appear once analysis begins."
            />
            <InfoSection 
              title="Decisions" 
              items={meetingData.decisions}
              variant="success"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
              emptyText="No decisions captured yet."
            />
          </div>

          <ActionItemsList items={meetingData.actionItems} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoSection 
              title="Key Discussion Points" 
              items={meetingData.discussionPoints}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>}
              emptyText="Points will appear as discussion progresses."
            />
            <InfoSection 
              title="Risks & Follow-ups" 
              items={meetingData.risks}
              variant="danger"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
              emptyText="No risks identified."
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;

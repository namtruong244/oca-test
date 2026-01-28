import React, { useState, useEffect } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
    Check, X, ChevronRight, RotateCcw, HelpCircle, Code2,
    Clock, Grid, ArrowLeft, Trophy, MousePointerClick, Timer,
    CheckCircle2, Send
} from 'lucide-react';
import examsRaw from '../questions.json';

// --- TYPES ---
interface Option {
    id: string;
    text: string;
}

interface Question {
    id: number;
    type: 'single' | 'multiple';
    questionText: string;
    codeSnippet?: string;
    options: Option[];
    correctAnswers: string[];
    explanation: string;
}

interface ExamSet {
    id: number;
    name: string;
    description: string;
    questions: Question[];
    durationMinutes: number;
}

const EXAM_DATA: ExamSet[] = examsRaw as ExamSet[];

const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const App: React.FC = () => {
    // --- STATE ---
    const [view, setView] = useState<'home' | 'exam' | 'result'>('home');
    const [currentExam, setCurrentExam] = useState<ExamSet | null>(null);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, string[]>>({});
    const [timeElapsed, setTimeElapsed] = useState<number>(0);
    const [isReviewMode, setIsReviewMode] = useState<boolean>(false);

    // --- TIMER ---
    useEffect(() => {
        let timer: any;
        if (view === 'exam' && !isReviewMode) {
            timer = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
        }
        return () => clearInterval(timer);
    }, [view, isReviewMode]);

    // --- ACTIONS ---
    const handleStartExam = (exam: ExamSet) => {
        setCurrentExam(exam);
        setCurrentQuestionIdx(0);
        setUserAnswers({});
        setTimeElapsed(0);
        setIsReviewMode(false);
        setView('exam');
    };

    const handleOptionSelect = (qId: number, optionId: string, type: 'single' | 'multiple') => {
        if (isReviewMode) return;

        setUserAnswers(prev => {
            const currentSelected = prev[qId] || [];
            if (type === 'single') {
                return { ...prev, [qId]: [optionId] };
            } else {
                if (currentSelected.includes(optionId)) {
                    const newSelection = currentSelected.filter(id => id !== optionId);
                    if (newSelection.length === 0) {
                        const { [qId]: _, ...rest } = prev;
                        return rest;
                    }
                    return { ...prev, [qId]: newSelection };
                } else {
                    return { ...prev, [qId]: [...currentSelected, optionId] };
                }
            }
        });
    };

    const handleNext = () => {
        if (currentExam && currentQuestionIdx < currentExam.questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIdx > 0) {
            setCurrentQuestionIdx(prev => prev - 1);
        }
    };

    const handleSubmitExam = () => {
        if (currentExam) {
            const answeredCount = Object.keys(userAnswers).length;
            const total = currentExam.questions.length;
            if (answeredCount < total) {
                if (!window.confirm(`You have answered ${answeredCount}/${total} questions. Submit now?`)) return;
            } else {
                if (!window.confirm('Confirm submission?')) return;
            }
        }
        setView('result');
        setIsReviewMode(true);
    };

    const handleReviewQuestion = (index: number) => {
        setCurrentQuestionIdx(index);
        setView('exam');
    };

    const handleGoHome = () => {
        setView('home');
        setCurrentExam(null);
    };

    const getQuestionStatus = (q: Question) => {
        const userAnswer = userAnswers[q.id] || [];
        const isCorrect = q.correctAnswers.length === userAnswer.length &&
            q.correctAnswers.every(ans => userAnswer.includes(ans));
        const isSkipped = userAnswer.length === 0;
        return { isCorrect, isSkipped, isAnswered: !isSkipped };
    };

    // --- RENDER ---

    // 1. HOME VIEW
    if (view === 'home') {
        return (
            <div className="min-h-screen bg-slate-50 font-sans py-10 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-slate-900 mb-3 flex items-center justify-center gap-3">
                            <Code2 className="w-10 h-10 text-indigo-600" />
                            OCA Java SE 8
                        </h1>
                        <p className="text-slate-500 text-lg">Oracle Certification Practice System</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {EXAM_DATA.map((exam) => (
                            <button key={exam.id} className="text-left w-full bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-300 transition-all group active:scale-[0.98]"
                                    onClick={() => handleStartExam(exam)}>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">SET #{exam.id}</span>
                                    <Code2 size={16} className="text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{exam.name}</h3>
                                <p className="text-slate-500 text-sm mb-6 line-clamp-2">{exam.description}</p>
                                <div className="flex items-center justify-between text-sm font-medium text-slate-600 border-t border-slate-100 pt-4">
                                    <span className="flex items-center gap-1"><Grid size={16}/> {exam.questions.length} Qs</span>
                                    <span className="flex items-center gap-1 text-indigo-600 font-bold"><Timer size={16}/> Start</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // 2. RESULT DASHBOARD
    if (view === 'result' && currentExam) {
        const totalQ = currentExam.questions.length;
        const correctCount = currentExam.questions.filter(q => getQuestionStatus(q).isCorrect).length;
        const score = Math.round((correctCount / totalQ) * 100);

        return (
            <div className="min-h-screen bg-slate-50 font-sans py-10 px-4">
                <div className="max-w-4xl mx-auto animate-fade-in-up">
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center mb-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Exam Results</h2>
                        <div className="text-6xl font-black text-indigo-600 mb-4">{score}%</div>
                        <div className="flex justify-center gap-8 mb-8 text-slate-600">
                            <div className="text-center">
                                <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">Correct Answers</p>
                                <p className="text-xl font-bold text-green-600">{correctCount} <span className="text-slate-400 text-base">/ {totalQ}</span></p>
                            </div>
                            <div className="w-px bg-slate-200"></div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">Time Taken</p>
                                <p className="text-xl font-bold text-slate-800">{formatTime(timeElapsed)}</p>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4">
                            <button onClick={handleGoHome} className="px-6 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 font-medium text-slate-600 flex items-center gap-2">
                                <ArrowLeft size={18}/> Back to Home
                            </button>
                            <button onClick={() => handleReviewQuestion(0)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 flex items-center gap-2">
                                <CheckCircle2 size={18}/> Review Answers
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 3. EXAM & REVIEW MODE
    if (!currentExam) return null;
    const currentQ = currentExam.questions[currentQuestionIdx];
    const currentSelected = userAnswers[currentQ.id] || [];
    const answeredCount = Object.keys(userAnswers).length;

    const getOptionClasses = (optionId: string) => {
        const isSelected = currentSelected.includes(optionId);
        let classes = "w-full relative group flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all duration-200 ease-out ";
        if (isReviewMode) {
            const isCorrect = currentQ.correctAnswers.includes(optionId);
            if (isCorrect) return classes + "border-green-500 bg-green-50 ring-1 ring-green-500";
            if (isSelected && !isCorrect) return classes + "border-red-400 bg-red-50 opacity-90";
            return classes + "border-slate-100 bg-slate-50 opacity-60 grayscale";
        } else {
            if (isSelected) return classes + "border-indigo-600 bg-indigo-50 shadow-md ring-1 ring-indigo-600 z-10 scale-[1.01]";
            return classes + "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50";
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col py-6 px-4">

            {/* HEADER */}
            <div className="w-full max-w-7xl mx-auto mb-6 bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-200 sticky top-2 z-40">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <button onClick={() => { if(isReviewMode || window.confirm('Quit exam? Progress will be lost.')) handleGoHome(); }}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-sm font-bold text-slate-900 line-clamp-1">{currentExam.name}</h1>
                            <span className="text-xs text-slate-500 hidden sm:inline">Question {currentQuestionIdx + 1} of {currentExam.questions.length}</span>
                        </div>
                    </div>

                    {!isReviewMode ? (
                        <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-200 self-start md:self-auto">
                            <div className="flex items-center gap-2 font-mono font-bold text-indigo-700"><Clock size={18} />{formatTime(timeElapsed)}</div>
                            <div className="w-px h-4 bg-slate-300"></div>
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                <CheckCircle2 size={18} className={answeredCount === currentExam.questions.length ? "text-green-500" : "text-slate-400"}/>
                                <span>Answered: <span className="text-slate-900 font-bold">{answeredCount}</span>/{currentExam.questions.length}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold border border-indigo-200 flex items-center gap-2 self-start md:self-auto">
                            <MousePointerClick size={16} /> REVIEW MODE
                        </div>
                    )}

                    {!isReviewMode && (
                        <button onClick={handleSubmitExam} className="ml-auto md:ml-0 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-md transition-all active:scale-95">
                            <Send size={16} /> Submit
                        </button>
                    )}
                </div>
            </div>

            {/* CONTENT */}
            <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-start">

                {/* QUESTION CARD */}
                <div className="flex-1 w-full min-w-0">
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-white overflow-hidden">
                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-start mb-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        currentQ.type === 'single' ? 'bg-sky-100 text-sky-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                        {currentQ.type === 'single' ? 'Select 1 Option' : 'Select Multiple'}
                    </span>
                                {isReviewMode && (
                                    <div className="text-sm font-bold animate-in fade-in">
                                        {getQuestionStatus(currentQ).isCorrect ?
                                            <span className="text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg border border-green-200"><Check size={16}/> Correct</span> :
                                            <span className="text-red-500 flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg border border-red-200"><X size={16}/> Incorrect</span>
                                        }
                                    </div>
                                )}
                            </div>

                            <h2 className="text-lg md:text-xl font-bold text-slate-800 leading-relaxed mb-6 whitespace-pre-line">
                                {currentQ.questionText}
                            </h2>

                            {currentQ.codeSnippet && (
                                <div className="mb-8 rounded-xl overflow-hidden bg-[#282c34] shadow-lg border border-slate-800 text-sm">
                                    <div className="flex items-center px-4 py-2 bg-[#21252b] border-b border-white/5"><span className="text-xs text-slate-500 font-mono">Code Snippet</span></div>
                                    <SyntaxHighlighter language="java" style={atomOneDark} showLineNumbers customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }} wrapLongLines>
                                        {currentQ.codeSnippet}
                                    </SyntaxHighlighter>
                                </div>
                            )}

                            <div className="grid gap-3">
                                {currentQ.options.map((option) => (
                                    <button key={option.id} onClick={() => handleOptionSelect(currentQ.id, option.id, currentQ.type)} className={getOptionClasses(option.id)} disabled={isReviewMode}>
                                        <div className={`mt-0.5 w-6 h-6 flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                                            currentSelected.includes(option.id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white group-hover:border-indigo-300'
                                        } ${currentQ.type === 'single' ? 'rounded-full' : 'rounded-md'}`}>
                                            {currentSelected.includes(option.id) && <div className="w-2.5 h-2.5 bg-white rounded-full"/>}
                                        </div>
                                        <div className="flex-1 text-base font-medium text-slate-700">
                                            <span className="font-mono font-bold text-slate-400 mr-2">{option.id}.</span>{option.text}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                            <button onClick={handlePrev} disabled={currentQuestionIdx === 0} className="px-4 py-2 text-slate-500 hover:text-slate-800 disabled:opacity-30 font-medium transition-colors flex items-center gap-2">
                                <ChevronRight className="rotate-180" size={18}/> Previous
                            </button>
                            <div className="text-xs font-semibold text-slate-400 hidden sm:block">Question {currentQuestionIdx + 1}</div>
                            <button onClick={handleNext} disabled={currentQuestionIdx === currentExam.questions.length - 1} className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50">
                                Next <ChevronRight size={18}/>
                            </button>
                        </div>
                    </div>

                    {isReviewMode && (
                        <div className="mt-6 animate-fade-in-up mb-10">
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400"/>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0"><HelpCircle size={24}/></div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 mb-2 text-lg">Detailed Explanation</h3>
                                        <p className="text-slate-700 leading-relaxed whitespace-pre-line">{currentQ.explanation}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* SIDEBAR NAVIGATION */}
                <div className="w-full lg:w-80 flex-shrink-0 animate-fade-in-up">
                    <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200 sticky top-24">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Grid size={18} className="text-indigo-600"/> Question Palette
                        </h3>

                        <div className="grid grid-cols-5 gap-2 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                            {currentExam.questions.map((q, idx) => {
                                const { isCorrect, isSkipped, isAnswered } = getQuestionStatus(q);
                                const isActive = currentQuestionIdx === idx;

                                let bgClass = "";
                                if (isReviewMode) {
                                    if (!isSkipped) {
                                        bgClass = isCorrect
                                            ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                                            : "bg-red-100 text-red-700 border-red-200 hover:bg-red-200";
                                    } else {
                                        bgClass = "bg-slate-100 text-slate-500 hover:bg-slate-200";
                                    }
                                } else {
                                    if (isAnswered) {
                                        bgClass = "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200";
                                    } else {
                                        bgClass = "bg-white text-slate-600 border-slate-200 hover:bg-slate-50";
                                    }
                                }

                                const activeClass = isActive ? "ring-2 ring-offset-1 ring-indigo-500 z-10" : "border";

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => handleReviewQuestion(idx)}
                                        className={`h-10 w-full rounded-lg text-sm font-bold transition-all ${bgClass} ${activeClass}`}
                                    >
                                        {idx + 1}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-y-2 text-xs font-medium text-slate-500">
                            {isReviewMode ? (
                                <>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-100 border border-green-200 rounded-sm"/> Correct</div>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-100 border border-red-200 rounded-sm"/> Incorrect</div>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-100 border border-slate-200 rounded-sm"/> Skipped</div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-600 rounded-sm"/> Answered</div>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-white border border-slate-300 rounded-sm"/> Unanswered</div>
                                </>
                            )}
                            <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-indigo-500 rounded-sm"/> Current</div>
                        </div>

                        {isReviewMode && (
                            <button onClick={handleGoHome} className="w-full mt-6 bg-slate-800 text-white py-2.5 rounded-lg font-bold hover:bg-black transition-colors flex justify-center items-center gap-2">
                                <RotateCcw size={16}/> Finish Review
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default App;
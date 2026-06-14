import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
    Check, X, ChevronRight, RotateCcw, HelpCircle,
    Clock, Grid, ArrowLeft, MousePointerClick, CheckCircle2, Send
} from 'lucide-react';
import type {ExamSet, Question} from '../types/exam';
import { formatTime, renderMultilineText } from '../utils/helpers';

SyntaxHighlighter.registerLanguage('java', java);

interface Props {
    currentExam: ExamSet;
    currentQuestionIdx: number;
    userAnswers: Record<number, string[]>;
    timeElapsed: number;
    isReviewMode: boolean;
    actions: {
        handleExitClick: () => void;
        handleSubmitExam: () => void;
        handleOptionSelect: (qId: number, optionId: string, type: 'single' | 'multiple') => void;
        handlePrev: () => void;
        handleNext: () => void;
        handleReviewQuestion: (index: number) => void;
        handleGoHome: () => void;
        getQuestionStatus: (q: Question) => { isCorrect: boolean; isSkipped: boolean; isAnswered: boolean };
    };
}

export const ExamView: React.FC<Props> = ({
                                              currentExam,
                                              currentQuestionIdx,
                                              userAnswers,
                                              timeElapsed,
                                              isReviewMode,
                                              actions
                                          }) => {
    const currentQ = currentExam.questions[currentQuestionIdx];
    const currentSelected = userAnswers[currentQ.id] || [];
    const answeredCount = Object.keys(userAnswers).length;
    const totalQuestions = currentExam.questions.length;
    const isAllAnswered = answeredCount === totalQuestions;

    const getOptionClasses = (optionId: string) => {
        const isSelected = currentSelected.includes(optionId);
        const classes = "w-full relative group flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all duration-200 ease-out ";

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
                        <button onClick={actions.handleExitClick} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-sm font-bold text-slate-900 line-clamp-1">{currentExam.name}</h1>
                            <span className="text-xs text-slate-500 hidden sm:inline">Question {currentQuestionIdx + 1} of {totalQuestions}</span>
                        </div>
                    </div>

                    {!isReviewMode ? (
                        <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-200 self-start md:self-auto">
                            <div className="flex items-center gap-2 font-mono font-bold text-indigo-700">
                                <Clock size={18} />{formatTime(timeElapsed)}
                            </div>
                            <div className="w-px h-4 bg-slate-300"></div>
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                <CheckCircle2 size={18} className={isAllAnswered ? "text-green-500" : "text-slate-400"}/>
                                <span>Answered: <span className="text-slate-900 font-bold">{answeredCount}</span>/{totalQuestions}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold border border-indigo-200 flex items-center gap-2 self-start md:self-auto">
                            <MousePointerClick size={16} /> REVIEW MODE
                        </div>
                    )}

                    {!isReviewMode && (
                        <button onClick={actions.handleSubmitExam} className="ml-auto md:ml-0 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-md transition-all active:scale-95">
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
                                        {actions.getQuestionStatus(currentQ).isCorrect ?
                                            <span className="text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg border border-green-200"><Check size={16}/> Correct</span> :
                                            <span className="text-red-500 flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg border border-red-200"><X size={16}/> Incorrect</span>
                                        }
                                    </div>
                                )}
                            </div>

                            {/* HIỂN THỊ CÂU HỎI VÀ CODE */}
                            {(() => {
                                if (currentQ.codeSnippet && currentQ.questionText.includes('\n\n')) {
                                    const parts = currentQ.questionText.split('\n\n');
                                    return (
                                        <>
                                            <h2 className="text-lg text-slate-800 leading-relaxed mb-4 whitespace-pre-line">
                                                {parts[0]}
                                            </h2>
                                            <div className="mb-8 rounded-xl overflow-hidden bg-[#282c34] shadow-sm border border-slate-800 text-sm">
                                                <div className="flex items-center px-4 py-2 bg-[#282c34] border-b border-white/5">
                                                    <span className="text-xs text-slate-500 font-mono font-bold">Code Snippet</span>
                                                </div>
                                                <SyntaxHighlighter
                                                    language="java"
                                                    style={atomOneDark}
                                                    showLineNumbers
                                                    customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
                                                    wrapLongLines
                                                >
                                                    {currentQ.codeSnippet}
                                                </SyntaxHighlighter>
                                            </div>
                                            {parts.length > 1 && (
                                                <h2 className="text-lg text-slate-800 leading-relaxed mb-6 whitespace-pre-line">
                                                    {parts.slice(1).join('\n\n')}
                                                </h2>
                                            )}
                                        </>
                                    );
                                }

                                return (
                                    <>
                                        <h2 className="text-lg text-slate-800 leading-relaxed mb-6 whitespace-pre-line">
                                            {currentQ.questionText}
                                        </h2>
                                        {currentQ.codeSnippet && (
                                            <div className="mb-8 rounded-xl overflow-hidden bg-[#282c34] shadow-sm border border-slate-800 text-sm">
                                                <div className="flex items-center px-4 py-2 bg-[#282c34] border-b border-white/5">
                                                    <span className="text-xs text-slate-500 font-mono font-bold">Code Snippet</span>
                                                </div>
                                                <SyntaxHighlighter
                                                    language="java"
                                                    style={atomOneDark}
                                                    showLineNumbers
                                                    customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
                                                    wrapLongLines
                                                >
                                                    {currentQ.codeSnippet}
                                                </SyntaxHighlighter>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}

                            {/* OPTIONS */}
                            <div className="grid gap-3">
                                {currentQ.options.map((option) => (
                                    <button key={option.id} onClick={() => actions.handleOptionSelect(currentQ.id, option.id, currentQ.type)} className={getOptionClasses(option.id)} disabled={isReviewMode}>
                                        <div className={`mt-0.5 w-6 h-6 flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                                            currentSelected.includes(option.id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white group-hover:border-indigo-300'
                                        } ${currentQ.type === 'single' ? 'rounded-full' : 'rounded-md'}`}>
                                            {currentSelected.includes(option.id) && <div className="w-2.5 h-2.5 bg-white rounded-full"/>}
                                        </div>
                                        <div className="flex-1 text-base font-medium text-slate-700 text-left">
                                            <div className="flex flex-row items-start">
                                                <span className="font-mono font-bold text-slate-400 mr-2 mt-0.5 select-none shrink-0">
                                                    {option.id}.
                                                </span>
                                                <div className="flex-1">
                                                    {renderMultilineText(option.text)}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* NAV CONTROLS */}
                        <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                            <button onClick={actions.handlePrev} disabled={currentQuestionIdx === 0} className="px-4 py-2 text-slate-500 hover:text-slate-800 disabled:opacity-30 font-medium transition-colors flex items-center gap-2">
                                <ChevronRight className="rotate-180" size={18}/> Previous
                            </button>
                            <div className="text-xs font-semibold text-slate-400 hidden sm:block">Question {currentQuestionIdx + 1}</div>
                            <button onClick={actions.handleNext} disabled={currentQuestionIdx === currentExam.questions.length - 1} className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50">
                                Next <ChevronRight size={18}/>
                            </button>
                        </div>
                    </div>

                    {/* REVIEW EXPLANATION */}
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

                        <div className="grid grid-cols-5 gap-2 max-h-[60vh] overflow-y-auto custom-scrollbar p-1">
                            {currentExam.questions.map((q, idx) => {
                                const { isCorrect, isSkipped, isAnswered } = actions.getQuestionStatus(q);
                                const isActive = currentQuestionIdx === idx;
                                let bgClass = "";

                                if (isReviewMode) {
                                    if (!isSkipped) {
                                        bgClass = isCorrect ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                                            : "bg-red-100 text-red-700 border-red-200 hover:bg-red-200";
                                    } else {
                                        bgClass = "bg-slate-100 text-slate-500 hover:bg-slate-200";
                                    }
                                } else {
                                    bgClass = isAnswered ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50";
                                }

                                const activeClass = isActive ? "ring-2 ring-offset-1 ring-indigo-500 z-10" : "border";

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => actions.handleReviewQuestion(idx)}
                                        className={`h-10 w-full rounded-lg text-sm font-bold transition-all ${bgClass} ${activeClass}`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
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
                            <button onClick={actions.handleGoHome} className="w-full mt-6 bg-slate-800 text-white py-2.5 rounded-lg font-bold hover:bg-black transition-colors flex justify-center items-center gap-2">
                                <RotateCcw size={16}/> Finish Review
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
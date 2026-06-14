import React from 'react';
import { Trophy, ArrowLeft, CheckCircle2 } from 'lucide-react';
import type {ExamSet, Question} from '../types/exam';
import { formatTime } from '../utils/helpers';

interface Props {
    currentExam: ExamSet;
    timeElapsed: number;
    getQuestionStatus: (q: Question) => { isCorrect: boolean; isSkipped: boolean; isAnswered: boolean };
    onGoHome: () => void;
    onReviewQuestion: (index: number) => void;
}

export const ResultView: React.FC<Props> = ({
                                                currentExam,
                                                timeElapsed,
                                                getQuestionStatus,
                                                onGoHome,
                                                onReviewQuestion
                                            }) => {
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
                            <p className="text-xl font-bold text-green-600">
                                {correctCount} <span className="text-slate-400 text-base">/ {totalQ}</span>
                            </p>
                        </div>
                        <div className="w-px bg-slate-200"></div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">Time Taken</p>
                            <p className="text-xl font-bold text-slate-800">{formatTime(timeElapsed)}</p>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4">
                        <button onClick={onGoHome} className="px-6 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 font-medium text-slate-600 flex items-center gap-2">
                            <ArrowLeft size={18} /> Back to Home
                        </button>
                        <button onClick={() => onReviewQuestion(0)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 flex items-center gap-2">
                            <CheckCircle2 size={18} /> Review Answers
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
import React from 'react';
import { Code2, Grid, Timer, ArrowLeft } from 'lucide-react';
import type {ExamSet} from '../types/exam';

interface Props {
    exams: ExamSet[];
    onStartExam: (exam: ExamSet) => void;
    onBack: () => void; // Thêm prop onBack
}

export const HomeView: React.FC<Props> = ({ exams, onStartExam, onBack }) => (
    <div className="min-h-screen bg-slate-50 font-sans py-10 px-4">
        <div className="max-w-5xl mx-auto animate-fade-in-up">

            {/* --- NÚT BACK --- */}
            <button
                onClick={onBack}
                className="mb-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg font-medium transition-all w-fit"
            >
                <ArrowLeft size={20} /> Back
            </button>

            {/* HEADER */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-3 flex items-center justify-center gap-3">
                    <Code2 className="w-10 h-10 text-indigo-600" /> OCA Java SE 8
                </h1>
                <p className="text-slate-500 text-lg">Oracle Certification Practice System</p>
            </div>

            {/* DANH SÁCH ĐỀ THI */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam) => (
                    <button key={exam.id} onClick={() => onStartExam(exam)}
                            className="text-left w-full bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-300 transition-all group active:scale-[0.98]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">SET #{exam.id}</span>
                            <Code2 size={16} className="text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600">{exam.name}</h3>
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
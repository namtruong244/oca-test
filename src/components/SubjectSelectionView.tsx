import React from 'react';
import {
    GraduationCap,
    Coffee,
    Terminal,
    Languages,
    Network,
    ChevronRight,
    BookOpen
} from 'lucide-react';
import type {Subject} from '../types/subject';

// Dữ liệu mẫu (Bạn có thể chuyển cái này ra một file JSON riêng hoặc lấy từ API)
const SUBJECT_DATA: Subject[] = [
    {
        id: 'java-oca',
        title: 'Java SE 8 Programmer (OCA)',
        description: 'OCA (1Z0-808) Exam Simulation',
        icon: 'java',
        color: 'from-orange-500 to-red-500',
        setCount: 6,
        totalQuestions: 424
    },
    {
        id: 'java-ocp',
        title: 'Java SE 8 Programmer (OCP)',
        description: 'OCA (1Z0-809) Exam Simulation',
        icon: 'python',
        color: 'from-blue-500 to-cyan-500',
        setCount: 3,
        totalQuestions: 539
    }
];

interface Props {
    onSelectSubject: (subjectId: string) => void;
}

export const SubjectSelectionView: React.FC<Props> = ({ onSelectSubject }) => {
    // Hàm render Icon dựa trên id của môn học
    const renderIcon = (iconStr: string) => {
        switch (iconStr) {
            case 'java': return <Coffee className="w-8 h-8 text-white" />;
            case 'python': return <Terminal className="w-8 h-8 text-white" />;
            case 'japanese': return <Languages className="w-8 h-8 text-white" />;
            case 'network': return <Network className="w-8 h-8 text-white" />;
            default: return <BookOpen className="w-8 h-8 text-white" />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans py-12 px-4">
            <div className="max-w-6xl mx-auto animate-fade-in-up">

                {/* HEADER MÀN HÌNH CHÍNH */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-4 bg-indigo-100 rounded-full mb-6">
                        <GraduationCap className="w-12 h-12 text-indigo-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        Learning & Certification Hub
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
                        Chọn một chứng chỉ hoặc chuyên đề bên dưới để bắt đầu luyện tập. Hệ thống sẽ lưu lại tiến trình của bạn.
                    </p>
                </div>

                {/* DANH SÁCH MÔN HỌC */}
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {SUBJECT_DATA.map((subject) => (
                        <button
                            key={subject.id}
                            onClick={() => onSelectSubject(subject.id)}
                            className="group relative bg-white rounded-3xl p-6 text-left shadow-sm border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden"
                        >
                            {/* Background gradient nhạt xuất hiện khi hover */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${subject.color} transition-opacity duration-300`} />

                            <div className="relative flex items-start gap-6">
                                {/* Icon Box */}
                                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                    {renderIcon(subject.icon)}
                                </div>

                                {/* Nội dung */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                        {subject.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                                        {subject.description}
                                    </p>

                                    {/* Meta info */}
                                    <div className="flex items-center gap-4 text-sm font-semibold">
                                        <div className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                                            <BookOpen size={16} className="text-indigo-500" />
                                            <span>{subject.setCount} Sets</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                                            <span className="text-indigo-500 font-bold">{subject.totalQuestions}</span>
                                            <span>Questions</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Mũi tên điều hướng */}
                                <div className="flex-shrink-0 self-center w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-colors">
                                    <ChevronRight size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
};
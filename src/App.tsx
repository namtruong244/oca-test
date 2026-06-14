import React from 'react';
import { useExamLogic } from './hooks/useExamLogic';

import { SubjectSelectionView } from './components/SubjectSelectionView';
import { HomeView } from './components/HomeView';
import { ResultView } from './components/ResultView';
import { ExamView } from './components/ExamView';
import { SharedModals } from './components/SharedModals';

const App: React.FC = () => {
    const { state, actions } = useExamLogic();

    const answeredCount = Object.keys(state.userAnswers).length;
    const totalQuestions = state.currentExam?.questions.length || 0;
    const isAllAnswered = answeredCount === totalQuestions && totalQuestions > 0;

    return (
        <div className="app-container relative">

            {/* HIỆU ỨNG LOADING OVERLAY (Hiển thị khi đang fetch file JSON) */}
            {state.isLoading && (
                <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-600 font-medium animate-pulse">Đang tải dữ liệu môn học...</p>
                </div>
            )}

            {/* 0. MÀN HÌNH CHỌN MÔN HỌC */}
            {state.view === 'subjects' && (
                <SubjectSelectionView onSelectSubject={actions.handleSelectSubject} />
            )}

            {/* 1. MÀN HÌNH CHỌN ĐỀ THI */}
            {state.view === 'home' && (
                <HomeView
                    exams={state.examData} /* ĐÃ THAY ĐỔI: Sử dụng data động từ State */
                    onStartExam={actions.handleStartExam}
                    onBack={actions.handleBackToSubjects}
                />
            )}

            {/* 2. MÀN HÌNH KẾT QUẢ */}
            {state.view === 'result' && state.currentExam && (
                <ResultView
                    currentExam={state.currentExam}
                    timeElapsed={state.timeElapsed}
                    getQuestionStatus={actions.getQuestionStatus}
                    onGoHome={actions.handleGoHome}
                    onReviewQuestion={actions.handleReviewQuestion}
                />
            )}

            {/* 3. MÀN HÌNH LÀM BÀI */}
            {state.view === 'exam' && state.currentExam && (
                <ExamView
                    currentExam={state.currentExam}
                    currentQuestionIdx={state.currentQuestionIdx}
                    userAnswers={state.userAnswers}
                    timeElapsed={state.timeElapsed}
                    isReviewMode={state.isReviewMode}
                    actions={actions}
                />
            )}

            {/* 4. MODALS */}
            <SharedModals
                showSubmitModal={state.showSubmitModal}
                showExitModal={state.showExitModal}
                isAllAnswered={isAllAnswered}
                answeredCount={answeredCount}
                totalQuestions={totalQuestions}
                onCloseSubmit={() => actions.setShowSubmitModal(false)}
                onConfirmSubmit={actions.handleConfirmSubmit}
                onCloseExit={() => actions.setShowExitModal(false)}
                onConfirmExit={actions.handleConfirmExit}
            />
        </div>
    );
};

export default App;
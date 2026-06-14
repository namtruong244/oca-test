import { useState, useEffect } from 'react';
import type {ExamSet, Question} from '../types/exam';

export const useExamLogic = () => {
    // --- STATE ---
    // Cập nhật thêm 'subjects' làm view mặc định (Root)
    const [view, setView] = useState<'subjects' | 'home' | 'exam' | 'result'>('subjects');
    const [currentSubjectId, setCurrentSubjectId] = useState<string | null>(null);

    const [examData, setExamData] = useState<ExamSet[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [currentExam, setCurrentExam] = useState<ExamSet | null>(null);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, string[]>>({});
    const [timeElapsed, setTimeElapsed] = useState<number>(0);
    const [isReviewMode, setIsReviewMode] = useState<boolean>(false);

    // State cho Modals
    const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
    const [showExitModal, setShowExitModal] = useState<boolean>(false);

    // --- TIMER ---
    useEffect(() => {
        let timer: any;
        if (view === 'exam' && !isReviewMode && !showSubmitModal && !showExitModal) {
            timer = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
        }
        return () => clearInterval(timer);
    }, [view, isReviewMode, showSubmitModal, showExitModal]);

    // --- SCROLL TO TOP ---
    useEffect(() => {
        if (!showSubmitModal && !showExitModal) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentQuestionIdx, view, showSubmitModal, showExitModal]);

    // --- ACTIONS: NAVIGATION LUỒNG CHÍNH ---

    // 1. Chọn môn học -> Chuyển sang màn hình chọn đề (Home)
    const handleSelectSubject = async (subjectId: string) => {
        setIsLoading(true);
        setCurrentSubjectId(subjectId);

        try {
            // Import động file JSON dựa vào subjectId
            const module = await import(`../data/${subjectId}.json`);

            // Lấy dữ liệu (xử lý sự khác biệt giữa các module bundler)
            const data: ExamSet[] = module.default || module;

            setExamData(data);
            setView('home'); // Chỉ chuyển view khi load xong
        } catch (error) {
            console.error("Lỗi tải dữ liệu môn học:", error);
            alert("Đang cập nhật dữ liệu cho môn học này. Vui lòng thử lại sau!");
            setCurrentSubjectId(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToSubjects = () => {
        setCurrentSubjectId(null);
        setExamData([]); // Xóa dữ liệu cũ khi back ra ngoài
        setView('subjects');
    };

    // 3. Bắt đầu làm bài thi -> Chuyển sang màn hình Exam
    const handleStartExam = (exam: ExamSet) => {
        setCurrentExam(exam);
        setCurrentQuestionIdx(0);
        setUserAnswers({});
        setTimeElapsed(0);
        setIsReviewMode(false);
        setShowSubmitModal(false);
        setShowExitModal(false);
        setView('exam');
    };

    const handleGoHome = () => {
        setView('home');
        setCurrentExam(null);
        setShowSubmitModal(false);
        setShowExitModal(false);
    };

    // --- ACTIONS: TRONG LÚC LÀM BÀI ---

    const handleOptionSelect = (qId: number, optionId: string, type: 'single' | 'multiple') => {
        if (isReviewMode) return;

        setUserAnswers(prev => {
            const currentSelected = prev[qId] || [];
            if (type === 'single') {
                // Single choice: Ghi đè đáp án cũ
                return { ...prev, [qId]: [optionId] };
            } else {
                // Multiple choice: Toggle (chọn/bỏ chọn) đáp án
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

    // --- ACTIONS: XỬ LÝ MODALS (EXIT & SUBMIT) ---

    const handleExitClick = () => {
        if (isReviewMode) {
            handleGoHome();
        } else {
            setShowExitModal(true);
        }
    };

    const handleConfirmExit = () => {
        setShowExitModal(false);
        handleGoHome();
    };

    const handleSubmitExam = () => {
        setShowSubmitModal(true);
    };

    const handleConfirmSubmit = () => {
        setShowSubmitModal(false);
        setView('result');
        setIsReviewMode(true);
    };

    // --- ACTIONS: REVIEW VÀ TÍNH ĐIỂM ---

    const handleReviewQuestion = (index: number) => {
        setCurrentQuestionIdx(index);
        setView('exam');
    };

    const getQuestionStatus = (q: Question) => {
        const userAnswer = userAnswers[q.id] || [];
        // Điều kiện đúng: Phải chọn đủ số lượng đáp án và mọi đáp án đã chọn đều phải nằm trong mảng correctAnswers
        const isCorrect = q.correctAnswers.length === userAnswer.length &&
            q.correctAnswers.every(ans => userAnswer.includes(ans));
        const isSkipped = userAnswer.length === 0;

        return { isCorrect, isSkipped, isAnswered: !isSkipped };
    };

    // Trả về toàn bộ state và actions để Component cha (App.tsx) sử dụng
    return {
        state: {
            view,
            currentSubjectId,
            examData,
            isLoading,
            currentExam,
            currentQuestionIdx,
            userAnswers,
            timeElapsed,
            isReviewMode,
            showSubmitModal,
            showExitModal
        },
        actions: {
            handleSelectSubject,
            handleBackToSubjects,
            handleStartExam,
            handleOptionSelect,
            handleNext,
            handlePrev,
            handleSubmitExam,
            handleConfirmSubmit,
            handleExitClick,
            handleConfirmExit,
            handleGoHome,
            handleReviewQuestion,
            getQuestionStatus,
            setShowSubmitModal,
            setShowExitModal
        }
    };
};
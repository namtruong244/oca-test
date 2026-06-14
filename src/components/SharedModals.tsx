import React from 'react';
import { CheckCircle2, AlertTriangle, LogOut } from 'lucide-react';

interface Props {
    showSubmitModal: boolean;
    showExitModal: boolean;
    isAllAnswered: boolean;
    answeredCount: number;
    totalQuestions: number;
    onCloseSubmit: () => void;
    onConfirmSubmit: () => void;
    onCloseExit: () => void;
    onConfirmExit: () => void;
}

export const SharedModals: React.FC<Props> = ({
                                                  showSubmitModal,
                                                  showExitModal,
                                                  isAllAnswered,
                                                  answeredCount,
                                                  totalQuestions,
                                                  onCloseSubmit,
                                                  onConfirmSubmit,
                                                  onCloseExit,
                                                  onConfirmExit
                                              }) => {
    return (
        <>
            {/* SUBMIT MODAL */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mx-auto mb-4">
                            {isAllAnswered ? (
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            ) : (
                                <AlertTriangle className="w-6 h-6 text-amber-500" />
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-center text-slate-900 mb-2">
                            {isAllAnswered ? "Ready to Submit?" : "Unfinished Questions"}
                        </h3>
                        <p className="text-center text-slate-500 mb-6">
                            {isAllAnswered
                                ? "You have answered all questions. Are you sure you want to finish the exam?"
                                : `You have answered ${answeredCount} out of ${totalQuestions} questions. Unanswered questions will be marked as incorrect.`
                            }
                        </p>
                        <div className="flex gap-3">
                            <button onClick={onCloseSubmit} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button onClick={onConfirmSubmit} className={`flex-1 px-4 py-2.5 text-white font-semibold rounded-lg shadow-md transition-all active:scale-95 ${
                                isAllAnswered ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-amber-500 hover:bg-amber-600'
                            }`}>
                                {isAllAnswered ? "Submit Exam" : "Submit Anyway"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EXIT MODAL */}
            {showExitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
                            <LogOut className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-center text-slate-900 mb-2">
                            Quit Exam?
                        </h3>
                        <p className="text-center text-slate-500 mb-6">
                            Are you sure you want to exit? Your current progress will be lost and cannot be recovered.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={onCloseExit} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button onClick={onConfirmExit} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all active:scale-95">
                                Quit Exam
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
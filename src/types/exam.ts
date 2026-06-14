export interface Option {
    id: string;
    text: string;
}

export interface Question {
    id: number;
    type: 'single' | 'multiple';
    questionText: string;
    codeSnippet?: string;
    options: Option[];
    correctAnswers: string[];
    explanation: string;
}

export interface ExamSet {
    id: number;
    name: string;
    description: string;
    questions: Question[];
    durationMinutes: number;
}
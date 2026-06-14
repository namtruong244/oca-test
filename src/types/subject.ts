export interface Subject {
    id: string;
    title: string;
    description: string;
    icon: string;      // Dùng string để map với Icon component
    color: string;     // Màu sắc đặc trưng cho từng môn
    setCount: number;  // Số lượng đề thi hiện có
    totalQuestions: number;
}
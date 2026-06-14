export const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const renderMultilineText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => (
        <div key={index} className={`min-h-[1.5rem] ${index > 0 ? 'mt-1' : ''}`}>
    {line}
    </div>
));
};
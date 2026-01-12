
import { cn } from "@/shared/lib/utils";

interface RichTextProps {
    content: string;
    className?: string;
}

/**
 * RichText
 * 
 * A minimal markdown-like parser for rendering text with:
 * - **Headers**: Lines wrapped in ** (e.g. **Header**)
 * - **Bold**: Text wrapped in ** (e.g. **bold**)
 * - **Bullets**: Lines starting with * (e.g. * Item)
 * - **Paragraphs**: Standard handling of newlines
 */
export const RichText = ({ content, className }: RichTextProps) => {
    // 1. Handle newlines first
    const lines = content.split('\n');

    return (
        <div className={className}>
            {lines.map((line, lineIdx) => {
                const cleanLine = line.trim();

                if (!cleanLine) {
                    return <div key={lineIdx} className="h-2" />; // Spacer for empty lines
                }

                // Check if line is fully bold (Header usage)
                const isHeader = cleanLine.startsWith('**') && cleanLine.endsWith('**') && cleanLine.length > 4;

                if (isHeader) {
                    return (
                        <div key={lineIdx} className="font-bold text-foreground mt-6 mb-2">
                            {cleanLine.slice(2, -2)}
                        </div>
                    );
                }

                // Check if line is a bullet point (starts with * )
                const isBullet = cleanLine.startsWith('* ');
                const contentLine = isBullet ? cleanLine.substring(2) : line;

                // Split by bold syntax **text**
                const parts = contentLine.split(/(\*\*.*?\*\*)/g);

                const renderedParts = parts.map((part, partIdx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={partIdx} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
                    }
                    return <span key={partIdx}>{part}</span>;
                });

                if (isBullet) {
                    return (
                        <div key={lineIdx} className="flex gap-2 mb-1 pl-4">
                            <span className="text-foreground/40">•</span>
                            <span>{renderedParts}</span>
                        </div>
                    );
                }

                // Standard paragraph line
                return (
                    <p key={lineIdx} className="mb-2 leading-relaxed">
                        {renderedParts}
                    </p>
                );
            })}
        </div>
    );
};

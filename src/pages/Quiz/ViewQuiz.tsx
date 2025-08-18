import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Flashcard = {
    _id: string;
    front: string;
    back: string;
    tags?: string[];
};

const sampleCards: Flashcard[] = [
    {
        _id: "c1",
        front: "Hàm số y = 2x + 1 hệ số góc?",
        back: "2",
        tags: ["Toán"],
    },
    {
        _id: "c2",
        front: "Đỉnh của Parabol y = x^2 tại?",
        back: "(0,0)",
        tags: ["Toán", "Lý thuyết"],
    },
    {
        _id: "c3",
        front: "Derivative of sin(x)?",
        back: "cos(x)",
        tags: ["Calculus", "EN"],
    },
];

export default function ViewQuiz({
    cards = sampleCards,
}: {
    cards?: Flashcard[];
}) {
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

    const current = cards[index];

    const prev = () => {
        setFlipped(false);
        setIndex((s) => Math.max(0, s - 1));
    };
    const next = () => {
        setFlipped(false);
        setIndex((s) => Math.min(cards.length - 1, s + 1));
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Flashcards</h2>
                <div className="flex items-center gap-2">
                    <Badge>
                        {Math.min(index + 1, cards.length)} / {cards.length}
                    </Badge>
                </div>
            </div>

            <Card className="relative">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>{current?.tags?.join(" • ") || "Flashcard"}</span>
                        <span className="text-sm text-muted-foreground">
                            {current?._id}
                        </span>
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-col items-center">
                        {/* Flashcard container with 3D flip */}
                        <div
                            className="w-full sm:w-96 h-56 perspective"
                            style={{ perspective: 1000 }}
                        >
                            <div
                                className="relative w-full h-full"
                                onClick={() => setFlipped((f) => !f)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === " " || e.key === "Enter")
                                        setFlipped((f) => !f);
                                }}
                                style={{
                                    transformStyle: "preserve-3d",
                                    transition: "transform 500ms ease-in-out",
                                    transform: flipped
                                        ? "rotateY(180deg)"
                                        : "rotateY(0deg)",
                                    cursor: "pointer",
                                }}
                            >
                                {/* Front */}
                                <div
                                    className="absolute inset-0 bg-white dark:bg-gray-800 border rounded-lg p-6 flex items-center justify-center"
                                    style={{ backfaceVisibility: "hidden" }}
                                >
                                    <div className="text-center">
                                        <p className="text-lg font-medium">
                                            {current?.front}
                                        </p>
                                    </div>
                                </div>

                                {/* Back */}
                                <div
                                    className="absolute inset-0 bg-gray-50 dark:bg-gray-700 border rounded-lg p-6 flex items-center justify-center"
                                    style={{
                                        backfaceVisibility: "hidden",
                                        transform: "rotateY(180deg)",
                                    }}
                                >
                                    <div className="text-center">
                                        <p className="text-lg font-semibold">
                                            {current?.back}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="mt-4 flex items-center gap-2">
                            <Button
                                variant="ghost"
                                onClick={prev}
                                disabled={index === 0}
                            >
                                Prev
                            </Button>
                            <Button onClick={() => setFlipped((f) => !f)}>
                                {flipped ? "Xem trước" : "Lật"}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={next}
                                disabled={index === cards.length - 1}
                            >
                                Next
                            </Button>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full mt-4">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-width"
                                    style={{
                                        width: `${
                                            ((index + 1) / cards.length) * 100
                                        }%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

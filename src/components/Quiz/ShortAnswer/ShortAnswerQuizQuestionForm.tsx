import {
    forwardRef,
    useImperativeHandle,
    useState,
    useRef,
    useEffect,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash, ChevronUp, ChevronDown, Plus } from "lucide-react";
import { ShortAnswerQuestions } from "@/types/quiz";
import { QuestionTypeEnum } from "@/enums/quiz.enum";
import { useShortAnswerQuizStore } from "@/store/useShortAnswerQuizStore";
import Switch from "@/components/ui/switch";

export type ShortAnswerQuestionsFormHandle = {
    validate: () => Promise<{ valid: boolean; errors?: Record<string, string> }>;
    reset: (questions?: ShortAnswerQuestions[]) => void;
    getNew: () => ShortAnswerQuestions[];
    getEdited: () => ShortAnswerQuestions[];
    getDeleted: () => { _id: string }[];
    clearChangeSets?: () => void;
    addBulk?: (questions: ShortAnswerQuestions[]) => void;
    setQuestions?: (questions: ShortAnswerQuestions[]) => void;
};

const makeId = () => Math.random().toString(36).slice(2, 9);

const emptyQuestion = (): ShortAnswerQuestions => ({
    _id: makeId(),
    order: undefined,
    questionType: QuestionTypeEnum.SHORT_ANSWER,
    questionText: "",
    acceptedAnswers: [""],
    caseSensitive: false,
    explanation: "",
    points: 1,
});

const shallowEqualQuestion = (
    a?: Partial<ShortAnswerQuestions>,
    b?: Partial<ShortAnswerQuestions>
) => {
    if (!a || !b) return false;

    // Compare acceptedAnswers arrays
    const acceptedAnswersEqual =
        Array.isArray(a.acceptedAnswers) &&
        Array.isArray(b.acceptedAnswers) &&
        a.acceptedAnswers.length === b.acceptedAnswers.length &&
        a.acceptedAnswers.every((ans, i) => ans === b.acceptedAnswers?.[i]);

    return (
        (a.questionText ?? "") === (b.questionText ?? "") &&
        acceptedAnswersEqual &&
        (a.caseSensitive ?? false) === (b.caseSensitive ?? false) &&
        (a.explanation ?? "") === (b.explanation ?? "") &&
        (a.points ?? 0) === (b.points ?? 0) &&
        (a.order ?? 0) === (b.order ?? 0)
    );
};

const ShortAnswerQuizQuestionForm =
    forwardRef<ShortAnswerQuestionsFormHandle>((_, ref) => {
        const storeQuestions = useShortAnswerQuizStore((s) => s.quizQuestion);
        const addQuestion = useShortAnswerQuizStore((s) => s.addQuestion);
        const resetQuestionsInStore = useShortAnswerQuizStore(
            (s) => s.resetShortAnswerQuizQuestion
        );

        const [questions, setQuestionsState] = useState<ShortAnswerQuestions[]>(
            storeQuestions?.length
                ? storeQuestions.map((q, i) => ({
                    ...q,
                    order: q.order ?? i + 1,
                    _id: q._id ?? makeId(),
                    acceptedAnswers: Array.isArray(q.acceptedAnswers)
                        ? q.acceptedAnswers
                        : [""],
                }))
                : [emptyQuestion()]
        );

        const [errors, setErrors] = useState<Record<string, string>>({});

        // refs for change-tracking
        const originalMapRef = useRef<Record<string, ShortAnswerQuestions>>({});
        const originalIdsRef = useRef<Set<string>>(new Set());
        const deletedRef = useRef<{ _id: string }[]>([]);
        const editedMapRef = useRef<Record<string, ShortAnswerQuestions>>({});
        const newMapRef = useRef<Record<string, ShortAnswerQuestions>>({});

        // initialize original snapshots when store questions change
        useEffect(() => {
            const snapshot: Record<string, ShortAnswerQuestions> = {};
            const ids = new Set<string>();

            (storeQuestions || []).forEach((q, i) => {
                const id = q._id ?? makeId();
                if (id && id.length === 24) {
                    ids.add(id);
                    snapshot[id] = {
                        ...q,
                        _id: id,
                        order: q.order ?? i + 1,
                        acceptedAnswers: Array.isArray(q.acceptedAnswers)
                            ? q.acceptedAnswers
                            : [""],
                    };
                }
            });

            originalMapRef.current = snapshot;
            originalIdsRef.current = ids;
            deletedRef.current = [];
            editedMapRef.current = {};
            newMapRef.current = {};
        }, [storeQuestions]);

        useImperativeHandle(
            ref,
            () => ({
                validate: async () => {
                    const e: Record<string, string> = {};
                    questions.forEach((q) => {
                        if (!q.questionText || q.questionText.trim() === "")
                            e[`${q._id}-question`] = "Question text is required";

                        if (!q.acceptedAnswers || q.acceptedAnswers.length === 0)
                            e[`${q._id}-answers`] = "At least one accepted answer is required";

                        // Check if any accepted answer is empty - handle non-string values
                        const hasEmptyAnswer = q.acceptedAnswers.some(
                            (ans) => {
                                if (typeof ans === 'string') {
                                    return !ans.trim();
                                } else {
                                    return !String(ans).trim();
                                }
                            }
                        );
                        if (hasEmptyAnswer)
                            e[`${q._id}-answers-empty`] = "Accepted answers cannot be empty";
                    });

                    setErrors(e);

                    return { valid: Object.keys(e).length === 0, errors: e };
                },

                reset: (qs?: ShortAnswerQuestions[]) => {
                    if (qs && qs.length) {
                        const normalized = qs.map((q, i) => ({
                            ...q,
                            _id: q._id ?? makeId(),
                            order: q.order ?? i + 1,
                            acceptedAnswers: Array.isArray(q.acceptedAnswers)
                                ? q.acceptedAnswers
                                : [""],
                        }));
                        setQuestionsState(normalized);
                    } else setQuestionsState([emptyQuestion()]);

                    setErrors({});

                    // reset change sets
                    deletedRef.current = [];
                    editedMapRef.current = {};
                    newMapRef.current = {};

                    // update original snapshot
                    const snapshot: Record<string, ShortAnswerQuestions> = {};
                    const ids = new Set<string>();
                    (qs || []).forEach((q, i) => {
                        const id = q._id ?? makeId();
                        if (id && !id.startsWith("client-")) {
                            ids.add(id);
                            snapshot[id] = {
                                ...q,
                                _id: id,
                                order: q.order ?? i + 1,
                                acceptedAnswers: Array.isArray(q.acceptedAnswers)
                                    ? q.acceptedAnswers
                                    : [""],
                            };
                        }
                    });

                    originalMapRef.current = snapshot;
                    originalIdsRef.current = ids;
                },

                getDeleted: () => {
                    return deletedRef.current.slice();
                },

                getEdited: () => {
                    const edited = Object.values(editedMapRef.current).filter(
                        (q) => !deletedRef.current.some((d) => d._id === q._id)
                    );
                    return edited;
                },

                getNew: () => {
                    const newQuestions: ShortAnswerQuestions[] = questions
                        .filter((q) => !originalIdsRef.current.has(q._id as string))
                        .map((q) => ({
                            questionType: QuestionTypeEnum.SHORT_ANSWER,
                            questionText: q.questionText || "",
                            acceptedAnswers: (q.acceptedAnswers || [])
                                .map(ans => {
                                    // Handle non-string values safely
                                    if (typeof ans === 'string') {
                                        return ans.trim();
                                    } else if (ans === null || ans === undefined) {
                                        return '';
                                    } else {
                                        return String(ans).trim();
                                    }
                                })
                                .filter(ans => ans && ans.trim().length > 0), // Filter out empty strings
                            caseSensitive: q.caseSensitive || false,
                            explanation: q.explanation || "",
                            order: q.order || 0,
                            points: q.points || 0,
                        }));
                    return newQuestions;
                },
                clearChangeSets: () => {
                    deletedRef.current = [];
                    editedMapRef.current = {};
                    newMapRef.current = {};
                },
                setQuestions: (questions: ShortAnswerQuestions[]) => {
                    setQuestionsState(questions);
                },

                addBulk: (questions: ShortAnswerQuestions[]) => {
                    setQuestionsState((prev) => [...prev, ...questions]);
                },

            }),
            [questions, addQuestion, resetQuestionsInStore]
        );

        const update = (id: string, patch: Partial<ShortAnswerQuestions>) => {
            setQuestionsState((prev) =>
                prev.map((p) => (p._id === id ? { ...p, ...patch } : p))
            );

            // clear related errors
            setErrors((prev) => {
                const copy = { ...prev };
                if (patch.questionText !== undefined) delete copy[`${id}-question`];
                if (patch.acceptedAnswers !== undefined) {
                    delete copy[`${id}-answers`];
                    delete copy[`${id}-answers-empty`];
                }
                return copy;
            });

            // update change sets
            const isOriginal = id.length === 24 && originalIdsRef.current.has(id);

            // get updated question (approximate)
            const updated = (questions.find((q) => q._id === id) ?? {
                _id: id,
                ...patch,
            }) as ShortAnswerQuestions;

            const merged = {
                ...(originalMapRef.current[id] ?? {}),
                ...updated,
                ...patch,
            };

            if (isOriginal) {
                // compare with original snapshot to decide if edited
                const original = originalMapRef.current[id];
                if (!shallowEqualQuestion(original, merged)) {
                    editedMapRef.current[id] = { ...merged, _id: id };
                } else {
                    // if matches original now, remove from edited set
                    delete editedMapRef.current[id];
                }
            } else {
                // new question: keep in newMapRef as current state
                newMapRef.current[id] = { ...merged, _id: id };
            }
        };

        const add = (afterId?: string) => {
            setQuestionsState((prev) => {
                const nv = [...prev];
                const idx = afterId
                    ? Math.max(0, nv.findIndex((q) => q._id === afterId) + 1)
                    : nv.length;
                const baseNewQ = emptyQuestion();
                const newId = baseNewQ._id ?? makeId();
                const newQ = { ...baseNewQ, _id: newId };
                nv.splice(idx, 0, newQ);
                // add to newMap
                newMapRef.current[newId] = { ...newQ };
                return nv.map((q, i) => ({ ...q, order: i + 1 }));
            });
        };

        const remove = (id: string) => {
            setQuestionsState((prev) => {
                const nv = prev.filter((q) => q._id !== id);
                // keep at least 1
                if (nv.length < 1) return prev;
                return nv.map((q, i) => ({ ...q, order: i + 1 }));
            });

            // if removed item is original, add to deleted list
            if (originalIdsRef.current.has(id)) {
                // only add once
                const already = deletedRef.current.find((d) => d._id === id);
                if (!already) {
                    deletedRef.current.push({ _id: id });
                }
                // ensure it's not in edited set
                delete editedMapRef.current[id];
            } else {
                // new item removed: remove from newMapRef
                delete newMapRef.current[id];
            }

            // clear errors related
            setErrors((prev) => {
                const copy = { ...prev };
                delete copy[`${id}-question`];
                delete copy[`${id}-answers`];
                delete copy[`${id}-answers-empty`];
                return copy;
            });
        };

        const moveUp = (index: number) => {
            if (index <= 0) return;
            setQuestionsState((prev) => {
                const nv = [...prev];
                [nv[index - 1], nv[index]] = [nv[index], nv[index - 1]];
                return nv.map((q, i) => {
                    const nq = { ...q, order: i + 1 };
                    if (nq._id && originalIdsRef.current.has(nq._id)) {
                        const original = originalMapRef.current[nq._id];
                        if (!shallowEqualQuestion(original, nq)) {
                            editedMapRef.current[nq._id] = nq;
                        } else {
                            delete editedMapRef.current[nq._id];
                        }
                    } else if (nq._id) {
                        newMapRef.current[nq._id] = nq;
                    }
                    return nq;
                });
            });
        };

        const moveDown = (index: number) => {
            setQuestionsState((prev) => {
                if (index >= prev.length - 1) return prev;
                const nv = [...prev];
                [nv[index], nv[index + 1]] = [nv[index + 1], nv[index]];
                return nv.map((q, i) => {
                    const nq = { ...q, order: i + 1 };
                    if (nq._id && originalIdsRef.current.has(nq._id)) {
                        const original = originalMapRef.current[nq._id];
                        if (!shallowEqualQuestion(original, nq)) {
                            editedMapRef.current[nq._id] = nq;
                        } else {
                            delete editedMapRef.current[nq._id];
                        }
                    } else if (nq._id) {
                        newMapRef.current[nq._id] = nq;
                    }
                    return nq;
                });
            });
        };

        // Function to add an accepted answer
        const addAcceptedAnswer = (questionId: string) => {
            setQuestionsState((prev) =>
                prev.map((q) => {
                    if (q._id === questionId) {
                        const acceptedAnswers = [...(q.acceptedAnswers || []), ""];
                        return { ...q, acceptedAnswers };
                    }
                    return q;
                })
            );

            // Update tracking
            const question = questions.find((q) => q._id === questionId);
            if (question) {
                update(questionId, {
                    acceptedAnswers: [...(question.acceptedAnswers || []), ""],
                });
            }
        };

        // Function to update an accepted answer
        const updateAcceptedAnswer = (
            questionId: string,
            answerIndex: number,
            value: string
        ) => {
            setQuestionsState((prev) =>
                prev.map((q) => {
                    if (q._id === questionId && Array.isArray(q.acceptedAnswers)) {
                        const newAcceptedAnswers = [...q.acceptedAnswers];
                        newAcceptedAnswers[answerIndex] = value;
                        return { ...q, acceptedAnswers: newAcceptedAnswers };
                    }
                    return q;
                })
            );

            // Update tracking
            const question = questions.find((q) => q._id === questionId);
            if (question && Array.isArray(question.acceptedAnswers)) {
                const newAcceptedAnswers = [...question.acceptedAnswers];
                newAcceptedAnswers[answerIndex] = value;

                update(questionId, {
                    acceptedAnswers: newAcceptedAnswers,
                });
            }
        };

        // Function to remove an accepted answer
        const removeAcceptedAnswer = (questionId: string, answerIndex: number) => {
            setQuestionsState((prev) =>
                prev.map((q) => {
                    if (
                        q._id === questionId &&
                        Array.isArray(q.acceptedAnswers) &&
                        q.acceptedAnswers.length > 1
                    ) {
                        const newAcceptedAnswers = q.acceptedAnswers.filter(
                            (_, i) => i !== answerIndex
                        );
                        return {
                            ...q,
                            acceptedAnswers: newAcceptedAnswers,
                        };
                    }
                    return q;
                })
            );

            // Update tracking
            const question = questions.find((q) => q._id === questionId);
            if (
                question &&
                Array.isArray(question.acceptedAnswers) &&
                question.acceptedAnswers.length > 1
            ) {
                const newAcceptedAnswers = question.acceptedAnswers.filter(
                    (_, i) => i !== answerIndex
                );

                update(questionId, {
                    acceptedAnswers: newAcceptedAnswers,
                });
            }
        };

        // Calculate total points
        const totalPoints = questions.reduce(
            (sum, q) => sum + (Number(q.points) || 0),
            0
        );

        return (
            <div className="space-y-4">
                {questions.map((q, idx) => (
                    <Card
                        key={q._id}
                        className="bg-slate-300/30 dark:bg-slate-800/30"
                    >
                        <CardHeader className="flex items-center justify-between py-2 px-4">
                            <CardTitle className="text-sm">
                                Câu hỏi #{q.order ?? idx + 1}
                            </CardTitle>

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => moveUp(idx)}
                                    disabled={idx === 0}
                                    title="Move up"
                                >
                                    <ChevronUp className="w-4 h-4" />
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => moveDown(idx)}
                                    disabled={idx === questions.length - 1}
                                    title="Move down"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        if (q._id) add(q._id);
                                    }}
                                    title="Add after"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        if (q._id) remove(q._id);
                                    }}
                                    disabled={questions.length <= 1}
                                    className="text-red-500"
                                    title="Delete"
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-4">
                            <div className="hidden">
                                <div>
                                    <Label>Điểm</Label>
                                    <Input
                                        type="number"
                                        value={q.points || 1}
                                        onChange={(e) =>
                                            update(q._id as string, {
                                                points: parseInt(e.target.value) || 0,
                                            })
                                        }
                                        disabled={true}
                                        placeholder="Points"
                                    />
                                </div>
                            </div>

                            <div className="mt-3">
                                <Label>Câu hỏi tự luận</Label>
                                <Input
                                    value={q.questionText || ""}
                                    onChange={(e) =>
                                        update(q._id as string, {
                                            questionText: e.target.value,
                                        })
                                    }
                                    placeholder="Question text"
                                />
                                {errors[`${q._id}-question`] && (
                                    <div className="text-xs text-red-400 mt-1">
                                        {errors[`${q._id}-question`]}
                                    </div>
                                )}
                            </div>

                            <div className="mt-3">
                                <Label>
                                    Các đáp án được chấp nhận (ít nhất 1 đáp án)
                                </Label>
                                <div className="space-y-2">
                                    {(q.acceptedAnswers || []).map((answer, ansIdx) => (
                                        <div
                                            key={ansIdx}
                                            className="flex items-center gap-2"
                                        >
                                            <Input
                                                value={answer}
                                                onChange={(e) =>
                                                    updateAcceptedAnswer(
                                                        q._id as string,
                                                        ansIdx,
                                                        e.target.value
                                                    )
                                                }
                                                placeholder={`Accepted answer ${ansIdx + 1}`}
                                            />

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    removeAcceptedAnswer(q._id as string, ansIdx)
                                                }
                                                disabled={(q.acceptedAnswers || []).length <= 1}
                                                className="p-2 text-red-500"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => addAcceptedAnswer(q._id as string)}
                                        className="mt-2"
                                    >
                                        <Plus className="mr-2 w-4 h-4" /> Thêm đáp án
                                    </Button>
                                </div>

                                {errors[`${q._id}-answers`] && (
                                    <div className="text-xs text-red-400 mt-1">
                                        {errors[`${q._id}-answers`]}
                                    </div>
                                )}

                                {errors[`${q._id}-answers-empty`] && (
                                    <div className="text-xs text-red-400 mt-1">
                                        {errors[`${q._id}-answers-empty`]}
                                    </div>
                                )}

                                {/* Display accepted answers */}
                                {Array.isArray(q.acceptedAnswers) &&
                                    q.acceptedAnswers.length > 0 && (
                                        <div className="mt-2 text-sm text-blue-500 font-medium">
                                            Đáp án được chấp nhận: {q.acceptedAnswers.join(", ")}
                                        </div>
                                    )}
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                                <Label htmlFor={`case-sensitive-${q._id}`}>
                                    Phân biệt hoa thường
                                </Label>
                                <Switch
                                    id={`case-sensitive-${q._id}`}
                                    checked={q.caseSensitive || false}
                                    onCheckedChange={(checked) =>
                                        update(q._id as string, {
                                            caseSensitive: checked,
                                        })
                                    }
                                />
                            </div>

                            <div className="mt-3">
                                <Label>Giải thích (optional)</Label>
                                <Textarea
                                    value={q.explanation || ""}
                                    onChange={(e) =>
                                        update(q._id as string, {
                                            explanation: e.target.value,
                                        })
                                    }
                                    rows={3}
                                    placeholder="Explanation (optional)"
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">
                        Tổng số điểm: {totalPoints}
                    </div>
                    <div>
                        <Button onClick={() => add()} variant="outline">
                            <Plus className="mr-2 w-4 h-4" /> Thêm câu hỏi
                        </Button>
                    </div>
                </div>
            </div>
        );
    });

ShortAnswerQuizQuestionForm.displayName = "ShortAnswerQuizQuestionForm";

export default ShortAnswerQuizQuestionForm;
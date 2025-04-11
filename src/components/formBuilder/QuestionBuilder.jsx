import React from 'react';
import QuestionTypeSelector from './QuestionTypeSelector';
import OptionsBuilder from './OptionsBuilder';

export default function QuestionBuilder({
    currentQuestion,
    dropdownType,
    onQuestionChange,
    onAddQuestion,
    onDropdownTypeChange,
    sections,
    activeSectionId
}) {
    const addOption = (option) => {
        onQuestionChange({
            ...currentQuestion,
            options: [...currentQuestion.options, option]
        });
    };

    const removeOption = (index) => {
        onQuestionChange({
            ...currentQuestion,
            options: currentQuestion.options.filter((_, i) => i !== index)
        });
    };

    const addSubQuestion = (subQuestion) => {
        onQuestionChange({
            ...currentQuestion,
            subQuestions: [...currentQuestion.subQuestions, subQuestion]
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <QuestionTypeSelector
                currentType={currentQuestion.type}
                onChange={(type) => onQuestionChange({ ...currentQuestion, type })}
            />

            <input
                type="text"
                value={currentQuestion.question}
                onChange={(e) => onQuestionChange({ ...currentQuestion, question: e.target.value })}
                placeholder="Enter question"
                className="w-full p-2 border rounded-md mb-4"
            />

            {/* Add section selector */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Section
                </label>
                {activeSectionId ? (
                    <div className="w-full p-2 border rounded-md bg-gray-50">
                        {sections.find(section => section.id === activeSectionId)?.title || 'Unknown Section'}
                    </div>
                ) : (
                    <div className="w-full p-2 border rounded-md bg-gray-50">
                        (Main Form)
                    </div>
                )}
                <input
                    type="hidden"
                    value={activeSectionId || ''}
                    onChange={(e) => onQuestionChange({
                        ...currentQuestion,
                        section_id: activeSectionId
                    })}
                />
            </div>

            {['multiple_choice', 'checkbox', 'dropdown'].includes(currentQuestion.type) && (
                <OptionsBuilder
                    options={currentQuestion.options}
                    onAddOption={addOption}
                    onRemoveOption={removeOption}
                    type={currentQuestion.type}
                    dropdownType={dropdownType}
                    onDropdownTypeChange={onDropdownTypeChange}
                />
            )}

            {currentQuestion.type === 'likert_matrix' && (
                <div className="mb-4">
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Add sub-question"
                            className="flex-1 p-2 border rounded-md"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && e.target.value) {
                                    addSubQuestion(e.target.value);
                                    e.target.value = '';
                                }
                            }}
                        />
                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                            onClick={() => {
                                const input = document.querySelector('input[placeholder="Add sub-question"]');
                                if (input.value) {
                                    addSubQuestion(input.value);
                                    input.value = '';
                                }
                            }}
                        >
                            Add Sub-question
                        </button>
                    </div>
                    <div className="space-y-2">
                        {currentQuestion.subQuestions.map((subQ, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span>{subQ}</span>
                                <button
                                    type="button"
                                    className="text-red-500"
                                    onClick={() => {
                                        onQuestionChange({
                                            ...currentQuestion,
                                            subQuestions: currentQuestion.subQuestions.filter((_, i) => i !== index)
                                        });
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex items-center gap-2 mb-4">
                <input
                    type="checkbox"
                    id="required"
                    checked={currentQuestion.required}
                    onChange={(e) => onQuestionChange({ ...currentQuestion, required: e.target.checked })}
                />
                <label htmlFor="required">Required</label>
            </div>

            <button
                type="button"
                onClick={onAddQuestion}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-md"
            >
                Add Question
            </button>
        </div>
    );
}
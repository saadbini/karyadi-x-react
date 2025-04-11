import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function AdminSurveyDashboard() {
  const [questions, setQuestions] = useState([
    { id: 1, question: "How satisfied are you with our platform?", type: "short-answer" },
    { id: 2, question: "What features should we improve?", type: "mcq-multiple", options: ["UI Design", "Speed", "Job Recommendations"] },
    { id: 3, question: "Any additional feedback?", type: "long-answer" }
  ]);

  const [responses] = useState([
    { id: 1, user: "John Doe", question: "How satisfied are you with our platform?", answer: "Very satisfied" },
    { id: 2, user: "Jane Smith", question: "What features should we improve?", answer: "Speed, UI Design" },
    { id: 3, user: "Alex Lee", question: "Any additional feedback?", answer: "Please add more job categories." }
  ]);

  const [newQuestion, setNewQuestion] = useState("");
  const [questionType, setQuestionType] = useState("short-answer");
  const [mcqOptions, setMcqOptions] = useState([]);
  const [optionText, setOptionText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editQuestionType, setEditQuestionType] = useState("");
  const [editMcqOptions, setEditMcqOptions] = useState([]);

  const addQuestion = () => {
    if (!newQuestion.trim()) return;

    const newQ = {
      id: questions.length + 1,
      question: newQuestion,
      type: questionType,
      options: questionType.includes("mcq") ? [...mcqOptions] : undefined
    };

    setQuestions([...questions, newQ]);
    setNewQuestion("");
    setMcqOptions([]);
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const addMcqOption = () => {
    if (optionText.trim()) {
      setMcqOptions([...mcqOptions, optionText]);
      setOptionText("");
    }
  };

  const handleEdit = (question) => {
    setEditId(question.id);
    setEditQuestionText(question.question);
    setEditQuestionType(question.type);
    setEditMcqOptions(question.options || []);
  };

  const saveEdit = () => {
    setQuestions(questions.map(q => 
      q.id === editId 
        ? { ...q, question: editQuestionText, type: editQuestionType, options: editMcqOptions } 
        : q
    ));
    setEditId(null);
    setEditQuestionText("");
    setEditQuestionType("");
    setEditMcqOptions([]);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(responses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Survey Responses");
    XLSX.writeFile(wb, "Survey_Responses.xlsx");
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-6">
      <h2 className="text-3xl font-bold text-center mb-6">Survey Admin Dashboard</h2>

      {/* Add/Edit Question Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">{editId ? "Edit Question" : "Add New Question"}</h3>
        <input
          type="text"
          className="w-full p-2 border rounded-md mb-3"
          placeholder="Enter your question..."
          value={editId ? editQuestionText : newQuestion}
          onChange={(e) => editId ? setEditQuestionText(e.target.value) : setNewQuestion(e.target.value)}
        />
        <select
          className="w-full p-2 border rounded-md mb-3"
          value={editId ? editQuestionType : questionType}
          onChange={(e) => editId ? setEditQuestionType(e.target.value) : setQuestionType(e.target.value)}
        >
          <option value="short-answer">Short Answer</option>
          <option value="long-answer">Long Answer</option>
          <option value="mcq-single">Multiple Choice (Single)</option>
          <option value="mcq-multiple">Multiple Choice (Multiple)</option>
        </select>

        {(editId ? editQuestionType : questionType).includes("mcq") && (
          <div className="mb-3">
            <div className="flex">
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Add option..."
                value={optionText}
                onChange={(e) => setOptionText(e.target.value)}
              />
              <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md" onClick={addMcqOption}>+</button>
            </div>
            <div className="mt-2">
              {(editId ? editMcqOptions : mcqOptions).map((option, index) => (
                <span key={index} className="inline-block bg-gray-200 px-3 py-1 rounded-lg mr-2 mb-2">{option}</span>
              ))}
            </div>
          </div>
        )}

        <button
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 w-full"
          onClick={editId ? saveEdit : addQuestion}
        >
          {editId ? "Save Changes" : "Add Question"}
        </button>

      </div>

      {/* Survey Questions List */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Survey Questions</h3>
        {questions.length === 0 ? (
          <p className="text-gray-500">No questions added yet.</p>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="border-b py-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{q.question}</p>
                <p className="text-sm text-gray-600">Type: {q.type}</p>
                {q.options && <p className="text-sm text-gray-500">Options: {q.options.join(", ")}</p>}
              </div>
              <div>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded-md mr-2" onClick={() => handleEdit(q)}>Edit</button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-md" onClick={() => deleteQuestion(q.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Survey Responses Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Survey Responses</h3>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700" onClick={exportToExcel}>
            Export to Excel
          </button>
        </div>
        {responses.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No responses yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">User</th>
                  <th className="border px-4 py-2 text-left">Question</th>
                  <th className="border px-4 py-2 text-left">Answer</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((response) => (
                  <tr key={response.id} className="border-t">
                    <td className="border px-4 py-2">{response.user}</td>
                    <td className="border px-4 py-2">{response.question}</td>
                    <td className="border px-4 py-2">{response.answer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

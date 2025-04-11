import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { eventsAPI, formAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Import components
import FormHeader from '../components/formBuilder/FormHeader';
import QuestionBuilder from '../components/formBuilder/QuestionBuilder';
import QuestionPreview from '../components/formBuilder/QuestionPreview';
import QuestionDetailsModal from '../components/formBuilder/QuestionDetailsModal';
import SectionBuilder from '../components/formBuilder/SectionBuilder';
import SectionList from '../components/formBuilder/SectionList';
import SectionModal from '../components/formBuilder/SectionModal';

const questionTypes = {
  TEXT: 'text',
  CHECKBOX: 'checkbox',
  MULTIPLE_CHOICE: 'multiple_choice',
  RATING: 'rating',
  LIKERT_SINGLE: 'likert_single',
  LIKERT_MATRIX: 'likert_matrix',
  DROPDOWN: 'dropdown',
  SECTION_JUMP: 'section_jump'
};

export default function FormBuilder() {
  const { id: formId } = useParams();
  const isEditMode = !!formId;
  const { user } = useAuth();
  const navigate = useNavigate();

  // Step management
  const [buildStep, setBuildStep] = useState('form'); // 'form', 'sections', or 'questions'

  // Form basic info
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [events, setEvents] = useState([]);
  const [createdFormId, setCreatedFormId] = useState(formId || null);

  // Questions state
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    type: questionTypes.TEXT,
    question: '',
    options: [],
    subQuestions: [],
    required: false,
    section_id: null,
    sectionJumps: {}  // For section jump logic
  });
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [dropdownType, setDropdownType] = useState('default');

  // Sections state
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState({
    title: '',
    description: '',
    order_number: 1
  });
  const [selectedSection, setSelectedSection] = useState(null);
  const [activeSectionId, setActiveSectionId] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);

  // Fetch form data for editing
  useEffect(() => {
    const fetchFormData = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const formData = await formAPI.getFormWithSections(formId);

          if (!formData || !formData.title) {
            throw new Error('Invalid form data received');
          }

          // Set basic form info
          setFormTitle(formData.title || '');
          setFormDescription(formData.description || '');
          setBannerImage(formData.banner_image || '');
          setSelectedEventId(formData.event_id?.toString() || '');
          setCreatedFormId(formId);

          // Load sections
          if (Array.isArray(formData.sections)) {
            setSections(formData.sections.map(section => ({
              id: section.id,
              title: section.title,
              description: section.description,
              order_number: section.order_number
            })));
          }

          // Load all questions
          const allQuestions = [];

          // Add unsectioned questions
          if (Array.isArray(formData.questions)) {
            allQuestions.push(...formData.questions.map(q => ({
              id: q.id,
              type: q.type,
              question: q.question,
              options: q.options || [],
              subQuestions: q.additional_settings?.subQuestions || [],
              required: q.is_required,
              dropdownType: q.additional_settings?.dropdownType || 'default',
              section_id: null,
              sectionJumps: q.additional_settings?.sectionJumps || {}
            })));
          }

          // Add sectioned questions
          if (Array.isArray(formData.sections)) {
            formData.sections.forEach(section => {
              if (Array.isArray(section.questions)) {
                allQuestions.push(...section.questions.map(q => ({
                  id: q.id,
                  type: q.type,
                  question: q.question,
                  options: q.options || [],
                  subQuestions: q.additional_settings?.subQuestions || [],
                  required: q.is_required,
                  dropdownType: q.additional_settings?.dropdownType || 'default',
                  section_id: section.id,
                  sectionJumps: q.additional_settings?.sectionJumps || {}
                })));
              }
            });
          }

          setQuestions(allQuestions);
          setLoading(false);

          // Determine which step to show first in edit mode
          if (formData.sections && formData.sections.length > 0) {
            if (allQuestions.length > 0) {
              setBuildStep('questions');
            } else {
              setBuildStep('sections');
            }
          } else {
            setBuildStep('sections');
          }
        } catch (error) {
          console.error('Error fetching form data:', error);
          toast.error(`Failed to load form data: ${error.message}`);
          setLoading(false);
        }
      }
    };

    fetchFormData();
  }, [formId, isEditMode]);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventsAPI.getAllEvents();
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  // Save basic form information
  const saveFormBasics = async () => {
    if (!selectedEventId) {
      toast.error('Please select an event');
      return;
    }
    if (!formTitle) {
      toast.error('Please enter a form title');
      return;
    }

    try {
      setLoading(true);
      let formResult;

      if (createdFormId) {
        // Update existing form
        const updateData = {
          title: formTitle,
          description: formDescription || null,
          banner_image: bannerImage || null,
          event_id: parseInt(selectedEventId, 10)
        };

        await formAPI.updateForm(createdFormId, updateData);
        formResult = { id: createdFormId };
        toast.success('Form information updated');
      } else {
        // Create new form
        const formData = {
          title: formTitle,
          description: formDescription || null,
          banner_image: bannerImage || null,
          event_id: parseInt(selectedEventId, 10),
          created_by: user.id
        };

        const response = await formAPI.createForm(formData);
        formResult = response.data;
        setCreatedFormId(formResult.id);
        toast.success('Form created successfully');
      }

      setLoading(false);
      setBuildStep('sections');
    } catch (error) {
      console.error('Error saving form:', error);
      setLoading(false);
      toast.error('Failed to save form: ' + error.message);
    }
  };

  // Save sections
  const saveSections = async () => {
    if (!createdFormId) {
      toast.error('Form must be created first');
      return;
    }

    try {
      setLoading(true);

      // Update form with sections
      const updateData = {
        sections: sections.map((section, index) => ({
          id: section.id && section.id < 9000000000 ? section.id : null,
          title: section.title,
          description: section.description || null,
          order_number: section.order_number || index + 1,
          form_id: parseInt(createdFormId, 10)
        }))
      };

      await formAPI.updateForm(createdFormId, updateData);

      // Refresh sections to get server-assigned IDs
      const formData = await formAPI.getFormWithSections(createdFormId);
      if (formData && Array.isArray(formData.sections)) {
        setSections(formData.sections.map(section => ({
          id: section.id,
          title: section.title,
          description: section.description,
          order_number: section.order_number
        })));
      }

      setLoading(false);
      toast.success('Sections saved successfully');
      setBuildStep('questions');
    } catch (error) {
      console.error('Error saving sections:', error);
      setLoading(false);
      toast.error('Failed to save sections: ' + error.message);
    }
  };

  // Save questions
  const saveQuestions = async () => {
    if (!createdFormId) {
      toast.error('Form must be created first');
      return;
    }

    try {
      setLoading(true);

      // Update form with questions
      const updateData = {
        questions: questions.map((question, index) => ({
          id: question.id && !isNaN(parseInt(question.id)) && question.id < 9000000000 ? parseInt(question.id) : null,
          form_id: parseInt(createdFormId, 10),
          section_id: question.section_id || null,
          question: question.question,
          type: question.type,
          options: question.options || [],
          order_number: index + 1,
          is_required: question.required || false,
          additional_settings: {
            dropdownType: question.dropdownType || 'default',
            subQuestions: question.subQuestions || [],
            sectionJumps: question.sectionJumps || {}
          }
        }))
      };

      await formAPI.updateForm(createdFormId, updateData);
      setLoading(false);

      toast.success('Form questions saved successfully');
      navigate('/forms'); // Return to forms list after completion
    } catch (error) {
      console.error('Error saving questions:', error);
      setLoading(false);
      toast.error('Failed to save questions: ' + error.message);
    }
  };

  // Question management functions
  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    setQuestions([...questions, {
      ...currentQuestion,
      id: Date.now(), // Temporary ID for frontend use only
      section_id: activeSectionId,
      sectionJumps: currentQuestion.type === questionTypes.MULTIPLE_CHOICE ?
        currentQuestion.sectionJumps || {} :
        undefined
    }]);

    // Reset the question form
    setCurrentQuestion({
      type: questionTypes.TEXT,
      question: '',
      options: [],
      subQuestions: [],
      required: false,
      section_id: activeSectionId,
      sectionJumps: {}
    });
    setDropdownType('default');
  };

  const moveQuestion = (fromIndex, toIndex) => {
    const updatedQuestions = [...questions];
    const [movedQuestion] = updatedQuestions.splice(fromIndex, 1);
    updatedQuestions.splice(toIndex, 0, movedQuestion);
    setQuestions(updatedQuestions);
  };

  // Section management functions
  const addSection = () => {
    if (!currentSection.title.trim()) {
      toast.error('Please enter a section title');
      return;
    }

    const newSection = {
      ...currentSection,
      id: Date.now(), // Temporary ID for frontend
      order_number: sections.length + 1
    };

    setSections([...sections, newSection]);

    // Reset the section form
    setCurrentSection({
      title: '',
      description: '',
      order_number: sections.length + 2
    });
  };

  const renderNavigationButtons = () => {
    return (
      <div className="flex justify-between mt-8">
        {buildStep !== 'form' && (
          <button
            type="button"
            onClick={() => setBuildStep(buildStep === 'questions' ? 'sections' : 'form')}
            className="px-6 py-2 bg-gray-400 text-white rounded-md"
          >
            Back
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            if (buildStep === 'form') {
              saveFormBasics();
            } else if (buildStep === 'sections') {
              saveSections();
            } else {
              saveQuestions();
            }
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-md ml-auto"
        >
          {buildStep === 'questions' ? 'Save & Finish' : 'Save & Continue'}
        </button>
      </div>
    );
  };

  // Rest of the component remains the same, but we'll render different content based on buildStep

  return (
    <div className="max-w-4xl mx-auto p-6">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <>
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className={`flex items-center ${buildStep === 'form' ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${buildStep === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>1</div>
              <span>Form Details</span>
            </div>
            <div className="w-16"></div>
            <div className={`flex items-center ${buildStep === 'sections' ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${buildStep === 'sections' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>2</div>
              <span>Sections</span>
            </div>
            <div className="w-16"></div>
            <div className={`flex items-center ${buildStep === 'questions' ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${buildStep === 'questions' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>3</div>
              <span>Questions</span>
            </div>
          </div>

          {/* Form Basics Step */}
          {buildStep === 'form' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Form Details</h2>
              <FormHeader
                title={formTitle}
                description={formDescription}
                selectedEventId={selectedEventId}
                events={events}
                onTitleChange={setFormTitle}
                onDescriptionChange={setFormDescription}
                onEventChange={setSelectedEventId}
                bannerImage={bannerImage}
                onBannerImageChange={setBannerImage}
                isEditMode={isEditMode}
              />
            </div>
          )}

          {/* Sections Step */}
          {buildStep === 'sections' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Form Sections</h2>
              <p className="mb-4 text-gray-600">
                Add sections to organize your form. You can add questions to each section in the next step.
              </p>

              <SectionBuilder
                currentSection={currentSection}
                onSectionChange={setCurrentSection}
                onAddSection={addSection}
              />

              <SectionList
                sections={sections}
                onEdit={(section) => {
                  setSelectedSection(section);
                  setShowSectionModal(true);
                }}
                onDelete={(index) => {
                  const updatedSections = [...sections];
                  updatedSections.splice(index, 1);
                  setSections(updatedSections);
                }}
                onMoveUp={(index) => {
                  if (index > 0) {
                    const updatedSections = [...sections];
                    [updatedSections[index], updatedSections[index - 1]] =
                      [updatedSections[index - 1], updatedSections[index]];
                    setSections(updatedSections);
                  }
                }}
                onMoveDown={(index) => {
                  if (index < sections.length - 1) {
                    const updatedSections = [...sections];
                    [updatedSections[index], updatedSections[index + 1]] =
                      [updatedSections[index + 1], updatedSections[index]];
                    setSections(updatedSections);
                  }
                }}
              />

              {showSectionModal && (
                <SectionModal
                  section={selectedSection}
                  onClose={() => {
                    setShowSectionModal(false);
                    setSelectedSection(null);
                  }}
                  onUpdate={(updatedSection) => {
                    setSections(
                      sections.map(s => s.id === updatedSection.id ? updatedSection : s)
                    );
                    setShowSectionModal(false);
                    setSelectedSection(null);
                  }}
                />
              )}
            </div>
          )}

          {/* Questions Step */}
          {buildStep === 'questions' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Form Questions</h2>

              {/* Section selector */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Select Section</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSectionId(null)}
                    className={`px-4 py-2 rounded-md ${!activeSectionId ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  >
                    Main Form
                  </button>

                  {sections.map(section => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setActiveSectionId(section.id)}
                      className={`px-4 py-2 rounded-md ${activeSectionId === section.id ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question builder */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-2">
                  {activeSectionId
                    ? `Add Questions to "${sections.find(s => s.id === activeSectionId)?.title}"`
                    : 'Add Questions to Main Form'}
                </h3>

                <QuestionBuilder
                  currentQuestion={currentQuestion}
                  dropdownType={dropdownType}
                  onQuestionChange={setCurrentQuestion}
                  onAddQuestion={addQuestion}
                  onDropdownTypeChange={setDropdownType}
                  sections={sections}
                  activeSectionId={activeSectionId}
                  questionTypes={questionTypes}
                />

                <QuestionPreview
                  questions={questions}  // Pass all questions instead of pre-filtering
                  sections={sections}
                  onMoveUp={(index) => {
                    const filteredQuestions = questions.filter(q => q.section_id === activeSectionId);
                    if (index > 0) {
                      const allQuestions = [...questions];
                      const fromIndex = allQuestions.findIndex(q => q.id === filteredQuestions[index].id);
                      const toIndex = allQuestions.findIndex(q => q.id === filteredQuestions[index - 1].id);
                      moveQuestion(fromIndex, toIndex);
                    }
                  }}
                  onMoveDown={(index) => {
                    const filteredQuestions = questions.filter(q => q.section_id === activeSectionId);
                    if (index < filteredQuestions.length - 1) {
                      const allQuestions = [...questions];
                      const fromIndex = allQuestions.findIndex(q => q.id === filteredQuestions[index].id);
                      const toIndex = allQuestions.findIndex(q => q.id === filteredQuestions[index + 1].id);
                      moveQuestion(fromIndex, toIndex);
                    }
                  }}
                  onDelete={(index) => {
                    const filteredQuestions = questions.filter(q => q.section_id === activeSectionId);
                    const questionId = filteredQuestions[index].id;
                    setQuestions(questions.filter(q => q.id !== questionId));
                  }}
                  onEdit={(question) => setSelectedQuestion(question)}
                  activeSectionId={activeSectionId}  // Pass the activeSectionId
                />
              </div>

              {/* Question details modal */}
              {selectedQuestion && (
                <QuestionDetailsModal
                  question={selectedQuestion}
                  sections={sections}
                  onClose={() => setSelectedQuestion(null)}
                  onUpdate={(updatedQuestion) => {
                    setQuestions(questions.map(q =>
                      q.id === updatedQuestion.id ? updatedQuestion : q
                    ));
                    setSelectedQuestion(null);
                  }}
                />
              )}
            </div>
          )}

          {/* Navigation buttons */}
          {renderNavigationButtons()}
        </>
      )}
    </div>
  );
}
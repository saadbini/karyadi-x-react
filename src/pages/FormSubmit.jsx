import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formAPI } from '../utils/api';
import toast from 'react-hot-toast';
import FormHeader from '../components/formSubmit/FormHeader';
import ProgressBar from '../components/formSubmit/ProgressBar';
import FormContainer from '../components/formSubmit/FormContainer';

const FormSubmit = () => {
  const { id: formId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Reference to form container for scroll calculations
  const formContainerRef = useRef(null);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!formContainerRef.current) return;
      
      const windowHeight = window.innerHeight;
      const documentHeight = formContainerRef.current.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      // Calculate how far down the user has scrolled as a percentage
      const scrolled = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(scrolled, 100));
    };

    // Initial calculation
    handleScroll();
    
    // Add event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, [form]); // Recalculate when form loads

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/forms/${formId}/submit` } });
      return;
    }

    const fetchForm = async () => {
      try {
        const response = await formAPI.getFormById(formId);
        
        const formData = response || {};
        
        if (!formData.id || !formData.title) {
          throw new Error('Invalid response format');
        }
        
        // Ensure questions array exists
        formData.questions = formData.questions || [];

        setForm(formData);
        
        // Initialize responses object with empty values
        const initialResponses = {};
        formData.questions.forEach(question => {
          if (question?.type === 'checkbox') {
            initialResponses[question.id] = [];
          } else if (question?.type === 'likert_matrix' && question?.additional_settings?.subQuestions) {
            initialResponses[question.id] = {};
          } else if (question?.id) {
            initialResponses[question.id] = '';
          }
        });
        
        setResponses(initialResponses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching form:', error);
        setError(error.message || 'Failed to load the form. Please try again later.');
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId, isAuthenticated, navigate]);

  const handleInputChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredQuestions = form.questions.filter(q => q.is_required);
    const missingResponses = requiredQuestions.filter(question => {
      if (question.type === 'checkbox') {
        return !responses[question.id] || responses[question.id].length === 0;
      } else if (question.type === 'likert_matrix') {
        const matrixResponses = responses[question.id] || {};
        const subQuestions = question.additional_settings?.subQuestions || [];
        return subQuestions.some(subQ => !matrixResponses[subQ]);
      } else {
        return !responses[question.id];
      }
    });

    if (missingResponses.length > 0) {
      toast.error('Please answer all required questions.');
      return;
    }

    setSubmitting(true);
    try {
      await formAPI.submitFormResponse(formId, { responses });
      toast.success('Form submitted successfully!');
      if (formId === '13') {
        navigate('/thank-you-voucher'); // Redirect to the "Thank You with voucher" page
      } else {
        navigate('/thank-you'); // Redirect to the "Thank You" page
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Not Found!</strong>
          <span className="block sm:inline"> The requested form was not found.</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={formContainerRef} className="relative max-w-4xl mx-auto px-4 py-8 pb-16">
      <FormHeader 
        title={form.title}
        description={form.description}
      />
      
      <ProgressBar scrollProgress={scrollProgress} />
      
      <FormContainer
        form={form}
        responses={responses}
        onInputChange={handleInputChange}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default FormSubmit;
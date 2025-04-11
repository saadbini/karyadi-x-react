import React from 'react';

export default function FormHeader({ 
  title, 
  description, 
  selectedEventId,
  events,
  onTitleChange,
  onDescriptionChange,
  onEventChange,
  bannerImage,
  onBannerImageChange,
  isEditMode
}) {
  return (
    <>
      <h1 className="text-3xl font-bold mb-8">{isEditMode ? 'Edit Form' : 'Form Builder'}</h1>
      
      <div className="mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter form title"
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="mb-6">
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Enter form description (optional)"
          className="w-full p-2 border rounded-md"
          rows="3"
        />
      </div>
      
      <div className="mb-6">
        <input
          type="text"
          value={bannerImage || ''}
          onChange={(e) => onBannerImageChange(e.target.value)}
          placeholder="Enter banner image URL (optional)"
          className="w-full p-2 border rounded-md"
        />
        {bannerImage && (
          <div className="mt-2">
            <img 
              src={bannerImage} 
              alt="Form banner preview" 
              className="max-h-40 border rounded-md" 
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select Event
        </label>
        <select
          value={selectedEventId}
          onChange={(e) => onEventChange(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="">Select an event</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
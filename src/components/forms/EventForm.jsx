import React, { useState } from "react";
import dropdownOptions from "../../utils/dropdownOptions";

export default function EventForm({
  formData,
  handleChange: parentHandleChange,
  handleSubmit,
  isLoading,
  isEditMode,
}) {
  const [timeError, setTimeError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "start_time") {
      // When start time changes, reset end time if it's before new start time
      const newStartTime = new Date(`2000-01-01T${value}`);
      const currentEndTime = formData.end_time
        ? new Date(`2000-01-01T${formData.end_time}`)
        : null;

      if (currentEndTime && newStartTime > currentEndTime) {
        parentHandleChange({
          target: { name: "end_time", value: "" },
        });
      }
    }

    if (name === "end_time" && formData.start_time) {
      const startTime = new Date(`2000-01-01T${formData.start_time}`);
      const endTime = new Date(`2000-01-01T${value}`);

      if (endTime <= startTime) {
        setTimeError("End time must be after start time");
        return;
      } else {
        setTimeError("");
      }
    }

    parentHandleChange(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Event Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Event Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
        />
      </div>

      {/* Event Details */}
      <div>
        <label
          htmlFor="details"
          className="block text-sm font-medium text-gray-700"
        >
          Event Details
        </label>
        <textarea
          name="details"
          id="details"
          required
          rows={4}
          value={formData.details}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
        />
      </div>

      {/* Image URL */}
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Image URL
        </label>
        <input
          type="text"
          name="image"
          id="image"
          value={formData.image}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
        />
      </div>

      {/* Location */}
      <div>
        <label
          htmlFor="location_url"
          className="block text-sm font-medium text-gray-700"
        >
          Location
        </label>
        <input
          type="text"
          name="location_url"
          id="location_url"
          required
          value={formData.location_url}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
        />
      </div>

      {/* Virtual Link */}
      <div>
        <label
          htmlFor="virtual_link"
          className="block text-sm font-medium text-gray-700"
        >
          Virtual Link
        </label>
        <input
          type="text"
          name="virtual_link"
          id="virtual_link"
          value={formData.virtual_link}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
        />
      </div>

      {/* Date */}
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700"
        >
          Start Date
        </label>
        <input
          type="date"
          name="start_date"
          id="start_date"
          required
          value={formData.start_date}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
        />
      </div>
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700"
        >
          End Date
        </label>
        <input
          type="date"
          name="end_date"
          id="end_date"
          required
          value={formData.end_date}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
        />
      </div>
      {/* Time - Two Columns */}
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label
            htmlFor="start_time"
            className="block text-sm font-medium text-gray-700"
          >
            Start Time
          </label>
          <input
            type="time"
            name="start_time"
            id="start_time"
            required
            value={formData.start_time}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
          />
        </div>
        <div className="w-1/2">
          <label
            htmlFor="end_time"
            className="block text-sm font-medium text-gray-700"
          >
            End Time
          </label>
          <input
            type="time"
            name="end_time"
            id="end_time"
            required
            value={formData.end_time}
            onChange={handleChange}
            min={formData.start_time}
            disabled={!formData.start_time}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {timeError && (
            <p className="mt-1 text-sm text-red-600">{timeError}</p>
          )}
        </div>
      </div>

      {/* Event Type */}
      <div>
        <label
          htmlFor="event_type"
          className="block text-sm font-medium text-gray-700"
        >
          Event Type
        </label>
        <select
          name="event_type"
          id="event_type"
          required
          value={formData.event_type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
        >
          <option value="">Select Event Type</option>
          {dropdownOptions.eventType.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Event Status */}
      <div>
        <label
          htmlFor="event_status"
          className="block text-sm font-medium text-gray-700"
        >
          Event Status
        </label>
        <select
          name="event_status"
          id="event_status"
          required
          value={formData.event_status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
        >
          <option value="">Select Event Status</option>
          {dropdownOptions.eventStatus.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Slots */}
      <div>
        <label
          htmlFor="slots"
          className="block text-sm font-medium text-gray-700"
        >
          Slots
        </label>
        <input
          type="number"
          name="slots"
          id="slots"
          required
          value={formData.slots}
          onChange={(e) => {
            const value = e.target.value;
            if (value >= 0) {
              handleChange(e);
            }
          }}
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
            ? "Update Event"
            : "Create Event"}
        </button>
      </div>
    </form>
  );
}

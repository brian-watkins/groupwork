'use client';

import { Course } from "@/domain/course";
import GroupSetForm from "./GroupSetForm";
import { useEffect, useRef } from "react";

interface GroupSetFormModalProps {
  course: Course;
  onClose: () => void;
}

export default function GroupSetFormModal({ course, onClose }: GroupSetFormModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle clicks outside the modal content to close the modal
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Handle escape key to close the modal
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    // Prevent scrolling of the background content
    document.body.style.overflow = 'hidden';

    // Clean up event listeners when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 pt-4 px-4 pb-4 overflow-y-auto">
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg w-[calc(100%-2rem)] overflow-visible mb-4">
        <div className="p-6 md:p-8">
          <GroupSetForm
            course={course}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { Course } from "@/domain/course";
import { Dialog, Button, Modal, ModalOverlay, Heading } from "react-aria-components";
import { useState } from "react";
import { deleteCourse } from "../stores/actions/deleteCourse";
import { useRouter } from "next/navigation";

interface DeleteCourseConfirmationProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteCourseConfirmation({ course, isOpen, onClose }: DeleteCourseConfirmationProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCourse(course);
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Error deleting course:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ModalOverlay
      isDismissable
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Modal data-testid="delete-course-confirmation" className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
        <Dialog className="outline-none">
          <Heading slot="title" className="text-lg font-semibold mb-4">
            Delete Course
          </Heading>
          <div className="space-y-4">
            <p data-confirmation-message className="text-gray-600">
              Are you sure you want to delete <strong>{course.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                data-cancel
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                onPress={onClose}
                isDisabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                data-delete
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                onPress={handleDelete}
                isDisabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Course"}
              </Button>
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

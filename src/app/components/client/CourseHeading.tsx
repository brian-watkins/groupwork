"use client";

import { Heading } from "react-aria-components";

interface CourseHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children: React.ReactNode;
}

export function CourseHeading({ level, className, children }: CourseHeadingProps) {
  return (
    <Heading level={level} className={className}>
      {children}
    </Heading>
  );
}

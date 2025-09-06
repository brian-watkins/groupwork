"use client"

import { useState } from "react"
import { pdf } from "@react-pdf/renderer"
import { GroupSetPDF } from "./GroupSetPDF"
import { DisplayableGroupSet } from "./DisplayableGroupSet"

interface PDFExportButtonProps {
  groupSet: DisplayableGroupSet
  className?: string
  "aria-label"?: string
}

export default function PDFExportButton({
  groupSet,
  className,
  "aria-label": ariaLabel,
}: PDFExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleExport = async () => {
    setIsGenerating(true)
    try {
      const doc = <GroupSetPDF groupSet={groupSet} />
      const pdfBlob = await pdf(doc).toBlob()

      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${groupSet.name.replace(/[^a-zA-Z0-9]/g, "_")}_groups.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to export PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={isGenerating}
      className={className}
      aria-label={ariaLabel}
    >
      Export
    </button>
  )
}

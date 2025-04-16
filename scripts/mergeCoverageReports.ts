import {
  CoverageReport,
  CoverageReportOptions,
} from "monocart-coverage-reports"

const coverageOptions: CoverageReportOptions = {
  name: "GroupWork Coverage",
  reports: ["v8", "console-details"],
  inputDir: [
    "./coverage-reports/domain/raw",
    "./coverage-reports/app/raw",
    "./coverage-reports/component/raw",
    "./coverage-reports/infra/raw",
  ],
  outputDir: "./coverage-reports/merged",
  sourceFilter: (sourcePath) => {
    return (
      !sourcePath.includes("node_modules/") &&
      !sourcePath.startsWith("[turbopack]") &&
      !sourcePath.startsWith("[project]") &&
      !sourcePath.startsWith(".next/server") &&
      !sourcePath.startsWith(".next-internal/server") &&
      !sourcePath.endsWith(".tsx/proxy.mjs")
    )
  },
  sourcePath(filePath, info) {
    if (info.distFile && info.distFile.startsWith("localhost:5173")) {
      return info.distFile.substring(15)
    } else {
      return filePath
    }
  },
}

await new CoverageReport(coverageOptions).generate()

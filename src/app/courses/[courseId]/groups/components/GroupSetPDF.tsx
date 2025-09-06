"use client"

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import { DisplayableGroupSet } from "./DisplayableGroupSet"
import { DateTime } from "luxon"

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#e5e7eb",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  groupsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  groupBox: {
    width: "30%",
    minWidth: 150,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e5e7eb",
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#374151",
  },
  studentName: {
    fontSize: 11,
    marginBottom: 4,
    color: "#1f2937",
  },
  studentList: {
    gap: 4,
  },
})

interface GroupSetPDFProps {
  groupSet: DisplayableGroupSet
}

export function GroupSetPDF({ groupSet }: GroupSetPDFProps) {
  const formatDate = (date: string) => {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED)
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{groupSet.name}</Text>
          <Text style={styles.subtitle}>
            Created {formatDate(groupSet.createdAt)}
          </Text>
        </View>

        <View style={styles.groupsContainer}>
          {groupSet.groups.map((group, index) => (
            <View key={index} style={styles.groupBox}>
              <Text style={styles.groupTitle}>Group {index + 1}</Text>
              <View style={styles.studentList}>
                {Array.from(group.members).map((student) => (
                  <Text key={student.id} style={styles.studentName}>
                    {student.name}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}

interface Window {
  resolveRecordGroups: () => {}
  resolveAssignGroups: (groups: Array<Group>) => void
  calledRecordGroups: number
}

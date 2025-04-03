'use client';

import { DisplayableGroupSet } from "./DisplayableGroupSet";
import { useState } from "react";
import GroupList from "./GroupList";
import { DateTime } from "luxon";
import { useGroupStore } from "@/app/contexts/GroupStoreContext";

interface GroupSetProps {
  groupSet: DisplayableGroupSet;
}

export default function GroupSetList() {
  const groupSets = useGroupStore(store => store.groupSets)

  return (
    <>
      {groupSets.map(groupSet =>
        <GroupSet
          key={groupSet.id}
          groupSet={groupSet}
        />
      )}
    </>
  )
}

function GroupSet({ groupSet }: GroupSetProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formatDate = (date: string) => {
    return `Created ${DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED)}`;
  };

  return (
    <div
      data-group-set
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-shadow"
    >
      <div className="flex justify-between items-center cursor-pointer" onClick={toggleExpand}>
        <div>
          <h3 data-group-set-name className="text-lg font-semibold">{groupSet.name}</h3>
          <p data-group-set-created-at className="text-sm text-gray-500">
            {formatDate(groupSet.createdAt)}
          </p>
        </div>
        <div className="text-blue-600">{isExpanded ? "▲" : "▼"}</div>
      </div>

      {isExpanded && (
        <div className="mt-4">
          <GroupList groups={groupSet.groups} />
        </div>
      )}
    </div>
  );
}
export const PATHS = {
  HOME: "/",
  DASHBOARD: "/eventsdashboard",
  CREATE_EVENT: "/createEvent",
  EDIT_EVENT: "/editEvent",
  LIVE_MEETING: "/event",
  EVENT_REPORT: "/eventReport",
  SIGNUP: "/sign-up",
  SIGNIN: "/sign-in"
};

export const GROUP_POLL_INTERVAL_MS = 1200;

export const MeetingType = Object.freeze({
  ATTENDANCE: "Attendance",
  INDIVIDUAL_RANKING: "Individual Ranking",
  GROUP_RANKING: "Group Ranking",
  INDIVIDUAL_INPUT_MEETING: "Individual Input Meeting",
  GROUP_INPUT_MEETING: "Group Input Meeting",
  PEER_REVIEW_MEETING: "Peer Review Meeting"
});

export const MeetingStatus = Object.freeze({
  SCHEDULED: "SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED"
});

export const FeedbackType = Object.freeze({
  SUCCESS: "Success",
  ERROR: "Error"
});

export const CommentTypes = Object.freeze({
  FEEDBACK: "Feedback",
  QUESTION: "Question",
  UNRESOLVED_TASK: "Task",
  RESOLVED_TASK: "Resolved Task",
  SUMMARY: "Summary"
});

export const CommentSortOptions = Object.freeze({
  OLDEST_TO_NEWEST: "Posted Timestamp: Oldest to Newest",
  NEWEST_TO_OLDEST: "Posted Timestamp: Newest to Oldest",
  MOST_VOTES: "Votes: Highest to Lowest",
  LEAST_VOTES: "Votes: Lowest to Highest"
});

export const PeerReviewMeetingActions = Object.freeze({
  ADD_COMMENT: "0",
  REPLY_TO_COMMENT: "1",
  EDIT_COMMENT: "2",
  DELETE_COMMENT: "3",
  CHANGE_COMMENT_TYPE: "4",
  UPVOTE_COMMENT: "5",
  DOWNVOTE_COMMENT: "6"
});

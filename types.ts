
export interface ActionItem {
  task: string;
  owner: string;
  deadline: string;
}

export interface MeetingData {
  summary: string[];
  discussionPoints: string[];
  decisions: string[];
  actionItems: ActionItem[];
  risks: string[];
}

export interface TranscriptSegment {
  id: string;
  timestamp: Date;
  text: string;
  speaker?: string;
}

export enum ProcessingStatus {
  IDLE = 'idle',
  PROCESSING = 'processing',
  ERROR = 'error'
}

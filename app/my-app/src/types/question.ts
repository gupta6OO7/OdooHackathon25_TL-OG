export interface Question {
    id: string;
    title: string;
    tags: string[];
    voteCount: number;
    answerCount: number;
    author: string;
    createdAt: string; // ISO string
  }
  
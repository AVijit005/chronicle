export class ChallengeDto {
  id: string;
  kind: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: string;
  expiresIn?: string;
  suggestions: ChallengeMediaRef[];
  accent: string;
}

export class ChallengeMediaRef {
  id: string;
  title: string;
  posterUrl: string | null;
  mediaType: string;
}

export class GoalDto {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  deadline?: string;
  priority: string;
  reward: string;
  reason: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  accent: string;
  coverIds: string[];
  milestones: GoalMilestoneDto[];
  kind: string;
}

export class GoalMilestoneDto {
  label: string;
  reached: boolean;
  when?: string;
}

export class ChallengeResponseDto {
  challenges: ChallengeDto[];
}

export class GoalResponseDto {
  goals: GoalDto[];
}

export class EngagementResponseDto {
  challenges: ChallengeDto[];
  goals: GoalDto[];
}

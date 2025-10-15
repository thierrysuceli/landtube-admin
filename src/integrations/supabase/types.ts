export interface Profile {
  user_id: string;
  email?: string;
  display_name?: string;
  balance: number;
  withdrawal_goal: number;
  daily_reviews_completed: number;
  total_reviews: number;
  current_streak: number;
  last_review_date: string | null;
  is_admin: boolean;
  is_blocked?: boolean;
  requires_password_change?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  title: string;
  thumbnail_url: string | null;
  youtube_url: string | null;
  duration: number | null;
  earning_amount: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  video_id: string;
  rating: number;
  earning_amount: number;
  created_at: string;
}

export interface DailyVideoList {
  id: string;
  user_id: string;
  list_date: string;
  video_ids: string[];
  current_video_index: number;
  videos_completed: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

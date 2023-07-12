export interface SignInSuccess {
  accessToken: string;
  user_id: number;
  is_pro: boolean;
}

export interface UserInfomation {
  email: string;
  nickname: string;
  phone_number: string;
  profile_image_url: string;
  is_pro: boolean;
  intro: string;
}

export interface UserInfoChangedMessage {
  status_code: number;
  is_success: Boolean;
  message: string;
}

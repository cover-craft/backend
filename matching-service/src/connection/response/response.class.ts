export interface PublicProjectInfo {
  project_id: number;
  ai_image_id: number;
  review: string;
}

export interface DetailProjectInfo {
  project_id: number;
  ai_image_id: number;
  request_user_id: number;
  pro_user_id: number;
  request_message: string;
  request_review: string;
  service_price: number;
  total_price: number;
  status: string;
}

export interface PublicProjectArray {
  total_item: number;
  projects: Array<PublicProjectInfo>;
}

export interface DetailProjectArray {
  total_item: number;
  projects: Array<DetailProjectInfo>;
}

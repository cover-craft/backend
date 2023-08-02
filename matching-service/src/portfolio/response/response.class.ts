import { PublicProjectInfo } from 'src/connection/response/response.class';

export interface ShowPortfolio {
  intro_text: string;
  price: number;
  linked_project_number: number;
  linked_project: Array<PublicProjectInfo>;
}

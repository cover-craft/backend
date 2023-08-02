import { Controller, UnauthorizedException } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreatePFRequestDto } from './dto/matching.add-pf.dto';
import { ShowPortfolio } from './response/response.class';
import { MatchingUpdateProjectDto } from './dto/matching.update-projects.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @MessagePattern({ cmd: 'createportfolio' })
  async createPortfolio(
    createPFRequestDto: CreatePFRequestDto,
  ): Promise<boolean> {
    console.log(createPFRequestDto);
    return await this.portfolioService.createPortfolio(
      createPFRequestDto.matchingCreatePFDto.intro_text,
      createPFRequestDto.matchingCreatePFDto.price,
      createPFRequestDto.user_id,
    );
  }

  @MessagePattern({ cmd: 'readportfolio' })
  async readPortfolio(user_id: number): Promise<ShowPortfolio> {
    return await this.portfolioService.readPortfolio(user_id);
  }
  @MessagePattern({ cmd: 'updateprojects' })
  async updateProjects(
    matchingUpdateProjectDto: MatchingUpdateProjectDto,
  ): Promise<boolean> {
    if (matchingUpdateProjectDto.project_id_array.length > 5) {
      console.error('5개 이상의 프로젝트를 연결할 수 없습니다.');
      throw new UnauthorizedException();
    }
    return this.portfolioService.updateConnections(
      matchingUpdateProjectDto.user_id,
      matchingUpdateProjectDto.project_id_array,
    );
  }
}

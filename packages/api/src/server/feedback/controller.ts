import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/server/auth/guard';
import { DeleteFeedbackDTO, FeedbackDto } from './dto';
import { Feedback } from './entity';
import { FeedbackService } from './service';

@Controller('feedback')
@ApiTags('Feedback')
@UseGuards(AuthenticationGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  @ApiOperation({ description: 'Get the Feedback Details.' })
  async getById() {
    return this.feedbackService.getFeedbacks();
  }

  @Post()
  @ApiOperation({ description: 'Create a Feedback.' })
  async createProperty(@Body() feedback: FeedbackDto): Promise<Feedback> {
    return this.feedbackService.createFeedback(feedback);
  }

  @Put()
  @ApiOperation({ description: 'Update the Feedback.' })
  async update(@Body() feedback: FeedbackDto) {
    return this.feedbackService.updateFeedback(feedback);
  }

  @Delete()
  @ApiOperation({ description: 'Delete a Feedback.' })
  async deleteFeedback(@Body() feedback: DeleteFeedbackDTO): Promise<Feedback> {
    return this.feedbackService.deleteFeedback(feedback.id);
  }
}

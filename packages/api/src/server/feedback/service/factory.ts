import { Injectable } from '@nestjs/common';
import { FeedbackDto } from '../dto';
import { Feedback } from '../entity';

@Injectable()
export class FeedbackFactory {
  createNewfeedback(createFeedbackDto: FeedbackDto): Feedback {
    const feedback = new Feedback();
    feedback.category = createFeedbackDto.category;
    feedback.description = createFeedbackDto.description;
    feedback.experience = createFeedbackDto.experience;
    feedback.error = createFeedbackDto.error;
    feedback.createdBy = createFeedbackDto.createdBy;
    feedback.updatedBy = createFeedbackDto.createdBy;
    return feedback;
  }
}

import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/repository/data-services.abstract';
import { ExceptionsService } from 'src/server/exceptions/service';
import { FeedbackDto } from '../dto';
import { Feedback } from '../entity';
import { FeedbackFactory } from './factory';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly exceptionService: ExceptionsService,
    private readonly feedbackFactory: FeedbackFactory
  ) {}

  // @internal get the list for all the feedback
  async getFeedbacks() {
    return this.dataServices.feedback.getAll();
  }

  /* @internal
   * This will create the feedback
   * Save the details related to the feedback
   */
  async createFeedback(createFeedbackDto: FeedbackDto): Promise<Feedback> {
    const feedback = this.feedbackFactory.createNewfeedback(createFeedbackDto);
    return this.dataServices.feedback.create(feedback);
  }

  /* @internal
   * Update the existing feedback
   * Provision for updating the feedback
   */
  async updateFeedback(updateFeedbackDto: FeedbackDto) {
    try {
      const updatefeedback = (await this.dataServices.feedback.getByAny({ _id: updateFeedbackDto.id }))[0];
      updatefeedback.title = updateFeedbackDto.title;
      updatefeedback.description = updateFeedbackDto.description;
      updatefeedback.experience = updateFeedbackDto.experience;
      await this.dataServices.feedback.updateOne({ _id: updateFeedbackDto.id }, updatefeedback);
      return updatefeedback;
    } catch (e) {
      return this.exceptionService.badRequestException({ message: `feedback doesn't exist.` });
    }
  }

  // @internal Delete the Feedback from the records
  async deleteFeedback(id: string): Promise<Feedback> {
    const feedback = await this.dataServices.feedback.getByAny({ _id: id });
    if (feedback.length === 0) this.exceptionService.badRequestException({ message: `feedback doesn't exist.` });
    const response = await this.dataServices.feedback.delete({ _id: id });
    return response;
  }
}

import { Injectable } from '@nestjs/common';
import { FeedbackType } from '@bis/shared-types';

@Injectable()
export class FeedbackService {
  private feedbackRecords: Array<{
    id: string;
    messageId: string;
    feedback: FeedbackType;
    notes?: string;
    timestamp: string;
  }> = [];

  async recordFeedback(data: { messageId: string; feedback: FeedbackType; notes?: string }) {
    this.feedbackRecords.push({
      id: `fb-${Date.now()}`,
      messageId: data.messageId,
      feedback: data.feedback,
      notes: data.notes,
      timestamp: new Date().toISOString()
    });
    return { success: true };
  }

  async getFeedbackStats() {
    let helpful = 0;
    let notHelpful = 0;
    let reported = 0;

    for (const r of this.feedbackRecords) {
      if (r.feedback === FeedbackType.HELPFUL) helpful++;
      else if (r.feedback === FeedbackType.NOT_HELPFUL) notHelpful++;
      else if (r.feedback === FeedbackType.REPORTED) reported++;
    }

    return { helpful, notHelpful, reported, total: this.feedbackRecords.length };
  }
}

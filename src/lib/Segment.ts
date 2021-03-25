import { Analytics } from '@distributed/analytics-node';

export const analytics = new Analytics(process.env.SEGMENT_ANALYTICS_KEY);

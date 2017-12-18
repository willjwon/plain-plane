import { Plane } from '../../app/models/plane';

export { Reply } from '../../app/models/reply';
export { ReplyService } from '../../app/models/reply.service';

import { Reply } from '../../app/models/reply';
import { ReplyService } from '../../app/models/reply.service';


export const REPLIES: Reply[] = [
  { reply_id: 1, plane_author: 1, reply_author : 2, original_content: 'xxx', original_tag: 'study', content: 'aaa',
    is_reported: false, level: 'Plain' },
  { reply_id: 2, plane_author: 2, reply_author : 4, original_content: 'yyy', original_tag: 'swpp', content: 'bbb',
    is_reported: false, level: 'Plain' },
  { reply_id: 3, plane_author: 3, reply_author : 4, original_content: 'zzz', original_tag: 'work', content: 'ccc',
    is_reported: false, level: 'Plain' },
  { reply_id: 4, plane_author: 4, reply_author : 3, original_content: 'www', original_tag: 'angular', content: 'hey',
    is_reported: false, level: 'Plain' }
];

export class FakeReplyService {
  foldNewReply(plane: Plane, content: string): Promise<number> {
    return Promise.resolve(201);
  }
}

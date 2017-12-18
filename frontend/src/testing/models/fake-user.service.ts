export { User } from '../../app/models/user';
export { UserService } from '../../app/models/user.service';

import { User } from '../../app/models/user';
import { UserService } from '../../app/models/user.service';

export const USERS: User[] = [
  { user_id: 1, username: 'aa', level: 'Plain', today_reply_count: 3, today_write_count: 3, total_likes: 1 },
  { user_id: 2, username: 'bb', level: 'Plain', today_reply_count: 0, today_write_count: 3, total_likes: 1 },
];

export class FakeUserService {
  getUser(): Promise<User> {
    return Promise.resolve(USERS[0]);
  }
}

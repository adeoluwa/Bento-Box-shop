import { AppContainer } from './container';

export interface AppContext<User = object> {
  remoteAddress: string;
  userAgent: string;
  scope: AppContainer;
  // sentryScope: SentryScope;
  token?: string;
  user?: User;
  admin?: User;
}

export type ApolloContext<User = object> = AppContext<User>;

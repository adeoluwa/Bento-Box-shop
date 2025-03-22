import { createAppContainer } from "../../core/utils/container";
import { AppContainer, Express } from "../../shared/types";

import repositoriesLoader from "./repositories.loader";
import servicesLoader from "./services.loader";
import routingControllersLoader from "./routing-controllers.loader";

export default async (app: Express,):Promise<{container: AppContainer}> => {
  const container = createAppContainer();

  await repositoriesLoader({container});

  await servicesLoader({container});

  routingControllersLoader({ container, app});

  return { container };
}
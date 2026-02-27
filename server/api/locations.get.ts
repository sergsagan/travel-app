import { findLocations } from '~/lib/db/queries/location';
import defineAuthenticatedEventHandler from '~/utils/defineAuthenticatedEventHandler';

export default defineAuthenticatedEventHandler(async (event) => {
  return findLocations(event.context.user.id);
});

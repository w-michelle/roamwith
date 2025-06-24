import getItinerary from "@/app/actions/getItinerary";
import { formatSingleDate } from "@/utils/formatDate";
import InviteContent from "./InviteContent";
import EmptyState from "@/app/components/EmptyState";

interface InviteParams {
  accessId: string;
}
const Invite = async ({ params }: { params: InviteParams }) => {
  const itinerary = await getItinerary(params.accessId);

  if (!itinerary) {
    return <EmptyState title="This itinerary is no longer available" />;
  }

  return (
    <div>
      <InviteContent itinerary={itinerary} />
    </div>
  );
};

export default Invite;

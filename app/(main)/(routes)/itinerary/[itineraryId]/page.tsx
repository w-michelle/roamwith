import getCurrentUser from "@/app/actions/getCurrentUser";
import getItinerary from "@/app/actions/getItinerary";
import EmptyState from "@/app/components/EmptyState";
import ItineraryContent from "@/app/(main)/(routes)/itinerary/[itineraryId]/ItineraryContent";

interface IParams {
  itineraryId: string;
}
export const dynamic = "force-dynamic";
const ItineraryPage = async ({ params }: { params: IParams }) => {
  const currentItinerary = await getItinerary(params.itineraryId);
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentItinerary) {
    return <EmptyState title="Itinerary does not exist" />;
  }

  return (
    <ItineraryContent
      currentItinerary={currentItinerary}
      currentUser={currentUser}
    />
  );
};

export default ItineraryPage;

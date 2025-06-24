"use client";
import EmptyState from "@/app/components/EmptyState";
import { SafeItinerary, SafeItinerary2 } from "@/types";
import { formatDate, formatSingleDate } from "@/utils/formatDate";
import { Itinerary } from "@prisma/client";
import { useEffect, useState } from "react";
import CardContent from "./CardContent";

interface InviteContentParams {
  itinerary?: SafeItinerary2;
}

const InviteContent: React.FC<InviteContentParams> = ({ itinerary }) => {
  const { startDate, endDate, cards, createdAt, container, id } = itinerary!;

  const [dateList, setDateList] = useState<Date[]>([]);
  const [containerList, setContainerList] = useState<any>([]);
  const generateDates = () => {
    let dates = [];
    let currentDate = new Date(startDate);
    let end = new Date(endDate);

    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setDateList(dates);
    return dates;
  };

  const generateContainerList = (dates: Date[]) => {
    let containers = [];
    for (let i = 0; i < dates.length; i++) {
      containers.push({ id: container[i].id, cards: container[i]?.cards });
    }
    setContainerList(containers);
  };
  useEffect(() => {
    const dates = generateDates();
    generateContainerList(dates);
  }, []);

  return (
    <div className="relative p-3 my-8 max-w-screen-lg mx-auto">
      <h1 className="text-center">{itinerary?.title || "Itinerary"}</h1>
      <div className="text-sm text-neutral-500 mt-4">
        Created: {formatDate(createdAt)}
      </div>
      <div className="mt-20 flex flex-col gap-8 ">
        {/* individual container */}
        {containerList.map((container: any, index: any) => (
          <div key={container.id}>
            <div>
              <div className="p-4 border-[1px] border-neutral-400/30 rounded-md">
                <div className="flex justify-between">
                  <h3 className="text-cusText text-sm ">
                    {formatSingleDate(new Date(dateList[index]))}
                  </h3>
                </div>

                <div>
                  {/* droppable card area */}
                  <div>
                    <div>
                      {/* cards */}
                      <div className="mt-8 flex flex-col gap-8">
                        {container.cards?.map((card: any, index: any) => (
                          <div
                            key={card.id}
                            className="flex p-3 items-center gap-4"
                          >
                            <CardContent card={card} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InviteContent;

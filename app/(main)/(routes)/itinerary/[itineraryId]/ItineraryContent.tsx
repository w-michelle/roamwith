"use client";
import { SafeItinerary, SafeUser } from "@/types";
import { formatCalDate, formatSingleDate } from "@/utils/formatDate";

import React, { useCallback, useEffect, useState } from "react";
import { DateRange, Range } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

import Card from "../../../../components/itinerary/Card";
import axios from "axios";

import CardModal from "../../../../components/modals/CardModal";
import { RiDraggable } from "react-icons/ri";
import { IoIosCheckmark, IoMdClose, IoMdShare } from "react-icons/io";
import { IoCopyOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { useOrigin } from "@/app/hooks/use-origin";
import { useRouter } from "next/navigation";

import { BeatLoader } from "react-spinners";
import { useModal } from "@/app/hooks/useModal";
import debounce from "lodash.debounce";

interface ItinProps {
  currentItinerary: SafeItinerary;
  currentUser: SafeUser;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

const ItineraryContent: React.FC<ItinProps> = ({
  currentItinerary,
  currentUser,
}) => {
  const { startDate, endDate, cards, createdAt, container, id } =
    currentItinerary;

  const initialDateRange = {
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    key: "selection",
  };
  const router = useRouter();
  const modal = useModal();
  const [title, setTitle] = useState(currentItinerary?.title || "Intinerary");
  const [titleSubmit, setTitleSubmit] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [datesSelected, setDatesSelected] = useState(false);

  const [toggleCal, setToggleCal] = useState(false);
  const [toggleInvite, setToggleInvite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dateList, setDateList] = useState<Date[]>([]);
  const [containersList, setContainersList] = useState<any[]>(container || []);
  const [updating, setUpdating] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  //for invite link
  const origin = useOrigin();
  const inviteLink = `${origin}/invite/${id}`;
  const onCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const generateDateList = (startDate: Date, endDate: Date) => {
    let dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setDateList(dates);

    return dates;
  };

  useEffect(() => {
    let dates = generateDateList(dateRange.startDate!, dateRange.endDate!);
    let itineraryStartDate = formatSingleDate(new Date(startDate));
    let dateRangeStartDate = formatSingleDate(dateRange?.startDate!);
    let itineraryEndDate = formatSingleDate(new Date(endDate));
    let dateRangeEndDate = formatSingleDate(dateRange?.endDate!);

    if (
      container.length == 0 ||
      itineraryStartDate !== dateRangeStartDate ||
      itineraryEndDate !== dateRangeEndDate
    ) {
      const generateContainerList = (dates: Date[]) => {
        setUpdating(true);
        axios
          .post("/api/itinerary/updateItinerary", {
            data: {
              dates: dateRange,
              dateLen: dates.length,
              itinId: id,
              containers: containersList,
              cards: cards,
            },
          })
          .then((result: any) => {
            setContainersList(result.data);

            toast.success("Dates Updated");
          })
          .catch(() => {
            toast.error("Something went wrong");
          })
          .finally(() => {
            setUpdating(false);
            setDatesSelected(false);
            router.refresh();
          });
      };
      generateContainerList(dates);
    }
  }, [datesSelected]);

  const handleDateChange = (range: any) => {
    const { selection } = range;

    if (selection.startDate && selection.endDate) {
      setDateRange(selection);
      setIsSelecting(true);
    }

    if (isSelecting && selection.startDate && selection.endDate) {
      setTimeout(() => {
        setDatesSelected(true);
      }, 1000);

      setIsSelecting(false);
    }
  };
  const updateDiffContainer = useCallback(
    debounce((sourceList, destList) => {
      setUpdating(true);
      axios
        .post("/api/cards/updateCardsDiffContainer", {
          data: {
            source: sourceList,
            dest: destList,
            itinId: id,
          },
        })
        .then(() => {
          toast.success("Card moved");
        })
        .catch(() => {
          toast.error("Something went wrong");
        })
        .finally(() => {
          setUpdating(false);
        });
    }, 500),
    [id]
  );

  const updateSameContainer = useCallback(
    debounce((reorderedCards, sourceListId) => {
      setUpdating(true);
      axios
        .post("/api/cards/updateCardsSameContainer", {
          data: {
            itinId: id,
            reorderedCards: reorderedCards,
            containerId: sourceListId,
          },
        })
        .then(() => {
          toast.success("Updated");
        })
        .catch(() => {
          toast.error("Something went wrong");
        })
        .finally(() => {
          setUpdating(false);
        });
    }, 500),
    [id]
  );

  const updateContainer = useCallback(
    debounce((items) => {
      setUpdating(true);
      axios
        .post("/api/updateContainer", {
          data: { dates: dateList, containers: items, itinId: id },
        })
        .then(() => {
          toast.success("Containers updated!");
        })
        .catch(() => {
          toast.error("Something went wrong");
        })
        .finally(() => {
          setUpdating(false);
        });
    }, 500),
    [id, dateList]
  );
  //when container or card is moved

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }
    //drops in same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    //if moving container/list

    if (type === "list") {
      const items = reorder(
        containersList,
        source.index,
        destination.index
      ).map((item: any, index) => ({ ...item, order: index }));
      setContainersList(items);
      updateContainer(items);
    }

    if (type === "card") {
      let newOrderedData: any = [...containersList];

      //first check the containers to see if there is a containers that matches the droppable id
      const sourceList = newOrderedData.find(
        (list: any) => list.id === source.droppableId
      );
      const destList = newOrderedData.find(
        (list: any) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) {
        return;
      }

      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      //moving the card in the same container
      if (source.droppableId === destination.droppableId) {
        //reorder cards
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );
        reorderedCards.forEach((card: any, idx) => {
          card.order = idx;
        });
        sourceList.cards = reorderedCards;
        setContainersList(newOrderedData);
        updateSameContainer(reorderedCards, sourceList.id);
      } else {
        //user move card to another list so if its not the same container

        const [movedCard] = sourceList.cards.splice(source.index, 1);

        //assign the new listid to the moved card

        movedCard.containerId = destination.droppableId;

        //add card to the destination list
        destList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card: any, idx: any) => {
          card.order = idx;
        });

        //update the order for each card in the destination list

        destList.cards.forEach((card: any, idx: any) => {
          card.order = idx;
        });
        setContainersList(newOrderedData);
        updateDiffContainer(sourceList, destList);
      }
    }
  };

  const updateTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleSubmit(true);
    setTitle(event.target.value);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };
  const handleInputBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 1000);
  };

  //handle title change
  const handleSubmit = () => {
    if (title !== "") {
      axios
        .post("/api/itinerary/itinTitle", { title: title, itinId: id })
        .then(() => {
          toast.success("Title updated");
          setTitleSubmit(false);
        })
        .catch((error: any) => {
          toast.error(error);
        });
    }
  };

  //clean up
  useEffect(() => {
    return () => {
      updateContainer.cancel?.();
      updateDiffContainer.cancel?.();
      updateDiffContainer.cancel?.();
    };
  }, [updateContainer, updateDiffContainer, updateSameContainer]);

  if (updating) {
    return (
      <>
        <div className="z-50 w-full absolute top-0 left-0 h-screen bg-neutral-300 backdrop-blur-sm opacity-60"></div>
        <div className="z-50 w-full absolute top-0 left-0 h-screen flex flex-col gap-2 items-center justify-center">
          <p className="">Updating</p>
          <BeatLoader
            size={10}
            color="black"
          />
        </div>
      </>
    );
  }

  return (
    <div className="relative p-3 mb-4 max-w-screen-lg mx-auto">
      <div className="mt-4 flex items-center justify-center ">
        <div className="flex flex-col items-center justify-center gap-2 w-full  text-center">
          <input
            className="text-center"
            type="text"
            value={title}
            onChange={updateTitle}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          {isFocused && titleSubmit && (
            <button
              className="p-1 text-xs w-[100px] rounded-lg bg-cusGreen"
              onClick={() => handleSubmit()}
            >
              Submit
            </button>
          )}
        </div>
        <div
          className="absolute right-2 cursor-pointer ml-auto"
          onClick={() => setToggleInvite(!toggleInvite)}
        >
          <IoMdShare
            size={20}
            className="text-neutral-600"
          />
        </div>
        {toggleInvite && (
          <div className="absolute w-[300px] md:w-[500px] top-20 right-3 rounded-md bg-cusText shadow-xl p-2 z-10">
            <div
              className="cursor-pointer"
              onClick={() => setToggleInvite(!toggleInvite)}
            >
              <IoMdClose
                size={20}
                className="text-white ml-auto"
              />
            </div>
            <div className="text-white text-center mb-2">Invite</div>
            <div className="flex items-center gap-4 mb-2 mx-2">
              <div className="overflow-x-auto bg-white p-2 rounded-sm">
                {inviteLink}
              </div>
              <div className="cursor-pointer">
                {copied ? (
                  <IoIosCheckmark
                    size={28}
                    className="text-white"
                  />
                ) : (
                  <IoCopyOutline
                    className="text-white"
                    size={25}
                    onClick={onCopy}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row items-center justify-between ">
        {/*  date dropdown*/}
        <div>
          <div
            onClick={() => setToggleCal(!toggleCal)}
            className={`relative cursor-pointer ${
              toggleCal ? "bg-cusText text-white" : ""
            } text-cusText] text-xs bg-cusGrayBg/30 border-[1px] text-cusText border-cusBorder w-[170px] px-3 py-2 rounded-2xl flex justify-between`}
          >
            <div>{formatCalDate(dateRange.startDate!)}</div>
            <div>-</div>
            <div>{formatCalDate(dateRange.endDate!)}</div>
          </div>
          {toggleCal && (
            <div className="absolute z-10 mt-4 bg-white p-3 w-[360px] rounded-xl shadow-xl border-[1px] border-neutral-200 overflow-hidden">
              <DateRange
                ranges={[dateRange]}
                rangeColors={["#60956e"]}
                date={new Date()}
                onChange={handleDateChange}
                direction="vertical"
                showDateDisplay={false}
                minDate={new Date()}
                moveRangeOnFirstSelection={false}
              />
            </div>
          )}
        </div>
        <button
          onClick={() => modal.onOpen("card")}
          className=" hover:bg-cusGrayBg/60 text-xs bg-cusGrayBg/30 border-[1px] text-cusText border-cusBorder w-[170px] px-3 py-2 rounded-2xl"
        >
          ADD NEW ITEM
        </button>
      </div>
      {/* date container */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="lists"
          type="list"
          direction="vertical"
        >
          {/* whole dnd section */}
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="mt-20 flex flex-col gap-8 "
            >
              {/* individual container */}
              {containersList.map((container: any, index: any) => (
                <div key={container.id}>
                  <Draggable
                    draggableId={container.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        className="p-4 border-[1px] border-neutral-400/30 rounded-md"
                      >
                        <div className="flex justify-between">
                          <h3 className="text-cusText text-sm ">
                            {dateList[index] === undefined
                              ? ""
                              : formatSingleDate(new Date(dateList[index]))}
                          </h3>
                          <div {...provided.dragHandleProps}>
                            <RiDraggable
                              size={25}
                              className="text-cusText/30 hover:text-cusText"
                            />
                          </div>
                        </div>
                        <div>
                          {/* droppable card area */}
                          <Droppable
                            droppableId={container.id}
                            type="card"
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                              >
                                {/* cards */}
                                <div className="mt-8 flex flex-col gap-8 overflow-x-auto">
                                  {container.cards?.map(
                                    (card: any, index: any) => (
                                      <div
                                        key={card.id}
                                        className="flex p-3 items-center gap-4 hover:bg-cusGrayBg/30 hover:rounded-2xl"
                                      >
                                        <Card
                                          card={card}
                                          index={index}
                                          cards={cards}
                                        />
                                      </div>
                                    )
                                  )}
                                </div>
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      </div>
                    )}
                  </Draggable>
                  <CardModal
                    containerId={containersList[0].id}
                    itinId={id}
                  />
                </div>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ItineraryContent;

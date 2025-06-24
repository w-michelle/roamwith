import React, { ReactElement } from "react";
interface ListingContentProps {
  bodyContent: ReactElement;
}
const ListingContent: React.FC<ListingContentProps> = ({ bodyContent }) => {
  return (
    <div>
      <div>{bodyContent}</div>
    </div>
  );
};

export default ListingContent;

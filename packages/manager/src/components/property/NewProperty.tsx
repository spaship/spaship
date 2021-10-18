import { useState } from "react";
import { GalleryItem, Card, CardHeader, CardBody } from "@patternfly/react-core";
import { AddCircleOIcon } from "@patternfly/react-icons";
import NewPropertyModal from "./NewPropertyModal";
import { IConfig } from "../../config";

interface IProps {
  onSubmit: (conf: IConfig) => void;
}
export default (props: IProps) => {
  const { onSubmit } = props;
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSubmit = (conf: IConfig) => {
    onSubmit(conf);
    setModalOpen(false);
  };
  const handleClose = () => {
    setModalOpen(false);
  };
  const handleClick = () => {
    setModalOpen(true);
  };
  return (
    <>
      <GalleryItem>
        <Card isHoverable isSelectable onClick={handleClick}>
          <CardHeader>Add new property</CardHeader>
          <CardBody>
            <AddCircleOIcon size="lg" />
          </CardBody>
        </Card>
      </GalleryItem>
      <NewPropertyModal isModalOpen={isModalOpen} onClose={handleClose} onSubmit={handleSubmit} />
    </>
  );
};

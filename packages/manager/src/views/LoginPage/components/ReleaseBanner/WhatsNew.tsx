import packageJson from '@jsonPath';
import { Button, Modal, ModalVariant } from '@patternfly/react-core';
import * as React from 'react';

interface IWhatsNewProp {
  confirm: () => void;
  broadCastFlag: boolean;
}

const WhatsNew = ({ broadCastFlag, confirm }: IWhatsNewProp) => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(true);

  const handleModalToggle = () => {
    confirm();
    setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  const header = `What's new in Version ${packageJson.version}`;

  return (
    <Modal
      bodyAriaLabel="Scrollable modal content"
      tabIndex={0}
      variant={ModalVariant.small}
      title={header}
      isOpen={isModalOpen || broadCastFlag}
      onClose={handleModalToggle}
      width="50%"
      actions={[
        <Button key="confirm" variant="primary" onClick={handleModalToggle}>
          Confirm
        </Button>
      ]}
    >
      <a
        target="_blank"
        href="https://source.redhat.com/groups/public/spaship/blog_article/whats_new_in_spaship_"
        rel="noreferrer"
      >
        SPAship Souce Page Release Notes
      </a>
      <br />
      <br />
      &bull; We have implemented a dynamic &quot;What&apos;s New&quot; page that automatically
      appears as a pop-up modal following each release, ensuring users are promptly informed of
      changes. Additionally, a dedicated Release Notes icon now resides in the top right of the
      navbar, granting users the ability to revisit the &quot;What&apos;s New&quot; page at their
      convenience, facilitating thorough review or clarification of updates.
      <img src="/img/release3-1-snapshot.png" alt="release-3-1-snapshot" />
    </Modal>
  );
};

export { WhatsNew };

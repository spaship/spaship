import packageJson from '@jsonPath';
import { Button, Modal, ModalVariant } from '@patternfly/react-core';
import * as React from 'react';
import './WhatsNew.css';

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
        SPAship Source Page Release Notes
      </a>
      <br />
      <br />

      <div className="update-section">
        <div className="inline-header">
          <h2>Add New Static App:</h2>
          <p>Easily create new static apps directly from the Manager.</p>
        </div>
        <div className="image-row">
          <div className="image-container">
            <img src="/img/webProperty_static.png" alt="Add New Static App" />
            <p className="image-subtitle">Properties Page: Create deployments directly.</p>
          </div>
          <div className="image-container">
            <img src="/img/property_static.png" alt="Add New Static App" />
            <p className="image-subtitle">SPA Detail Page: Deploy static apps.</p>
          </div>
        </div>
        <div className="image-container">
          <img src="/img/static_form.png" alt="Add New Static App" />
          <p className="image-subtitle">Static Deployment Form: View the form layout.</p>
        </div>
      </div>

      <div className="update-section">
        <div className="inline-header">
          <h2>Virtual Path Support:</h2>
          <p>Introduce Virtual Path support with seamless creation and deletion options.</p>
        </div>
        <div className="image-container">
          <img src="/img/VirtualPath.png" alt="Virtual Path Support" />
          <p className="image-subtitle">Virtual Path Support: Manage paths easily.</p>
        </div>
      </div>

      <div className="update-section">
        <div className="inline-header">
          <h2>Enhanced Activity Stream:</h2>
          <p>Get user detailed insights into SPA creation and updates within property and spa.</p>
        </div>
        <div className="image-container">
          <img src="/img/activity_stream.png" alt="Activity Stream" />
          <p className="image-subtitle">
            Enhanced Activity Stream: Insights into SPA creation and updates.
          </p>
        </div>
      </div>

      <div className="update-section">
        <div className="inline-header">
          <h2>History Section:</h2>
          <p>Access a comprehensive history of all activities within the SPAship Manager.</p>
        </div>
        <div className="image-container">
          <img src="/img/history.png" alt="History Section" />
          <p className="image-subtitle">History Section: Review all activities.</p>
        </div>
      </div>

      <div className="update-section">
        <div className="inline-header">
          <h2>Updated Release Notes:</h2>
          <p>View the latest changes with a refreshed release note screenshot.</p>
        </div>
      </div>
    </Modal>
  );
};

export { WhatsNew };

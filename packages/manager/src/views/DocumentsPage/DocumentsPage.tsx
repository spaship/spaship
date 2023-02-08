import { Gallery, GalleryItem, PageSection, Title } from '@patternfly/react-core';
import { Banner } from '@app/components';
import { DocumentCard } from './components/DocumentCard/DocumentCard';

export const DocumentsPage = (): JSX.Element => {
  const gettingStartedData = [
    {
      title: 'On-Boarding to SPAship Cloud Native Version ',
      linkhere:
        'https://source.redhat.com/groups/public/spaship/blog_article/onboarding_to_spaship_cloud_native_version',
      footer: 'Getting-Started'
    },
    {
      title: 'SPAship CLI Guide ',
      linkhere: 'https://spaship.io/docs/guide/user-guide/cli/',
      footer: 'CLI Instructions'
    },
    {
      title: 'SPAship Manager & CLI Guide',
      linkhere: 'https://drive.google.com/file/d/150OyktZdmqMXKwNS1mDkqIo7ZvgyCCGp/view',
      footer: 'Manager and CLI Workflow',
      isIcon: true
    },
    {
      title: 'SPAship CLI Instruction ',
      linkhere:
        'https://drive.google.com/file/d/1G4B8AKu_8M6fVEMd8WtXHgLhf__Xl2mt/view?usp=share_link',
      footer: 'CLI Workflow',
      isIcon: true
    }
  ];
  const aboutAllData = [
    {
      title: 'SPAship, a quickest way to deploy your SPAs ',
      linkhere:
        'https://source.redhat.com/groups/public/dxp/exd_digital_experience_platforms_dxp_blog/spaship_a_quickest_way_to_deploy_your_spas',
      footer: 'SPAship 2.0'
    },
    {
      title: 'SPAship: Baremetal vs Operator ',
      linkhere:
        'https://source.redhat.com/groups/public/dxp/exd_digital_experience_platforms_dxp_blog/draft_spaship_baremetal_vs_operator',
      footer: 'Cloud Native version'
    }
  ];
  const newFeaturesData = [
    {
      title: 'Introducing Ephemeral Preview feature in SPAship ',
      linkhere:
        'https://source.redhat.com/groups/public/dxp/exd_digital_experience_platforms_dxp_blog/ephemeral_preview_feature_in_spaship',
      footer: 'Preview Enviroment for Deployment'
    },
    {
      title: 'Getting Deployment Status in Reltime',
      linkhere:
        'https://source.redhat.com/groups/public/dxp/exd_digital_experience_platforms_dxp_blog/get_your_deployment_status_in_realtime',
      footer: 'SSE & Notifications'
    },
    {
      title: 'Introducing Sync service in SPAship ',
      linkhere:
        'https://source.redhat.com/groups/public/dxp/exd_digital_experience_platforms_dxp_blog/introducing_sync_service_in_spaship',
      footer: 'SSI Configuration'
    },
    {
      title: 'SPAship Release Logs ',
      linkhere:
        'https://docs.google.com/document/u/1/d/1tdwBCT9d3n3lJnjpiD7B67304Tgl2URwnKwSwGasNHk/edit',
      footer: 'Version Update '
    },
    {
      title: 'SPAship FAQ',
      linkhere:
        'https://docs.google.com/document/d/143ezNXxfujOiTe3VD0cc0ZBYL92F_fSpYCFJUzzDoiQ/edit',
      footer: 'Troubleshooter'
    }
  ];
  return (
    <>
      <Banner title="Documents" />
      <Title headingLevel="h1" style={{ marginLeft: '100px', marginTop: '20px' }}>
        Getting Started with SPAship
      </Title>
      <PageSection isCenterAligned isWidthLimited className="pf-u-px-3xl">
        <Gallery hasGutter>
          {gettingStartedData.map(({ title, linkhere, footer, isIcon }) => (
            // eslint-disable-next-line react/jsx-key
            <GalleryItem>
              <DocumentCard title={title} linkhere={linkhere} footer={footer} isIcon={isIcon} />
            </GalleryItem>
          ))}
        </Gallery>
      </PageSection>
      <Title headingLevel="h1" style={{ marginLeft: '100px', marginTop: '20px' }}>
        New Features & Releases
      </Title>
      <PageSection isCenterAligned isWidthLimited className="pf-u-px-3xl">
        <Gallery hasGutter>
          {newFeaturesData.map(({ title, linkhere, footer }) => (
            // eslint-disable-next-line react/jsx-key
            <GalleryItem>
              <DocumentCard title={title} linkhere={linkhere} footer={footer} />
            </GalleryItem>
          ))}
        </Gallery>
      </PageSection>
      <Title headingLevel="h1" style={{ marginLeft: '100px', marginTop: '20px' }}>
        All about SPAship
      </Title>
      <PageSection isCenterAligned isWidthLimited className="pf-u-px-3xl">
        <Gallery hasGutter>
          {aboutAllData.map(({ title, linkhere, footer }) => (
            // eslint-disable-next-line react/jsx-key
            <GalleryItem>
              <DocumentCard title={title} linkhere={linkhere} footer={footer} />
            </GalleryItem>
          ))}
        </Gallery>
      </PageSection>
    </>
  );
};

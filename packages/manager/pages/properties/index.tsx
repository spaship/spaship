import { 
  Flex, 
  FlexItem, 
  Gallery, 
  Select, 
  SelectOption, 
  SelectVariant 
} from "@patternfly/react-core";
import { getSession } from "next-auth/react";
import Body from "../../components/layout/body";
import { AnyProps, Properties } from "../../components/models/props";
import AddProperty from "../../components/web-property/addProperty";
import WebProperty from "../../components/web-property/webProperty";
import { get, post } from "../../utils/api.utils";
import { getAllEventCountUrl, getPropertyList } from "../../utils/endpoint.utils";
import { ComponentWithAuth } from "../../utils/auth.utils";
import styled from "styled-components";
import { useState } from "react";

interface PropertiesListProps { }

const payload = {
  count: {
    all: true,
  },
};

const meta = {
  title: "Properties ",
  breadcrumbs: [
    { path: "/properties", title: "Home" },
    { path: "/properties", title: "Properties" },
  ],
};

const StyledGallery = styled(Gallery)`
  margin-top: 1.5rem;
`;

export const getServerSideProps = async (context: any) => {
  try {
    const token = ((await getSession(context as any)) as any).accessToken;
    const userEmail = ((await getSession(context as any)) as any).user.email;
    const urlCount = getAllEventCountUrl();
    const urlProperty = getPropertyList();
    const response = await Promise.all([
      await post<Properties>(urlCount, payload, token),
      await get<AnyProps>(urlProperty, token),
    ]);
    const [deploymentCountResponse, propertyListResponse]: AnyProps = response;
    const webProperties = filterWebProperties(propertyListResponse);
    const myWebProperties: AnyProps = [];
    const allWebproperties: AnyProps = [];
    webProperties.forEach((item: AnyProps) => {
      const eventProp = deploymentCountResponse.find((event: AnyProps) => event.propertyName === item.propertyName);
      item.count = eventProp?.count || 0;
      if (item.createdBy === userEmail) myWebProperties.push(item);
      else allWebproperties.push(item);
    });
    return {
      props: { webprop: { myWebProperties, allWebproperties } },
    };
  } catch (error) {
    return { props: {} };
  }
};

const PropertiesList: ComponentWithAuth<PropertiesListProps> = ({ webprop }: AnyProps) => {
  const propertiesOptions = [
    {
      title: "All Properties",
      disabled: false,
    },
    {
      title: "My Properties",
      disabled: false,
    },
  ];
  const [selectedProperty, setSelectedProperty] = useState(propertiesOptions[0].title);
  const onSelect = (_event : any, selection: any) => {
    setSelectedProperty(selection);
    onToggle();
  };
  const [isOpen, setIsOpen] = useState(false);
  const onToggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <Body {...meta}>
      <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
        <FlexItem>
          {/* TODO: Add search here */}
        </FlexItem>
        <FlexItem>
          <Select
            variant={SelectVariant.single}
            aria-label="Select Input to filter properties"
            onToggle={onToggle}
            onSelect={onSelect}
            selections={selectedProperty}
            isOpen={isOpen}
            aria-labelledby="select-input"
          >
            {propertiesOptions.map((option, index) => (
              <SelectOption
                isDisabled={option.disabled}
                key={index}
                value={option.title}
              />
            ))}
          </Select>
        </FlexItem>
      </Flex>
      <StyledGallery hasGutter>
        <AddProperty></AddProperty>
        {
          selectedProperty === propertiesOptions[0].title ? <>
            <WebProperty webprop={webprop?.myWebProperties}></WebProperty>
            <WebProperty webprop={webprop?.allWebproperties}></WebProperty>
            </> : <></>
        }
        {
          selectedProperty === propertiesOptions[1].title ? <>
            <WebProperty webprop={webprop?.myWebProperties}></WebProperty>
            </> : <></>
        }
      </StyledGallery>
    </Body>
  );
};

function filterWebProperties(propertyListResponse: AnyProps) {
  return propertyListResponse.filter(
    (compareProp: AnyProps, index: AnyProps, filterItem: AnyProps) =>
      filterItem.findIndex((prop: AnyProps) => prop.propertyName === compareProp.propertyName) === index
  );
}

PropertiesList.authenticationEnabled = true;
export default PropertiesList;

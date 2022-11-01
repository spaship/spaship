import { Injectable } from "@nestjs/common";
import { DeploymentConnectionRecord, Property } from "src/repository/mongo/model";
import { CreatePropertyDto } from "src/server/property/property.dto";

@Injectable()
export class PropertyFactoryService {
  createNewProperty(createPropertyDto: CreatePropertyDto): Property {
    const newProperty = new Property();
    newProperty.propertyTitle = "one platform";
    newProperty.propertyName = "one-platform";
    newProperty.createdBy = "souchowd@redhat.com";
    newProperty.isActive = true;
    newProperty.createdBy = "souchowd@redhat.com";
    newProperty.namespace = "souchowd@redhat.com";

    const newDR = new DeploymentConnectionRecord();
    newDR.deploymentConnectionName = "west2";
    newDR.cluster = "preprod";
    newProperty.deploymentConnectionRecord = [newDR];

    console.log(newProperty);
    return newProperty;
  }
}
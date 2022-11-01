import { Injectable } from "@nestjs/common";
import { CreatePropertyDto } from "src/server/property/property.dto";
import { Property } from "src/repository/mongo/model";
import { IDataServices } from "src/repository/data-services.abstract";
import { PropertyFactoryService } from "./property.factory";

@Injectable()
export class PropertyUseCases {
  constructor(private dataServices: IDataServices, private propertyFactoryService: PropertyFactoryService) {}

  getAllPropertys(): Promise<Property[]> {
    return this.dataServices.property.getAll();
  }

  getPropertyById(id: any): Promise<Property> {
    return this.dataServices.property.get(id);
  }

  createProperty(createPropertyDto: CreatePropertyDto): Promise<any> {
    const property = this.propertyFactoryService.createNewProperty(createPropertyDto);
    console.log(property);
    return this.dataServices.property.create(property);
  }
}

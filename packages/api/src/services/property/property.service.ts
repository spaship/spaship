import { Injectable } from "@nestjs/common";
import { Property } from "../../core/entities";
import { IDataServices } from "../../core/abstracts";
import { PropertyFactoryService } from "./property.factory";
import { CreatePropertyDto } from "src/server/property/property.dto";

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

import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/repository/data-services.abstract';
import { ExceptionsService } from 'src/server/exceptions/service';
import { DocumentationDto } from '../dto';
import { Documentation } from '../entity';
import { DocumentationFactory } from './factory';

@Injectable()
export class DocumentationService {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly exceptionService: ExceptionsService,
    private readonly documentFactory: DocumentationFactory
  ) {}

  // @internal get the list for all the Document
  async getDocumentations() {
    const documents = await this.dataServices.documentation.getAll();
    const response = documents.reduce((acc, obj) => {
      const key = obj.section;
      const group = acc[key] ?? [];
      return { ...acc, [key]: [...group, obj] };
    }, {});
    return response;
  }

  /* @internal
   * This will create the Document
   * Save the details related to the Document
   */
  async createDocumentation(createDocumentationDto: DocumentationDto): Promise<Documentation> {
    const document = this.documentFactory.createNewDocument(createDocumentationDto);
    return this.dataServices.documentation.create(document);
  }

  /* @internal
   * Update the existing Document
   * Provision for updating the Document
   */
  async updateDocumentation(updateDocumentationDto: DocumentationDto) {
    try {
      const updateDocument = (await this.dataServices.documentation.getByAny({ _id: updateDocumentationDto.id }))[0];
      updateDocument.title = updateDocumentationDto.title;
      updateDocument.link = updateDocumentationDto.link;
      updateDocument.section = updateDocumentationDto.section;
      updateDocument.isVideo = updateDocumentationDto.isVideo;
      await this.dataServices.documentation.updateOne({ _id: updateDocumentationDto.id }, updateDocument);
      return updateDocument;
    } catch (e) {
      return this.exceptionService.badRequestException({ message: `Document doesn't exist.` });
    }
  }

  // @internal Delete the Documentation from the records
  async deleteDocumentation(id: string): Promise<Documentation> {
    const doc = await this.dataServices.documentation.getByAny({ _id: id });
    if (doc.length === 0) this.exceptionService.badRequestException({ message: `Document doesn't exist.` });
    const response = await this.dataServices.documentation.delete({ _id: id });
    return response;
  }
}

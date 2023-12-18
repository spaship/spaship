import { Injectable } from '@nestjs/common';
import { DocumentationDto } from '../dto';
import { Documentation } from '../entity';

@Injectable()
export class DocumentationFactory {
  createNewDocument(createDocumentationDto: DocumentationDto): Documentation {
    const document = new Documentation();
    document.link = createDocumentationDto.link;
    document.title = createDocumentationDto.title;
    document.tags = createDocumentationDto.tags;
    document.section = createDocumentationDto.section;
    document.isVideo = createDocumentationDto.isVideo;
    document.createdBy = createDocumentationDto.createdBy;
    document.updatedBy = createDocumentationDto.createdBy;
    return document;
  }
}

import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/server/auth/guard';
import { DeleteDocumentDTO, DocumentationDto } from './dto';
import { Documentation } from './entity';
import { DocumentationService } from './service';

@Controller('documentation')
@ApiTags('Documentation')
@UseGuards(AuthenticationGuard)
export class DocumentationController {
  constructor(private readonly documentService: DocumentationService) {}

  @Get()
  @ApiOperation({ description: 'Get the Documentation Details.' })
  async getById() {
    return this.documentService.getDocumentations();
  }

  @Post()
  @ApiOperation({ description: 'Create a Document.' })
  async createProperty(@Body() document: DocumentationDto): Promise<Documentation> {
    return this.documentService.createDocumentation(document);
  }

  @Put()
  @ApiOperation({ description: 'Update the Documentation.' })
  async update(@Body() document: DocumentationDto) {
    return this.documentService.updateDocumentation(document);
  }

  @Delete()
  @ApiOperation({ description: 'Delete a Document.' })
  async deleteDocumentation(@Body() document: DeleteDocumentDTO): Promise<Documentation> {
    return this.documentService.deleteDocumentation(document.id);
  }
}

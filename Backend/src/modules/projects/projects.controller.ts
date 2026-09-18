import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProjectDto } from './dtos/create-project.dto';
import { CreateUnitDto } from './dtos/create-unit.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { ProjectsService } from './projects.service';
import { Roles } from '../../common/auth/roles.decorator';
import { RolesGuard } from '../../common/auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { ProjectPhoto } from './entities/project-photo.entity';
import { CreateBuildingDto } from './dtos/create-building.dto';
import { ProjectStorageService } from './project-storage.service';

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.VIEWER)
@ApiBearerAuth()
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly projectStorage: ProjectStorageService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List projects with units' })
  findProjects() { return this.projectsService.findProjects(); }

  @Get('options')
  @ApiOperation({ summary: 'List lightweight project options for forms' })
  findProjectOptions() { return this.projectsService.findProjectOptions(); }

  @Get('buildings')
  findBuildings(@Query('projectId') projectId?: string) { return this.projectsService.findBuildings(projectId); }

  @Post('buildings')
  createBuilding(@Body() dto: CreateBuildingDto) { return this.projectsService.createBuilding(dto); }

  @Patch('buildings/:id')
  updateBuilding(@Param('id') id: string, @Body() dto: Partial<CreateBuildingDto>) { return this.projectsService.updateBuilding(id, dto); }

  @Delete('buildings/:id')
  deleteBuilding(@Param('id') id: string) { return this.projectsService.deleteBuilding(id); }

  @Post()
  @ApiOperation({ summary: 'Create project' })
  createProject(@Body() dto: CreateProjectDto) { return this.projectsService.createProject(dto); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project' })
  updateProject(@Param('id') id: string, @Body() dto: UpdateProjectDto) { return this.projectsService.updateProject(id, dto); }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project without units' })
  deleteProject(@Param('id') id: string) { return this.projectsService.deleteProject(id); }

  @Get('units')
  @ApiOperation({ summary: 'List units, optionally by project' })
  findUnits(@Query('projectId') projectId?: string) { return this.projectsService.findUnits(projectId); }

  @Post('units')
  @ApiOperation({ summary: 'Create project unit' })
  createUnit(@Body() dto: CreateUnitDto) { return this.projectsService.createUnit(dto); }

  @Post('units/bulk')
  @ApiOperation({ summary: 'Bulk create project units' })
  bulkCreateUnits(@Body() dto: { projectId: string; fromFloor: number; toFloor: number; unitsPerFloor: number; defaultSize: number; defaultPricePerSft: number; defaultParkingPrice: number; defaultUtilityCharges: number; defaultOwnership?: string; defaultStatus?: string }) {
    return this.projectsService.bulkCreateUnits(dto);
  }

  @Get('parking/available')
  @ApiOperation({ summary: 'List available parking units for a project' })
  findAvailableParking(@Query('projectId') projectId: string) {
    if (!projectId) throw new BadRequestException('projectId is required');
    return this.projectsService.findAvailableParking(projectId);
  }

  @Patch('units/:id')
  @ApiOperation({ summary: 'Update project unit' })
  updateUnit(@Param('id') id: string, @Body() dto: Partial<CreateUnitDto>) { return this.projectsService.updateUnit(id, dto); }

  @Delete('units/:id')
  @ApiOperation({ summary: 'Delete project unit without sales dependencies' })
  deleteUnit(@Param('id') id: string) { return this.projectsService.deleteUnit(id); }

  @Get('land-parcels')
  findLandParcels() { return this.projectsService.findLandParcels(); }

  @Get('utilities/connections')
  findUtilities(@Query('projectId') projectId?: string) { return this.projectsService.findUtilities(projectId); }

  @Get('utilities/bills')
  findUtilityBills() { return this.projectsService.findUtilityBills(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get project details' })
  findProject(@Param('id') id: string) { return this.projectsService.findProject(id); }

  @Get(':id/financial-summary')
  @ApiOperation({ summary: 'Get project revenue, collections, costs and margin summary' })
  financialSummary(@Param('id') id: string) { return this.projectsService.getFinancialSummary(id); }

  @Get(':id/milestones')
  findMilestones(@Param('id') id: string) { return this.projectsService.findMilestones(id); }

  @Post(':id/milestones')
  createMilestone(@Param('id') id: string, @Body() dto: { title: string; targetDate: string; progress?: number; status?: string; notes?: string }) {
    return this.projectsService.createMilestone(id, dto);
  }

  @Patch('milestones/:milestoneId')
  updateMilestone(@Param('milestoneId') milestoneId: string, @Body() dto: Partial<{ title: string; targetDate: string; completedDate: string; progress: number; status: string; notes: string }>) {
    return this.projectsService.updateMilestone(milestoneId, dto);
  }

  @Get(':id/documents')
  findDocuments(@Param('id') id: string) { return this.projectsService.findDocuments(id); }

  @Post(':id/documents')
  createDocument(@Param('id') id: string, @Body() dto: { title: string; documentType: string; fileUrl: string }) {
    return this.projectsService.createDocument(id, dto);
  }

  @Post(':id/documents/upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_request, file, callback) => {
      const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      callback(null, allowed.includes(file.mimetype));
    },
  }))
  async uploadDocument(
    @Param('id') id: string,
    @UploadedFile() file: { originalname: string; mimetype: string; buffer: Buffer },
    @Body() dto: { title: string; documentType: string },
  ) {
    if (!file) throw new BadRequestException('A supported document file is required');
    if (this.projectStorage.isConfigured()) {
      const filename = `${randomUUID()}${extname(file.originalname).toLowerCase()}`;
      const stored = await this.projectStorage.upload(id, 'documents', filename, file);
      return this.projectsService.createDocument(id, {
        title: dto.title || file.originalname,
        documentType: dto.documentType || 'OTHER',
        fileUrl: stored.fileUrl,
      });
    }

    const uploadDirectory = join(process.cwd(), 'uploads', 'projects', id);
    if (!existsSync(uploadDirectory)) return mkdir(uploadDirectory, { recursive: true }).then(() => this.persistUploadedDocument(id, file, dto, uploadDirectory));
    return this.persistUploadedDocument(id, file, dto, uploadDirectory);
  }

  @Get(':id/documents/:documentId/download')
  async downloadDocument(@Param('id') projectId: string, @Param('documentId') documentId: string, @Res() response: Response) {
    const document = await this.projectsService.findDocument(projectId, documentId);
    const file = await this.projectStorage.download(document.fileUrl);
    response.setHeader('Content-Type', file.contentType);
    response.setHeader('Content-Disposition', `attachment; filename="${basename(document.fileUrl)}"`);
    if (!file.stream) throw new BadRequestException('Document stream is unavailable');
    return file.stream.pipe(response);
  }

  @Delete(':id/documents/:documentId')
  deleteDocument(@Param('id') projectId: string, @Param('documentId') documentId: string) {
    return this.projectsService.deleteDocument(projectId, documentId);
  }

  @Get(':id/photos')
  findPhotos(@Param('id') id: string) { return this.projectsService.findPhotos(id); }

  @Post(':id/photos/upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_request, file, callback) => {
      const allowed = ['image/jpeg', 'image/png', 'image/webp'];
      callback(null, allowed.includes(file.mimetype));
    },
  }))
  async uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: { originalname: string; mimetype: string; buffer: Buffer },
    @Body() dto: { title: string },
  ) {
    if (!file) throw new BadRequestException('An image file is required');
    if (this.projectStorage.isConfigured()) {
      const filename = `${randomUUID()}${extname(file.originalname).toLowerCase()}`;
      const stored = await this.projectStorage.upload(id, 'photos', filename, file);
      return this.projectsService.createPhoto(id, {
        title: dto.title || file.originalname,
        fileUrl: stored.fileUrl,
        fileType: file.mimetype,
      });
    }

    const uploadDirectory = join(process.cwd(), 'uploads', 'projects', id, 'photos');
    if (!existsSync(uploadDirectory)) return mkdir(uploadDirectory, { recursive: true }).then(() => this.persistUploadedPhoto(id, file, dto, uploadDirectory));
    return this.persistUploadedPhoto(id, file, dto, uploadDirectory);
  }

  @Delete(':id/photos/:photoId')
  deletePhoto(@Param('id') projectId: string, @Param('photoId') photoId: string) {
    return this.projectsService.deletePhoto(projectId, photoId);
  }

  @Get(':id/photos/:photoId/download')
  async downloadPhoto(@Param('id') projectId: string, @Param('photoId') photoId: string, @Res() response: Response) {
    const photo = await this.projectsService.findPhoto(projectId, photoId);
    const file = await this.projectStorage.download(photo.fileUrl);
    response.setHeader('Content-Type', file.contentType || photo.fileType);
    response.setHeader('Content-Disposition', `inline; filename="${basename(photo.fileUrl)}"`);
    if (!file.stream) throw new BadRequestException('Photo stream is unavailable');
    return file.stream.pipe(response);
  }

  private persistUploadedPhoto(id: string, file: { originalname: string; mimetype: string; buffer: Buffer }, dto: { title: string }, directory: string) {
    const filename = `${randomUUID()}${extname(file.originalname).toLowerCase()}`;
    const target = join(directory, filename);
    return writeFile(target, file.buffer).then(() =>
      this.projectsService.createPhoto(id, {
        title: dto.title || file.originalname,
        fileUrl: `uploads/projects/${id}/photos/${filename}`,
        fileType: file.mimetype,
      }),
    );
  }

  private persistUploadedDocument(id: string, file: { originalname: string; mimetype: string; buffer: Buffer }, dto: { title: string; documentType: string }, directory: string) {
    const filename = `${randomUUID()}${extname(file.originalname).toLowerCase()}`;
    const target = join(directory, filename);
    return writeFile(target, file.buffer).then(() =>
      this.projectsService.createDocument(id, {
        title: dto.title || file.originalname,
        documentType: dto.documentType || 'OTHER',
        fileUrl: `uploads/projects/${id}/${filename}`,
      }),
    );
  }

  @Post('land-parcels')
  createLandParcel(@Body() dto: any) { return this.projectsService.createLandParcel(dto); }

  @Patch('land-parcels/:id')
  updateLandParcel(@Param('id') id: string, @Body() dto: any) { return this.projectsService.updateLandParcel(id, dto); }

  @Post('utilities/connections')
  createUtility(@Body() dto: any) { return this.projectsService.createUtility(dto); }

  @Post('utilities/bills')
  createUtilityBill(@Body() dto: any) { return this.projectsService.createUtilityBill(dto); }

  @Patch('utilities/bills/:id/pay')
  payUtilityBill(@Param('id') id: string, @Body() dto: { amount: number; paymentDate?: string }) {
    return this.projectsService.payUtilityBill(id, Number(dto.amount), dto.paymentDate);
  }
}
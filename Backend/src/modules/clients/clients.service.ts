import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client, ClientStatus, PaymentStatus } from './entities/client.entity';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';
import { Sale, SaleStatus } from '../sales/entities/sale.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const duplicate = await this.clientsRepository
      .createQueryBuilder('client')
      .where('client.phone = :phone', { phone: createClientDto.phone })
      .orWhere(createClientDto.email ? 'client.email = :email' : '1 = 0', { email: createClientDto.email })
      .getOne();
    if (duplicate) {
      throw new ConflictException('A client with this phone or email already exists');
    }
    const client = this.clientsRepository.create({
      ...createClientDto,
      clientId: createClientDto.clientId || await this.nextClientId(),
    });
    return this.clientsRepository.save(client);
  }

  async checkDuplicate(phone?: string, email?: string) {
    const query = this.clientsRepository.createQueryBuilder('client');
    if (phone) query.orWhere('client.phone = :phone', { phone });
    if (email) query.orWhere('client.email = :email', { email });
    const client = await query.getOne();
    return { duplicate: Boolean(client), clientId: client?.clientId ?? null };
  }

  async findAll(): Promise<Client[]> {
    const clients = await this.clientsRepository.find();
    const sales = await this.salesRepository.find({
      where: [
        { status: SaleStatus.PENDING },
        { status: SaleStatus.CONFIRMED },
        { status: SaleStatus.IN_PROGRESS },
        { status: SaleStatus.COMPLETED },
      ],
      order: { createdAt: 'DESC' },
    });
    const saleByClientId = new Map<string, Sale>();
    for (const sale of sales) {
      if (!saleByClientId.has(sale.clientId)) saleByClientId.set(sale.clientId, sale);
    }

    return clients.map((client) => {
      const sale = saleByClientId.get(client.id);
      return {
        ...client,
        project: sale?.projectName || client.project,
        projectId: sale?.projectId || client.projectId,
        unitId: sale?.unitId || client.unitId,
      };
    });
  }

  async findById(id: string): Promise<Client> {
    const client = await this.clientsRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async findByClientId(clientId: string): Promise<Client | null> {
    return this.clientsRepository.findOne({ where: { clientId } });
  }

  async findByStatus(status: ClientStatus): Promise<Client[]> {
    return this.clientsRepository.find({ where: { status } });
  }

  async findByPaymentStatus(paymentStatus: PaymentStatus): Promise<Client[]> {
    return this.clientsRepository.find({ where: { paymentStatus } });
  }

  async findByProject(project: string): Promise<Client[]> {
    return this.clientsRepository.find({ where: { project } });
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findById(id);
    Object.assign(client, updateClientDto);
    return this.clientsRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findById(id);
    await this.clientsRepository.remove(client);
  }

  async searchClients(query: string): Promise<Client[]> {
    return this.clientsRepository
      .createQueryBuilder('client')
      .where('client.clientName LIKE :query', { query: `%${query}%` })
      .orWhere('client.clientId LIKE :query', { query: `%${query}%` })
      .orWhere('client.phone LIKE :query', { query: `%${query}%` })
      .orWhere('client.email LIKE :query', { query: `%${query}%` })
      .getMany();
  }

  private async nextClientId() {
    const count = await this.clientsRepository.count();
    return `CL-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Sale } from '../sales/entities/sale.entity';
import { Project } from '../projects/entities/project.entity';
import { Unit, UnitStatus } from '../projects/entities/unit.entity';
import { Vendor } from '../procurement/entities/vendor.entity';
import { VendorBill } from '../procurement/entities/vendor-bill.entity';
import { Roles } from '../../common/auth/roles.decorator';
import { RolesGuard } from '../../common/auth/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.ACCOUNTING_MANAGER, UserRole.ACCOUNTANT, UserRole.VIEWER)
@Controller('reports')
export class ReportsController {
  constructor(
    @InjectRepository(Sale) private readonly salesRepository: Repository<Sale>,
    @InjectRepository(Project) private readonly projectsRepository: Repository<Project>,
    @InjectRepository(Unit) private readonly unitsRepository: Repository<Unit>,
    @InjectRepository(Vendor) private readonly vendorsRepository: Repository<Vendor>,
    @InjectRepository(VendorBill) private readonly vendorBillsRepository: Repository<VendorBill>,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get live dashboard aggregates' })
  async dashboard() {
    const [sales, projects, units, vendors, vendorBills] = await Promise.all([
      this.salesRepository.find({ order: { createdAt: 'DESC' }, take: 50 }),
      this.projectsRepository.find({ order: { updatedAt: 'DESC' }, take: 10 }),
      this.unitsRepository.find(),
      this.vendorsRepository.find(),
      this.vendorBillsRepository.find({ order: { createdAt: 'DESC' }, take: 50 }),
    ]);

    const revenue = sales.reduce((sum, sale) => sum + Number(sale.totalPrice || 0), 0);
    const collected = sales.reduce((sum, sale) => sum + Number(sale.amountPaid || 0), 0);
    const expenses = vendorBills.reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
    const paidExpenses = vendorBills.reduce((sum, bill) => sum + Number(bill.paidAmount || 0), 0);

    return {
      kpis: {
        revenue,
        expenses,
        netProfit: revenue - expenses,
        cashInflow: collected,
        knownCashOutflow: paidExpenses,
        cashBalanceEstimate: collected - paidExpenses,
        receivables: sales.reduce((sum, sale) => sum + Number(sale.balanceDue || 0), 0),
        payables: vendorBills.reduce((sum, bill) => sum + Number(bill.amount || 0) - Number(bill.paidAmount || 0), 0),
      },
      counts: {
        sales: sales.length,
        projects: projects.length,
        units: units.length,
        availableUnits: units.filter((unit) => unit.status === UnitStatus.AVAILABLE).length,
        vendors: vendors.length,
        pendingVendorBills: vendorBills.filter((bill) => bill.status !== 'PAID').length,
      },
      recentVouchers: sales.slice(0, 5).map((sale) => ({
        ref: sale.saleId,
        description: `Sale booking - ${sale.projectName || sale.projectId}`,
        date: sale.createdAt,
        status: sale.status.toUpperCase(),
        amount: Number(sale.totalPrice || 0),
      })),
      projectProgress: projects.slice(0, 5).map((project) => {
        const projectUnits = units.filter((unit) => unit.projectId === project.id);
        const soldUnits = projectUnits.filter((unit) => unit.status === UnitStatus.SOLD || unit.status === UnitStatus.BOOKED).length;
        return {
          name: project.projectName,
          type: project.projectType,
          units: soldUnits,
          totalUnits: projectUnits.length || project.totalUnits,
          progress: Number(project.constructionProgress || 0),
        };
      }),
    };
  }

  @Get('sales')
  @ApiOperation({ summary: 'Get live sales report aggregates' })
  async salesReport() {
    const sales = await this.salesRepository.find({ order: { createdAt: 'DESC' } });
    const byProject = sales.reduce<Record<string, { project: string; units: number; revenue: number }>>((groups, sale) => {
      const key = sale.projectName || sale.projectId;
      const group = groups[key] ?? { project: key, units: 0, revenue: 0 };
      group.units += 1;
      group.revenue += Number(sale.totalPrice || 0);
      groups[key] = group;
      return groups;
    }, {});
    return {
      totals: {
        sales: sales.length,
        revenue: sales.reduce((sum, sale) => sum + Number(sale.totalPrice || 0), 0),
        collected: sales.reduce((sum, sale) => sum + Number(sale.amountPaid || 0), 0),
        outstanding: sales.reduce((sum, sale) => sum + Number(sale.balanceDue || 0), 0),
      },
      byProject: Object.values(byProject),
      recent: sales.slice(0, 50),
    };
  }
}

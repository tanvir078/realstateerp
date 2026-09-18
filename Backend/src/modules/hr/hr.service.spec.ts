import { HrService } from './hr.service';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';

describe('HrService payroll accounting', () => {
  it('posts approved payroll into accounting ledger and marks it as posted', async () => {
    const payrollRepo = {
      findOne: jest.fn().mockResolvedValue({
        id: 'payroll-1',
        status: 'APPROVED',
        netPayable: 125000,
        paidAmount: 0,
      }),
      save: jest.fn().mockImplementation((run) => Promise.resolve(run)),
    };

    const manager = {
      findOne: jest.fn().mockResolvedValue({
        id: 'payroll-1',
        status: 'APPROVED',
        netPayable: 125000,
        paidAmount: 0,
      }),
      create: jest.fn().mockImplementation((entity, data) => ({ ...data })),
      save: jest.fn().mockImplementation((obj) => Promise.resolve(obj)),
    };

    const service = new HrService(
      {} as any,
      {} as any,
      payrollRepo as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      { transaction: jest.fn().mockImplementation(async (fn) => fn(manager)) } as any,
      {} as any,
      {} as any,
    );

    const result = await service.postPayroll('payroll-1');

    expect(result.payroll.status).toBe('POSTED');
    expect(result.ledger.referenceType).toBe('PAYROLL_POST');
    expect(result.ledger.amount).toBe(125000);
  });

  it('rejects salary payment above outstanding payroll balance', async () => {
    const payrollRepo = {
      findOne: jest.fn().mockResolvedValue({
        id: 'payroll-2',
        status: 'POSTED',
        netPayable: 100000,
        paidAmount: 25000,
      }),
    };

    const manager = {
      findOne: jest.fn().mockResolvedValue({
        id: 'payroll-2',
        status: 'POSTED',
        netPayable: 100000,
        paidAmount: 25000,
      }),
      create: jest.fn().mockImplementation((entity, data) => ({ ...data })),
      save: jest.fn().mockImplementation((obj) => Promise.resolve(obj)),
    };

    const service = new HrService(
      {} as any,
      {} as any,
      payrollRepo as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      { transaction: jest.fn().mockImplementation(async (fn) => fn(manager)) } as any,
      {} as any,
      {} as any,
    );

    await expect(
      service.payPayroll('payroll-2', { amount: 80000, paymentDate: '2026-09-10', paymentMethod: 'Bank Transfer' }),
    ).rejects.toThrow(UnprocessableEntityException);
  });
});

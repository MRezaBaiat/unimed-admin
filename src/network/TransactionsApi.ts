import Gateway, { ResponseType } from './Gateway';
import { FinancialAudit, QueryResponse, ServerConfig, Transaction, Visit } from 'api';

export default class TransactionsApi {
  public static sendTransaction (userId: string, transaction: Partial<Transaction>): ResponseType<void> {
    return Gateway.post(`/api/admin/transactions?id=${userId}`, transaction);
  }

  public static getFinancialAudit (userId: string, type:'user' | 'healthcenter', fromDate:number, toDate:number): ResponseType<FinancialAudit> {
    return Gateway.get(`/api/admin/transactions/audit?id=${userId}&type=${type}&fromDate=${fromDate}&toDate=${toDate}`);
  }

  public static getTransactions (userId: string, type:'user' | 'healthcenter', skip: number, limit: number, search: string, fromDate: number, toDate:number): ResponseType<QueryResponse<Transaction>> {
    return Gateway.get(`/api/admin/transactions/query?id=${userId}&type=${type}&skip=${skip}&limit=${limit}&search=${search}&fromDate=${fromDate}&toDate=${toDate}`);
  }

  public static getTransaction (transactionId: string): ResponseType<Transaction> {
    return Gateway.get(`/api/admin/transactions?id=${transactionId}`);
  }

  public static getAccountings (skip:number, limit:number, search:string, fromDate:number, toDate:number, type:'user' | 'healthcenter'): ResponseType<QueryResponse<{_id:string, name: string, payable:number}>> {
    return Gateway.get(`/api/admin/transactions/accounting/query?skip=${skip}&limit=${limit}&search=${search}&fromDate=${fromDate}&toDate=${toDate}&type=${type}`);
  }

  public static getReports (skip:number, limit:number, search:string, fromDate:number, toDate:number, type:'user' | 'healthcenter'): ResponseType<QueryResponse<{_id:string, name:string, total: number, totalVisits:number, visits: Visit[]}>> {
    return Gateway.get(`/api/admin/transactions/report/query?skip=${skip}&limit=${limit}&search=${search}&fromDate=${fromDate}&toDate=${toDate}&type=${type}`);
  }

  public static verifyUnverifiedTransactions ():ResponseType<any> {
    return Gateway.get('/api/admin/transactions/verify-transactions');
  }

  public static postSettlement (visitIds: string[], targetId: string, type, amount:number, details:string, trackingCode:string) {
    return Gateway.post('/api/admin/transactions/settle', {
      visitIds,
      amount,
      targetId,
      type,
      details,
      trackingCode
    });
  }
}

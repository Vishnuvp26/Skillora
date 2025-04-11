import { Request, Response, NextFunction } from 'express';
import { IContract } from '../../../models/client/contractModel';

export interface IContractController {
    createContract(req: Request, res: Response, next: NextFunction): Promise<void>;
    getClientContracts(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancelContract(req: Request, res: Response, next: NextFunction): Promise<void>;
    isContractExist(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllContractsForAdmin(req: Request, res: Response, next: NextFunction): Promise<void>;
    requestFundRelease(req: Request, res: Response, next: NextFunction): Promise<void>;
};
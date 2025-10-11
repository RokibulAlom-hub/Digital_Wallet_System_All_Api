import { Types } from "mongoose";

export enum PayStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
      REVERSED = "REVERSED",
}

export enum InitiatedBy {
    USER = 'USER',
    AGENT = 'AGENT'
}

export  enum PayType {
    ADD_MONEY = 'ADD_MONEY',
    WITHDRAWN = 'WITHDRAWN',
    SEND_MONEY = 'SEND_MONEY'
}

export interface ITransaction {
    type: PayType;
    amount : number;
    senderId?:Types.ObjectId;
    receiverId?:Types.ObjectId;
    walletId:Types.ObjectId;
    wallet: Types.ObjectId;
    initiateBy:InitiatedBy;
    fee?:number;
    commission:number;
    status:PayStatus
}
import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.routes";
import walletRoutes from "../modules/wallet/wallet.routes";
import transactionRoutes from "../modules/transaction/transaction.route";

export const router = Router()

const moduleRoutes = [
    {
        path:"/user",
        route:userRoutes
    },
     {
        path: "/auth",
        route: AuthRoutes
    },{
        path:"/wallet",
        route:walletRoutes
    },
    {
        path:"/transaction",
        route:transactionRoutes
    }
    
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})
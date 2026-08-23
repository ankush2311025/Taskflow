import { Request , Response , NextFunction} from "express"
import { AppError } from "../utils/AppError.js"
import { findMembership } from "../modules/organization/organization.repository.js"

type OrgRole = 'org_admin' | 'member';

export const requireOrgRole = (...allowedRoles: OrgRole[]) => {
    return async (req : Request, res : Response, next: NextFunction) =>
    {
        const userId = req.userId;
        const orgId = req.params.orgId as string;

        if (!orgId){
            throw new AppError("Organization ID is requires", 400)
        }
        const membership = await findMembership(userId , orgId);

        if (!membership){
            throw new AppError("You are not member of this organization", 403)
        }
        if (!allowedRoles.includes(membership.role)){
            throw new AppError("You do not have permission", 403)
        }
        next()
    }
}
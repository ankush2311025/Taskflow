import {Request , Response} from "express"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { createOrganization, getOrganization, addOrganizationMember, updateOrg, deleteOrg } from "./organization.service.js"

export const getOrganizationController = asyncHandler(
    async (
        req: Request,
        res: Response) => {
        const organization = await getOrganization(
            req.userId,
            req.params.orgId as string,
        )
        res.status(200).json({
            success: true,
            data: organization
        })
    }
)

export const createOrganizationController = asyncHandler(
    async(req : Request, res: Response) => {
        const organization = await createOrganization(
            req.userId,
            req.body.name
        )
        res.status(201).json({
            success: true,
            data : organization
        })
    }
)
export const addMemberController = asyncHandler(
    async(req : Request, res: Response) => {
        const member = await addOrganizationMember(
            req.params.orgId as string,
            req.body.email
        )
        res.status(201).json({
            success: true,
            message: "Member added succefully",
            data : member
        })
    }
)
export const updateOrganizationController = asyncHandler(
  async (req: Request, res: Response) => {
    const organization = await updateOrg(
      req.params.orgId as string,
      req.body.name
    );

    res.status(200).json({
      success: true,
      data: organization,
    });
  }
);
export const deleteOrganizationController = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteOrg(
      req.params.orgId as string
    );

    res.status(204).send();
  }
);
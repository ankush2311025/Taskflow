import { AppError } from "../../utils/AppError.js";
import { findUserByEmail } from "../auth/auth.repository.js";
import {createOrg,findMembership,findOrganizationById, addMember, updateOrganization,deleteOrganization} from "./organization.repository.js";

export async function getOrganization(
    userId: string,
    orgId: string
){
    const membership = await findMembership(userId, orgId)

    if (!membership){
        throw new AppError("You are not member of this organization", 403)
    }

    const organization = await findOrganizationById(orgId)

    if (!organization){
        throw new AppError("Organization not found", 404)
    }
    return organization
}
export async function createOrganization(
  userId: string,
  name: string
) {
  return createOrg(userId, name);
}

export async function addOrganizationMember(
    orgId: string,
    email: string,
) {
    const user = await findUserByEmail(email);
    if (!user){
        throw new AppError("User not found",404)
    }
    const existingMembership = await findMembership(
        user.id,
        orgId
    )
    if (existingMembership){
        throw new AppError("User is already a member", 409)
    }
    return  addMember(user.id,orgId)
}
export async function updateOrg(
  orgId: string,
  name: string
) {
  const organization = await findOrganizationById(orgId);

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  return updateOrganization(orgId, name);
}
export async function deleteOrg(orgId: string) {
  const organization = await findOrganizationById(orgId);

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  return deleteOrganization(orgId);
}
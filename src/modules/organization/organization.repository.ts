import prisma from "../../config/prisma.js";

export async function findMembership(
    userId: string,
    orgId: string,
) {
    return prisma.orgMember.findUnique({
        where: {
            orgId_userId:{
                orgId, 
                userId
            }
        }
    })
}

export async function findOrganizationById(orgId: string){
    return prisma.organization.findUnique({
        where:{
            id: orgId,
        }
    })
}
export async function createOrg(
  userId: string,
  name: string
) {
  return prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        name,
      },
    });

    await tx.orgMember.create({
      data: {
        orgId: organization.id,
        userId,
        role: "org_admin",
      },
    });

    return organization;
  });
}

export async function addMember(
    userId: string,
    orgId: string
) {
    return prisma.orgMember.create({
        data:{
            userId,
            orgId,
            role: "member"
        }
    })
}
export async function updateOrganization(
  orgId: string,
  name: string
) {
  return prisma.organization.update({
    where: { id: orgId },
    data: { name },
  });
}
export async function deleteOrganization(orgId: string) {
  return prisma.organization.delete({
    where: { id: orgId },
  });
}
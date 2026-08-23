import prisma from "../../config/prisma.js";

export async function findUserByEmail(email: string){
    return prisma.user.findUnique({
        where: {
            email,
        }
    });
}
export async function createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
}){
    return prisma.user.create({
        data
    })
}
export async function createOrganization( 
    name: string
){
    return prisma.organization.create({
        data:{
            name,
        }
    })
}
export async function createMembership(
    orgId : string,
    userId: string,
    role : 'org_admin' | 'member',
){
    return prisma.orgMember.create({
        data: {
            orgId,
            userId,
            role ,
        }
    })
}

export async function createRegistration(data :{
    name: string;
    email: string;
    passwordHash: string;
    organizationName: string;
}){
    return prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash: data.passwordHash
            }
        })

        const organization = await tx.organization.create({
            data:{
                name: data.organizationName,
            }
        })

        const membership = await tx.orgMember.create({
            data:{
                orgId : organization.id,
                userId: user.id,
                role: 'org_admin'
            }
        })
        return {
            user,
            organization,
            membership,
        }
    })
}

export async function createRefreshToken(data: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}) {
  return prisma.refreshToken.create({
    data,
  });
}


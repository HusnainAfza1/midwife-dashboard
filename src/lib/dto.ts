import "server-only"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createUserDTO(user: any, isSelf = false) {
    const dto = {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
    }

    if (isSelf) {
        return {
            ...dto,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    }

    return dto
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createSalespersonDTO(salesperson: any) {
    return {
        id: salesperson._id.toString(),
        username: salesperson.username,
        email: salesperson.email,
        createdAt: salesperson.createdAt,
        updatedAt: salesperson.updatedAt,
    }
}


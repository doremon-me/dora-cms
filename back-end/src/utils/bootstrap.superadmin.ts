import { hash } from "bcrypt";
import { randomBytes } from "crypto";
import { Logger } from "@nestjs/common";

import { UsersService } from "@/modules/users/users.service";

export async function bootstrapSuperAdmin(usersService: UsersService) {
    const logger = new Logger();
    const superAdmin = await usersService.getUser({ role: "SUPER_ADMIN" });

    if (superAdmin) {
        logger.verbose("SUPER_ADMIN exists. Continuing normal startup...");
        return;
    }

    const password = randomBytes(12).toString('base64');
    const hashed = await hash(password, 10);

    const user = await usersService.createUser({ email: "aayu.r.2003@gmail.com", password: hashed, firstName: "Super", lastName: "Admin", role: "SUPER_ADMIN" });
    logger.log('🛡 SUPER_ADMIN account created:');
    logger.log(`📧 Email: ${user.email}`);
    logger.log(`🔑 Password: ${password}`);
}
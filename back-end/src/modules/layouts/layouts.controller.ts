import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import * as DashboardLayout from "@configurations/dashboard.layout.json";
import { GetUser, User } from '@/common/decorators/user.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';

@Controller('layouts')
export class LayoutsController {
    @UseGuards(AuthGuard)
    @Get('dashboard')
    dashboard(@GetUser() user: User, @Query('projectId') projectId: string) {
        console.log("Dashboard Layout requested for projectId:", projectId);
        if (user?.role === "SUPER_ADMIN") {
            return DashboardLayout;
        }
        return DashboardLayout;
    }
}

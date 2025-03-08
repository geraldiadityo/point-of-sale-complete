import { Controller, Get, HttpCode } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { WebModel } from "src/model/web.model";
import { DashboardResponse } from "./dto/dashboard.model";

@Controller('/api/dashboard')
export class DashboardController {
    constructor(
        private dashboardService: DashboardService
    ) {}

    @Get('/get-data-dashboard')
    @HttpCode(200)
    async getDataDashboard(): Promise<WebModel<DashboardResponse>> {
        const result = await this.dashboardService.getDataDashboard();

        return {
            data: result
        }
    }
}
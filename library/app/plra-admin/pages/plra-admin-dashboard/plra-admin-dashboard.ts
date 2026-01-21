import { Component, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "plra-admin-dashboard",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./plra-admin-dashboard.html",
  styleUrls: ["./plra-admin-dashboard.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlraAdminDashboard {}

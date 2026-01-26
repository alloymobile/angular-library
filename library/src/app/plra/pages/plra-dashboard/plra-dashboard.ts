import { Component, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "plra-dashboard",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./plra-dashboard.html",
  styleUrls: ["./plra-dashboard.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlraDashboard {}

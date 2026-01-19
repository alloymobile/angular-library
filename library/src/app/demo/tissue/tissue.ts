import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "demo-tissue",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./tissue.html",
  styleUrl: "./tissue.css",
})
export class DemoTissue {}

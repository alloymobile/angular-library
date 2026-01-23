import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "demo-organ",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./organ.html",
  styleUrl: "./organ.css",
})
export class DemoOrgan {}

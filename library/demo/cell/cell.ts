import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "demo-cell",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./cell.html",
  styleUrl: "./cell.css",
})
export class DemoCell {}

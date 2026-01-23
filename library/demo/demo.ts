import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "demo",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./demo.html",
  styleUrl: "./demo.css",
})
export class Demo {}

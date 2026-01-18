import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "demo-organ",
  standalone: true,
  imports: [RouterModule],
  template: `<router-outlet></router-outlet>`,
})
export class DemoOrgan {}

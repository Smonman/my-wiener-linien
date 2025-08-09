import { Injectable } from "@angular/core";
import { Line, LineType } from "../../models/line";

@Injectable({
  providedIn: "root"
})
export class LineService {
  public getLineFromName(name: string): Line {
    switch (name.toUpperCase()) {
      case "9":
        return { id: 109, name: "9", type: LineType.TRAM };
      case "42":
        return { id: 142, name: "42", type: LineType.TRAM };
      case "U6":
        return { id: 306, name: "U6", type: LineType.METRO };
      default:
        throw new Error("not implemented");
    }
  }
}

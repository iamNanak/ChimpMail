import { TEMPLATES } from "@/lib/templates";

export function GET() {
  return Response.json(TEMPLATES);
}

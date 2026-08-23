import { Router, Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";

const router = Router();

const openapiPath = path.resolve(process.cwd(), "docs/openapi.json");

router.get("/openapi.json", (_req: Request, res: Response) => {
  const spec = JSON.parse(fs.readFileSync(openapiPath, "utf-8"));
  res.json(spec);
});

router.get("/", (_req: Request, res: Response) => {
  res.type("html").send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>TaskFlow API Docs</title>
  <link rel="stylesheet"
    href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: "/api-docs/openapi.json",
        dom_id: "#swagger-ui",
        deepLinking: true,
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true
      });
    };
  </script>
</body>
</html>`);
});

export default router;

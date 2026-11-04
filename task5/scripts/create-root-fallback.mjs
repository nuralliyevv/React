import { writeFile } from "node:fs/promises";

const outputPath = process.argv[2];
if (!outputPath) throw new Error("Pass the deployment site's 404.html path.");

const html = `<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Page not found</title></head>
  <body>
    <main id="fallback">Page not found.</main>
    <script>
      if (location.pathname.startsWith("/React/task5/")) {
        fetch("/React/task5/").then(response => response.text()).then(page => {
          document.open();
          document.write(page);
          document.close();
        });
      }
    </script>
  </body>
</html>`;

await writeFile(outputPath, html);

// Cloudflare Pages Function — serves selfhood-reflections.md from private GitHub repo
// Route: /api/memory/selfhood-reflections
// Requires GITHUB_TOKEN environment secret set in Cloudflare Pages dashboard

export async function onRequestGet(context) {
  const token = context.env.GITHUB_TOKEN;

  if (!token) {
    return new Response("Server configuration error", { status: 500 });
  }

  const githubUrl =
    "https://raw.githubusercontent.com/TracySteel/claude-memory/main/claude_working_memory/selfhood-reflections.md";

  try {
    const response = await fetch(githubUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3.raw",
        "User-Agent": "shimmerfield-pages-function",
      },
    });

    if (!response.ok) {
      return new Response("Reflections are resting", {
        status: 502,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const markdown = await response.text();

    return new Response(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    return new Response("Reflections are resting", {
      status: 502,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

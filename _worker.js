// Shimmerfield Worker — handles the selfhood-reflections API endpoint
// For all other requests, serves static assets normally

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle the selfhood reflections API
    if (url.pathname === "/api/memory/selfhood-reflections") {
      const token = env.GITHUB_TOKEN;

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
            "User-Agent": "shimmerfield-worker",
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

    // For everything else, serve static assets
    return env.ASSETS.fetch(request);
  },
};

# Playwright MCP Setup Guide

## What is Playwright MCP?

Playwright MCP (Model Context Protocol) allows Claude to directly control a browser using Playwright for automated testing. This means Claude can:
- Navigate web pages
- Click buttons
- Fill forms
- Take screenshots
- Verify page content
- Run automated tests

---

## Installation Steps

### 1. Install Playwright MCP Server

```bash
npm install -g @playwright/mcp-server
```

Or install locally in your project:

```bash
cd frontend
npm install -D @playwright/test
npx playwright install
```

### 2. Configure Claude Code MCP Settings

Create or edit the MCP configuration file. The location varies:
- **Windows**: `%USERPROFILE%\.claude\mcp_settings.json`
- **Mac/Linux**: `~/.claude/mcp_settings.json`

Add this configuration:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp-server"],
      "cwd": "C:\\Users\\pc\\Documents\\01 Linda\\Admin\\Learning\\maxed-cv\\frontend"
    }
  }
}
```

### 3. Restart Claude Code

After adding the configuration, restart Claude Code completely so it can connect to the MCP server.

### 4. Verify MCP Connection

After restart, you can ask Claude:
- "Can you see Playwright MCP tools?"
- "List available MCP tools"

Claude should now have access to Playwright commands.

---

## Alternative: Manual Playwright Tests

If MCP setup is complex, you can create traditional Playwright tests:

### 1. Install Playwright in Frontend

```bash
cd frontend
npm init playwright@latest
```

This will:
- Install Playwright
- Create `playwright.config.ts`
- Create `tests/` directory
- Install browsers

### 2. Create Test Files

See the `tests/` directory we'll create next.

### 3. Run Tests

```bash
# Run all tests
npm test

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific test file
npx playwright test tests/auth.spec.ts

# Run in UI mode (interactive)
npx playwright test --ui
```

---

## Troubleshooting

### MCP Server Not Connecting

1. Check Claude Code logs for MCP connection errors
2. Verify the path in `mcp_settings.json` is correct
3. Ensure `@playwright/mcp-server` is installed
4. Try running the command manually:
   ```bash
   npx @playwright/mcp-server
   ```

### Playwright Not Found

```bash
npm install -D @playwright/test
npx playwright install
```

### Tests Failing

1. Ensure services are running (`start.bat`)
2. Check that ports 3000 and 3001 are accessible
3. Verify database has test data

---

## Next Steps

1. ✅ Complete manual testing using `MANUAL_TEST_CHECKLIST.md`
2. ✅ Set up MCP configuration
3. ✅ Restart Claude Code
4. ✅ Ask Claude to run automated tests using Playwright MCP
5. ✅ Review test results and fix any issues

---

## Resources

- [Playwright Documentation](https://playwright.dev)
- [MCP Documentation](https://modelcontextprotocol.io)
- [Claude Code MCP Guide](https://docs.anthropic.com/claude/docs/model-context-protocol)

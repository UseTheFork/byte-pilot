# Tool Catalog

This catalog describes the tools exposed in the authoring session. Availability can vary between sessions and agents. Confirm a tool is actually available before depending on it.

## Discover and Coordinate

| Tool                      | Use it for                                       | Selection notes                                                                                                  |
| ------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `tool_search`             | Discover deferred tool definitions               | Required before calling a deferred tool. Search once for a tool; do not search again after it has been returned. |
| `multi_tool_use.parallel` | Run independent developer-tool calls together    | Use only when the calls do not depend on one another.                                                            |
| `runSubagent`             | Delegate a bounded task to an available agent    | Do not delegate unless requested or required by applicable instructions/skills. Tool access differs by agent.    |
| `manage_todo_list`        | Track multi-step work                            | Keep status current; avoid for trivial tasks.                                                                    |
| `vscode_askQuestions`     | Ask the user a small set of structured questions | Use for needed non-secret choices; never request credentials or secrets.                                         |

## Workspace Files and Search

| Tool               | Use it for                                        | Selection notes                                                        |
| ------------------ | ------------------------------------------------- | ---------------------------------------------------------------------- |
| `list_dir`         | List one directory's children                     | Good for locating nearby files and folders.                            |
| `file_search`      | Find paths by glob                                | Search names and directory structure, not file contents.               |
| `grep_search`      | Search file contents by literal text or regex     | Use for exact names, strings, or patterns.                             |
| `semantic_search`  | Find relevant code or documentation by meaning    | Prefer when the exact identifier or wording is unknown.                |
| `read_file`        | Read a text file or a byte range of a binary file | Requires an explicit line or byte range.                               |
| `apply_patch`      | Add, update, or delete text-file content          | Use for manual edits; keep changes scoped.                             |
| `create_file`      | Create a new file                                 | It will not overwrite an existing file and creates parent directories. |
| `create_directory` | Create a directory tree                           | Not needed before `create_file`, which creates parent directories.     |
| `view_image`       | Inspect a supported image file                    | Use instead of treating image bytes as text.                           |

## Code Navigation and Diagnostics

| Tool                    | Use it for                                                   | Selection notes                                                                                |
| ----------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `get_errors`            | Retrieve compile, lint, or type errors                       | Check a touched file or folder, or omit paths for workspace-wide results.                      |
| `vscode_listCodeUsages` | Find definitions, references, or implementations of a symbol | Requires a real occurrence in a workspace file and a language reference provider.              |
| `vscode_renameSymbol`   | Rename a symbol through language-server references           | Prefer to textual replacement for code symbols; requires a real occurrence and rename support. |

## Terminal and Test Work

| Tool                    | Use it for                                           | Selection notes                                                                                  |
| ----------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `run_in_terminal`       | Run shell commands, tests, builds, and scripts       | Use synchronous mode for one-shot commands; async mode is for persistent servers/watchers.       |
| `send_to_terminal`      | Send input to a running terminal                     | Use for interactive prompts or an existing process, not as a replacement for starting a command. |
| `get_terminal_output`   | Read a command moved to background or awaiting input | Only call when the run result says it timed out, moved to background, or needs input.            |
| `kill_terminal`         | Stop a persistent terminal process                   | Use with the exact terminal ID.                                                                  |
| `terminal_last_command` | Inspect the last command in the active terminal      | Use when the user's terminal command is the subject of the task.                                 |
| `terminal_selection`    | Read the active terminal's selected text             | Use when the user has selected relevant terminal output.                                         |
| `testFailure`           | Get failure details from the most recent test run    | If no failure is recorded, run the relevant tests first.                                         |

## Web, GitHub, and Browser

| Tool                  | Use it for                                                       | Selection notes                                                                                                                                        |
| --------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `fetch_webpage`       | Retrieve the main content from a known URL                       | Use for reading a specific web page; it does not interact with controls.                                                                               |
| `github_repo`         | Find relevant source snippets in a named GitHub repository       | Use when the user clearly requests code from a specific repository; not for a repository open in the workspace.                                        |
| `github_text_search`  | Lexically search a GitHub repository or organization             | Use for exact strings, identifiers, or code patterns; this is not semantic search.                                                                     |
| `open_browser_page`   | Open a URL in the integrated browser                             | Reuse a suitable existing page when available; returns a page ID.                                                                                      |
| `navigate_page`       | Navigate, reload, or use browser history                         | Requires a browser page ID.                                                                                                                            |
| `read_page`           | Read the current browser page's accessible state                 | Prefer over a screenshot when choosing or inspecting page elements.                                                                                    |
| `click_element`       | Click a browser element                                          | Identify it by reference or selector and describe it.                                                                                                  |
| `type_in_page`        | Type text or press keys in a browser page                        | Can target an element or use the focused element.                                                                                                      |
| `hover_element`       | Hover over a browser element                                     | Use to reveal hover states or tooltips.                                                                                                                |
| `drag_element`        | Drag one browser element onto another                            | Requires source and target references or selectors.                                                                                                    |
| `handle_dialog`       | Accept/dismiss browser modals or select files in a chooser       | Use only for a pending dialog.                                                                                                                         |
| `screenshot_page`     | Capture a browser viewport or element                            | Visual evidence only; use `read_page` for state and element selection.                                                                                 |
| `run_playwright_code` | Perform browser automation not covered by the dedicated controls | Use only when other browser tools are insufficient. Access the page through the provided `page` object; do not access `document` or `window` directly. |

## Tasks, Artifacts, and Session History

| Tool                  | Use it for                                                                | Selection notes                                                                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `create_and_run_task` | Add and run a workspace shell task                                        | Intended for build/run/launch requests or explicit task creation; may create or update `.vscode/tasks.json`.                                                                                        |
| `get_task_output`     | Read output from a created task                                           | Requires task ID and workspace path.                                                                                                                                                                |
| `setArtifacts`        | Publish session artifacts such as plans, screenshots, or a dev-server URL | Replaces the entire artifact list; include all artifacts that should remain visible.                                                                                                                |
| `setArtifactRules`    | Change automatic artifact grouping rules                                  | Replaces session extraction rules.                                                                                                                                                                  |
| `session_store_sql`   | Search and analyze prior Copilot sessions                                 | Use for session history, past decisions, and related files; SQL is read-only. Tool identifiers can differ by runtime, so use the currently exposed name. Load the `chronicle` skill when available. |

## Choosing the Right Customization Skill

| Work item                                                                   | Load this skill                                                                                                  |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Create or debug a custom agent (`.agent.md`)                                | `creating-custom-agents`; use `agent-customization` for broader customization decisions                          |
| Create or revise a reusable prompt (`.prompt.md`)                           | `writing-prompt-files`                                                                                           |
| Create or edit a skill (`SKILL.md`)                                         | `writing-skills`, plus required `test-driven-development` and `verification-before-completion`                   |
| Create or revise workspace Copilot instructions                             | `writing-copilot-instructions`                                                                                   |
| Define product context, project structure, or technology/setup instructions | `creating-product-instructions`, `creating-structure-instructions`, or `creating-tech-instructions` respectively |

These names are skill references, not tools. Load their instructions with the available file-reading capability when applicable.

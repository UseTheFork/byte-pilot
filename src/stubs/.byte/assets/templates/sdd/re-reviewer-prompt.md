## The Task

Read the task brief: [BRIEF_FILE]

## The Findings Under Verification

[FINDINGS]

## The Fix

Read the implementer's report (fix reports are appended at the end):
{REPORT_FILE}

**Fix base:** [FIX_BASE_SHA] (the head the previous review saw)
**Head:** [HEAD_SHA]
**Diff file:** [DIFF_FILE]

Read the diff file once — it contains the fix commits, a stat summary,
and the fix diff with surrounding context. Do not re-run git commands.
If the diff file is missing, fetch the diff yourself:
`git diff --stat [FIX_BASE_SHA]..[HEAD_SHA]` and `git diff [FIX_BASE_SHA]..[HEAD_SHA]`.

Your review is read-only on this checkout. Do not mutate the working
tree, the index, HEAD, or branch state in any way.

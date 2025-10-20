# Testing GitHub Actions Workflows Locally with act

This guide explains how to test the repository's GitHub Actions workflows locally using [act](https://github.com/nektos/act).

## Installation

### macOS
```bash
brew install act
```

### Linux
```bash
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

### Windows
```bash
choco install act-cli
```

## Setup

1. **Install act** (see above)

2. **Create secrets file** (one-time setup):
   ```bash
   cp .github/act-secrets.example .github/act-secrets
   ```

3. **Fill in your secrets** in `.github/act-secrets`:
   - `GITHUB_TOKEN`: Your GitHub Personal Access Token
   - Other secrets as needed for specific workflows

4. **Configuration**: The `.actrc` file is already configured with:
   - Docker image to use
   - Secrets file location
   - Verbose output
   - Environment variable support

## Testing Workflows

### Frontend CI Workflow
Test linting, formatting, and building:
```bash
act pull_request -W .github/workflows/frontend-ci.yml
```

### Django/Python Workflow
Test Python linting and formatting:
```bash
act pull_request -W .github/workflows/music-microservice.yml
```

### Go Backend Workflow
Test Go formatting, vetting, and tests:
```bash
act pull_request -W .github/workflows/backend-go-ci.yml
```

### Test Specific Job
```bash
act pull_request -W .github/workflows/frontend-ci.yml -j frontend-checks
```

### List Available Workflows
```bash
act -l
```

## Common Options

- `-n` or `--dryrun`: Don't actually run, just show what would run
- `-v` or `--verbose`: Verbose output (already in .actrc)
- `--pull=false`: Don't pull Docker image (use cached)
- `--container-architecture linux/amd64`: Specify architecture

## Troubleshooting

### Workflow doesn't trigger
Make sure you're using the right event type:
- `act pull_request` for PR workflows
- `act push` for push workflows
- `act issues` for issue workflows

### Missing secrets
Check that `.github/act-secrets` exists and contains required secrets.

### Docker issues
Act runs workflows in Docker containers. Ensure Docker is running:
```bash
docker ps
```

### Path filters not working
act may not perfectly replicate GitHub's path filtering. To test path filters:
```bash
# Trigger workflow manually
act pull_request -W .github/workflows/frontend-ci.yml --eventpath .github/test-events/frontend-change.json
```

## Performance Tips

1. **Use cached Docker images**: Add `--pull=false` after first run
2. **Test specific jobs**: Use `-j <job-name>` to run only what you need
3. **Dry run first**: Use `-n` to verify workflow would trigger
4. **Reuse containers**: act reuses containers when possible

## Example: Testing a Frontend Change

```bash
# 1. Make changes to frontend code
vim frontend/src/App.tsx

# 2. Test if workflow would run (dry run)
act pull_request -n -W .github/workflows/frontend-ci.yml

# 3. Actually run the workflow
act pull_request -W .github/workflows/frontend-ci.yml

# 4. Check if formatting would pass
act pull_request -W .github/workflows/frontend-ci.yml -j frontend-checks
```

## CI/CD Workflow Optimizations

Our workflows are optimized with:
- **Path filtering**: Workflows only run when relevant files change
- **Dependency caching**: npm, pip, and Go module caches reduce install time
- **Concurrency groups**: Auto-cancel outdated workflow runs
- **Fail-fast**: Formatting/linting must pass before building

## Further Reading

- [act Documentation](https://github.com/nektos/act)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)

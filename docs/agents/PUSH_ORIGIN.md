# Push to origin (ANGUELdad/paidia)

Cloud Agents and local `gh` often use the **anguel0z** GitHub account. That account **cannot** push to `https://github.com/ANGUELdad/paidia.git` (403).

Before any `git push` / `git push -u origin …` to **origin**:

```bash
gh auth switch --user ANGUELdad
git push -u origin HEAD
gh auth switch --user anguel0z   # optional: restore default
```

Alternative: push to `fork` (`anguel0z/paidia`) and open a PR into `ANGUELdad/paidia`.

Never use anguel0z credentials against ANGUELdad/paidia origin.
